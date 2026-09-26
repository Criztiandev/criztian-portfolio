export const DOT_FIELD_VERTEX_SHADER = `#version 300 es

precision highp float;

layout(location = 0) in vec3 aPoint;
layout(location = 1) in vec2 aOffset;
layout(location = 2) in vec3 aCube;
layout(location = 3) in vec2 aMorph;

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uDotSize;
uniform float uIntroScale;
uniform float uIntroReveal;
uniform float uIntroSoftness;
uniform float uIntroDim;
uniform vec2 uWordOrigin;
uniform vec2 uWordCenter;
uniform vec2 uWordBounds;
uniform float uMorph;
uniform float uMorphStagger;
uniform float uMorphJitter;
uniform float uMorphArc;
uniform vec2 uCubeCenter;
uniform float uCubeHalfSize;
uniform mat3 uCubeRotation;
uniform float uCameraDistance;
uniform float uFarLight;
uniform float uCubeDotSize;

out float vShade;
out float vOpacity;
out float vPointSize;

float easeInOutCubic(float progress) {
  if (progress < 0.5) {
    return 4.0 * progress * progress * progress;
  }

  float tail = 2.0 - 2.0 * progress;

  return 1.0 - 0.5 * tail * tail * tail;
}

void main() {
  vec2 wordPosition =
    uWordOrigin + uWordCenter + (aPoint.xy - uWordCenter) * uIntroScale;
  float coverage = aPoint.z;

  float softness = max(uIntroSoftness, 1.0);
  float unrevealed = smoothstep(
    uIntroReveal - softness,
    uIntroReveal + softness,
    aPoint.x
  );
  float introAlpha = mix(1.0, uIntroDim, unrevealed);
  float wordAlpha = mix(0.9, 1.0, coverage) * introAlpha;
  float wordSize = uDotSize * mix(0.94, 1.0, coverage) * uIntroScale;

  vec3 rotated = uCubeRotation * aCube;
  float perspective = uCameraDistance / max(uCameraDistance - rotated.z, 0.5);
  vec2 cubePosition =
    uCubeCenter + vec2(rotated.x, -rotated.y) * perspective * uCubeHalfSize;
  float depthLight = mix(
    uFarLight,
    1.0,
    clamp(rotated.z * 0.288675 + 0.5, 0.0, 1.0)
  );
  float cubeAlpha = aMorph.y * depthLight;
  float cubeSize = uCubeDotSize * perspective;

  float wordSpan = max(uWordBounds.y - uWordBounds.x, 1.0);
  float sweepKey = clamp((aPoint.x - uWordBounds.x) / wordSpan, 0.0, 1.0);
  float morphKey = mix(sweepKey, aMorph.x, uMorphJitter);
  float localMorph = clamp(
    (uMorph - morphKey * uMorphStagger) / max(1.0 - uMorphStagger, 0.001),
    0.0,
    1.0
  );
  float eased = easeInOutCubic(localMorph);

  vec2 travel = cubePosition - wordPosition;
  vec2 side = vec2(-travel.y, travel.x) / max(length(travel), 1.0);
  float arc = sin(3.14159265 * eased) * (0.3 + 0.7 * aMorph.x) * uMorphArc;
  vec2 position = mix(wordPosition, cubePosition, eased) + side * arc + aOffset;

  vPointSize = max(mix(wordSize, cubeSize, eased) * uPixelRatio, 1.0);
  vShade = mix(wordAlpha, 1.0, eased);
  vOpacity = mix(1.0, cubeAlpha, eased);

  vec2 clipPosition = (position / uResolution) * 2.0 - 1.0;

  gl_Position = vec4(clipPosition.x, -clipPosition.y, 0.0, 1.0);
  gl_PointSize = vPointSize;
}
`
