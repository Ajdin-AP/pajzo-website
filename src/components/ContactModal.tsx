import { useState, useEffect } from 'react';
import { Close, ArrowRight } from './icons';

type Data = {
  name: string;
  email: string;
  company: string;
  website: string;
  service: string;
  budget: number;
  message: string;
};

const EMPTY: Data = {
  name: '',
  email: '',
  company: '',
  website: '',
  service: '',
  budget: 0,
  message: '',
};

const SERVICES = [
  { id: 'audit', label: 'Marketing Audit', note: '€500 · a two-week review' },
  { id: 'strategy', label: 'Strategy Session', note: '€200 · a 90-minute session' },
  { id: 'foundation', label: 'Brand Foundation', note: 'Positioning, identity & voice' },
  { id: 'partnership', label: 'Marketing Partnership', note: 'Your whole marketing operation' },
  { id: 'question', label: 'I have a question', note: 'Ask us anything about Pajzo' },
  { id: 'unsure', label: 'Not sure yet', note: 'Help me find the right fit' },
];

const BUDGET_MAX = 5000;
const BUDGET_STEP = 100;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function budgetLabel(n: number) {
  if (n <= 0) return 'Not specified';
  if (n >= BUDGET_MAX) return '€5,000+ / month';
  return '€' + n.toLocaleString('en-US') + ' / month';
}

type Props = {
  open: boolean;
  onClose: () => void;
  initialService: string;
};

const ContactModal = ({ open, onClose, initialService }: Props) => {
  const [step, setStep] = useState(0);
  const [out, setOut] = useState(false);
  const [data, setData] = useState<Data>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setOut(false);
      setData({ ...EMPTY, service: initialService });
      setSubmitting(false);
      setFailed(false);
    }
  }, [open, initialService]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  // Fade the current step out, swap, fade the next one in.
  const fadeTo = (next: number) => {
    setOut(true);
    window.setTimeout(() => {
      setStep(next);
      setOut(false);
    }, 300);
  };

  const step0Valid =
    data.name.trim().length >= 2 &&
    isEmail(data.email) &&
    data.company.trim().length >= 2;

  const submit = async () => {
    setSubmitting(true);
    setFailed(false);
    try {
      const svc = SERVICES.find((s) => s.id === data.service);
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        website: data.website.trim() || 'Not provided',
        service: svc ? svc.label : 'Not specified',
        budget: budgetLabel(data.budget),
        message: data.message.trim() || 'Not provided',
      };
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setSubmitting(false);
      if (result && result.success) {
        fadeTo(2);
      } else {
        setFailed(true);
      }
    } catch {
      setSubmitting(false);
      setFailed(true);
    }
  };

  const budgetPct = Math.round((data.budget / BUDGET_MAX) * 100);
  const firstName = data.name.trim().split(' ')[0] || 'there';

  return (
    <div
      className={`cform${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Pajzo"
    >
      <div className="cform__top">
        <span className="cform__brand">
          Pajzo<span className="dot">.</span>
        </span>
        <button className="cform__close" onClick={onClose} aria-label="Close">
          <Close />
        </button>
      </div>

      {step < 2 && (
        <div className="cform__progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / 2) * 100}%` }} />
        </div>
      )}

      <div className="cform__body">
        <div className={`cstep${out ? ' is-out' : ''}`}>
          {step === 0 && (
            <>
              <p className="cform__eyebrow">Step 1 of 2</p>
              <h2 className="cform__head">Let&rsquo;s start with you.</h2>

              <div className="cform__fields">
                <div className="field-row">
                  <div>
                    <label className="field__label" htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name"
                      className="field__input"
                      value={data.name}
                      onChange={(e) => set({ name: e.target.value })}
                      maxLength={80}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="field__label" htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      className="field__input"
                      type="email"
                      value={data.email}
                      onChange={(e) => set({ email: e.target.value })}
                      maxLength={120}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="field-row">
                  <div>
                    <label className="field__label" htmlFor="cf-company">Business</label>
                    <input
                      id="cf-company"
                      className="field__input"
                      value={data.company}
                      onChange={(e) => set({ company: e.target.value })}
                      maxLength={120}
                    />
                  </div>
                  <div>
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
                    />
                  </div>
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
              <p className="cform__eyebrow">Step 2 of 2</p>
              <h2 className="cform__head">What do you need?</h2>

              <div className="cform__options">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`copt${data.service === s.id ? ' copt--on' : ''}`}
                    onClick={() => set({ service: s.id })}
                  >
                    <b>{s.label}</b>
                    <small>{s.note}</small>
                  </button>
                ))}
              </div>

              <div className="cform__field-block">
                <div className="cform__slider-top">
                  <label className="field__label" htmlFor="cf-budget">
                    Monthly budget <span className="opt">(optional)</span>
                  </label>
                  <span className="cform__budget">{budgetLabel(data.budget)}</span>
                </div>
                <input
                  id="cf-budget"
                  type="range"
                  className="range"
                  min={0}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={data.budget}
                  onChange={(e) => set({ budget: Number(e.target.value) })}
                  style={{
                    background: `linear-gradient(to right, var(--orange) ${budgetPct}%, var(--line-strong) ${budgetPct}%)`,
                  }}
                  aria-label="Monthly budget"
                />
              </div>

              <div className="cform__field-block">
                <label className="field__label" htmlFor="cf-msg">
                  {data.service === 'question' ? 'Your question' : 'Anything else?'}{' '}
                  <span className="opt">(optional)</span>
                </label>
                <textarea
                  id="cf-msg"
                  className="field__textarea"
                  value={data.message}
                  onChange={(e) => set({ message: e.target.value })}
                  maxLength={1500}
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
                  disabled={!data.service || submitting}
                >
                  {submitting ? 'Sending…' : 'Send message'}
                  {!submitting && <ArrowRight />}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="cform__success">
              <svg className="cform__check" viewBox="0 0 56 56" aria-hidden="true">
                <circle className="cform__check-bg" cx="28" cy="28" r="26" />
                <path className="cform__check-tick" d="M16.5 28.5 L24.5 36.5 L40 20.5" />
              </svg>
              <h2 className="cform__head">Message delivered</h2>
              <p className="cform__success-text">
                Thanks, {firstName}. Your message reached me — I&rsquo;ll
                personally get back to you within 24 hours.
              </p>
              <button className="btn btn--solid btn--lg" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
