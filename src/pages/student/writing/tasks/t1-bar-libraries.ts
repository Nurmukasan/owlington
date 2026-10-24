import { task1 } from '../build'

export default task1({
  id: 't1-bar-libraries',
  instructions: 'The chart below shows the number of books borrowed and e-books downloaded from public libraries in one city between 2010 and 2025.',
  figure: {
    kind: 'bar',
    title: 'Library loans in one city (millions)',
    unit: 'millions of loans',
    yLabel: 'Millions',
    categories: ['2010', '2015', '2020', '2025'],
    yMax: 5,
    yStep: 1,
    series: [
      { id: 'print', label: 'Printed books borrowed', values: [4.2, 3.6, 2.1, 2.4] },
      { id: 'ebook', label: 'E-books downloaded', values: [0.1, 0.8, 2.6, 3.1] },
    ],
  },
  mode: 'trend',
  tips: [
    'Two series across four years: one falls, one rises — and they cross.',
    'Say when e-books overtook printed books (between 2015 and 2020).',
    'Mention the small recovery of printed books in 2025.',
  ],
  model: `
The bar chart compares how many printed books were lent and how many e-books were downloaded by the public libraries of one city at five-year intervals from 2010 to 2025.

Overall, borrowing of printed books declined over the period, whereas e-book downloads rose dramatically. By the end of the period, digital loans had overtaken traditional ones.

In 2010, libraries lent 4.2 million printed books, while only 0.1 million e-books were downloaded. Over the next decade, printed loans fell steadily, reaching a low of 2.1 million in 2020, half the original figure. They then recovered slightly to 2.4 million in 2025.

E-books, by contrast, grew rapidly. Downloads rose to 0.8 million in 2015 and jumped to 2.6 million five years later, overtaking printed books for the first time. The upward trend continued, and by 2025 they stood at 3.1 million, roughly thirty times the 2010 level. This means e-books accounted for more than half of all loans at the end of the period.
`,
  notes: [
    ['how many printed books were lent and how many e-books were downloaded', 'LR', 'Paraphrase: borrowed → lent (from the library’s point of view).'],
    ['Overall, borrowing of printed books declined over the period, whereas e-book downloads rose dramatically.', 'TA', 'An overview built on two opposite trends.'],
    ['reaching a low of 2.1 million in 2020, half the original figure', 'TA', 'The lowest point plus a comparison with the start.'],
    ['overtaking printed books for the first time', 'TA', 'The crossing point is a key feature.'],
    ['roughly thirty times the 2010 level', 'LR', 'A multiple communicates very large growth clearly.'],
  ],
})
