export const DEFAULT_CONFIG = {
  canvas: {
    aspectRatio: '16:9',
    resolution: 'HD',
    bgColor: '#ebebeb'
  },
  grid: {
    cols: 30,
    rows: 27,
    gapX: 10,
    gapY: 10,
    cellW: 32,
    cellH: 32,
    seed: 42
  },
  pattern: {
    elements: ['Line'],
    sequence: 'sequential'
  },
  transforms: {
    rotMode: 'radial',
    rotAmt: 120,
    scaleMode: 'uniform',
    scaleAmt: 1,
    opacityMode: 'uniform',
    opacityAmt: 1,
    waveFreq: 1,
    wavePhase: 0
  },
  rect: {
    width: 60,
    height: 20,
    radius: 4,
    fill: '#ffffff',
    opacity: 1
  },
  square: {
    size: 24,
    radius: 4,
    fill: '#ffffff',
    opacity: 1
  },
  dot: {
    radius: 10,
    fill: '#00ff88',
    opacity: 1
  },
  line: {
    length: 24,
    angle: 45,
    stroke: '#333333',
    strokeWidth: 2,
    lineCap: 'round',
    opacity: 1
  },
  star: {
    size: 30,
    innerRatio: 0.4,
    smoothness: 0.5,
    fill: '#ffaa00',
    opacity: 1
  },
  triangle: {
    size: 24,
    fill: '#ff5577',
    opacity: 1
  },
  cross: {
    size: 24,
    crossThickness: 6,
    fill: '#44aaff',
    opacity: 1
  },
  diamond: {
    size: 24,
    fill: '#aa55ff',
    opacity: 1
  },
  animation: {
    enabled: true,
    duration: 8200,
    easing: 'easeInOutSine',
    direction: 'normal',
    staggerType: 'none',
    staggerAmount: 50,
    rotationEnabled: true,
    rotationFrom: 0,
    rotationTo: 360,
    scaleEnabled: false,
    scaleFrom: 1,
    scaleTo: 1,
    scaleXEnabled: false,
    scaleXFrom: 1,
    scaleXTo: 1,
    scaleYEnabled: false,
    scaleYFrom: 1,
    scaleYTo: 1,
    opacityEnabled: true,
    opacityFrom: 1,
    opacityTo: 1,
    translateXEnabled: false,
    translateXFrom: 0,
    translateXTo: 0,
    translateYEnabled: false,
    translateYFrom: 0,
    translateYTo: 0
  },
  clip: {
    preset: 'None',
    customSVGPath: '',
    customSVGName: '',
    customSVGViewBox: {
      width: 100,
      height: 100
    },
    customSVGCenterX: 0,
    customSVGCenterY: 0,
    customSVGNormalizedScale: 1,
    scale: 10
  }
};
