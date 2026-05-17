import React, { useEffect } from 'react';
import { navigate } from './nav';

const TermsOfService = () => {
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

          <h1>Terms of Service</h1>
          <p className="legal__date">Effective May 2026</p>

          <p>
            These terms cover your use of the Pajzo website. The specific terms
            of any paid work — an audit, a project, or a partnership — are set out
            separately in the agreement you&rsquo;d sign before that work begins.
          </p>

          <h2>1. Using this site</h2>
          <p>
            You&rsquo;re welcome to read the site and get in touch through it.
            Please don&rsquo;t misuse it, attempt to disrupt it, or use it for
            anything unlawful.
          </p>

          <h2>2. The contact form</h2>
          <p>
            Sending a message through the contact form starts a conversation — it
            doesn&rsquo;t create a contract or commit either of us to anything.
            Work only begins once a separate written agreement is signed.
          </p>

          <h2>3. What&rsquo;s on the site</h2>
          <p>
            Prices and service descriptions are published openly and kept as
            accurate as we can, but they may change over time. The price that
            applies to your work is the one written into your agreement.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            The Pajzo name, brand, and the content of this site belong to Pajzo.
            Please don&rsquo;t reproduce them as your own.
          </p>

          <h2>5. Liability</h2>
          <p>
            This website is provided as-is. To the extent the law allows, Pajzo
            isn&rsquo;t liable for indirect or consequential loss arising from use
            of the site itself. Responsibilities for paid work are governed by
            your service agreement.
          </p>

          <h2>6. Changes &amp; contact</h2>
          <p>
            We may update these terms; the effective date above will change when
            we do. Questions? Email{' '}
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

export default TermsOfService;
