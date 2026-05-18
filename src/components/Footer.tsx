import React from 'react';
import { navigate } from '../nav';
import { Instagram, XLogo, Mail, Wordmark } from './icons';

const Footer = () => {
  const year = new Date().getFullYear();

  const goLegal = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="wordmark">
              <Wordmark />
            </span>
            <p className="footer__tagline">Built for the long haul.</p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
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
          <p className="footer__legal">© {year} Pajzo · S.p.</p>
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
    </footer>
  );
};

export default Footer;
