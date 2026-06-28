import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { timeline, datesArray } from '../data/content'
import FadeIn from './FadeIn'
import styles from './OurStory.module.css'

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <motion.div
      ref={ref}
      className={`${styles.item} ${item.isFuture ? styles.future : ''}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
    >
      <div className={styles.connector} />
      <div className={styles.card}>
        <span className={styles.date}>{item.date}</span>
        <h3 className={styles.label}>{item.label}</h3>
        <p className={styles.text}>{item.text}</p>
      </div>
    </motion.div>
  )
}

function DateCard({ entry, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const isFirst = entry.id === 1

  return (
    <motion.div
      ref={ref}
      className={`${styles.dateCard} ${isFirst ? styles.dateCardFirst : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 6) * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className={styles.dateNum}>{String(entry.id).padStart(2, '0')}</span>
      <span className={styles.dateName}>{entry.name}</span>
      {isFirst && <span className={styles.dateTag}>The First</span>}
    </motion.div>
  )
}

export default function OurStory() {
  return (
    <section id="story" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Our Story</p>
        <h2 className={styles.heading}>
          For years our paths crossed.<br />Then our worlds aligned.
        </h2>
      </div>

      <div className={styles.timeline}>
        <div className={styles.line} />
        {timeline.map((item, i) => (
          <TimelineItem key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className={styles.datesSection}>
        <FadeIn>
          <div className={styles.datesHeader}>
            <p className={styles.datesEyebrow}>The Dates</p>
            <h3 className={styles.datesHeading}>Every date. All of them intentional.</h3>
            <p className={styles.datesSub}>
              In no particular order. Still adding.
            </p>
          </div>
        </FadeIn>

        <div className={styles.datesGrid}>
          {datesArray.map((entry, i) => (
            <DateCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
