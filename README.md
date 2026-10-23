# The Next Chapter

A faith-centered love letter from Austin to Adrienne: our story, the promises I'm practicing, and the future I'm preparing for.

The site is built **mobile-first** and **installs like an app**, because it's mostly read on a phone. It should feel like a book you hold, not a website you visit.

---

## Quick start

```bash
npm install
npm run dev       # local dev server at http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

Requires Node 20+.

### Testing on a real phone

Most of what makes the site feel native (tap response, the notch, the home indicator, swipe physics) **doesn't show up in desktop browser emulation**. Check changes on the phone itself:

```bash
npm run dev -- --host     # prints a Network URL like http://192.168.1.20:5173
```

Open that URL on the phone while it's on the same Wi-Fi. To debug, connect the iPhone by cable, then use Safari on the Mac → **Develop** → the phone.

---

## Install on a phone

Open the live site in **Safari → Share → Add to Home Screen**.

- It opens full screen with its own red-and-gold book icon, with no browser bars.
- The top bar stays clear of the notch / Dynamic Island, and the bottom stays clear of the home indicator.
- Pages already visited still open with a weak signal or offline.
- Updates show up the next time it's opened. Pages always try the network first.

The pieces: `public/manifest.webmanifest` (name, colors, icons), `public/sw.js` (offline caching), and the `apple-*` meta tags in `index.html`. The service worker only registers in production builds (`src/main.jsx`), so it never caches anything during development.

---

## Design

### The look

Deep red cover, gold leaf, ivory pages. The home page opens on a gold-framed book cover, and each section reads as a chapter of the story.

| Token | Value | Used for |
| --- | --- | --- |
| `--oxblood` | `#6B1A1F` | Cover, dark sections, headings on light |
| `--oxblood-deep` | `#4E1115` | Deeper dark sections (Prayer) |
| `--gold` / `--gold-light` | `#B8893B` / `#D9B46A` | Accents, eyebrows, ornaments |
| `--gold-gradient` | light → deep gold | Raised gold lettering on the cover |
| `--ivory` | `#F7F1E6` | Page background |

All colors are tokens in `src/index.css`. Change them there and the whole site follows.

**Type:** Playfair Display for the cover title and chapter labels, Cormorant Garamond for section headings, and Inter for body text.

**Ornament:** the gold line–star–line flourish (`<Ornament />` in `src/components/ChapterMark.jsx`) appears under the cover title and with every chapter label.

### Chapters

| Chapter | Section |
| --- | --- |
| I | Dear Adrienne (the letter) |
| II | Our Story (timeline + the dates) |
| — | Our Moments (photo strip, an interlude) |
| III | What I Love About You |
| IV | The Husband I Want To Be |
| V | Love Looks Like Preparation |
| VI | Promises I Am Practicing |
| — | The Endgame |
| VII | Already Building Our Future |
| VIII | 100 Reasons |
| IX | My Prayer |
| *The Next Chapter* | Closing |

Each chapter mark is a single line at the top of its section: `<ChapterMark number="IV" />`. To reorder sections, change `src/pages/Home.jsx` and renumber the marks.

---

## How it should feel

Two principles guide every interaction: **feel native on a phone**, and **move like real objects** (Apple's fluid-interface approach). None of this changes how the site looks at rest. It's all in how it responds.

### Feels native on a phone

| What a website does | What this site does instead | Where |
| --- | --- | --- |
| Gray flash when you tap something | No flash; each control has its own press response | `index.css` |
| ~300ms wait after a tap | Taps register immediately (`touch-action: manipulation`) | `index.css` |
| Long-press selects a button's text | Controls can't be text-selected; body text still can | `index.css` |
| Hover effects get "stuck" after a tap | Hover effects only exist with a real mouse | every `*.module.css` |
| Content hides under the notch / home indicator | Padded with `env(safe-area-inset-*)` | Nav, Hero, overlays |
| Scrolling a long note drags the page behind it | Scroll stays inside the note (`overscroll-behavior: contain`) | What I Love, Letters |
| Password field capitalizes the first letter | No auto-caps or autocorrect; the keyboard shows a **Go** key | When You're Ready |
| Screen sections jump as the URL bar hides | Sized with `svh` / `dvh` units | Hero, pages |

**Rule of thumb:** any new `:hover` style goes inside
`@media (hover: hover) and (pointer: fine) { … }`, and anything tappable gets an `:active` style.

### Moves like real objects

- **Feedback on touch-down.** Buttons dip to 97% and rows dim the instant a finger lands, not when it lifts.
- **The photo strip has momentum.** A flick carries it as far as iOS scrolling would, using Apple's projection math (deceleration `0.998`), then it settles on the nearest photo instead of stopping wherever the finger let go. Vertical swipes still scroll the page. See `src/components/PhotoSlider.jsx`.
- **Springs, not timers.** Notes and letters open with critically damped springs (no bounce), so they can be interrupted mid-motion and always start from where they are.
- **Same way in, same way out.** A note that rises in sinks back out along the same path.
- **Bounce only when you threw it.** Nothing overshoots unless the gesture itself had momentum.

### Accessibility settings are respected

| Phone setting | Effect |
| --- | --- |
| **Reduce Motion** | Slides and parallax become simple fades; the bouncing scroll cue stops (`MotionConfig` in `App.jsx` + CSS) |
| **Reduce Transparency** | Frosted nav bar and overlays become solid |
| **Text size / zoom** | Pinch-zoom is never disabled; inputs are 16px so iOS doesn't auto-zoom |

---

## Editing content

| What | Where |
| --- | --- |
| Section text, timeline, the dates list | `src/data/content.js` |
| 100 Reasons | `src/data/reasons.json` |
| Photos in "Our Moments" | `src/assets/` + the `photos` list in `src/components/PhotoSlider.jsx` |
| Colors and fonts | `src/index.css` |
| Section order | `src/pages/Home.jsx` |
| App name, icons, offline behavior | `public/manifest.webmanifest`, `public/icon-*.png`, `public/sw.js` |

### Add a date

Append to `datesArray` in `src/data/content.js` with the next `id`:

```js
{ id: 36, name: "Somewhere new" },
```

### Add a photo

1. Shrink it first so it loads quickly on a phone. On a Mac:
   ```bash
   sips -s format jpeg -s formatOptions 82 -Z 1600 "Original.png" --out src/assets/new-photo.jpg
   ```
2. Import it at the top of `src/components/PhotoSlider.jsx` and add `{ src: newPhoto, caption: 'Caption' }` to `photos`.

Aim for under ~600 KB per photo.

### Change the app icon

Edit `public/favicon.svg`. The PNG icons (`favicon.png` 64px, `apple-touch-icon.png` 180px, `icon-192.png`, `icon-512.png`) are rendered from it. Keep the artwork inside the center ~80% so Android's round mask doesn't crop it.

### Change offline caching

If you edit `public/sw.js`, bump the `CACHE` name (e.g. `next-chapter-v2`) so phones drop the old cache.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | The letter: the full story in chapters |
| `/letters` | Individual letters, opened one at a time |
| `/when-youre-ready` | A private page behind a phrase |

The site is a single-page app. The host must serve `index.html` for every route so that refreshing on `/letters` works.

## Project structure

```
public/            manifest, service worker, icons
src/
  assets/          photos
  components/      each section as a component + its CSS module
  data/            content.js, reasons.json
  pages/           Home, Letters, WhenYoureReady
  index.css        design tokens + global mobile baseline
  App.jsx          routes + reduced-motion config
  main.jsx         entry + service worker registration
```

Built with React 19, Vite, Framer Motion, and CSS Modules.
