import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { SHAPES, CUSTOM_SVG_PREFIX } from '../constants';
import type { CustomSVGItem } from '../types';
import { PhosphorIconPicker } from './PhosphorIconPicker';
import { hapticClick } from '../utils/haptics';

interface ElementComboGridStyleOverrides {
  itemSize?: number;
  gap?: number;
}

interface ElementComboGridProps {
  selectedElements: string[];
  onToggle: (element: string) => void;
  onCustomUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  customSVGItems: CustomSVGItem[];
  onPhosphorSelect: (iconName: string, svgText: string) => void;
  styleOverrides?: ElementComboGridStyleOverrides;
}

const LINE_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }} fill="none">
    <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DOT_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <circle cx="12" cy="12" r="7" fill="currentColor" />
  </svg>
);

const SQUARE_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <rect x="4" y="4" width="16" height="16" fill="currentColor" rx="1.5" />
  </svg>
);

const RECTANGLE_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <rect x="2" y="7" width="20" height="10" fill="currentColor" rx="1.5" />
  </svg>
);

const STAR_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <path
      d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z"
      fill="currentColor"
    />
  </svg>
);

const TRIANGLE_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <path d="M12 4 L21 20 L3 20 Z" fill="currentColor" />
  </svg>
);

const CROSS_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <path d="M9 3 L15 3 L15 9 L21 9 L21 15 L15 15 L15 21 L9 21 L9 15 L3 15 L3 9 L9 9 Z" fill="currentColor" />
  </svg>
);

const DIAMOND_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
    <path d="M12 3 L21 12 L12 21 L3 12 Z" fill="currentColor" />
  </svg>
);

const PHOSPHOR_TRIGGER_ICON = (
  <svg viewBox="0 0 24 24" style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }} fill="currentColor">
    <circle cx="5" cy="5" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="12" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
  </svg>
);

const ELEMENTS = [
  { key: SHAPES.LINE,     label: 'Line',      icon: LINE_ICON },
  { key: SHAPES.DOT,      label: 'Dot',       icon: DOT_ICON },
  { key: SHAPES.SQUARE,   label: 'Square',    icon: SQUARE_ICON },
  { key: SHAPES.RECT,     label: 'Rect',      icon: RECTANGLE_ICON },
  { key: SHAPES.STAR,     label: 'Star',      icon: STAR_ICON },
  { key: SHAPES.TRIANGLE, label: 'Triangle',  icon: TRIANGLE_ICON },
  { key: SHAPES.CROSS,    label: 'Cross',     icon: CROSS_ICON },
  { key: SHAPES.DIAMOND,  label: 'Diamond',   icon: DIAMOND_ICON },
];

export const ElementComboGrid: React.FC<ElementComboGridProps> = ({
  selectedElements,
  onToggle,
  onCustomUpload,
  onRemove,
  customSVGItems,
  onPhosphorSelect,
  styleOverrides,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phosphorWrapperRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!pickerOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (phosphorWrapperRef.current && !phosphorWrapperRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [pickerOpen]);

  const isSelected = (key: string) => selectedElements.includes(key);

  const cellSize = styleOverrides?.itemSize != null ? `${styleOverrides.itemSize}px` : 'var(--t-control-h-lg)';

  const cellStyle = (selected: boolean): React.CSSProperties => ({
    width: cellSize,
    height: cellSize,
    border: selected ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-grid-border)',
    background: selected ? 'var(--t-grid-selected-bg)' : 'var(--t-grid-bg)',
    color: selected ? 'var(--t-text)' : 'var(--t-grid-text)',
    borderRadius: 'var(--t-radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all var(--t-duration-base)',
  });

  const handlePhosphorSelect = useCallback((iconName: string, svgText: string) => {
    setPickerOpen(false);
    onPhosphorSelect(iconName, svgText);
  }, [onPhosphorSelect]);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--t-space-2)' }}>
      <div className="grid grid-cols-6" style={{ gap: styleOverrides?.gap != null ? `${styleOverrides.gap}px` : 'var(--t-space-2)' }}>
        {ELEMENTS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { hapticClick(); onToggle(key); }}
            style={cellStyle(isSelected(key))}
            title={label}
          >
            {icon}
          </button>
        ))}

        {customSVGItems.map(item => {
          const shapeKey = `${CUSTOM_SVG_PREFIX}${item.id}`;
          const selected = isSelected(shapeKey);
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => { hapticClick(); onToggle(shapeKey); }}
                style={cellStyle(selected)}
                title={`${item.name} — click to ${selected ? 'deselect' : 'select'}`}
              >
                <svg
                  viewBox={`0 0 ${item.viewBox.width} ${item.viewBox.height}`}
                  style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}
                >
                  <path d={item.config.customSVGPath || ''} fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                className="absolute rounded-full flex items-center justify-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity cursor-pointer"
                style={{ top: 'calc(-1 * var(--t-space-1-5))', right: 'calc(-1 * var(--t-space-1-5))', width: 'var(--t-icon-base)', height: 'var(--t-icon-base)', background: 'var(--t-grid-delete-bg)' }}
                title="Remove"
              >
                <X style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)', color: 'var(--t-text)' }} strokeWidth={3} />
              </button>
            </div>
          );
        })}

        {customSVGItems.length < 5 && (
          <div ref={phosphorWrapperRef} className="relative">
            <button
              onClick={() => setPickerOpen(prev => !prev)}
              className="rounded flex items-center justify-center cursor-pointer transition-all"
              style={{
                width: cellSize,
                height: cellSize,
                border: pickerOpen
                  ? 'var(--t-border-w) solid var(--t-grid-selected-border)'
                  : 'var(--t-border-w) dashed var(--t-grid-dashed-border)',
                background: pickerOpen ? 'var(--t-grid-selected-bg)' : 'transparent',
                color: pickerOpen ? 'var(--t-text)' : 'var(--t-grid-text-dim)',
              }}
              title="Pick a Phosphor icon"
            >
              {PHOSPHOR_TRIGGER_ICON}
            </button>
            {pickerOpen && (
              <PhosphorIconPicker
                onSelect={handlePhosphorSelect}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>
        )}

        {customSVGItems.length < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded flex items-center justify-center cursor-pointer transition-all"
            style={{
              width: cellSize,
              height: cellSize,
              border: '1px dashed var(--t-grid-dashed-border)',
              color: 'var(--t-grid-text-dim)',
            }}
            title="Upload a custom SVG"
          >
            <Upload style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          className="hidden"
          onChange={onCustomUpload}
        />
      </div>
    </div>
  );
};
