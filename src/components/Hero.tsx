import { ArrowRight } from './icons';
import type { OpenModal } from '../App';

const Hero = ({ openModal }: { openModal: OpenModal }) => (
  <section className="hero" aria-label="Introduction">
    <div className="hero__wrap">
      <p className="hero__eyebrow" role="doc-subtitle">
        Founder-led marketing studio
      </p>

      <h1 className="hero__title">
        <span className="hero__line">
          <span>Marketing for founders</span>
        </span>
        <span className="hero__line">
          <span>
            who&rsquo;ve been <span className="hero__accent">burned</span>
          </span>
        </span>
        <span className="hero__line">
          <span>before.</span>
        </span>
      </h1>

      <p className="hero__sub">No account managers, no jargon, no surprises.</p>

      <div className="hero__cta">
        <button className="hero__primary" onClick={() => openModal('audit')}>
          Book a €500 audit
        </button>
        <button className="hero__secondary" onClick={() => openModal()}>
          <span className="hero__secondary-text">Get the free checklist</span>
          <ArrowRight className="arrow" />
        </button>
      </div>
    </div>

    <div className="hero__footer">
      <span>Built for the long haul.</span>
    </div>
  </section>
);

export default Hero;
