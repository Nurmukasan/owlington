import { task1 } from '../build'

export default task1({
  id: 't1-table-population',
  instructions: 'The table below shows the populations of five cities, in millions, in 1975, 2000 and 2025.',
  figure: {
    kind: 'table',
    title: 'City populations (millions)',
    unit: 'millions of people',
    columns: ['City', '1975', '2000', '2025'],
    rows: [
      ['Avalon', 2.1, 5.4, 11.2],
      ['Brenton', 7.8, 8.3, 8.1],
      ['Castor', 1.4, 3.9, 6.7],
      ['Delmar', 4.6, 4.1, 3.3],
      ['Everly', 0.9, 2.2, 7.5],
    ],
  },
  mode: 'trend',
  tips: [
    'Three groups of cities: fast-growing, stable and shrinking. Organise your paragraphs that way.',
    'Avalon became the largest city — a change in rank is a key feature.',
    'Everly grew more than eightfold: use multiples for big changes.',
  ],
  model: `
The table gives the number of inhabitants, in millions, of five cities at three points over a fifty-year period from 1975 to 2025.

Overall, three of the cities grew rapidly, one remained fairly stable and one shrank. Avalon replaced Brenton as the largest city during this time.

Avalon, Castor and Everly all expanded considerably. Avalon's population more than quintupled, rising from 2.1 million in 1975 to 11.2 million in 2025. Castor also grew strongly, from 1.4 million to 6.7 million. The most dramatic growth, however, was in Everly. It had fewer than one million residents at the start but over eight times as many, 7.5 million, by the end.

The other two cities followed very different patterns. Brenton was the largest city in 1975, with 7.8 million people, and its population changed little, peaking at 8.3 million in 2000 before falling slightly to 8.1 million. Delmar, by contrast, was the only city to decline steadily, dropping from 4.6 million to 3.3 million, which made it the smallest of the five by 2025.
`,
  notes: [
    ['the number of inhabitants, in millions, of five cities at three points over a fifty-year period', 'LR', 'The time frame is described rather than copied.'],
    ['Overall, three of the cities grew rapidly, one remained fairly stable and one shrank.', 'TA', 'The overview groups the cities by trend.'],
    ["Avalon's population more than quintupled", 'LR', 'An advanced verb for five-fold growth.'],
    ['The other two cities followed very different patterns.', 'CC', 'Grouping makes the report easy to follow.'],
    ['which made it the smallest of the five by 2025', 'TA', 'A change in ranking is reported at the end.'],
  ],
})
