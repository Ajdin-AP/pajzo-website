import React, { useEffect } from 'react';
import { navigate } from './nav';
import { ArrowRight } from './components/icons';
import type { OpenModal } from './App';

// ------------------------------------------------------------------
// /services/<slug> — a real page for each of the four disciplines,
// reached from the home services list (no longer a jump to contact).
// ------------------------------------------------------------------

type Service = {
  num: string;
  name: string;
  lead: string;
  intro: string[];
  included: { t: string; n: string }[];
  approach: string[];
  deliverables: string[];
  stack: string[];
};

export const SERVICE_ORDER = [
  'web-development',
  'app-development',
  'branding',
  'design',
] as const;

export const SERVICES: Record<string, Service> = {
  'web-development': {
    num: '01',
    name: 'Web development',
    lead: 'Marketing sites, product sites and web apps, designed and built by one team.',
    intro: [
      'Design and code sit at the same desk, so the site you approve is the site that goes live, down to the last detail. It is fast, accessible, and free of page-builder bloat.',
      'You receive a site worth sending people to, and a codebase that is entirely yours.',
    ],
    included: [
      { t: 'Design and build together', n: 'One team from the first sketch to the deployed site, so nothing is lost in a handoff.' },
      { t: 'Fast by default', n: 'Hand-written code rather than a page builder. It loads quickly and stays quick as it grows.' },
      { t: 'Accessible and findable', n: 'Keyboard and screen-reader friendly, with the SEO basics done properly.' },
      { t: 'Edit it yourself', n: 'A content system where it helps, so you can change words and images without calling us.' },
      { t: 'Yours from day one', n: 'The domain, the hosting and the code are in your name from the start.' },
      { t: 'A plain guide', n: 'A short, human explanation of how to run and change what we built.' },
    ],
    approach: [
      'We build with a modern, dependable stack: React and TypeScript, a real component system, and a codebase any competent developer can pick up later. No lock-in, no proprietary editor holding your site hostage.',
      'Every checkpoint is a live link you can click on your own devices, never a picture of a screen. You react while change is still cheap, and the delivery date stays honest.',
    ],
    deliverables: [
      'The finished site or web app',
      'The full source code',
      'A content system where it fits',
      'Hosting and DNS in your name',
      'A plain written guide',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Headless CMS', 'Accessibility', 'Hosting & DNS'],
  },
  'app-development': {
    num: '02',
    name: 'App development',
    lead: 'Native iPhone, iPad and Mac apps in SwiftUI, designed for the platform rather than ported to it.',
    intro: [
      'One team carries the app from the first sketch to the App Store. It is built for the device it runs on, so it feels native because it is.',
      'The app you approved is the app that ships.',
    ],
    included: [
      { t: 'Native, not wrapped', n: 'Written in SwiftUI for Apple platforms, not a web page in a shell. It behaves the way people expect.' },
      { t: 'Designed for the platform', n: 'Gestures, layout and detail that follow the platform’s own conventions.' },
      { t: 'One team, end to end', n: 'The same hands design it, build it, and submit it.' },
      { t: 'Widgets and system touches', n: 'Home-screen widgets and platform extras where they earn their place.' },
      { t: 'Onto the store', n: 'We handle the App Store submission and the review back-and-forth.' },
      { t: 'Yours to keep', n: 'The source and the developer accounts stay in your name.' },
    ],
    approach: [
      'We build the app the platform wants, not the cheapest common denominator across platforms. It launches faster, feels right in the hand, and ages well as Apple moves.',
      'You test real builds on your own device throughout, so nothing about the finished app is a surprise.',
    ],
    deliverables: [
      'The shipped app',
      'The full source code',
      'App Store submission handled',
      'Widgets where they help',
      'A plain written guide',
    ],
    stack: ['SwiftUI', 'iOS & iPadOS', 'macOS', 'Widgets', 'App Store'],
  },
  branding: {
    num: '03',
    name: 'Branding',
    lead: 'A name people remember, a mark that survives being small, and plain rules for using both.',
    intro: [
      'Branding here is practical. You receive a short, useful guide, not a ninety-page book nobody opens.',
      'Everything is made to be used, by you, in the real world.',
    ],
    included: [
      { t: 'A mark that works small', n: 'A logo that still reads at favicon size and prints in a single colour.' },
      { t: 'Type and colour', n: 'A tight palette and typefaces that hold up across everything you make.' },
      { t: 'A name, if you need one', n: 'Naming that is available, sayable, and yours to own.' },
      { t: 'Plain usage rules', n: 'A short guide anyone on your side can follow without a design degree.' },
      { t: 'Files that fit', n: 'Every format you actually need, organised, not a folder to decode.' },
      { t: 'Room to grow', n: 'A system that stretches to new things without breaking.' },
    ],
    approach: [
      'We start from where the brand lives hardest: a phone screen, a sign, a single-colour print. If the mark survives the difficult cases, the easy ones take care of themselves.',
      'The goal is not a brand book to admire. It is a set of tools you will still be using in five years.',
    ],
    deliverables: [
      'Logo and mark in every format',
      'A type and colour system',
      'A short usage guide',
      'Editable source files',
    ],
    stack: ['Logo & mark', 'Type & colour', 'Naming', 'Usage guide'],
  },
  design: {
    num: '04',
    name: 'Design',
    lead: 'Interfaces, layouts and graphics, for products that exist or ones still on paper.',
    intro: [
      'Drawn by people who build for a living, so what you approve is what can actually be made.',
      'No beautiful screens that fall apart the moment someone tries to build them.',
    ],
    included: [
      { t: 'Interfaces that ship', n: 'UI and UX drawn with the real constraints in mind, ready to be built.' },
      { t: 'A system, not just screens', n: 'Reusable components so the product stays consistent as it grows.' },
      { t: 'Graphics and layout', n: 'From a single asset to a full set, for print and screen.' },
      { t: 'Grounded in the buildable', n: 'Every design is something we or your team can make, at the sizes it will really appear.' },
      { t: 'Source you can use', n: 'Organised files, not a flattened image you cannot edit.' },
      { t: 'One voice throughout', n: 'Design that matches the brand and the build, not three studios pulling apart.' },
    ],
    approach: [
      'Design and engineering sit together, so a layout is pressure-tested against the real product before you sign off. The gap between the mockup and the built thing is where projects go wrong, and we close it early.',
      'You get design that respects both the person using it and the person building it.',
    ],
    deliverables: [
      'The finished designs',
      'A design system where it fits',
      'Organised, editable source files',
      'Assets for print and screen',
    ],
    stack: ['UI / UX', 'Design systems', 'Graphics', 'Print & digital'],
  },
};

const ServicePage = ({ slug, openModal }: { slug: string; openModal: OpenModal }) => {
  const service = SERVICES[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sv .reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  if (!service) return null;

  const others = SERVICE_ORDER.filter((s) => s !== slug);
  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <main id="main" tabIndex={-1} className="sv">
      {/* hero */}
      <section className="sv__hero">
        <div className="container">
          <p className="tag reveal">
            <span className="tag__num">Service {service.num}</span>
          </p>
          <h1 className="sv__h1 reveal">{service.name}</h1>
          <p className="lede sv__lead reveal" data-delay="1">
            {service.lead}
          </p>
          <div className="sv__intro reveal" data-delay="2">
            {service.intro.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <div className="sv__hero-cta reveal" data-delay="2">
            <button className="btn btn--solid btn--lg" onClick={() => openModal(slug)}>
              Start a project
              <ArrowRight />
            </button>
            <a href="/portfolio" className="btn btn--ghost btn--lg" onClick={(e) => go(e, '/portfolio')}>
              See the work
            </a>
          </div>
        </div>
      </section>

      {/* what's included */}
      <section className="sv__block">
        <div className="container">
          <div className="sv__block-grid">
            <div className="sv__block-side">
              <h2 className="h-section reveal">What&rsquo;s included.</h2>
            </div>
            <div className="sv__included">
              {service.included.map((item, i) => (
                <div className="sv__inc reveal" data-delay={String(Math.min(i % 2, 3))} key={item.t}>
                  <h3>{item.t}</h3>
                  <p>{item.n}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* approach */}
      <section className="sv__block sv__block--split">
        <div className="container">
          <div className="sv__block-grid">
            <div className="sv__block-side">
              <h2 className="h-section reveal">How we work.</h2>
            </div>
            <div className="sv__approach">
              <div className="sv__prose reveal">
                {service.approach.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              <ul className="sv__stack reveal" data-delay="1">
                {service.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* deliverables */}
      <section className="sv__block">
        <div className="container">
          <div className="sv__block-grid">
            <div className="sv__block-side">
              <h2 className="h-section reveal">What you walk away with.</h2>
              <p className="sv__side-note reveal" data-delay="1">
                Every quote is fixed, in writing, and agreed before work starts.
              </p>
            </div>
            <ol className="sv__deliver">
              {service.deliverables.map((d, i) => (
                <li className="sv__del reveal" data-delay={String(Math.min(i % 2, 3))} key={d}>
                  <span className="sv__del-num">{String(i + 1).padStart(2, '0')}</span>
                  {d}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* other services */}
      <section className="sv__others">
        <div className="container">
          <p className="tag reveal">
            <span className="tag__num">More</span>&nbsp;/&nbsp;The other disciplines
          </p>
          <div className="sv__others-list">
            {others.map((s) => (
              <a
                key={s}
                href={`/services/${s}`}
                className="sv__other reveal"
                onClick={(e) => go(e, `/services/${s}`)}
              >
                <span className="sv__other-num">{SERVICES[s].num}</span>
                <span className="sv__other-name">{SERVICES[s].name}</span>
                <span className="sv__other-go" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="sv__close">
        <div className="container">
          <h2 className="sv__close-head reveal">
            Start with an <em>email</em>.
          </h2>
          <div className="sv__hero-cta reveal" data-delay="1">
            <button className="btn btn--solid btn--lg" onClick={() => openModal(slug)}>
              Start a project
              <ArrowRight />
            </button>
            <a href="/process" className="btn btn--ghost btn--lg" onClick={(e) => go(e, '/process')}>
              How we work
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicePage;
