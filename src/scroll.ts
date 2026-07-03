// Section scrolling is handed to the browser's native, compositor-driven
// smooth scroll. It stays smooth even while the page's scroll-linked effects
// (rail fill, ink-fill, reveals, header) run on the main thread. A hand-rolled
// requestAnimationFrame loop calling window.scrollTo does the opposite — it
// drives the scroll ON the main thread, so it stutters during a long jump.

// Sticky header height + a little breathing room (matches scroll-margin-top).
export const HEADER_OFFSET = 84;

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function smoothScrollTo(targetY: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const top = Math.max(0, Math.min(targetY, max));
  window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
}
