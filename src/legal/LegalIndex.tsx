import React, { useEffect } from 'react';
import { navigate } from '../nav';
import { POLICIES } from './policies';

/* The landing point for every app policy. Unlisted: no nav entry and no
   sitemap line, so it is reached by the URL printed on a store listing rather
   than by browsing the studio site. */
const LegalIndex = () => {
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

          <h1>App privacy policies</h1>
          <p className="legal__date">Pajzo apps</p>

          <p>
            Each app Pajzo publishes keeps its own privacy policy, because each
            one handles different data. Pick the app you are using.
          </p>

          <ul className="legal__index">
            {POLICIES.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/legal/${p.slug}`}
                  onClick={(e) => go(e, `/legal/${p.slug}`)}
                >
                  <span className="legal__index-app">{p.app}</span>
                  <span className="legal__index-note">{p.summary}</span>
                  <span className="legal__index-date">
                    Updated {p.updated}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p>
            Looking for the policy that covers this website rather than an app?
            That is the{' '}
            <a
              className="inline"
              href="/privacy-policy"
              onClick={(e) => go(e, '/privacy-policy')}
            >
              Pajzo privacy policy
            </a>
            .
          </p>

          <div className="legal__divider" />
        </div>
      </div>
    </main>
  );
};

export default LegalIndex;
