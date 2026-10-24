import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-13',
  task1({
    id: 'wfull-13-t1',
    instructions: 'The pie charts below show how the average household in one country spent its income in 1985 and 2025.',
    figure: {
      kind: 'pie',
      title: 'Household spending by category',
      slices: ['Food', 'Housing', 'Transport', 'Leisure', 'Other'],
      pies: [
        { label: '1985', values: [32, 20, 14, 9, 25] },
        { label: '2025', values: [14, 35, 13, 18, 20] },
      ],
    },
    mode: 'trend',
    tips: [
      'The two biggest stories: food and housing swapped places.',
      'Transport hardly changed — say so in one short clause.',
      'Use fractions and approximations: “about a third”, “just over a third”, “roughly one in five”.',
    ],
    model: `
The two pie charts compare the way in which a typical family in one nation divided its budget between five types of expenditure in 1985 and forty years later.

Overall, the proportion spent on food fell dramatically, while housing became by far the largest expense. Leisure also took a much bigger share of the budget in 2025 than in 1985.

In 1985, food was the biggest single item, accounting for almost a third of household spending (32%). Housing came second at 20%. By 2025, however, this situation had been reversed. The share devoted to food had more than halved to 14%, whereas housing costs had risen to 35%, more than a third of the total.

Turning to the other categories, the percentage spent on leisure doubled from 9% to 18%, reflecting a greater emphasis on holidays and entertainment. In contrast, transport remained almost unchanged, at 14% in 1985 and 13% in 2025. Finally, other expenses declined slightly as a share of the budget, from a quarter to a fifth.
`,
    notes: [
      ['the way in which a typical family in one nation divided its budget between five types of expenditure', 'LR', 'A full paraphrase: average household → typical family; income → budget; spent → divided.'],
      ['Overall, the proportion spent on food fell dramatically, while housing became by far the largest expense.', 'TA', 'The overview captures the reversal between the two biggest categories.'],
      ['this situation had been reversed', 'GRA', 'Past perfect passive describes the change between the two dates.'],
      ['had more than halved to 14%', 'LR', '“More than halved” is precise and natural with percentages.'],
      ['from a quarter to a fifth', 'LR', 'Fractions instead of a third set of percentages.'],
    ],
  }),
  task2({
    id: 'wfull-13-t2',
    type: 'advantages',
    instructions: [
      'Tourists are increasingly travelling to remote and untouched places such as the Arctic, rainforests and small islands.',
      'Do the advantages of this type of tourism outweigh the disadvantages?',
    ],
    tips: [
      'Advantages: income for local people, money for conservation, awareness. Disadvantages: damage, pollution, culture.',
      'State your verdict early and justify it.',
      'It is fine to argue that the disadvantages are greater.',
    ],
    model: `
Travel to remote destinations such as Antarctica, the Amazon rainforest and isolated Pacific islands has become far more common as flights have become cheaper. Although this kind of tourism brings some benefits, I believe that its disadvantages are more significant.

There are certainly advantages. Tourism can provide income for communities that have few other ways of earning a living, for example by employing local guides or selling handicrafts. In some places, entrance fees are used to protect wildlife; visitors to national parks in Costa Rica help fund the rangers who prevent illegal logging. Travellers may also return home with a deeper understanding of why these environments need protecting.

However, the drawbacks are serious and often permanent. Fragile ecosystems cannot cope with large numbers of visitors. Footpaths erode, rubbish accumulates and animals are disturbed during breeding seasons. In addition, reaching remote places usually requires long-haul flights or cruise ships, which produce large amounts of carbon dioxide and contribute to the very climate change that threatens places like the Arctic. Local cultures can also suffer, as traditional ways of life are changed to entertain tourists.

The key difference is that the benefits can usually be achieved in other ways, whereas the damage cannot easily be reversed. Conservation can be funded through government programmes, and documentaries can raise awareness without anyone travelling. Once a coral reef or a glacier has been damaged, by contrast, it may take centuries to recover.

In conclusion, while tourism in untouched places can support local people and conservation, I am convinced that its environmental and cultural costs outweigh these advantages. Such trips should be strictly limited.
`,
    notes: [
      ['Although this kind of tourism brings some benefits, I believe that its disadvantages are more significant.', 'TA', 'A clear verdict that the disadvantages win — a perfectly valid position.'],
      ['visitors to national parks in Costa Rica help fund the rangers who prevent illegal logging', 'TA', 'A specific example supports the advantage.'],
      ['Fragile ecosystems cannot cope with large numbers of visitors.', 'CC', 'Topic sentence for the disadvantages, followed by three short examples.'],
      ['contribute to the very climate change that threatens places like the Arctic', 'LR', 'An ironic link between cause and effect, expressed precisely.'],
      ['The key difference is that the benefits can usually be achieved in other ways, whereas the damage cannot easily be reversed.', 'TA', 'The writer explains why one side outweighs the other — the heart of this question type.'],
    ],
  }),
)
