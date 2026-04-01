let audioCtx: AudioContext | null = null;
let ready = false;

function ensureContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTick(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1800, ctx.currentTime);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.008);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.008);
}

function warmUp(): void {
  if (ready) return;
  const ctx = ensureContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => { ready = true; }).catch(() => {});
  } else {
    ready = true;
  }
}

if (typeof window !== 'undefined') {
  const events = ['click', 'touchstart', 'keydown'] as const;
  const handler = () => {
    warmUp();
    if (ready) {
      events.forEach(e => window.removeEventListener(e, handler, true));
    }
  };
  events.forEach(e => window.addEventListener(e, handler, { capture: true, passive: true }));
}

export function hapticTick(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(5);
    } catch {}
  }

  const ctx = ensureContext();
  if (!ctx || ctx.state !== 'running') return;

  playTick(ctx);
}

function playTone(ctx: AudioContext, frequency: number, duration: number, volume: number): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function hapticClick(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(5);
    } catch {}
  }

  const ctx = ensureContext();
  if (!ctx || ctx.state !== 'running') return;

  playTone(ctx, 1200, 0.012, 0.06);
}

export function hapticToggle(on: boolean): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(5);
    } catch {}
  }

  const ctx = ensureContext();
  if (!ctx || ctx.state !== 'running') return;

  playTone(ctx, on ? 1400 : 1000, 0.015, 0.06);
}
