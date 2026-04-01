export interface RemoteTokenData {
  version: string;
  generated: string;
  dark: Record<string, string>;
  light: Record<string, string>;
  shared: Record<string, string>;
}

export interface TokenDiff {
  dark: Record<string, { local: string; remote: string }>;
  light: Record<string, { local: string; remote: string }>;
  count: number;
}

export async function fetchRemoteTokens(url: string): Promise<RemoteTokenData | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data !== 'object' || !data.dark || !data.light) return null;
    return {
      version: data.version || '1.0',
      generated: data.generated || '',
      dark: data.dark || {},
      light: data.light || {},
      shared: data.shared || {},
    };
  } catch {
    return null;
  }
}

export function parseLocalTokens(): { dark: Record<string, string>; light: Record<string, string> } {
  const dark: Record<string, string> = {};
  const light: Record<string, string> = {};

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (!(rule instanceof CSSStyleRule)) continue;
        const sel = rule.selectorText.replace(/\s+/g, '');

        const isDark = sel === ':root,:root.dark' || sel === ':root' || sel === ':root.dark';
        const isLight = sel === ':root.light';

        if (!isDark && !isLight) continue;

        for (let i = 0; i < rule.style.length; i++) {
          const name = rule.style[i];
          if (!name.startsWith('--t-')) continue;
          const val = rule.style.getPropertyValue(name).trim();

          if (isLight) {
            light[name] = val;
          } else {
            dark[name] = val;
          }
        }
      }
    } catch {
      continue;
    }
  }

  return { dark, light };
}

export function diffTokens(
  remote: RemoteTokenData,
  local: { dark: Record<string, string>; light: Record<string, string> }
): TokenDiff | null {
  const diff: TokenDiff = { dark: {}, light: {}, count: 0 };

  const remoteDark = { ...remote.shared, ...remote.dark };
  const remoteLight = { ...remote.shared, ...remote.light };

  const localEffectiveLight: Record<string, string> = { ...local.dark, ...local.light };

  for (const [key, val] of Object.entries(remoteDark)) {
    const localVal = local.dark[key];
    if (localVal === undefined) {
      diff.dark[key] = { local: '', remote: val };
      diff.count++;
    } else if (norm(localVal) !== norm(val)) {
      diff.dark[key] = { local: localVal, remote: val };
      diff.count++;
    }
  }

  for (const [key, val] of Object.entries(remoteLight)) {
    const localVal = localEffectiveLight[key];
    if (localVal === undefined) {
      diff.light[key] = { local: '', remote: val };
      diff.count++;
    } else if (norm(localVal) !== norm(val)) {
      diff.light[key] = { local: localVal, remote: val };
      diff.count++;
    }
  }

  return diff.count > 0 ? diff : null;
}

function norm(val: string): string {
  return val.replace(/\s+/g, ' ').trim().toLowerCase();
}

const SYNC_STYLE_ID = 'tessor-token-sync-overrides';

export function applyTokens(remote: RemoteTokenData): void {
  let styleEl = document.getElementById(SYNC_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = SYNC_STYLE_ID;
    document.head.appendChild(styleEl);
  }

  const darkTokens = { ...remote.shared, ...remote.dark };
  const lightTokens = { ...remote.shared, ...remote.light };

  const darkLines = Object.entries(darkTokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const lightLines = Object.entries(lightTokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');

  styleEl.textContent = `:root,\n:root.dark {\n${darkLines}\n}\n\n:root.light {\n${lightLines}\n}\n`;
}

export function generateTokensCSS(remote: RemoteTokenData): string {
  const lines: string[] = [];

  const darkTokens = { ...remote.shared, ...remote.dark };

  lines.push(':root,');
  lines.push(':root.dark {');
  for (const [key, val] of Object.entries(darkTokens)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push('}');
  lines.push('');
  lines.push(':root.light {');
  for (const [key, val] of Object.entries(remote.light)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push('}');

  return lines.join('\n') + '\n';
}
