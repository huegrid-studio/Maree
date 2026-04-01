import React, { useState } from 'react';
import { hapticClick } from '../../utils/haptics';

interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const aspectRatios = [
  { value: '16:9', width: 48, height: 27 },
  { value: '9:16', width: 27, height: 48 },
  { value: '4:3', width: 48, height: 36 },
  { value: '1:1', width: 40, height: 40 },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--t-space-2)' }}>
      <label className="uppercase tracking-wide" style={{ fontSize: 'var(--t-font-xs)', fontWeight: 'var(--t-font-weight)', color: 'var(--t-text-4)' }}>
        Aspect Ratio
      </label>
      <div className="grid grid-cols-4" style={{ gap: 'var(--t-space-2)' }}>
        {aspectRatios.map((ratio) => {
          const isSelected = value === ratio.value;
          const isHovered = hoveredOption === ratio.value && !isSelected;
          return (
            <button
              key={ratio.value}
              onClick={() => { hapticClick(); onChange(ratio.value); }}
              onMouseEnter={() => setHoveredOption(ratio.value)}
              onMouseLeave={() => setHoveredOption(null)}
              className="flex items-center justify-center"
              style={{
                width: '100%',
                aspectRatio: `${ratio.width} / ${ratio.height}`,
                borderRadius: 'var(--t-radius-md)',
                border: isSelected ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-border-2)',
                background: isSelected ? 'var(--t-grid-selected-bg)' : isHovered ? 'var(--t-control-hover)' : 'var(--t-surface-0)',
                transition: 'background-color var(--t-duration-fast) ease-out',
              }}
            >
              <span
                style={{ fontSize: 'var(--t-font-xxs)', fontWeight: 'var(--t-font-weight)', color: isSelected ? 'var(--t-text)' : 'var(--t-text-4)' }}
              >
                {ratio.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
