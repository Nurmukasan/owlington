import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Attempt } from '../../../learn/progress'
import type { PracticeInfo } from '../../../learn/types'
import { metaFor, type WritingTask } from './content'
import type { Draft } from './drafts'
import { useRevealed, useSwipeRow } from './hooks'
import { bestBandOf, detailOf, formatBand, relativeTime } from './stats'
import { SwipePager } from './SwipePager'
import { countWords } from './words'

interface AssignmentTrayProps {
  sets: PracticeInfo[]
  best: Record<string, Attempt>
  attemptsFor: (id: string) => Attempt[]
  drafts: Record<string, Draft | null>
}

const GROUPS: { id: string; tasks: WritingTask[]; title: string; note: string }[] = [
  {
    id: 'task1',
    tasks: ['task1-academic', 'task1-gt'],
    title: 'Task 1 · Reports & letters',
    note: '20 minutes · at least 150 words · a third of your Writing score',
  },
  {
    id: 'task2',
    tasks: ['task2'],
    title: 'Task 2 · Essays',
    note: '40 minutes · at least 250 words · counts twice as much as Task 1',
  },
]

const TILTS = [-1.2, 0.9, -0.6, 1.3]

/** Practice prompts as typed assignment sheets, grouped by task. */
export function AssignmentTray({ sets, best, attemptsFor, drafts }: AssignmentTrayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRevealed(ref, 0.08)

  return (
    <section className="wr-section wr-tray" aria-labelledby="wr-tray-title">
      <div className="wr-section-head">
        <p className="wr-eyebrow">Practice · {sets.length} assignments</p>
        <h2 id="wr-tray-title">
          The assignment <em>tray</em>
        </h2>
        <p>
          Real exam-style prompts, a ticking ink clock and live feedback as you write. Seal an essay to grade it against a
          10-point checklist and the four official criteria.
        </p>
      </div>

      <div ref={ref} className={`wr-tray__groups ${revealed ? 'is-in' : ''}`}>
        {GROUPS.map((group) => {
          const items = sets.filter((s) => group.tasks.includes(metaFor(s.id).task))
          if (!items.length) return null
          return (
            <TrayGroup key={group.id} title={group.title} note={group.note}>
                {items.map((set, i) => {
                  const meta = metaFor(set.id)
                  const b = best[set.id]
                  const tries = attemptsFor(set.id)
                  const draft = drafts[set.id]
                  const draftWords = draft ? countWords(draft.text) : 0
                  // The circled grade is the highest judged band; the best checklist is shown beside it.
                  const topBand = bestBandOf(tries)
                  const index = sets.indexOf(set) + 1
                  const taskLabel = meta.task === 'task2' ? 'TASK 2' : meta.task === 'task1-gt' ? 'TASK 1 · GT' : 'TASK 1'
                  return (
                    <li key={set.id} className="wr-sheet" style={{ '--wr-tilt': `${TILTS[i % TILTS.length]}deg`, '--wr-i': index } as CSSProperties}>
                      <Link
                        to={`practice/${set.id}`}
                        className="wr-sheet__link"
                        aria-label={`Assignment ${index}: ${set.title}. ${set.kinds.join(', ')}. ${set.minutes} minutes, at least ${meta.minWords} words.${
                          b
                            ? ` Best band ${topBand === null ? 'not yet counted' : formatBand(topBand)}; best checklist ${b.score} of ${b.total}.`
                            : ' Not attempted yet.'
                        }${draftWords ? ` Draft saved with ${draftWords} words.` : ''}`}
                      >
                        <span className="wr-sheet__clip" aria-hidden="true" />
                        <span className="wr-sheet__head" aria-hidden="true">
                          <span>ASSIGNMENT No. {String(index).padStart(2, '0')}</span>
                          <span>{set.level.toUpperCase()}</span>
                        </span>
                        <span className="wr-sheet__title" aria-hidden="true">
                          {set.title}
                        </span>
                        <span className="wr-sheet__summary" aria-hidden="true">
                          {set.summary}
                        </span>
                        <span className="wr-sheet__stamps" aria-hidden="true">
                          <span className="wr-stamp wr-sheet__stamp">
                            {taskLabel} · {set.minutes} MIN · {meta.minWords}+ WORDS
                          </span>
                          <span className="wr-stamp wr-sheet__stamp wr-sheet__stamp--kind">{meta.stamp}</span>
                        </span>
                        <span className="wr-sheet__foot" aria-hidden="true">
                          {b ? (
                            <span className="wr-sheet__grade">
                              <svg viewBox="0 0 120 56" className="wr-sheet__circle">
                                <path d="M14 30 C10 12 50 4 82 8 C112 12 118 34 96 46 C72 56 26 54 14 38 C10 30 18 20 30 16" />
                              </svg>
                              <span className="wr-sheet__band">{topBand !== null ? formatBand(topBand) : `${b.score}/${b.total}`}</span>
                              <span className="wr-sheet__grade-note">
                                {topBand !== null ? `best band · checklist ${b.score}/${b.total}` : 'best checklist'} ·{' '}
                                {tries.length} {tries.length === 1 ? 'attempt' : 'attempts'}
                              </span>
                            </span>
                          ) : (
                            <span className="wr-sheet__fresh">Not yet attempted — fresh paper awaits</span>
                          )}
                          {draftWords > 0 && draft && (
                            <span className="wr-sheet__draft">
                              ✎ Draft · {draftWords} words · {relativeTime(draft.updatedAt)}
                            </span>
                          )}
                          {!draftWords && tries[0] && (
                            <span className="wr-sheet__last">Last: {detailOf(tries[0]).words} words · {relativeTime(tries[0].at)}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
            </TrayGroup>
          )
        })}
      </div>
    </section>
  )
}

/** One group of sheets: a grid on wide screens, a swipeable row with a pager on phones. */
function TrayGroup({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null)
  const row = useSwipeRow(listRef)
  return (
    <div className="wr-tray__group">
      <div className="wr-tray__group-head">
        <h3 className="wr-display">{title}</h3>
        <p>{note}</p>
      </div>
      <ul ref={listRef} className={`wr-tray__list ${row.scrollable && !row.atEnd ? 'has-more' : ''}`}>
        {children}
      </ul>
      <SwipePager row={row} noun="assignment" />
    </div>
  )
}
