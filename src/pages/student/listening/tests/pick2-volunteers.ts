import { choose2, part, person, test } from '../build'

const coord = person('coord', 'Gary', 'Event organiser', 'm', 'en-AU', 'AsGY6GCuJNcXklospqtq')

export default test('pick2-volunteers', [
  part({
    n: 2,
    title: 'A beach clean-up day',
    intro: 'You will hear an organiser talking to volunteers before a beach clean-up.',
    speakers: [coord],
    blocks: [
      {
        lines: `
          coord: Morning, everyone! Thanks for turning up. I'm Gary, and I organise these clean-ups every month.
          coord: This is our twentieth clean-up on this beach. Over that time, we've collected more than four tonnes of rubbish. The most common items are plastic bottle tops and cigarette ends. Surprisingly, fishing equipment, like nets and lines, is the heaviest category by weight.
          coord: Before we start, safety. Please wear the gloves we've given you at all times. And if you find anything sharp, like broken glass or needles, don't pick it up. Mark the spot with one of the yellow flags and tell a team leader.
          coord: You don't need to bring water; we've got plenty at the tent. But do put on sunscreen, because there's no shade on the beach.
          coord: We record everything we collect. Each team has a tally sheet, and the data goes to a national marine charity, which uses it to campaign for changes in the law.
          coord: The council supports us too. They lend us equipment and collect the full bags at the end, so you don't have to carry them anywhere.
          coord: We finish at twelve. Afterwards, the café on the seafront is offering every volunteer a free hot drink, and there'll be a prize for the team that collects the most unusual item.
          coord: Last time, it was a bowling ball! And if you enjoyed today, the best way to stay in touch is our social media page, where we post the dates of future events.
        `,
        groups: [
          choose2(
            'Which TWO kinds of rubbish are the most common?',
            ['plastic bottle tops', 'fishing nets', 'cigarette ends', 'glass bottles', 'food packaging'],
            ['A', 'C'],
            [
              ['The most common items are plastic bottle tops', 'The most common, by number.'],
              ['and cigarette ends', 'Fishing equipment is the heaviest, not the most common.'],
            ],
          ),
          choose2(
            'Which TWO things should volunteers do if they find something sharp?',
            ['pick it up carefully', 'put a flag next to it', 'take a photo of it', 'inform a team leader', 'put it in a separate bag'],
            ['B', 'D'],
            [
              ['Mark the spot with one of the yellow flags', 'Do not pick it up.'],
              ['tell a team leader', 'The team leader will deal with it.'],
            ],
          ),
          choose2(
            'Which TWO things does the council do?',
            ['provide drinking water', 'lend equipment', 'pay the volunteers', 'collect the rubbish bags', 'run the social media page'],
            ['B', 'D'],
            [
              ['They lend us equipment', 'The council supports the clean-up.'],
              ['collect the full bags at the end', 'Volunteers do not have to carry them.'],
            ],
          ),
          choose2(
            'Which TWO things will volunteers receive after the clean-up?',
            ['a free drink', 'a T-shirt', 'a certificate', 'a chance to win a prize', 'free parking'],
            ['A', 'D'],
            [
              ['offering every volunteer a free hot drink', 'At the café on the seafront.'],
              ["there'll be a prize for the team that collects the most unusual item", 'Last time it was a bowling ball.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['fishing equipment, like nets and lines, is the heaviest category by weight', 11, 'Heaviest, not most common.'],
      ["You don't need to bring water; we've got plenty at the tent", 15, 'The organisers provide water, not the council.'],
    ],
  }),
])
