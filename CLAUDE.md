# Maree

Browser-only SVG pattern generator — React 18 + TypeScript + Tailwind CSS 4 + Vite 6. No backend. Syncs its entire UI component layer from the [Tessor](../Tessor/) design system workbench.

## Dev commands

```bash
npm install          # install dependencies
npm run dev          # Vite dev server on :5002
npm run build        # production build → dist/
```

## Tessor sync

Maree syncs 26 files (UI components, tokens, utilities, contexts, hooks) from Tessor via its `/api/sync.json` endpoint. Tessor must be running locally for sync to work.

```bash
# Start Tessor first (in separate terminal):
cd ../Tessor && npm run dev    # Vite :5000 + Express API :3001

# Then sync from Maree:
node scripts/sync-from-workbench.mjs http://localhost:5000
```

The sync script compares MD5 hashes and writes only changed files. Run it whenever you want to pull the latest Tessor changes.

**Synced files** (managed by Tessor — modify there, not here):
- `src/app/components/ui/*` — all 16 Tessor UI components
- `src/app/components/RenderShape.tsx`, `ElementComboGrid.tsx`, `ClipShapeGrid.tsx`, `PhosphorIconPicker.tsx`
- `src/app/context/ThemeContext.tsx`, `PreviewCardContext.tsx`
- `src/app/hooks/useTokenSync.ts`
- `src/app/utils/haptics.ts`, `token-sync.ts`
- `src/styles/tokens.css`

**NOT synced** (Maree-specific):
- `src/app/config/brand.ts` — Maree identity (name, storage keys, theme key)
- `src/app/config/sync.ts` — WORKBENCH_URL pointing to local Tessor
- `src/app/App.tsx` — all app state and panel UI

## Architecture

**Styling:** CSS custom properties (`--t-*` tokens) in `src/styles/tokens.css`, light/dark/system theme via `ThemeContext`

### Project structure

```
src/
├── main.tsx                           Entry point (wraps App in ThemeProvider)
├── app/
│   ├── App.tsx                        Main component — all state and panel UI
│   ├── constants.ts                   SHAPES enum, CUSTOM_SVG_PREFIX, RESOLUTIONS
│   ├── types.ts                       TypeScript interfaces
│   ├── config/
│   │   ├── brand.ts                   SYSTEM_NAME, STORAGE_KEY_PREFIX, THEME_STORAGE_KEY
│   │   ├── default-config.ts          DEFAULT_CONFIG object
│   │   └── sync.ts                    WORKBENCH_URL (http://localhost:5000)
│   ├── components/
│   │   ├── RenderShape.tsx            SVG shape renderer (all types + animation)
│   │   ├── ElementComboGrid.tsx       Element type picker + custom SVG upload
│   │   ├── ClipShapeGrid.tsx          Clip mask preset grid + custom upload
│   │   ├── PhosphorIconPicker.tsx     Icon picker component
│   │   └── ui/                        16 Tessor UI components (synced from Tessor)
│   ├── context/                       ThemeContext, PreviewCardContext
│   ├── hooks/                         useAnimationTime, useTokenSync
│   └── utils/                         export, shapes, math, grid-generator, canvas, clips, haptics, svg-parser, token-sync
├── styles/
│   ├── tokens.css                     Design tokens (--t-* CSS custom properties, light/dark)
│   ├── theme.css                      Tailwind theme config
│   ├── fonts.css                      IBM Plex Sans font imports
│   ├── tailwind.css                   Tailwind CSS base import
│   └── index.css                      CSS imports
clip_svgs/                             SVG clip mask presets (27 sets)
scripts/
│   ├── sync-from-workbench.mjs        Tessor sync script
│   ├── check-docs.sh                  Doc freshness warning
│   └── post-merge.sh                  Post-merge npm install + doc reminder
guidelines/
│   ├── AGENT_ITERATION.md             Agent task workflow + recipes
│   ├── TESSOR_COMPONENTS.md           Component API reference
│   └── DYNAMIC_CONTROLS_RULES.md      DynamicControl system rules
```

## Shape types

| Shape | Config | Renderer |
|-------|--------|----------|
| Rectangle | `rectConfig` | `shapePaths.rectangle()` |
| Dot | `dotConfig` | circle element |
| Line | `lineConfig` | stroke with length/angle |
| Star | `starConfig` | `shapePaths.star()` |
| Square | `squareConfig` | equal-sided rect |
| Triangle | `triangleConfig` | `shapePaths.triangle()` |
| Cross | `crossConfig` | `shapePaths.cross()` |
| Diamond | `diamondConfig` | `shapePaths.diamond()` |
| CustomSVG | `customSVGItems` | dynamic `custom_svg_<id>` keys |

## Panel tabs

1. **Canvas** — aspect ratio, resolution, background color, export format
2. **Pattern** — grid config, element combo, sequence mode, transforms
3. **Elements** — per-shape styling (sliders, color pickers, selects)
4. **Clip/Mask** — clip preset grid, scale, fit
5. **Motion** — animation toggle, duration, easing, stagger, per-property ranges

## Data flow

1. User adjusts control → updates state slice in `App.tsx`
2. `shapes` memo recomputes → passed to every `RenderShape`
3. `elements` memo recomputes on grid/pattern changes → re-renders SVG
4. `RenderShape` reads `el.shapeType`, looks up config, applies transforms and animation

## Export formats

SVG, WEBP, JSON (config), WEBM, MP4 — all handled in `src/app/utils/export.ts`

## Do NOT change

- **`src/app/config/brand.ts`** — Maree identity; sync deliberately skips this
- **Synced component internals** — modify in Tessor, then sync; don't edit locally
- **`src/app/config/sync.ts`** — only change if Tessor's URL changes

## Active Work
- [ ] (no active tasks — check BACKLOG.md for priorities)

## Documentation policy

| Change category | Update |
|-----------------|--------|
| Add/remove shape type | `CLAUDE.md` Shape Types + `guidelines/AGENT_ITERATION.md` |
| Add/rename Tessor control | `guidelines/TESSOR_COMPONENTS.md` |
| Move/rename/restructure files | `CLAUDE.md` Project Structure |
| Change PatternConfig schema or tabs | `CLAUDE.md` Panel Tabs / State Slices |
| New architectural subsystem | `CLAUDE.md` + `guidelines/AGENT_ITERATION.md` |
| Bug fixes, style tweaks | No doc update required |

Run `bash scripts/check-docs.sh` to check for stale docs.
