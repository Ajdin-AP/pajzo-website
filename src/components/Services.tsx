import React, { useRef } from 'react';
import { navigate } from '../nav';
import { ArrowRight } from './icons';
import ServicePreview from './ServicePreview';

// id drives the 3D preview; slug is the service page each row opens.
const ROWS = [
  {
    id: 'web',
    slug: 'web-development',
    name: 'Web development',
    desc: 'Sites and web apps, designed and built by one team.',
  },
  {
    id: 'app',
    slug: 'app-development',
    name: 'App development',
    desc: 'Native iPhone, iPad and Mac apps in SwiftUI.',
  },
  {
    id: 'branding',
    slug: 'branding',
    name: 'Branding',
    desc: 'A name people remember, and a mark that survives being small.',
  },
  {
    id: 'design',
    slug: 'design',
    name: 'Design',
    desc: 'Interfaces and graphics, drawn by people who build.',
  },
];

const Services = () => {
  const listRef = useRef<HTMLDivElement>(null);

  const goTo = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    navigate(`/services/${slug}`);
  };

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
            <a
              key={row.id}
              href={`/services/${row.slug}`}
              data-svc={row.id}
              className="svc__row reveal"
              data-delay={i % 2 ? '1' : undefined}
              onClick={(e) => goTo(e, row.slug)}
              aria-label={`${row.name}: view the service`}
            >
              <span className="svc__num">0{i + 1}</span>
              <span className="svc__name">{row.name}</span>
              <span className="svc__body">
                <span className="svc__desc">{row.desc}</span>
              </span>
              <span className="svc__go" aria-hidden="true">
                <ArrowRight />
              </span>
            </a>
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
