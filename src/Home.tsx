import { Suspense, lazy } from 'react';
import Hero from './components/Hero';

// Lazy Load Heavy/Below-Fold Components
const Stats = lazy(() => import('./components/Stats'));
const Services = lazy(() => import('./components/Services'));
const Process = lazy(() => import('./components/Process'));
const Video = lazy(() => import('./components/Video'));
const Impact = lazy(() => import('./components/Impact'));
const FAQ = lazy(() => import('./components/FAQ'));
const TechStack = lazy(() => import('./components/TechStack'));
const Works = lazy(() => import('./components/Works'));
const Partners = lazy(() => import('./components/Partners'));
const AISection = lazy(() => import('./components/AISection'));

// Loading Fallback (for lazy loaded chunks after splash)
const SectionLoader = () => (
    <div style={{ height: '20vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '2px', background: '#eee' }}></div>
    </div>
);

const Home = () => {
    return (
        <main>
            {/* Hero is NOT lazy loaded so shaders can compile behind splash screen */}
            <Hero />

            <Suspense fallback={<SectionLoader />}>
                {/* Services first now that Platforms/Partners is moved */}
                <Services />

                <Stats />

                <Works />

                <Process />

                {/* Moved reentry divider to AFTER Video */}
                <Video />

                <Impact />

                <TechStack />

                <AISection />

                <Partners />

                <FAQ />
            </Suspense>
        </main>
    );
};

export default Home;
