# France War Trails — Iepe & Sietze

A father-son road trip companion for visiting the war memorials, museums and
battlefields of France (mainly the D-Day / Normandy coast). A PWA built with
**React**, **TypeScript**, **Vite**, **Tailwind CSS** and **Leaflet**.

Tap a marker on the map, or pick a stop from the list to fly straight to it.
Tap the circle next to a name to mark it visited as you go.

## Commands

```sh
npm install       # install dependencies
npm run dev       # start dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # run eslint
npm run deploy    # build and publish with gh-pages
```

## Project structure

- `src/data/stops.ts` — all the stops (coordinates, area, category, glyph)
- `src/locales/{en,nl}/translation.json` — UI strings + stop names/blurbs/tips
- `src/components/` — map, stop list, stamps, progress bar, language picker
