import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { endgame, endgameBold, endgameGold } from '../data/content'
import styles from './TheEndgame.module.css'

function Line({ text, index, isBold, isCopper }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.8 })

  return (
    <motion.p
      ref={ref}
      className={`${styles.line} ${isBold ? styles.lineBold : ''} ${isCopper ? styles.lineCopper : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {text}
    </motion.p>
  )
}

export default function TheEndgame() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.topRule} />

        <div className={styles.titleRow}>
          <span className={styles.roman}>I</span>
          <h2 className={styles.title}>{endgame.title}</h2>
          <span className={styles.roman}>I</span>
        </div>

        <div className={styles.body}>
          {endgame.body.map((line, i) => (
            <Line
              key={i}
              text={line}
              index={i}
              isBold={endgameBold.has(line)}
              isCopper={endgameGold.has(line)}
            />
          ))}
        </div>

        <div className={styles.bottomRule} />
      </div>
    </section>
  )
}
