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
  { label: 'Facebook', href: 'https://www.facebook.com/XpajzoX', Icon: Facebook },
  // the profile slug contains a ć; percent-encoded so the link survives
  // being copied out of the page into things that do not encode it themselves
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ajdin-pajazetovi%C4%87-96b19540a', Icon: LinkedIn },
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
          {/* left: brand */}
          <div className="footer__brand">
            <span className="wordmark">
              <Wordmark />
            </span>
            <p className="footer__tagline">Built for the long haul.</p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
          </div>

          {/* middle: social, centered */}
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

          {/* right: policies, right-aligned */}
          <div className="footer__col footer__policies">
            <h4>Policies</h4>
            <div className="footer__links">
              {POLICIES.map((l) => (
                <a key={l.path} href={l.path} onClick={(e) => goLegal(e, l.path)}>
                  {l.label}
                </a>
              ))}
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
