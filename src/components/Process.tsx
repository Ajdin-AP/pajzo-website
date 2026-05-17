import { Check } from './icons';

const STEPS = [
  {
    when: 'Day 0–5',
    title: 'Sign and onboard',
    desc: 'A simple contract, your first invoice, and a welcome pack that explains exactly what happens next and who to contact. A kickoff call gets booked for the end of week one.',
  },
  {
    when: 'Week 1',
    title: 'Discovery',
    desc: 'We hold the kickoff call, collect platform access, and audit what you already have — including, honestly, what isn’t working. Goals and the numbers we’ll judge success by are agreed in writing.',
  },
  {
    when: 'End of week 2',
    title: 'Your 90-day plan',
    desc: 'A custom strategy document: the first month of content, the ad approach, the channel plan, and a clear definition of what good looks like for month one. Kept somewhere you can see it any time.',
  },
  {
    when: 'Every month',
    title: 'The monthly cycle',
    desc: 'Content produced, posts scheduled, ads launched and tuned. A short mid-month note keeps you posted — what’s running, what’s working, what’s next. No surprises.',
  },
  {
    when: 'Month-end + quarterly',
    title: 'Report, then recalibrate',
    desc: 'A plain-language report lands on the 1st: what we did, what it cost, what it earned, what didn’t. Every third month adds a strategy review to reset the next ninety days.',
  },
];

const Process = () => (
  <section className="section section--paper" id="process">
    <div className="container">
      <div className="s-head reveal">
        <p className="eyebrow">
          <span className="num">04</span> Working together
        </p>
        <h2 className="h-section">
          What the first ninety days actually look like.
        </h2>
      </div>

      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step reveal" key={s.title}>
            <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <span className="step__when">{s.when}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="process__note reveal">
        <Check />
        <span>
          A 90-day minimum, then month to month. Long enough to do real work,
          short enough that you&rsquo;re never trapped in something that
          isn&rsquo;t working.
        </span>
      </p>
    </div>
  </section>
);

export default Process;
