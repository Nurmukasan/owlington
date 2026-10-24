import type { MapSpec } from '../practice-data'
import { choose2, form, limit, map, mcq, notes, part, person, test } from '../build'

const LIBRARY: MapSpec = {
  title: 'Hartley Central Library, ground floor',
  description:
    'Plan of the library ground floor, with north at the top. The main entrance, marked You are here, is in the middle of the south wall. ' +
    'Just inside the entrance is the information desk. A wide central corridor runs north from the entrance to a staircase at the north wall. ' +
    'Three rooms lie on the west side of the corridor and three on the east side. A café is in the south-east corner. ' +
    'Letter A is the room in the south-west corner. Letter B is the middle room on the west side. Letter C is the room in the north-west corner. ' +
    'Letter D is beside the staircase, to its east. Letter E is the room in the north-east corner. Letter F is the middle room on the east side. ' +
    'Letter G is in the corridor, just north of the information desk. Letter H is outside the café, along the south wall.',
  ground: 'floor',
  shapes: [
    { kind: 'room', x: 30, y: 310, w: 220, h: 120 },
    { kind: 'room', x: 30, y: 170, w: 220, h: 120 },
    { kind: 'room', x: 30, y: 30, w: 220, h: 120 },
    { kind: 'room', x: 390, y: 30, w: 220, h: 120 },
    { kind: 'room', x: 390, y: 170, w: 220, h: 120 },
    { kind: 'room', x: 390, y: 310, w: 220, h: 120, label: 'Café' },
    { kind: 'stage', x: 270, y: 30, w: 100, h: 60, label: 'Stairs' },
    { kind: 'building', x: 285, y: 330, w: 70, h: 40, label: 'Info' },
  ],
  points: { A: [140, 370], B: [140, 230], C: [140, 90], D: [345, 115], E: [500, 90], F: [500, 230], G: [320, 290], H: [470, 410] },
  here: [320, 420],
  hereLabel: 'ENTRANCE',
}

const jade = person('jade', 'Jade', 'Hotel events coordinator', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const paul = person('paul', 'Martin', 'Caller', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')
const host = person('host', 'Helen', 'Head librarian', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const zoe = person('zoe', 'Zoe', 'Student', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const omar = person('omar', 'Omar', 'Student', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const prof = person('prof', 'Professor Lang', 'Lecturer', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')

export default test('full-05', [
  part({
    n: 1,
    title: 'Booking a conference room',
    intro: 'You will hear a man phoning a hotel to book a room for a work training day.',
    speakers: [jade, paul],
    blocks: [
      {
        lines: `
          jade: Good afternoon, the Willow Park Hotel, events office. Jade speaking.
          paul: Hello. I'm calling to book a meeting room for a training day. My name's Martin Fairbrother.
          jade: Thank you, Mr Fairbrother. Could you spell that for me?
          paul: Sure. F-A-I-R-B-R-O-T-H-E-R. || Sure. F, A, I, R, B, R, O, T, H, E, R.
          jade: Got it. And which company are you with?
          paul: Northgate Insurance.
          jade: And the date you have in mind?
          paul: We were hoping for Tuesday the 3rd of March, but if that's not possible, the Wednesday would be fine. || We were hoping for Tuesday the third of March, but if that's not possible, the Wednesday would be fine.
          jade: Let me see. The Tuesday's fully booked, I'm afraid, but Wednesday the 4th is free. || Let me see. The Tuesday's fully booked, I'm afraid, but Wednesday the fourth is free.
          paul: Wednesday it is, then.
          jade: How many people are you expecting?
          paul: About thirty. Twenty-eight have said yes so far, but let's say thirty to be safe.
          jade: Thirty. Then I'd suggest the Oak Room. The Cedar Room only holds twenty-four.
          paul: The Oak Room sounds fine. What time can we get in?
          jade: The room's available from eight, and most groups start at half past nine. || The room's available from eight, and most groups start at half past nine.
          paul: We'll need the full time, actually. Our trainer likes to set up early, so we'll arrive at eight.
          jade: No problem. And could I take a contact number?
          paul: Yes, my office number is 0161 498 2273. || Yes, my office number is oh one six one, four nine eight, two two seven three.
        `,
        groups: [
          form(
            'Willow Park Hotel — room booking',
            limit(1, true),
            [
              'Name: Martin [[Fairbrother]]',
              'Company: [[Northgate]] Insurance',
              'Date: Wednesday [[4|4th]] March',
              'Number of people: [[30|thirty]]',
              'Room: the [[Oak]] Room',
              'Contact number: [[0161 498 2273|01614982273]]',
            ],
            [
              ['F-A-I-R-B-R-O-T-H-E-R', 'The surname is spelt letter by letter.'],
              ['Northgate Insurance', 'The company name; “Insurance” is already printed.'],
              ['Wednesday the 4th is free', 'Tuesday the 3rd is fully booked, so they take the Wednesday.'],
              ["let's say thirty to be safe", 'Twenty-eight have accepted, but he books for thirty.'],
              ["Then I'd suggest the Oak Room", 'The Cedar Room only holds twenty-four.'],
              ['my office number is 0161 498 2273', 'The office number, read in groups.'],
            ],
          ),
        ],
      },
      {
        lines: `
          paul: Could you tell me what's included in the price?
          jade: Certainly. The day rate covers the room, a projector and screen, and free wireless internet. Tea and coffee are served twice, mid-morning and mid-afternoon.
          paul: And lunch?
          jade: Lunch is extra. You can choose a sandwich buffet, which is nine pounds fifty a head, or a hot meal in the restaurant, which is fifteen.
          paul: I think the buffet. People prefer to keep working through lunch on training days.
          jade: Fine. Will anyone need special meals?
          paul: Yes, there are three vegetarians, and one person who can't eat dairy.
          jade: I'll let the kitchen know. Now, parking. We have a car park, but it's quite small, so I'd recommend people come by train if they can. The station is only a short walk away.
          paul: I'll tell them. Is there anything else I should know?
          jade: Just that we need a deposit. It's twenty per cent of the total, and it has to be paid within seven days of booking.
          paul: OK. Can I pay that by card over the phone?
          jade: You can, or you can do it online. I'll send you a link by email this afternoon.
        `,
        groups: [
          notes(
            'Booking details',
            limit(2, true),
            [
              '- the price includes a projector, screen and free [[wireless internet|internet|wi-fi]]',
              '- lunch: sandwich buffet at £[[9.50|9.5]] per person',
              '- special meals: three vegetarians and one person who cannot eat [[dairy]]',
              '- guests are advised to travel by [[train]]',
            ],
            [
              ['free wireless internet', 'The day rate covers the room, projector, screen and internet.'],
              ['nine pounds fifty a head', 'The buffet costs £9.50; the hot meal is £15.'],
              ["one person who can't eat dairy", 'Three vegetarians and one dairy-free meal.'],
              ["I'd recommend people come by train", 'The car park is small and the station is close.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['We were hoping for Tuesday the 3rd of March', 3, 'Tuesday is fully booked.'],
      ['Twenty-eight have said yes so far', 4, 'He books for thirty.'],
      ['The Cedar Room only holds twenty-four', 5, 'Too small.'],
      ['a hot meal in the restaurant, which is fifteen', 8, 'They choose the buffet.'],
    ],
  }),

  part({
    n: 2,
    title: 'A new central library',
    intro: 'You will hear the head librarian giving a talk to visitors at the opening of a new library.',
    speakers: [host],
    blocks: [
      {
        lines: `
          host: Good morning, everyone, and welcome to the new Hartley Central Library. I'm Helen Marsh, the head librarian, and I'm delighted to see so many of you here on our first day.
          host: As many of you know, the old library building had served the town for almost a century, but it simply couldn't cope with modern needs. People sometimes assume we moved because the old building was falling down. In fact, it was in quite good condition; the real problem was that there was no space for computers or group work.
          host: The new building has twice as much floor space, and it was designed with a great deal of input from the public. More than two thousand residents answered our survey, and the thing they asked for most often wasn't more books, or even longer opening hours. It was quiet places to study.
          host: You'll also notice that the building is unusually bright. That's because the architects used a glass roof over the central corridor, which means we use far less electricity for lighting during the day.
          host: Membership is still free for everyone who lives or works in the town. What's new is that you no longer need to show proof of address in person. You can join online, and your card will be sent to you by post.
        `,
        groups: [
          mcq([
            [
              'Why did the library move to a new building?',
              ['The old building was unsafe.', 'The old building lacked space for modern uses.', 'The old building was too expensive to heat.'],
              'B',
              'the real problem was that there was no space for computers or group work',
              'People assume the old building was falling down, but it was in quite good condition.',
            ],
            [
              'What did residents ask for most in the survey?',
              ['more books', 'longer opening hours', 'quiet study areas'],
              'C',
              'It was quiet places to study',
              'Not more books, “or even longer opening hours”.',
            ],
            [
              'What is the purpose of the glass roof?',
              ['to reduce the cost of lighting', 'to keep the building warm', 'to make the building look modern'],
              'A',
              'we use far less electricity for lighting during the day',
              'The glass roof makes the building bright, so less electricity is used for lighting.',
            ],
            [
              'What has changed about joining the library?',
              ['Membership now costs money.', 'People can register online.', 'Only town residents can join.'],
              'B',
              'You can join online',
              'Membership is still free, and people who work in the town can also join.',
            ],
          ]),
        ],
      },
      {
        lines: `
          host: Now let me tell you where everything is. We're standing at the main entrance, and in front of you is the information desk.
          host: The room on your left as you come in, in the corner, is the children's library. We put it near the entrance so that families with pushchairs don't have to go far.
          host: Next to the children's library, further along the corridor on the left, is the study centre. This is the quiet area I mentioned, with individual desks, and phones must be switched off in there.
          host: At the far end of the corridor on the left, in the north-west corner, is the local history room. That's where you'll find old maps and newspapers, and our volunteers can help you trace your family history.
          host: Opposite that, in the north-east corner, is the computer suite, with forty computers which are free to use for an hour at a time.
          host: Between the computer suite and the café, on the right of the corridor, there's the meeting room. Community groups can book it free of charge in the evenings.
          host: If you need to return books when we're closed, there's a returns machine. It's in the corridor, just past the information desk, so you don't have to queue.
          host: And finally, the lift. It's beside the staircase, on the right-hand side as you face the stairs.
        `,
        groups: [
          map(LIBRARY, [
            ["Children's library", 'A', "The room on your left as you come in, in the corner, is the children's library", 'On the left of the entrance, in the south-west corner: A.'],
            ['Study centre', 'B', "Next to the children's library, further along the corridor on the left, is the study centre", 'The middle room on the west side: B.'],
            ['Local history room', 'C', 'in the north-west corner, is the local history room', 'The far end on the left, in the north-west corner: C.'],
            ['Meeting room', 'F', "Between the computer suite and the café, on the right of the corridor, there's the meeting room", 'The middle room on the east side: F. The computer suite is E.'],
            ['Returns machine', 'G', "It's in the corridor, just past the information desk", 'In the corridor, just north of the information desk: G.'],
            ['Lift', 'D', "It's beside the staircase, on the right-hand side as you face the stairs", 'East of the stairs: D.'],
          ]),
        ],
      },
    ],
    traps: [
      ['People sometimes assume we moved because the old building was falling down', 11, 'Not the reason.'],
      ["wasn't more books, or even longer opening hours", 12, 'Not what they asked for most.'],
      ['Membership is still free', 14, 'It has not started to cost money.'],
      ['in the north-east corner, is the computer suite', 18, 'The computer suite is E, not the meeting room.'],
    ],
  }),

  part({
    n: 3,
    title: 'A marketing case study',
    intro: 'You will hear two business students, Zoe and Omar, discussing a case study about a sportswear company.',
    speakers: [zoe, omar],
    blocks: [
      {
        lines: `
          zoe: Omar, have you finished reading the case study on Strider? We need to plan our presentation.
          omar: Yes, I read it twice. It's a fascinating story, isn't it? A tiny company that made running shoes for serious athletes, and within ten years it's selling to everyone.
          zoe: What I found most interesting was why it grew so fast. I assumed it was the advertising, but they hardly spent anything on that.
          omar: No. It was the running clubs, wasn't it? They gave free shoes to club members, and the members recommended them to their friends.
          zoe: Exactly. Word of mouth. Though the case study says the quality of the product was what made the recommendations believable.
          omar: True. Then there was the problem when they expanded too quickly.
          zoe: Yes, the factory couldn't keep up. Some people say the issue was the price of materials, but the main thing was that they couldn't deliver orders on time.
          omar: And their old customers started complaining that the brand had lost its identity. That's the part I'd like to focus on.
          zoe: Me too. The brand had always been about serious running, and suddenly it was selling fashion trainers in supermarkets.
          omar: What do you think of the way they handled it?
          zoe: I think they were right to bring back the original range. But I'm not convinced it was wise to stop selling in supermarkets altogether. They lost a lot of income.
          omar: I see your point, but I think it protected the brand in the long term.
        `,
        groups: [
          mcq([
            [
              'According to the students, Strider grew quickly mainly because of',
              ['its advertising campaigns.', 'recommendations from running club members.', 'its low prices.'],
              'B',
              'the members recommended them to their friends',
              'Zoe assumed it was advertising, but the company hardly spent anything on that.',
            ],
            [
              'What was the main problem when the company expanded?',
              ['The cost of materials rose.', 'Orders were delivered late.', 'The product quality fell.'],
              'B',
              "the main thing was that they couldn't deliver orders on time",
              'Some say it was the price of materials, but delivery was “the main thing”.',
            ],
            [
              'Which aspect of the case do both students want to focus on?',
              ['the loss of brand identity', 'the role of the factory', 'the choice of retailers'],
              'A',
              "That's the part I'd like to focus on",
              'Omar wants to focus on the loss of identity, and Zoe agrees: “Me too.”',
            ],
            [
              'What does Zoe think about the decision to stop selling in supermarkets?',
              ['It saved the brand.', 'It may have been a mistake.', 'It should have happened sooner.'],
              'B',
              "I'm not convinced it was wise to stop selling in supermarkets altogether",
              'She thinks they lost a lot of income; Omar disagrees.',
            ],
          ]),
        ],
      },
      {
        lines: `
          omar: So how should we structure the presentation? Our tutor said we should include some kind of audience activity.
          zoe: What about a quick quiz at the start? We could show three logos and ask people to guess which brand is which.
          omar: That might take too long. Why not ask people to vote on whether the company was right to leave the supermarkets? It links directly to our argument.
          zoe: Yes, that's better. We can do it at the end and see if anyone's changed their mind.
          omar: Good. And what sources should we use apart from the case study?
          zoe: The company's annual reports are online, and they show the sales figures year by year. That would be useful for a chart.
          omar: And I found some interviews with the founder in a business magazine. They explain the decisions from her point of view.
          zoe: I'd avoid customer reviews on shopping websites, though. Anyone can write them, and some are probably fake.
          omar: Agreed. Now, which skills does the tutor want us to show? I've got the marking sheet here.
          zoe: Let me look. It says clear use of data, and the ability to evaluate decisions critically.
          omar: It also mentions teamwork, but I don't think that's assessed in the presentation itself. That's from the group report.
          zoe: Right. And there's nothing about using slides, interestingly. Last year that was on the list.
          omar: Then let's not spend hours on the design. Finally, timing. We've got twelve minutes. Shall we split it equally?
          zoe: Let's do that. Six minutes each, and you do the history while I do the analysis.
          omar: And we should practise together at least once before Friday.
          zoe: Definitely. How about Thursday afternoon in the library?
        `,
        groups: [
          choose2(
            'Which TWO sources will the students use, apart from the case study?',
            ['the company’s annual reports', 'customer reviews online', 'interviews with the founder', 'a survey of local runners', 'a textbook on branding'],
            ['A', 'C'],
            [
              ["The company's annual reports are online", 'They show sales figures that can go into a chart.'],
              ['I found some interviews with the founder in a business magazine', 'They explain her decisions. Customer reviews are rejected as unreliable.'],
            ],
          ),
          choose2(
            'Which TWO skills are assessed in the presentation, according to the marking sheet?',
            ['teamwork', 'clear use of data', 'designing slides', 'critical evaluation of decisions', 'answering questions'],
            ['B', 'D'],
            [
              ['It says clear use of data', 'The first skill on the marking sheet.'],
              ['the ability to evaluate decisions critically', 'The second skill. Teamwork belongs to the group report, and slides are no longer listed.'],
            ],
          ),
          mcq([
            [
              'What audience activity will the students include?',
              ['a quiz about logos', 'a vote on a company decision', 'a discussion in small groups'],
              'B',
              'ask people to vote on whether the company was right to leave the supermarkets',
              'The logo quiz might take too long; the vote links to their argument.',
            ],
            [
              'How will the students divide the presentation?',
              ['by time and topic', 'by number of slides', 'by the sources they read'],
              'A',
              'Six minutes each, and you do the history while I do the analysis',
              'Equal time, with Omar on the history and Zoe on the analysis.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['I assumed it was the advertising', 21, 'They hardly spent on advertising.'],
      ['Some people say the issue was the price of materials', 22, 'Not the main problem.'],
      ['What about a quick quiz at the start?', 29, 'Rejected as too long.'],
      ["I'd avoid customer reviews on shopping websites", 25, 'Rejected as unreliable.'],
      ["It also mentions teamwork, but I don't think that's assessed in the presentation itself", 27, 'Assessed in the report, not the presentation.'],
    ],
  }),

  part({
    n: 4,
    title: 'Coral reefs',
    intro: 'You will hear a lecture about coral reefs and the threats they face.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: This morning I want to look at coral reefs: what they are, why they matter, and what's happening to them.
          prof: Many people think coral is a kind of plant, or even a rock. In fact, a coral is an animal, a tiny creature called a polyp, related to the jellyfish. Each polyp builds a hard skeleton of limestone around itself, and over thousands of years, millions of these skeletons build up into a reef.
          prof: The key to a reef's success is a partnership. Inside the coral's tissue live microscopic algae, which use sunlight to make food. The algae provide the coral with most of its energy, and in return they get a protected home. The algae also give coral its colour.
          prof: Because the algae need sunlight, reef-building corals grow only in shallow, clear water, usually less than fifty metres deep. They also need warm water, which is why most reefs are found in the tropics.
          prof: Reefs cover less than one per cent of the ocean floor, yet they're home to around a quarter of all marine species. They're often compared to rainforests for this reason. They also matter to people. Reefs protect coastlines by breaking the force of waves during storms, and in many countries they support fishing and tourism.
          prof: Now to the threats. The most serious is rising sea temperature. When the water becomes too warm for too long, the coral expels its algae. Without them, it turns white, which we call bleaching. A bleached coral isn't dead, but if the water doesn't cool down within a few weeks, it starves.
          prof: A second threat is the ocean becoming more acidic, as it absorbs carbon dioxide from the atmosphere. This makes it harder for corals to build their skeletons.
          prof: There are also local problems. Soil washed off farmland makes the water cloudy and blocks sunlight, and fertilisers encourage seaweed, which competes with coral for space.
          prof: So what can be done? One promising approach is coral gardening. Small fragments of coral are grown in underwater nurseries, attached to frames that look a bit like trees, and then planted out on damaged reefs.
          prof: Scientists are also searching for corals that cope better with heat. Some reefs in the Red Sea, for example, survive temperatures that would kill corals elsewhere. The hope is that these tougher corals could be bred and used to restore other reefs.
          prof: But researchers are clear that none of this will work unless the underlying cause is tackled. Restoration can buy time; only cutting emissions will save reefs in the long run.
        `,
        groups: [
          notes(
            'Coral reefs',
            limit(1),
            [
              '# Biology',
              '- a coral is an animal related to the [[jellyfish]]',
              '- each polyp builds a skeleton made of [[limestone]]',
              '- algae inside the coral provide [[energy]] and give coral its colour',
              '- reef-building corals need warm, shallow and [[clear]] water',
              '# Importance',
              '- reefs are home to about a [[quarter]] of marine species',
              '- they protect coastlines from [[waves]] during storms',
              '# Threats',
              '- bleaching: coral expels its algae and may [[starve]]',
              '- more acidic water makes it difficult to build [[skeletons]]',
              '- soil from farmland blocks [[sunlight]]',
              '# Solutions',
              '- coral fragments grown on frames that look like [[trees]]',
            ],
            [
              ['related to the jellyfish', 'A polyp is an animal, not a plant or rock.'],
              ['a hard skeleton of limestone', 'Each polyp builds a limestone skeleton.'],
              ["The algae provide the coral with most of its energy", 'The algae also give coral its colour.'],
              ['grow only in shallow, clear water', 'The algae need sunlight; the water must also be warm.'],
              ['around a quarter of all marine species', 'Reefs cover less than one per cent of the ocean floor.'],
              ['breaking the force of waves during storms', 'Reefs protect coastlines.'],
              ["if the water doesn't cool down within a few weeks, it starves", 'A bleached coral is not yet dead.'],
              ['This makes it harder for corals to build their skeletons', 'Acidity comes from absorbed carbon dioxide.'],
              ['makes the water cloudy and blocks sunlight', 'Soil washed off farmland.'],
              ['attached to frames that look a bit like trees', 'Coral gardening in underwater nurseries.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Many people think coral is a kind of plant, or even a rock', 31, 'It is an animal.'],
      ["A bleached coral isn't dead", 37, 'It starves if the water stays warm.'],
      ['fertilisers encourage seaweed', 39, 'Seaweed competes for space; soil blocks sunlight.'],
    ],
  }),
])
