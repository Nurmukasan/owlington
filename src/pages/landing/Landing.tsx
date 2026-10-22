import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { homeFor, useAuth } from '../../auth/auth-context'
import { NightScene } from '../../components/NightScene'
import { OwlMascot } from '../../components/OwlMascot'
import { ScrollLink } from '../../learn/components/ScrollLink'
import { PixelSprite } from '../../components/PixelSprite'
import { SECTIONS } from '../../data/sections'
import { OWL_HEAD, STAR_ICON } from '../../scene/sprites'
import { DitherEdge, PixelForest, StarField } from './decor'
import './Landing.css'

const STEPS = [
  {
    title: 'Choose your nest',
    text: 'Sign up as a student or a teacher. Each gets a dashboard built just for them.',
  },
  {
    title: 'Watch the lectures',
    text: 'Short, focused video lessons for Reading, Listening and Writing, taught by real IELTS teachers.',
  },
  {
    title: 'Practise by moonlight',
    text: 'Exam-style tasks and tips from the owl keep you sharp, night after night, until test day.',
  },
]

const YEAR = new Date().getFullYear()

const MARQUEE = ['READING', 'LISTENING', 'WRITING', 'VIDEO LECTURES', 'REAL TEST FORMAT', 'REAL TEACHERS']

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          <PixelSprite sprite={OWL_HEAD} scale={2} />
          <span>Owlington</span>
        </Link>
        <nav className="landing-nav__links" aria-label="Page sections">
          <ScrollLink to="skills">Skills</ScrollLink>
          <ScrollLink to="how">How it works</ScrollLink>
          <ScrollLink to="doors">For teachers</ScrollLink>
        </nav>
        <div className="landing-nav__actions">
          {user ? (
            <Link to={homeFor(user.role)} className="btn btn--amber notched">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-nav__login">
                Log in
              </Link>
              <Link to="/register" className="btn btn--amber notched">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        {/* ----------------------------------------------------------- hero */}
        <section className="hero">
          <StarField />
          <div className="hero__inner">
            <div className="hero__copy">
              <p className="eyebrow">
                <PixelSprite sprite={STAR_ICON} scale={2} />
                IELTS PREP FOR NIGHT OWLS
              </p>
              <h1 className="hero__title">
                Wise up for <em>IELTS.</em>
              </h1>
              <p className="hero__lede">
                Owlington is a cosy, moonlit place to prepare for IELTS Reading, Listening and Writing — with
                video lectures from real teachers and a pixel forest that makes studying feel like an adventure.
              </p>
              <div className="hero__ctas">
                <Link to="/register?role=student" className="btn btn--amber notched">
                  I’m a student <span aria-hidden="true">→</span>
                </Link>
                <Link to="/register?role=teacher" className="btn btn--ghost notched">
                  I’m a teacher
                </Link>
              </div>
              <ul className="hero__skills" aria-label="Sections">
                {SECTIONS.map((s) => (
                  <li key={s.id} style={{ '--accent': s.color } as CSSProperties}>
                    <PixelSprite sprite={s.icon} scale={2} />
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero__art">
              <div className="hero__moon" aria-hidden="true">
                <span className="hero__crater hero__crater--1" />
                <span className="hero__crater hero__crater--2" />
                <span className="hero__crater hero__crater--3" />
                <span className="hero__crater hero__crater--4" />
              </div>
              <svg className="hero__branch" viewBox="0 0 600 120" aria-hidden="true">
                <path
                  d="M640 58 C560 52 470 66 380 66 C300 66 230 76 150 70 C120 68 96 72 74 80"
                  stroke="#2a1d33"
                  strokeWidth="20"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M640 50 C560 44 470 58 380 58 C300 58 230 68 150 62"
                  stroke="#4b3b60"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path d="M118 70 C98 50 92 34 96 18" stroke="#2a1d33" strokeWidth="7" strokeLinecap="round" fill="none" />
                <g fill="#1f3a52">
                  <ellipse cx="96" cy="16" rx="16" ry="8" transform="rotate(-30 96 16)" />
                  <ellipse cx="70" cy="84" rx="18" ry="8" transform="rotate(20 70 84)" />
                  <ellipse cx="520" cy="40" rx="20" ry="9" transform="rotate(-15 520 40)" />
                </g>
                <g fill="#2f5878">
                  <ellipse cx="112" cy="30" rx="13" ry="6" transform="rotate(35 112 30)" />
                  <ellipse cx="560" cy="76" rx="18" ry="8" transform="rotate(25 560 76)" />
                </g>
              </svg>
              <OwlMascot className="hero__owl" />
              <p className="hero__hint" aria-hidden="true">
                psst… click me
              </p>
            </div>
          </div>
          <PixelForest />
        </section>

        <DitherEdge from="var(--night-1)" to="var(--cream)" />

        {/* --------------------------------------------------------- skills */}
        <section className="paper skills" id="skills">
          <div className="section-head">
            <p className="eyebrow eyebrow--ink">THE THREE SKILLS</p>
            <h2>
              Three skills. <em>One wise owl.</em>
            </h2>
            <p>Every lesson is built around the real test format, so nothing on exam day takes you by surprise.</p>
          </div>

          <div className="skills__grid">
            {SECTIONS.map((s, i) => (
              <article key={s.id} className="skill-card" style={{ '--accent': s.color } as CSSProperties}>
                <div className="skill-card__top">
                  <span className="skill-card__icon">
                    <PixelSprite sprite={s.icon} scale={4} />
                  </span>
                  <span className="skill-card__num">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.tagline}</p>
                <ul className="skill-card__format" aria-label="Test format">
                  {s.format.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <ul className="skill-card__skills" aria-label="What you’ll learn">
                  {s.skills.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1].map((copy) => (
              <span key={copy} className="marquee__group">
                {MARQUEE.map((word) => (
                  <span key={word}>
                    {word} <b>✦</b>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- how it works */}
        <section className="paper how" id="how">
          <div className="section-head">
            <p className="eyebrow eyebrow--ink">HOW IT WORKS</p>
            <h2>
              From first lecture <em>to test day.</em>
            </h2>
          </div>
          <ol className="how__steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="how__step">
                <span className="how__num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- doors */}
        <section className="paper doors" id="doors">
          <div className="section-head">
            <p className="eyebrow eyebrow--ink">TWO WAYS IN</p>
            <h2>
              Pick your <em>door.</em>
            </h2>
          </div>

          <div className="doors__grid">
            <article className="door door--student">
              <div className="door__window">
                <NightScene seed={7} owlLabel="Make the pixel owl hoot" />
                <span className="door__badge">LIVE PREVIEW</span>
              </div>
              <div className="door__body">
                <p className="door__tag">FOR STUDENTS</p>
                <h3>A forest that wants you to study.</h3>
                <p>
                  Your dashboard is a living pixel night: twinkling stars, falling stars, a huge moon and an owl
                  who always has a tip ready.
                </p>
                <Link to="/register?role=student" className="btn btn--amber notched">
                  Join as a student
                </Link>
              </div>
            </article>

            <article className="door door--teacher">
              <div className="door__window door__window--board" aria-hidden="true">
                <div className="board">
                  <p className="board__label">WRITING · TASK 2</p>
                  <p className="board__text">“Some people think… To what extent do you agree?”</p>
                  <p className="board__note">Intro → 2 body paragraphs → conclusion</p>
                  <PixelSprite sprite={OWL_HEAD} scale={4} className="board__owl" />
                </div>
              </div>
              <div className="door__body">
                <p className="door__tag">FOR TEACHERS</p>
                <h3>Your lessons, in front of the right students.</h3>
                <p>
                  Share video lectures, guide students through every skill and help them write better — one essay
                  at a time.
                </p>
                <Link to="/register?role=teacher" className="btn btn--ink notched">
                  Join as a teacher
                </Link>
              </div>
            </article>
          </div>
        </section>

        <DitherEdge from="var(--cream)" to="var(--night-1)" />

        {/* --------------------------------------------------------- finale */}
        <section className="finale">
          <StarField count={70} seed={21} />
          <div className="finale__moon" aria-hidden="true" />
          <h2>
            The moon is up.
            <br />
            <em>Time to study.</em>
          </h2>
          <Link to="/register" className="btn btn--amber notched">
            Create your account
          </Link>
        </section>
      </main>

      <footer className="footer">
        <span className="footer__brand">
          <PixelSprite sprite={OWL_HEAD} scale={2} /> Owlington
        </span>
        <span>© {YEAR} Owlington · Made for night owls everywhere.</span>
      </footer>
    </div>
  )
}
