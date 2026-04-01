import React from 'react';
import { Element, ShapeConfig, TransformConfig, AnimationConfig } from '../types';
import { SHAPES, CUSTOM_SVG_PREFIX } from '../constants';
import { math, easings } from '../utils/math';
import { shapePaths } from '../utils/shapes';

export const RenderShape = React.memo<{
  el: Element;
  shapes: Record<string, ShapeConfig>;
  customSVGMap: Record<string, ShapeConfig>;
  transforms: TransformConfig;
  animConfig: AnimationConfig;
  time: number;
}>(({ el, shapes, customSVGMap, transforms, animConfig, time }) => {
  const { x, y, shapeType, nx, ny, dc, r, idx } = el;

  const isCustomSVG = shapeType.startsWith(CUSTOM_SVG_PREFIX);
  const cfg: ShapeConfig = isCustomSVG
    ? (customSVGMap[shapeType] || {})
    : (shapes[shapeType] || {});

  const { rotMode, rotAmt, scaleMode, scaleAmt, opacityMode, opacityAmt, waveFreq, wavePhase } = transforms;

  // Calculate stagger delay
  let staggerDelay = 0;
  if (animConfig.staggerType === 'index') {
    staggerDelay = idx * animConfig.staggerAmount;
  } else if (animConfig.staggerType === 'distance') {
    staggerDelay = dc * animConfig.staggerAmount * 1000;
  } else if (animConfig.staggerType === 'horizontal') {
    staggerDelay = nx * animConfig.staggerAmount * 1000;
  } else if (animConfig.staggerType === 'vertical') {
    staggerDelay = ny * animConfig.staggerAmount * 1000;
  }

  // Calculate animation progress
  const adjustedTime = Math.max(0, time - staggerDelay);
  const rawProgress = (adjustedTime % animConfig.duration) / animConfig.duration;
  const easingFn = easings[animConfig.easing as keyof typeof easings] || easings.linear;
  
  let progress = rawProgress;
  if (animConfig.direction === 'reverse') {
    progress = 1 - rawProgress;
  } else if (animConfig.direction === 'alternate') {
    const cycle = Math.floor(adjustedTime / animConfig.duration);
    progress = cycle % 2 === 0 ? rawProgress : 1 - rawProgress;
  }
  
  progress = easingFn(progress);

  let rotation = 0, scale = 1, opacity = cfg.opacity || 1, translateX = 0, translateY = 0;
  
  // Base transforms
  switch (rotMode) {
    case 'radial': rotation = dc * rotAmt; break;
    case 'wave': rotation = Math.sin((nx + wavePhase) * Math.PI * 2 * waveFreq) * rotAmt; break;
    case 'per-element': rotation = idx * (rotAmt / 10); break;
    default: rotation = rotAmt;
  }
  
  switch (scaleMode) {
    case 'radial': scale = math.lerp(1, scaleAmt, dc); break;
    case 'radial-inv': scale = math.lerp(scaleAmt, 1, dc); break;
    case 'wave': scale = math.lerp(1, scaleAmt, (Math.sin((nx + wavePhase) * Math.PI * 2 * waveFreq) + 1) / 2); break;
    default: scale = scaleAmt;
  }
  
  switch (opacityMode) {
    case 'radial': opacity *= math.lerp(1, opacityAmt, dc); break;
    case 'radial-inv': opacity *= math.lerp(opacityAmt, 1, dc); break;
    case 'wave': opacity *= math.lerp(1, opacityAmt, (Math.sin((ny + wavePhase) * Math.PI * 2 * waveFreq) + 1) / 2); break;
    case 'random': opacity *= math.lerp(opacityAmt, 1, r[0]); break;
    default: opacity *= opacityAmt;
  }

  // Animated transforms
  if (animConfig.enabled && adjustedTime > 0) {
    if (animConfig.rotationEnabled) {
      rotation += animConfig.rotationFrom + (animConfig.rotationTo - animConfig.rotationFrom) * progress;
    }

    let scaleX = 1, scaleY = 1;
    if (animConfig.scaleEnabled) {
      scale *= animConfig.scaleFrom + (animConfig.scaleTo - animConfig.scaleFrom) * progress;
    }
    if (animConfig.scaleXEnabled) {
      scaleX = animConfig.scaleXFrom + (animConfig.scaleXTo - animConfig.scaleXFrom) * progress;
    }
    if (animConfig.scaleYEnabled) {
      scaleY = animConfig.scaleYFrom + (animConfig.scaleYTo - animConfig.scaleYFrom) * progress;
    }
    if (animConfig.opacityEnabled) {
      opacity *= animConfig.opacityFrom + (animConfig.opacityTo - animConfig.opacityFrom) * progress;
    }
    if (animConfig.translateXEnabled) {
      translateX = animConfig.translateXFrom + (animConfig.translateXTo - animConfig.translateXFrom) * progress;
    }
    if (animConfig.translateYEnabled) {
      translateY = animConfig.translateYFrom + (animConfig.translateYTo - animConfig.translateYFrom) * progress;
    }

    const finalScaleX = (animConfig.scaleXEnabled || animConfig.scaleYEnabled) ? scaleX : scale;
    const finalScaleY = (animConfig.scaleXEnabled || animConfig.scaleYEnabled) ? scaleY : scale;
    const transform = `translate(${x + translateX}, ${y + translateY}) rotate(${rotation}) scale(${finalScaleX}, ${finalScaleY})`;

    switch (shapeType) {
      case SHAPES.RECT:
        return <path d={shapePaths.rectangle(cfg.width!, cfg.height!, cfg.radius!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      case SHAPES.SQUARE: {
        const s = cfg.size!;
        return <path d={shapePaths.rectangle(s, s, cfg.radius!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      }
      case SHAPES.DOT:
        return <circle r={cfg.radius!} fill={cfg.fill} opacity={opacity} transform={transform} />;
      case SHAPES.LINE: {
        const rad = math.degToRad(cfg.angle! + rotation);
        const len = cfg.length! / 2;
        return <line x1={x + translateX - Math.cos(rad) * len * finalScaleX} y1={y + translateY - Math.sin(rad) * len * finalScaleY} x2={x + translateX + Math.cos(rad) * len * finalScaleX} y2={y + translateY + Math.sin(rad) * len * finalScaleY} stroke={cfg.stroke} strokeWidth={cfg.strokeWidth} strokeLinecap={cfg.lineCap as any} opacity={opacity} />;
      }
      case SHAPES.STAR:
        return <path d={shapePaths.star(cfg.size!, cfg.innerRatio, cfg.smoothness)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      case SHAPES.TRIANGLE:
        return <path d={shapePaths.triangle(cfg.size!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      case SHAPES.CROSS:
        return <path d={shapePaths.cross(cfg.size!, cfg.crossThickness || 6)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      case SHAPES.DIAMOND:
        return <path d={shapePaths.diamond(cfg.size!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
      default: {
        if (isCustomSVG && cfg.customSVGPath) {
          const svgScale = finalScaleX * (cfg.customSVGNormalizedScale || 1) * (cfg.size || 10);
          const cx = cfg.customSVGCenterX || 0;
          const cy = cfg.customSVGCenterY || 0;
          return <path d={cfg.customSVGPath} fill={cfg.fill} opacity={opacity} transform={`translate(${x + translateX}, ${y + translateY}) rotate(${rotation}) scale(${svgScale}) translate(${-cx}, ${-cy})`} />;
        }
        return null;
      }
    }
  }

  const transform = `translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`;

  switch (shapeType) {
    case SHAPES.RECT:
      return <path d={shapePaths.rectangle(cfg.width!, cfg.height!, cfg.radius!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
    case SHAPES.SQUARE: {
      const s = cfg.size! * scale;
      return <path d={shapePaths.rectangle(s, s, cfg.radius!)} fill={cfg.fill} opacity={opacity} transform={`translate(${x}, ${y}) rotate(${rotation})`} />;
    }
    case SHAPES.DOT:
      return <circle r={cfg.radius! * scale} fill={cfg.fill} opacity={opacity} transform={`translate(${x}, ${y})`} />;
    case SHAPES.LINE: {
      const rad = math.degToRad(cfg.angle! + rotation);
      const len = (cfg.length! / 2) * scale;
      return <line x1={x - Math.cos(rad) * len} y1={y - Math.sin(rad) * len} x2={x + Math.cos(rad) * len} y2={y + Math.sin(rad) * len} stroke={cfg.stroke} strokeWidth={cfg.strokeWidth} strokeLinecap={cfg.lineCap as any} opacity={opacity} />;
    }
    case SHAPES.STAR:
      return <path d={shapePaths.star(cfg.size! * scale, cfg.innerRatio, cfg.smoothness)} fill={cfg.fill} opacity={opacity} transform={transform} />;
    case SHAPES.TRIANGLE:
      return <path d={shapePaths.triangle(cfg.size! * scale)} fill={cfg.fill} opacity={opacity} transform={transform} />;
    case SHAPES.CROSS:
      return <path d={shapePaths.cross(cfg.size! * scale, (cfg.crossThickness || 6) * scale)} fill={cfg.fill} opacity={opacity} transform={transform} />;
    case SHAPES.DIAMOND:
      return <path d={shapePaths.diamond(cfg.size! * scale)} fill={cfg.fill} opacity={opacity} transform={transform} />;
    default: {
      if (isCustomSVG && cfg.customSVGPath) {
        const svgScale = scale * (cfg.customSVGNormalizedScale || 1) * (cfg.size || 10);
        const cx = cfg.customSVGCenterX || 0;
        const cy = cfg.customSVGCenterY || 0;
        return <path d={cfg.customSVGPath} fill={cfg.fill} opacity={opacity} transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${svgScale}) translate(${-cx}, ${-cy})`} />;
      }
      return null;
    }
  }
});
