import { task1 } from '../build'

export default task1({
  id: 't1-line-tourism',
  instructions: 'The graph below shows the number of overseas visitors, in millions, to three countries between 2000 and 2025.',
  figure: {
    kind: 'line',
    title: 'Overseas visitors (millions)',
    unit: 'millions of visitors',
    yLabel: 'Millions of visitors',
    xs: ['2000', '2005', '2010', '2015', '2020', '2025'],
    yMax: 30,
    yStep: 5,
    series: [
      { id: 'a', label: 'Valdora', values: [18, 20, 21, 23, 8, 22] },
      { id: 'b', label: 'Kesh', values: [4, 7, 11, 17, 6, 25] },
      { id: 'c', label: 'Morland', values: [12, 11, 10, 10, 3, 9] },
    ],
  },
  tips: [
    'All three lines fall sharply in 2020 — mention it in the overview.',
    'Kesh is the growth story: it overtakes Valdora at the end.',
    'Morland declined slowly even before 2020.',
  ],
  model: `
The line graph compares how many tourists from abroad travelled to Valdora, Kesh and Morland over a 25-year period starting in 2000.

Overall, visitor numbers rose in Valdora and especially Kesh, but fell slightly in Morland. All three countries experienced a dramatic drop in 2020, followed by a strong recovery.

Valdora was the most popular destination for most of the period. Its visitor numbers rose gradually from 18 million in 2000 to 23 million in 2015. Kesh began with only 4 million visitors, but grew much faster, reaching 17 million by 2015. Morland, on the other hand, saw a slow decline, from 12 million to 10 million over the same period.

In 2020, tourism collapsed in all three countries, with Valdora falling to 8 million, Kesh to 6 million and Morland to just 3 million. By 2025, numbers had largely recovered. Kesh rebounded most strongly, to 25 million, overtaking Valdora (22 million) to become the most visited country. Morland, however, recovered to only 9 million, less than its 2015 figure and far lower than the other two countries.
`,
  notes: [
    ['how many tourists from abroad travelled to Valdora, Kesh and Morland', 'LR', 'Paraphrase: overseas visitors → tourists from abroad.'],
    ['All three countries experienced a dramatic drop in 2020, followed by a strong recovery.', 'TA', 'A shared feature of all three lines belongs in the overview.'],
    ['Kesh began with only 4 million visitors, but grew much faster', 'TA', 'Comparison is built into the description of each line.'],
    ['In 2020, tourism collapsed in all three countries', 'CC', 'The second body paragraph is organised by time, not by country.'],
    ['overtaking Valdora (22 million) to become the most visited country', 'TA', 'A change in ranking at the end of the period is a key feature.'],
  ],
})
