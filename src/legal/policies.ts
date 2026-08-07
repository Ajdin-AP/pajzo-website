import type { ComponentType } from 'react';

/* ---- app privacy policies ----
   Every app Pajzo ships to a store needs its own policy at a stable public
   URL, because Apple prints that URL on the product page and rechecks it
   later. They live under /legal rather than in the nav: unlisted, not hidden.
   A policy behind a login, or one that moves, fails review.

   Adding an app is two steps: a file next to this one, and an entry below.
   Keep `updated` in sync with the date printed on the page itself, and give
   each app its own policy rather than sharing one. Apple cross-checks the
   text against the App Privacy labels you declare, and a shared policy that
   claims data collection an app does not do is a rejection waiting to
   happen. */
export type PolicyMeta = {
  /** the URL segment: /legal/<slug> */
  slug: string;
  app: string;
  /** shown under the app name on the index */
  summary: string;
  /** human date, printed on the page */
  updated: string;
  load: () => Promise<{ default: ComponentType }>;
};

export const POLICIES: PolicyMeta[] = [
  {
    slug: 'luniva',
    app: 'Luniva',
    summary:
      'Prayer times, Qur’an, dhikr and daily reflection for iPhone. Nothing leaves the device.',
    updated: '7 August 2026',
    load: () => import('./LunivaPolicy'),
  },
];

export const policyFor = (slug: string) => POLICIES.find((p) => p.slug === slug);

/** '/legal/luniva' -> 'luniva'; anything else -> '' */
export const legalSlug = (path: string) =>
  path.startsWith('/legal/') ? path.slice('/legal/'.length) : '';
