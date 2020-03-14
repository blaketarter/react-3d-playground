import React, { useRef, ReactNode } from "react"
import { Mesh, Vector2, Shape } from "three"
import { ReactThreeFiber } from "react-three-fiber"

export function DepthTriangle({
  v1,
  v2,
  v3,
  color,
  depth = 1,
  customMaterial,
  ...props
}: {
  v1: [number, number, number]
  v2: [number, number, number]
  v3: [number, number, number]
  color: string
  depth?: number
  customMaterial?: ReactNode
} & ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>) {
  const ref = useRef<Shape>(
    new Shape([
      new Vector2(...v1.slice(0, 2)),
      new Vector2(...v2.slice(0, 2)),
      new Vector2(...v3.slice(0, 2)),
    ]),
  )

  return (
    <mesh {...props}>
      <extrudeGeometry
        attach="geometry"
        args={[ref.current, { bevelEnabled: false, depth }]}
      />
      {customMaterial ?? <meshBasicMaterial attach="material" color={color} />}
    </mesh>
  )
}
