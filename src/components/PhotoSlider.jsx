import { useRef } from 'react'
import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import styles from './PhotoSlider.module.css'

import { photos } from '../data/photos'

const rotations = [-2.5, 1.8, -1.2, 2.8, -2, 1.5, -3, 2]

// Apple's momentum projection: a flick travels as far as iOS scrolling would
// (deceleration 0.998/ms -> ~0.5 x velocity, decaying over ~500ms)
const DECELERATION = 0.998
const POWER = DECELERATION / (1 - DECELERATION) / 1000
const TIME_CONSTANT = -1 / Math.log(DECELERATION)

export default function PhotoSlider() {
  const constraintRef = useRef(null)
  const trackRef = useRef(null)

  // Land on the photo nearest where the flick was headed, not where the finger let go
  const snapToPhoto = (target) => {
    const cards = trackRef.current?.children
    if (!cards || cards.length < 2) return target
    const step = cards[1].offsetLeft - cards[0].offsetLeft
    return Math.round(target / step) * step
  }

  return (
    <section className={styles.section}>
      <FadeIn>
        <p className={styles.eyebrow}>Our Moments</p>
      </FadeIn>

      <div ref={constraintRef} className={styles.container}>
        <motion.div
          ref={trackRef}
          className={styles.track}
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.06}
          dragTransition={{
            power: POWER,
            timeConstant: TIME_CONSTANT,
            modifyTarget: snapToPhoto,
            // Past either end, ease back with no bounce
            bounceStiffness: 300,
            bounceDamping: 40,
          }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className={styles.polaroid}
              style={{ rotate: rotations[i % rotations.length] }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
            >
              <div className={styles.photoWrap}>
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className={styles.photo}
                  draggable={false}
                />
              </div>
              <p className={styles.caption}>{photo.caption}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <FadeIn delay={0.3}>
        <p className={styles.hint}>drag to explore</p>
      </FadeIn>
    </section>
  )
}
