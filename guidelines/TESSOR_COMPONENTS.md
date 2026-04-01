# Tessor* Component System — Reference

<!-- Last updated: 2026-03-31 — Component sync (DynamicControls scroll scope, TessorPanel theme toggle, ElementComboGrid square cells, duration tokens) -->

This file documents the Tessor UI component system located in `src/app/components/ui/`. Agents must update this file whenever a Tessor component is added, renamed, or has its props changed.

The Tessor* components are a minimal dark-theme settings panel system built for use inside a `TessorPanel`. All components are pure functional React components with no external dependencies beyond lucide-react.

---

## TessorPanel / TessorTab / TessorSection

**File:** `src/app/components/ui/TessorPanel.tsx`

### TessorPanel

A 320px-wide, full-height sliding panel with a tab bar. The panel slides in/out with a CSS transition when `isOpen` changes. It always renders in the DOM but collapses to zero width when closed, allowing the adjacent canvas area to smoothly resize. No shadows are used; border outlines provide visual separation. Panel starts **closed** by default — set `isPanelOpen` initial state to `false`.

```tsx
<TessorPanel isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
  <TessorTab label="Canvas">...</TessorTab>
  <TessorTab label="Pattern">...</TessorTab>
</TessorPanel>
```

| Prop | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Whether the panel is expanded (always renders; slides to zero width when false) |
| `onToggle` | `() => void` | Called when the close/settings button is clicked |
| `children` | `ReactNode` | Must be `TessorTab` elements |

**Behavior:** The slide transition is self-contained inside TessorPanel. The parent only passes `isOpen` and `onToggle`. Tabs are rendered as buttons in the tab bar; the first `TessorTab` is active by default.

### TessorTab

A tab content container. Must be a direct child of `TessorPanel`.

```tsx
<TessorTab label="Canvas">
  {/* TessorSection or JSX content */}
</TessorTab>
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Tab button label |
| `children` | `ReactNode` | Tab body content |

### TessorSection

A collapsible section with an uppercase header inside a `TessorTab`.

```tsx
<TessorSection title="Grid" defaultOpen={true}>
  <TessorSlider ... />
</TessorSection>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Section header text (rendered uppercase) |
| `children` | `ReactNode` | — | Controls inside the section |
| `defaultOpen` | `boolean` | `true` | Whether the section starts expanded |

---

## TessorSlider

**File:** `src/app/components/ui/TessorSlider.tsx`

A 32px-tall draggable slider row. Shows label on the left, value on the right. Implements custom mouse drag (no native `<input type="range">`).

```tsx
<TessorSlider
  label="Columns"
  value={gridConfig.cols}
  min={1}
  max={50}
  step={1}
  onChange={(v) => setGridConfig({ ...gridConfig, cols: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Left-side label |
| `value` | `number` | Current value |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `step` | `number` | Step increment |
| `onChange` | `(value: number) => void` | Called on drag |

**Value display:** integer if `step >= 1`, one decimal if `step >= 0.1`, two decimals otherwise.

---

## TessorButton

**File:** `src/app/components/ui/TessorButton.tsx`

A 32px-tall action button. Supports primary (yellow accent) and secondary (surface) variants. Optional tooltip when disabled. Primary variant uses `--t-accent` background with `--t-accent-contrast` text.

```tsx
<TessorButton
  label="Export"
  onClick={handleExport}
  variant="primary"
  fullWidth
  disabled={isExporting}
  tooltip="Export in progress..."
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Button text |
| `onClick` | `() => void` | — | Click handler |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Color style |
| `fullWidth` | `boolean` | `true` | Whether button fills container width |
| `disabled` | `boolean` | `false` | Disables the button |
| `tooltip` | `string` | — | Tooltip shown on hover when disabled |

---

## TessorSelect

**File:** `src/app/components/ui/TessorSelect.tsx`

A 32px-tall row with a label and a native `<select>` element, right-aligned with a custom caret.

```tsx
<TessorSelect
  label="Easing"
  value={animConfig.easing}
  options={['linear', 'easeInOutSine', 'easeOutCubic']}
  onChange={(v) => setAnimConfig({ ...animConfig, easing: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Left-side label |
| `value` | `string` | Currently selected option |
| `options` | `string[]` | Array of option values/labels |
| `onChange` | `(value: string) => void` | Called on selection change |

---

## TessorToggle

**File:** `src/app/components/ui/TessorToggle.tsx`

A 32px-tall row with a label and a rectangular toggle switch (yellow accent when on).

```tsx
<TessorToggle
  label="State"
  value={animConfig.enabled}
  onChange={(v) => setAnimConfig({ ...animConfig, enabled: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Left-side label |
| `value` | `boolean` | Current toggle state |
| `onChange` | `(value: boolean) => void` | Called on toggle |

---

## TessorFileUpload

**File:** `src/app/components/ui/TessorFileUpload.tsx`

A styled button that opens a hidden `<input type="file">` when clicked.

```tsx
<TessorFileUpload
  label="Import JSON"
  accept="application/json"
  onChange={handleLoadConfig}
  hideIcon
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Button label text |
| `accept` | `string` | — | MIME type or file extension filter |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | — | File selection handler |
| `hideIcon` | `boolean` | `false` | Hide the upload icon |

---

## TessorFormatSelector

**File:** `src/app/components/ui/TessorFormatSelector.tsx`

A horizontal button group for selecting among 4–5 format options. Selected item has a white border.

```tsx
<TessorFormatSelector
  value={exportFormat}
  options={['SVG', 'WEBP', 'JSON', 'WEBM', 'MP4']}
  onChange={(v) => setExportFormat(v)}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Currently selected option |
| `options` | `string[]` | 4 or 5 option strings (auto-adjusts grid columns) |
| `onChange` | `(value: string) => void` | Called on selection |

---

## AspectRatioSelector

**File:** `src/app/components/ui/AspectRatioSelector.tsx`

A 4-button visual grid showing aspect ratio proportions. Each button is sized to match its ratio. Selected item has a white border.

```tsx
<AspectRatioSelector
  value={canvasConfig.aspectRatio}
  onChange={(v) => setCanvasConfig({ ...canvasConfig, aspectRatio: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | One of `'16:9'`, `'9:16'`, `'4:3'`, `'1:1'` |
| `onChange` | `(value: string) => void` | Called on selection |

---

## ResolutionSelector

**File:** `src/app/components/ui/ResolutionSelector.tsx`

A concentric-rectangle picker for HD / 2K / 4K resolution. The three rectangles are nested from largest (4K) to smallest (HD). Selected item gets a white border and dotted fill.

```tsx
<ResolutionSelector
  value={canvasConfig.resolution}
  onChange={(v) => setCanvasConfig({ ...canvasConfig, resolution: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | One of `'HD'`, `'2K'`, `'4K'` |
| `onChange` | `(value: string) => void` | Called on selection |

---

## Composing a full settings panel — recipe

This example shows the minimal wiring to use the Tessor* system in a new React/Vite project. Copy `src/app/components/ui/` into your project and import from there.

```tsx
import { useState } from 'react';
import { TessorPanel, TessorTab, TessorSection } from './ui/TessorPanel';
import { TessorSlider } from './ui/TessorSlider';
import { TessorSelect } from './ui/TessorSelect';
import { TessorToggle } from './ui/TessorToggle';
import { TessorButton } from './ui/TessorButton';

export function MyApp() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [color, setColor] = useState('#ff0000');
  const [mode, setMode] = useState('uniform');
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex h-screen bg-neutral-900">
      {/* Your canvas/content area */}
      <div className="flex-1" />

      {/* Settings panel */}
      <TessorPanel isOpen={panelOpen} onToggle={() => setPanelOpen(!panelOpen)}>
        <TessorTab label="Style">
          <TessorSection title="Appearance">
            <TessorToggle label="Visible" value={visible} onChange={setVisible} />
            <TessorSlider label="Opacity" value={opacity} min={0} max={1} step={0.01} onChange={setOpacity} />
            <TessorSelect label="Mode" value={mode} options={['uniform', 'radial', 'wave']} onChange={setMode} />
          </TessorSection>
          <TessorSection title="Actions">
            <TessorButton label="Apply" onClick={() => console.log(opacity, color)} variant="primary" />
            <TessorButton label="Reset" onClick={() => { setOpacity(1); setColor('#ff0000'); }} variant="secondary" />
          </TessorSection>
        </TessorTab>
      </TessorPanel>
    </div>
  );
}
```

**Required Tailwind setup:** the components use Tailwind utility classes. Make sure Tailwind is configured to scan the `ui/` directory. The panel also uses a custom scrollbar class (`tessor-scrollbar`) — add `.tessor-scrollbar` to your global CSS, or remove it.

---

## Dynamic Controls Component Family

**File:** `src/app/components/ui/DynamicControls.tsx`

A horizontal strip of interactive control pills for use in panel sections. Click-to-expand behavior with horizontal scroll value cycling. Designed to be compact (44px tall) while providing full control precision.

### Design Tokens

| Token | Value |
|---|---|
| Height | `44px` |
| Border radius | `4px` |
| Default state | `border: 1px solid #2f2f2f` (faint outline, transparent bg) |
| Hover state | `border: 1px solid #2f2f2f`, `bg: #393939` |
| Focus state | `border: 1px solid rgba(255,255,255,0.3)`, `bg: #393939` |
| Expanded state | `bg: #393939` |
| Gap between pills | `4px` |
| Label | `11px`, `rgba(255,255,255,0.5)` |
| Value | `14px`, `white` |
| Unit suffix | `11px`, `#a1a1a1` |
| Expanded pill | `flex: 1 0 0` |
| Collapsed pill | icon only, `flex-shrink: 0`, `padding: 4px` |
| Toggle ON | `--t-toggle-knob-on` (yellow accent) with warm glow |
| Select selected text | `--t-accent-text` (yellow-11, readable accent text) |
| Toggle active text | `--t-toggle-active-text` (yellow-11, readable accent text) |
| Toggle OFF | `--t-toggle-knob-off` (warm gray) |
| Expand/collapse | `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Background transition | `80ms ease-out` |

### Interaction Model

- **Click to expand**: click a pill to expand it; no hover-to-expand
- **Click background to collapse**: clicking anywhere on expanded pill except the inner controller collapses it
- **Click outside to collapse**: clicking outside the group collapses the active pill
- **Horizontal scroll**: in default state, horizontal wheel/trackpad scrolling cycles values
  - Decimal ranges (≤1): jump 0.1
  - Ranges ≤100: jump 10
  - Ranges ≤1000: jump 100
  - Ranges >1000: jump 1000
  - Ctrl/Cmd held: granular (uses step value)
  - Enum controls: cycles through options list (wrapping)

---

### DynamicControlGroup

The container that owns the `activeId` state and click-outside collapse listener. Renders as a `role="group"` flex row.

```tsx
<DynamicControlGroup label="Animation controls">
  <DynamicControl ... />
  <DynamicControl ... />
</DynamicControlGroup>
```

| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Must be `DynamicControl` elements |
| `label` | `string` | `aria-label` for the group |

---

### DynamicControl

A single pill inside a `DynamicControlGroup`. Reads context to determine its state (default / expanded / collapsed). Click toggles expansion; keyboard Enter/Space also works.

```tsx
<DynamicControl
  id="anim-duration"
  label="Duration"
  value="2000"
  icon={<Timer style={{ width: '10px', height: '10px' }} />}
  numericValue={2000} numericMin={100} numericMax={10000} numericStep={100}
  onNumericChange={(v) => ...}
>
  <DynamicControlNumeric value={2000} min={100} max={10000} step={100} onChange={...} />
</DynamicControl>
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier within the parent `DynamicControlGroup` |
| `label` | `string` | Short label shown in default and expanded states |
| `value` | `string` | Current value shown in default and expanded states |
| `icon` | `ReactNode` | 10×10px icon shown in the collapsed state |
| `children` | `ReactNode` | Sub-control (DynamicControlNumeric, DynamicControlToggle, etc.) |
| `ariaLabel` | `string?` | Full ARIA label including control name + value |
| `numericValue` | `number?` | Current numeric value (enables scroll + inline edit) |
| `numericMin` | `number?` | Minimum value for scroll jump calculation |
| `numericMax` | `number?` | Maximum value for scroll jump calculation |
| `numericStep` | `number?` | Step for granular scroll (Ctrl held) |
| `onNumericChange` | `(v: number) => void?` | Called on scroll or inline edit commit |
| `scrollOptions` | `string[]?` | Options list for enum scroll cycling |
| `onScrollChange` | `(v: string) => void?` | Called when scroll cycles enum value |

**States:**
- **Default**: faint outline, label + value + `>>` caret; hover adds background
- **Expanded**: `bg: #393939`; label+value on left, sub-control on right, `<<` caret
- **Collapsed**: icon only (other pills collapse when one is expanded)

**Keyboard:** `Tab` to focus; `Enter`/`Space` to expand; `Escape` to collapse.

---

### DynamicControlNumeric (was DynamicSlider)

A draggable slider track with tick marks and yellow accent position indicator. Uses pointer capture for drag-lock integration.

```tsx
<DynamicControlNumeric
  value={animConfig.duration}
  min={100}
  max={10000}
  step={100}
  unit="ms"
  onChange={(v) => setAnimConfig({ ...animConfig, duration: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `number` | Current value |
| `min` | `number` | Minimum |
| `max` | `number` | Maximum |
| `step` | `number` | Step increment |
| `unit` | `string?` | Optional unit label |
| `onChange` | `(v: number) => void` | Called on drag |

**Keyboard:** `ArrowLeft`/`ArrowRight` adjust by step; `Home`/`End` jump to min/max.

---

### DynamicControlToggle (was DynamicToggle)

A compact rectangular toggle switch (yellow glow = ON, warm gray = OFF).

```tsx
<DynamicControlToggle
  value={animConfig.enabled}
  onChange={(v) => setAnimConfig({ ...animConfig, enabled: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `boolean` | Toggle state |
| `onChange` | `(v: boolean) => void` | Called on click |

Rendered with `role="switch"` and `aria-checked`.

---

### DynamicControlDropdown (was DynamicSelect)

A custom ARIA-accessible dropdown with automatic upward/downward positioning.

```tsx
<DynamicControlDropdown
  value={animConfig.easing}
  options={['linear', 'easeInOutSine', 'easeOutCubic']}
  onChange={(v) => setAnimConfig({ ...animConfig, easing: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Currently selected option |
| `options` | `string[]` | Available options |
| `onChange` | `(v: string) => void` | Called on selection |

**Keyboard:** `ArrowUp`/`ArrowDown` cycle options; `Home`/`End` jump to first/last; `Escape` closes.

---

### DynamicControlSegmented (was DynamicSplitToggle)

An inline button group for small fixed option sets (e.g. Direction: Normal / Reverse / Alternate).

```tsx
<DynamicControlSegmented
  value={animConfig.direction}
  options={['normal', 'reverse', 'alternate']}
  onChange={(v) => setAnimConfig({ ...animConfig, direction: v })}
/>
```

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Active option |
| `options` | `string[]` | 2–4 options (each gets equal width) |
| `icons` | `Record<string, ReactNode>?` | Optional icon map |
| `onChange` | `(v: string) => void` | Called on selection |

**Keyboard:** `ArrowLeft`/`ArrowRight` cycle; `Home`/`End` jump; buttons use `role="radio"`.

---

### Motion Tab Usage Example

```tsx
import { DynamicControlGroup, DynamicControl, DynamicControlNumeric, DynamicControlToggle, DynamicControlDropdown, DynamicControlSegmented } from './ui/DynamicControls';
import { SoloControlGroup, SoloControl, SoloControlToggle } from './ui/SoloControls';
import { Play, Timer } from 'lucide-react';

{/* Single-control group → use Solo variants */}
<SoloControlGroup label="Animation controls row 1">
  <SoloControl id="anim-state" label="State" value={animConfig.enabled ? 'ON' : 'OFF'} icon={<Play style={{ width: '10px', height: '10px' }} />}
    scrollOptions={['OFF', 'ON']} onScrollChange={(v) => setAnimConfig({ ...animConfig, enabled: v === 'ON' })}>
    <SoloControlToggle value={animConfig.enabled} onChange={(v) => setAnimConfig({ ...animConfig, enabled: v })} />
  </SoloControl>
</SoloControlGroup>

{/* Multi-control group → use DynamicControl variants */}
<DynamicControlGroup label="Animation controls row 2">
  <DynamicControl id="anim-duration" label="Duration" value={`${animConfig.duration}`} unit="ms" icon={<Timer style={{ width: '10px', height: '10px' }} />}
    numericValue={animConfig.duration} numericMin={100} numericMax={10000} numericStep={100} onNumericChange={(v) => setAnimConfig({ ...animConfig, duration: v })}>
    <DynamicControlNumeric value={animConfig.duration} min={100} max={10000} step={100} onChange={(v) => setAnimConfig({ ...animConfig, duration: v })} />
  </DynamicControl>
</DynamicControlGroup>
```

---

## SoloControls

**File:** `src/app/components/ui/SoloControls.tsx`

Re-exports of DynamicControl components with `Solo` prefix, used for single-control `DynamicControlGroup` instances. Functionally identical — the naming convention distinguishes groups containing exactly one control (Solo) from groups containing multiple controls (Dynamic).

| Solo Export | Re-exports |
|---|---|
| `SoloControlGroup` | `DynamicControlGroup` |
| `SoloControl` | `DynamicControl` |
| `SoloControlNumeric` | `DynamicControlNumeric` |
| `SoloControlToggle` | `DynamicControlToggle` |
| `SoloControlDropdown` | `DynamicControlDropdown` |
| `SoloControlColor` | `DynamicControlColor` |
| `SoloControlSegmented` | `DynamicControlSegmented` |

**When to use:** Any `DynamicControlGroup` with exactly one child `DynamicControl` should use Solo variants instead.

---

## Adding a New Tessor Component

When you add a new Tessor component:

1. Create the component file in `src/app/components/ui/`.
2. Add an entry to this file with the component name, file path, props table, and a usage example.
3. Update the `<!-- Last updated: ... -->` date at the top of this file.
4. Add it to `CLAUDE.md` → Project Structure section under `ui/`.
