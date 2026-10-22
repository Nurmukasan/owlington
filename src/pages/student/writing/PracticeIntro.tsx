import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import type { Attempt } from '../../../learn/progress'
import type { PracticeInfo } from '../../../learn/types'
import { formatClock } from '../../../learn/useTimer'
import { CHECKS, type TextAnalysis } from './analysis'
import { History } from './History'
import { taskLabel, type WritingPrompt } from './prompts'
import { formatBand } from './stats'
import { PromptCard } from './Studio'

interface PracticeIntroProps {
  info: PracticeInfo
  prompt: WritingPrompt
  number: number
  history: Attempt[]
  draftWords: number
  draftElapsed: number
  onStart: (fresh: boolean) => void
}

const emptyAnalysis: TextAnalysis = {
  words: 0,
  paragraphs: [],
  sentences: [],
  avgSentence: 0,
  linkers: [],
  linkerVariety: 0,
  overused: [],
  lexicalVariety: 0,
  contentVariety: 0,
  repeated: [],
}

/** The briefing before the clock starts: the task, what to expect and your record. */
export function PracticeIntro({ info, prompt, number, history, draftWords, draftElapsed, onStart }: PracticeIntroProps) {
  const best = history.reduce<Attempt | null>((b, a) => (!b || a.score / a.total > b.score / b.total ? a : b), null)
  const bestBand = history.reduce<number | null>((b, a) => (a.band && (b === null || a.band > b) ? a.band : b), null)
  const checklist = prompt.checks.map(
    (id) => CHECKS[id]({ text: '', analysis: emptyAnalysis, minWords: prompt.minWords, question: '', bullets: prompt.bulletChecks }).label,
  )
  const limit = prompt.minutes * 60
  const inkLeft = Math.max(0.08, Math.min(1, 1 - draftElapsed / limit))
  const hasDraft = draftWords > 0
  const kind = info.kinds[1] ?? info.kinds[0]

  return (
    <div className="wr-intro">
      <nav className="wr-intro__crumbs" aria-label="Breadcrumb">
        <Link to="/student/writing" className="wr-backlink">
          <span aria-hidden="true">←</span> The Inkwell Study
        </Link>
        <span className="wr-intro__no">Assignment No. {String(number).padStart(2, '0')}</span>
      </nav>

      <div className="wr-intro__top">
        <header className="wr-intro__head">
          <p className="wr-eyebrow">
            {taskLabel(prompt)} · {kind}
          </p>
          <h1 className="wr-intro__title wr-display">{info.title}</h1>
          <p className="wr-intro__summary">{info.summary}</p>
        </header>

        <section className={`wr-start ${hasDraft ? 'has-draft' : ''}`} aria-labelledby="wr-start-title">
          <h2 id="wr-start-title" className="visually-hidden">
            Start writing
          </h2>
          <div className="wr-start__plate">
            <span className="wr-start__bottle" aria-hidden="true" style={{ '--wr-v': hasDraft ? inkLeft : 1 } as CSSProperties}>
              <span className="wr-timer__cork" />
              <span className="wr-timer__glass">
                <span className="wr-timer__ink" />
              </span>
            </span>
            <dl className="wr-start__facts">
              <div>
                <dt>{hasDraft ? 'Ink left' : 'Ink clock'}</dt>
                <dd>{hasDraft ? formatClock(Math.max(0, limit - draftElapsed)) : `${prompt.minutes}:00`}</dd>
              </div>
              <div>
                <dt>Minimum</dt>
                <dd>
                  {prompt.minWords}
                  <small> words</small>
                </dd>
              </div>
              <div>
                <dt>Best band</dt>
                <dd>{bestBand === null ? '—' : formatBand(bestBand)}</dd>
              </div>
            </dl>
          </div>

          <div className="wr-start__actions">
            {hasDraft ? (
              <>
                <button type="button" className="wr-btn wr-start__go" onClick={() => onStart(false)}>
                  Resume your draft · {draftWords} words <span className="wr-btn__arrow" aria-hidden="true">→</span>
                </button>
                <button type="button" className="wr-btn wr-btn--ghost" onClick={() => onStart(true)}>
                  Start on fresh paper
                </button>
              </>
            ) : (
              <button type="button" className="wr-btn wr-start__go" onClick={() => onStart(false)}>
                Start the clock · {prompt.minutes} minutes <span className="wr-btn__arrow" aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <p className="wr-start__note">
            {hasDraft
              ? `Your draft was saved with ${formatClock(draftElapsed)} on the clock.`
              : history.length
                ? `${history.length} ${history.length === 1 ? 'essay' : 'essays'} on this prompt · best checklist ${best?.score}/${best?.total}`
                : 'A clean sheet — your first essay on this prompt starts the record.'}
          </p>
        </section>
      </div>

      <div className="wr-intro__grid">
        <div className="wr-intro__main">
          <div className="wr-intro__sheet">
            <span className="wr-stamp wr-intro__stamp">
              {prompt.task === 'task2' ? 'TASK 2' : 'TASK 1'} · {prompt.minutes} MIN · {prompt.minWords}+ WORDS
            </span>
            <PromptCard prompt={prompt} compact />
          </div>

          <aside className="wr-intro__owl" aria-labelledby="wr-tips-title">
            <TalkingOwl scale={3} look={1} />
            <div className="wr-intro__bubble">
              <h2 id="wr-tips-title" className="wr-intro__bubble-title">
                The professor’s tips
              </h2>
              <ul className="wr-intro__tips">
                {prompt.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="wr-intro__side">
          <section className="wr-brief" aria-labelledby="wr-brief-title">
            <h2 id="wr-brief-title" className="wr-brief__title">
              What happens next
            </h2>
            <ol className="wr-steps">
              <li className="wr-steps__step">
                <span className="wr-steps__n" aria-hidden="true">
                  1
                </span>
                <div>
                  <h3 className="wr-steps__name">Plan &amp; write</h3>
                  <p>
                    A {prompt.minutes}-minute ink clock you can pause, a live word count, linking words and sentence rhythm. Your
                    draft saves itself.
                  </p>
                </div>
              </li>
              <li className="wr-steps__step">
                <span className="wr-steps__n" aria-hidden="true">
                  2
                </span>
                <div>
                  <h3 className="wr-steps__name">Under the lamp</h3>
                  <p>Words, paragraphs, linking variety, sentence length, vocabulary range and your most repeated words.</p>
                </div>
              </li>
              <li className="wr-steps__step">
                <span className="wr-steps__n" aria-hidden="true">
                  3
                </span>
                <div>
                  <h3 className="wr-steps__name">Grade &amp; seal</h3>
                  <p>Assess yourself on the four official criteria, then read an annotated model answer.</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="wr-brief wr-brief--checks" aria-labelledby="wr-checks-title">
            <h2 id="wr-checks-title" className="wr-brief__title">
              Your 10-point checklist
            </h2>
            <p className="wr-brief__lead">Checked automatically when you hand in. Each point met is a point on your score.</p>
            <ol className="wr-brief__checks">
              {checklist.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ol>
          </section>

          {history.length > 0 && (
            <section className="wr-record" aria-label="Your record on this prompt">
              <dl className="wr-record__stats">
                <div>
                  <dt>Best band</dt>
                  <dd>{bestBand === null ? '—' : formatBand(bestBand)}</dd>
                </div>
                <div>
                  <dt>Best checklist</dt>
                  <dd>
                    {best?.score}/{best?.total}
                  </dd>
                </div>
                <div>
                  <dt>Essays</dt>
                  <dd>{history.length}</dd>
                </div>
              </dl>
              <History attempts={history} title="Read your past essays" />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
