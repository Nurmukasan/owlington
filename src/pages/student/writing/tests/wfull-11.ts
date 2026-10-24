import { fullTest, task1, task2 } from '../build'

const BEFORE = {
  title: 'Port Ellen waterfront, 2000',
  description:
    'Map of the Port Ellen waterfront in 2000, north at the top. The sea fills the south of the map. A road runs east to west along the north. ' +
    'Between the road and the sea, from west to east: fish warehouses, a large car park and a fish market. A fishing harbour lies in the sea to the south-east, and a small beach in the south-west.',
  points: {},
  shapes: [
    { kind: 'water' as const, x: 20, y: 300, w: 600, h: 140, label: 'Sea' },
    { kind: 'road' as const, d: 'M20 60 H 620' },
    { kind: 'building' as const, x: 40, y: 110, w: 170, h: 120, label: 'Fish\nwarehouses' },
    { kind: 'parking' as const, x: 230, y: 110, w: 190, h: 150, label: 'Car park' },
    { kind: 'building' as const, x: 440, y: 110, w: 160, h: 120, label: 'Fish market' },
    { kind: 'sand' as const, x: 40, y: 250, w: 160, h: 60, label: 'Beach' },
    { kind: 'stage' as const, x: 450, y: 320, w: 140, h: 80, label: 'Fishing harbour' },
  ],
}

const NOW = {
  title: 'Port Ellen waterfront, today',
  description:
    'Map of the Port Ellen waterfront today, north at the top. The road still runs along the north. The fish warehouses in the west have been converted into apartments. ' +
    'The car park has been replaced by a public square with trees, and a smaller car park has been built north of the road. The fish market has become a restaurant and a museum. The fishing harbour is now a marina for leisure boats. The beach is unchanged, and a promenade now runs along the seafront.',
  points: {},
  shapes: [
    { kind: 'water' as const, x: 20, y: 300, w: 600, h: 140, label: 'Sea' },
    { kind: 'road' as const, d: 'M20 60 H 620' },
    { kind: 'parking' as const, x: 260, y: 20, w: 130, h: 30, label: 'P' },
    { kind: 'path' as const, d: 'M200 285 H 620' },
    { kind: 'building' as const, x: 40, y: 110, w: 170, h: 120, label: 'Apartments' },
    { kind: 'green' as const, x: 230, y: 110, w: 190, h: 150, label: 'Square' },
    { kind: 'building' as const, x: 440, y: 110, w: 75, h: 120, label: 'Restau-\nrant' },
    { kind: 'building' as const, x: 525, y: 110, w: 75, h: 120, label: 'Museum' },
    { kind: 'sand' as const, x: 40, y: 250, w: 160, h: 60, label: 'Beach' },
    { kind: 'stage' as const, x: 450, y: 320, w: 140, h: 80, label: 'Marina' },
  ],
}

export default fullTest(
  'wfull-11',
  task1({
    id: 'wfull-11-t1',
    instructions: 'The maps below show the waterfront area of Port Ellen in 2000 and today.',
    figure: {
      kind: 'map',
      title: 'Port Ellen waterfront, 2000 and today',
      panels: [
        { label: '2000', spec: BEFORE },
        { label: 'Today', spec: NOW },
      ],
    },
    tips: [
      'The big change: a working fishing port has become a leisure and tourist area.',
      'Most buildings stayed in the same place but changed their use: “converted into”, “turned into”.',
      'Mention what did not change: the road and the beach.',
    ],
    model: `
The maps compare the seafront of Port Ellen at the beginning of the century with its present-day layout.

Overall, the area has been transformed from a working fishing port into a place for leisure, tourism and housing. While most of the buildings remain in the same positions, almost all of them now have different uses.

In the western part of the waterfront, the fish warehouses have been converted into apartments. The beach to the south of them, however, has remained unchanged. The large car park in the centre has been replaced by a public square with trees, and a much smaller car park has been built on the other side of the road, to the north.

Further east, the old fish market has been divided into two, and it now contains a restaurant and a museum. The fishing harbour opposite has been redeveloped as a marina for leisure boats. Finally, a new promenade has been added along the seafront, linking the beach with the marina and allowing visitors to walk the whole length of the waterfront.
`,
    notes: [
      ['the seafront of Port Ellen at the beginning of the century with its present-day layout', 'LR', 'Paraphrase: waterfront → seafront; 2000 → the beginning of the century; today → present-day.'],
      ['Overall, the area has been transformed from a working fishing port into a place for leisure, tourism and housing.', 'TA', 'The overview names the change in character, not individual buildings.'],
      ['have been converted into apartments', 'GRA', 'Present perfect passive for a change of use.'],
      ['on the other side of the road, to the north', 'TA', 'Location language is essential: the reader cannot see the map.'],
      ['has been redeveloped as a marina for leisure boats', 'LR', 'A precise verb of change, varied from “converted” and “turned into”.'],
    ],
  }),
  task2({
    id: 'wfull-11-t2',
    type: 'opinion',
    instructions: [
      'Advertising aimed at children should be banned.',
      'To what extent do you agree or disagree?',
    ],
    tips: [
      'Define what you mean: TV adverts, online videos, sponsored games?',
      'Consider health (junk food), pressure on parents and children’s ability to understand advertising.',
      'If you partly agree, explain exactly where you draw the line.',
    ],
    model: `
Children today are exposed to advertising on television, in video games and through social media influencers. Some argue that all marketing directed at children should be prohibited. I largely agree with this view, particularly where unhealthy food and online advertising are concerned.

The first reason is that young children cannot recognise persuasion. Research suggests that children under about eight years old do not understand that an advertisement is trying to sell them something; they simply believe what they see. Targeting such an audience is therefore unfair, in the same way that it would be unfair to sell products to someone who did not understand the language of the contract.

Secondly, advertising contributes to serious health problems. A large proportion of adverts shown during children's programmes promote sugary cereals, sweets and fast food, and childhood obesity has risen in many countries. When the United Kingdom restricted junk food advertising during children's TV, for example, the number of such adverts seen by children fell considerably. A complete ban would go further.

Admittedly, a total ban would be difficult to enforce online, and some advertising, such as campaigns for road safety or healthy eating, actually benefits children. Companies also argue that advertising pays for free children's content. However, these points suggest that bans should be carefully designed, not that they are wrong in principle. Public information campaigns could be exempt, and children's programmes could be funded in other ways.

In conclusion, I believe that commercial advertising aimed at children should be banned, because children cannot judge it critically and it encourages unhealthy habits. Public health messages, however, should be allowed to continue.
`,
    notes: [
      ['I largely agree with this view, particularly where unhealthy food and online advertising are concerned', 'TA', 'A clear position with a precise focus.'],
      ['young children cannot recognise persuasion', 'LR', 'A concise, academic way to express the main argument.'],
      ['in the same way that it would be unfair to sell products to someone who did not understand the language of the contract', 'TA', 'An analogy develops the idea instead of just repeating it.'],
      ['Admittedly, a total ban would be difficult to enforce online', 'CC', 'A concession introduced with “Admittedly” — and then answered.'],
      ['not that they are wrong in principle', 'GRA', 'A contrastive structure (“not that…”) that refutes the counter-argument.'],
    ],
  }),
)
