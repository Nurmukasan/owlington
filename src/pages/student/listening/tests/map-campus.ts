import type { MapSpec } from '../practice-data'
import { map, part, person, test } from '../build'


const CAMPUS: MapSpec = {
  title: 'Ferndale University campus',
  description:
    'Map of a university campus, with north at the top. The main gate, marked You are here, is in the middle of the south side. ' +
    'A straight avenue runs north from the gate to the Library at the top of the map. Halfway up the avenue, a road crosses from west to east. ' +
    'A lake lies in the south-west of the campus, and sports fields cover the north-east corner. The Great Hall is just inside the gate, on the east side of the avenue. ' +
    'Letter A is just inside the gate on the west side of the avenue. Letter B is on the north shore of the lake. Letter C is at the western end of the cross road. ' +
    'Letter D is on the west side of the avenue, just north of the cross road. Letter E is directly west of the Library. Letter F is directly east of the Library. ' +
    'Letter G is in the sports fields. Letter H is at the eastern end of the cross road. Letter I is just north of the Great Hall, on the east side of the avenue, south of the cross road.',
  shapes: [
    { kind: 'path', d: 'M320 440 V 80' },
    { kind: 'road', d: 'M30 250 H 610' },
    { kind: 'water', x: 40, y: 300, w: 180, h: 110, round: true, label: 'Lake' },
    { kind: 'field', x: 430, y: 30, w: 180, h: 180, label: 'Sports fields' },
    { kind: 'building', x: 270, y: 30, w: 100, h: 50, label: 'Library' },
    { kind: 'building', x: 350, y: 360, w: 110, h: 60, label: 'Great Hall' },
  ],
  points: { A: [285, 400], B: [130, 290], C: [50, 230], D: [285, 210], E: [230, 55], F: [400, 55], G: [520, 120], H: [590, 270], I: [400, 315] },
  here: [320, 430],
  hereLabel: 'MAIN GATE',
}

const guide = person('guide', 'Jess', 'Student ambassador', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')

export default test('map-campus', [
  part({
    n: 2,
    title: 'A campus open day',
    intro: 'You will hear a student ambassador describing the campus to visitors at a university open day.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Hi, everyone, and welcome to Ferndale University's open day. I'm Jess, a second-year student, and I'm going to explain where everything is. You should all have a map. We're standing at the main gate, at the bottom.
          guide: First, as soon as you come through the gate, on your left, you'll see the visitor centre. That's where you can pick up a programme and a free lunch voucher.
          guide: The large building on your right, just inside the gate, is the Great Hall, where the welcome talk takes place at ten. Directly behind it, before you reach the road, there's the student union. It has a café and a shop, and it's run entirely by students.
          guide: Now, walk up the avenue until you come to the road that crosses the campus. If you turn left and follow it right to the end, you'll come to the science building. There are lab demonstrations there all morning.
          guide: Back on the avenue, once you've crossed the road, the first building on the left is the languages centre. You can try a short taster lesson in Mandarin or Arabic.
          guide: Right at the top of the avenue is the library. The building just to the right of it, on the east side, is the computer centre, which is open twenty-four hours a day during term.
          guide: On the other side of the library, to the west, is the music building. There's a student concert there at one o'clock.
          guide: If you're interested in sport, the sports centre is at the far end of the cross road, on the right, the eastern end. The fields themselves are behind it.
          guide: And finally, if you'd like a quiet place to eat your lunch, there's a small boathouse café on the north shore of the lake.
        `,
        groups: [
          map(CAMPUS, [
            ['Visitor centre', 'A', "as soon as you come through the gate, on your left, you'll see the visitor centre", 'Just inside the gate, west side: A.'],
            ['Student union', 'I', "Directly behind it, before you reach the road, there's the student union", 'Behind the Great Hall, south of the road: I.'],
            ['Science building', 'C', "If you turn left and follow it right to the end, you'll come to the science building", 'The western end of the cross road: C.'],
            ['Languages centre', 'D', "once you've crossed the road, the first building on the left is the languages centre", 'West side of the avenue, north of the road: D.'],
            ['Computer centre', 'F', 'The building just to the right of it, on the east side, is the computer centre', 'East of the library: F.'],
            ['Music building', 'E', 'On the other side of the library, to the west, is the music building', 'West of the library: E.'],
            ['Sports centre', 'H', 'the sports centre is at the far end of the cross road, on the right, the eastern end', 'The eastern end of the cross road: H. The fields (G) are behind it.'],
            ['Boathouse café', 'B', "there's a small boathouse café on the north shore of the lake", 'North shore of the lake: B.'],
          ]),
        ],
      },
    ],
    traps: [['The fields themselves are behind it', 17, 'G is the fields, not the sports centre.']],
  }),
])
