import React from "react"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader"
import { Shape, DoubleSide, Group } from "three"
import { useLoader, ReactThreeFiber } from "react-three-fiber"

function DefaultCustomShape({ shape }: { shape: Shape; index: number }) {
  return (
    <mesh position={[0, 0, 0]}>
      <shapeBufferGeometry attach="geometry" args={[shape]} />
      <meshBasicMaterial attach="material" color="white" side={DoubleSide} />
    </mesh>
  )
}

export function SVG({
  url,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  CustomShape = DefaultCustomShape,
  ...props
}: {
  url: string
  position?: [number, number, number]
  scale?: [number, number, number]
  CustomShape?: typeof DefaultCustomShape
} & Omit<
  ReactThreeFiber.Object3DNode<Group, typeof Group>,
  "position" | "scale"
>) {
  const star = useLoader(SVGLoader, url)
  return (
    <group
      {...props}
      position={[
        position[0] +
          ((star.xml as any).attributes.width.value / 2) * -scale[0],
        position[1] +
          ((star.xml as any).attributes.height.value / 2) * -scale[1],
        position[2],
      ]}
      scale={scale}
    >
      {star.paths
        .flatMap(path => path.toShapes(true))
        .map((shape, i) => (
          <CustomShape key={i} shape={shape} index={i} />
        ))}
    </group>
  )
}
