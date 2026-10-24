import type { MapSpec } from '../practice-data'
import { map, part, person, test } from '../build'

const CENTRE: MapSpec = {
  title: 'Westbrook Leisure Centre, ground floor',
  description:
    'Plan of a leisure centre ground floor, with north at the top. The entrance, marked You are here, is in the middle of the south wall, opening into a foyer with a reception desk. ' +
    'A swimming pool fills the north-west part of the building. A corridor runs east from the foyer, and another runs north from the foyer between the pool and the rooms on the east side. ' +
    'Letter A is in the foyer, to the left of the entrance. Letter B is the room at the south-west corner, west of the foyer. Letter C is beside the pool, at its south-east corner. ' +
    'Letter D is the room at the north-east corner. Letter E is the middle room on the east side. Letter F is the room at the south-east corner. ' +
    'Letter G is at the north end of the central corridor, beside the pool. Letter H is in the foyer, to the right of the reception desk.',
  ground: 'floor',
  shapes: [
    { kind: 'water', x: 30, y: 30, w: 330, h: 230, label: 'Pool' },
    { kind: 'room', x: 30, y: 290, w: 170, h: 140 },
    { kind: 'room', x: 420, y: 30, w: 190, h: 120 },
    { kind: 'room', x: 420, y: 170, w: 190, h: 110 },
    { kind: 'room', x: 420, y: 300, w: 190, h: 130 },
    { kind: 'building', x: 260, y: 330, w: 80, h: 36, label: 'Reception' },
    { kind: 'label', x: 390, y: 260, text: 'Corridor', small: true },
  ],
  points: { A: [235, 400], B: [115, 360], C: [380, 270], D: [515, 90], E: [515, 225], F: [515, 365], G: [390, 60], H: [370, 345] },
  here: [300, 425],
  hereLabel: 'ENTRANCE',
}

const manager = person('manager', 'Priya', 'Centre manager', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')

export default test('map-leisure', [
  part({
    n: 2,
    title: 'A refurbished leisure centre',
    intro: 'You will hear the manager of a leisure centre describing changes to the building.',
    speakers: [manager],
    blocks: [
      {
        lines: `
          manager: Good evening, and thank you for coming to see our newly refurbished leisure centre. I'm Priya, the centre manager. A lot of things have moved, so let me take you round the plan.
          manager: We're standing at the main entrance, in the foyer, with the reception desk in front of us.
          manager: The first change is the café. It used to be upstairs, but it's now down here, in the foyer, on your left as you come in, so parents can watch the entrance while they wait.
          manager: Through the door on the left, in the south-west corner, is the new children's play area. It's for under-eights, and it's free for members.
          manager: Now, the changing rooms. They're beside the pool, at the end nearest us, the south-east corner of the pool. They're much bigger than before, with family cubicles.
          manager: If you go along the corridor to the right, the first room you come to, in the south-east corner, is the fitness studio, where we run our classes.
          manager: Next to that, going north, the middle room on that side is the gym. It's twice the size it used to be.
          manager: And at the end, in the north-east corner, is the sauna and steam room.
          manager: Lockers for valuables are at the north end of the corridor, right by the pool, so you can see them from the water.
          manager: Finally, if you need first aid, the first aid room is in the foyer, just to the right of the reception desk.
        `,
        groups: [
          map(CENTRE, [
            ['Café', 'A', "it's now down here, in the foyer, on your left as you come in", 'In the foyer, left of the entrance: A.'],
            ["Children's play area", 'B', "Through the door on the left, in the south-west corner, is the new children's play area", 'The south-west room: B.'],
            ['Changing rooms', 'C', 'the south-east corner of the pool', 'Beside the pool, nearest the foyer: C.'],
            ['Fitness studio', 'F', 'the first room you come to, in the south-east corner, is the fitness studio', 'The south-east room: F.'],
            ['Gym', 'E', 'the middle room on that side is the gym', 'The middle room on the east side: E.'],
            ['Sauna', 'D', 'in the north-east corner, is the sauna and steam room', 'The north-east room: D.'],
            ['Lockers', 'G', 'Lockers for valuables are at the north end of the corridor, right by the pool', 'North end of the corridor: G.'],
            ['First aid room', 'H', 'the first aid room is in the foyer, just to the right of the reception desk', 'Right of reception: H.'],
          ]),
        ],
      },
    ],
    traps: [['It used to be upstairs', 11, 'Its old location.']],
  }),
])
