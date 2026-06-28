import FadeIn from './FadeIn'
import styles from './PrayerWall.module.css'

export default function PrayerWall() {
  return (
    <section id="prayer" className={styles.section}>
      <div className={styles.inner}>
        <FadeIn>
          <p className={styles.eyebrow}>If God Wills It</p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <h2 className={styles.heading}>My Prayer</h2>
        </FadeIn>

        <div className={styles.prayer}>
          <FadeIn delay={0.18}>
            <p className={styles.salutation}>Father,</p>
          </FadeIn>

          <FadeIn delay={0.22}>
            <p>
              If she is the one You have written for me — cover her.
            </p>
          </FadeIn>

          <FadeIn delay={0.26}>
            <p>
              Protect her in seasons I cannot reach her. Be the peace in her spaces.
              Be the clarity in her uncertainty. Remind her daily that she is chosen
              by You before she is chosen by anyone else.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p>
              And Lord, make me the man she deserves.
            </p>
          </FadeIn>

          <FadeIn delay={0.34}>
            <p>
              Give me patience when I want to be impatient. Give me humility when I
              want to be right. Give me consistency when discipline is difficult. Give
              me a love that looks more like Yours than it does mine.
            </p>
          </FadeIn>

          <FadeIn delay={0.38}>
            <p>
              Let me be the kind of man who makes it easier for her to trust You by
              the way I love her.
            </p>
          </FadeIn>

          <FadeIn delay={0.42}>
            <p>
              If You have written our story, Lord, I trust every chapter. I trust
              the ones I understand. I trust the ones I don't. I trust the timing
              I cannot control and the outcome I cannot guarantee.
            </p>
          </FadeIn>

          <FadeIn delay={0.46}>
            <p className={styles.close}>I will keep becoming.</p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className={styles.ifGodWillsIt}>If God wills it.</p>
          </FadeIn>

          <FadeIn delay={0.56}>
            <p className={styles.amen}>Amen.</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
