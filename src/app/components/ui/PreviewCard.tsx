import React, { useState, useRef, useEffect, useId } from 'react';
import { Settings2 } from 'lucide-react';
import { usePreviewCardContext } from '../../context/PreviewCardContext';

const CheckIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 256 256" style={style}>
    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" fill="currentColor" />
  </svg>
);

interface PreviewCardProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  style?: React.CSSProperties;
  isDirty?: boolean;
  onSave?: () => void;
}

export function PreviewCard({ title, children, controls, style, isDirty, onSave }: PreviewCardProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const cardId = useId();
  const { anyExpanded, expandedIds, register, unregister } = usePreviewCardContext();

  const isExpanded = expandedIds.has(cardId);
  const isDimmed = anyExpanded && !isExpanded;

  useEffect(() => {
    if (open) {
      register(cardId);
    } else {
      unregister(cardId);
    }
  }, [open, cardId, register, unregister]);

  useEffect(() => {
    return () => unregister(cardId);
  }, [cardId, unregister]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => {
      setHeight(wrapper.scrollHeight);
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const opacity = isDimmed && !hovered ? 0.3 : 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--t-surface-0)',
        borderRadius: 'var(--t-radius-lg)',
        padding: 'var(--t-space-4)',
        breakInside: 'avoid',
        marginBottom: 'var(--t-space-4)',
        opacity,
        transition: 'opacity var(--t-duration-lg) ease',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--t-space-3)' }}>
        <h3
          style={{
            fontSize: 'var(--t-font-sm)',
            color: 'var(--t-text-4)',
            fontWeight: 'var(--t-font-weight)',
            fontFamily: 'var(--t-font-family)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {controls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {open && isDirty && onSave && (
              <button
                onClick={(e) => { e.stopPropagation(); onSave(); }}
                onMouseEnter={() => setSaveHovered(true)}
                onMouseLeave={() => setSaveHovered(false)}
                style={{
                  width: 'var(--t-icon-lg)',
                  height: 'var(--t-icon-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--t-radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  color: saveHovered ? 'var(--t-accent)' : 'var(--t-text-4)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color var(--t-duration-base) ease',
                  flexShrink: 0,
                }}
                aria-label="Save component settings"
              >
                <CheckIcon style={{ width: 'var(--t-icon-sm)', height: 'var(--t-icon-sm)' }} />
              </button>
            )}
            <button
              onClick={() => setOpen(v => !v)}
              style={{
                width: 'var(--t-icon-lg)',
                height: 'var(--t-icon-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--t-radius-sm)',
                border: 'none',
                background: 'transparent',
                color: open ? 'var(--t-accent)' : 'var(--t-text-4)',
                cursor: 'pointer',
                padding: 0,
                transition: 'color var(--t-duration-base) ease',
                flexShrink: 0,
              }}
              aria-label="Toggle component controls"
            >
              <Settings2 style={{ width: 'var(--t-icon-sm)', height: 'var(--t-icon-sm)' }} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {children}

      {controls && (
        <div
          ref={wrapperRef}
          style={{
            overflow: 'hidden',
            transition: 'max-height var(--t-duration-lg) cubic-bezier(0.4, 0, 0.2, 1), opacity var(--t-duration-md) ease',
            maxHeight: open ? height : 0,
            opacity: open ? 1 : 0,
          }}
        >
          <div
            style={{
              borderTop: 'var(--t-border-w) solid var(--t-border-0)',
              marginTop: 'var(--t-space-3)',
              paddingTop: 'var(--t-space-3)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
              {controls}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
