import { OFFSCREEN_CLIP_POSITION } from "@/data/hero.data"

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
  float morphKey = mix(sweepKey, randomKey, uMorphJitter);
  float localMorph = clamp(
    (uMorph - morphKey * uMorphStagger) / max(1.0 - uMorphStagger, 0.001),
    0.0,
    1.0
  );
  float eased = easeInOutCubic(localMorph);

  vec2 travel = to.position - from.position;
  vec2 side = vec2(-travel.y, travel.x) / max(length(travel), 1.0);
  float arc = sin(3.14159265 * eased) * (0.3 + 0.7 * randomKey) * uMorphArc;
  vec2 position =
    mix(from.position, to.position, eased) + side * arc + aOffset;

  vPointSize = max(mix(from.size, to.size, eased) * uPixelRatio, 1.0);
  vShade = mix(from.shade, to.shade, eased);
  vOpacity = mix(from.opacity, to.opacity, eased);

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
