import { Element } from '../types';
import { SHAPES } from '../constants';
import { createRandom } from './math';

export const generateElements = (config: {
  cols: number;
  rows: number;
  gapX: number;
  gapY: number;
  cellW: number;
  cellH: number;
  pattern: string[];
  sequence: string;
  seed: number;
  canvasW: number;
  canvasH: number;
}): Element[] => {
  const { cols, rows, gapX, gapY, cellW, cellH, pattern, sequence, seed, canvasW, canvasH } = config;
  const rng = createRandom(seed);
  const elements: Element[] = [];
  const totalW = cols * cellW + (cols - 1) * gapX;
  const totalH = rows * cellH + (rows - 1) * gapY;
  const offsetX = (canvasW - totalW) / 2;
  const offsetY = (canvasH - totalH) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      let shapeType: string;
      switch (sequence) {
        case 'checkerboard': shapeType = pattern[(row + col) % pattern.length]; break;
        case 'random': shapeType = rng.pick(pattern); break;
        case 'row': shapeType = pattern[row % pattern.length]; break;
        case 'col': shapeType = pattern[col % pattern.length]; break;
        default: shapeType = pattern[idx % pattern.length];
      }
      if (shapeType === SHAPES.EMPTY) continue;
      const x = offsetX + col * (cellW + gapX) + cellW / 2;
      const y = offsetY + row * (cellH + gapY) + cellH / 2;
      const nx = cols > 1 ? col / (cols - 1) : 0.5;
      const ny = rows > 1 ? row / (rows - 1) : 0.5;
      const dc = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.5, 2)) / 0.707;
      elements.push({ id: `e-${idx}`, idx, x, y, shapeType, nx, ny, dc, r: [rng.value(), rng.value()] });
    }
  }
  return elements;
};
