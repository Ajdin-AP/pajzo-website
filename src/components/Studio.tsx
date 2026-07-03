import { useEffect, useRef } from 'react';
import FounderShield from './FounderShield';

const SHIELD =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

const MANIFESTO =
  'Pajzo puts the whole studio behind your project. The door only opens for work we can do properly, and everyone who touches it sits at the same table. Most of what goes wrong in this business goes wrong in the handoffs. There are none here.';

// Laid out as a bento: wide/narrow tenets plus one solid-orange promise cell.
// Order matters — it defines the grid rhythm.
const TENETS = [
  {
    title: 'One table',
    body: 'Strategy, design and code sit at the same table. Your project is never passed between departments, so nothing gets reinterpreted and nothing falls through the cracks.',
    wide: true,
  },
  {
    title: 'Fixed quotes, in writing',
    body: 'One number, on paper, before any work starts. Half on signing, half on completion. If something sits outside the quote, you hear about it before it happens, never on the bill.',
    wide: false,
  },
  {
    title: 'You own everything',
    body: 'Domains and accounts sit in your name from day one; code and files are handed over at completion. If we ever part ways, you walk out with the keys.',
    wide: true,
  },
  {
    title: 'A direct line',
    body: 'You deal with the people building your project, not an account manager relaying messages. Questions go straight to whoever can actually answer them.',
    wide: true,
  },
];

const Studio = () => {
  const manifestoRef = useRef<HTMLParagraphElement>(null);

  // Ink-fill: the manifesto lights up word by word as it moves through the
  // viewport — reading pace tied to scroll pace. Skipped under reduced-motion.
  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>('.w'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => w.classList.add('lit'));
      return;
    }

    let raf = 0;
    let lit = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const wh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (wh * 0.82 - r.top) / (wh * 0.45)));
      const count = Math.round(p * words.length);
      if (count === lit) return;
      lit = count;
      words.forEach((w, i) => w.classList.toggle('lit', i < count));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Only measure while the manifesto is near the viewport.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => listen(entry.isIntersecting),
        { rootMargin: '50% 0px' }
      );
      io.observe(el);
    } else {
      listen(true);
    }

    return () => {
      io?.disconnect();
      listen(false);
    };
  }, []);

  return (
    <section id="studio" className="section studio">
      <div className="container">
        <div className="s-head s-head--wide reveal">
          <p className="tag">
            <span className="tag__num">02</span>&nbsp;/&nbsp;Studio
          </p>
          <h2 className="h-section">One team, end to end.</h2>
          <p className="lede lede--manifesto" ref={manifestoRef}>
            {MANIFESTO.split(' ').map((word, i) => (
              <span className="w" key={i}>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>

        <div className="bento">
          <div className="tenet tenet--wide reveal">
            <span className="tenet__num" aria-hidden="true">01</span>
            <h3>{TENETS[0].title}</h3>
            <p>{TENETS[0].body}</p>
          </div>
          <div className="tenet reveal" data-delay="1">
            <span className="tenet__num" aria-hidden="true">02</span>
            <h3>{TENETS[1].title}</h3>
            <p>{TENETS[1].body}</p>
          </div>

          <div className="bento__promise reveal">
            <span className="bento__label">The promise</span>
            <p>
              We won&rsquo;t waste your time, your money, or your trust.
            </p>
            <svg className="bento__promise-mark" viewBox="-10 -10 460 540" aria-hidden="true">
              <path d={SHIELD} fill="currentColor" />
            </svg>
          </div>
          <div className="tenet tenet--wide reveal" data-delay="1">
            <span className="tenet__num" aria-hidden="true">03</span>
            <h3>{TENETS[2].title}</h3>
            <p>{TENETS[2].body}</p>
          </div>

          <div className="tenet tenet--full reveal">
            <span className="tenet__num" aria-hidden="true">04</span>
            <h3>{TENETS[3].title}</h3>
            <p>{TENETS[3].body}</p>
          </div>
        </div>

        <figure className="founder reveal">
          <div className="founder__mark" aria-hidden="true">
            <FounderShield />
          </div>
          <blockquote>
            &ldquo;Pajzo is new. This site is the first thing the studio made,
            and we made it exactly the way we would make yours. Judge us on
            it.&rdquo;
          </blockquote>
          <figcaption>
            <b>Ajdin Pajazetović</b>
            Founder. The name on every quote.
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Studio;
