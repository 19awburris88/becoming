import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { lovePreparation } from '../data/content'
import FadeIn from './FadeIn'
import styles from './LovePreparation.module.css'

function ActItem({ text, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.li
      ref={ref}
      className={styles.act}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className={styles.actDot} />
      <span>{text}</span>
    </motion.li>
  )
}

export default function LovePreparation() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <FadeIn>
              <p className={styles.eyebrow}>Love Looks Like Preparation</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className={styles.heading}>
                People often think love is measured in grand gestures.
              </h2>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className={styles.editorial}>
                <p>Sometimes it is.</p>
                <p>But more often, love is measured in consistency.</p>
                <p>It looks like showing up.</p>
                <p>It looks like paying attention.</p>
                <p>It looks like remembering.</p>
                <p>It looks like planning.</p>
                <p>It looks like sacrifice.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className={styles.intro}>
                Since we've been together, I've had the privilege of loving Adrienne
                through moments both big and small. Some memories are simple. Some are
                extravagant. All of them were intentional.
              </p>
            </FadeIn>
          </div>

          <div className={styles.topRight}>
            <FadeIn delay={0.1}>
              <p className={styles.listLabel}>Some of the ways love has shown up:</p>
            </FadeIn>
            <ul className={styles.actsList}>
              {lovePreparation.acts.map((act, i) => (
                <ActItem key={i} text={act} index={i} />
              ))}
            </ul>
          </div>
        </div>

        <FadeIn delay={0.1}>
          <div className={styles.experiences}>
            <p className={styles.expLabel}>Experiences planned with intention:</p>
            <div className={styles.expGrid}>
              {lovePreparation.experiences.map((exp) => (
                <div key={exp} className={styles.expCard}>
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className={styles.closing}>
            The goal has never been to impress her.<br />
            The goal has always been to love her intentionally.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
