/* ============================================================
   cars.js — procedural stylized car factory (NOCTURNE works)
   Cars face +X, up is +Y, extruded across Z (width).
   Each body is an extruded side-silhouette: the drawn profile
   is the fattest mid-section (bevelOffset = -bevelSize), so
   arches keep their size and flanks tuck inward like sheetmetal.
   ============================================================ */
import * as THREE from 'three';
import { mergeVertices } from '../vendor/BufferGeometryUtils.js';

export const BRASS = 0xc6a15b;

/* The five lacquers of the collection (brief: Room I chips) */
export const PAINTS = [
  { name: 'Oxblood Lacquer', hex: 0x5a1e1c, css: '#5A1E1C' },
  { name: 'Basalt Grey', hex: 0x43464a, css: '#43464A' },
  { name: 'Ivory Gesso', hex: 0xe8e2d2, css: '#E8E2D2' },
  { name: 'Viridian Racing', hex: 0x1e4d40, css: '#1E4D40' },
  { name: 'Midnight Anodine', hex: 0x10131c, css: '#10131C' },
];

/* ---------- materials ---------- */
export function makePaintMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.85,
    roughness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.2,
  });
}

const MAT = {
  glass: () => new THREE.MeshPhysicalMaterial({
    color: 0x05070c, metalness: 0.6, roughness: 0.05,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.7,
  }),
  trim: () => new THREE.MeshStandardMaterial({
    color: 0x0a0b0e, metalness: 0.35, roughness: 0.55,
  }),
  chrome: () => new THREE.MeshStandardMaterial({
    color: 0xd8dce2, metalness: 1.0, roughness: 0.18,
  }),
  brass: () => new THREE.MeshStandardMaterial({
    color: BRASS, metalness: 1.0, roughness: 0.32,
  }),
  tire: () => new THREE.MeshStandardMaterial({
    color: 0x0b0c0d, metalness: 0.0, roughness: 0.92,
  }),
  rim: () => new THREE.MeshStandardMaterial({
    color: 0x777d86, metalness: 1.0, roughness: 0.22,
  }),
  brake: () => new THREE.MeshStandardMaterial({
    color: 0x6e737b, metalness: 0.9, roughness: 0.4,
  }),
  headlight: () => new THREE.MeshStandardMaterial({
    color: 0xdfe8f5, metalness: 0.1, roughness: 0.2,
    emissive: 0xffd9a0, emissiveIntensity: 0.35, // idle; LAMPLIGHT raises it
  }),
  taillight: () => new THREE.MeshStandardMaterial({
    color: 0x2c0508, metalness: 0.2, roughness: 0.25,
    emissive: 0xff2028, emissiveIntensity: 1.4,
  }),
  cabin: () => new THREE.MeshStandardMaterial({
    color: 0x131417, metalness: 0.1, roughness: 0.85,
  }),
};

/* ---------- geometry helpers ---------- */

/** Append a rounded polyline through pts ({x,y,r}) to a shape/path. */
function roundedPath(shape, pts, moveFirst) {
  const v = (a, b) => new THREE.Vector2(b.x - a.x, b.y - a.y);
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const r = p.r || 0;
    if (i === 0) {
      if (moveFirst) shape.moveTo(p.x, p.y); else shape.lineTo(p.x, p.y);
      continue;
    }
    if (i === pts.length - 1 || !r) {
      shape.lineTo(p.x, p.y);
      continue;
    }
    const prev = pts[i - 1], next = pts[i + 1];
    const din = v(prev, p), dout = v(p, next);
    const rr = Math.min(r, din.length() * 0.5, dout.length() * 0.5);
    din.normalize(); dout.normalize();
    shape.lineTo(p.x - din.x * rr, p.y - din.y * rr);
    shape.quadraticCurveTo(p.x, p.y, p.x + dout.x * rr, p.y + dout.y * rr);
  }
}

/** Pontoon body shape: top silhouette + bottom edge with wheel arches. */
function bodyShape(geo) {
  const { top, bottomY, frontX, rearX, arches } = geo;
  const shape = new THREE.Shape();
  roundedPath(shape, [{ x: frontX, y: bottomY, r: 0.1 }, ...top, { x: rearX, y: bottomY, r: 0.1 }], true);
  const sorted = [...arches].sort((a, b) => a.x - b.x); // rear (-x) first
  for (const arch of sorted) {
    const dy = arch.cy - bottomY;
    const alpha = Math.asin(Math.min(0.999, Math.max(-0.999, dy / arch.r)));
    const halfW = arch.r * Math.cos(alpha);
    shape.lineTo(arch.x - halfW, bottomY);
    shape.absarc(arch.x, arch.cy, arch.r, Math.PI + alpha, -alpha, true);
  }
  shape.lineTo(frontX, bottomY);
  shape.closePath();
  return shape;
}

/** Extrude a shape across the car width. Drawn profile = mid-section. */
function extrudeAcross(shape, width, bevel, quality = 6) {
  const bt = bevel;
  const bs = bevel * 0.8;
  const depth = Math.max(0.05, width - bt * 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bt,
    bevelSize: bs,
    bevelSegments: quality,
    curveSegments: 24,
    steps: 1,
  });
  geo.deleteAttribute('uv');
  const merged = mergeVertices(geo, 1e-4);
  merged.computeVertexNormals();
  merged.translate(0, 0, -depth / 2);
  return merged;
}

/* ---------- wheels ---------- */
function buildWheel(radius, width) {
  const wheel = new THREE.Group();
  const rimR = radius * 0.68;

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 48),
    MAT.tire()
  );
  tire.rotation.x = Math.PI / 2;
  wheel.add(tire);

  // outer rim lip
  const lip = new THREE.Mesh(
    new THREE.TorusGeometry(rimR * 0.98, width * 0.07, 12, 48),
    MAT.rim()
  );
  lip.position.z = width * 0.44;
  wheel.add(lip);

  // dark barrel + brake disc behind the spokes
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(rimR * 0.94, rimR * 0.94, width * 0.44, 36),
    MAT.trim()
  );
  barrel.rotation.x = Math.PI / 2;
  wheel.add(barrel);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(rimR * 0.74, rimR * 0.74, width * 0.5, 36),
    MAT.brake()
  );
  disc.rotation.x = Math.PI / 2;
  wheel.add(disc);

  // brass caliper — the one accent the collection allows itself,
  // sitting in the gap between the disc face and the spokes
  const caliper = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, rimR * 0.5, width * 0.12),
    MAT.brass()
  );
  caliper.position.set(rimR * 0.6, 0, width * 0.27);
  wheel.add(caliper);

  // 10-spoke turbine face (5 through-center bars near the outer lip)
  const spokeMat = MAT.rim();
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(rimR * 1.92, radius * 0.15, width * 0.14),
      spokeMat
    );
    s.rotation.z = (i / 5) * Math.PI;
    s.position.z = width * 0.38;
    wheel.add(s);
  }

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.11, radius * 0.11, width * 0.24, 20),
    MAT.chrome()
  );
  hub.rotation.x = Math.PI / 2;
  hub.position.z = width * 0.4;
  wheel.add(hub);
  return wheel;
}

/* ---------- small helpers ---------- */
function box(w, h, d, mat, x, y, z, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.z = rz;
  return m;
}

/* ============================================================
   THE COLLECTION — four works
   geo.top: front-bottom → nose → beltline → tail (mid-section)
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
    geo: {
      W: 1.92, bevel: 0.115, bottomY: 0.15, frontX: 2.32, rearX: -2.3,
      wheelR: 0.36, fw: 1.5, rw: -1.44,
      top: [
        { x: 2.37, y: 0.5, r: 0.16 },
        { x: 2.22, y: 0.72, r: 0.22 },
        { x: 0.55, y: 0.86, r: 0.4 },
        { x: -1.2, y: 0.92, r: 0.45 },
        { x: -2.05, y: 0.88, r: 0.12 },
        { x: -2.3, y: 0.78, r: 0.07 },
        { x: -2.36, y: 0.48, r: 0.1 },
      ],
      canopy: [
        { x: 0.55, y: 0.84 },
        { x: -0.1, y: 1.3, r: 0.5 },
        { x: -0.85, y: 1.28, r: 0.35 },
        { x: -1.98, y: 0.9, r: 0.18 },
        { x: -0.6, y: 0.84, r: 0.05 },
        { x: 0.55, y: 0.8 },
      ],
      canopyW: 0.8,
      details: {
        noseX: 2.31, noseY: 0.6, tailX: -2.33, tailY: 0.6,
        intakeX: 2.34, intakeY: 0.3,
        mirrorX: 0.42, mirrorY: 0.92, diffuser: true, headW: 0.5,
        exhaustY: 0.28,
      },
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
    geo: {
      W: 2.0, bevel: 0.115, bottomY: 0.13, frontX: 2.26, rearX: -2.26,
      wheelR: 0.355, fw: 1.42, rw: -1.42,
      top: [
        { x: 2.3, y: 0.34, r: 0.12 },
        { x: 2.05, y: 0.62, r: 0.25 },
        { x: 1.35, y: 0.8, r: 0.35 },
        { x: 0.6, y: 0.78, r: 0.3 },
        { x: -0.8, y: 0.82, r: 0.3 },
        { x: -1.55, y: 0.96, r: 0.25 },
        { x: -2.1, y: 0.9, r: 0.07 },
        { x: -2.28, y: 0.52, r: 0.08 },
      ],
      canopy: [
        { x: 0.85, y: 0.76 },
        { x: 0.05, y: 1.08, r: 0.55 },
        { x: -0.7, y: 1.04, r: 0.4 },
        { x: -1.45, y: 0.84, r: 0.12 },
        { x: -0.35, y: 0.76, r: 0.05 },
        { x: 0.85, y: 0.72 },
      ],
      canopyW: 0.78,
      details: {
        noseX: 2.18, noseY: 0.48, tailX: -2.19, tailY: 0.72,
        intakeX: 2.27, intakeY: 0.22,
        mirrorX: 0.68, mirrorY: 0.86, splitter: true, diffuser: true,
        headW: 0.52, exhaustY: 0.3,
      },
    },
    extras(g, paint) {
      const trim = MAT.trim();
      // swan-neck rear wing
      g.add(box(0.06, 0.32, 0.05, trim, -1.9, 1.04, 0.5));
      g.add(box(0.06, 0.32, 0.05, trim, -1.9, 1.04, -0.5));
      const blade = box(0.36, 0.045, 1.78, paint, -1.98, 1.22, 0, -0.09);
      g.add(blade);
      g.add(box(0.32, 0.12, 0.02, trim, -1.98, 1.2, 0.89, -0.09));
      g.add(box(0.32, 0.12, 0.02, trim, -1.98, 1.2, -0.89, -0.09));
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
    geo: {
      W: 1.98, bevel: 0.12, bottomY: 0.26, frontX: 2.38, rearX: -2.36,
      wheelR: 0.42, fw: 1.5, rw: -1.46,
      top: [
        { x: 2.44, y: 0.7, r: 0.18 },
        { x: 2.3, y: 0.98, r: 0.25 },
        { x: 0.7, y: 1.12, r: 0.35 },
        { x: -2.15, y: 1.16, r: 0.15 },
        { x: -2.42, y: 0.68, r: 0.14 },
      ],
      canopy: [
        { x: 0.72, y: 1.1 },
        { x: 0.25, y: 1.64, r: 0.35 },
        { x: -1.7, y: 1.6, r: 0.28 },
        { x: -2.15, y: 1.14, r: 0.12 },
        { x: -0.6, y: 1.09, r: 0.05 },
        { x: 0.72, y: 1.06 },
      ],
      canopyW: 0.82,
      details: {
        noseX: 2.37, noseY: 0.84, tailX: -2.27, tailY: 0.95,
        intakeX: 2.4, intakeY: 0.5,
        mirrorX: 0.58, mirrorY: 1.24, skidPlate: true, headW: 0.5,
        exhaustY: 0.34,
      },
    },
    extras(g) {
      const trim = MAT.trim();
      g.add(box(1.6, 0.05, 0.06, trim, -0.7, 1.69, 0.52));
      g.add(box(1.6, 0.05, 0.06, trim, -0.7, 1.69, -0.52));
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
    geo: {
      W: 1.88, bevel: 0.11, bottomY: 0.14, frontX: 2.12, rearX: -2.12,
      wheelR: 0.345, fw: 1.34, rw: -1.3,
      top: [
        { x: 2.17, y: 0.4, r: 0.14 },
        { x: 2.0, y: 0.62, r: 0.2 },
        { x: 1.3, y: 0.78, r: 0.35 },
        { x: 0.45, y: 0.74, r: 0.25 },
        { x: -1.25, y: 0.82, r: 0.3 },
        { x: -1.95, y: 0.76, r: 0.1 },
        { x: -2.16, y: 0.48, r: 0.09 },
      ],
      canopy: null,
      details: {
        noseX: 2.08, noseY: 0.52, tailX: -2.07, tailY: 0.6,
        intakeX: 2.15, intakeY: 0.28,
        mirrorX: 0.48, mirrorY: 0.88, diffuser: true, headW: 0.44,
        exhaustY: 0.26,
      },
    },
    extras(g, paint) {
      // cockpit tub
      const tub = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.28, 1.16), MAT.cabin());
      tub.position.set(-0.32, 0.66, 0);
      g.add(tub);
      // twin humps behind the seats
      const humpGeo = new THREE.SphereGeometry(0.19, 20, 14);
      const humpL = new THREE.Mesh(humpGeo, paint);
      humpL.scale.set(1.6, 0.85, 1.05);
      humpL.position.set(-1.12, 0.78, 0.34);
      g.add(humpL);
      const humpR = humpL.clone();
      humpR.position.z = -0.34;
      g.add(humpR);
      // low windscreen
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.32, 1.2), MAT.glass());
      screen.position.set(0.44, 0.9, 0);
      screen.rotation.z = -0.48;
      g.add(screen);
    },
  },
};

export const CAR_KEYS = Object.keys(CARS);

/* ---------- shared detail pass ---------- */
function addDetails(g, geo) {
  const o = geo.details;
  const W = geo.W;
  const trim = MAT.trim();

  const head = box(0.12, 0.05, W * o.headW, MAT.headlight(), o.noseX, o.noseY, 0);
  head.name = 'headlights';
  g.add(head);

  const tail = box(0.12, 0.05, W * 0.66, MAT.taillight(), o.tailX, o.tailY, 0);
  tail.name = 'taillights';
  g.add(tail);

  // front intake
  g.add(box(0.12, 0.14, W * 0.46, trim, o.intakeX, o.intakeY, 0));

  // mirrors on stalks — small and tight to the flank
  for (const side of [1, -1]) {
    g.add(box(0.025, 0.018, 0.08, trim, o.mirrorX, o.mirrorY, side * (W / 2 + 0.01)));
    g.add(box(0.12, 0.065, 0.05, trim, o.mirrorX, o.mirrorY + 0.03, side * (W / 2 + 0.055)));
  }

  if (o.splitter) g.add(box(0.46, 0.05, W * 0.9, trim, o.noseX - 0.1, 0.08, 0));
  if (o.diffuser) g.add(box(0.4, 0.07, W * 0.78, trim, geo.rearX + 0.12, 0.12, 0));
  if (o.skidPlate) g.add(box(0.34, 0.1, W * 0.44, MAT.chrome(), o.noseX - 0.06, 0.2, 0));

  const exGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.18, 16);
  const exMat = MAT.chrome();
  for (const z of [0.28, -0.28]) {
    const ex = new THREE.Mesh(exGeo, exMat);
    ex.rotation.z = Math.PI / 2;
    ex.position.set(geo.rearX - 0.02, o.exhaustY, z);
    g.add(ex);
  }
}

function addWheels(g, geo) {
  const { wheelR, fw, rw, W } = geo;
  const width = wheelR * 0.62;
  const wheels = [];
  for (const x of [fw, rw]) {
    for (const side of [1, -1]) {
      const w = buildWheel(wheelR, width);
      w.position.set(x, wheelR, side * (W / 2 - width / 2 + 0.04));
      if (side === -1) w.rotation.y = Math.PI;
      g.add(w);
      wheels.push(w);
    }
  }
  g.userData.wheels = wheels;
}

/** Pre-inset the authored profile so that after the outward bevel
    expansion (bs) the fattest mid-section lands on the drawn coords.
    Outward bevels never self-intersect, unlike bevelOffset < 0. */
function insetBody(geo, arches, bs) {
  const L = Math.max(Math.abs(geo.frontX), Math.abs(geo.rearX));
  const fx = 1 - bs / L;
  return {
    top: geo.top.map((p) => ({ ...p, x: p.x * fx, y: p.y - bs })),
    bottomY: geo.bottomY + bs,
    frontX: geo.frontX - bs,
    rearX: geo.rearX + bs,
    arches: arches.map((a) => ({ ...a, r: a.r + bs })),
  };
}

/** Build a complete car. Returns { group, paint, spec } */
export function buildCar(key, paintColor) {
  const spec = CARS[key];
  const geo = spec.geo;
  const paint = makePaintMaterial(
    paintColor ?? PAINTS[spec.defaultPaint].hex
  );
  const g = new THREE.Group();

  const arches = [
    { x: geo.fw, cy: geo.wheelR, r: geo.wheelR + 0.07 },
    { x: geo.rw, cy: geo.wheelR, r: geo.wheelR + 0.07 },
  ];
  const bs = geo.bevel * 0.8;
  const body = new THREE.Mesh(
    extrudeAcross(bodyShape(insetBody(geo, arches, bs)), geo.W, geo.bevel),
    paint
  );
  g.add(body);

  if (geo.canopy) {
    const cShape = new THREE.Shape();
    roundedPath(cShape, geo.canopy, true);
    cShape.closePath();
    const canopy = new THREE.Mesh(
      extrudeAcross(cShape, geo.W * geo.canopyW, 0.075),
      MAT.glass()
    );
    g.add(canopy);
  }

  addDetails(g, geo);
  if (spec.extras) spec.extras(g, paint);
  addWheels(g, geo);

  g.traverse((c) => { if (c.isMesh) c.castShadow = true; });
  g.userData.key = key;
  g.userData.paint = paint;
  return { group: g, paint, spec };
}

/* ---------- catalogue etchings ----------
   The actual side-profile spline of each work, as an SVG path —
   the line drawing beside the photograph in the catalogue. */
export function profileSVG(key, targetW = 240) {
  const geo = CARS[key].geo;
  const arches = [
    { x: geo.fw, cy: geo.wheelR, r: geo.wheelR + 0.07 },
    { x: geo.rw, cy: geo.wheelR, r: geo.wheelR + 0.07 },
  ];
  const allPts = [{ x: geo.frontX, y: geo.bottomY, r: 0.05 }, ...geo.top, { x: geo.rearX, y: geo.bottomY, r: 0.05 }];
  const maxY = Math.max(...geo.top.map(p => p.y), ...(geo.canopy || []).map(p => p.y)) + 0.06;
  const minX = geo.rearX - 0.1, maxX = geo.frontX + 0.12;
  const s = targetW / (maxX - minX);
  const H = maxY * s + 2;
  const X = (x) => ((x - minX) * s).toFixed(1);
  const Y = (y) => (H - y * s).toFixed(1);

  const seg = [];
  const walk = (pts) => {
    const v = (a, b) => ({ x: b.x - a.x, y: b.y - a.y });
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const r = p.r || 0;
      if (i === 0) { seg.push(`M ${X(p.x)} ${Y(p.y)}`); continue; }
      if (i === pts.length - 1 || !r) { seg.push(`L ${X(p.x)} ${Y(p.y)}`); continue; }
      const prev = pts[i - 1], next = pts[i + 1];
      const din = v(prev, p), dout = v(p, next);
      const lin = Math.hypot(din.x, din.y), lout = Math.hypot(dout.x, dout.y);
      const rr = Math.min(r, lin * 0.5, lout * 0.5);
      const a = { x: p.x - (din.x / lin) * rr, y: p.y - (din.y / lin) * rr };
      const b = { x: p.x + (dout.x / lout) * rr, y: p.y + (dout.y / lout) * rr };
      seg.push(`L ${X(a.x)} ${Y(a.y)}`, `Q ${X(p.x)} ${Y(p.y)} ${X(b.x)} ${Y(b.y)}`);
    }
  };
  walk(allPts);
  // bottom edge rear → front, arching over the wheels
  for (const arch of [...arches].sort((a, b) => a.x - b.x)) {
    const dy = arch.cy - geo.bottomY;
    const alpha = Math.asin(Math.min(0.999, dy / arch.r));
    const halfW = arch.r * Math.cos(alpha);
    seg.push(`L ${X(arch.x - halfW)} ${Y(geo.bottomY)}`);
    seg.push(`A ${(arch.r * s).toFixed(1)} ${(arch.r * s).toFixed(1)} 0 1 1 ${X(arch.x + halfW)} ${Y(geo.bottomY)}`);
  }
  seg.push('Z');
  // canopy as a second open stroke
  let canopyPath = '';
  if (geo.canopy) {
    const hold = seg.length;
    walk(geo.canopy.map(p => ({ ...p })));
    canopyPath = seg.splice(hold).join(' ') + ' Z';
  }
  return {
    viewBox: `0 0 ${targetW} ${Math.ceil(H)}`,
    body: seg.join(' '),
    canopy: canopyPath,
  };
}
