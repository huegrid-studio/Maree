---
name: Maree build & type-check
description: How Maree type-checks (strict tsconfig, noUnusedLocals off because of Tessor-synced components), the typecheck/build CI gate, and the latent MP4-export type bug
type: project
---

Added 2026-06-23. Before this, Maree had **no `tsconfig.json` and TypeScript wasn't installed** — Vite's esbuild transpiles without type-checking, so type errors shipped silently.

- **Type-check:** `npm run typecheck` (`tsc --noEmit`). `tsconfig.json` is strict, modeled on HueGrid-Site.
- **`noUnusedLocals`/`noUnusedParameters` are intentionally OFF.** Most unused-symbol violations live in the **Tessor-synced UI components** (`src/app/components/ui/*`, `ClipShapeGrid`, `DynamicControls`) — e.g. unused `import React`. Those files are owned upstream in Tessor and overwritten on every sync, so fixing them here is futile. Don't turn these flags back on unless Tessor stops emitting them. Unused-symbol linting belongs in Tessor / ESLint, not this gate.
- **CI:** `.github/workflows/ci.yml` runs `typecheck` + `build` on PRs to `main`. There is intentionally **no `deploy.yml`** — Cloudflare Workers Builds owns deployment (deploys `main`), so a GitHub Actions deploy would conflict/double-deploy.
- **Latent MP4 bug found by type-check:** `src/app/utils/export.ts` calls `H264MP4Encoder.create()`, but `h264-mp4-encoder`'s typed API is the named export `createH264MP4Encoder()`. The call is currently `as any`-cast to keep the gate green and preserve exact runtime; it's likely broken at runtime. Verify MP4 export in a browser before "fixing" — see BACKLOG.

**How to apply:** Run `npm run typecheck` before pushing; CI will block PRs that fail it. If a Tessor sync introduces a real type error (not unused-symbol), fix it in Tessor and re-sync rather than editing the synced file locally.
