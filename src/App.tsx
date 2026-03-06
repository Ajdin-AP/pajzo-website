import { useState, Suspense, lazy, useEffect } from 'react';
import styled from 'styled-components';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import SmoothScroll from './components/SmoothScroll';
import Home from './Home';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

import { FloatingChat } from './components/FloatingChat';

// Lazy Load Contact Interface (Modal)
const Contact = lazy(() => import('./components/Contact'));

const CyberBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    z-index: -1;
    pointer-events: none;
`;

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);

    // Check initial path
    setCurrentPath(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    // Force ScrollTrigger refresh on load to ensure accurate pinning
    // Wait for splash screen animation + a buffer
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Delay refresh slightly to allow DOM to settle after splash fade
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);

    }, 1200); // 1.2s Fast load for snappy feel

    return () => clearTimeout(timer);
  }, []);

  // Simple routing logic
  let content;
  if (currentPath === '/privacy-policy') {
    content = <PrivacyPolicy />;
  } else if (currentPath === '/terms-of-service') {
    content = <TermsOfService />;
  } else {
    content = <Home />;
  }

  return (
    <div className="app-root">
      <SplashScreen isLoading={isLoading} />
      <CyberBackground />
      <Header onOpenForm={openForm} />
      <SmoothScroll />

      {content}

      <Footer onOpenForm={openForm} />

      <Suspense fallback={null}>
        <Contact isOpen={isFormOpen} onClose={closeForm} />
      </Suspense>

      <FloatingChat />
    </div>
  );
}

export default App;
