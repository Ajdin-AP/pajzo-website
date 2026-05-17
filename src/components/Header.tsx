import React, { useState, useEffect } from 'react';
import { navigate } from '../nav';
import { Menu, Close } from './icons';
import type { OpenModal } from '../App';

const NAV = [
  { label: 'How we work', id: 'approach' },
  { label: 'Pricing', id: 'services' },
  { label: 'Process', id: 'process' },
  { label: 'About', id: 'about' },
];

// Sticky header height + a little breathing room (matches scroll-margin-top).
const HEADER_OFFSET = 84;

let scrollRaf = 0;
let scrollCleanup: (() => void) | null = null;

// Custom eased scroll — gentler and more consistent than the browser default.
function smoothScrollTo(targetY: number) {
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

  const duration = Math.min(1100, Math.max(600, Math.abs(diff) * 0.5));
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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

const Header = ({ route, openModal }: { route: string; openModal: OpenModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = route === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
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

  const goTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Defer a frame so the mobile menu has closed before we measure.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
    });
  };

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <a href="/" className="wordmark" onClick={goHome} aria-label="Pajzo — home">
            Pajzo<span className="dot">.</span>
          </a>

          {isHome && (
            <nav className="header__nav">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="navlink"
                  onClick={(e) => goTo(e, item.id)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="header__actions">
            <button
              className={`btn btn--solid${isHome ? '' : ' btn--always'}`}
              onClick={() => openModal()}
            >
              Contact
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
            <a key={item.id} href={`#${item.id}`} onClick={(e) => goTo(e, item.id)}>
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
            Contact
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
