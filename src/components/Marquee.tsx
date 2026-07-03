import { useRef } from 'react';
import { useOffscreenPause } from '../hooks';

const ITEMS = ['Web development', 'App development', 'Branding', 'Design'];

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
  useOffscreenPause(ref);

  return (
    <div className="marquee" aria-hidden="true" ref={ref}>
      <div className="marquee__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
};

export default Marquee;
