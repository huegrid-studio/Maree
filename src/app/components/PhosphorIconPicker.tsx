import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

export const PHOSPHOR_CDN_BASE = 'https://unpkg.com/@phosphor-icons/core@2.1.1/assets/fill';

export const PHOSPHOR_ICONS = [
  'airplane-fill',
  'alarm-fill',
  'anchor-fill',
  'archive-fill',
  'arrow-circle-down-fill',
  'arrow-circle-left-fill',
  'arrow-circle-right-fill',
  'arrow-circle-up-fill',
  'baby-fill',
  'backpack-fill',
  'bank-fill',
  'battery-full-fill',
  'bell-fill',
  'bicycle-fill',
  'binoculars-fill',
  'bird-fill',
  'bookmark-fill',
  'brain-fill',
  'briefcase-fill',
  'bug-fill',
  'cake-fill',
  'camera-fill',
  'car-fill',
  'chart-bar-fill',
  'chat-circle-fill',
  'check-circle-fill',
  'circle-fill',
  'clock-fill',
  'cloud-fill',
  'clover-fill',
  'coffee-fill',
  'compass-fill',
  'confetti-fill',
  'cookie-fill',
  'cpu-fill',
  'crown-fill',
  'cube-fill',
  'currency-dollar-fill',
  'database-fill',
  'detective-fill',
  'diamond-fill',
  'dog-fill',
  'drop-fill',
  'egg-fill',
  'envelope-fill',
  'eye-fill',
  'feather-fill',
  'fire-fill',
  'fish-fill',
  'flag-fill',
  'flashlight-fill',
  'folder-fill',
  'football-fill',
  'funnel-fill',
  'game-controller-fill',
  'gear-fill',
  'gift-fill',
  'globe-fill',
  'graduation-cap-fill',
  'guitar-fill',
  'hand-fill',
  'heart-fill',
  'house-fill',
  'ice-cream-fill',
  'key-fill',
  'keyboard-fill',
  'leaf-fill',
  'lightning-fill',
  'link-fill',
  'lock-fill',
  'magic-wand-fill',
  'map-pin-fill',
  'medal-fill',
  'microphone-fill',
  'moon-fill',
  'mountains-fill',
  'music-note-fill',
  'palette-fill',
  'paw-print-fill',
  'pencil-fill',
  'phone-fill',
  'pizza-fill',
  'plant-fill',
  'plug-fill',
  'puzzle-piece-fill',
  'robot-fill',
  'rocket-fill',
  'scales-fill',
  'shield-fill',
  'shopping-cart-fill',
  'skull-fill',
  'snowflake-fill',
  'sparkle-fill',
  'star-fill',
  'sun-fill',
  'syringe-fill',
  'tag-fill',
  'target-fill',
  'thermometer-fill',
  'tree-fill',
  'trophy-fill',
  'umbrella-fill',
  'user-fill',
  'warning-fill',
  'wifi-high-fill',
  'wrench-fill',
];

const getIconUrl = (name: string) => `${PHOSPHOR_CDN_BASE}/${name}.svg`;

const getDisplayName = (slug: string) => {
  const withoutFill = slug.replace(/-fill$/, '');
  const first = withoutFill.split('-')[0] || 'Icon';
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const PhosphorIconCell: React.FC<{
  name: string;
  onClick: () => void;
}> = ({ name, onClick }) => {
  const [svgPath, setSvgPath] = useState<string>('');
  const [viewBox, setViewBox] = useState('0 0 256 256');

  useEffect(() => {
    const url = getIconUrl(name);
    fetch(url)
      .then(res => res.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (svg) {
          const vb = svg.getAttribute('viewBox');
          if (vb) setViewBox(vb);
        }
        const path = doc.querySelector('path');
        if (path) {
          setSvgPath(path.getAttribute('d') || '');
        }
      })
      .catch(() => {});
  }, [name]);

  return (
    <button
      onClick={onClick}
      title={getDisplayName(name)}
      className="rounded flex items-center justify-center transition-all cursor-pointer"
      style={{
        width: 'var(--t-control-h-lg)', height: 'var(--t-control-h-lg)',
        border: 'var(--t-border-w) solid var(--t-picker-cell-border)',
        background: 'var(--t-picker-cell-bg)',
        color: 'var(--t-picker-cell-text)',
      }}
    >
      {svgPath ? (
        <svg viewBox={viewBox} style={{ width: 'var(--t-icon-2xl)', height: 'var(--t-icon-2xl)' }}>
          <path d={svgPath} fill="currentColor" />
        </svg>
      ) : (
        <div className="rounded animate-pulse" style={{ width: 'var(--t-icon-lg)', height: 'var(--t-icon-lg)', background: 'var(--t-picker-loading-bg)' }} />
      )}
    </button>
  );
};

interface PhosphorIconPickerProps {
  onSelect: (iconName: string, svgText: string) => void;
  onClose: () => void;
}

export const PhosphorIconPicker: React.FC<PhosphorIconPickerProps> = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? PHOSPHOR_ICONS.filter(name => name.includes(query.trim().toLowerCase()))
    : PHOSPHOR_ICONS;

  const handleIconClick = async (name: string) => {
    const url = getIconUrl(name);
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const text = await res.text();
      onSelect(name, text);
    } catch {
    }
  };

  return (
    <div
      className="absolute bottom-full left-0 mb-2 z-50 flex flex-col overflow-hidden"
      style={{ width: 'var(--t-picker-w)', maxHeight: 'var(--t-picker-max-h)', borderRadius: 'var(--t-radius-xl)', background: 'var(--t-picker-bg)', border: 'var(--t-border-w) solid var(--t-picker-border)', boxShadow: 'var(--t-shadow)' }}
    >
      <div className="flex items-center" style={{ gap: 'var(--t-space-2)', padding: 'var(--t-space-2) var(--t-space-3)', borderBottom: 'var(--t-border-w) solid var(--t-border-0)' }}>
        <Search className="shrink-0" style={{ width: 'var(--t-icon-md)', height: 'var(--t-icon-md)', color: 'var(--t-grid-text-dim)' }} />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 'var(--t-font-sm)', color: 'var(--t-picker-search-text)' }}
        />
        <button onClick={onClose} className="transition-colors" style={{ color: 'var(--t-picker-close)' }}>
          <X style={{ width: 'var(--t-icon-md)', height: 'var(--t-icon-md)' }} />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ padding: 'var(--t-space-2)' }}>
        {filtered.length === 0 ? (
          <p className="text-center" style={{ fontSize: 'var(--t-font-xs)', padding: 'var(--t-space-4) 0', color: 'var(--t-picker-empty-text)' }}>No icons found</p>
        ) : (
          <div className="flex flex-wrap" style={{ gap: 'var(--t-space-2)' }}>
            {filtered.map(name => (
              <PhosphorIconCell key={name} name={name} onClick={() => handleIconClick(name)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { getDisplayName as getPhosphorDisplayName, getIconUrl as getPhosphorIconUrl };
