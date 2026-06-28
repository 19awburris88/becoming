import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { lovesCards } from '../data/content'
import FadeIn from './FadeIn'
import styles from './WhatILove.module.css'

export default function WhatILove() {
  const [active, setActive] = useState(null)

  const selected = lovesCards.find(c => c.id === active)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <FadeIn>
          <p className={styles.eyebrow}>What I Love About You</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className={styles.heading}>
            The parts of you I noticed<br />before I had the words for them.
          </h2>
        </FadeIn>
      </div>

      <div className={styles.grid}>
        {lovesCards.map((card, i) => (
          <FadeIn key={card.id} delay={i * 0.07}>
            <motion.button
              className={styles.card}
              onClick={() => setActive(card.id)}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
<h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.preview}>{card.preview}</p>
              <span className={styles.readMore}>Read more →</span>
            </motion.button>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {active && selected && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.close} onClick={() => setActive(null)}>
                <X size={18} />
              </button>
<h3 className={styles.modalTitle}>{selected.title}</h3>
              <p className={styles.modalBody}>{selected.body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
