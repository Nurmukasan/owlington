import { task1 } from '../build'

export default task1({
  id: 't1-process-glass',
  instructions: 'The diagram below shows how glass bottles are recycled.',
  figure: {
    kind: 'process',
    title: 'Recycling glass bottles',
    stages: [
      { title: 'Collection', detail: 'Bottles left in bottle banks or recycling bins' },
      { title: 'Sorting', detail: 'Separated by colour: clear, green and brown' },
      { title: 'Cleaning', detail: 'Labels, caps and dirt removed' },
      { title: 'Crushing', detail: 'Glass broken into small pieces called cullet' },
      { title: 'Melting', detail: 'Cullet mixed with sand and heated to 1,500°C' },
      { title: 'Moulding', detail: 'Molten glass poured into bottle-shaped moulds' },
      { title: 'Cooling', detail: 'New bottles cooled slowly to prevent cracking' },
      { title: 'Filling', detail: 'Sent to factories to be filled and sold again' },
    ],
    zones: [
      ['Collection and preparation', 0, 3],
      ['At the glass factory', 4, 7],
    ],
  },
  tips: [
    'This process is a cycle: the bottles end up in shops again. Say so in the overview.',
    'Use the passive throughout and vary your sequencers.',
    'Include numbers from the diagram: 1,500°C.',
  ],
  model: `
The diagram illustrates the process by which used glass bottles are turned into new ones.

Overall, there are eight stages in the process, which is cyclical. Bottles are first collected and prepared, then melted down and reshaped at a factory, before returning to shops as new products.

To begin with, empty bottles are left by the public in bottle banks or recycling bins. They are then sorted according to their colour into clear, green and brown glass. Next, any labels, caps and dirt are removed. Once the glass has been cleaned, it is crushed into small pieces known as cullet.

At the factory, the cullet is mixed with sand and heated to around 1,500°C until it melts. The molten glass is subsequently poured into moulds to form new bottles. These are cooled slowly. This prevents them from cracking. Finally, the bottles are sent to drinks companies, where they are filled and sold again, and the cycle can begin once more.
`,
  notes: [
    ['the process by which used glass bottles are turned into new ones', 'LR', 'A short paraphrase that also gives the start and end of the process.'],
    ['Overall, there are eight stages in the process, which is cyclical.', 'TA', 'The overview counts the stages and identifies the cycle.'],
    ['Once the glass has been cleaned, it is crushed', 'GRA', '“Once” + present perfect passive links two stages.'],
    ['The molten glass is subsequently poured into moulds', 'CC', '“Subsequently” varies the sequencers then, next, finally.'],
    ['and the cycle can begin once more', 'TA', 'The ending returns to the idea of a cycle from the overview.'],
  ],
})
