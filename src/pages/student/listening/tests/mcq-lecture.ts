import { mcq, part, person, test } from '../build'

const prof = person('prof', 'Dr Stevens', 'Lecturer', 'f', 'en-GB', 'Xb7hH8MSUJpSbSDYk0k2')

export default test('mcq-lecture', [
  part({
    n: 4,
    title: 'The economics of queues',
    intro: 'You will hear part of a lecture about why people queue and how organisations manage queues.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today I want to look at something we all experience but rarely think about: queuing. Researchers in economics and psychology have studied queues for decades, and some of their findings are surprising.
          prof: The first is that how long we actually wait matters less than how long we feel we've waited. In one well-known case, passengers at an airport complained constantly about waiting for their luggage. The airport hired more staff, which cut the wait to eight minutes, but the complaints continued.
          prof: The solution was not to make the luggage faster. Instead, the airport moved the arrival gates further from the baggage hall, so passengers spent six minutes walking and only two minutes standing still. Complaints almost disappeared.
          prof: This tells us that unoccupied time feels longer than occupied time. That's why many businesses put mirrors next to lifts, or screens in waiting areas.
          prof: A second finding concerns uncertainty. A wait feels much longer when we don't know how long it will last. Telling people the expected waiting time, even if it's long, makes them more patient. But there's a risk: if you overestimate, people are pleased; if you underestimate, they become angry.
          prof: Third, people care a great deal about fairness. Studies show that customers are more upset by someone pushing in than by the length of the wait itself. This is why many banks and post offices use a single line feeding several counters, rather than a separate line for each. With a single line, nobody can choose the wrong queue and watch others being served first.
          prof: Interestingly, a single line isn't always faster overall, but customers prefer it because it seems fairer.
          prof: Finally, some businesses deliberately create queues. A restaurant with a line outside appears popular, which attracts more customers. Some theme parks, on the other hand, now sell tickets that let people skip the queue. This raises income, but researchers have found it can make the other visitors feel the system is unfair, which may affect how they rate their whole day.
        `,
        groups: [
          mcq([
            [
              'What happened when the airport employed more staff?',
              ['Complaints stopped.', 'Complaints continued.', 'Luggage arrived more slowly.'],
              'B',
              'the complaints continued',
              'The wait was cut to eight minutes, but people still complained.',
            ],
            [
              'How did the airport finally solve the problem?',
              ['by making passengers walk further', 'by putting screens in the baggage hall', 'by delivering luggage faster'],
              'A',
              'moved the arrival gates further from the baggage hall',
              'Passengers walked for six minutes and stood for only two.',
            ],
            [
              'According to the lecturer, telling people the expected waiting time',
              ['should only be done for short waits.', 'helps them be more patient.', 'often makes them angry.'],
              'B',
              'makes them more patient',
              'Only an underestimate makes people angry.',
            ],
            [
              'What upsets customers most?',
              ['long waits', 'others pushing in', 'slow staff'],
              'B',
              'customers are more upset by someone pushing in than by the length of the wait itself',
              'Fairness matters more than length.',
            ],
            [
              'Why do customers prefer a single queue?',
              ['It is always faster.', 'It seems fairer.', 'It takes up less space.'],
              'B',
              'customers prefer it because it seems fairer',
              'It is not always faster overall.',
            ],
            [
              'What does the lecturer say about tickets that let people skip queues?',
              ['They reduce income.', 'They may make other visitors less satisfied.', 'They are popular with all visitors.'],
              'B',
              'it can make the other visitors feel the system is unfair',
              'This may affect how they rate their whole day.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['which cut the wait to eight minutes', 31, 'Shorter waits did not stop complaints.'],
      ['if you underestimate, they become angry', 33, 'Only underestimates cause anger.'],
      ["a single line isn't always faster overall", 35, 'Speed is not the reason.'],
      ['This raises income', 36, 'Income goes up, not down.'],
    ],
  }),
])
