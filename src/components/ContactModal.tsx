import { useState, useEffect, useRef } from 'react';
import { Close, ArrowRight } from './icons';

type Data = {
  name: string;
  email: string;
  company: string;
  website: string;
  service: string;
  budget: number;
  budgetOn: boolean;
  message: string;
};

const BUDGET_MIN = 500;
const BUDGET_MAX = 5000;
const BUDGET_STEP = 100;

const EMPTY: Data = {
  name: '',
  email: '',
  company: '',
  website: '',
  service: '',
  budget: BUDGET_MIN,
  budgetOn: false,
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

const FIXED_PRICE: Record<string, string> = { audit: '€500', strategy: '€200' };

type BudgetMode = 'monthly' | 'onetime' | 'fixed' | 'hidden';

// Which budget UI a service calls for.
function budgetModeFor(service: string): BudgetMode {
  if (service === 'partnership') return 'monthly';
  if (service === 'foundation' || service === 'unsure') return 'onetime';
  if (service === 'audit' || service === 'strategy') return 'fixed';
  return 'hidden'; // "I have a question", or nothing chosen yet
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function sliderValueLabel(mode: 'monthly' | 'onetime', n: number) {
  const amt = n >= BUDGET_MAX ? '€5,000+' : '€' + n.toLocaleString('en-US');
  return mode === 'monthly' ? amt + ' / month' : amt;
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

  // Budget value written into the enquiry email.
  const budgetForSubmit = () => {
    const mode = budgetModeFor(data.service);
    if (mode === 'hidden') return 'Not applicable';
    if (mode === 'fixed') return (FIXED_PRICE[data.service] || '') + ' · fixed price';
    if (!data.budgetOn) return 'Not specified';
    const amt =
      data.budget >= BUDGET_MAX ? '€5,000+' : '€' + data.budget.toLocaleString('en-US');
    return mode === 'monthly' ? amt + ' / month' : amt + ' one-time';
  };

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
        budget: budgetForSubmit(),
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

  const budgetPct = Math.round(
    ((data.budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100
  );
  const firstName = data.name.trim().split(' ')[0] || 'there';

  // The budget block opens/closes and changes shape with the chosen service.
  const lastBudgetService = useRef('');
  if (data.service && data.service !== 'question') {
    lastBudgetService.current = data.service;
  }
  const budgetVisible = !!data.service && data.service !== 'question';
  const shownService = budgetVisible ? data.service : lastBudgetService.current;
  const budgetMode = budgetModeFor(shownService);
  const renderMode = budgetMode === 'hidden' ? 'monthly' : budgetMode;

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

              {/* Budget — opens, closes and reshapes with the chosen service */}
              <div className={`cform__budget-wrap${budgetVisible ? ' is-shown' : ''}`}>
                <div className="cform__budget-grid">
                  <div className="cform__budget-inner" key={renderMode}>
                    {renderMode === 'fixed' ? (
                      <>
                        <span className="field__label">Price</span>
                        <div className="cform__fixed">
                          <span className="cform__fixed-amt">
                            {FIXED_PRICE[shownService]}
                          </span>
                          <span className="cform__fixed-note">
                            {shownService === 'strategy'
                              ? 'A 90-minute Strategy Session — a flat fee, no budget to set.'
                              : 'A two-week Marketing Audit — a flat fee, no budget to set.'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`cform__budget-toggle${
                            data.budgetOn ? ' is-on' : ''
                          }`}
                          onClick={() => set({ budgetOn: !data.budgetOn })}
                          aria-pressed={data.budgetOn}
                        >
                          <span className="cform__budget-box">
                            <svg
                              className="cform__budget-tick"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M5 12.5l5 5 9-11" />
                            </svg>
                          </span>
                          <span>
                            Add a {renderMode === 'monthly' ? 'monthly' : 'one-time'}{' '}
                            budget
                          </span>
                        </button>

                        <div
                          className={`cform__slider-collapse${
                            data.budgetOn ? ' is-open' : ''
                          }`}
                        >
                          <div className="cform__slider-clip">
                            <div className="cform__slider-pad">
                              <div className="cform__slider-top">
                                <label className="field__label" htmlFor="cf-budget">
                                  {renderMode === 'monthly'
                                    ? 'Monthly budget'
                                    : 'One-time budget'}
                                </label>
                                <span className="cform__budget">
                                  {sliderValueLabel(renderMode, data.budget)}
                                </span>
                              </div>
                              <input
                                id="cf-budget"
                                type="range"
                                className="range"
                                min={BUDGET_MIN}
                                max={BUDGET_MAX}
                                step={BUDGET_STEP}
                                value={data.budget}
                                onChange={(e) => set({ budget: Number(e.target.value) })}
                                style={{
                                  background: `linear-gradient(to right, var(--orange) ${budgetPct}%, var(--line-strong) ${budgetPct}%)`,
                                }}
                                aria-label={
                                  renderMode === 'monthly'
                                    ? 'Monthly budget'
                                    : 'One-time budget'
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
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
