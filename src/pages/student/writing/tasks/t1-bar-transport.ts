import { task1 } from '../build'

export default task1({
  id: 't1-bar-transport',
  instructions: 'The chart below shows how students at three schools in one town usually travel to school.',
  figure: {
    kind: 'bar',
    title: 'Usual way of travelling to school (% of students)',
    unit: '% of students',
    yLabel: '% of students',
    categories: ['Walk', 'Bicycle', 'Bus', 'Car'],
    yMax: 60,
    yStep: 10,
    series: [
      { id: 'hill', label: 'Hill Primary', values: [48, 6, 10, 36] },
      { id: 'river', label: 'River Secondary', values: [22, 18, 44, 16] },
      { id: 'park', label: 'Park College', values: [15, 31, 30, 24] },
    ],
  },
  tips: [
    'A comparison of three schools: no years, so no “increase” or “decrease”.',
    'Find the most common way for each school — they are all different. That is your overview.',
    'Group the information by school or by mode of transport, not both.',
  ],
  model: `
The bar chart compares the ways in which pupils at three schools in a single town normally get to school: on foot, by bicycle, by bus or by car.

Overall, each school had a different main mode of transport. Most primary pupils walked, the bus was the most common choice at the secondary school, and cycling was the most popular option at the college.

At Hill Primary, almost half of the children (48%) walked to school, and a further 36% were driven by car. In contrast, very few came by bus (10%), and cycling was the least common option, at only 6%.

River Secondary showed a very different pattern. The bus was used by 44% of students, twice the proportion who walked (22%). However, bicycles and cars were less popular, at 18% and 16% respectively. Park College had the most even distribution. Cycling was slightly more common than the bus, at 31% compared with 30%, while about a quarter of students arrived by car. Finally, walking was the least frequent choice there.
`,
  notes: [
    ['the ways in which pupils at three schools in a single town normally get to school', 'LR', 'Paraphrase: students → pupils; usually travel → normally get to school.'],
    ['Overall, each school had a different main mode of transport.', 'TA', 'A comparison overview, because there is no change over time.'],
    ['and a further 36% were driven by car', 'LR', '“A further” adds a second figure smoothly.'],
    ['River Secondary showed a very different pattern.', 'CC', 'A short topic sentence moves the reader to the next school.'],
    ['Park College had the most even distribution.', 'TA', 'A comparative judgement summarises the third school before the detail.'],
  ],
})
