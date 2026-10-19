import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Nav.module.css'

const links = [
  { label: 'His Heart', href: '#letter' },
  { label: 'Our Story', href: '#story' },
  { label: 'Promises', href: '#promises' },
  { label: 'The Future', href: '#future' },
  { label: 'Prayer', href: '#prayer' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > window.innerHeight * 0.75)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to="/" className={styles.logoLink}>
        <svg className={styles.logoBook} viewBox="0 0 32 32" aria-hidden="true">
          <rect x="5" y="3" width="22" height="26" rx="2" fill="#6B1A1F" />
          <rect x="5" y="3" width="4" height="26" rx="1.5" fill="#4E1115" />
          <rect x="11.5" y="6" width="13" height="20" fill="none" stroke="#D9B46A" strokeWidth="1" />
          <path d="M18 12.5 L18.9 15.1 L21.5 16 L18.9 16.9 L18 19.5 L17.1 16.9 L14.5 16 L17.1 15.1 Z" fill="#D9B46A" />
        </svg>
        <span className={styles.logoText}>The Next Chapter</span>
      </Link>

      <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        {links.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen1 : ''}`} />
        <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen2 : ''}`} />
      </button>
    </motion.nav>
  )
}
