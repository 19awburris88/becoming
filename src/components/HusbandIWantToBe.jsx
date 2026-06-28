import FadeIn from './FadeIn'
import { husbandCards } from '../data/content'
import styles from './HusbandIWantToBe.module.css'

export default function HusbandIWantToBe() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <FadeIn>
            <p className={styles.eyebrow}>The Husband I Want To Be</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className={styles.heading}>
              A husband in preparation.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className={styles.sub}>
              Not a finished product. A man actively becoming.
            </p>
          </FadeIn>
        </div>

        <div className={styles.grid}>
          {husbandCards.map((card, i) => (
            <FadeIn key={card.id} delay={i * 0.08}>
              <article className={styles.card}>
                <div className={styles.cardTop}>
<div className={styles.tags}>
                    {card.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.body}>{card.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
