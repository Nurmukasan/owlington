import { task1 } from '../build'

export default task1({
  id: 't1-table-cinema',
  instructions: 'The table below gives information about cinema attendance and ticket prices in four countries in 2024.',
  figure: {
    kind: 'table',
    title: 'Cinema in four countries, 2024',
    unit: 'various units',
    columns: ['Country', 'Cinema visits per person per year', 'Average ticket price ($)', 'Screens per 100,000 people'],
    rows: [
      ['Arvania', 3.8, 9.5, 13],
      ['Belmora', 2.1, 12, 8],
      ['Corsa', 1.2, 4.5, 3],
      ['Dalvia', 3.1, 7, 11],
    ],
  },
  tips: [
    'Three different measures: do not mix their units — visits, dollars and screens.',
    'Look for a link: the countries with more screens have more visits.',
    'Belmora is the exception on price: the most expensive tickets.',
  ],
  model: `
The table compares four nations in terms of how often people went to the cinema in 2024, how much a ticket cost on average, and how many auditoriums there were for every 100,000 inhabitants.

Overall, Arvania had the highest attendance and the greatest provision of auditoriums, while Corsa had the lowest figures on all three measures. Countries with more places to watch films generally had higher attendance.

People in Arvania went to the cinema 3.8 times a year on average, more often than anywhere else, and they had 13 screens per 100,000 residents. Dalvia followed closely, with 3.1 trips and 11 screens. By contrast, the average person in Corsa went only 1.2 times, which corresponds to the lowest provision, just 3.

Ticket prices showed a less clear pattern. Belmora had the most expensive tickets, at $12, even though its attendance (2.1 visits) and number of screens (8) were only moderate. Tickets cost $9.5 in Arvania and $7 in Dalvia, whereas Corsa had by far the cheapest seats, at $4.5.
`,
  notes: [
    ['in terms of how often people went to the cinema in 2024, how much a ticket cost on average, and how many auditoriums there were', 'LR', 'The three columns are paraphrased as three clauses.'],
    ['Countries with more places to watch films generally had higher attendance.', 'TA', 'An overview can point out a relationship in the data — carefully, with “generally”.'],
    ['Dalvia followed closely', 'CC', 'Ranking language links the countries together.'],
    ['Ticket prices showed a less clear pattern.', 'CC', 'A topic sentence that separates one measure from the others.'],
    ['even though its attendance (2.1 visits) and number of screens (8) were only moderate', 'GRA', 'A concessive clause highlights the exception.'],
  ],
})
