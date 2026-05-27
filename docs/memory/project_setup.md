---
name: Maree project setup
description: Maree is a browser-only SVG pattern generator; Vite :5002 locally, syncs UI from Tessor Express API at :3001, deployed on Vercel (huegrid team) at hg-maree.vercel.app
type: project
---

Maree was migrated from a Replit export on 2026-04-23 into ~/Documents/HueGrid/Maree/.

- **Dev server:** Vite on port 5002 (Tessor owns 5000/5001 — always pick a non-colliding port when running both)
- **Tessor sync (runtime + CLI):** `node scripts/sync-from-workbench.mjs http://localhost:3001` — fetches `/api/sync.json` directly from Tessor's Express server. Express alone is enough; Tessor's Vite doesn't need to be running. 26 files sync.
- **WORKBENCH_URL is env-aware** in `src/app/config/sync.ts`: defaults to `http://localhost:3001` in dev, empty in production unless `VITE_WORKBENCH_URL` is set. Empty URL disables the runtime `useTokenSync` hook gracefully.
- **GitHub:** huegrid-studio/Maree (public-ish org, same as Tessor)
- **Vercel:** team `huegrid` under the `huegrid-studio` Vercel account (logged in as `business@huegrid.com`). Production URL: https://hg-maree.vercel.app. Deploy with `vercel --prod --scope huegrid`.
- **No backend** — entirely browser-based, exports SVG/WEBP/WEBM/MP4/JSON

**Why:** Replit export needed cleanup (removed .agents/, attached_assets/, .replit, main.py, pyproject.toml, @replit/connectors-sdk). Package name was "tessor" — renamed to "maree". Initially deployed to personal Vercel `phlox-co`, then moved to HueGrid's Vercel account once the decision was made to launch publicly under HueGrid.

**How to apply:** When running Maree locally, start Tessor's Express API (not Vite) if you need the runtime token sync or to run the CLI sync script. To deploy, `cd ~/Documents/HueGrid/Maree && vercel --prod --scope huegrid`. Auto-deploy on push isn't wired yet — requires installing the Vercel GitHub App on the huegrid-studio org.
