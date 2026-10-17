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
}

export interface SectionCourse {
  lectures: Lecture[]
  practiceSets: PracticeInfo[]
}
