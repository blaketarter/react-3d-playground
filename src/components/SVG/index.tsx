import React, { forwardRef } from "react"
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

export const SVG = forwardRef(function InnerSVG(
  {
    url,
    position = [0, 0, 0],
    scale,
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
  >,
  ref,
) {
  const star = useLoader(SVGLoader, url)
  const scaleMod = scale ?? [1, 1, 1]
  return (
    <group
      ref={ref as any}
      position={[
        position[0] +
          ((star.xml as any).attributes.width.value / 2) * -scaleMod[0],
        position[1] +
          ((star.xml as any).attributes.height.value / 2) * -scaleMod[1],
        position[2],
      ]}
      {...props}
    >
      {star.paths
        .flatMap(path => path.toShapes(true))
        .map((shape, i) => (
          <CustomShape key={i} shape={shape} index={i} />
        ))}
    </group>
  )
})
