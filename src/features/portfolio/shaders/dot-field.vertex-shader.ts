export const DOT_FIELD_VERTEX_SHADER = `#version 300 es

precision highp float;

layout(location = 0) in vec3 aPoint;
layout(location = 1) in vec2 aOffset;

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uDotSize;
uniform float uIntroScale;
uniform float uIntroReveal;
uniform float uIntroSoftness;
uniform float uIntroDim;

out float vAlpha;
out float vPointSize;

void main() {
  vec2 center = uResolution * 0.5;
  vec2 position = center + (aPoint.xy - center) * uIntroScale + aOffset;
  float coverage = aPoint.z;

  float softness = max(uIntroSoftness, 1.0);
  float unrevealed = smoothstep(
    uIntroReveal - softness,
    uIntroReveal + softness,
    aPoint.x
  );
  float introAlpha = mix(1.0, uIntroDim, unrevealed);

  float sizeScale = mix(0.94, 1.0, coverage);
  float pointSize = uDotSize * uPixelRatio * sizeScale * uIntroScale;

  vPointSize = max(pointSize, 1.0);
  vAlpha = mix(0.9, 1.0, coverage) * introAlpha;

  vec2 clipPosition = (position / uResolution) * 2.0 - 1.0;

  gl_Position = vec4(clipPosition.x, -clipPosition.y, 0.0, 1.0);
  gl_PointSize = vPointSize;
}
`
