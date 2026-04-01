import React, { useState } from 'react';
import { hapticClick } from '../../utils/haptics';

interface ResolutionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const resolutions = [
  { value: '4K', label: '4K', size: 100 },
  { value: '2K', label: '2K', size: 75 },
  { value: 'HD', label: 'HD', size: 50 },
];

function DotPattern({ id }: { id: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 'var(--t-radius-md)' }}
    >
      <defs>
        <pattern id={`dot-${id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.5" style={{ fill: 'var(--t-text-6)' }} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dot-${id})`} />
    </svg>
  );
}

export function ResolutionSelector({ value, onChange }: ResolutionSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--t-space-2)' }}>
      <label className="uppercase tracking-wide" style={{ fontSize: 'var(--t-font-xs)', fontWeight: 'var(--t-font-weight)', color: 'var(--t-text-4)' }}>
        Resolution
      </label>
      <div 
        className="relative w-full"
        style={{ aspectRatio: '21 / 9' }}
      >
        <div className="absolute inset-0 flex items-end justify-start">
          {resolutions.map((res) => {
            const isSelected = value === res.value;
            const isHovered = hoveredOption === res.value && !isSelected;
            return (
              <button
                key={res.value}
                onClick={() => { hapticClick(); onChange(res.value); }}
                onMouseEnter={() => setHoveredOption(res.value)}
                onMouseLeave={() => setHoveredOption(null)}
                className="absolute overflow-hidden"
                style={{
                  width: `${res.size}%`,
                  aspectRatio: '21 / 9',
                  border: isSelected ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-border-2)',
                  background: isSelected ? 'transparent' : isHovered ? 'var(--t-control-hover)' : 'var(--t-surface-0)',
                  zIndex: res.value === 'HD' ? 30 : res.value === '2K' ? 20 : 10,
                  bottom: res.value === 'HD' ? 'var(--t-space-2)' : res.value === '2K' ? 'var(--t-space-1)' : '0',
                  left: res.value === 'HD' ? 'var(--t-space-2)' : res.value === '2K' ? 'var(--t-space-1)' : '0',
                  borderRadius: 'var(--t-radius-md)',
                  transition: 'background-color var(--t-duration-fast) ease-out',
                }}
              >
                {isSelected && <DotPattern id={res.value} />}
                <span
                  className="absolute pointer-events-none"
                  style={{ top: 'var(--t-space-1)', right: 'var(--t-space-2)', fontSize: 'var(--t-font-xxs)', fontWeight: 'var(--t-font-weight)', color: isSelected ? 'var(--t-text)' : 'var(--t-text-5)', zIndex: 1 }}
                >
                  {res.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
