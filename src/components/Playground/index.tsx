/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef, Suspense } from "react"
import { Canvas, useFrame, ReactThreeFiber } from "react-three-fiber"
import { Mesh, Euler, DoubleSide, Color } from "three"
import StarSVG from "../../assets/Star.svg"
import { CameraScene } from "../CameraScene"
import { GradientMaterial } from "../GradientMaterial"
import { SVG } from "../SVG"

/**
 * One transparent side, different material per side
 */
function OpenBox() {
  return (
    <mesh receiveShadow position={[0, 0, 10]}>
      <boxBufferGeometry attach="geometry" args={[12, 25, 25]} />
      <GradientMaterial
        attachArray="material"
        color1={new Color("red")}
        color2={new Color("purple")}
        side={DoubleSide}
      />
      <GradientMaterial
        attachArray="material"
        color1={new Color("red")}
        color2={new Color("purple")}
        side={DoubleSide}
      />
      <GradientMaterial
        attachArray="material"
        color1={new Color("red")}
        color2={new Color("purple")}
        side={DoubleSide}
      />
      <GradientMaterial
        attachArray="material"
        color1={new Color("red")}
        color2={new Color("purple")}
        side={DoubleSide}
      />
      <meshPhongMaterial attachArray="material" transparent opacity={0} />
      <GradientMaterial
        attachArray="material"
        color1={new Color("red")}
        color2={new Color("purple")}
        side={DoubleSide}
      />
    </mesh>
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

// function Star({ shape }: { shape: Shape }) {
//   return (
//     <mesh position={[0, 0, 0]}>
//       <shapeBufferGeometry attach="geometry" args={[shape]} />
//       {/* <GradientMaterial
//         attach="material"
//         color1={new Color("red")}
//         color2={new Color("purple")}
//       /> */}
//       <meshLambertMaterial attach="material" color="red" />
//     </mesh>
//   )
// }

export function Playground() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", background: "purple" }}
      camera={{ position: [0, 0, 35] }}
      shadowMap
    >
      <CameraScene resetCamera>
        <Suspense fallback={null}>
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
          <Plane />
          <OpenBox />
          <Boxes mod={[1, 1, 1]} />
          <Boxes mod={[-1, -1, 1]} />
          <Boxes mod={[1, -1, 1]} />
          <Boxes mod={[-1, 1, 1]} />
          <Circle args={[3.5, 40]} />
          <SVG
            url={StarSVG}
            position={[0, 0, 15]}
            scale={[0.05, 0.05, 0.05]}
            // CustomShape={Star}
          />
        </Suspense>
      </CameraScene>
    </Canvas>
  )
}
