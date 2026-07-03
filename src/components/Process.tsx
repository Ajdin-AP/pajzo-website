import { useEffect, useRef } from 'react';
import { Check } from './icons';

// Each step carries a small line glyph that draws itself on as the orange
// rail reaches it — same keyline language as the rest of the site.
const STEPS = [
  {
    when: 'Day 01',
    title: 'The conversation',
    desc: 'Write to us. Ajdin replies within a working day, with questions rather than a pitch. If we are not the right studio for the job, we will say so and point you to someone who is.',
    glyph: ['M4 6h16v10H10l-5 4v-4H4z'],
  },
  {
    when: 'Week 01',
    title: 'The quote',
    desc: 'A fixed price and a timeline, in writing: what is included, what is not, what it costs. If you sign, half is due and the project takes the desk.',
    glyph: ['M6 3h9l4 4v14H6z', 'M9 13h7', 'M9 17h5'],
  },
  {
    when: 'Weeks 02 +',
    title: 'The work',
    desc: 'Design and build happen together, at the same table. You see working builds and live links at set checkpoints, not status reports.',
    glyph: ['m9 8-4 4 4 4', 'm15 8 4 4-4 4'],
  },
  {
    when: 'Ship week',
    title: 'Handover',
    desc: 'We test, fix and launch. The second half is due once you have seen the finished work. Code and files then join the accounts already in your name, with a plain note on how to run it all.',
    glyph: ['M4 14v6h16v-6', 'M12 15V4', 'm7 8 5-5 5 5'],
  },
  {
    when: 'After',
    title: 'Stand behind it',
    desc: 'Anything broken by our hand in the first month, we fix at no cost. After that, keep the studio on call or take it fully in-house. You own it either way.',
    glyph: ['M12 3l7 3v6c0 4.2-3 6.8-7 9-4-2.2-7-4.8-7-9V6z', 'm9 12 2 2 4-5'],
  },
];

const Process = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The orange rail fills as the section scrolls through the viewport, and each
  // node lights up as the fill passes it. Stilled under reduced-motion.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      rail.style.setProperty('--p', '1');
      stepRefs.current.forEach((s) => s?.classList.add('is-on'));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      // All layout reads happen before the style write, so the write can't
      // force a synchronous reflow for the reads that follow.
      const r = rail.getBoundingClientRect();
      const stepTops = stepRefs.current.map((s) =>
        s ? s.getBoundingClientRect().top : Infinity
      );
      const trigger = window.innerHeight * 0.55;
      const p = Math.max(0, Math.min(1, (trigger - r.top) / r.height));
      const fillY = r.top + r.height * p;
      rail.style.setProperty('--p', p.toFixed(3));
      stepRefs.current.forEach((s, i) => {
        if (!s) return;
        // Light the ring the moment the fill touches the circle's top edge,
        // so line and ring read as one continuous stroke.
        s.classList.toggle('is-on', stepTops[i] + 2 <= fillY);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Only pay for scroll work while the section is anywhere near the viewport.
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
        { rootMargin: '300px 0px' }
      );
      io.observe(rail);
    } else {
      listen(true);
    }

    return () => {
      io?.disconnect();
      listen(false);
    };
  }, []);

  return (
    <section className="section section--line" id="process">
      <div className="container">
        <div className="process__grid">
          {/* Left column stays put while the steps scroll past it. */}
          <div className="process__side">
            <div className="s-head reveal">
              <p className="tag">
                <span className="tag__num">03</span>&nbsp;/&nbsp;Process
              </p>
              <h2 className="h-section">
                No surprises between <em>hello</em> and handover.
              </h2>
              <p className="lede">
                No discovery workshops, no decks about decks. A short sequence
                you can hold us to.
              </p>
            </div>

            <p className="process__note reveal">
              <Check />
              <span>
                This timeline is the shape, not a promise; your quote comes
                with real dates. The 50/50 split cuts both ways: the studio is
                never paid in full for unfinished work.
              </span>
            </p>
          </div>

          <div className="timeline" ref={railRef}>
            <div className="timeline__rail" aria-hidden="true">
              <div className="timeline__fill" />
            </div>

            {STEPS.map((s, i) => (
              <div
                className="tstep reveal"
                key={s.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
              >
                <div className="tstep__marker" aria-hidden="true">
                  <span className="tstep__node">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="tstep__head">
                  <span className="tstep__chip" aria-hidden="true">
                    <svg className="tstep__glyph" viewBox="0 0 24 24">
                      {s.glyph.map((d) => (
                        <path key={d} d={d} pathLength={1} />
                      ))}
                    </svg>
                  </span>
                  <span className="tstep__when">{s.when}</span>
                </div>
                <h3 className="tstep__title">{s.title}</h3>
                <p className="tstep__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
