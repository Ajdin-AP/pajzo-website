import React, { useEffect } from 'react';
import { navigate } from './nav';

const CookiePolicy = () => {
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

          <h1>Cookie Policy</h1>
          <p className="legal__date">Effective July 2026</p>

          <p>
            The short version: this site does not use tracking or advertising
            cookies, and there is no cookie banner here because there is nothing
            for you to consent to.
          </p>
          <p>
            Pajzo is an independent digital studio run by Ajdin Pajazetović as a
            sole proprietorship (samostojni podjetnik, or &ldquo;s.p.&rdquo;) in
            Domžale, Slovenia. This page explains the little there is to know
            about cookies on this website.
          </p>

          <h2>1. What a cookie is</h2>
          <p>
            A cookie is a small file a website can store in your browser. Cookies
            are often used to remember you between visits, or to follow what you
            do across other sites. Many sites lean on them heavily. This one does
            not.
          </p>

          <h2>2. What we do not use</h2>
          <p>
            We set no advertising cookies, no marketing cookies, and nothing that
            tracks you from one site to the next. We do not build a profile of
            you, and we do not sell or share your browsing for anyone else&rsquo;s
            marketing.
          </p>

          <h2>3. How we measure the site</h2>
          <p>
            We use a privacy-friendly analytics tool from our host, Vercel, to
            see aggregate things like which pages are visited and how quickly the
            site loads. It is built to work without cookies and without
            identifying you, and it does not follow you across other websites.
            There is more on this in our{' '}
            <a
              className="inline"
              href="/privacy-policy"
              onClick={(e) => go(e, '/privacy-policy')}
            >
              Privacy Policy
            </a>
            .
          </p>

          <h2>4. Strictly necessary cookies</h2>
          <p>
            A host sometimes sets a small, strictly necessary cookie to keep a
            site secure or to balance traffic. Anything of that sort exists only
            to deliver the site to you safely. It is not used to track you or to
            advertise, and under the law it needs no consent.
          </p>

          <h2>5. Managing cookies</h2>
          <p>
            You are always in control of cookies through your browser settings,
            where you can block or delete them. Because this site does not rely on
            cookies to work, blocking them will not break anything here.
          </p>

          <h2>6. Changes &amp; contact</h2>
          <p>
            If we ever begin using cookies in a way that needs your consent, we
            will ask first and update this page; the effective date above will
            change when we do. Questions? Email{' '}
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

export default CookiePolicy;
