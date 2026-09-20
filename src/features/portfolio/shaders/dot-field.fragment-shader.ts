export const DOT_FIELD_FRAGMENT_SHADER = `#version 300 es

precision mediump float;

in float vAlpha;
in float vPointSize;

uniform vec3 uColor;
uniform float uEdgePixels;

out vec4 fragColor;

void main() {
  vec2 offset = gl_PointCoord - vec2(0.5);
  float distanceFromCenter = length(offset) * 2.0;

  float edge = clamp(uEdgePixels / max(vPointSize, 1.0), 0.05, 0.9);
  float mask = 1.0 - smoothstep(1.0 - edge, 1.0, distanceFromCenter);

  if (mask <= 0.001) {
    discard;
  }

  fragColor = vec4(uColor, mask * vAlpha);
}
`
