import React, { useEffect } from 'react';
import { navigate } from './nav';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <main id="main" tabIndex={-1} className="section legal section--paper">
      <div className="container">
        <div className="legal__wrap">
          <a href="/" className="legal__back" onClick={(e) => go(e, '/')}>
            ← Back to Pajzo
          </a>

          <h1>Terms of Service</h1>
          <p className="legal__date">Effective May 2026</p>

          <p>
            These terms cover your use of the Pajzo website. By browsing the
            site or getting in touch through it, you&rsquo;re agreeing to them.
          </p>
          <p>
            Pajzo is an independent digital studio run by Ajdin Pajazetović as
            a sole proprietorship (samostojni podjetnik, or &ldquo;s.p.&rdquo;)
            in Domžale, Slovenia. These terms are about the website itself. The
            specific terms of any paid work, such as a website, an app or a
            branding project, are set out separately in the written agreement
            you&rsquo;d sign before that work begins.
          </p>

          <h2>1. Using this site</h2>
          <p>
            You&rsquo;re welcome to read the site and get in touch through it.
            In return, please use it fairly: don&rsquo;t misuse it, don&rsquo;t
            try to disrupt, overload, or break into it, and don&rsquo;t use it
            for anything unlawful or to harm others.
          </p>

          <h2>2. Enquiries and the contact form</h2>
          <p>
            Sending a message through the contact form, or emailing us directly,
            starts a conversation. It doesn&rsquo;t create a contract or commit
            either of us to anything; paid work begins only once a separate
            written agreement is signed. Please send accurate information, and
            only details you&rsquo;re entitled to share. What happens to the
            information you send is explained in our{' '}
            <a
              className="inline"
              href="/privacy-policy"
              onClick={(e) => go(e, '/privacy-policy')}
            >
              Privacy Policy
            </a>
            .
          </p>

          <h2>3. Prices and what&rsquo;s on the site</h2>
          <p>
            We describe our services openly and keep those descriptions as
            accurate and current as we reasonably can. Even so, they may
            change over time, and the site may occasionally contain an error
            or be out of date. The price and scope that apply to your work are
            whatever is written into your signed, fixed quote, not whatever the
            site happened to show on a given day.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            The Pajzo name, logo, brand, written content, and design of this
            site belong to Pajzo. You&rsquo;re welcome to view and share the
            site, but please don&rsquo;t copy, reproduce, or reuse its content
            or branding as your own without our permission.
          </p>

          <h2>5. Links to other sites</h2>
          <p>
            The site may link to other places, for example our social
            profiles. Those sites aren&rsquo;t run by us, and we&rsquo;re not
            responsible for their content or how they handle your data.
            Visiting them is at your own discretion.
          </p>

          <h2>6. The site is provided &ldquo;as is&rdquo;</h2>
          <p>
            We do our best to keep the site available, accurate, and working
            well, but we provide it &ldquo;as is.&rdquo; We don&rsquo;t
            guarantee it will always be available, uninterrupted, or free of
            errors, and we may change, pause, or take down parts of it at any
            time.
          </p>

          <h2>7. Liability</h2>
          <p>
            To the extent the law allows, Pajzo isn&rsquo;t liable for indirect
            or consequential loss arising from your use of, or inability to
            use, this website. Nothing in these terms limits any liability
            that can&rsquo;t legally be limited. Responsibilities for paid work
            are governed by your service agreement, not by this page.
          </p>

          <h2>8. Governing law</h2>
          <p>
            These terms are governed by the law of Slovenia. Any dispute
            relating to the website or to these terms falls under the
            jurisdiction of the Slovenian courts.
          </p>

          <h2>9. Changes &amp; contact</h2>
          <p>
            We may update these terms as the site or our business changes; the
            effective date above will change when we do. Continuing to use the
            site after an update means you accept the revised terms. Questions?
            Email{' '}
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
