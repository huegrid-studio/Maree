import React, { useState, useRef, useEffect, useId } from 'react';
import { Settings2 } from 'lucide-react';
import { usePreviewCardContext } from '../../context/PreviewCardContext';

interface PreviewCardProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  style?: React.CSSProperties;
}

export function PreviewCard({ title, children, controls, style }: PreviewCardProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
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
            color: 'var(--t-text-5)',
            fontWeight: 'var(--t-font-weight)',
            fontFamily: 'var(--t-font-family)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {controls && (
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
              color: open ? 'var(--t-accent)' : 'var(--t-text-5)',
              cursor: 'pointer',
              padding: 0,
              transition: 'color var(--t-duration-base) ease',
              flexShrink: 0,
            }}
            aria-label="Toggle component controls"
          >
            <Settings2 style={{ width: 'var(--t-icon-sm)', height: 'var(--t-icon-sm)' }} strokeWidth={1.5} />
          </button>
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
