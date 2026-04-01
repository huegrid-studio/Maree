# Maree

A React + Vite SVG pattern generation tool built with the Tessor design system. Configure a grid of repeating shapes, apply transforms and clip masks, animate them, and export as SVG, WEBP, WEBM, MP4, or JSON.

Made by **Arjun Phlox** at **HueGrid**.

## Running the project

```bash
npm install
npm run dev
```

Dev server runs on port 5000.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Key features

- **Canvas tab** — Set aspect ratio (16:9, 9:16, 4:3, 1:1), resolution (HD/2K/4K), background color, and export format.
- **Pattern tab** — Configure grid dimensions, gaps, cell size, and seed. Choose which shape types appear via the Element Combo Grid and set the fill sequence (sequential, checkerboard, random, row, col). Apply per-element transforms: rotation, scale, and opacity modes (uniform, radial, wave, random, per-element).
- **Elements tab** — Per-shape styling controls (size, fill, stroke, radius, etc.) for Line, Dot, Square, Rectangle, Star, and uploaded Custom SVGs (up to 5).
- **Clip/Mask tab** — Apply a preset SVG clip shape or upload your own to mask the entire pattern. Scale controls and fit-to-canvas.
- **Motion tab** — Enable looping animation with configurable duration, easing, direction, and stagger. Animate rotation, scale, opacity, and translation independently.
- **Config JSON** — Export the full app state as JSON; re-import to restore any saved configuration.

## Project layout

```
src/
  main.tsx                      Entry point
  app/
    App.tsx                     All state, handlers, and panel JSX
    constants.ts                SHAPES enum, CUSTOM_SVG_PREFIX, RESOLUTIONS
    types.ts                    TypeScript interfaces
    config/default-config.ts    Default values for every state slice
    components/
      RenderShape.tsx           SVG renderer (handles all shape types + animation)
      ElementComboGrid.tsx      Multi-select shape picker with custom SVG upload
      ClipShapeGrid.tsx         Preset clip-shape grid with custom upload
      ui/                       Tessor* design system components
    hooks/
      useAnimationTime.ts       rAF-based animation clock
    utils/
      canvas.ts                 calcCanvasSize()
      export.ts                 SVG / WEBP / WEBM / MP4 / JSON export helpers
      grid-generator.ts         generateElements() — computes element positions
      shapes.ts                 shapePaths helpers (rectangle, star)
      math.ts                   math utilities and easing functions
      svg-parser.ts             parseSVG() — extracts path + viewBox from SVG text
      clips.ts                  loadClipSVG() helper
  styles/index.css
clip_svgs/                      Preset clip mask SVGs (Phosphor Icons filled set)
guidelines/
  TESSOR_COMPONENTS.md          Reference for the Tessor* UI system
  AGENT_ITERATION.md            Step-by-step guide for extending the app
```
