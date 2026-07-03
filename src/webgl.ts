// Cheap, cached WebGL capability probe — run BEFORE importing the ~190 KB
// three.js chunk, so unsupported machines never download it.
let cached: boolean | null = null;

export function webglAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    const c = document.createElement('canvas');
    cached = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}

// Calls back whenever the device pixel ratio changes (monitor switch, browser
// zoom), re-arming each time — a `resolution` media query only fires once when
// it stops matching. Returns a cleanup; a no-op where matchMedia is missing.
export function watchDpr(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  let mql: MediaQueryList | null = null;
  let disposed = false;
  const handler = () => {
    if (disposed) return;
    onChange();
    arm();
  };
  const arm = () => {
    mql?.removeEventListener('change', handler);
    mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mql.addEventListener('change', handler);
  };
  arm();
  return () => {
    disposed = true;
    mql?.removeEventListener('change', handler);
  };
}
