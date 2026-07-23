import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
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
const ProcessPage = lazy(() => import('./ProcessPage'));

export type OpenModal = (service?: string) => void;

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

  // Per-route title + canonical, so the legal pages don't canonicalise to the
  // homepage (they're listed in the sitemap as their own URLs).
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Pajzo · Independent digital studio · Web, apps, branding, design',
      '/portfolio': 'Selected work · Pajzo',
      '/process': 'How we work · Pajzo',
      '/about': 'About · Pajzo',
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
  } else {
    content = <Home openModal={openModal} />;
  }

  // The portfolio page carries its own minimal chrome (a small wordmark that
  // links home), so the full site header/footer are left off there.
  const isPortfolio = path === '/portfolio';

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      {!isPortfolio && <Header route={route} openModal={openModal} />}
      {content}
      {!isPortfolio && <Footer />}
      <Suspense fallback={null}>
        <ContactModal
          open={modalOpen}
          openNonce={modalNonce}
          onClose={closeModal}
          initialService={modalService}
        />
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
