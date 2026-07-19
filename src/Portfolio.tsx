import React, { useEffect } from 'react';
import { navigate } from './nav';
import { Wordmark, ArrowRight } from './components/icons';

type Project = {
  key: string;
  name: string;
  category: string;
  year: string;
  blurb: string;
  tags: string[];
  href: string;
  thumb: string;
};

// The live sites live as static files under /portfolio/<key>/ (served straight,
// ahead of the SPA rewrite), so the cards open the real, working builds.
const PROJECTS: Project[] = [
  {
    key: 'nocturne',
    name: 'Nocturne',
    category: 'Automotive',
    year: '2026',
    blurb:
      'A car showroom reimagined as a midnight gallery. Every car is built and lit live in the browser as real 3D, so you can turn it in the light and walk the rooms, with no heavy model files to wait on.',
    tags: ['Web design', 'Three.js', 'WebGL', 'Art direction'],
    href: '/portfolio/nocturne/index.html',
    thumb: '/portfolio/thumbs/nocturne.jpg',
  },
  {
    key: 'sovra',
    name: 'SOVRA',
    category: 'Retail',
    year: '2026',
    blurb:
      'A basketball atelier that treats the ball like couture. A hand-finished sphere is rendered live in 3D, with an exploded view of how it is made and a storefront built to match the craft.',
    tags: ['Web design', 'Three.js', 'WebGL', 'Storefront'],
    href: '/portfolio/sovra/index.html',
    thumb: '/portfolio/thumbs/sovra.jpg',
  },
  {
    key: 'greensward',
    name: 'Greensward & Co.',
    category: 'Services',
    year: '2026',
    blurb:
      'Private grounds care for a boutique lawn company. Quiet, editorial and unhurried, the kind of restraint that lets the work speak for itself.',
    tags: ['Web design', 'Editorial', 'Branding'],
    href: '/portfolio/greensward/index.html',
    thumb: '/portfolio/thumbs/greensward.jpg',
  },
];

const Portfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <main id="main" tabIndex={-1} className="pf">
      <header className="pf__bar">
        <a href="/" className="pf__logo" onClick={goHome} aria-label="Pajzo, back to home">
          <Wordmark />
        </a>
        <a href="/" className="pf__back" onClick={goHome}>
          Back to site
          <ArrowRight />
        </a>
      </header>

      <div className="container pf__wrap">
        <div className="pf__intro">
          <p className="pf__eyebrow">
            <span className="pf__dot" aria-hidden="true" />
            Selected work
          </p>
          <h1 className="pf__title">
            A few things
            <br />
            we&rsquo;ve built.
          </h1>
          <p className="pf__lead">
            Design and build, done in-house, from the first idea to the final
            detail. A small set of pieces that show how we think.
          </p>
        </div>

        <ol className="pf__list">
          {PROJECTS.map((p, i) => (
            <li className="pf__item" key={p.key}>
              <a
                className="pf__shot"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the live ${p.name} site in a new tab`}
              >
                <img
                  src={p.thumb}
                  alt={`The ${p.name} website`}
                  loading="lazy"
                  width={1600}
                  height={1000}
                />
                <span className="pf__open">
                  View live
                  <ArrowRight />
                </span>
              </a>

              <div className="pf__meta">
                <div className="pf__lead-col">
                  <p className="pf__index">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="pf__name">{p.name}</h2>
                  <p className="pf__cat">
                    {p.category} &middot; {p.year}
                  </p>
                </div>
                <div className="pf__detail">
                  <p className="pf__blurb">{p.blurb}</p>
                  <ul className="pf__tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <a
                    className="pf__view"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View live site
                    <ArrowRight />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <footer className="pf__foot">
        <a
          href="/"
          className="pf__foot-logo"
          onClick={goHome}
          aria-label="Pajzo, back to home"
        >
          <Wordmark />
        </a>
        <p className="pf__foot-note">
          &copy; {new Date().getFullYear()} Pajzo &middot; s.p. &middot; Domžale,
          Slovenia
        </p>
      </footer>
    </main>
  );
};

export default Portfolio;
