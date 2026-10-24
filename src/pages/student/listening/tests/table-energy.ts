import { limit, part, person, table, test } from '../build'

const anna = person('anna', 'Anna', 'Student', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const kai = person('kai', 'Kai', 'Student', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')

export default test('table-energy', [
  part({
    n: 3,
    title: 'Comparing home energy options',
    intro: 'You will hear two engineering students, Anna and Kai, comparing ways to heat homes for an assignment.',
    speakers: [anna, kai],
    blocks: [
      {
        lines: `
          anna: OK, Kai, let's fill in the comparison table for the assignment. Four heating systems. Shall we start with gas boilers?
          kai: Sure. The main advantage is that they're cheap to install. Most homes already have a gas supply. The big drawback, obviously, is the carbon emissions.
          anna: Right. Next, heat pumps. They take heat from the outside air, even when it's cold.
          kai: The advantage is efficiency. For every unit of electricity, they produce about three units of heat.
          anna: And the disadvantage?
          kai: They work best in well-insulated houses. In an old house with draughty windows, they struggle. So often you have to improve the insulation first.
          anna: OK. Then there's wood pellet boilers.
          kai: They burn small pellets made from sawdust, which is a waste product, so that's the advantage. But you need a lot of space to store the fuel. A big bag of pellets needs a room of its own.
          anna: And the last one is solar thermal panels, the ones on the roof that heat water.
          kai: They're great in summer, but in winter they produce very little, so you need a back-up system.
          anna: And the cost of running them is almost nothing once they're installed. Shall we add a column on lifespan?
          kai: Good idea. Gas boilers last about fifteen years, heat pumps about twenty. Solar panels last the longest, around twenty-five years.
        `,
        groups: [
          table(
            'Home heating systems',
            limit(2, true),
            ['System', 'Advantage', 'Disadvantage', 'Lifespan'],
            [
              ['gas boiler', 'cheap to [[install]]', 'carbon emissions', '15 years'],
              ['heat pump', 'high [[efficiency]]', 'house may need better [[insulation]] first', '[[20|twenty]] years'],
              ['wood pellet boiler', 'fuel made from [[sawdust]]', 'needs a lot of [[space|storage space]] for fuel', '—'],
              ['solar thermal panels', 'almost no running [[cost|costs]]', 'produce little in [[winter]]', '[[25|twenty-five]] years'],
            ],
            [
              ["they're cheap to install", 'Most homes already have a gas supply.'],
              ['The advantage is efficiency', 'About three units of heat per unit of electricity.'],
              ['you have to improve the insulation first', 'They struggle in draughty houses.'],
              ['heat pumps about twenty', 'Gas boilers last about fifteen years.'],
              ['pellets made from sawdust, which is a waste product', 'Using waste is the advantage.'],
              ['you need a lot of space to store the fuel', 'A bag of pellets needs a room of its own.'],
              ['the cost of running them is almost nothing', 'Once they are installed.'],
              ['in winter they produce very little', 'A back-up system is needed.'],
              ['around twenty-five years', 'Solar panels last the longest.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["They're great in summer", 28, 'The problem is winter.'],
      ['Gas boilers last about fifteen years', 24, 'Heat pumps last about twenty.'],
    ],
  }),
])
