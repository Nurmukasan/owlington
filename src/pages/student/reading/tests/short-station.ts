import { passage, short, test } from '../build'

export default test('short-station', [
  passage({
    title: 'Living in Orbit',
    sub: 'Four hundred kilometres above the Earth, the ordinary business of eating, sleeping and keeping clean becomes a daily engineering problem.',
    text: `
      A
      The International Space Station travels around the Earth at a height of about 400 kilometres, completing one orbit roughly every ninety minutes.
      This means that the crew on board see around sixteen sunrises and sixteen sunsets every day.
      Since the natural rhythm of light and dark is of no use to them, the astronauts follow a timetable set by mission control on the ground, and the station keeps Coordinated Universal Time, the international standard used by air traffic controllers and scientists around the world.

      B
      A typical working day is carefully planned in blocks of a few minutes.
      Crew members carry out scientific experiments, repair and maintain equipment, and take part in medical tests that help doctors understand how the human body changes in space.
      Each evening there is a conference with the ground team to review the day’s work, and the astronauts receive an updated schedule for the following morning.
      Free time is limited, and many astronauts say that their favourite way of spending it is simply looking out of the window at the planet below.

      C
      Exercise is not optional.
      In weightlessness, bones and muscles are no longer needed to support the body, and without regular effort they begin to weaken within weeks.
      To slow this loss, each crew member spends around two hours a day exercising, using a treadmill, an exercise bicycle and a special machine that uses vacuum cylinders to imitate the effect of lifting weights.
      Astronauts on the treadmill wear a harness that pulls them down onto the running belt; without it, they would simply float away.

      D
      Water is too heavy to send from Earth in large quantities, so the station recycles almost all of it.
      Moisture from the air, including the crew’s breath and sweat, is collected and purified, and so is urine.
      The recycling system recovers more than nine-tenths of the water on board, and the result is cleaner than much of the tap water on Earth.
      Astronauts often joke that today’s coffee is yesterday’s coffee, but the system has greatly reduced the number of supply flights needed.

      E
      Food has improved considerably since the early days of space travel, when meals were squeezed out of tubes.
      Today, much of it is dried or sealed in pouches, and astronauts add hot water before eating.
      Bread is avoided because crumbs could float into equipment or into a crew member’s eyes, and tortillas are used instead.
      Salt and pepper are supplied in liquid form for the same reason.
      Fresh fruit arrives only with supply vehicles, and is usually eaten within a few days.

      F
      Sleeping is perhaps the strangest experience of all.
      Each astronaut has a small private cabin, about the size of a telephone box, with a sleeping bag fixed to the wall.
      Because there is no up or down, it makes no difference which way the bag is attached.
      Many crew members wear masks over their eyes and earplugs, because the fans that move air around the station are constantly running.
      These fans are essential: without them, the carbon dioxide that astronauts breathe out would gather around their heads as they slept.

      G
      Even washing requires special methods.
      Showers are impossible because water forms floating drops rather than running off the body, so astronauts clean themselves with wet towels and use a shampoo that does not need to be rinsed out.
      The toilet uses a flow of air instead of water to carry waste away.
      Small inconveniences such as these, repeated daily over many months, are part of what researchers study as they prepare for longer journeys to the Moon and Mars.
    `,
    groups: [
      short(
        3,
        [
          ['Roughly how many sunrises do the crew see in a day?', 'sixteen|16', 'A2', 'The crew “see around sixteen sunrises and sixteen sunsets every day”. The number may be written in figures or words.'],
          ['What time system does the station use?', 'Coordinated Universal Time', 'A3', 'The station “keeps Coordinated Universal Time”. Three words: exactly the limit.'],
          ['What do astronauts discuss with the ground team every evening?', 'the day’s work|day’s work', 'B3', 'Each evening there is “a conference with the ground team to review the day’s work”.'],
          ['What do many astronauts like to look at in their free time?', 'the planet below|planet below|the planet|planet', 'B4', 'Their favourite way of spending free time is “looking out of the window at the planet below”.'],
          ['What does the treadmill harness prevent astronauts from doing?', 'float away|floating away', 'C4', 'Without the harness, “they would simply float away”.'],
          ['Apart from urine, what source of water is collected and purified?', 'moisture', 'D2', '“Moisture from the air, including the crew’s breath and sweat, is collected and purified.” “Moisture from the air” is four words, so “moisture” alone is the answer.'],
          ['What do astronauts eat instead of bread?', 'tortillas', 'E3', '“Bread is avoided… and tortillas are used instead.”'],
          ['In what form are salt and pepper provided?', 'liquid form|liquid|in liquid form', 'E4', '“Salt and pepper are supplied in liquid form.”'],
          ['What is each sleeping bag attached to?', 'the wall|wall', 'F2', 'The cabin has “a sleeping bag fixed to the wall”.'],
          ['What gas would collect around sleeping astronauts without the fans?', 'carbon dioxide', 'F5', 'Without the fans, “the carbon dioxide that astronauts breathe out would gather around their heads”.'],
          ['What does the toilet use to remove waste?', 'flow of air|air', 'G3', 'The toilet “uses a flow of air instead of water to carry waste away”.'],
        ],
        true,
      ),
    ],
  }),
])
