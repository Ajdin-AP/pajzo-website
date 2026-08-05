import React, { useEffect } from 'react';
import { navigate } from '../nav';
import type { PolicyMeta } from './policies';

/* The chrome every app policy shares, so each app file is nothing but its own
   prose. Same .legal styles as the studio's own legal pages, so a visitor
   arriving cold from the App Store still lands somewhere that looks made. */
const PolicyShell = ({
  meta,
  children,
}: {
  meta: PolicyMeta;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const back = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <main id="main" tabIndex={-1} className="section legal">
      <div className="container">
        <div className="legal__wrap">
          <a href="/" className="legal__back" onClick={back}>
            ← Back to Pajzo
          </a>

          <p className="legal__eyebrow">{meta.app} for iPhone</p>
          <h1>Privacy Policy</h1>
          <p className="legal__date">Last updated {meta.updated}</p>

          {children}

          <div className="legal__divider" />
        </div>
      </div>
    </main>
  );
};

export default PolicyShell;
