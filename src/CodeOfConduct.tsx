import React, { useEffect } from 'react';
import { navigate } from './nav';

const CodeOfConduct = () => {
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

          <h1>Code of Conduct</h1>
          <p className="legal__date">Effective July 2026</p>

          <p>
            This is how we work with the people we work for. It sets out what you
            can expect from Pajzo, and the few things we ask in return, so a
            project runs on the same understanding from both sides.
          </p>
          <p>
            Pajzo is an independent digital studio run by Ajdin Pajazetović as a
            sole proprietorship (samostojni podjetnik, or &ldquo;s.p.&rdquo;) in
            Domžale, Slovenia.
          </p>

          <h2>1. What you can expect from us</h2>
          <p>
            We will be honest with you, including when the honest answer is not
            the easy one. We will keep you informed, do what we said we would do,
            and treat you, your business, and your time with respect. What you
            share with us stays in confidence, and we will never dress up a guess
            as a certainty.
          </p>

          <h2>2. What we ask of you</h2>
          <p>
            In return, we ask for clear and honest information, feedback in good
            time so the work can keep moving, and payment as agreed. We ask that
            the people we deal with treat the studio with the same respect we
            extend to you.
          </p>

          <h2>3. Respect and inclusion</h2>
          <p>
            We work with people regardless of background, belief, gender, age, or
            where they are from, and we expect the same in return. Harassment,
            discrimination, and abuse have no place in how we work. Anyone on the
            team is free to step away from a conversation that crosses that line.
          </p>

          <h2>4. Work we will and will not take</h2>
          <p>
            We take on work we can stand behind. We will decline anything
            unlawful, deceptive, or built to harm or mislead people, and anything
            that asks us to hide who is really behind it. Turning down that kind
            of work is not personal; it is simply where we draw the line.
          </p>

          <h2>5. Keeping your trust</h2>
          <p>
            We will not waste your time, your money, or your trust. We keep your
            information private, we are careful with the access you give us, and
            we hand over full ownership of the work and the accounts at the end,
            as set out in your agreement.
          </p>

          <h2>6. If something goes wrong</h2>
          <p>
            If we fall short, tell us, and we will put it right wherever we can.
            If the working relationship is not working for either side, either of
            us can end it on the terms set out in the signed agreement, calmly and
            without drama.
          </p>

          <h2>7. Contact</h2>
          <p>
            Questions about how we work, or something you would like to raise?
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

export default CodeOfConduct;
