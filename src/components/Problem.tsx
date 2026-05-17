const PAINS = [
  'A retainer that bought activity, not results.',
  'Reports full of numbers that meant nothing.',
  'An account manager fronting a junior’s work.',
  'Big promises that quietly never arrived.',
];

const Problem = () => (
  <section className="section section--paper" id="why">
    <div className="container">
      <div className="s-head reveal">
        <p className="eyebrow">
          <span className="num">01</span> Why Pajzo exists
        </p>
        <h2 className="h-section">
          You&rsquo;ve hired marketing help before. You know how it goes.
        </h2>
      </div>

      <div className="problem__grid">
        <div className="problem__pains reveal" data-delay="1">
          <p className="cap">Sound familiar?</p>
          <ul>
            {PAINS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="problem__say reveal" data-delay="2">
          <p>
            Pajzo is built to be the opposite — we do the work, show the math,
            and tell you the truth{' '}
            <span className="ink-orange">before you have to ask</span>.
          </p>
          <p className="problem__sig">
            Our mission: help owners grow without getting burned.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Problem;
