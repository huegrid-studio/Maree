import { parseSVG } from './svg-parser';

export const CLIPS: Record<string, (w: number, h: number) => string> = {
  'Circle': (w, h) => {
    const r = Math.min(w, h) / 2;
    const cx = w / 2;
    const cy = h / 2;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`;
  },
  'Rectangle': (w, h) => {
    const margin = Math.min(w, h) * 0.1;
    return `M ${margin} ${margin} L ${w - margin} ${margin} L ${w - margin} ${h - margin} L ${margin} ${h - margin} Z`;
  },
};

/**
 * Load and parse an SVG file for clipping
 */
export const loadClipSVG = async (svgPath: string): Promise<{
  path: string;
  centerX: number;
  centerY: number;
  scale: number;
  viewBox: { width: number; height: number };
} | null> => {
  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      console.error(`Failed to fetch SVG: ${svgPath}, status: ${response.status}`);
      return null;
    }
    const svgText = await response.text();
    const parsed = parseSVG(svgText);
    if (!parsed) {
      console.error(`Failed to parse SVG: ${svgPath}`);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Error loading clip SVG:', error);
    return null;
  }
};