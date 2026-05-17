import { useState } from 'react';

const QUESTIONS = [
  {
    q: 'Why should I believe this won’t go like last time?',
    a: 'Honestly — not from a website. Anyone who promises it won’t is doing the exact thing that burned you. What we can do is make finding out cheap and low-risk: start with a €500 audit, see how we think and write, and decide from there. The work is the sales pitch.',
  },
  {
    q: 'Do you guarantee results?',
    a: 'No. No “5× ROI”, no “1,000 leads in 30 days”. Marketing depends on too much outside any one person’s control to promise a number honestly. What we do guarantee is the process: real work, plain reporting, and bad news told early with a fix attached.',
  },
  {
    q: 'What’s the 90-day minimum about?',
    a: 'Marketing needs a quarter before the numbers mean anything. The minimum keeps us both honest — long enough to do real work, short enough that you’re never locked into something that isn’t working. After that, it’s month to month.',
  },
  {
    q: 'Why is your client list capped?',
    a: '“We take fewer clients than we can handle” has to be a real limit, not a slogan. Around a dozen partners is the ceiling. Past that, your account would start getting deprioritised for someone bigger — the exact thing Pajzo exists not to do.',
  },
  {
    q: 'Are you really just one person?',
    a: 'Yes. Pajzo is Ajdin. Two trusted partners handle web development when a project needs it, and that’s the whole operation. One person means one point of accountability — and an honest answer about capacity instead of a pretend bench.',
  },
  {
    q: 'Where are you based, and does it matter?',
    a: 'Domžale, Slovenia. Pajzo works remotely with clients across the EU. In-person meetings happen when they’re genuinely useful — never just for show.',
  },
  {
    q: 'So what does it actually cost?',
    a: 'It’s all on this page: €200 for a strategy session, €500 for an audit, €1,500–3,000 for brand foundation, and €900–2,000 a month for a partnership. The first eight partners pay founding rates of €750–1,400. No quote forms, no surprises.',
  },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="section section--paper" id="faq">
      <div className="container">
        <div className="s-head reveal">
          <p className="eyebrow">
            <span className="num">06</span> Common questions
          </p>
          <h2 className="h-section">The questions burned founders actually ask.</h2>
        </div>

        <div className="faq reveal" data-delay="1">
          {QUESTIONS.map((item, i) => (
            <div className={`faq__item${open === i ? ' open' : ''}`} key={item.q}>
              <button
                className="faq__q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__a">
                <p className="faq__a-inner">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
