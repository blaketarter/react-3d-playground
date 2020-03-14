import React from "react"
import { Geometry, Mesh, Vector3, Face3, Side } from "three"
import { useUpdate, ReactThreeFiber } from "react-three-fiber"

export function Triangle({
  v1,
  v2,
  v3,
  color,
  side,
  ...props
}: {
  v1: [number, number, number]
  v2: [number, number, number]
  v3: [number, number, number]
  side?: Side
  color: string
} & ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>) {
  const ref = useUpdate<Geometry>(geometry => {
    geometry.vertices.push(new Vector3(...v1))
    geometry.vertices.push(new Vector3(...v2))
    geometry.vertices.push(new Vector3(...v3))
    geometry.faces.push(new Face3(0, 1, 2))
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
  }, [])
  return (
    <mesh {...props}>
      <geometry attach="geometry" ref={ref} />
      <meshBasicMaterial
        attach="material"
        color={color}
        side={side}
        fog={true}
      />
    </mesh>
  )
}
