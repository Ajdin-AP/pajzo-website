/* ============================================================
   main.js — the shop floor

   Everything on the page is derived from data.js: the rail, the
   directory, the chips, the plates, the basket and the comparison.
   Nothing is hard-coded twice.

   The delivery dates are real. They are counted forward from today
   in working days from each item's own lead time, which is the
   whole point of the store's second promise — if the date were a
   string in the markup it would be a lie by Thursday.
   ============================================================ */

import { DEPTS, DEPT, PRODUCTS } from './data.js';
import { ART, plate, counterArt } from './art.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- money and dates ---------- */
const eur = new Intl.NumberFormat('sl-SI', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0,
});
const money = (n) => eur.format(n);

const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const dayShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/** Counted forward in working days, so a Friday order does not claim Saturday. */
function arrival(leadDays, extra = 0) {
  const d = new Date();
  let left = leadDays + extra;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

/* ---------- state ---------- */
const state = {
  dept: 'all',
  query: '',
  sort: 'featured',
  cart: new Map(),      // id -> qty
  compare: new Set(),
  postExtra: 0,
};

/* ---------- the accent follows the floor ---------- */
function setAccent(deptId) {
  const d = DEPT[deptId];
  const root = document.documentElement;
  root.style.setProperty('--accent', d ? d.hex : '#14181d');
  root.style.setProperty('--accent-soft', d ? hexA(d.hex, 0.12) : 'rgba(20,24,29,0.07)');
  $$('.rail-item').forEach((b) => b.setAttribute('aria-current', String(b.dataset.dept === deptId)));
}
const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/* ---------- stars ---------- */
const STAR = 'M8 1.6l1.9 4 4.3.6-3.1 3 .7 4.3L8 11.5 4.2 13.5l.7-4.3-3.1-3 4.3-.6z';
function stars(rating) {
  let out = '<span class="stars" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    out += `<svg viewBox="0 0 16 16" class="${i <= Math.round(rating) ? '' : 'off'}"><path d="${STAR}"/></svg>`;
  }
  return out + '</span>';
}

/* ============================ render ============================ */

function renderRail() {
  $('#rail-list').innerHTML = DEPTS.map((d) => `
    <button class="rail-item" data-dept="${d.id}" style="--rc:${d.hex}"
      aria-current="false" title="${d.name}">
      <span class="rd"></span>
      <span class="rn">${d.no}</span>
    </button>`).join('');

  $$('.rail-item').forEach((b) => b.addEventListener('click', () => {
    pickDept(b.dataset.dept);
    $('#catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function renderBoard() {
  $('#board-grid').innerHTML = DEPTS.map((d) => {
    const n = PRODUCTS.filter((p) => p.dept === d.id).length;
    const sample = PRODUCTS.find((p) => p.dept === d.id);
    return `
      <button class="floor" data-dept="${d.id}" style="--fc:${d.hex}">
        <span class="mono fnum">FLOOR ${d.no}</span>
        <h3>${d.name}</h3>
        <p class="fdesc">${d.desc}</p>
        <span class="mono fcount">${n} ITEMS · IN STOCK TODAY</span>
        <span class="floor-art">${plate(ART[sample.art], d.hex)}</span>
      </button>`;
  }).join('');

  $$('.floor').forEach((b) => b.addEventListener('click', () => {
    pickDept(b.dataset.dept);
    $('#catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function renderChips() {
  const all = `<button class="chip" data-dept="all" aria-pressed="true">
      <span class="cd" style="--cc:#14181d"></span>Everything</button>`;
  $('#dept-chips').innerHTML = all + DEPTS.map((d) => `
    <button class="chip" data-dept="${d.id}" aria-pressed="false">
      <span class="cd" style="--cc:${d.hex}"></span>${d.name}</button>`).join('');
  $$('.chip').forEach((b) => b.addEventListener('click', () => pickDept(b.dataset.dept)));
}

function renderFootDepts() {
  $('#foot-depts').innerHTML = DEPTS.map((d) => `
    <li><a href="#catalogue" data-dept="${d.id}">
      <span class="fdot" style="background:${d.hex}"></span>${d.name}</a></li>`).join('');
  $$('#foot-depts a').forEach((a) => a.addEventListener('click', () => pickDept(a.dataset.dept)));
}

/* ---------- the plates ---------- */
function visible() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    if (state.dept !== 'all' && p.dept !== state.dept) return false;
    if (!q) return true;
    const hay = `${p.name} ${p.sku} ${DEPT[p.dept].name} ${p.tags.join(' ')} ${p.blurb}`.toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  });
  const by = {
    featured: (a, b) => a.feat - b.feat,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    soonest: (a, b) => a.lead - b.lead || a.price - b.price,
  };
  return list.sort(by[state.sort]);
}

function plateCard(p) {
  const d = DEPT[p.dept];
  const eta = arrival(p.lead, state.postExtra);
  const low = p.stock <= 6;
  return `
    <article class="plate" style="--pc:${d.hex};--pc-wash:${hexA(d.hex, 0.09)}">
      <div class="plate-art">
        ${plate(ART[p.art], d.hex)}
        ${low ? `<span class="plate-tag">Last ${p.stock}</span>` : ''}
        <button class="plate-cmp" data-cmp="${p.id}" aria-pressed="${state.compare.has(p.id)}"
          aria-label="Compare ${p.name}" title="Add to comparison">${state.compare.has(p.id) ? '✓' : '+'}</button>
      </div>
      <div class="plate-body">
        <span class="plate-dept">${d.no} · ${d.name}</span>
        <h3 class="plate-name">${p.name}</h3>
        <div class="plate-meta">${stars(p.rating)}<span>${p.rating.toFixed(1)} · ${p.reviews}</span></div>
        <div class="plate-foot">
          <span class="price">${money(p.price)}</span>
          <span class="arrives"><b>${dayShort.format(eta)}</b>${low ? '<span class="low">low stock</span>' : 'in stock'}</span>
        </div>
        <div class="plate-buy">
          <button class="solid-btn" data-add="${p.id}">Add to basket</button>
          <button class="line-btn" data-view="${p.id}">Look</button>
        </div>
      </div>
    </article>`;
}

function renderGrid() {
  const list = visible();
  $('#grid').innerHTML = list.map(plateCard).join('');
  $('#empty').hidden = list.length > 0;
  $('#search-count').textContent =
    `${list.length} ITEM${list.length === 1 ? '' : 'S'}${state.dept === 'all' ? '' : ' · ' + DEPT[state.dept].name.toUpperCase()}`;

  $$('[data-add]').forEach((b) => b.addEventListener('click', () => addToCart(b.dataset.add)));
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => openView(b.dataset.view)));
  $$('[data-cmp]').forEach((b) => b.addEventListener('click', () => toggleCompare(b.dataset.cmp)));
}

/* ---------- picking a floor ---------- */
function pickDept(id) {
  state.dept = id;
  setAccent(id === 'all' ? null : id);
  $$('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.dept === id)));
  renderGrid();
}

/* ============================ basket ============================ */
function addToCart(id) {
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  syncPips();
  renderCart();
  toast(`${PRODUCTS.find((p) => p.id === id).name} — in the basket`);
}

function setQty(id, n) {
  if (n <= 0) state.cart.delete(id);
  else state.cart.set(id, n);
  syncPips();
  renderCart();
}

function cartLines() {
  return [...state.cart.entries()].map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty }));
}

function renderCart() {
  const lines = cartLines();
  const body = $('#cart-body');
  if (!lines.length) {
    body.innerHTML = `<p class="cart-empty">Nothing in it yet. The floor is through there.</p>`;
    return;
  }
  const sub = lines.reduce((t, l) => t + l.p.price * l.qty, 0);
  const latest = lines.reduce((m, l) => Math.max(m, l.p.lead), 0);
  const eta = arrival(latest, state.postExtra);

  body.innerHTML = lines.map(({ p, qty }) => {
    const d = DEPT[p.dept];
    return `
      <div class="line-item" style="--pc:${d.hex};--pc-wash:${hexA(d.hex, 0.1)}">
        <span class="li-art">${plate(ART[p.art], d.hex)}</span>
        <div>
          <p class="li-name">${p.name}</p>
          <p class="li-dept">${d.name}</p>
          <span class="qty">
            <button data-dec="${p.id}" aria-label="One fewer ${p.name}">−</button>
            <span>${qty}</span>
            <button data-inc="${p.id}" aria-label="One more ${p.name}">+</button>
          </span>
        </div>
        <span class="li-price">${money(p.price * qty)}</span>
      </div>`;
  }).join('') + `
    <div class="cart-sum">
      <div><span>Goods</span><span class="mono">${money(sub)}</span></div>
      <div><span>Delivery</span><span class="mono">INCLUDED</span></div>
      <div><span>VAT (22%), already in</span><span class="mono">${money(Math.round(sub - sub / 1.22))}</span></div>
      <div class="tot"><span>To pay</span><span>${money(sub)}</span></div>
    </div>
    <p class="cart-note">
      Everything in the basket lands together on <b>${dayName.format(eta)}</b>, paced by
      the slowest item. Nothing is added at checkout: the figure above is the figure.
    </p>
    <div class="view-cta">
      <button class="solid-btn" id="checkout">Go to the counter</button>
    </div>`;

  $$('[data-inc]').forEach((b) => b.addEventListener('click', () => setQty(b.dataset.inc, state.cart.get(b.dataset.inc) + 1)));
  $$('[data-dec]').forEach((b) => b.addEventListener('click', () => setQty(b.dataset.dec, state.cart.get(b.dataset.dec) - 1)));
  $('#checkout')?.addEventListener('click', () => {
    toast('A demonstration shop — this is where a payment provider would take over.');
  });
}

function syncPips() {
  const n = [...state.cart.values()].reduce((a, b) => a + b, 0);
  const pip = $('#cart-pip');
  pip.textContent = n;
  pip.dataset.zero = String(n === 0);
  const c = $('#compare-pip');
  c.textContent = state.compare.size;
  c.dataset.zero = String(state.compare.size === 0);
}

/* ============================ quick view ============================ */
function openView(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const d = DEPT[p.dept];
  const eta = arrival(p.lead, state.postExtra);
  $('#view-body').innerHTML = `
    <div style="--pc:${d.hex};--pc-wash:${hexA(d.hex, 0.1)}">
      <div class="view-art">${plate(ART[p.art], d.hex)}</div>
      <span class="view-dept">${d.no} · ${d.name} · ${p.sku}</span>
      <h2 class="view-name" id="view-name">${p.name}</h2>
      <div class="plate-meta">${stars(p.rating)}<span>${p.rating.toFixed(1)} from ${p.reviews} people</span></div>
      <p class="view-blurb">${p.blurb}</p>
      <div class="view-price">
        <span class="price">${money(p.price)}</span>
        <span class="mono">VAT AND DELIVERY INSIDE</span>
      </div>
      <dl class="spec">
        ${Object.entries(p.specs).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        <div><dt>On the floor</dt><dd>${p.stock} units</dd></div>
        <div><dt>In your hands</dt><dd>${dayShort.format(eta)}</dd></div>
      </dl>
      <div class="view-cta">
        <button class="solid-btn" data-add="${p.id}">Add to basket · ${money(p.price)}</button>
        <button class="line-btn" data-cmp="${p.id}">${state.compare.has(p.id) ? 'In the comparison' : 'Add to comparison'}</button>
      </div>
    </div>`;
  $('#view-body [data-add]').addEventListener('click', () => { addToCart(p.id); close(); });
  $('#view-body [data-cmp]').addEventListener('click', () => { toggleCompare(p.id); close(); });
  open($('#view'));
}

/* ============================ comparison ============================ */
function toggleCompare(id) {
  if (state.compare.has(id)) state.compare.delete(id);
  else {
    if (state.compare.size >= 3) { toast('Three at a time — that is as many as anyone reads.'); return; }
    state.compare.add(id);
  }
  syncPips();
  renderGrid();
  renderTray();
}

function renderTray() {
  const tray = $('#tray');
  const ids = [...state.compare];
  tray.hidden = false;
  tray.classList.toggle('on', ids.length > 0);
  document.body.classList.toggle('tray-on', ids.length > 0);
  $('#tray-label').textContent = `${ids.length} SELECTED`;
  $('#tray-items').innerHTML = ids.map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return `<span class="tray-thumb" title="${p.name}">${plate(ART[p.art], DEPT[p.dept].hex)}</span>`;
  }).join('');
}

function openCompare() {
  const items = [...state.compare].map((id) => PRODUCTS.find((p) => p.id === id));
  if (items.length < 2) { toast('Pick at least two things to put side by side.'); return; }
  const cheapest = Math.min(...items.map((p) => p.price));
  const best = Math.max(...items.map((p) => p.rating));
  const soonest = Math.min(...items.map((p) => p.lead));
  const mark = (ok, text) => (ok ? `<span class="cmp-best">${text}</span>` : text);

  const row = (label, fn) => `<tr><th>${label}</th>${items.map((p) => `<td>${fn(p)}</td>`).join('')}</tr>`;

  $('#compare-body').innerHTML = `
    <table class="cmp-table">
      <tbody>
        <tr><th></th>${items.map((p) => {
          const d = DEPT[p.dept];
          return `<td class="cmp-head" style="--pc-wash:${hexA(d.hex, 0.1)}">
            <span class="cmp-art">${plate(ART[p.art], d.hex)}</span>
            <span class="cmp-name">${p.name}</span></td>`;
        }).join('')}</tr>
        ${row('Department', (p) => DEPT[p.dept].name)}
        ${row('Price', (p) => mark(p.price === cheapest, money(p.price)))}
        ${row('Rated', (p) => mark(p.rating === best, `${p.rating.toFixed(1)} / ${p.reviews}`))}
        ${row('In your hands', (p) => mark(p.lead === soonest, dayShort.format(arrival(p.lead, state.postExtra))))}
        ${row('On the floor', (p) => `${p.stock} units`)}
        ${row('Warranty', (p) => p.specs.Warranty || '—')}
        ${row('Code', (p) => p.sku)}
        <tr><th></th>${items.map((p) => `<td><button class="solid-btn" data-add="${p.id}">Add to basket</button></td>`).join('')}</tr>
      </tbody>
    </table>
    <p class="cart-note">Green marks the best figure in its row. Nothing else is weighted or scored — the rest is your call.</p>`;

  $$('#compare-body [data-add]').forEach((b) => b.addEventListener('click', () => { addToCart(b.dataset.add); }));
  open($('#compare'));
}

/* ============================ delivery ============================ */
const KNOWN = { '1000': 'Ljubljana', '2000': 'Maribor', '3000': 'Celje', '4000': 'Kranj',
  '5000': 'Nova Gorica', '6000': 'Koper', '8000': 'Novo mesto', '9000': 'Murska Sobota' };

function checkPost() {
  const raw = $('#post').value.trim();
  const out = $('#deliver-out');
  if (!/^\d{4}$/.test(raw)) {
    out.innerHTML = 'That is not a four-digit post code. Try <b>1000</b> for Ljubljana.';
    return;
  }
  const town = KNOWN[raw];
  // the two big depots are next-day; everywhere else adds a day on the van
  const extra = raw === '1000' || raw === '2000' ? 0 : 1;
  state.postExtra = extra;
  const eta = arrival(2, extra);
  out.innerHTML = town
    ? `<b>${town}</b> — a two-day item ordered now is in your hands <b>${dayName.format(eta)}</b>. Every date on the floor has moved to match.`
    : `Post code <b>${raw}</b> — a two-day item lands <b>${dayName.format(eta)}</b>. Every date on the floor has moved to match.`;
  renderGrid();
  renderCart();
}

/* ============================ chrome ============================ */
let lastFocus = null;

function open(el) {
  lastFocus = document.activeElement;
  el.hidden = false;
  $('#scrim').hidden = false;
  requestAnimationFrame(() => {
    el.classList.add('on');
    $('#scrim').classList.add('on');
  });
  document.body.style.overflow = 'hidden';
  (el.querySelector('button, [href], input') || el).focus();
}

function close() {
  $$('.drawer, .modal').forEach((el) => {
    if (el.hidden) return;
    el.classList.remove('on');
    setTimeout(() => { el.hidden = true; }, 480);
  });
  $('#scrim').classList.remove('on');
  setTimeout(() => { $('#scrim').hidden = true; }, 420);
  document.body.style.overflow = '';
  lastFocus?.focus();
}

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2800);
}

/* ============================ boot ============================ */
renderRail();
renderBoard();
renderChips();
renderFootDepts();
renderGrid();
renderCart();
renderTray();
syncPips();
$('#counter-art').innerHTML = counterArt();

/* search, debounced only enough to avoid thrashing the grid */
let qTimer;
$('#q').addEventListener('input', (e) => {
  state.query = e.target.value;
  $('#search-clear').hidden = !state.query;
  clearTimeout(qTimer);
  qTimer = setTimeout(renderGrid, 110);
});
$('#search-form').addEventListener('submit', (e) => e.preventDefault());
$('#search-clear').addEventListener('click', () => {
  $('#q').value = '';
  state.query = '';
  $('#search-clear').hidden = true;
  renderGrid();
  $('#q').focus();
});

$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); });
$('#empty-reset').addEventListener('click', () => {
  $('#q').value = '';
  state.query = '';
  $('#search-clear').hidden = true;
  pickDept('all');
});

$('#cart-open').addEventListener('click', () => open($('#cart')));
$('#compare-open').addEventListener('click', openCompare);
$('#tray-go').addEventListener('click', openCompare);
$('#tray-clear').addEventListener('click', () => {
  state.compare.clear();
  syncPips();
  renderGrid();
  renderTray();
});

$('#deliver-go').addEventListener('click', checkPost);
$('#post').addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPost(); });

$('#scrim').addEventListener('click', close);
$$('[data-close]').forEach((b) => b.addEventListener('click', close));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close();
  // "/" jumps to search, the one shortcut a shop actually needs
  if (e.key === '/' && document.activeElement !== $('#q')) {
    e.preventDefault();
    $('#q').focus();
  }
});
