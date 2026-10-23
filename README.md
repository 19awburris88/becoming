# The Next Chapter

A faith-centered love letter from Austin to Adrienne: our story, the promises I'm practicing, and the future I'm preparing for.

It reads as a **book**: a red leather cover, then chapters you turn page by page, on a phone, a foldable, a tablet, or a laptop. It's built **mobile-first** and **installs like an app**, because it's mostly read on a phone. It should feel like a book you hold, not a website you visit.

The original scrolling version is still available at `/scroll`.

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

## Reading the book

| To… | Do this |
| --- | --- |
| Open the book / turn forward | Swipe left, tap the right side of the page, or press **→** / **Space** |
| Turn back | Swipe right, tap the left side, or press **←** |
| Turn slowly | Drag the page; it follows your finger and you can drop it back |
| Jump to a chapter | **Contents** (top right), or tap a line on the Contents page |
| Back to the cover | Tap **The Next Chapter** (top left), or press **Home** |

The bottom bar shows the current chapter and page.

### On every screen

| Screen | The book shows |
| --- | --- |
| Phone, or a folded foldable | One page at a time |
| Tablet held upright | One large page |
| Unfolded foldable, tablet sideways, laptop | Two facing pages, like an open book |
| Dual-screen device | Two facing pages, with the spine on the hinge |

**Folding or rotating mid-read keeps your place.** The book re-flows for the new page size and opens to the same words.

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

Deep red cover, gold leaf, ivory pages. The book opens on a gold-framed leather cover, then a title page and a contents page. Each chapter is printed on the same paper tone its section uses on the scrolling site: ivory, sand, oxblood, or deep oxblood. That keeps the light-and-dark rhythm of the story.

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

| Chapter | Section | Paper |
| --- | --- | --- |
| I | Dear Adrienne (the letter) | ivory |
| II | Our Story (timeline + the dates) | oxblood |
| Interlude | Our Moments (each photo on its own page) | oxblood |
| III | What I Love About You | ivory |
| IV | The Husband I Want To Be | sand |
| V | Love Looks Like Preparation | ivory |
| VI | Promises I Am Practicing | oxblood |
| Interlude | The Endgame | oxblood |
| VII | Already Building Our Future | ivory |
| VIII | 100 Reasons | sand |
| IX | My Prayer | deep oxblood |
| Epilogue | *The Next Chapter* — Until then | ivory |

In the book, the order and labels are the `chapters` list at the bottom of `src/book/chapters.jsx`. In the scrolling version, they're `src/pages/Home.jsx` plus each section's `<ChapterMark number="IV" />`.

---

## How the book works

### Typesetting

The book is laid out the way a typesetter would lay out a printed book, fresh for each screen (`src/book/paginate.js`):

1. Each chapter is a list of **blocks**: a paragraph, a card, a date, a reason, a photo.
2. Every block is measured off-screen at the real page size.
3. Blocks are packed onto pages in order. A block is never split across pages.
4. A sub-heading (like "The Dates") is kept on the same page as the first item that follows it.

On two-page spreads, it follows print conventions: the cover stands alone on the right, **every chapter opens on a right-hand page** (with a blank, ornamented page opposite if needed), and the back cover closes on the left.

The book re-typesets automatically whenever the page size changes (fold, unfold, rotate) or when a font finishes loading, then returns the reader to the same words.

### The page turn

The page turn uses the same principles as the rest of the site (`src/book/Book.jsx`):

- **The page tracks your finger 1:1** and turns in 3D around the spine, shading as it stands up and casting a shadow on the page beneath.
- **Momentum decides, not position.** On release, Apple's projection math (deceleration `0.998`) works out where the page is *headed*. A quick short flick turns it, and a slow drag past halfway with a pause can still fall back.
- **It can be caught.** Grab a page mid-turn and it stops under your finger.
- **No bounce.** Pages settle with critically damped springs; a page doesn't wobble.
- A swipe that starts on a button turns the page; only a clean tap presses the button.

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
- **Pages turn like paper.** See *The page turn* above.

### Accessibility settings are respected

| Phone setting | Effect |
| --- | --- |
| **Reduce Motion** | Page turns become a soft fade; slides and parallax become fades; the bouncing scroll cue stops (`MotionConfig` in `App.jsx` + CSS) |
| **Reduce Transparency** | Frosted nav bar, overlays, and the Contents scrim become solid |
| **Text size / zoom** | Pinch-zoom is never disabled; inputs are 16px so iOS doesn't auto-zoom |

---

## Editing content

Most content lives in shared data files, so one edit updates **both** the book and the scrolling version:

| What | Where |
| --- | --- |
| Timeline, dates, cards, promises, the Endgame, visions | `src/data/content.js` |
| 100 Reasons | `src/data/reasons.json` |
| Photos in "Our Moments" | `src/assets/` + the `photos` list in `src/data/photos.js` |
| Colors and fonts | `src/index.css` |
| Book chapters, order, and labels | `src/book/chapters.jsx` |
| App name, icons, offline behavior | `public/manifest.webmanifest`, `public/icon-*.png`, `public/sw.js` |

> **Edit in two places:** the prose of **Dear Adrienne**, **Love Looks Like Preparation**, and **My Prayer** is written out in both `src/book/chapters.jsx` (the book) and the matching file in `src/components/` (the scrolling version). Change both to keep them in sync.

The book re-typesets itself, so adding or editing text never needs any page-break work.

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
2. Import it at the top of `src/data/photos.js` and add `{ src: newPhoto, caption: 'Caption' }` to `photos`. It appears as a new page in the book and in the scrolling photo strip.

Aim for under ~600 KB per photo.

### Change the app icon

Edit `public/favicon.svg`. The PNG icons (`favicon.png` 64px, `apple-touch-icon.png` 180px, `icon-192.png`, `icon-512.png`) are rendered from it. Keep the artwork inside the center ~80% so Android's round mask doesn't crop it.

### Change offline caching

If you edit `public/sw.js`, bump the `CACHE` name (e.g. `next-chapter-v2`) so phones drop the old cache.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | The book |
| `/scroll` | The original scrolling version of the same story |
| `/letters` | Individual letters, opened one at a time |
| `/when-youre-ready` | A private page behind a phrase |

The site is a single-page app. The host must serve `index.html` for every route so that refreshing on `/letters` works.

## Project structure

```
public/            manifest, service worker, icons
src/
  assets/          photos
  book/            the book: Book (shell + page turn), Page, chapters, paginate
  components/      the scrolling version: each section + its CSS module
  data/            content.js, reasons.json, photos.js
  pages/           Home (scrolling version), Letters, WhenYoureReady
  index.css        design tokens + global mobile baseline
  App.jsx          routes (/ = book, /scroll) + reduced-motion config
  main.jsx         entry + service worker registration
```

Built with React 19, Vite, Framer Motion, and CSS Modules.
