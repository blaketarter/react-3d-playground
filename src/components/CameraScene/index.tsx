/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef, ReactNode } from "react"
import { useFrame, extend, useThree } from "react-three-fiber"
import { Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
extend({ OrbitControls })

export function CameraScene({
  children,
  resetCamera = false,
}: {
  children: ReactNode
  resetCamera?: boolean
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
    if (resetCamera && !result && position0.current && controls.current) {
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
    <scene name="CameraScene">
      <orbitControls
        ref={controls}
        args={[camera, gl.domElement]}
        enableDamping={false}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.1}
        rotateSpeed={0.1}
      />
      {children}
    </scene>
  )
}
