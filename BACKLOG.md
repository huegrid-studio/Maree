# Backlog

## Cleanup

- [ ] Audit `h264-mp4-encoder` dependency — heavy package, verify it's actively used for MP4 export
- [ ] Review whether `pnpm.overrides` section in package.json is still needed (not using pnpm)
- [ ] Review whether `postcss.config.mjs` is needed (Tailwind 4 uses `@tailwindcss/vite`, not PostCSS)
- [ ] Break up `App.tsx` (~1800 lines) into smaller modules

## Infrastructure

- [ ] Set up deployment target (Vercel/Cloudflare Pages — static site, no backend)
- [ ] Configure production `WORKBENCH_URL` once Tessor has a production deployment
- [ ] Add CI/CD pipeline (build + type-check)
- [ ] Add `.nvmrc` for Node version pinning

## Sync improvements

- [ ] Add local file-copy sync mode — read directly from `../Tessor/` sibling instead of HTTP
- [ ] Add `--local` flag to `sync-from-workbench.mjs` for direct filesystem sync

## Features

- [ ] Explore additional export resolution presets
- [ ] Consider undo/redo for config changes
