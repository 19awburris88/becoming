import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section className={styles.hero} ref={ref}>
      <motion.div className={styles.bg} style={{ y: bgY }} />
      <div className={styles.grain} />
      <div className={styles.overlay} />

      <motion.div className={styles.content} style={{ y: textY, opacity }}>
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p className={styles.eyebrow} variants={item}>
            If God wills it
          </motion.p>

          <motion.h1 className={styles.title} variants={item}>
            Becoming<br />Her Husband
          </motion.h1>

          <motion.p className={styles.subtitle} variants={item}>
            Not a Proposal. A Promise.
          </motion.p>

          <motion.p className={styles.copy} variants={item}>
            Before I ask for forever, I want to become the man worthy of it.
          </motion.p>

          <motion.div variants={item}>
            <a href="#letter" className={styles.cta}>
              Read My Heart
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </motion.div>
    </section>
  )
}
