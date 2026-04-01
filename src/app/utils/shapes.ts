export const shapePaths = {
  rectangle: (w: number, h: number, r: number) => {
    const hw = w / 2;
    const hh = h / 2;
    const cr = Math.min(r, hw, hh);
    return `M ${-hw + cr} ${-hh} L ${hw - cr} ${-hh} Q ${hw} ${-hh} ${hw} ${-hh + cr} L ${hw} ${hh - cr} Q ${hw} ${hh} ${hw - cr} ${hh} L ${-hw + cr} ${hh} Q ${-hw} ${hh} ${-hw} ${hh - cr} L ${-hw} ${-hh + cr} Q ${-hw} ${-hh} ${-hw + cr} ${-hh} Z`;
  },
  triangle: (size: number) => {
    const h = size * Math.sqrt(3) / 2;
    return `M 0 ${-h * 2 / 3} L ${size / 2} ${h / 3} L ${-size / 2} ${h / 3} Z`;
  },
  cross: (size: number, thickness: number) => {
    const s = size / 2;
    const t = thickness / 2;
    return `M ${-t} ${-s} L ${t} ${-s} L ${t} ${-t} L ${s} ${-t} L ${s} ${t} L ${t} ${t} L ${t} ${s} L ${-t} ${s} L ${-t} ${t} L ${-s} ${t} L ${-s} ${-t} L ${-t} ${-t} Z`;
  },
  diamond: (size: number) => {
    const s = size / 2;
    return `M 0 ${-s} L ${s} 0 L 0 ${s} L ${-s} 0 Z`;
  },
  star: (size: number, innerRatio = 0.4, smoothness = 0.5) => {
    const points = 4;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * innerRatio;
    
    let path = '';
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevAngle = ((i - 1) * Math.PI) / points - Math.PI / 2;
        const prevRadius = (i - 1) % 2 === 0 ? outerRadius : innerRadius;
        const prevX = Math.cos(prevAngle) * prevRadius;
        const prevY = Math.sin(prevAngle) * prevRadius;
        
        if (smoothness > 0) {
          const cp1x = prevX + Math.cos(prevAngle + Math.PI / 2) * radius * smoothness * 0.5;
          const cp1y = prevY + Math.sin(prevAngle + Math.PI / 2) * radius * smoothness * 0.5;
          const cp2x = x + Math.cos(angle - Math.PI / 2) * radius * smoothness * 0.5;
          const cp2y = y + Math.sin(angle - Math.PI / 2) * radius * smoothness * 0.5;
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
    }
    path += ' Z';
    return path;
  },
};
