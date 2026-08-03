/* ============================================================
   wheels.js — a wheel that survives a close-up (NOCTURNE)

   The old wheel was a CylinderGeometry with box "spokes" buried
   inside the tire, so it rendered as a black disc with a dot.

   Here the tire is a revolved cross-section with a real sidewall
   bulge, shoulder radius and tread grooves; the rim has a dished
   spoke face set inside a barrel and flange; and there is a brake
   disc and a machined caliper behind the spokes.

   Built with +Z outboard so the group can be dropped straight onto
   the car and mirrored by rotating 180 degrees about Y.
   ============================================================ */
import * as THREE from 'three';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

/** Revolve a (radius, axial) profile about the wheel axis (+Z). */
function revolve(profile, segments = 44, phiStart = 0, phiLength = Math.PI * 2) {
  const pts = profile.map(([r, a]) => new THREE.Vector2(Math.max(1e-4, r), a));
  const g = new THREE.LatheGeometry(pts, segments, phiStart, phiLength);
  g.rotateX(Math.PI / 2);   // lathe spins about Y; we want the axis on Z
  return g;
}

/* ---------- tire ---------- */
function tireGeometry(R, W) {
  const h = W / 2;
  const tread = R;
  const groove = R * 0.986;
  // radius, axial — inner bead round to outer bead
  const p = [
    [R * 0.64, -h * 0.84],
    [R * 0.74, -h * 0.95],
    [R * 0.86, -h * 1.0],    // sidewall bulge: the widest axial point
    [R * 0.94, -h * 0.97],
    [R * 0.975, -h * 0.88],  // shoulder
    [tread * 0.998, -h * 0.7],
    [tread, -h * 0.55],
    [groove, -h * 0.44],     // circumferential groove
    [tread, -h * 0.33],
    [tread * 1.002, -h * 0.12],
    [groove, 0],             // centre groove
    [tread * 1.002, h * 0.12],
    [tread, h * 0.33],
    [groove, h * 0.44],
    [tread, h * 0.55],
    [tread * 0.998, h * 0.7],
    [R * 0.975, h * 0.88],
    [R * 0.94, h * 0.97],
    [R * 0.86, h * 1.0],
    [R * 0.74, h * 0.95],
    [R * 0.64, h * 0.84],
  ];
  return revolve(p, 64);
}

/* ---------- rim barrel and flanges ---------- */
function barrelGeometry(R, W) {
  const h = W / 2;
  const rim = R * 0.665;      // bead seat
  const p = [
    [rim * 0.99, h * 0.86],   // outboard flange tip
    [rim * 1.03, h * 0.79],
    [rim * 0.95, h * 0.70],   // drop into the barrel
    [rim * 0.90, h * 0.30],
    [rim * 0.905, -h * 0.35],
    [rim * 1.03, -h * 0.79],  // inboard flange
    [rim * 0.99, -h * 0.86],
  ];
  return revolve(p, 56);
}

/* ---------- one spoke, tapered and machined ---------- */
function spokeGeometry(R, W, dishZ) {
  const rIn = R * 0.17;
  const rOut = R * 0.615;
  const wIn = R * 0.062;
  const wOut = R * 0.098;
  const s = new THREE.Shape();
  s.moveTo(rIn, -wIn);
  s.lineTo(rOut * 0.98, -wOut);
  s.quadraticCurveTo(rOut, -wOut * 0.55, rOut, 0);
  s.quadraticCurveTo(rOut, wOut * 0.55, rOut * 0.98, wOut);
  s.lineTo(rIn, wIn);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: R * 0.075,
    bevelEnabled: true,
    bevelThickness: R * 0.014,
    bevelSize: R * 0.014,
    // the spoke's rounded outer end and its bevel are what catch the light on
    // a wheel this close to camera; four segments on the curve left it
    // polygonal and the bevel too abrupt to read as machined
    bevelSegments: 3,
    curveSegments: 9,
    steps: 1,
  });
  g.deleteAttribute('uv');
  // the shape is drawn in XY with the wheel face; move it to the dish plane
  g.translate(0, 0, dishZ - R * 0.075);
  return g;
}

function spokesGeometry(R, W, dishZ, count) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const g = spokeGeometry(R, W, dishZ).clone();
    g.rotateZ((i / count) * Math.PI * 2);
    parts.push(g);
  }
  return mergeGeometries(parts, false);
}

/* ---------- brake disc, hat, caliper ---------- */
function discGeometry(R, W) {
  const h = W / 2;
  const face = -h * 0.02;
  const rOut = R * 0.55, rIn = R * 0.30;
  // a friction ring with chamfered edges
  const p = [
    [rIn, face - 0.011],
    [rOut * 0.97, face - 0.011],
    [rOut, face - 0.006],
    [rOut, face + 0.006],
    [rOut * 0.97, face + 0.011],
    [rIn, face + 0.011],
  ];
  return revolve(p, 48);
}

function hatGeometry(R, W) {
  const h = W / 2;
  const p = [
    [R * 0.12, -h * 0.30],
    [R * 0.30, -h * 0.30],
    [R * 0.30, h * 0.02],
    [R * 0.12, h * 0.05],
  ];
  return revolve(p, 36);
}

function caliperGeometry(R, W) {
  const h = W / 2;
  const face = -h * 0.02;
  const rOut = R * 0.60, rIn = R * 0.40;
  const p = [
    [rIn, face - 0.030],
    [rOut, face - 0.030],
    [rOut, face + 0.030],
    [rIn, face + 0.030],
    [rIn, face - 0.030],
  ];
  // a 46-degree arc, sitting at the trailing edge of the disc
  return revolve(p, 12, Math.PI * 0.18, Math.PI * 0.26);
}

function lugsGeometry(R, W, dishZ) {
  const parts = [];
  const r = R * 0.115;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const g = new THREE.CylinderGeometry(R * 0.026, R * 0.026, R * 0.05, 8);
    g.rotateX(Math.PI / 2);
    g.translate(Math.cos(a) * r, Math.sin(a) * r, dishZ + R * 0.01);
    parts.push(g);
  }
  return mergeGeometries(parts, false);
}

/* ---------- assembly ---------- */
/**
 * @param {object} MAT material factory bag from cars.js
 * @param {object} o   { R, W, spokes }
 */
export function buildWheel(MAT, o) {
  const R = o.R;
  const W = o.W;
  const dishZ = W * 0.30;        // spoke face sits inside the flange
  const g = new THREE.Group();

  const tire = new THREE.Mesh(tireGeometry(R, W), MAT.tire());
  g.add(tire);

  const barrel = new THREE.Mesh(barrelGeometry(R, W), MAT.rimBarrel());
  g.add(barrel);

  const rimMat = MAT.rim();
  const spokes = new THREE.Mesh(spokesGeometry(R, W, dishZ, o.spokes || 10), rimMat);
  g.add(spokes);

  const cap = new THREE.Mesh(
    revolve([[0, dishZ + R * 0.02], [R * 0.115, dishZ + R * 0.022], [R * 0.125, dishZ - R * 0.01],
             [R * 0.125, dishZ - R * 0.05]], 32),
    MAT.chrome()
  );
  g.add(cap);

  const lugs = new THREE.Mesh(lugsGeometry(R, W, dishZ), MAT.chrome());
  g.add(lugs);

  const disc = new THREE.Mesh(discGeometry(R, W), MAT.brake());
  g.add(disc);
  const hat = new THREE.Mesh(hatGeometry(R, W), MAT.trim());
  g.add(hat);
  const caliper = new THREE.Mesh(caliperGeometry(R, W), MAT.brass());
  g.add(caliper);

  g.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = false; } });
  return g;
}
