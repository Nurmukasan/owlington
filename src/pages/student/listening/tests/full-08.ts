import type { MapSpec } from '../practice-data'
import { choose2, form, limit, map, matching, mcq, notes, part, person, test } from '../build'

const HOUSE: MapSpec = {
  title: 'Ashcombe House, ground floor',
  description:
    'Plan of the ground floor of a historic house, with north at the top. Visitors enter through the main door, marked You are here, in the middle of the south wall, into the Great Hall. ' +
    'The Great Hall fills the centre of the house. A staircase rises from the north side of the hall. Two rooms are on the west side of the house and two on the east side. ' +
    'Along the north wall, behind the staircase, there are two more rooms, one either side. ' +
    'Letter A is the room in the south-west corner. Letter B is the room in the north-west corner. Letter C is the room behind the staircase on its west side. ' +
    'Letter D is the room behind the staircase on its east side. Letter E is the room in the north-east corner. Letter F is the room in the south-east corner. ' +
    'Letter G is in the Great Hall, just to the right of the main door.',
  ground: 'floor',
  shapes: [
    { kind: 'room', x: 30, y: 250, w: 170, h: 180 },
    { kind: 'room', x: 30, y: 30, w: 170, h: 200 },
    { kind: 'room', x: 220, y: 30, w: 95, h: 100 },
    { kind: 'room', x: 325, y: 30, w: 95, h: 100 },
    { kind: 'room', x: 440, y: 30, w: 170, h: 200 },
    { kind: 'room', x: 440, y: 250, w: 170, h: 180 },
    { kind: 'stage', x: 220, y: 150, w: 200, h: 280, label: 'Great Hall' },
    { kind: 'label', x: 320, y: 190, text: 'Stairs', small: true },
  ],
  points: { A: [115, 340], B: [115, 130], C: [267, 80], D: [372, 80], E: [525, 130], F: [525, 340], G: [370, 400] },
  here: [320, 420],
  hereLabel: 'MAIN DOOR',
}

const desk = person('desk', 'Carl', 'Bike hire assistant', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')
const rosa = person('rosa', 'Rosa', 'Caller', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const guide = person('guide', 'Margaret', 'House guide', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const tutor = person('tutor', 'Dr Shah', 'Tutor', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const ed = person('ed', 'Ed', 'Student', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')
const nina = person('nina', 'Nina', 'Student', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const prof = person('prof', 'Professor Hale', 'Lecturer', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')

export default test('full-08', [
  part({
    n: 1,
    title: 'Hiring bicycles',
    intro: 'You will hear a woman phoning a bike hire shop to arrange bicycles for a family holiday.',
    speakers: [desk, rosa],
    blocks: [
      {
        lines: `
          desk: Morning, Coastline Cycles. Carl here.
          rosa: Hi, Carl. We're coming to the island for a week in August, and we'd like to hire some bikes.
          desk: No problem. How many of you are there?
          rosa: Four. My husband and I, and two children aged nine and fourteen.
          desk: OK. The fourteen-year-old can probably ride an adult bike. How tall is he?
          rosa: She, actually. About one metre sixty. || She, actually. About one metre sixty.
          desk: Then an adult small frame will be fine. And for the nine-year-old, we have children's bikes with twenty-four-inch wheels. || Then an adult small frame will be fine. And for the nine-year-old, we have children's bikes with twenty-four-inch wheels.
          rosa: Great. What are your prices?
          desk: Adult bikes are fourteen pounds a day, or sixty-five for the week. Children's bikes are forty for the week.
          rosa: We'll take them all for the week, then.
          desk: Lovely. Helmets are included, and every bike comes with a lock and lights.
          rosa: What about a child seat? Our son won't need one, but my sister might join us with her toddler for a couple of days.
          desk: We have those. They're five pounds a day. Just let us know the dates nearer the time.
          rosa: OK. Can I give you my details?
          desk: Please. Name first?
          rosa: Rosa Delahunty. D-E-L-A-H-U-N-T-Y. || Rosa Delahunty. D, E, L, A, H, U, N, T, Y.
          desk: And where are you staying on the island?
          rosa: At a campsite called Sandy Bay.
          desk: Oh, we can deliver to Sandy Bay. That's free for weekly hire.
          rosa: Perfect. We arrive on Saturday the 9th. || Perfect. We arrive on Saturday the ninth.
          desk: Then we'll deliver the bikes that afternoon, between two and four.
        `,
        groups: [
          form(
            'Coastline Cycles — hire form',
            limit(1, true),
            [
              'Number of bikes: 4',
              'Child’s bike: [[24|24-inch]]-inch wheels',
              'Weekly price for adult bike: £[[65|sixty-five]]',
              'Included: helmet, lock and [[lights]]',
              'Child seat: £[[5|five]] per day',
              'Customer name: Rosa [[Delahunty]]',
              'Delivery to: [[Sandy]] Bay campsite',
              'Delivery date: Saturday [[9|9th]] August, 2–4 pm',
            ],
            [
              ['twenty-four-inch wheels', 'For the nine-year-old.'],
              ['sixty-five for the week', '£14 is the daily price.'],
              ['every bike comes with a lock and lights', 'Helmets are also included.'],
              ["They're five pounds a day", 'For the sister’s toddler.'],
              ['D-E-L-A-H-U-N-T-Y', 'The surname is spelt out.'],
              ['At a campsite called Sandy Bay', 'Delivery there is free for weekly hire; “Bay” is printed.'],
              ['We arrive on Saturday the 9th', 'They will deliver that afternoon.'],
            ],
          ),
        ],
      },
      {
        lines: `
          rosa: Can you recommend any routes? We're not very experienced.
          desk: Sure. The most popular is the Lighthouse Trail. It's completely flat and follows the old railway line, so it's ideal for children.
          rosa: How long is it?
          desk: About twelve miles there and back. And there's a café at the lighthouse that does great ice cream.
          rosa: The kids will love that. Anything else?
          desk: The Forest Loop is nice, but it's quite muddy after rain, so I'd only do it if it's been dry. And avoid the coast road in the afternoons, as it gets very busy with cars.
          rosa: Thanks. One last question. What happens if a bike gets a puncture?
          desk: Just ring us. We have a van, and we'll come and repair it or swap the bike, wherever you are.
        `,
        groups: [
          notes(
            'Route advice',
            limit(2),
            [
              '- Lighthouse Trail: flat, follows an old [[railway line]]',
              '- Forest Loop: only go if it has been [[dry]]',
              '- puncture: phone the shop and they will come in a [[van]]',
            ],
            [
              ['follows the old railway line', 'Completely flat and ideal for children.'],
              ["I'd only do it if it's been dry", 'It is muddy after rain.'],
              ["We have a van, and we'll come and repair it", 'They repair or swap the bike wherever you are.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Adult bikes are fourteen pounds a day', 3, 'The daily price.'],
      ["Our son won't need one", 5, 'The child seat is for a toddler.'],
      ['About twelve miles there and back', 8, 'Distance, not the route feature.'],
    ],
  }),

  part({
    n: 2,
    title: 'Ashcombe House',
    intro: 'You will hear a guide talking to visitors at a historic house.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Good afternoon, and welcome to Ashcombe House. I'm Margaret, and I'll be your guide today.
          guide: The house was built in 1720 for a wealthy wool merchant, and the same family lived here for over two hundred years. In the 1950s, the last family member gave it to the nation, mainly because she couldn't afford to repair the roof. || The house was built in seventeen twenty for a wealthy wool merchant, and the same family lived here for over two hundred years. In the nineteen fifties, the last family member gave it to the nation, mainly because she couldn't afford to repair the roof.
          guide: What makes Ashcombe special isn't its size; there are much bigger houses in the county. It's the fact that almost all the original furniture is still here, so you see the rooms exactly as the family used them.
          guide: Photography is allowed in most rooms, but please don't use flash, because the light damages the fabrics and paintings.
          guide: And for anyone who'd like to know more, we run behind-the-scenes tours on the first Sunday of every month, which include the kitchens and servants' quarters in the basement.
        `,
        groups: [
          mcq([
            [
              'Why was the house given to the nation?',
              ['The family had no children.', 'The owner could not pay for repairs.', 'The government asked to buy it.'],
              'B',
              "she couldn't afford to repair the roof",
              'The last family member gave it away in the 1950s.',
            ],
            [
              'What is special about Ashcombe House?',
              ['its size', 'its original furniture', 'its paintings'],
              'B',
              'almost all the original furniture is still here',
              'There are much bigger houses in the county.',
            ],
            [
              'Visitors are asked not to use flash because',
              ['it disturbs other visitors.', 'it can harm the fabrics.', 'it is forbidden in all rooms.'],
              'B',
              'the light damages the fabrics and paintings',
              'Photography itself is allowed in most rooms.',
            ],
          ]),
        ],
      },
      {
        lines: `
          guide: Now, you've each got a plan of the ground floor. We're standing in the Great Hall, just inside the main door.
          guide: The room in the corner on your left as you came in, the south-west corner, is the library. It has more than three thousand books, some of them very rare.
          guide: Above that, in the north-west corner, is the dining room, where the family entertained guests. The table can seat twenty-four people.
          guide: Now, behind the staircase there are two small rooms. The one on the left is the music room, and you'll see a harpsichord there that's still played at our summer concerts.
          guide: The one on the right, behind the stairs, is now our shop, but originally it was where the butler kept the silver.
          guide: In the north-east corner is the drawing room, which is where the ladies of the house sat after dinner. Look out for the hand-painted Chinese wallpaper.
          guide: And in the south-east corner is the study, where the merchant ran his business. His desk is still there, with some of his original letters.
          guide: Finally, if you need help at any time, there's an information point just to the right of the main door as you come in.
        `,
        groups: [
          map(HOUSE, [
            ['Library', 'A', 'the south-west corner, is the library', 'The corner on the left as you come in: A.'],
            ['Dining room', 'B', 'in the north-west corner, is the dining room', 'Above the library: B.'],
            ['Music room', 'C', 'The one on the left is the music room', 'Behind the staircase, on the left: C.'],
            ['Shop', 'D', 'The one on the right, behind the stairs, is now our shop', 'Behind the staircase, on the right: D.'],
            ['Drawing room', 'E', 'In the north-east corner is the drawing room', 'The north-east corner: E.'],
            ['Study', 'F', 'in the south-east corner is the study', 'The south-east corner: F.'],
            ['Information point', 'G', "there's an information point just to the right of the main door", 'Just inside, on the right: G.'],
          ]),
        ],
      },
    ],
    traps: [
      ['there are much bigger houses in the county', 12, 'Size is not what makes it special.'],
      ['Photography is allowed in most rooms', 13, 'Flash is the problem.'],
      ['originally it was where the butler kept the silver', 17, 'Its old use; it is now the shop.'],
    ],
  }),

  part({
    n: 3,
    title: 'A presentation on online learning',
    intro: 'You will hear two education students, Ed and Nina, discussing their presentation on online learning with their tutor.',
    speakers: [tutor, ed, nina],
    blocks: [
      {
        lines: `
          tutor: So, Ed and Nina, you're presenting on online learning next week. How's it coming along?
          nina: Pretty well. We've decided to compare online and face-to-face courses for adult learners.
          tutor: Good. What have you found so far?
          ed: The main advantage everyone mentions is flexibility. People can study around their jobs and families. That came up in almost every study we read.
          nina: And it's often cheaper, because there are no travel costs. Though we were surprised that the courses themselves aren't always cheaper to run.
          tutor: That's true. Developing good online materials is expensive. What about the disadvantages?
          ed: The biggest one seems to be that many people don't finish. Drop-out rates for some free online courses are over ninety per cent.
          nina: And people miss the social side. They feel isolated without classmates.
          tutor: Did you find anything about whether people actually learn less online?
          ed: That was interesting. Most studies found no real difference in test results, as long as the course was well designed.
          tutor: Good. Make sure you emphasise that point.
        `,
        groups: [
          choose2(
            'Which TWO advantages of online learning do the students mention?',
            ['It is flexible.', 'Courses are cheaper to develop.', 'Learners save on travel.', 'Learners get more feedback.', 'Courses are shorter.'],
            ['A', 'C'],
            [
              ['The main advantage everyone mentions is flexibility', 'People can study around jobs and families.'],
              ['because there are no travel costs', 'The courses are not always cheaper to run.'],
            ],
          ),
          choose2(
            'Which TWO disadvantages do the students mention?',
            ['high drop-out rates', 'poor test results', 'technical problems', 'feelings of isolation', 'a lack of qualified teachers'],
            ['A', 'D'],
            [
              ["many people don't finish", 'Over ninety per cent drop out of some free courses.'],
              ['They feel isolated without classmates', 'People miss the social side.'],
            ],
          ),
        ],
      },
      {
        lines: `
          tutor: Now, you interviewed some learners, didn't you? Tell me about them.
          nina: Yes, four people. The first was Alan, a retired engineer who's learning Italian online. He said he wouldn't have been able to start without the recordings, because he can listen to them as many times as he likes.
          ed: Then there was Bella, who's doing a business course. She said the best thing was the online discussion forum. She learnt more from other students than from the videos.
          nina: Chris was doing a computing course, and he was quite negative. He said he gave up halfway, mainly because nobody checked whether he'd done the work.
          ed: And the last was Dana, a nurse who works nights. For her, the important thing was being able to study at four in the morning, when everyone else is asleep.
          tutor: Those are useful contrasts. You could use a quote from each of them on the slides.
          nina: That's a good idea.
        `,
        groups: [
          matching(
            'What did each learner value or criticise? Choose FOUR answers from the box and write the correct letter, A–F, next to Questions 25–28.',
            'Comments',
            [
              'contact with other learners',
              'studying at unusual times',
              'repeating material',
              'lack of supervision',
              'low cost',
              'the quality of the videos',
            ],
            [
              ['Alan', 'C', 'he can listen to them as many times as he likes', 'He values the recordings for repetition.'],
              ['Bella', 'A', 'She learnt more from other students than from the videos', 'The forum was the best thing.'],
              ['Chris', 'D', "nobody checked whether he'd done the work", 'He gave up halfway.'],
              ['Dana', 'B', 'being able to study at four in the morning', 'She works nights.'],
            ],
          ),
          mcq([
            [
              'What does the tutor say the students should emphasise?',
              ['the cost of online courses', 'similar results in online and classroom courses', 'the need for better technology'],
              'B',
              'Make sure you emphasise that point',
              'The point is that most studies found no real difference in test results.',
            ],
            [
              'What does the tutor suggest putting on the slides?',
              ['a quotation from each learner', 'a chart of drop-out rates', 'photos of the learners'],
              'A',
              'You could use a quote from each of them on the slides',
              'Nina agrees it is a good idea.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ["the courses themselves aren't always cheaper to run", 22, 'Development is expensive.'],
      ['Most studies found no real difference in test results', 24, 'Not a disadvantage.'],
      ['than from the videos', 26, 'Videos are not what she valued.'],
    ],
  }),

  part({
    n: 4,
    title: 'Whale song',
    intro: 'You will hear a lecture about the songs of humpback whales.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today I'm going to talk about one of the most extraordinary sounds in nature: the song of the humpback whale.
          prof: Whale song was first recorded by accident in the 1950s, by engineers who were listening for enemy submarines. It wasn't until the late 1960s that scientists realised the sounds were organised into songs. || Whale song was first recorded by accident in the nineteen fifties, by engineers who were listening for enemy submarines. It wasn't until the late nineteen sixties that scientists realised the sounds were organised into songs.
          prof: Only male humpbacks sing, and they do so mainly during the breeding season, in warm tropical waters. A song may last up to twenty minutes, and a whale may repeat it for hours.
          prof: The structure is surprisingly complex. Individual sounds are combined into phrases, phrases are repeated to form themes, and several themes, always in the same order, make up a song.
          prof: Perhaps the most remarkable discovery is that all the males in a population sing the same song, and that the song changes gradually over time. Every male adopts the changes, so the song stays the same across the group.
          prof: Even more surprising, researchers in the Pacific found that a completely new song can spread from one population to another, moving from east to west across the ocean over a couple of years. It's been compared to the way a popular tune spreads among humans.
          prof: Why do whales sing? The most common explanation is that the song attracts females. But females rarely approach singing males, so some researchers believe the song is mainly a signal to other males, perhaps to establish their position.
          prof: Sound travels much further in water than in air, and low-frequency whale calls can be heard hundreds of kilometres away. This makes whales particularly vulnerable to noise from human activity, especially shipping. Studies show that when ships pass, whales sing for shorter periods, or stop altogether.
          prof: Fortunately, there's a simple solution in many places. When ships reduce their speed, the noise they make falls considerably, and some ports now ask ships to slow down in areas where whales gather.
        `,
        groups: [
          notes(
            'Humpback whale song',
            limit(1),
            [
              '- first recorded by engineers listening for [[submarines]]',
              '- only [[male|males]] humpbacks sing, mainly in the breeding season',
              '- sounds form phrases, phrases form [[themes]]',
              '- the song changes [[gradually]] over time',
              '- new songs spread from [[east]] to west across the Pacific',
              '- song may be a signal to other males about their [[position]]',
              '- low-frequency calls can travel hundreds of [[kilometres|kilometers]]',
              '- whales are affected by noise from [[shipping|ships]]',
              '- ships make less noise when they reduce their [[speed]]',
            ],
            [
              ['listening for enemy submarines', 'It was recorded by accident.'],
              ['Only male humpbacks sing', 'Mainly during the breeding season.'],
              ['phrases are repeated to form themes', 'Several themes in order make a song.'],
              ['the song changes gradually over time', 'Every male adopts the changes.'],
              ['moving from east to west across the ocean', 'Over a couple of years.'],
              ['perhaps to establish their position', 'Females rarely approach singing males.'],
              ['can be heard hundreds of kilometres away', 'Sound travels further in water.'],
              ['noise from human activity, especially shipping', 'Whales sing less when ships pass.'],
              ['When ships reduce their speed', 'Noise falls considerably.'],
            ],
          ),
          mcq([
            [
              'What do some ports now ask ships to do?',
              ['change their routes', 'travel more slowly near whales', 'turn off their engines'],
              'B',
              'some ports now ask ships to slow down in areas where whales gather',
              'Slowing down reduces the noise considerably.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['the song attracts females', 36, 'The common explanation, which some researchers doubt.'],
      ['A song may last up to twenty minutes', 32, 'Length, not who sings.'],
    ],
  }),
])
