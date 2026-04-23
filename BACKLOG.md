# Backlog — Maree

## Cleanup

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Audit h264-mp4-encoder dependency** — heavy package, verify it's actively used for MP4 export | Claude Code | Either | Sonnet | Open |
| **Review pnpm.overrides in package.json** — verify if still needed (not using pnpm) | Claude Code | Either | Sonnet | Open |
| **Review postcss.config.mjs** — may not be needed (Tailwind 4 uses `@tailwindcss/vite`, not PostCSS) | Claude Code | Either | Sonnet | Open |
| **Break up App.tsx** — ~1800 lines into smaller modules | Claude Code | Web | Opus | Open |

## Infrastructure

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Set up deployment target** — Vercel/Cloudflare Pages (static site, no backend) | Claude Code | Either | Sonnet | Done |
| **Configure production WORKBENCH_URL** — once Tessor has a production deployment | Claude Code | Either | Sonnet | Open |
| **Add CI/CD pipeline** — build + type-check | Claude Code | Either | Sonnet | Open |
| **Add .nvmrc** — for Node version pinning | Claude Code | Either | Sonnet | Open |
| **Connect Vercel ↔ GitHub for auto-deploys** — install Vercel GitHub App on huegrid-studio org, then link repo via Vercel dashboard | Web | Either | Sonnet | Open |
| **Add custom domain** — since Maree is going public, configure a real domain in Vercel (e.g. maree.huegrid.com) | Web | Either | Sonnet | Open |

## Sync Improvements

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Add local file-copy sync mode** — read directly from `../Tessor/` sibling instead of HTTP | Claude Code | Either | Opus | Open |
| **Add --local flag to sync-from-workbench.mjs** — for direct filesystem sync | Claude Code | Either | Sonnet | Open |

## Features

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Explore additional export resolution presets** | Claude Code | Desktop | Sonnet | Open |
| **Consider undo/redo for config changes** | Claude Code | Either | Opus | Open |
