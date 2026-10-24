import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-03',
  task1({
    id: 'wfull-03-t1',
    instructions: 'The pie charts below show the sources of electricity used in the region of Northvale in 2005 and 2025.',
    figure: {
      kind: 'pie',
      title: 'Sources of electricity in Northvale',
      slices: ['Coal', 'Gas', 'Nuclear', 'Wind', 'Solar'],
      pies: [
        { label: '2005', values: [46, 31, 18, 4, 1] },
        { label: '2025', values: [8, 34, 16, 27, 15] },
      ],
    },
    mode: 'trend',
    tips: [
      'Two pie charts from different years are a change over time: you can use rise and fall, but describe shares (“a quarter”, “almost half”).',
      'Coal collapsed and renewables grew: that switch is the overview.',
      'Gas and nuclear hardly changed — group them in one sentence instead of describing each in detail.',
    ],
    model: `
The two pie charts illustrate how the mix of energy sources used to generate electricity in Northvale changed between 2005 and 2025.

Overall, the region moved away from coal towards renewable energy over the twenty-year period. Whereas coal was the dominant source in 2005, wind and solar power together supplied more than two fifths of the region's electricity by 2025.

Coal dominated in 2005. It produced almost half of all electricity (46%), followed by gas at 31% and nuclear power at 18%. Renewable sources played only a minor role, with wind providing 4% and solar a mere 1%. Twenty years later, however, the share of coal had plummeted to just 8%, the smallest of the five sources.

Over the same period, wind power increased almost sevenfold to 27%, and solar energy rose from 1% to 15%. As a result, wind overtook nuclear power to become the second largest source. By contrast, the contributions of gas and nuclear energy remained relatively stable, at 34% and 16% respectively, so gas replaced coal as the most important source of electricity in 2025.
`,
    notes: [
      ['how the mix of energy sources used to generate electricity in Northvale changed', 'LR', 'Paraphrase: “sources of electricity used” becomes “the mix of energy sources used to generate electricity”.'],
      ['Overall, the region moved away from coal towards renewable energy', 'TA', 'One sentence captures the biggest story across both charts.'],
      ['It produced almost half of all electricity (46%)', 'LR', 'Approximations (“almost half”) plus the exact figure: the language examiners look for with pie charts.'],
      ['wind power increased almost sevenfold to 27%', 'TA', 'Expressing a change as a multiple makes the comparison precise.'],
      ['the contributions of gas and nuclear energy remained relatively stable', 'CC', 'The two stable sources are grouped rather than described separately.'],
    ],
  }),
  task2({
    id: 'wfull-03-t2',
    type: 'advantages',
    instructions: [
      'In many countries, a growing number of people now work from home for some or all of the week.',
      'Do the advantages of this development outweigh the disadvantages?',
    ],
    tips: [
      '“Outweigh” questions need a verdict: say in the introduction which side is stronger.',
      'One paragraph of advantages and one of disadvantages is the clearest plan.',
      'Think about both the worker and the employer — and wider society (traffic, city centres).',
    ],
    model: `
Since the pandemic of 2020, working from home has become normal for millions of office employees, and many now spend only part of the week in the workplace. Although this trend has some drawbacks for individuals and city centres, I believe its advantages are greater.

The most obvious benefit is the time and money saved on commuting. An employee who previously spent an hour on a crowded train each way gains ten hours a week, which can be spent with family, on exercise or simply resting. Remote work also allows companies to recruit from a much wider area. For instance, a software firm in London can employ a talented developer living in a small town hundreds of kilometres away, while reducing the cost of expensive office space.

However, there are disadvantages. Some workers feel isolated without the daily contact of an office, and young employees in particular may learn less, because they cannot watch and ask experienced colleagues. In addition, the boundary between work and home can disappear, so people answer emails late into the evening. City centres also suffer, as cafés and shops that depended on office workers lose customers.

On balance, these problems are real but manageable. Most of them can be reduced by a hybrid arrangement, such as three days at home and two in the office, which keeps the social and training benefits of the workplace. The time, money and flexibility gained, on the other hand, are lasting improvements to people's quality of life.

In conclusion, I am convinced that the advantages of working from home outweigh its disadvantages, especially when it is combined with regular days in the office.
`,
    notes: [
      ['Although this trend has some drawbacks for individuals and city centres, I believe its advantages are greater.', 'TA', 'The answer to “outweigh” is given immediately, so the reader knows where the essay is going.'],
      ['An employee who previously spent an hour on a crowded train each way gains ten hours a week', 'TA', 'A concrete calculation makes the advantage vivid.'],
      ['However, there are disadvantages.', 'CC', 'A short topic sentence signals the change of direction clearly.'],
      ['the boundary between work and home can disappear', 'LR', 'Natural, precise collocation for a common problem.'],
      ['On balance, these problems are real but manageable.', 'TA', 'The writer weighs the two sides explicitly before concluding.'],
    ],
  }),
)
