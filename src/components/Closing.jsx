import FadeIn from './FadeIn'
import styles from './Closing.module.css'

export default function Closing() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <FadeIn delay={0}>
          <p className={styles.eyebrow}>Until then</p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className={styles.statement}>
            "If God has written our story,<br />
            I trust every page."
          </h2>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className={styles.signature}>
            <div className={styles.line} />
            <p className={styles.name}>Austin Burris</p>
            <p className={styles.date}>
              Written with faith, patience, and hope.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className={styles.footer}>If God wills it.</p>
        </FadeIn>
      </div>
    </section>
  )
}
