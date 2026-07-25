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
const PT_COVER_MS = 320;
const PT_REVEAL_MS = 440;

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
  const [ptPhase, setPtPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const ptBusy = useRef(false);
  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    const swap = (target: string) => {
      window.history.pushState({}, '', target);
      setRoute(target);
      setModalOpen(false);
      window.scrollTo(0, 0);
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
      setPtPhase('cover');
      t1 = window.setTimeout(() => {
        swap(target);
        setPtPhase('reveal');
        t2 = window.setTimeout(() => {
          setPtPhase('idle');
          ptBusy.current = false;
        }, PT_REVEAL_MS);
      }, PT_COVER_MS);
    };
    window.addEventListener('pajzo:navigate', onNavigate);
    return () => {
      window.removeEventListener('pajzo:navigate', onNavigate);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
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
          <path d={PT_MARK} />
        </svg>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
