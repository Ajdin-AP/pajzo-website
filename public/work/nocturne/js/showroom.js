/* ============================================================
   showroom.js — Room I, the gallery itself.
   One work under one tungsten light, on a travertine plinth,
   doubled in black polished stone. Model switches are staged
   as unveilings: the light dims, the work sinks, true dark,
   the next silhouette rises as the tungsten warms back up.
   ============================================================ */
import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';
import { Reflector } from '../vendor/Reflector.js';
import { CARS, CAR_KEYS, PAINTS, buildCar } from './cars.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TUNGSTEN = 0xffd9a0;
const PLINTH_H = 0.22;

const canvas = document.getElementById('stage');
const progress = (p) =>
  dispatchEvent(new CustomEvent('nocturne:progress', { detail: { p } }));

/* ---------- renderer / scene / camera ---------- */
function bootFailure(err) {
  canvas.style.display = 'none';
  dispatchEvent(new CustomEvent('nocturne:ready', { detail: { stills: {}, failed: true } }));
  throw err;
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (err) {
  bootFailure(err); // no WebGL: dismiss the loader, the text rooms still work
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0908);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.25;
progress(0.15);

const camera = new THREE.PerspectiveCamera(32, 2, 0.1, 80);
camera.position.set(4.7, 1.45, 4.35);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.95, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.045;
controls.minDistance = 3.5;
controls.maxDistance = 7.5;
controls.enableZoom = false; // the wheel must scroll the page, not dolly the camera
controls.minPolarAngle = THREE.MathUtils.degToRad(58);
controls.maxPolarAngle = THREE.MathUtils.degToRad(89);
controls.enablePan = false;
controls.autoRotate = !REDUCED;
controls.autoRotateSpeed = -1.05; // ≈ a slow museum walk
let lastTouch = 0;
controls.addEventListener('start', () => {
  controls.autoRotate = false;
  lastTouch = performance.now();
});
controls.addEventListener('end', () => { lastTouch = performance.now(); });
// OrbitControls sets an inline touch-action:none; restore vertical page
// scrolling on touch — horizontal drags rotate, vertical swipes scroll.
canvas.style.touchAction = 'pan-y';

/* ---------- the room ---------- */
// black polished stone: a true planar reflection, dimmed by a
// radial veil so it smears like marble rather than water
const mirror = new Reflector(new THREE.CircleGeometry(16, 64), {
  clipBias: 0.003,
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0x777777,
});
mirror.rotation.x = -Math.PI / 2;
scene.add(mirror);

function radialVeilTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  g.addColorStop(0, 'rgba(10,9,8,0.62)');
  g.addColorStop(0.45, 'rgba(10,9,8,0.78)');
  g.addColorStop(0.8, 'rgba(10,9,8,0.97)');
  g.addColorStop(1, 'rgba(10,9,8,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(c);
}
const veil = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64),
  new THREE.MeshBasicMaterial({
    map: radialVeilTexture(),
    transparent: true,
    depthWrite: false,
  })
);
veil.rotation.x = -Math.PI / 2;
veil.position.y = 0.004;
scene.add(veil);

// travertine plinth with a brass edge
const plinth = new THREE.Group();
const plinthTop = new THREE.Mesh(
  new THREE.BoxGeometry(5.7, PLINTH_H, 2.7),
  new THREE.MeshStandardMaterial({ color: 0x27211a, roughness: 0.85, metalness: 0.05 })
);
plinthTop.position.y = PLINTH_H / 2;
plinthTop.receiveShadow = true;
plinth.add(plinthTop);
const brassEdge = new THREE.Mesh(
  new THREE.BoxGeometry(5.74, 0.008, 2.74),
  new THREE.MeshStandardMaterial({ color: 0xc6a15b, metalness: 1, roughness: 0.3 })
);
brassEdge.position.y = PLINTH_H - 0.02;
plinth.add(brassEdge);
scene.add(plinth);

/* ---------- the museum rig ---------- */
const key = new THREE.SpotLight(TUNGSTEN, 900, 30, 0.52, 0.45, 1.6);
key.position.set(1.3, 5.1, 1.1);
key.target.position.set(0, 0.4, 0);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.bias = -0.0002;
scene.add(key, key.target);
const KEY_FULL = 900;

const rim = new THREE.DirectionalLight(0x8fa3b8, 0.5);
rim.position.set(-4.5, 2.6, -3.5);
scene.add(rim);

// one persistent sweep light for paint changes (adding/removing lights
// forces shader recompilation, which hitches on first use)
const sweep = new THREE.SpotLight(0xffffff, 0, 20, 0.35, 0.6, 2);
sweep.position.set(2.5, 3.4, 1.6);
sweep.target.position.set(2.6, 0.9, 0);
scene.add(sweep, sweep.target);

const amb = new THREE.AmbientLight(0x1a1512, 0.55);
scene.add(amb);

// the visible cone of light — the light itself is an object
function coneGradientTexture() {
  const c = document.createElement('canvas');
  c.width = 1; c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, 'rgba(255,217,160,0.55)');
  g.addColorStop(0.55, 'rgba(255,217,160,0.16)');
  g.addColorStop(1, 'rgba(255,217,160,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1, 128);
  return new THREE.CanvasTexture(c);
}
const cone = new THREE.Mesh(
  new THREE.CylinderGeometry(0.22, 3.1, 4.9, 48, 1, true),
  new THREE.MeshBasicMaterial({
    map: coneGradientTexture(),
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
);
cone.position.set(1.3 * 0.24, 2.62, 1.1 * 0.24); // leans with the key light
cone.rotation.z = 0.05;
scene.add(cone);
const CONE_FULL = 0.34;

// dust drifting in the beam
const dust = (() => {
  const N = 130;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const y = Math.random() * 4.4 + 0.3;
    const r = THREE.MathUtils.lerp(3.0, 0.25, y / 4.9) * Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r + 0.3;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r + 0.26;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: TUNGSTEN,
    size: 0.016,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
})();

// lamplight pools on the floor ahead of the car
function poolTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 64, 4, 128, 64, 120);
  g.addColorStop(0, 'rgba(255,217,160,0.75)');
  g.addColorStop(1, 'rgba(255,217,160,0)');
  ctx.fillStyle = g;
  ctx.save(); ctx.translate(128, 64); ctx.scale(1, 0.5); ctx.translate(-128, -64);
  ctx.fillRect(0, 0, 256, 128);
  ctx.restore();
  return new THREE.CanvasTexture(c);
}
const pools = new THREE.Group();
for (const z of [0.52, -0.52]) {
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 1.5),
    new THREE.MeshBasicMaterial({
      map: poolTexture(),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.rotation.z = -Math.PI / 2;
  pool.position.set(4.1, 0.012, z);
  pools.add(pool);
}
scene.add(pools);

/* ---------- the works ---------- */
const works = {};
let currentKey = 'vermilion';
let lamplight = false;

function headlights(k) {
  let m = null;
  works[k].group.traverse((c) => { if (c.name === 'headlights') m = c.material; });
  return m;
}

/* ---------- tween engine ---------- */
const tweens = [];
const easeIO = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function tween(dur, fn, done, tag) {
  tweens.push({ t0: performance.now(), dur, fn, done, ease: easeIO, tag });
}
function cancelTweens(tag) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    if (tweens[i].tag === tag) tweens.splice(i, 1);
  }
}
function runTweens(now) {
  // oldest first, so the most recently started tween wins write conflicts
  const finished = [];
  for (let i = 0; i < tweens.length; i++) {
    const tw = tweens[i];
    const k = Math.min(1, (now - tw.t0) / tw.dur);
    tw.fn(tw.ease(k));
    if (k >= 1) finished.push(i);
  }
  for (let i = finished.length - 1; i >= 0; i--) {
    const [tw] = tweens.splice(finished[i], 1);
    tw.done && tw.done();
  }
}

/* ---------- rituals ---------- */
let switching = false;

function announce(key) {
  dispatchEvent(new CustomEvent('nocturne:work', {
    detail: { key, spec: CARS[key], paintIndex: works[key].paintIndex },
  }));
}

function flickerLamps(k, then) {
  const m = headlights(k);
  if (!m) return then && then();
  const seq = [3.2, 0.35, 2.6, 0.35, 3.2];
  let i = 0;
  const step = () => {
    if (i >= seq.length) return then && then();
    m.emissiveIntensity = seq[i++];
    setTimeout(step, 70 + Math.random() * 60);
  };
  step();
}

function selectWork(key) {
  if (switching || key === currentKey || !CARS[key]) return;
  switching = true;
  const oldKey = currentKey;
  currentKey = key;

  if (REDUCED) {
    scene.remove(works[oldKey].group);
    works[key].group.position.y = PLINTH_H;
    scene.add(works[key].group);
    applyLamplight(lamplight, true);
    announce(key);
    switching = false;
    return;
  }

  // 1 — the light dims
  tween(500, (t) => {
    key_dim(1 - t);
  }, () => {
    scene.remove(works[oldKey].group);
    works[oldKey].group.position.y = PLINTH_H;
    // 2 — true dark
    setTimeout(() => {
      const g = works[key].group;
      g.position.y = PLINTH_H - 0.14;
      scene.add(g);
      applyLamplight(false, true);
      announce(key);
      // 3 — the new silhouette rises as the tungsten warms
      tween(900, (t) => {
        key_dim(t);
        g.position.y = PLINTH_H - 0.14 * (1 - t);
      }, () => {
        flickerLamps(key, () => {
          applyLamplight(lamplight, true);
          switching = false;
        });
      });
    }, 300);
  });
}

function key_dim(f) {
  key.intensity = KEY_FULL * f;
  cone.material.opacity = CONE_FULL * f;
  dust.material.opacity = 0.5 * f;
  rim.intensity = 0.5 * (0.25 + 0.75 * f);
}

/* Where the paint-change lean should return the camera to; null when no lean
   is in flight. See selectPaint(). */
let camHome = null;

function selectPaint(idx) {
  const w = works[currentKey];
  if (idx === w.paintIndex || !PAINTS[idx]) return;
  w.paintIndex = idx;
  cancelTweens('paint'); // rapid chip clicks must not fight over the color
  const from = w.paint.color.clone();
  const to = new THREE.Color(PAINTS[idx].hex);
  const dur = REDUCED ? 1 : 600;

  // the finish follows the light: a specular sweep travels nose → tail
  tween(dur, (t) => {
    w.paint.color.lerpColors(from, to, t);
    sweep.intensity = 260 * Math.sin(t * Math.PI);
    sweep.target.position.x = THREE.MathUtils.lerp(2.6, -2.6, t);
  }, () => { sweep.intensity = 0; }, 'paint');

  // A conservator's step toward the rear haunch, where clearcoat reads best,
  // and then back again. It used to be one way: every chip click left the
  // camera 0.15 nearer than the one before, so trying the five lacquers in
  // turn walked you steadily into the car with no way back out.
  //
  // `camHome` is the position to return to. It is captured on the first click
  // of a run and only released when a lean finishes, so a rapid series of
  // clicks — each cancelling the last mid-lean — still returns to where the
  // run began rather than settling wherever it was interrupted.
  if (!REDUCED) {
    cancelTweens('cam');
    if (!camHome) camHome = camera.position.clone();
    const home = camHome.clone();
    const step = home.clone().sub(controls.target).normalize().multiplyScalar(0.15);
    tween(dur, (t) => {
      // in and back out over the sweep, so the ends meet exactly
      camera.position.copy(home).addScaledVector(step, -Math.sin(t * Math.PI));
    }, () => {
      camera.position.copy(home);
      camHome = null;
    }, 'cam');
  }

  dispatchEvent(new CustomEvent('nocturne:paint', {
    detail: { index: idx, paint: PAINTS[idx] },
  }));
}

function applyLamplight(on, instant) {
  const m = headlights(currentKey);
  if (!m) return;
  const targetEmissive = on ? 3.2 : 0.35;
  const targetPool = on ? 0.5 : 0;
  if (instant || REDUCED) {
    m.emissiveIntensity = targetEmissive;
    pools.children.forEach((p) => { p.material.opacity = targetPool; });
    return;
  }
  const e0 = m.emissiveIntensity;
  const p0 = pools.children[0].material.opacity;
  tween(420, (t) => {
    m.emissiveIntensity = THREE.MathUtils.lerp(e0, targetEmissive, t);
    pools.children.forEach((p) => {
      p.material.opacity = THREE.MathUtils.lerp(p0, targetPool, t);
    });
  });
}

function setLamplight(on) {
  lamplight = on;
  applyLamplight(on, false);
}

/* ---------- sightlines ---------- */
const SIGHTLINES = [
  { pos: [4.7, 1.45, 4.35], tgt: [0, 0.95, 0] },    // three-quarter
  { pos: [0.02, 1.1, 6.1], tgt: [0, 0.9, 0] },      // the profile
  { pos: [-3.6, 1.1, 2.85], tgt: [-1.3, 0.85, 0] }, // the detail (≥ minDistance)
];
function sightline(i) {
  const s = SIGHTLINES[i];
  if (!s) return;
  controls.autoRotate = false;
  lastTouch = performance.now();
  cancelTweens('cam');
  // this move owns the camera now; a lean interrupted by it must not later
  // pull the view back to where that lean started
  camHome = null;
  const p0 = camera.position.clone();
  const t0 = controls.target.clone();
  const p1 = new THREE.Vector3(...s.pos);
  const t1 = new THREE.Vector3(...s.tgt);
  tween(REDUCED ? 1 : 1200, (t) => {
    camera.position.lerpVectors(p0, p1, t);
    controls.target.lerpVectors(t0, t1, t);
  }, null, 'cam');
}

/* ---------- catalogue plates (offscreen renders) ---------- */
function renderPlates() {
  const stills = {};
  const W = 1120, H = 700;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.fov = 32; // catalogue stills always use the long lens
  camera.updateProjectionMatrix();
  const savedPos = camera.position.clone();
  const savedTgt = controls.target.clone();
  const active = works[currentKey].group;
  scene.remove(active);

  const POSES = {
    vermilion: { pos: [4.9, 1.5, 4.4], tgt: [0, 0.85, 0] },
    basalt: { pos: [-4.6, 1.35, 4.6], tgt: [0, 0.8, 0] },
    citadel: { pos: [5.0, 1.7, 4.3], tgt: [0, 1.0, 0] },
    solstice: { pos: [-4.4, 1.3, 4.7], tgt: [0, 0.75, 0] },
  };

  for (const k of CAR_KEYS) {
    const g = works[k].group;
    g.position.y = PLINTH_H;
    scene.add(g);
    const m = headlights(k);
    if (m) m.emissiveIntensity = 2.4;
    const pose = POSES[k];
    camera.position.set(...pose.pos);
    camera.lookAt(new THREE.Vector3(...pose.tgt));
    renderer.render(scene, camera);
    stills[k] = renderer.domElement.toDataURL('image/jpeg', 0.9);
    if (m) m.emissiveIntensity = 0.35;
    scene.remove(g);
  }

  scene.add(active);
  camera.position.copy(savedPos);
  controls.target.copy(savedTgt);
  resize();
  return stills;
}

/* ---------- resize / loop ---------- */
function resize() {
  const w = canvas.clientWidth || innerWidth;
  const h = canvas.clientHeight || innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // long-lens 32° on wide screens; on narrow/portrait viewports widen the
  // vertical FOV so the horizontal view keeps the whole work in frame
  const hFovRad = THREE.MathUtils.degToRad(46);
  const fitFov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hFovRad / 2) / camera.aspect));
  camera.fov = THREE.MathUtils.clamp(fitFov, 32, 58);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

// the reflection pass is not free: stop rendering while Room I is offscreen
let stageVisible = true;
new IntersectionObserver((entries) => {
  stageVisible = entries[0].isIntersecting;
}).observe(canvas);

let coneBase = CONE_FULL;
renderer.setAnimationLoop((now) => {
  if (!stageVisible) return; // tweens are t0-based; they resume seamlessly

  runTweens(now);

  // the beam breathes, barely
  if (!switching && key.intensity > KEY_FULL * 0.5) {
    cone.material.opacity = coneBase + Math.sin(now * 0.0011) * 0.02;
  }

  // dust falls, slowly
  const dp = dust.geometry.attributes.position;
  for (let i = 0; i < dp.count; i++) {
    let y = dp.getY(i) - 0.0011;
    if (y < 0.15) y = 4.6;
    dp.setY(i, y);
  }
  dp.needsUpdate = true;

  // resume the slow orbit after six seconds of stillness
  if (!REDUCED && !controls.autoRotate && !switching &&
      performance.now() - lastTouch > 6000 && lastTouch > 0) {
    controls.autoRotate = true;
  }

  controls.update();
  renderer.render(scene, camera);
});

/* ---------- boot ----------
   Staged over animation frames so the loader can breathe and so
   main.js (which evaluates after this module) hears every event. */
resize();
const bootQueue = [
  () => progress(0.22),
  ...CAR_KEYS.map((k, i) => () => {
    works[k] = buildCar(k);
    works[k].paintIndex = CARS[k].defaultPaint;
    works[k].group.position.y = PLINTH_H;
    progress(0.3 + i * 0.12);
  }),
  () => {
    scene.add(works[currentKey].group);
    progress(0.82);
  },
  () => {
    const stills = renderPlates();
    window.NOCTURNE = { selectWork, selectPaint, setLamplight, sightline, CARS, PAINTS, CAR_KEYS, _rig: { camera, controls } };
    announce(currentKey);
    dispatchEvent(new CustomEvent('nocturne:ready', { detail: { stills } }));
    progress(1);
  },
];
(function boot() {
  if (!bootQueue.length) return;
  try {
    bootQueue.shift()();
  } catch (err) {
    bootFailure(err); // dismiss the loader even if a boot step dies
  }
  setTimeout(boot, 16); // timer, not rAF: must advance even in background tabs
})();
