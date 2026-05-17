import type { OpenModal } from './App';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Approach from './components/Approach';
import Services from './components/Services';
import FoundingOffer from './components/FoundingOffer';
import Process from './components/Process';
import About from './components/About';
import Faq from './components/FAQ';
import Cta from './components/Cta';

const Home = ({ openModal }: { openModal: OpenModal }) => (
  <main id="main" tabIndex={-1}>
    <Hero openModal={openModal} />
    <Problem />
    <Approach />
    <Services openModal={openModal} />
    <FoundingOffer openModal={openModal} />
    <Process />
    <About />
    <Faq />
    <Cta openModal={openModal} />
  </main>
);

export default Home;
