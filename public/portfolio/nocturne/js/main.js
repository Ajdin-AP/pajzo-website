/* ============================================================
   main.js — everything outside the light: loader, cursor,
   clock, rails, plates, the ledger, the booking desk.
   ============================================================ */
import { CARS, CAR_KEYS, PAINTS, profileSVG } from './cars.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const fmtUSD = (n, cents = false) =>
  n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

/* ─────────── loader: the gallery is being lit ─────────── */
const loader = $('#loader');
const bar = $('#loader-progress');
const seenTonight = sessionStorage.getItem('nocturne-lit') === '1';

addEventListener('nocturne:progress', (e) => {
  bar.style.width = `${Math.round(e.detail.p * 100)}%`;
});

function reveal() {
  loader.classList.add('done');
  document.body.dataset.lit = 'true';
  sessionStorage.setItem('nocturne-lit', '1');
}

addEventListener('nocturne:ready', () => {
  if (REDUCED || seenTonight) reveal();
  else setTimeout(reveal, 650); // let the rule finish its draw, then the bloom
});

// failsafe: whatever happens to the 3D pipeline, the gallery must open
setTimeout(() => {
  if (document.body.dataset.lit !== 'true') reveal();
}, 9000);

/* ─────────── custom cursor ─────────── */
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !REDUCED) {
  document.body.dataset.cursor = 'on';
  const cur = $('#cursor');
  const word = $('#cursor-word');
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  let currentWord = '';

  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const overStage = e.target.closest('#stage');
    const overPlate = e.target.closest('.plate-img');
    const next = overStage ? 'TURN' : overPlate ? 'VIEW' : '';
    if (next !== currentWord) {
      currentWord = next;
      word.textContent = next;
      cur.classList.toggle('ring', !!next);
    }
  }, { passive: true });

  (function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    cur.style.transform = `translate(${x - 0}px, ${y - 0}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
}

/* ─────────── the permanent night clock ─────────── */
const clockEl = $('#clock-time');
function tickClock() {
  const d = new Date();
  clockEl.textContent =
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
tickClock();
setInterval(tickClock, 20000);

/* ─────────── roman rail ─────────── */
const railLinks = $$('#rail a');
const roomObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const n = e.target.id.replace('room-', '');
    railLinks.forEach((a) => a.classList.toggle('active', a.dataset.room === n));
  });
}, { rootMargin: '-45% 0px -45% 0px' });
$$('main > section, main > footer').forEach((s) => roomObserver.observe(s));

/* ─────────── reveals: wall-text rises ─────────── */
const revealObserver = new IntersectionObserver((entries) => {
  const batch = entries.filter((e) => e.isIntersecting);
  batch.forEach((e, i) => {
    e.target.style.setProperty('--stagger', `${i * 60}ms`);
    e.target.classList.add('in-view');
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

/* ─────────── Room I: works, lacquers, lamplight, sightlines ─────────── */
const chipsWrap = $('#chips');
PAINTS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.style.background = p.css;
  b.setAttribute('aria-label', p.name);
  b.innerHTML = `<span>${p.name} — ${p.css}</span>`;
  b.addEventListener('click', () => window.NOCTURNE?.selectPaint(i));
  chipsWrap.appendChild(b);
});

$$('.work-num').forEach((b) => {
  b.addEventListener('click', () => window.NOCTURNE?.selectWork(b.dataset.work));
});

const lampBtn = $('#lamplight');
lampBtn.addEventListener('click', () => {
  const on = lampBtn.getAttribute('aria-pressed') !== 'true';
  lampBtn.setAttribute('aria-pressed', String(on));
  $('span', lampBtn).textContent = on ? 'ON' : 'OFF';
  window.NOCTURNE?.setLamplight(on);
});

$$('.stud').forEach((b, i) => {
  b.addEventListener('click', () => {
    $$('.stud').forEach((s) => s.classList.remove('active'));
    b.classList.add('active');
    window.NOCTURNE?.sightline(i);
  });
});

/* wall label — retyped character by character, like a placard being reset */
let retypeTimer = null;
function retype(el, text) {
  if (REDUCED) { el.textContent = text; return; }
  clearInterval(retypeTimer);
  let i = 0;
  retypeTimer = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(retypeTimer);
  }, 13);
}

function lacquerPhrase(idx) {
  return PAINTS[idx].name.toLowerCase().replace(' lacquer', '') + ' lacquer';
}

addEventListener('nocturne:work', (e) => {
  const { key, spec, paintIndex } = e.detail;
  $('#wl-no').textContent = spec.no;
  $('#wl-name').textContent = spec.name;
  $('#wl-year').textContent = spec.year;
  retype($('#wl-medium'), `${spec.medium}, ${lacquerPhrase(paintIndex)}`);
  $('#wl-specs').textContent =
    `${spec.stats.power} · 0–100 in ${spec.stats.accel} · ${spec.stats.top}`;
  // one calm announcement for screen readers, no typewriter spam
  $('#wl-sr').textContent =
    `Now showing No. ${spec.no}, ${spec.name}. ${spec.stats.power}, 0 to 100 in ${spec.stats.accel}.`;
  $$('.work-num').forEach((b) =>
    b.classList.toggle('active', b.dataset.work === key));
  $$('.chip').forEach((c, i) => c.classList.toggle('active', i === paintIndex));
});

addEventListener('nocturne:paint', (e) => {
  $$('.chip').forEach((c, i) => c.classList.toggle('active', i === e.detail.index));
  const spec = CARS[$$('.work-num').find((b) => b.classList.contains('active'))?.dataset.work || 'vermilion'];
  retype($('#wl-medium'), `${spec.medium}, ${lacquerPhrase(e.detail.index)}`);
});

/* ─────────── Room II: the catalogue ─────────── */
let platesBuilt = false;
addEventListener('nocturne:ready', (e) => {
  if (platesBuilt) return;
  platesBuilt = true;
  const stills = e.detail.stills || {};
  const wrap = $('#plates');
  CAR_KEYS.forEach((k, i) => {
    const c = CARS[k];
    const prof = profileSVG(k, 200);
    const el = document.createElement('article');
    el.className = 'plate reveal';
    el.innerHTML = `
      <svg class="etching" viewBox="${prof.viewBox}" aria-hidden="true">
        <path d="${prof.body}"></path>
        ${prof.canopy ? `<path d="${prof.canopy}"></path>` : ''}
      </svg>
      ${stills[k] ? `<figure class="plate-img">
        <img src="${stills[k]}" alt="${c.name}, ${c.kind.toLowerCase()}, under the gallery light">
      </figure>` : ''}
      <div class="plate-plaque">
        <p class="plate-no mono">Plate ${c.no} / 04</p>
        <h3><em>No. ${c.no} — ${c.name}</em></h3>
        <p class="plate-medium">${c.year} · ${c.kind} · ${c.medium.toLowerCase()}, ${lacquerPhrase(c.defaultPaint)}</p>
        <p class="mono plate-specs">0–100 in ${c.stats.accel} · ${c.stats.power} · ${c.seats} seats</p>
        <p class="plate-est">Acquisition from <span class="mono">${fmtUSD(c.price)}</span></p>
        <p class="plate-blurb">${c.blurb}</p>
        <button class="plate-view" data-work="${k}">View under the light →</button>
      </div>`;
    wrap.appendChild(el);
    revealObserver.observe(el);
  });

  // the etchings draw themselves in, like a plate being printed
  $$('.etching path').forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
    p.style.transition = 'stroke-dashoffset 1.8s ease 0.3s';
  });
  const etchObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$('path', en.target).forEach((p) => { p.style.strokeDashoffset = '0'; });
      etchObserver.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  $$('.etching').forEach((s) => etchObserver.observe(s));

  $$('.plate-view').forEach((b) => {
    b.addEventListener('click', () => {
      window.NOCTURNE?.selectWork(b.dataset.work);
      $('#room-1').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });
});

/* ─────────── Room IV: the ledger ─────────── */
const APR = 0.049, MONTHS = 60;
const dp = $('#dp');
const workSel = $('#work-select');

function amortize(principal) {
  const r = APR / 12;
  return principal * r / (1 - Math.pow(1 + r, -MONTHS));
}

function odometer(el, str) {
  // digits roll inside fixed tabular columns; punctuation stands still
  const pattern = [...str].map((ch) => (/\d/.test(ch) ? 'd' : ch)).join('');
  if (el.dataset.pattern !== pattern) {
    el.dataset.pattern = pattern;
    el.innerHTML = '';
    [...str].forEach((ch) => {
      if (/\d/.test(ch)) {
        const col = document.createElement('span');
        col.className = 'od-col';
        const strip = document.createElement('span');
        strip.className = 'od-strip';
        strip.innerHTML = Array.from({ length: 10 }, (_, d) => `<b>${d}</b>`).join('');
        col.appendChild(strip);
        el.appendChild(col);
      } else {
        const s = document.createElement('span');
        s.className = 'od-static';
        s.textContent = ch;
        el.appendChild(s);
      }
    });
  }
  const cols = $$('.od-col .od-strip', el);
  let di = 0;
  [...str].forEach((ch) => {
    if (!/\d/.test(ch)) return;
    cols[di++].style.transform = `translateY(${-Number(ch) * 1.25}em)`;
  });
}

function updateLedger() {
  const price = CARS[workSel.value].price;
  const dpPct = Number(dp.value) / 100;
  const deposit = price * dpPct;
  const financed = price - deposit;
  const monthly = amortize(financed);
  const total = monthly * MONTHS;

  $('#dp-label').textContent = `${dp.value}%`;
  $('#lg-price').textContent = fmtUSD(price, true);
  $('#lg-deposit').textContent = fmtUSD(deposit, true);
  $('#lg-financed').textContent = fmtUSD(financed, true);
  $('#lg-monthly').textContent = fmtUSD(monthly, true);
  $('#lg-interest').textContent = fmtUSD(total - financed, true);
  $('#lg-total').textContent = fmtUSD(total, true);

  $('#acq-cash').textContent = fmtUSD(price);
  odometer($('#odometer'), fmtUSD(monthly, true));
  $('#odometer-sr').textContent = `${fmtUSD(monthly, true)} per month`;

  // long-term loan: 58% residual carried by the gallery
  const residual = price * 0.58;
  const lease = (price - residual) / 36 + (residual * APR) / 12;
  $('#acq-lease').textContent = `${fmtUSD(lease)} / month`;
}
dp.addEventListener('input', updateLedger);
workSel.addEventListener('change', updateLedger);
updateLedger();

/* ─────────── Room V: the booking desk ─────────── */
const bkState = { work: null, night: null };

const bkWorks = $('#bk-works-grid');
CAR_KEYS.forEach((k) => {
  const c = CARS[k];
  const prof = profileSVG(k, 170);
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'bk-work';
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `
    <svg viewBox="${prof.viewBox}" aria-hidden="true"><path d="${prof.body}"></path></svg>
    <span class="bw-name">${c.name}</span>
    <span class="bw-no">No. ${c.no} · ${c.kind}</span>`;
  b.addEventListener('click', () => {
    bkState.work = k;
    $$('.bk-work').forEach((w) => {
      w.classList.toggle('selected', w === b);
      w.setAttribute('aria-pressed', String(w === b));
    });
  });
  bkWorks.appendChild(b);
});

const bkDates = $('#bk-dates-grid');
const nights = [];
for (let i = 1; i <= 6; i++) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  nights.push(d);
}
nights.forEach((d) => {
  const parts = d.toDateString().split(' '); // ["Thu","Jul","03","2026"]
  const label = `${parts[0].toUpperCase()} · ${parts[2]} ${parts[1].toUpperCase()} · 22:00`;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ticket';
  b.setAttribute('aria-pressed', 'false');
  b.textContent = label;
  b.addEventListener('click', () => {
    bkState.night = label;
    $$('.ticket').forEach((t) => {
      t.classList.toggle('selected', t === b);
      t.setAttribute('aria-pressed', String(t === b));
    });
  });
  bkDates.appendChild(b);
});

$('#booking').addEventListener('submit', (e) => {
  e.preventDefault();
  const note = $('#bk-note');
  const name = $('#bk-name').value.trim();
  const phone = $('#bk-phone').value.trim();
  if (!bkState.work) { note.textContent = 'Choose the work you wish to meet.'; return; }
  if (!bkState.night) { note.textContent = 'Choose a night; the gallery keeps late hours.'; return; }
  if (!name || !phone) { note.textContent = 'The curator will need a name to call after dark.'; return; }
  const ref = String(Math.floor(1000 + Math.random() * 9000));
  $('#bk-ref').textContent = ref;
  $('#booking').hidden = true;
  $('#booking-done').hidden = false;
});

/* ─────────── Room VII: the next catalogue ─────────── */
$('#newsletter').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const input = e.target;
  const note = $('#news-note');
  if (!input.value.includes('@')) {
    note.textContent = 'An address, so the catalogue can travel.';
    return;
  }
  note.textContent = 'The next catalogue will find you.';
  input.value = '';
});
