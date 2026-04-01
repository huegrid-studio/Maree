export const math = {
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  clamp: (val: number, min: number, max: number) => Math.min(Math.max(val, min), max),
  degToRad: (deg: number) => deg * (Math.PI / 180),
};

export const createRandom = (seed: number) => {
  let state = seed;
  return {
    value: () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    },
    pick: <T,>(arr: T[]): T => {
      const idx = Math.floor((state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296 * arr.length);
      return arr[idx];
    },
  };
};

export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};
