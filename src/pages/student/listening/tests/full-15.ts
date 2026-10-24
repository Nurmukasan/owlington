import type { MapSpec } from '../practice-data'
import { choose2, form, limit, map, matching, mcq, notes, part, person, table, test } from '../build'

const FARM: MapSpec = {
  title: 'Willowbrook Farm open day',
  description:
    'Map of a farm, with north at the top. The car park, marked You are here, is in the south-west corner. A farm track runs east from the car park along the south of the map, then turns north up the east side. ' +
    'The farmhouse is in the centre of the map. A large barn stands north of the farmhouse. An orchard covers the north-west corner. A stream runs from north to south through the middle of the map, west of the farmhouse, with a small bridge across it. ' +
    'Fields fill the east side. ' +
    'Letter A is beside the car park, on its north side. Letter B is in the orchard. Letter C is inside the barn. Letter D is at the bridge over the stream. ' +
    'Letter E is beside the farmhouse, on its east side. Letter F is in the north-east field. Letter G is at the bend where the track turns north, in the south-east corner. Letter H is on the stream bank, north of the bridge.',
  shapes: [
    { kind: 'parking', x: 30, y: 350, w: 130, h: 80, label: 'P' },
    { kind: 'trees', x: 30, y: 30, w: 170, h: 150, label: 'Orchard' },
    { kind: 'river', d: 'M240 20 C 220 140, 260 260, 235 450' },
    { kind: 'building', x: 300, y: 220, w: 110, h: 70, label: 'Farmhouse' },
    { kind: 'building', x: 290, y: 60, w: 130, h: 90, label: 'Barn' },
    { kind: 'field', x: 470, y: 30, w: 140, h: 160 },
    { kind: 'field', x: 470, y: 210, w: 140, h: 150 },
    { kind: 'road', d: 'M160 400 H 600 V 30' },
    { kind: 'path', d: 'M200 300 H 300' },
  ],
  points: { A: [95, 330], B: [110, 100], C: [355, 105], D: [240, 300], E: [440, 255], F: [540, 110], G: [580, 420], H: [230, 190] },
  here: [95, 395],
  hereLabel: 'CAR PARK',
}

const club = person('club', 'Ellie', 'Club manager', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const mark = person('mark', 'Mark', 'Parent', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const farmer = person('farmer', 'Bill', 'Farmer', 'm', 'en-AU', 'bnkqMLCB8HHkYK9Gd6Xj')
const tutor = person('tutor', 'Dr Quinn', 'Tutor', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')
const noah = person('noah', 'Noah', 'Student', 'm', 'en-GB', 'x8sMQt44LP3HcQ1PTXuk')
const prof = person('prof', 'Professor Bryce', 'Lecturer', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')

export default test('full-15', [
  part({
    n: 1,
    title: 'An after-school club',
    intro: 'You will hear a father phoning an after-school club to enrol his son.',
    speakers: [club, mark],
    blocks: [
      {
        lines: `
          club: Good afternoon, Little Explorers After-School Club. Ellie speaking.
          mark: Hi. I'd like to enrol my son for next term, please.
          club: Of course. What's his name?
          mark: Theo Whitcombe. That's W-H-I-T-C-O-M-B-E. || Theo Whitcombe. That's W, H, I, T, C, O, M, B, E.
          club: And how old is Theo?
          mark: He's seven. He's in Year Three at Parkside Primary.
          club: Thank you. Which days would you like?
          mark: Mondays, Wednesdays and Thursdays. His grandmother collects him on Tuesdays and Fridays.
          club: OK, three days. Does Theo have any medical conditions?
          mark: He has asthma, but it's mild. He keeps an inhaler in his school bag.
          club: Fine, I'll note that. And who will usually collect him?
          mark: Usually me, but sometimes my partner, Jo. The club closes at six, doesn't it?
          club: That's right. And we'll need an emergency contact number.
          mark: My mobile is 07946 381 552. || My mobile is oh seven nine four six, three eight one, five five two.
        `,
        groups: [
          form(
            'Little Explorers — enrolment form',
            limit(1, true),
            [
              'Child’s name: Theo [[Whitcombe]]',
              'Age: [[7|seven]]',
              'School: [[Parkside]] Primary',
              'Days: Monday, Wednesday and [[Thursday]]',
              'Medical: mild [[asthma]] (inhaler in bag)',
              'Emergency number: [[07946 381 552|07946381552]]',
            ],
            [
              ['W-H-I-T-C-O-M-B-E', 'The surname is spelt out.'],
              ["He's seven", 'He is in Year Three.'],
              ["He's in Year Three at Parkside Primary", 'The school name.'],
              ['Mondays, Wednesdays and Thursdays', 'His grandmother collects him on Tuesdays and Fridays.'],
              ["He has asthma, but it's mild", 'He has an inhaler in his school bag.'],
              ['My mobile is 07946 381 552', 'The number is read in groups.'],
            ],
          ),
        ],
      },
      {
        lines: `
          mark: Could you tell me what the children do at the club?
          club: Sure. Each day has a different focus. On Mondays it's sport. We have the use of the school hall, so the children play team games.
          mark: Theo will love that.
          club: Wednesday is cooking day. The children make a simple snack, and they take a recipe card home.
          mark: And Thursdays?
          club: Thursday is our nature club. If the weather's good, we go into the school garden and look for insects, plant seeds and so on.
          mark: And if it rains?
          club: Then we do art instead, using natural materials like leaves and pine cones.
          mark: Great. What does it cost?
          club: It's eleven pounds a session, and that includes a hot meal at four o'clock.
        `,
        groups: [
          table(
            'Weekly activities',
            limit(2, true),
            ['Day', 'Activity', 'Details'],
            [
              ['Monday', 'sport', 'team games in the school [[hall]]'],
              ['Wednesday', 'cooking', 'children take home a recipe [[card]]'],
              ['Thursday', 'nature club', 'in the school garden; if it rains, [[art]] instead'],
              ['Cost', '£[[11|eleven]] per session', 'includes a hot meal at 4 pm'],
            ],
            [
              ['We have the use of the school hall', 'The children play team games.'],
              ['they take a recipe card home', 'They make a simple snack.'],
              ['Then we do art instead', 'Using natural materials.'],
              ["It's eleven pounds a session", 'This includes a hot meal.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['His grandmother collects him on Tuesdays and Fridays', 4, 'Not club days.'],
      ['The club closes at six', 6, 'Closing time, not part of the number.'],
    ],
  }),

  part({
    n: 2,
    title: 'A farm open day',
    intro: 'You will hear a farmer talking to visitors at the start of a farm open day.',
    speakers: [farmer],
    blocks: [
      {
        lines: `
          farmer: Morning, all, and welcome to Willowbrook Farm. I'm Bill, and my family has farmed here for four generations.
          farmer: We hold the open day every year so people can see where their food comes from. A lot of children have never seen a cow up close, and some of them think milk comes from the supermarket.
          farmer: We've made some big changes in the last ten years. We used to grow only wheat, but now we've got a dairy herd, an orchard and a farm shop. Diversifying like this means we don't depend on one crop.
          farmer: We've also planted over a kilometre of new hedges. They give shelter to birds and insects, and they help stop soil being blown away.
          farmer: And we've installed solar panels on the barn roof, which provide all the electricity for the milking parlour.
        `,
        groups: [
          choose2(
            'Which TWO changes has the farm made in the last ten years?',
            ['It has started keeping cows.', 'It has stopped growing wheat.', 'It has opened a shop.', 'It has built a café.', 'It has bought more land.'],
            ['A', 'C'],
            [
              ["now we've got a dairy herd", 'A dairy herd means cows.'],
              ['an orchard and a farm shop', 'The farm has diversified.'],
            ],
          ),
          choose2(
            'Which TWO benefits of the new hedges does Bill mention?',
            ['They attract visitors.', 'They provide shelter for wildlife.', 'They produce fruit.', 'They reduce soil loss.', 'They keep animals in the fields.'],
            ['B', 'D'],
            [
              ['They give shelter to birds and insects', 'Over a kilometre of new hedges.'],
              ['they help stop soil being blown away', 'Hedges reduce wind erosion.'],
            ],
          ),
        ],
      },
      {
        lines: `
          farmer: Right, let me show you on the map where everything is. We're in the car park, in the bottom left-hand corner.
          farmer: First, if you need to buy tickets for the tractor rides, there's a ticket hut right next to the car park, on its north side.
          farmer: In the orchard, in the top left-hand corner, you can pick your own apples. Bags are provided.
          farmer: The barn, north of the farmhouse, is where we'll be doing the sheep-shearing demonstration, at eleven and at two.
          farmer: If you'd like a picnic, there are tables by the bridge over the stream. It's a lovely spot.
          farmer: The farm shop is right beside the farmhouse, on the east side. It sells our own milk, cheese and apple juice.
          farmer: And the tractor rides start from the corner where the track turns north, down in the bottom right of the map.
        `,
        groups: [
          map(FARM, [
            ['Ticket hut', 'A', "there's a ticket hut right next to the car park, on its north side", 'North of the car park: A.'],
            ['Pick-your-own apples', 'B', 'In the orchard, in the top left-hand corner', 'In the orchard: B.'],
            ['Sheep-shearing', 'C', 'The barn, north of the farmhouse', 'Inside the barn: C.'],
            ['Picnic tables', 'D', 'there are tables by the bridge over the stream', 'At the bridge: D.'],
            ['Farm shop', 'E', 'The farm shop is right beside the farmhouse, on the east side', 'East of the farmhouse: E.'],
            ['Start of tractor rides', 'G', 'the corner where the track turns north', 'The south-east bend: G.'],
          ]),
        ],
      },
    ],
    traps: [
      ['We used to grow only wheat', 12, 'They have not stopped growing wheat; they no longer grow only wheat.'],
      ['which provide all the electricity for the milking parlour', 14, 'Solar panels, not hedges.'],
    ],
  }),

  part({
    n: 3,
    title: 'Colour and taste',
    intro: 'You will hear a psychology student, Noah, discussing an experiment on colour and taste with his tutor.',
    speakers: [tutor, noah],
    blocks: [
      {
        lines: `
          tutor: Hi, Noah. You wanted to talk about your experiment on colour and taste?
          noah: Yes. I've finished collecting the data, and the results are quite interesting.
          tutor: Remind me what you did.
          noah: I gave volunteers the same orange drink, but in cups of different colours: red, blue, white and clear glass. Then I asked them to rate how sweet it was.
          tutor: And?
          noah: The drink from the red cups was rated sweetest, by quite a long way. The blue cups made it seem less sweet.
          tutor: That fits with earlier research. Did anything surprise you?
          noah: Yes. I expected the clear glass to be rated the most natural, but people said the white cup tasted most natural.
          tutor: Interesting. How many volunteers did you have?
          noah: Forty. I wanted more, but it was hard to find people during the exam period.
          tutor: Forty is acceptable for a student project. Did the volunteers know what you were testing?
          noah: No. I told them it was a study about drinks, but not about colour. Otherwise they might have tried to guess what I wanted.
          tutor: Good. That's an important control.
        `,
        groups: [
          mcq([
            [
              'Which cup made the drink seem sweetest?',
              ['red', 'blue', 'white'],
              'A',
              'The drink from the red cups was rated sweetest',
              'The blue cups made it seem less sweet.',
            ],
            [
              'What surprised Noah?',
              ['the effect of the blue cups', 'which cup was rated most natural', 'how sweet the drink was'],
              'B',
              'people said the white cup tasted most natural',
              'He expected the clear glass to be rated most natural.',
            ],
            [
              'Why did Noah have fewer volunteers than he wanted?',
              ['He ran out of money.', 'It was during exams.', 'The drink was unpopular.'],
              'B',
              'it was hard to find people during the exam period',
              'He had forty volunteers.',
            ],
            [
              'Why did Noah not tell volunteers about the colour?',
              ['They might try to guess the expected result.', 'He was not allowed to.', 'He forgot to.'],
              'A',
              'Otherwise they might have tried to guess what I wanted',
              'He said it was a study about drinks.',
            ],
          ]),
        ],
      },
      {
        lines: `
          tutor: Now, let's think about how to explain the results. What are the possible explanations?
          noah: Well, one idea is that red is associated with ripe fruit, so our brains expect something sweet.
          tutor: I think that's the strongest explanation. There's good evidence for it in other studies.
          noah: I agree. Another idea is that people simply prefer red, so they enjoy the drink more.
          tutor: I'm less convinced by that. People's favourite colours vary a lot.
          noah: Yes, but in my questionnaire, most people chose red as their favourite.
          tutor: Then you could mention it. What about cultural factors?
          noah: I think they're important. In some countries, blue is used for medicines, so people may associate it with a bitter taste.
          tutor: Maybe, but you didn't collect data on that, so you can't really say.
          noah: True. And the last idea is that the experiment was affected by the lighting in the room.
          tutor: I don't think that's likely. You used the same room for everyone, didn't you?
          noah: Yes, I did. And about the practical applications? I think food companies could use this to reduce sugar.
          tutor: That's an excellent point. If a red package makes food seem sweeter, they could add less sugar. You should definitely include that.
          noah: And what about restaurants? They could use coloured plates.
          tutor: Possibly, but there isn't much research on that yet.
        `,
        groups: [
          matching(
            'Who has each opinion? Choose the correct letter, A, B or C.',
            'People',
            ['Noah only', 'the tutor only', 'both Noah and the tutor'],
            [
              ['Red is linked with ripe fruit.', 'C', "I think that's the strongest explanation", 'Noah agrees: “I agree.”'],
              ['Colour preference may explain the result.', 'A', "I'm less convinced by that", 'Noah proposes it; the tutor doubts it.'],
              ['Culture may affect how colours are tasted.', 'A', "I think they're important", 'The tutor says he has no data on it.'],
              ['Lighting is unlikely to explain the results.', 'B', "I don't think that's likely", 'The tutor dismisses lighting because the same room was used.'],
              ['Food companies could use the findings to reduce sugar.', 'C', "That's an excellent point", 'Noah suggests it and the tutor agrees strongly.'],
              ['Coloured plates could help restaurants.', 'A', 'They could use coloured plates', 'The tutor says there is little research yet.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['I expected the clear glass to be rated the most natural', 22, 'His expectation, not the result.'],
      ['I wanted more', 23, 'He had forty.'],
    ],
  }),

  part({
    n: 4,
    title: 'Ice cores and climate',
    intro: 'You will hear a lecture about what ice cores tell us about the history of the climate.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today we're going to look at one of the most valuable sources of information about past climates: ice cores.
          prof: In places like Antarctica and Greenland, snow has fallen year after year for hundreds of thousands of years without melting. Each layer is pressed down by the snow above it, until it becomes solid ice.
          prof: Scientists drill down into this ice and remove long cylinders, called cores. The deepest cores are more than three kilometres long, and the oldest ice is around eight hundred thousand years old.
          prof: How do we know how old the ice is? Near the surface, you can count the layers, rather like the rings in a tree. Summer snow and winter snow look slightly different. Deeper down, the layers are too thin to see, so scientists use computer models and chemical markers.
          prof: Ice cores are useful because they contain tiny bubbles of air, trapped when the snow turned to ice. These bubbles are actual samples of the ancient atmosphere, so we can measure how much carbon dioxide it contained.
          prof: The ice itself also tells us about temperature. The chemistry of the water changes slightly depending on how cold it was when the snow fell.
          prof: What have we learnt? The cores show that the Earth has gone through regular cycles of ice ages and warmer periods, about every hundred thousand years. And throughout this time, carbon dioxide and temperature have risen and fallen together.
          prof: Most importantly, carbon dioxide levels today are far higher than at any time in the entire ice core record.
          prof: Ice cores also record other events. Layers of ash show when large volcanoes erupted, and dust levels show when the climate was dry and windy.
          prof: There's an urgent problem, though. Some glaciers in mountain areas are melting so fast that the information they contain is being lost. An international project is now collecting cores from these glaciers and storing them in Antarctica, in a cave dug into the ice, where they'll be kept frozen for future scientists.
        `,
        groups: [
          notes(
            'Ice cores',
            limit(1, true),
            [
              '- layers of snow are pressed down until they become [[ice]]',
              '- deepest cores: over [[3|three]] km long',
              '- near the surface, layers can be counted like rings in a [[tree]]',
              '- deeper down: computer models and chemical [[markers]]',
              '- air [[bubbles]] contain samples of the ancient atmosphere',
              '- the chemistry of the water shows the [[temperature]]',
              '- ice ages happen about every 100,000 years',
              '- CO₂ and temperature have changed [[together]]',
              '- layers of [[ash]] show volcanic eruptions',
              '- [[dust]] levels show dry, windy periods',
              '- cores from melting glaciers are stored in a [[cave]] in Antarctica',
            ],
            [
              ['until it becomes solid ice', 'Each layer is pressed down by the snow above.'],
              ['more than three kilometres long', 'The deepest cores.'],
              ['rather like the rings in a tree', 'Summer and winter snow look different.'],
              ['computer models and chemical markers', 'Deeper layers are too thin to see.'],
              ['they contain tiny bubbles of air', 'Trapped when the snow turned to ice.'],
              ['The ice itself also tells us about temperature', 'The water chemistry changes with temperature.'],
              ['have risen and fallen together', 'Throughout the ice core record.'],
              ['Layers of ash show when large volcanoes erupted', 'Volcanic events are recorded.'],
              ['dust levels show when the climate was dry and windy', 'Dust is another record.'],
              ['in a cave dug into the ice', 'Kept frozen for future scientists.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['around eight hundred thousand years old', 32, 'The age, not the length.'],
      ['far higher than at any time', 37, 'Today’s level, not how they changed.'],
    ],
  }),
])
