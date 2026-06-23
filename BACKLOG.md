# Backlog — Maree

## Cleanup

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Audit h264-mp4-encoder dependency** — heavy package, verify it's actively used for MP4 export | Claude Code | Either | Sonnet | Open |
| **Review pnpm.overrides in package.json** — verify if still needed (not using pnpm) | Claude Code | Either | Sonnet | Open |
| **Review postcss.config.mjs** — may not be needed (Tailwind 4 uses `@tailwindcss/vite`, not PostCSS) | Claude Code | Either | Sonnet | Done — removed (empty config, unused by Vite) |
| **Break up App.tsx** — ~1800 lines into smaller modules | Claude Code | Web | Opus | Open |

## Infrastructure

| Task | Tool | Platform | Model | Status |
|---|---|---|---|---|
| **Set up deployment target** — Cloudflare Workers (static assets, no backend); `wrangler.jsonc` | Claude Code | Either | Sonnet | Done |
| **Configure production WORKBENCH_URL** — once Tessor has a production deployment | Claude Code | Either | Sonnet | Open |
| **Add CI/CD pipeline** — build + type-check | Claude Code | Either | Sonnet | Partial — build-only CI added (`.github/workflows/ci.yml`); type-check blocked on missing `tsconfig.json` |
| **Add tsconfig.json** — needed to enable `tsc --noEmit` type-check in CI (Maree currently has no tsconfig; Vite/esbuild doesn't type-check) | Claude Code | Either | Sonnet | Open |
| **Add .nvmrc** — for Node version pinning (Node 22.16.0; added in CF Workers migration) | Claude Code | Either | Sonnet | Done |
| **Reconnect Cloudflare Workers ↔ GitHub for auto-deploys** — the Worker's Build settings show "disconnected from your Git account"; re-link in CF → Worker → Settings → Build so pushes to `main` auto-deploy (first deploy was manual) | Web | Either | Sonnet | Open |
| **Add custom domain** — when Maree matures / goes public, add a domain in Cloudflare (e.g. maree.huegrid.com) via Worker → Domains & Routes | Web | Either | Sonnet | Open |

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
