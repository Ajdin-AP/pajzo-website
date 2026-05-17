import React from 'react';
import { navigate } from '../nav';
import type { OpenModal } from '../App';

const Footer = ({ openModal }: { openModal: OpenModal }) => {
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
              Pajzo<span className="dot">.</span>
            </span>
            <p className="footer__tagline">
              Built for the long haul. A founder-led marketing studio for owners
              who&rsquo;ve been let down before.
            </p>
            <a className="footer__mail" href="mailto:info@pajzo.com">
              info@pajzo.com
            </a>
          </div>

          <div className="footer__col">
            <h4>Studio</h4>
            <a href="/#approach">How we work</a>
            <a href="/#services">Pricing</a>
            <a href="/#process">Process</a>
            <a href="/#about">About</a>
          </div>

          <div className="footer__col">
            <h4>Start</h4>
            <button onClick={() => openModal('audit')}>Marketing Audit</button>
            <button onClick={() => openModal('strategy')}>Strategy Session</button>
            <button onClick={() => openModal()}>Get in touch</button>
          </div>

          <div className="footer__col">
            <h4>Elsewhere</h4>
            <a href="https://www.instagram.com/pajzo_/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://x.com/Pajzo_" target="_blank" rel="noopener noreferrer">
              X / Twitter
            </a>
            <a href="mailto:info@pajzo.com">Email</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            © {year} Pajzo · Samostojni podjetnik · Domžale, Slovenia
          </p>
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
