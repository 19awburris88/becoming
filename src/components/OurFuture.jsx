import { futureVisions, alreadyBuilding } from '../data/content'
import FadeIn from './FadeIn'
import styles from './OurFuture.module.css'

export default function OurFuture() {
  return (
    <section id="future" className={styles.section}>
      <div className={styles.alreadyBlock}>
        <div className={styles.alreadyHeader}>
          <FadeIn>
            <p className={styles.eyebrow}>Already Building Our Future</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className={styles.heading}>
              The foundation isn't coming.<br />It's already being laid.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className={styles.alreadySub}>
              Instead of dreams, here are real things we're already doing together.
            </p>
          </FadeIn>
        </div>

        <div className={styles.alreadyGrid}>
          {alreadyBuilding.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.05}>
              <div className={styles.alreadyCard}>
                <span className={styles.alreadyLabel}>{item.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className={styles.visionsBlock}>
        <div className={styles.visionsHeader}>
          <FadeIn>
            <p className={styles.eyebrow}>The Vision</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className={styles.heading}>Where we're going.</h2>
          </FadeIn>
        </div>

        <div className={styles.grid}>
          {futureVisions.map((vision, i) => (
            <FadeIn key={vision.id} delay={i * 0.06}>
              <div className={styles.visionCard}>
<h3 className={styles.visionTitle}>{vision.title}</h3>
                <p className={styles.visionText}>{vision.vision}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
