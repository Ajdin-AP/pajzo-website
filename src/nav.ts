// Lightweight client-side navigation. navigate() announces the intent and
// App runs the page transition (curtain over → swap route → reveal), so the
// swap and the scroll-to-top happen while the page is covered. Browser
// back/forward stays instant via the real popstate listener.
export function navigate(path: string) {
  if (window.location.pathname === path) return;
  window.dispatchEvent(new CustomEvent<string>('pajzo:navigate', { detail: path }));
}
