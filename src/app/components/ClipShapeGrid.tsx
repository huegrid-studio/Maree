import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { hapticClick } from '../utils/haptics';

interface ClipShapeGridProps {
  selectedPreset: string;
  onSelect: (preset: string) => void;
  onCustomUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CLIP_SHAPES = [
  'alarm-fill',
  'app-window-fill',
  'arrow-fat-down-fill',
  'arrow-fat-left-fill',
  'arrow-fat-right-fill',
  'arrow-fat-up-fill',
  'bell-fill',
  'book-fill',
  'book-open-fill',
  'bookmark-simple-fill',
  'chart-donut-fill',
  'chat-fill',
  'chat-teardrop-fill',
  'circles-four-fill',
  'circles-three-fill',
  'clock-fill',
  'cloud-fill',
  'club-fill',
  'coda-logo-fill',
  'compass-fill',
  'confetti-fill',
  'cpu-fill',
  'crown-simple-fill',
  'cursor-fill',
  'device-mobile-camera-fill',
  'diamond-fill',
  'dice-six-fill',
];

const getSVGUrl = (shape: string) => {
  return new URL(`../../../clip_svgs/${shape}.svg`, import.meta.url).href;
};

const ClipShapeIcon: React.FC<{ shape: string }> = ({ shape }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const svgUrl = getSVGUrl(shape);
    fetch(svgUrl)
      .then(res => res.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const path = doc.querySelector('path');
        if (path) {
          const d = path.getAttribute('d');
          setSvgContent(d || '');
        }
      })
      .catch(err => console.error('Error loading SVG:', err));
  }, [shape]);

  if (!svgContent) return null;

  return (
    <svg viewBox="0 0 256 256" className="w-full h-full">
      <path d={svgContent} fill="currentColor" />
    </svg>
  );
};

export const ClipShapeGrid: React.FC<ClipShapeGridProps> = ({ selectedPreset, onSelect, onCustomUpload }) => {
  return (
    <div className="grid grid-cols-6" style={{ gap: 'var(--t-space-2)' }}>
      <label
        className="rounded flex items-center justify-center cursor-pointer transition-all"
        style={{
          width: 'var(--t-control-h-lg)', height: 'var(--t-control-h-lg)',
          border: selectedPreset === 'Custom' ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-grid-border)',
          background: selectedPreset === 'Custom' ? 'var(--t-grid-selected-bg)' : 'var(--t-grid-bg)',
        }}
      >
        <input 
          type="file" 
          accept=".svg" 
          className="hidden" 
          onChange={onCustomUpload}
        />
        <Upload style={{ width: 'var(--t-space-5)', height: 'var(--t-space-5)', color: 'var(--t-grid-text)' }} />
      </label>

      {CLIP_SHAPES.map((shape) => (
        <button
          key={shape}
          onClick={() => { hapticClick(); onSelect(shape); }}
          className="rounded flex items-center justify-center cursor-pointer transition-all"
          style={{
            width: 'var(--t-control-h-lg)', height: 'var(--t-control-h-lg)',
            border: selectedPreset === shape ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-grid-border)',
            background: selectedPreset === shape ? 'var(--t-grid-selected-bg)' : 'var(--t-grid-bg)',
          }}
        >
          <img 
            src={new URL(`../../../clip_svgs/${shape}.svg`, import.meta.url).href}
            alt={shape}
            className="object-contain"
            style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)', filter: 'var(--t-clip-invert)' }}
          />
        </button>
      ))}
    </div>
  );
};
