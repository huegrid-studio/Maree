import React, { useState } from 'react';

interface TessorInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function TessorInput({
  label,
  placeholder,
  value = '',
  onChange,
  disabled = false,
  icon,
}: TessorInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-1)' }}>
      {label && (
        <label
          style={{
            fontSize: 'var(--t-font-xs)',
            color: 'var(--t-text-4)',
            fontFamily: 'var(--t-font-family)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 'var(--t-control-h)',
          background: disabled ? 'var(--t-surface-0)' : 'var(--t-surface-1)',
          border: `var(--t-border-w) solid ${focused ? 'var(--t-border-focus)' : 'var(--t-border-1)'}`,
          borderRadius: 'var(--t-radius-md)',
          padding: '0 var(--t-space-2)',
          gap: 'var(--t-space-1-5)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color var(--t-duration-fast) ease',
          boxSizing: 'border-box',
        }}
      >
        {icon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--t-text-4)',
              flexShrink: 0,
              width: 'var(--t-icon-sm)',
              height: 'var(--t-icon-sm)',
            }}
          >
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 'var(--t-font-sm)',
            color: 'var(--t-text)',
            fontFamily: 'var(--t-font-family)',
            padding: 0,
            margin: 0,
            cursor: disabled ? 'not-allowed' : 'text',
            caretColor: 'var(--t-input-caret)',
          }}
        />
      </div>
    </div>
  );
}
