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

export const Instagram = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <circle cx="12" cy="12" r="4.3" />
    <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const XLogo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Mail = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </svg>
);

export const User = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
);

export const Briefcase = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
    <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
    <path d="M3 12.5h18" />
  </svg>
);

export const Globe = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
  </svg>
);

// The Pajzo wordmark: "P" mark + "AJZO" set in Bungee (declared in index.css).
// fill = currentColor (set per context), orange keyline stroke.
// keyline={false} drops the orange stroke — used for the ghosted footer giant.
export const Wordmark = ({ className, keyline = true }: P & { keyline?: boolean }) => (
  <svg
    viewBox="-6 -6 1738 676"
    className={className}
    fill="currentColor"
    stroke={keyline ? '#d9641e' : 'none'}
    strokeWidth="20"
    strokeMiterlimit="10"
    aria-hidden="true"
  >
    <path d="M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z" />
    <text transform="translate(368.1129 511.6942)" fontFamily="Bungee" fontSize="478.5805">
      <tspan x="0" y="0">AJZO</tspan>
    </text>
  </svg>
);
