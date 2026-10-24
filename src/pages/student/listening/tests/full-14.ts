import type { MapSpec } from '../practice-data'
import { flow, form, limit, map, matching, mcq, notes, part, person, test } from '../build'

const MUSEUM: MapSpec = {
  title: 'Museum of Transport, main hall',
  description:
    'Plan of the museum main hall, with north at the top. The entrance, marked You are here, is in the south-west corner. ' +
    'Inside the entrance is a reception desk. A large open gallery fills the centre of the hall. Along the north wall there are three rooms side by side. ' +
    'Along the east wall there are two rooms, one above the other. A café is in the south-east corner. ' +
    'Letter A is the room at the west end of the north wall. Letter B is the middle room on the north wall. Letter C is the room at the east end of the north wall. ' +
    'Letter D is the upper room on the east wall. Letter E is the lower room on the east wall, next to the café. Letter F is in the centre of the gallery. ' +
    'Letter G is along the south wall, between the entrance and the café. Letter H is beside the reception desk, to its north.',
  ground: 'floor',
  shapes: [
    { kind: 'room', x: 30, y: 30, w: 170, h: 110 },
    { kind: 'room', x: 220, y: 30, w: 170, h: 110 },
    { kind: 'room', x: 410, y: 30, w: 200, h: 110 },
    { kind: 'room', x: 470, y: 160, w: 140, h: 110 },
    { kind: 'room', x: 470, y: 280, w: 140, h: 80 },
    { kind: 'room', x: 470, y: 370, w: 140, h: 60, label: 'Café' },
    { kind: 'stage', x: 130, y: 160, w: 320, h: 200, label: 'Gallery' },
    { kind: 'building', x: 40, y: 330, w: 70, h: 40, label: 'Desk' },
  ],
  points: { A: [115, 85], B: [305, 85], C: [510, 85], D: [540, 215], E: [540, 320], F: [290, 260], G: [300, 410], H: [75, 300] },
  here: [60, 420],
  hereLabel: 'ENTRANCE',
}

const agent = person('agent', 'Nadia', 'Recruitment consultant', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')
const ryan = person('ryan', 'Ryan', 'Job seeker', 'm', 'en-AU', 'AsGY6GCuJNcXklospqtq')
const guide = person('guide', 'Colin', 'Museum guide', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')
const maya = person('maya', 'Maya', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const luca = person('luca', 'Luca', 'Student', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const prof = person('prof', 'Dr Faulkner', 'Lecturer', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')

export default test('full-14', [
  part({
    n: 1,
    title: 'Registering with a job agency',
    intro: 'You will hear a man registering with an employment agency for temporary work.',
    speakers: [agent, ryan],
    blocks: [
      {
        lines: `
          agent: Hello, Bright Path Recruitment, Nadia speaking.
          ryan: Hi. I've just arrived in the UK for a year, and I'm looking for temporary work. A friend told me to call you.
          agent: Great. I'll take some details over the phone and then we'll arrange an interview. What's your name?
          ryan: Ryan Gallagher. G-A-L-L-A-G-H-E-R. || Ryan Gallagher. G, A, double L, A, G, H, E, R.
          agent: And you're from?
          ryan: Australia. Perth.
          agent: How long have you got on your visa?
          ryan: Twelve months. It started last week.
          agent: OK. What kind of work are you looking for?
          ryan: Anything in hospitality, really. I worked as a waiter for three years back home, and I've also done some bar work.
          agent: Hospitality is busy at the moment, so that's good. Would you consider hotel reception?
          ryan: Sure. I'd like to try that.
          agent: Do you have any qualifications?
          ryan: I have a certificate in food safety, which I did last year.
          agent: Excellent. That's very useful. And what about availability? Can you work evenings and weekends?
          ryan: Yes, any time. But I'd rather not work early mornings. I've got English classes until ten on weekdays.
          agent: No problem. And how will you get to work? Do you have a car?
          ryan: No, I'll be using a bike.
        `,
        groups: [
          form(
            'Bright Path Recruitment — registration',
            limit(2, true),
            [
              'Name: Ryan [[Gallagher]]',
              'Visa: [[12|twelve]] months',
              'Experience: worked as a [[waiter]] for 3 years',
              'Would also try: hotel [[reception]]',
              'Qualification: certificate in [[food safety]]',
              'Not available: weekday mornings, because of English [[classes]]',
              'Transport: [[bike|bicycle]]',
            ],
            [
              ['G-A-L-L-A-G-H-E-R', 'The surname is spelt out with a double L.'],
              ['Twelve months', 'The visa started last week.'],
              ['I worked as a waiter for three years', 'He has also done some bar work.'],
              ["Would you consider hotel reception?", 'He agrees to try it.'],
              ['I have a certificate in food safety', 'He took it last year.'],
              ["I've got English classes until ten on weekdays", 'He would rather not work early mornings.'],
              ["I'll be using a bike", 'He does not have a car.'],
            ],
          ),
        ],
      },
      {
        lines: `
          agent: Now, let's arrange your interview. Could you come in on Thursday?
          ryan: Yes, after my class.
          agent: Then let's say eleven fifteen. Our office is at 48 Castle Street, on the second floor, above the bank. || Then let's say eleven fifteen. Our office is at forty-eight Castle Street, on the second floor, above the bank.
          ryan: Got it.
          agent: Please bring your passport, so we can check your right to work, and also bring your bank details, so we can pay you.
          ryan: What about references?
          agent: If you have a reference from your last employer, bring it, but we can also contact them ourselves.
          ryan: OK. And how often do you pay?
          agent: Every week, on Fridays.
        `,
        groups: [
          notes(
            'Interview',
            limit(1, true),
            [
              '- day: Thursday, at 11.15',
              '- office: [[48]] Castle Street, second floor, above the bank',
              '- bring: passport and bank [[details]]',
              '- pay: every week, on [[Fridays|Friday]]',
            ],
            [
              ['Our office is at 48 Castle Street', 'On the second floor, above the bank.'],
              ['bring your bank details, so we can pay you', 'And his passport.'],
              ['Every week, on Fridays', 'Workers are paid weekly.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["I've also done some bar work", 3, 'Waiting was his main job.'],
      ["Can you work evenings and weekends?", 6, 'He can work then; mornings are the problem.'],
      ['If you have a reference from your last employer, bring it', 9, 'Optional, not required.'],
    ],
  }),

  part({
    n: 2,
    title: 'Museum of Transport',
    intro: 'You will hear a guide talking to visitors at a museum of transport.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Good morning, everyone, and welcome to the Museum of Transport. I'm Colin, one of the volunteer guides.
          guide: The museum is housed in an old tram depot, built in 1902. When the city's trams stopped running in the 1960s, the building was used as a bus garage, and it became a museum fifteen years ago. || The museum is housed in an old tram depot, built in nineteen oh two. When the city's trams stopped running in the nineteen sixties, the building was used as a bus garage, and it became a museum fifteen years ago.
          guide: Entry is free, but we do ask for donations, because the museum receives no money from the government. Most of our funding comes from the shop and café.
          guide: Many of the vehicles here were restored by volunteers. Restoring a single tram can take up to ten years, because so many parts have to be made by hand.
          guide: Please don't climb on the vehicles unless there's a sign saying you can. Some of them are more than a hundred years old.
        `,
        groups: [
          mcq([
            [
              'What was the building used for immediately before it became a museum?',
              ['a tram depot', 'a bus garage', 'a factory'],
              'B',
              'the building was used as a bus garage',
              'It was built as a tram depot.',
            ],
            [
              'Where does most of the museum’s money come from?',
              ['the government', 'donations', 'the shop and café'],
              'C',
              'Most of our funding comes from the shop and café',
              'The museum receives no government money.',
            ],
            [
              'Why does restoring a tram take so long?',
              ['There are few volunteers.', 'Parts must be made by hand.', 'The museum lacks money.'],
              'B',
              'because so many parts have to be made by hand',
              'It can take up to ten years.',
            ],
            [
              'Visitors may climb on vehicles',
              ['if a sign allows it.', 'if a guide is present.', 'if they are over twelve.'],
              'A',
              "unless there's a sign saying you can",
              'Some vehicles are over a hundred years old.',
            ],
          ]),
        ],
      },
      {
        lines: `
          guide: Let me explain where things are. We're at the entrance, in the south-west corner of the hall, and the reception desk is just inside.
          guide: Along the north wall, there are three rooms. The first, on the left, is the horse-drawn carriage room. It has the oldest vehicles in the collection.
          guide: The middle room is the bicycle room. You can try riding a copy of a penny-farthing in there, with help from our staff.
          guide: In the room at the east end of the north wall, the right-hand end, there's the railway room, with a large model railway that runs every half hour.
          guide: On the east side of the hall, the upper room is the workshop, where you can watch volunteers restoring vehicles through a glass wall.
          guide: In the centre of the gallery is the star of the collection: Tram Number 7, the last tram to run in the city. You can go inside it.
          guide: And the toilets are just beside the reception desk, on its north side.
        `,
        groups: [
          map(MUSEUM, [
            ['Carriage room', 'A', 'The first, on the left, is the horse-drawn carriage room', 'The west end of the north wall: A.'],
            ['Bicycle room', 'B', 'The middle room is the bicycle room', 'The middle of the north wall: B.'],
            ['Railway room', 'C', "In the room at the east end of the north wall, the right-hand end, there's the railway room", 'The east end of the north wall: C.'],
            ['Workshop', 'D', 'the upper room is the workshop', 'The upper room on the east wall: D.'],
            ['Tram Number 7', 'F', 'In the centre of the gallery is the star of the collection', 'The centre of the gallery: F.'],
            ['Toilets', 'H', 'the toilets are just beside the reception desk, on its north side', 'North of the desk: H.'],
          ]),
        ],
      },
    ],
    traps: [
      ['built in 1902', 11, 'Its original purpose.'],
      ['we do ask for donations', 12, 'Not the main source.'],
    ],
  }),

  part({
    n: 3,
    title: 'A business plan for a café',
    intro: 'You will hear two business students, Maya and Luca, discussing a business plan for a café.',
    speakers: [maya, luca],
    blocks: [
      {
        lines: `
          maya: OK, Luca, let's go through the business plan for the café. We need to submit it next Friday.
          luca: Right. I think the location section is done. We chose the empty shop near the station.
          maya: Yes. The rent's higher than the one on the high street, but there are far more people passing.
          luca: And commuters want coffee in the morning. That's our main market.
          maya: What about the competition? There's already a chain coffee shop opposite.
          luca: I know. But our survey showed people are unhappy with the queues there. If we can serve people quickly, we'll win customers.
          maya: That's a good point to put in the plan. What about the menu?
          luca: I think we should keep it small at first. Coffee, tea and a few pastries. Too many choices slow down service.
          maya: Agreed. And I'd like to offer a discount to people who bring their own cup. It's good for the environment and it'll attract students.
          luca: Fine. Now, staffing. How many people do we need?
          maya: Three in the morning rush, and two for the rest of the day.
          luca: And the opening hours?
          maya: Six thirty to three. There's no point staying open in the evening near a station. Everyone's going home.
        `,
        groups: [
          mcq([
            [
              'Why did the students choose the shop near the station?',
              ['The rent is lower.', 'More people walk past.', 'It is larger.'],
              'B',
              'there are far more people passing',
              'The rent is actually higher than on the high street.',
            ],
            [
              'How do the students plan to compete with the chain coffee shop?',
              ['by charging lower prices', 'by serving customers faster', 'by offering more choice'],
              'B',
              "If we can serve people quickly, we'll win customers",
              'Customers dislike the queues at the chain.',
            ],
            [
              'Why do they want a small menu?',
              ['to reduce costs', 'to keep service quick', 'to attract students'],
              'B',
              'Too many choices slow down service',
              'Coffee, tea and a few pastries at first.',
            ],
            [
              'Who will the reusable cup discount mainly attract?',
              ['commuters', 'students', 'office workers'],
              'B',
              "it'll attract students",
              'It is also good for the environment.',
            ],
            [
              'Why will the café close at three?',
              ['There are few customers in the evening.', 'Staff costs are too high.', 'The station closes early.'],
              'A',
              "There's no point staying open in the evening near a station",
              'Everyone is going home.',
            ],
          ]),
        ],
      },
      {
        lines: `
          luca: Now the finance section. We have to explain where the start-up money comes from.
          maya: Right. The bank loan covers most of it, the coffee machine and the furniture.
          luca: And my uncle's lending us money for the first three months' rent.
          maya: Then there's the government grant. We can only use that for training.
          luca: What about the crowdfunding?
          maya: I think that's best used for the decoration. People like to see their money go on something visible.
          luca: And the money we've saved ourselves?
          maya: That should be kept as an emergency fund. We shouldn't spend it unless something goes wrong.
          luca: Sounds sensible.
        `,
        groups: [
          matching(
            'What will each source of money be used for? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 26–30.',
            'Uses',
            ['equipment and furniture', 'rent', 'staff training', 'decoration', 'emergencies', 'advertising', 'stock'],
            [
              ['bank loan', 'A', 'the coffee machine and the furniture', 'The loan covers most of the start-up costs.'],
              ["Luca's uncle", 'B', "the first three months' rent", 'A family loan for rent.'],
              ['government grant', 'C', 'We can only use that for training', 'The grant is restricted to training.'],
              ['crowdfunding', 'D', "that's best used for the decoration", 'People like to see where their money goes.'],
              ['personal savings', 'E', 'That should be kept as an emergency fund', 'Only spent if something goes wrong.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["The rent's higher than the one on the high street", 21, 'Not why they chose it.'],
      ['Six thirty to three', 25, 'The hours, not the reason.'],
    ],
  }),

  part({
    n: 4,
    title: 'Desalination',
    intro: 'You will hear a lecture about turning seawater into drinking water.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today I'm going to talk about desalination: removing salt from seawater to make it drinkable. With water shortages growing in many parts of the world, it's becoming increasingly important.
          prof: There are two main methods. The older one is thermal desalination, which copies the natural water cycle. Seawater is heated until it turns into steam, which leaves the salt behind. The steam is then cooled so that it turns back into liquid water.
          prof: Today, most new plants use a method called reverse osmosis. Let me take you through the process.
          prof: First, seawater is drawn in through pipes from offshore. Screens at the entrance keep out fish and other sea life.
          prof: The water then passes through filters made of sand, which remove larger particles such as mud.
          prof: Next, the water is pushed at very high pressure through a membrane, a thin sheet with tiny holes. Water molecules can pass through, but salt can't.
          prof: The water that comes out is almost pure, so minerals have to be added back to it, both for taste and for health.
          prof: Finally, the water is stored in tanks before being sent into the public supply.
        `,
        groups: [
          flow(
            'Reverse osmosis',
            limit(1),
            [
              'Seawater enters through pipes; [[screens]] keep out sea life',
              'Filters made of [[sand]] remove larger particles',
              'Water is forced through a [[membrane]] at high pressure',
              'Minerals are added for taste and [[health]]',
              'Water is stored in [[tanks]] before supply',
            ],
            [
              ['Screens at the entrance keep out fish and other sea life', 'The water is drawn in from offshore.'],
              ['filters made of sand', 'They remove mud and other large particles.'],
              ['pushed at very high pressure through a membrane', 'Salt cannot pass through the tiny holes.'],
              ['both for taste and for health', 'The water is almost pure.'],
              ['the water is stored in tanks', 'Then it goes into the public supply.'],
            ],
          ),
        ],
      },
      {
        lines: `
          prof: So what are the problems? The biggest is energy. Pushing water through membranes takes huge amounts of electricity, which makes desalinated water several times more expensive than water from rivers.
          prof: However, costs have fallen dramatically. Modern plants use devices that recover energy from the high-pressure waste water, and many are now powered by solar energy.
          prof: The second problem is the waste. For every litre of fresh water, about one and a half litres of very salty water, called brine, is produced. If it's pumped back into the sea, it sinks and can harm creatures living on the sea floor.
          prof: Researchers are looking for uses for brine. Some of the salts it contains are valuable, such as magnesium, which is used in industry.
          prof: Finally, desalination is particularly important for islands and desert countries. In some Middle Eastern countries, it provides almost all the drinking water.
        `,
        groups: [
          notes(
            'Problems and solutions',
            limit(1),
            [
              '- uses a lot of [[electricity]], so water is expensive',
              '- modern plants recover energy and use [[solar]] power',
              '- produces salty waste water called [[brine]]',
              '- waste harms creatures on the sea [[floor]]',
              '- waste contains useful salts such as [[magnesium]]',
            ],
            [
              ['takes huge amounts of electricity', 'Desalinated water is several times more expensive.'],
              ['many are now powered by solar energy', 'Costs have fallen dramatically.'],
              ['very salty water, called brine', 'About 1.5 litres per litre of fresh water.'],
              ['can harm creatures living on the sea floor', 'Brine sinks when pumped back.'],
              ['such as magnesium, which is used in industry', 'Researchers are looking for uses for brine.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Seawater is heated until it turns into steam', 31, 'Thermal desalination, not reverse osmosis.'],
      ['several times more expensive than water from rivers', 36, 'The consequence, not the cause.'],
    ],
  }),
])
