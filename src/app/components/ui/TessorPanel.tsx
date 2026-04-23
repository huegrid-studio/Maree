import React, { useState } from 'react';
import { ChevronRight, Settings2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { hapticClick } from '../../utils/haptics';

const CheckIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 256 256" style={style}>
    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" fill="currentColor" />
  </svg>
);

function SaveButton({ onSave }: { onSave: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSave(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center transition-colors"
      style={{
        width: 'var(--t-control-h)',
        height: 'var(--t-control-h)',
        background: 'transparent',
        color: hovered ? 'var(--t-accent)' : 'var(--t-text-4)',
        borderRadius: 'var(--t-radius-lg)',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
      aria-label="Save token changes"
    >
      <CheckIcon style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }} />
    </button>
  );
}

interface TessorPanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  footerInfo?: string;
  exportProgress?: { format: string; percent: number } | null;
  isDirty?: boolean;
  onSave?: () => void;
}

export function TessorPanel({ children, isOpen, onToggle, footerInfo, exportProgress, isDirty, onSave }: TessorPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { theme, setTheme } = useTheme();

  const tabs = React.Children.toArray(children);

  return (
    <div
      className="h-full overflow-hidden flex flex-col flex-shrink-0"
      style={{
        width: isOpen ? 'var(--t-panel-w)' : '0px',
        minWidth: isOpen ? 'var(--t-panel-w)' : '0px',
        background: 'var(--t-panel)',
        border: isOpen ? 'var(--t-border-w) solid var(--t-panel-border)' : 'none',
        borderRadius: 'var(--t-radius-lg)',
        transition: 'width var(--t-duration-lg) cubic-bezier(0.4, 0, 0.2, 1), min-width var(--t-duration-lg) cubic-bezier(0.4, 0, 0.2, 1), opacity var(--t-duration-md) ease',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ height: 'var(--t-header-h)', borderBottom: 'var(--t-border-w) solid var(--t-panel-border)', paddingLeft: 'var(--t-space-3)', paddingRight: 'var(--t-space-1)' }}
      >
        <h2 style={{ fontSize: 'var(--t-font-md)', color: 'var(--t-text-2)', fontWeight: 'var(--t-font-weight)' }}>Configuration</h2>
        <div className="flex items-center" style={{ gap: '2px' }}>
          {isDirty && onSave && (
            <SaveButton onSave={onSave} />
          )}
          <button
            onClick={onToggle}
            className="flex items-center justify-center transition-colors"
            style={{ width: 'var(--t-control-h)', height: 'var(--t-control-h)', background: 'transparent', color: 'var(--t-text-2)', borderRadius: 'var(--t-radius-lg)' }}
          >
            <Settings2 style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: 'var(--t-border-w) solid var(--t-panel-border)', background: 'var(--t-surface-0)' }}>
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => { hapticClick(); setActiveTab(index); }}
            className="flex-1 transition-all relative"
            style={{ height: 'var(--t-tab-h)', fontSize: 'var(--t-font-xs)', fontWeight: 'var(--t-font-weight)', color: activeTab === index ? 'var(--t-text)' : 'var(--t-text-3)' }}
          >
            {tab.props.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0" style={{ height: 'var(--t-radius-xs)', background: 'var(--t-accent)' }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto tessor-scrollbar" style={{ padding: 'var(--t-space-3)' }}>
        {tabs[activeTab]}
      </div>

      <div
        className="flex flex-col flex-shrink-0"
        style={{ borderTop: 'var(--t-border-w) solid var(--t-panel-border)', paddingLeft: 'var(--t-space-3)', paddingRight: 'var(--t-space-3)' }}
      >
        {exportProgress && (
          <div className="flex flex-col" style={{ gap: 'var(--t-space-2)', paddingTop: 'var(--t-space-2)', paddingBottom: 'var(--t-space-2)' }}>
            <div className="flex justify-between items-center">
              <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-4)' }}>Exporting {exportProgress.format}...</span>
              <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-4)' }}>{Math.round(exportProgress.percent)}%</span>
            </div>
            <div className="w-full overflow-hidden" style={{ height: 'var(--t-space-1)', borderRadius: 'var(--t-radius-full)', background: 'var(--t-export-progress-bg)' }}>
              <div
                className="h-full transition-all duration-150"
                style={{ width: `${exportProgress.percent}%`, background: 'var(--t-export-progress-fill)' }}
              />
            </div>
          </div>
        )}
        <div
          className="flex items-center justify-between"
          style={{ height: 'var(--t-footer-h)' }}
        >
          <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-5)' }}>{footerInfo || ''}</span>
          <div
            className="flex items-center"
            style={{ gap: '6px' }}
          >
            {([
              { key: 'light' as const, icon: <svg viewBox="0 0 256 256" style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }}><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" fill="currentColor" /></svg> },
              { key: 'dark' as const, icon: <svg viewBox="0 0 256 256" style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }}><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.36A88,88,0,0,1,65.64,67.09,89,89,0,0,1,81.2,40.42h0A104.11,104.11,0,0,0,215.58,174.8,89,89,0,0,1,188.9,190.36Z" fill="currentColor" /></svg> },
              { key: 'system' as const, icon: <svg viewBox="0 0 256 256" style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }}><path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z" fill="currentColor" /></svg> },
            ] as const).map(({ key, icon }, index) => (
              <React.Fragment key={key}>
                {index > 0 && (
                  <div style={{ width: '6px', height: 'var(--t-border-w)', background: 'var(--t-border-1)', flexShrink: 0 }} />
                )}
                <button
                  onClick={() => { hapticClick(); setTheme(key); }}
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: 'var(--t-control-h)',
                    height: 'var(--t-control-h)',
                    background: 'transparent',
                    color: theme === key ? 'var(--t-accent)' : 'var(--t-text-5)',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 'var(--t-radius-sm)',
                  }}
                >
                  {icon}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TessorTabProps {
  label: string;
  children: React.ReactNode;
}

export function TessorTab({ children }: TessorTabProps) {
  return <div className="flex flex-col h-full">{children}</div>;
}

interface TessorSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function TessorSection({ title, children, defaultOpen = true, collapsible = true }: TessorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
        <div className="w-full flex items-center" style={{ height: 'var(--t-space-6)', fontSize: 'var(--t-font-xs)', color: 'var(--t-text-4)' }}>
          <span className="uppercase tracking-wide" style={{ fontWeight: 'var(--t-font-weight)' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between transition-colors group"
        style={{ height: 'var(--t-space-6)', fontSize: 'var(--t-font-xs)', color: 'var(--t-text-4)', fontWeight: 'var(--t-font-weight)' }}
      >
        <span className="uppercase tracking-wide">{title}</span>
        <ChevronRight 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          style={{ width: 'var(--t-icon-sm)', height: 'var(--t-icon-sm)' }}
          strokeWidth={2}
        />
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
