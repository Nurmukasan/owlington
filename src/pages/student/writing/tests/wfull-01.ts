import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-01',
  task1({
    id: 'wfull-01-t1',
    instructions:
      'The graph below shows the percentage of journeys to work made by car, bus and bicycle in the city of Marlow between 2005 and 2025.',
    figure: {
      kind: 'line',
      title: 'Journeys to work in Marlow, by mode of transport',
      unit: '% of journeys',
      yLabel: '% of journeys',
      xs: ['2005', '2010', '2015', '2020', '2025'],
      yMax: 70,
      yStep: 10,
      series: [
        { id: 'car', label: 'Car', values: [62, 58, 51, 44, 38] },
        { id: 'bus', label: 'Bus', values: [24, 25, 23, 18, 20] },
        { id: 'bike', label: 'Bicycle', values: [6, 9, 15, 26, 31] },
      ],
    },
    tips: [
      'The big story is a crossing that does not quite happen: cars fall steadily while bicycles climb towards them. Say that in the overview.',
      'The bus line is the “quiet” one — describe it briefly, but do mention the dip in 2020 and the small recovery.',
      'Percentages of journeys: write “38% of journeys”, not “38 people”.',
    ],
    model: `
The line graph illustrates how the proportion of commuter trips in Marlow made by car, bus and bicycle changed over the twenty years from 2005 to 2025.

Overall, the car remained the most common way of travelling to work throughout the period, but its share fell considerably, while cycling grew more than fivefold. Bus use, by contrast, changed relatively little.

In 2005, cars accounted for 62% of journeys to work, far more than buses (24%) and bicycles, which made up just 6%. Over the following two decades, the figure for cars declined steadily, dropping to 44% in 2020 and 38% by 2025. Cycling moved in the opposite direction: after a slow start, it rose sharply from 15% in 2015 to 26% five years later, and reached 31% at the end of the period.

The share of journeys made by bus was much more stable. It hovered between 23% and 25% until 2015, before falling to a low of 18% in 2020 and recovering slightly to 20% in 2025. As a result, the bicycle overtook the bus as the second most popular mode of transport around 2017.
`,
    notes: [
      ['the proportion of commuter trips in Marlow made by car, bus and bicycle', 'LR', 'Paraphrase: “percentage of journeys to work” becomes “proportion of commuter trips”.'],
      ['Overall, the car remained the most common way of travelling to work throughout the period', 'TA', 'The overview gives the three main stories without a single number.'],
      ['far more than buses (24%) and bicycles, which made up just 6%', 'TA', 'The starting point compares all three modes in one sentence.'],
      ['Cycling moved in the opposite direction', 'CC', 'A linking sentence that contrasts two trends instead of listing them.'],
      ['the bicycle overtook the bus as the second most popular mode of transport', 'TA', 'Crossing points are key features — this one is worth a sentence of its own.'],
    ],
  }),
  task2({
    id: 'wfull-01-t2',
    type: 'opinion',
    instructions: [
      'Some people believe that museums and art galleries should be free for everyone to visit, and that the government should pay all of their costs.',
      'To what extent do you agree or disagree?',
    ],
    tips: [
      'Two separate ideas are in the statement: free entry AND the government paying everything. You can agree with one more than the other.',
      'Give each body paragraph one main idea, and support it with a concrete example.',
      'Make your position clear in the introduction and repeat it, in other words, in the conclusion.',
    ],
    model: `
Museums and galleries hold some of a nation's most valuable possessions, yet in many cities visitors must pay a considerable fee to see them. Some argue that entry should cost nothing and that the state should fund these institutions entirely. I agree that admission should be free, but I do not believe that taxpayers alone should carry the full cost.

The case for free entry is strong. Cultural collections belong to the public, and charging for access means that families on low incomes are effectively excluded from their own heritage. When national museums in the United Kingdom stopped charging admission in 2001, visitor numbers at some of them more than doubled within a few years, and many of the new visitors were children and young people. Free entry also benefits the wider economy, because tourists who come to see a famous collection spend money in nearby businesses such as shops, hotels and restaurants.

However, it does not follow that the government should pay for everything. Public budgets are limited, and money spent on galleries is money that cannot be spent on hospitals or schools. A more sustainable model combines public funding with other sources of income. For example, museums can charge for special exhibitions, run cafés and shops, and attract donations from businesses and wealthy individuals, who often welcome the publicity.

In conclusion, I agree that everyone should be able to visit museums and art galleries without paying, as this widens access to culture and supports local economies. Nevertheless, I believe that the cost should be shared between the government, private supporters and the institutions themselves, rather than falling entirely on the state.
`,
    notes: [
      ['I agree that admission should be free, but I do not believe that taxpayers alone should carry the full cost', 'TA', 'A partial position: the writer separates the two halves of the statement and answers each.'],
      ['When national museums in the United Kingdom stopped charging admission in 2001', 'TA', 'A specific example makes the argument convincing.'],
      ['However, it does not follow that the government should pay for everything.', 'CC', 'A clear topic sentence that signals the second half of the argument.'],
      ['money spent on galleries is money that cannot be spent on hospitals or schools', 'GRA', 'A balanced structure that makes the trade-off memorable.'],
      ['the cost should be shared between the government, private supporters and the institutions themselves', 'LR', 'The conclusion restates the position in new words rather than repeating the introduction.'],
    ],
  }),
)
