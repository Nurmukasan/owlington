import type { SectionId } from '../data/sections'

export type { SectionId }

export type Level = 'Foundation' | 'Intermediate' | 'Advanced'

export type LectureVideo =
  | { kind: 'file'; src: string; poster?: string }
  | { kind: 'youtube'; id: string }

export interface LectureChapter {
  title: string
  /** Key teaching points, shown one by one in the animated notes player. */
  points: string[]
}

export interface Lecture {
  /** Unique within its section; used in the URL: /student/<section>/lecture/<id>. */
  id: string
  title: string
  summary: string
  /** Planned length of the recorded video, in minutes. */
  minutes: number
  level: Level
  /** Set once a teacher uploads the video. Until then the player shows the animated notes. */
  video?: LectureVideo
  chapters: LectureChapter[]
}

/** The part of a practice set every section shares (lists, progress, achievements). */
export interface PracticeInfo {
  /** Unique within its section; used in the URL: /student/<section>/practice/<id>. */
  id: string
  title: string
  summary: string
  /** Suggested time limit, in minutes. */
  minutes: number
  /** Number of scored items: questions, or rubric points for writing. */
  questionCount: number
  /** Short labels for the task types, e.g. ["True / False / Not Given", "Matching headings"]. */
  kinds: string[]
  level: Level
  /**
   * 'full' — a complete IELTS paper section (Reading: 3 passages / 40 questions / 60 min;
   * Listening: 4 parts / 40 questions; Writing: Task 1 + Task 2 / 60 min).
   * 'focused' — a shorter practice on particular question or task types. Defaults to 'focused'.
   */
  format?: PracticeFormat
  /** Filter tags for the practice catalogue (question / task types). Defaults to `kinds`. */
  tags?: string[]
  /** When the test was added (YYYY-MM-DD), so the catalogue can sort newest first. */
  added?: string
}

export type PracticeFormat = 'full' | 'focused'

export interface SectionCourse {
  lectures: Lecture[]
  practiceSets: PracticeInfo[]
}
