import { fullTest, task1, task2 } from '../build'

const BEFORE = {
  title: 'Ashdown in 1995',
  description:
    'Map of Ashdown village in 1995, north at the top. A main road runs east to west across the middle. North of the road there is farmland on the west side and a large wood on the east side. ' +
    'South of the road, from west to east: a river along the western edge, a row of small shops, the village green in the centre, and a small school in the south-east.',
  points: {},
  shapes: [
    { kind: 'river' as const, d: 'M50 20 C 70 160, 40 300, 60 450' },
    { kind: 'road' as const, d: 'M20 220 H 620' },
    { kind: 'field' as const, x: 90, y: 30, w: 290, h: 160, label: 'Farmland' },
    { kind: 'trees' as const, x: 400, y: 30, w: 210, h: 160, label: 'Woodland' },
    { kind: 'building' as const, x: 100, y: 260, w: 150, h: 60, label: 'Shops' },
    { kind: 'green' as const, x: 270, y: 260, w: 150, h: 150, label: 'Village green' },
    { kind: 'building' as const, x: 460, y: 300, w: 110, h: 80, label: 'School' },
  ],
}

const NOW = {
  title: 'Ashdown today',
  description:
    'Map of Ashdown village today, north at the top. A new bypass road runs along the northern edge. The main road still crosses the middle. The farmland has been replaced by a housing estate, and the western half of the wood by a sports centre; the eastern half of the wood remains. ' +
    'South of the road, the shops have been replaced by a supermarket with a car park, the village green is unchanged, and the school has been extended. A footbridge now crosses the river.',
  points: {},
  shapes: [
    { kind: 'river' as const, d: 'M50 20 C 70 160, 40 300, 60 450' },
    { kind: 'road' as const, d: 'M20 220 H 620' },
    { kind: 'road' as const, d: 'M20 40 H 620' },
    { kind: 'path' as const, d: 'M20 380 H 100' },
    { kind: 'building' as const, x: 90, y: 70, w: 290, h: 120, label: 'Housing estate' },
    { kind: 'building' as const, x: 400, y: 70, w: 100, h: 120, label: 'Sports\ncentre' },
    { kind: 'trees' as const, x: 510, y: 70, w: 100, h: 120, label: 'Wood' },
    { kind: 'building' as const, x: 100, y: 250, w: 150, h: 60, label: 'Supermarket' },
    { kind: 'parking' as const, x: 100, y: 320, w: 150, h: 50, label: 'P' },
    { kind: 'green' as const, x: 270, y: 260, w: 150, h: 150, label: 'Village green' },
    { kind: 'building' as const, x: 440, y: 270, w: 170, h: 130, label: 'School' },
  ],
}

export default fullTest(
  'wfull-06',
  task1({
    id: 'wfull-06-t1',
    instructions: 'The maps below show the village of Ashdown in 1995 and today.',
    figure: {
      kind: 'map',
      title: 'Ashdown village, 1995 and today',
      panels: [
        { label: '1995', spec: BEFORE },
        { label: 'Today', spec: NOW },
      ],
    },
    tips: [
      'Overview first: the village has become much more built-up, but the green and the main road have not changed.',
      'Use the passive and the present perfect: “the farmland has been replaced by…”, “a bypass has been built”.',
      'Work through the map by area (north, then south), saying where each change is.',
    ],
    model: `
The two maps illustrate the changes that have taken place in the village of Ashdown since 1995.

Overall, the village has become far more developed, with much of its open countryside replaced by buildings and new roads. Nevertheless, the main road and the village green have remained unchanged.

The most dramatic changes have occurred in the north. The farmland that once covered the north-west of the village has been converted into a large housing estate, and a bypass has been constructed along the northern edge. To the east of the housing, the woodland has been reduced to half its original size, because a sports centre was built on its western part.

South of the main road, the row of small shops in the west has been demolished. It has been replaced by a supermarket, with a car park next to it. The school in the south-east corner has been extended considerably and now occupies almost twice the space. Finally, a footbridge has been added across the river, connecting the western edge of the village with the countryside beyond it.
`,
    notes: [
      ['the changes that have taken place in the village of Ashdown since 1995', 'LR', 'A short, accurate introduction that does not copy the question.'],
      ['Overall, the village has become far more developed', 'TA', 'The overview says what changed in general — and what stayed the same.'],
      ['has been converted into a large housing estate', 'GRA', 'Present perfect passive: the key structure for map tasks.'],
      ['To the east of the housing', 'TA', 'Location phrases tell the reader exactly where each change happened.'],
      ['It has been replaced by a supermarket, with a car park next to it.', 'LR', 'Precise verbs of change: demolished, replaced, extended, added.'],
    ],
  }),
  task2({
    id: 'wfull-06-t2',
    type: 'opinion',
    instructions: [
      'Governments should spend more money on public transport than on building new roads.',
      'To what extent do you agree or disagree?',
    ],
    tips: [
      'Give your position in the introduction: agree, disagree or partly agree.',
      'Think about congestion, pollution, cost and people in rural areas.',
      'One idea per body paragraph, each with an example.',
    ],
    model: `
As cities grow, governments must decide how to spend limited transport budgets: on new roads for private cars, or on buses, trams and trains. I strongly agree that public transport should receive the larger share of investment, although some road building remains necessary in rural areas.

The main reason is that new roads rarely solve traffic problems for long. Experience in many cities shows that when a motorway is widened, more people decide to drive, and within a few years the new lanes are just as congested as the old ones. Public transport, by contrast, can move far more people in the same amount of space. For example, a single tram can carry around two hundred passengers, the equivalent of more than a hundred and fifty cars.

Investing in public transport also brings benefits for health and the environment. Buses and trains produce much less carbon dioxide per passenger than private cars, and cleaner air reduces breathing problems such as asthma, especially among children. In addition, good public transport helps people who cannot drive, such as the elderly, teenagers and those on low incomes, to reach jobs, schools and hospitals.

That said, roads cannot be ignored completely. In the countryside, where villages are far apart, buses are often impractical, and safe, well-maintained roads are essential. Even so, this means repairing existing roads rather than building large new ones.

In conclusion, I firmly believe that public transport deserves more funding than road construction, because it reduces congestion, pollution and inequality more effectively. Road spending should focus on maintenance and on the rural areas where there is no real alternative.
`,
    notes: [
      ['I strongly agree that public transport should receive the larger share of investment, although some road building remains necessary in rural areas', 'TA', 'A strong position, qualified by a sensible exception.'],
      ['when a motorway is widened, more people decide to drive', 'TA', 'An argument from experience, explained step by step.'],
      ['a single tram can carry around two hundred passengers', 'TA', 'A memorable comparison supports the point.'],
      ['That said, roads cannot be ignored completely.', 'CC', 'A concession paragraph that does not change the overall position.'],
      ['because it reduces congestion, pollution and inequality more effectively', 'LR', 'The conclusion summarises the three arguments with precise nouns.'],
    ],
  }),
)
