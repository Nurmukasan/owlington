import type { MapSpec } from '../practice-data'
import { choose2, form, limit, matching, map, mcq, notes, part, person, test } from '../build'

const MUSEUM: MapSpec = {
  title: 'Riverside Museum, ground floor',
  description:
    'Plan of the museum ground floor, with north at the top. The main entrance, marked You are here, is in the middle of the south wall and opens into a lobby. ' +
    'North of the lobby is the large Main Hall in the centre of the building. Three rooms run down the west side of the building and three down the east side; ' +
    'the room in the south-west corner is the Shop. One more room lies at the far north end of the Main Hall, opposite the entrance. ' +
    'Letter A is the middle room on the west side. Letter B is the room in the north-west corner. Letter C is the room at the north end, opposite the entrance. ' +
    'Letter D is the room in the north-east corner. Letter E is the middle room on the east side. Letter F is the room in the south-east corner. ' +
    'Letter G is in the lobby, to the left of the entrance.',
  ground: 'floor',
  shapes: [
    { kind: 'room', x: 30, y: 320, w: 170, h: 110, label: 'Shop' },
    { kind: 'room', x: 30, y: 180, w: 170, h: 120 },
    { kind: 'room', x: 30, y: 30, w: 170, h: 130 },
    { kind: 'room', x: 220, y: 30, w: 200, h: 120 },
    { kind: 'room', x: 440, y: 30, w: 170, h: 130 },
    { kind: 'room', x: 440, y: 180, w: 170, h: 120 },
    { kind: 'room', x: 440, y: 320, w: 170, h: 110 },
    { kind: 'stage', x: 220, y: 170, w: 200, h: 180, label: 'Main Hall' },
    { kind: 'label', x: 380, y: 400, text: 'Lobby', small: true },
  ],
  points: { A: [115, 240], B: [115, 95], C: [320, 90], D: [525, 95], E: [525, 240], F: [525, 375], G: [262, 395] },
  here: [320, 410],
  hereLabel: 'ENTRANCE',
}

const sophie = person('sophie', 'Sophie', 'Booking agent', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const peter = person('peter', 'Peter', 'Caller', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')
const guide = person('guide', 'Mark', 'Museum guide', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const emma = person('emma', 'Emma', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const raj = person('raj', 'Raj', 'Student', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')
const lecturer = person('lecturer', 'Dr Hughes', 'Lecturer', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')

export default test('full-01', [
  part({
    n: 1,
    title: 'Booking a holiday cottage',
    intro: 'You will hear a man phoning a company that rents out holiday cottages.',
    speakers: [sophie, peter],
    blocks: [
      {
        lines: `
          sophie: Good morning, Seaview Cottages, Sophie speaking. How can I help you?
          peter: Oh, hi. I saw your website and I'm interested in renting one of your cottages this summer.
          sophie: Lovely. Do you have a particular cottage in mind?
          peter: Yes, the one called Gull Cottage. The one with the blue door in the photos.
          sophie: Gull Cottage, yes, that's one of our most popular. Let me take a few details first. Could I have your name, please?
          peter: Sure. It's Peter Halloran.
          sophie: Could you spell your surname for me?
          peter: Yeah, it's H-A-L-L-O-R-A-N. || Yeah, it's H, A, double L, O, R, A, N.
          sophie: Thank you. And is a mobile number the best way to contact you?
          peter: Yes, it is. It's 07812 334906. || Yes, it is. It's oh seven eight one two, three three four, nine oh six.
          sophie: 07812 334906. Thanks. Now, when were you hoping to arrive? || Oh seven eight one two, three three four, nine oh six. Thanks. Now, when were you hoping to arrive?
          peter: Well, ideally on Saturday the 7th of July.
          sophie: Let me look. Oh, I'm sorry, Gull Cottage is already booked that week. But it's free from the following Saturday, the 14th.
          peter: The 14th. OK, that should still work for us. We'll take that.
          sophie: And how many nights would you like?
          peter: We were thinking of a week, but as we're arriving later, could we make it ten nights?
          sophie: Ten nights is fine. The cottage is free until the end of the month.
          peter: Great.
          sophie: And who will be staying?
          peter: Me, my wife and our son. Oh, and we'd like to bring our dog, if that's allowed.
          sophie: Yes, Gull Cottage is one of the few where pets are welcome. A cat would be fine too, but most people bring dogs.
        `,
        groups: [
          form(
            'Seaview Cottages — booking enquiry',
            limit(1, true),
            [
              '= Cottage: Gull Cottage',
              'Name: Peter [[Halloran]]',
              'Mobile: [[07812 334906]]',
              'Arrival: Saturday [[14|14th]] July',
              'Length of stay: [[10|ten]] nights',
              'Pet: one [[dog]]',
            ],
            [
              ['H-A-L-L-O-R-A-N', 'The surname is spelt out. Double letters are said as “double L”: write both.'],
              ["It's 07812 334906", 'Phone numbers are read in groups. Spaces in your answer do not matter, but every digit does.'],
              ['free from the following Saturday, the 14th', 'He wanted the 7th, but the cottage is booked that week, so he takes the 14th.'],
              ['could we make it ten nights', 'A week was the first plan; because they arrive later, he asks for ten nights.'],
              ['we\'d like to bring our dog', 'A cat is mentioned only as something that would also be allowed.'],
            ],
          ),
        ],
      },
      {
        lines: `
          peter: Can I ask a few things about the cottage itself?
          sophie: Of course.
          peter: The photos show a small yard. Is there any outdoor space for the dog?
          sophie: Actually, the yard you saw is at Puffin Cottage next door. Gull Cottage has a large garden at the back, with a fence all the way round, so it's perfect for a dog.
          peter: Oh, that's good to know. What about shops? We won't have a car for the first couple of days.
          sophie: There's a supermarket in the town, but that's a twenty-minute walk. The nearest shop is a small grocer's next to the harbour, only about five minutes away. It sells most of the basics.
          peter: Perfect. Now, do we need to bring our own sheets and towels?
          sophie: You can, but we can also provide them. Bedding and towels cost £18 per person for the whole stay. || You can, but we can also provide them. Bedding and towels cost eighteen pounds per person for the whole stay.
          peter: Eighteen pounds each. Hmm, I think we'll bring our own towels, but we'll have the bedding.
          sophie: Bedding only is £12 per person. I'll note that down. || Bedding only is twelve pounds per person. I'll note that down.
          peter: Thanks. And is it possible to hire bikes nearby? My son's very keen on cycling.
          sophie: The bike shop in town closed last year, unfortunately. But the campsite on the coast road hires out bikes by the day, and they're very reasonable.
          peter: The campsite. Great. And finally, how do we get the key? Will someone meet us?
          sophie: Our office closes at five on Saturdays, so we leave the keys with the café on the corner of Harbour Street. Just give them your name.
          peter: That's easy. Thank you so much for your help.
          sophie: You're welcome. I'll email you the booking confirmation this afternoon.
        `,
        groups: [
          notes(
            'Gull Cottage: information',
            limit(1, true),
            [
              '- has a large fenced [[garden]]',
              '- nearest shop: next to the [[harbour]]',
              '- bedding: £[[12]] per person (they will bring their own towels)',
              '- bikes can be hired from the [[campsite]]',
              '- collect the key from the [[café|cafe]]',
            ],
            [
              ['Gull Cottage has a large garden at the back', 'The yard in the photos belongs to the cottage next door.'],
              ['a small grocer\'s next to the harbour', 'The supermarket is in the town, but it is not the nearest shop.'],
              ['Bedding only is £12 per person', '£18 covers bedding and towels; they only want bedding, so the price is £12.'],
              ['the campsite on the coast road hires out bikes', 'The bike shop in town closed last year.'],
              ['we leave the keys with the café', 'The office is closed when they arrive, so the keys are left at the café.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Saturday the 7th of July', 3, 'The cottage is booked that week.'],
      ['We were thinking of a week', 4, 'They change the plan to ten nights.'],
      ['A cat would be fine too', 5, 'Only a possibility, not their pet.'],
      ['the yard you saw is at Puffin Cottage', 6, 'The yard belongs to the cottage next door.'],
      ["There's a supermarket in the town", 7, 'Not the nearest shop.'],
      ['Bedding and towels cost £18 per person', 8, 'They only take bedding.'],
      ['The bike shop in town closed last year', 9, 'It no longer exists.'],
      ['Our office closes at five', 10, 'The key is not collected from the office.'],
    ],
  }),

  part({
    n: 2,
    title: 'A museum reopens',
    intro: 'You will hear a guide welcoming visitors to a museum that has just reopened.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Good morning, everyone, and welcome to the Riverside Museum. My name's Mark, and I'm one of the guides here. It's wonderful to see so many people on our first weekend back.
          guide: As some of you will know, the museum has been closed for nearly two years. Many people assumed this was because of the flood in the basement a few winters ago, but that damage was actually repaired within a couple of months.
          guide: The real reason for the long closure was the roof. The old glass roof over the Main Hall had become unsafe, and replacing it turned out to be a much bigger job than anyone expected.
          guide: While the builders were here, we also took the opportunity to make some other changes. The thing most visitors notice first is the lighting. We've replaced all the old lamps in the galleries, which means the colours in our paintings look much closer to how the artists intended.
          guide: We had hoped to open a rooftop terrace as well, but unfortunately that will have to wait until we can raise more money.
          guide: Now, a few practical points. Entry to the permanent collection is still free for everyone, as it always has been. The special exhibitions do have a charge, but there's no charge at all for children under twelve, and students get half price if they show a card.
          guide: Some of you have asked about guided tours. These run every day at eleven and at three. They're very popular, so I'd recommend booking a place in advance. Please don't wait at the main entrance for the tour; the guides meet each group by the shop, where it's quieter.
        `,
        groups: [
          mcq([
            [
              'Why was the museum closed for nearly two years?',
              ['A flood damaged the basement.', 'The roof had to be replaced.', 'A terrace was being built on the roof.'],
              'B',
              'The real reason for the long closure was the roof',
              '“Many people assumed” the flood was the reason, but that was repaired within months. “The real reason” signals the answer.',
            ],
            [
              'What change do visitors notice first?',
              ['the new lighting', 'the rooftop terrace', 'the larger shop'],
              'A',
              'The thing most visitors notice first is the lighting',
              'The terrace has not been built yet, and the shop is not described as larger.',
            ],
            [
              'Who can visit the special exhibitions free of charge?',
              ['students with a card', 'everyone', 'children under twelve'],
              'C',
              "there's no charge at all for children under twelve",
              'Students get half price, not free entry; the permanent collection (not the special exhibitions) is free for everyone.',
            ],
            [
              'Where do the guided tours start?',
              ['at the main entrance', 'by the shop', 'in the Main Hall'],
              'B',
              'the guides meet each group by the shop',
              '“Please don’t wait at the main entrance” rules out A.',
            ],
          ]),
        ],
      },
      {
        lines: `
          guide: Now, if you look at the plan of the ground floor, I'll show you where everything is. We're standing at the main entrance, at the bottom of the plan.
          guide: The first thing you'll probably want is the cloakroom, for coats and bags. As you come in through the main entrance, the cloakroom is immediately on your left, in the lobby, before you go into the Main Hall.
          guide: On the left-hand side of the building, the room in the corner is the shop, which you can see on your plan. If you walk past the shop, the next room along that side is our new Children's Discovery Room, full of things to touch and try.
          guide: People often ask about the room in the top left-hand corner. That used to be the library, but it's now used as offices, so it isn't open to the public.
          guide: If you walk straight through the Main Hall to the far end, directly opposite the entrance, you'll come to the lecture theatre, where we hold talks every Thursday evening.
          guide: The café is in the top right-hand corner of the building. It used to be next to the shop, but it's moved so that it gets more light in the afternoons.
          guide: On the right-hand side of the Main Hall, the middle room on that side is where we put on our temporary exhibitions. At the moment it's showing photographs of the river from the last hundred years.
          guide: And finally, the toilets. They're in the bottom right-hand corner of the building, so if you turn right as you come in, they're just beyond the lobby.
          guide: Right, I'll let you explore. Enjoy your visit.
        `,
        groups: [
          map(MUSEUM, [
            ['Cloakroom', 'G', 'the cloakroom is immediately on your left, in the lobby', 'Coming in through the entrance, it is on your left, in the lobby: G.'],
            ["Children's Discovery Room", 'A', "the next room along that side is our new Children's Discovery Room", 'Past the shop on the left-hand side, the next room is A. B is the old library, now offices.'],
            ['Lecture theatre', 'C', 'directly opposite the entrance, you\'ll come to the lecture theatre', 'Straight through the Main Hall to the far end: C.'],
            ['Café', 'D', 'The café is in the top right-hand corner of the building', 'It used to be next to the shop, but it has moved to the top right-hand corner: D.'],
            ['Temporary exhibitions', 'E', 'the middle room on that side is where we put on our temporary exhibitions', 'On the right-hand side, the middle room: E.'],
            ['Toilets', 'F', "They're in the bottom right-hand corner of the building", 'Bottom right-hand corner: F.'],
          ]),
        ],
      },
    ],
    traps: [
      ['because of the flood in the basement', 11, 'The flood damage was repaired quickly.'],
      ['We had hoped to open a rooftop terrace', 12, 'It has not been built.'],
      ['students get half price', 13, 'Half price is not free.'],
      ["don't wait at the main entrance", 14, 'Tours do not start there.'],
      ['That used to be the library', 16, 'Room B is offices, not open to the public.'],
      ['It used to be next to the shop', 18, 'The café has moved.'],
    ],
  }),

  part({
    n: 3,
    title: 'A project on city bees',
    intro: 'You will hear two environmental science students, Emma and Raj, discussing a project on beekeeping in cities.',
    speakers: [emma, raj],
    blocks: [
      {
        lines: `
          emma: So, Raj, we need to decide on the focus of our project. I was thinking about city beekeeping, since there's so much about it in the news.
          raj: Yes, I'm happy with that. I read that the number of hives on rooftops in some cities has more than doubled in the last ten years.
          emma: Right. But what actually interested me was a claim I came across that city bees produce more honey than bees in the countryside.
          raj: I've heard that too. Apparently it's because cities have such a variety of flowers in parks and gardens, all flowering at different times, whereas in the countryside a lot of farmland has only one crop.
          emma: Mm. Though I also read that if there are too many hives in one area, the bees run out of flowers, and wild bees suffer because they're competing for the same food.
          raj: That's a good point. Maybe that should be the main question in our project: whether adding more hives in cities actually harms wild bees.
          emma: Yes, I like that much better than just describing how to keep bees. It gives us something to argue about.
          raj: OK. So how are we going to collect our data? I suppose we could count bees in different parks.
          emma: I'd thought about that, but we'd need to identify dozens of species of wild bee, and neither of us is an expert. I think it would be more realistic to interview beekeepers and the people who manage the city's parks.
          raj: That makes sense. We could still do some observation, but just counting how many flowers are available in each park, rather than counting bees.
          emma: Good idea. That's something we can actually do accurately.
          raj: What about the presentation? Dr Patel said we could either give a talk or make a poster.
          emma: I'd prefer a talk, but she also said that groups doing posters get more time to discuss their work with the examiners, didn't she?
          raj: She did. And a poster would let us show the maps of the parks. I think that's the deciding factor.
          emma: Fine, a poster it is.
        `,
        groups: [
          mcq([
            [
              'What first made Emma interested in city beekeeping?',
              ['the rise in the number of rooftop hives', 'a claim about honey production', 'news reports about wild bees'],
              'B',
              'what actually interested me was a claim I came across that city bees produce more honey',
              'Raj mentions the rise in hives, and Emma mentions the news generally, but what “actually interested” her was the claim about honey.',
            ],
            [
              'What do the students decide will be the main question of their project?',
              ['how to keep bees successfully in a city', 'why city bees produce more honey', 'whether more hives in cities harm wild bees'],
              'C',
              'whether adding more hives in cities actually harms wild bees',
              'Emma prefers this to “just describing how to keep bees”.',
            ],
            [
              'Why does Emma reject the idea of counting bees?',
              ['They would need to identify too many species.', 'It would take too long.', 'The parks would not give permission.'],
              'A',
              "we'd need to identify dozens of species of wild bee, and neither of us is an expert",
              'Her reason is the number of species and their lack of expertise.',
            ],
            [
              'Why do the students choose to make a poster?',
              ['It is easier to prepare than a talk.', 'They will have more time to discuss it with examiners.', 'Dr Patel recommended it.'],
              'B',
              'groups doing posters get more time to discuss their work with the examiners',
              'Raj calls this “the deciding factor”. Showing maps is a second advantage. Dr Patel only gave them the choice.',
            ],
          ]),
        ],
      },
      {
        lines: `
          raj: Now, Dr Patel gave us a list of sources. Should we go through them and decide which ones to use?
          emma: Yes. The first one is the government report on pollinators.
          raj: That's very detailed, and it's up to date. I think we should rely on it more than anything else. It can be our main source.
          emma: Agreed. Next is the website of the City Beekeepers' Club.
          raj: It's interesting, but they obviously want more people to keep bees, so they're not exactly neutral. We could use it to explain how city beekeeping works, but only as background.
          emma: Fine. Then there's the newspaper article about the honey festival.
          raj: Hmm, that's mostly about the festival itself. I don't think it tells us anything useful for our question. Let's leave it out.
          emma: OK. And the last one is the university study on wild bees in London parks.
          raj: That one's exactly on our topic. But it's twelve years old, and there are far more hives now. I'd use it, but only for background, to show how things were before.
          emma: Yes, we can't treat it as our main evidence. So that's one main source, two for background and one rejected.
          raj: Before we finish, I wanted to mention two things that went wrong last term, so we don't repeat them.
          emma: Go on.
          raj: Well, first, we left the writing of the conclusion until the night before the deadline, and it showed. This time let's write it together, a week early.
          emma: Definitely. And the other?
          raj: We forgot to check that all our references were in the right format, and we lost marks for that.
          emma: True. Though I don't think the length was a problem; we were well within the word limit. And our graphs were fine.
          raj: Yes, the tutor actually praised the graphs.
        `,
        groups: [
          matching(
            'What do the students decide about each source? Choose the correct letter, A, B or C.',
            'Decisions',
            ['use as the main source', 'use only for background', 'do not use'],
            [
              ['the government report', 'A', 'It can be our main source', 'It is detailed and up to date, so they will rely on it most.'],
              ["the Beekeepers' Club website", 'B', 'only as background', 'It is not neutral, so it can only explain how city beekeeping works.'],
              ['the newspaper article', 'C', "Let's leave it out", 'It is about the festival, not their question.'],
              ['the university study', 'B', "I'd use it, but only for background", 'It is on their topic but twelve years old, so it only shows how things were before.'],
            ],
          ),
          choose2(
            'Which TWO problems from their last project do the students want to avoid?',
            ['writing the conclusion too late', 'going over the word limit', 'using the wrong format for references', 'producing unclear graphs', 'choosing too broad a topic'],
            ['A', 'C'],
            [
              ['we left the writing of the conclusion until the night before the deadline', 'The conclusion was rushed, so this time they will write it a week early.'],
              ['We forgot to check that all our references were in the right format', 'They lost marks for references. Length and graphs were not problems.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['the number of hives on rooftops', 21, 'Raj’s fact, not what interested Emma.'],
      ['just describing how to keep bees', 22, 'Rejected as the focus.'],
      ["That one's exactly on our topic", 28, 'On topic, but too old to be the main source.'],
      ["I don't think the length was a problem", 29, 'They stayed within the limit.'],
      ['the tutor actually praised the graphs', 30, 'Graphs were a strength.'],
    ],
  }),

  part({
    n: 4,
    title: 'The history of glass',
    intro: 'You will hear a lecture about the history of glass-making.',
    speakers: [lecturer],
    blocks: [
      {
        lines: `
          lecturer: Good morning. Today I want to look at a material we use every day without really thinking about it: glass.
          lecturer: Glass is made mainly from sand, heated with other substances until it melts. Natural glass actually exists: when lightning strikes sand, or when a volcano erupts, glass can form. People were using natural volcanic glass for sharp tools long before anyone knew how to make it.
          lecturer: The first glass made by people seems to have appeared in Mesopotamia, around four and a half thousand years ago. At first it was used not for windows or containers but for beads, which were valued as highly as precious stones.
          lecturer: Making a glass container was extremely difficult. Early craftsmen formed glass around a core made of clay and dung, and then removed the core once the glass had cooled. Because the process was so slow, glass vessels were luxury objects, owned only by the wealthy.
          lecturer: Everything changed in the first century BCE, with the invention of glass-blowing, probably somewhere on the eastern coast of the Mediterranean. By blowing air through a hollow tube into a ball of molten glass, a worker could make a vessel in minutes rather than days. Glass suddenly became cheap enough for ordinary people, and the Romans spread the technique throughout their empire.
          lecturer: The Romans were also the first to use glass in windows, although Roman window glass was thick and cloudy, and it let in light without allowing people to see clearly through it.
          lecturer: Moving forward to the Middle Ages, the most spectacular use of glass was in the stained-glass windows of European cathedrals. Colour was added by mixing metals into the glass while it was melted; for example, copper could produce green or red, depending on how it was heated. These windows were designed to tell religious stories to people who could not read.
          lecturer: In the fifteenth century, the island of Murano, near Venice, became the most famous glass-making centre in the world. The Venetian government moved all the glass furnaces there, officially because of the risk of fire in the city. But it also made it easier to control the glass-makers, who were not allowed to leave and take their secrets abroad.
          lecturer: Murano's most important achievement was a very clear glass, almost like rock crystal. This made possible high-quality mirrors, which were extremely expensive at first.
          lecturer: Clear glass also led to a major scientific development: the lens. Spectacles appeared in Italy in the late thirteenth century, and by the seventeenth century lenses had been combined to make the first telescopes and microscopes, which transformed our understanding of both the heavens and the human body.
          lecturer: Finally, the industrial age brought mass production. In the early twentieth century, machines that could produce thousands of bottles an hour were developed, and in the 1950s a new process was invented in which molten glass was floated on a bath of liquid tin. This produced perfectly flat sheets, and it's still how almost all window glass is made today.
          lecturer: Next week, we'll look at how glass is recycled, and why it can be melted down and reused again and again without losing quality.
        `,
        groups: [
          notes(
            'The history of glass',
            limit(1),
            [
              '# Early history',
              '- natural volcanic glass was used to make sharp [[tools]]',
              '- first glass made in Mesopotamia was used for [[beads]]',
              '- early containers formed around a core of clay and dung; only owned by the [[wealthy]]',
              '# Glass-blowing',
              '- invented in the first century BCE; a vessel took [[minutes]] to make',
              '- Roman window glass was thick and [[cloudy]]',
              '# Middle Ages and Murano',
              '- colours created by adding [[metals]]',
              '- windows told religious stories to people who could not read',
              '- furnaces moved to Murano because of the risk of [[fire]]',
              '- clear glass made it possible to produce [[mirrors]]',
              '# Science and industry',
              '- lenses led to telescopes and [[microscopes]]',
              '- since the 1950s, flat glass made by floating it on liquid [[tin]]',
            ],
            [
              ['People were using natural volcanic glass for sharp tools', 'Volcanic glass was used for tools long before glass could be made.'],
              ['it was used not for windows or containers but for beads', 'Windows and containers are mentioned only to say what it was not used for.'],
              ['owned only by the wealthy', 'Because the process was slow, vessels were luxury objects.'],
              ['make a vessel in minutes rather than days', 'Days is how long it took before glass-blowing.'],
              ['Roman window glass was thick and cloudy', 'It let in light, but you could not see clearly through it.'],
              ['Colour was added by mixing metals into the glass', 'Copper is an example of one of these metals.'],
              ['officially because of the risk of fire in the city', 'The official reason was fire; controlling the glass-makers was a second motive.'],
              ['This made possible high-quality mirrors', 'Mirrors depended on Murano’s very clear glass.'],
              ['to make the first telescopes and microscopes', 'Spectacles came first; then lenses were combined into telescopes and microscopes.'],
              ['floated on a bath of liquid tin', 'The float process uses liquid tin to make perfectly flat sheets.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['not for windows or containers', 32, 'Glass was first used for beads.'],
      ['rather than days', 34, 'Before glass-blowing.'],
      ['copper could produce green or red', 36, 'An example metal, but the gap needs the general word.'],
      ['But it also made it easier to control the glass-makers', 37, 'Not the official reason.'],
      ['Spectacles appeared in Italy', 39, 'Spectacles came before telescopes and microscopes.'],
    ],
  }),
])
