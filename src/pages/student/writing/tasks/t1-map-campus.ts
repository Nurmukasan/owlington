import { task1 } from '../build'

const BEFORE = {
  title: 'Westfield College, 2005',
  description:
    'Plan of Westfield College in 2005, north at the top. The main entrance is in the middle of the south side, with a car park to its west. A path runs north from the entrance to the main teaching building in the centre. ' +
    'The library is a small building west of the teaching building. Sports fields cover the whole east side. A small lake lies in the north-west corner.',
  points: {},
  shapes: [
    { kind: 'parking' as const, x: 40, y: 330, w: 200, h: 100, label: 'Car park' },
    { kind: 'path' as const, d: 'M320 440 V 200' },
    { kind: 'building' as const, x: 260, y: 120, w: 140, h: 90, label: 'Teaching' },
    { kind: 'building' as const, x: 120, y: 160, w: 100, h: 70, label: 'Library' },
    { kind: 'field' as const, x: 440, y: 40, w: 170, h: 390, label: 'Sports fields' },
    { kind: 'water' as const, x: 40, y: 30, w: 160, h: 100, round: true, label: 'Lake' },
  ],
}

const NOW = {
  title: 'Westfield College, today',
  description:
    'Plan of Westfield College today, north at the top. The entrance is unchanged. The car park has been replaced by a bus stop and bicycle racks, with a café beside them. The teaching building has been extended to the north. ' +
    'The library has been rebuilt as a much larger learning centre. The northern half of the sports fields has become student accommodation; the southern half remains fields. The lake is unchanged and now has a footpath around it.',
  points: {},
  shapes: [
    { kind: 'building' as const, x: 40, y: 330, w: 90, h: 100, label: 'Café' },
    { kind: 'stage' as const, x: 140, y: 330, w: 100, h: 100, label: 'Bikes &\nbus stop' },
    { kind: 'path' as const, d: 'M320 440 V 200' },
    { kind: 'path' as const, d: 'M30 80 C 30 20, 210 20, 210 80 C 210 140, 30 140, 30 80' },
    { kind: 'building' as const, x: 260, y: 40, w: 140, h: 170, label: 'Teaching' },
    { kind: 'building' as const, x: 60, y: 160, w: 180, h: 120, label: 'Learning\ncentre' },
    { kind: 'building' as const, x: 440, y: 40, w: 170, h: 180, label: 'Student\nhousing' },
    { kind: 'field' as const, x: 440, y: 240, w: 170, h: 190, label: 'Fields' },
    { kind: 'water' as const, x: 40, y: 30, w: 160, h: 100, round: true, label: 'Lake' },
  ],
}

export default task1({
  id: 't1-map-campus',
  instructions: 'The plans below show a college campus in 2005 and today.',
  figure: {
    kind: 'map',
    title: 'Westfield College, 2005 and today',
    panels: [
      { label: '2005', spec: BEFORE },
      { label: 'Today', spec: NOW },
    ],
  },
  tips: [
    'Overview: more buildings, fewer cars, but the entrance, path and lake are the same.',
    'Describe the west side, the centre and the east side in turn.',
    'Use the passive: has been replaced, has been extended, has been rebuilt.',
  ],
  model: `
The two plans compare the layout of Westfield College in 2005 with its present-day appearance.

Overall, the campus has become more built-up and less dependent on cars, with new facilities replacing open space. However, the main entrance, the central path and the lake remain unchanged.

In the south-west, the car park next to the entrance has been removed. It has been replaced by a bus stop and bicycle racks, and a café has been constructed beside them. The small library to the west of the main teaching building has been demolished and rebuilt as a much larger learning centre. In addition, a footpath has been laid around the lake in the north-west corner.

In the centre of the campus, the teaching building has been extended northwards, roughly doubling in size. The most significant change, however, has taken place on the eastern side. The northern half of the sports fields has been converted into student accommodation, so only the southern half is still used for sport.
`,
  notes: [
    ['the layout of Westfield College in 2005 with its present-day appearance', 'LR', 'Paraphrase: plans → layout; today → present-day appearance.'],
    ['Overall, the campus has become more built-up and less dependent on cars', 'TA', 'The overview describes the general direction of change.'],
    ['In the south-west, the car park next to the entrance has been removed.', 'TA', 'Each change starts with its location.'],
    ['has been demolished and rebuilt as a much larger learning centre', 'GRA', 'Two passive verbs describe a two-step change.'],
    ['The northern half of the sports fields has been converted into student accommodation', 'LR', '“Converted into” for a change of use.'],
  ],
})
