import type { MapSpec } from '../practice-data'
import { choose2, form, limit, map, matching, mcq, notes, part, person, table, test } from '../build'

const SCIENCE: MapSpec = {
  title: 'Brookfield Science Park',
  description:
    'Map of the science park grounds, with north at the top. The main gate, marked You are here, is in the middle of the south side. ' +
    'A road runs east from the gate to a car park in the south-east corner. A path leads north from the gate to the Main Hall in the centre of the site. ' +
    'A pond lies to the west of the Main Hall, and a wooded area covers the north-west corner. A large field fills the north-east. ' +
    'Letter A is just inside the gate, on the west side of the path. Letter B is on the north shore of the pond. Letter C is in the wooded area. ' +
    'Letter D is directly north of the Main Hall. Letter E is in the field, in the north-east corner. Letter F is east of the Main Hall, between it and the car park. ' +
    'Letter G is beside the car park, on its north side. Letter H is on the south-west edge of the pond.',
  shapes: [
    { kind: 'trees', x: 30, y: 30, w: 200, h: 140, label: 'Woods' },
    { kind: 'field', x: 420, y: 30, w: 190, h: 170, label: 'Field' },
    { kind: 'water', x: 60, y: 210, w: 160, h: 110, round: true, label: 'Pond' },
    { kind: 'building', x: 260, y: 180, w: 120, h: 100, label: 'Main Hall' },
    { kind: 'parking', x: 470, y: 330, w: 140, h: 100, label: 'P' },
    { kind: 'path', d: 'M320 440 V 280' },
    { kind: 'road', d: 'M320 440 H 470' },
    { kind: 'path', d: 'M320 180 V 90' },
  ],
  points: { A: [270, 400], B: [140, 195], C: [90, 145], D: [320, 75], E: [560, 70], F: [430, 240], G: [540, 310], H: [65, 330] },
  here: [320, 430],
  hereLabel: 'GATE',
}

const clerk = person('clerk', 'Grace', 'Holiday company adviser', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const neil = person('neil', 'Neil', 'Caller', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const guide = person('guide', 'Tom', 'Education officer', 'm', 'en-AU', 'bnkqMLCB8HHkYK9Gd6Xj')
const lena = person('lena', 'Lena', 'Student', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const sam = person('sam', 'Sam', 'Student', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')
const prof = person('prof', 'Dr Okafor', 'Lecturer', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')

export default test('full-07', [
  part({
    n: 1,
    title: 'A walking holiday',
    intro: 'You will hear a man phoning a company that organises walking holidays.',
    speakers: [clerk, neil],
    blocks: [
      {
        lines: `
          clerk: Good morning, Footpath Holidays. Grace speaking.
          neil: Hello. I'm interested in the five-day walking holiday in the Lake District. Could you tell me a bit more about it?
          clerk: Of course. It's a self-guided holiday, so you walk on your own, but we book the hotels and carry your luggage from one hotel to the next.
          neil: That sounds good. What's the route like?
          clerk: On day one you start in Ambleside and walk to Grasmere. It's an easy day, only about eight miles, and it goes past two lakes.
          neil: And day two?
          clerk: Day two is the hardest. You go from Grasmere over the mountains to Patterdale. It's thirteen miles, and there's a steep climb, so you need to be fit. If the weather's bad, there's a lower route through the valley, which we'll show you on the map.
          neil: OK. And then?
          clerk: Day three is a rest day in Patterdale. Lots of people take the boat across the lake, which is very relaxing.
          neil: Lovely.
          clerk: Day four you walk from Patterdale to a village called Bampton, about eleven miles. That one goes through an area that's famous for its wildlife, especially red deer, so bring your binoculars.
          neil: And the last day?
          clerk: Day five is a short walk to Penrith, where there's a railway station for your journey home.
        `,
        groups: [
          table(
            'Five-day walking holiday',
            limit(2, true),
            ['Day', 'Route', 'Notes'],
            [
              ['1', 'Ambleside to Grasmere', 'easy: about [[8|eight]] miles; passes two lakes'],
              ['2', 'Grasmere to Patterdale', 'steep climb; lower route through the [[valley]] in bad weather'],
              ['3', 'Rest day', 'many people take a [[boat]] across the lake'],
              ['4', 'Patterdale to [[Bampton]]', 'look out for red [[deer]]'],
              ['5', 'to Penrith', 'short walk to the railway station'],
            ],
            [
              ['only about eight miles', 'Day one is an easy day.'],
              ["there's a lower route through the valley", 'An alternative if the weather is bad.'],
              ['Lots of people take the boat across the lake', 'Day three is a rest day.'],
              ['a village called Bampton', 'Day four ends in Bampton.'],
              ['especially red deer', 'The area is famous for its wildlife.'],
            ],
          ),
        ],
      },
      {
        lines: `
          neil: That all sounds great. What does it cost?
          clerk: It's four hundred and sixty pounds per person, which includes bed and breakfast in all the hotels.
          neil: Does that include evening meals?
          clerk: No, but every hotel has a restaurant, or there are pubs nearby.
          neil: Fine. I'd like to book for two people, me and my wife, starting on the 12th of June. || Fine. I'd like to book for two people, me and my wife, starting on the twelfth of June.
          clerk: Let me just check. Yes, that's fine. Can I have your name?
          neil: Neil Pritchard. P-R-I-T-C-H-A-R-D. || Neil Pritchard. P, R, I, T, C, H, A, R, D.
          clerk: And your address?
          neil: 27 Elm Grove, Chester. || Twenty-seven Elm Grove, Chester.
          clerk: Thank you. Will you be arriving by car?
          neil: No, by train.
          clerk: Then you'll need to get the bus from Windermere station to Ambleside. It takes about twenty minutes. We'll send you a timetable.
          neil: And what if one of us is ill and we have to cancel?
          clerk: We strongly recommend travel insurance. If you cancel more than six weeks before, you lose only the deposit of fifty pounds each.
          neil: I see. Is there anything special I should pack?
          clerk: A waterproof jacket, definitely, even in summer. And we'll give you a guidebook, so you don't need to buy one.
        `,
        groups: [
          form(
            'Booking details',
            limit(2, true),
            [
              'Cost per person: £[[460]] (bed and breakfast)',
              'Start date: [[12|12th]] June',
              'Surname: [[Pritchard]]',
              'Address: 27 [[Elm Grove]], Chester',
              'Travel from Windermere station: by [[bus]]',
            ],
            [
              ['four hundred and sixty pounds per person', 'Evening meals are not included.'],
              ['starting on the 12th of June', 'For two people.'],
              ['P-R-I-T-C-H-A-R-D', 'The surname is spelt out.'],
              ['27 Elm Grove, Chester', 'The street name; the number and town are printed.'],
              ["you'll need to get the bus from Windermere station to Ambleside", 'They are coming by train, not car.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['It\'s thirteen miles', 1, 'Day two, not day one.'],
      ['the deposit of fifty pounds each', 6, 'The deposit, not the cost.'],
      ['Will you be arriving by car?', 10, 'They come by train, then bus.'],
    ],
  }),

  part({
    n: 2,
    title: 'Brookfield Science Park',
    intro: 'You will hear an education officer welcoming a group of teachers to a science park.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Morning, everyone, and welcome to Brookfield Science Park. I'm Tom, and I organise school visits here.
          guide: The park opened six years ago on the site of an old brick factory. Our aim is to get children doing science outdoors as well as indoors.
          guide: Before I show you round, a few practical points. School groups must have at least one adult for every eight children. Lunch can be eaten in the Main Hall if it rains, but most groups prefer to eat outside.
          guide: Teachers often ask what makes our visits different from a normal science museum. Two things. First, every activity is led by a trained scientist, not a volunteer. And second, each child takes home a record of their results, so the work can continue in the classroom.
          guide: We've also recently added two features that teachers have been asking for. There's now a quiet room for children who find the noise and crowds difficult, and we've introduced a free online booking system, so you can see exactly which dates are available.
        `,
        groups: [
          mcq([
            [
              'What was the site used for in the past?',
              ['a farm', 'a factory', 'a school'],
              'B',
              'on the site of an old brick factory',
              'The park opened six years ago on the factory site.',
            ],
          ]),
          choose2(
            'Which TWO things make the visits different from a normal museum?',
            ['Activities are led by scientists.', 'Visits are free of charge.', 'Children keep a record of their results.', 'Groups can stay overnight.', 'Every visit includes a film.'],
            ['A', 'C'],
            [
              ['every activity is led by a trained scientist', 'Not by volunteers.'],
              ['each child takes home a record of their results', 'So the work can continue in the classroom.'],
            ],
          ),
          choose2(
            'Which TWO new features does Tom mention?',
            ['a larger café', 'a quiet room', 'a minibus service', 'online booking', 'a new car park'],
            ['B', 'D'],
            [
              ["There's now a quiet room", 'For children who find the noise and crowds difficult.'],
              ["we've introduced a free online booking system", 'Teachers can see which dates are available.'],
            ],
          ),
        ],
      },
      {
        lines: `
          guide: Right, let's look at the map. We're at the main gate, at the bottom.
          guide: Just inside the gate, on your left, there's a small building where groups register. Please come there first when you arrive, so we know you're here.
          guide: At the top of the pond, on the north shore, is the pond-dipping platform, where children catch and identify water creatures. It has a rail all round, so it's quite safe.
          guide: In the woods, in the north-west corner, there's the bug hotel, a large wooden structure where we study insects. Children love it.
          guide: Behind the Main Hall, directly to the north, is the weather station. It's on a slightly raised area, so it gets the wind from every direction.
          guide: Then over to the east of the Main Hall, between the hall and the car park, is the solar garden, with panels that children can adjust to see how much power they produce.
          guide: The field in the north-east is used for rocket launches, but that's only in the summer term. Oh, and the coach drop-off point is on the north side of the car park, so the children don't have to cross the road.
        `,
        groups: [
          map(SCIENCE, [
            ['Registration building', 'A', 'Just inside the gate, on your left', 'On the west side of the path just inside the gate: A.'],
            ['Pond-dipping platform', 'B', 'At the top of the pond, on the north shore', 'The north shore of the pond: B.'],
            ['Bug hotel', 'C', "In the woods, in the north-west corner, there's the bug hotel", 'In the wooded area: C.'],
            ['Weather station', 'D', 'Behind the Main Hall, directly to the north', 'North of the Main Hall: D.'],
            ['Solar garden', 'F', 'between the hall and the car park, is the solar garden', 'East of the Main Hall: F.'],
          ]),
        ],
      },
    ],
    traps: [
      ['Lunch can be eaten in the Main Hall if it rains', 11, 'A practical point, not about the site.'],
      ['not a volunteer', 12, 'Activities are led by scientists.'],
      ['the coach drop-off point is on the north side of the car park', 20, 'G is the coach drop-off, not the solar garden.'],
    ],
  }),

  part({
    n: 3,
    title: 'River fieldwork',
    intro: 'You will hear two geography students, Lena and Sam, discussing a fieldwork trip to a river.',
    speakers: [lena, sam],
    blocks: [
      {
        lines: `
          lena: So, Sam, the fieldwork's next Thursday. Shall we decide who does what?
          sam: Good idea. There are five tasks on the sheet. I'm happy to do the water speed measurements. I did them last year, so I know how the flow meter works.
          lena: Great. I'll take the photographs, then. I've got a decent camera, and I can label them afterwards.
          sam: What about measuring the width and depth? That needs two people, really.
          lena: Let's do that together. One of us can hold the tape while the other writes.
          sam: Fine. And the sediment samples? Collecting stones from the river bed and measuring them?
          lena: Could you do that? I'm hopeless at that kind of detailed work.
          sam: Sure. And the last task is the questionnaire for people walking along the river.
          lena: Actually, our tutor said we should ask Professor Grant about that, because we need ethical approval for questionnaires. So neither of us should start that until he's agreed.
          sam: OK. Let's leave it to him to decide.
        `,
        groups: [
          matching(
            'Who will do each task? Choose the correct letter, A, B or C.',
            'People',
            ['Lena', 'Sam', 'both Lena and Sam'],
            [
              ['measuring water speed', 'B', "I'm happy to do the water speed measurements", 'Sam has used the flow meter before.'],
              ['taking photographs', 'A', "I'll take the photographs, then", 'Lena has a good camera.'],
              ['measuring width and depth', 'C', "Let's do that together", 'The task needs two people.'],
              ['collecting sediment samples', 'B', 'Could you do that?', 'Sam agrees: “Sure.”'],
            ],
          ),
        ],
      },
      {
        lines: `
          sam: What do you think we'll find? Our hypothesis is that the river gets wider and deeper as you go downstream.
          lena: That's what the textbook says. But I'm not sure it'll be true for this river. There's a dam about halfway along, isn't there?
          sam: Yes, the old mill dam. You're right, it might affect the results below it.
          lena: Maybe we should make the dam part of the project. It'd make our work more original.
          sam: Good thinking. The tutor did say we'd get extra marks for something unexpected.
          lena: And what's the biggest risk on the day? I'm a bit worried about the weather.
          sam: The forecast's fine, actually. What worries me more is that if it's rained the day before, the water could be too high to stand in safely.
          lena: Then we'll need a back-up plan. If the water's high, we could just do the questionnaires and the photos.
          sam: Yes. And let's take spare batteries for the flow meter. Last year it stopped working halfway through.
          lena: Good point. What about writing it up? When's the deadline?
          sam: The end of next month. I suggest we write the introduction before we go, while the background reading is fresh.
          lena: That makes sense. And the analysis afterwards, obviously.
          sam: One more thing. Which part of the river should we start at?
          lena: Let's start at the source and work downstream. It's easier to get to the car park at the end that way.
        `,
        groups: [
          mcq([
            [
              'Why does Lena doubt the hypothesis?',
              ['The textbook is out of date.', 'A dam may affect the river.', 'The river is too short.'],
              'B',
              "There's a dam about halfway along, isn't there?",
              'The old mill dam may affect results below it.',
            ],
            [
              'Why do the students decide to include the dam in the project?',
              ['to make the project more original', 'because the tutor asked them to', 'because it is easy to reach'],
              'A',
              "It'd make our work more original",
              'The tutor also mentioned extra marks for something unexpected.',
            ],
            [
              'What is Sam most worried about?',
              ['bad weather on the day', 'the river being too deep', 'losing their equipment'],
              'B',
              'the water could be too high to stand in safely',
              'The forecast is fine; the worry is high water after rain.',
            ],
            [
              'What will the students take with them?',
              ['spare batteries', 'a second flow meter', 'waterproof notebooks'],
              'A',
              "let's take spare batteries for the flow meter",
              'Last year the meter stopped working.',
            ],
            [
              'When will they write the introduction?',
              ['before the trip', 'on the day of the trip', 'after the analysis'],
              'A',
              'I suggest we write the introduction before we go',
              'While the background reading is fresh.',
            ],
            [
              'Where will the students start their fieldwork?',
              ['at the dam', 'at the source of the river', 'at the car park'],
              'B',
              "Let's start at the source and work downstream",
              'The car park is at the end, which is convenient.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['the questionnaire for people walking along the river', 24, 'The questionnaire is not one of the four tasks asked about.'],
      ["I'm a bit worried about the weather", 27, 'Lena’s worry, not Sam’s.'],
      ["It's easier to get to the car park at the end that way", 30, 'Not the starting point.'],
    ],
  }),

  part({
    n: 4,
    title: 'Building with bamboo',
    intro: 'You will hear a lecture about the use of bamboo as a building material.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: In today's lecture, I'll be talking about bamboo, a material that's been used for building for thousands of years, and which architects are now taking much more seriously.
          prof: Although bamboo looks like a tree, it's actually a type of grass. That explains one of its most remarkable features: its speed of growth. Some species can grow almost a metre in a single day, and a bamboo plant can be harvested after three to five years, compared with several decades for most trees used for timber.
          prof: Bamboo is also extremely strong. In relation to its weight, it can be stronger than steel when it's being stretched, and it performs well under compression too. This combination of strength and lightness makes it particularly suitable in areas where earthquakes are common, because light, flexible buildings are less likely to collapse.
          prof: Environmentally, bamboo has a lot going for it. Because it grows so fast, it absorbs large amounts of carbon dioxide, and when the stems are cut, the roots stay in the ground and new shoots appear, so there's no need to replant. The roots also help hold soil together, which reduces erosion on hillsides.
          prof: So why isn't bamboo used everywhere? There are several problems. The first is durability. Untreated bamboo is attacked by insects, because the stems contain sugar, and it can rot quickly if it stays wet. Traditionally, builders soaked the stems in water for several weeks to remove the sugar; today, they're usually treated with a natural salt solution.
          prof: The second problem is that every stem is different. Bamboo isn't produced in standard sizes like steel or concrete, so engineers find it hard to calculate how much weight a structure can carry. This is one reason building regulations in many countries don't yet include bamboo.
          prof: A third challenge is joining the stems. Because they're hollow, they can split if you put nails in them. Builders in Colombia developed a solution: they fill the ends of the stems with cement before bolting them together.
          prof: Finally, there's the question of image. In many places, bamboo is seen as a material for poor people, and families who can afford it often prefer concrete. Some architects are trying to change this by designing high-quality public buildings, such as schools, entirely from bamboo.
        `,
        groups: [
          notes(
            'Bamboo as a building material',
            limit(1, true),
            [
              '# Growth',
              '- bamboo is a kind of [[grass]], not a tree',
              '- can be harvested after three to [[five|5]] years',
              '# Strength',
              '- in relation to its [[weight]], it can be stronger than steel',
              '- suitable where [[earthquakes]] are common',
              '# Environment',
              '- absorbs a lot of carbon dioxide',
              '- no need to [[replant]] after cutting',
              '- roots reduce [[erosion]] on hillsides',
              '# Problems',
              '- insects are attracted by the [[sugar]] in the stems',
              '- today, stems are treated with a natural [[salt]] solution',
              '- no standard [[sizes]], so it is not in many building regulations',
              '- in Colombia, stem ends are filled with [[cement]] before bolting',
            ],
            [
              ["it's actually a type of grass", 'It looks like a tree.'],
              ['harvested after three to five years', 'Trees take several decades.'],
              ['In relation to its weight, it can be stronger than steel', 'When it is being stretched.'],
              ['particularly suitable in areas where earthquakes are common', 'Light, flexible buildings are less likely to collapse.'],
              ["so there's no need to replant", 'New shoots grow from the roots.'],
              ['which reduces erosion on hillsides', 'The roots hold the soil together.'],
              ['because the stems contain sugar', 'Untreated bamboo is attacked by insects.'],
              ['treated with a natural salt solution', 'Traditionally, stems were soaked in water.'],
              ["Bamboo isn't produced in standard sizes like steel or concrete", 'Engineers find calculations hard.'],
              ['they fill the ends of the stems with cement before bolting them together', 'Nails can split hollow stems.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Some species can grow almost a metre in a single day', 32, 'Growth speed, not harvest time.'],
      ['builders soaked the stems in water for several weeks', 38, 'The traditional method.'],
      ['they can split if you put nails in them', 40, 'The problem, not the solution.'],
    ],
  }),
])
