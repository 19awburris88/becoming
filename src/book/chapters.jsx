import { Check } from 'lucide-react'
import {
  timeline,
  datesArray,
  lovesCards,
  husbandCards,
  lovePreparation,
  promises,
  endgame,
  endgameBold,
  endgameGold,
  alreadyBuilding,
  futureVisions,
} from '../data/content'
import reasons from '../data/reasons.json'
import { photos } from '../data/photos'
import Opener from './Opener'
import S from './Book.module.css'

// The book's contents. Each chapter is a list of blocks; pages break between
// blocks, never inside one. A block is { node, keepWithNext? } — keepWithNext
// holds a sub-heading on the same page as whatever follows it.
//
// tone: the paper the chapter is printed on, matching the scrolling site's rhythm
//   light = ivory, sand = warm sand, dark = oxblood, deep = deep oxblood

const p = (text, className = S.para) => ({ node: <p className={className}>{text}</p> })

const letter = {
  id: 'letter',
  mark: 'Chapter I',
  title: 'Dear Adrienne',
  tone: 'light',
  blocks: [
    { node: <Opener number="I" eyebrow="Dear Adrienne" heading={<>Before I ask for forever,<br />I want to become worthy of it.</>} /> },
    p("I'm not sure when you'll read this. Maybe before we've had the conversation. Maybe after. But I needed to write it anyway, because some things need to be said before they're ready to be said out loud."),
    p("I've known for a while now that there's something about you that makes me want to be a better version of the man I currently am. Not perform better. Not present better. Actually become better. That distinction matters to me."),
    { node: <blockquote className={S.pullQuote}>"I do not want to simply love you loudly. I want to love you well."</blockquote> },
    p("This is not a letter asking you to wait on me. It's a letter telling you I'm already working. Already praying. Already asking God to show me where I fall short — and giving me the courage to close those gaps."),
    p('You deserve a man who leads. Not because culture tells him to, but because he has been in the presence of God long enough to understand what loving someone sacrificially actually means.'),
    p("You deserve a man who is consistent. Not just when it's easy. Not just when you're watching. Consistent when it costs him something."),
    p('You deserve a man who chooses you. Every day. Even when choosing you is harder than the alternative.'),
    p('I want to be that man.', S.emphasis),
    p('If God has written our story, I trust every page.'),
    { node: <p className={S.signature}>Until then, I'm becoming.<br /><span>— Austin</span></p> },
  ],
}

const story = {
  id: 'story',
  mark: 'Chapter II',
  title: 'Our Story',
  tone: 'dark',
  blocks: [
    { node: <Opener number="II" eyebrow="Our Story" heading={<>For years our paths crossed.<br />Then our worlds aligned.</>} /> },
    ...timeline.map(item => ({
      node: (
        <div className={`${S.moment} ${item.isFuture ? S.momentFuture : ''}`}>
          <span className={S.momentDate}>{item.date}</span>
          <h3 className={S.momentLabel}>{item.label}</h3>
          <p className={S.momentText}>{item.text}</p>
        </div>
      ),
    })),
    {
      keepWithNext: true,
      node: (
        <div className={S.subOpener}>
          <p className={S.eyebrow}>The Dates</p>
          <h3 className={S.subHeading}>Every date. All of them intentional.</h3>
          <p className={S.sub}>In no particular order. Still adding.</p>
        </div>
      ),
    },
    ...datesArray.map(entry => ({
      node: (
        <div className={S.dateRow}>
          <span className={S.dateName}>
            {entry.name}
            {entry.note && <em className={S.dateTag}>{entry.note}</em>}
          </span>
          <span className={S.leader} />
          <span className={S.dateNum}>{String(entry.id).padStart(2, '0')}</span>
        </div>
      ),
    })),
  ],
}

const rotations = [-1.6, 1.2, -0.8, 1.8, -1.2, 1]

const moments = {
  id: 'moments',
  mark: 'Interlude',
  title: 'Our Moments',
  tone: 'dark',
  blocks: [
    { node: <Opener label="Interlude" eyebrow="Our Moments" /> },
    ...photos.map((photo, i) => ({
      node: (
        <figure className={S.plate} style={{ rotate: `${rotations[i % rotations.length]}deg` }}>
          <div className={S.plateImage}>
            <img src={photo.src} alt={photo.caption} draggable={false} />
          </div>
          <figcaption className={S.plateCaption}>{photo.caption}</figcaption>
        </figure>
      ),
    })),
  ],
}

const loves = {
  id: 'loves',
  mark: 'Chapter III',
  title: 'What I Love About You',
  tone: 'light',
  blocks: [
    { node: <Opener number="III" eyebrow="What I Love About You" heading={<>The parts of you I noticed<br />before I had the words for them.</>} /> },
    ...lovesCards.map(card => ({
      node: (
        <article className={S.card}>
          <h3 className={S.cardTitle}>{card.title}</h3>
          <p className={S.cardKicker}>{card.preview}</p>
          <p className={S.cardBody}>{card.body}</p>
        </article>
      ),
    })),
  ],
}

const husband = {
  id: 'husband',
  mark: 'Chapter IV',
  title: 'The Husband I Want To Be',
  tone: 'sand',
  blocks: [
    { node: <Opener number="IV" eyebrow="The Husband I Want To Be" heading="A husband in preparation." sub="Not a finished product. A man actively becoming." /> },
    ...husbandCards.map(card => ({
      node: (
        <article className={S.card}>
          <div className={S.tags}>
            {card.tags.map(tag => <span key={tag} className={S.tag}>{tag}</span>)}
          </div>
          <h3 className={S.cardTitle}>{card.title}</h3>
          <p className={S.cardBody}>{card.body}</p>
        </article>
      ),
    })),
  ],
}

const preparation = {
  id: 'preparation',
  mark: 'Chapter V',
  title: 'Love Looks Like Preparation',
  tone: 'light',
  blocks: [
    { node: <Opener number="V" eyebrow="Love Looks Like Preparation" heading="People often think love is measured in grand gestures." /> },
    {
      node: (
        <div className={S.editorial}>
          <p>Sometimes it is.</p>
          <p>But more often, love is measured in consistency.</p>
          <p>It looks like showing up.</p>
          <p>It looks like paying attention.</p>
          <p>It looks like remembering.</p>
          <p>It looks like planning.</p>
          <p>It looks like sacrifice.</p>
        </div>
      ),
    },
    p("Since we've been together, I've had the privilege of loving Adrienne through moments both big and small. Some memories are simple. Some are extravagant. All of them were intentional."),
    { keepWithNext: true, node: <p className={S.listLabel}>Some of the ways love has shown up:</p> },
    ...lovePreparation.acts.map(act => ({
      node: <p className={S.bullet}><span className={S.bulletDot} />{act}</p>,
    })),
    {
      node: (
        <div>
          <p className={S.listLabel}>Experiences planned with intention:</p>
          <div className={S.chips}>
            {lovePreparation.experiences.map(exp => <span key={exp} className={S.chip}>{exp}</span>)}
          </div>
        </div>
      ),
    },
    { node: <p className={S.closingLine}>The goal has never been to impress her.<br />The goal has always been to love her intentionally.</p> },
  ],
}

const vows = {
  id: 'promises',
  mark: 'Chapter VI',
  title: 'Promises I Am Practicing',
  tone: 'dark',
  blocks: [
    { node: <Opener number="VI" eyebrow="Promises I Am Practicing" heading={<>Not wedding vows yet.<br />Life vows now.</>} sub="This section represents preparation, not perfection." /> },
    ...promises.map(promise => ({
      node: (
        <p className={S.promise}>
          <span className={S.check}><Check size={12} strokeWidth={2.5} /></span>
          {promise}
        </p>
      ),
    })),
  ],
}

const theEndgame = {
  id: 'endgame',
  mark: 'Interlude',
  title: endgame.title,
  tone: 'dark',
  blocks: [
    { node: <Opener heading={endgame.title} /> },
    ...endgame.body.map(line => ({
      node: (
        <p className={`${S.endLine} ${endgameBold.has(line) ? S.endBold : ''} ${endgameGold.has(line) ? S.endGold : ''}`}>
          {line}
        </p>
      ),
    })),
  ],
}

const future = {
  id: 'future',
  mark: 'Chapter VII',
  title: 'Already Building Our Future',
  tone: 'light',
  blocks: [
    { node: <Opener number="VII" eyebrow="Already Building Our Future" heading={<>The foundation isn't coming.<br />It's already being laid.</>} sub="Instead of dreams, here are real things we're already doing together." /> },
    ...alreadyBuilding.map(item => ({
      node: <p className={S.bullet}><span className={S.bulletDot} />{item.label}</p>,
    })),
    {
      keepWithNext: true,
      node: (
        <div className={S.subOpener}>
          <p className={S.eyebrow}>The Vision</p>
          <h3 className={S.subHeading}>Where we're going.</h3>
        </div>
      ),
    },
    ...futureVisions.map(vision => ({
      node: (
        <article className={S.card}>
          <h3 className={S.cardTitle}>{vision.title}</h3>
          <p className={S.cardBody}>{vision.vision}</p>
        </article>
      ),
    })),
  ],
}

const hundred = {
  id: 'reasons',
  mark: 'Chapter VIII',
  title: '100 Reasons',
  tone: 'sand',
  blocks: [
    { node: <Opener number="VIII" eyebrow="100 Reasons" heading={<>Because loving you has made me<br />more intentional.</>} /> },
    ...reasons.map((reason, i) => ({
      node: (
        <p className={S.reason}>
          <span className={S.reasonNum}>{String(i + 1).padStart(2, '0')}</span>
          <span>{reason}</span>
        </p>
      ),
    })),
  ],
}

const prayer = {
  id: 'prayer',
  mark: 'Chapter IX',
  title: 'My Prayer',
  tone: 'deep',
  blocks: [
    { node: <Opener number="IX" eyebrow="If God Wills It" heading="My Prayer" /> },
    p('Father,', S.salutation),
    p('If she is the one You have written for me — cover her.', S.prayerLine),
    p('Protect her in seasons I cannot reach her. Be the peace in her spaces. Be the clarity in her uncertainty. Remind her daily that she is chosen by You before she is chosen by anyone else.', S.prayerLine),
    p('And Lord, make me the man she deserves.', S.prayerLine),
    p('Give me patience when I want to be impatient. Give me humility when I want to be right. Give me consistency when discipline is difficult. Give me a love that looks more like Yours than it does mine.', S.prayerLine),
    p('Let me be the kind of man who makes it easier for her to trust You by the way I love her.', S.prayerLine),
    p("If You have written our story, Lord, I trust every chapter. I trust the ones I understand. I trust the ones I don't. I trust the timing I cannot control and the outcome I cannot guarantee.", S.prayerLine),
    p('I will keep becoming.', S.prayerClose),
    p('If God wills it.', S.prayerWill),
    p('Amen.', S.amen),
  ],
}

const closing = {
  id: 'closing',
  mark: 'Epilogue',
  title: 'Until then',
  tone: 'light',
  blocks: [
    { node: <Opener label="The Next Chapter" eyebrow="Until then" /> },
    { node: <h2 className={S.statement}>"If God has written our story,<br />I trust every page."</h2> },
    {
      node: (
        <div className={S.signoff}>
          <span className={S.signoffRule} />
          <p className={S.signoffName}>Austin Burris</p>
          <p className={S.signoffNote}>Written with faith, patience, and hope.</p>
          <p className={S.signoffWill}>If God wills it.</p>
        </div>
      ),
    },
  ],
}

export const chapters = [
  letter,
  story,
  moments,
  loves,
  husband,
  preparation,
  vows,
  theEndgame,
  future,
  hundred,
  prayer,
  closing,
]
