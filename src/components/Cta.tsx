import type React from 'react';
import { useRef } from 'react';
import { ArrowRight } from './icons';
import { useOffscreenPause } from '../hooks';
import type { OpenModal } from '../App';

// Slow sparks rising off the horizon. Each one gets its own random spot,
// size, speed, drift and start time so they never line up into a row.
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  x: rand(2, 98), // % across
  y: rand(-30, 70), // px above or below the rim where it is born
  size: rand(2, 5),
  dur: rand(7, 16), // s
  delay: -rand(0, 16), // s, negative so the field is already mid-flight
  drift: rand(-4, 4), // vw sideways over the climb
  rise: rand(28, 52), // vh climbed
  lime: i % 3 === 0,
}));

const Cta = ({ openModal }: { openModal: OpenModal }) => {
  const ref = useRef<HTMLElement>(null);
  useOffscreenPause(ref);

  return (
  <section className="cta" id="contact" ref={ref}>
    <div className="cta__embers" aria-hidden="true">
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className={e.lime ? 'is-lime' : undefined}
          style={
            {
              left: `${e.x}%`,
              '--y': `${e.y}px`,
              '--size': `${e.size}px`,
              '--dur': `${e.dur}s`,
              '--delay': `${e.delay}s`,
              '--drift': `${e.drift}vw`,
              '--climb': `-${e.rise}vh`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
    <div className="container reveal">
      <p className="tag cta__tag">
        <span className="tag__num">04</span>&nbsp;/&nbsp;Contact
      </p>
      <h2>
        Start with an <em>email</em>.
      </h2>
      <p className="cta__sub">
        Tell us what you&rsquo;d like built. A paragraph is plenty. You&rsquo;ll
        have a plain answer within a working day, and if we&rsquo;re a fit, a
        fixed quote in writing to hold us to.
      </p>
      <div className="cta__actions">
        <button className="btn btn--solid btn--lg" onClick={() => openModal()}>
          Start a project
          <ArrowRight />
        </button>
      </div>
      <span className="cta__mail">
        or write to <a href="mailto:info@pajzo.com">info@pajzo.com</a>
      </span>
    </div>
  </section>
  );
};

export default Cta;
