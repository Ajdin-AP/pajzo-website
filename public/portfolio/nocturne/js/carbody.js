/* ============================================================
   carbody.js — lofted car body surfacing (NOCTURNE)

   The old factory extruded ONE side-silhouette across the width,
   so every car had constant width from nose to tail: a bar of soap.

   Here a body is a LOFT. A set of longitudinal control curves
   (roof, beltline, sill, half-width, roof width, crown) is sampled
   at stations along X; each station builds a closed cross-section
   in the Y-Z plane; the stations are stitched into a quad skin.
   That gives what a car actually has: a narrow nose, shoulders
   that swell over the rear wheels, tumblehome, and a tucked sill.

   Wheel arches are not booleans. Inside each arch circle the
   section is drawn inboard by `archInset`, over a short ramp. The
   ramp's upper edge traces the arch circle on its own, so the
   fender gets a real arch line and a lip crease, the mesh stays
   watertight, and the tire tucks under the flank.

   Cars face +X, up is +Y, width across Z.
   ============================================================ */
import * as THREE from 'three';
import { mergeGeometries, toCreasedNormals } from '../vendor/BufferGeometryUtils.js';

/* ---------- monotone cubic interpolation ----------
   Fritsch–Carlson: a car profile must never overshoot its
   control points, or the bonnet grows a pimple. */
export function curve(keys) {
  const pts = [...keys].sort((a, b) => a[0] - b[0]);
  const n = pts.length;
  if (n === 1) return () => pts[0][1];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const dx = [], dy = [], slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i];
    dy[i] = ys[i + 1] - ys[i];
    slope[i] = dy[i] / dx[i];
  }
  const m = new Array(n);
  m[0] = slope[0];
  m[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = n - 2;
    while (i > 0 && xs[i] > x) i--;
    const h = dx[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t, t3 = t2 * t;
    return (
      ys[i] * (2 * t3 - 3 * t2 + 1) +
      m[i] * h * (t3 - 2 * t2 + t) +
      ys[i + 1] * (-2 * t3 + 3 * t2) +
      m[i + 1] * h * (t3 - t2)
    );
  };
}

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

/* ---------- the cross-section ----------
   Half section (z >= 0) as a rounded polyline through four points:
     A (wSill, sill)  bottom of the flank, tucked under
     B (wBelt, belt)  the widest point: the shoulder
     C (wRoof, roof)  top of the flank, the roof rail
     D (0, roof+crown) the crown, on the centreline
   Rounded at B (shoulder crease) and C (rail), and sampled with a
   FIXED number of points per segment, so ring index j means the
   same feature at every station. That is what lets creases and UV
   columns run cleanly down the length of the car. */

const SEG = { flank: 6, shoulder: 5, tumble: 7, rail: 4, crown: 6 };
export const RING_HALF = SEG.flank + SEG.shoulder + SEG.tumble + SEG.rail + SEG.crown;
/* ring index of the shoulder crease, for the feature-line pass */
export const J_SHOULDER = SEG.flank + Math.floor(SEG.shoulder / 2);
export const J_RAIL = SEG.flank + SEG.shoulder + SEG.tumble + Math.floor(SEG.rail / 2);

function v2(z, y) { return { z, y }; }
function lerpP(a, b, t) { return v2(a.z + (b.z - a.z) * t, a.y + (b.y - a.y) * t); }
function sub(a, b) { return v2(a.z - b.z, a.y - b.y); }
function len(a) { return Math.hypot(a.z, a.y); }

/** quadratic bezier */
function qbez(p0, p1, p2, t) {
  const u = 1 - t;
  return v2(
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y
  );
}

/** Trim distance for a rounded corner at B between A and C. */
function trim(a, b, c, r) {
  const din = sub(b, a), dout = sub(c, b);
  return Math.min(r, len(din) * 0.48, len(dout) * 0.48);
}

export function sectionHalf(p) {
  const A = v2(p.wSill, p.sill);
  const B = v2(p.wBelt, p.belt);
  const C = v2(p.wRoof, p.roof);
  const D = v2(0, p.roof + p.crown);

  const rB = trim(A, B, C, p.rShoulder);
  const rC = trim(B, C, D, p.rRail);

  const dAB = sub(B, A), lAB = len(dAB) || 1e-6;
  const dBC = sub(C, B), lBC = len(dBC) || 1e-6;
  const dCD = sub(D, C), lCD = len(dCD) || 1e-6;

  const B0 = lerpP(B, A, rB / lAB);   // enter shoulder arc
  const B1 = lerpP(B, C, rB / lBC);   // leave shoulder arc
  const C0 = lerpP(C, B, rC / lBC);   // enter rail arc
  const C1 = lerpP(C, D, rC / lCD);   // leave rail arc

  const out = [];
  for (let i = 0; i < SEG.flank; i++) out.push(lerpP(A, B0, i / SEG.flank));
  for (let i = 0; i < SEG.shoulder; i++) out.push(qbez(B0, B, B1, i / SEG.shoulder));
  for (let i = 0; i < SEG.tumble; i++) out.push(lerpP(B1, C0, i / SEG.tumble));
  for (let i = 0; i < SEG.rail; i++) out.push(qbez(C0, C, C1, i / SEG.rail));
  for (let i = 0; i < SEG.crown; i++) out.push(lerpP(C1, D, i / SEG.crown));
  out.push(D);
  return out; // length RING_HALF + 1
}

/* ---------- station list ----------
   Uniform along the length, with extra stations packed across the
   wheel arches so the arch line is smooth, and across the cowl. */
function stations(spec) {
  // the rounded ends are carved out of the authored length, not added to
  // it, so frontX/rearX stay the true extremes of the car
  const rearX = spec.rearX + spec.tailDome;
  const frontX = spec.frontX - spec.noseDome;
  const base = 56;
  const xs = [];
  for (let i = 0; i <= base; i++) xs.push(rearX + ((frontX - rearX) * i) / base);
  const dense = [];
  for (const w of spec.wheels) {
    const r = spec.archR;
    for (let i = -18; i <= 18; i++) dense.push(w.x + (r * 1.14 * i) / 18);
  }
  // guarantee stations at authored features (shut lines, glass edges) so a
  // narrow surface patch always has at least two rows to span
  for (const x of spec.extraStations || []) {
    for (const d of [-0.026, -0.013, 0, 0.013, 0.026]) dense.push(x + d);
  }
  for (const x of dense) if (x > rearX && x < frontX) xs.push(x);
  xs.sort((a, b) => a - b);
  const out = [xs[0]];
  for (const x of xs) if (x - out[out.length - 1] > 0.008) out.push(x);
  if (out[out.length - 1] < frontX - 1e-6) out.push(frontX);
  return out;
}

/* ---------- arch inset ----------
   How far inboard the skin is drawn at (x, y). 1 inside the arch,
   ramping to 0 across `band` just outside it. */
function archFactor(spec, x, y, beltY) {
  let f = 0;
  for (const w of spec.wheels) {
    const d = Math.hypot(x - w.x, y - w.y) / spec.archR;
    const t = smooth(clamp01((1 - d) / spec.archBand));
    if (t > f) f = t;
  }
  // never dent the shoulder: the recess dies out at the beltline, so the
  // flare stays full width and only the flank below it is drawn inboard
  const fade = smooth(clamp01((beltY + 0.03 - y) / 0.12));
  return f * fade;
}

/* ---------- the loft ---------- */
export function buildBodyGeometry(spec) {
  const xs = stations(spec);
  const NS = xs.length;
  const M = RING_HALF + 1;          // samples per half section
  const RING = M * 2 - 1;           // full ring, crown shared

  const f = spec.curves;
  const rows = [];                  // rows[i][k] = {x,y,z} for k in 0..RING-1
  const sills = [];                 // inner sill z per station, for the floor

  for (let i = 0; i < NS; i++) {
    const x = xs[i];
    const wBelt = Math.max(0.03, f.wBelt(x));
    const p = {
      sill: f.sill(x),
      belt: f.belt(x),
      roof: f.roof(x),
      crown: f.crown(x),
      wBelt,
      wRoof: Math.max(0.02, wBelt * f.roofRatio(x)),
      wSill: Math.max(0.02, wBelt * f.tuck(x)),
      rShoulder: spec.rShoulder,
      rRail: spec.rRail,
    };
    const half = sectionHalf(p);

    const row = new Array(RING);
    for (let j = 0; j < M; j++) {
      const s = half[j];
      const inset = spec.archInset * archFactor(spec, x, s.y, p.belt);
      const z = Math.max(0.018, s.z - inset);
      row[j] = { x, y: s.y, z };
      if (j < M - 1) row[RING - 1 - j] = { x, y: s.y, z: -z };
    }
    rows.push(row);
    sills.push(row[0].z);
  }

  /* ---------- rounded ends ----------
     Rather than fan a wide end ring to a single apex (which shades like
     a cone), carry the loft past each end over a quarter-ellipse: the
     ring shrinks toward the tip height while x advances. The result is
     quads with clean normals and a blunt, rounded fascia. */
  const CAPN = 5;
  const capRows = (endRow, dir, dome) => {
    const tipY = endRow.reduce((a, p) => a + p.y, 0) / endRow.length;
    const x0 = endRow[0].x;
    const out = [];
    for (let k = 1; k <= CAPN; k++) {
      const th = (k / CAPN) * (Math.PI / 2);
      const s = Math.max(0.075, Math.cos(th));
      const dx = Math.sin(th) * dome * dir;
      out.push(endRow.map((p) => ({
        x: x0 + dx,
        y: tipY + (p.y - tipY) * s,
        z: p.z * s,
      })));
    }
    return out;
  };
  for (const r of capRows(rows[rows.length - 1], 1, spec.noseDome)) {
    rows.push(r); sills.push(r[0].z);
  }
  for (const r of capRows(rows[0], -1, spec.tailDome)) {
    rows.unshift(r); sills.unshift(r[0].z);
  }
  const NST = rows.length;

  const pos = [], uv = [], idx = [];
  const push = (v, u, vv) => {
    pos.push(v.x, v.y, v.z);
    uv.push(u, vv);
    return pos.length / 3 - 1;
  };

  /* skin */
  const grid = [];
  for (let i = 0; i < NST; i++) {
    const vRow = [];
    const vv = i / (NST - 1);
    for (let k = 0; k < RING; k++) vRow.push(push(rows[i][k], k / (RING - 1), vv));
    grid.push(vRow);
  }
  for (let i = 0; i < NST - 1; i++) {
    for (let k = 0; k < RING - 1; k++) {
      const a = grid[i][k], b = grid[i][k + 1], c = grid[i + 1][k + 1], d = grid[i + 1][k];
      // ring index climbs the flank, station index runs to the nose:
      // wound this way the normals face outward
      idx.push(a, d, c, a, c, b);
    }
  }

  /* underbody floor: a shallow pan between the two sill edges */
  const FW = 6;
  const floorGrid = [];
  for (let i = 0; i < NST; i++) {
    const r = [];
    const zs = sills[i];
    const y = rows[i][0].y;
    for (let t = 0; t <= FW; t++) {
      const u = t / FW;
      const z = -zs + 2 * zs * u;
      // lift the centre so the pan is not a flat plate in the reflection
      const lift = spec.floorLift * Math.min(1, zs / 0.40)
        * (1 - Math.pow(Math.abs(z) / Math.max(zs, 1e-6), 2));
      r.push(push({ x: rows[i][0].x, y: y + lift, z }, u, i / (NST - 1)));
    }
    floorGrid.push(r);
  }
  for (let i = 0; i < NST - 1; i++) {
    for (let t = 0; t < FW; t++) {
      const a = floorGrid[i][t], b = floorGrid[i][t + 1];
      const c = floorGrid[i + 1][t + 1], d = floorGrid[i + 1][t];
      idx.push(a, d, c, a, c, b); // wound to face down
    }
  }

  /* The rounded ends leave a small ring at each tip. Close each with a
     short fan around the loop of skin ring plus floor row, so the tip
     seals against the underbody. These rings are tiny, so the fan is
     never large enough to shade like a cone. */
  const capTip = (i, outward) => {
    const row = rows[i];
    const y0 = row[0].y;
    const zs = sills[i];
    const loop = [];
    for (let k = 0; k < RING; k++) loop.push(row[k]);
    for (let t = 1; t < FW; t++) {
      const u = t / FW;
      const z = -zs + 2 * zs * u;
      const lift = spec.floorLift * Math.min(1, zs / 0.40)
        * (1 - Math.pow(Math.abs(z) / Math.max(zs, 1e-6), 2));
      loop.push({ x: row[0].x, y: y0 + lift, z });
    }
    let cy = 0;
    for (const p of loop) cy += p.y;
    cy /= loop.length;
    const centre = push({ x: row[0].x, y: cy, z: 0 }, 0.5, outward > 0 ? 1 : 0);
    const ring = loop.map((p, k) => push(p, k / (loop.length - 1), outward > 0 ? 1 : 0));
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length];
      if (outward > 0) idx.push(centre, a, b);
      else idx.push(centre, b, a);
    }
  };
  capTip(NST - 1, 1);
  capTip(0, -1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  // xs must track rows, which now include the rounded end stations
  const xsAll = rows.map((r) => r[0].x);
  return { geometry: geo, rows, xs: xsAll, RING, M };
}

/* ---------- glass, as a patch of the same surface ----------
   Offsetting a sub-rectangle of the loft outward along its own
   normal guarantees the glazing sits on the body exactly, and the
   painted skin left uncovered becomes the pillars. */
export function mirrorJ(RING, j) { return RING - 1 - j; }

/** widest half-width of the skin at station x — the fender line. */
export function maxZAt(loft, x) {
  const { rows, xs, M } = loft;
  let best = 0, bd = Infinity;
  for (let i = 0; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x);
    if (d < bd) { bd = d; best = i; }
  }
  let z = 0;
  for (let j = 0; j < M; j++) z = Math.max(z, rows[best][j].z);
  return z;
}

/** Half-width of one row at height y. */
function rowZAt(row, M, y) {
  let z = 0;
  for (let j = 0; j < M - 1; j++) {
    const a = row[j], b = row[j + 1];
    const lo = Math.min(a.y, b.y), hi = Math.max(a.y, b.y);
    if (y >= lo && y <= hi) {
      const t = hi - lo < 1e-6 ? 0 : (y - a.y) / (b.y - a.y);
      z = Math.max(z, a.z + (b.z - a.z) * t);
    }
  }
  return z;
}

/** Deck height at (x, zTarget) on the +z flank — for standing parts such as
    wing struts and roof rails on the surface instead of floating above it. */
export function skinYAt(loft, x, zTarget) {
  const { rows, xs, M } = loft;
  let best = 0, bd = Infinity;
  for (let i = 0; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x);
    if (d < bd) { bd = d; best = i; }
  }
  const row = rows[best];
  let y = -Infinity;
  const z = Math.abs(zTarget);
  for (let j = 0; j < M - 1; j++) {
    const a = row[j], b = row[j + 1];
    const lo = Math.min(a.z, b.z), hi = Math.max(a.z, b.z);
    if (z >= lo && z <= hi) {
      const t = Math.abs(b.z - a.z) < 1e-6 ? 0 : (z - a.z) / (b.z - a.z);
      y = Math.max(y, a.y + (b.y - a.y) * t);
    }
  }
  return y === -Infinity ? row[M - 1].y : y;
}

/** The x where the fascia is still at least `zTarget` wide at height y.
    `dir` 1 searches from the nose back, -1 from the tail forward. Used to
    seat lamps and grilles on the curved end panels instead of guessing. */
export function surfaceXAt(loft, y, zTarget, dir) {
  const { rows, M } = loft;
  const n = rows.length;
  for (let k = 0; k < n; k++) {
    const i = dir > 0 ? n - 1 - k : k;
    if (rowZAt(rows[i], M, y) >= zTarget) return rows[i][0].x;
  }
  return rows[dir > 0 ? n - 1 : 0][0].x;
}

/** z of the skin at (x, y) on the +z flank — for placing hardware on the surface. */
export function skinZAt(loft, x, y) {
  const { rows, xs, M } = loft;
  let best = 0, bd = Infinity;
  for (let i = 0; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x);
    if (d < bd) { bd = d; best = i; }
  }
  const row = rows[best];
  let z = 0.02;
  for (let j = 0; j < M - 1; j++) {
    const a = row[j], b = row[j + 1];
    const lo = Math.min(a.y, b.y), hi = Math.max(a.y, b.y);
    if (y >= lo && y <= hi) {
      const t = hi - lo < 1e-6 ? 0 : (y - a.y) / (b.y - a.y);
      z = Math.max(z, a.z + (b.z - a.z) * t);
    }
  }
  return z;
}

export function surfacePatch(loft, xRange, jFrom, jTo, offset) {
  const { rows, xs, RING } = loft;
  const iList = [];
  for (let i = 0; i < xs.length; i++) if (xs[i] >= xRange[0] && xs[i] <= xRange[1]) iList.push(i);
  if (iList.length < 2) return null;

  const pos = [], uv = [], idx = [];

  const norm = (i, j) => {
    // approximate normal from neighbours in the ring/station grid
    const r = rows[i];
    const jm = Math.max(0, j - 1), jp = Math.min(RING - 1, j + 1);
    const im = Math.max(0, i - 1), ip = Math.min(xs.length - 1, i + 1);
    const a = new THREE.Vector3(r[jp].x - r[jm].x, r[jp].y - r[jm].y, r[jp].z - r[jm].z);
    const b = new THREE.Vector3(
      rows[ip][j].x - rows[im][j].x, rows[ip][j].y - rows[im][j].y, rows[ip][j].z - rows[im][j].z
    );
    // station x ring gives the outward normal, matching the skin winding
    return b.cross(a).normalize();
  };

  const emit = (jA, jB) => {
    const grid = [];
    for (const i of iList) {
      const r = [];
      for (let j = jA; j <= jB; j++) {
        const p = rows[i][j];
        const n = norm(i, j);
        pos.push(p.x + n.x * offset, p.y + n.y * offset, p.z + n.z * offset);
        uv.push((j - jA) / Math.max(1, jB - jA), (i - iList[0]) / Math.max(1, iList.length - 1));
        r.push(pos.length / 3 - 1);
      }
      grid.push(r);
    }
    for (let a = 0; a < grid.length - 1; a++) {
      for (let b = 0; b < grid[a].length - 1; b++) {
        idx.push(grid[a][b], grid[a][b + 1], grid[a + 1][b + 1],
                 grid[a][b], grid[a + 1][b + 1], grid[a + 1][b]);
      }
    }
  };

  emit(Math.max(0, jFrom), Math.min(RING - 1, jTo));

  if (!idx.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* ---------- arch liner ----------
   A dark half-tube just inboard of the fender opening, so the gap
   between lip and tire reads black instead of showing paint. */
export function archLiner(spec, w) {
  const R = spec.archR - 0.012;
  const halfW = w.halfW;
  const pos = [], idx = [];
  const NA = 22;
  const a0 = Math.PI * 0.02, a1 = Math.PI * 0.98;
  for (let i = 0; i <= NA; i++) {
    const a = a0 + (a1 - a0) * (i / NA);
    const y = w.y + Math.sin(a) * R;
    const x = w.x + Math.cos(a) * R;
    pos.push(x, y, -halfW, x, y, halfW);
  }
  for (let i = 0; i < NA; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, c, d, a, d, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export { mergeGeometries, toCreasedNormals };
