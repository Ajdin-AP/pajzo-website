import { Check, ArrowRight } from './icons';
import type { OpenModal } from '../App';

const CARDS = [
  {
    id: 'audit',
    type: 'One-off',
    flag: 'Best place to start',
    name: 'Marketing Audit',
    price: '€500',
    per: '',
    desc: 'A two-week review of your current marketing and a written, plain-language plan for what to fix first.',
    list: [
      'An honest read on what’s working and what isn’t',
      'A written plan, prioritised',
      'A 60-minute walkthrough call',
    ],
    cta: 'Book an audit',
  },
  {
    id: 'strategy',
    type: 'One-off consulting',
    flag: '',
    name: 'Strategy Session',
    price: '€200',
    per: '',
    desc: 'A single 90-minute working session on one specific problem, with a written follow-up.',
    list: [
      '90 minutes, focused on your question',
      'A written summary within 48 hours',
      'No deliverable, no commitment',
    ],
    cta: 'Book a session',
  },
  {
    id: 'foundation',
    type: 'One-time project',
    flag: '',
    name: 'Brand Foundation',
    price: '€1,500–3,000',
    per: '',
    desc: 'Positioning, messaging, identity and voice — the groundwork a business needs before it markets itself.',
    list: [
      'Positioning and messaging',
      'Visual identity and voice',
      'A starter website, with our dev partners',
    ],
    cta: 'Enquire',
  },
];

const FLAGSHIP_FEATURES = [
  {
    h: 'Direct access to the founder.',
    t: 'No team handoffs. You always know exactly who is accountable.',
  },
  {
    h: 'A plain-language report every month.',
    t: 'What we did, what it cost, what it earned — and what didn’t.',
  },
  {
    h: 'A quarterly strategy review, with you in the room.',
    t: 'We adjust direction before drift becomes a nine-month problem.',
  },
];

const Services = ({ openModal }: { openModal: OpenModal }) => (
  <section className="section section--paper" id="services">
    <div className="container">
      <div className="s-head s-head--wide reveal">
        <p className="eyebrow">
          <span className="num">03</span> What we offer
        </p>
        <h2 className="h-section">
          Four ways to work together. Every price is on this page.
        </h2>
        <p className="lede">
          No &ldquo;request a quote&rdquo;, no discovery call just to learn what
          it costs. Here is what everything costs and what you get for it.
        </p>
      </div>

      {/* Flagship */}
      <div className="flagship reveal" data-delay="1">
        <div>
          <p className="flagship__tag">Flagship — the partnership</p>
          <h3 className="flagship__name">Marketing Partnership</h3>
          <p className="flagship__desc">
            Your whole marketing operation, run by one person who treats your
            account the way bigger agencies promise to but rarely do. Strategy,
            content and ads — with the math shown every month.
          </p>
          <div className="flagship__price">
            <span className="amt">€900–2,000</span>
            <span className="per">/ month · 90-day minimum</span>
          </div>
          <button
            className="btn btn--solid flagship__cta"
            onClick={() => openModal('partnership')}
          >
            Enquire about a partnership
            <ArrowRight />
          </button>
        </div>
        <ul className="flagship__list">
          {FLAGSHIP_FEATURES.map((f) => (
            <li key={f.h}>
              <Check />
              <span>
                <b>{f.h}</b> {f.t}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* The three ways to start */}
      <div className="cards">
        {CARDS.map((c) => (
          <div className="card reveal" key={c.id}>
            <div className="card__top">
              <span className="card__type">{c.type}</span>
              {c.flag && <span className="card__flag">{c.flag}</span>}
            </div>
            <h3 className="card__name">{c.name}</h3>
            <p className="card__price">{c.price}</p>
            <p className="card__desc">{c.desc}</p>
            <ul className="card__list">
              {c.list.map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="card__cta">
              <button className="linkarrow" onClick={() => openModal(c.id)}>
                {c.cta}
                <ArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
