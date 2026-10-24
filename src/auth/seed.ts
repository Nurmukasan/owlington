/**
 * Demo accounts for the front-end-only version: one admin, four teachers and
 * fifty students with believable progress, so the teacher and admin pages
 * have something to show. Loaded lazily, once per browser (per SEED_VERSION).
 *
 * Everything is generated from a fixed seed, so every browser gets the same
 * people and the same numbers. Accounts already on the device are never
 * overwritten.
 */
import { CATALOG } from '../learn/catalog'
import { lectureKey, rebuildProgress, type Attempt, type ProgressState } from '../learn/progress'
import type { SectionId } from '../learn/types'
import { bandForAccuracy } from '../pages/student/listening/answers'
import { bandEstimate } from '../pages/student/reading/library'
import { mulberry32, type Rng } from '../scene/random'
import { addSeedAccounts, type SeedAccount } from './mockAuthApi'

export const SEED_VERSION = 1
export const SEED_KEY = 'owlington:seed'

/** Demo sign-ins (shown in the README). */
export const DEMO_PASSWORDS = { admin: 'owl-admin-2026', teacher: 'owl-teacher-2026', student: 'owl-student-2026' }

const DAY = 24 * 60 * 60 * 1000

const TEACHERS: [string, string, string][] = [
  ['Aigerim', 'Sadykova', 'IELTS Reading & Writing, 9 years'],
  ['Daniyar', 'Akhmetov', 'Listening specialist, ex-examiner'],
  ['Sarah', 'Collins', 'Writing coach, CELTA, Delta'],
  ['Madina', 'Nurlanova', 'General IELTS, evening groups'],
]

const FIRST = [
  'Aruzhan', 'Alikhan', 'Dana', 'Nursultan', 'Aisha', 'Timur', 'Kamila', 'Yerlan', 'Zhanna', 'Arman',
  'Saule', 'Ruslan', 'Assel', 'Dias', 'Madina', 'Bekzat', 'Aliya', 'Sanzhar', 'Togzhan', 'Nurlan',
  'Malika', 'Adil', 'Dilnaz', 'Askar', 'Inkar', 'Yerassyl', 'Amina', 'Olzhas', 'Ayana', 'Daulet',
  'Sofia', 'Maxim', 'Alina', 'Artem', 'Diana', 'Ilya', 'Karina', 'Nikita', 'Elina', 'Danil',
  'Aigul', 'Miras', 'Zarina', 'Azamat', 'Akbota', 'Temirlan', 'Laura', 'Rakhat', 'Moldir', 'Erzhan',
]
const LAST = [
  'Bekova', 'Serikov', 'Omarova', 'Zhumabekov', 'Kassymova', 'Abenov', 'Iskakova', 'Tulegenov', 'Mukhamedova', 'Baimukhanov',
  'Sultanova', 'Karimov', 'Dzhaksybekova', 'Nurgaliyev', 'Tokayeva', 'Ospanov', 'Yesenova', 'Kenzhebayev', 'Amanova', 'Zhakupov',
  'Rakhimova', 'Utepov', 'Seitkali', 'Ermekov', 'Bolatova', 'Sarsenov', 'Kuanysheva', 'Aitkulov', 'Nurmagambetova', 'Kaliyev',
  'Ivanova', 'Petrov', 'Smirnova', 'Kozlov', 'Volkova', 'Sokolov', 'Morozova', 'Lebedev', 'Novikova', 'Pavlov',
  'Zhunusova', 'Akhmetzhanov', 'Ibraimova', 'Mukanov', 'Shaikenova', 'Dosmagambetov', 'Kim', 'Tleuov', 'Beisenova', 'Orazbayev',
]
const NOTES = [
  'Needs 7.0 for a master’s programme in the UK.',
  'Strong speaker; writing is the weak spot.',
  'Exam booked — focus on timing.',
  'Joined from the summer intensive.',
  'Wants band 6.5 for work migration.',
  'Struggles with map labelling in Listening.',
  '',
  '',
  'Retaking — previous overall 6.0.',
  '',
]

const pick = <T,>(rng: Rng, list: readonly T[]) => list[Math.floor(rng() * list.length)]
const shuffle = <T,>(rng: Rng, list: readonly T[]) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '')
const idFor = (kind: string, n: number) => `seed-${kind}-${String(n).padStart(2, '0')}`

function accounts(now: number) {
  const rng = mulberry32(2026)
  const list: SeedAccount[] = [
    {
      id: 'seed-admin',
      role: 'admin',
      firstName: 'Owlington',
      lastName: 'Admin',
      email: 'admin@owlington.app',
      password: DEMO_PASSWORDS.admin,
      createdAt: new Date(now - 200 * DAY).toISOString(),
    },
  ]
  TEACHERS.forEach(([first, last, notes], i) => {
    list.push({
      id: idFor('teacher', i + 1),
      role: 'teacher',
      firstName: first,
      lastName: last,
      email: `${slug(first)}.${slug(last)}@owlington.app`,
      password: DEMO_PASSWORDS.teacher,
      phone: `+7 701 ${200 + i * 37} ${10 + i * 11} ${20 + i * 7}`,
      notes,
      createdAt: new Date(now - (180 - i * 12) * DAY).toISOString(),
      avatar: { kind: 'owl', feathers: (i * 2 + 1) % 8 },
    })
  })
  for (let i = 0; i < 50; i++) {
    const first = FIRST[i]
    const last = LAST[i]
    // 46 students are spread across the teachers; the last four wait for the admin to assign them.
    const teacher = i < 46 ? idFor('teacher', (i % 4) + 1) : undefined
    const added = now - Math.floor(between(rng, 3, 150)) * DAY
    const exam = rng() < 0.45 ? new Date(now + Math.floor(between(rng, 14, 120)) * DAY).toISOString().slice(0, 10) : undefined
    list.push({
      id: idFor('student', i + 1),
      role: 'student',
      firstName: first,
      lastName: last,
      email: `${slug(first)}.${slug(last)}@student.owlington.app`,
      password: DEMO_PASSWORDS.student,
      phone: `+7 7${pick(rng, ['01', '02', '05', '07', '47', '75', '77'])} ${Math.floor(between(rng, 100, 999))} ${Math.floor(between(rng, 10, 99))} ${Math.floor(between(rng, 10, 99))}`,
      targetBand: pick(rng, [6, 6.5, 6.5, 7, 7, 7, 7.5, 8]),
      notes: pick(rng, NOTES) || undefined,
      examDate: exam,
      teacherId: teacher,
      createdAt: new Date(added).toISOString(),
      ...(rng() < 0.5 ? { avatar: { kind: 'owl' as const, feathers: Math.floor(rng() * 8) } } : {}),
    })
  }
  return list
}

function between(rng: Rng, min: number, max: number) {
  return min + rng() * (max - min)
}

/** A believable learning history between `from` and `now`, driven by an ability and an activity level. */
function progressFor(index: number, from: number, now: number): ProgressState {
  const rng = mulberry32(9000 + index)
  const ability = between(rng, 0.42, 0.93)
  const activity = Math.pow(rng(), 0.7)
  const state = { lectures: {} as ProgressState['lectures'], attempts: [] as Attempt[] }
  const days = Math.max(1, (now - from) / DAY)
  const at = () => new Date(from + rng() * days * DAY).toISOString()

  for (const section of ['reading', 'listening', 'writing'] as SectionId[]) {
    const { lectures, practiceSets } = CATALOG[section]
    // Lectures: watched in order, the last one perhaps half-way.
    const watched = Math.min(lectures.length, Math.round(lectures.length * activity * between(rng, 0.5, 1.2)))
    lectures.slice(0, watched + 1).forEach((l, i) => {
      const when = at()
      const done = i < watched
      state.lectures[lectureKey(section, l.id)] = {
        watched: done ? 1 : Number(between(rng, 0.1, 0.8).toFixed(2)),
        position: 0,
        updatedAt: when,
        ...(done ? { completedAt: when } : {}),
      }
    })

    // Tests: a share of the section, a few retaken.
    const share = section === 'writing' ? 0.35 : 0.55
    const count = Math.round(practiceSets.length * activity * share * between(rng, 0.4, 1.1))
    const chosen = shuffle(rng, practiceSets).slice(0, count)
    for (const info of chosen) {
      const tries = rng() < 0.2 ? 2 : 1
      for (let t = 0; t < tries; t++) {
        const skill = Math.min(0.98, ability + (t ? 0.05 : 0) + between(rng, -0.12, 0.1))
        const when = at()
        let attempt: Attempt
        if (section === 'writing') {
          const full = info.format === 'full'
          const crit = Array.from({ length: 4 }, () => Math.max(5, Math.min(8, Math.round(4 + skill * 4.6 + between(rng, -0.7, 0.7)))))
          const band = Math.round((crit.reduce((a, b) => a + b, 0) / 4) * 2) / 2
          const total = full ? 20 : 10
          const score = Math.max(2, Math.min(total, Math.round(total * (skill + between(rng, -0.1, 0.1)))))
          const words = full ? Math.round(between(rng, 380, 520)) : Math.round(between(rng, info.minutes > 20 ? 240 : 140, info.minutes > 20 ? 330 : 210))
          attempt = {
            practiceId: info.id,
            section,
            at: when,
            score,
            total,
            band,
            words,
            durationSec: Math.round(info.minutes * 60 * between(rng, 0.7, 1.1)),
            criteria: full
              ? [
                  { label: 'Task 1', band: Math.max(5, band - 0.5) },
                  { label: 'Task 2', band },
                ]
              : [
                  { label: 'Task Achievement / Response', band: crit[0] },
                  { label: 'Coherence & Cohesion', band: crit[1] },
                  { label: 'Lexical Resource', band: crit[2] },
                  { label: 'Grammatical Range & Accuracy', band: crit[3] },
                ],
            detail: { words, text: '', criteria: { TA: crit[0], CC: crit[1], LR: crit[2], GRA: crit[3] }, ...(full ? { tasks: [Math.max(5, band - 0.5), band] } : {}) },
            xp: 0,
          }
        } else {
          const total = info.questionCount
          const score = Math.max(0, Math.min(total, Math.round(total * skill)))
          const kinds = info.kinds.length ? info.kinds : ['Questions']
          const wrong = new Set(shuffle(rng, Array.from({ length: total }, (_, i) => i)).slice(0, total - score))
          attempt = {
            practiceId: info.id,
            section,
            at: when,
            score,
            total,
            band: section === 'reading' ? bandEstimate(score, total) : bandForAccuracy(score / total),
            durationSec: Math.round(info.minutes * 60 * between(rng, 0.6, 1.05)),
            items: Array.from({ length: total }, (_, i) => ({ n: i + 1, type: kinds[Math.floor((i / total) * kinds.length)], correct: !wrong.has(i) })),
            xp: 0,
          }
        }
        state.attempts.push(attempt)
      }
    }
  }

  // XP, streak days and achievements follow from the history, under the same rules as the app.
  return rebuildProgress(state)
}

/** Adds the demo people (and their histories) if this browser hasn't had them yet. */
export async function seedDemo() {
  try {
    if (Number(localStorage.getItem(SEED_KEY)) >= SEED_VERSION) return
    const now = Date.now()
    const list = accounts(now)
    const added = new Set(await addSeedAccounts(list))
    list.forEach((a, i) => {
      if (a.role !== 'student' || !added.has(a.id)) return
      const key = `owlington:progress:${a.id}`
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, JSON.stringify(progressFor(i, new Date(a.createdAt).getTime(), now)))
    })
    localStorage.setItem(SEED_KEY, String(SEED_VERSION))
  } catch {
    // Storage full or blocked: the app still works, just without demo people.
  }
}
