import { useEffect, useRef } from 'react';
import { ArrowRight } from './icons';
import { navigate } from '../nav';
import type { OpenModal } from '../App';

// The Pajzo shield — ghosted keyline, drawn on at load.
const SHIELD =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

const Hero = ({ openModal }: { openModal: OpenModal }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<SVGSVGElement>(null);

  // Gentle pointer parallax on the ghosted shield. Fine pointers only.
  useEffect(() => {
    const section = sectionRef.current;
    const mark = markRef.current;
    if (!section || !mark) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      // One rect read per frame, not per pointer event.
      const r = section.getBoundingClientRect();
      tx = ((px - r.left) / r.width - 0.5) * -18;
      ty = ((py - r.top) / r.height - 0.5) * -12;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      mark.style.setProperty('--px', `${cx.toFixed(2)}px`);
      mark.style.setProperty('--py', `${cy.toFixed(2)}px`);
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    section.addEventListener('pointermove', onMove);
    return () => {
      section.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goProcess = () => navigate('/process');

  return (
    <section className="hero" ref={sectionRef}>
      <svg
        className="hero__mark"
        viewBox="-10 -10 460 540"
        ref={markRef}
        aria-hidden="true"
      >
        <path d={SHIELD} pathLength={1} />
      </svg>

      <div className="container hero__wrap">
        <h1 className="hero__title">
          <span className="hero__line">
            <span>Websites. Apps.</span>
          </span>
          <span className="hero__line">
            <span className="hero__outline">Brands. Design.</span>
          </span>
          <span className="hero__line">
            <span className="hero__accent">All under one roof.</span>
          </span>
        </h1>

        <div className="hero__cta">
          <button className="btn btn--solid btn--lg" onClick={() => openModal()}>
            Start a project
            <ArrowRight />
          </button>
          <button className="btn btn--ghost btn--lg" onClick={goProcess}>
            How we work
          </button>
        </div>
      </div>

    </section>
  );
};

export default Hero;
