import { forwardRef } from 'react'
import { Ornament } from '../components/ChapterMark'
import S from './Book.module.css'

const toneClass = { light: S.light, sand: S.sand, dark: S.dark, deep: S.deep }

// One printed page. `side` is where it sits in the book — 'left', 'right', or
// 'single' on a phone — which decides the gutter shadow and the running head.
const Page = forwardRef(function Page(
  { page, index, side, chapters, chapterStart, width, height, onOpen, onJump, measuring, children },
  ref
) {
  const style = { width, height }
  const sideClass = side === 'left' ? S.left : side === 'right' ? S.right : S.single

  if (page.kind === 'cover' || page.kind === 'back') {
    return (
      <div className={`${S.page} ${S.cover} ${sideClass}`} style={style}>
        <div className={S.coverFrame}><span className={S.coverFrameInner} /></div>
        {page.kind === 'cover' ? (
          <div className={S.coverContent}>
            <p className={S.coverEyebrow}>If God wills it</p>
            <h1 className={S.coverTitle}>The Next<br />Chapter</h1>
            <Ornament className={S.coverOrnament} />
            <p className={S.coverSubtitle}>Not a Proposal. A Promise.</p>
            <p className={S.coverCopy}>Before I ask for forever, I want to become the man worthy of it.</p>
            <button type="button" className={S.coverCta} onClick={onOpen}>
              Read My Heart
            </button>
          </div>
        ) : (
          <div className={S.coverContent}>
            <Ornament className={S.coverOrnament} />
            <p className={S.backTitle}>The Next Chapter</p>
          </div>
        )}
      </div>
    )
  }

  if (page.kind === 'blank') {
    return (
      <div className={`${S.page} ${S.light} ${sideClass}`} style={style}>
        <div className={S.blank}><Ornament /></div>
      </div>
    )
  }

  if (page.kind === 'title') {
    return (
      <div className={`${S.page} ${S.light} ${sideClass}`} style={style}>
        <div className={S.titlePage}>
          <p className={S.titleName}>The Next Chapter</p>
          <Ornament />
          <p className={S.titleAuthor}>Austin Burris</p>
          <p className={S.titleNote}>Written with faith, patience, and hope.</p>
        </div>
      </div>
    )
  }

  if (page.kind === 'contents') {
    return (
      <div className={`${S.page} ${S.light} ${sideClass}`} style={style}>
        <div className={S.contentsPage}>
          <h2 className={S.contentsTitle}>Contents</h2>
          <ol className={S.contentsList}>
            {chapters.map((ch, c) => (
              <li key={ch.id}>
                <button type="button" className={S.contentsRow} onClick={() => onJump(chapterStart[c])}>
                  <span className={S.contentsMark}>{ch.mark}</span>
                  <span className={S.contentsName}>{ch.title}</span>
                  <span className={S.leader} />
                  <span className={S.contentsNum}>{chapterStart[c]}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

  // A chapter page
  const chapter = chapters[page.chapter]
  const runningHead = side === 'left' ? 'The Next Chapter' : chapter.title

  return (
    <div className={`${S.page} ${toneClass[chapter.tone]} ${sideClass}`} style={style}>
      <header className={S.runHead}>{page.opener ? '' : runningHead}</header>
      <div ref={ref} className={`${S.pageBody} ${page.overflow ? S.overflow : ''}`} data-body={measuring ? '' : undefined}>
        {children ??
          page.blocks.map(entry => {
            if (typeof entry === 'number') {
              return <div key={entry} className={S.block}>{chapter.blocks[entry].node}</div>
            }
            // Part of a paragraph that flows across the page break
            const { i, from, to } = entry
            const block = chapter.blocks[i]
            const continues = to < block.words.length
            return (
              <div key={`${i}-${from}`} className={`${S.block} ${continues ? S.blockCut : ''}`}>
                <p className={block.className}>{block.words.slice(from, to).join(' ')}</p>
              </div>
            )
          })}
      </div>
      <footer className={S.folio}>{index}</footer>
    </div>
  )
})

export default Page
