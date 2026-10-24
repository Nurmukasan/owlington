import { choose2, flow, form, limit, matching, mcq, notes, part, person, table, test } from '../build'

const reception = person('ali', 'Ali', 'Receptionist', 'f', 'en-GB', 'EKpKHSkyNegCyjBRc55p')
const tom = person('tom', 'Tom', 'Caller', 'm', 'en-GB', 'XNoERKKR7sF9B3q5BGwL')
const naomi = person('naomi', 'Naomi', 'Garden coordinator', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const liam = person('liam', 'Liam', 'Student', 'm', 'en-AU', 'AsGY6GCuJNcXklospqtq')
const mills = person('mills', 'Dr Mills', 'Tutor', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const paul = person('paul', 'Professor Grant', 'Lecturer', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')

export default test('full-02', [
  part({
    n: 1,
    title: 'Joining a leisure centre',
    intro: 'You will hear a man phoning a leisure centre to ask about membership.',
    speakers: [reception, tom],
    blocks: [
      {
        lines: `
          ali: Good afternoon, Brookfield Leisure Centre. How can I help?
          tom: Hello. I've just moved to the area and I'm thinking of joining the centre. Could you tell me about membership?
          ali: Of course. I can take a few details now and send you some information. What's your name?
          tom: Tom Fairbrother.
          ali: Is that Fairbrother as in F-A-I-R? || Is that Fairbrother as in F, A, I, R?
          tom: Yes, F-A-I-R-B-R-O-T-H-E-R. || Yes, F, A, I, R, B, R, O, T, H, E, R.
          ali: Thanks. And your address?
          tom: It's 42 Kingsley Road. That's K-I-N-G-S-L-E-Y. || It's forty-two Kingsley Road. That's K, I, N, G, S, L, E, Y.
          ali: And the postcode?
          tom: Sorry, I haven't learned it yet. Could I email it to you?
          ali: That's fine. Now, what kind of membership were you thinking of? We have three types.
          tom: I'm not sure. What are they?
          ali: Well, the cheapest is Off-Peak, which lets you use the centre before four o'clock on weekdays. Then there's Standard, which covers any time, and Family, for two adults and up to three children.
          tom: I work during the day, so Off-Peak wouldn't suit me. And I live on my own, so I'll go for Standard.
          ali: Standard is twenty-nine pounds a month. There's normally a joining fee of twenty pounds, but if you join before the end of this month, we don't charge it.
          tom: Oh, that's good. I'll make sure I join this week, then.
          ali: Is there anything particular you'd like to use the centre for?
          tom: Mainly swimming. I used to play squash, but I hurt my knee, so the doctor told me to stick to swimming for now.
        `,
        groups: [
          form(
            'Brookfield Leisure Centre — new member',
            limit(1, true),
            [
              'Name: Tom [[Fairbrother]]',
              'Address: [[42]] Kingsley Road',
              'Type of membership: [[Standard]]',
              'Monthly cost: £[[29]]',
              'Main activity: [[swimming]]',
            ],
            [
              ['F-A-I-R-B-R-O-T-H-E-R', 'The whole surname is spelt out after the first four letters are checked.'],
              ["It's 42 Kingsley Road", 'The street name is printed on the form; only the house number is needed.'],
              ["so I'll go for Standard", 'Off-Peak does not suit his working hours, and Family is for more than one adult.'],
              ['Standard is twenty-nine pounds a month', '£20 is the joining fee, which he will not have to pay.'],
              ['Mainly swimming', 'He used to play squash, but has stopped because of his knee.'],
            ],
          ),
        ],
      },
      {
        lines: `
          tom: Could you tell me a bit about the classes as well? I might try one or two.
          ali: Sure. The most popular one is Aqua Fit, which is exercise in the water. That's on Tuesday evenings at seven, and you don't need to book; just turn up.
          tom: That sounds ideal, actually. What else is there?
          ali: There's Pilates on Wednesdays. That used to be at lunchtime, but it's now at 6.15 in the evening. You'll need to bring your own mat, as we don't provide them any more. || There's Pilates on Wednesdays. That used to be at lunchtime, but it's now at six fifteen in the evening. You'll need to bring your own mat, as we don't provide them any more.
          tom: OK.
          ali: On Thursdays we have a cycling class at half past seven. It's very energetic, so beginners should arrive ten minutes early so the instructor can adjust the bike for them.
          tom: Right. And at the weekend?
          ali: On Saturday mornings there's a class called Stretch and Relax, at nine o'clock. That one's really gentle. It's held in the studio on the first floor, not in the main hall, because the hall's used for children's football on Saturdays.
          tom: That might be good for my knee.
          ali: It would. And one more thing: all classes are free for Standard members, except the cycling class, which costs four pounds a session because of the equipment.
          tom: That's fine. Well, thank you, you've been really helpful.
          ali: You're welcome. I'll email you the forms today.
        `,
        groups: [
          table(
            'Classes',
            limit(2, true),
            ['Class', 'Day and time', 'Notes'],
            [
              ['Aqua Fit', 'Tuesday, 7 pm', 'no need to [[book]]'],
              ['Pilates', 'Wednesday, [[6.15|6:15|6.15 pm|six fifteen]] pm', 'bring your own [[mat]]'],
              ['Cycling', 'Thursday, 7.30 pm', 'beginners arrive 10 minutes early; costs £4'],
              ['Stretch and Relax', 'Saturday, [[9|9 am|nine]] am', 'in the studio on the [[first floor]]'],
            ],
            [
              ["you don't need to book", 'Aqua Fit has no booking: “just turn up”.'],
              ["it's now at 6.15 in the evening", 'It used to be at lunchtime; the time has changed.'],
              ['bring your own mat', 'The centre no longer provides mats.'],
              ["at nine o'clock", 'Saturday mornings at nine.'],
              ["It's held in the studio on the first floor", 'Not in the main hall, which is used for children’s football.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['F-A-I-R?', 1, 'Only the first four letters; the full spelling follows.'],
      ['Off-Peak wouldn\'t suit me', 3, 'He rejects Off-Peak.'],
      ['a joining fee of twenty pounds', 4, 'Not the monthly cost.'],
      ['I used to play squash', 5, 'He no longer plays.'],
      ['That used to be at lunchtime', 7, 'The old time.'],
      ['not in the main hall', 10, 'The class is in the studio.'],
    ],
  }),

  part({
    n: 2,
    title: 'A community garden',
    intro: 'You will hear a woman talking on local radio about a community garden.',
    speakers: [naomi],
    blocks: [
      {
        lines: `
          naomi: Thanks for having me on the programme. I'm Naomi, and I coordinate the Hillside Community Garden, which opened three years ago on a piece of land that used to be a car park behind the old railway station.
          naomi: People often think the garden was the council's idea, but in fact it started when a group of neighbours wrote a letter to the local paper complaining about the empty land. The council then agreed to let us use it, and a local building firm donated the soil.
          naomi: The garden is run entirely by volunteers. At the moment we have about sixty regular members, and the biggest change since we started is in who comes. In the first year it was mostly retired people, but now nearly half of our members are families with young children.
          naomi: Anyone can join, and there's no fee. We do ask new members to come to a short welcome session, though, mainly so we can show them where the tools are kept and explain how the watering system works.
          naomi: We've had a few challenges along the way. The first summer was extremely dry, and lots of our young plants died. We also had some problems with people dumping rubbish over the fence. But the thing that caused us the most trouble was rabbits. They ate almost everything, and in the end we had to put up a special fence all the way round.
          naomi: The garden has brought some real benefits to the neighbourhood. Several local cafés now buy our salad leaves and herbs, which helps to pay for seeds. And the primary school next door brings classes over every week, which the teachers say has improved the children's interest in science.
        `,
        groups: [
          mcq([
            [
              'How did the community garden begin?',
              ['The council decided to use the land.', 'Neighbours wrote to a newspaper.', 'A building firm offered the land.'],
              'B',
              'it started when a group of neighbours wrote a letter to the local paper',
              '“People often think the garden was the council’s idea, but in fact…” The building firm only gave soil.',
            ],
            [
              'What is the biggest change in the garden’s membership?',
              ['There are more families with children.', 'There are more retired people.', 'Members now pay a small fee.'],
              'A',
              'now nearly half of our members are families with young children',
              'Retired people were the majority in the first year; there is still no fee.',
            ],
            [
              'What caused the garden the most trouble?',
              ['dry weather', 'rubbish thrown over the fence', 'rabbits'],
              'C',
              'the thing that caused us the most trouble was rabbits',
              'Drought and rubbish were problems too, but rabbits caused “the most trouble”.',
            ],
          ]),
          choose2(
            'Which TWO benefits of the garden does Naomi mention?',
            [
              'Local cafés buy some of its produce.',
              'House prices in the area have risen.',
              'Children have become more interested in science.',
              'Fewer people use cars in the neighbourhood.',
              'The garden supplies food to a hospital.',
            ],
            ['A', 'C'],
            [
              ['Several local cafés now buy our salad leaves and herbs', 'Selling produce to cafés helps pay for seeds.'],
              ["improved the children's interest in science", 'The teachers say school visits have improved this.'],
            ],
          ),
        ],
      },
      {
        lines: `
          naomi: Now, for anyone who'd like to visit, let me describe the different areas of the garden, because each one has its own character.
          naomi: As you come through the gate, the first area you reach is the herb garden. It's laid out in a circle, and because the plants are all chosen for their smell, it's especially popular with visitors who are blind or partially sighted.
          naomi: Behind that is the vegetable patch, which is divided into small plots. Each family can have its own plot, and there's a waiting list, so if you're interested, put your name down soon.
          naomi: To the left of the vegetables you'll find the orchard. The trees are still quite young, so we don't get much fruit yet, but in spring the blossom is beautiful, and that's when we hold our annual picnic.
          naomi: In the far corner, we've created a wildlife area. It's deliberately left untidy, with long grass and piles of logs, and it's become home to frogs, hedgehogs and dozens of kinds of insect. Please don't let children go in there without an adult, as there's a small pond.
          naomi: Next to the wildlife area is the greenhouse, which was built entirely from old windows that people donated. It means we can grow tomatoes and peppers, which wouldn't survive outside in our climate.
          naomi: And finally, by the back fence, there's the composting area. All the garden waste goes there, and so does vegetable waste from the cafés I mentioned. It's not the prettiest part of the garden, but it's probably the most important.
        `,
        groups: [
          matching(
            'What does Naomi say about each area of the garden? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
            'Features',
            [
              'is made from recycled materials',
              'has a waiting list',
              'is designed for people who cannot see well',
              'is where an event takes place each year',
              'children must be supervised there',
              'receives waste from businesses',
              'was the first area to be created',
            ],
            [
              ['the herb garden', 'C', 'especially popular with visitors who are blind or partially sighted', 'The herbs are chosen for their smell, which suits visitors who cannot see well.'],
              ['the vegetable patch', 'B', "there's a waiting list", 'Families can have their own plot, but there is a waiting list.'],
              ['the orchard', 'D', "that's when we hold our annual picnic", 'An annual picnic is an event each year.'],
              ['the wildlife area', 'E', "don't let children go in there without an adult", 'Because of the pond, children must be with an adult.'],
              ['the greenhouse', 'A', 'built entirely from old windows that people donated', 'Old donated windows are recycled materials.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["People often think the garden was the council's idea", 11, 'It was the neighbours’ idea.'],
      ['In the first year it was mostly retired people', 12, 'That was the past.'],
      ['The first summer was extremely dry', 13, 'A problem, but not the biggest.'],
      ['so does vegetable waste from the cafés', 20, 'This describes the composting area, which is not a question.'],
    ],
  }),

  part({
    n: 3,
    title: 'Planning a research project',
    intro: 'You will hear a student called Liam talking to his tutor, Dr Mills, about his research project on sleep and memory.',
    speakers: [liam, mills],
    blocks: [
      {
        lines: `
          mills: Come in, Liam. So, how's the project going?
          liam: Pretty well, thanks. I've decided to look at how sleep affects memory in teenagers, like we discussed.
          mills: Good. What made you choose teenagers in the end? Last time you were considering older adults.
          liam: Well, I was. But then I realised I'd have much easier access to teenagers, because my sister's school has agreed to help. And there's been less research on them, which makes it more interesting.
          mills: Both good reasons. Have you read the main studies yet?
          liam: Most of them. I was surprised by how small some of the samples were. Several studies had fewer than twenty people.
          mills: Yes, that's a common weakness in this field. So what do you think your study can add?
          liam: I'm hoping to test the students in their normal environment. Most earlier studies were done in sleep laboratories, where people don't really sleep normally.
          mills: That's a real strength. Though it also means you'll have less control over what they do the night before. How will you measure their sleep?
          liam: I'd thought of asking them to keep a diary, but people aren't very accurate about how long they sleep. So I'm going to borrow wristbands from the psychology department that record movement.
          mills: Much better. And what will the memory test involve?
          liam: I've chosen a word-list test. They'll learn thirty words in the evening and try to recall them the next morning. I considered using pictures, but the word list has been used in lots of studies, so I can compare my results with theirs.
          mills: Sensible. And have you thought about ethics?
          liam: Yes. Because they're under eighteen, I'll need permission from their parents as well as from the students themselves.
        `,
        groups: [
          mcq([
            [
              'Why did Liam decide to study teenagers?',
              ['His tutor suggested it.', 'It would be easier to find participants.', 'Older adults had been studied too often.'],
              'B',
              "I'd have much easier access to teenagers",
              'His sister’s school has agreed to help. He says there has been less research on teenagers, not that adults were studied too often.',
            ],
            [
              'What surprised Liam about earlier studies?',
              ['the small number of participants', 'the age of the participants', 'the length of the studies'],
              'A',
              'I was surprised by how small some of the samples were',
              'Several studies had fewer than twenty people.',
            ],
            [
              'What does Dr Mills see as a disadvantage of Liam’s approach?',
              ['It will take more time.', 'It will be expensive.', 'It gives him less control.'],
              'C',
              "you'll have less control over what they do the night before",
              'Testing at home is a strength, but it gives less control.',
            ],
            [
              'How will Liam measure sleep?',
              ['by asking students to keep a diary', 'with wristbands that record movement', 'in a sleep laboratory'],
              'B',
              'borrow wristbands from the psychology department that record movement',
              'He rejected diaries because people are inaccurate about their sleep.',
            ],
            [
              'Why has Liam chosen a word-list test?',
              ['Students find it easy to understand.', 'It is quicker than a picture test.', 'He can compare his results with other studies.'],
              'C',
              'so I can compare my results with theirs',
              'The word list has been used in many studies.',
            ],
          ]),
        ],
      },
      {
        lines: `
          mills: Let's go through the stages of the study, so you have a clear plan.
          liam: OK. The first thing is to send out information sheets, so that the students and their parents know what's involved.
          mills: And then?
          liam: Then I collect the consent forms. Once I have those, I'll run a short pilot study with five students, to check that everything works.
          mills: Good. Pilots often reveal problems you didn't expect.
          liam: After the pilot, the main study begins. The students wear the wristbands for a full week, so I get a picture of their normal sleep pattern.
          mills: Why a week and not just one night?
          liam: Because one night might not be typical. Then, on the last evening, they learn the word list, and the next morning they do the recall test.
          mills: And after that?
          liam: I analyse the data. I'll compare the students who slept longer with those who slept less, and see whether their scores are different.
          mills: Will you tell the students their results?
          liam: Yes. Each student will get a short summary of their own sleep data. I think they'll find it interesting, and it's a way of thanking them.
          mills: That's a nice idea. The last stage, of course, is writing the report. Make sure you leave enough time for that.
        `,
        groups: [
          flow(
            'Stages of Liam’s study',
            limit(1),
            [
              'Send [[information]] sheets to students and parents',
              'Collect the consent forms',
              'Run a [[pilot]] study with five students',
              'Students wear wristbands for a [[week]]',
              'Students learn a word list in the evening and do a recall test in the [[morning]]',
              'Analyse the data and give each student a [[summary]] of their sleep',
            ],
            [
              ['send out information sheets', 'Information sheets come first, so families know what is involved.'],
              ['run a short pilot study with five students', 'A pilot checks that everything works.'],
              ['wear the wristbands for a full week', 'One night might not be typical.'],
              ['the next morning they do the recall test', 'They learn the words in the evening and are tested the next morning.'],
              ['a short summary of their own sleep data', 'This is a way of thanking the students.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['you were considering older adults', 21, 'His earlier idea.'],
      ["I'd thought of asking them to keep a diary", 24, 'Rejected.'],
      ['I considered using pictures', 25, 'Rejected.'],
      ['not just one night', 29, 'The study lasts a week.'],
    ],
  }),

  part({
    n: 4,
    title: 'Building with earth',
    intro: 'You will hear part of a lecture about buildings made of earth.',
    speakers: [paul],
    blocks: [
      {
        lines: `
          paul: Good afternoon. Today's lecture is about one of the oldest building materials in the world, and one that is attracting new interest from architects: earth.
          paul: It's estimated that around a third of the world's population still lives in buildings made largely of earth. That figure surprises many people, who assume that earth buildings are rare or found only in poor rural areas. In fact, some are found in cities, and some have lasted for centuries.
          paul: There are several traditional techniques. The first is adobe, in which mud is mixed with straw, shaped into bricks and dried in the sun. Adobe is common in dry regions, because the bricks need several weeks of hot weather to dry properly.
          paul: The second technique is rammed earth. Here, damp soil is placed between wooden boards and pressed down hard, layer by layer, using a heavy tool. When the boards are removed, you can see the layers as bands of colour in the wall, which many people find attractive.
          paul: A third method, often called cob, uses wet earth mixed with straw and built up by hand into thick walls, without any bricks or boards. In parts of south-west England, cob houses built five hundred years ago are still lived in today.
          paul: So why are architects interested in earth now? The main reason is energy. Producing cement and steel releases large amounts of carbon dioxide, whereas earth can often be dug from the building site itself and needs very little processing.
          paul: Earth walls also have an important practical advantage: they store heat. During the day, thick walls absorb warmth, so the inside of the building stays cool, and at night they release that warmth slowly. This means that earth buildings often need little or no air conditioning.
          paul: Another benefit, which is less well known, is that earth absorbs moisture from the air when it's damp and releases it when the air is dry. This keeps the humidity inside at a comfortable level, which some studies suggest is good for people with breathing problems.
          paul: However, earth has weaknesses too. Its greatest enemy is water. If rain soaks the bottom of a wall, the earth can lose its strength, so traditional builders always placed earth walls on a base of stone and gave the building a wide roof to keep the rain off. As builders say, an earth building needs good boots and a good hat.
          paul: Earth is also weaker than concrete, so it's rarely used for tall buildings. And in many countries building regulations don't include earth, which makes it difficult and expensive for architects to get permission to use it.
          paul: Modern research is addressing some of these problems. In some projects, a small amount of lime is added to the soil to make it more resistant to water. Engineers are also testing walls in laboratories to produce the data that regulators need.
          paul: Finally, earth has an appeal that is hard to measure. Many people who live in earth buildings say they feel calm and quiet inside, partly because thick walls block out noise from outside. Whether earth can become a mainstream material again remains to be seen, but it certainly deserves a second look.
        `,
        groups: [
          notes(
            'Building with earth',
            limit(1),
            [
              '# Traditional techniques',
              '- adobe: bricks of mud and straw, dried in the [[sun]]',
              '- rammed earth: soil pressed between [[boards]]; layers show as bands of colour',
              '- cob: wet earth and straw built up by [[hand]]',
              '# Advantages',
              '- uses much less [[energy]] than cement or steel',
              '- walls store [[heat]], so little air conditioning is needed',
              '- controls humidity; may help people with [[breathing]] problems',
              '# Problems',
              '- damaged by [[water]]; needs a stone base and a wide roof',
              '- weaker than concrete, so rarely used for [[tall]] buildings',
              '- not covered by building regulations in many countries',
              '# Modern solutions',
              '- adding [[lime]] makes earth more resistant to water',
              '- thick walls also block out [[noise]]',
            ],
            [
              ['dried in the sun', 'Adobe bricks need weeks of hot weather to dry.'],
              ['placed between wooden boards and pressed down hard', 'When the boards are removed, the layers show.'],
              ['built up by hand into thick walls', 'Cob uses no bricks or boards.'],
              ['The main reason is energy', 'Cement and steel production releases a lot of carbon dioxide.'],
              ['they store heat', 'Walls absorb warmth by day and release it at night.'],
              ['good for people with breathing problems', 'Stable humidity may help people with breathing problems.'],
              ['Its greatest enemy is water', 'Rain soaking the base weakens the wall.'],
              ["it's rarely used for tall buildings", 'Earth is weaker than concrete.'],
              ['a small amount of lime is added to the soil', 'Lime makes the soil more resistant to water.'],
              ['thick walls block out noise from outside', 'This is part of why people feel calm inside.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['found only in poor rural areas', 31, 'A mistaken assumption.'],
      ['a heavy tool', 32, 'The soil is pressed with a tool, but between boards.'],
      ['without any bricks or boards', 33, 'Cob uses neither.'],
    ],
  }),
])
