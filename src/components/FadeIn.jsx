import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  y = 28,
  className,
  style,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
