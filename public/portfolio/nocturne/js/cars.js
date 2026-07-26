/* ============================================================
   cars.js — the NOCTURNE collection, built procedurally

   Bodies are lofted surfaces (see carbody.js): control curves for
   roof, beltline, sill, half-width, roof width and crown are
   sampled into cross-sections and stitched, so each car has plan
   taper, haunches over the rear wheels, tumblehome and a tucked
   sill. Glazing is a patch of that same surface offset outward, so
   it always sits exactly on the body and the paint left uncovered
   reads as the pillars.

   Cars face +X, up is +Y, width across Z.
   ============================================================ */
import * as THREE from 'three';
import {
  curve, buildBodyGeometry, surfacePatch, archLiner, skinZAt, maxZAt, surfaceXAt, mirrorJ,
  RING_HALF, J_SHOULDER, J_RAIL, mergeGeometries, toCreasedNormals,
} from './carbody.js';
import { buildWheel } from './wheels.js';

export const BRASS = 0xc6a15b;

/* The five lacquers of the collection */
export const PAINTS = [
  { name: 'Oxblood Lacquer', hex: 0x5a1e1c, css: '#5A1E1C' },
  { name: 'Basalt Grey', hex: 0x43464a, css: '#43464A' },
  { name: 'Ivory Gesso', hex: 0xe8e2d2, css: '#E8E2D2' },
  { name: 'Viridian Racing', hex: 0x1e4d40, css: '#1E4D40' },
  { name: 'Midnight Anodine', hex: 0x10131c, css: '#10131C' },
];

/* ---------- procedural textures (no image files ship) ---------- */
let _flake = null;
/** Fine metallic flake: a noise normal map, tiled hard and used at
    low amplitude so it survives every lacquer from ivory to black. */
function flakeNormal() {
  if (_flake) return _flake;
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    // random unit-ish normal, mostly pointing up
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.5;
    const nx = Math.cos(a) * r, ny = Math.sin(a) * r;
    img.data[i * 4] = Math.round((nx * 0.5 + 0.5) * 255);
    img.data[i * 4 + 1] = Math.round((ny * 0.5 + 0.5) * 255);
    img.data[i * 4 + 2] = 255;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  _flake = new THREE.CanvasTexture(c);
  _flake.wrapS = _flake.wrapT = THREE.RepeatWrapping;
  _flake.repeat.set(28, 14);
  return _flake;
}

let _carbon = null;
/** 2x2 twill carbon weave, drawn once. */
function carbonTexture() {
  if (_carbon) return _carbon;
  const S = 64;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0c0c0e';
  ctx.fillRect(0, 0, S, S);
  const t = S / 4;
  ctx.fillStyle = '#15161a';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) ctx.fillRect(i * t, j * t, t, t);
    }
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * t, 0); ctx.lineTo(i * t, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * t); ctx.lineTo(S, i * t); ctx.stroke();
  }
  _carbon = new THREE.CanvasTexture(c);
  _carbon.wrapS = _carbon.wrapT = THREE.RepeatWrapping;
  _carbon.repeat.set(46, 26);
  return _carbon;
}

/* ---------- materials ---------- */
export function makePaintMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.52,
    roughness: 0.30,
    clearcoat: 1.0,
    clearcoatRoughness: 0.045,
    envMapIntensity: 1.30,
    normalMap: flakeNormal(),
    normalScale: new THREE.Vector2(0.06, 0.06),
  });
}

const MAT = {
  /* dark glazing: no transmission — the planar Reflector already
     renders the scene twice, and at this exposure a dark, tight
     clearcoat reads as glass for a fraction of the cost */
  glass: () => new THREE.MeshPhysicalMaterial({
    color: 0x07090e, metalness: 0.35, roughness: 0.055,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.1,
    side: THREE.DoubleSide,
  }),
  trim: () => new THREE.MeshStandardMaterial({
    color: 0x0c0d10, metalness: 0.22, roughness: 0.55,
  }),
  /* not pure black: on a dark stage a true 0 reads as a hole */
  shadowline: () => new THREE.MeshStandardMaterial({
    color: 0x07080a, metalness: 0.2, roughness: 0.8,
  }),
  carbon: () => new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: carbonTexture(), metalness: 0.45, roughness: 0.34,
    clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: 1.2,
  }),
  chrome: () => new THREE.MeshStandardMaterial({
    color: 0xdfe4ea, metalness: 1.0, roughness: 0.11, envMapIntensity: 1.6,
  }),
  brass: () => new THREE.MeshStandardMaterial({
    color: BRASS, metalness: 1.0, roughness: 0.3, envMapIntensity: 1.3,
  }),
  /* sidewall is softer and slightly warmer than the tread */
  tire: () => new THREE.MeshPhysicalMaterial({
    color: 0x08090b, metalness: 0.0, roughness: 0.95,
    specularIntensity: 0.16, envMapIntensity: 0.35,
  }),
  rim: () => new THREE.MeshStandardMaterial({
    color: 0x8f959f, metalness: 1.0, roughness: 0.21, envMapIntensity: 1.25,
  }),
  rimBarrel: () => new THREE.MeshStandardMaterial({
    color: 0x1e2126, metalness: 0.9, roughness: 0.46,
  }),
  brake: () => new THREE.MeshStandardMaterial({
    color: 0x767b83, metalness: 0.85, roughness: 0.36,
  }),
  headlight: () => new THREE.MeshStandardMaterial({
    color: 0xe8f0ff, metalness: 0.0, roughness: 0.25,
    emissive: 0xffd9a0, emissiveIntensity: 0.35, // LAMPLIGHT raises this
  }),
  taillight: () => new THREE.MeshStandardMaterial({
    color: 0x2a0407, metalness: 0.2, roughness: 0.22,
    emissive: 0xff2028, emissiveIntensity: 1.5,
  }),
  lens: () => new THREE.MeshPhysicalMaterial({
    color: 0x0a0c10, metalness: 0.2, roughness: 0.04,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.4,
    transparent: true, opacity: 0.55,
  }),
  cabin: () => new THREE.MeshStandardMaterial({
    color: 0x14151a, metalness: 0.05, roughness: 0.9,
  }),
  leather: () => new THREE.MeshStandardMaterial({
    color: 0x1d1a17, metalness: 0.0, roughness: 0.75,
  }),
};

/* ---------- small helpers ---------- */
function box(w, h, d, mat, x, y, z, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.z = rz;
  return m;
}

/** rounded slab, for lamp housings and blades */
function slab(w, h, d, r, mat) {
  const s = new THREE.Shape();
  const hw = w / 2, hh = h / 2, rr = Math.min(r, hh * 0.9, hw * 0.9);
  s.moveTo(-hw + rr, -hh);
  s.lineTo(hw - rr, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + rr);
  s.lineTo(hw, hh - rr);
  s.quadraticCurveTo(hw, hh, hw - rr, hh);
  s.lineTo(-hw + rr, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - rr);
  s.lineTo(-hw, -hh + rr);
  s.quadraticCurveTo(-hw, -hh, -hw + rr, -hh);
  // the bevel must follow the SMALLEST dimension: keyed to depth it
  // inflated wide-but-thin parts (a 1.4 m diffuser grew a 0.26 m lip)
  const bev = Math.min(w, h, d) * 0.16;
  const g = new THREE.ExtrudeGeometry(s, {
    depth: d, bevelEnabled: true, bevelThickness: bev,
    bevelSize: bev, bevelSegments: 2, curveSegments: 5, steps: 1,
  });
  // UVs are kept: the carbon weave is a map, and a mapless material
  // does not mind them being present
  g.translate(0, 0, -d / 2);
  return new THREE.Mesh(g, mat);
}

/** revolved tube along +X, for exhaust tips */
function tip(rOuter, rInner, len, mat) {
  const pts = [
    new THREE.Vector2(rInner, -len / 2),
    new THREE.Vector2(rInner, len / 2 - 0.012),
    new THREE.Vector2(rOuter, len / 2),
    new THREE.Vector2(rOuter, -len / 2),
  ];
  const g = new THREE.LatheGeometry(pts, 20);
  g.rotateZ(Math.PI / 2);
  return new THREE.Mesh(g, mat);
}

/* ============================================================
   THE COLLECTION
   Each `body` holds the longitudinal control curves. Heights are
   metres above the wheel-contact plane; widths are HALF widths.
   ============================================================ */
export const CARS = {
  vermilion: {
    no: '01',
    name: 'Vermilion Study',
    kind: 'Grand Tourer',
    year: 2026,
    seats: 2,
    price: 246000,
    defaultPaint: 0,
    stats: { power: '630 hp', accel: '3.4 s', top: '318 km/h', torque: '800 Nm' },
    medium: 'Aluminium, carbon',
    blurb: 'A twelve-hour drive that ends too soon. The long bonnet is not nostalgia; it is where the engine lives.',
    quote: 'Twelve cylinders, and not one of them raises its voice.',
    body: {
      frontX: 2.30, rearX: -2.28,
      wheelR: 0.365, wheelW: 0.255, spokes: 10,
      wheels: { front: 1.50, rear: -1.42 },
      archR: 0.445, archBand: 0.16, archInset: 0.115,
      rShoulder: 0.045, rRail: 0.05,
      noseDome: 0.17, tailDome: 0.14, floorLift: 0.055,
      keys: {
        sill: [[-2.28, 0.24], [-1.9, 0.165], [-1.0, 0.145], [1.0, 0.145], [1.9, 0.175], [2.30, 0.25]],
        belt: [[-2.28, 0.66], [-1.8, 0.755], [-0.9, 0.80], [0.3, 0.80], [1.2, 0.775], [1.9, 0.70], [2.30, 0.60]],
        roof: [[-2.28, 0.60], [-2.05, 0.755], [-1.6, 0.905], [-1.05, 1.235], [-0.5, 1.315],
               [0.05, 1.275], [0.42, 1.10], [0.66, 0.925], [1.0, 0.885], [1.65, 0.875],
               [2.05, 0.795], [2.30, 0.645]],
        wBelt: [[-2.28, 0.70], [-2.0, 0.855], [-1.42, 0.965], [-0.6, 0.915], [0.4, 0.90],
                [1.5, 0.94], [2.02, 0.815], [2.30, 0.58]],
        roofRatio: [[-2.28, 0.74], [-1.7, 0.66], [-1.0, 0.565], [-0.4, 0.55], [0.3, 0.60],
                    [0.7, 0.71], [1.4, 0.775], [2.30, 0.76]],
        tuck: [[-2.28, 0.80], [0, 0.885], [2.30, 0.80]],
        crown: [[-2.28, 0.015], [0, 0.022], [2.30, 0.032]],
      },
      glass: {
        screen: [0.30, 0.70],     // windscreen x-range
        side: [-1.25, 0.28],      // side glass
        rear: [-1.75, -1.20],     // rear screen
      },
      lamps: { frontX: 2.22, frontY: 0.665, frontW: 0.30, rearX: -2.20, rearY: 0.685, rearW: 0.26 },
      intake: { x: 2.20, y: 0.335, w: 0.52, h: 0.155, fins: 7 },
      mirror: { x: 0.40, y: 0.905 },
      exhaust: { y: 0.275, z: 0.34 },
      shut: { doorFront: 0.30, doorRear: -1.10, bonnet: 0.74 },
      diffuser: true,
    },
  },

  basalt: {
    no: '02',
    name: 'Basalt Longtail',
    kind: 'Hypercar',
    year: 2026,
    seats: 2,
    price: 428000,
    defaultPaint: 1,
    stats: { power: '1,020 hp', accel: '2.5 s', top: '350 km/h', torque: '1,110 Nm' },
    medium: 'Carbon monocoque, titanium',
    blurb: 'Cab-forward, wind-tunnel honest. A road-legal finding, printed in carbon.',
    quote: 'This is what silence looks like at 350 km/h.',
    body: {
      frontX: 2.26, rearX: -2.30,
      wheelR: 0.36, wheelW: 0.29, spokes: 5,
      wheels: { front: 1.44, rear: -1.44 },
      archR: 0.435, archBand: 0.155, archInset: 0.125,
      rShoulder: 0.038, rRail: 0.042,
      noseDome: 0.16, tailDome: 0.13, floorLift: 0.04,
      keys: {
        sill: [[-2.30, 0.20], [-1.9, 0.14], [-1.0, 0.115], [1.0, 0.115], [1.9, 0.145], [2.26, 0.21]],
        belt: [[-2.30, 0.62], [-1.75, 0.735], [-0.9, 0.75], [0.2, 0.715], [1.1, 0.685], [1.85, 0.60], [2.26, 0.48]],
        roof: [[-2.30, 0.60], [-2.0, 0.80], [-1.55, 0.955], [-1.05, 1.045], [-0.55, 1.115],
               [-0.05, 1.11], [0.42, 0.99], [0.72, 0.815], [1.1, 0.74], [1.62, 0.715],
               [2.0, 0.615], [2.26, 0.44]],
        wBelt: [[-2.30, 0.74], [-1.98, 0.90], [-1.44, 1.00], [-0.7, 0.93], [0.3, 0.895],
                [1.44, 0.955], [2.0, 0.80], [2.26, 0.52]],
        roofRatio: [[-2.30, 0.70], [-1.7, 0.63], [-1.0, 0.545], [-0.3, 0.535], [0.35, 0.60],
                    [0.8, 0.70], [1.4, 0.755], [2.26, 0.72]],
        tuck: [[-2.30, 0.78], [0, 0.865], [2.26, 0.78]],
        crown: [[-2.30, 0.012], [0, 0.018], [2.26, 0.028]],
      },
      glass: {
        screen: [0.32, 0.74],
        side: [-0.95, 0.30],
        rear: [-1.55, -1.00],
      },
      lamps: { frontX: 2.16, frontY: 0.545, frontW: 0.28, rearX: -2.23, rearY: 0.735, rearW: 0.30 },
      intake: { x: 2.15, y: 0.265, w: 0.60, h: 0.16, fins: 9 },
      mirror: { x: 0.60, y: 0.845 },
      exhaust: { y: 0.30, z: 0.20 },
      shut: { doorFront: 0.32, doorRear: -0.90, bonnet: 0.80 },
      splitter: true, diffuser: true, carbonSills: true,
    },
    extras(g, paint, loft, B) {
      const carbon = MAT.carbon();
      // swan-neck rear wing: airfoil blade hung from above
      for (const side of [1, -1]) {
        const neck = slab(0.06, 0.22, 0.07, 0.02, carbon);
        neck.position.set(-1.88, 1.02, side * 0.46);
        g.add(neck);
      }
      const foil = new THREE.Shape();
      foil.moveTo(-0.19, 0);
      foil.quadraticCurveTo(-0.02, 0.055, 0.19, 0.012);
      foil.quadraticCurveTo(-0.02, -0.012, -0.19, 0);
      const fg = new THREE.ExtrudeGeometry(foil, {
        depth: 1.48, bevelEnabled: false, curveSegments: 8, steps: 1,
      });
      fg.rotateY(Math.PI / 2);
      fg.translate(0, 0, 0.74);
      const blade = new THREE.Mesh(fg, carbon);
      blade.position.set(-1.96, 1.13, 0);
      blade.rotation.z = -0.10;
      g.add(blade);
      for (const side of [1, -1]) {
        const plate = slab(0.26, 0.10, 0.016, 0.025, carbon);
        plate.position.set(-1.96, 1.12, side * 0.75);
        plate.rotation.y = Math.PI / 2;
        g.add(plate);
      }
    },
  },

  citadel: {
    no: '03',
    name: 'The Citadel',
    kind: 'Sport Estate',
    year: 2026,
    seats: 5,
    price: 189000,
    defaultPaint: 4,
    stats: { power: '580 hp', accel: '3.9 s', top: '290 km/h', torque: '850 Nm' },
    medium: 'Aluminium, walnut, wool',
    blurb: 'The mountain pass and the opera, the same evening. Five seats, no apologies.',
    quote: 'A fortress that does not believe in walls.',
    body: {
      frontX: 2.36, rearX: -2.36,
      wheelR: 0.415, wheelW: 0.26, spokes: 10,
      wheels: { front: 1.50, rear: -1.46 },
      archR: 0.50, archBand: 0.16, archInset: 0.115,
      rShoulder: 0.05, rRail: 0.06,
      noseDome: 0.16, tailDome: 0.13, floorLift: 0.06,
      keys: {
        sill: [[-2.36, 0.34], [-1.95, 0.275], [-1.0, 0.255], [1.0, 0.255], [1.95, 0.285], [2.36, 0.35]],
        belt: [[-2.36, 0.90], [-1.9, 0.98], [-0.9, 1.02], [0.35, 1.025], [1.25, 1.0], [1.95, 0.93], [2.36, 0.84]],
        roof: [[-2.36, 0.90], [-2.20, 1.29], [-1.9, 1.585], [-1.2, 1.635], [-0.35, 1.645],
               [0.30, 1.585], [0.62, 1.36], [0.92, 1.135], [1.6, 1.115], [2.1, 1.03], [2.36, 0.885]],
        wBelt: [[-2.36, 0.78], [-2.05, 0.90], [-1.46, 0.985], [-0.6, 0.955], [0.4, 0.95],
                [1.5, 0.975], [2.08, 0.865], [2.36, 0.64]],
        roofRatio: [[-2.36, 0.82], [-1.9, 0.76], [-1.0, 0.70], [0.0, 0.70], [0.45, 0.72],
                    [0.85, 0.80], [1.5, 0.84], [2.36, 0.80]],
        tuck: [[-2.36, 0.84], [0, 0.90], [2.36, 0.84]],
        crown: [[-2.36, 0.02], [0, 0.028], [2.36, 0.038]],
      },
      glass: {
        screen: [0.30, 0.66],
        side: [-1.85, 0.28],
        rear: [-2.18, -1.90],
      },
      lamps: { frontX: 2.27, frontY: 0.915, frontW: 0.30, rearX: -2.29, rearY: 1.05, rearW: 0.24 },
      intake: { x: 2.26, y: 0.535, w: 0.50, h: 0.19, fins: 7 },
      mirror: { x: 0.55, y: 1.20 },
      exhaust: { y: 0.345, z: 0.36 },
      shut: { doorFront: 0.28, doorRear: -1.72, bonnet: 0.74 },
      skidPlate: true,
    },
    extras(g, paint, loft, B) {
      const trim = MAT.trim();
      // roof rails
      for (const side of [1, -1]) {
        const z = side * skinZAt(loft, -0.7, 1.60) * 0.78;
        const rail = slab(1.55, 0.045, 0.055, 0.02, trim);
        rail.position.set(-0.72, 1.675, z);
        g.add(rail);
      }
      // roof spoiler over the tailgate
      const sp = slab(0.26, 0.05, 1.24, 0.02, paint);
      sp.position.set(-2.10, 1.60, 0);
      sp.rotation.z = 0.18;
      g.add(sp);
    },
  },

  solstice: {
    no: '04',
    name: 'Solstice Speedster',
    kind: 'Roadster',
    year: 2026,
    seats: 2,
    price: 158000,
    defaultPaint: 2,
    stats: { power: '480 hp', accel: '3.8 s', top: '295 km/h', torque: '620 Nm' },
    medium: 'Aluminium, saddle leather',
    blurb: 'No roof, no filter. The honest way to hear a flat-plane V8 think.',
    quote: 'Open air is the only upholstery that matters.',
    body: {
      frontX: 2.14, rearX: -2.12,
      wheelR: 0.35, wheelW: 0.245, spokes: 5,
      wheels: { front: 1.36, rear: -1.30 },
      archR: 0.428, archBand: 0.155, archInset: 0.11,
      rShoulder: 0.042, rRail: 0.048,
      noseDome: 0.16, tailDome: 0.14, floorLift: 0.05,
      keys: {
        sill: [[-2.12, 0.22], [-1.8, 0.155], [-1.0, 0.135], [1.0, 0.135], [1.8, 0.165], [2.14, 0.23]],
        belt: [[-2.12, 0.64], [-1.7, 0.735], [-0.9, 0.775], [0.2, 0.765], [1.1, 0.74], [1.8, 0.665], [2.14, 0.55]],
        // no roof: the deck rises behind the cockpit, dips over it
        roof: [[-2.12, 0.60], [-1.9, 0.735], [-1.45, 0.845], [-1.02, 0.875], [-0.72, 0.83],
               [-0.30, 0.80], [0.18, 0.80], [0.52, 0.815], [0.78, 0.845], [1.3, 0.845],
               [1.85, 0.775], [2.14, 0.60]],
        wBelt: [[-2.12, 0.70], [-1.85, 0.84], [-1.30, 0.945], [-0.55, 0.905], [0.4, 0.89],
                [1.36, 0.925], [1.88, 0.80], [2.14, 0.56]],
        roofRatio: [[-2.12, 0.74], [-1.5, 0.72], [-0.9, 0.72], [0.2, 0.74], [0.9, 0.775], [2.14, 0.76]],
        tuck: [[-2.12, 0.80], [0, 0.88], [2.14, 0.80]],
        crown: [[-2.12, 0.016], [0, 0.02], [2.14, 0.03]],
      },
      glass: null,
      cockpit: { x0: -0.95, x1: 0.35, depth: 0.20 },
      lamps: { frontX: 2.05, frontY: 0.615, frontW: 0.26, rearX: -2.05, rearY: 0.675, rearW: 0.24 },
      intake: { x: 2.04, y: 0.30, w: 0.46, h: 0.14, fins: 6 },
      mirror: { x: 0.46, y: 0.815 },
      exhaust: { y: 0.26, z: 0.30 },
      shut: { doorFront: 0.36, doorRear: -0.95, bonnet: 0.86 },
      diffuser: true,
    },
    extras(g, paint, loft, B) {
      const cab = MAT.cabin();
      const leather = MAT.leather();
      const c = B.cockpit;
      // sunken tub: a dark floor and inner walls so the opening reads deep
      const midX = (c.x0 + c.x1) / 2;
      const lenX = c.x1 - c.x0;
      const zW = skinZAt(loft, midX, 0.80) * 0.78;
      const floor = box(lenX, 0.03, zW * 2, cab, midX, 0.80 - c.depth, 0);
      g.add(floor);
      for (const side of [1, -1]) {
        const wall = box(lenX, c.depth, 0.03, cab, midX, 0.80 - c.depth / 2, side * zW);
        g.add(wall);
      }
      g.add(box(0.04, c.depth, zW * 2, cab, c.x0, 0.80 - c.depth / 2, 0));
      g.add(box(0.04, c.depth, zW * 2, cab, c.x1, 0.80 - c.depth / 2, 0));
      // twin seats
      for (const side of [1, -1]) {
        const seat = slab(0.34, 0.30, 0.34, 0.09, leather);
        seat.position.set(-0.36, 0.78, side * 0.30);
        seat.rotation.y = Math.PI / 2;
        g.add(seat);
      }
      // fairings behind the seats
      for (const side of [1, -1]) {
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.20, 18, 12), paint);
        hump.scale.set(1.7, 0.78, 1.0);
        hump.position.set(-1.04, 0.80, side * 0.32);
        g.add(hump);
      }
      // low wrapped windscreen: a vertical-axis band so it curves around
      // the cowl, then raked back. CylinderGeometry's theta starts at +Z,
      // so centring the arc on PI/2 aims it down the road.
      const wsZ = skinZAt(loft, c.x1, 0.80) * 0.86;
      const R2 = wsZ * 1.45;
      const arc = 1.15;
      const ws = new THREE.Mesh(
        new THREE.CylinderGeometry(R2, R2, 0.20, 20, 1, true,
          Math.PI / 2 - arc / 2, arc),
        MAT.glass()
      );
      ws.position.set(c.x1 - R2 + 0.05, 0.90, 0);
      ws.rotation.z = -0.26;
      g.add(ws);
    },
  },
};

export const CAR_KEYS = Object.keys(CARS);

/* ---------- the loft, per car ---------- */
function loftSpec(B) {
  const k = B.keys;
  const extra = [];
  if (B.shut) for (const v of Object.values(B.shut)) extra.push(v);
  if (B.glass) for (const r of Object.values(B.glass)) if (r) extra.push(r[0], r[1]);
  return {
    extraStations: extra,
    frontX: B.frontX, rearX: B.rearX,
    archR: B.archR, archBand: B.archBand, archInset: B.archInset,
    rShoulder: B.rShoulder, rRail: B.rRail,
    noseDome: B.noseDome, tailDome: B.tailDome, floorLift: B.floorLift,
    wheels: [
      { x: B.wheels.front, y: B.wheelR },
      { x: B.wheels.rear, y: B.wheelR },
    ],
    curves: {
      sill: curve(k.sill), belt: curve(k.belt), roof: curve(k.roof),
      wBelt: curve(k.wBelt), roofRatio: curve(k.roofRatio),
      tuck: curve(k.tuck), crown: curve(k.crown),
    },
  };
}

/* ---------- glazing ---------- */
function addGlass(g, loft, B) {
  if (!B.glass) return;
  const RING = loft.RING;
  const M = loft.M;
  const glass = MAT.glass();
  const off = 0.008;

  // windscreen and rear screen wrap across the crown
  for (const range of [B.glass.screen, B.glass.rear]) {
    if (!range) continue;
    const geo = surfacePatch(loft, range, J_RAIL - 1, mirrorJ(RING, J_RAIL - 1), off);
    if (geo) g.add(new THREE.Mesh(geo, glass));
  }
  // side glass: upper flank only, both sides
  if (B.glass.side) {
    for (const [a, b] of [
      [J_SHOULDER + 3, J_RAIL - 1],
      [mirrorJ(RING, J_RAIL - 1), mirrorJ(RING, J_SHOULDER + 3)],
    ]) {
      const geo = surfacePatch(loft, B.glass.side, a, b, off);
      if (geo) g.add(new THREE.Mesh(geo, glass));
    }
  }
}

/* ---------- shut lines ---------- */
function addShutLines(g, loft, B) {
  const RING = loft.RING;
  const mat = MAT.shadowline();
  const w = 0.020;
  const push = (x, jA, jB) => {
    const geo = surfacePatch(loft, [x - w, x + w], jA, jB, 0.005);
    if (geo) g.add(new THREE.Mesh(geo, mat));
  };
  if (B.shut) {
    // two door cuts down each flank
    for (const x of [B.shut.doorFront, B.shut.doorRear]) {
      push(x, 1, J_RAIL);
      push(x, mirrorJ(RING, J_RAIL), RING - 2);
    }
    // bonnet cut across the top
    if (B.shut.bonnet) push(B.shut.bonnet, J_RAIL, mirrorJ(RING, J_RAIL));
  }
}

/* ---------- lamps ----------
   A recessed housing, an emissive bar sunk inside it and a lens over
   the mouth, so the lamp reads as depth rather than a glowing decal.
   Built with its long axis already on Z, facing +X. */
function lampUnit(lenZ, height, depth, mat, lensMat, name) {
  const grp = new THREE.Group();
  const mk = (w, h, d, r, m) => {
    const s = slab(w, h, d, r, m);
    s.geometry.rotateY(-Math.PI / 2);   // length W -> Z, depth D -> X
    return s;
  };
  const housing = mk(lenZ, height, depth, height * 0.34, MAT.shadowline());
  grp.add(housing);
  const bar = mk(lenZ * 0.86, height * 0.34, depth * 0.34, height * 0.16, mat);
  bar.position.x = -depth * 0.10;
  bar.name = name;                       // the rig finds the material by name
  grp.add(bar);
  const lens = mk(lenZ * 0.99, height * 0.95, depth * 0.2, height * 0.32, lensMat);
  lens.position.x = depth * 0.34;
  grp.add(lens);
  return grp;
}

function addLamps(g, loft, B) {
  const L = B.lamps;
  const headMat = MAT.headlight();
  const tailMat = MAT.taillight();
  const lens = MAT.lens();

  // lamps sit on the curved end panels: find the x where the fascia is
  // still wide enough to carry the outboard end of the lamp
  const seat = (y, halfLen, dir) => {
    const wide = skinZAt(loft, dir > 0 ? B.frontX - B.noseDome : B.rearX + B.tailDome, y);
    const zc = Math.max(halfLen + 0.05, wide * 0.60);
    const x = surfaceXAt(loft, y, zc + halfLen * 0.55, dir);
    return { x, zc };
  };
  const fs = seat(L.frontY, L.frontW / 2, 1);
  for (const side of [1, -1]) {
    const u = lampUnit(L.frontW, 0.095, 0.11, headMat, lens, 'headlights');
    u.position.set(fs.x - 0.012, L.frontY, side * fs.zc);
    g.add(u);
  }
  const rs = seat(L.rearY, L.rearW / 2, -1);
  for (const side of [1, -1]) {
    const u = lampUnit(L.rearW, 0.085, 0.10, tailMat, lens, 'taillights');
    u.rotation.y = Math.PI;              // face the tail
    u.position.set(rs.x + 0.012, L.rearY, side * rs.zc);
    g.add(u);
  }
}

/* ---------- intake with fins ---------- */
function addIntake(g, loft, B) {
  const o = B.intake;
  const noseX = surfaceXAt(loft, o.y, o.w * 0.75, 1);
  const recess = box(0.10, o.h, o.w * 2, MAT.shadowline(), noseX - 0.055, o.y, 0);
  g.add(recess);
  const finGeos = [];
  for (let i = 0; i < o.fins; i++) {
    const t = (i + 0.5) / o.fins;
    const z = -o.w + 2 * o.w * t;
    const b = new THREE.BoxGeometry(0.05, o.h * 0.86, 0.016);
    b.translate(noseX - 0.035, o.y, z);
    finGeos.push(b);
  }
  const fins = new THREE.Mesh(mergeGeometries(finGeos, false), MAT.trim());
  g.add(fins);
}

/* ---------- interior, seen through the glazing ---------- */
function addInterior(g, loft, B) {
  if (!B.glass) return;
  const cab = MAT.cabin();
  const leather = MAT.leather();
  const side0 = B.glass.side || B.glass.screen;
  const seatX = (side0[0] + side0[1]) / 2 - 0.05;
  const beltY = curve(B.keys.belt)(seatX);
  const cabinLen = Math.max(0.9, (side0[1] - side0[0]) * 0.92);
  const zW = skinZAt(loft, seatX, beltY - 0.12) * 0.60;

  // floor so the cabin is not a void
  g.add(box(cabinLen, 0.03, zW * 2.0, cab, seatX, beltY - 0.30, 0));
  // dash
  const dashX = side0[1] - 0.10;
  g.add(box(0.24, 0.12, zW * 1.9, cab, dashX, beltY - 0.10, 0));
  // steering wheel
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.015, 8, 20), cab);
  sw.rotation.y = Math.PI / 2;
  sw.rotation.x = 0.35;
  sw.position.set(dashX - 0.16, beltY - 0.05, zW * 0.5);
  g.add(sw);
  // seats with headrests
  for (const s of [1, -1]) {
    const base = slab(0.34, 0.09, 0.30, 0.05, leather);
    base.geometry.rotateY(Math.PI / 2);
    base.position.set(seatX, beltY - 0.22, s * zW * 0.5);
    g.add(base);
    const back = slab(0.30, 0.09, 0.30, 0.05, leather);
    back.geometry.rotateY(Math.PI / 2);
    back.position.set(seatX - 0.16, beltY - 0.08, s * zW * 0.5);
    back.rotation.z = 0.18;
    g.add(back);
    const hr = slab(0.13, 0.09, 0.17, 0.04, leather);
    hr.geometry.rotateY(Math.PI / 2);
    hr.position.set(seatX - 0.21, beltY + 0.06, s * zW * 0.5);
    g.add(hr);
  }
}

/* ---------- mirrors, sills, aero, exhaust ---------- */
function addHardware(g, loft, B) {
  const trim = MAT.trim();
  const chrome = MAT.chrome();
  const carbon = MAT.carbon();

  // mirrors: a shaped housing on a stalk, with a face
  for (const side of [1, -1]) {
    const zBody = skinZAt(loft, B.mirror.x, B.mirror.y);
    const zc = side * (zBody + 0.085);
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.075, 10), trim);
    stalk.rotation.x = Math.PI / 2;
    stalk.position.set(B.mirror.x, B.mirror.y - 0.005, side * (zBody + 0.038));
    g.add(stalk);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12), trim);
    shell.scale.set(1.5, 0.72, 0.62);
    shell.position.set(B.mirror.x, B.mirror.y + 0.018, zc);
    g.add(shell);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.042, 18), chrome);
    face.position.set(B.mirror.x - 0.055, B.mirror.y + 0.018, zc);
    face.rotation.y = -Math.PI / 2 - side * 0.12;
    g.add(face);
  }

  // rocker sills, hugging the lower flank between the arches
  const sillY = curve(B.keys.sill)(0) + 0.055;
  const sillLen = Math.abs(B.wheels.front - B.wheels.rear) - B.archR * 1.5;
  for (const side of [1, -1]) {
    const z = skinZAt(loft, 0, sillY);
    const sill = slab(sillLen, 0.055, 0.05, 0.018, B.carbonSills ? carbon : MAT.shadowline());
    sill.position.set((B.wheels.front + B.wheels.rear) / 2, sillY, side * (z - 0.012));
    g.add(sill);
  }

  if (B.splitter) {
    const sp = slab(0.36, 0.045, 1.62, 0.02, carbon);
    sp.position.set(B.frontX - 0.20, 0.115, 0);
    g.add(sp);
  }
  if (B.diffuser) {
    const d = slab(0.34, 0.10, 1.42, 0.03, carbon);
    d.position.set(B.rearX + 0.19, 0.155, 0);
    g.add(d);
    const finGeos = [];
    for (const z of [-0.42, -0.14, 0.14, 0.42]) {
      const b = new THREE.BoxGeometry(0.30, 0.085, 0.018);
      b.translate(B.rearX + 0.19, 0.155, z);
      finGeos.push(b);
    }
    g.add(new THREE.Mesh(mergeGeometries(finGeos, false), MAT.trim()));
  }
  if (B.skidPlate) {
    const s = slab(0.26, 0.05, 0.66, 0.02, MAT.brake());
    s.position.set(B.frontX - 0.20, 0.215, 0);
    g.add(s);
  }

  // exhaust tips, recessed into a dark cut-out
  for (const side of [1, -1]) {
    const t = tip(0.052, 0.040, 0.15, chrome);
    t.position.set(B.rearX + 0.03, B.exhaust.y, side * B.exhaust.z);
    g.add(t);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), MAT.shadowline());
    hole.position.set(B.rearX + 0.055, B.exhaust.y, side * B.exhaust.z);
    hole.rotation.y = -Math.PI / 2;
    g.add(hole);
  }
}

/* ---------- wheels ---------- */
function addWheels(g, loft, B) {
  const R = B.wheelR;
  const W = B.wheelW;
  const wheels = [];
  const set = [
    { x: B.wheels.front, steer: 0.075 },
    { x: B.wheels.rear, steer: 0 },
  ];
  for (const s of set) {
    // the fender line is the body at its widest here; the tyre's outer
    // face tucks just inside it so the flare sits over the wheel
    const fender = maxZAt(loft, s.x);
    const zc = fender - W / 2 - 0.018;
    for (const side of [1, -1]) {
      const w = buildWheel(MAT, { R, W, spokes: B.spokes });
      if (side === -1) w.rotation.y = Math.PI;
      w.rotation.y += side * s.steer;
      w.position.set(s.x, R, side * zc);
      g.add(w);
      wheels.push(w);
    }
    // one dark liner spanning both flanks, so the arch gap reads black
    const lin = new THREE.Mesh(
      archLiner({ archR: B.archR }, { x: s.x, y: R, halfW: Math.max(0.05, fender - 0.10) }),
      MAT.shadowline()
    );
    g.add(lin);
  }
  g.userData.wheels = wheels;
}

/* ---------- build ---------- */
export function buildCar(key, paintColor) {
  const spec = CARS[key];
  const B = spec.body;
  const paint = makePaintMaterial(paintColor ?? PAINTS[spec.defaultPaint].hex);
  const g = new THREE.Group();

  const loft = buildBodyGeometry(loftSpec(B));

  // crisp feature lines where a car has them, smooth everywhere else
  let skin = loft.geometry;
  try {
    skin = toCreasedNormals(skin.toNonIndexed ? skin : skin, Math.PI * 0.22);
  } catch (e) {
    skin = loft.geometry;
  }
  const bodyMesh = new THREE.Mesh(skin, paint);
  bodyMesh.name = 'bodyshell';
  g.add(bodyMesh);

  addGlass(g, loft, B);
  addShutLines(g, loft, B);
  addLamps(g, loft, B);
  addIntake(g, loft, B);
  addInterior(g, loft, B);
  addHardware(g, loft, B);
  if (spec.extras) spec.extras(g, paint, loft, B);
  addWheels(g, loft, B);

  g.traverse((c) => { if (c.isMesh) c.castShadow = true; });
  g.userData.key = key;
  g.userData.paint = paint;
  g.userData.loft = loft;
  return { group: g, paint, spec };
}

/* ---------- catalogue etchings ----------
   The side profile of each work as an SVG path: the line drawing
   beside the photograph in the catalogue. */
export function profileSVG(key, targetW = 240) {
  const B = CARS[key].body;
  const c = {
    roof: curve(B.keys.roof), sill: curve(B.keys.sill), belt: curve(B.keys.belt),
  };
  const wheels = [
    { x: B.wheels.front, y: B.wheelR },
    { x: B.wheels.rear, y: B.wheelR },
  ];
  const minX = B.rearX - 0.06, maxX = B.frontX + 0.06;
  let maxY = 0;
  for (let x = minX; x <= maxX; x += 0.05) maxY = Math.max(maxY, c.roof(x));
  maxY += 0.08;
  const s = targetW / (maxX - minX);
  const H = maxY * s + 2;
  const X = (x) => ((x - minX) * s).toFixed(1);
  const Y = (y) => (H - y * s).toFixed(1);

  const seg = [];
  // top edge, nose to tail
  seg.push(`M ${X(B.frontX)} ${Y(c.roof(B.frontX))}`);
  for (let x = B.frontX; x >= B.rearX; x -= 0.05) seg.push(`L ${X(x)} ${Y(c.roof(x))}`);
  seg.push(`L ${X(B.rearX)} ${Y(c.sill(B.rearX))}`);
  // bottom edge, tail to nose, arching over the wheels
  const sorted = [...wheels].sort((a, b) => a.x - b.x);
  let cursor = B.rearX;
  for (const w of sorted) {
    const dy = w.y - c.sill(w.x);
    const alpha = Math.asin(Math.min(0.999, Math.max(-0.999, dy / B.archR)));
    const halfW = B.archR * Math.cos(alpha);
    for (let x = cursor; x <= w.x - halfW; x += 0.05) seg.push(`L ${X(x)} ${Y(c.sill(x))}`);
    const r = (B.archR * s).toFixed(1);
    seg.push(`L ${X(w.x - halfW)} ${Y(c.sill(w.x))}`);
    seg.push(`A ${r} ${r} 0 0 0 ${X(w.x + halfW)} ${Y(c.sill(w.x))}`);
    cursor = w.x + halfW;
  }
  for (let x = cursor; x <= B.frontX; x += 0.05) seg.push(`L ${X(x)} ${Y(c.sill(x))}`);
  seg.push('Z');

  // the greenhouse, as a second stroke
  let canopy = '';
  if (B.glass) {
    const x0 = B.glass.rear ? B.glass.rear[0] : B.glass.side[0];
    const x1 = B.glass.screen[1];
    const cs = [];
    cs.push(`M ${X(x1)} ${Y(c.belt(x1))}`);
    for (let x = x1; x >= x0; x -= 0.05) cs.push(`L ${X(x)} ${Y(c.roof(x))}`);
    for (let x = x0; x <= x1; x += 0.05) cs.push(`L ${X(x)} ${Y(c.belt(x))}`);
    cs.push('Z');
    canopy = cs.join(' ');
  }

  return { viewBox: `0 0 ${targetW} ${Math.ceil(H)}`, body: seg.join(' '), canopy };
}
