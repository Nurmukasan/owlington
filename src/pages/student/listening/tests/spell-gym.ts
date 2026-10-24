import { form, limit, part, person, test } from '../build'

const desk = person('desk', 'Amber', 'Gym receptionist', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const kofi = person('kofi', 'Kofi', 'Caller', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')

export default test('spell-gym', [
  part({
    n: 1,
    title: 'Joining a gym',
    intro: 'You will hear a man joining a gym over the phone.',
    speakers: [desk, kofi],
    blocks: [
      {
        lines: `
          desk: Good morning, Pulse Fitness, Amber speaking.
          kofi: Hi. I'd like to sign up for a membership, please.
          desk: Great. Can I start with your first name?
          kofi: Kofi. K-O-F-I. || Kofi. K, O, F, I.
          desk: And your surname?
          kofi: Asante-Boateng. That's A-S-A-N-T-E, then a hyphen, then B-O-A-T-E-N-G. || Asante-Boateng. That's A, S, A, N, T, E, then a hyphen, then B, O, A, T, E, N, G.
          desk: Thank you. And your date of birth?
          kofi: The 30th of November, 1994. || The thirtieth of November, nineteen ninety-four.
          desk: Lovely. And your address?
          kofi: Flat 6, 112 Thornbury Road. || Flat six, one one two Thornbury Road.
          desk: Thornbury, is that T-H-O-R-N-B-U-R-Y? || Thornbury, is that T, H, O, R, N, B, U, R, Y?
          kofi: That's it.
          desk: And the postcode?
          kofi: BS7 9QT. || B, S, seven, nine, Q, T.
          desk: Sorry, was that Q or U?
          kofi: Q, for queen.
          desk: Got it. Could I take a phone number?
          kofi: Yes, it's 07700 851 263. Oh, sorry, I mean 07700 851 236. The last two numbers are the other way round. || Yes, it's oh seven seven double oh, eight five one, two six three. Oh, sorry, I mean oh seven seven double oh, eight five one, two three six. The last two numbers are the other way round.
          desk: 236. OK. And an email address? || Two three six. OK. And an email address?
          kofi: kofi.ab@quickmail.net. That's Q-U-I-C-K mail. || kofi dot a b, at quickmail dot net. That's Q, U, I, C, K mail.
        `,
        groups: [
          form(
            'Pulse Fitness — new member',
            limit(2, true),
            [
              '= First name: Kofi',
              'Surname: [[Asante-Boateng]]',
              'Date of birth: [[30|30th]] November 1994',
              'Address: Flat 6, [[112]] [[Thornbury]] Road',
              'Postcode: [[BS7 9QT|BS79QT]]',
              'Phone: [[07700 851 236|07700851236]]',
              'Email: kofi.ab@[[quickmail]].net',
            ],
            [
              ["Asante-Boateng. That's A-S-A-N-T-E", 'A hyphenated surname: A-S-A-N-T-E, hyphen, B-O-A-T-E-N-G.'],
              ['The 30th of November, 1994', 'The day of the month.'],
              ['Flat 6, 112 Thornbury Road', 'The house number; Flat 6 is printed.'],
              ['Thornbury, is that T-H-O-R-N-B-U-R-Y?', 'The receptionist checks the spelling.'],
              ['BS7 9QT', 'Q for queen, not U.'],
              ['I mean 07700 851 236', 'He corrects the last two digits.'],
              ["That's Q-U-I-C-K mail", 'The email domain is spelt out.'],
            ],
          ),
        ],
      },
      {
        lines: `
          desk: Now, which membership would you like? We have Off-Peak at twenty-two pounds a month, or Anytime at thirty-four.
          kofi: Anytime, please. I usually train after work.
          desk: Fine. There's a one-off joining fee of fifteen pounds, but it's waived if you sign up for twelve months.
          kofi: I'll do twelve months, then.
          desk: And when would you like to start?
          kofi: Monday the 2nd. || Monday the second.
          desk: Lovely. Your membership number will be PF 5081. Please bring photo ID on your first visit. || Lovely. Your membership number will be P, F, five oh eight one. Please bring photo ID on your first visit.
        `,
        groups: [
          form(
            'Membership',
            limit(1, true),
            [
              'Type: Anytime, £[[34|thirty-four]] per month',
              'Start date: Monday [[2|2nd]]',
              'Membership number: PF [[5081]]',
            ],
            [
              ['or Anytime at thirty-four', 'Off-Peak is £22; he chooses Anytime.'],
              ['Monday the 2nd', 'His start date.'],
              ['Your membership number will be PF 5081', 'Read as digits: five oh eight one.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ["Yes, it's 07700 851 263", 6, 'Corrected: the last two digits are swapped.'],
      ['Sorry, was that Q or U?', 5, 'It is Q.'],
      ['We have Off-Peak at twenty-two pounds a month', 8, 'He chooses Anytime.'],
    ],
  }),
])
