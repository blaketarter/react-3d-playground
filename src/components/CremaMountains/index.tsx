/* eslint-disable @typescript-eslint/no-namespace */
import React, { Suspense } from "react"
import { Canvas, useThree } from "react-three-fiber"
import { Vector3, Color, Euler, Plane } from "three"
import { CameraScene } from "../CameraScene"
import { GradientMaterial } from "../GradientMaterial"
import { SVG } from "../SVG"
import StarSmallSVG from "../../assets/Star-small.svg"
import StarsSVG from "../../assets/Stars.svg"
import { DepthTriangle } from "../DepthTriangle"

const clippingPlanes = [
  new Plane(new Vector3(1, 0, 0), 149),
  new Plane(new Vector3(-1, 0, 0), 149),
]

const colors = [0xff0000, 0xff0000]

function Helpers() {
  return (
    <group name="helpers" visible={false}>
      {clippingPlanes.map((plane, i) => (
        <planeHelper args={[plane, 5, colors[i]]} />
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
  return (
    <mesh position={[74.5, -74, 25]}>
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
  return (
    <>
      <mesh
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
