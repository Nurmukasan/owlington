import { matching, part, person, test } from '../build'

const ivy = person('ivy', 'Ivy', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const tom = person('tom', 'Tom', 'Student', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')

export default test('match-seminar', [
  part({
    n: 3,
    title: 'Comparing city transport policies',
    intro: 'You will hear two urban planning students, Ivy and Tom, discussing cities they have studied.',
    speakers: [ivy, tom],
    blocks: [
      {
        lines: `
          ivy: Shall we go through the cities for the seminar? We've each read about some of them.
          tom: Sure. Let's start with Copenhagen. The thing everyone talks about is the cycling, obviously.
          ivy: Yes, but what I found interesting is how they did it. They didn't just paint lines on roads; they built cycle lanes that are physically separated from traffic. That's why people feel safe.
          tom: OK. What about Bogotá?
          ivy: Bogotá's famous for its bus system. Buses have their own lanes, and passengers pay before they get on, so it works almost like an underground railway but at a fraction of the cost.
          tom: That's the key point, isn't it? It was much cheaper than building a metro.
          ivy: Exactly. What did you find on Singapore?
          tom: Singapore controls the number of cars directly. You have to buy a certificate before you can own a car, and the price can be more than the car itself.
          ivy: Wow. And London?
          tom: London's best known for the congestion charge, where drivers pay to enter the centre. But the article I read said the main effect wasn't less traffic, which went back up after a few years. It was the money raised, which was spent on buses.
          ivy: Interesting. And Freiburg?
          tom: That's the one in Germany. They designed a whole new district where houses don't have parking spaces. If you want a car, you have to pay for a space in a garage at the edge of the district, which is very expensive.
          ivy: And Seoul? That was mine. They demolished a motorway that ran through the city centre and uncovered a river that had been buried underneath it. Now it's a park.
          tom: And traffic didn't get worse?
          ivy: Surprisingly, no. People changed their routes, or switched to public transport.
        `,
        groups: [
          matching(
            'Which policy is described for each city? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 21–26.',
            'Policies',
            [
              'removing a major road',
              'limiting car ownership',
              'separating bicycles from traffic',
              'using charges to fund public transport',
              'building a cheap alternative to a metro',
              'housing without parking',
              'free public transport',
              'banning cars at weekends',
            ],
            [
              ['Copenhagen', 'C', 'cycle lanes that are physically separated from traffic', 'This is why cyclists feel safe.'],
              ['Bogotá', 'E', 'It was much cheaper than building a metro', 'A bus system that works like an underground railway.'],
              ['Singapore', 'B', 'You have to buy a certificate before you can own a car', 'Car numbers are controlled directly.'],
              ['London', 'D', 'It was the money raised, which was spent on buses', 'Traffic went back up after a few years.'],
              ['Freiburg', 'F', "a whole new district where houses don't have parking spaces", 'Parking is only available in an expensive garage.'],
              ['Seoul', 'A', 'They demolished a motorway that ran through the city centre', 'It is now a park beside a river.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["the main effect wasn't less traffic", 24, 'Traffic reduction did not last.'],
      ['passengers pay before they get on', 22, 'A detail; the key point is cost.'],
    ],
  }),
])
