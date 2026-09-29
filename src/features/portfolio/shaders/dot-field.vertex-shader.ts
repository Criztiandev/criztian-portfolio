import { OFFSCREEN_CLIP_POSITION, SHAPE_POINTS } from "@/data/hero.data"

export const DOT_FIELD_VERTEX_SHADER = `#version 300 es

precision highp float;

layout(location = 0) in vec3 aPoint;
layout(location = 1) in vec2 aOffset;
layout(location = 2) in vec4 aFrom;
layout(location = 3) in vec4 aTo;

struct Placement {
  float isName;
  vec2 center;
  vec2 halfSize;
  mat3 rotation;
  float cameraDistance;
  float visible;
  float farLight;
  float depthRadius;
  float dotSize;
  float opacity;
};

struct Placed {
  vec2 position;
  float size;
  float shade;
  float opacity;
};

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uDotSize;
uniform float uIntroReveal;
uniform float uIntroSoftness;
uniform float uIntroDim;
uniform vec2 uWordCenter;
uniform vec2 uWordBounds;
uniform float uMorph;
uniform float uMorphStagger;
uniform float uMorphJitter;
uniform float uMorphArc;
uniform float uPenJitter;
uniform float uBurstPixels;
uniform float uBurstScale;
uniform float uSwell;
uniform float uStrikeSize;
uniform float uStrike;
uniform float uThread;
uniform float uThreadStagger;
uniform float uThreadJitter;
uniform float uThreadArc;
uniform float uThreadBurst;
uniform Placement uFrom;
uniform Placement uTo;

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

float hashCell(vec2 cell) {
  return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 blend = local * local * (3.0 - 2.0 * local);
  float bottomLeft = hashCell(cell);
  float bottomRight = hashCell(cell + vec2(1.0, 0.0));
  float topLeft = hashCell(cell + vec2(0.0, 1.0));
  float topRight = hashCell(cell + vec2(1.0, 1.0));

  return mix(
    mix(bottomLeft, bottomRight, blend.x),
    mix(topLeft, topRight, blend.x),
    blend.y
  );
}

vec2 curlNoise(vec2 point) {
  float probe = 0.05;
  float above = valueNoise(point + vec2(0.0, probe));
  float below = valueNoise(point - vec2(0.0, probe));
  float right = valueNoise(point + vec2(probe, 0.0));
  float left = valueNoise(point - vec2(probe, 0.0));

  return vec2(above - below, left - right) / (2.0 * probe);
}

Placed placeName(Placement placement) {
  Placed placed;
  float coverage = aPoint.z;
  float softness = max(uIntroSoftness, 1.0);
  float unrevealed = smoothstep(
    uIntroReveal - softness,
    uIntroReveal + softness,
    aPoint.x
  );
  float introAlpha = mix(1.0, uIntroDim, unrevealed);

  placed.position =
    placement.center + uWordCenter +
    (aPoint.xy - uWordCenter) * placement.halfSize.x;
  placed.shade = mix(0.9, 1.0, coverage) * introAlpha;
  placed.size =
    uDotSize * mix(0.94, 1.0, coverage) * placement.halfSize.x;
  placed.opacity = step(0.001, coverage);

  return placed;
}

Placed placeShape(Placement placement, vec4 point) {
  Placed placed;
  vec3 rotated = placement.rotation * point.xyz;
  float perspective = 1.0;

  if (placement.cameraDistance > 0.0) {
    perspective =
      placement.cameraDistance /
      max(placement.cameraDistance - rotated.z, 0.5);
  }

  float depthLight = mix(
    placement.farLight,
    1.0,
    clamp(rotated.z / (2.0 * placement.depthRadius) + 0.5, 0.0, 1.0)
  );
  float isVisible = 1.0 - step(placement.visible, point.w);

  placed.position =
    placement.center +
    vec2(rotated.x, -rotated.y) * perspective * placement.halfSize;
  placed.shade = 1.0;
  placed.size = placement.dotSize * perspective;
  placed.opacity = isVisible * depthLight * placement.opacity;

  return placed;
}

Placed place(Placement placement, vec4 point) {
  if (placement.isName > 0.5) {
    return placeName(placement);
  }

  return placeShape(placement, point);
}

void main() {
  Placed from = place(uFrom, aFrom);
  Placed to = place(uTo, aTo);

  float wordSpan = max(uWordBounds.y - uWordBounds.x, 1.0);
  float nameKey = clamp((aPoint.x - uWordBounds.x) / wordSpan, 0.0, 1.0);
  float shapeKey = clamp(from.position.x / uResolution.x, 0.0, 1.0);
  float hasName = max(uFrom.isName, uTo.isName);
  float sweepKey = mix(shapeKey, nameKey, step(0.5, hasName));
  float rank = mix(aTo.w, aFrom.w, step(0.5, uTo.isName));
  float randomKey = fract(rank * 97.13);
  float sweepDepartKey = mix(sweepKey, randomKey, uMorphJitter);
  float penKey = min(float(gl_VertexID) / ${SHAPE_POINTS}.0, 1.0);
  float threadKey = mix(
    penKey,
    randomKey,
    mix(uPenJitter, uThreadJitter, uThread)
  );
  float departKey = mix(sweepDepartKey, threadKey, uThread);
  float arriveKey = mix(threadKey, sweepDepartKey, step(0.5, hasName));
  float stagger = mix(uMorphStagger, uThreadStagger, uThread);
  float departStart = departKey * stagger;
  float arriveEnd = 1.0 - (1.0 - arriveKey) * stagger;
  float localMorph = clamp(
    (uMorph - departStart) / max(arriveEnd - departStart, 0.001),
    0.0,
    1.0
  );
  float eased = easeInOutCubic(localMorph);
  float flight = sin(3.14159265 * eased);

  vec2 travel = to.position - from.position;
  vec2 side = vec2(-travel.y, travel.x) / max(length(travel), 1.0);
  float arcSpread = mix(0.3 + 0.7 * randomKey, 1.0, uThread);
  float arc = flight * arcSpread * mix(uMorphArc, uThreadArc, uThread);
  vec2 position =
    mix(from.position, to.position, eased) + side * arc + aOffset;

  vec2 fieldPoint =
    position / max(uBurstScale, 1.0) + vec2(randomKey * 0.6, eased * 1.3);
  vec2 burst =
    curlNoise(fieldPoint) * 0.6 * uBurstPixels * flight *
    mix(1.0, uThreadBurst, uThread);
  position = clamp(
    position + burst,
    min(position, vec2(0.0)),
    max(position, uResolution)
  );

  float swell = 1.0 + uSwell * flight;
  float strike = 1.0 + uStrikeSize * uStrike;

  vPointSize =
    max(mix(from.size, to.size, eased) * uPixelRatio * swell * strike, 1.0);
  vShade = mix(from.shade, to.shade, eased);
  vOpacity = min(
    mix(from.opacity, to.opacity, eased) * (1.0 + 0.5 * uSwell * flight),
    1.0
  );

  if (vOpacity <= 0.0) {
    gl_Position = vec4(vec3(${OFFSCREEN_CLIP_POSITION}.0), 1.0);
    gl_PointSize = 1.0;
    return;
  }

  vec2 clipPosition = (position / uResolution) * 2.0 - 1.0;

  gl_Position = vec4(clipPosition.x, -clipPosition.y, 0.0, 1.0);
  gl_PointSize = vPointSize;
}
`
