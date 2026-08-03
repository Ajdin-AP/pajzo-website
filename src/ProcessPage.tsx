import React, { useEffect, useRef } from 'react';
import { navigate } from './nav';
import { scrollToId } from './scroll';
import { ArrowRight } from './components/icons';
import type { OpenModal } from './App';

// ------------------------------------------------------------------
// /process — "The Dossier". The studio's working file, opened for the
// client to read: cover, contents, five phase spreads with artifacts,
// the terms in plain hand, and a blank file waiting for their name.
// ------------------------------------------------------------------

type Phase = {
  num: string;
  id: string;
  title: string;
  window: string;
  bring: string;
  done: string;
  commit: string;
  prose: string[];
};

const PHASES: Phase[] = [
  {
    num: '01',
    id: 'ph-conversation',
    title: 'The conversation',
    window: 'Day 01',
    bring: 'a plain paragraph about the work, links if they exist, an honest deadline',
    done: 'a quote is worth writing, or we have pointed you elsewhere',
    commit: 'You will hear back within one working day.',
    prose: [
      'Write to us in your own words. No intake form, no brief template, no call you must book to be taken seriously. A few sentences is enough; a full brief is welcome but never required.',
      'Ajdin reads what you send and replies with questions rather than a pitch, because the questions are what decide the quote: what the work must do, who it is for, and when it truly needs to exist.',
      'If we are not the right studio for the job, that first reply says so plainly and points you toward someone who is.',
    ],
  },
  {
    num: '02',
    id: 'ph-quote',
    title: 'The quote',
    window: 'Week 01',
    bring: 'a decision, and every question you want answered first',
    done: 'signed, half paid, dates in the calendar',
    commit: 'The full price is fixed in writing before any work begins.',
    prose: [
      'When the picture is clear, the whole agreement goes on paper. One fixed price, one timeline with real dates, and a plain list of what is included and, with the same care, what is not. The excluded lines are explained, never hidden.',
      'Take the time you need to decide. The quote does not shift while you think, and no countdown is attached to it.',
      'On signing, half the fee is due and the dates in the quote become the schedule. We would rather answer ten questions now than one complaint later.',
    ],
  },
  {
    num: '03',
    id: 'ph-work',
    title: 'The work',
    window: 'Weeks 02 +',
    bring: 'an hour at each checkpoint, and honest reactions while change is cheap',
    done: 'the last build is one you would put your name on',
    commit: 'If you cannot click it, we do not call it progress.',
    prose: [
      'Design and build run side by side at one table, so every decision is tested in the real product before you approve it.',
      'At each agreed checkpoint you receive a live link: working screens you can click, scroll and break on your own devices, never renders you have to imagine. Each link arrives with a plain note saying what changed and what to look at.',
      'Clear reactions within a few days are what keep the delivery date honest. A doubt voiced in week three costs an afternoon; the same doubt in ship week costs the schedule.',
    ],
  },
  {
    num: '04',
    id: 'ph-handover',
    title: 'Handover',
    window: 'Ship week',
    bring: 'final say, and the second half once you have seen finished work',
    done: 'it is live, and nothing of it lives only with us',
    commit: 'The second half of the fee is due after you see finished work, never before.',
    prose: [
      'Ship week is testing, fixing and launching, in that order. You review the finished work live at your address; only then does the second half of the fee come due.',
      'The handover itself is quick, because the domain and the accounts have carried your name since day one. What moves to you now is the code, the source files, and a short written guide, in ordinary language, on how to run and change what we built.',
    ],
  },
  {
    num: '05',
    id: 'ph-after',
    title: 'Stand behind it',
    window: 'the first month, then as long as you want us',
    bring: 'nothing · write when something needs a hand',
    done: 'honestly, it never quite is',
    commit: 'The first month of fixes is free, whatever the cause.',
    prose: [
      'Launch is when the real world files its own feedback, so we stay close. For the first month, anything that breaks or misbehaves is fixed at no charge, at the same reply speed you have had since day one. No ticket system; a plain email will do.',
      'When the month closes, you choose what comes next: keep the studio on call, or run everything yourself. You own the code, the accounts and the domain, so both doors stay open for as long as you want them.',
    ],
  },
];

const TOC = [
  { num: '01', label: 'The conversation', when: 'Day 01', to: 'ph-conversation' },
  { num: '02', label: 'The quote', when: 'Week 01', to: 'ph-quote' },
  { num: '03', label: 'The work', when: 'Weeks 02 +', to: 'ph-work' },
  { num: '04', label: 'Handover', when: 'Ship week', to: 'ph-handover' },
  { num: '05', label: 'Stand behind it', when: 'After', to: 'ph-after' },
  { num: 'A', label: 'The terms', when: '', to: 'terms' },
  { num: 'B', label: 'Open a file', when: '', to: 'open-a-file' },
];

const TERMS = [
  {
    t: 'T1',
    head: 'A fixed price, in writing, before any work begins.',
    body: 'If the work runs longer than we planned, the difference is ours to absorb.',
  },
  {
    t: 'T2',
    head: 'Half on signing, half at handover.',
    body: 'The studio is never paid in full for work it has not finished.',
  },
  {
    t: 'T3',
    head: 'A reply within one working day.',
    body: 'From the first email to the final fix.',
  },
  {
    t: 'T4',
    head: 'Domains and accounts in your name from day one.',
    body: 'Nothing of yours ever has to be asked for back.',
  },
  {
    t: 'T5',
    head: 'Working builds and live links at every checkpoint.',
    body: 'Progress you can open, not read about.',
  },
  {
    t: 'T6',
    head: 'A month of fixes after launch, at no cost.',
    body: 'Software meets the real world at launch. The price already accounts for that meeting.',
  },
];

const NOT_HERE = [
  { cut: 'Discovery workshops', instead: 'a conversation' },
  { cut: 'Decks about decks', instead: 'working builds' },
  { cut: 'Hourly billing', instead: 'one written number' },
  { cut: 'Accounts held in our name', instead: 'yours from day one' },
  { cut: 'Countdowns on quotes', instead: 'the price holds while you think' },
  { cut: 'Surprise line items', instead: 'nothing billed that was not written first' },
];

const MANIFEST = [
  { item: 'Domain', note: 'your registrar, your name, since day one' },
  { item: 'Hosting', note: 'your account, your card, your control' },
  { item: 'Code', note: 'transferred in full' },
  { item: 'Design files', note: 'delivered, organised' },
  { item: 'Passwords', note: 'yours alone, we keep none' },
  { item: 'Plain guide', note: 'how to run it, written for a human' },
];

const QUOTE_LINES = [
  { line: 'Design, four pages', state: 'included' },
  { line: 'Build, tested on real phones', state: 'included' },
  { line: 'Copy, edited with you', state: 'included' },
  { line: 'Photography', state: 'not included · noted why' },
  { line: 'Hosting setup, your account', state: 'included' },
  { line: 'A month of fixes', state: 'included' },
];

// Keyline glyphs (24x24, drawn on reveal).
const ENVELOPE = ['M3 6h18v12H3z', 'm3 7 9 6 9-6'];
const CHECK = ['m5 12 5 5L20 7'];

const Stamp = ({ text }: { text: string }) => (
  <span className="pw__stamp" aria-hidden="true">
    <svg viewBox="0 0 132 44">
      <rect x="2" y="2" width="128" height="40" rx="8" pathLength={1} />
    </svg>
    <em>{text}</em>
  </span>
);

const Glyph = ({ paths }: { paths: string[] }) => (
  <svg className="pw__glyph" viewBox="0 0 24 24" aria-hidden="true">
    {paths.map((d) => (
      <path key={d} d={d} pathLength={1} />
    ))}
  </svg>
);

const CoverCard = ({ blank, tab }: { blank: boolean; tab: string }) => (
  <figure className={`pw__cover${blank ? ' pw__cover--blank' : ''} reveal`}>
    <span className={`pw__cover-tab${blank ? ' pw__cover-tab--yours' : ''}`}>{tab}</span>
    {[
      { k: 'Client', v: '' },
      { k: 'Scope', v: '' },
      { k: 'Quote', v: blank ? '' : 'fixed, in writing' },
      { k: 'Terms', v: blank ? '' : 'half on signing · half at handover' },
      { k: 'Ownership', v: blank ? '' : 'yours from day one' },
    ].map((row, i) => (
      <div className="pw__cover-row" style={{ '--i': i } as React.CSSProperties} key={row.k}>
        <span className="pw__cover-k">{row.k}</span>
        <span className="pw__leader" aria-hidden="true" />
        <span className="pw__cover-v">{row.v}</span>
      </div>
    ))}
    {!blank && <Stamp text="Opened" />}
  </figure>
);

const ProcessPage = ({ openModal }: { openModal: OpenModal }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The page is a lazy chunk, so it mounts after App's route-change reveal
  // pass has already queried the DOM. Observe this page's reveals here.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.pw .reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // One scroll driver for the binding rail, the quote tear and the month
  // fill. Fine pointers without reduced-motion only; on touch everything
  // renders settled and no scroll work ever runs.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sheet = sheetRef.current;
    const month = monthRef.current;
    const rail = railRef.current;
    if (!fine || reduce) {
      sheet?.classList.add('is-torn');
      month?.classList.add('is-filled');
      rail?.style.setProperty('--p', '1');
      return;
    }

    let raf = 0;
    let torn = false;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Reads first, writes after: no forced reflow inside the write phase.
      const railR = rail?.getBoundingClientRect();
      const sheetR = torn ? null : sheet?.getBoundingClientRect();
      const monthR = month?.getBoundingClientRect();

      if (rail && railR) {
        const p = Math.max(0, Math.min(1, (vh * 0.6 - railR.top) / railR.height));
        rail.style.setProperty('--p', p.toFixed(4));
      }
      if (sheet && sheetR) {
        const p = Math.max(0, Math.min(1, (vh * 0.72 - sheetR.top - sheetR.height * 0.55) / (vh * 0.45)));
        sheet.style.setProperty('--tear', p.toFixed(3));
        if (p >= 1) {
          // Bake the final state and stop paying for this consumer.
          sheet.classList.add('is-torn');
          torn = true;
        }
      }
      if (month && monthR) {
        const p = Math.max(0, Math.min(1, (vh * 0.62 - monthR.top) / (vh * 0.5)));
        month.style.setProperty('--fill', p.toFixed(3));
        if (p >= 1) month.classList.add('is-filled');
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <main id="main" tabIndex={-1} className="pw">
      <div className="pw__rail" ref={railRef} aria-hidden="true">
        <span className="pw__rail-fill" />
      </div>

      {/* 0 · cover */}
      <section className="pw__hero">
        <div className="container pw__hero-grid">
          <div className="pw__hero-copy">
            <p className="tag reveal">
              <span className="tag__num">Process</span>&nbsp;·&nbsp;File PJZ/26
            </p>
            <h1 className="pw__h1 reveal">
              No surprises between <em>hello</em> and handover.
            </h1>
            <p className="lede reveal" data-delay="1">
              Five phases, one set of rules, and nothing you are asked to take
              on trust. This is the file we keep on every project, opened for
              you to read before you sign anything.
            </p>
            <p className="pw__note reveal" data-delay="2">
              The timeline here is the shape, not a promise · your quote comes
              with real dates
            </p>
            <div className="pw__hero-cta reveal" data-delay="2">
              <button className="btn btn--solid" onClick={() => openModal()}>
                Start the conversation
                <ArrowRight />
              </button>
              <a href="#terms" className="pw__skip" onClick={(e) => toAnchor(e, 'terms')}>
                Skip to the terms ↓
              </a>
            </div>
          </div>
          <CoverCard blank={false} tab="PJZ/26" />
        </div>
      </section>

      {/* 0.1 · contents */}
      <section className="pw__toc-wrap">
        <div className="container">
          <div className="pw__toc reveal">
            <p className="pw__toc-head">Contents</p>
            {TOC.map((r, i) => (
              <a
                key={r.num}
                className="pw__toc-row"
                style={{ '--i': i } as React.CSSProperties}
                href={`#${r.to}`}
                onClick={(e) => toAnchor(e, r.to)}
              >
                <span className="pw__toc-num">{r.num}</span>
                <span className="pw__toc-label">{r.label}</span>
                <span className="pw__leader" aria-hidden="true" />
                <span className="pw__toc-when">{r.when}</span>
              </a>
            ))}
            <p className="pw__toc-foot">
              Read it all, or jump to what you need · nothing below is fine
              print
            </p>
          </div>
        </div>
      </section>

      {/* phases */}
      {PHASES.map((ph) => (
        <section className="pw__phase" id={ph.id} key={ph.num}>
          <div className="container pw__phase-grid">
            <aside className="pw__aside">
              <span className="pw__ghostnum" aria-hidden="true">
                {ph.num}
              </span>
              <h2 className="pw__phase-title">{ph.title}</h2>
              <dl className="pw__meta reveal">
                <div className="pw__meta-row">
                  <dt>Window</dt>
                  <span className="pw__leader" aria-hidden="true" />
                  <dd>{ph.window}</dd>
                </div>
                <div className="pw__meta-row">
                  <dt>You bring</dt>
                  <span className="pw__leader" aria-hidden="true" />
                  <dd>{ph.bring}</dd>
                </div>
                <div className="pw__meta-row">
                  <dt>Done when</dt>
                  <span className="pw__leader" aria-hidden="true" />
                  <dd>{ph.done}</dd>
                </div>
              </dl>
            </aside>

            <div className="pw__body">
              <p className="pw__commit reveal">{ph.commit}</p>
              <div className="pw__prose reveal" data-delay="1">
                {ph.prose.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>

              {/* phase artifacts */}
              {ph.num === '01' && (
                <figure className="pw__log reveal" data-delay="2">
                  <div className="pw__log-entry" style={{ '--i': 0 } as React.CSSProperties}>
                    <Glyph paths={ENVELOPE} />
                    <p>
                      <b>Received · Tue 09:41</b>
                      <span>you, about a site for your practice</span>
                    </p>
                  </div>
                  <div className="pw__log-entry" style={{ '--i': 1 } as React.CSSProperties}>
                    <Glyph paths={ENVELOPE} />
                    <p>
                      <b>Replied · Tue 15:07</b>
                      <span>Ajdin, four questions, no pitch</span>
                    </p>
                  </div>
                  <figcaption>Within a working day · always</figcaption>
                </figure>
              )}

              {ph.num === '02' && (
                <figure className="pw__sheet reveal" data-delay="2" ref={sheetRef}>
                  <header className="pw__sheet-head">Fixed quote · specimen</header>
                  <ul className="pw__ledger">
                    {QUOTE_LINES.map((l, i) => (
                      <li key={l.line} style={{ '--i': i } as React.CSSProperties}>
                        <span>{l.line}</span>
                        <span className="pw__leader" aria-hidden="true" />
                        <em>{l.state}</em>
                      </li>
                    ))}
                  </ul>
                  <div className="pw__total">
                    <span>One number</span>
                    <span className="pw__leader" aria-hidden="true" />
                    <span className="pw__blank" aria-label="a written figure">
                      €<i /><i /><i />
                    </span>
                  </div>
                  <p className="pw__total-foot">Your number is written, not guessed</p>
                  <div className="pw__signline">
                    <svg viewBox="0 0 220 56" aria-hidden="true">
                      <path
                        className="pw__sign-path"
                        pathLength={1}
                        d="M12 40c14-22 26-30 30-24 4 5-8 20-2 24 7 5 18-12 34-14 12-2 10 10 22 10 14 0 24-16 40-16 12 0 14 12 28 12 16 0 26-10 42-8"
                      />
                    </svg>
                    <span className="pw__sign-cap">Signed first · Pajzo</span>
                  </div>
                  <div className="pw__perf" aria-hidden="true" />
                  <p className="pw__tear-cap">The split is the guarantee</p>
                  <div className="pw__halves">
                    <div className="pw__half pw__half--a">
                      <b>On signing · 50</b>
                      <span>Due when you sign, not before.</span>
                    </div>
                    <div className="pw__half pw__half--b">
                      <b>At handover · 50</b>
                      <span>Due after you have seen finished work.</span>
                    </div>
                  </div>
                  <figcaption>
                    We are never paid in full for work you have not seen
                    finished.
                  </figcaption>
                </figure>
              )}

              {ph.num === '03' && (
                <figure className="pw__ledgercard reveal" data-delay="2">
                  <div className="pw__check-entry">
                    <p className="pw__check-head">
                      Checkpoint 02 · Friday · build 14 · a live link, not a PDF
                    </p>
                    <div className="pw__diff">
                      <p className="pw__diff-del">
                        <i>−</i>
                        <s>hero type breaks at narrow widths</s>
                      </p>
                      <p className="pw__diff-add">
                        <i>+</i>
                        <span>hero type reset, tested at 320px</span>
                      </p>
                    </div>
                    <p className="pw__check-note">
                      What to look at this week: the contact flow, start to
                      finish.
                    </p>
                  </div>
                  <div className="pw__check-entry pw__check-entry--folded">
                    <p className="pw__check-head">
                      Checkpoint 03 · Friday · build 21 · the ledger continues
                    </p>
                  </div>
                </figure>
              )}

              {ph.num === '04' && (
                <figure className="pw__manifest reveal" data-delay="2">
                  <header className="pw__sheet-head">Manifest · on handover</header>
                  <span className="pw__yours" aria-hidden="true">
                    Yours
                  </span>
                  {MANIFEST.map((m, i) => (
                    <div className="pw__mrow" key={m.item} style={{ '--i': i } as React.CSSProperties}>
                      <Glyph paths={CHECK} />
                      <span className="pw__mitem">{m.item}</span>
                      <span className="pw__leader" aria-hidden="true" />
                      <span className="pw__mnote">{m.note}</span>
                    </div>
                  ))}
                  <figcaption>
                    If the studio vanished the next morning, you would lose
                    nothing.
                  </figcaption>
                  <Stamp text="In your name" />
                </figure>
              )}

              {ph.num === '05' && (
                <figure className="pw__month reveal" data-delay="2" ref={monthRef}>
                  <div className="pw__month-band">
                    <span className="pw__month-fill" aria-hidden="true" />
                    <span className="pw__mark" style={{ left: '0%' }}>01</span>
                    <span className="pw__mark" style={{ left: '31%' }}>10</span>
                    <span className="pw__mark" style={{ left: '65%' }}>20</span>
                    <span className="pw__mark" style={{ left: '96%' }}>30</span>
                  </div>
                  <p className="pw__month-cap">
                    Days 01 to 30 · what breaks, we fix · no charge
                  </p>
                  <div className="pw__forks">
                    <p>
                      <b>On call</b>
                      <span>the studio stays a message away</span>
                    </p>
                    <p>
                      <b>In-house</b>
                      <span>your team runs it, the file explains it</span>
                    </p>
                  </div>
                  <figcaption>You own it either way.</figcaption>
                </figure>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* A · the terms */}
      <section className="pw__appendix" id="terms">
        <div className="container">
          <p className="tag reveal">
            <span className="tag__num">Appendix A</span>&nbsp;/&nbsp;The terms,
            in plain hand
          </p>

          <div className="pw__facsimile reveal" data-delay="1">
            <header className="pw__sheet-head">The terms · plain language</header>
            {TERMS.map((t, i) => (
              <div className="pw__clause" key={t.t} style={{ '--i': i } as React.CSSProperties}>
                <span className="pw__clause-num">{t.t}</span>
                <div>
                  <h3>{t.head}</h3>
                  <p>{t.body}</p>
                </div>
              </div>
            ))}
            <footer className="pw__facsimile-foot">
              <span>Pajzo · Domžale</span>
              <span className="pw__client-line">
                <i aria-hidden="true" />
                Client
              </span>
            </footer>
          </div>

          <div className="pw__aside-blocks">
            <div className="pw__strikes reveal">
              <h3 className="pw__block-head">Not in this file</h3>
              {NOT_HERE.map((n, i) => (
                <p className="pw__strike-item" key={n.cut} style={{ '--i': i } as React.CSSProperties}>
                  <s>{n.cut}</s>
                  <span className="pw__leader" aria-hidden="true" />
                  <em>{n.instead}</em>
                </p>
              ))}
            </div>

            <div className="pw__wrong reveal" data-delay="1">
              <h3 className="pw__block-head">If something goes wrong</h3>
              <p>
                Projects are run by people, and people misjudge things. When we
                do, you hear it from us first, in writing, with the reasons in
                plain language and a new date attached.
              </p>
              <p>
                A fixed quote means a misjudged scope is our cost, not yours.
                The schedule can move when reality insists; the price you
                signed does not. And because the second half is never due
                before you have seen finished work, and every account has
                carried your name since day one, nothing of yours is ever
                stranded with us.
              </p>
              <p>
                If you are unhappy, say so plainly, and you will get the same
                in return. Most problems survive about one honest email.
              </p>
            </div>

            <div className="pw__changes reveal" data-delay="1">
              <h3 className="pw__block-head">Changes</h3>
              <p>
                Small changes inside the agreed scope happen at the table, as
                part of the work. New scope gets its own written line and its
                own number before anyone builds it. Nothing appears on an
                invoice that did not first appear in writing.
              </p>
              <div className="pw__slip">
                <p className="pw__slip-head">Change · 04 · specimen</p>
                <p>
                  <span>What</span>
                  <span className="pw__leader" aria-hidden="true" />
                  <em>a second language for the site</em>
                </p>
                <p>
                  <span>Number</span>
                  <span className="pw__leader" aria-hidden="true" />
                  <em>written before build</em>
                </p>
                <p>
                  <span>Signed</span>
                  <span className="pw__leader" aria-hidden="true" />
                  <em>then it enters the schedule</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B · open a file */}
      <section className="pw__close" id="open-a-file">
        <div className="container pw__close-grid">
          <div className="pw__close-copy">
            <p className="tag reveal">
              <span className="tag__num">Appendix B</span>&nbsp;/&nbsp;Your
              file
            </p>
            <h2 className="pw__close-head reveal">Open a file.</h2>
            <p className="lede reveal" data-delay="1">
              Write to us today. The reply arrives within one working day, and
              it is the first commitment on this page we get to keep.
            </p>
            <div className="pw__hero-cta reveal" data-delay="2">
              <button className="btn btn--solid" onClick={() => openModal()}>
                Start the conversation
                <ArrowRight />
              </button>
              <a
                href="/work"
                className="pw__skip"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/work');
                }}
              >
                See finished files · portfolio
              </a>
            </div>
          </div>
          <CoverCard blank tab="Yours" />
        </div>
      </section>
    </main>
  );
};

export default ProcessPage;
