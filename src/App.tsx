import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Home';

// Off the critical path: the legal pages are rarely visited, and the contact
// modal is prefetched on idle so it's mounted long before the first click.
const ContactModal = lazy(() => import('./components/ContactModal'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const TermsOfService = lazy(() => import('./TermsOfService'));
const RefundPolicy = lazy(() => import('./RefundPolicy'));
const CookiePolicy = lazy(() => import('./CookiePolicy'));
const CodeOfConduct = lazy(() => import('./CodeOfConduct'));
const Portfolio = lazy(() => import('./Portfolio'));
const AboutPage = lazy(() => import('./AboutPage'));
const ServicePage = lazy(() => import('./ServicePage'));

const SERVICE_SLUGS = ['web-development', 'app-development', 'branding', 'design'];
const serviceOf = (path: string) => {
  const slug = path.startsWith('/services/') ? path.slice('/services/'.length) : '';
  return SERVICE_SLUGS.includes(slug) ? slug : '';
};
const ProcessPage = lazy(() => import('./ProcessPage'));

export type OpenModal = (service?: string) => void;

// The Pajzo shield, drawn small at the centre of the transition curtain.
const PT_MARK =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

// Curtain timing; the CSS transitions use the same values.
const PT_COVER_MS = 450;
const PT_REVEAL_MS = 550;
// The curtain holds until the destination is actually ready. Floor so a
// cached page still reads as a deliberate beat rather than a flicker;
// ceiling so a chunk that never arrives can't trap anyone behind it.
const PT_HOLD_MIN_MS = 240;
const PT_HOLD_MAX_MS = 5000;

// Each lazy route's import, so a transition can wait on the page it is
// actually going to instead of a fixed timer. Home is in the main bundle.
const ROUTE_CHUNK: Record<string, () => Promise<unknown>> = {
  '/portfolio': () => import('./Portfolio'),
  '/about': () => import('./AboutPage'),
  '/process': () => import('./ProcessPage'),
  '/privacy-policy': () => import('./PrivacyPolicy'),
  '/terms-of-service': () => import('./TermsOfService'),
  '/refund-policy': () => import('./RefundPolicy'),
  '/cookie-policy': () => import('./CookiePolicy'),
  '/code-of-conduct': () => import('./CodeOfConduct'),
};


const normalise = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

/** Two frames: the first schedules the commit's paint, the second lands after it. */
const nextPaint = () =>
  new Promise<void>((res) => {
    requestAnimationFrame(() => requestAnimationFrame(() => res()));
  });

/** Webfonts, plus any image the visitor is about to land on. Never blocks
    longer than `cap` — a slow asset should not hold the curtain shut. */
async function pageAssetsReady(cap: number) {
  const jobs: Promise<unknown>[] = [];
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts && fonts.status !== 'loaded') jobs.push(fonts.ready.catch(() => {}));
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    if (img.getBoundingClientRect().top > window.innerHeight * 1.25) return;
    jobs.push(img.decode().catch(() => {}));
  });
  if (!jobs.length) return;
  await Promise.race([
    Promise.all(jobs),
    new Promise((res) => window.setTimeout(res, cap)),
  ]);
}

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<string>('');
  // Bumped on every open so the modal knows to reset itself to a fresh form.
  const [modalNonce, setModalNonce] = useState(0);
  // Treat /portfolio and /portfolio/ as the same route (strip trailing slashes).
  const path = route.length > 1 ? route.replace(/\/+$/, '') : route;

  const openModal = useCallback<OpenModal>((service) => {
    setModalService(service ?? '');
    setModalNonce((n) => n + 1);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  // Warm the modal chunk shortly after load, so opening it is instant.
  useEffect(() => {
    const t = window.setTimeout(() => {
      void import('./components/ContactModal');
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);

  // Once the entrance animations have finished, drop them so iOS Safari doesn't
  // keep the hero text on a stale compositor layer (it renders dark on scroll-up).
  useEffect(() => {
    const t = window.setTimeout(
      () => document.documentElement.classList.add('anim-settled'),
      2600
    );
    return () => window.clearTimeout(t);
  }, []);

  // Routing for the two legal pages.
  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname);
      // Don't let the full-screen modal survive a back/forward navigation
      // (it would keep covering the page and body scroll locked).
      setModalOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Page transition: navigate() announces the target; a curtain sweeps up to
  // cover the page, the route (and scroll reset) swap underneath it, and the
  // curtain continues up to reveal the new page. Reduced motion swaps instantly.
  const [ptPhase, setPtPhase] = useState<'idle' | 'cover' | 'hold' | 'reveal'>('idle');
  const ptBusy = useRef(false);
  const ptMarkRef = useRef<SVGPathElement>(null);
  // Progress lives outside React: the mark is redrawn every frame, and
  // re-rendering the whole tree at 60fps to move a stroke would be absurd.
  const ptGoal = useRef(0);
  const ptNow = useRef(0);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));

    // The mark draws itself as the destination loads: dashoffset is the
    // progress bar. getTotalLength is measured once the node exists.
    let len = 0;
    const paintMark = () => {
      const el = ptMarkRef.current;
      if (!el) return;
      if (!len) len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len * (1 - ptNow.current));
    };
    const tick = () => {
      // Each stage sets a CEILING, not a value, and the draw creeps toward it
      // asymptotically: it keeps moving for as long as the wait lasts, so a
      // slow chunk reads as loading rather than as stuck, but it can never
      // reach the end until the page is genuinely there. Completion is a
      // deliberate snap.
      const ceil = ptGoal.current;
      const k = ceil >= 1 ? 0.36 : 0.014;
      ptNow.current += (ceil - ptNow.current) * k;
      if (ceil - ptNow.current < 0.002) ptNow.current = ceil;
      paintMark();
      raf = requestAnimationFrame(tick);
    };

    const swap = (target: string) => {
      window.history.pushState({}, '', target);
      setRoute(target);
      setModalOpen(false);
      window.scrollTo(0, 0);
    };

    const run = async (target: string) => {
      const p = normalise(target);
      const chunk = serviceOf(p) ? () => import('./ServicePage') : ROUTE_CHUNK[p];
      const started = performance.now();
      const deadline = new Promise<void>((res) =>
        timers.push(window.setTimeout(res, PT_HOLD_MAX_MS))
      );

      ptNow.current = 0;
      ptGoal.current = 0.55; // ceiling while the chunk is in flight
      setPtPhase('cover');
      raf = requestAnimationFrame(tick);

      // Fetch the destination while the curtain is still closing, so the
      // two costs overlap instead of stacking.
      let failed = false;
      const loading = chunk
        ? chunk().then(
            () => {},
            () => {
              failed = true;
            }
          )
        : Promise.resolve();
      await Promise.race([Promise.all([loading, wait(PT_COVER_MS)]), deadline]);
      if (cancelled) return;
      // A chunk that will not load would render nothing behind a lifted
      // curtain, so hand the route to the browser and let it fetch the page
      // properly rather than reveal a blank screen.
      if (failed) {
        window.location.href = target;
        return;
      }
      ptGoal.current = 0.85; // chunk in, waiting on the commit to paint

      setPtPhase('hold');
      swap(target);
      await Promise.race([nextPaint(), deadline]);
      if (cancelled) return;
      ptGoal.current = 0.95; // painted, waiting on fonts and images

      await Promise.race([pageAssetsReady(2200), deadline]);
      if (cancelled) return;

      // hold the floor, so an instant route still gets its beat
      const left = PT_HOLD_MIN_MS - (performance.now() - started - PT_COVER_MS);
      if (left > 0) await wait(left);
      if (cancelled) return;

      ptGoal.current = 1;
      await wait(240); // let the mark snap closed before it leaves
      if (cancelled) return;

      setPtPhase('reveal');
      await wait(PT_REVEAL_MS);
      if (cancelled) return;
      cancelAnimationFrame(raf);
      setPtPhase('idle');
      ptBusy.current = false;
    };

    const onNavigate = (e: Event) => {
      const target = (e as CustomEvent<string>).detail;
      if (!target || target === window.location.pathname) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        swap(target);
        return;
      }
      if (ptBusy.current) return; // one transition at a time
      ptBusy.current = true;
      void run(target);
    };
    window.addEventListener('pajzo:navigate', onNavigate);
    return () => {
      cancelled = true;
      window.removeEventListener('pajzo:navigate', onNavigate);
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(raf);
      ptBusy.current = false;
    };
  }, []);

  // Per-route title + canonical, so the legal pages don't canonicalise to the
  // homepage (they're listed in the sitemap as their own URLs).
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Pajzo · Independent digital studio · Web, apps, branding, design',
      '/portfolio': 'Selected work · Pajzo',
      '/process': 'How we work · Pajzo',
      '/about': 'About · Pajzo',
      '/services/web-development': 'Web development · Pajzo',
      '/services/app-development': 'App development · Pajzo',
      '/services/branding': 'Branding · Pajzo',
      '/services/design': 'Design · Pajzo',
      '/privacy-policy': 'Privacy Policy · Pajzo',
      '/cookie-policy': 'Cookie Policy · Pajzo',
      '/terms-of-service': 'Terms of Service · Pajzo',
      '/refund-policy': 'Refund Policy · Pajzo',
      '/code-of-conduct': 'Code of Conduct · Pajzo',
    };
    const known = path in titles;
    document.title = titles[path] ?? 'Page not found · Pajzo';

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      // The SPA rewrite serves unknown paths as soft-404s; point their
      // canonical at the homepage so they can't self-canonicalise as junk URLs.
      canonical.href = known
        ? `https://pajzo.com${path === '/' ? '/' : path}`
        : 'https://pajzo.com/';
    }

    // Keep unknown/soft-404 routes out of search indexes.
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!known) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex';
    } else if (robots) {
      robots.remove();
    }
  }, [path]);

  // Quiet reveal-on-scroll.
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready');
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [route]);

  // Ghost buttons: the orange bloom starts from the pointer's entry point and
  // recedes toward its exit point. Coordinates only — the rest is CSS.
  useEffect(() => {
    const setOrigin = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const btn = t?.closest?.('.btn--ghost') as HTMLElement | null;
      if (!btn) return;
      const related = e.relatedTarget as Node | null;
      // Skip moves between the button's own children — keep the true origin.
      if (related && btn.contains(related)) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', `${e.clientX - r.left}px`);
      btn.style.setProperty('--by', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointerover', setOrigin);
    document.addEventListener('pointerout', setOrigin);
    return () => {
      document.removeEventListener('pointerover', setOrigin);
      document.removeEventListener('pointerout', setOrigin);
    };
  }, []);


  let content;
  if (path === '/privacy-policy') {
    content = (
      <Suspense fallback={null}>
        <PrivacyPolicy />
      </Suspense>
    );
  } else if (path === '/terms-of-service') {
    content = (
      <Suspense fallback={null}>
        <TermsOfService />
      </Suspense>
    );
  } else if (path === '/refund-policy') {
    content = (
      <Suspense fallback={null}>
        <RefundPolicy />
      </Suspense>
    );
  } else if (path === '/cookie-policy') {
    content = (
      <Suspense fallback={null}>
        <CookiePolicy />
      </Suspense>
    );
  } else if (path === '/code-of-conduct') {
    content = (
      <Suspense fallback={null}>
        <CodeOfConduct />
      </Suspense>
    );
  } else if (path === '/portfolio') {
    content = (
      <Suspense fallback={null}>
        <Portfolio />
      </Suspense>
    );
  } else if (path === '/process') {
    content = (
      <Suspense fallback={null}>
        <ProcessPage openModal={openModal} />
      </Suspense>
    );
  } else if (path === '/about') {
    content = (
      <Suspense fallback={null}>
        <AboutPage openModal={openModal} />
      </Suspense>
    );
  } else if (serviceOf(path)) {
    content = (
      <Suspense fallback={null}>
        <ServicePage slug={serviceOf(path)} openModal={openModal} />
      </Suspense>
    );
  } else {
    content = <Home openModal={openModal} />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <Header route={route} openModal={openModal} />
      {content}
      <Footer />
      <Suspense fallback={null}>
        <ContactModal
          open={modalOpen}
          openNonce={modalNonce}
          onClose={closeModal}
          initialService={modalService}
        />
      </Suspense>
      <div className={`pt pt--${ptPhase}`} aria-hidden="true">
        <svg viewBox="-10 -10 460 540">
          {/* the unlit mark, so the drawn stroke has something to travel over */}
          <path className="pt__ghost" d={PT_MARK} />
          <path className="pt__draw" ref={ptMarkRef} d={PT_MARK} />
        </svg>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
