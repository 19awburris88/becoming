import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import reasons from '../data/reasons.json'
import FadeIn from './FadeIn'
import styles from './HundredReasons.module.css'

function ReasonCard({ text, number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className={styles.number}>{String(number).padStart(2, '0')}</span>
      <p className={styles.text}>{text}</p>
    </motion.div>
  )
}

export default function HundredReasons() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <FadeIn>
          <p className={styles.eyebrow}>100 Reasons</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className={styles.heading}>
            Because loving you has made me<br />more intentional.
          </h2>
        </FadeIn>
      </div>

      <div className={styles.grid}>
        {reasons.map((reason, i) => (
          <ReasonCard key={i} text={reason} number={i + 1} />
        ))}
      </div>
    </section>
  )
}
