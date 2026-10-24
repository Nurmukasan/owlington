import type { MapSpec } from '../practice-data'
import { map, mcq, part, person, test } from '../build'

const ZOO: MapSpec = {
  title: 'Redwood Zoo',
  description:
    'Map of a zoo, with north at the top. The entrance, marked You are here, is in the south-east corner. ' +
    'A circular path loops round the zoo. A large lake fills the centre of the loop. A river runs along the whole west side of the zoo. ' +
    'A wooded hill covers the north-east corner. The café is on the south side of the lake. ' +
    'Letter A is just inside the entrance, to the north. Letter B is on the east side of the loop, halfway up. Letter C is on the wooded hill. ' +
    'Letter D is at the top of the loop, north of the lake. Letter E is on the island in the middle of the lake. Letter F is at the north-west corner of the loop, by the river. ' +
    'Letter G is on the west side of the loop, beside the river. Letter H is at the south-west corner of the loop.',
  shapes: [
    { kind: 'river', d: 'M40 20 C 60 150, 30 300, 50 450' },
    { kind: 'trees', x: 450, y: 30, w: 160, h: 140, label: 'Hill' },
    { kind: 'path', d: 'M560 420 C 560 300, 560 150, 420 80 C 300 40, 150 60, 110 150 C 80 250, 100 380, 200 410 C 330 440, 470 430, 560 420' },
    { kind: 'water', x: 190, y: 140, w: 250, h: 190, round: true, label: 'Lake' },
    { kind: 'building', x: 270, y: 345, w: 90, h: 40, label: 'Café' },
  ],
  points: { A: [585, 370], B: [565, 250], C: [500, 145], D: [320, 80], E: [315, 290], F: [120, 110], G: [95, 260], H: [150, 390] },
  here: [590, 430],
  hereLabel: 'ENTRANCE',
}

const keeper = person('keeper', 'Doug', 'Zoo keeper', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')

export default test('map-zoo', [
  part({
    n: 2,
    title: 'A guide to Redwood Zoo',
    intro: 'You will hear a zoo keeper giving information to a group of visitors.',
    speakers: [keeper],
    blocks: [
      {
        lines: `
          keeper: Morning, folks! Welcome to Redwood Zoo. I'm Doug, one of the keepers. Before you set off, let me tell you a couple of things.
          keeper: Feeding times are on the board by the entrance, but the most popular one is the penguins at half past two. Get there early, because it gets very crowded.
          keeper: And please don't feed the animals yourselves. Lots of people think a bit of bread won't hurt, but it can make animals seriously ill.
        `,
        groups: [
          mcq([
            [
              'Visitors are advised to arrive early for',
              ['the penguin feeding.', 'the bird show.', 'the guided walk.'],
              'A',
              'the most popular one is the penguins at half past two',
              'It gets very crowded.',
            ],
            [
              'Why should visitors not feed the animals?',
              ['It is against the law.', 'It may make them ill.', 'They are fed by keepers.'],
              'B',
              'it can make animals seriously ill',
              'Even a bit of bread can harm them.',
            ],
          ]),
        ],
      },
      {
        lines: `
          keeper: Right, let's look at the map. We're at the entrance in the bottom right-hand corner. The path goes round in a big loop, and I'd suggest you go anticlockwise, so start by heading north.
          keeper: Just inside the gate, on your way north, you'll pass the gift shop. Leave your shopping till the end, though, because it's open until closing time.
          keeper: About halfway up the east side of the path, there's the giraffe house. You can climb up to a platform and look the giraffes in the eye.
          keeper: On the hill, among the trees, are the red pandas. They're quite shy, so be patient.
          keeper: At the top of the loop, north of the lake, is the penguin pool. That's where the feeding's at half past two.
          keeper: Then the path bends round to the west. Right at the corner, by the river, you'll find the otters. And further down the west side, also beside the river, there's the reptile house.
          keeper: Finally, when you get to the bottom left-hand corner of the loop, you'll see the children's farm, where kids can stroke goats and rabbits.
          keeper: Oh, and the monkeys live on the island in the middle of the lake. You can see them from the café.
        `,
        groups: [
          map(ZOO, [
            ['Gift shop', 'A', "Just inside the gate, on your way north, you'll pass the gift shop", 'Just inside the entrance, to the north: A.'],
            ['Giraffe house', 'B', "About halfway up the east side of the path, there's the giraffe house", 'East side, halfway up: B.'],
            ['Red pandas', 'C', 'On the hill, among the trees, are the red pandas', 'On the wooded hill: C.'],
            ['Penguin pool', 'D', 'At the top of the loop, north of the lake, is the penguin pool', 'North of the lake: D.'],
            ['Otters', 'F', "Right at the corner, by the river, you'll find the otters", 'The north-west corner: F.'],
            ['Reptile house', 'G', "further down the west side, also beside the river, there's the reptile house", 'West side, by the river: G.'],
            ["Children's farm", 'H', "when you get to the bottom left-hand corner of the loop, you'll see the children's farm", 'South-west corner: H.'],
            ['Monkeys', 'E', 'the monkeys live on the island in the middle of the lake', 'On the island: E.'],
          ]),
        ],
      },
    ],
    traps: [["Lots of people think a bit of bread won't hurt", 12, 'It can make animals ill.']],
  }),
])
