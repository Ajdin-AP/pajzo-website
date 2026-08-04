# NOCTURNE Automobiles — The Night Exhibition

A one-page website for a fictional luxury car dealership, staged as a museum at night.
Concept: **Midnight Gallery** — one work under one tungsten light, cars as sculpture,
every section a numbered gallery room.

## Stack

- Vanilla HTML / CSS / JS — no build step, no framework.
- Three.js r170, vendored locally in `vendor/` (no CDN dependency at runtime).
- Fonts: Fraunces / Archivo / IBM Plex Mono via Google Fonts (graceful serif/sans fallbacks offline).

## The 3D cars

All four cars are **procedurally generated** in `js/cars.js` — no model files.
Each body is an extruded side-profile silhouette (rounded-corner spline → `ExtrudeGeometry`
with soft outward bevels; the drawn profile is pre-inset so the fattest mid-section lands on
the authored coordinates). Clearcoat physical paint, dark glass canopies, turbine wheels with
brass calipers, emissive light bars. The same profile splines are re-used as the brass
"etching" line drawings in the catalogue (Room II) and as booking marks (Room V) via
`profileSVG()`.

- No. 01 — Vermilion Study (grand tourer)
- No. 02 — Basalt Longtail (hypercar, swan-neck wing)
- No. 03 — The Citadel (sport estate)
- No. 04 — Solstice Speedster (roadster)

## Rooms

I The Exhibition — live Three.js showroom: orbit (drag), model switching staged as an
  unveiling (light dims → work sinks → dark → next silhouette rises, headlamps flicker),
  five-lacquer paint configurator with a specular sweep, LAMPLIGHT toggle, three
  "sightline" preset viewpoints, volumetric tungsten cone, dust, real planar floor
  reflection (`Reflector` under a radial veil).
II The Permanent Collection — catalogue plates; the stills are **rendered offscreen from
  the same scene** at load. Self-drawing profile etchings.
III Curator's Notes. IV Acquisition & Patronage — live finance ledger, odometer-rolling
  monthly figure. V Private Viewing — booking form. VI Provenance. VII Visitor information.

## Files

- `index.html` — structure, import map
- `css/style.css` — the whole design system (brass on soot-black, hairlines, Fraunces)
- `js/cars.js` — procedural car factory + specs + paints + SVG profiles
- `js/showroom.js` — the gallery scene, lighting, rituals, offscreen catalogue renders
- `js/main.js` — loader, cursor, clock, rails, plates, ledger, booking
- `test-cars.html` — dev rig for the car factory (`?view=profile&car=0..3`, `__showCar(n)`)

## Run

Any static server from this directory, e.g. `python3 -m http.server 8000`.
Note (this Mac): the preview server sandbox cannot read `~/Documents` — copy the folder to
`/tmp` and serve from there (see the `showroom` entry in `~/Desktop/.claude/launch.json`).

## Notes

- Intro lighting sequence plays once per session (`sessionStorage`), skipped entirely for
  `prefers-reduced-motion` (auto-orbit off, crossfade switches).
- Orbit zoom is deliberately disabled so the mouse wheel scrolls the page.
- Everything caps at `devicePixelRatio ≤ 1.5`, ACES tone mapping.
