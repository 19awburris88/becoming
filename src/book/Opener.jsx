import ChapterMark, { Ornament } from '../components/ChapterMark'
import S from './Book.module.css'

// The top of a chapter's first page: its number, name, and heading
export default function Opener({ number, label, eyebrow, heading, sub }) {
  return (
    <div className={S.opener}>
      {number || label ? <ChapterMark number={number} label={label} /> : <Ornament />}
      {eyebrow && <p className={S.eyebrow}>{eyebrow}</p>}
      {heading && <h2 className={S.heading}>{heading}</h2>}
      {sub && <p className={S.sub}>{sub}</p>}
    </div>
  )
}
