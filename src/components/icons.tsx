// Minimal inline icons. Stroke uses currentColor so they inherit text colour.

type P = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const ArrowRight = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
);

export const Check = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Close = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Menu = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);
