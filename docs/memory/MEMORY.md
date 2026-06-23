# Project Memory — Maree

Portable, version-controlled, project-scoped memory. Read at session start; append durable project lessons here. Account-level/personal memory stays in ~/.claude and is never committed.

## Index

| Entry | Summary |
|---|---|
| [project_setup.md](project_setup.md) | Maree is a browser-only SVG pattern generator; Vite :5002 locally, syncs UI from Tessor Express API at :3001, deployed on Cloudflare Workers (huegrid) at maree.business-eb4.workers.dev |
| [build-and-typecheck.md](build-and-typecheck.md) | Strict tsconfig + `npm run typecheck`; `noUnusedLocals/Parameters` off because Tessor-synced components own that lint; CI runs typecheck+build (no deploy.yml — Workers Builds owns deploy); latent MP4 `H264MP4Encoder.create()` bug noted |
