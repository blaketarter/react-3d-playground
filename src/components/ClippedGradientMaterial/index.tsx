import React from "react"
import { ReactThreeFiber } from "react-three-fiber"
import { Color, Vector3 } from "three"

export function ClippedGradientMaterial({
  color1,
  color2,
  clippingLow,
  clippingHigh,
  ...props
}: ReactThreeFiber.MaterialNode<
  THREE.ShaderMaterial,
  [THREE.ShaderMaterialParameters]
> & {
  color1: Color
  color2: Color
  clippingLow?: Vector3
  clippingHigh?: Vector3
}) {
  return (
    <shaderMaterial
      uniforms={{
        color1: {
          value: color1,
        },
        color2: {
          value: color2,
        },
        clippingLow: {
          value: clippingLow ?? new Vector3(-Infinity, -Infinity, -Infinity),
        },
        clippingHigh: {
          value: clippingHigh ?? new Vector3(Infinity, Infinity, Infinity),
        },
      }}
      vertexShader={`
          varying vec2 vUv;
          varying vec4 worldPosition;
      
          void main() {
            vUv = uv;
            worldPosition = modelMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
      fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 clippingLow;
          uniform vec3 clippingHigh;
          varying vec4 worldPosition;
        
          varying vec2 vUv;
          
          void main() {
            if (
              worldPosition.x < clippingLow.x
              || worldPosition.x > clippingHigh.x
              || worldPosition.y < clippingLow.y
              || worldPosition.y > clippingHigh.y
              || worldPosition.z < clippingLow.z
              || worldPosition.z > clippingHigh.z
            ) {
              discard;
            }
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `}
      {...props}
    />
  )
}
