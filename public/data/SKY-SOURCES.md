# Sky catalogue

The bundled `app/data/sky-catalog.json` is derived from Olaf Frohn's
[d3-celestial](https://github.com/ofrohn/d3-celestial), retrieved 2026-09-09:
`data/constellations.lines.json`, `data/constellations.json`, `data/stars.8.json`
and `data/starnames.json`. Distributed under the accompanying
[BSD 3-Clause license](./d3-celestial-LICENSE.txt).

The upstream catalogue credits the Hipparcos catalogue (ESA, 1997), the
Hipparcos new reduction (van Leeuwen, 2007), and astronomical name cross-indices.
See its README for the full source bibliography. Existing 23 stars retain their
Bright Star Catalogue V/50 data and identities.

Adaptations: retain line endpoints and their matching catalogue stars; normalize
right ascension to 0–360 degrees; combine Serpens Caput and Cauda into one of the
88 constellations; add Vietnamese labels. Rebuild with
`node scripts/generate-sky-catalog.mjs` after putting those upstream files in
`output/sky-source/`. The raw downloads are not needed to run or build the app.

Coordinates are J2000 angular directions, with no proper-motion correction.
Connecting lines are illustrative stick figures, not IAU boundaries or physical
connections. The decorative faint star background is not a star catalogue.
Only the part of the celestial sphere facing the camera is visible at once.
