import type React from 'react';
import { useRef } from 'react';
import { ArrowRight } from './icons';
import { useOffscreenPause } from '../hooks';
import type { OpenModal } from '../App';

// A dozen slow embers drifting up from the glow — CSS only, staggered by index.
const EMBERS = Array.from({ length: 12 }, (_, i) => i);

const Cta = ({ openModal }: { openModal: OpenModal }) => {
  const ref = useRef<HTMLElement>(null);
  useOffscreenPause(ref);

  return (
  <section className="cta" id="contact" ref={ref}>
    <div className="cta__embers" aria-hidden="true">
      {EMBERS.map((i) => (
        <span key={i} style={{ '--i': i } as React.CSSProperties} />
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
