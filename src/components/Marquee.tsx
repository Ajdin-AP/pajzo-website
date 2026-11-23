import { useEffect, useRef } from 'react';
import { useOffscreenPause } from '../hooks';

const ITEMS = ['Web development', 'App development', 'Branding', 'Design'];

// How slow the band drifts while hovered, as a fraction of its normal speed.
const HOVER_RATE = 0.25;

// One group = the four disciplines twice, so the track is wide enough on any
// screen. The track holds two identical groups and loops at -50%.
const Group = ({ hidden }: { hidden?: boolean }) => (
  <div className="marquee__group" aria-hidden={hidden || undefined}>
    {[...ITEMS, ...ITEMS].map((item, i) => (
      <span
        key={i}
        className={`marquee__item${i % 2 ? ' marquee__item--ghost' : ''}`}
      >
        {item}
      </span>
    ))}
  </div>
);

// Purely decorative — the four disciplines are listed properly in Services.
const Marquee = () => {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref);

  // Hovering eases the band down to a slow drift instead of stopping it dead,
  // and leaving eases it back up. CSS can't change an animation's speed
  // without a jump, so this nudges the running animation's playbackRate
  // toward a target each frame. Fine pointers only; touch never hovers.
  useEffect(() => {
    const band = ref.current;
    const track = trackRef.current;
    if (!band || !track || typeof track.getAnimations !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let target = 1;
    let rate = 1;
    let raf = 0;
    const tick = () => {
      rate += (target - rate) * 0.08;
      if (Math.abs(target - rate) < 0.005) rate = target;
      track.getAnimations().forEach((a) => {
        a.playbackRate = rate;
      });
      raf = rate === target ? 0 : requestAnimationFrame(tick);
    };
    const aim = (to: number) => {
      target = to;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const slow = () => aim(HOVER_RATE);
    const resume = () => aim(1);
    band.addEventListener('pointerenter', slow);
    band.addEventListener('pointerleave', resume);
    return () => {
      band.removeEventListener('pointerenter', slow);
      band.removeEventListener('pointerleave', resume);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="marquee" aria-hidden="true" ref={ref}>
      <div className="marquee__track" ref={trackRef}>
        <Group />
        <Group hidden />
      </div>
    </div>
  );
};

export default Marquee;
