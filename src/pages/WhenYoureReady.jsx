import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import styles from './WhenYoureReady.module.css'

const PASSWORD = 'ifgodwillsit'

const sections = [
  {
    id: 'proposal',
    title: 'The Proposal Vision',
    icon: '◇',
    content: `I want it to be quiet. Private. Just the two of us. No audience. No performance. Just a moment that belongs entirely to us.

I've thought about a place that holds meaning — somewhere we've been together, or somewhere that feels like us. A calm evening. Good lighting. Something intentional.

I want to say the words I've been holding. Not rehearsed lines — the real ones. The ones that have been building since the moment I realized I was praying for the future and seeing your face in it.

And then I'll ask.`,
  },
  {
    id: 'ring',
    title: 'Ring Inspiration',
    icon: '✦',
    content: `Classic. Timeless. Nothing trendy — something that will look as right in thirty years as it does on the day.

I've been thinking: oval or round solitaire. A thin band. Yellow gold or platinum. Simple enough to feel elegant. Specific enough to feel chosen.

The stone should carry some weight — not just literally, but visually. Something that says this was thought about.

I want her to look at it every day and feel seen.`,
  },
  {
    id: 'letters',
    title: 'Letters I Haven\'t Sent',
    icon: '◆',
    content: `There are things I've written that aren't ready yet. Letters that need more time before they can be given.

Some of them are about the future I see clearly. Some of them are about the things I'm still working through. All of them are honest.

I'm keeping them until the moment is right. Until they can be received the way they were written — with patience and intention.

They will arrive when they're meant to.`,
  },
  {
    id: 'engagement',
    title: 'Engagement Thoughts',
    icon: '△',
    content: `I don't want a long engagement. Not because I'm impatient — but because once I know, I know. There's no reason to wait once the decision has been made by both of us.

I think about what that season looks like: planning together, making decisions together, learning to build together before we even begin.

I want it to feel like an adventure, not a checklist. I want her to feel excited about every part of it.`,
  },
  {
    id: 'wedding',
    title: 'Wedding Vision',
    icon: '○',
    content: `Intimate. Intentional. Beautiful without being excessive.

The people in the room should all belong there — people who have prayed for us, supported us, believed in this. Not a crowd. A gathering.

I want the ceremony to feel weighty. Like what's happening actually means something. A covenant, not a performance.

And then a celebration that feels like us — good food, good music, people we love, and the beginning of the rest of everything.`,
  },
  {
    id: 'bucketlist',
    title: 'Our Bucket List',
    icon: '✧',
    content: `Places to go:
Italy (Amalfi, Rome, Florence) · Japan in the spring · A road trip through the American West · Somewhere tropical and quiet · A European Christmas market

Things to do together:
Cook a full Sunday dinner every week · Build something with our hands · Start a family library · Host dinners for the people we love · Find a church we're both rooted in · Travel somewhere neither of us has been

Things to become:
A couple other couples look at and feel hopeful. A family that prays. A home that other people want to come back to. A story worth telling.`,
  },
]

export default function WhenYoureReady() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (password.trim().toLowerCase() === PASSWORD) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (!unlocked) {
    return (
      <div className={styles.lockScreen}>
        <div className={styles.lockInner}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to="/" className={styles.backLink}>
              <ArrowLeft size={14} />
              <span>Return</span>
            </Link>

            <div className={styles.lockIcon}>
              <Lock size={28} />
            </div>

            <h1 className={styles.lockTitle}>When You're Ready</h1>
            <p className={styles.lockSub}>
              This page is private. Some things are meant only for her.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="Enter the phrase..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <motion.p
                  className={styles.errorMsg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  That's not it. Try again.
                </motion.p>
              )}
              <button type="submit" className={styles.submit}>
                Enter
              </button>
            </form>

            <p className={styles.hint}>Hint: the phrase that holds this whole site.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={14} />
          <span>Return</span>
        </Link>
        <div className={styles.headerContent}>
          <FadeIn>
            <p className={styles.eyebrow}>Private</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className={styles.title}>When You're Ready</h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className={styles.subtitle}>
              These pages are just for us.
            </p>
          </FadeIn>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {sections.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}
        </div>
      </main>
    </div>
  )
}

function SectionCard({ section, index }) {
  const [open, setOpen] = useState(false)

  return (
    <FadeIn delay={index * 0.07}>
      <div className={styles.card}>
        <button className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
          <div className={styles.cardLeft}>
            <span className={styles.cardIcon}>{section.icon}</span>
            <h2 className={styles.cardTitle}>{section.title}</h2>
          </div>
          <motion.span
            className={styles.toggle}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
          >
            +
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className={styles.cardBody}
            >
              <div className={styles.cardBodyInner}>
                {section.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}
