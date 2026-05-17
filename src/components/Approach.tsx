const VALUES = [
  {
    name: 'Plain talk over polish',
    desc: 'We write proposals, reports and emails the way we’d explain them to a friend over coffee. No jargon, no buzzwords, no inflated claims.',
  },
  {
    name: 'Show the math',
    desc: 'Every report shows what we did, what it cost, what it earned and what didn’t work. The bad numbers come first — never buried at the bottom.',
  },
  {
    name: 'Their money first',
    desc: 'We treat your marketing budget like it came from our own pocket — because we know exactly what that’s like.',
  },
  {
    name: 'Say it before we’re asked',
    desc: 'If a campaign is underperforming, you hear it from us first, with a fix attached. We don’t wait for the awkward email.',
  },
  {
    name: 'Long over loud',
    desc: 'We choose work that compounds over work that goes viral. Steady, durable growth beats headline numbers every time.',
  },
];

const Approach = () => (
  <section className="section section--deep" id="approach">
    <div className="container">
      <div className="s-head reveal">
        <p className="eyebrow">
          <span className="num">02</span> How we work
        </p>
        <h2 className="h-section">
          Five rules. We don&rsquo;t break them when it&rsquo;s inconvenient.
        </h2>
        <p className="lede">
          Anyone can write values on a wall. These are the ones that decide what
          actually happens when no one is watching.
        </p>
      </div>

      <div className="values">
        {VALUES.map((v, i) => (
          <div className="value reveal" key={v.name}>
            <span className="value__num">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="value__name">{v.name}</h3>
            <p className="value__desc">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Approach;
