import type { MapSpec } from '../practice-data'
import { flow, form, limit, map, matching, mcq, notes, part, person, test } from '../build'

const STADIUM: MapSpec = {
  title: 'Kingsmead Stadium',
  description:
    'Map of a sports stadium and its surroundings, with north at the top. The pitch is in the centre, surrounded by stands on all four sides. ' +
    'The main entrance, marked You are here, is in the middle of the south side, outside the South Stand. A road runs along the south of the site, and a car park lies in the south-west corner. ' +
    'A river runs along the east side of the site. A training ground is in the north-west corner. ' +
    'Letter A is outside the West Stand, halfway along. Letter B is at the north-west corner of the pitch, between the West and North Stands. Letter C is outside the North Stand, in the middle. ' +
    'Letter D is at the north-east corner, near the river. Letter E is outside the East Stand, beside the river. Letter F is at the south-east corner of the stadium. ' +
    'Letter G is next to the car park, on its east side. Letter H is in the training ground.',
  shapes: [
    { kind: 'field', x: 220, y: 140, w: 220, h: 180, label: 'Pitch' },
    { kind: 'building', x: 220, y: 90, w: 220, h: 40, label: 'North Stand' },
    { kind: 'building', x: 220, y: 330, w: 220, h: 40, label: 'South Stand' },
    { kind: 'building', x: 170, y: 140, w: 40, h: 180, label: 'W' },
    { kind: 'building', x: 450, y: 140, w: 40, h: 180, label: 'E' },
    { kind: 'green', x: 30, y: 30, w: 130, h: 130, label: 'Training' },
    { kind: 'parking', x: 30, y: 330, w: 120, h: 90, label: 'P' },
    { kind: 'river', d: 'M580 20 C 560 120, 600 260, 575 450' },
    { kind: 'road', d: 'M20 440 H 560' },
  ],
  points: { A: [130, 230], B: [190, 110], C: [330, 60], D: [500, 90], E: [530, 230], F: [480, 370], G: [175, 380], H: [95, 120] },
  here: [330, 405],
  hereLabel: 'MAIN ENTRANCE',
}

const agent = person('agent', 'Priya', 'Customer services', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const dave = person('dave', 'David', 'Caller', 'm', 'en-AU', 'AsGY6GCuJNcXklospqtq')
const guide = person('guide', 'Ollie', 'Stadium tour guide', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')
const tara = person('tara', 'Tara', 'Student', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const max = person('max', 'Max', 'Student', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')
const prof = person('prof', 'Dr Ibsen', 'Lecturer', 'm', 'en-GB', 'JBFqnCBsd6RMkjVDRZzb')

export default test('full-10', [
  part({
    n: 1,
    title: 'A damaged delivery',
    intro: 'You will hear a man phoning an online furniture company about an order.',
    speakers: [agent, dave],
    blocks: [
      {
        lines: `
          agent: Good afternoon, HomeNest customer services. My name's Priya. How can I help?
          dave: Hi. I'm calling about a delivery I received yesterday. There's a problem with it.
          agent: I'm sorry to hear that. Could I have your order number?
          dave: Yes, it's HN 40372. || Yes, it's H, N, four oh three seven two.
          agent: Thank you. And your name?
          dave: David Mbeki. That's M-B-E-K-I. || David Mbeki. That's M, B, E, K, I.
          agent: Thanks, Mr Mbeki. I can see the order. It's a dining table and four chairs, is that right?
          dave: That's right. The chairs are fine, but the table's damaged. There's a long scratch across the top, and one of the legs is cracked.
          agent: Oh dear. Was the box damaged when it arrived?
          dave: Not at all. The box looked perfect, which is why I signed for it. I only found the damage when I unpacked it.
          agent: I understand. Could you send us some photos of the damage? It helps us process the claim.
          dave: I've already taken some. What's the best way to send them?
          agent: If you reply to your order confirmation email, they'll come straight to our team.
          dave: OK, I'll do that this evening.
        `,
        groups: [
          form(
            'HomeNest — damage report',
            limit(1, true),
            [
              'Order number: HN [[40372]]',
              'Customer name: David [[Mbeki]]',
              'Damaged item: dining [[table]]',
              'Damage: a long scratch and a cracked [[leg]]',
              'Condition of box: perfect',
              'Photos: send by replying to the confirmation [[email]]',
            ],
            [
              ["it's HN 40372", 'The order number is read digit by digit.'],
              ['M-B-E-K-I', 'The surname is spelt out.'],
              ["the table's damaged", 'The chairs are fine.'],
              ['one of the legs is cracked', 'As well as a scratch across the top.'],
              ['If you reply to your order confirmation email', 'The photos go straight to the team.'],
            ],
          ),
        ],
      },
      {
        lines: `
          agent: Now, you have two options. We can send a replacement table, or you can have a full refund.
          dave: I'd like a replacement. We chose that table specially, and it matches the chairs.
          agent: Of course. The next available delivery date is Friday the 18th. Would that suit you? || Of course. The next available delivery date is Friday the eighteenth. Would that suit you?
          dave: I'm at work on Fridays. Is there anything on a Saturday?
          agent: Saturday the 26th, but there's an extra charge of fifteen pounds for weekend deliveries. || Saturday the twenty-sixth, but there's an extra charge of fifteen pounds for weekend deliveries.
          dave: Hmm. Could my neighbour accept it on the Friday instead?
          agent: Yes, as long as you give us their name and they can show some identification.
          dave: Then let's do the Friday. My neighbour's name is Mrs Clarke, at number 14. || Then let's do the Friday. My neighbour's name is Mrs Clarke, at number fourteen.
          agent: Lovely. And what would you like us to do with the damaged table?
          dave: Can you take it away?
          agent: Yes, the drivers will collect it when they deliver the new one. Please leave it near the front door, and it should be in its original packaging if possible.
          dave: I've still got the box, so that's fine.
          agent: Good. And as an apology, we'll give you a voucher for twenty pounds off your next order.
        `,
        groups: [
          notes(
            'Replacement arrangements',
            limit(2, true),
            [
              '- customer chooses a [[replacement]]',
              '- delivery: Friday [[18|18th]]',
              '- new table to be accepted by neighbour, Mrs [[Clarke]]',
              '- leave damaged table near the [[front door]], in original packaging',
              '- customer will receive a [[voucher]] worth £20',
            ],
            [
              ["I'd like a replacement", 'He does not want a refund.'],
              ["Then let's do the Friday", 'The Friday the 18th; Saturday costs extra.'],
              ["My neighbour's name is Mrs Clarke", 'She must show identification.'],
              ['Please leave it near the front door', 'The drivers will collect it.'],
              ["we'll give you a voucher for twenty pounds off your next order", 'The voucher is offered as an apology.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['The chairs are fine', 3, 'Only the table is damaged.'],
      ['or you can have a full refund', 6, 'He chooses a replacement.'],
      ['Saturday the 26th', 7, 'He chooses the Friday.'],
    ],
  }),

  part({
    n: 2,
    title: 'A stadium tour',
    intro: 'You will hear a guide talking to visitors at the start of a tour of a sports stadium.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Hi, everyone, and welcome to Kingsmead Stadium. My name's Ollie, and I'll be taking you round today.
          guide: The stadium was completely rebuilt eight years ago. The old ground had only one covered stand, and the main aim of the rebuilding was to give every spectator a roof over their heads. The capacity actually went down slightly, to thirty-two thousand.
          guide: Although we're best known for football, the stadium is used for much more. In the summer we host concerts, and every year in October there's a large food festival on the pitch, which is protected by special flooring.
          guide: The tour lasts about ninety minutes. The highlight for most people is the players' changing room, but please remember that photographs aren't allowed in there, out of respect for the players' privacy.
          guide: Finally, if you have any problems with steps, let me know now. There's a lift to every level, so nobody should miss anything.
        `,
        groups: [
          mcq([
            [
              'What was the main aim of rebuilding the stadium?',
              ['to increase the number of seats', 'to provide cover for all spectators', 'to improve access for disabled visitors'],
              'B',
              'to give every spectator a roof over their heads',
              'The capacity went down slightly.',
            ],
            [
              'What happens in the stadium every October?',
              ['a concert', 'a food festival', 'a charity match'],
              'B',
              "every year in October there's a large food festival on the pitch",
              'Concerts are held in the summer.',
            ],
            [
              'Why are photographs not allowed in the changing room?',
              ['to protect the players’ privacy', 'because the light is too poor', 'for security reasons'],
              'A',
              "out of respect for the players' privacy",
              'It is the highlight for most visitors.',
            ],
            [
              'Visitors who have difficulty with steps should',
              ['take a shorter tour.', 'tell the guide.', 'stay on the ground floor.'],
              'B',
              'let me know now',
              'There is a lift to every level.',
            ],
          ]),
        ],
      },
      {
        lines: `
          guide: Let's have a look at the map. We're standing at the main entrance, outside the South Stand.
          guide: The ticket office is on the outside of the West Stand, halfway along. That's also where you can collect tickets you've bought online.
          guide: The club museum is behind the North Stand, right in the middle. It has trophies going back more than a hundred years.
          guide: Now, the club shop. It used to be next to the car park, but it moved last year. It's now at the north-east corner of the stadium, near the river, so it's on your way if you're walking from the station.
          guide: The players' entrance is on the east side, outside the East Stand, beside the river. If you wait there after a match, you can often get autographs.
          guide: At the south-east corner of the stadium is the restaurant, which has big windows looking over the pitch.
          guide: And the medical centre for spectators is at the corner between the West and North Stands, the north-west corner of the pitch.
        `,
        groups: [
          map(STADIUM, [
            ['Ticket office', 'A', 'on the outside of the West Stand, halfway along', 'Halfway along the West Stand: A.'],
            ['Museum', 'C', 'behind the North Stand, right in the middle', 'In the middle of the North Stand: C.'],
            ['Club shop', 'D', "It's now at the north-east corner of the stadium, near the river", 'It moved from near the car park (G) to D.'],
            ["Players' entrance", 'E', 'outside the East Stand, beside the river', 'East side, beside the river: E.'],
            ['Restaurant', 'F', 'At the south-east corner of the stadium is the restaurant', 'South-east corner: F.'],
            ['Medical centre', 'B', 'the north-west corner of the pitch', 'Between the West and North Stands: B.'],
          ]),
        ],
      },
    ],
    traps: [
      ['The capacity actually went down slightly', 11, 'Seats were not increased.'],
      ['In the summer we host concerts', 12, 'Concerts are in summer.'],
      ['It used to be next to the car park', 17, 'The old location of the shop.'],
    ],
  }),

  part({
    n: 3,
    title: 'A work placement at a zoo',
    intro: 'You will hear two biology students, Tara and Max, talking about their work placements at a zoo.',
    speakers: [tara, max],
    blocks: [
      {
        lines: `
          tara: Hi, Max. How was your placement at the zoo? I've just finished mine.
          max: It was brilliant, thanks. Better than I expected, really. I thought I'd be cleaning cages all day, but I did a lot more than that.
          tara: Same here. Which section were you in?
          max: Mostly the reptile house, but I spent the last week with the education team.
          tara: Lucky you. I was with the birds the whole time. What was the most useful thing you learnt?
          max: Honestly, it was record-keeping. Every animal has a detailed file: what it eats, its weight, any changes in behaviour. I hadn't realised how much data zoos collect.
          tara: Yes, I noticed that too. For me, the most valuable part was seeing how the keepers dealt with visitors. They were brilliant at explaining things simply.
          max: Did you have any problems?
          tara: Only that it was hard to get time with the vets. They were always busy, so I didn't get to watch any operations.
          max: Me neither. And the early starts were hard. Six thirty every morning.
          tara: Do you think the zoo does enough for conservation?
          max: I was impressed. They're breeding several endangered species, and some animals have been returned to the wild. But I think they could tell visitors more about it. Most people don't know.
          tara: I agree. The signs are mostly about what animals eat, not about the conservation work.
        `,
        groups: [
          mcq([
            [
              'What did Max expect his placement to involve?',
              ['mainly cleaning', 'working with vets', 'giving talks to visitors'],
              'A',
              "I thought I'd be cleaning cages all day",
              'He did a lot more than that.',
            ],
            [
              'What did Max find most useful?',
              ['learning about record-keeping', 'working in the reptile house', 'helping the education team'],
              'A',
              'Honestly, it was record-keeping',
              'Every animal has a detailed file.',
            ],
            [
              'What problem did both students have?',
              ['They found the work tiring.', 'They had little contact with the vets.', 'They were not given enough responsibility.'],
              'B',
              "I didn't get to watch any operations",
              'Tara found the vets always busy; Max says “Me neither.”',
            ],
            [
              'What do the students think the zoo should do?',
              ['breed more endangered species', 'give visitors more information about conservation', 'improve the signs about animal diets'],
              'B',
              'they could tell visitors more about it',
              'The signs are mostly about what animals eat.',
            ],
          ]),
        ],
      },
      {
        lines: `
          max: We have to write a report about the placement for our course. Have you started?
          tara: I've made a plan. There are six sections, aren't there? I was going to ask your opinion on some of them.
          max: Go on.
          tara: The description of the organisation. I think that's easy. You can get most of it from the zoo's website.
          max: True. What about the daily routine section?
          tara: That's the one I'm finding hardest, because every day was so different. It's difficult to describe a typical day.
          max: Mm. I'd just pick one day and describe it in detail. And the section on skills developed?
          tara: That one's important. Our tutor said it carries the most marks.
          max: Then we should spend most time on that. What about the ethical issues section?
          tara: I think that's the most interesting. There's a lot of debate about whether zoos should exist at all.
          max: And the recommendations?
          tara: I'm going to leave that until last, because I want to talk to my supervisor at the zoo first.
          max: And finally the reflection section. I've already done mine. It was quite quick, actually.
        `,
        groups: [
          matching(
            'What does Tara say about each section of the report? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
            'Comments',
            [
              'It will be written last.',
              'It is worth the most marks.',
              'The information is easy to find.',
              'It is the most difficult to write.',
              'It is the most interesting.',
              'It was quick to complete.',
              'It needs a lot of statistics.',
              'It must include photographs.',
            ],
            [
              ['description of the organisation', 'C', "You can get most of it from the zoo's website", 'Tara thinks it is easy.'],
              ['daily routine', 'D', "That's the one I'm finding hardest", 'Every day was different.'],
              ['skills developed', 'B', 'it carries the most marks', 'The tutor said so.'],
              ['ethical issues', 'E', "I think that's the most interesting", 'There is a lot of debate about zoos.'],
              ['recommendations', 'A', "I'm going to leave that until last", 'She wants to talk to her supervisor first.'],
              ['reflection', 'F', 'It was quite quick, actually', 'Max has already written his.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['I spent the last week with the education team', 22, 'Not the most useful thing.'],
      ['the early starts were hard', 23, 'Only Max mentions this.'],
      ['The signs are mostly about what animals eat', 24, 'They do not want more signs about diet.'],
    ],
  }),

  part({
    n: 4,
    title: 'Urban heat islands',
    intro: 'You will hear a lecture about why cities are warmer than the countryside.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Good morning. Today's topic is the urban heat island, the fact that cities are often several degrees warmer than the surrounding countryside.
          prof: The effect is strongest at night. On a calm, clear night, the centre of a large city can be up to ten degrees warmer than nearby fields.
          prof: Let me explain how this happens, step by step. During the day, sunlight falls on roads, roofs and walls. Materials like asphalt and concrete absorb much more heat than grass or soil.
          prof: Because cities have few plants, there's little evaporation, which is the process that normally cools the ground, just as sweating cools our skin.
          prof: In the evening, the stored heat is slowly released into the air. But tall buildings trap it between them, especially in narrow streets, so the heat can't escape to the sky.
          prof: On top of that, heat is added by human activity: traffic, factories, and air conditioners, which cool the inside of buildings by pumping hot air outside.
          prof: The result is that the city stays warm all night, and the next day starts from a higher temperature.
        `,
        groups: [
          flow(
            'How an urban heat island forms',
            limit(1),
            [
              'Asphalt and [[concrete]] absorb heat during the day',
              'Few plants means little [[evaporation]] to cool the ground',
              'In the evening, tall buildings [[trap]] the released heat',
              'Traffic, factories and air conditioners add more heat',
              'The city stays warm through the [[night]]',
            ],
            [
              ['Materials like asphalt and concrete absorb much more heat', 'More than grass or soil.'],
              ["there's little evaporation", 'Evaporation normally cools the ground.'],
              ['tall buildings trap it between them', 'Especially in narrow streets.'],
              ['the city stays warm all night', 'And the next day starts warmer.'],
            ],
          ),
        ],
      },
      {
        lines: `
          prof: Why does this matter? The most serious effect is on health. During heatwaves, death rates rise sharply in cities, particularly among elderly people, partly because high night temperatures prevent the body from recovering.
          prof: There are also economic costs. Hotter cities use more electricity for cooling, which puts pressure on power supplies.
          prof: So what can be done? One of the simplest measures is to paint roofs white or a light colour, so they reflect sunlight rather than absorbing it. In some cities, this has reduced roof temperatures by more than twenty degrees.
          prof: Trees are another effective solution. They provide shade and cool the air through evaporation from their leaves. Some cities now set targets for the percentage of the city covered by trees.
          prof: Green roofs, covered with plants, also help, although they're expensive and the building must be strong enough to carry the extra weight.
          prof: Finally, planners are beginning to think about the shape of cities. Wider streets that follow the direction of the wind can help carry heat away.
        `,
        groups: [
          notes(
            'Effects and solutions',
            limit(1),
            [
              '- high night temperatures stop the body from [[recovering]]',
              '- more electricity is used for [[cooling]]',
              '- light-coloured roofs [[reflect]] sunlight',
              '- trees provide [[shade]] and cool the air',
              '- green roofs: expensive; building must carry extra [[weight]]',
              '- wider streets that follow the [[wind]] carry heat away',
            ],
            [
              ['prevent the body from recovering', 'Elderly people are especially at risk.'],
              ['Hotter cities use more electricity for cooling', 'This puts pressure on power supplies.'],
              ['so they reflect sunlight rather than absorbing it', 'Roofs painted white or a light colour.'],
              ['They provide shade and cool the air', 'Through evaporation from their leaves.'],
              ['strong enough to carry the extra weight', 'Green roofs are also expensive.'],
              ['follow the direction of the wind', 'Wider streets help carry heat away.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['up to ten degrees warmer', 31, 'Not part of the flow-chart.'],
      ['more than twenty degrees', 37, 'The size of the effect, not the method.'],
    ],
  }),
])
