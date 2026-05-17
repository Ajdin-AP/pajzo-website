const FACTS = [
  { k: 'Founded', v: '2024' },
  { k: 'Based in', v: 'Domžale, Slovenia' },
  { k: 'Works', v: 'Remotely, across the EU' },
  { k: 'Structure', v: 'Samostojni podjetnik — sole proprietor' },
];

const About = () => (
  <section className="section section--deep" id="about">
    <div className="container">
      <div className="s-head reveal">
        <p className="eyebrow">
          <span className="num">05</span> Who you&rsquo;d be working with
        </p>
        <h2 className="h-section">When you email Pajzo, you email Ajdin.</h2>
      </div>

      <div className="about__grid" style={{ marginTop: 'clamp(40px, 6vw, 70px)' }}>
        <div className="about__body reveal" data-delay="1">
          <p>
            Pajzo is one person — <strong>Ajdin Pajazetović</strong>. That
            isn&rsquo;t a stepping stone to building a big agency. It&rsquo;s the
            whole point.
          </p>
          <p>
            There&rsquo;s no account manager between you and the work, no junior
            quietly doing what a senior sold, and no team to hide behind when a
            number disappoints. You get one person who knows your business and is
            accountable for it.
          </p>
          <p>
            It also means being honest about the limit. I take a capped number
            of clients — around a dozen — because past that, the attention
            I&rsquo;m promising stops being real. When the list is full,
            it&rsquo;s full. That constraint protects the quality of your
            account; it isn&rsquo;t there to manufacture urgency.
          </p>
          <p className="about__sig">
            Ajdin Pajazetović
            <span>Founder — Pajzo</span>
          </p>
        </div>

        <div className="about__facts reveal" data-delay="2">
          {FACTS.map((f) => (
            <div className="about__fact" key={f.k}>
              <div className="k">{f.k}</div>
              <div className="v">{f.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
