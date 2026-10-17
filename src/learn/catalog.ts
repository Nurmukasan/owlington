import * as listening from '../pages/student/listening/content'
import * as reading from '../pages/student/reading/content'
import * as writing from '../pages/student/writing/content'
import type { SectionCourse, SectionId } from './types'

/** Every lecture and practice set, by section. Each section owns its own content.ts. */
export const CATALOG: Record<SectionId, SectionCourse> = {
  reading: { lectures: reading.lectures, practiceSets: reading.practiceSets },
  listening: { lectures: listening.lectures, practiceSets: listening.practiceSets },
  writing: { lectures: writing.lectures, practiceSets: writing.practiceSets },
}

export const findLecture = (section: SectionId, id: string | undefined) =>
  CATALOG[section].lectures.find((l) => l.id === id)

export const findPractice = (section: SectionId, id: string | undefined) =>
  CATALOG[section].practiceSets.find((p) => p.id === id)
