import React from 'react';
import { hapticToggle } from '../../utils/haptics';

interface TessorSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function TessorSwitch({ label, checked, onChange, disabled = false }: TessorSwitchProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        gap: 'var(--t-space-3)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--t-font-sm)',
          color: 'var(--t-text)',
          fontFamily: 'var(--t-font-family)',
        }}
      >
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => { if (disabled) return; hapticToggle(!checked); onChange(!checked); }}
        style={{
          position: 'relative',
          width: 'var(--t-toggle-w)',
          height: 'var(--t-toggle-h)',
          borderRadius: 'var(--t-radius-full)',
          background: 'var(--t-toggle-track)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'background var(--t-duration-base) ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '50%',
            transform: `translateY(-50%) translateX(${checked ? 'calc(var(--t-toggle-w) - var(--t-toggle-knob-size) - var(--t-space-0-5))' : 'var(--t-space-0-5)'})`,
            width: 'var(--t-toggle-knob-size)',
            height: 'var(--t-toggle-knob-size)',
            borderRadius: 'var(--t-radius-full)',
            background: checked ? 'var(--t-toggle-knob-on)' : 'var(--t-toggle-knob-off)',
            boxShadow: checked ? 'var(--t-toggle-knob-on-glow)' : 'none',
            transition: 'transform var(--t-duration-base) ease, background var(--t-duration-base) ease, box-shadow var(--t-duration-base) ease',
            left: 0,
          }}
        />
      </button>
    </label>
  );
}
