import FadeIn from './FadeIn'
import styles from './LetterSection.module.css'

export default function LetterSection() {
  return (
    <section id="letter" className={styles.section}>
      <div className={styles.inner}>
        <FadeIn delay={0}>
          <p className={styles.eyebrow}>Dear Adrienne</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className={styles.heading}>
            Before I ask for forever,<br />I want to become worthy of it.
          </h2>
        </FadeIn>

        <div className={styles.body}>
          <FadeIn delay={0.15}>
            <p>
              I'm not sure when you'll read this. Maybe before we've had the conversation.
              Maybe after. But I needed to write it anyway, because some things need to be
              said before they're ready to be said out loud.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              I've known for a while now that there's something about you that makes me want
              to be a better version of the man I currently am. Not perform better. Not present
              better. Actually become better. That distinction matters to me.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <blockquote className={styles.pullQuote}>
              "I do not want to simply love you loudly. I want to love you well."
            </blockquote>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              This is not a letter asking you to wait on me. It's a letter telling you I'm
              already working. Already praying. Already asking God to show me where I fall
              short — and giving me the courage to close those gaps.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              You deserve a man who leads. Not because culture tells him to, but because he
              has been in the presence of God long enough to understand what loving someone
              sacrificially actually means.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              You deserve a man who is consistent. Not just when it's easy. Not just when
              you're watching. Consistent when it costs him something.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              You deserve a man who chooses you. Every day. Even when choosing you is harder
              than the alternative.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className={styles.emphasis}>I want to be that man.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p>
              If God has written our story, I trust every page.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className={styles.signature}>
              Until then, I'm becoming.<br />
              <span>— Austin</span>
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
