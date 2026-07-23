import React, { useState, useEffect } from 'react';
import { navigate } from '../nav';
import { smoothScrollTo } from '../scroll';
import { Menu, Close, Wordmark, ArrowRight } from './icons';
import type { OpenModal } from '../App';

// A single, standard nav shown on every page. Every item is its own page;
// there are no same-page section jumps here (the home page is a scroll).
const NAV: { label: string; route: string }[] = [
  { label: 'Work', route: '/portfolio' },
  { label: 'About', route: '/about' },
  { label: 'Process', route: '/process' },
];

const Header = ({ route, openModal }: { route: string; openModal: OpenModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = route === '/';
  // Normalise trailing slashes so /about and /about/ both light the nav item.
  const current = route.length > 1 ? route.replace(/\/+$/, '') : route;

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

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      requestAnimationFrame(() => smoothScrollTo(0));
    } else {
      navigate('/');
    }
  };

  const goTo = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`header${scrolled ? ' scrolled' : ''}${
        hidden && !menuOpen ? ' is-hidden' : ''
      }`}
    >
      <div className="container">
        <div className="header__inner">
          <a href="/" className="wordmark" onClick={goHome} aria-label="Pajzo, home">
            <Wordmark />
          </a>

          <div className="header__right">
            <nav className="header__nav">
              {NAV.map((item) => (
                <a
                  key={item.route}
                  href={item.route}
                  className={`navlink${current === item.route ? ' navlink--active' : ''}`}
                  onClick={(e) => goTo(e, item.route)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <button className="header__cta" onClick={() => openModal()}>
              Start a project
              <ArrowRight />
            </button>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {NAV.map((item) => (
          <a
            key={item.route}
            href={item.route}
            className={current === item.route ? 'is-active' : undefined}
            onClick={(e) => goTo(e, item.route)}
          >
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
    </header>
  );
};

export default Header;
