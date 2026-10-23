// Lays the chapters out onto pages, the way a typesetter would.
//
// heights[c][i] is the measured height of block i of chapter c at the current
// page size; pageHeight is the usable height of a page's text area. Blocks are
// packed greedily and never split. Re-run whenever the page size changes —
// folding or unfolding a phone, rotating a tablet — and the book re-flows.
//
// In a two-page spread (tablet, unfolded foldable, desktop) the book follows
// print conventions: the cover stands alone on the right, every chapter opens
// on a right-hand page, and the back cover closes on the left. Blank pages fill
// the gaps. On a single page (phone) there's no need for blanks.

export function paginate(chapters, heights, pageHeight, spread) {
  const pages = [{ kind: 'cover' }, { kind: 'title' }, { kind: 'contents' }]
  const chapterStart = []

  chapters.forEach((chapter, c) => {
    if (spread && pages.length % 2 === 1) pages.push({ kind: 'blank' })
    chapterStart[c] = pages.length

    let page = { kind: 'content', chapter: c, blocks: [], opener: true }
    let used = 0

    chapter.blocks.forEach((block, i) => {
      const h = heights[c][i]
      const next = heights[c][i + 1] ?? 0
      const full =
        used > 0 &&
        (used + h > pageHeight || (block.keepWithNext && used + h + next > pageHeight))

      if (full) {
        pages.push(page)
        page = { kind: 'content', chapter: c, blocks: [], opener: false }
        used = 0
      }

      page.blocks.push(i)
      used += h
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
    ? { kind: 'content', chapter: page.chapter, block: page.blocks[0] }
    : { kind: page.kind }
}

export function pageForAnchor(pages, anchor) {
  if (!anchor) return 0
  const i = pages.findIndex(p =>
    anchor.kind === 'content'
      ? p.kind === 'content' && p.chapter === anchor.chapter && p.blocks.includes(anchor.block)
      : p.kind === anchor.kind
  )
  return Math.max(0, i)
}
