import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { letters } from '../data/content'
import FadeIn from '../components/FadeIn'
import styles from './Letters.module.css'

export default function Letters() {
  const [active, setActive] = useState(null)
  const selected = letters.find(l => l.id === active)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={16} />
          <span>Return</span>
        </Link>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>Letter Archive</p>
          <h1 className={styles.title}>Letters to Adrienne</h1>
          <p className={styles.subtitle}>
            Written across time. Kept with intention.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.list}>
          {letters.map((letter, i) => (
            <FadeIn key={letter.id} delay={i * 0.1}>
              <button
                className={styles.letterCard}
                onClick={() => setActive(letter.id)}
              >
                <div className={styles.cardLeft}>
                  <span className={styles.letterDate}>{letter.date}</span>
                  <h2 className={styles.letterTitle}>{letter.title}</h2>
                  <p className={styles.letterExcerpt}>{letter.excerpt}</p>
                </div>
                <span className={styles.readArrow}>→</span>
              </button>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className={styles.note}>
            <p>More letters will be added over time.</p>
          </div>
        </FadeIn>
      </main>

      <AnimatePresence>
        {active && selected && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.article
              className={styles.modal}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.close} onClick={() => setActive(null)}>
                <X size={16} />
              </button>

              <p className={styles.modalDate}>{selected.date}</p>
              <h2 className={styles.modalTitle}>{selected.title}</h2>

              <div className={styles.modalBody}>
                {selected.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <p className={styles.modalSig}>— Austin</p>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
