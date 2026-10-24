import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-08',
  task1({
    id: 'wfull-08-t1',
    instructions:
      'The graph below shows how much the average household in one country spent each month on music in three formats between 2000 and 2025.',
    figure: {
      kind: 'line',
      title: 'Average monthly household spending on music',
      unit: 'dollars per month',
      yLabel: 'Dollars per month',
      xs: ['2000', '2005', '2010', '2015', '2020', '2025'],
      yMax: 14,
      yStep: 2,
      series: [
        { id: 'cd', label: 'CDs', values: [12, 10, 5.5, 2, 1, 0.5] },
        { id: 'download', label: 'Downloads', values: [0, 2, 6, 4, 1.5, 0.5] },
        { id: 'streaming', label: 'Streaming', values: [0, 0, 1, 5, 9, 11] },
      ],
    },
    tips: [
      'Three formats, three different shapes: a fall, a rise-and-fall, and a rise. The overview should say that.',
      'Downloads peaked in 2010 — peaks are key features.',
      'Name the crossing points: when did streaming overtake downloads, and CDs?',
    ],
    model: `
The line graph compares the typical monthly outlay of households in a particular nation on CDs, downloads and streaming over a 25-year period.

Overall, spending on CDs declined dramatically, while streaming grew from nothing to become by far the most popular format. Downloads rose and then fell, peaking in 2010.

In 2000, households spent $12 a month on CDs, whereas downloads and streaming had not yet appeared. This figure fell steadily, halving to around $5.5 in 2010 and dropping to just $0.5 by 2025. Spending on downloads, which began at zero, increased to a high of $6 in 2010, briefly overtaking CDs, before falling back to $0.5 at the end of the period.

Streaming followed the opposite path to CDs. It first appeared in 2010 at $1 a month, but grew rapidly to $5 in 2015 and $9 in 2020. By 2025, households were spending $11 a month on streaming services, far more than on the other two formats combined and almost as much as they had spent on CDs at the start. Streaming overtook downloads at some point between 2010 and 2015.
`,
    notes: [
      ['the typical monthly outlay of households in a particular nation on CDs, downloads and streaming', 'LR', 'The introduction paraphrases “how much” and avoids copying long phrases.'],
      ['Overall, spending on CDs declined dramatically, while streaming grew from nothing', 'TA', 'Three formats, three trends — all in the overview.'],
      ['halving to around $5.5 in 2010', 'LR', '“Halving” describes the change precisely and adds variety.'],
      ['Streaming followed the opposite path to CDs.', 'CC', 'A topic sentence that contrasts the two main lines.'],
      ['almost as much as they had spent on CDs at the start', 'TA', 'A comparison across the whole period, not just a list of figures.'],
    ],
  }),
  task2({
    id: 'wfull-08-t2',
    type: 'advantages',
    instructions: [
      'Some cities have banned private cars from their central areas.',
      'Do the advantages of this policy outweigh the disadvantages?',
    ],
    tips: [
      'Think about who gains (pedestrians, cyclists, residents) and who loses (businesses, disabled people, deliveries).',
      'Give a clear verdict and keep it throughout.',
      'A real example — Oslo, Ghent, Madrid — makes your argument concrete.',
    ],
    model: `
In recent years, a number of European cities, such as Oslo and Ghent, have closed their historic centres to private cars. While this policy creates difficulties for some groups, I believe that its benefits clearly outweigh its drawbacks.

The advantages for people who live in and visit the centre are considerable. Without traffic, the air is cleaner and the streets are quieter, which improves residents' health and makes walking and cycling safer. Space that was once used for parking can be turned into squares, trees and outdoor cafés. In Ghent, for instance, the number of cyclists rose by around a quarter within two years of the ban, and many shopkeepers reported more customers, not fewer, because people stayed longer.

There are, however, disadvantages. Some businesses fear losing customers who are used to driving into town, and deliveries become more complicated. Elderly and disabled people may also find it harder to reach shops and doctors if they can no longer be dropped off at the door. These concerns are serious.

Nevertheless, most of these problems can be solved with careful planning. Cities can allow deliveries early in the morning, provide permits for disabled drivers and run frequent, free shuttle buses from car parks on the edge of the centre. The benefits, by contrast, cannot easily be achieved in any other way, because clean air and safe streets are impossible while cars dominate the city.

In conclusion, banning cars from city centres causes some inconvenience, but this can be reduced with sensible exceptions. The gains in health, safety and quality of life make the policy well worth introducing.
`,
    notes: [
      ['While this policy creates difficulties for some groups, I believe that its benefits clearly outweigh its drawbacks.', 'TA', 'The verdict is clear from the first paragraph.'],
      ['Space that was once used for parking can be turned into squares, trees and outdoor cafés.', 'LR', 'Concrete, visual vocabulary makes the advantage easy to imagine.'],
      ['In Ghent, for instance, the number of cyclists rose by around a quarter', 'TA', 'Evidence from a real city supports the claim.'],
      ['These concerns are serious.', 'GRA', 'A short sentence acknowledges the other side before the writer responds to it.'],
      ['Nevertheless, most of these problems can be solved with careful planning.', 'CC', 'The paragraph weighs the disadvantages against the solutions.'],
    ],
  }),
)
