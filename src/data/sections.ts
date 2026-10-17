import { BOOK_ICON, HEADPHONES_ICON, PENCIL_ICON, type Sprite } from '../scene/sprites'

export type SectionId = 'reading' | 'listening' | 'writing'

export interface Section {
  id: SectionId
  title: string
  tagline: string
  color: string
  icon: Sprite
  /** The real IELTS test format for this section. */
  format: string[]
  skills: string[]
}

export const SECTIONS: Section[] = [
  {
    id: 'reading',
    title: 'Reading',
    tagline: 'Skim, scan and never fall for “Not Given” again.',
    color: 'var(--reading)',
    icon: BOOK_ICON,
    format: ['60 minutes', '3 passages', '40 questions'],
    skills: ['Skimming & scanning', 'True / False / Not Given', 'Matching headings'],
  },
  {
    id: 'listening',
    title: 'Listening',
    tagline: 'Train your ear for every accent, every trap, every word limit.',
    color: 'var(--listening)',
    icon: HEADPHONES_ICON,
    format: ['~30 minutes', '4 recordings', '40 questions'],
    skills: ['Form & note completion', 'Maps and plans', 'Spotting distractors'],
  },
  {
    id: 'writing',
    title: 'Writing',
    tagline: 'Turn charts into clear reports and opinions into well-argued essays.',
    color: 'var(--writing)',
    icon: PENCIL_ICON,
    format: ['60 minutes', '2 tasks', '150 + 250 words'],
    skills: ['Task 1 reports & letters', 'Task 2 essay structure', 'Coherence & vocabulary'],
  },
]

export const getSection = (id: string | undefined) => SECTIONS.find((s) => s.id === id)
