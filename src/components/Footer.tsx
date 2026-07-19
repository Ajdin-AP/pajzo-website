import React from 'react';
import { navigate } from '../nav';
import { Instagram, XLogo, Mail, Wordmark } from './icons';

// The site sections live in the nav bar, so the footer lists the policies here
// instead (it used to duplicate the nav under a "Site" heading).
const POLICIES = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Cookie Policy', path: '/cookie-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Refund Policy', path: '/refund-policy' },
  { label: 'Code of Conduct', path: '/code-of-conduct' },
];

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
            <p className="footer__tagline">
              An independent digital studio. Websites, apps, branding and
              design.
            </p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
          </div>

          <div className="footer__col">
            <h4>Policies</h4>
            <div className="footer__links">
              {POLICIES.map((l) => (
                <a key={l.path} href={l.path} onClick={(e) => goLegal(e, l.path)}>
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
        </div>
      </div>

      <div className="footer__giant" aria-hidden="true">
        <Wordmark />
      </div>
    </footer>
  );
};

export default Footer;
