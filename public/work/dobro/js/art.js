/* ============================================================
   art.js — the plates

   Every product is drawn, not photographed: the store ships no
   image files at all. Each archetype is a small function returning
   SVG on a common 200x160 stage, built from the same vocabulary —
   ink outline at one weight, the department's colour as a wash for
   volume and solid for the one detail that identifies the thing.

   Drawing them rather than sourcing them is also the honest option
   for a fictional shop: nothing here pretends to be a real product
   photograph of a real product.
   ============================================================ */

const INK = '#14181d';

/** Wrap drawing commands in the shared stage. */
export function plate(inner, hex) {
  return `<svg viewBox="0 0 200 160" role="img" aria-hidden="true"
    style="--c:${hex}" fill="none" stroke="${INK}" stroke-width="2.4"
    stroke-linejoin="round" stroke-linecap="round">${inner}</svg>`;
}

/* a soft field of the department colour, for volumes */
const wash = 'fill="var(--c)" fill-opacity="0.18"';
const solid = 'fill="var(--c)" stroke="none"';
const paper = 'fill="#fdfdfb"';

export const ART = {
  /* ---------- 01 sound ---------- */
  headphones: `
    <path d="M56 96V74a44 44 0 0 1 88 0v22" ${paper}/>
    <rect x="38" y="86" width="30" height="46" rx="11" ${wash}/>
    <rect x="132" y="86" width="30" height="46" rx="11" ${wash}/>
    <rect x="45" y="95" width="16" height="28" rx="7" ${solid}/>
    <path d="M56 96V74a44 44 0 0 1 88 0v22"/>
    <path d="M62 78h76" stroke-opacity="0.25"/>`,

  speakers: `
    <rect x="46" y="26" width="48" height="110" rx="3" ${wash}/>
    <rect x="106" y="26" width="48" height="110" rx="3" ${wash}/>
    <circle cx="70" cy="60" r="14"/><circle cx="70" cy="60" r="5" ${solid}/>
    <circle cx="70" cy="104" r="9"/>
    <circle cx="130" cy="60" r="14"/><circle cx="130" cy="60" r="5" ${solid}/>
    <circle cx="130" cy="104" r="9"/>
    <path d="M46 128h48M106 128h48" stroke-opacity="0.3"/>`,

  recorder: `
    <rect x="62" y="46" width="76" height="98" rx="7" ${wash}/>
    <rect x="74" y="60" width="52" height="30" rx="2" ${paper}/>
    <path d="M80 74h16M80 82h30" stroke-width="2" stroke-opacity="0.4"/>
    <circle cx="86" cy="112" r="9"/><circle cx="114" cy="112" r="9" ${solid}/>
    <path d="M100 46V26" stroke-width="3"/>
    <ellipse cx="100" cy="20" rx="13" ry="9" ${wash}/>`,

  /* ---------- 02 kitchen ---------- */
  kettle: `
    <path d="M70 86h46a16 16 0 0 1 16 16v26a16 16 0 0 1-16 16H74a16 16 0 0 1-16-16v-26a16 16 0 0 1 12-16Z" ${wash}/>
    <path d="M62 102C42 100 32 86 34 70c1-10 8-15 15-13" stroke-width="4.5"/>
    <path d="M49 57v17" stroke-width="4.5"/>
    <path d="M132 102c16 1 25 8 25 19s-9 18-25 19" stroke-width="3.6"/>
    <rect x="82" y="72" width="36" height="14" rx="5" ${wash}/>
    <rect x="93" y="62" width="14" height="10" rx="4" ${solid}/>`,

  casserole: `
    <path d="M40 84h120v34a20 20 0 0 1-20 20H60a20 20 0 0 1-20-20V84Z" ${wash}/>
    <path d="M34 78h132" stroke-width="3"/>
    <path d="M46 78c0-22 24-34 54-34s54 12 54 34" ${wash}/>
    <rect x="88" y="30" width="24" height="12" rx="6" ${solid}/>
    <path d="M40 96H26M160 96h14" stroke-width="3"/>`,

  grinder: `
    <path d="M74 32h52l-7 26H81Z" ${wash}/>
    <path d="M84 24h32" stroke-width="3"/>
    <path d="M100 24v8" stroke-width="3"/>
    <rect x="78" y="58" width="44" height="15" rx="3" ${wash}/>
    <circle cx="100" cy="65" r="4" ${solid}/>
    <rect x="85" y="73" width="30" height="30" ${wash}/>
    <path d="M76 103h48v27a9 9 0 0 1-9 9H85a9 9 0 0 1-9-9Z" ${paper}/>
    <path d="M76 116h48" stroke="var(--c)" stroke-width="3"/>`,

  /* ---------- 03 home ---------- */
  lamp: `
    <path d="M40 140h56" stroke-width="3"/>
    <path d="M68 140V96" stroke-width="3"/>
    <path d="M68 96 118 58" stroke-width="3"/>
    <path d="M104 44h44l-12 34h-44Z" ${wash}/>
    <circle cx="118" cy="58" r="5" ${solid}/>
    <circle cx="68" cy="96" r="5" ${solid}/>
    <path d="M110 82c4 12 12 20 22 24" stroke-opacity="0.3" stroke-width="2"/>`,

  chair: `
    <path d="M52 96c0-34 8-56 14-56h48c8 0 12 20 12 44" ${wash}/>
    <path d="M46 96h94a8 8 0 0 1 8 8v10H46Z" ${wash}/>
    <path d="M52 114v24M142 114v24" stroke-width="3"/>
    <path d="M64 114l-6 24M136 114l4 24" stroke-opacity="0.3" stroke-width="2"/>
    <rect x="60" y="76" width="46" height="12" rx="6" ${solid}/>`,

  rug: `
    <rect x="34" y="48" width="132" height="64" rx="1" ${wash}/>
    <rect x="46" y="58" width="108" height="44" ${paper}/>
    <path d="M100 64l17 16-17 16-17-16Z" stroke="var(--c)" stroke-width="3"/>
    <path d="M52 80h20M128 80h20" stroke="var(--c)" stroke-width="3"/>
    <path d="M40 112v11M52 112v11M64 112v11M76 112v11M88 112v11M100 112v11M112 112v11M124 112v11M136 112v11M148 112v11M160 112v11" stroke-width="2" stroke-opacity="0.45"/>
    <path d="M40 48V37M52 48V37M64 48V37M76 48V37M88 48V37M100 48V37M112 48V37M124 48V37M136 48V37M148 48V37M160 48V37" stroke-width="2" stroke-opacity="0.45"/>`,

  /* ---------- 04 workshop ---------- */
  drill: `
    <path d="M46 52h58a26 26 0 0 1 26 26v6H46Z" ${wash}/>
    <path d="M74 84v24l-14 30h34l-6-30V84Z" ${wash}/>
    <path d="M130 62h22v14h-22Z" ${solid}/>
    <path d="M152 69h20" stroke-width="3"/>
    <rect x="58" y="126" width="42" height="14" rx="4" ${wash}/>
    <circle cx="62" cy="68" r="6"/>`,

  bitset: `
    <rect x="34" y="46" width="132" height="76" rx="5" ${wash}/>
    <path d="M34 72h132" stroke-opacity="0.35"/>
    <path d="M48 88v20M64 88v20M80 88v20M96 88v20M112 88v20M128 88v20M144 88v20" stroke-width="4" stroke="var(--c)"/>
    <path d="M48 58h44" stroke-opacity="0.4"/>
    <rect x="88" y="40" width="24" height="8" rx="3" ${solid}/>`,

  toolchest: `
    <rect x="38" y="40" width="124" height="34" rx="4" ${wash}/>
    <rect x="38" y="76" width="124" height="26" rx="3" ${wash}/>
    <rect x="38" y="104" width="124" height="26" rx="3" ${wash}/>
    <path d="M76 57h48M76 89h48M76 117h48" stroke-width="4" stroke="var(--c)"/>
    <path d="M52 130v8M148 130v8" stroke-width="3"/>`,

  /* ---------- 05 outdoors ---------- */
  bicycle: `
    <circle cx="52" cy="106" r="30" ${wash}/>
    <circle cx="148" cy="106" r="30" ${wash}/>
    <circle cx="52" cy="106" r="6" ${solid}/>
    <circle cx="148" cy="106" r="6" ${solid}/>
    <path d="M52 106 84 62h36l28 44" stroke-width="3"/>
    <path d="M84 62 100 106h48" stroke-width="3"/>
    <path d="M76 56h20" stroke-width="3"/>
    <path d="M118 56h18" stroke-width="3"/>`,

  tent: `
    <path d="M28 132 100 40l72 92Z" ${wash}/>
    <path d="M100 40v92" stroke-opacity="0.3"/>
    <path d="M100 62 76 132h48Z" ${paper}/>
    <path d="M100 62 76 132h48Z" stroke="var(--c)" stroke-width="3"/>
    <path d="M22 132h156" stroke-width="3"/>`,

  bottle: `
    <path d="M80 52h40v72a24 24 0 0 1-24 24h-2a14 14 0 0 1-14-14Z" ${wash}/>
    <rect x="84" y="26" width="32" height="26" rx="4" ${wash}/>
    <rect x="80" y="18" width="40" height="10" rx="5" ${solid}/>
    <path d="M80 92h40" stroke="var(--c)" stroke-width="3"/>
    <path d="M92 66v14" stroke-opacity="0.35" stroke-width="2"/>`,

  /* ---------- 06 personal ---------- */
  watch: `
    <circle cx="100" cy="82" r="38" ${wash}/>
    <circle cx="100" cy="82" r="29" ${paper}/>
    <path d="M100 82V62M100 82l14 10" stroke-width="3"/>
    <circle cx="100" cy="82" r="4" ${solid}/>
    <path d="M78 48 84 20h32l6 28" ${wash}/>
    <path d="M78 116l6 26h32l6-26" ${wash}/>
    <path d="M138 74h8v16h-8Z" ${solid}/>`,

  bag: `
    <rect x="26" y="74" width="148" height="60" rx="27" ${wash}/>
    <path d="M76 76c0-12 10-20 24-20s24 8 24 20" stroke-width="3.4"/>
    <path d="M32 96h136" stroke="var(--c)" stroke-width="4"/>
    <rect x="92" y="88" width="17" height="16" rx="4" ${solid}/>
    <path d="M26 108c14 8 34 12 74 12s60-4 74-12" stroke-opacity="0.28" stroke-width="2"/>`,

  sneaker: `
    <path d="M28 118c0-13 7-22 20-27l26-11 13-20h20l7 23 23 9c15 6 24 14 26 26Z" ${wash}/>
    <path d="M24 116h152a11 11 0 0 1 0 22H26a2 2 0 0 1-2-2Z" ${paper}/>
    <path d="M24 127h152" stroke-opacity="0.3" stroke-width="2"/>
    <path d="M87 66l11 19M99 60l11 20M111 55l12 21" stroke="var(--c)" stroke-width="3"/>
    <path d="M137 79c10 3 16 10 18 21" stroke-width="2.4"/>
    <path d="M74 91l13 23" stroke-opacity="0.25" stroke-width="2"/>`,
};

/* ---------- the counter illustration ----------
   A van and three crates: the delivery promise, drawn. */
export function counterArt() {
  return `<svg viewBox="0 0 320 200" fill="none" stroke="#e8e9e3" stroke-width="2.2"
    stroke-linejoin="round" stroke-linecap="round" role="img" aria-hidden="true">
    <path d="M20 140h176V64H92L60 92H20Z" fill="#e8e9e3" fill-opacity="0.08"/>
    <path d="M196 140h84v-38l-24-30h-60Z" fill="#e8e9e3" fill-opacity="0.14"/>
    <path d="M212 84h32l16 20h-48Z" fill="#e8e9e3" fill-opacity="0.2"/>
    <circle cx="86" cy="150" r="17"/><circle cx="86" cy="150" r="6" fill="#e8e9e3" stroke="none"/>
    <circle cx="234" cy="150" r="17"/><circle cx="234" cy="150" r="6" fill="#e8e9e3" stroke="none"/>
    <path d="M20 150h48M104 150h112" stroke-opacity="0.35"/>
    <rect x="34" y="96" width="30" height="26" rx="2" stroke-opacity="0.6"/>
    <rect x="70" y="104" width="22" height="18" rx="2" stroke-opacity="0.4"/>
    <path d="M0 168h320" stroke-opacity="0.25"/>
  </svg>`;
}
