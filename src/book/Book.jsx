import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, List, X } from 'lucide-react'
import { chapters } from './chapters'
import { photos } from '../data/photos'
import { paginate, buildViews, viewForPage, anchorFor, pageForAnchor } from './paginate'
import Page from './Page'
import S from './Book.module.css'

// ── Physics ──────────────────────────────────────────────────────────────────
// Apple's momentum projection (Designing Fluid Interfaces): where a flick would
// come to rest under scroll-like deceleration. A turn commits if the page is
// *headed* past halfway, not merely if it was dropped past halfway.
const DECELERATION = 0.998
const project = velocity => ((velocity / 1000) * DECELERATION) / (1 - DECELERATION)

// Critically damped (no bounce): a page settles, it doesn't wobble.
const TURN = { type: 'spring', bounce: 0, duration: 0.75 }
const RELEASE = { type: 'spring', bounce: 0, duration: 0.5 }

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const lerp = (a, b, t) => a + (b - a) * t

// ── Layout ───────────────────────────────────────────────────────────────────
// Two facing pages when the screen is wide enough to hold them comfortably
// (unfolded foldable, landscape tablet, laptop); one page on a phone, a folded
// foldable, or a tablet held upright. On a dual-screen device the spine sits on
// the hinge, since the spread is always centered.
const dualScreen = () => window.matchMedia?.('(horizontal-viewport-segments: 2)').matches

function layoutFor(w, h) {
  const spread = dualScreen() || (w >= 700 && w / h >= 0.8)
  const margin = spread ? 28 : 10
  let pageH = h - margin * 2
  let pageW = spread ? (w - margin * 2) / 2 : w - margin * 2
  const [minRatio, maxRatio] = spread ? [0.6, 0.76] : [0.45, 0.8]
  if (pageW / pageH > maxRatio) pageW = pageH * maxRatio
  if (pageW / pageH < minRatio) pageH = pageW / minRatio
  pageW = Math.min(pageW, 640)
  return { spread, pageW: Math.floor(pageW), pageH: Math.floor(pageH) }
}

function useSize(ref) {
  const [size, setSize] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width)
      const h = Math.round(entry.contentRect.height)
      setSize(s => (s && s.w === w && s.h === h ? s : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function releaseVelocity(samples) {
  const last = samples[samples.length - 1]
  const first = samples.find(s => last.t - s.t <= 80) ?? samples[0]
  const dt = last.t - first.t
  return dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0
}

export default function Book() {
  const stageRef = useRef(null)
  const measureRef = useRef(null)
  const stage = useSize(stageRef)
  const layout = useMemo(() => stage && layoutFor(stage.w, stage.h), [stage])
  const reduceMotion = useReducedMotion()

  // The book is laid out (paginated) for the current page size
  const [book, setBook] = useState(null)
  const bookRef = useRef(null)

  const [view, setView] = useState(0)
  const viewRef = useRef(0)
  const anchorRef = useRef(null)
  const [turn, setTurn] = useState(null) // { a, b }: turning between views a and a+1
  const turnRef = useRef(null)
  const animRef = useRef(null)
  const gesture = useRef(null)
  const swallowClick = useRef(false)
  const angle = useMotionValue(0) // 0 = lying on view a's side, -180 = turned to view b
  const bookX = useMotionValue(0)
  const [fadeKey, setFadeKey] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)

  // Typeset: measure every block at this page size, then break into pages
  useLayoutEffect(() => {
    if (!layout) return
    let cancelled = false
    const run = () => {
      const root = measureRef.current
      if (cancelled || !root) return
      const body = root.querySelector('[data-body]')
      const cs = getComputedStyle(body)
      const usable = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const heights = chapters.map(ch => ch.blocks.map(() => 0))
      root.querySelectorAll('[data-b]').forEach(el => {
        const [c, i] = el.dataset.b.split('-').map(Number)
        heights[c][i] = el.getBoundingClientRect().height // sub-pixel: rounding adds up over 100 reasons
      })
      const { pages, chapterStart } = paginate(chapters, heights, usable, layout.spread)
      setBook({ ...layout, pages, chapterStart, views: buildViews(pages.length, layout.spread) })
    }
    run()
    // Re-set the type whenever the text actually changes size: a font weight
    // arriving late, or the browser finishing a resize after a fold/unfold.
    // (Measuring right away can catch the old page size mid-resize.)
    const ro = new ResizeObserver(run)
    const root = measureRef.current
    if (root) {
      ro.observe(root.querySelector('[data-body]'))
      ro.observe(root.querySelector('[data-flow]'))
    }
    document.fonts?.ready.then(run)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [layout])

  // keepPlace: a re-flow moves the reader to their words, but mustn't
  // re-record their place, or each fold/unfold would drift it a page
  const commitView = useCallback((v, keepPlace = false) => {
    const b = bookRef.current
    viewRef.current = v
    setView(v)
    if (b && !keepPlace) anchorRef.current = anchorFor(b.pages, b.views[v])
  }, [])

  // Land any page that's mid-turn immediately
  const settleNow = useCallback((land = true) => {
    const t = turnRef.current
    if (!t) return
    animRef.current?.stop()
    animRef.current = null
    turnRef.current = null
    setTurn(null)
    if (land) commitView(t.toB ? t.b : t.a)
  }, [commitView])

  // After re-flowing (fold/unfold, rotate), stay on the same words
  useLayoutEffect(() => {
    bookRef.current = book
    if (!book) return
    settleNow(false) // a turn in flight belongs to the old layout; drop it
    const v = viewForPage(pageForAnchor(book.pages, anchorRef.current), book.spread)
    commitView(clamp(v, 0, book.views.length - 1), true)
  }, [book, commitView, settleNow])

  const startTurn = useCallback(
    (a, fromAngle) => {
      turnRef.current = { a, b: a + 1, toB: fromAngle === 0 }
      setTurn({ a, b: a + 1 })
      angle.set(fromAngle)
    },
    [angle]
  )

  const finishTurn = useCallback(
    (toB, velocity, spring) => {
      const t = turnRef.current
      if (!t) return
      t.toB = toB
      animRef.current?.stop()
      animRef.current = animate(angle, toB ? -180 : 0, {
        ...spring,
        velocity,
        onComplete: () => {
          if (turnRef.current !== t) return
          animRef.current = null
          turnRef.current = null
          setTurn(null)
          commitView(toB ? t.b : t.a)
        },
      })
    },
    [angle, commitView]
  )

  const go = useCallback(
    dir => {
      const b = bookRef.current
      if (!b) return
      settleNow()
      const target = viewRef.current + dir
      if (target < 0 || target >= b.views.length) return
      if (reduceMotion) {
        commitView(target)
        setFadeKey(k => k + 1)
        return
      }
      startTurn(Math.min(viewRef.current, target), dir > 0 ? 0 : -180)
      finishTurn(dir > 0, 0, TURN)
    },
    [commitView, finishTurn, reduceMotion, settleNow, startTurn]
  )

  const jumpToPage = useCallback(
    pageIndex => {
      const b = bookRef.current
      if (!b) return
      settleNow()
      setTocOpen(false)
      commitView(clamp(viewForPage(pageIndex, b.spread), 0, b.views.length - 1))
      setFadeKey(k => k + 1)
    },
    [commitView, settleNow]
  )

  // Closed, the book sits centered on its cover; open, it centers on the spine
  useEffect(() => {
    const shiftFor = v => {
      const b = bookRef.current
      if (!b?.spread) return 0
      if (v === 0) return -b.pageW / 2
      if (v === b.views.length - 1) return b.pageW / 2
      return 0
    }
    const update = () => {
      const t = turnRef.current
      bookX.set(t ? lerp(shiftFor(t.a), shiftFor(t.b), -angle.get() / 180) : shiftFor(viewRef.current))
    }
    update()
    return angle.on('change', update)
  }, [angle, bookX, book, view, turn])

  // ── Gestures: drag the page 1:1, or tap a side to turn ──────────────────────
  // Gestures may start on a button (a Contents row, the cover's button):
  // a swipe turns the page, and only a clean tap presses the button.
  const onPointerDown = e => {
    if (e.button !== 0 || tocOpen) return
    swallowClick.current = false
    gesture.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      dragging: false,
      samples: [{ x: e.clientX, t: e.timeStamp }],
    }
  }

  const onPointerMove = e => {
    const g = gesture.current
    const b = bookRef.current
    if (!g || g.id !== e.pointerId || !b) return
    g.samples.push({ x: e.clientX, t: e.timeStamp })
    if (g.samples.length > 8) g.samples.shift()

    if (!g.dragging) {
      const dx = e.clientX - g.x0
      const dy = e.clientY - g.y0
      // ~10px of hysteresis, and only for mostly-horizontal movement
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return
      swallowClick.current = true
      if (reduceMotion) return // reduced motion: decided on release, as a fade

      if (turnRef.current) {
        // Grab the page mid-flight and carry on from exactly where it is
        animRef.current?.stop()
        animRef.current = null
      } else {
        const forward = dx < 0
        const a = forward ? viewRef.current : viewRef.current - 1
        if (a < 0 || a + 1 >= b.views.length) {
          gesture.current = null
          return
        }
        startTurn(a, forward ? 0 : -180)
      }
      g.dragging = true
      g.x0 = e.clientX
      g.p0 = -angle.get() / 180
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    // Progress toward the next view; dragging left turns forward
    const travel = b.spread ? b.pageW * 2 : b.pageW
    angle.set(-180 * clamp(g.p0 - (e.clientX - g.x0) / travel, 0, 1))
  }

  const onPointerUp = e => {
    const g = gesture.current
    gesture.current = null
    const b = bookRef.current
    if (!g || g.id !== e.pointerId || !b) return
    g.samples.push({ x: e.clientX, t: e.timeStamp }) // a pause before letting go means no momentum

    if (!g.dragging) {
      const dx = e.clientX - g.x0
      if (reduceMotion && Math.abs(dx) > 40) return go(dx < 0 ? 1 : -1)
      if (Math.abs(dx) > 10 || Math.abs(e.clientY - g.y0) > 10) return // a scroll, not a tap
      if (e.target.closest('button, a')) return // a tap on a button belongs to the button
      // Tap: right side turns forward, left side turns back
      const rect = stageRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const v = viewRef.current
      const forward = v === 0 ? true : v === b.views.length - 1 ? false : b.spread ? x >= 0.5 : x >= 0.3
      return go(forward ? 1 : -1)
    }

    const travel = b.spread ? b.pageW * 2 : b.pageW
    const progressVelocity = -releaseVelocity(g.samples) / travel // views per second, toward b
    const progress = -angle.get() / 180
    const projected = progress + project(progressVelocity)
    finishTurn(projected > 0.5, -180 * progressVelocity, RELEASE)
  }

  const onPointerCancel = () => {
    const g = gesture.current
    gesture.current = null
    if (g?.dragging) finishTurn(-angle.get() / 180 > 0.5, 0, RELEASE)
  }

  // Keyboard: arrows, Page Up/Down, Space, Home/End
  useEffect(() => {
    const onKey = e => {
      if (tocOpen) {
        if (e.key === 'Escape') setTocOpen(false)
        return
      }
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) go(1)
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) go(-1)
      else if (e.key === 'Home') jumpToPage(0)
      else if (e.key === 'End' && bookRef.current) jumpToPage(bookRef.current.pages.length - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, jumpToPage, tocOpen])

  // The book owns the screen: no page scroll or pull-to-refresh behind it,
  // and the status bar matches the room the book sits in
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    const previous = meta?.content
    document.documentElement.classList.add('book-mode')
    meta?.setAttribute('content', '#230809')
    return () => {
      document.documentElement.classList.remove('book-mode')
      if (previous) meta.setAttribute('content', previous)
    }
  }, [])

  // Fetch the photos on the neighboring pages before they're turned to
  useEffect(() => {
    if (!book) return
    const momentsIndex = chapters.findIndex(ch => ch.id === 'moments')
    for (const v of [view - 1, view + 1, view + 2]) {
      for (const i of book.views[v] ?? []) {
        const page = book.pages[i]
        if (page?.chapter !== momentsIndex) continue
        page.blocks.filter(blk => blk > 0).forEach(blk => {
          new Image().src = photos[blk - 1].src
        })
      }
    }
  }, [book, view])

  // Lighting: the turning page darkens as it stands up; it shades what's beneath
  const leafShade = useTransform(angle, a => Math.sin((-a * Math.PI) / 180) * 0.3)
  const castRight = useTransform(angle, a => (a > -90 ? Math.sin((-a * Math.PI) / 180) * 0.4 : 0))
  const castLeft = useTransform(angle, a => (a <= -90 ? Math.sin((-a * Math.PI) / 180) * 0.4 : 0))

  const shared = book && {
    chapters,
    chapterStart: book.chapterStart,
    width: book.pageW,
    height: book.pageH,
    onOpen: () => go(1),
    onJump: jumpToPage,
  }

  const renderPage = (index, side) => {
    const page = index == null ? null : book.pages[index]
    return page ? <Page key={index} page={page} index={index} side={side} {...shared} /> : null
  }

  // Right after a re-flow (fold/unfold) the old page number may not exist in
  // the new layout until the reader's place is re-found — clamp for that frame
  const shownView = book ? clamp(view, 0, book.views.length - 1) : 0
  const activeTurn = book && turn && turn.b < book.views.length ? turn : null

  // What lies flat, and what's turning
  let staticLeft = null
  let staticRight = null
  let leafFront = null
  let leafBack = null
  if (book) {
    const views = book.views
    if (book.spread) {
      staticLeft = views[activeTurn ? activeTurn.a : shownView][0]
      staticRight = views[activeTurn ? activeTurn.b : shownView][1]
      if (activeTurn) {
        leafFront = views[activeTurn.a][1]
        leafBack = views[activeTurn.b][0]
      }
    } else {
      staticRight = views[activeTurn ? activeTurn.b : shownView][0]
      if (activeTurn) leafFront = views[activeTurn.a][0]
    }
  }

  const current = book && book.views[shownView].find(i => i != null && book.pages[i].kind !== 'blank')
  const currentPage = book && book.pages[current ?? 0]
  const currentChapter = currentPage?.kind === 'content' ? chapters[currentPage.chapter] : null
  const total = book ? book.pages.length - 1 : 0
  const bookW = book ? (book.spread ? book.pageW * 2 : book.pageW) : 0

  return (
    <div className={S.book}>
      <header className={S.topBar}>
        <button type="button" className={S.brand} onClick={() => jumpToPage(0)} aria-label="Back to the cover">
          <svg className={S.brandIcon} viewBox="0 0 32 32" aria-hidden="true">
            <rect x="5" y="3" width="22" height="26" rx="2" fill="#6B1A1F" />
            <rect x="5" y="3" width="4" height="26" rx="1.5" fill="#4E1115" />
            <rect x="11.5" y="6" width="13" height="20" fill="none" stroke="#D9B46A" strokeWidth="1" />
            <path d="M18 12.5 L18.9 15.1 L21.5 16 L18.9 16.9 L18 19.5 L17.1 16.9 L14.5 16 L17.1 15.1 Z" fill="#D9B46A" />
          </svg>
          <span>The Next Chapter</span>
        </button>
        <button type="button" className={S.tocButton} onClick={() => setTocOpen(true)}>
          <List size={16} />
          <span>Contents</span>
        </button>
      </header>

      <div
        ref={stageRef}
        className={S.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={e => {
          if (!swallowClick.current) return
          swallowClick.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {book && stage && (
          <motion.div
            className={S.volume}
            style={{
              width: bookW,
              height: book.pageH,
              left: (stage.w - bookW) / 2,
              top: (stage.h - book.pageH) / 2,
              x: bookX,
            }}
          >
            <motion.div
              key={fadeKey}
              className={S.flat}
              initial={fadeKey ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {book.spread && (
                <div className={S.slot} style={{ left: 0, width: book.pageW }}>
                  {renderPage(staticLeft, 'left')}
                  {activeTurn && <motion.div className={`${S.cast} ${S.castLeft}`} style={{ opacity: castLeft }} />}
                </div>
              )}
              <div className={S.slot} style={{ left: book.spread ? book.pageW : 0, width: book.pageW }}>
                {renderPage(staticRight, book.spread ? 'right' : 'single')}
                {activeTurn && <motion.div className={`${S.cast} ${S.castRight}`} style={{ opacity: castRight }} />}
              </div>
            </motion.div>

            {activeTurn && (
              <motion.div
                className={S.leaf}
                style={{ left: book.spread ? book.pageW : 0, width: book.pageW, height: book.pageH, rotateY: angle }}
              >
                <div className={S.face}>
                  {renderPage(leafFront, book.spread ? 'right' : 'single')}
                  <motion.div className={S.shade} style={{ opacity: leafShade }} />
                </div>
                <div className={`${S.face} ${S.faceBack}`}>
                  {book.spread ? renderPage(leafBack, 'left') : <div className={S.paperBack} />}
                  <motion.div className={S.shade} style={{ opacity: leafShade }} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {book && (
          <>
            <button type="button" className={`${S.navArrow} ${S.navPrev}`} onClick={() => go(-1)} disabled={shownView === 0} aria-label="Previous page">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className={`${S.navArrow} ${S.navNext}`} onClick={() => go(1)} disabled={shownView === book.views.length - 1} aria-label="Next page">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <footer className={S.bottomBar}>
        <div className={S.progressTrack}>
          <div className={S.progressFill} style={{ width: `${total ? ((current ?? 0) / total) * 100 : 0}%` }} />
        </div>
        <div className={S.progressLabel}>
          {shownView === 0 ? (
            <span>Swipe or tap to open</span>
          ) : (
            <>
              <span className={S.progressChapter}>
                {currentChapter ? `${currentChapter.mark} · ${currentChapter.title}` : currentPage?.kind === 'back' ? 'The End' : 'Front matter'}
              </span>
              <span>{current} / {total}</span>
            </>
          )}
        </div>
      </footer>

      {/* Off-screen typesetting: every block at the real page size */}
      {layout && (
        <div ref={measureRef} className={S.measurer} aria-hidden="true">
          <Page
            measuring
            page={{ kind: 'content', chapter: 0, blocks: [], opener: false }}
            index={0}
            side="single"
            chapters={chapters}
            width={layout.pageW}
            height={layout.pageH}
          >
            <div data-flow="">
              {chapters.flatMap((ch, c) =>
                ch.blocks.map((blk, i) => (
                  <div key={`${c}-${i}`} data-b={`${c}-${i}`} className={S.block}>{blk.node}</div>
                ))
              )}
            </div>
          </Page>
        </div>
      )}

      <AnimatePresence>
        {tocOpen && book && (
          <>
            <motion.div
              key="scrim"
              className={S.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
            />
            <motion.nav
              key="toc"
              className={S.toc}
              aria-label="Contents"
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            >
              <div className={S.tocHeader}>
                <h2>Contents</h2>
                <button type="button" className={S.tocClose} onClick={() => setTocOpen(false)} aria-label="Close contents">
                  <X size={16} />
                </button>
              </div>
              <ol className={S.tocList}>
                <li>
                  <button type="button" className={S.contentsRow} onClick={() => jumpToPage(0)}>
                    <span className={S.contentsName}>The Cover</span>
                    <span className={S.leader} />
                  </button>
                </li>
                {chapters.map((ch, c) => (
                  <li key={ch.id}>
                    <button
                      type="button"
                      className={`${S.contentsRow} ${currentChapter === ch ? S.contentsCurrent : ''}`}
                      onClick={() => jumpToPage(book.chapterStart[c])}
                    >
                      <span className={S.contentsMark}>{ch.mark}</span>
                      <span className={S.contentsName}>{ch.title}</span>
                      <span className={S.leader} />
                      <span className={S.contentsNum}>{book.chapterStart[c]}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
