import { useRef } from 'react'
import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import styles from './PhotoSlider.module.css'

import blackRodeo from '../assets/black-rodeo.jpeg'
import brunoMars from '../assets/brunomars.JPG'
import girlfriendProposal from '../assets/girlfriend-proposal.JPEG'
import nye2025 from '../assets/nye 2025.PNG'
import valentines2026 from '../assets/valentines-2026.PNG'
import willYou from '../assets/willyou.png'
import willYou2 from '../assets/willyou2.png'
import downtownStroll from '../assets/downtown-stroll.jpg'
import madeToLast from '../assets/made-to-last.jpg'
import usOpen from '../assets/us-open.jpg'
import goldenHour from '../assets/golden-hour.jpg'
import dateNight from '../assets/date-night.jpg'

// To add more photos later: import the file above and add an entry below
const photos = [
  { src: blackRodeo,          caption: 'Black Rodeo' },
  { src: brunoMars,           caption: 'Bruno Mars' },
  { src: girlfriendProposal,  caption: 'The Girlfriend Proposal' },
  { src: willYou,             caption: 'Will You?' },
  { src: willYou2,            caption: 'Will You? II' },
  { src: nye2025,             caption: 'NYE 2025' },
  { src: valentines2026,      caption: "Valentine's 2026" },
  { src: madeToLast,          caption: 'Made to Last' },
  { src: usOpen,              caption: 'US Open' },
  { src: goldenHour,          caption: "Adrienne's Birthday" },
  { src: dateNight,           caption: 'Date Night' },
  { src: downtownStroll,      caption: 'Rodeo' },
]

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
