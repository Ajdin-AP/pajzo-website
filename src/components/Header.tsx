import React, { useState, useEffect, useRef, useCallback } from 'react';
import { navigate } from '../nav';
import { smoothScrollTo } from '../scroll';
import { Menu, Close, Wordmark, ArrowRight } from './icons';
import type { OpenModal } from '../App';

// A single, standard nav shown on every page. Every item is its own page;
// there are no same-page section jumps here (the home page is a scroll).
const NAV: { label: string; route: string }[] = [
  { label: 'Home', route: '/' },
  { label: 'Work', route: '/work' },
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

  /* ---- the composing rail ----
     One registration frame for the whole nav, not a border per item. It marks
     the page you are on and travels to whichever item you point at or tab to,
     stretching to that word's width, the way a compositor slides a slug along
     a stick. It is the same dashed frame the CTA presses into, so the nav and
     the button are one idea rather than two.

     Following focus as well as hover is the part that earns its keep: a
     keyboard user gets the same read of where they are as a mouse user. */
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [aim, setAim] = useState<number | null>(null);
  const [slug, setSlug] = useState({ x: 0, w: 0, on: false });

  const activeIndex = NAV.findIndex((i) => i.route === current);
  const target = aim ?? activeIndex;

  const measure = useCallback(() => {
    const nav = navRef.current;
    const el = target >= 0 ? itemRefs.current[target] : null;
    if (!nav || !el) {
      setSlug((s) => ({ ...s, on: false }));
      return;
    }
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setSlug({ x: Math.round(r.left - n.left), w: Math.round(r.width), on: true });
  }, [target]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    // the words are set in a webfont; measuring before it lands puts the frame
    // in the wrong place and it never corrects itself
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

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
    // navigate() drops a target equal to the current path, which would leave
    // the tab you are already on doing nothing. Send it to the top instead.
    if (path === current) {
      requestAnimationFrame(() => smoothScrollTo(0));
      return;
    }
    navigate(path);
  };

  return (
    <>
      <header
        className={`header${scrolled ? ' scrolled' : ''}${
          hidden && !menuOpen ? ' is-hidden' : ''
        }`}
      >
        <div className="container">
          <div className="header__inner">
            {/* The wordmark prints itself in on arrival, left to right, mark
                first. It never changes width: the previous fold collapsed it to
                23px on scroll, which emptied the left of the bar and threw all
                the weight to the right. */}
            <a
              href="/"
              className="wordmark"
              onClick={goHome}
              aria-label="Pajzo, home"
            >
              <Wordmark />
            </a>

            <div className="header__right">
              <nav
                className="header__nav"
                ref={navRef}
                onMouseLeave={() => setAim(null)}
              >
                <span
                  className="navslug"
                  aria-hidden="true"
                  data-on={slug.on}
                  style={
                    { '--sx': `${slug.x}px`, '--sw': `${slug.w}px` } as React.CSSProperties
                  }
                />
                {NAV.map((item, i) => (
                  <a
                    key={item.route}
                    href={item.route}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className={`navlink${current === item.route ? ' navlink--active' : ''}`}
                    onClick={(e) => goTo(e, item.route)}
                    onMouseEnter={() => setAim(i)}
                    onFocus={() => setAim(i)}
                    onBlur={() => setAim(null)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <button
                className="btn btn--solid btn--nav header__cta"
                onClick={() => openModal()}
              >
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
      </header>

      {/* Sibling of the bar, not a child: the bar carries a transform for its
          hide-on-scroll and a backdrop-filter for its material, and either one
          on an ancestor stops a descendant's own backdrop-filter from sampling
          the page. Out here the panel gets real glass too. */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {/* A type case rather than a dropdown: the routes set large in the
            display face, numbered like sorts in their compartments, each
            sliding in a beat after the one above it. */}
        {NAV.map((item, i) => (
          <a
            key={item.route}
            href={item.route}
            className={current === item.route ? 'is-active' : undefined}
            style={{ '--i': i } as React.CSSProperties}
            onClick={(e) => goTo(e, item.route)}
          >
            <span className="mn-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="mn-word">{item.label}</span>
            <span className="mn-rule" aria-hidden="true" />
          </a>
        ))}
        <button
          className="btn btn--solid"
          style={{ '--i': NAV.length } as React.CSSProperties}
          onClick={() => {
            setMenuOpen(false);
            openModal();
          }}
        >
          Start a project
        </button>
      </div>
    </>
  );
};

export default Header;
