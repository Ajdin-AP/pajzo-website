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
            collects when you visit this site or get in touch, why we collect
            it, and what we do with it.
          </p>
          <p>
            Pajzo is an independent digital studio run by Ajdin Pajazetović as a sole
            proprietorship (samostojni podjetnik, or &ldquo;s.p.&rdquo;) in
            Domžale, Slovenia. We&rsquo;re the ones responsible for the
            information described here, and you can reach us any time at{' '}
            <a className="inline" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
            .
          </p>

          <h2>1. What we collect</h2>
          <p>We only collect what we actually need:</p>
          <ul>
            <li>
              <strong>What you send us.</strong> When you use the contact form,
              we collect the details you provide: your name and email, your
              business and website, what you&rsquo;re looking for, a rough
              budget if you choose to share one, and your message. If you email
              us directly, we have whatever is in that email.
            </li>
            <li>
              <strong>Anonymous analytics.</strong> We use a privacy-friendly
              analytics tool to see things like which pages are visited and how
              the site performs. It&rsquo;s aggregated and anonymous; it
              doesn&rsquo;t identify you and doesn&rsquo;t track you across
              other websites.
            </li>
            <li>
              <strong>Standard technical data.</strong> Like any website, our
              host records basic technical information, such as your IP
              address and browser type, in its server logs, which helps keep
              the site running and secure.
            </li>
          </ul>

          <h2>2. Why we use it</h2>
          <p>
            We use the details you send only to reply to you, understand
            whether and how we can help, and, if you go on to become a client,
            to carry out the work. In data-protection terms, that&rsquo;s us
            acting on your request and then performing our agreement with you.
          </p>
          <p>
            Analytics and technical data are used for one narrow reason: our
            legitimate interest in keeping the site working well and secure. We
            do not sell your data, we do not share it for anyone else&rsquo;s
            marketing, and we won&rsquo;t use it for unrelated purposes.
          </p>

          <h2>3. Who else handles it</h2>
          <p>
            A few trusted providers help run this site and our email. They
            process your data only on our instructions:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong>: hosts the website and provides the
              privacy-friendly analytics.
            </li>
            <li>
              <strong>Resend</strong>: delivers the email sent through the
              contact form.
            </li>
          </ul>
          <p>
            Some of these providers are based outside the EU, in the United
            States. Where your information is handled outside the EU, that
            transfer is covered by standard legal safeguards, such as the
            European Commission&rsquo;s Standard Contractual Clauses. We also
            disclose information if the law genuinely requires it, but only
            then.
          </p>

          <h2>4. Cookies</h2>
          <p>
            This site doesn&rsquo;t use tracking or advertising cookies, and
            the analytics we use don&rsquo;t rely on cookies at all.
            There&rsquo;s no cookie banner here because there&rsquo;s nothing
            to consent to.
          </p>

          <h2>5. How long we keep it</h2>
          <p>
            We keep your information only as long as we genuinely need it. If a
            conversation doesn&rsquo;t lead to work, we delete the enquiry once
            it&rsquo;s clearly gone cold. If you become a client, we keep what
            the working relationship needs, and where the law requires us to
            hold certain records, such as invoices for tax, we keep those for
            as long as we must and no longer.
          </p>

          <h2>6. Keeping it safe</h2>
          <p>
            We take reasonable, sensible steps to protect your information, and
            we work with providers that do the same. No method of sending data
            over the internet is ever perfectly secure, but we treat your data
            with the same care we&rsquo;d want for our own.
          </p>

          <h2>7. Your rights</h2>
          <p>
            Under the GDPR, you can ask us to show you the data we hold about
            you, correct it if it&rsquo;s wrong, delete it, or send you a copy.
            You can also object to certain processing or ask us to restrict it.
            Email us and we&rsquo;ll sort it out, normally within 30 days, and
            at no cost.
          </p>
          <p>
            If you ever feel we&rsquo;ve handled your data poorly, you have the
            right to complain to your local data-protection authority. In
            Slovenia, that&rsquo;s the Information Commissioner (Informacijski
            pooblaščenec).
          </p>

          <h2>8. Changes &amp; contact</h2>
          <p>
            We may update this policy as the site or our tools change; the
            effective date above will change when we do. Questions about this
            policy, or about your data? Email{' '}
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
