/**
 * Calculate bounding box of an SVG path
 */
const getPathBounds = (pathString: string): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('style', 'position: absolute; visibility: hidden;');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);
  svg.appendChild(path);
  document.body.appendChild(svg);
  
  const bbox = path.getBBox();
  document.body.removeChild(svg);
  
  return {
    minX: bbox.x,
    minY: bbox.y,
    maxX: bbox.x + bbox.width,
    maxY: bbox.y + bbox.height,
    width: bbox.width,
    height: bbox.height
  };
};

/**
 * Normalize SVG path to be centered at 0,0 with specified size
 * Returns the path itself and metadata
 */
const normalizePath = (pathString: string, targetSize = 100): { path: string; originalWidth: number; originalHeight: number; centerX: number; centerY: number; scale: number } => {
  try {
    const bounds = getPathBounds(pathString);
    const width = bounds.width;
    const height = bounds.height;
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;
    
    // Calculate scale to fit target size
    const scale = targetSize / Math.max(width, height);
    
    // Return original path with metadata for transformation
    // We'll apply the transform in the SVG instead of modifying the path data
    return {
      path: pathString,
      originalWidth: width,
      originalHeight: height,
      centerX,
      centerY,
      scale
    };
  } catch (error) {
    console.error('Error normalizing path:', error);
    return { path: pathString, originalWidth: 100, originalHeight: 100, centerX: 50, centerY: 50, scale: 1 };
  }
};

export const parseSVG = (svgContent: string): { path: string; viewBox: { width: number; height: number }; centerX: number; centerY: number; scale: number; originalWidth: number; originalHeight: number } | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) return null;

    // Extract viewBox or width/height
    const viewBox = svg.getAttribute('viewBox');
    let width = 100, height = 100;
    
    if (viewBox) {
      const parts = viewBox.split(/\s+|,/).map(Number);
      width = parts[2] || 100;
      height = parts[3] || 100;
    } else {
      width = parseFloat(svg.getAttribute('width') || '100');
      height = parseFloat(svg.getAttribute('height') || '100');
    }

    // Try to extract path data
    const paths: string[] = [];
    
    // Get all path elements
    const pathElements = doc.querySelectorAll('path');
    pathElements.forEach(pathEl => {
      const d = pathEl.getAttribute('d');
      if (d) paths.push(d);
    });

    // Get basic shapes and convert to paths
    const circles = doc.querySelectorAll('circle');
    circles.forEach(circle => {
      const cx = parseFloat(circle.getAttribute('cx') || '0');
      const cy = parseFloat(circle.getAttribute('cy') || '0');
      const r = parseFloat(circle.getAttribute('r') || '0');
      paths.push(`M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`);
    });

    const rects = doc.querySelectorAll('rect');
    rects.forEach(rect => {
      // Skip rects with fill="none" as they're typically backgrounds
      const fill = rect.getAttribute('fill');
      if (fill === 'none') return;
      
      const x = parseFloat(rect.getAttribute('x') || '0');
      const y = parseFloat(rect.getAttribute('y') || '0');
      const w = parseFloat(rect.getAttribute('width') || '0');
      const h = parseFloat(rect.getAttribute('height') || '0');
      paths.push(`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`);
    });

    const ellipses = doc.querySelectorAll('ellipse');
    ellipses.forEach(ellipse => {
      const cx = parseFloat(ellipse.getAttribute('cx') || '0');
      const cy = parseFloat(ellipse.getAttribute('cy') || '0');
      const rx = parseFloat(ellipse.getAttribute('rx') || '0');
      const ry = parseFloat(ellipse.getAttribute('ry') || '0');
      paths.push(`M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`);
    });

    const polygons = doc.querySelectorAll('polygon');
    polygons.forEach(polygon => {
      const points = polygon.getAttribute('points');
      if (points) {
        const coords = points.trim().split(/\s+|,/).map(Number);
        let pathData = '';
        for (let i = 0; i < coords.length; i += 2) {
          const cmd = i === 0 ? 'M' : 'L';
          pathData += `${cmd} ${coords[i]} ${coords[i + 1]} `;
        }
        pathData += 'Z';
        paths.push(pathData);
      }
    });

    const polylines = doc.querySelectorAll('polyline');
    polylines.forEach(polyline => {
      const points = polyline.getAttribute('points');
      if (points) {
        const coords = points.trim().split(/\s+|,/).map(Number);
        let pathData = '';
        for (let i = 0; i < coords.length; i += 2) {
          const cmd = i === 0 ? 'M' : 'L';
          pathData += `${cmd} ${coords[i]} ${coords[i + 1]} `;
        }
        paths.push(pathData);
      }
    });

    if (paths.length === 0) return null;

    const combinedPath = paths.join(' ');
    
    // Normalize the path to be centered at 0,0
    const normalized = normalizePath(combinedPath, 100);

    return {
      path: normalized.path,
      centerX: normalized.centerX,
      centerY: normalized.centerY,
      scale: normalized.scale,
      originalWidth: normalized.originalWidth,
      originalHeight: normalized.originalHeight,
      viewBox: { width, height }
    };
  } catch (error) {
    console.error('Error parsing SVG:', error);
    return null;
  }
};