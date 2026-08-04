/* ============================================================
   ball.js — procedural 3D basketball engine (Three.js)
   - pebbled-leather + seam textures generated on <canvas>
   - hero stage: 8 seam-bounded panels over a brass core,
     exploded-view, molten seam glow, live colorway retint,
     intro bounce / certification drop, drag-to-rotate
   - offscreen thumbnail renderer for product colorways
   ============================================================ */
import * as THREE from 'three';

/* ---------- tiny seeded PRNG so renders are deterministic ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function shade(hex, f) {
  const { r, g, b } = hexToRgb(hex);
  const c = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

/* ---------- seam paths shared by color / bump / emissive layers ---------- */
function seamPaths(W, H) {
  const paths = [];
  paths.push([[-40, H / 2], [W + 40, H / 2]]);            // equator
  paths.push([[W * 0.25, -40], [W * 0.25, H + 40]]);      // vertical circle
  paths.push([[W * 0.75, -40], [W * 0.75, H + 40]]);
  const tilt = Math.tan(0.96);                            // two tilted great circles
  for (const mirror of [1, -1]) {
    const pts = [];
    for (let px = -8; px <= W + 8; px += 8) {
      const theta = (px / W) * Math.PI * 2 - Math.PI / 2;
      const lat = Math.atan(tilt * Math.sin(theta)) * mirror;
      pts.push([px, H / 2 - (lat / Math.PI) * H]);
    }
    paths.push(pts);
  }
  return paths;
}

function strokePath(ctx, pts, width, style, alpha = 1, blur = 0) {
  ctx.save();
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = alpha;
  if (blur) ctx.filter = `blur(${blur}px)`;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

/* ============================================================
   Texture generation (equirectangular canvases)
   ============================================================ */
export function createBallTextures({
  baseColor = '#C4611F',
  seamColor = '#1A1210',
  glowColor = '#E8621A',
  brandText = '',
  size = 2048,
  seed = 7,
  withEmissive = false,
} = {}) {
  const W = size, H = size / 2;
  const rand = mulberry32(seed);

  const colorCv = document.createElement('canvas');
  colorCv.width = W; colorCv.height = H;
  const cx = colorCv.getContext('2d');
  const bumpCv = document.createElement('canvas');
  bumpCv.width = W; bumpCv.height = H;
  const bx = bumpCv.getContext('2d');

  /* base leather + polar shading */
  cx.fillStyle = baseColor;
  cx.fillRect(0, 0, W, H);
  const vg = cx.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, 'rgba(0,0,0,0.28)');
  vg.addColorStop(0.28, 'rgba(0,0,0,0)');
  vg.addColorStop(0.72, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.28)');
  cx.fillStyle = vg;
  cx.fillRect(0, 0, W, H);

  bx.fillStyle = '#808080';
  bx.fillRect(0, 0, W, H);

  /* pebble grain */
  const pebbles = Math.round(W * H / 210);
  for (let i = 0; i < pebbles; i++) {
    const x = rand() * W, y = rand() * H;
    const r = 0.9 + rand() * (W / 1024) * 1.9;
    const light = rand() > 0.5;
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = light ? shade(baseColor, 1.16) : shade(baseColor, 0.82);
    cx.globalAlpha = 0.16 + rand() * 0.14;
    cx.fill();
    cx.globalAlpha = 1;

    bx.beginPath();
    bx.arc(x, y, r, 0, Math.PI * 2);
    bx.fillStyle = light ? '#a8a8a8' : '#5c5c5c';
    bx.globalAlpha = 0.55;
    bx.fill();
    bx.globalAlpha = 1;
  }

  /* seams */
  const seamW = W / 146;
  const grooveW = seamW * 2.1;
  for (const pts of seamPaths(W, H)) {
    strokePath(cx, pts, grooveW, 'rgba(0,0,0,0.35)', 1, seamW * 0.5);
    strokePath(cx, pts, seamW, seamColor);
    strokePath(bx, pts, grooveW, '#2a2a2a', 1, seamW * 0.4);
    strokePath(bx, pts, seamW, '#000000');
  }

  /* brand stamp */
  if (brandText) {
    cx.save();
    const fs = Math.round(W / 34);
    cx.font = `700 ${fs}px Georgia, serif`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillStyle = 'rgba(0,0,0,0.5)';
    cx.fillText(brandText.toUpperCase(), W * 0.5, H * 0.30);
    cx.font = `400 ${Math.round(fs * 0.4)}px Georgia, serif`;
    cx.fillText('ATELIER NO. 07 — SIZE 7', W * 0.5, H * 0.30 + fs * 0.9);
    cx.restore();
  }

  const map = new THREE.CanvasTexture(colorCv);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bumpCv);

  let emissiveMap = null;
  if (withEmissive) {
    const eCv = document.createElement('canvas');
    eCv.width = W; eCv.height = H;
    const ex = eCv.getContext('2d');
    ex.fillStyle = '#000000';
    ex.fillRect(0, 0, W, H);
    for (const pts of seamPaths(W, H)) {
      strokePath(ex, pts, grooveW * 1.4, glowColor, 0.5, seamW);
      strokePath(ex, pts, seamW, glowColor);
    }
    emissiveMap = new THREE.CanvasTexture(eCv);
    emissiveMap.colorSpace = THREE.SRGBColorSpace;
  }
  return { map, bumpMap, emissiveMap };
}

/* ---------- soft round blob-shadow texture ---------- */
function makeShadowTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(128, 128, 8, 128, 128, 126);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
}

/* ---------- version-safe studio environment (no addons) ---------- */
function buildEnvironment(renderer) {
  const scene = new THREE.Scene();
  const mk = (w, h, color, intensity, x, y, z, rx, ry) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
    );
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    scene.add(m);
  };
  mk(6, 3, '#fff4e2', 5.0, 0, 4, 0, Math.PI / 2, 0);     // warm ceiling softbox
  mk(3, 5, '#ffe9c9', 2.6, -5, 0, 2, 0, Math.PI / 2.5);  // brass key panel
  mk(3, 5, '#dfe6f2', 1.2, 5, 0, -2, 0, -Math.PI / 2.5); // faint cool fill
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(scene, 0.04).texture;
  pmrem.dispose();
  return env;
}

function makeBallMaterial(textures, { withEmissive = false, glowColor = '#E8621A' } = {}) {
  const mat = new THREE.MeshStandardMaterial({
    map: textures.map,
    bumpMap: textures.bumpMap,
    bumpScale: 1.6,
    roughness: 0.68,
    metalness: 0.04,
    envMapIntensity: 0.55,
    transparent: true,
  });
  if (withEmissive && textures.emissiveMap) {
    mat.emissiveMap = textures.emissiveMap;
    mat.emissive = new THREE.Color(glowColor);
    mat.emissiveIntensity = 0;
  }
  return mat;
}

/* museum rig: warm brass key, faint cool fill, molten underlight */
function addMuseumLights(scene, accent, accent2) {
  const key = new THREE.DirectionalLight('#ffe6c4', 2.5);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(accent2 || '#B08D57', 1.7);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const under = new THREE.DirectionalLight(accent || '#E8621A', 0.45);
  under.position.set(0, -4, 2);
  scene.add(under);
  const fill = new THREE.HemisphereLight('#3a3630', '#0a0908', 0.75);
  scene.add(fill);
  return { key, rim, under };
}

/* ============================================================
   Hero stage — full-viewport transparent canvas, choreographed
   from outside via setTarget({fx, fy, scale, spin, opacity,
   shadow}); fx/fy are viewport fractions.
   ============================================================ */
export class BallStage {
  constructor(canvas, { baseColor, seamColor, accent, accent2, brandText } = {}) {
    this.canvas = canvas;
    this.brandColors = { baseColor, seamColor };
    this.brandText = brandText;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    this.camera.position.set(0, 0, 8);

    this.scene.environment = buildEnvironment(this.renderer);
    this.lights = addMuseumLights(this.scene, accent, accent2);
    this.rimBase = this.lights.rim.intensity;

    this.textures = createBallTextures({ baseColor, seamColor, glowColor: accent, brandText, withEmissive: true });
    this.material = makeBallMaterial(this.textures, { withEmissive: true, glowColor: accent });
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.textures.map.anisotropy = maxAniso;
    this.textures.bumpMap.anisotropy = maxAniso;

    /* ball = 8 seam-bounded octant panels around a brass core.
       Partial SphereGeometry emits 0..1 UVs across the patch, so remap
       each octant's UVs into its equirect sub-rectangle to match the
       full-sphere texture layout. */
    this.ballGroup = new THREE.Group();
    this.octants = [];
    for (const thetaStart of [0, Math.PI / 2]) {
      for (let q = 0; q < 4; q++) {
        const phiStart = q * Math.PI / 2, phiLength = Math.PI / 2, thetaLength = Math.PI / 2;
        const geo = new THREE.SphereGeometry(1, 48, 36, phiStart, phiLength, thetaStart, thetaLength);
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
          const u = uv.getX(i), v = uv.getY(i);
          uv.setXY(i,
            (phiStart + u * phiLength) / (Math.PI * 2),
            1 - (thetaStart + (1 - v) * thetaLength) / Math.PI);
        }
        uv.needsUpdate = true;
        geo.computeBoundingBox();
        const dir = new THREE.Vector3();
        geo.boundingBox.getCenter(dir).normalize();
        const mesh = new THREE.Mesh(geo, this.material);
        mesh.userData.dir = dir;
        this.octants.push(mesh);
        this.ballGroup.add(mesh);
      }
    }
    this.core = new THREE.Mesh(
      new THREE.SphereGeometry(0.78, 64, 48),
      new THREE.MeshStandardMaterial({
        color: accent2 || '#B08D57', metalness: 1.0, roughness: 0.22,
        envMapIntensity: 1.3, transparent: true, opacity: 1,
      })
    );
    this.ballGroup.add(this.core);

    /* retint overlay — crossfades a new colorway over the panels */
    this.overlayMat = new THREE.MeshStandardMaterial({
      transparent: true, opacity: 0, roughness: 0.68, metalness: 0.04,
      envMapIntensity: 0.55, bumpMap: this.textures.bumpMap, bumpScale: 1.6,
      depthWrite: false,
    });
    this.overlay = new THREE.Mesh(new THREE.SphereGeometry(1.004, 96, 72), this.overlayMat);
    this.overlay.visible = false;
    this.ballGroup.add(this.overlay);
    /* seed the cache with the original stamped map so revertTint()
       restores the true 2048px texture and no map is ever orphaned */
    this._tintCache = new Map();
    this._tintCache.set(`${baseColor}|${seamColor}`, this.textures.map);
    this._tintFade = 0;          // current overlay opacity
    this._tintTarget = 0;
    this._tintCommit = null;     // texture to commit to panels when fade completes

    this.ballGroup.rotation.z = 0.28;

    this.shadowMat = new THREE.MeshBasicMaterial({
      map: makeShadowTexture(), transparent: true, depthWrite: false, opacity: 0.5,
    });
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), this.shadowMat);
    this.shadow.rotation.x = -Math.PI / 2;

    this.group = new THREE.Group();   // choreography position
    this.inner = new THREE.Group();   // bounce / squash
    this.inner.add(this.ballGroup);
    this.group.add(this.inner);
    this.group.add(this.shadow);
    this.scene.add(this.group);

    this.target = { fx: 0.72, fy: 0.52, scale: 1, spin: 0.35, opacity: 1, shadow: 1 };
    this.current = { ...this.target, opacity: 0 };

    this.pointer = { x: 0, y: 0 };
    this.spinVel = 0;
    this.explode = 0;      // current panel separation 0..1
    this.explodeTarget = 0;
    this.glow = 0;         // seam emissive 0..1
    this.glowTarget = 0;
    this.flareT = 0;

    this.mode = 'intro';
    this.introY = 6;
    this.introVel = 0;
    this.floorY = -1.18;
    this.bounces = 0;
    this.squash = 0;
    this.time = 0;
    this.onImpact = null;

    this.resize();
    this._last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - this._last) / 1000, 0.05);
      this._last = now;
      this.update(dt);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.round(rect.width) || this.canvas.clientWidth || window.innerWidth
      || document.documentElement.clientWidth;
    const h = Math.round(rect.height) || this.canvas.clientHeight || window.innerHeight
      || document.documentElement.clientHeight;
    if (!w || !h) { this._w = 0; this._h = 0; return; } // headless/hidden — retry from update()
    this._w = w; this._h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const dist = this.camera.position.z;
    this.visH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.visW = this.visH * this.camera.aspect;
  }

  worldX(fx) { return (fx - 0.5) * this.visW; }
  worldY(fy) { return (0.5 - fy) * this.visH; }

  setTarget(t) { Object.assign(this.target, t); }
  setPointer(x, y) { this.pointer.x = x; this.pointer.y = y; }
  addSpin(v) { this.spinVel += v; }
  setExplode(t) { this.explodeTarget = THREE.MathUtils.clamp(t, 0, 1); }
  setSeamGlow(t) { this.glowTarget = THREE.MathUtils.clamp(t, 0, 1); }

  /* brief brass rim-light flare + dignified quarter spin (add-to-cart ritual) */
  flare() {
    this.flareT = 1;
    this.addSpin(1.4);
  }

  /* certification drop — gravity fall, squash, cb fires on first contact */
  drop(cb) {
    if (this.mode !== 'idle') { if (cb) cb(); return; }
    this.mode = 'drop';
    this.introY = 3.4;
    this.introVel = 0;
    this.bounces = 0;
    this.onImpact = cb || null;
  }

  kick() {
    if (this.mode === 'idle') { this.mode = 'hop'; this.introVel = 3.4; this.introY = 0; }
  }

  /* live colorway retint with crossfade; textures cached per colorway */
  retint(baseColor, seamColor) {
    const key = `${baseColor}|${seamColor}`;
    let tex = this._tintCache.get(key);
    if (!tex) {
      tex = createBallTextures({ baseColor, seamColor, brandText: this.brandText, size: 1024, seed: 7 }).map;
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      this._tintCache.set(key, tex);
    }
    if (this._tintCommit === tex || (!this._tintCommit && this.material.map === tex)) return;
    this.overlayMat.map = tex;
    this.overlayMat.needsUpdate = true;
    this.overlay.visible = true;
    this._tintFade = 0;
    this.overlayMat.opacity = 0;
    this._tintTarget = 1;
    this._tintCommit = tex;
  }
  revertTint() {
    this.retint(this.brandColors.baseColor, this.brandColors.seamColor);
  }

  /* project an octant's outer surface point to screen pixels (leader lines) */
  screenPoint(i) {
    const oct = this.octants[i];
    if (!oct) return null;
    const v = oct.userData.dir.clone();
    oct.localToWorld(v);
    v.project(this.camera);
    const w = this.canvas.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || innerHeight;
    return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z };
  }

  update(dt) {
    /* self-heal sizing: recover when the canvas gains real dimensions */
    if (!this._w || Math.abs(this.canvas.clientWidth - this._w) > 1) this.resize();
    if (!this._w) return;
    this.time += dt;
    const cur = this.current, tgt = this.target;
    const k = 1 - Math.exp(-4.5 * dt);
    cur.fx += (tgt.fx - cur.fx) * k;
    cur.fy += (tgt.fy - cur.fy) * k;
    cur.scale += (tgt.scale - cur.scale) * k;
    cur.spin += (tgt.spin - cur.spin) * k;
    cur.opacity += (tgt.opacity - cur.opacity) * (1 - Math.exp(-6 * dt));
    cur.shadow += (tgt.shadow - cur.shadow) * k;

    /* bounce physics (intro drop / certification drop / hop) */
    let bounceY = 0;
    if (this.mode === 'intro' || this.mode === 'hop' || this.mode === 'drop') {
      const g = 14;
      this.introVel -= g * dt;
      this.introY += this.introVel * dt;
      if (this.introY <= 0) {
        this.introY = 0;
        if (this.onImpact) { this.onImpact(); this.onImpact = null; }
        this.introVel = -this.introVel * 0.52;
        this.squash = Math.min(0.32, Math.abs(this.introVel) * 0.055);
        this.bounces++;
        if (Math.abs(this.introVel) < 0.9 || this.bounces > 6) {
          this.mode = 'idle'; this.introVel = 0;
        }
      }
      bounceY = this.introY;
    } else {
      bounceY = 0.10 + Math.sin(this.time * 1.2) * 0.10;
    }
    this.squash = Math.max(0, this.squash - dt * 1.6);
    const sq = this.squash;
    this.inner.scale.set(1 + sq * 0.55, 1 - sq, 1 + sq * 0.55);
    this.inner.position.y = this.floorY + 1 + bounceY;

    /* spin — slow bezel cadence + drag inertia decaying over ~2.5s */
    this.spinVel *= Math.exp(-1.3 * dt);
    this.ballGroup.rotation.y += (cur.spin + this.spinVel) * dt;
    this.ballGroup.rotation.x = Math.sin(this.time * 0.35) * 0.05;

    /* heavy-damped parallax — examined, never chasing */
    const px = this.pointer.x, py = this.pointer.y;
    const kp = 1 - Math.exp(-2.2 * dt);
    this.group.rotation.y += ((px * 0.16) - this.group.rotation.y) * kp;
    this.group.rotation.x += ((-py * 0.10) - this.group.rotation.x) * kp;

    /* exploded view */
    this.explode += (this.explodeTarget - this.explode) * (1 - Math.exp(-5 * dt));
    const sep = this.explode * 0.62;
    for (const oct of this.octants) {
      oct.position.copy(oct.userData.dir).multiplyScalar(sep);
    }
    this.core.material.opacity = this.material.opacity;
    this.overlay.visible = this.explode < 0.02 && (this._tintFade > 0.01 || this._tintTarget > 0);

    /* molten seam glow */
    this.glow += (this.glowTarget - this.glow) * (1 - Math.exp(-5 * dt));
    this.material.emissiveIntensity = this.glow * 1.8;

    /* rim-light flare */
    this.flareT = Math.max(0, this.flareT - dt * 1.8);
    this.lights.rim.intensity = this.rimBase + this.flareT * 3.2;

    /* retint crossfade — paused while the exploded view hides the overlay */
    if ((this._tintTarget > 0 || this._tintFade > 0.01) && this.explode < 0.02) {
      this._tintFade += (this._tintTarget - this._tintFade) * (1 - Math.exp(-7 * dt));
      this.overlayMat.opacity = this._tintFade * this.material.opacity;
      if (this._tintTarget === 1 && this._tintFade > 0.985 && this._tintCommit) {
        this.material.map = this._tintCommit;
        this.material.needsUpdate = true;
        this._tintCommit = null;
        this._tintTarget = 0;
        this._tintFade = 0;
        this.overlayMat.opacity = 0;
      }
    }

    /* place in world */
    this.group.position.x = this.worldX(cur.fx);
    this.group.position.y = this.worldY(cur.fy);
    this.group.scale.setScalar(Math.max(cur.scale, 0.001));

    /* contact shadow */
    this.shadow.position.y = this.floorY - 0.02;
    const lift = Math.min(1, bounceY / 2.2);
    this.shadow.scale.setScalar(1 - lift * 0.45);
    this.shadowMat.opacity = Math.max(0, 0.5 * (1 - lift * 0.75)) * cur.shadow * cur.opacity;

    this.material.opacity = cur.opacity;
    this.canvas.style.opacity = cur.opacity < 0.02 ? '0' : '1';
    if (cur.opacity > 0.01) this.renderer.render(this.scene, this.camera);
  }
}

/* ============================================================
   Product thumbnails — one shared offscreen renderer,
   a ball per colorway, returned as PNG data-URLs.
   ============================================================ */
export function renderProductThumbnails(products, { size = 560, brandText = '' } = {}) {
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(size, size, false);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  camera.position.set(0, 0.25, 4.1);
  camera.lookAt(0, 0, 0);
  scene.environment = buildEnvironment(renderer);
  addMuseumLights(scene, '#E8621A', '#B08D57');

  const geo = new THREE.SphereGeometry(1, 96, 72);
  const ball = new THREE.Mesh(geo);
  scene.add(ball);

  const urls = products.map((p, i) => {
    const textures = createBallTextures({
      baseColor: p.baseColor, seamColor: p.seamColor,
      brandText, size: 1024, seed: 11 + i,
    });
    const mat = makeBallMaterial(textures);
    ball.material = mat;
    ball.rotation.set(0.22, -0.55 + i * 0.5, 0.18);
    renderer.render(scene, camera);
    const url = canvas.toDataURL('image/png');
    textures.map.dispose(); textures.bumpMap.dispose(); mat.dispose();
    return url;
  });

  geo.dispose();
  renderer.dispose();
  return urls;
}
