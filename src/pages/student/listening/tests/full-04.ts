import { form, limit, matching, mcq, notes, part, person, test } from '../build'

const staff = person('kate', 'Kate', 'Events assistant', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const dad = person('sam', 'Sam', 'Caller', 'm', 'en-AU', 'AsGY6GCuJNcXklospqtq')
const luke = person('luke', 'Daniel', 'Festival manager', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')
const amy = person('amy', 'Amy', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const josh = person('josh', 'Josh', 'Student', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')
const prof = person('prof', 'Dr Reed', 'Lecturer', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')

export default test('full-04', [
  part({
    n: 1,
    title: 'Booking a birthday party',
    intro: 'You will hear a man phoning an activity centre to book a birthday party for his daughter.',
    speakers: [staff, dad],
    blocks: [
      {
        lines: `
          kate: Hello, Treetops Activity Centre, Kate speaking.
          sam: Hi there. I'd like to book a birthday party for my daughter. She'll be eight next month.
          kate: Lovely. Let me just open a booking form. Can I have your name first?
          sam: It's Sam Okonedo. That's O-K-O-N-E-D-O. || It's Sam Okonedo. That's O, K, O, N, E, D, O.
          kate: Thank you. And which date were you thinking of?
          sam: Her birthday's on a Thursday, so we'd like the Saturday after that, the 19th of October. || Her birthday's on a Thursday, so we'd like the Saturday after that, the nineteenth of October.
          kate: Let me check. Yes, the 19th is available in the afternoon. || Let me check. Yes, the nineteenth is available in the afternoon.
          sam: Great. How many children can we bring?
          kate: The maximum is twenty, but the price is the same for up to twelve.
          sam: We've invited fifteen, so I suppose some won't come. Put down fifteen for now.
          kate: Fifteen. And do any of them have allergies we need to know about?
          sam: One boy is allergic to nuts. Nothing else that I know of.
          kate: OK, I'll note that for the kitchen.
        `,
        groups: [
          form(
            'Treetops Activity Centre — party booking',
            limit(1, true),
            ['Name: Sam [[Okonedo]]', 'Child’s age: [[8|eight]]', 'Date: Saturday [[19|19th]] October', 'Number of children: [[15|fifteen]]', 'Allergies: one child cannot eat [[nuts]]'],
            [
              ['O-K-O-N-E-D-O', 'The surname is spelt out.'],
              ["She'll be eight next month", 'She will be eight at the party.'],
              ['the 19th of October', 'Her birthday is on a Thursday; the party is the Saturday after.'],
              ['Put down fifteen for now', 'The maximum is twenty and the price covers twelve, but fifteen are invited.'],
              ['One boy is allergic to nuts', 'Only one allergy is mentioned.'],
            ],
          ),
        ],
      },
      {
        lines: `
          sam: Can you tell me what the party includes?
          kate: Of course. The children start with an hour on the climbing wall, with two instructors. After that there's a treasure hunt in the woods behind the centre.
          sam: That sounds fun. What if it rains?
          kate: Then we move the treasure hunt indoors, to the games hall. It's never been cancelled.
          sam: Good. And food?
          kate: The party room is booked for forty-five minutes at the end. We provide pizza and fruit, but you'll need to bring the birthday cake yourself.
          sam: That's fine. My wife's planning to make one anyway.
          kate: As for cost, it's one hundred and sixty pounds for up to twelve children, and then eleven pounds for each extra child.
          sam: So with fifteen, that's three extra. How much would that come to in total?
          kate: That comes to £193 altogether. || That comes to one hundred and ninety-three pounds altogether.
          sam: OK. Do I pay now?
          kate: We just need a deposit of fifty pounds today to hold the date, and you pay the rest on the day of the party.
          sam: Fine. And is there anything the children need to bring?
          kate: Just trainers. They can't do the climbing wall in sandals or boots. And they should wear clothes that can get a bit dirty.
          sam: Perfect. And how long should we allow for the whole thing?
          kate: Three hours altogether, from two until five.
        `,
        groups: [
          notes(
            'Party details',
            limit(1, true),
            [
              '- activities: climbing wall, then a treasure hunt in the [[woods]]',
              '- if it rains: treasure hunt held in the games [[hall]]',
              '- parents must bring the [[cake]]',
              '- total cost: £[[193]]',
              '- children should wear [[trainers]]',
            ],
            [
              ['a treasure hunt in the woods behind the centre', 'The treasure hunt is outdoors in the woods.'],
              ['we move the treasure hunt indoors, to the games hall', 'The words “games” and “hall” together; “games” is printed.'],
              ["you'll need to bring the birthday cake yourself", 'The centre provides pizza and fruit, not the cake.'],
              ['That comes to £193', '£160 for twelve children plus 3 × £11 = £193. £50 is only the deposit.'],
              ['Just trainers', 'Sandals and boots are not allowed on the climbing wall.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['The maximum is twenty', 4, 'Not the number they are bringing.'],
      ['the price is the same for up to twelve', 4, 'Price detail, not the number.'],
      ['We provide pizza and fruit', 8, 'The centre provides these.'],
      ['a deposit of fifty pounds', 9, 'Only the deposit.'],
      ["They can't do the climbing wall in sandals or boots", 10, 'Not allowed.'],
    ],
  }),

  part({
    n: 2,
    title: 'Working at a summer festival',
    intro: 'You will hear a manager talking to people interested in working at a music festival.',
    speakers: [luke],
    blocks: [
      {
        lines: `
          luke: Good evening, everyone, and thanks for coming. I'm Daniel, the staff manager for the Riverside Music Festival, and I'm going to tell you about the jobs we have available this summer.
          luke: The festival started fifteen years ago as a one-day event for local bands. Today it runs over four days and attracts around forty thousand people, and we employ nearly six hundred temporary staff.
          luke: People often ask what the biggest change has been. You might expect me to say the size of the crowds, but in fact it's the attention we now pay to the environment. We banned single-use plastic three years ago, and all our power now comes from solar panels and batteries rather than diesel generators.
          luke: So who are we looking for? You don't need previous festival experience for most roles, but you do need to be at least eighteen, and you must be available for all four days of the festival, plus a training day the weekend before.
          luke: Everyone works shifts of eight hours. In return, you'll be paid the standard hourly rate, and you'll get free entry to the festival on your days off. Free camping is included, in a separate staff campsite, which is quieter than the public one.
          luke: One thing I always stress is that applications close at the end of this month. Please don't leave it to the last minute, because the training places fill up very quickly, and we can't employ anyone who hasn't completed the training.
        `,
        groups: [
          mcq([
            [
              'What has been the biggest change to the festival?',
              ['the number of visitors', 'its environmental policies', 'the length of the festival'],
              'B',
              "it's the attention we now pay to the environment",
              '“You might expect me to say the size of the crowds, but in fact…”',
            ],
            [
              'What do all applicants need?',
              ['previous festival experience', 'their own camping equipment', 'to be free for the whole festival'],
              'C',
              'you must be available for all four days of the festival',
              'Experience is not needed for most roles, and camping is provided.',
            ],
            [
              'What does the speaker say about the staff campsite?',
              ['It is free of charge.', 'It is next to the main stage.', 'It is shared with the public.'],
              'A',
              'Free camping is included',
              'It is separate from, and quieter than, the public campsite.',
            ],
            [
              'Why should people apply early?',
              ['The best jobs go first.', 'Training places are limited.', 'Pay is higher for early applicants.'],
              'B',
              'the training places fill up very quickly',
              'Nobody can be employed without the training.',
            ],
          ]),
        ],
      },
      {
        lines: `
          luke: Now let me run through the main types of job, as each has slightly different requirements.
          luke: Our car park team directs vehicles and helps with traffic at the start and end of each day. It's outdoor work in all weathers, so we ask you to bring waterproof clothing, but you don't need any particular qualifications.
          luke: The information team staffs the help points around the site, answering questions and dealing with lost children. For these jobs, speaking a second language is a real advantage, as we have many international visitors.
          luke: Food and drink stalls are run by outside businesses, but we provide staff to keep the eating areas clean and safe. For anyone serving food, there's a short food hygiene course, which we'll pay for.
          luke: The stage crew help set up equipment for the bands. This is the most physically demanding job, so you need to be fit and able to lift heavy loads. And because of the late finishes, these shifts end at around two in the morning.
          luke: Finally, the recycling team. They sort waste from across the site, and they're the people who've helped us cut the amount of rubbish going to landfill by more than half. Most of them actually start a week before the festival opens, to help prepare the site.
        `,
        groups: [
          matching(
            'What does the speaker say about each team? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 15–19.',
            'Information',
            [
              'members need to be physically strong',
              'members receive training that the festival pays for',
              'members should bring clothes for bad weather',
              'knowing another language is helpful',
              'members start work before the festival begins',
              'members must have a driving licence',
              'members work only during the day',
            ],
            [
              ['car park team', 'C', 'we ask you to bring waterproof clothing', 'Outdoor work in all weathers.'],
              ['information team', 'D', 'speaking a second language is a real advantage', 'Many visitors are international.'],
              ['food and drink team', 'B', "there's a short food hygiene course, which we'll pay for", 'The festival pays for the course.'],
              ['stage crew', 'A', 'you need to be fit and able to lift heavy loads', 'The most physically demanding job.'],
              ['recycling team', 'E', 'start a week before the festival opens', 'They help prepare the site.'],
            ],
          ),
          mcq([
            [
              'By how much has the recycling team reduced waste sent to landfill?',
              ['by about a quarter', 'by more than half', 'by three quarters'],
              'B',
              'by more than half',
              'The amount going to landfill has been cut by more than half.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['You might expect me to say the size of the crowds', 11, 'Not the biggest change.'],
      ["You don't need previous festival experience", 12, 'Not required.'],
      ['which is quieter than the public one', 13, 'The staff campsite is separate.'],
      ["you don't need any particular qualifications", 15, 'Car park team: no qualifications, but waterproofs.'],
      ['these shifts end at around two in the morning', 18, 'Late finishes, not daytime only.'],
    ],
  }),

  part({
    n: 3,
    title: 'A visit to a recycling plant',
    intro: 'You will hear two students, Amy and Josh, discussing a visit they made to a recycling plant for their environmental studies course.',
    speakers: [amy, josh],
    blocks: [
      {
        lines: `
          amy: So, Josh, what did you think of the visit to the recycling plant?
          josh: I was really impressed, actually. I expected it to be dirty and smelly, but it was surprisingly clean. What struck me most, though, was how much of the sorting is done by machines now.
          amy: Yes, the optical sorters were amazing. Using light to identify different plastics. Though the manager said they still need people at the end to catch mistakes.
          josh: Right. I was surprised by how much contamination there is. She said about a fifth of what arrives can't be recycled at all.
          amy: Mostly because of food left in containers, wasn't it?
          josh: That was one thing, but she said the biggest problem is people putting the wrong items in the recycling bin, things like nappies and garden waste.
          amy: That's what we should focus on in our report, I think. Not the technology, which is well documented, but the behaviour of the public.
          josh: I agree. The technology section in the textbook covers it all anyway. So what kind of data could we collect?
          amy: I wondered about a survey of students in our hall of residence, asking what they put in the recycling bins.
          josh: The trouble is, people don't always tell the truth in surveys. They know what they should do. Why don't we look inside the bins instead, with permission, and record what's actually there?
          amy: That's a much more reliable method. Messy, though.
          josh: We'll wear gloves. And we could compare two halls: one with clear labels on the bins and one without.
          amy: Oh, that's clever. Then we'd see whether labelling makes a difference.
          josh: Exactly. That would give us a recommendation at the end.
          amy: When should we do it? The week after the holidays might be unusual, because people are moving in.
          josh: True. Let's do it in the middle of the term, when things are normal.
        `,
        groups: [
          mcq([
            [
              'What surprised Josh most about the recycling plant?',
              ['how clean it was', 'how much work machines did', 'how many people worked there'],
              'B',
              'What struck me most, though, was how much of the sorting is done by machines now',
              'He mentions the cleanliness, but “what struck me most” was the machines.',
            ],
            [
              'According to the manager, the biggest cause of contamination is',
              ['food left in containers.', 'people putting the wrong items in bins.', 'mistakes made by the sorting machines.'],
              'B',
              'the biggest problem is people putting the wrong items in the recycling bin',
              'Food in containers is “one thing”, but not the biggest problem.',
            ],
            [
              'Why do the students decide not to focus on technology?',
              ['It is already well covered in the textbook.', 'It is too complicated to explain.', 'The manager could not answer their questions about it.'],
              'A',
              'The technology section in the textbook covers it all anyway',
              'Amy calls it well documented; Josh agrees the textbook covers it.',
            ],
            [
              'Why does Josh reject the idea of a survey?',
              ['It would take too long.', 'People may not answer honestly.', 'Too few students would reply.'],
              'B',
              "people don't always tell the truth in surveys",
              'People know what they should do, so they may not report what they actually do.',
            ],
            [
              'What will the students compare?',
              ['two halls with different bin labels', 'recycling in term time and holidays', 'two different recycling plants'],
              'A',
              'one with clear labels on the bins and one without',
              'This will show whether labelling makes a difference.',
            ],
            [
              'When will they collect their data?',
              ['just after the holidays', 'in the middle of the term', 'at the end of the term'],
              'B',
              "Let's do it in the middle of the term",
              'The week after the holidays may be unusual because people are moving in.',
            ],
          ]),
        ],
      },
      {
        lines: `
          amy: Before we start, we should decide how to present the findings. We looked at four example reports from last year. What did you think of them?
          josh: The one on food waste was the best, I thought. The charts were really clear, and you could understand the main findings straight away.
          amy: Mm. I liked it too, but I thought the conclusion was too long. It repeated everything.
          josh: Fair enough. What about the one on cycling?
          amy: Well researched, but it was really hard to follow. The sections were in a strange order.
          josh: Yes, I kept getting lost. And the report on water use?
          amy: I thought it had the best recommendations. They were practical and easy for the university to put into action.
          josh: True, though there wasn't much data behind them.
          amy: And the last one, on energy in the library?
          josh: That one had loads of data, but no real recommendations at the end. It just stopped.
          amy: So we want clear charts, a short conclusion, a logical order and practical recommendations.
          josh: Sounds like a plan.
        `,
        groups: [
          matching(
            'What do the students say about each example report? Choose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
            'Comments',
            [
              'It was badly organised.',
              'Its charts were easy to understand.',
              'It had useful suggestions for action.',
              'It had no recommendations.',
              'It was based on too few sources.',
              'It was too short.',
            ],
            [
              ['the report on food waste', 'B', 'The charts were really clear', 'Josh liked its charts, although Amy thought the conclusion was too long.'],
              ['the report on cycling', 'A', 'The sections were in a strange order', 'Hard to follow because of the order: badly organised.'],
              ['the report on water use', 'C', 'I thought it had the best recommendations', 'Practical recommendations the university could use.'],
              ['the report on energy in the library', 'D', 'no real recommendations at the end', 'Lots of data, but it “just stopped”.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['it was surprisingly clean', 21, 'Not what struck him most.'],
      ['Mostly because of food left in containers', 22, 'One cause, not the biggest.'],
      ['a survey of students in our hall of residence', 24, 'Rejected.'],
      ['The week after the holidays', 26, 'Rejected as unusual.'],
      ['the conclusion was too long', 27, 'A criticism, but the charts were the strength.'],
      ["there wasn't much data behind them", 29, 'A weakness, but the recommendations were good.'],
    ],
  }),

  part({
    n: 4,
    title: 'The history of map-making',
    intro: 'You will hear a lecture about the history of map-making.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: In today's lecture, I'm going to give you an overview of the history of map-making, or cartography, from its beginnings to the digital maps on our phones.
          prof: The oldest surviving maps are more than four thousand years old. One of the best known is a small clay tablet from Babylon, which shows the world as a flat disc surrounded by water. It's not a practical map; its purpose was to express a view of the universe rather than to help anyone find their way.
          prof: Practical maps developed largely for two reasons: owning land and collecting taxes. In ancient Egypt, for example, the annual flooding of the River Nile washed away the boundaries between fields, so officials had to measure and record them again every year.
          prof: The Greeks brought a more scientific approach. They knew the Earth was round, and one scholar calculated its circumference with remarkable accuracy, using the angle of the sun's shadow in two different cities. Later, Greek geographers introduced the idea of lines of latitude and longitude, a grid that is still used today.
          prof: In medieval Europe, many maps returned to a symbolic style, often placing Jerusalem at the centre of the world. At the same time, sailors in the Mediterranean were producing very practical charts showing coastlines and harbours in great detail, based on compass directions and their own experience.
          prof: The great voyages of the fifteenth and sixteenth centuries created a huge demand for accurate maps, and map-making became a profitable business. The invention of printing was crucial, because maps could now be copied cheaply and identically, rather than being drawn by hand, which always introduced errors.
          prof: A major problem was how to show the curved surface of the Earth on a flat page. Every method distorts something. The famous projection created in 1569 kept directions accurate, which made it extremely useful for navigation at sea, but it greatly exaggerated the size of countries far from the equator. Greenland, for example, appears as large as Africa, although Africa is actually about fourteen times bigger.
          prof: In the eighteenth and nineteenth centuries, national governments began systematic surveys of their territory. Teams measured the land using a method called triangulation, and the work often took decades. In Britain, the national survey was originally created for military purposes, which is reflected in its name.
          prof: The twentieth century brought aerial photography, and then satellites, which allowed the whole planet to be mapped in detail. Today, digital maps combine satellite images with information supplied by users, and they're updated constantly.
          prof: But this convenience has a cost. Some researchers argue that relying on satellite navigation weakens our own sense of direction, because we no longer need to build a mental picture of the places we travel through. In one study, people who used navigation apps remembered far less about a route than people who used a paper map.
        `,
        groups: [
          notes(
            'The history of map-making',
            limit(1),
            [
              '# Early maps',
              '- Babylonian clay tablet showed the world as a [[disc]] surrounded by water',
              '- in Egypt, floods destroyed field [[boundaries]], so they were measured every year',
              '# Greek and medieval maps',
              '- Greeks measured the Earth using the angle of the sun’s [[shadow]]',
              '- medieval sailors made charts of coastlines and [[harbours|harbors]]',
              '# Printing and projections',
              '- printing meant copies were cheap and had fewer [[errors]]',
              '- the 1569 projection kept [[directions]] accurate',
              '- it makes Greenland look as large as [[Africa]]',
              '# National surveys',
              '- land measured by [[triangulation]]',
              '- British survey first created for [[military]] purposes',
              '# Digital maps',
              '- users of navigation apps remembered less about a [[route]]',
            ],
            [
              ['shows the world as a flat disc surrounded by water', 'It expressed a view of the universe, not a practical map.'],
              ['washed away the boundaries between fields', 'Officials had to measure the fields again every year.'],
              ["using the angle of the sun's shadow in two different cities", 'This gave the Earth’s circumference.'],
              ['showing coastlines and harbours in great detail', 'Practical charts based on compass directions.'],
              ['drawn by hand, which always introduced errors', 'Printed copies were identical, so they had fewer errors.'],
              ['kept directions accurate', 'Useful for navigation, but it distorted size.'],
              ['Greenland, for example, appears as large as Africa', 'Africa is really about fourteen times bigger.'],
              ['a method called triangulation', 'Teams measured the land by triangulation.'],
              ['originally created for military purposes', 'Its name reflects this origin.'],
              ['remembered far less about a route', 'Compared with people who used a paper map.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['its purpose was to express a view of the universe', 31, 'Not a practical map.'],
      ['placing Jerusalem at the centre of the world', 34, 'Symbolic maps, not sailors’ charts.'],
      ['Africa is actually about fourteen times bigger', 37, 'The true size.'],
    ],
  }),
])
