import React, { useState, useEffect } from 'react';
import { navigate } from '../nav';
import { smoothScrollTo, scrollToId } from '../scroll';
import { Menu, Close, Wordmark, ArrowRight } from './icons';
import type { OpenModal } from '../App';

const NAV: { label: string; id: string; route?: string }[] = [
  { label: 'Work', id: 'work', route: '/portfolio' },
  { label: 'Services', id: 'services' },
  { label: 'Studio', id: 'studio' },
  { label: 'Process', id: 'process' },
  { label: 'FAQ', id: 'faq' },
];

const Header = ({ route, openModal }: { route: string; openModal: OpenModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const isHome = route === '/';

  // Scrolled state + hide on scroll-down, return on scroll-up. rAF-throttled
  // with an 8px hysteresis band so momentum scrolling doesn't flicker the bar.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return; // ignore jitter for a steadier slide
      if (delta > 0 && y > 300) setHidden(true); // deliberate scroll down
      else if (delta < 0) setHidden(false); // any upward move reveals it
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    if (!isHome) return;
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;
    // Track which sections are in the middle band and highlight the topmost
    // one (document order). Clears to '' when scrolled back above them all.
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        setActive(NAV.find((n) => visible.has(n.id))?.id ?? '');
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      requestAnimationFrame(() => smoothScrollTo(0));
    } else {
      navigate('/');
    }
  };

  const goTo = (e: React.MouseEvent, item: { id: string; route?: string }) => {
    e.preventDefault();
    setMenuOpen(false);
    // A nav item is either its own route (e.g. Work) or a section on the home page.
    if (item.route) {
      navigate(item.route);
      return;
    }
    // Defer a frame so the mobile menu has closed before we measure.
    requestAnimationFrame(() => scrollToId(item.id));
  };

  return (
    <header
      className={`header${isHome ? ' header--home' : ''}${scrolled ? ' scrolled' : ''}${
        hidden && !menuOpen ? ' is-hidden' : ''
      }`}
    >
      <div className="container">
        <div className="header__inner">
          <a href="/" className="wordmark" onClick={goHome} aria-label="Pajzo, home">
            <Wordmark />
          </a>

          <div className="header__right">
            {isHome && (
              <nav className="header__nav">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={item.route ?? `#${item.id}`}
                    className={`navlink${active === item.id ? ' navlink--active' : ''}`}
                    onClick={(e) => goTo(e, item)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}

            <button className="header__cta" onClick={() => openModal()}>
              Start a project
              <ArrowRight />
            </button>

            {isHome && (
              <button
                className="menu-toggle"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <Close /> : <Menu />}
              </button>
            )}
          </div>
        </div>
      </div>

      {isHome && (
        <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
          {NAV.map((item) => (
            <a key={item.id} href={item.route ?? `#${item.id}`} onClick={(e) => goTo(e, item)}>
              {item.label}
            </a>
          ))}
          <button
            className="btn btn--solid"
            onClick={() => {
              setMenuOpen(false);
              openModal();
            }}
          >
            Start a project
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
