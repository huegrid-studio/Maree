import { useState, useEffect, useCallback, useRef } from 'react';
import { WORKBENCH_URL } from '../config/sync';
import {
  fetchRemoteTokens,
  diffTokens,
  applyTokens,
  generateTokensCSS,
  parseLocalTokens,
  type RemoteTokenData,
  type TokenDiff,
} from '../utils/token-sync';

interface TokenSyncState {
  hasUpdate: boolean;
  diff: TokenDiff | null;
  applyUpdate: () => void;
  copyCSS: () => Promise<boolean>;
  dismissUpdate: () => void;
  applied: boolean;
}

export function useTokenSync(): TokenSyncState {
  const [diff, setDiff] = useState<TokenDiff | null>(null);
  const [applied, setApplied] = useState(false);
  const remoteRef = useRef<RemoteTokenData | null>(null);

  useEffect(() => {
    if (!WORKBENCH_URL) return;

    const url = WORKBENCH_URL.endsWith('/api/tokens.json')
      ? WORKBENCH_URL
      : `${WORKBENCH_URL.replace(/\/$/, '')}/api/tokens.json`;

    let cancelled = false;

    (async () => {
      const remote = await fetchRemoteTokens(url);
      if (cancelled || !remote) return;
      remoteRef.current = remote;

      const local = parseLocalTokens();
      if (cancelled) return;

      const d = diffTokens(remote, local);
      if (d) setDiff(d);
    })();

    return () => { cancelled = true; };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!remoteRef.current) return;
    applyTokens(remoteRef.current);
    setDiff(null);
    setApplied(true);
  }, []);

  const copyCSS = useCallback(async (): Promise<boolean> => {
    if (!remoteRef.current) return false;
    const css = generateTokensCSS(remoteRef.current);
    try {
      await navigator.clipboard.writeText(css);
      return true;
    } catch {
      return false;
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setDiff(null);
  }, []);

  return {
    hasUpdate: diff !== null && !applied,
    diff,
    applyUpdate,
    copyCSS,
    dismissUpdate,
    applied,
  };
}
