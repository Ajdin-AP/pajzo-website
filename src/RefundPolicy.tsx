import React, { useEffect } from 'react';
import { navigate } from './nav';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <main id="main" tabIndex={-1} className="section legal">
      <div className="container">
        <div className="legal__wrap">
          <a href="/" className="legal__back" onClick={(e) => go(e, '/')}>
            ← Back to Pajzo
          </a>

          <h1>Refund Policy</h1>
          <p className="legal__date">Effective July 2026</p>

          <p>
            This policy explains how refunds work for paid work with Pajzo, and
            when you are entitled to one. Browsing this site is free and involves
            no payment, so nothing here applies to simply visiting.
          </p>
          <p>
            Pajzo is an independent digital studio run by Ajdin Pajazetović as a
            sole proprietorship (samostojni podjetnik, or &ldquo;s.p.&rdquo;) in
            Domžale, Slovenia. We work on fixed, written quotes. The full terms of
            any project are set out in the agreement you sign before work begins,
            and where that agreement and this page differ, the agreement is what
            governs your project.
          </p>

          <h2>1. How we bill</h2>
          <p>
            A project usually starts with a deposit, a share of the fixed quote,
            with the balance due at handover. The deposit reserves your place in
            the schedule and pays for the early work: the thinking, the planning,
            and the first designs. It is not a holding fee for nothing.
          </p>

          <h2>2. Before work begins</h2>
          <p>
            If you change your mind before we have started, tell us. If you are a
            consumer rather than a business, you have a right under EU law to
            withdraw within fourteen days of agreeing, and we will return your
            deposit in full unless you asked us to begin sooner and we already
            have. If you are a business, a deposit paid before any work has
            started is refundable in full within fourteen days, less any costs we
            have already committed on your behalf.
          </p>

          <h2>3. Once work has started</h2>
          <p>
            After work is under way, a refund covers the part of the project we
            have not yet done, not the part we have. If you end the project
            partway through, you pay for the work completed to that point and we
            return the rest of what you have paid. We will show you where the work
            stood, so the split is clear and fair to both of us.
          </p>

          <h2>4. If we cannot deliver</h2>
          <p>
            If Pajzo has to cancel a project, or cannot deliver what we agreed,
            you are refunded for everything you paid that we did not deliver. When
            the fault is ours, we do not keep money for work you cannot use.
          </p>

          <h2>5. Revisions are not refunds</h2>
          <p>
            If something we delivered is not right, the first answer is to fix it,
            not to unwind the project. Your agreement includes revisions, and the
            first month after handover is covered for fixes at no extra cost. We
            would always rather make the work right than hand money back and leave
            you without a finished result.
          </p>

          <h2>6. Costs paid to others</h2>
          <p>
            Some things we buy on your behalf cannot be refunded once they are
            paid for, such as domain names, a year of hosting, fonts, stock
            assets, or licences. Where a project includes costs like these, they
            sit outside any refund, because the money has already gone to someone
            else. We always tell you before committing to a cost of this kind.
          </p>

          <h2>7. How to ask</h2>
          <p>
            To request a refund, email{' '}
            <a className="inline" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>{' '}
            and tell us which project it concerns. We reply within a working day,
            agree the amount with you, and return approved refunds to your
            original payment method, normally within fourteen days.
          </p>

          <h2>8. Governing law</h2>
          <p>
            This policy is governed by the law of Slovenia, and nothing in it
            removes any right you have under Slovenian or EU consumer law that
            cannot be signed away.
          </p>

          <h2>9. Changes &amp; contact</h2>
          <p>
            We may update this policy as our business changes; the effective date
            above will change when we do. Questions about a refund, or about this
            policy? Email{' '}
            <a className="inline" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
            .
          </p>

          <div className="legal__divider" />
        </div>
      </div>
    </main>
  );
};

export default RefundPolicy;
