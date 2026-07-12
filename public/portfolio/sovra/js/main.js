/* ============================================================
   main.js — SOVRA page behaviour
   preloader · 3D scroll choreography · atelier exploded view ·
   marquee physics · product grid + live retint · ledger cart ·
   guest book · cursor · reveals
   ============================================================ */
import { BallStage, renderProductThumbnails } from './ball.js';
import { BRAND, PRODUCTS, TESTIMONIALS, STATS } from './data.js';

window.__SOVRA_BOOT = true;               // module graph booted — cancel the no-3D watchdog
document.body.classList.remove('no3d');

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isTouch = matchMedia('(pointer: coarse)').matches;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = n => `$${n.toFixed(2).replace(/\.00$/, '')}`;
const clamp01 = v => Math.min(1, Math.max(0, v));
const smooth = t => t * t * (3 - 2 * t);
/* viewport helpers that survive headless/zero-metric environments */
const vpW = () => innerWidth || document.documentElement.clientWidth || 1280;
const vpH = () => innerHeight || document.documentElement.clientHeight || 800;

function roman(n) {
  const table = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, sym] of table) while (n >= v) { out += sym; n -= v; }
  return out || 'I';
}

/* ============================== preloader ============================== */
const preloader = $('#preloader');
const preCount = $('#preloader-count');
(function fakeProgress() {
  const t0 = performance.now();
  const DUR = reducedMotion ? 200 : 1600;
  function tick(now) {
    const p = clamp01((now - t0) / DUR);
    preCount.textContent = String(Math.round(p * 100)).padStart(3, '0');
    if (p < 1) requestAnimationFrame(tick);
    else {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
      setTimeout(() => preloader.remove(), 900);
    }
  }
  requestAnimationFrame(tick);
})();

/* ============================== 3D stage ============================== */
const stage = new BallStage($('#ball-canvas'), {
  baseColor: BRAND.ballColor,
  seamColor: BRAND.ballSeam,
  accent: BRAND.accent,
  accent2: BRAND.accent2,
  brandText: BRAND.name,
});
addEventListener('resize', () => stage.resize());
if (reducedMotion) stage.mode = 'idle';
window.SOVRA = { stage, refresh: () => updateBallFromScroll() }; // debug handle

/* ---------- scroll choreography ---------- */
const atelierEl = $('#atelier');
const captionEl = $('#atelier-caption');
const chapterEls = $$('.atelier-chapters li');
const callouts = [$('#callout-0'), $('#callout-1'), $('#callout-2')];
const leaderSvg = $('#leader-svg');
const CAPTIONS = [
  'Eight panels. One temperament.',
  '3,411 pebbles per panel — laid by algorithm, judged by hand.',
  'Seams set molten. Cooled to black. Sealed for life.',
];
let atelierActive = false;
let atelierBeat = -1;

function sectionAnchor(sel, f = 0) {
  const el = $(sel);
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return scrollY + r.top + r.height * f - vpH() / 2;
}

function ballKeyframes() {
  const hero = isTouch
    ? { fx: 0.5, fy: 0.32, scale: 0.82, spin: 0.35, opacity: 1, shadow: 1 }
    : { fx: 0.70, fy: 0.54, scale: 1.30, spin: 0.35, opacity: 1, shadow: 1 };
  return [
    { y: 0, s: hero },
    { y: sectionAnchor('#marquee', 0.5), s: { fx: isTouch ? 0.5 : 0.28, fy: 0.5, scale: 0.78, spin: 0.9, opacity: 1, shadow: 0 } },
    { y: sectionAnchor('#products', 0.12), s: { fx: 0.22, fy: 0.45, scale: 0.4, spin: 1.6, opacity: 0, shadow: 0 } },
    { y: sectionAnchor('#maisons', 0.5), s: { fx: 0.84, fy: 0.5, scale: 0.42, spin: 0.5, opacity: 0.16, shadow: 0 } },
    { y: sectionAnchor('#provenance', 0.55), s: { fx: 0.5, fy: 0.52, scale: isTouch ? 0.62 : 0.88, spin: 0.3, opacity: 1, shadow: 1 } },
    { y: sectionAnchor('#voices', 0.25), s: { fx: 0.5, fy: 0.35, scale: 0.5, spin: 0.6, opacity: 0, shadow: 0 } },
  ];
}

function atelierProgress() {
  const rect = atelierEl.getBoundingClientRect();
  const vh = vpH();
  const total = rect.height - vh;
  if (rect.height < vh || total <= 0) return -1; // layout not ready
  return -rect.top / total;
}

function updateAtelier(p) {
  /* three beats: explode → macro push → molten seams */
  let explode = 0, glow = 0, scale = isTouch ? 1.05 : 1.62, beat = 0;
  if (p < 0.36) {
    explode = smooth(clamp01((p - 0.04) / 0.26));
    beat = 0;
  } else if (p < 0.66) {
    const t = smooth(clamp01((p - 0.36) / 0.3));
    explode = 1 - t * 0.75;
    scale += t * (isTouch ? 0.4 : 0.8);
    beat = 1;
  } else {
    const t = smooth(clamp01((p - 0.66) / 0.3));
    explode = 0.25 * (1 - t);
    scale += (isTouch ? 0.4 : 0.8) * (1 - t * 0.4);
    glow = t < 0.7 ? t / 0.7 : 1 - (t - 0.7) * 0.9;
    beat = 2;
  }
  stage.setExplode(explode);
  stage.setSeamGlow(glow);
  stage.setTarget({ fx: 0.5, fy: 0.47, scale, spin: 0.22, opacity: 1, shadow: 0 });

  if (beat !== atelierBeat) {
    atelierBeat = beat;
    chapterEls.forEach((li, i) => li.classList.toggle('active', i === beat));
    captionEl.style.opacity = 0;
    setTimeout(() => { captionEl.textContent = CAPTIONS[beat]; captionEl.style.opacity = 1; }, 260);
  }
  const showCallouts = !isTouch && explode > 0.3;
  callouts.forEach(c => c.classList.toggle('show', showCallouts));
  return showCallouts;
}

/* leader lines — re-aimed every frame while callouts visible */
const CALLOUT_POS = [
  { left: 0.70, top: 0.20, oct: 1 },
  { left: 0.76, top: 0.62, oct: 6 },
  { left: 0.30, top: 0.76, oct: -1 }, // -1 = ball core (center)
];
let leaderInit = false;
function initLeaders() {
  leaderInit = true;
  CALLOUT_POS.forEach((c, i) => {
    const el = callouts[i];
    el.style.left = `${c.left * 100}%`;
    el.style.top = `${c.top * 100}%`;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '2.5');
    leaderSvg.append(line, dot);
  });
}
function updateLeaders(show) {
  if (!leaderInit) initLeaders();
  leaderSvg.setAttribute('width', vpW());
  leaderSvg.setAttribute('height', vpH());
  const lines = $$('line', leaderSvg);
  const dots = $$('circle', leaderSvg);
  CALLOUT_POS.forEach((c, i) => {
    const line = lines[i], dot = dots[i];
    if (!show) { line.style.opacity = 0; dot.style.opacity = 0; return; }
    let pt;
    if (c.oct === -1) {
      const a = stage.screenPoint(0), b = stage.screenPoint(6);
      pt = a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : null;
    } else {
      pt = stage.screenPoint(c.oct);
    }
    if (!pt) return;
    const box = callouts[i].getBoundingClientRect();
    const fromX = pt.x < box.left ? box.left - 6 : box.right + 6;
    const fromY = box.top + box.height / 2;
    line.setAttribute('x1', fromX); line.setAttribute('y1', fromY);
    line.setAttribute('x2', pt.x); line.setAttribute('y2', pt.y);
    dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    line.style.opacity = 1; dot.style.opacity = 1;
  });
}

let calloutsVisible = false;
function updateBallFromScroll() {
  const p = atelierProgress();
  if (p > -0.02 && p < 1.02) {
    atelierActive = true;
    calloutsVisible = updateAtelier(clamp01(p));
    return;
  }
  if (atelierActive) {
    atelierActive = false;
    calloutsVisible = false;
    stage.setExplode(0);
    stage.setSeamGlow(0);
    callouts.forEach(c => c.classList.remove('show'));
  }
  const frames = ballKeyframes();
  const y = scrollY;
  let a = frames[0], b = frames[frames.length - 1];
  if (y <= frames[0].y) { a = b = frames[0]; }
  else if (y >= frames[frames.length - 1].y) { a = b = frames[frames.length - 1]; }
  else {
    for (let i = 0; i < frames.length - 1; i++) {
      if (y >= frames[i].y && y <= frames[i + 1].y) { a = frames[i]; b = frames[i + 1]; break; }
    }
  }
  const t = a === b ? 1 : smooth(clamp01((y - a.y) / Math.max(1, b.y - a.y)));
  const s = {};
  for (const k of Object.keys(a.s)) s[k] = a.s[k] + (b.s[k] - a.s[k]) * t;
  stage.setTarget(s);
}
addEventListener('scroll', updateBallFromScroll, { passive: true });
addEventListener('resize', updateBallFromScroll);
updateBallFromScroll();

/* pointer parallax + drag-to-rotate */
if (!isTouch) {
  addEventListener('mousemove', e => {
    stage.setPointer((e.clientX / vpW()) * 2 - 1, (e.clientY / vpH()) * 2 - 1);
  });
}
const dragZone = $('#ball-drag');
{
  let dragging = false, lastX = 0, moved = 0;
  dragZone.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; moved = 0;
    dragZone.setPointerCapture(e.pointerId);
    dragZone.classList.add('grabbing');
  });
  dragZone.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX; moved += Math.abs(dx);
    stage.addSpin(dx * 0.03);
  });
  const end = (kick) => {
    if (dragging && kick && moved < 6) stage.kick();
    dragging = false;
    dragZone.classList.remove('grabbing');
  };
  dragZone.addEventListener('pointerup', () => end(true));
  dragZone.addEventListener('pointercancel', () => end(false)); // scroll takeover ≠ tap
}

/* ============================== nav ============================== */
const nav = $('#nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ============================== marquee ============================== */
const mqTrack = $('#marquee-track');
const MQ_PHRASES = ['GRAND COMPLICATION', 'HAND-LAID PEBBLE', 'EIGHT PANELS', 'SOVRA'];
const GLYPH = `<svg class="mq-glyph" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4">
  <circle cx="32" cy="32" r="28"/><path d="M4 32h56M32 4v56M10 13c12 10 32 10 44 0M10 51c12-10 32-10 44 0"/></svg>`;
mqTrack.innerHTML = (MQ_PHRASES.map(p => `<span class="mq-item">${p}</span>${GLYPH}`).join('')).repeat(2);

let mqOffset = 0, mqVel = 0, mqBase = 26, mqHover = false, lastScrollY = scrollY;
$('#marquee').addEventListener('mouseenter', () => { mqHover = true; });
$('#marquee').addEventListener('mouseleave', () => { mqHover = false; });
addEventListener('scroll', () => {
  mqVel += (scrollY - lastScrollY) * 1.4;
  lastScrollY = scrollY;
}, { passive: true });

/* ============================== stats ============================== */
$('#stats-row').innerHTML = STATS.map((s, i) => `
  <div class="stat reveal" style="--d:${i * 90}ms">
    <div class="stat-value"><span class="count" data-value="${s.value}">0</span><span class="stat-suffix">${s.suffix}</span></div>
    <div class="stat-label">${s.label}</div>
  </div>`).join('');

let countersRun = false;
function runCounters() {
  if (countersRun) return;
  countersRun = true;
  $$('.count').forEach(el => {
    const target = parseFloat(el.dataset.value);
    const t0 = performance.now(), DUR = 1800;
    (function tick(now) {
      const p = clamp01((now - t0) / DUR);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = Math.round(v).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}
/* certification drop — the fall triggers the counters on impact */
const dropIO = new IntersectionObserver(entries => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    dropIO.disconnect();
    if (reducedMotion) { runCounters(); return; }
    setTimeout(() => stage.drop(runCounters), 350);
    setTimeout(runCounters, 2600); // safety if the drop can't play
  }
}, { threshold: 0.4 });
dropIO.observe($('#provenance'));

/* ============================== products ============================== */
const grid = $('#product-grid');
grid.innerHTML = PRODUCTS.map((p, i) => `
  <article class="card reveal" data-cat="${p.category}" data-id="${i}" style="--d:${(i % 4) * 80}ms">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
    <div class="card-media">
      <div class="thumb-shimmer"></div>
      <img class="card-img" alt="${p.name} basketball — live 3D render" draggable="false">
    </div>
    <div class="card-body">
      <div class="card-top">
        <h3>${p.name}</h3>
        <span class="price-flip"><span class="amount">${money(p.price)}</span><span class="acquire">Acquire</span></span>
      </div>
      <p class="card-cat">${p.category} — No. ${String(i + 1).padStart(2, '0')}</p>
      <p class="card-blurb">${p.blurb}</p>
      <button class="btn btn-add" data-add="${i}" data-cursor="acquire"><span>Add to ledger</span></button>
    </div>
  </article>`).join('');

/* thumbnails — offscreen renders of the same 3D ball */
setTimeout(() => {
  try {
    const urls = renderProductThumbnails(PRODUCTS, { brandText: BRAND.name });
    $$('.card').forEach(card => {
      const img = $('.card-img', card);
      img.src = urls[+card.dataset.id];
      img.addEventListener('load', () => card.classList.add('thumb-ready'), { once: true });
    });
  } catch (err) {
    console.error('thumbnail render failed', err);
    $$('.card').forEach(card => card.classList.add('thumb-ready'));
  }
}, 900);

/* category filter — .filtered switches to a 2-up gallery layout so the
   hairline-gap grid never paints empty ghost tracks */
$$('#filters button').forEach(btn => btn.addEventListener('click', () => {
  $$('#filters button').forEach(b => b.classList.toggle('active', b === btn));
  const cat = btn.dataset.filter;
  grid.classList.toggle('filtered', cat !== 'All');
  $$('.card', grid).forEach(card => card.classList.toggle('hidden', cat !== 'All' && card.dataset.cat !== cat));
  updateBallFromScroll();
}));

/* cursor spotlight + tilt + live hero retint */
let tintTimer = null;
grid.addEventListener('mousemove', e => {
  const card = e.target.closest('.card');
  if (!card || isTouch) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
  const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
  card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
});
grid.addEventListener('mouseover', e => {
  const card = e.target.closest('.card');
  if (!card || isTouch) return;
  if (!card.contains(e.relatedTarget)) {
    clearTimeout(tintTimer);
    const p = PRODUCTS[+card.dataset.id];
    stage.retint(p.baseColor, p.seamColor);
  }
});
grid.addEventListener('mouseout', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  if (!card.contains(e.relatedTarget)) {
    card.style.transform = '';
    clearTimeout(tintTimer);
    tintTimer = setTimeout(() => stage.revertTint(), 1500);
  }
});

/* ============================== cart — the ledger ============================== */
const CART_KEY = 'sovra-cart';
let cart = [];
try {
  const parsed = JSON.parse(localStorage.getItem(CART_KEY));
  cart = Array.isArray(parsed)
    ? parsed.filter(it => it && PRODUCTS[it.id] && Number.isInteger(it.qty) && it.qty > 0)
    : [];
} catch { cart = []; }

const drawer = $('#cart-drawer');
const overlay = $('#cart-overlay');
const cartCount = $('#cart-count');
const cartItems = $('#cart-items');
const cartTotal = $('#cart-total');

function renderCart() {
  const qty = cart.reduce((n, it) => n + it.qty, 0);
  cartCount.textContent = qty;
  cartCount.classList.toggle('show', qty > 0);
  if (!cart.length) {
    cartItems.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-ball"></div>
      <p>The ledger is empty.</p><p class="cart-empty-sub">Nothing but net awaits.</p></div>`;
  } else {
    cartItems.innerHTML = cart.map(it => {
      const p = PRODUCTS[it.id];
      return `<div class="cart-item" data-item="${it.id}">
        <span class="strike"></span><span class="withdrawn-stamp">withdrawn</span>
        <div class="cart-thumb" style="--ball:${p.baseColor}"></div>
        <div class="cart-item-info">
          <strong>${p.name}</strong>
          <span class="cart-item-price">${money(p.price)} × ${it.qty}</span>
        </div>
        <div class="qty">
          <button data-dec="${it.id}" data-cursor="hover" aria-label="Decrease">−</button>
          <span class="qty-num">${roman(it.qty)}</span>
          <button data-inc="${it.id}" data-cursor="hover" aria-label="Increase">+</button>
        </div>
        <button class="cart-remove" data-remove="${it.id}" data-cursor="hover" aria-label="Remove">✕</button>
      </div>`;
    }).join('');
  }
  cartTotal.textContent = money(cart.reduce((n, it) => n + PRODUCTS[it.id].price * it.qty, 0));
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* sandboxed context */ }
}

/* pending withdrawals are cancellable so re-adding during the
   strike-through animation can't wipe the item afterwards */
const pendingWithdraw = new Map();
function cancelWithdraw(id) {
  const t = pendingWithdraw.get(id);
  if (!t) return;
  clearTimeout(t.strike);
  clearTimeout(t.remove);
  pendingWithdraw.delete(id);
}

function addToCart(id) {
  cancelWithdraw(id);
  const item = cart.find(it => it.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  renderCart();
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
  stage.flare();
  toast(`${PRODUCTS[id].name} — entered in the ledger`);
}

function withdrawItem(id) {
  const row = $(`.cart-item[data-item="${id}"]`);
  if (!row || pendingWithdraw.has(id)) return;
  row.classList.add('struck');
  const strike = setTimeout(() => row.classList.add('withdrawing'), 420);
  const remove = setTimeout(() => {
    pendingWithdraw.delete(id);
    cart = cart.filter(x => x.id !== id);
    renderCart();
  }, 800);
  pendingWithdraw.set(id, { strike, remove });
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { addToCart(+add.dataset.add); flyToCart(add); return; }
  const inc = e.target.closest('[data-inc]');
  if (inc) {
    const id = +inc.dataset.inc;
    cancelWithdraw(id);
    const it = cart.find(x => x.id === id);
    if (it) { it.qty++; renderCart(); }
    return;
  }
  const dec = e.target.closest('[data-dec]');
  if (dec) {
    const it = cart.find(x => x.id === +dec.dataset.dec);
    if (!it) return;
    if (it.qty <= 1) { withdrawItem(it.id); return; }
    it.qty--;
    renderCart(); return;
  }
  const rem = e.target.closest('[data-remove]');
  if (rem) { withdrawItem(+rem.dataset.remove); }
});

function openCart() {
  drawer.classList.add('open');
  drawer.inert = false;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  drawer.classList.remove('open');
  drawer.inert = true;
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}
drawer.inert = true; // closed drawer is out of the tab order
$('#cart-btn').addEventListener('click', openCart);
$('#cart-close').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
$('#checkout-btn').addEventListener('click', () => {
  if (!cart.length) { toast('The ledger is empty'); return; }
  toast('Demo maison — this is where your payment provider takes over 🏀');
});

/* fly-to-cart: card render arcs into the cart icon */
function flyToCart(btn) {
  const card = btn.closest('.card');
  const img = card && $('.card-img', card);
  if (!img || !img.src) return;
  const from = img.getBoundingClientRect();
  const to = $('#cart-btn').getBoundingClientRect();
  const ghost = img.cloneNode();
  Object.assign(ghost.style, {
    position: 'fixed', left: `${from.left}px`, top: `${from.top}px`,
    width: `${from.width}px`, height: `${from.height}px`,
    zIndex: 400, pointerEvents: 'none', filter: 'none',
    transition: 'all .75s cubic-bezier(.42,-0.18,.22,1)',
  });
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    Object.assign(ghost.style, {
      left: `${to.left + to.width / 2 - 13}px`, top: `${to.top + to.height / 2 - 13}px`,
      width: '26px', height: '26px', opacity: '0.15',
    });
  });
  setTimeout(() => ghost.remove(), 800);
}

/* ============================== toast ============================== */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ============================== guest book ============================== */
const gbStage = $('#gb-stage');
gbStage.innerHTML = TESTIMONIALS.map(t => `
  <figure class="gb-quote">
    <blockquote>${t.quote}</blockquote>
    <figcaption>${t.author}<span>${t.role}</span></figcaption>
  </figure>`).join('');
const gbDots = $('#gb-dots');
gbDots.innerHTML = TESTIMONIALS.map((_, i) => `<button data-t="${i}" data-cursor="hover" aria-label="Entry ${i + 1}"></button>`).join('');
let gbIndex = 0, gbTimer;
function showQuote(i) {
  gbIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  $$('.gb-quote', gbStage).forEach((q, j) => q.classList.toggle('active', j === gbIndex));
  $$('button', gbDots).forEach((d, j) => d.classList.toggle('active', j === gbIndex));
}
function autoQuotes() {
  clearInterval(gbTimer);
  gbTimer = setInterval(() => showQuote(gbIndex + 1), 8000);
}
gbDots.addEventListener('click', e => {
  const b = e.target.closest('[data-t]');
  if (b) { showQuote(+b.dataset.t); autoQuotes(); }
});
showQuote(0);
autoQuotes();

/* ============================== reveals ============================== */
const revealIO = new IntersectionObserver(entries => {
  for (const en of entries) {
    if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
  }
}, { threshold: 0.12 });
$$('.reveal, .reveal-mask, .reveal-line').forEach(el => revealIO.observe(el));
revealIO.observe($('#voices')); // laurel draw

/* ============================== newsletter ============================== */
const form = $('#newsletter-form');
const errEl = $('#newsletter-error');
form.addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#newsletter-email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    errEl.textContent = 'That address will not reach us.';
    form.classList.remove('jolt');
    void form.offsetWidth;
    form.classList.add('jolt');
    return;
  }
  errEl.textContent = '';
  form.classList.add('success');
  $('#newsletter-cta').textContent = 'Entry Requested';
  stage.flare();
  toast('Welcome to the list. You will hear from the atelier.');
  input.value = '';
  setTimeout(() => {
    form.classList.remove('success');
    $('#newsletter-cta').textContent = 'Request Entry';
  }, 4200);
});

/* ============================== custom cursor ============================== */
if (!isTouch) {
  document.body.classList.add('has-cursor');
  const dot = $('#cursor-dot'), ring = $('#cursor-ring'), label = $('#cursor-label');
  let mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const acquire = e.target.closest('[data-cursor="acquire"], .btn-solid');
    const rotate = e.target.closest('#ball-drag');
    const hov = e.target.closest('a, button, [data-cursor]');
    ring.classList.toggle('hover', !!hov && !rotate);
    ring.classList.toggle('drag', !!rotate);
    label.textContent = rotate ? 'ROTATE' : acquire ? 'ACQUIRE' : '';
  });
  // ring trails, leader lines re-aim, marquee glides — one UI loop
  let rx = mx, ry = my, lastT = performance.now();
  (function uiLoop(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    tickShared(dt);
    requestAnimationFrame(uiLoop);
  })(lastT);
} else {
  let lastT = performance.now();
  (function uiLoop(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    tickShared(dt);
    requestAnimationFrame(uiLoop);
  })(lastT);
}

/* shared per-frame work: choreography, marquee physics, leader lines */
function tickShared(dt) {
  if (!window.SOVRA.freeze) updateBallFromScroll(); // per-frame: survives late layout + smooth scrubbing
  if (!reducedMotion) {
    mqVel *= Math.exp(-2.2 * dt);
    const base = mqHover ? 3 : mqBase;
    mqOffset -= (base + mqVel) * dt;
    const half = mqTrack.scrollWidth / 2;
    if (half > 0) {
      if (mqOffset <= -half) mqOffset += half;
      if (mqOffset > 0) mqOffset -= half;
    }
    mqTrack.style.transform = `translateX(${mqOffset}px)`;
  }
  updateLeaders(calloutsVisible);
}

/* magnetic buttons */
if (!isTouch) {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.32;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

renderCart();
