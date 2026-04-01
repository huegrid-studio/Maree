import React, { useState } from 'react';
import { hapticClick } from '../../utils/haptics';

interface TessorFormatSelectorProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function TessorFormatSelector({
  value,
  options,
  onChange,
}: TessorFormatSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className={`grid ${options.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`} style={{ gap: 'var(--t-space-2)' }}>
      {options.map((option) => {
        const isSelected = value === option;
        const isHovered = hoveredOption === option && !isSelected;
        return (
          <button
            key={option}
            onClick={() => { hapticClick(); onChange(option); }}
            onMouseEnter={() => setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption(null)}
            className="flex items-center justify-center"
            style={{
              height: 'var(--t-control-h-lg)',
              borderRadius: 'var(--t-radius-md)',
              border: isSelected ? 'var(--t-border-w) solid var(--t-grid-selected-border)' : 'var(--t-border-w) solid var(--t-border-2)',
              background: isSelected ? 'var(--t-grid-selected-bg)' : isHovered ? 'var(--t-control-hover)' : 'var(--t-surface-0)',
              transition: 'background-color var(--t-duration-fast) ease-out',
            }}
          >
            <span
              style={{ fontSize: 'var(--t-font-xxs)', fontWeight: 'var(--t-font-weight)', color: isSelected ? 'var(--t-text)' : 'var(--t-text-4)' }}
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
