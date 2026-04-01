import React from 'react';

interface TessorProgressProps {
  value: number;
  showLabel?: boolean;
}

export function TessorProgress({ value, showLabel = false }: TessorProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-1)', width: '100%' }}>
      {showLabel && (
        <span
          style={{
            fontSize: 'var(--t-font-xxs)',
            color: 'var(--t-text-3)',
            fontFamily: 'var(--t-font-family)',
            textAlign: 'right',
          }}
        >
          {Math.round(clamped)}%
        </span>
      )}
      <div
        style={{
          width: '100%',
          height: 'var(--t-space-1)',
          borderRadius: 'var(--t-radius-full)',
          background: 'var(--t-surface-1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            borderRadius: 'var(--t-radius-full)',
            background: 'var(--t-accent)',
            transition: 'width var(--t-duration-md) ease',
          }}
        />
      </div>
    </div>
  );
}
