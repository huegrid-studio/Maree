import React from 'react';
import { hapticClick } from '../../utils/haptics';

interface TessorButtonStyleOverrides {
  padding?: string;
  borderRadius?: string;
  fontSize?: string;
}

interface TessorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  tooltip?: string;
  styleOverrides?: TessorButtonStyleOverrides;
}

export function TessorButton({
  label,
  onClick,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  tooltip,
  styleOverrides,
}: TessorButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={() => { hapticClick(); onClick(); }}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : ''} transition-colors`}
        style={{
          height: 'var(--t-control-h-lg)',
          padding: styleOverrides?.padding,
          fontSize: styleOverrides?.fontSize ?? 'var(--t-font-xs)',
          fontWeight: 'var(--t-font-weight)',
          borderRadius: styleOverrides?.borderRadius ?? 'var(--t-radius-md)',
          background: disabled
            ? 'var(--t-surface-0)'
            : variant === 'primary'
            ? 'var(--t-accent)'
            : 'var(--t-surface-3)',
          color: disabled
            ? 'var(--t-text-6)'
            : variant === 'primary'
            ? 'var(--t-accent-contrast)'
            : 'var(--t-text)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {label}
      </button>
      {disabled && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
          style={{ padding: 'var(--t-space-1) var(--t-space-2)', fontSize: 'var(--t-font-xxs)', borderRadius: 'var(--t-radius-sm)', background: 'var(--t-surface-1)', color: 'var(--t-text)' }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
