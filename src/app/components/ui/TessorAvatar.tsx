import React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface TessorAvatarProps {
  src?: string;
  initials?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy';
}

const sizeMap: Record<AvatarSize, { dimension: string; font: string; dot: string }> = {
  sm: { dimension: 'var(--t-icon-xl)', font: 'var(--t-font-xxs)', dot: 'var(--t-space-1)' },
  md: { dimension: 'var(--t-control-h)', font: 'var(--t-font-xs)', dot: 'var(--t-space-1-5)' },
  lg: { dimension: 'var(--t-control-h-lg)', font: 'var(--t-font-sm)', dot: 'var(--t-space-2)' },
};

const statusColors: Record<string, string> = {
  online: 'var(--t-accent)',
  offline: 'var(--t-text-5)',
  busy: 'var(--t-accent-subtle)',
};

export function TessorAvatar({ src, initials, size = 'md', status }: TessorAvatarProps) {
  const s = sizeMap[size];

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <div
        style={{
          width: s.dimension,
          height: s.dimension,
          borderRadius: 'var(--t-radius-full)',
          background: src ? 'transparent' : 'var(--t-surface-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={initials || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--t-radius-full)',
            }}
          />
        ) : (
          <span
            style={{
              fontSize: s.font,
              color: 'var(--t-text-3)',
              fontFamily: 'var(--t-font-family)',
              fontWeight: 'var(--t-font-weight)',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            {initials || '?'}
          </span>
        )}
      </div>
      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: s.dot,
            height: s.dot,
            borderRadius: 'var(--t-radius-full)',
            background: statusColors[status] || 'var(--t-text-5)',
            border: 'var(--t-border-w) solid var(--t-surface-0)',
          }}
        />
      )}
    </div>
  );
}
