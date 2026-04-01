import { RESOLUTIONS } from '../constants';

export const calcCanvasSize = (aspectRatio: string, resolution: string): { width: number; height: number } => {
  const res = RESOLUTIONS[resolution] || RESOLUTIONS['HD'];
  const [w, h] = aspectRatio.split(':').map(Number);
  const aspect = w / h;
  
  if (aspect >= 1) {
    return { width: res.width, height: Math.round(res.width / aspect) };
  } else {
    return { width: Math.round(res.height * aspect), height: res.height };
  }
};
