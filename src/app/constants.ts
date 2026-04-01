// Shape types
export const SHAPES = {
  RECT: 'Rectangle',
  DOT: 'Dot',
  LINE: 'Line',
  STAR: 'Star',
  SQUARE: 'Square',
  TRIANGLE: 'Triangle',
  CROSS: 'Cross',
  DIAMOND: 'Diamond',
  CUSTOM_SVG: 'CustomSVG',
  EMPTY: 'Empty',
} as const;

// Prefix for dynamic custom SVG shape keys (e.g. custom_svg_abc123)
export const CUSTOM_SVG_PREFIX = 'custom_svg_';

// Resolution presets
export const RESOLUTIONS: Record<string, { width: number; height: number }> = {
  'HD': { width: 1920, height: 1080 },
  '2K': { width: 2560, height: 1440 },
  '4K': { width: 3840, height: 2160 },
};
