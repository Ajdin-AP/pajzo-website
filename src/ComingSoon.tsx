import { useCallback, useEffect, useRef, useState } from 'react';
import { Wordmark, Instagram, XLogo } from './components/icons';

// The intro animation occupies only the first ~6.5s of the 30s source file;
// the remaining ~23s is blank. Loop the active range so the page never shows
// the empty tail.
const LOOP_END = 6.5;

const ComingSoon = ({
  checkPassword,
}: {
  checkPassword: (input: string) => boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const closePrompt = useCallback(() => {
    setPromptOpen(false);
    setPw('');
    setError(false);
  }, []);

  // Loop just the active portion of the intro video.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;
    const tick = () => {
      if (video.currentTime >= LOOP_END) video.currentTime = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close the password prompt on Escape.
  useEffect(() => {
    if (!promptOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePrompt();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [promptOpen, closePrompt]);

  return (
    <main className="coming">
      <div className="coming__inner">
        <span className="coming__mark" onDoubleClick={() => setPromptOpen(true)}>
          <Wordmark />
        </span>

        <p className="coming__eyebrow">Founder-led marketing studio</p>

        <h1 className="coming__sr-title">Pajzo is coming soon</h1>

        <video
          ref={videoRef}
          className="coming__video"
          src="/Pajzo_Intro_Animation.mp4"
          autoPlay
          muted
          playsInline
          aria-hidden="true"
        />

        <div className="coming__contact">
          <span className="coming__contact-label">Want to talk before we launch?</span>
          <a className="coming__mail" href="mailto:info@pajzo.com">
            info@pajzo.com
          </a>
        </div>

        <div className="coming__socials">
          <a
            className="coming__social"
            href="https://www.instagram.com/pajzo_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram />
          </a>
          <a
            className="coming__social"
            href="https://x.com/Pajzo_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <XLogo />
          </a>
        </div>
      </div>

      <p className="coming__tag">Built for the long haul.</p>

      {promptOpen && (
        <div className="coming__lock" onClick={closePrompt}>
          <form
            className="coming__lock-box"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!checkPassword(pw)) setError(true);
            }}
          >
            <label className="coming__lock-label" htmlFor="coming-pw">
              Enter password
            </label>
            <input
              id="coming-pw"
              type="password"
              className={`coming__lock-input${error ? ' is-error' : ''}`}
              placeholder="••••••••"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError(false);
              }}
              autoFocus
              autoComplete="off"
            />
          </form>
        </div>
      )}
    </main>
  );
};

export default ComingSoon;
