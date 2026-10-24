import { flow, limit, matching, mcq, notes, part, person, sentences, table, test } from '../build'

const agent = person('agent', 'Josh', 'Letting agent', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')
const mia = person('mia', 'Mia', 'Caller', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const ruth = person('ruth', 'Ruth', 'Radio presenter', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const tutor = person('tutor', 'Dr Ellis', 'Tutor', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const kira = person('kira', 'Kira', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const prof = person('prof', 'Dr Webb', 'Lecturer', 'm', 'en-GB', 'JBFqnCBsd6RMkjVDRZzb')

export default test('full-06', [
  part({
    n: 1,
    title: 'Renting a flat',
    intro: 'You will hear a woman phoning a letting agency about flats to rent.',
    speakers: [agent, mia],
    blocks: [
      {
        lines: `
          agent: Good morning, Harbour Lettings, Josh speaking.
          mia: Hi. I'm moving to the city for a new job, and I'm looking for a one-bedroom flat.
          agent: Great, I can help with that. Can I start with your name?
          mia: Mia Lindqvist. That's L-I-N-D-Q-V-I-S-T. || Mia Lindqvist. That's L, I, N, D, Q, V, I, S, T.
          agent: Thanks. And when would you need to move in?
          mia: My job starts on the 1st of September, so ideally the last week of August. || My job starts on the first of September, so ideally the last week of August.
          agent: OK. And what's your budget per month?
          mia: I was hoping to keep it under eight hundred pounds. Nine hundred at the very most.
          agent: That's realistic for a one-bedroom place outside the centre. Is there an area you'd prefer?
          mia: My office is in the Docklands, so somewhere nearby. I don't drive, so it's important to be close to public transport.
          agent: I'll make a note. Any other requirements?
          mia: I have a cat, so the landlord would need to accept pets. That's the main thing.
          agent: That does narrow it down, but there are a few. And do you need it furnished?
          mia: No, I'm bringing my own furniture. Actually, a washing machine would be useful, but that's all.
        `,
        groups: [
          notes(
            'Customer details',
            limit(1, true),
            [
              '- name: Mia [[Lindqvist]]',
              '- wants to move in during the last week of [[August]]',
              '- maximum rent: £[[900]] per month',
              '- must be near public [[transport]]',
              '- landlord must accept a [[cat|pet|pets]]',
            ],
            [
              ['L-I-N-D-Q-V-I-S-T', 'The surname is spelt out.'],
              ['ideally the last week of August', 'Her job starts on 1 September.'],
              ['Nine hundred at the very most', 'She hopes for under £800, but £900 is the maximum.'],
              ["it's important to be close to public transport", 'She does not drive.'],
              ['I have a cat, so the landlord would need to accept pets', 'Pets are the main requirement.'],
            ],
          ),
        ],
      },
      {
        lines: `
          agent: Right, I've got three flats that might suit you. The first is on Mill Street. It's eight hundred and twenty pounds a month, and it's on the top floor of an old warehouse, so it has fantastic views of the river.
          mia: That sounds lovely. Is there a lift?
          agent: There isn't, unfortunately. It's four floors up.
          mia: Hmm. What else have you got?
          agent: The second is on Kenton Road. It's a bit cheaper, seven hundred and seventy-five. It's a ground-floor flat with its own small garden, which your cat might enjoy. The only drawback is that it's above a restaurant, so it can be noisy in the evenings.
          mia: Above a restaurant, but on the ground floor?
          agent: Sorry, I mean it's next to a restaurant. The kitchen extractor fan is right outside the bedroom window.
          mia: I see. And the third?
          agent: The third is in a new building on Quay Lane. It's eight hundred and ninety, so near the top of your budget, but the rent includes heating, which saves a lot in winter. And it's directly opposite the tram stop.
          mia: That's ideal for getting to work. Can I see that one and the garden flat this week?
          agent: How about Thursday at a quarter to six? I'll meet you at Quay Lane first.
          mia: Perfect.
        `,
        groups: [
          table(
            'Available flats',
            limit(2, true),
            ['Address', 'Rent per month', 'Advantage', 'Disadvantage'],
            [
              ['Mill Street', '£820', 'views of the [[river]]', 'no [[lift]]'],
              ['Kenton Road', '£[[775]]', 'has a small [[garden]]', 'next to a restaurant'],
              ['Quay Lane', '£890', 'rent includes [[heating]]', '—'],
            ],
            [
              ['fantastic views of the river', 'The top-floor flat in an old warehouse.'],
              ['Is there a lift?', 'There isn’t: the flat is four floors up.'],
              ['seven hundred and seventy-five', 'The garden flat costs £775.'],
              ['its own small garden', 'Her cat might enjoy it.'],
              ['the rent includes heating', 'This saves a lot in winter.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['I was hoping to keep it under eight hundred pounds', 3, 'Not the maximum.'],
      ["I'm bringing my own furniture", 5, 'Furniture is not needed.'],
      ["it's above a restaurant", 9, 'He corrects himself: it is next to a restaurant.'],
    ],
  }),

  part({
    n: 2,
    title: 'Eastgate Market',
    intro: 'You will hear a radio presenter talking about a food market in the city.',
    speakers: [ruth],
    blocks: [
      {
        lines: `
          ruth: Good afternoon, and welcome to City Weekend. Today I'm at Eastgate Market, which has just celebrated its hundred and fiftieth birthday.
          ruth: The market was built in Victorian times as a place for farmers to sell meat and vegetables. For most of its history it was a wholesale market, open in the early hours of the morning to shopkeepers and restaurant owners, not the general public.
          ruth: About twenty years ago, the wholesale trade moved to a new site outside the city, and the old building was nearly turned into a car park. What saved it was a campaign by local residents, who collected thousands of signatures, and the council agreed to keep it as a public market.
          ruth: Today, Eastgate has more than ninety stalls. It's open six days a week, but not on Mondays, when the whole building is cleaned. And Saturday is by far the busiest day, so if you don't like crowds, come on a weekday morning.
          ruth: One thing that's changed recently is the rubbish. Traders used to throw away huge amounts of unsold food at the end of each day. Now, everything that's still fit to eat is collected by a charity and given to people in need.
        `,
        groups: [
          mcq([
            [
              'Who used the market for most of its history?',
              ['local farmers only', 'shop and restaurant owners', 'members of the public'],
              'B',
              'open in the early hours of the morning to shopkeepers and restaurant owners',
              'It was a wholesale market, not for the general public.',
            ],
            [
              'What saved the market building?',
              ['a campaign by residents', 'a decision by the traders', 'money from a charity'],
              'A',
              'What saved it was a campaign by local residents',
              'They collected thousands of signatures and the council agreed.',
            ],
            [
              'Why is the market closed on Mondays?',
              ['Deliveries arrive that day.', 'The building is cleaned.', 'It is the quietest day.'],
              'B',
              'not on Mondays, when the whole building is cleaned',
              'Saturday is the busiest day; Monday is for cleaning.',
            ],
            [
              'What happens to unsold food now?',
              ['It is sold at a lower price.', 'It is used to make compost.', 'It is given away by a charity.'],
              'C',
              'collected by a charity and given to people in need',
              'Traders used to throw it away.',
            ],
          ]),
        ],
      },
      {
        lines: `
          ruth: Now, I've been walking round the market this morning, and I'd like to recommend a few of my favourite stalls.
          ruth: First, Harlow's Bakery. They've been here since the market opened, the only stall that has, and they still use the same family recipe for their bread.
          ruth: Then there's the Green Basket. They sell fruit and vegetables, and everything comes from farms within thirty miles of the city. You'll pay a bit more, but you know exactly where it's from.
          ruth: If you're after something unusual, try Spice Route. The owner, Priya, will let you taste anything before you buy, and she gives out free recipe cards with every purchase.
          ruth: The Fish Shed is worth a visit too, but go early. They only buy what the boats bring in that morning, and when it's gone, it's gone. Most days they've sold out by eleven.
          ruth: Next, Mountain Cheese, run by two brothers. They're the only stall in the market that takes orders online, so you can collect your cheese without queuing.
          ruth: And finally, the Corner Café, which is the perfect place to finish. It's not cheap, but all the profits go towards training young people who want to work in the food business.
        `,
        groups: [
          matching(
            'What does the speaker say about each stall? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.',
            'Comments',
            [
              'It sells only local produce.',
              'It often runs out of stock early.',
              'It has been in the market the longest.',
              'Customers can order in advance.',
              'It supports a training scheme.',
              'Customers can try products for free.',
              'It offers discounts to students.',
              'It has recently moved to a larger stall.',
            ],
            [
              ["Harlow's Bakery", 'C', "They've been here since the market opened, the only stall that has", 'The only stall that has been there since the beginning.'],
              ['the Green Basket', 'A', 'everything comes from farms within thirty miles of the city', 'All the produce is local.'],
              ['Spice Route', 'F', 'will let you taste anything before you buy', 'Free tasting; the recipe cards are a distractor.'],
              ['the Fish Shed', 'B', "Most days they've sold out by eleven", 'When the fish has gone, it has gone.'],
              ['Mountain Cheese', 'D', 'the only stall in the market that takes orders online', 'Customers can collect without queuing.'],
              ['the Corner Café', 'E', 'all the profits go towards training young people', 'Profits fund training for young people.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['a place for farmers to sell meat and vegetables', 11, 'The original idea, not who used it.'],
      ['the old building was nearly turned into a car park', 12, 'It was saved.'],
      ['Saturday is by far the busiest day', 13, 'Not why it closes on Monday.'],
      ["You'll pay a bit more", 16, 'Price is not the point; the produce is local.'],
      ["It's not cheap", 20, 'The café supports training.'],
    ],
  }),

  part({
    n: 3,
    title: 'Research on urban noise',
    intro: 'You will hear a student, Kira, talking to her tutor about her research project on noise in cities.',
    speakers: [tutor, kira],
    blocks: [
      {
        lines: `
          tutor: Come in, Kira. So how's the noise project going?
          kira: Quite well, I think. I've finished the literature review, and I've got a clearer idea of my research question now.
          tutor: Good. Remind me what it is.
          kira: Originally I wanted to look at how traffic noise affects sleep, but there's already a huge amount of research on that. So now I'm looking at whether green spaces, like parks, make people feel that an area is quieter, even when the actual noise level is the same.
          tutor: That's a much more original question. What made you think of it?
          kira: Partly my own experience. I live next to a busy road, but my flat looks over a park, and it never feels as noisy as my friend's flat, which faces a car park.
          tutor: Interesting. What did you find in the literature?
          kira: There are a few studies, mostly from Scandinavia. They suggest that seeing trees really does change how loud people think a place is. But most of them were done in laboratories, using recordings and photos, not in real streets.
          tutor: So that's the gap you can fill. Have you thought about where you'll collect data?
          kira: I've chosen two streets with very similar traffic. One has trees along it and one doesn't. I measured the noise in both last week, and the levels were almost identical.
          tutor: That's an excellent start. What will you do about the time of day?
          kira: I'll do all the interviews between ten and twelve in the morning, so that the traffic is roughly the same.
          tutor: Sensible. One thing to watch out for is the weather. People may feel more positive about any street on a sunny day.
          kira: I hadn't thought of that. I'll make sure I visit both streets on the same days.
        `,
        groups: [
          mcq([
            [
              'Why did Kira change her research question?',
              ['Her first topic had already been well researched.', 'She could not get permission for her first topic.', 'Her tutor suggested a different topic.'],
              'A',
              "there's already a huge amount of research on that",
              'She moved from traffic and sleep to green spaces and perceived noise.',
            ],
            [
              'What gave Kira the idea for her project?',
              ['a lecture she attended', 'her own home', 'a friend’s research'],
              'B',
              'Partly my own experience',
              'Her flat looks over a park and feels quieter than her friend’s flat.',
            ],
            [
              'What does Kira say about earlier studies?',
              ['They found no effect of trees.', 'Most were not carried out in real streets.', 'They were mainly carried out in Asia.'],
              'B',
              'most of them were done in laboratories',
              'They used recordings and photos; most came from Scandinavia.',
            ],
            [
              'What did Kira find when she measured noise in the two streets?',
              ['The street with trees was quieter.', 'The levels changed during the day.', 'The levels were about the same.'],
              'C',
              'the levels were almost identical',
              'Both streets have very similar traffic.',
            ],
            [
              'What problem does the tutor point out?',
              ['the weather could affect people’s answers', 'the interviews are too short', 'the traffic may vary'],
              'A',
              'People may feel more positive about any street on a sunny day',
              'Kira will visit both streets on the same days.',
            ],
          ]),
        ],
      },
      {
        lines: `
          tutor: Let's go through the procedure for each interview, step by step.
          kira: OK. First, I approach people and explain the project. I'll only interview adults who live or work in the street, not tourists.
          tutor: Why not tourists?
          kira: Because they don't know the area, so their answers wouldn't really tell me much.
          tutor: Fine. Then what?
          kira: I'll ask them to sign a consent form. Then they stand in one place for two minutes, just listening, with their eyes open.
          tutor: And after that?
          kira: They rate how loud they think the street is, on a scale from one to ten.
          tutor: Will you ask them anything else?
          kira: Yes. I'll ask them to describe the sounds they noticed, in their own words. I'll record their answers on my phone, so I don't have to write everything down.
          tutor: Good. And finally?
          kira: Finally, I'll give them a small voucher for a local café, to thank them for their time.
          tutor: That should help with recruitment. How many people are you aiming for?
          kira: Forty in each street, so eighty altogether.
          tutor: That's enough for some useful statistics. Well done, Kira.
        `,
        groups: [
          flow(
            'Interview procedure',
            limit(1),
            [
              'Explain the project to adults who [[live]] or work in the street',
              'Ask them to sign a [[consent]] form',
              'They listen for two [[minutes]] with eyes open',
              'They rate the loudness on a [[scale]] from 1 to 10',
              'They describe the sounds; answers are recorded on a [[phone]]',
              'They receive a voucher for a local café',
            ],
            [
              ['adults who live or work in the street', 'Tourists are not interviewed.'],
              ["I'll ask them to sign a consent form", 'The second step.'],
              ['they stand in one place for two minutes', 'Listening with their eyes open.'],
              ['on a scale from one to ten', 'Their rating of how loud the street is.'],
              ["I'll record their answers on my phone", 'So she does not have to write everything down.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Originally I wanted to look at how traffic noise affects sleep', 21, 'Her original topic.'],
      ['mostly from Scandinavia', 23, 'Location of the studies, not the problem with them.'],
      ['not tourists', 26, 'Tourists are excluded.'],
    ],
  }),

  part({
    n: 4,
    title: 'How habits form',
    intro: 'You will hear a lecture about how habits are formed and changed.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today we're looking at habits: actions we repeat so often that we perform them almost without thinking.
          prof: It's been estimated that around forty per cent of what we do each day is habitual rather than the result of a conscious decision. That's not a weakness. Habits free up the brain to deal with new or difficult problems.
          prof: Habits are controlled largely by a region deep in the brain called the basal ganglia. When we first learn a task, such as driving, the front of the brain, which handles planning, is very active. As the task becomes automatic, activity shifts to these deeper structures.
          prof: Researchers often describe a habit as a loop with three parts. First there's a cue, something that triggers the behaviour. It could be a place, a time of day, or a feeling such as boredom. Then comes the routine, the behaviour itself. And finally there's the reward, which tells the brain that the loop is worth remembering.
          prof: How long does it take to form a habit? You may have heard that it takes twenty-one days. That figure has no real scientific basis. In one well-known study, volunteers chose a new healthy behaviour, such as eating fruit at lunch, and the average time for it to become automatic was sixty-six days, although it varied enormously between people.
          prof: The same study found that missing a single day didn't make much difference. What mattered was repetition in a consistent setting.
          prof: Breaking bad habits is harder, because the old loop doesn't disappear; it's simply overwritten. One of the most effective strategies is to change the environment. People who move house, for example, find it easier to change their habits, because many of the old cues are gone.
          prof: Another approach is to keep the cue and the reward but replace the routine. Someone who snacks when they're stressed might go for a short walk instead. The cue, stress, stays the same, and so does the reward, a feeling of relief.
          prof: Finally, a word about willpower. People who seem to have great self-control don't actually resist temptation more often. Studies suggest they simply arrange their lives so that they face fewer temptations in the first place.
        `,
        groups: [
          notes(
            'Habits',
            limit(1, true),
            [
              '- about [[40|forty]] per cent of daily actions are habitual',
              '- habits allow the brain to focus on new or [[difficult]] problems',
              '- when learning a task, the front of the brain handles [[planning]]',
              '# The habit loop',
              '- cue: e.g. a place, a time or a feeling such as [[boredom]]',
              '- routine: the behaviour itself',
              '- reward: tells the brain to [[remember]] the loop',
              '- average time to form a habit in one study: [[66|sixty-six]] days',
            ],
            [
              ['around forty per cent of what we do each day is habitual', 'Habitual rather than a conscious decision.'],
              ['to deal with new or difficult problems', 'Habits free up the brain.'],
              ['the front of the brain, which handles planning, is very active', 'Later, activity shifts to the basal ganglia.'],
              ['a feeling such as boredom', 'Cues can be places, times or feelings.'],
              ['the loop is worth remembering', 'The reward tells the brain to remember it. “Remember” and “remembering” are the same word.'],
              ['the average time for it to become automatic was sixty-six days', 'Not twenty-one days, which has no scientific basis.'],
            ],
          ),
          sentences(
            limit(2),
            [
              'In the study, what mattered most was repetition in a consistent [[setting]].',
              'People who move house find it easier to change habits because many old [[cues]] disappear.',
              'Someone who snacks under stress could take a short [[walk]] instead.',
              'People with strong self-control arrange their lives to face fewer [[temptations]].',
            ],
            [
              ['What mattered was repetition in a consistent setting', 'Missing a single day made little difference.'],
              ['because many of the old cues are gone', 'Changing the environment removes cues.'],
              ['might go for a short walk instead', 'The cue and reward stay the same; the routine changes.'],
              ['they face fewer temptations in the first place', 'They do not resist temptation more often.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['it takes twenty-one days', 36, 'A myth; the study found sixty-six.'],
      ["missing a single day didn't make much difference", 37, 'Not what mattered.'],
      ["don't actually resist temptation more often", 40, 'They avoid temptations instead.'],
    ],
  }),
])
