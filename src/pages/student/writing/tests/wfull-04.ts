import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-04',
  task1({
    id: 'wfull-04-t1',
    instructions:
      'The table below shows the number of visitors, in thousands, to five attractions in the city of Kingsford in 2015, 2020 and 2025.',
    figure: {
      kind: 'table',
      title: 'Visitors to attractions in Kingsford (thousands)',
      unit: 'thousands of visitors',
      columns: ['Attraction', '2015', '2020', '2025'],
      rows: [
        ['Castle', 420, 180, 450],
        ['Science museum', 310, 150, 390],
        ['Botanic gardens', 150, 200, 240],
        ['Art gallery', 260, 90, 170],
        ['Aquarium', 80, 60, 210],
      ],
    },
    mode: 'trend',
    tips: [
      'Three years with a sharp dip in the middle: almost everything fell in 2020 and recovered by 2025. That is your overview.',
      'Find the exceptions: the gardens grew even in 2020, and the art gallery never recovered.',
      'Tables invite listing every number. Select: start, dip and end for the key attractions only.',
    ],
    model: `
The table gives figures for the number of people, in thousands, who visited five tourist attractions in Kingsford in three different years between 2015 and 2025.

Overall, visitor numbers fell sharply at most attractions in 2020 before recovering strongly by 2025. The castle remained the most popular attraction throughout, while the aquarium saw the most dramatic growth.

In 2015, the castle attracted 420,000 visitors, more than any other site, followed by the science museum with 310,000. Both suffered steep falls in 2020, to 180,000 and 150,000 respectively. However, both had recovered by 2025, when the castle welcomed 450,000 people and the museum 390,000, surpassing their earlier levels.

The other three attractions followed different patterns. The botanic gardens were the only site to grow in 2020, rising from 150,000 to 200,000 visitors and continuing to 240,000 in the final year. The aquarium was the least visited attraction for the first decade. After a dip to 60,000, it almost quadrupled to 210,000. By contrast, the art gallery dropped from 260,000 to 90,000 and recovered only partly, reaching 170,000 by 2025.
`,
    notes: [
      ['the number of people, in thousands, who visited five tourist attractions in Kingsford', 'LR', 'The introduction keeps the unit (thousands) but rephrases the rest.'],
      ['Overall, visitor numbers fell sharply at most attractions in 2020 before recovering strongly by 2025.', 'TA', 'The overview describes the shape of the whole table in one sentence.'],
      ['surpassing their earlier levels', 'LR', 'A precise verb for “went higher than before”.'],
      ['The other three attractions followed different patterns.', 'CC', 'A grouping sentence that prepares the reader for the contrasts.'],
      ['it almost quadrupled to 210,000', 'TA', 'Multiples (doubled, quadrupled) make big changes easy to grasp.'],
    ],
  }),
  task2({
    id: 'wfull-04-t2',
    type: 'problem',
    instructions: [
      'In many countries, households throw away a large amount of the food they buy.',
      'Why does this happen? What can be done to reduce the amount of food that is wasted?',
    ],
    tips: [
      'Two questions: causes and solutions. Give each its own body paragraph.',
      'Match solutions to causes — a solution for a problem you never mentioned looks random.',
      'Say who should act: households, supermarkets, governments.',
    ],
    model: `
It is estimated that around a third of all food produced worldwide is never eaten, and a large share of this waste happens in ordinary homes. This essay will examine the main reasons for the problem and suggest how individuals, retailers and governments could tackle it.

The first cause is poor planning. Many people shop without a list or are tempted by special offers, such as "buy one, get one free", so they bring home more than they can use before it goes off. A second reason is confusion about date labels. Shoppers often throw away food that is perfectly safe simply because its "best before" date has passed, not realising that this label refers to quality rather than safety. Finally, busy lifestyles play a part: when people eat out or order takeaways at short notice, the food in their fridge is forgotten.

Several measures could reduce this waste. Supermarkets could replace multi-buy deals with discounts on single items, which would remove the incentive to over-buy. Governments could simplify date labels, for instance by removing "best before" dates from fruit and vegetables entirely, as some British retailers have already done. Public campaigns could also teach simple skills, such as freezing leftovers and planning meals for the week. Small habits matter. If every family cooked one extra meal a week from leftovers, the savings, both financial and environmental, would be considerable.

In conclusion, food is wasted in homes mainly because of impulse buying, misleading labels and busy routines. Clearer labelling, fairer promotions and practical education would help households buy only what they need and use what they buy.
`,
    notes: [
      ['This essay will examine the main reasons for the problem and suggest how individuals, retailers and governments could tackle it.', 'TA', 'The introduction promises both parts of the answer and who will be responsible.'],
      ['The first cause is poor planning.', 'CC', 'Each cause is introduced with a clear signpost: first, second, finally.'],
      ['this label refers to quality rather than safety', 'LR', 'Precise vocabulary shows real understanding of the problem.'],
      ['which would remove the incentive to over-buy', 'TA', 'This solution is directly linked to the first cause — good task response.'],
      ['Small habits matter.', 'GRA', 'A deliberately short sentence for emphasis, after longer complex ones.'],
    ],
  }),
)
