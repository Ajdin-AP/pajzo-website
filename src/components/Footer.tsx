import React from 'react';
import { navigate } from '../nav';
import { Instagram, XLogo, Facebook, LinkedIn, Wordmark } from './icons';

// The site sections live in the nav bar, so the footer lists the policies here.
const POLICIES = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Cookie Policy', path: '/cookie-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Refund Policy', path: '/refund-policy' },
  { label: 'Code of Conduct', path: '/code-of-conduct' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/pajzo_/', Icon: Instagram },
  { label: 'X', href: 'https://x.com/Pajzo_', Icon: XLogo },
  { label: 'Facebook', href: 'https://www.facebook.com/pajzo', Icon: Facebook },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/pajzo', Icon: LinkedIn },
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
          {/* left: policies */}
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

          {/* middle: social */}
          <div className="footer__col footer__social-col">
            <div className="footer__socials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  className="footer__social"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* right: brand, right-aligned */}
          <div className="footer__brand">
            <span className="wordmark">
              <Wordmark />
            </span>
            <p className="footer__tagline">Built for the long haul.</p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
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
