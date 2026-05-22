import { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import Home from './Home';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ComingSoon from './ComingSoon';

export type OpenModal = (service?: string) => void;

/**
 * Coming-soon gate. While this is true, every route is replaced by the
 * coming-soon page and the rest of the site is unreachable.
 * To launch the full site, set this to false.
 */
const COMING_SOON: boolean = true;

/**
 * Preview access. Double-tap the logo on the coming-soon page and enter this
 * password to reveal the full site. Change it to anything you like.
 * Note: this is a convenience gate, not strong security — the password is
 * part of the page's code.
 */
const PREVIEW_PASSWORD = 'pajzo2026';
const UNLOCK_KEY = 'pajzo-access';

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<string>('');
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(UNLOCK_KEY) === 'granted'
  );

  const openModal = useCallback<OpenModal>((service) => {
    setModalService(service ?? '');
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  // Checks the preview password; on success, unlocks the full site for this
  // browser. Returns true when the password is correct.
  const checkPassword = useCallback((input: string) => {
    if (input !== PREVIEW_PASSWORD) return false;
    localStorage.setItem(UNLOCK_KEY, 'granted');
    setUnlocked(true);
    return true;
  }, []);

  // Routing for the two legal pages.
  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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

  if (COMING_SOON && !unlocked) {
    return (
      <>
        <ComingSoon checkPassword={checkPassword} />
        <Analytics />
        <SpeedInsights />
      </>
    );
  }

  let content;
  if (route === '/privacy-policy') {
    content = <PrivacyPolicy />;
  } else if (route === '/terms-of-service') {
    content = <TermsOfService />;
  } else {
    content = <Home openModal={openModal} />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header route={route} openModal={openModal} />
      {content}
      <Footer />
      <ContactModal open={modalOpen} onClose={closeModal} initialService={modalService} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
