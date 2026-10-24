import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-12',
  task1({
    id: 'wfull-12-t1',
    instructions: 'The diagram below shows how rainwater is collected and used in a modern house.',
    figure: {
      kind: 'process',
      title: 'A household rainwater system',
      stages: [
        { title: 'Collection', detail: 'Rain falls on the roof and runs into gutters' },
        { title: 'First filter', detail: 'Leaves and twigs caught by a mesh filter' },
        { title: 'Storage', detail: 'Water flows into an underground tank (5,000 litres)' },
        { title: 'Settling', detail: 'Fine dirt sinks to the bottom of the tank' },
        { title: 'Pumping', detail: 'An electric pump lifts water to the house' },
        { title: 'Second filter', detail: 'Water passes through a fine filter' },
        { title: 'Use', detail: 'Used for toilets, washing machine and garden' },
        { title: 'Overflow', detail: 'Excess water drains into a soakaway in the garden' },
      ],
      zones: [
        ['Outside', 0, 3],
        ['Inside the house', 4, 6],
      ],
    },
    tips: [
      'This is a cycle-like system with a branch at the end (overflow). Describe the main route, then the branch.',
      'Use the passive and a range of sequencers.',
      'Include the details on the diagram: 5,000 litres, toilets, washing machine and garden.',
    ],
    model: `
The diagram illustrates the system by which rain is captured, stored and reused in a modern home.

Overall, the process consists of seven main stages, beginning with the collection of rain from the roof and ending with its use inside and around the house. There is also an overflow system for any excess water.

First, rain falls on the roof and runs into the gutters. It then passes through a mesh filter, which catches leaves and twigs, before flowing into an underground tank that can hold 5,000 litres. While the water is stored in the tank, fine particles of dirt gradually sink to the bottom.

Next, an electric pump lifts the water up to the house, where it is cleaned again by a second, finer filter. After this, the water is ready to be used for flushing toilets, running the washing machine and watering the garden. It is not used for drinking. Finally, if the tank becomes full during heavy rain, the extra water is drained away into a soakaway in the garden.
`,
    notes: [
      ['the system by which rain is captured, stored and reused in a modern home', 'LR', 'Three passive verbs summarise the whole process in the introduction.'],
      ['Overall, the process consists of seven main stages', 'TA', 'The overview gives the number of stages and the start and end points.'],
      ['which catches leaves and twigs, before flowing into an underground tank', 'GRA', 'Relative clause and “before + -ing” join stages smoothly.'],
      ['While the water is stored in the tank', 'CC', '“While” shows that two things happen at the same time.'],
      ['It is not used for drinking.', 'GRA', 'A short sentence for an important limitation.'],
    ],
  }),
  task2({
    id: 'wfull-12-t2',
    type: 'discussion',
    instructions: [
      'Some people think that space exploration is a waste of money and that governments should spend it on problems on Earth. Others believe it is essential for humanity’s future.',
      'Discuss both these views and give your own opinion.',
    ],
    tips: [
      'Each view deserves a full paragraph with reasons and examples.',
      'Remember spin-off technologies (satellites, weather forecasting, GPS) for the second view.',
      'Your opinion can be balanced — but it must be clear.',
    ],
    model: `
Governments spend billions each year on rockets, satellites and missions to Mars. While critics argue that this money would be better used to tackle poverty, disease and climate change, supporters see space research as vital for the future of humanity. In my view, space exploration is a worthwhile investment, provided that it is pursued efficiently.

Those who oppose space programmes point to the urgent needs on our own planet. Millions of people lack clean water, healthcare and education, and the cost of a single mission could build hundreds of schools or hospitals. Critics also argue that the benefits of exploring distant planets are uncertain and lie far in the future, whereas the problems on Earth are immediate. For example, sending humans to Mars is estimated to cost hundreds of billions of dollars, a sum that could transform public health in developing countries.

On the other hand, supporters claim that space research directly helps people on Earth. Satellites provide weather forecasts, warn of hurricanes and allow scientists to monitor deforestation and melting ice, which is essential for understanding climate change. Many everyday technologies, such as GPS navigation and water purification systems, were developed through space programmes. In the long term, some argue that humanity may even need to live on other planets.

In my opinion, the second view is more convincing. Space spending is a small fraction of most national budgets, and much of it pays for satellites that help us manage the very problems critics are concerned about. However, governments should prioritise missions with clear practical benefits and share costs internationally.

In conclusion, although the needs on Earth are pressing, I believe space exploration is not a waste of money, because its scientific and practical rewards help solve problems here at home.
`,
    notes: [
      ['While critics argue that this money would be better used to tackle poverty, disease and climate change, supporters see space research as vital', 'LR', 'Both views are paraphrased in a single, balanced sentence.'],
      ['the cost of a single mission could build hundreds of schools or hospitals', 'TA', 'The first view is given concrete force.'],
      ['Satellites provide weather forecasts, warn of hurricanes and allow scientists to monitor deforestation', 'TA', 'Specific benefits make the second view persuasive.'],
      ['In my opinion, the second view is more convincing.', 'TA', 'The writer’s own position has a paragraph of its own, with reasons.'],
      ['the very problems critics are concerned about', 'GRA', '“The very…” adds emphasis and links the argument back to the first view.'],
    ],
  }),
)
