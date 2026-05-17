import React, { useEffect } from 'react';
import { navigate } from './nav';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const back = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <main id="main" tabIndex={-1} className="section legal section--paper">
      <div className="container">
        <div className="legal__wrap">
          <a href="/" className="legal__back" onClick={back}>
            ← Back to Pajzo
          </a>

          <h1>Privacy Policy</h1>
          <p className="legal__date">Effective May 2026</p>

          <p>
            This policy explains, in plain language, what information Pajzo
            collects when you visit this site or get in touch, why we collect it,
            and what we do with it. Pajzo is a sole proprietorship
            (samostojni podjetnik) based in Domžale, Slovenia.
          </p>

          <h2>1. What we collect</h2>
          <p>We only collect what we actually need:</p>
          <ul>
            <li>
              <strong>What you send us.</strong> When you fill in the contact
              form, we collect your name, email, business details, and anything
              else you choose to tell us.
            </li>
            <li>
              <strong>Basic site analytics.</strong> We use privacy-friendly
              analytics to understand which pages are visited. This does not
              identify you personally and does not follow you around the web.
            </li>
          </ul>

          <h2>2. Why we use it</h2>
          <p>
            We use the information you send only to reply to you, understand how
            we might help, and — if you become a client — to carry out the work.
            We do not sell your data, and we do not use it for unrelated
            marketing.
          </p>

          <h2>3. Who else sees it</h2>
          <p>
            Your information is handled by a small number of trusted service
            providers that make this site and our email work — for example, our
            hosting and email-delivery providers. They process data on our
            instructions only. We also disclose information if the law genuinely
            requires it.
          </p>

          <h2>4. Keeping it safe</h2>
          <p>
            We take reasonable, sensible steps to protect your information. No
            method of transmission over the internet is ever perfectly secure,
            but we treat your data with the same care we&rsquo;d want for our own.
          </p>

          <h2>5. Your rights</h2>
          <p>
            Under the GDPR you can ask us what data we hold about you, ask us to
            correct or delete it, or ask for a copy. Email us and we&rsquo;ll sort
            it out, normally within 30 days.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about this policy, or about your data? Email{' '}
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

export default PrivacyPolicy;
