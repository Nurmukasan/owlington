/** Owl FM dressing: tape shell colours and station frequencies (UI only, no answers). */

export interface TapeShell {
  shell: string
  shade: string
  label: string
}

const SHELLS: TapeShell[] = [
  { shell: '#36c9b5', shade: '#1d7f73', label: '#fff6e0' },
  { shell: '#ff6fcf', shade: '#a8357f', label: '#fff4ea' },
  { shell: '#ffb627', shade: '#b77400', label: '#fff8e6' },
  { shell: '#9b84ff', shade: '#5a43c2', label: '#f6f2ff' },
  { shell: '#ff8a6b', shade: '#b4482f', label: '#fff3ec' },
  { shell: '#5fc8ff', shade: '#2a7cb0', label: '#eef9ff' },
  { shell: '#c6ef6b', shade: '#6f9a1d', label: '#fbffe9' },
]

export const tapeShell = (index: number) => SHELLS[index % SHELLS.length]

export interface Station {
  /** MHz on the FM dial. */
  freq: number
  part: string
  callsign: string
}

export const STATIONS: Record<string, Station> = {
  'part1-enrolment': { freq: 88.1, part: 'PART 1', callsign: 'Conversation' },
  'part2-park': { freq: 93.4, part: 'PART 2', callsign: 'Monologue' },
  'part3-podcast': { freq: 99.7, part: 'PART 3', callsign: 'Discussion' },
  'part4-soundscapes': { freq: 104.2, part: 'PART 4', callsign: 'Lecture' },
}

export const stationFor = (id: string, index = 0): Station =>
  STATIONS[id] ?? { freq: 88 + index * 4.1, part: 'BROADCAST', callsign: 'Practice' }

export const DIAL_MIN = 87
export const DIAL_MAX = 108

export const formatFreq = (f: number) => f.toFixed(1)

/** The practice broadcast that best follows each lecture. */
export const LECTURE_PRACTICE: Record<string, string> = {
  predict: 'part1-enrolment',
  'numbers-spelling': 'part1-enrolment',
  distractors: 'part1-enrolment',
  'multiple-choice': 'part2-park',
  'maps-plans': 'part2-park',
  signposting: 'part4-soundscapes',
  part3: 'part3-podcast',
}
