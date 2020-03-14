/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef, Suspense, ReactNode } from "react"
import {
  Canvas,
  useFrame,
  ReactThreeFiber,
  extend,
  useThree,
  useLoader,
} from "react-three-fiber"
import { Mesh, Euler, Vector3, DoubleSide, Color, Shape } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader"
import StarSVG from "../../assets/Star.svg"
extend({ OrbitControls })

function CustomShape({ shape, index }: { shape: Shape; index: number }) {
  return (
    <mesh position={[0, 0, index]}>
      <shapeBufferGeometry attach="geometry" args={[shape]} />
      <meshBasicMaterial attach="material" color="white" side={DoubleSide} />
    </mesh>
  )
}

/**
 * svg loader
 */
function Star() {
  const scale = 0.05
  const star = useLoader(SVGLoader, StarSVG)
  console.log(star)
  return (
    <group
      position={[
        ((star.xml as any).attributes.width.value / 2) * -scale,
        ((star.xml as any).attributes.height.value / 2) * -scale,
        15,
      ]}
      scale={[scale, scale, scale]}
    >
      {star.paths
        .flatMap(path => path.toShapes(false))
        .map((shape, i) => (
          <CustomShape key={i} shape={shape} index={i} />
        ))}
    </group>
  )
}

/**
 * One transparent side, different material per side
 */
function OpenBox() {
  return (
    <mesh receiveShadow position={[0, 0, 10]}>
      <boxBufferGeometry attach="geometry" args={[12, 25, 25]} />
      <meshPhongMaterial attachArray="material" color="red" side={DoubleSide} />
      <meshPhongMaterial attachArray="material" color="red" side={DoubleSide} />
      <meshPhongMaterial attachArray="material" color="red" side={DoubleSide} />
      <meshPhongMaterial attachArray="material" color="red" side={DoubleSide} />
      <meshPhongMaterial attachArray="material" transparent opacity={0} />
      <meshPhongMaterial attachArray="material" color="red" side={DoubleSide} />
    </mesh>
  )
}

/**
 * Gradient material shader material
 */
function GradientMaterial({
  color1,
  color2,
  ...props
}: ReactThreeFiber.MaterialNode<
  THREE.ShaderMaterial,
  [THREE.ShaderMaterialParameters]
> & { color1: Color; color2: Color }) {
  return (
    <shaderMaterial
      uniforms={{
        color1: {
          value: color1,
        },
        color2: {
          value: color2,
        },
      }}
      vertexShader={`
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
      fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `}
      {...props}
    />
  )
}

function Circle({ args }: { args: [number, number] }) {
  return (
    <mesh position={[0, 0, 10]}>
      <circleBufferGeometry attach="geometry" args={args} />
      <GradientMaterial
        attach="material"
        color1={new Color("red")}
        color2={new Color("purple")}
      />
    </mesh>
  )
}

function Box({ pos, mod = 1 }: { pos?: number[]; mod?: number }) {
  const ref = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>()
  const rotation = useRef(mod * 0.2)
  const scale = 1 - mod * 0.05

  useFrame(() => {
    rotation.current += 0.05
    ref?.current?.setRotationFromEuler?.(
      new Euler(rotation.current, rotation.current),
    )
  })

  return (
    <mesh
      ref={ref}
      position={pos ?? [0, 0, 0]}
      castShadow
      scale={[scale, scale, scale]}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshPhongMaterial color="purple" attach="material" />
    </mesh>
  )
}

function Boxes({
  mod = [1, 1, 1],
  count = 10,
}: {
  mod?: [number, number, number]
  count?: number
}) {
  return (
    <>
      {new Array(count).fill(undefined).map((_, i) => {
        const position = [i * mod[0], i * mod[1], i * 4 * mod[2]]
        return <Box key={i} pos={position} mod={i} />
      })}
    </>
  )
}

function Scene({
  children,
  reset = false,
}: {
  children: ReactNode
  reset?: boolean
}) {
  const controls = useRef<OrbitControls>()
  const position0 = useRef<Vector3 | undefined>(undefined)

  const { camera, gl } = useThree()

  /**
   * reset camera back to start position
   */
  useFrame(() => {
    if (!position0.current) {
      position0.current = controls?.current?.object.position.clone()
    }

    const result = controls?.current?.update?.()
    if (reset && !result && position0.current && controls.current) {
      if (
        controls.current?.object?.position?.distanceTo?.(position0.current) >
        0.1
      ) {
        controls.current.object.position.x -=
          (controls.current.object.position.x - position0.current.x) * 0.1
        controls.current.object.position.y -=
          (controls.current.object.position.y - position0.current.y) * 0.1
        controls.current.object.position.z -=
          (controls.current.object.position.z - position0.current.z) * 0.1
      } else if (
        controls.current?.object?.position?.distanceTo?.(position0.current) <
        0.1
      ) {
        controls.current.object.position.x = position0.current.x
        controls.current.object.position.y = position0.current.y
        controls.current.object.position.z = position0.current.z
      }
    }
  })

  return (
    <scene name="Scene">
      <ambientLight intensity={0.8} />
      <spotLight
        intensity={0.3}
        position={[0, 0, 50]}
        angle={1}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
      <orbitControls
        ref={controls}
        args={[camera, gl.domElement]}
        enableDamping={false}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.1}
        rotateSpeed={0.1}
      />
      <Suspense fallback={null}>{children}</Suspense>
    </scene>
  )
}

function Plane() {
  return (
    <mesh position={[0, 0, -5]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <GradientMaterial
        attach="material"
        color1={new Color("purple")}
        color2={new Color("red")}
      />
    </mesh>
  )
}

export function Playground() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", background: "purple" }}
      camera={{ position: [0, 0, 35] }}
      shadowMap
    >
      <Scene reset>
        <Plane />
        <OpenBox />
        <Boxes mod={[1, 1, 1]} />
        <Boxes mod={[-1, -1, 1]} />
        <Boxes mod={[1, -1, 1]} />
        <Boxes mod={[-1, 1, 1]} />
        <Circle args={[3.5, 40]} />
        <Star />
      </Scene>
    </Canvas>
  )
}
