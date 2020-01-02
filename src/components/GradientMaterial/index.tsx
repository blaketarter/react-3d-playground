import React from "react"
import { ReactThreeFiber } from "react-three-fiber"
import { Color } from "three"

export function GradientMaterial({
  color1,
  color2,
  ...props
}: ReactThreeFiber.MaterialNode<
  THREE.ShaderMaterial,
  [THREE.ShaderMaterialParameters]
> & { color1: Color; color2: Color }) {
  return (
    <shaderMaterial
      uniforms={{
        color1: {
          value: color1,
        },
        color2: {
          value: color2,
        },
      }}
      vertexShader={`
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
      fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `}
      {...props}
    />
  )
}
