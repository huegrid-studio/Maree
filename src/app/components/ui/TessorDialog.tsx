import React, { useEffect, useRef } from 'react';
import { TessorButton } from './TessorButton';

interface TessorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function TessorDialog({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
}: TessorDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--t-surface-0)',
          opacity: 0.8,
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          background: 'var(--t-surface-0)',
          border: 'var(--t-border-w) solid var(--t-border-0)',
          borderRadius: 'var(--t-radius-xl)',
          boxShadow: 'var(--t-shadow-panel)',
          padding: 'var(--t-space-5)',
          minWidth: '280px',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--t-space-4)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--t-font-md)',
            color: 'var(--t-text)',
            fontFamily: 'var(--t-font-family)',
            fontWeight: 'var(--t-font-weight)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: 'var(--t-font-sm)',
            color: 'var(--t-text-3)',
            fontFamily: 'var(--t-font-family)',
            lineHeight: 'var(--t-line-height)',
          }}
        >
          {children}
        </div>
        <div style={{ display: 'flex', gap: 'var(--t-space-2)', justifyContent: 'flex-end' }}>
          <TessorButton label={cancelLabel} onClick={onClose} variant="secondary" fullWidth={false} />
          {onConfirm && (
            <TessorButton label={confirmLabel} onClick={onConfirm} variant="primary" fullWidth={false} />
          )}
        </div>
      </div>
    </div>
  );
}
