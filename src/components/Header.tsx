import React, { useState, useEffect } from 'react';
import { navigate } from '../nav';
import { smoothScrollTo, scrollToId } from '../scroll';
import { Menu, Close, Wordmark, ArrowRight } from './icons';
import type { OpenModal } from '../App';

const NAV = [
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

  // Scrolled state + hide on scroll-down, return on scroll-up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // 6px threshold avoids trackpad flutter; never hide near the top.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 420);
        lastY = y;
      }
    };
    onScroll();
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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
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

  const goTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Defer a frame so the mobile menu has closed before we measure.
    requestAnimationFrame(() => scrollToId(id));
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
                    href={`#${item.id}`}
                    className={`navlink${active === item.id ? ' navlink--active' : ''}`}
                    onClick={(e) => goTo(e, item.id)}
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
            Start a project
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
