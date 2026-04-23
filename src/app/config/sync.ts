// WORKBENCH_URL for runtime token sync (via useTokenSync hook).
// - Local dev: defaults to Tessor's Express API at http://localhost:3001
// - Production: set VITE_WORKBENCH_URL to a deployed Tessor URL, or leave unset to disable runtime sync
// The CLI sync script (scripts/sync-from-workbench.mjs) takes its URL as an argument and ignores this.
export const WORKBENCH_URL =
  import.meta.env.VITE_WORKBENCH_URL ??
  (import.meta.env.DEV ? 'http://localhost:3001' : '');
