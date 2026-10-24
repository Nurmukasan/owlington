import { matching, part, person, test } from '../build'

const rep = person('rep', 'Carla', 'Holiday rep', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')

export default test('match-tours', [
  part({
    n: 2,
    title: 'Excursions from a holiday resort',
    intro: 'You will hear a holiday representative describing day trips to a group of tourists.',
    speakers: [rep],
    blocks: [
      {
        lines: `
          rep: Good morning, everyone, and welcome to the resort. I'm Carla, your rep for the week, and I'd like to tell you about the excursions you can book with us.
          rep: First, the Old Town walking tour. It's led by a local historian, and it's the best way to understand the history of the island. It's mostly on foot, of course, and some of the streets are very steep, so you'll need good shoes.
          rep: Next, the boat trip to the Blue Caves. This is our most popular excursion, and it sells out every week, so if you want to go, book today.
          rep: Then there's the wine and olive tour. You visit two farms in the hills, and lunch is included in the price, with local cheeses and bread.
          rep: For something more active, there's the mountain bike day. We provide the bikes and helmets, but because of insurance rules, it's only for people aged sixteen and over.
          rep: The market trip on Saturday morning is the cheapest excursion, at just twelve euros. It's basically a bus to the big market in the capital, and you're free to explore on your own.
          rep: If you're interested in wildlife, there's the dolphin watching trip. It leaves very early, at six in the morning, because that's when the dolphins are most active.
          rep: And finally, the evening of traditional music. It's held in a village square, and it's a great night out, though I should warn you it doesn't finish until after midnight.
        `,
        groups: [
          matching(
            'What does Carla say about each excursion? Choose SEVEN answers from the box and write the correct letter, A–I, next to Questions 11–17.',
            'Information',
            [
              'It includes a meal.',
              'It has an age limit.',
              'It finishes late.',
              'It involves a lot of walking.',
              'It starts very early.',
              'It often sells out.',
              'It is the least expensive.',
              'It is cancelled in bad weather.',
              'It is new this year.',
            ],
            [
              ['Old Town walking tour', 'D', 'some of the streets are very steep', 'It is mostly on foot, so good shoes are needed.'],
              ['Blue Caves boat trip', 'F', 'it sells out every week', 'Book today to be sure of a place.'],
              ['wine and olive tour', 'A', 'lunch is included in the price', 'With local cheeses and bread.'],
              ['mountain bike day', 'B', "it's only for people aged sixteen and over", 'Because of insurance rules.'],
              ['market trip', 'G', "The market trip on Saturday morning is the cheapest excursion", 'Just twelve euros.'],
              ['dolphin watching', 'E', 'It leaves very early, at six in the morning', 'The dolphins are most active then.'],
              ['traditional music evening', 'C', "it doesn't finish until after midnight", 'Held in a village square.'],
            ],
          ),
        ],
      },
    ],
    traps: [["This is our most popular excursion", 12, 'Popular, and the point is that it sells out.']],
  }),
])
