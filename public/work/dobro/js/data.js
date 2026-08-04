/* ============================================================
   data.js — the six floors and what is on them

   Eighteen things, three to a department. A general store's whole
   problem is that it sells everything, so the answer here is not
   more filters but fewer, better-described items on named floors.

   Every price is the price paid: VAT and delivery are inside it,
   which is why there is no separate "from" figure anywhere.
   ============================================================ */

export const DEPTS = [
  { id: 'sound',    no: '01', name: 'Sound',    hex: '#2743e8',
    desc: 'Things that move air. Headphones, speakers, one recorder.' },
  { id: 'kitchen',  no: '02', name: 'Kitchen',  hex: '#c0362c',
    desc: 'Heat, water and coffee. The three arguments of a morning.' },
  { id: 'home',     no: '03', name: 'Home',     hex: '#2f6b4f',
    desc: 'Light to read by, somewhere to sit, something underfoot.' },
  { id: 'workshop', no: '04', name: 'Workshop', hex: '#b57d05',
    desc: 'Tools that outlive the job they were bought for.' },
  { id: 'outdoors', no: '05', name: 'Outdoors', hex: '#0f6f6b',
    desc: 'For leaving the house on purpose and staying out.' },
  { id: 'personal', no: '06', name: 'Personal',  hex: '#6e3c96',
    desc: 'Worn, carried, wound. The things that go with you.' },
];

export const DEPT = Object.fromEntries(DEPTS.map((d) => [d.id, d]));

/* lead: working days from order to doorstep, used for the real date
   stock: units actually on the floor
   feat: the order the shop would put them in unprompted */
export const PRODUCTS = [
  {
    id: 'mrd-1', dept: 'sound', art: 'headphones', feat: 1,
    name: 'Meridian Over-Ear', sku: 'SO-1140',
    price: 249, rating: 4.6, reviews: 212, stock: 34, lead: 2,
    blurb: 'A closed back that does not flatter the recording. Replaceable pads, replaceable cable, replaceable headband — the three things that fail.',
    tags: ['headphones', 'over ear', 'closed', 'wired'],
    specs: { Drivers: '42 mm dynamic', Impedance: '38 Ω', Weight: '286 g', Cable: '1.8 m, detachable', Warranty: '5 years' },
  },
  {
    id: 'col-2', dept: 'sound', art: 'speakers', feat: 6,
    name: 'Column Bookshelf, pair', sku: 'SO-2208',
    price: 430, rating: 4.8, reviews: 96, stock: 11, lead: 3,
    blurb: 'Two boxes, no apology. Birch ply cabinets that ring at nothing and a tweeter that stops when the recording does.',
    tags: ['speakers', 'bookshelf', 'passive', 'pair'],
    specs: { Type: '2-way passive', Woofer: '130 mm paper', Sensitivity: '86 dB', Cabinet: 'Birch ply, 18 mm', Warranty: '5 years' },
  },
  {
    id: 'fld-3', dept: 'sound', art: 'recorder', feat: 12,
    name: 'Field Recorder 24/96', sku: 'SO-3061',
    price: 199, rating: 4.4, reviews: 58, stock: 6, lead: 2,
    blurb: 'Records to a card you can buy anywhere, on batteries you can buy anywhere. Two knobs, one screen, no menu diving.',
    tags: ['recorder', 'field', 'audio', 'portable'],
    specs: { Resolution: '24-bit / 96 kHz', Inputs: '2 × XLR combo', Media: 'SD, up to 512 GB', Power: '4 × AA or USB-C', Warranty: '3 years' },
  },

  {
    id: 'ket-4', dept: 'kitchen', art: 'kettle', feat: 2,
    name: 'Gooseneck Kettle 1L', sku: 'KI-1102',
    price: 89, rating: 4.7, reviews: 341, stock: 62, lead: 2,
    blurb: 'A spout that pours where you point it and a handle that stays cool. Holds a degree for twenty minutes, which is longer than you need.',
    tags: ['kettle', 'coffee', 'pour over', 'electric'],
    specs: { Capacity: '1.0 L', Control: '±1 °C, 40–100 °C', Body: '304 stainless', Base: '1200 W', Warranty: '3 years' },
  },
  {
    id: 'cas-5', dept: 'kitchen', art: 'casserole', feat: 5,
    name: 'Cast Iron Casserole 24', sku: 'KI-2240',
    price: 139, rating: 4.9, reviews: 508, stock: 28, lead: 2,
    blurb: 'Four kilos of iron with a lid that sits flat. It will be worth more to somebody in forty years than it costs you today.',
    tags: ['casserole', 'cast iron', 'pot', 'oven'],
    specs: { Diameter: '24 cm', Capacity: '4.2 L', Weight: '4.1 kg', Finish: 'Matte enamel', Warranty: 'Lifetime' },
  },
  {
    id: 'grn-6', dept: 'kitchen', art: 'grinder', feat: 9,
    name: 'Conical Burr Grinder', sku: 'KI-3315',
    price: 165, rating: 4.3, reviews: 187, stock: 4, lead: 3,
    blurb: 'Forty settings, all of them reachable, none of them stepped so finely that you cannot tell them apart.',
    tags: ['grinder', 'coffee', 'burr', 'espresso'],
    specs: { Burrs: '38 mm conical steel', Settings: '40 stepped', Hopper: '250 g', Motor: '150 W, low speed', Warranty: '3 years' },
  },

  {
    id: 'rdl-7', dept: 'home', art: 'lamp', feat: 4,
    name: 'Reading Lamp, Brass', sku: 'HO-1075',
    price: 119, rating: 4.5, reviews: 143, stock: 41, lead: 2,
    blurb: 'Weighted so it does not walk across the table, and jointed so it stays where you put it after the hundredth adjustment.',
    tags: ['lamp', 'reading', 'desk', 'light'],
    specs: { Reach: '62 cm', Output: '470 lm, 2700 K', Dimming: 'Stepless', Finish: 'Brushed brass', Warranty: '5 years' },
  },
  {
    id: 'lng-8', dept: 'home', art: 'chair', feat: 8,
    name: 'Lounge Chair, Oak', sku: 'HO-2410',
    price: 540, rating: 4.8, reviews: 74, stock: 9, lead: 6,
    blurb: 'Solid oak, wool, and joinery you can see. Sit in it for three hours before deciding — the first ten minutes tell you nothing.',
    tags: ['chair', 'lounge', 'oak', 'wool'],
    specs: { Frame: 'Solid European oak', Upholstery: 'Wool, 60,000 rubs', Height: '74 cm', Assembly: 'Four bolts, tool in box', Warranty: '10 years' },
  },
  {
    id: 'rug-9', dept: 'home', art: 'rug', feat: 14,
    name: 'Wool Rug 170 × 240', sku: 'HO-3170',
    price: 389, rating: 4.6, reviews: 61, stock: 7, lead: 4,
    blurb: 'Hand-loomed from undyed fleece, so the colour is the sheep. It will shed for a month and then stop for a decade.',
    tags: ['rug', 'wool', 'floor', 'undyed'],
    specs: { Size: '170 × 240 cm', Pile: '12 mm hand-loomed', Material: '100% undyed wool', Weight: '14 kg', Warranty: '5 years' },
  },

  {
    id: 'drl-10', dept: 'workshop', art: 'drill', feat: 3,
    name: 'Cordless Drill 18 V', sku: 'WO-1180',
    price: 159, rating: 4.7, reviews: 402, stock: 55, lead: 2,
    blurb: 'One battery platform, kept for eleven years and counting. The clutch actually slips where the numbers say it will.',
    tags: ['drill', 'cordless', 'driver', '18v'],
    specs: { Torque: '62 Nm', Chuck: '13 mm keyless', Battery: '18 V, 4.0 Ah', Clutch: '20 + 2 stages', Warranty: '3 years' },
  },
  {
    id: 'bit-11', dept: 'workshop', art: 'bitset', feat: 15,
    name: '42-Piece Bit Set', sku: 'WO-2042',
    price: 39, rating: 4.4, reviews: 289, stock: 120, lead: 1,
    blurb: 'S2 steel in a case that closes properly. Every bit sits in a labelled hole, so a missing one is obvious before you leave.',
    tags: ['bits', 'set', 'driver', 'steel'],
    specs: { Pieces: '42', Steel: 'S2 tool steel', Sizes: 'PH, PZ, TX, HEX, SL', Case: 'Labelled, latching', Warranty: 'Lifetime' },
  },
  {
    id: 'chs-12', dept: 'workshop', art: 'toolchest', feat: 17,
    name: 'Steel Tool Chest', sku: 'WO-3300',
    price: 229, rating: 4.5, reviews: 88, stock: 13, lead: 5,
    blurb: 'Three drawers on ball-bearing slides that still run when full. Powder-coated inside as well as out, which is where they usually save money.',
    tags: ['chest', 'tools', 'storage', 'steel'],
    specs: { Drawers: '3, ball-bearing', Load: '30 kg per drawer', Body: '0.8 mm steel', Size: '66 × 31 × 38 cm', Warranty: '5 years' },
  },

  {
    id: 'bik-13', dept: 'outdoors', art: 'bicycle', feat: 7,
    name: 'City Bicycle, 8-speed', sku: 'OU-1080',
    price: 749, rating: 4.6, reviews: 129, stock: 8, lead: 5,
    blurb: 'A hub gear, full guards and a chain case, because a city bike that needs cleaning after rain is not a city bike.',
    tags: ['bicycle', 'city', 'commuter', 'hub gear'],
    specs: { Gears: '8-speed hub', Frame: 'Steel, 3 sizes', Brakes: 'Roller, front and rear', Weight: '15.8 kg', Warranty: '5 years frame' },
  },
  {
    id: 'tnt-14', dept: 'outdoors', art: 'tent', feat: 11,
    name: 'Two-Person Tent', sku: 'OU-2020',
    price: 279, rating: 4.5, reviews: 156, stock: 3, lead: 3,
    blurb: 'Pitches outer first, so you can put it up in rain without soaking the inside. Two doors, two porches, no arguments.',
    tags: ['tent', 'camping', 'two person', 'outdoor'],
    specs: { Sleeps: '2', Weight: '2.4 kg packed', Hydrostatic: '3000 mm flysheet', Pitch: 'Outer first', Warranty: '3 years' },
  },
  {
    id: 'btl-15', dept: 'outdoors', art: 'bottle', feat: 16,
    name: 'Insulated Bottle 750', sku: 'OU-3075',
    price: 35, rating: 4.8, reviews: 613, stock: 210, lead: 1,
    blurb: 'Wide enough to get a brush inside and a hand of ice through. The lid has one seal, and we sell it separately.',
    tags: ['bottle', 'insulated', 'water', 'flask'],
    specs: { Capacity: '750 ml', Keeps: '18 h hot, 26 h cold', Body: '18/8 stainless', Mouth: '54 mm', Warranty: 'Lifetime' },
  },

  {
    id: 'wch-16', dept: 'personal', art: 'watch', feat: 10,
    name: 'Automatic Watch 38', sku: 'PE-1038',
    price: 459, rating: 4.7, reviews: 92, stock: 5, lead: 3,
    blurb: 'Winds itself off your wrist and runs eight seconds fast a day, which is within spec and will not change.',
    tags: ['watch', 'automatic', 'mechanical', 'steel'],
    specs: { Movement: 'Automatic, 41 h', Case: '38 mm steel', Crystal: 'Sapphire, flat', Water: '10 ATM', Warranty: '5 years' },
  },
  {
    id: 'bag-17', dept: 'personal', art: 'bag', feat: 13,
    name: 'Leather Weekender', sku: 'PE-2044',
    price: 289, rating: 4.6, reviews: 118, stock: 16, lead: 3,
    blurb: 'Full-grain hide that will mark in the first week and look better for it. Cotton lined, so a spill is a wash rather than a loss.',
    tags: ['bag', 'weekender', 'leather', 'travel'],
    specs: { Volume: '44 L', Leather: 'Full-grain, 1.8 mm', Lining: 'Waxed cotton', Hardware: 'Solid brass', Warranty: '10 years' },
  },
  {
    id: 'snk-18', dept: 'personal', art: 'sneaker', feat: 18,
    name: 'Sneakers, Full-Grain', sku: 'PE-3041',
    price: 149, rating: 4.2, reviews: 274, stock: 2, lead: 2,
    blurb: 'Stitched, not glued, and resoleable by any cobbler with a Goodyear machine. They are stiff for a fortnight.',
    tags: ['sneakers', 'shoes', 'leather', 'resoleable'],
    specs: { Upper: 'Full-grain leather', Sole: 'Stitched rubber', Last: 'Regular width', Resole: 'Yes, standard', Warranty: '2 years' },
  },
];
