import { task1 } from '../build'

export default task1({
  id: 't1-pie-waste',
  instructions: 'The pie charts below show what happened to household waste in the town of Dunmore in 2000 and 2024.',
  figure: {
    kind: 'pie',
    title: 'What happened to household waste in Dunmore',
    slices: ['Landfill', 'Recycled', 'Composted', 'Burned for energy', 'Other'],
    pies: [
      { label: '2000', values: [72, 11, 4, 8, 5] },
      { label: '2024', values: [18, 39, 21, 19, 3] },
    ],
  },
  mode: 'trend',
  tips: [
    'Landfill fell from almost three quarters to under a fifth — the main story.',
    'Recycling became the largest category. Say so in the overview.',
    'Group composting and energy: both roughly doubled or more.',
  ],
  model: `
The pie charts illustrate how the household rubbish of Dunmore was dealt with in 2000 and 2024.

Overall, the town sent far less waste to landfill in 2024 than in 2000, and recycling became the most common method of disposal. Composting and burning waste for energy also grew significantly.

In 2000, almost three quarters of household waste (72%) was buried in landfill sites. Recycling accounted for only 11%, while 8% was burned to produce energy and just 4% was composted. The remaining 5% was dealt with in a variety of other ways.

By 2024, the situation had changed completely. The proportion sent to landfill had fallen to 18%, a quarter of its earlier level. Recycling, in contrast, rose to 39%, making it the largest category. Composting increased more than fivefold to 21%, and the share burned for energy more than doubled to 19%. Other methods became even less important, falling to 3%.
`,
  notes: [
    ['how the household rubbish of Dunmore was dealt with', 'LR', 'Paraphrase: waste → rubbish; what happened to → how it was dealt with.'],
    ['Overall, the town sent far less waste to landfill in 2024 than in 2000', 'TA', 'The biggest change leads the overview.'],
    ['almost three quarters of household waste (72%)', 'LR', 'A fraction followed by the exact percentage.'],
    ['By 2024, the situation had changed completely.', 'CC', 'A short sentence signals the move to the second chart.'],
    ['Composting increased more than fivefold to 21%', 'LR', 'Multiples (fivefold, more than doubled) vary the language of change.'],
  ],
})
