import type { MapSpec } from '../practice-data'
import { form, limit, map, matching, mcq, notes, part, person, test } from '../build'

const TOWN: MapSpec = {
  title: 'Lantern Festival, Market Square area',
  description:
    'Map of a town centre, with north at the top. Market Square is in the middle. The Town Hall, marked You are here, stands on the south side of the square. ' +
    'High Street runs east to west along the north side of the square. Church Lane leads north from the middle of High Street to a church at the top of the map. ' +
    'A river runs along the west edge of the map, crossed by a bridge at the western end of High Street. A park lies in the south-east corner. ' +
    'Letter A is on the bridge. Letter B is beside the church, on its east side. Letter C is in the middle of Market Square. Letter D is at the corner of High Street and Church Lane, on the east side. ' +
    'Letter E is at the eastern end of High Street. Letter F is in the park. Letter G is on the riverbank, south of the bridge. Letter H is in the north-west corner of the square.',
  shapes: [
    { kind: 'river', d: 'M40 20 C 60 140, 30 300, 55 450' },
    { kind: 'road', d: 'M40 150 H 620' },
    { kind: 'road', d: 'M330 150 V 40' },
    { kind: 'building', x: 290, y: 20, w: 80, h: 40, label: 'Church' },
    { kind: 'field', x: 180, y: 190, w: 300, h: 170, label: 'Market Square' },
    { kind: 'building', x: 270, y: 370, w: 120, h: 50, label: 'Town Hall' },
    { kind: 'green', x: 500, y: 300, w: 120, h: 130, label: 'Park' },
    { kind: 'label', x: 560, y: 140, text: 'High Street', small: true },
  ],
  points: { A: [50, 150], B: [400, 40], C: [330, 275], D: [365, 120], E: [600, 175], F: [560, 380], G: [75, 300], H: [200, 210] },
  here: [330, 435],
  hereLabel: 'TOWN HALL',
}

const desk = person('desk', 'Jack', 'Booking assistant', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')
const kate = person('kate', 'Kate', 'Caller', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const org = person('org', 'Rachel', 'Festival organiser', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const ruby = person('ruby', 'Ruby', 'Student', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const finn = person('finn', 'Finn', 'Student', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const prof = person('prof', 'Dr Kemp', 'Lecturer', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')

export default test('full-12', [
  part({
    n: 1,
    title: 'A kayak tour',
    intro: 'You will hear a woman phoning to book a kayak tour.',
    speakers: [desk, kate],
    blocks: [
      {
        lines: `
          desk: G'day, Bluewater Kayaks, Jack speaking.
          kate: Hello. I'd like to book one of your kayak tours for a group of friends.
          desk: Sure. We've got three tours. Which one were you interested in?
          kate: The one that goes round the islands.
          desk: That's the Island Explorer. It's our longest tour, about five hours, and it includes lunch on one of the beaches.
          kate: Lovely. How much is it?
          desk: Ninety-five dollars a person. The shorter Sunset tour is sixty.
          kate: We'll do the Island Explorer. There are six of us.
          desk: Have any of you kayaked before?
          kate: Two of us have, but the others are complete beginners.
          desk: That's fine. We'll put the beginners in double kayaks with an experienced person, and we always start with a fifteen-minute safety lesson on the beach.
          kate: Good. What date is available?
          desk: For six people, the earliest I've got is Sunday the 21st. || For six people, the earliest I've got is Sunday the twenty-first.
          kate: That's perfect.
          desk: The tour starts at nine, but please arrive by half past eight to get changed and fitted with life jackets.
        `,
        groups: [
          form(
            'Bluewater Kayaks — booking',
            limit(1, true),
            [
              'Tour: Island [[Explorer]]',
              'Length: about [[5|five]] hours, with lunch on a beach',
              'Price per person: $[[95|ninety-five]]',
              'Group size: 6 (4 beginners)',
              'Beginners: in [[double]] kayaks',
              'Date: Sunday [[21|21st]]',
              'Arrive by: [[8.30|8:30]] am',
            ],
            [
              ["That's the Island Explorer", 'The tour round the islands.'],
              ['about five hours', 'The longest tour.'],
              ['Ninety-five dollars a person', 'The Sunset tour is $60.'],
              ["We'll put the beginners in double kayaks", 'With an experienced person.'],
              ["the earliest I've got is Sunday the 21st", 'For six people.'],
              ['please arrive by half past eight', 'The tour starts at nine.'],
            ],
          ),
        ],
      },
      {
        lines: `
          desk: Can I take a name for the booking?
          kate: Yes, it's Kate Ingleby. I-N-G-L-E-B-Y. || Yes, it's Kate Ingleby. I, N, G, L, E, B, Y.
          desk: Thanks, Kate. Is there anything we should know about anyone's health?
          kate: One of my friends gets seasick quite easily.
          desk: OK, I'll note that. The water's usually calm in the morning, but she might want to take a tablet before she comes.
          kate: I'll tell her. What should we bring?
          desk: A hat and sunscreen, definitely, and a change of clothes. You will get wet. We provide waterproof bags for phones and cameras.
          kate: Great. And what's your cancellation policy?
          desk: If we cancel because of the weather, you get a full refund. If you cancel, it's free up to forty-eight hours before.
        `,
        groups: [
          form(
            'Further details',
            limit(1, true),
            [
              'Name: Kate [[Ingleby]]',
              'Health: one person gets [[seasick]] easily',
              'Bring: hat, sunscreen and a change of [[clothes]]',
              'Cancellation: free up to [[48|forty-eight]] hours before',
            ],
            [
              ['I-N-G-L-E-B-Y', 'The surname is spelt out.'],
              ['One of my friends gets seasick quite easily', 'She may want to take a tablet.'],
              ['a change of clothes', 'Everyone will get wet.'],
              ["it's free up to forty-eight hours before", 'If the company cancels for weather, there is a full refund.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['The shorter Sunset tour is sixty', 3, 'Not the Island Explorer price.'],
      ['The tour starts at nine', 6, 'They must arrive earlier.'],
      ['We provide waterproof bags', 9, 'They do not need to bring these.'],
    ],
  }),

  part({
    n: 2,
    title: 'A lantern festival',
    intro: 'You will hear a festival organiser talking to volunteers about a town’s winter lantern festival.',
    speakers: [org],
    blocks: [
      {
        lines: `
          org: Thanks for coming, everyone. I'm Rachel, and I'm organising this year's Lantern Festival. It's our tenth festival, so we want it to be the best yet.
          org: The festival started as a small event for one primary school, where children made paper lanterns and walked round the square. Now we expect around eight thousand people.
          org: This year, the theme is the river, because the town was founded as a river crossing. Most of the lanterns will be shaped like fish, boats and water birds.
          org: The big change this year is that we're no longer using candles in the lanterns. Last year a lantern caught fire. Nobody was hurt, but from now on we'll only be using small battery lights.
          org: The main parade starts at six o'clock, but we need all volunteers to be here by half past four for a briefing. If you're late, you may not be given a role.
          org: And one last thing. You'll each get a high-visibility jacket. Please return it at the end of the evening, because we use them every year.
        `,
        groups: [
          mcq([
            [
              'How did the festival begin?',
              ['as a school event', 'as a celebration of the river', 'as a fundraising event'],
              'A',
              'The festival started as a small event for one primary school',
              'Children made paper lanterns and walked round the square.',
            ],
            [
              'Why was the river chosen as this year’s theme?',
              ['It is the festival’s tenth year.', 'It is linked to the town’s origins.', 'Children voted for it.'],
              'B',
              'the town was founded as a river crossing',
              'Lanterns will be shaped like fish, boats and water birds.',
            ],
            [
              'What change has been made this year?',
              ['Lanterns will use batteries instead of candles.', 'The parade will be shorter.', 'Lanterns must be made of plastic.'],
              'A',
              "we'll only be using small battery lights",
              'Last year a lantern caught fire.',
            ],
            [
              'What time must volunteers arrive?',
              ['4.00', '4.30', '6.00'],
              'B',
              'we need all volunteers to be here by half past four',
              'The parade itself starts at six.',
            ],
            [
              'What are volunteers asked to do with their jackets?',
              ['keep them', 'give them back afterwards', 'write their names on them'],
              'B',
              'Please return it at the end of the evening',
              'The jackets are used every year.',
            ],
          ]),
        ],
      },
      {
        lines: `
          org: Let's look at the map. We're standing outside the Town Hall, on the south side of Market Square.
          org: The parade will gather on the bridge over the river, at the western end of High Street. That's where the lanterns will be handed out.
          org: The first aid tent will be in the middle of Market Square, so it's easy for everyone to find.
          org: We'll have a children's craft area where families can make lanterns during the afternoon. That's going to be in the park, in the south-east corner.
          org: The food stalls will be along the eastern end of High Street. They'll stay open until ten.
          org: And finally, the parade ends at the church, at the top of Church Lane. There'll be a lost children point next to the church, on its east side, so parents can collect children at the end.
        `,
        groups: [
          map(TOWN, [
            ['Lantern collection point', 'A', 'The parade will gather on the bridge over the river', 'On the bridge: A.'],
            ['First aid tent', 'C', 'in the middle of Market Square', 'The middle of the square: C.'],
            ["Children's craft area", 'F', "That's going to be in the park, in the south-east corner", 'In the park: F.'],
            ['Food stalls', 'E', 'along the eastern end of High Street', 'The east end of High Street: E.'],
            ['Lost children point', 'B', 'next to the church, on its east side', 'Beside the church: B.'],
          ]),
        ],
      },
    ],
    traps: [
      ['Now we expect around eight thousand people', 11, 'Its size now, not how it began.'],
      ["It's our tenth festival", 12, 'Not the reason for the theme.'],
      ['The main parade starts at six o\'clock', 14, 'Volunteers arrive earlier.'],
    ],
  }),

  part({
    n: 3,
    title: 'Microplastics',
    intro: 'You will hear two environmental science students, Ruby and Finn, discussing articles they have read about microplastics.',
    speakers: [ruby, finn],
    blocks: [
      {
        lines: `
          ruby: Finn, did you manage to read all the articles on microplastics for the seminar?
          finn: Most of them. It's quite a depressing topic, isn't it?
          ruby: It is. What surprised you most?
          finn: I think it was how widespread they are. I knew they were in the sea, but they've been found in Arctic snow and on top of mountains. They're carried by the wind.
          ruby: Yes, that shocked me too. I'd assumed most microplastics came from plastic bags and bottles breaking down, but one article said the biggest single source in many countries is car tyres wearing down on roads.
          finn: Right. And synthetic clothes. Every time you wash a fleece, thousands of fibres go down the drain.
          ruby: So what about health effects? That's the part I found most confusing.
          finn: Me too. The articles didn't really agree. We know we're eating and breathing microplastics, but there's no clear evidence yet of how much harm they do to people.
          ruby: I think we should say that in the seminar: that the research is still at an early stage.
          finn: Agreed. Rather than pretending we know more than we do.
          ruby: What did you think of the solutions?
          finn: The filters for washing machines seemed most practical. France is going to make them compulsory on new machines.
          ruby: I was less convinced by the idea of cleaning up the oceans. Most microplastics are too small to collect.
        `,
        groups: [
          mcq([
            [
              'What surprised Finn most about microplastics?',
              ['how small they are', 'where they have been found', 'how long they last'],
              'B',
              "they've been found in Arctic snow and on top of mountains",
              'They are carried by the wind.',
            ],
            [
              'According to one article, the biggest source of microplastics in many countries is',
              ['plastic bags.', 'car tyres.', 'synthetic clothes.'],
              'B',
              'the biggest single source in many countries is car tyres wearing down on roads',
              'Ruby had assumed it was bags and bottles.',
            ],
            [
              'What do the students agree about the health effects?',
              ['The research is not yet conclusive.', 'The effects are less serious than claimed.', 'Breathing microplastics is worse than eating them.'],
              'A',
              'the research is still at an early stage',
              'There is no clear evidence yet of how much harm they do.',
            ],
            [
              'Which solution does Finn think is most practical?',
              ['cleaning the oceans', 'filters for washing machines', 'banning synthetic clothes'],
              'B',
              'The filters for washing machines seemed most practical',
              'France will make them compulsory.',
            ],
          ]),
        ],
      },
      {
        lines: `
          ruby: We need to comment on each of the main articles in the seminar. Shall we go through them?
          finn: OK. The first was the one by Hollis, in the science magazine.
          ruby: That was the clearest, I thought. Good for a general reader, with lots of diagrams.
          finn: Then there was the Nakamura study, about fish.
          ruby: That one used a really large sample. Thousands of fish from different oceans, so the results are quite reliable.
          finn: Yes. What about the Okoro article, on drinking water?
          ruby: That one worried me, but I noticed it was funded by a company that sells water filters.
          finn: Good point. We should mention that. And the report by Brandt?
          ruby: It's ten years old. A lot has changed since then, so I don't think we should rely on it.
          finn: And finally Lindgren, on clothes.
          ruby: That was the one that actually suggested a practical solution. It's where the washing machine filter idea came from.
          finn: So we've got a good mix.
        `,
        groups: [
          matching(
            'What do the students say about each article? Choose FIVE answers from the box and write the correct letter, A–H, next to Questions 25–29.',
            'Comments',
            [
              'It may be biased.',
              'It is out of date.',
              'It is easy to understand.',
              'It is based on a large sample.',
              'It proposes a solution.',
              'It contradicts the other articles.',
              'It contains errors.',
              'It is too technical.',
            ],
            [
              ['Hollis', 'C', 'That was the clearest, I thought', 'Good for a general reader, with diagrams.'],
              ['Nakamura', 'D', 'That one used a really large sample', 'Thousands of fish from different oceans.'],
              ['Okoro', 'A', 'it was funded by a company that sells water filters', 'The funding suggests possible bias.'],
              ['Brandt', 'B', "It's ten years old", 'A lot has changed since then.'],
              ['Lindgren', 'E', 'actually suggested a practical solution', 'The washing machine filter idea.'],
            ],
          ),
          mcq([
            [
              'What does Ruby think about cleaning up the oceans?',
              ['It would be too expensive.', 'Most particles are too small to collect.', 'It is the best long-term solution.'],
              'B',
              'Most microplastics are too small to collect',
              'She was less convinced by this idea.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['I knew they were in the sea', 21, 'Not the surprise.'],
      ['Every time you wash a fleece', 22, 'A source, but not the biggest.'],
      ['That one worried me', 27, 'The issue is the funding.'],
    ],
  }),

  part({
    n: 4,
    title: 'The paperback revolution',
    intro: 'You will hear a lecture about the history of the paperback book.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Good afternoon. Today I'll be talking about something most of you probably have in your bags right now: the paperback book.
          prof: Books with paper covers weren't new in the twentieth century. In the nineteenth century, cheap novels with paper covers were sold at railway stations for people to read on journeys. But these were generally poor-quality stories, and they had a bad reputation.
          prof: The real revolution came in 1935, when a British publisher launched a series of paperbacks of serious, high-quality books, at the same price as a packet of cigarettes. || The real revolution came in nineteen thirty-five, when a British publisher launched a series of paperbacks of serious, high-quality books, at the same price as a packet of cigarettes.
          prof: Other publishers thought it would fail. They believed that cheap books would mean people stopped buying expensive hardbacks. Bookshops weren't interested either, so the first big order actually came from a chain of department stores.
          prof: The design was very simple. The covers had no pictures, just colour-coded bands: orange for fiction, green for crime and blue for biography. This made the books easy to recognise on a shelf.
          prof: The Second World War was a turning point. Soldiers needed something light to carry, and millions of paperbacks were sent to troops overseas. When they came home, many of them had become regular readers.
          prof: After the war, paperbacks spread rapidly. They began to be sold not just in bookshops but in supermarkets and at airports, which brought books to people who had never been into a bookshop.
          prof: The paperback also changed education. Because books were cheap, teachers could ask every student to buy their own copy, and universities could set much longer reading lists.
          prof: Some critics complained that publishers were now choosing books mainly because they would sell, rather than because they were good. But most historians agree that the paperback did more than anything else to make reading a mass activity.
          prof: Today, of course, the paperback faces competition from e-books. Interestingly, though, sales of printed books have remained steady, and in some countries they've actually increased among young readers.
        `,
        groups: [
          notes(
            'The paperback book',
            limit(1, true),
            [
              '- 19th century: cheap novels sold at railway [[stations]]',
              '- [[1935]]: serious books published in paperback',
              '- price: the same as a packet of [[cigarettes]]',
              '- other publishers feared lower sales of [[hardbacks]]',
              '- first big order came from [[department]] stores',
              '- covers used colour-coded bands, e.g. green for [[crime]]',
              '- in the war, paperbacks were sent to [[soldiers|troops]] because they were light',
              '- later sold in supermarkets and [[airports]]',
              '- universities could set longer reading [[lists]]',
              '- sales of printed books are increasing among [[young]] readers in some countries',
            ],
            [
              ['were sold at railway stations', 'For people to read on journeys.'],
              ['The real revolution came in 1935', 'Paperbacks of high-quality books.'],
              ['at the same price as a packet of cigarettes', 'A very low price.'],
              ['people stopped buying expensive hardbacks', 'Other publishers thought it would fail.'],
              ['the first big order actually came from a chain of department stores', 'Bookshops were not interested.'],
              ['green for crime', 'Orange for fiction, blue for biography.'],
              ['Soldiers needed something light to carry', 'Millions were sent to troops overseas.'],
              ['in supermarkets and at airports', 'This reached people who never went into a bookshop.'],
              ['universities could set much longer reading lists', 'Books were cheap.'],
              ["they've actually increased among young readers", 'Despite competition from e-books.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["Bookshops weren't interested either", 35, 'The order came from department stores.'],
      ['orange for fiction', 36, 'Fiction was orange.'],
    ],
  }),
])
