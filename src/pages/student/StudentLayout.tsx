import { Suspense, useMemo, useRef } from 'react'
import { Outlet, useMatch } from 'react-router-dom'
import { useUser } from '../../auth/auth-context'
import { NightScene } from '../../components/NightScene'
import { AchievementToaster } from '../../learn/components/AchievementToaster'
import { useProgress } from '../../learn/useProgress'
import { OwlDialog, type OwlDialogHandle } from './OwlDialog'
import { StudentNav } from './StudentNav'
import '../../learn/learn.css'
import './student.css'

const TIPS = [
  'Reading tip: skim the whole passage for the main idea first, then scan for names, dates and numbers.',
  'True / False / Not Given: if the passage never mentions it, it’s NOT GIVEN — don’t use your own knowledge.',
  'Listening tip: you hear each recording only once, so read the questions before the audio starts.',
  'Watch the word limit! “NO MORE THAN TWO WORDS” means a third word costs you the mark.',
  'Spelling counts in Listening and Reading answers. “Accomodation”? Hoo-no — it’s “accommodation”.',
  'Writing Task 2 is worth twice as much as Task 1, so give it around 40 minutes.',
  'Task 1 needs at least 150 words, Task 2 at least 250. Count as you practise until you can feel it.',
]

function greeting(name: string) {
  const first = name.split(' ')[0] || 'friend'
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return `Hoo-hoo! Good morning, ${first}! It’s always night-time in the owl forest — perfect for studying.`
  if (hour >= 12 && hour < 18) return `Hoo-hoo! Good afternoon, ${first}! The stars are out early in the owl forest.`
  return `Hoo-hoo! Good evening, ${first}. Welcome to your study forest.`
}

const SECTION_IDS = ['reading', 'listening', 'writing']

export default function StudentLayout() {
  const user = useUser()
  const progress = useProgress()
  const isHome = useMatch('/student') !== null
  const sectionMatch = useMatch('/student/:section/*')
  const isSection = SECTION_IDS.includes(sectionMatch?.params.section ?? '')
  const dialogRef = useRef<OwlDialogHandle>(null)
  const streakDays = progress.streak.days
  const activeToday = progress.streak.activeToday

  const intro = useMemo(() => {
    const lines = [greeting(user.name)]
    if (streakDays > 1 && activeToday) lines.push(`${streakDays} nights in a row! You’re a true night owl. Keep that flame burning.`)
    else if (streakDays > 0 && !activeToday) lines.push(`Your ${streakDays}-day streak is waiting — one lecture or practice tonight keeps the flame alive!`)
    lines.push('Pick READING, LISTENING or WRITING up top for lectures and practice tests. Your scores and progress live in your profile — the owlet in the corner. Click me any time for a tip!')
    return lines
  }, [user.name, streakDays, activeToday])

  return (
    <div className={`student ${isHome ? 'student--home' : isSection ? 'student--section' : 'student--page'}`}>
      <NightScene
        className="student__scene"
        paused={isSection}
        owlLabel="Talk to the owl"
        onOwlClick={() => dialogRef.current?.advance()}
      >
        {(owlRect, size) =>
          isHome && <OwlDialog ref={dialogRef} intro={intro} tips={TIPS} owlRect={owlRect} sceneSize={size} />
        }
      </NightScene>

      <StudentNav user={user} />

      <main className="student__main">
        <Suspense fallback={<p className="student__loading">LOADING…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <AchievementToaster />
    </div>
  )
}
