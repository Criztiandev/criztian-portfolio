import { MAX_DOT_FRAMES } from "@/data/hero.data"

export const DOT_FIELD_VERTEX_SHADER = `#version 300 es

precision highp float;

layout(location = 0) in vec3 aPoint;
layout(location = 1) in vec2 aOffset;
layout(location = 2) in vec3 aCube;
layout(location = 3) in vec2 aMorph;
layout(location = 4) in vec4 aScene;

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
uniform float uWindowTop;
uniform float uBurst;
uniform float uBurstStagger;
uniform float uSparkRadius;
uniform float uSparkFade;
uniform vec4 uDustRect;
uniform vec2 uShares;
uniform float uDustOpacity;
uniform float uDustDotSize;
uniform float uFrameCount;
uniform vec4 uFrameRects[${MAX_DOT_FRAMES}];
uniform float uClaims[${MAX_DOT_FRAMES}];
uniform float uFrameBand;
uniform float uFrameOutset;
uniform float uFrameJitter;
uniform float uFrameDotSize;
uniform float uFrameOpacity;
uniform float uClaimStagger;

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

float easeOutCubic(float progress) {
  float remaining = 1.0 - progress;

  return 1.0 - remaining * remaining * remaining;
}

vec2 findPerimeterPoint(vec4 rect, float along, out vec2 normal) {
  float travelled = along * 2.0 * (rect.z + rect.w);

  if (travelled < rect.z) {
    normal = vec2(0.0, -1.0);

    return vec2(rect.x + travelled, rect.y);
  }

  travelled -= rect.z;

  if (travelled < rect.w) {
    normal = vec2(1.0, 0.0);

    return vec2(rect.x + rect.z, rect.y + travelled);
  }

  travelled -= rect.w;

  if (travelled < rect.z) {
    normal = vec2(0.0, 1.0);

    return vec2(rect.x + rect.z - travelled, rect.y + rect.w);
  }

  travelled -= rect.z;
  normal = vec2(-1.0, 0.0);

  return vec2(rect.x, rect.y + rect.w - travelled);
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
  vec2 formedPosition = mix(wordPosition, cubePosition, eased) + side * arc;
  float formedSize = mix(wordSize, cubeSize, eased) * uPixelRatio;
  float formedOpacity = mix(1.0, cubeAlpha, eased);

  float localBurst = clamp(
    (uBurst - aMorph.x * uBurstStagger) / max(1.0 - uBurstStagger, 0.001),
    0.0,
    1.0
  );
  float flung = easeOutCubic(localBurst);
  float frameEnd = uShares.x;
  float isFrame = step(aScene.w, frameEnd) * step(0.000001, frameEnd);
  float isSpark = step(uShares.y, aScene.w);

  float sparkAngle = 6.28318531 * aScene.x;
  vec2 sparkPosition =
    uCubeCenter +
    vec2(cos(sparkAngle), sin(sparkAngle)) * sqrt(aScene.y) * uSparkRadius;
  vec2 dustPosition = uDustRect.xy + aScene.xy * uDustRect.zw;

  float frameSlot = floor(aScene.w / max(frameEnd, 0.000001) * uFrameCount);
  int frameIndex = int(clamp(frameSlot, 0.0, max(uFrameCount - 1.0, 0.0)));
  vec2 frameNormal;
  vec2 frameEdge =
    findPerimeterPoint(uFrameRects[frameIndex], aScene.z, frameNormal);
  float claimProgress = clamp(
    (uClaims[frameIndex] - aScene.z * uClaimStagger) /
      max(1.0 - uClaimStagger, 0.001),
    0.0,
    1.0
  );
  float claimEase = easeInOutCubic(claimProgress);
  float frameReach = mix(
    uFrameOutset + uFrameBand * aScene.y,
    uFrameOutset + uFrameJitter * (aScene.y * 2.0 - 1.0),
    claimEase
  );
  vec2 framePosition = frameEdge + frameNormal * frameReach;

  vec2 scenePosition = mix(
    mix(dustPosition, sparkPosition, isSpark),
    framePosition,
    isFrame
  );

  float sparkOpacity =
    1.0 - smoothstep(uSparkFade * 0.4, uSparkFade, localBurst);
  float settleOpacity =
    mix(1.0, uDustOpacity, smoothstep(0.35, 1.0, localBurst));
  float frameOpacity = mix(settleOpacity, uFrameOpacity, claimEase);
  float sceneOpacity =
    mix(mix(settleOpacity, sparkOpacity, isSpark), frameOpacity, isFrame) *
    aMorph.y;
  float frameSize = mix(uDustDotSize, uFrameDotSize, claimEase);
  float sceneSize =
    mix(mix(uDustDotSize, uCubeDotSize, isSpark), frameSize, isFrame) *
    uPixelRatio;

  vec2 position = mix(formedPosition, scenePosition, flung) + aOffset;
  position.y -= uWindowTop;

  vPointSize = max(mix(formedSize, sceneSize, flung), 1.0);
  vShade = mix(wordAlpha, 1.0, eased);
  vOpacity = mix(
    formedOpacity,
    sceneOpacity,
    smoothstep(0.0, 0.08, localBurst)
  );

  vec2 clipPosition = (position / uResolution) * 2.0 - 1.0;

  gl_Position = vec4(clipPosition.x, -clipPosition.y, 0.0, 1.0);
  gl_PointSize = vPointSize;
}
`
