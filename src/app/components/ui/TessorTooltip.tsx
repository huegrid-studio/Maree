import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TessorTooltipStyleOverrides {
  background?: string;
  padding?: string;
  borderRadius?: string;
}

interface TessorTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  styleOverrides?: TessorTooltipStyleOverrides;
}

export function TessorTooltip({ content, children, position = 'top', styleOverrides }: TessorTooltipProps) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const isTop = position === 'top';

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            ...(isTop
              ? { bottom: '100%', marginBottom: 'var(--t-space-1)' }
              : { top: '100%', marginTop: 'var(--t-space-1)' }),
            background: styleOverrides?.background ?? 'var(--t-surface-5)',
            color: 'var(--t-text)',
            fontSize: 'var(--t-font-xxs)',
            fontFamily: 'var(--t-font-family)',
            borderRadius: styleOverrides?.borderRadius ?? 'var(--t-radius-sm)',
            padding: styleOverrides?.padding ?? 'var(--t-space-1) var(--t-space-1-5)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 50,
            lineHeight: 1,
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              ...(isTop
                ? { top: '100%', borderTop: `var(--t-space-1) solid ${styleOverrides?.background ?? 'var(--t-surface-5)'}`, borderLeft: 'var(--t-space-1) solid transparent', borderRight: 'var(--t-space-1) solid transparent' }
                : { bottom: '100%', borderBottom: `var(--t-space-1) solid ${styleOverrides?.background ?? 'var(--t-surface-5)'}`, borderLeft: 'var(--t-space-1) solid transparent', borderRight: 'var(--t-space-1) solid transparent' }),
              width: 0,
              height: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
