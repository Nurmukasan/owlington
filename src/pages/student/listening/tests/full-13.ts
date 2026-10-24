import { choose2, form, limit, matching, mcq, notes, part, person, sentences, table, test } from '../build'

const warden = person('warden', 'Steve', 'Hostel manager', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const teacher = person('teacher', 'Mrs Patel', 'Teacher', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const ranger = person('ranger', 'Lucy', 'Wetland centre manager', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const tutor = person('tutor', 'Dr Grey', 'Tutor', 'm', 'en-GB', 'JBFqnCBsd6RMkjVDRZzb')
const amira = person('amira', 'Amira', 'Student', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const jon = person('jon', 'Jon', 'Student', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')
const prof = person('prof', 'Dr Rowe', 'Lecturer', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')

export default test('full-13', [
  part({
    n: 1,
    title: 'A school trip',
    intro: 'You will hear a teacher phoning a youth hostel to book accommodation for a school trip.',
    speakers: [warden, teacher],
    blocks: [
      {
        lines: `
          warden: Hello, Glenmore Youth Hostel. Steve speaking.
          teacher: Good morning. My name's Mrs Patel, and I'm a teacher at Hillside School. I'd like to book the hostel for a geography field trip.
          warden: Lovely. When were you thinking of coming?
          teacher: For three nights, from Monday the 12th of May. || For three nights, from Monday the twelfth of May.
          warden: Let me check. Yes, we can do that. How many students?
          teacher: Thirty-two, and four teachers.
          warden: And how old are the students?
          teacher: They're all fifteen.
          warden: OK. For a group that size, we'd put the students in dormitories of eight, with two dormitories for boys and two for girls. The teachers get private rooms next to them.
          teacher: Perfect. Is there somewhere the students can work in the evenings? They'll need to write up their notes.
          warden: Yes, there's a classroom with tables and a projector. It's free for school groups.
          teacher: Excellent. Could you give me the address for the coach driver?
          warden: Sure. It's Glenmore Youth Hostel, Lochside Road, and the postcode is PH22 1QU. || Sure. It's Glenmore Youth Hostel, Lochside Road, and the postcode is P, H, two two, one, Q, U.
        `,
        groups: [
          form(
            'Glenmore Youth Hostel — group booking',
            limit(2, true),
            [
              'School: [[Hillside]] School',
              'Arrival: Monday [[12|12th]] May (3 nights)',
              'Number of students: [[32|thirty-two]]',
              'Rooms: students in [[dormitories]] of 8',
              'Address: Lochside Road, postcode [[PH22 1QU|PH221QU]]',
            ],
            [
              ["I'm a teacher at Hillside School", 'The school name.'],
              ['from Monday the 12th of May', 'For three nights.'],
              ['Thirty-two, and four teachers', 'The number of students, not the total.'],
              ['we\'d put the students in dormitories of eight', 'Teachers get private rooms.'],
              ['the postcode is PH22 1QU', 'Letters and numbers read separately.'],
            ],
          ),
        ],
      },
      {
        lines: `
          teacher: Now, could you tell me about meals?
          warden: Of course. Breakfast is included in the price. We can also provide packed lunches for the days out, and an evening meal.
          teacher: What do those cost?
          warden: Packed lunches are five pounds fifty each, and evening meals are eight pounds fifty.
          teacher: We'll have both, please, for all three days.
          warden: Fine. And there are some activities we can arrange for groups. There's a guided walk on the first evening, which is free.
          teacher: That sounds good.
          warden: We also have canoeing on the loch. It's normally twenty pounds per person, but for schools it's fifteen.
          teacher: I'll ask the students. What about the mountain bike hire?
          warden: That's ten pounds a day, but the students must bring their own helmets.
          teacher: I don't think we'll have time for that. But we'd definitely like the night-time star-gazing session.
          warden: Oh, that's very popular. It's run by a local astronomer, and it costs three pounds a head. It's held on the hill behind the hostel, so bring warm clothes.
        `,
        groups: [
          table(
            'Meals and activities',
            limit(2, true),
            ['Item', 'Cost per person', 'Notes'],
            [
              ['packed lunch', '£[[5.50]]', 'for days out'],
              ['evening meal', '£8.50', '—'],
              ['guided walk', 'free', 'on the [[first evening]]'],
              ['canoeing', '£[[15|fifteen]] for schools', 'on the loch'],
              ['star-gazing', '£3', 'run by a local [[astronomer]]; on the [[hill]] behind the hostel'],
            ],
            [
              ['Packed lunches are five pounds fifty each', 'Evening meals are £8.50.'],
              ["There's a guided walk on the first evening", 'The walk is free.'],
              ["but for schools it's fifteen", 'The normal price is £20.'],
              ["It's run by a local astronomer", 'The session costs £3 a head.'],
              ["It's held on the hill behind the hostel", 'Students should bring warm clothes.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Thirty-two, and four teachers', 3, 'Write only the number of students.'],
      ["It's normally twenty pounds per person", 8, 'The price for schools is lower.'],
      ["That's ten pounds a day", 8, 'Bike hire, which they will not take.'],
    ],
  }),

  part({
    n: 2,
    title: 'Marshfield Wetland Centre',
    intro: 'You will hear the manager of a wetland centre talking to a group of visitors.',
    speakers: [ranger],
    blocks: [
      {
        lines: `
          ranger: Hi, everyone, and welcome to Marshfield Wetland Centre. I'm Lucy, the centre manager.
          ranger: Twenty years ago, this whole area was a gravel quarry. When the quarry closed, the pits filled with water, and a wildlife charity bought the land. Now it's one of the most important wetlands in the region.
          ranger: Wetlands are often thought of as wasteland, but they're incredibly valuable. Apart from wildlife, they help prevent flooding, because they soak up water like a sponge during heavy rain and release it slowly.
          ranger: Our visitor numbers have grown a lot recently, and the main reason, we think, is our webcams. People can watch the birds nesting online, and then they want to come and see them in person.
          ranger: The best time to visit depends on what you want to see. In winter, thousands of ducks and geese arrive from the Arctic. But if you want to hear birdsong, come in spring, early in the morning.
          ranger: And just so you know, dogs aren't allowed on the reserve, except assistance dogs, because they disturb ground-nesting birds.
        `,
        groups: [
          mcq([
            [
              'What was the site used for before?',
              ['farming', 'a quarry', 'a rubbish tip'],
              'B',
              'this whole area was a gravel quarry',
              'The pits filled with water when it closed.',
            ],
            [
              'How do wetlands help to prevent flooding?',
              ['They hold water and release it slowly.', 'They direct water into rivers.', 'They protect the coast from waves.'],
              'A',
              'they soak up water like a sponge during heavy rain and release it slowly',
              'Wetlands are often wrongly thought of as wasteland.',
            ],
            [
              'Why have visitor numbers grown recently?',
              ['because of new paths', 'because of the webcams', 'because of school visits'],
              'B',
              'the main reason, we think, is our webcams',
              'People watch nesting birds online and then visit.',
            ],
            [
              'When is the best time to hear birdsong?',
              ['winter evenings', 'spring mornings', 'summer afternoons'],
              'B',
              'come in spring, early in the morning',
              'Winter is for ducks and geese.',
            ],
            [
              'Why are dogs not allowed?',
              ['They frighten visitors.', 'They disturb birds that nest on the ground.', 'They damage the paths.'],
              'B',
              'they disturb ground-nesting birds',
              'Assistance dogs are the exception.',
            ],
          ]),
        ],
      },
      {
        lines: `
          ranger: Now, we have five hides around the lakes, where you can watch birds without being seen. Let me tell you a little about each one.
          ranger: Heron Hide is the closest to the visitor centre. It has a ramp and wide doors, so it's the one we recommend for wheelchair users.
          ranger: Kingfisher Hide is beside the stream. It's very small, only room for four people, but if you're patient you may see a kingfisher diving for fish.
          ranger: Reed Hide is the oldest. It's due to be replaced next year, but it's still the best place to see otters, usually around dusk.
          ranger: Lake View Hide is on two floors, and the top floor has telescopes you can use free of charge.
          ranger: And finally, Woodland Hide, which isn't by the water at all. It looks out over feeders in the trees, so it's the best place to see small birds like finches and woodpeckers. Children love it.
        `,
        groups: [
          matching(
            'What does Lucy say about each hide? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
            'Features',
            [
              'has equipment visitors can borrow',
              'is suitable for wheelchairs',
              'has limited space',
              'is popular with children',
              'is going to be rebuilt',
              'is closed in winter',
              'can be booked by groups',
            ],
            [
              ['Heron Hide', 'B', "it's the one we recommend for wheelchair users", 'It has a ramp and wide doors.'],
              ['Kingfisher Hide', 'C', 'only room for four people', 'It is very small.'],
              ['Reed Hide', 'E', "It's due to be replaced next year", 'It is the best place to see otters.'],
              ['Lake View Hide', 'A', 'the top floor has telescopes you can use free of charge', 'Telescopes are free to use.'],
              ['Woodland Hide', 'D', 'Children love it', 'Small birds visit the feeders.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Wetlands are often thought of as wasteland', 12, 'A misconception.'],
      ['In winter, thousands of ducks and geese arrive', 14, 'Not the best time for birdsong.'],
      ['Heron Hide is the closest to the visitor centre', 16, 'Its feature is wheelchair access.'],
    ],
  }),

  part({
    n: 3,
    title: 'Natural dyes',
    intro: 'You will hear two fashion students, Amira and Jon, discussing their project on natural dyes with their tutor.',
    speakers: [tutor, amira, jon],
    blocks: [
      {
        lines: `
          tutor: So, how's the project on natural dyes going?
          amira: Really well. We've been experimenting with dyes made from plants and food waste.
          jon: Our best result so far is from onion skins. They give a lovely golden yellow, and they cost nothing.
          tutor: What about avocado? I've heard that gives a pink colour.
          amira: It does, from the stones, but it took us ages to get a strong colour. The onion skins were much quicker.
          tutor: And how well do the colours last?
          jon: That's the main problem. Some of them fade quickly in sunlight. We tested samples on a windowsill for two weeks, and the blueberry dye almost disappeared.
          tutor: Have you tried using a mordant? That's a substance that fixes the dye to the fibre.
          amira: Yes, we used alum, which is a kind of salt. It made a big difference to the yellow, but not much to the blueberry.
          tutor: Interesting. Which fabrics have you been dyeing?
          jon: Mainly wool and cotton. Wool takes the colour much better. Cotton needs a lot more preparation.
          tutor: That's typical. Animal fibres like wool and silk absorb natural dyes more easily than plant fibres.
        `,
        groups: [
          mcq([
            [
              'Why does Jon prefer onion skins?',
              ['They produce a pink colour.', 'They are free and give good results.', 'They do not fade.'],
              'B',
              'They give a lovely golden yellow, and they cost nothing',
              'Avocado stones produce pink.',
            ],
            [
              'What problem did the students have with avocado stones?',
              ['The colour was weak.', 'It took a long time to get a strong colour.', 'The colour changed when washed.'],
              'B',
              'it took us ages to get a strong colour',
              'Onion skins were much quicker.',
            ],
            [
              'What happened to the blueberry dye in the light test?',
              ['It darkened.', 'It nearly disappeared.', 'It turned yellow.'],
              'B',
              'the blueberry dye almost disappeared',
              'They tested it on a windowsill for two weeks.',
            ],
            [
              'What effect did the mordant have?',
              ['It improved all the colours.', 'It improved the yellow dye.', 'It had no effect.'],
              'B',
              'It made a big difference to the yellow, but not much to the blueberry',
              'The mordant was alum.',
            ],
            [
              'According to the tutor, which fabrics absorb natural dyes most easily?',
              ['animal fibres', 'plant fibres', 'synthetic fibres'],
              'A',
              'Animal fibres like wool and silk absorb natural dyes more easily',
              'Cotton, a plant fibre, needs more preparation.',
            ],
          ]),
        ],
      },
      {
        lines: `
          tutor: What are you planning for the final presentation?
          amira: We want to show a small collection of scarves, all dyed with food waste, to show what's possible.
          jon: And we'll bring the samples from the light test, so people can see the fading for themselves.
          tutor: Good. What about the wider context? The fashion industry's a huge polluter.
          amira: Yes, we're going to talk about water pollution from synthetic dyes. In some countries, rivers near factories change colour.
          jon: But we don't want to suggest natural dyes are the whole answer. They need a lot of land to grow the plants, and they're hard to produce on a large scale.
          tutor: That's a balanced view. I'd also mention cost. Natural dyes are generally more expensive for manufacturers.
          amira: We'll add that.
          tutor: Any problems working together?
          jon: Not really. We meet twice a week. The only issue was booking the dye lab, because it's always full.
          amira: Yes, we've been coming in at weekends to use it.
          tutor: I'll see if I can reserve some time for you.
        `,
        groups: [
          choose2(
            'Which TWO things will the students show in their presentation?',
            ['a collection of scarves', 'photographs of polluted rivers', 'samples from the light test', 'a film of the dyeing process', 'a chart of costs'],
            ['A', 'C'],
            [
              ['We want to show a small collection of scarves', 'All dyed with food waste.'],
              ["we'll bring the samples from the light test", 'So people can see the fading.'],
            ],
          ),
          choose2(
            'Which TWO disadvantages of natural dyes do the students mention?',
            ['They need a lot of land.', 'They are harmful to workers.', 'They are difficult to produce in large quantities.', 'They cause water pollution.', 'They only work on silk.'],
            ['A', 'C'],
            [
              ['They need a lot of land to grow the plants', 'Jon does not want to suggest they are the whole answer.'],
              ["they're hard to produce on a large scale", 'Mass production is difficult.'],
            ],
          ),
          mcq([
            [
              'What problem have the students had working together?',
              ['arranging meetings', 'getting access to the lab', 'sharing the work fairly'],
              'B',
              "The only issue was booking the dye lab, because it's always full",
              'They have been using it at weekends.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ["I've heard that gives a pink colour", 21, 'Avocado, not onion.'],
      ['Natural dyes are generally more expensive for manufacturers', 28, 'The tutor’s point, not the students’.'],
      ['We meet twice a week', 30, 'Meetings are not the problem.'],
    ],
  }),

  part({
    n: 4,
    title: 'Animal navigation',
    intro: 'You will hear a lecture about how animals find their way during migration.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Every year, billions of animals make long journeys between breeding and feeding grounds. Today, I want to look at a question that has fascinated scientists for centuries: how do they find their way?
          prof: Let's start with birds. Many birds use the sun as a compass. But the sun moves across the sky during the day, so birds must also have an internal clock to make allowances for the time.
          prof: Birds that migrate at night use the stars. In a famous experiment, young birds were raised in a planetarium, where the artificial sky could be rotated. The birds learnt to treat the centre of rotation as north, which showed that they're not born knowing the stars; they learn them.
          prof: But what about cloudy nights? Here, the Earth's magnetic field seems to be crucial. Birds can detect the direction of the field and possibly its strength, which changes from the equator to the poles. This could give them a kind of map.
          prof: How birds sense magnetism is still debated. One theory is that a chemical reaction in the eye allows birds to actually see the magnetic field, perhaps as a pattern of light and dark.
          prof: Sea turtles provide some of the most remarkable evidence. Female turtles return to lay their eggs on the same beach where they hatched, sometimes decades later. Researchers believe the young turtles remember the magnetic signature of their home beach.
          prof: Salmon, too, use magnetism to find their way back to the coast. But once they reach the river, they switch to a different sense: smell. Each river has a unique chemical signature, which the fish remember from when they were young.
          prof: Finally, some insects migrate too. Monarch butterflies travel up to four thousand kilometres from North America to forests in Mexico. Remarkably, no individual makes the whole round trip. The journey north takes several generations, so the butterflies that arrive in Mexico have never been there before.
          prof: Human activity is making navigation more difficult. Artificial light confuses birds that migrate at night, and many thousands die each year by flying into lit buildings. Some cities now ask office buildings to switch off their lights during migration seasons.
        `,
        groups: [
          notes(
            'How animals navigate',
            limit(1),
            [
              '# Birds',
              '- birds using the sun also need an internal [[clock]]',
              '- planetarium experiment: birds [[learn]] the stars',
              '- the strength of the magnetic field could provide a kind of [[map]]',
              '- birds may be able to see the magnetic field because of a reaction in the [[eye]]',
              '# Other animals',
              '- young turtles remember the magnetic signature of their [[beach]]',
              '- salmon use [[smell]] to find their river',
              '- each river has a unique chemical signature',
            ],
            [
              ['must also have an internal clock', 'The sun moves across the sky.'],
              ["they're not born knowing the stars; they learn them", 'They treated the centre of rotation as north.'],
              ['This could give them a kind of map', 'Field strength changes from equator to poles.'],
              ['a chemical reaction in the eye', 'They might see the field as light and dark.'],
              ['the magnetic signature of their home beach', 'Females return to where they hatched.'],
              ['they switch to a different sense: smell', 'Once salmon reach the river.'],
            ],
          ),
          sentences(
            limit(2, true),
            [
              'Monarch butterflies fly up to [[4,000|4000|four thousand]] kilometres to Mexico.',
              'The journey north takes several [[generations]].',
              'Many birds die after flying into [[lit buildings|buildings]].',
              'Some cities ask offices to switch off their [[lights]] during migration.',
            ],
            [
              ['travel up to four thousand kilometres from North America', 'To forests in Mexico.'],
              ['The journey north takes several generations', 'No individual makes the round trip.'],
              ['flying into lit buildings', 'Artificial light confuses night migrants.'],
              ['switch off their lights during migration seasons', 'Some cities ask office buildings to do this.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Many birds use the sun as a compass', 31, 'The sun alone is not enough.'],
      ['Salmon, too, use magnetism to find their way back to the coast', 36, 'At sea, not in the river.'],
    ],
  }),
])
