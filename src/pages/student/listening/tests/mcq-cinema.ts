import { mcq, part, person, test } from '../build'

const host = person('host', 'Simon', 'Radio presenter', 'm', 'en-GB', 'JBFqnCBsd6RMkjVDRZzb')

export default test('mcq-cinema', [
  part({
    n: 2,
    title: 'A community cinema',
    intro: 'You will hear a radio presenter talking about a community cinema that has reopened.',
    speakers: [host],
    blocks: [
      {
        lines: `
          host: This week on Town Talk, I'm at the Regal, the art deco cinema on Bridge Street, which reopened last month after being closed for nearly twelve years.
          host: The Regal was built in 1936, and at its peak it could seat over a thousand people. It finally closed when a big multiplex opened on the edge of town. People often assume it closed because of television, but the building was actually full most weekends until the multiplex arrived. || The Regal was built in nineteen thirty-six, and at its peak it could seat over a thousand people. It finally closed when a big multiplex opened on the edge of town. People often assume it closed because of television, but the building was actually full most weekends until the multiplex arrived.
          host: It's been saved by a group of local volunteers, who formed a charity and raised the money to buy it. They expected most of the money to come from a lottery grant, but in the end the lottery gave less than a quarter. The rest came from local people, many of whom gave just a few pounds.
          host: The restoration wasn't simple. The original seats had been removed, and the roof was leaking. But the biggest challenge, according to the volunteers, was finding builders who knew how to repair the plasterwork on the ceiling, which is covered in decorative patterns.
          host: The new Regal is smaller. There are now two screens instead of one, with about two hundred seats in each. And there's a bar upstairs, which the volunteers hope will bring in money between films.
          host: What about the programme? The Regal doesn't try to compete with the multiplex for new blockbusters. Instead, it shows older classic films, foreign-language films and documentaries, along with films made by local schools.
          host: Ticket prices are lower than at the multiplex, and on Tuesdays all tickets are half price. There are also special screenings on Wednesday mornings for parents with babies, where the lights are kept low and nobody minds a bit of crying.
          host: The volunteers say the most rewarding thing has been seeing older residents come back. Many of them remember coming to the Regal as children, and some even had their first date there.
          host: If you'd like to help, the Regal is looking for volunteers. You don't need any experience, but you do need to be able to commit to at least two shifts a month.
        `,
        groups: [
          mcq([
            [
              'Why did the Regal close?',
              ['People preferred to watch television.', 'A larger cinema opened nearby.', 'The building was unsafe.'],
              'B',
              'It finally closed when a big multiplex opened on the edge of town',
              'People assume it was television, but it was full until the multiplex arrived.',
            ],
            [
              'Where did most of the money to buy the cinema come from?',
              ['a lottery grant', 'local people', 'a film company'],
              'B',
              'The rest came from local people',
              'The lottery gave less than a quarter.',
            ],
            [
              'What was the biggest challenge in restoring the building?',
              ['replacing the seats', 'repairing the roof', 'finding skilled builders'],
              'C',
              'the biggest challenge, according to the volunteers, was finding builders who knew how to repair the plasterwork',
              'The seats and roof were problems, but not the biggest one.',
            ],
            [
              'What is the purpose of the new bar?',
              ['to raise extra income', 'to attract younger people', 'to provide space for events'],
              'A',
              'the volunteers hope will bring in money between films',
              'The bar is upstairs.',
            ],
            [
              'What kind of films does the Regal NOT show?',
              ['new blockbusters', 'documentaries', 'films made by schools'],
              'A',
              "The Regal doesn't try to compete with the multiplex for new blockbusters",
              'It shows classics, foreign-language films, documentaries and school films.',
            ],
            [
              'What happens on Wednesday mornings?',
              ['All tickets are half price.', 'There are screenings for parents with babies.', 'Schools visit the cinema.'],
              'B',
              'special screenings on Wednesday mornings for parents with babies',
              'Half-price tickets are on Tuesdays.',
            ],
            [
              'What have the volunteers found most rewarding?',
              ['the return of older residents', 'the support of local schools', 'the quality of the films'],
              'A',
              'the most rewarding thing has been seeing older residents come back',
              'Many remember the Regal from childhood.',
            ],
            [
              'What do new volunteers need?',
              ['experience of working in a cinema', 'time for at least two shifts a month', 'a recommendation from a member'],
              'B',
              'you do need to be able to commit to at least two shifts a month',
              'No experience is needed.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['People often assume it closed because of television', 11, 'A common belief, not the reason.'],
      ['They expected most of the money to come from a lottery grant', 12, 'The lottery gave less than a quarter.'],
      ['on Tuesdays all tickets are half price', 16, 'Tuesday, not Wednesday.'],
      ["You don't need any experience", 18, 'Experience is not required.'],
    ],
  }),
])
