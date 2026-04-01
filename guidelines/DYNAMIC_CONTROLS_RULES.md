# Dynamic Controls Build Rules — Tessor

<!-- Last updated: 2026-03-30 — DynamicControl rename sync -->

Rules derived from past build mistakes. Always follow these when modifying Dynamic Controls or wiring controls in the Motion tab.

---

## Figma Source of Truth

- Figma file: `2f8Iym0saPTeRh5Po6hVOs`
- Nodes: `43-10656` (interactions/states), `45-14` (motion tab overview), `79-435` (color picker)
- **Always fetch the Figma design context before making any style changes.** Do not guess dimensions, gaps, colors, or layout. Extract exact values from the Figma node.

---

## Layout Rules (from Figma node 43-10656)

### Expanded Pill Layout

The expanded pill is a **horizontal flex row** with two children:

1. **Left group** (label + value): `flex-shrink: 0`, `min-width: fit-content`, stacks label row and value vertically with `gap: 6px`.
2. **Right group** (controller): `flex: 1 0 0`, `justify-content: flex-end`. The controller fills remaining space, but its content is right-aligned so fixed-size controllers (toggle, split-toggle) sit at the **right edge**.

This means:
- Toggles (33px fixed): sit flush against the right edge of the pill.
- Sliders (`flex: 1 0 0` internally): fill the controller area.
- Selects (`flex: 1 0 0` internally): fill the controller area.
- Split toggles (`flex-shrink: 0`): sit at the right edge.

**Never** leave the controller left-aligned inside a flex-1 wrapper. Always use `justify-content: flex-end` on the controller wrapper.

### Gap Values (from Figma)

- Toggle controls: parent pill gap = `6px`
- Slider/Select/SplitToggle controls: parent pill gap = `20px`

Currently the code uses a uniform gap. When precision matters, differentiate by control type.

### Solo Controls (single child in DynamicControlGroup)

- A DynamicControlGroup with exactly 1 child must **always render expanded** (no hover-to-expand).
- The solo pill uses `role="group"`, `tabIndex={-1}`, no `aria-expanded`.
- No hover/keyboard collapse handlers — the pill is always open.
- This is detected via `React.Children.count(children)` → `childCount` in context.

---

## Design Tokens (from Figma)

| Token | Value |
|---|---|
| Pill height | `44px` |
| Border radius | `4px` |
| Rest background | `#2f2f2f` |
| Hover/expanded background | `#393939` |
| Focus border | `1px solid rgba(255,255,255,0.3)` |
| Label font | `11px`, `white`, `opacity: 0.5`, `IBM Plex Sans` |
| Value font | `14px`, `white`, `IBM Plex Sans` |
| Unit font | `11px`, `#a1a1a1` |
| Collapsed pill | `shrink-0`, icon only at `10x10px`, `padding: 4px` |
| Default pill | `flex-col`, `gap: 6px`, `padding: 6px`, label + value visible |
| Expanded pill | flex row, `padding: 6px`, label+value left, controller right |

### Toggle Button

| Token | Value |
|---|---|
| Width | `33px` |
| Track bg | `var(--t-toggle-track)` |
| Track padding | `2px` |
| Thumb width | `14px` |
| ON thumb | `var(--t-toggle-knob-on)` (yellow accent), border-radius `4px`, warm glow shadow |
| OFF thumb | `var(--t-toggle-knob-off)` (warm gray), border-radius `3px`, no shadow |
| ON shadow | `var(--t-toggle-knob-on-glow)` |

### Slider Track

| Token | Value |
|---|---|
| Track bg | `var(--t-toggle-track)` |
| Padding | `2px 12px` |
| Tick marks | 12 warm gray (`var(--t-slider-tick)`) bars, `1px × 12px`, `border-radius: 3px` |
| Position indicator | `2px × 60%` height, `var(--t-slider-cursor)` (yellow accent), warm glow shadow |

### Transition Timing

| Transition | Value |
|---|---|
| Expand/collapse flex | `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Background color | `80ms ease-out` |
| Click to expand | Click pill to expand, click again or outside to collapse |
| Toggle thumb transition | `150ms ease` |

---

## Label Row Layout

### Icon
Each pill has a **bidirectional caret icon** (`CaretBidirectional`) next to the label. The icon is `10×10px`, white fill at `opacity: 0.2`, `flex-shrink: 0`. The SVG paths are extracted directly from Figma — do not approximate.

- **Default state (outward)**: arrows point outward (`< >`) — left arrow on left side, right arrow on right side, with a wide gap between them
- **Expanded state (inward)**: arrows point inward (`> <`) — right arrow on left side, left arrow on right side, with narrower gap

### Default (Collapsed) State
- Label row: `display: flex`, `justify-content: space-between`, `width: 100%`, `gap: 4px`
- Label text is on the left, icon is on the right
- The `gap: 4px` acts as a minimum gap; `space-between` spreads them apart when the pill is wide

### Expanded State
- Label row: `display: flex`, `gap: 4px`, `width: fit-content`
- Label and icon are grouped tightly (4px gap), aligned to the left

---

## TessorSection Collapsibility

`TessorSection` accepts a `collapsible` prop (default `true`):
- `collapsible={true}`: shows chevron toggle, click to collapse/expand content
- `collapsible={false}`: shows only the section title (no chevron), content always visible

Rule: sections with fewer than 4 rows of Dynamic Controls should use `collapsible={false}`.

---

## Scroll Behavior

### Numeric Controls
- Trackpad swipe right / scroll left → increment value
- Trackpad swipe left / scroll right → decrement value
- Direction is mapped for natural scrolling (trackpad as base): negative `deltaX` = increment, positive `deltaX` = decrement
- Values are clamped (not cycled) at min/max boundaries
- Jump amounts: Ctrl/Cmd = step size; default = auto-jump based on range

### Enum Controls
- Scroll cycles through options (wraps around)
- Uses `scrollOptions` and `onScrollChange` props

---

## Overflow Rules

- **Expanded pills** must use `overflow: visible` so dropdown menus (DynamicControlDropdown) can render outside the pill boundaries.
- **Default/collapsed pills** use default overflow (visible by default in CSS).
- The DynamicControlDropdown dropdown uses `position: absolute` with `z-index: 100`.
- Always verify dropdown z-index is high enough to layer above adjacent pills.

---

## Common Mistakes to Avoid

1. **Do not use `overflow: hidden` on expanded pills.** This clips dropdown menus.
2. **Do not leave controllers left-aligned.** Always use `justify-content: flex-end` on the controller wrapper so fixed-size controllers (toggle, split-toggle) sit at the right edge.
3. **Do not add `role="button"` or `tabIndex={0}` to solo controls.** Solo controls are always-expanded and don't need button semantics.
4. **Do not add Rotation/Scale "To" controls.** Rotation and Scale only have State and From. Opacity has State, From, and To.
5. **Do not use Play/Undo2/Repeat icons for Direction.** Use ArrowRight, ArrowLeft, ArrowLeftRight.
6. **Do not display more than 2 decimal places** in numeric values.
7. **Do not put more than 3 controls in a single DynamicControlGroup row.** Split into multiple rows when needed.
8. **Always check the Figma node before making style changes** — never guess visual properties.
9. **Do not use `justify-content: space-between` on the pill itself** if one child has `flex: 1 0 0` — the flex-grow consumes all space, making space-between a no-op. Instead, use `justify-content: flex-end` on the flex-1 child to push its contents rightward.
10. **Test dropdown opening after any overflow/layout change.** Click the dropdown button and verify the options list appears.
11. **Use `--t-accent-text` (yellow-11) for accent-colored control text**, not `--t-accent` (yellow-9). Yellow-9 is for solid backgrounds/indicators only; it does not meet text readability thresholds. This applies to DynamicControlDropdown selected values, DynamicControlSegmented active text, and any other accent-colored text in controls.
