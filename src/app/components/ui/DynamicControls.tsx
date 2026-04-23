import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { hapticTick } from '../../utils/haptics';

function CaretBidirectional({ inward = false }: { inward?: boolean }) {
  if (inward) {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.2" d="M8.8872 3.11279C8.85149 3.07704 8.80907 3.04867 8.76238 3.02931C8.71569 3.00996 8.66565 3 8.61511 3C8.56456 3 8.51452 3.00996 8.46783 3.02931C8.42114 3.04867 8.37872 3.07704 8.34301 3.11279L6.03545 5.42035C5.9997 5.45606 5.97133 5.49848 5.95197 5.54517C5.93262 5.59186 5.92266 5.6419 5.92266 5.69244C5.92266 5.74299 5.93262 5.79303 5.95197 5.83972C5.97133 5.88641 5.9997 5.92883 6.03545 5.96454L8.34301 8.2721C8.41517 8.34426 8.51305 8.3848 8.61511 8.3848C8.71716 8.3848 8.81504 8.34426 8.8872 8.2721C8.95937 8.19993 8.99991 8.10205 8.99991 8C8.99991 7.89794 8.95937 7.80006 8.8872 7.7279L6.85127 5.69244L8.8872 3.65699C8.92296 3.62127 8.95133 3.57886 8.97068 3.53217C8.99004 3.48548 9 3.43543 9 3.38489C9 3.33435 8.99004 3.2843 8.97068 3.23762C8.95133 3.19093 8.92296 3.14851 8.8872 3.11279ZM1.11271 7.7279L3.14864 5.69244L1.11271 3.65699C1.04054 3.58483 1 3.48695 1 3.38489C1 3.28284 1.04054 3.18496 1.11271 3.11279C1.18487 3.04063 1.28275 3.00009 1.38481 3.00009C1.48686 3.00009 1.58474 3.04063 1.65691 3.11279L3.96446 5.42035C4.00022 5.45606 4.02858 5.49848 4.04794 5.54517C4.06729 5.59186 4.07725 5.6419 4.07725 5.69245C4.07725 5.74299 4.06729 5.79303 4.04794 5.83972C4.02858 5.88641 4.00022 5.92883 3.96446 5.96454L1.65691 8.2721C1.58474 8.34426 1.48686 8.3848 1.38481 8.3848C1.28275 8.3848 1.18487 8.34426 1.11271 8.2721C1.04054 8.19993 1 8.10205 1 8C1 7.89794 1.04054 7.80006 1.11271 7.7279Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.2" d="M7.03545 3.11279C7.07117 3.07704 7.11359 3.04867 7.16028 3.02931C7.20697 3.00996 7.25701 3 7.30755 3C7.35809 3 7.40814 3.00996 7.45483 3.02931C7.50152 3.04867 7.54393 3.07703 7.57965 3.11279L9.8872 5.42035C9.92296 5.45606 9.95133 5.49848 9.97068 5.54517C9.99004 5.59186 10 5.6419 10 5.69244C10 5.74299 9.99004 5.79303 9.97068 5.83972C9.95133 5.88641 9.92296 5.92883 9.8872 5.96454L7.57965 8.2721C7.50749 8.34426 7.40961 8.3848 7.30755 8.3848C7.2055 8.3848 7.10762 8.34426 7.03545 8.2721C6.96329 8.19993 6.92275 8.10205 6.92275 8C6.92275 7.89794 6.96329 7.80006 7.03545 7.7279L9.07139 5.69244L7.03545 3.65699C6.9997 3.62127 6.97133 3.57886 6.95197 3.53217C6.93262 3.48548 6.92266 3.43543 6.92266 3.38489C6.92266 3.33435 6.93262 3.28431 6.95197 3.23762C6.97133 3.19093 6.9997 3.14851 7.03545 3.11279ZM2.96455 7.7279L0.928612 5.69245L2.96455 3.65699C3.03671 3.58483 3.07725 3.48695 3.07725 3.38489C3.07725 3.28284 3.03671 3.18496 2.96455 3.11279C2.89238 3.04063 2.7945 3.00009 2.69245 3.00009C2.59039 3.00009 2.49251 3.04063 2.42035 3.11279L0.112796 5.42035C0.0770376 5.45606 0.0486704 5.49848 0.0293161 5.54517C0.00996175 5.59186 0 5.6419 0 5.69245C0 5.74299 0.00996175 5.79303 0.0293161 5.83972C0.0486704 5.88641 0.0770376 5.92883 0.112796 5.96454L2.42035 8.2721C2.49251 8.34426 2.59039 8.3848 2.69245 8.3848C2.7945 8.3848 2.89238 8.34426 2.96455 8.2721C3.03671 8.19993 3.07725 8.10205 3.07725 8C3.07725 7.89794 3.03671 7.80006 2.96455 7.7279Z" fill="currentColor" />
    </svg>
  );
}

function fmtNum(v: number, step: number) {
  if (step >= 1) return Math.round(v);
  return parseFloat(v.toFixed(2));
}

function getScrollJump(min: number, max: number): number {
  const range = max - min;
  if (range <= 1) return 0.1;
  if (range <= 100) return 10;
  if (range <= 1000) return 100;
  return 1000;
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function hexToHsb(hex: string): [number, number, number] {
  if (!isValidHex(hex)) return [0, 0, 0];
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return [h, s, v];
}

function hsbToHex(h: number, s: number, b: number): string {
  const sn = s / 100;
  const bn = b / 100;
  const c = bn * sn;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = bn - c;
  let r = 0, g = 0, bl = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; bl = x; }
  else if (h < 240) { g = x; bl = c; }
  else if (h < 300) { r = x; bl = c; }
  else { r = c; bl = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function hueToRgb(h: number): string {
  const c = 1;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

interface DynamicControlCtx {
  activeId: string | null;
  hoveredId: string | null;
  keyFocusedId: string | null;
  childCount: number;
  setActive: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  setKeyFocused: (id: string | null) => void;
  lockDrag: () => void;
  unlockDrag: () => void;
}

const Ctx = createContext<DynamicControlCtx>({
  activeId: null,
  hoveredId: null,
  keyFocusedId: null,
  childCount: 0,
  setActive: () => {},
  setHovered: () => {},
  setKeyFocused: () => {},
  lockDrag: () => {},
  unlockDrag: () => {},
});

interface DynamicControlGroupProps {
  children: React.ReactNode;
  label?: string;
}

export function DynamicControlGroup({ children, label }: DynamicControlGroupProps) {
  const [activeId, setActiveIdRaw] = useState<string | null>(null);
  const [hoveredId, setHoveredIdRaw] = useState<string | null>(null);
  const [keyFocusedId, setKeyFocusedIdRaw] = useState<string | null>(null);
  const dragLocked = useRef(false);
  const groupRef = useRef<HTMLDivElement>(null);

  const childCount = React.Children.count(children);

  const setActive = useCallback((id: string | null) => {
    setActiveIdRaw(id);
  }, []);

  const setHovered = useCallback((id: string | null) => { setHoveredIdRaw(id); }, []);
  const setKeyFocused = useCallback((id: string | null) => { setKeyFocusedIdRaw(id); }, []);
  const lockDrag = useCallback(() => { dragLocked.current = true; }, []);
  const unlockDrag = useCallback(() => { dragLocked.current = false; }, []);

  useEffect(() => {
    if (!activeId) return;
    const handler = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setActiveIdRaw(null);
        setKeyFocusedIdRaw(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeId]);

  return (
    <Ctx.Provider value={{ activeId, hoveredId, keyFocusedId, childCount, setActive, setHovered, setKeyFocused, lockDrag, unlockDrag }}>
      <div
        ref={groupRef}
        role="group"
        aria-label={label}
        style={{ display: 'flex', gap: 'var(--t-space-1)', alignItems: 'center', width: '100%', height: 'var(--t-control-h-lg)' }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

interface DynamicControlProps {
  id: string;
  label: string;
  value: string;
  unit?: string;
  numericValue?: number;
  numericMin?: number;
  numericMax?: number;
  numericStep?: number;
  onNumericChange?: (v: number) => void;
  onTextChange?: (v: string) => void;
  icon: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel?: string;
  scrollOptions?: string[];
  onScrollChange?: (v: string) => void;
  swatch?: React.ReactNode;
  onWheelOverride?: (e: WheelEvent) => boolean;
}

export function DynamicControl({
  id, label: labelText, value, unit, numericValue, numericMin, numericMax, numericStep = 1, onNumericChange,
  onTextChange, icon, children, ariaLabel,
  scrollOptions, onScrollChange,
  swatch, onWheelOverride,
}: DynamicControlProps) {
  const { activeId, hoveredId, keyFocusedId, childCount, setActive, setHovered, setKeyFocused } = useContext(Ctx);
  const isSolo = childCount === 1;
  const isExpanded = isSolo || activeId === id;
  const isCollapsed = !isSolo && activeId !== null && activeId !== id;
  const isHovered = hoveredId === id;
  const isKeyFocused = keyFocusedId === id;
  const pillRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const expand = useCallback((viaKeyboard = false) => {
    setActive(id);
    if (viaKeyboard) {
      setKeyFocused(id);
      setTimeout(() => {
        const el = pillRef.current?.querySelector<HTMLElement>(
          'button:not([data-pill]), input, [role="slider"], [role="switch"], [role="combobox"]'
        );
        el?.focus();
      }, 0);
    }
  }, [setActive, id, setKeyFocused]);

  const collapse = useCallback(() => {
    setActive(null);
    setKeyFocused(null);
  }, [setActive, setKeyFocused]);

  const clampNum = useCallback((v: number) => {
    const mn = numericMin ?? -Infinity;
    const mx = numericMax ?? Infinity;
    const clamped = Math.max(mn, Math.min(mx, v));
    const rounded = Math.round(clamped / numericStep) * numericStep;
    const decimals = (numericStep.toString().split('.')[1] || '').length;
    return parseFloat(rounded.toFixed(decimals));
  }, [numericMin, numericMax, numericStep]);

  const canEdit = !!(onNumericChange || onTextChange);

  const startEdit = (e: React.MouseEvent) => {
    if (!canEdit) return;
    e.stopPropagation();
    if (onNumericChange && numericValue !== undefined) {
      setEditVal(String(fmtNum(numericValue, numericStep)));
    } else {
      setEditVal(value);
    }
    setEditing(true);
    setTimeout(() => { inputRef.current?.select(); inputRef.current?.focus(); }, 0);
  };

  const commitEdit = () => {
    if (onNumericChange) {
      const p = parseFloat(editVal);
      if (!isNaN(p)) onNumericChange(clampNum(p));
    } else if (onTextChange) {
      onTextChange(editVal);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== pillRef.current) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isExpanded) { collapse(); pillRef.current?.focus(); }
      else { expand(true); }
    }
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault(); e.stopPropagation();
      collapse(); pillRef.current?.focus();
    }
  };

  const handleMouseEnter = () => { setHovered(id); };
  const handleMouseLeave = () => { setHovered(null); };

  const handleClick = () => {
    if (isSolo) return;
    if (isExpanded) collapse();
    else expand();
  };

  useEffect(() => {
    const el = valueRef.current;
    if (!el || isCollapsed) return;

    const handler = (e: WheelEvent) => {
      let delta = e.deltaX;
      if (Math.abs(delta) < 2 && e.shiftKey && Math.abs(e.deltaY) >= 2) {
        delta = e.deltaY;
      }
      if (Math.abs(delta) < 2) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 80) return;
      lastScrollTime.current = now;

      e.preventDefault();
      const direction = delta > 0 ? -1 : 1;

      if (onNumericChange && numericValue !== undefined && numericMin !== undefined && numericMax !== undefined) {
        let jump: number;
        if (e.ctrlKey || e.metaKey) {
          jump = numericStep;
        } else {
          jump = getScrollJump(numericMin, numericMax);
        }
        const newVal = clampNum(numericValue + direction * jump);
        if (newVal !== numericValue) {
          onNumericChange(newVal);
          hapticTick();
        }
        return;
      }

      if (scrollOptions && scrollOptions.length > 0 && onScrollChange) {
        const currentIdx = scrollOptions.indexOf(value);
        let newIdx = currentIdx + direction;
        newIdx = ((newIdx % scrollOptions.length) + scrollOptions.length) % scrollOptions.length;
        if (newIdx !== currentIdx) {
          onScrollChange(scrollOptions[newIdx]);
          hapticTick();
        }
      }
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [isExpanded, isCollapsed, numericValue, numericMin, numericMax, numericStep, onNumericChange, clampNum, value, scrollOptions, onScrollChange]);

  useEffect(() => {
    if (!onWheelOverride || isExpanded) return;
    const el = pillRef.current;
    if (!el || isCollapsed) return;

    const handler = (e: WheelEvent) => {
      onWheelOverride(e);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [onWheelOverride, isExpanded, isCollapsed]);

  const fullAriaLabel = ariaLabel ?? `${labelText}: ${value}${unit ? ` ${unit}` : ''}`;

  if (isCollapsed) {
    return (
      <div
        ref={pillRef}
        role="button"
        tabIndex={0}
        aria-label={fullAriaLabel}
        aria-expanded={false}
        data-pill
        style={{
          height: 'var(--t-control-h-lg)',
          borderRadius: 'var(--t-radius-sm)',
          backgroundColor: (isHovered || isKeyFocused) ? 'var(--t-control-hover)' : 'transparent',
          border: isKeyFocused ? 'var(--t-border-w) solid var(--t-border-focus)' : 'var(--t-border-w) solid var(--t-border-0)',
          boxSizing: 'border-box',
          padding: 'var(--t-space-1)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          minWidth: 'fit-content',
          cursor: 'default',
          outline: 'none',
          transition: 'flex 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color var(--t-duration-fast) ease-out',
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={() => setKeyFocused(id)}
        onBlur={() => setKeyFocused(null)}
      >
        <span style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-icon)' }}>
          {icon}
        </span>
      </div>
    );
  }

  if (isExpanded) {
    return (
      <div
        ref={pillRef}
        role={isSolo ? 'group' : 'button'}
        tabIndex={isSolo ? -1 : 0}
        aria-label={fullAriaLabel}
        aria-expanded={isSolo ? undefined : true}
        data-pill
        style={{
          height: 'var(--t-control-h-lg)',
          borderRadius: 'var(--t-radius-sm)',
          backgroundColor: isSolo ? 'transparent' : 'var(--t-control-hover)',
          border: isKeyFocused ? 'var(--t-border-w) solid var(--t-border-focus)' : isSolo ? 'var(--t-border-w) solid var(--t-border-0)' : 'var(--t-border-w) solid transparent',
          boxSizing: 'border-box',
          padding: 'var(--t-space-1-5)',
          display: 'flex',
          alignItems: 'stretch',
          gap: 'var(--t-space-3)',
          flex: '1 0 0',
          minWidth: 0,
          minHeight: '1px',
          cursor: 'default',
          outline: 'none',
          overflow: 'visible',
          transition: 'flex 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color var(--t-duration-fast) ease-out, border-color var(--t-duration-fast) ease-out',
        }}
        onKeyDown={isSolo ? undefined : handleKeyDown}
        onMouseEnter={isSolo ? undefined : handleMouseEnter}
        onMouseLeave={isSolo ? undefined : handleMouseLeave}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-1-5)', alignItems: 'flex-start', alignSelf: 'flex-start', flex: children ? '0 0 auto' : '1 1 auto', minWidth: children ? 'var(--t-label-min-w)' : 0 }}>
          <div style={{ display: 'flex', gap: 'var(--t-space-1)', alignItems: 'center', width: 'fit-content' }}>
            <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-label)', lineHeight: 1, whiteSpace: 'nowrap', fontFamily: 'var(--t-font-family)' }}>
              {labelText}
            </span>
            {!isSolo && (
              <span style={{ display: 'flex', flexShrink: 0, position: 'relative', top: 'var(--t-nudge-1)', color: 'var(--t-text)' }}>
                <CaretBidirectional inward />
              </span>
            )}
          </div>
          <div
            ref={valueRef}
            style={{ display: 'flex', gap: 'var(--t-space-0-5)', alignItems: 'baseline', whiteSpace: 'nowrap', cursor: (onNumericChange || (scrollOptions && scrollOptions.length > 0)) ? 'ew-resize' : canEdit ? 'text' : 'inherit', lineHeight: 1, minWidth: children ? 'fit-content' : 0, width: children ? undefined : '100%', borderBottom: canEdit ? `1px solid ${editing ? 'var(--t-input-underline-active)' : 'var(--t-input-underline)'}` : 'none' }}
            onClick={startEdit}
          >
            {editing && canEdit ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={editVal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--t-text)',
                    fontSize: 'var(--t-font-md)',
                    lineHeight: 1,
                    padding: 0,
                    margin: 0,
                    outline: 'none',
                    width: children ? 'var(--t-swatch-w)' : '100%',
                    height: 'var(--t-swatch-h)',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--t-font-family)',
                    caretColor: 'var(--t-input-caret)',
                    display: 'block',
                  }}
                  onChange={(e) => setEditVal(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commitEdit(); }
                    if (e.key === 'Escape') { e.preventDefault(); setEditing(false); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {unit && <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-unit)', flexShrink: 0 }}>{unit}</span>}
              </>
            ) : (
              <>
                <span style={{ fontSize: 'var(--t-font-md)', color: 'var(--t-text)', fontFamily: 'var(--t-font-family)', maxWidth: children ? 'calc(var(--t-control-h-lg) + var(--t-icon-base))' : undefined, overflow: 'hidden', textOverflow: 'ellipsis' }}>{(scrollOptions && scrollOptions.length > 0) ? value.slice(0, 3) : value}</span>
                {unit && <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-unit)', flexShrink: 0 }}>{unit}</span>}
              </>
            )}
          </div>
        </div>
        {children && (
          <div
            style={{ flex: '1 0 0', display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', minWidth: 0, minHeight: '1px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        )}
      </div>
    );
  }

  let bg = 'transparent';
  let border = 'var(--t-border-w) solid var(--t-border-0)';
  if (isHovered) {
    bg = 'var(--t-control-hover)';
  }
  if (isKeyFocused) {
    border = 'var(--t-border-w) solid var(--t-border-focus)';
    bg = 'var(--t-control-hover)';
  }

  return (
    <div
      ref={pillRef}
      role="button"
      tabIndex={0}
      aria-label={fullAriaLabel}
      aria-expanded={false}
      data-pill
      style={{
        height: 'var(--t-control-h-lg)',
        borderRadius: 'var(--t-radius-sm)',
        backgroundColor: bg,
        border,
        boxSizing: 'border-box',
        padding: 'var(--t-space-1-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--t-space-1-5)',
        flex: '1 0 0',
        minWidth: 'fit-content',
        minHeight: '1px',
        cursor: 'default',
        outline: 'none',
        overflow: 'hidden',
        transition: 'flex 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color var(--t-duration-fast) ease-out, border-color var(--t-duration-fast) ease-out',
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={() => setKeyFocused(id)}
      onBlur={() => setKeyFocused(null)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-1-5)', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 'var(--t-space-1)' }}>
          <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-label)', lineHeight: 1, whiteSpace: 'nowrap', fontFamily: 'var(--t-font-family)' }}>
            {labelText}
          </span>
          <span style={{ display: 'flex', flexShrink: 0, position: 'relative', top: 'var(--t-nudge-1)', color: 'var(--t-text)' }}>
            <CaretBidirectional />
          </span>
        </div>
        <div
          ref={valueRef}
          style={{ display: 'flex', gap: 'var(--t-space-0-5)', alignItems: 'baseline', whiteSpace: 'nowrap', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, width: 'min-content', cursor: (onNumericChange || (scrollOptions && scrollOptions.length > 0)) ? 'ew-resize' : canEdit ? 'text' : 'inherit' }}
          onClick={(e) => {
            if (!canEdit) return;
            e.stopPropagation();
            expand();
            if (onNumericChange && numericValue !== undefined) {
              setEditVal(String(fmtNum(numericValue, numericStep)));
            } else {
              setEditVal(value);
            }
            setEditing(true);
            setTimeout(() => { inputRef.current?.select(); inputRef.current?.focus(); }, 0);
          }}
        >
          {swatch && swatch}
          <span style={{ fontSize: 'var(--t-font-md)', color: 'var(--t-label-hover)', fontFamily: 'var(--t-font-family)' }}>{value}</span>
          {unit && <span style={{ fontSize: 'var(--t-font-xs)', color: 'var(--t-text-unit)' }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

interface DynamicControlToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function DynamicControlToggle({ value, onChange }: DynamicControlToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      style={{
        width: 'var(--t-toggle-mini-w)',
        height: '100%',
        borderRadius: 'var(--t-radius-sm)',
        background: 'var(--t-toggle-track)',
        border: 'none',
        cursor: 'pointer',
        padding: 'var(--t-space-0-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: value ? 'flex-end' : 'flex-start',
        flexShrink: 0,
        outline: 'none',
      }}
    >
      <div style={{
        width: 'var(--t-toggle-knob-w)',
        height: '100%',
        borderRadius: value ? 'var(--t-radius-sm)' : 'var(--t-radius-xs)',
        background: value ? 'var(--t-toggle-knob-on)' : 'var(--t-toggle-knob-off)',
        boxShadow: value
          ? 'var(--t-toggle-knob-on-glow)'
          : 'none',
        transition: 'background var(--t-duration-base) ease, box-shadow var(--t-duration-base) ease',
      }} />
    </button>
  );
}

interface DynamicControlNumericProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
  unit?: string;
}

export function DynamicControlNumeric({ value, min, max, step, onChange, ariaLabel, unit }: DynamicControlNumericProps) {
  const { lockDrag, unlockDrag } = useContext(Ctx);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clamp = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    const rounded = Math.round(clamped / step) * step;
    const decimals = (step.toString().split('.')[1] || '').length;
    return parseFloat(rounded.toFixed(decimals));
  };

  const updateFromTrack = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const padX = 12;
      const innerW = rect.width - padX * 2;
      const x = clientX - rect.left - padX;
      const pct = Math.max(0, Math.min(1, x / innerW));
      onChange(clamp(min + pct * (max - min)));
    },
    [min, max, step, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    lockDrag();
    updateFromTrack(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromTrack(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    unlockDrag();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); onChange(clamp(value + step)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); onChange(clamp(value - step)); }
    if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); onChange(min); }
    if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); onChange(max); }
  };

  const pct = ((value - min) / (max - min)) * 100;
  const range = max - min;
  const jump = getScrollJump(min, max);
  const tickCount = Math.max(2, Math.round(range / jump));

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={unit ? `${value} ${unit}` : `${value}`}
      aria-label={ariaLabel ?? 'Slider'}
      style={{
        flex: '1 0 0',
        height: '100%',
        background: 'var(--t-surface-1)',
        borderRadius: 'var(--t-radius-sm)',
        position: 'relative',
        cursor: 'ew-resize',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--t-space-0-5) var(--t-space-3)',
        minWidth: 0,
        outline: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    >
      {Array.from({ length: tickCount }, (_, i) => (
        <div key={i} style={{
          width: 'var(--t-slider-tick-w)',
          height: 'var(--t-slider-tick-h)',
          background: 'var(--t-slider-tick)',
          borderRadius: 'var(--t-radius-xs)',
          flexShrink: 0,
        }} />
      ))}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: `calc(var(--t-slider-pad-x) + (100% - calc(2 * var(--t-slider-pad-x))) * ${pct / 100})`,
        width: 'var(--t-slider-track-w)',
        height: '60%',
        background: 'var(--t-slider-cursor)',
        borderRadius: 'var(--t-radius-sm)',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'var(--t-slider-cursor-glow)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

interface DynamicControlDropdownProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export function DynamicControlDropdown({ value, options, onChange }: DynamicControlDropdownProps) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`dynamic-select-${Math.random().toString(36).slice(2)}`);

  const close = () => setOpen(false);

  const openDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropH = Math.min(options.length * 28, 200);
      setOpenUpward(spaceBelow < dropH && spaceAbove > spaceBelow);
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); e.stopPropagation();
      const idx = options.indexOf(value);
      const next = e.key === 'ArrowDown'
        ? options[Math.min(idx + 1, options.length - 1)]
        : options[Math.max(idx - 1, 0)];
      onChange(next);
    }
    if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); onChange(options[0]); }
    if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); onChange(options[options.length - 1]); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', flex: '1 0 0', minWidth: 0, height: '100%', display: 'flex', alignItems: 'stretch' }}
      onKeyDown={handleKeyDown}
    >
      <button
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId.current}
        onClick={(e) => { e.stopPropagation(); openDropdown(e); }}
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--t-surface-1)',
          border: 'none',
          borderRadius: 'var(--t-radius-sm)',
          color: 'var(--t-accent-text)',
          fontSize: 'var(--t-font-xs)',
          padding: '0 var(--t-space-2)',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--t-space-1)',
          fontFamily: 'var(--t-font-family)',
          outline: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 100ms' }}>
          <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={listboxId.current}
          role="listbox"
          style={{
            position: 'absolute',
            ...(openUpward ? { bottom: 'calc(100% + var(--t-dropdown-offset))' } : { top: 'calc(100% + var(--t-dropdown-offset))' }),
            left: 0,
            right: 0,
            background: 'var(--t-surface-1)',
            border: 'var(--t-border-w) solid var(--t-select-border)',
            borderRadius: 'var(--t-radius-sm)',
            overflow: 'hidden',
            zIndex: 100,
            maxHeight: 'var(--t-dropdown-max-h)',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <div
                key={opt}
                role="option"
                aria-selected={selected}
                onClick={(e) => { e.stopPropagation(); onChange(opt); close(); }}
                style={{
                  padding: 'var(--t-space-1-5) var(--t-space-2-5)',
                  fontSize: 'var(--t-font-xs)',
                  color: selected ? 'var(--t-accent-text)' : 'var(--t-select-text)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--t-font-family)',
                  transition: 'background 60ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.background = 'var(--t-select-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget).style.background = 'transparent'; }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DynamicControlColorProps {
  value: string;
  onChange: (v: string) => void;
}

function HsbMiniSlider({ gradient, pct, onPctChange, ariaLabel, displayValue, initial, onActiveChange, valueMax }: {
  gradient: string;
  pct: number;
  onPctChange: (p: number) => void;
  ariaLabel: string;
  displayValue: number;
  initial: string;
  onActiveChange: (active: boolean) => void;
  valueMax: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTime = useRef(0);
  const { lockDrag, unlockDrag } = useContext(Ctx);

  const isActive = dragging || scrolling;

  useEffect(() => {
    onActiveChange(isActive);
  }, [isActive, onActiveChange]);

  const updateFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onPctChange(p);
  }, [onPctChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    lockDrag();
    updateFromX(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromX(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    unlockDrag();
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      let delta = e.deltaX;
      if (Math.abs(delta) < 2 && e.shiftKey && Math.abs(e.deltaY) >= 2) {
        delta = e.deltaY;
      }
      if (Math.abs(delta) < 2) return;
      const now = Date.now();
      if (now - lastScrollTime.current < 80) return;
      lastScrollTime.current = now;
      e.preventDefault();
      e.stopPropagation();
      const direction = delta > 0 ? -1 : 1;
      const unitJump = (e.ctrlKey || e.metaKey) ? 1 : 10;
      const pctJump = unitJump / valueMax;
      const newPct = Math.max(0, Math.min(1, pct + direction * pctJump));
      if (newPct !== pct) {
        onPctChange(newPct);
        hapticTick();
      }
      setScrolling(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setScrolling(false), 600);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => {
      el.removeEventListener('wheel', handler);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [pct, onPctChange, valueMax]);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(pct * 100)}
      style={{
        flex: '1 0 0',
        minHeight: '1px',
        width: '100%',
        borderRadius: 'var(--t-radius-sm)',
        background: gradient,
        position: 'relative',
        cursor: 'ew-resize',
        touchAction: 'none',
        border: 'var(--t-border-w-hairline) solid var(--t-swatch-slider-border)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: `${pct * 100}%`,
        width: 'var(--t-slider-track-w)',
        height: 'var(--t-slider-thumb-h)',
        background: 'var(--t-swatch-cursor)',
        borderRadius: 'var(--t-radius-sm)',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'var(--t-swatch-cursor-glow)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export function useColorWheelOverride(value: string, onChange: (v: string) => void): (e: WheelEvent) => boolean {
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastScrollTime = useRef(0);

  return useCallback((e: WheelEvent) => {
    let delta = e.deltaX;
    if (Math.abs(delta) < 2 && e.shiftKey && Math.abs(e.deltaY) >= 2) {
      delta = e.deltaY;
    }
    if (Math.abs(delta) < 2) return false;

    const now = Date.now();
    if (now - lastScrollTime.current < 80) { e.preventDefault(); return true; }
    lastScrollTime.current = now;

    e.preventDefault();
    const direction = delta > 0 ? -1 : 1;
    const hex = valueRef.current.startsWith('#') && valueRef.current.length >= 7 ? valueRef.current : '#000000';
    const [h, s, b] = hexToHsb(hex);

    const granular = e.ctrlKey || e.metaKey;
    const jump = granular ? 1 : 10;

    let newH = h, newS = s, newB = b;
    if (e.altKey && e.shiftKey) {
      newH = ((h + direction * jump) % 360 + 360) % 360;
    } else if (e.altKey) {
      newB = Math.max(0, Math.min(100, b + direction * jump));
    } else {
      newS = Math.max(0, Math.min(100, s + direction * jump));
    }

    const newHex = hsbToHex(newH, newS, newB);
    if (newHex !== hex) {
      onChangeRef.current(newHex);
      hapticTick();
    }
    return true;
  }, []);
}

export function ColorSwatch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hex = value.startsWith('#') && value.length >= 7 ? value : '#000000';

  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 2,
        background: hex,
        border: 'var(--t-border-w) solid var(--t-swatch-border)',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
      }}
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', border: 'none', pointerEvents: 'none' }}
      />
    </div>
  );
}

export function DynamicControlColor({ value, onChange }: DynamicControlColorProps) {
  const { childCount } = useContext(Ctx);
  const inputRef = useRef<HTMLInputElement>(null);
  const hex = value.startsWith('#') && value.length >= 7 ? value : '#000000';
  const isSolo = childCount === 1;

  const openNativePicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const nativeInput = (
    <input
      ref={inputRef}
      type="color"
      value={hex}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', border: 'none', pointerEvents: 'none' }}
    />
  );

  if (isSolo) {
    return (
      <div
        style={{
          width: 'var(--t-swatch-thumb)',
          maxWidth: 'var(--t-swatch-thumb)',
          height: '100%',
          borderRadius: 'var(--t-radius-xs)',
          background: hex,
          border: 'var(--t-border-w) solid var(--t-swatch-border)',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
        }}
        onClick={openNativePicker}
      >
        {nativeInput}
      </div>
    );
  }

  const [h, s, b] = hexToHsb(hex);
  const [hActive, setHActive] = useState(false);
  const [sActive, setSActive] = useState(false);
  const [bActive, setBActive] = useState(false);

  const setH = useCallback((p: number) => onChange(hsbToHex(p * 360, s, b)), [onChange, s, b]);
  const setS = useCallback((p: number) => onChange(hsbToHex(h, p * 100, b)), [onChange, h, b]);
  const setB = useCallback((p: number) => onChange(hsbToHex(h, s, p * 100)), [onChange, h, s]);

  const onHActive = useCallback((v: boolean) => setHActive(v), []);
  const onSActive = useCallback((v: boolean) => setSActive(v), []);
  const onBActive = useCallback((v: boolean) => setBActive(v), []);

  const hueGrad = 'linear-gradient(90deg, #ff0000 0%, #ff8400 12.5%, #ffd400 26.4%, #22ff00 39.9%, #00ffff 53.4%, #1500ff 67.3%, #ff0099 80.8%, #ff0004 95.2%)';
  const hueColor = hueToRgb(h);
  const satGrad = `linear-gradient(90deg, rgba(${hueColor.slice(4, -1)},0) 0%, ${hueColor} 100%)`;
  const briGrad = `linear-gradient(90deg, #000000 0%, ${hsbToHex(h, s, 100)} 100%)`;

  const sliderTag = (initial: string, value: number, active: boolean) => (
    <span style={{
      fontSize: 'var(--t-font-xs)',
      color: 'var(--t-text)',
      opacity: active ? 0.7 : 0.3,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      fontFamily: 'var(--t-font-family)',
      flexShrink: 0,
      alignSelf: 'center',
      minWidth: 'var(--t-icon-xs)',
      textAlign: 'right',
    }}>
      {active ? Math.round(value) : initial}
    </span>
  );

  return (
    <div style={{ display: 'flex', flex: '1 0 0', gap: 'var(--t-space-1)', height: '100%', alignItems: 'center', minWidth: 0, minHeight: '1px', ...(!isSolo ? { marginLeft: -10 } : {}) }}>
      <div
        style={{
          width: 'var(--t-swatch-input-w)',
          maxWidth: 'var(--t-swatch-thumb)',
          height: '100%',
          borderRadius: 'var(--t-radius-xs)',
          background: hex,
          border: 'var(--t-border-w) solid var(--t-swatch-border)',
          flexShrink: 0,
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={openNativePicker}
      >
        {nativeInput}
      </div>
      <div style={{ display: 'flex', flex: '1 0 0', flexDirection: 'column', gap: 'var(--t-space-1)', height: '100%', justifyContent: 'center', minWidth: 0, minHeight: '1px' }}>
        <div style={{ display: 'flex', gap: 'var(--t-space-1)', alignItems: 'stretch', flex: '1 0 0', minHeight: '1px' }}>
          <HsbMiniSlider gradient={hueGrad} pct={h / 360} onPctChange={setH} ariaLabel="Hue" displayValue={h} initial="H" onActiveChange={onHActive} valueMax={360} />
          {sliderTag('H', h, hActive)}
        </div>
        <div style={{ display: 'flex', gap: 'var(--t-space-1)', alignItems: 'stretch', flex: '1 0 0', minHeight: '1px' }}>
          <HsbMiniSlider gradient={satGrad} pct={s / 100} onPctChange={setS} ariaLabel="Saturation" displayValue={s} initial="S" onActiveChange={onSActive} valueMax={100} />
          {sliderTag('S', s, sActive)}
        </div>
        <div style={{ display: 'flex', gap: 'var(--t-space-1)', alignItems: 'stretch', flex: '1 0 0', minHeight: '1px' }}>
          <HsbMiniSlider gradient={briGrad} pct={b / 100} onPctChange={setB} ariaLabel="Brightness" displayValue={b} initial="B" onActiveChange={onBActive} valueMax={100} />
          {sliderTag('B', b, bActive)}
        </div>
      </div>
    </div>
  );
}

interface DynamicControlSegmentedProps {
  value: string;
  options: string[];
  icons?: Record<string, React.ReactNode>;
  onChange: (v: string) => void;
}

export function DynamicControlSegmented({ value, options, icons, onChange }: DynamicControlSegmentedProps) {
  const handleKeyDown = (e: React.KeyboardEvent, opt: string) => {
    const idx = options.indexOf(opt);
    if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); onChange(options[Math.min(idx + 1, options.length - 1)]); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); onChange(options[Math.max(idx - 1, 0)]); }
    if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); onChange(options[0]); }
    if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); onChange(options[options.length - 1]); }
  };

  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex',
        gap: 'var(--t-space-0-5)',
        height: '100%',
        background: 'var(--t-surface-1)',
        borderRadius: 'var(--t-radius-sm)',
        padding: 'var(--t-space-0-5)',
        flexShrink: 0,
        alignItems: 'stretch',
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            role="radio"
            aria-checked={active}
            aria-label={opt}
            onClick={(e) => { e.stopPropagation(); onChange(opt); }}
            onKeyDown={(e) => handleKeyDown(e, opt)}
            style={{
              width: 'var(--t-toggle-mini-w)',
              height: '100%',
              borderRadius: 'var(--t-radius-xs)',
              border: 'none',
              background: active ? 'var(--t-toggle-active-bg)' : 'transparent',
              color: active ? 'var(--t-toggle-active-text)' : 'var(--t-toggle-inactive-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 100ms, color 100ms',
              outline: 'none',
              padding: 0,
            }}
          >
            {icons && icons[opt] ? icons[opt] : (
              <span style={{ fontSize: 'var(--t-font-xxs)', fontFamily: 'var(--t-font-family)', textTransform: 'capitalize' }}>
                {opt.slice(0, 3)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface DynamicColorControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}

export function DynamicColorControl({ id, label, value, onChange, icon }: DynamicColorControlProps) {
  const wheelOverride = useColorWheelOverride(value, onChange);

  return (
    <DynamicControl
      id={id}
      label={label}
      value={value.replace('#', '')}
      onTextChange={(v: string) => onChange('#' + v.replace('#', ''))}
      icon={icon}
      swatch={<ColorSwatch value={value} onChange={onChange} />}
      onWheelOverride={wheelOverride}
    >
      <DynamicControlColor value={value} onChange={onChange} />
    </DynamicControl>
  );
}
