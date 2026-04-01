# Agent Iteration Guide — Tessor

<!-- Last updated: 2026-03-31 — Component sync (duration tokens, TessorPanel theme toggle, ElementComboGrid square cells) -->

This document is the quick-reference agents check before starting and closing any task. It describes how to extend Tessor without reading the full codebase, and maps change categories to the docs that must be updated.

---

## Documentation Maintenance

Before closing a task, check whether any changes fall into the categories below. If they do, update the listed doc(s) **in the same task**.

| Change category | Affected docs |
|-----------------|--------------|
| Add or remove a shape type (e.g. new `Triangle` in `SHAPES`) | `CLAUDE.md` → Shape Types section; `guidelines/AGENT_ITERATION.md` → update relevant recipes |
| Change a shape's rendering logic or props (`RenderShape.tsx`, `shapes.ts`) | No doc update required unless the shape type itself is added/removed |
| Add, rename, or change a Tessor UI control or its props | `guidelines/TESSOR_COMPONENTS.md` |
| Add or remove a UI panel or major component | `CLAUDE.md` → Project Structure section |
| Move, rename, or restructure source files or directories | `CLAUDE.md` → Project Structure section |
| Change the `PatternConfig` schema or add/remove config fields | `CLAUDE.md` → Active State Slices / Panel Tabs sections |
| Change the tab order or introduce a new tab | `CLAUDE.md` → Panel Tabs section |
| Add or change a utility module in `src/app/utils/` | `CLAUDE.md` → Project Structure section (utils list) |
| Add or remove a clip SVG or change clip loading logic | No doc update required (clip assets are self-describing) |
| Add a new architectural subsystem (e.g. new export pipeline, animation engine) | `CLAUDE.md` and `guidelines/AGENT_ITERATION.md` |
| Trivial changes: bug fixes, style tweaks, copy edits | No doc update required |

---

## Task Workflow

Follow these steps for each task:

1. **Read `CLAUDE.md`** — confirm the project structure, shape types, and pattern system match your mental model before making changes.
2. **Check this file** — identify which doc(s) your change category affects.
3. **Implement the change.**
4. **Update affected docs** — do this in the same task, not as a follow-up.
5. **Run `bash scripts/check-docs.sh`** — verify docs are not flagged as stale.
6. **Commit** — include a brief note in the commit message about which docs were updated (or why none were needed).

---

## Architecture Overview

```
App.tsx
  ├── State slices (useState) — one per shape config + canvas/grid/pattern/anim/clip
  ├── shapes = { [SHAPES.RECT]: rectConfig, [SHAPES.DOT]: dotConfig, ... }
  ├── elements = generateElements(gridConfig, patternConfig, canvasW, canvasH)
  │     ↓ produces Element[] with x, y, shapeType, nx, ny, dc, r, idx
  └── JSX: <TessorPanel> tabs → <RenderShape el={el} shapes={shapes} ... />
```

**Data flow:**
1. User adjusts a control → updates a state slice
2. `shapes` memo recomputes → passed to every `RenderShape`
3. `elements` memo recomputes on grid/pattern changes → re-renders SVG
4. `RenderShape` reads `el.shapeType`, looks up config in `shapes` or `customSVGMap`, applies transforms and animation, returns an SVG primitive

---

## Recipe 1: Add a new shape type end-to-end

### Step 1 — Add the constant

In `src/app/constants.ts`, add the new shape to `SHAPES`:

```ts
export const SHAPES = {
  RECT: 'Rectangle',
  DOT: 'Dot',
  LINE: 'Line',
  STAR: 'Star',
  SQUARE: 'Square',
  TRIANGLE: 'Triangle',   // ← new
  CUSTOM_SVG: 'CustomSVG',
  EMPTY: 'Empty',
} as const;
```

### Step 2 — Add a default config

In `src/app/config/default-config.ts`, add a new key:

```ts
export const DEFAULT_CONFIG = {
  // ... existing entries ...
  triangle: {
    size: 30,
    fill: '#00aaff',
    opacity: 1,
  },
};
```

### Step 3 — Add state in App.tsx

In `App.tsx`, add a state variable alongside the other shape configs:

```tsx
const [triangleConfig, setTriangleConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.triangle);
```

Add it to the `shapes` memo:

```tsx
const shapes = useMemo(() => ({
  [SHAPES.RECT]: rectConfig,
  [SHAPES.DOT]: dotConfig,
  [SHAPES.LINE]: lineConfig,
  [SHAPES.STAR]: starConfig,
  [SHAPES.SQUARE]: squareConfig,
  [SHAPES.TRIANGLE]: triangleConfig,  // ← new
}), [rectConfig, dotConfig, lineConfig, starConfig, squareConfig, triangleConfig]);
```

Add it to the export config handler:

```tsx
exportConfig({
  // ... existing keys ...
  triangle: triangleConfig,
});
```

Add it to the load config handler:

```tsx
if (config.triangle) setTriangleConfig(config.triangle);
```

### Step 4 — Add the shape path

In `src/app/utils/shapes.ts`, add a path generator for your shape. Example for an equilateral triangle centered at origin:

```ts
export const shapePaths = {
  // ... existing helpers ...
  triangle: (size: number): string => {
    const h = size * Math.sqrt(3) / 2;
    return `M 0 ${-size * 0.577} L ${size / 2} ${h * 0.333} L ${-size / 2} ${h * 0.333} Z`;
  },
};
```

### Step 5 — Add the render case in RenderShape.tsx

In `src/app/components/RenderShape.tsx`, add a `case` for the new shape in **both** the animated and non-animated `switch` blocks (they are separate — look for the comment `// Animated transforms` to find the boundary):

```tsx
case SHAPES.TRIANGLE:
  return <path d={shapePaths.triangle(cfg.size! * scale)} fill={cfg.fill} opacity={opacity} transform={`translate(${x}, ${y}) rotate(${rotation})`} />;
```

In the animated block (where `finalScaleX`, `finalScaleY`, `translateX`, `translateY` are used):

```tsx
case SHAPES.TRIANGLE:
  return <path d={shapePaths.triangle(cfg.size!)} fill={cfg.fill} opacity={opacity} transform={transform} />;
```

### Step 6 — Add to the Elements tab (App.tsx panel JSX)

Find the Elements `<TessorTab>` in `App.tsx` and add a `<TessorSection>`:

```tsx
<TessorSection title="Triangle">
  <TessorSlider label="Size" value={triangleConfig.size!} min={5} max={100} step={1} onChange={(v) => setTriangleConfig({ ...triangleConfig, size: v })} />
  <!-- TessorColor removed; color is now handled by DynamicControlColor inside DynamicControls -->
</TessorSection>
```

### Step 7 — Add to the ElementComboGrid

In `src/app/components/ElementComboGrid.tsx`, add an entry to the `ELEMENTS` array with an inline SVG icon:

```tsx
const TRIANGLE_ICON = (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <polygon points="12,3 22,21 2,21" fill="currentColor" />
  </svg>
);

const ELEMENTS = [
  // ... existing entries ...
  { key: SHAPES.TRIANGLE, label: 'Triangle', icon: TRIANGLE_ICON },
];
```

### Step 8 — Update docs

- Update `CLAUDE.md` → Shape Types section.
- Update this file if the new shape requires additional recipes.

### Step 9 — Verify

Run `npm run build` (or the dev server). The new shape should appear in the Element Combo Grid, be selectable, render on the canvas, and export correctly in all formats.

---

## Recipe 2: Add a config control to an existing panel tab

This example adds an `Opacity` slider to the existing Dot section in the Elements tab.

1. **Check `ShapeConfig` in `types.ts`** — `opacity` already exists. If adding a new field, add it to the interface.

2. **Add a default value** — In `default-config.ts`, confirm/add the field in the relevant config object.

3. **Add the control in App.tsx** — In the Elements `<TessorTab>`, inside the `<TessorSection title="Dot">` block:

```tsx
<TessorSlider
  label="Opacity"
  value={dotConfig.opacity!}
  min={0}
  max={1}
  step={0.01}
  onChange={(v) => setDotConfig({ ...dotConfig, opacity: v })}
/>
```

4. **Confirm RenderShape uses the field** — `RenderShape` already reads `cfg.opacity` and passes it to the SVG element. No additional changes needed for opacity.

The same pattern applies to any control type — swap `TessorSlider` for `TessorSelect` or `TessorToggle` as appropriate. Color is handled by `DynamicControlColor` inside `DynamicControls`.

---

## Recipe 3: Extend the ElementComboGrid

`ElementComboGrid` (`src/app/components/ElementComboGrid.tsx`) renders the shape picker in the Pattern tab.

**To add a new preset shape button**, add an entry to the `ELEMENTS` array at the top of the file:

```tsx
const ELEMENTS = [
  { key: SHAPES.LINE,     label: 'Line',     icon: LINE_ICON },
  { key: SHAPES.DOT,      label: 'Dot',      icon: DOT_ICON },
  { key: SHAPES.SQUARE,   label: 'Square',   icon: SQUARE_ICON },
  { key: SHAPES.RECT,     label: 'Rect',     icon: RECTANGLE_ICON },
  { key: SHAPES.STAR,     label: 'Star',     icon: STAR_ICON },
  { key: SHAPES.TRIANGLE, label: 'Triangle', icon: TRIANGLE_ICON },  // ← new
];
```

Each cell automatically handles selected state, the `onToggle` callback, and labels. No other changes needed in this file.

**To change the maximum number of custom SVGs**, change the `5` in two places:
- `if (customSVGItems.length >= 5) return;` in `handleElementSVGUpload` in `App.tsx`
- `{customSVGItems.length < 5 && (` in `ElementComboGrid.tsx`

---

## Recipe 4: Add a new config control to the Motion tab

The Motion tab controls `animConfig` (type `AnimationConfig` in `types.ts`). To add a new animated property:

1. **Extend the type** — In `types.ts`, add fields to `AnimationConfig`:

```ts
export interface AnimationConfig {
  // ... existing fields ...
  blurEnabled: boolean;
  blurFrom: number;
  blurTo: number;
}
```

2. **Add defaults** — In `default-config.ts`:

```ts
animation: {
  // ... existing ...
  blurEnabled: false,
  blurFrom: 0,
  blurTo: 10,
},
```

3. **Add controls in App.tsx** — Inside the Motion `<TessorTab>`:

```tsx
<TessorSection title="Blur">
  <TessorToggle label="State" value={animConfig.blurEnabled} onChange={(v) => setAnimConfig({ ...animConfig, blurEnabled: v })} />
  <TessorSlider label="From" value={animConfig.blurFrom} min={0} max={20} step={0.5} onChange={(v) => setAnimConfig({ ...animConfig, blurFrom: v })} />
  <TessorSlider label="To" value={animConfig.blurTo} min={0} max={20} step={0.5} onChange={(v) => setAnimConfig({ ...animConfig, blurTo: v })} />
</TessorSection>
```

4. **Apply in RenderShape.tsx** — Inside the animation block, compute and apply the value:

```tsx
let blur = 0;
if (animConfig.blurEnabled) {
  blur = animConfig.blurFrom + (animConfig.blurTo - animConfig.blurFrom) * progress;
}
// Then apply to the returned element:
// style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined }}
```

---

## State & Data Flow Summary

| Concern | Where it lives |
|---|---|
| All app state | `App.tsx` (`useState` hooks) |
| Derived canvas size | `useMemo(() => calcCanvasSize(...))` in App.tsx |
| Element positions | `useMemo(() => generateElements(...))` in App.tsx |
| Per-element transforms | `RenderShape.tsx` (reads `transforms`, `animConfig`, `time`) |
| Animation clock | `useAnimationTime(animConfig.enabled)` → `time` (ms elapsed) |
| Shape config lookup | `shapes[el.shapeType]` or `customSVGMap[el.shapeType]` |
| Export | `src/app/utils/export.ts` — reads `svgRef.current`, serializes state |

**Key invariant:** `patternConfig.elements` is an array of shape-type strings (e.g. `['Line', 'Dot']`). `generateElements` distributes shape types across grid cells according to the sequence mode. `RenderShape` then uses `el.shapeType` to select the right config and render the right SVG element.

Custom SVGs use keys of the form `custom_svg_<id>`. Their configs live in `customSVGMap` (derived from `customSVGItems`) rather than in `shapes`.

---

## Control Addition Recipe

When adding a new Tessor UI control variant:

1. Implement the component in `src/app/components/ui/`.
2. Export it from the `ui/` barrel if one exists.
3. Update `guidelines/TESSOR_COMPONENTS.md` with the new component's props, variants, and usage example.
4. Update `CLAUDE.md` → Project Structure section if it is a new file.

---

## Recipe 5: Add a new Dynamic Controls section to the Motion tab

The Dynamic Controls system (`src/app/components/ui/DynamicControls.tsx`) provides compact horizontal pill controls for the Motion tab. To add a new section:

### Step 1 — Extend `AnimationConfig` if needed

In `types.ts`, add fields for the new animated property:

```ts
export interface AnimationConfig {
  // ... existing fields ...
  blurEnabled: boolean;
  blurFrom: number;
  blurTo: number;
}
```

### Step 2 — Add defaults

In `default-config.ts`:

```ts
animation: {
  // ... existing ...
  blurEnabled: false,
  blurFrom: 0,
  blurTo: 10,
},
```

### Step 3 — Add a Dynamic Controls section in App.tsx

Inside the Motion `<TessorTab>`, add a new `<TessorSection>` with a `<DynamicControlGroup>`:

```tsx
import { Droplets } from 'lucide-react';

<TessorSection title="Blur">
  <DynamicControlGroup label="Blur controls">
    <DynamicControl
      id="blur-state"
      label="State"
      value={animConfig.blurEnabled ? 'ON' : 'OFF'}
      icon={<Droplets style={{ width: '10px', height: '10px' }} />}
      scrollOptions={['OFF', 'ON']}
      onScrollChange={(v) => setAnimConfig({ ...animConfig, blurEnabled: v === 'ON' })}
    >
      <DynamicControlToggle value={animConfig.blurEnabled} onChange={(v) => setAnimConfig({ ...animConfig, blurEnabled: v })} />
    </DynamicControl>
    <DynamicControl
      id="blur-from"
      label="From"
      value={`${animConfig.blurFrom}`}
      icon={<ChevronsUpDown style={{ width: '10px', height: '10px' }} />}
      numericValue={animConfig.blurFrom} numericMin={0} numericMax={20} numericStep={0.5}
      onNumericChange={(v) => setAnimConfig({ ...animConfig, blurFrom: v })}
    >
      <DynamicControlNumeric value={animConfig.blurFrom} min={0} max={20} step={0.5} unit="px" onChange={(v) => setAnimConfig({ ...animConfig, blurFrom: v })} />
    </DynamicControl>
    <DynamicControl
      id="blur-to"
      label="To"
      value={`${animConfig.blurTo}`}
      icon={<ChevronsUpDown style={{ width: '10px', height: '10px' }} />}
      numericValue={animConfig.blurTo} numericMin={0} numericMax={20} numericStep={0.5}
      onNumericChange={(v) => setAnimConfig({ ...animConfig, blurTo: v })}
    >
      <DynamicControlNumeric value={animConfig.blurTo} min={0} max={20} step={0.5} unit="px" onChange={(v) => setAnimConfig({ ...animConfig, blurTo: v })} />
    </DynamicControl>
  </DynamicControlGroup>
</TessorSection>
```

### Sub-control reference

| Control type | Component | Use for |
|---|---|---|
| Boolean on/off | `DynamicControlToggle` | Enable/disable flags |
| Numeric range | `DynamicControlNumeric` | Duration, amounts, angles |
| Enum selection (many) | `DynamicControlDropdown` | Easing, stagger type |
| Enum selection (few) | `DynamicControlSegmented` | Direction (3 options) |
| Color picker | `DynamicControlColor` | Fill colors, background colors |

### Step 4 — Apply in RenderShape.tsx

See Recipe 4 for how to consume new `animConfig` fields in the render loop.

### Step 5 — Update docs

Update `guidelines/TESSOR_COMPONENTS.md` if the sub-control interface changes. No doc update needed for just adding a new section.

---

## File Structure Change Recipe

When moving, renaming, or restructuring files:

1. Update all import paths across the codebase.
2. Update `CLAUDE.md` → Project Structure section.
3. Run the app to confirm nothing is broken.
