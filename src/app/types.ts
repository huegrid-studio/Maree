export interface Element {
  id: string;
  idx: number;
  x: number;
  y: number;
  shapeType: string;
  nx: number;
  ny: number;
  dc: number;
  r: [number, number];
}

export interface CustomSVGItem {
  id: string;
  name: string;
  svgContent: string;
  viewBox: { width: number; height: number };
  config: ShapeConfig;
}

export interface ShapeConfig {
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  opacity?: number;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;
  lineCap?: string;
  length?: number;
  angle?: number;
  size?: number;
  innerRatio?: number;
  smoothness?: number;
  crossThickness?: number;
  customSVGPath?: string;
  customSVGCenterX?: number;
  customSVGCenterY?: number;
  customSVGNormalizedScale?: number;
}

export interface CanvasConfig {
  aspectRatio: string;
  resolution: string;
  bgColor: string;
}

export interface GridConfig {
  cols: number;
  rows: number;
  gapX: number;
  gapY: number;
  cellW: number;
  cellH: number;
  seed: number;
}

export interface PatternConfig {
  elements: string[];
  sequence: string;
}

export interface TransformConfig {
  rotMode: string;
  rotAmt: number;
  scaleMode: string;
  scaleAmt: number;
  opacityMode: string;
  opacityAmt: number;
  waveFreq: number;
  wavePhase: number;
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  direction: string;
  staggerType: string;
  staggerAmount: number;
  rotationEnabled: boolean;
  rotationFrom: number;
  rotationTo: number;
  scaleEnabled: boolean;
  scaleFrom: number;
  scaleTo: number;
  scaleXEnabled: boolean;
  scaleXFrom: number;
  scaleXTo: number;
  scaleYEnabled: boolean;
  scaleYFrom: number;
  scaleYTo: number;
  opacityEnabled: boolean;
  opacityFrom: number;
  opacityTo: number;
  translateXEnabled: boolean;
  translateXFrom: number;
  translateXTo: number;
  translateYEnabled: boolean;
  translateYFrom: number;
  translateYTo: number;
}

export interface ClipConfig {
  preset: string;
  customSVGPath: string;
  customSVGName: string;
  customSVGViewBox: { width: number; height: number };
  customSVGCenterX: number;
  customSVGCenterY: number;
  customSVGNormalizedScale: number;
  scale: number;
}
