import { useEffect, type RefObject } from 'react';

// Adds .is-off while the element sits fully outside the viewport, so its
// infinite CSS animations pause (preserving phase) instead of ticking forever.
export function useOffscreenPause(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-off', !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
