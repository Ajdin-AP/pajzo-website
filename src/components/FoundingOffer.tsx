import { useState, useRef, useEffect } from 'react';
import { ArrowRight } from './icons';
import type { OpenModal } from '../App';

// Counts up to `to` when scrolled into view; respects reduced-motion.
const CountUp = ({ to, duration = 1300 }: { to: number; duration?: number }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      return;
    }
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          io.disconnect();
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
};

const FoundingOffer = ({ openModal }: { openModal: OpenModal }) => (
  <section className="section section--ink founding">
    <div className="container">
      <p className="eyebrow reveal">A founding offer</p>
      <h2 className="founding__title reveal" data-delay="1">
        Our first eight clients pay founding rates.
      </h2>

      <div className="founding__stats">
        <div className="founding__stat reveal" data-delay="1">
          <div className="founding__num">
            <CountUp to={8} />
          </div>
          <div className="founding__label">founding spots — then they&rsquo;re gone</div>
        </div>
        <div className="founding__stat reveal" data-delay="2">
          <div className="founding__num">€750–1,400</div>
          <div className="founding__label">a month, not €900–2,000</div>
        </div>
        <div className="founding__stat reveal" data-delay="3">
          <div className="founding__num">12 months</div>
          <div className="founding__label">at that rate, locked in</div>
        </div>
      </div>

      <div className="founding__foot reveal">
        <p className="founding__lead">
          The first founders to back us get the lowest rate Pajzo will ever
          offer.
        </p>
        <button
          className="btn btn--solid btn--lg"
          onClick={() => openModal('partnership')}
        >
          Ask about a founding spot
          <ArrowRight />
        </button>
      </div>
    </div>
  </section>
);

export default FoundingOffer;
