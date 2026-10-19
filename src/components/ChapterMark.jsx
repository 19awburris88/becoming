import styles from './ChapterMark.module.css'

// The gold line–star–line flourish from the ring box cover
export function Ornament({ className = '' }) {
  return (
    <span className={`${styles.ornament} ${className}`} aria-hidden="true">
      <span className={styles.rule} />
      <svg className={styles.star} viewBox="0 0 16 16">
        <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" />
      </svg>
      <span className={styles.rule} />
    </span>
  )
}

export default function ChapterMark({ number, label }) {
  return (
    <div className={styles.mark}>
      <span className={styles.label}>{label ?? `Chapter ${number}`}</span>
      <Ornament />
    </div>
  )
}
