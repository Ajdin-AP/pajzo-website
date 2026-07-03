import React from 'react';
import { navigate } from '../nav';
import { scrollToId } from '../scroll';
import { Instagram, XLogo, Mail, Wordmark } from './icons';

const SITE_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Studio', id: 'studio' },
  { label: 'Process', id: 'process' },
  { label: 'FAQ', id: 'faq' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  const goLegal = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  // Section links work from the legal pages too: go home first, then scroll.
  const goSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    } else {
      scrollToId(id);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="wordmark">
              <Wordmark />
            </span>
            <p className="footer__tagline">
              An independent digital studio. Websites, apps, branding and
              design.
            </p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
          </div>

          <div className="footer__col">
            <h4>Site</h4>
            <div className="footer__links">
              {SITE_LINKS.map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={(e) => goSection(e, l.id)}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h4>Elsewhere</h4>
            <div className="footer__socials">
              <a
                className="footer__social"
                href="https://www.instagram.com/pajzo_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                className="footer__social"
                href="https://x.com/Pajzo_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <XLogo />
              </a>
              <a className="footer__social" href="mailto:info@pajzo.com" aria-label="Email">
                <Mail />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">© {year} Pajzo · s.p. · Domžale, Slovenia</p>
          <div className="footer__legal-links">
            <a href="/privacy-policy" onClick={(e) => goLegal(e, '/privacy-policy')}>
              Privacy Policy
            </a>
            <a href="/terms-of-service" onClick={(e) => goLegal(e, '/terms-of-service')}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="footer__giant" aria-hidden="true">
        <Wordmark keyline={false} />
      </div>
    </footer>
  );
};

export default Footer;
