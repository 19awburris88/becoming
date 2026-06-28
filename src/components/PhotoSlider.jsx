import { useRef } from 'react'
import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import styles from './PhotoSlider.module.css'

import blackRodeo from '../assets/black-rodeo.jpeg'
import brunoMars from '../assets/brunomars.JPG'
import girlfriendProposal from '../assets/girlfriend-proposal.JPEG'
import nye2025 from '../assets/nye 2025.PNG'
import valentines2026 from '../assets/valentines-2026.PNG'

// To add more photos later: import the file above and add an entry below
const photos = [
  { src: blackRodeo,          caption: 'Black Rodeo' },
  { src: brunoMars,           caption: 'Bruno Mars' },
  { src: girlfriendProposal,  caption: 'The Girlfriend Proposal' },
  { src: nye2025,             caption: 'NYE 2025' },
  { src: valentines2026,      caption: "Valentine's 2026" },
]

const rotations = [-2.5, 1.8, -1.2, 2.8, -2, 1.5, -3, 2]

export default function PhotoSlider() {
  const constraintRef = useRef(null)

  return (
    <section className={styles.section}>
      <FadeIn>
        <p className={styles.eyebrow}>Our Moments</p>
      </FadeIn>

      <div ref={constraintRef} className={styles.container}>
        <motion.div
          className={styles.track}
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.06}
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
