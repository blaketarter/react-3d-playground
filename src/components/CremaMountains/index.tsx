/* eslint-disable @typescript-eslint/no-namespace */
import React, { Suspense, useRef } from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { Vector3, Color, Euler, Plane, Mesh } from "three"
import { CameraScene } from "../CameraScene"
import { GradientMaterial } from "../GradientMaterial"
import { SVG } from "../SVG"
import StarSmallSVG from "../../assets/Star-small.svg"
import StarsSVG from "../../assets/Stars.svg"
import { DepthTriangle } from "../DepthTriangle"

const clippingPlanes = [
  new Plane(new Vector3(1, 0, 0), 149),
  new Plane(new Vector3(-1, 0, 0), 149),
  new Plane(new Vector3(0, -1, 0), 297.5),
  new Plane(new Vector3(0, 1, 0), 297.5),
]

function Helpers() {
  return (
    <group name="helpers" visible={false}>
      {clippingPlanes.map(plane => (
        <planeHelper args={[plane, 1000, 0xff0000]} />
      ))}
    </group>
  )
}

function Background() {
  const scale = 1
  return (
    <mesh scale={[scale, scale, scale]}>
      <planeBufferGeometry attach="geometry" args={[298, 595]} />
      <GradientMaterial
        attach="material"
        color1={new Color("#282862")}
        color2={new Color("#817BB9")}
      />
    </mesh>
  )
}

function Mountains() {
  return (
    <>
      <DepthTriangle
        v1={[0, 0, 0]}
        v2={[298, 0, 0]}
        v3={[0, 298, 0]}
        position={[-149, -297.5, 0]}
        color="#282862"
        depth={50}
      />
      <DepthTriangle
        v1={[0, 0, 0]}
        v2={[74.5, -74.5, 0]}
        v3={[74.5, 74.5, 0]}
        position={[0, -148.5, 0]}
        color="#817BB9"
        depth={35}
      />
      <DepthTriangle
        v1={[0, 0, 0]}
        v2={[-74.5, 74.5, 0]}
        v3={[-74.5, -74.5, 0]}
        position={[149, -148.5, 0]}
        color="#282862"
        depth={35}
      />
      <DepthTriangle
        v1={[0, 0, 0]}
        v2={[74.5, -74.5, 0]}
        v3={[74.5, 74.5, 0]}
        position={[74.5, -222.5, 0]}
        color="#282862"
        depth={35}
      />
    </>
  )
}

function Sun() {
  const ref = useRef<Mesh>()
  useFrame(({ clock }) => {
    if (ref.current) {
      const amt = Math.sin(clock.getElapsedTime() * 0.2) * 0.1
      ref.current.translateY(-amt)
    }
  })

  return (
    <mesh position={[74.5, -74, 25]} ref={ref}>
      <circleBufferGeometry attach="geometry" args={[60, 50]} />
      <GradientMaterial
        attach="material"
        color1={new Color("#FFC84D")}
        color2={new Color("#EF5378")}
      />
    </mesh>
  )
}

function Sunset() {
  const { gl } = useThree()
  gl.localClippingEnabled = true

  const ref1 = useRef<Mesh>()
  const ref2 = useRef<Mesh>()
  const ref3 = useRef<Mesh>()

  useFrame(({ clock }) => {
    if (ref1.current && ref2.current && ref3.current) {
      const amt = Math.sin(clock.getElapsedTime() * 0.2)
      ref1.current.translateY(-amt * 0.1)
      ref1.current.translateX(-amt * 0.1)
      ref2.current.translateY(-amt * 0.07)
      ref2.current.translateX(-amt * 0.07)
      ref3.current.translateY(-amt * 0.05)
      ref3.current.translateX(-amt * 0.05)
    }
  })

  return (
    <>
      <mesh
        ref={ref1}
        renderOrder={1}
        position={[0, 0, 10]}
        rotation={new Euler(0, 0, Math.PI / 4)}
      >
        <planeBufferGeometry attach="geometry" args={[420, 420]} />
        <meshBasicMaterial
          attach="material"
          color={new Color("#FFC84D")}
          opacity={0.15}
          transparent
          clippingPlanes={clippingPlanes}
        />
      </mesh>
      <mesh
        ref={ref2}
        renderOrder={2}
        position={[0, -74.5, 15]}
        rotation={new Euler(0, 0, Math.PI / 4)}
      >
        <planeBufferGeometry attach="geometry" args={[316, 316]} />
        <meshBasicMaterial
          attach="material"
          color={new Color("#FFC84D")}
          opacity={0.25}
          transparent
          clippingPlanes={clippingPlanes}
        />
      </mesh>
      <mesh
        ref={ref3}
        renderOrder={3}
        position={[0, -149, 20]}
        rotation={new Euler(0, 0, Math.PI / 4)}
      >
        <planeBufferGeometry attach="geometry" args={[210, 210]} />
        <meshBasicMaterial
          attach="material"
          color={new Color("#FFC84D")}
          opacity={0.35}
          transparent
          clippingPlanes={clippingPlanes}
        />
      </mesh>
    </>
  )
}

function Stars() {
  return (
    <>
      <SVG url={StarSmallSVG} position={[0, 148, 50]} />
      <SVG url={StarsSVG} position={[0, 148, 9]} />
    </>
  )
}

export function CremaMountains() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", background: "white" }}
      camera={{ position: [0, 0, 595] }}
      orthographic
    >
      <CameraScene resetCamera>
        <Suspense fallback={null}>
          <Background />
          <Sun />
          <Mountains />
          <Sunset />
          <Stars />
          <Helpers />
        </Suspense>
      </CameraScene>
    </Canvas>
  )
}
