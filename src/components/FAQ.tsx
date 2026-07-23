import { useState } from 'react';
import { ArrowRight } from './icons';

const QUESTIONS = [
  {
    q: 'Where’s your portfolio?',
    a: 'You’re looking at it. Pajzo is new. There are no client logos yet, no case studies, and we would rather show you one true thing than invent ten. This site was designed and built end to end by the studio your project would get.',
  },
  {
    q: 'What does a project cost?',
    a: 'It depends on what you are building, and a number printed before we understand it would be a guess dressed as a price. What never changes: a fixed quote in writing before any work begins, half on signing, half on completion. The price we agree is the price you pay.',
  },
  {
    q: 'How long does a project take?',
    a: 'A typical website takes a few weeks; an app or a full brand takes longer. Your quote comes with real dates, and we would rather name a slower date and hit it than promise one we will miss.',
  },
  {
    q: 'Who actually does the work?',
    a: 'Ajdin leads every project, with the studio team around him. Nothing is outsourced, and no juniors learn on your budget. The people you meet at the start are the people who ship it.',
  },
  {
    q: 'What happens after launch?',
    a: 'Anything broken by our hand in the first month is fixed at no cost. After that, keep the studio on for maintenance or take everything in-house. Since you own all of it, that decision is genuinely yours.',
  },
  {
    q: 'Do we need to meet in person?',
    a: 'No. The studio is based in Domžale, Slovenia and works remotely across Europe. Calls, email and live progress links cover everything a meeting room would.',
  },
  {
    q: 'Who owns the work when we’re done?',
    a: 'You do. Domains and accounts sit in your name from day one; code and files are handed over at completion. Nothing is licensed back, and nothing depends on us to keep running.',
  },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="section section--line" id="faq">
      <div className="container">
        <div className="faq__grid">
          {/* Left column stays put while the questions scroll past it. */}
          <div className="faq__side">
            <div className="s-head reveal">
              <p className="tag">
                <span className="tag__num">03</span>&nbsp;/&nbsp;FAQ
              </p>
              <h2 className="h-section">Straight answers.</h2>
              <p className="lede">
                If yours isn&rsquo;t here, ask. You&rsquo;ll get a sentence
                back, not a slide deck.
              </p>
            </div>
            <a className="linkarrow reveal" href="mailto:info@pajzo.com">
              Ask your own
              <ArrowRight />
            </a>
          </div>

          <div className="faq reveal" data-delay="1">
            {QUESTIONS.map((item, i) => (
              <div className={`faq__item${open === i ? ' open' : ''}`} key={item.q}>
                <button
                  className="faq__q"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                >
                  <span className="faq__idx" aria-hidden="true">
                    Q.{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="faq__q-text">{item.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div className="faq__a">
                  <p className="faq__a-inner">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
