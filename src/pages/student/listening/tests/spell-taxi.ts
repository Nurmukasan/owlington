import { form, limit, part, person, test } from '../build'

const op = person('op', 'Darren', 'Taxi company operator', 'm', 'en-GB', 'MnTN9XubPKNlI4AwhLj5')
const lin = person('lin', 'Ms Zhao', 'Caller', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')

export default test('spell-taxi', [
  part({
    n: 1,
    title: 'Booking an airport taxi',
    intro: 'You will hear a woman phoning a taxi company to book a car to the airport.',
    speakers: [op, lin],
    blocks: [
      {
        lines: `
          op: Castle Cars, good afternoon. Darren speaking.
          lin: Hi. I'd like to book a taxi to the airport for next week.
          op: No problem. Name, please?
          lin: Lin Zhao. That's Z-H-A-O. || Lin Zhao. That's Z, H, A, O.
          op: Sorry, was that J or Z at the start?
          lin: Z. Z for zebra.
          op: Thanks. And the pick-up address?
          lin: 27 Kingsley Gardens. K-I-N-G-S-L-E-Y. || Twenty-seven Kingsley Gardens. K, I, N, G, S, L, E, Y.
          op: And the date?
          lin: Wednesday the 17th. || Wednesday the seventeenth.
          op: What time is your flight?
          lin: It leaves at ten past eleven in the morning, but I need to be at the airport two hours before.
          op: Then I'd suggest we collect you at quarter past seven, to allow for traffic.
          lin: OK, quarter past seven.
          op: Which terminal?
          lin: Terminal 3. My flight number is EI 2647, to Dublin. || Terminal three. My flight number is E, I, two six four seven, to Dublin.
          op: How many passengers?
          lin: Just me, but I have two large suitcases and a set of golf clubs.
          op: Then we'll send an estate car. The fare will be forty-eight pounds.
          lin: Can I pay by card?
          op: Yes, in the car. And I'll text you the driver's details. What's your mobile number?
          lin: It's 07812 004 395. || It's oh seven eight one two, double oh four, three nine five.
          op: And your booking reference is CC 8130. || And your booking reference is C, C, eight one three oh.
        `,
        groups: [
          form(
            'Castle Cars — airport booking',
            limit(2, true),
            [
              'Name: Lin [[Zhao]]',
              'Pick-up: 27 [[Kingsley]] Gardens',
              'Date: Wednesday [[17|17th]]',
              'Pick-up time: [[7.15|7:15]] am',
              'Terminal: [[3|three]]',
              'Flight number: [[EI 2647|EI2647]]',
              'Luggage: two suitcases and [[golf clubs]]',
              'Fare: £[[48|forty-eight]]',
              'Mobile: [[07812 004 395|07812004395]]',
              'Booking reference: CC [[8130]]',
            ],
            [
              ["That's Z-H-A-O", 'Z for zebra, not J.'],
              ['K-I-N-G-S-L-E-Y', 'The street is spelt out.'],
              ['Wednesday the 17th', 'The day of the month.'],
              ['we collect you at quarter past seven', 'The flight is at 11.10; the driver allows for traffic.'],
              ['Terminal 3', 'The terminal number.'],
              ['My flight number is EI 2647', 'Two letters and four digits.'],
              ['a set of golf clubs', 'So an estate car is needed.'],
              ['The fare will be forty-eight pounds', 'Paid by card in the car.'],
              ["It's 07812 004 395", '“Double oh” means 00.'],
              ['your booking reference is CC 8130', 'Read as digits: eight one three oh.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Sorry, was that J or Z at the start?', 1, 'It is Z.'],
      ['It leaves at ten past eleven in the morning', 4, 'The flight time, not the pick-up time.'],
    ],
  }),
])
