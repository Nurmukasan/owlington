import { form, limit, part, person, test } from '../build'

const nurse = person('nurse', 'Gemma', 'Veterinary receptionist', 'f', 'en-AU', '2oKmj8Mq72d27JWiLtSX')
const owner = person('owner', 'Mr Rhodes', 'Pet owner', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')

export default test('spell-vet', [
  part({
    n: 1,
    title: 'Registering a pet with a vet',
    intro: 'You will hear a man phoning a veterinary clinic to register his dog.',
    speakers: [nurse, owner],
    blocks: [
      {
        lines: `
          nurse: Hello, Harbourside Vets, Gemma speaking.
          owner: Hello. We've just moved to the area, and I'd like to register my dog with you.
          nurse: Of course. Can I have your name?
          owner: Gerald Rhodes. R-H-O-D-E-S. || Gerald Rhodes. R, H, O, D, E, S.
          nurse: And the dog's name?
          owner: She's called Pippa. P-I-double P-A. || She's called Pippa. P, I, double P, A.
          nurse: Lovely. What breed is she?
          owner: She's a whippet. W-H-I-double P-E-T. || She's a whippet. W, H, I, double P, E, T.
          nurse: And how old?
          owner: She'll be four in June.
          nurse: So she's three now. And do you know her weight?
          owner: She was eleven point four kilos at her last check-up. || She was eleven point four kilos at her last check-up.
          nurse: Thanks. Does she have a microchip?
          owner: Yes. The number's on her old records. It's 9 8 5 1 4 1 0 0 0 7 2. || Yes. The number's on her old records. It's nine eight five, one four one, double oh, oh seven two.
          nurse: I'll just take the last four digits for now: 0072. || I'll just take the last four digits for now: oh oh seven two.
          owner: That's right.
          nurse: And what was the name of your previous vet, so we can ask for her records?
          owner: It was the Mayfield Clinic, in Leeds. M-A-Y-F-I-E-L-D. || It was the Mayfield Clinic, in Leeds. M, A, Y, F, I, E, L, D.
          nurse: And your new address?
          owner: 19 Quarry Lane. || Nineteen Quarry Lane.
          nurse: Is that Q-U-A-double R-Y? || Is that Q, U, A, double R, Y?
          owner: Yes. And the postcode's SA3 4LW. || Yes. And the postcode's S, A, three, four, L, W.
        `,
        groups: [
          form(
            'Harbourside Vets — registration',
            limit(2, true),
            [
              'Owner: Gerald [[Rhodes]]',
              'Pet’s name: [[Pippa]]',
              'Breed: [[whippet]]',
              'Age: [[3|three]]',
              'Weight: [[11.4]] kg',
              'Microchip (last four digits): [[0072]]',
              'Previous vet: the [[Mayfield]] Clinic, Leeds',
              'Address: 19 [[Quarry]] Lane',
              'Postcode: [[SA3 4LW|SA34LW]]',
            ],
            [
              ['R-H-O-D-E-S', 'The owner’s surname, spelt out.'],
              ["She's called Pippa", 'Double P in the middle.'],
              ["She's a whippet", 'The breed, with a double P.'],
              ["So she's three now", 'She will be four in June.'],
              ['eleven point four kilos', 'A decimal number.'],
              ["I'll just take the last four digits for now: 0072", 'Only the last four digits are written.'],
              ['M-A-Y-F-I-E-L-D', 'The previous clinic.'],
              ['19 Quarry Lane', 'The receptionist checks it: Q-U-A-double R-Y.'],
              ["the postcode's SA3 4LW", 'Letters and numbers mixed.'],
            ],
          ),
        ],
      },
      {
        lines: `
          nurse: Finally, would you like to book a first check-up? It's free for new patients.
          owner: Yes, please. Do you have anything on Saturday?
          nurse: Saturday morning is full, I'm afraid. How about Friday at twenty to five?
          owner: That's fine. Twenty to five on Friday.
        `,
        groups: [
          form(
            'Appointment',
            limit(1, true),
            ['First check-up: Friday at [[4.40|4:40]] pm'],
            [['How about Friday at twenty to five?', 'Twenty to five is 4.40; Saturday morning is full.']],
          ),
        ],
      },
    ],
    traps: [
      ["She'll be four in June", 4, 'She is three now.'],
      ['Saturday morning is full', 10, 'The appointment is on Friday.'],
    ],
  }),
])
