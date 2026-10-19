# The Next Chapter

A faith-centered love letter from Austin to Adrienne — our story, the promises I'm practicing, and the future I'm preparing for.

Built mobile-first and installable as an app, since it's mostly read on a phone.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Install on a phone

Open the live site in Safari, tap **Share → Add to Home Screen**. It opens full screen with its own icon, and pages already visited still load with a weak signal.

## Where things live

| What | Where |
| --- | --- |
| Section text, timeline, the dates list | `src/data/content.js` |
| 100 Reasons | `src/data/reasons.json` |
| Photos in the "Our Moments" strip | `src/assets/` — import in `src/components/PhotoSlider.jsx` and add to `photos` |
| Colors and fonts | `src/index.css` (`--oxblood`, `--gold`, `--ivory`, …) |
| Section order on the home page | `src/pages/Home.jsx` |
| Chapter numbers | `<ChapterMark number="…" />` at the top of each section |
| App name, icons, offline behavior | `public/manifest.webmanifest`, `public/icon-*.png`, `public/sw.js` |

### Adding a date

Append to `datesArray` in `src/data/content.js` with the next `id`:

```js
{ id: 36, name: "Somewhere new" },
```

### Changing the app icon

Edit `public/favicon.svg`; the PNG icons are rendered from it at 64, 180, 192, and 512 px.

## Pages

- `/` — the letter
- `/letters` — letters
- `/when-youre-ready` — when you're ready

Built with React, Vite, and Framer Motion.
