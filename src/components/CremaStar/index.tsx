/* eslint-disable @typescript-eslint/no-namespace */
import React, { Suspense } from "react"
import { Canvas, useThree } from "react-three-fiber"
import { Vector3, Color, Plane, DoubleSide } from "three"
import { CameraScene } from "../CameraScene"
import { GradientMaterial } from "../GradientMaterial"
import { SVG } from "../SVG"
import StarSVG from "../../assets/Star.svg"
import { Triangle } from "../Triangle"
import { ClippedGradientMaterial } from "../ClippedGradientMaterial"

const useClipping = true

const clippingPlanes = useClipping
  ? [
      new Plane(new Vector3(1, 0, 0), 149),
      new Plane(new Vector3(-1, 0, 0), 149),
      new Plane(new Vector3(0, -1, 0), 297.5),
      new Plane(new Vector3(0, 1, 0), 297.5),
      new Plane(new Vector3(0, 0, 1), 1),
    ]
  : []

function Helpers() {
  return (
    <group name="helpers" visible={false}>
      {[...clippingPlanes].map((plane, i) => (
        <planeHelper key={i} args={[plane, 1000, 0xff0000]} />
      ))}
    </group>
  )
}

function Background() {
  return (
    <>
      {/* <mesh>
        <planeBufferGeometry attach="geometry" args={[298, 595]} />
        <meshBasicMaterial attach="material" color={new Color("#282862")} />
      </mesh> */}
      <Triangle
        position={[0, 0, 0]}
        v1={[0, 0, 0]}
        v2={[149, 298, 200]}
        v3={[-149, 298, 200]}
        color="#817BB9"
        side={DoubleSide}
      />
      <Triangle
        position={[0, 0, 0]}
        v1={[0, 0, 0]}
        v3={[149, -298, 200]}
        v2={[-149, -298, 200]}
        color="#817BB9"
        side={DoubleSide}
      />
      <Triangle
        position={[0, 0, 0]}
        v1={[0, 0, 0]}
        v3={[-149, -298, 200]}
        v2={[-149, 298, 200]}
        color="#282862"
        side={DoubleSide}
      />
      <Triangle
        position={[0, 0, 0]}
        v1={[0, 0, 0]}
        v2={[149, -298, 200]}
        v3={[149, 298, 200]}
        color="#282862"
        side={DoubleSide}
      />
    </>
  )
}

function Sun({
  position,
  offsetY,
}: {
  position: [number, number, number]
  offsetY?: number
}) {
  return offsetY ? (
    <mesh position={position}>
      <circleBufferGeometry attach="geometry" args={[60, 50]} />
      <ClippedGradientMaterial
        attach="material"
        color1={new Color("#FFC84D")}
        color2={new Color("#EF5378")}
        clippingLow={
          offsetY > 0
            ? new Vector3(-Infinity, position[1] + offsetY, -Infinity)
            : undefined
        }
        clippingHigh={
          offsetY < 0
            ? new Vector3(Infinity, position[1] + offsetY, Infinity)
            : undefined
        }
      />
    </mesh>
  ) : (
    <mesh position={position}>
      <circleBufferGeometry attach="geometry" args={[60, 50]} />
      <GradientMaterial
        attach="material"
        color1={new Color("#FFC84D")}
        color2={new Color("#EF5378")}
      />
    </mesh>
  )
}

function Suns() {
  const { gl } = useThree()
  gl.localClippingEnabled = true

  return (
    <>
      <Sun position={[0, 230, 250]} offsetY={1} />
      <Sun position={[0, 165, 225]} offsetY={12} />
      <Sun position={[0, 110, 200]} offsetY={20} />
      <Sun position={[0, 65, 175]} offsetY={28} />
      <Sun position={[0, 30, 150]} offsetY={36} />
      <Sun position={[0, 0, 125]} />
      <Sun position={[0, -30, 150]} offsetY={-36} />
      <Sun position={[0, -65, 175]} offsetY={-28} />
      <Sun position={[0, -110, 200]} offsetY={-20} />
      <Sun position={[0, -165, 225]} offsetY={-12} />
      <Sun position={[0, -230, 250]} offsetY={-1} />
    </>
  )
}

function Star() {
  return <SVG url={StarSVG} position={[0, 0, 200]} />
}

export function CremaStar() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", background: "white" }}
      camera={{ position: [0, 0, 595] }}
      orthographic
    >
      <CameraScene>
        <Suspense fallback={null}>
          <Background />
          <Suns />
          <Star />
          <Helpers />
        </Suspense>
      </CameraScene>
    </Canvas>
  )
}
