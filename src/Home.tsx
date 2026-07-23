import type { OpenModal } from './App';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Studio from './components/Studio';
import Faq from './components/FAQ';
import Cta from './components/Cta';

const Home = ({ openModal }: { openModal: OpenModal }) => (
  <main id="main" tabIndex={-1}>
    <Hero openModal={openModal} />
    <Marquee />
    <Services />
    <Studio />
    <Faq />
    <Cta openModal={openModal} />
  </main>
);

export default Home;
