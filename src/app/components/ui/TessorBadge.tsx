import React from 'react';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error';

interface TessorBadgeStyleOverrides {
  padding?: string;
  borderRadius?: string;
}

interface TessorBadgeProps {
  label: string;
  variant?: BadgeVariant;
  styleOverrides?: TessorBadgeStyleOverrides;
}

const variantStyles: Record<BadgeVariant, { background: string; color: string }> = {
  default: { background: 'var(--t-surface-3)', color: 'var(--t-text-2)' },
  accent: { background: 'var(--t-accent)', color: 'var(--t-accent-contrast)' },
  success: { background: 'var(--t-surface-3)', color: 'var(--t-accent-text)' },
  warning: { background: 'var(--t-surface-4)', color: 'var(--t-accent-subtle)' },
  error: { background: 'var(--t-surface-4)', color: 'var(--t-text)' },
};

export function TessorBadge({ label, variant = 'default', styleOverrides }: TessorBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 'var(--t-font-xxs)',
        fontFamily: 'var(--t-font-family)',
        fontWeight: 'var(--t-font-weight)',
        lineHeight: 1,
        padding: styleOverrides?.padding ?? 'var(--t-space-0-5) var(--t-space-1-5)',
        borderRadius: styleOverrides?.borderRadius ?? 'var(--t-radius-full)',
        background: styles.background,
        color: styles.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
