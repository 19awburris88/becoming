import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { promises } from '../data/content'
import FadeIn from './FadeIn'
import styles from './Promises.module.css'

function PromiseItem({ text, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={styles.item}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className={styles.check}>
        <Check size={13} strokeWidth={2.5} />
      </span>
      <p className={styles.text}>{text}</p>
    </motion.div>
  )
}

export default function Promises() {
  return (
    <section id="promises" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <FadeIn>
            <p className={styles.eyebrow}>Promises I Am Practicing</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className={styles.heading}>
              Not wedding vows yet.<br />Life vows now.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className={styles.note}>
              This section represents preparation, not perfection.
            </p>
          </FadeIn>
        </div>

        <div className={styles.list}>
          {promises.map((promise, i) => (
            <PromiseItem key={promise} text={promise} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
