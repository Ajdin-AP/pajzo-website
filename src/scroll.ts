// Custom eased scroll — gentler and more consistent than the browser default.

// Sticky header height + a little breathing room (matches scroll-margin-top).
export const HEADER_OFFSET = 84;

let scrollRaf = 0;
let scrollCleanup: (() => void) | null = null;

export function smoothScrollTo(targetY: number) {
  cancelAnimationFrame(scrollRaf);
  if (scrollCleanup) {
    scrollCleanup();
    scrollCleanup = null;
  }

  const root = document.documentElement;
  const startY = window.scrollY;
  const maxY = root.scrollHeight - window.innerHeight;
  const dest = Math.max(0, Math.min(targetY, maxY));
  const diff = dest - startY;
  if (Math.abs(diff) < 2) return;

  // Respect reduced-motion: jump straight there.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, dest);
    root.style.scrollBehavior = prev;
    return;
  }

  // Override CSS scroll-behavior so each frame lands instantly.
  root.style.scrollBehavior = 'auto';

  // Ease-out, not ease-in-out: the page starts moving on the very first
  // frame (a click feels instant), then settles gently into the target.
  const duration = Math.min(800, Math.max(400, Math.abs(diff) * 0.3));
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);

  let interrupted = false;
  const onInterrupt = () => {
    interrupted = true;
  };
  window.addEventListener('wheel', onInterrupt, { passive: true });
  window.addEventListener('touchmove', onInterrupt, { passive: true });

  const finish = () => {
    window.removeEventListener('wheel', onInterrupt);
    window.removeEventListener('touchmove', onInterrupt);
    root.style.scrollBehavior = '';
    scrollCleanup = null;
  };
  scrollCleanup = finish;

  let startTime = 0;
  const step = (now: number) => {
    if (interrupted) {
      finish();
      return;
    }
    if (!startTime) startTime = now;
    const p = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + diff * ease(p));
    if (p < 1) {
      scrollRaf = requestAnimationFrame(step);
    } else {
      finish();
    }
  };
  scrollRaf = requestAnimationFrame(step);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
}
