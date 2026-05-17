import { ArrowRight } from './icons';
import type { OpenModal } from '../App';

const Cta = ({ openModal }: { openModal: OpenModal }) => (
  <section className="section section--ink cta">
    <div className="container">
      <div className="cta__inner reveal">
        <p className="eyebrow">Start here</p>
        <h2 className="cta__title">Start with an audit, and decide for yourself.</h2>
        <p className="cta__body">
          The lowest-risk way to work with Pajzo is the €500 Marketing Audit —
          two weeks, a written plan, and an honest read on what&rsquo;s working
          and what isn&rsquo;t. Not sure where to start? Send a message and
          we&rsquo;ll point you to the right place.
        </p>
        <div className="cta__btns">
          <button className="btn btn--solid btn--lg" onClick={() => openModal('audit')}>
            Start with an audit
            <ArrowRight />
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => openModal()}>
            Just send a message
          </button>
        </div>
        <p className="cta__note">
          Every message is read and answered personally — usually within one
          business day.
        </p>
      </div>
    </div>
  </section>
);

export default Cta;
