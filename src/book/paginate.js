// Lays the chapters out onto pages, the way a typesetter would.
//
// heights[c][i] is the measured height of block i of chapter c at the current
// page size; pageHeight is the usable height of a page's text area. Blocks are
// packed greedily. Cards, dates, photos and headings are never split; prose
// paragraphs flow on to the next page, with at least two lines on each side of
// the break (no lone first or last line). Re-run whenever the page size
// changes — folding or unfolding a phone, rotating a tablet — and the book re-flows.
//
// A page's blocks are block indexes, or { i, from, to } for part of a paragraph
// (a range of its words). `measure` measures those parts.
//
// In a two-page spread (tablet, unfolded foldable, desktop) the book follows
// print conventions: the cover stands alone on the right, every chapter opens
// on a right-hand page, and the back cover closes on the left. Blank pages fill
// the gaps. On a single page (phone) there's no need for blanks.

export const blockIndex = entry => (typeof entry === 'number' ? entry : entry.i)

export function paginate(chapters, heights, pageHeight, spread, measure) {
  const pages = [{ kind: 'cover' }, { kind: 'title' }, { kind: 'contents' }]
  const chapterStart = []

  chapters.forEach((chapter, c) => {
    if (spread && pages.length % 2 === 1) pages.push({ kind: 'blank' })
    chapterStart[c] = pages.length

    let page = { kind: 'content', chapter: c, blocks: [], opener: true }
    let used = 0
    const place = (entry, h) => {
      page.blocks.push(entry)
      used += h
    }
    const turnPage = () => {
      pages.push(page)
      page = { kind: 'content', chapter: c, blocks: [], opener: false }
      used = 0
    }

    chapter.blocks.forEach((block, i) => {
      const h = heights[c][i]
      const next = heights[c][i + 1] ?? 0
      const fits = used + h <= pageHeight && !(block.keepWithNext && used + h + next > pageHeight)
      if (fits) return place(i, h)

      // Prose: fill the rest of this page, continue on the next
      if (block.words && measure) {
        const n = block.words.length
        let from = 0
        for (;;) {
          const rest = from === 0 ? h : measure.height(c, i, from, n)
          if (used + rest <= pageHeight) return place(from === 0 ? i : { i, from, to: n }, rest)
          const to = measure.fit(c, i, from, pageHeight - used)
          if (to > from) {
            place({ i, from, to }, pageHeight - used)
            turnPage()
            from = to
          } else if (used > 0) {
            turnPage()
          } else {
            // Can't fit even two lines on an empty page (never in practice)
            place(from === 0 ? i : { i, from, to: n }, rest)
            page.overflow = true
            return
          }
        }
      }

      if (used > 0) turnPage()
      place(i, h)
      // A block taller than a whole page (rare) scrolls inside its page instead
      if (h > pageHeight) page.overflow = true
    })

    pages.push(page)
  })

  if (spread && pages.length % 2 === 0) pages.push({ kind: 'blank' })
  pages.push({ kind: 'back' })

  return { pages, chapterStart }
}

// What's on screen at once: one page on a phone, two facing pages on a spread.
// Spread views: [cover alone on the right], [1, 2], [3, 4], …, [back cover alone on the left]
export function buildViews(pageCount, spread) {
  if (!spread) return Array.from({ length: pageCount }, (_, i) => [i])

  const views = [[null, 0]]
  for (let left = 1; left < pageCount; left += 2) {
    views.push([left, left + 1 < pageCount ? left + 1 : null])
  }
  return views
}

export function viewForPage(pageIndex, spread) {
  return spread ? Math.ceil(pageIndex / 2) : pageIndex
}

// A position in the book that survives re-flowing: "chapter 3, block 12".
export function anchorFor(pages, view) {
  const page = view.map(i => pages[i]).find(p => p && p.kind !== 'blank')
  if (!page) return null
  return page.kind === 'content'
    ? { kind: 'content', chapter: page.chapter, block: blockIndex(page.blocks[0]) }
    : { kind: page.kind }
}

export function pageForAnchor(pages, anchor) {
  if (!anchor) return 0
  const i = pages.findIndex(p =>
    anchor.kind === 'content'
      ? p.kind === 'content' && p.chapter === anchor.chapter && p.blocks.some(b => blockIndex(b) === anchor.block)
      : p.kind === anchor.kind
  )
  return Math.max(0, i)
}
