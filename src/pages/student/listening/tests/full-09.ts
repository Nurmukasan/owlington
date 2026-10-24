import { choose2, form, limit, matching, mcq, notes, part, person, table, test } from '../build'

const sec = person('sec', 'Brian', 'Club secretary', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')
const ana = person('ana', 'Ana', 'Caller', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const coord = person('coord', 'Fiona', 'Volunteer coordinator', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const tutor = person('tutor', 'Dr Novak', 'Tutor', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const leah = person('leah', 'Leah', 'Student', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const prof = person('prof', 'Dr Carver', 'Lecturer', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')

export default test('full-09', [
  part({
    n: 1,
    title: 'Joining a photography club',
    intro: 'You will hear a woman phoning the secretary of a local photography club.',
    speakers: [sec, ana],
    blocks: [
      {
        lines: `
          sec: Hello, Brian Collins speaking.
          ana: Oh, hello. Is that the Riverside Camera Club? I got your number from the library.
          sec: It is, yes. How can I help?
          ana: I've just moved to the area, and I'd like to join a photography club. Could you tell me a bit about yours?
          sec: Of course. We meet every Tuesday evening at the community hall on Wharf Street.
          ana: What time?
          sec: We start at half past seven and usually finish around ten. People often stay for a chat afterwards.
          ana: And how many members do you have?
          sec: About sixty, though normally around forty come to each meeting.
          ana: That's a nice size. I'm not very experienced, though. Is it mostly professionals?
          sec: Not at all. We have a beginners' group that meets in a separate room for the first hour. A lot of people start there.
          ana: That sounds perfect. How much is membership?
          sec: It's forty-five pounds for the year, but if you join after January, it's half price. And students pay just twenty.
          ana: I'm not a student, unfortunately, and it's only October, so I'll pay the full amount.
          sec: Fair enough. Can I take your name?
          ana: It's Ana Ferreira. F-E-R-R-E-I-R-A. || It's Ana Ferreira. F, E, double R, E, I, R, A.
          sec: And an email address, so I can send you the programme?
          ana: It's ana dot f at mailbox dot com. || It's ana, dot, f, at mailbox dot com.
        `,
        groups: [
          form(
            'Riverside Camera Club',
            limit(1, true),
            [
              'Meetings: every Tuesday at the community hall, [[Wharf]] Street',
              'Start time: [[7.30|7:30|7.30 pm]] pm',
              'Average attendance: [[40|forty]] members',
              'For beginners: a separate [[group]] for the first hour',
              'Annual fee: £[[45|forty-five]]',
              'Name: Ana [[Ferreira]]',
            ],
            [
              ['at the community hall on Wharf Street', 'The street name.'],
              ['We start at half past seven', 'Half past seven is 7.30.'],
              ['normally around forty come to each meeting', 'Sixty is the total membership.'],
              ["We have a beginners' group that meets in a separate room", 'It meets for the first hour.'],
              ["It's forty-five pounds for the year", 'She is not a student and it is October, so she pays the full amount.'],
              ['F-E-R-R-E-I-R-A', 'The surname is spelt out with a double R.'],
            ],
          ),
        ],
      },
      {
        lines: `
          ana: Could you tell me what's coming up in the programme?
          sec: Sure. Next week, the 14th, we've got a talk by a wildlife photographer, Marcus Reed, who's just back from the Arctic. || Sure. Next week, the fourteenth, we've got a talk by a wildlife photographer, Marcus Reed, who's just back from the Arctic.
          ana: That sounds amazing.
          sec: It should be. Then on the 21st, it's our practical evening on portraits. Bring your own camera, but we'll provide the lights. || It should be. Then on the twenty-first, it's our practical evening on portraits. Bring your own camera, but we'll provide the lights.
          ana: OK.
          sec: On the 28th we have our first competition of the season. The theme is reflections, so think about water, mirrors, windows, that kind of thing. || On the twenty-eighth we have our first competition of the season. The theme is reflections, so think about water, mirrors, windows, that kind of thing.
          ana: Can new members enter?
          sec: Yes, anyone can enter. You can submit up to three prints.
          ana: And after that?
          sec: In early November we have a day trip to the coast, to photograph the lighthouse at sunset. We share cars, so it doesn't cost much.
        `,
        groups: [
          table(
            'Club programme',
            limit(1, true),
            ['Date', 'Event', 'Details'],
            [
              ['14 October', 'talk', 'a wildlife photographer, recently in the [[Arctic]]'],
              ['21 October', 'practical evening', 'topic: [[portraits]]; club provides lights'],
              ['28 October', 'competition', 'theme: [[reflections]]; maximum of [[3|three]] prints'],
            ],
            [
              ["who's just back from the Arctic", 'Marcus Reed is a wildlife photographer.'],
              ['our practical evening on portraits', 'Members bring their own cameras.'],
              ['The theme is reflections', 'Water, mirrors and windows.'],
              ['You can submit up to three prints', 'New members can also enter.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['About sixty', 3, 'Total membership, not attendance.'],
      ['if you join after January, it\'s half price', 5, 'She joins in October.'],
      ['And students pay just twenty', 5, 'She is not a student.'],
    ],
  }),

  part({
    n: 2,
    title: 'Volunteering at a hospital',
    intro: 'You will hear a volunteer coordinator talking to people who want to volunteer at a hospital.',
    speakers: [coord],
    blocks: [
      {
        lines: `
          coord: Hi everyone, I'm Fiona, and I coordinate the volunteer programme here at St Anne's Hospital. Thank you all for coming along this evening.
          coord: We currently have just over three hundred volunteers, and they give us something we simply couldn't provide otherwise: time. Our nurses and doctors are extremely busy, and volunteers have the time to sit and talk with patients, which makes a huge difference to how people feel.
          coord: People sometimes worry that they need medical knowledge. You don't. Volunteers never carry out medical tasks. What we're looking for is reliability and good communication.
          coord: We ask for a commitment of at least one three-hour session a week for six months. That's because training takes time and patients benefit from seeing familiar faces.
          coord: Before you start, there are two checks we have to carry out. We'll need two references, ideally from an employer or a teacher, and you'll have a short health check to make sure you're protected against certain infections.
          coord: You'll also need to attend an induction day, which covers things like fire safety and patient confidentiality.
        `,
        groups: [
          mcq([
            [
              'According to Fiona, what do volunteers provide that staff cannot?',
              ['medical skills', 'time with patients', 'help with paperwork'],
              'B',
              'they give us something we simply couldn\'t provide otherwise: time',
              'Volunteers have time to sit and talk with patients.',
            ],
            [
              'What does Fiona say about medical knowledge?',
              ['It is not needed.', 'It is helpful in some roles.', 'It is provided during training.'],
              'A',
              "You don't. Volunteers never carry out medical tasks",
              'Reliability and good communication are what matter.',
            ],
            [
              'Why must volunteers commit to six months?',
              ['because of the cost of checks', 'so patients see familiar faces', 'because of hospital rules'],
              'B',
              'patients benefit from seeing familiar faces',
              'Training also takes time.',
            ],
          ]),
          choose2(
            'Which TWO things must volunteers have before they start?',
            ['a first-aid certificate', 'two references', 'a driving licence', 'a health check', 'previous experience'],
            ['B', 'D'],
            [
              ["We'll need two references", 'Ideally from an employer or a teacher.'],
              ["you'll have a short health check", 'To protect volunteers against infections.'],
            ],
          ),
        ],
      },
      {
        lines: `
          coord: Now let me tell you about the roles that are available at the moment.
          coord: Our ward visitors spend time with patients who don't have family nearby. It's the most popular role, and the one thing we insist on is that you're a good listener, because many patients just want someone to talk to.
          coord: Meet and greet volunteers work at the main entrance, helping people find their way around. It's a big site, so you'll need to walk a lot, and you'll be on your feet most of the time.
          coord: The hospital radio team broadcasts music and requests to the wards. We're particularly looking for people who can work late shifts, as the evening programme is the most popular.
          coord: In the garden team, volunteers look after the courtyard gardens. You don't need to be an expert gardener; we'll teach you everything. It's ideal for people who'd rather not work directly with patients.
          coord: And our mealtime helpers assist patients who find it difficult to eat on their own. This role does involve extra training, which takes place over two Saturdays.
        `,
        groups: [
          matching(
            'What does Fiona say about each role? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
            'Information',
            [
              'involves a lot of walking',
              'requires additional training',
              'suits people who prefer not to be with patients',
              'requires good listening skills',
              'involves working in the evenings',
              'is only available at weekends',
              'requires a qualification',
            ],
            [
              ['ward visitor', 'D', 'the one thing we insist on is that you\'re a good listener', 'Many patients just want someone to talk to.'],
              ['meet and greet', 'A', "you'll need to walk a lot", 'It is a big site.'],
              ['hospital radio', 'E', 'people who can work late shifts', 'The evening programme is the most popular.'],
              ['garden team', 'C', "ideal for people who'd rather not work directly with patients", 'No gardening expertise is needed.'],
              ['mealtime helper', 'B', 'This role does involve extra training', 'Training takes place over two Saturdays.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Our nurses and doctors are extremely busy', 11, 'Staff lack time.'],
      ['reliability and good communication', 12, 'What they are looking for, not medical knowledge.'],
      ["You don't need to be an expert gardener", 19, 'No qualification needed.'],
      ['over two Saturdays', 20, 'The training, not the role, is on Saturdays.'],
    ],
  }),

  part({
    n: 3,
    title: 'A tutorial on biomimicry',
    intro: 'You will hear an engineering student, Leah, discussing her essay on biomimicry with her tutor.',
    speakers: [tutor, leah],
    blocks: [
      {
        lines: `
          tutor: So, Leah, your essay's on biomimicry, copying designs from nature. How are you finding it?
          leah: I'm really enjoying it, but there's so much material. My main problem is deciding what to leave out.
          tutor: That's a good problem to have. What's your main argument?
          leah: I want to argue that biomimicry is most useful not for inventing completely new products, but for making existing ones more efficient. Most of the successful examples I've found improve something that already existed.
          tutor: Interesting. Do you have evidence for that?
          leah: Quite a lot. Though I found one article that says the opposite, that the biggest benefits come from completely new ideas.
          tutor: Then you should discuss it. A good essay deals with counter-arguments rather than ignoring them.
          leah: OK, I'll add a section on that.
          tutor: What about your sources? I noticed you've used a lot of websites.
          leah: Yes, I know. The company websites were helpful for technical details.
          tutor: They're useful, but remember that companies want to sell products, so they'll present them positively. Try to balance them with academic journals.
          leah: I'll go to the library this week.
          tutor: And your conclusion. At the moment, it just summarises the essay. I'd like you to add something about future research.
          leah: Like what might be possible in ten or twenty years?
          tutor: Exactly. That shows you're thinking beyond the reading.
        `,
        groups: [
          mcq([
            [
              'What is Leah’s main difficulty with the essay?',
              ['finding enough material', 'choosing what to include', 'understanding the technical details'],
              'B',
              'My main problem is deciding what to leave out',
              'There is so much material.',
            ],
            [
              'Leah’s main argument is that biomimicry is most useful for',
              ['creating new products.', 'improving existing products.', 'reducing production costs.'],
              'B',
              'making existing ones more efficient',
              'Most successful examples improve something that already existed.',
            ],
            [
              'What does the tutor advise Leah to do about the article that disagrees with her?',
              ['ignore it', 'discuss it in her essay', 'check who wrote it'],
              'B',
              'Then you should discuss it',
              'A good essay deals with counter-arguments.',
            ],
            [
              'Why does the tutor have doubts about company websites?',
              ['They are often out of date.', 'They may be biased.', 'They are too technical.'],
              'B',
              'companies want to sell products, so they\'ll present them positively',
              'Leah should balance them with academic journals.',
            ],
            [
              'What does the tutor want Leah to add to her conclusion?',
              ['a summary of the main points', 'ideas about future developments', 'a personal opinion'],
              'B',
              "I'd like you to add something about future research",
              'What might be possible in ten or twenty years.',
            ],
          ]),
        ],
      },
      {
        lines: `
          tutor: Let's look at the examples you've chosen. Which ones are you including?
          leah: Five. The first is the high-speed train in Japan. The front was redesigned to copy the beak of the kingfisher, because the old shape made a loud bang when the train left a tunnel.
          tutor: That's a classic example. Good.
          leah: The second is a type of paint that cleans itself. It copies the lotus leaf, which has a surface that water runs off, taking the dirt with it.
          tutor: What else?
          leah: There's a building in Zimbabwe that stays cool without air conditioning. It's based on termite mounds, which have a system of tunnels that let hot air escape.
          tutor: And the other two?
          leah: Swimsuits that copied the skin of sharks, to reduce drag in the water. And finally, a type of glue inspired by the feet of geckos, the lizards that can climb walls.
          tutor: Very good selection. Though you might want to say that the shark swimsuits were actually banned from competitions, because they gave swimmers too much advantage.
          leah: Oh, I didn't know that. I'll mention it.
        `,
        groups: [
          matching(
            'Which part of nature inspired each design? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 26–30.',
            'Source in nature',
            ['a bird', 'a leaf', 'an insect home', 'a fish', 'a lizard', 'a spider web', 'a tree'],
            [
              ['the front of a high-speed train', 'A', 'copy the beak of the kingfisher', 'The kingfisher is a bird.'],
              ['self-cleaning paint', 'B', 'It copies the lotus leaf', 'Water runs off the surface, taking dirt with it.'],
              ['a building without air conditioning', 'C', "It's based on termite mounds", 'Termite mounds let hot air escape.'],
              ['competition swimsuits', 'D', 'copied the skin of sharks', 'A shark is a fish.'],
              ['a type of glue', 'E', 'inspired by the feet of geckos, the lizards that can climb walls', 'Geckos are lizards.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['the biggest benefits come from completely new ideas', 22, 'The opposing article, not her argument.'],
      ['it just summarises the essay', 25, 'The current conclusion.'],
    ],
  }),

  part({
    n: 4,
    title: 'The history of salt',
    intro: 'You will hear a lecture about the role of salt in human history.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today we're going to look at a substance we take completely for granted: ordinary salt. For most of human history, salt was one of the most valuable goods in the world.
          prof: Why was it so important? The main reason is that salt preserves food. Before refrigeration, salting meat and fish was one of the only ways to keep it through the winter. Salt was also essential for keeping animals healthy, and for processing leather.
          prof: There are three main ways of producing salt. In hot, dry places, seawater is let into shallow pools and the sun evaporates the water, leaving salt behind. This is the cheapest method, but it depends on the climate.
          prof: In colder places, people boiled seawater or salty spring water over a fire. This needed enormous amounts of fuel, so salt-making was often linked to the loss of forests.
          prof: The third method is mining rock salt from underground, which became common once deep mines could be dug. Some salt mines in Europe have been worked for thousands of years.
        `,
        groups: [
          table(
            'Methods of salt production',
            limit(1),
            ['Method', 'Where used', 'Notes'],
            [
              ['evaporation by the [[sun]]', 'hot, dry places', 'cheapest method, but depends on the [[climate]]'],
              ['boiling', 'colder places', 'needed a lot of [[fuel]]; linked to the loss of forests'],
              ['mining rock salt', 'underground', 'some mines worked for thousands of [[years]]'],
            ],
            [
              ['the sun evaporates the water', 'Seawater is let into shallow pools.'],
              ['but it depends on the climate', 'The cheapest method.'],
              ['This needed enormous amounts of fuel', 'So salt-making was linked to the loss of forests.'],
              ['have been worked for thousands of years', 'Some European salt mines.'],
            ],
          ),
        ],
      },
      {
        lines: `
          prof: Salt has left its mark on our language. The word salary probably comes from the Latin word for salt, although the popular story that Roman soldiers were paid in salt has little evidence to support it.
          prof: Salt also shaped geography. Many early roads were built to carry salt, and towns grew up at places where salt was produced. In England, you can often recognise these towns because their names end in "wich".
          prof: Because it was so valuable, salt was heavily taxed by governments. In France, a hated salt tax was one of the causes of anger before the revolution, and in India, in 1930, Gandhi led a famous march to the sea to make salt in protest against British taxes. || Because it was so valuable, salt was heavily taxed by governments. In France, a hated salt tax was one of the causes of anger before the revolution, and in India, in nineteen thirty, Gandhi led a famous march to the sea to make salt in protest against British taxes.
          prof: Today, salt is cheap and plentiful, and the problem is the opposite: we eat too much of it. Most of the salt we consume isn't added at the table; it's already in processed foods such as bread and ready meals.
          prof: High salt intake is linked to raised blood pressure, and several countries have run campaigns to reduce it. The most successful approach has been to persuade manufacturers to reduce salt gradually, by small amounts each year, so that consumers don't notice the change in taste.
        `,
        groups: [
          notes(
            'Salt in history and today',
            limit(1),
            [
              '- the word “salary” probably comes from the [[Latin]] word for salt',
              '- many early [[roads]] were built to transport salt',
              '- in England, salt towns often have names ending in “wich”',
              '- a salt [[tax]] caused anger in France before the revolution',
              '- Gandhi led a march to the [[sea]] in 1930',
              '- today, most salt comes from [[processed]] foods',
              '- manufacturers reduce salt gradually so that the change in [[taste]] is not noticed',
            ],
            [
              ['probably comes from the Latin word for salt', 'The story about Roman soldiers lacks evidence.'],
              ['Many early roads were built to carry salt', 'Towns grew where salt was produced.'],
              ['a hated salt tax was one of the causes of anger', 'Governments taxed salt heavily.'],
              ['Gandhi led a famous march to the sea', 'To make salt in protest against British taxes.'],
              ["it's already in processed foods such as bread and ready meals", 'Not added at the table.'],
              ["consumers don't notice the change in taste", 'Salt is cut by small amounts each year.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Roman soldiers were paid in salt', 35, 'A popular story with little evidence.'],
      ["isn't added at the table", 39, 'Most salt is in processed foods.'],
    ],
  }),
])
