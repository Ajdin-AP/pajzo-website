import { useRef } from 'react';
import { ArrowRight } from './icons';
import ServicePreview from './ServicePreview';
import type { OpenModal } from '../App';

// ids match the service options in ContactModal.
const ROWS = [
  {
    id: 'web',
    name: 'Web development',
    desc: 'Marketing sites, product sites and web apps, designed and built by one team. Fast, accessible, free of page-builder bloat. You receive a site worth sending people to, and a codebase that is entirely yours.',
    tags: ['React', 'TypeScript', 'CMS', 'Hosting & DNS'],
  },
  {
    id: 'app',
    name: 'App development',
    desc: 'Native iPhone, iPad and Mac apps in SwiftUI, designed for the platform rather than ported to it. One team carries it from first sketch to the App Store. The app you approved is the app that ships.',
    tags: ['SwiftUI', 'iOS & macOS', 'Widgets', 'App Store'],
  },
  {
    id: 'branding',
    name: 'Branding',
    desc: 'A name people remember, a mark that survives being small, and plain rules for using both. You receive a short, useful guide, not a ninety-page brand book nobody opens.',
    tags: ['Logo & mark', 'Type & colour', 'Naming', 'Usage guide'],
  },
  {
    id: 'design',
    name: 'Design',
    desc: 'Interfaces, layouts and graphics, for products that exist or ones still on paper. Drawn by people who build for a living. What you approve is what can be made.',
    tags: ['UI / UX', 'Design systems', 'Graphics', 'Print & digital'],
  },
];

const Services = ({ openModal }: { openModal: OpenModal }) => {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section svc">
      <div className="container">
        <div className="s-head reveal">
          <p className="tag">
            <span className="tag__num">01</span>&nbsp;/&nbsp;Services
          </p>
          <h2 className="h-section">
            Four disciplines. One <em>desk</em>.
          </h2>
          <p className="lede">
            No departments. No juniors. No outsourcing. Everything here is
            done in-house, and nothing makes the list unless we can stand
            behind it completely.
          </p>
        </div>

        <div className="svc__list" ref={listRef}>
          {ROWS.map((row, i) => (
            <button
              type="button"
              key={row.id}
              data-svc={row.id}
              className="svc__row reveal"
              data-delay={i % 2 ? '1' : undefined}
              onClick={() => openModal(row.id)}
              aria-label={`${row.name}: start a project`}
            >
              <span className="svc__num">0{i + 1}</span>
              <span className="svc__name">{row.name}</span>
              <span className="svc__body">
                <span className="svc__desc">{row.desc}</span>
                <span className="svc__tags">
                  {row.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
              </span>
              <span className="svc__go" aria-hidden="true">
                <ArrowRight />
              </span>
            </button>
          ))}
          <ServicePreview listRef={listRef} />
        </div>

        <p className="svc__foot reveal">
          <b>Every quote is fixed, in writing,</b> and agreed before work
          starts.
        </p>
      </div>
    </section>
  );
};

export default Services;
