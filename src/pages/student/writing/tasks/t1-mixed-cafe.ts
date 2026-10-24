import { task1 } from '../build'

export default task1({
  id: 't1-mixed-cafe',
  instructions:
    'The line graph below shows the number of customers at a café on an average weekday. The pie chart shows what those customers bought.',
  figure: {
    kind: 'multi',
    title: 'A café on an average weekday',
    parts: [
      {
        kind: 'line',
        title: 'Customers per hour',
        unit: 'customers',
        yLabel: 'Customers per hour',
        xs: ['7am', '9am', '11am', '1pm', '3pm', '5pm'],
        yMax: 80,
        yStep: 20,
        series: [{ id: 'customers', label: 'Customers', values: [35, 70, 30, 75, 25, 40] }],
      },
      {
        kind: 'pie',
        title: 'What customers bought (% of sales)',
        slices: ['Coffee', 'Tea', 'Sandwiches', 'Cakes', 'Other'],
        pies: [{ label: 'Sales', values: [45, 10, 25, 15, 5] }],
      },
    ],
  },
  tips: [
    'The line has two clear peaks: the morning rush and lunchtime.',
    'The pie chart: coffee is almost half of sales.',
    'One overview sentence for each visual, then one paragraph each.',
  ],
  model: `
The line graph illustrates how many people visited a café each hour during a typical weekday, while the pie chart shows the proportion of sales accounted for by different products.

Overall, the café had two busy periods, in the morning and at lunchtime. Coffee was by far its best-selling item, making up almost half of all sales.

The café opened at 7am with 35 customers an hour, and this number doubled to 70 by 9am as people bought breakfast on their way to work. Trade then slowed to 30 customers at 11am before reaching its highest point of 75 at 1pm, the lunchtime peak. The afternoon was the quietest time, with just 25 customers at 3pm, although there was a small rise to 40 at 5pm.

As for what customers bought, coffee generated 45% of sales, far more than tea, which accounted for only 10%. Food was also important. Sandwiches made up a quarter of sales and cakes 15%, while other items contributed the remaining 5%.
`,
  notes: [
    ['while the pie chart shows the proportion of sales accounted for by different products', 'CC', 'The two visuals are introduced together in one sentence.'],
    ['Overall, the café had two busy periods, in the morning and at lunchtime.', 'TA', 'One overview point for the graph, one for the pie chart.'],
    ['as people bought breakfast on their way to work', 'TA', 'An obvious, minimal explanation is acceptable; avoid long speculation.'],
    ['before reaching its highest point of 75 at 1pm, the lunchtime peak', 'LR', 'Peak language for the line graph.'],
    ['Food was also important.', 'GRA', 'A short sentence groups sandwiches and cakes before the figures.'],
  ],
})
