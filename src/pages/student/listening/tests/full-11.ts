import { choose2, flow, form, limit, mcq, notes, part, person, table, test } from '../build'

const school = person('school', 'Hannah', 'Cookery school receptionist', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const leo = person('leo', 'Leo', 'Caller', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const host = person('host', 'Gavin', 'Radio presenter', 'm', 'en-AU', 'bnkqMLCB8HHkYK9Gd6Xj')
const tutor = person('tutor', 'Dr Moore', 'Tutor', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const ian = person('ian', 'Ian', 'Student', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')
const sofia = person('sofia', 'Sofia', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const prof = person('prof', 'Professor Adams', 'Lecturer', 'm', 'en-GB', '1P9lzrAhggxzcHA9jcDZ')

export default test('full-11', [
  part({
    n: 1,
    title: 'Cookery courses',
    intro: 'You will hear a man phoning a cookery school to ask about courses.',
    speakers: [school, leo],
    blocks: [
      {
        lines: `
          school: Good morning, the Oakwood Cookery School. How can I help?
          leo: Hello. I'd like some information about your evening courses. I'm a complete beginner.
          school: Then you're in the right place. We have four evening courses starting next month. The first is Kitchen Basics, which covers things like knife skills and making simple sauces. That's on Mondays.
          leo: How long does it run for?
          school: Six weeks, and it costs a hundred and twenty pounds, including all the ingredients.
          leo: OK. What else is there?
          school: On Tuesdays there's Italian Cooking. You'll learn to make fresh pasta by hand, and it's eight weeks long. That's a hundred and sixty pounds.
          leo: That sounds good, but I'm not sure I can manage eight weeks. What's on Wednesday?
          school: Wednesday is Vegetarian Kitchen. It's very popular, especially the dishes using beans and lentils. It's six weeks and costs a hundred and ten.
          leo: And Thursday?
          school: Thursday is Baking Bread. That one's only four weeks, ninety pounds, and you take home everything you make. But you should know that it starts later than the others, at half past seven instead of half six, because the dough needs time to rise.
          leo: I think Kitchen Basics would be the most sensible for me.
        `,
        groups: [
          table(
            'Oakwood Cookery School — evening courses',
            limit(2, true),
            ['Course', 'Day', 'Length', 'Price', 'Notes'],
            [
              ['Kitchen Basics', 'Monday', '6 weeks', '£[[120]]', 'knife skills and simple [[sauces]]'],
              ['Italian Cooking', 'Tuesday', '[[8|eight]] weeks', '£160', 'making fresh [[pasta]] by hand'],
              ['Vegetarian Kitchen', 'Wednesday', '6 weeks', '£110', 'dishes using beans and [[lentils]]'],
              ['Baking Bread', 'Thursday', '4 weeks', '£90', 'starts at [[7.30|7:30]] pm'],
            ],
            [
              ['a hundred and twenty pounds, including all the ingredients', 'The price for Kitchen Basics.'],
              ['making simple sauces', 'Kitchen Basics also covers knife skills.'],
              ["it's eight weeks long", 'Italian Cooking is eight weeks.'],
              ['make fresh pasta by hand', 'The Italian course.'],
              ['the dishes using beans and lentils', 'Vegetarian Kitchen.'],
              ['at half past seven instead of half six', 'The dough needs time to rise.'],
            ],
          ),
        ],
      },
      {
        lines: `
          school: Shall I book you a place on Kitchen Basics?
          leo: Yes, please.
          school: Can I have your full name?
          leo: Leo Achterberg. A-C-H-T-E-R-B-E-R-G. || Leo Achterberg. A, C, H, T, E, R, B, E, R, G.
          school: Thank you. And do you have any food allergies we should know about?
          leo: Not allergies, but I don't eat pork.
          school: That's no problem. And how would you like to pay?
          leo: Can I pay in instalments?
          school: For courses over a hundred pounds, yes. You pay half now and the rest in the third week.
          leo: Great. Oh, and do I need to bring anything?
          school: Just an apron. We provide all the equipment. And a container, so you can take your food home.
        `,
        groups: [
          form(
            'Booking',
            limit(1),
            [
              'Name: Leo [[Achterberg]]',
              'Dietary information: does not eat [[pork]]',
              'Payment: half now, rest in the [[third|3rd]] week',
              'Bring: an apron and a [[container]]',
            ],
            [
              ['A-C-H-T-E-R-B-E-R-G', 'The surname is spelt out.'],
              ["I don't eat pork", 'He has no allergies.'],
              ['the rest in the third week', 'Instalments are possible for courses over £100.'],
              ['And a container, so you can take your food home', 'All equipment is provided.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["I'm not sure I can manage eight weeks", 3, 'He chooses Kitchen Basics.'],
      ['instead of half six', 6, 'The other courses start at 6.30.'],
      ['Not allergies', 8, 'He has a dietary preference, not an allergy.'],
    ],
  }),

  part({
    n: 2,
    title: 'The new tram line',
    intro: 'You will hear a local radio report about a new tram line in a city.',
    speakers: [host],
    blocks: [
      {
        lines: `
          host: Good morning. On today's programme, we're looking at the new tram line, which opens to passengers next Monday after nearly four years of construction.
          host: The line runs for fourteen kilometres, from the airport in the north to the university campus in the south, passing through the city centre. There are twenty-two stops in total.
          host: The project was originally expected to cost three hundred million pounds, but the final figure was nearer three hundred and eighty. The council says most of the extra cost came from moving underground water pipes and cables, which were in different places from the ones shown on old maps.
          host: Trams will run every six minutes during the day, and every fifteen minutes in the evening. The first tram leaves at five thirty in the morning, which means people can get to early flights.
          host: Tickets can only be bought from machines at the stops or through the city's transport app. You can't pay the driver. And there's good news for regular users: a monthly pass costs the same as the current bus pass, and it can be used on both buses and trams.
        `,
        groups: [
          mcq([
            [
              'What caused most of the extra cost of the project?',
              ['delays in construction', 'unexpected pipes and cables', 'rising prices of materials'],
              'B',
              'most of the extra cost came from moving underground water pipes and cables',
              'They were not where the old maps showed them.',
            ],
            [
              'How often will trams run in the evening?',
              ['every six minutes', 'every ten minutes', 'every fifteen minutes'],
              'C',
              'every fifteen minutes in the evening',
              'Every six minutes is the daytime service.',
            ],
            [
              'Why does the first tram leave at 5.30 am?',
              ['so that workers can reach the hospital', 'so that passengers can catch early flights', 'so that students can get to lectures'],
              'B',
              'which means people can get to early flights',
              'The line runs from the airport in the north.',
            ],
            [
              'What does the speaker say about the monthly pass?',
              ['It is cheaper than the bus pass.', 'It can be used on buses as well.', 'It is only available through the app.'],
              'B',
              'it can be used on both buses and trams',
              'It costs the same as the current bus pass.',
            ],
          ]),
        ],
      },
      {
        lines: `
          host: So what difference will the tram make? I spoke to people along the route. Shop owners in the city centre are hopeful. During construction, several streets were closed for months, and many businesses lost customers. Now they expect more people to come into the centre.
          host: Students are also pleased, because the university campus has always been badly served by buses, and the tram will cut the journey time from the station by half.
          host: Not everyone is happy, though. Some residents in the northern suburbs say the trams are noisy, especially on the sharp bend near the hospital. The council has promised to install special equipment to reduce the noise there.
          host: There have also been complaints that the route doesn't serve the large housing estates in the east of the city. The council's response is that a second line, to the east, is already being planned, and work could start within five years.
          host: As for the environment, the trams run on electricity, and the council hopes that around six thousand car journeys a day will be replaced. It also plans to plant over two thousand trees along the route.
          host: For the opening weekend, all journeys on the tram will be free, and there'll be music and children's activities at the main city centre stop.
        `,
        groups: [
          choose2(
            'Which TWO groups are said to be positive about the tram?',
            ['shop owners', 'hospital staff', 'students', 'residents in the north', 'taxi drivers'],
            ['A', 'C'],
            [
              ['Shop owners in the city centre are hopeful', 'They expect more people to come into the centre.'],
              ['Students are also pleased', 'The journey from the station will take half as long.'],
            ],
          ),
          choose2(
            'Which TWO complaints about the tram does the speaker mention?',
            ['high ticket prices', 'noise on one part of the route', 'the loss of parking spaces', 'no service to the eastern estates', 'too few stops in the centre'],
            ['B', 'D'],
            [
              ['the trams are noisy, especially on the sharp bend near the hospital', 'The council will install equipment to reduce noise.'],
              ["the route doesn't serve the large housing estates in the east", 'A second line is being planned.'],
            ],
          ),
          choose2(
            'Which TWO things will happen on the opening weekend?',
            ['Travel will be free.', 'The mayor will give a speech.', 'Trees will be planted.', 'There will be activities for children.', 'Tours of the depot will be offered.'],
            ['A', 'D'],
            [
              ['all journeys on the tram will be free', 'For the whole opening weekend.'],
              ["there'll be music and children's activities", 'At the main city centre stop.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['originally expected to cost three hundred million pounds', 11, 'The original estimate, not the cause.'],
      ['Trams will run every six minutes during the day', 12, 'The daytime frequency.'],
      ['It also plans to plant over two thousand trees', 19, 'Along the route, not at the opening.'],
    ],
  }),

  part({
    n: 3,
    title: 'A survey of reading habits',
    intro: 'You will hear two students, Ian and Sofia, talking to their tutor about a survey on reading habits.',
    speakers: [tutor, ian, sofia],
    blocks: [
      {
        lines: `
          tutor: So, you two are planning a survey on how young adults read. Talk me through your plan.
          sofia: Well, first we want to do some background reading, to see what other surveys have found.
          tutor: Good. And then?
          ian: Then we'll write a draft questionnaire. We thought about twenty questions.
          tutor: That might be too many. People lose interest after about ten minutes.
          ian: OK, we'll keep it shorter.
          sofia: After that, we'll test it on a small group, maybe five friends, to see if any questions are confusing.
          tutor: That's an important step. Then?
          ian: We'll put the final version online and send the link to all the first-year students.
          sofia: And then we'll analyse the results using a spreadsheet, and present them as charts.
          tutor: That all sounds very logical.
        `,
        groups: [
          flow(
            'Survey plan',
            limit(1),
            [
              'Do background [[reading]] on earlier surveys',
              'Write a [[draft]] questionnaire',
              'Test it on a small group of [[friends]]',
              'Put it online and send the link to first-year students',
              'Analyse the results with a [[spreadsheet]]',
              'Present the results as [[charts]]',
            ],
            [
              ['first we want to do some background reading', 'To see what other surveys found.'],
              ["we'll write a draft questionnaire", 'The tutor suggests keeping it short.'],
              ['maybe five friends', 'To check that no questions are confusing.'],
              ['analyse the results using a spreadsheet', 'The analysis comes after the survey goes online.'],
              ['present them as charts', 'The final step of the plan.'],
            ],
          ),
        ],
      },
      {
        lines: `
          tutor: Now, what do you expect to find?
          ian: I think people will say they read less than they used to, because of social media.
          sofia: I'm not so sure. I think they read a lot, but mostly on screens, short articles and posts, rather than books.
          tutor: That's an important distinction. How will you find out what counts as reading?
          sofia: We'll ask separately about books, news and social media.
          tutor: Good. One problem with surveys like this is that people tend to say they read more than they actually do, because reading is seen as a good thing.
          ian: How can we avoid that?
          tutor: You could ask about specific recent behaviour. For example, "What did you read yesterday?" rather than "How often do you read?"
          sofia: That's much better.
          tutor: What about the audio books? Will you include them?
          ian: We disagreed about that. I think listening isn't really reading.
          sofia: But for many people it's the main way they enjoy books now. I think we should include it.
          tutor: Then include it as a separate question, and you can discuss it in your report.
          ian: OK, that seems fair.
          tutor: And when's the deadline?
          sofia: The end of March. We'll aim to have the results by the middle of February.
        `,
        groups: [
          mcq([
            [
              'What does Sofia expect the survey to show?',
              ['People read less than in the past.', 'People mainly read on screens.', 'People prefer books to articles.'],
              'B',
              'mostly on screens, short articles and posts, rather than books',
              'Ian thinks people read less because of social media.',
            ],
            [
              'What problem with reading surveys does the tutor mention?',
              ['People exaggerate how much they read.', 'Few people reply.', 'Questions are often unclear.'],
              'A',
              'people tend to say they read more than they actually do',
              'Reading is seen as a good thing.',
            ],
            [
              'The tutor suggests asking about',
              ['reading habits in childhood.', 'what people read on a particular day.', 'people’s favourite books.'],
              'B',
              'What did you read yesterday?',
              'Specific recent behaviour gives more honest answers.',
            ],
            [
              'What do the students decide about audio books?',
              ['to leave them out', 'to include them in a separate question', 'to count them as reading'],
              'B',
              'Then include it as a separate question',
              'Ian and Sofia disagreed, and Ian accepts this as fair.',
            ],
            [
              'When do the students hope to have their results?',
              ['by early February', 'by mid-February', 'by the end of March'],
              'B',
              "We'll aim to have the results by the middle of February",
              'The deadline is the end of March.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['We thought about twenty questions', 22, 'The tutor says it is too many.'],
      ['I think people will say they read less than they used to', 26, 'Ian’s view, not Sofia’s.'],
      ["I think listening isn't really reading", 29, 'Ian’s opinion; they include audio books separately.'],
      ['The end of March', 30, 'The deadline.'],
    ],
  }),

  part({
    n: 4,
    title: 'Roman concrete',
    intro: 'You will hear a lecture about the concrete used by the ancient Romans.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today I want to look at a material that's attracting a lot of attention from engineers: Roman concrete.
          prof: Many Roman structures are still standing after two thousand years. The most famous example is the Pantheon in Rome, whose dome is still the largest unreinforced concrete dome in the world. Modern concrete, by comparison, often begins to crack after fifty or a hundred years.
          prof: Roman concrete was made from lime, water and a special volcanic ash, which came from the area around the Bay of Naples. The Romans mixed this ash with lime and lumps of rock.
          prof: For a long time, researchers assumed that the secret lay in the ash. But a few years ago, scientists noticed something else. Roman concrete contains small white lumps of lime, which had always been explained as the result of poor mixing.
          prof: In fact, these lumps seem to be deliberate. The Romans appear to have mixed their concrete using hot lime, and this created the lumps. When cracks form and water gets in, the water dissolves the lime, which then hardens again and fills the crack. In other words, the concrete can repair itself.
          prof: Another surprising discovery concerns sea walls. Roman harbour structures have actually become stronger over time in seawater, whereas modern concrete is gradually destroyed by it. Seawater reacts with the volcanic ash to form new minerals that grow inside the concrete and bind it together.
          prof: So why don't we just use Roman concrete today? There are a few reasons. First, it's much weaker than modern concrete when it's new, so it couldn't support the weight of a skyscraper. It also takes a long time to harden, which doesn't suit modern construction schedules.
          prof: But there's a strong environmental argument for learning from it. Making modern cement produces about eight per cent of the world's carbon dioxide emissions, partly because it's made at very high temperatures. Roman-style concrete is made at lower temperatures, so it produces less carbon.
          prof: Researchers are now testing new mixtures that combine modern materials with the self-healing lime lumps. One possible use is in building sea defences, which will become more important as sea levels rise.
        `,
        groups: [
          notes(
            'Roman concrete',
            limit(1, true),
            [
              '- the Pantheon’s [[dome]] is the largest of its kind',
              '- modern concrete may crack after 50–100 years',
              '- made from lime, water and volcanic [[ash]]',
              '- white lumps of lime were thought to show poor [[mixing]]',
              '- lumps came from using [[hot]] lime',
              '- water dissolves the lime, which fills the [[crack]]',
              '- in seawater, new [[minerals]] grow and bind the concrete',
              '- disadvantages: weak when new; slow to [[harden]]',
              '- modern cement produces [[8|eight]]% of world CO₂ emissions',
              '- Roman-style concrete is made at lower [[temperatures]]',
              '- possible future use: sea [[defences|defenses]]',
            ],
            [
              ['whose dome is still the largest unreinforced concrete dome in the world', 'The Pantheon in Rome.'],
              ['a special volcanic ash', 'From the area around the Bay of Naples.'],
              ['explained as the result of poor mixing', 'In fact they seem to be deliberate.'],
              ['using hot lime', 'This created the lumps.'],
              ['fills the crack', 'The concrete can repair itself.'],
              ['form new minerals that grow inside the concrete', 'Harbour structures grow stronger over time.'],
              ['It also takes a long time to harden', 'It is also weaker than modern concrete when new.'],
              ["about eight per cent of the world's carbon dioxide emissions", 'Partly because of high temperatures.'],
              ['made at lower temperatures', 'So it produces less carbon.'],
              ['in building sea defences', 'Important as sea levels rise.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['researchers assumed that the secret lay in the ash', 33, 'Not the explanation of the lumps.'],
      ["it couldn't support the weight of a skyscraper", 37, 'A disadvantage, but not the gap.'],
    ],
  }),
])
