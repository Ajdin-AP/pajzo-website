import React, { useEffect } from 'react';
import { navigate } from './nav';
import { ArrowRight } from './components/icons';
import type { OpenModal } from './App';

// ------------------------------------------------------------------
// /about — who is behind the work. A short signed letter from the
// founder, the table the studio works at, and a way in.
// ------------------------------------------------------------------

const DISCIPLINES = [
  {
    num: '01',
    name: 'Web development',
    note: 'Sites designed and built by the same hands, fast and accessible.',
  },
  {
    num: '02',
    name: 'App development',
    note: 'Native and web apps taken from idea to shipped product.',
  },
  {
    num: '03',
    name: 'Branding',
    note: 'Names, marks and voices that survive contact with the real world.',
  },
  {
    num: '04',
    name: 'Design',
    note: 'Interfaces and identities drawn with intent, not templates.',
  },
];

const AboutPage = ({ openModal }: { openModal: OpenModal }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lazy chunk: App's route-change reveal pass runs before this page
  // mounts, so it observes its own reveals (same as ProcessPage).
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.ab .reveal'));
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
  }, []);

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <main id="main" tabIndex={-1} className="ab">
      {/* hero */}
      <section className="ab__hero">
        <div className="container">
          <p className="tag reveal">
            <span className="tag__num">About</span>&nbsp;·&nbsp;The studio
          </p>
          <h1 className="ab__h1 reveal">
            A studio you can
            <br />
            know by <em>name</em>.
          </h1>
          <p className="lede ab__lede reveal" data-delay="1">
            Pajzo is an independent digital studio in Domžale, Slovenia.
            Websites, apps, branding and design, taken from the first sketch to
            the finished build by one team.
          </p>
        </div>
      </section>

      {/* the letter */}
      <section className="ab__letter-wrap">
        <div className="container">
          <figure className="ab__letter reveal">
            <header className="ab__letter-head">A short letter · from the founder</header>
            <div className="ab__letter-body">
              <p>
                Pajzo opened in 2026 around one conviction: digital work turns
                out best when the people who imagine it are the people who
                make it.
              </p>
              <p>
                So this studio keeps everything at one table. The person who
                shapes your brand sits beside the person who writes the code,
                decisions are made once, in the open, and what you approve is
                what actually ships.
              </p>
              <p>
                We are independent by design. A sole proprietorship, no outside
                owners, and no pressure to take on anything we cannot stand
                behind. Every quote carries my name, every email gets a reply
                within a working day, and everything we build is yours from
                day one.
              </p>
              <p>
                If that sounds like the way you would want your project
                treated, write to us. The door is open.
              </p>
            </div>
            <footer className="ab__letter-foot">
              <div className="ab__sig">
                <span className="ab__sig-name">Ajdin Pajazetović</span>
                <span className="ab__sig-role">Founder, Pajzo</span>
              </div>
              <span className="ab__letter-place">Domžale · Slovenia</span>
            </footer>
          </figure>
        </div>
      </section>

      {/* the table */}
      <section className="ab__table">
        <div className="container">
          <div className="ab__table-grid">
            <div className="ab__table-side">
              <h2 className="ab__h2 reveal">One table, four trades.</h2>
              <p className="ab__side-text reveal" data-delay="1">
                Ajdin leads every project, with the studio team around him:
                design, engineering and brand, working side by side rather than
                in sequence. Based in Domžale, working remotely across Europe.
              </p>
              <a
                href="/process"
                className="ab__side-link reveal"
                data-delay="2"
                onClick={(e) => go(e, '/process')}
              >
                Read how a project runs
                <ArrowRight />
              </a>
            </div>
            <div className="ab__disciplines">
              {DISCIPLINES.map((d, i) => (
                <div
                  className="ab__disc reveal"
                  data-delay={String(Math.min(i, 3))}
                  key={d.num}
                >
                  <span className="ab__disc-num">{d.num}</span>
                  <h3>{d.name}</h3>
                  <p>{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="ab__close">
        <div className="container">
          <h2 className="ab__close-head reveal">
            Put a name to
            <br />
            your project.
          </h2>
          <div className="ab__close-cta reveal" data-delay="1">
            <button className="btn btn--solid btn--lg" onClick={() => openModal()}>
              Start a project
              <ArrowRight />
            </button>
            <a
              href="/work"
              className="btn btn--ghost btn--lg"
              onClick={(e) => go(e, '/work')}
            >
              See the work
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
