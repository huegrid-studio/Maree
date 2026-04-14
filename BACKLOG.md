# Backlog — Maree

## Cleanup

| Task | Platform | Model | Status |
|---|---|---|---|
| **Audit h264-mp4-encoder dependency** — heavy package, verify it's actively used for MP4 export | Either | Sonnet | Open |
| **Review pnpm.overrides in package.json** — verify if still needed (not using pnpm) | Either | Sonnet | Open |
| **Review postcss.config.mjs** — may not be needed (Tailwind 4 uses `@tailwindcss/vite`, not PostCSS) | Either | Sonnet | Open |
| **Break up App.tsx** — ~1800 lines into smaller modules | Web | Opus | Open |

## Infrastructure

| Task | Platform | Model | Status |
|---|---|---|---|
| **Set up deployment target** — Vercel/Cloudflare Pages (static site, no backend) | Either | Sonnet | Open |
| **Configure production WORKBENCH_URL** — once Tessor has a production deployment | Either | Sonnet | Open |
| **Add CI/CD pipeline** — build + type-check | Either | Sonnet | Open |
| **Add .nvmrc** — for Node version pinning | Either | Sonnet | Open |

## Sync Improvements

| Task | Platform | Model | Status |
|---|---|---|---|
| **Add local file-copy sync mode** — read directly from `../Tessor/` sibling instead of HTTP | Either | Opus | Open |
| **Add --local flag to sync-from-workbench.mjs** — for direct filesystem sync | Either | Sonnet | Open |

## Features

| Task | Platform | Model | Status |
|---|---|---|---|
| **Explore additional export resolution presets** | Desktop | Sonnet | Open |
| **Consider undo/redo for config changes** | Either | Opus | Open |
