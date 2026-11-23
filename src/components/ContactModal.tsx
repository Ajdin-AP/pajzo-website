import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Close, ArrowRight, Check } from './icons';

// The Pajzo shield — used only as a small keyline mark on the success screen.
const SHIELD =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

type Data = {
  name: string;
  email: string;
  company: string;
  website: string;
  services: string[];
  budget: number;
  budgetOn: boolean;
  message: string;
};

const BUDGET_MIN = 500;
const BUDGET_MAX = 10000;
const BUDGET_STEP = 250;

const EMPTY: Data = {
  name: '',
  email: '',
  company: '',
  website: '',
  services: [],
  budget: BUDGET_MIN,
  budgetOn: false,
  message: '',
};

const SERVICES = [
  { id: 'web', label: 'Web development', note: 'A site or web app, designed and built from scratch' },
  { id: 'app', label: 'App development', note: 'Native iPhone, iPad or Mac software, in SwiftUI' },
  { id: 'branding', label: 'Branding', note: 'A name, a mark, and the rules for using them' },
  { id: 'design', label: 'Design', note: 'Interfaces, layouts and graphics, drawn to be built' },
  { id: 'question', label: 'I have a question', note: 'No brief needed. Just ask.' },
  { id: 'unsure', label: 'Not sure yet', note: 'Describe the problem; we’ll name it together' },
];

// The budget figure rolls like an odometer: each digit that changes slides
// in from above when the amount goes up and from below when it goes down,
// with a short blur, while the old digit leaves the other way. Digits are
// keyed from the right so units stay units when a thousands digit appears.
const RollDigit = ({ ch }: { ch: string }) => {
  const [st, setSt] = useState({ cur: ch, prev: '', n: 0 });
  if (ch !== st.cur) setSt({ cur: ch, prev: st.cur, n: st.n + 1 });
  return (
    <span className="roll__slot">
      <span key={`c${st.n}`} className={`roll__in${st.n ? ' is-moving' : ''}`}>
        {st.cur}
      </span>
      {st.prev && (
        <span key={`p${st.n}`} className="roll__out" aria-hidden="true">
          {st.prev}
        </span>
      )}
    </span>
  );
};

const RollNumber = ({ value, text }: { value: number; text: string }) => {
  const last = useRef(value);
  const dir = useRef<'up' | 'down'>('up');
  if (value !== last.current) {
    dir.current = value > last.current ? 'up' : 'down';
    last.current = value;
  }
  const chars = text.split('');
  return (
    <span className={`roll roll--${dir.current}`} aria-label={text}>
      {chars.map((c, i) => (
        <RollDigit key={chars.length - i} ch={c} />
      ))}
    </span>
  );
};

// The budget knob glides instead of hopping between €250 notches. The input
// runs in whole euros so it follows the pointer freely, the knob eases toward
// wherever it was put (a click on the rail slides it there too), and on
// release it settles onto the nearest notch. The budget itself is always the
// snapped value.
const snap = (n: number) =>
  Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, Math.round(n / BUDGET_STEP) * BUDGET_STEP));

const useGlide = (initial: number) => {
  const [pos, setPos] = useState(initial);
  const posRef = useRef(initial);
  const target = useRef(initial);
  const raf = useRef(0);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => cancelAnimationFrame(raf.current);
  }, []);
  const tick = () => {
    const gap = target.current - posRef.current;
    posRef.current = Math.abs(gap) < 0.5 ? target.current : posRef.current + gap * 0.25;
    setPos(posRef.current);
    raf.current = posRef.current === target.current ? 0 : requestAnimationFrame(tick);
  };
  const glideTo = (n: number) => {
    target.current = n;
    if (reduce.current) {
      posRef.current = n;
      setPos(n);
      return;
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  const jumpTo = (n: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    target.current = posRef.current = n;
    setPos(n);
  };
  return { pos, glideTo, jumpTo };
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const amount = (n: number) =>
  n >= BUDGET_MAX ? '€10,000+' : '€' + n.toLocaleString('en-US');

type Props = {
  open: boolean;
  openNonce: number;
  onClose: () => void;
  initialService: string;
};

const ContactModal = ({ open, openNonce, onClose, initialService }: Props) => {
  const [step, setStep] = useState(0);
  const [out, setOut] = useState(false);
  const [data, setData] = useState<Data>(EMPTY);
  const knob = useGlide(BUDGET_MIN);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  // Pending step-fade timer, plus the latest "open generation". A fade that
  // resolves after a close/reopen bails instead of snapping the fresh form to
  // the wrong step.
  const fadeTimer = useRef<number | null>(null);
  const nonceRef = useRef(openNonce);

  // Fresh form on every open — state is adjusted during render (not in an
  // effect) so the open transition still runs on the mounted element.
  const [seenNonce, setSeenNonce] = useState(openNonce);
  if (openNonce !== seenNonce) {
    setSeenNonce(openNonce);
    setStep(0);
    setOut(false);
    setData({ ...EMPTY, services: initialService ? [initialService] : [] });
    knob.jumpTo(BUDGET_MIN);
    setSubmitting(false);
    setFailed(false);
  }

  // Track the latest open generation; cancel any pending fade on unmount.
  useEffect(() => {
    nonceRef.current = openNonce;
  }, [openNonce]);
  useEffect(() => () => {
    if (fadeTimer.current !== null) clearTimeout(fadeTimer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus management: move focus in on open, keep Tab inside, put it back on close.
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!open || !root) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    root.querySelector<HTMLElement>('.cform__close')?.focus();
    return () => returnFocusRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = rootRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  // Fade the current step out, swap, fade the next one in.
  const fadeTo = (next: number) => {
    setOut(true);
    if (fadeTimer.current !== null) clearTimeout(fadeTimer.current);
    const gen = openNonce;
    fadeTimer.current = window.setTimeout(() => {
      fadeTimer.current = null;
      // A close+reopen happened while this fade was pending — drop it.
      if (gen !== nonceRef.current) return;
      setStep(next);
      setOut(false);
      const main = document.querySelector('.cform__main');
      if (main) main.scrollTop = 0;
    }, 280);
  };

  // Several services can be picked together. "I have a question" isn't a
  // project, so it stands alone: choosing it clears the others, and choosing
  // any other service clears it.
  const toggleService = (id: string) => {
    const has = data.services.includes(id);
    let next: string[];
    if (has) next = data.services.filter((x) => x !== id);
    else if (id === 'question') next = ['question'];
    else next = [...data.services.filter((x) => x !== 'question'), id];
    set({ services: next });
  };
  const onlyQuestion = data.services.length === 1 && data.services[0] === 'question';

  // Step 0 = "about you". Step 1 = "the project".
  const step0Valid =
    data.name.trim().length >= 2 &&
    isEmail(data.email) &&
    data.company.trim().length >= 2;

  // Budget value written into the enquiry email.
  const budgetForSubmit = () => {
    if (onlyQuestion) return 'Not applicable';
    if (!data.budgetOn) return 'Not specified';
    return amount(data.budget) + ' one-time';
  };

  const submit = async () => {
    setSubmitting(true);
    setFailed(false);
    try {
      const labels = SERVICES.filter((s) => data.services.includes(s.id)).map(
        (s) => s.label
      );
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        website: data.website.trim() || 'Not provided',
        service: labels.length ? labels.join(', ') : 'Not specified',
        budget: budgetForSubmit(),
        message: data.message.trim() || 'Not provided',
      };
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result && result.success) {
        // submitting stays true through the fade so the button can't re-fire.
        fadeTo(2);
      } else {
        setSubmitting(false);
        setFailed(true);
      }
    } catch {
      setSubmitting(false);
      setFailed(true);
    }
  };

  const budgetPct = ((knob.pos - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  const moveKnob = (raw: number) => {
    knob.glideTo(raw);
    const b = snap(raw);
    if (b !== data.budget) set({ budget: b });
  };
  const settleKnob = () => knob.glideTo(data.budget);
  // Arrow keys step a whole notch; the input's own 1-euro step would crawl.
  const knobKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const dir =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1
      : e.key === 'PageUp' ? 4
      : e.key === 'PageDown' ? -4
      : 0;
    if (!dir) return;
    e.preventDefault();
    const b = snap(data.budget + dir * BUDGET_STEP);
    set({ budget: b });
    knob.glideTo(b);
  };
  const firstName = data.name.trim().split(' ')[0] || 'there';

  // The budget block opens with any real project service chosen.
  const budgetVisible = data.services.length > 0 && !onlyQuestion;

  // How much of the logo is drawn: one quarter per required answer.
  const built =
    step >= 2
      ? 1
      : ([
          data.name.trim().length >= 2,
          isEmail(data.email),
          data.company.trim().length >= 2,
          data.services.length > 0,
        ].filter(Boolean).length) / 4;

  const progress = step >= 2 ? 100 : ((step + 1) / 2) * 100;

  return (
    <div
      ref={rootRef}
      className={`cform${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Pajzo"
    >
      <div className="cform__top-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="cform__bar">
        {/* The mark builds itself as the brief comes together: each required
            answer traces another stretch of the P's outline, a complete form
            closes the shape, and a sent message fills it in. */}
        <span
          className={`cform__brand${built >= 1 ? ' is-ready' : ''}${step >= 2 ? ' is-sent' : ''}`}
          aria-hidden="true"
        >
          <svg viewBox="-24 -24 1762 700" className="cform__brand-svg">
            <defs>
              <linearGradient id="cf-mark-stroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--violet-soft)" />
                <stop offset="0.6" stopColor="var(--violet)" />
                <stop offset="1" stopColor="var(--lime)" />
              </linearGradient>
              <linearGradient id="cf-mark-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--violet-soft)" />
                <stop offset="1" stopColor="var(--violet-deep)" />
              </linearGradient>
            </defs>
            <path className="cform__brand-fill" d={SHIELD} />
            <path className="cform__brand-track" d={SHIELD} pathLength={1} />
            <path
              className="cform__brand-trace"
              d={SHIELD}
              pathLength={1}
              style={{ strokeDashoffset: 1 - built }}
            />
            <text
              className="cform__brand-text"
              transform="translate(368.1129 511.6942)"
              fontFamily="Bungee"
              fontSize="478.5805"
            >
              AJZO
            </text>
          </svg>
        </span>
        <button className="cform__close" onClick={onClose} aria-label="Close">
          <Close />
        </button>
      </header>

      <div className="cform__main">
        <div className="cform__container">
          <div className={`cstep${out ? ' is-out' : ''}`}>
            {step === 0 && (
              <>
                <p className="cform__eyebrow">
                  <span className="cform__eyebrow-num">01</span> About you
                </p>
                <h2 className="cform__head">Let&rsquo;s start with you.</h2>

                <div className="cform__fields">
                  <div className="field">
                    <label className="field__label" htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name"
                      className="field__input"
                      value={data.name}
                      onChange={(e) => set({ name: e.target.value })}
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Jane Novak"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      className="field__input"
                      type="email"
                      value={data.email}
                      onChange={(e) => set({ email: e.target.value })}
                      maxLength={120}
                      autoComplete="email"
                      placeholder="jane@business.com"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="cf-company">Business</label>
                    <input
                      id="cf-company"
                      className="field__input"
                      value={data.company}
                      onChange={(e) => set({ company: e.target.value })}
                      maxLength={120}
                      placeholder="Your company"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="cf-website">
                      Website <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="cf-website"
                      className="field__input"
                      value={data.website}
                      onChange={(e) => set({ website: e.target.value })}
                      maxLength={160}
                      autoComplete="url"
                      placeholder="yoursite.com"
                    />
                  </div>
                </div>

                <div className="cform__actions">
                  <button
                    className="btn btn--solid btn--lg"
                    disabled={!step0Valid}
                    onClick={() => fadeTo(1)}
                  >
                    Continue
                    <ArrowRight />
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="cform__eyebrow">
                  <span className="cform__eyebrow-num">02</span> The project
                </p>
                <h2 className="cform__head">What needs building?</h2>
                <p className="cform__lead">
                  Pick everything that fits. If it&rsquo;s somewhere in between,
                  that&rsquo;s what the message box is for.
                </p>

                <div className="cform__options">
                  {SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`copt${data.services.includes(s.id) ? ' copt--on' : ''}`}
                      onClick={() => toggleService(s.id)}
                      aria-pressed={data.services.includes(s.id)}
                    >
                      <span className="copt__tick" aria-hidden="true">
                        <Check />
                      </span>
                      <b>{s.label}</b>
                      <small>{s.note}</small>
                    </button>
                  ))}
                </div>

                {/* Budget — optional, opens once a project service is chosen */}
                <div className={`cform__budget-wrap${budgetVisible ? ' is-shown' : ''}`}>
                  <div className="cform__budget-grid">
                    <div className="cform__budget-inner">
                      <button
                        type="button"
                        className={`cform__budget-toggle${data.budgetOn ? ' is-on' : ''}`}
                        onClick={() => set({ budgetOn: !data.budgetOn })}
                        aria-pressed={data.budgetOn}
                      >
                        <span className="cform__budget-box">
                          <svg className="cform__budget-tick" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12.5l5 5 9-11" />
                          </svg>
                        </span>
                        <span>Add a rough budget. It helps us quote realistically.</span>
                      </button>

                      <div className={`cform__slider-collapse${data.budgetOn ? ' is-open' : ''}`}>
                        <div className="cform__slider-clip">
                          <div className="cform__slider-pad">
                            <div className="cform__slider-top">
                              <label className="field__label" htmlFor="cf-budget">
                                Rough budget
                              </label>
                              <span className="cform__budget">
                                <RollNumber value={data.budget} text={amount(data.budget)} />
                              </span>
                            </div>
                            <input
                              id="cf-budget"
                              type="range"
                              className="range"
                              min={BUDGET_MIN}
                              max={BUDGET_MAX}
                              step={1}
                              value={Math.round(knob.pos)}
                              onChange={(e) => moveKnob(Number(e.target.value))}
                              onPointerUp={settleKnob}
                              onBlur={settleKnob}
                              onKeyDown={knobKeys}
                              aria-valuetext={amount(data.budget)}
                              style={{ '--pct': `${budgetPct}%` } as React.CSSProperties}
                              aria-label="Rough budget"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field cform__msg">
                  <label className="field__label" htmlFor="cf-msg">
                    {onlyQuestion ? 'Your question' : 'The brief, roughly'}{' '}
                    <span className="opt">(optional)</span>
                  </label>
                  <textarea
                    id="cf-msg"
                    className="field__textarea"
                    value={data.message}
                    onChange={(e) => set({ message: e.target.value })}
                    maxLength={1500}
                    rows={2}
                    placeholder={
                      onlyQuestion
                        ? 'Ask away…'
                        : 'Two or three sentences is plenty: what it is, who it is for, when you would like it.'
                    }
                  />
                </div>

                {failed && (
                  <p className="cform__err">
                    That didn&rsquo;t send. Email me directly at{' '}
                    <a href="mailto:info@pajzo.com">info@pajzo.com</a>.
                  </p>
                )}

                <div className="cform__actions cform__actions--split">
                  <button
                    className="btn btn--ghost btn--lg"
                    onClick={() => fadeTo(0)}
                    disabled={submitting}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn--solid btn--lg"
                    onClick={submit}
                    disabled={!data.services.length || submitting}
                  >
                    {submitting ? 'Sending…' : 'Send to Ajdin'}
                    {!submitting && <ArrowRight />}
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="cform__success">
                <svg className="cform__success-mark" viewBox="-10 -10 460 540" aria-hidden="true">
                  <path
                    d={SHIELD}
                    pathLength={1}
                    fill="none"
                    stroke="var(--violet)"
                    strokeWidth="14"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                <h2 className="cform__head">Delivered, {firstName}.</h2>
                <p className="cform__lead">
                  Your message is with Ajdin now, in a person&rsquo;s inbox
                  rather than a queue. A confirmation just landed in{' '}
                  <b>{data.email}</b>, and you&rsquo;ll hear back within a
                  working day. Until then, there is nothing you need to do.
                </p>
                <div className="cform__actions">
                  <button className="btn btn--solid btn--lg" onClick={onClose}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
