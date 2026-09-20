export const DOT_FIELD_VERTEX_SHADER = `#version 300 es

precision highp float;

layout(location = 0) in vec3 aPoint;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uInfluence;
uniform float uTime;
uniform float uPixelRatio;
uniform float uDotSize;
uniform float uVortexRadius;
uniform float uVortexSwirl;
uniform float uVortexPush;
uniform float uVortexFade;
uniform float uVortexShrink;
uniform vec4 uWave;
uniform vec2 uWaveSpeed;

out float vAlpha;
out float vPointSize;

void main() {
  vec2 basePosition = aPoint.xy;
  float coverage = aPoint.z;

  float amplitude = uWave.x * uPixelRatio;
  float secondaryAmplitude = uWave.y * uPixelRatio;
  float frequency = uWave.z / uPixelRatio;
  float secondaryFrequency = uWave.w / uPixelRatio;

  float primaryWave = sin(
    basePosition.x * frequency + uTime * uWaveSpeed.x
  );
  float secondaryWave = sin(
    basePosition.y * secondaryFrequency + uTime * uWaveSpeed.y
  );

  vec2 wavedPosition = basePosition;
  wavedPosition.y += primaryWave * amplitude;
  wavedPosition.y += secondaryWave * secondaryAmplitude;
  wavedPosition.x += secondaryWave * secondaryAmplitude * 0.4;

  vec2 toPoint = wavedPosition - uPointer;
  float distanceToPointer = length(toPoint);
  float radius = max(uVortexRadius * uPixelRatio, 1.0);

  float proximity = 1.0 - smoothstep(0.0, radius, distanceToPointer);
  float falloff = proximity * proximity * uInfluence;

  float angle = uVortexSwirl * falloff;
  float sinAngle = sin(angle);
  float cosAngle = cos(angle);

  vec2 swirled = vec2(
    toPoint.x * cosAngle - toPoint.y * sinAngle,
    toPoint.x * sinAngle + toPoint.y * cosAngle
  );

  vec2 outward = swirled / max(distanceToPointer, 1.0);
  vec2 displaced =
    uPointer + swirled + outward * (uVortexPush * uPixelRatio * falloff);

  float sizeScale = mix(0.94, 1.0, coverage);
  float pointSize = uDotSize * uPixelRatio * sizeScale;
  pointSize *= 1.0 - uVortexShrink * falloff;

  float alpha = mix(0.9, 1.0, coverage);
  alpha *= 1.0 - uVortexFade * falloff;

  vPointSize = max(pointSize, 1.0);
  vAlpha = alpha;

  vec2 clipPosition = (displaced / uResolution) * 2.0 - 1.0;

  gl_Position = vec4(clipPosition.x, -clipPosition.y, 0.0, 1.0);
  gl_PointSize = vPointSize;
}
`
