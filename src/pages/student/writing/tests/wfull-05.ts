import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-05',
  task1({
    id: 'wfull-05-t1',
    instructions: 'The diagram below shows the stages in the production of extra virgin olive oil.',
    figure: {
      kind: 'process',
      title: 'How extra virgin olive oil is produced',
      stages: [
        { title: 'Harvesting', detail: 'Olives picked by hand or shaken from trees onto nets' },
        { title: 'Transport', detail: 'Taken to the mill within 24 hours' },
        { title: 'Washing', detail: 'Leaves removed; olives washed in cold water' },
        { title: 'Crushing', detail: 'Whole olives, including stones, crushed into a paste' },
        { title: 'Mixing', detail: 'Paste stirred slowly for 30–40 minutes' },
        { title: 'Separation', detail: 'Spun in a centrifuge: oil separated from water and solids' },
        { title: 'Storage', detail: 'Oil rested in steel tanks for 1–2 months' },
        { title: 'Bottling', detail: 'Filtered and poured into dark glass bottles' },
      ],
      zones: [
        ['In the grove', 0, 1],
        ['At the mill', 2, 7],
      ],
    },
    tips: [
      'A man-made process: use the passive (“the olives are washed”), because who does it is not important.',
      'Count the stages and say where they happen — that is the overview.',
      'Vary your sequencers: first, then, once, after that, finally.',
    ],
    model: `
The diagram illustrates how extra virgin olive oil is made, from the picking of the fruit to the moment the oil is bottled.

Overall, there are eight main stages in the process. The first two take place in the olive grove, while the remaining six are carried out at the mill, where the fruit is gradually turned into oil.

First, the olives are harvested, either by hand or by shaking the trees so that the fruit falls onto nets. They are then transported to the mill, which must happen within 24 hours of picking. On arrival, any leaves are removed and the olives are washed in cold water.

Next, the whole olives, including their stones, are crushed to form a paste. This paste is stirred slowly for 30 to 40 minutes, after which it is spun in a centrifuge so that the oil is separated from the water and solid material. Once it has been extracted, the oil is left to rest in steel tanks for one or two months. Finally, it is filtered and poured into dark glass bottles, ready to be sold.
`,
    notes: [
      ['from the picking of the fruit to the moment the oil is bottled', 'TA', 'The introduction names the start and end of the process.'],
      ['Overall, there are eight main stages in the process.', 'TA', 'A process overview: how many stages, and where they happen.'],
      ['They are then transported to the mill', 'GRA', 'The passive voice is natural in process descriptions.'],
      ['after which it is spun in a centrifuge so that the oil is separated', 'GRA', 'A relative clause and a purpose clause join two stages in one complex sentence.'],
      ['Once it has been extracted', 'CC', '“Once” plus the present perfect passive is a sophisticated sequencer.'],
    ],
  }),
  task2({
    id: 'wfull-05-t2',
    type: 'two-part',
    instructions: [
      'Many people now buy second-hand clothes rather than new ones.',
      'Why is this the case? Is this a positive or negative development?',
    ],
    parts: [
      ['reasons people buy second-hand', /\b(because|reason|why|cheaper|price|afford|save money|apps?|online|unique|vintage)\b/i],
      ['positive or negative', /\b(positive|negative|benefit|beneficial|harm|good|bad|development)\b/i],
    ],
    tips: [
      'Two direct questions: answer both, in separate body paragraphs.',
      'For “positive or negative”, give a clear answer — you can say mainly positive, with one reservation.',
      'Use examples from real life: apps, charity shops, vintage markets.',
    ],
    model: `
Second-hand clothing, once associated mainly with people who could not afford anything else, has become fashionable in many countries. This essay will explain why more consumers are choosing used garments and argue that this is a largely positive trend.

There are several reasons for the popularity of second-hand clothes. The most obvious is price: a used designer jacket may cost a fraction of its original value, which is attractive at a time when living costs are rising. Technology has also made buying used items easier, because apps such as Vinted and Depop allow people to sell unwanted clothes from their phones in minutes. In addition, many young shoppers value individuality. Vintage pieces are often unique, so wearing them is a way of standing out.

In my view, this development is mainly positive. The fashion industry is one of the world's largest polluters, and producing a single cotton T-shirt can require more than two thousand litres of water. Every garment that is reused instead of thrown away reduces this environmental damage. Buying second-hand can also support good causes, for example when people shop in charity stores. The only real drawback is that clothing factories, which employ millions of workers in poorer countries, may lose orders. However, this risk seems small compared with the benefits, and many of those jobs could move to repair, resale and recycling businesses instead.

In conclusion, people are buying second-hand clothes because they are cheaper, easier to find online and more distinctive. I believe this is a welcome change, as it reduces waste and pollution with little cost to society.
`,
    notes: [
      ['This essay will explain why more consumers are choosing used garments and argue that this is a largely positive trend.', 'TA', 'Both questions are answered in outline in the introduction.'],
      ['There are several reasons for the popularity of second-hand clothes.', 'CC', 'Body paragraph 1 answers question 1 — and its topic sentence says so.'],
      ['apps such as Vinted and Depop', 'TA', 'Real, specific examples support the explanation.'],
      ['In my view, this development is mainly positive.', 'TA', 'Body paragraph 2 opens with a direct answer to question 2.'],
      ['The only real drawback is that clothing factories', 'TA', 'Acknowledging a counter-point makes the position more convincing.'],
    ],
  }),
)
