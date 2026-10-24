import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-10',
  task1({
    id: 'wfull-10-t1',
    instructions: 'The table below shows the average amount of water used per person per day, in litres, for different purposes in four countries.',
    figure: {
      kind: 'table',
      title: 'Daily water use per person (litres)',
      unit: 'litres per person per day',
      columns: ['Use', 'Country A', 'Country B', 'Country C', 'Country D'],
      rows: [
        ['Bathing and showering', 95, 52, 38, 12],
        ['Toilet', 70, 38, 24, 6],
        ['Washing clothes', 45, 26, 18, 9],
        ['Cooking and drinking', 15, 12, 10, 8],
        ['Garden', 85, 14, 5, 0],
        ['Total', 310, 142, 95, 35],
      ],
    },
    tips: [
      'No years: compare the countries, and compare the uses.',
      'The overview: Country A uses far more than the others; bathing is the largest use almost everywhere.',
      'Cooking and drinking is similar in all four countries — a useful contrast with the rest.',
    ],
    model: `
The table compares how many litres of water an average person consumes daily for five different purposes in four countries, labelled A to D.

Overall, people in Country A use far more water than residents of the other three countries, while consumption in Country D is extremely low. In most countries, bathing and showering is the largest single use.

The total for Country A is 310 litres per person, more than double the figure for Country B (142) and almost nine times that for Country D (35). Country C lies in between, at 95 litres. The difference is most noticeable in gardens. Residents of Country A use 85 litres a day for watering, whereas in Country D none is used for this purpose at all.

Bathing and showering accounts for the greatest share in A, B and C, ranging from 95 litres down to 38. In Country D, by contrast, people use only 12 litres for washing themselves. The one area in which the four countries are broadly similar is cooking and drinking, where consumption varies only from 8 to 15 litres, suggesting that basic needs are much the same everywhere.
`,
    notes: [
      ['how many litres of water an average person consumes daily for five different purposes', 'LR', 'Paraphrase: “amount of water used per person per day” becomes “how many litres an average person consumes daily”.'],
      ['Overall, people in Country A use far more water than residents of the other three countries', 'TA', 'The overview compares the countries before any detail.'],
      ['more than double the figure for Country B (142) and almost nine times that for Country D (35)', 'TA', 'Ratios compare totals efficiently.'],
      ['The difference is most noticeable in gardens.', 'GRA', 'A short sentence introduces the most striking detail.'],
      ['The one area in which the four countries are broadly similar is cooking and drinking', 'TA', 'Similarity is a key feature too — not just differences.'],
    ],
  }),
  task2({
    id: 'wfull-10-t2',
    type: 'two-part',
    instructions: [
      'Fewer people now read printed newspapers than in the past.',
      'Why is this happening? Do you think printed newspapers will disappear completely?',
    ],
    parts: [
      ['why fewer people read printed newspapers', /\b(because|reason|why|online|internet|phones?|free|social media|instantly|cost)\b/i],
      ['whether printed newspapers will disappear', /\b(disappear|survive|vanish|future|will (?:not|continue|remain)|predict|likely)\b/i],
    ],
    tips: [
      'Answer question 1 with two or three clear reasons.',
      'Answer question 2 directly: yes, no, or not completely — and why.',
      'Keep your prediction realistic and support it with an example.',
    ],
    model: `
Sales of printed newspapers have fallen sharply in most countries over the past two decades. This essay will consider the reasons for this decline and argue that, although print will continue to shrink, it is unlikely to disappear altogether.

The main reason for the fall in readership is the internet. News is now available instantly and usually free of charge on websites, apps and social media, so many people see little reason to pay for a paper that reports yesterday's events. Smartphones have made this even more convenient, as readers can check the headlines on the bus or in a queue. In addition, advertisers have moved online, where they can target customers more precisely. As a result, newspapers have lost income, raised their prices and cut staff, which makes them less attractive still.

Nevertheless, I do not think that printed newspapers will vanish completely. A loyal group of readers, especially older people, still enjoys the experience of reading a paper over breakfast. Some publications have also found a niche. For example, weekend editions with long articles, puzzles and supplements remain popular, and local papers are often the only source of news about council decisions or community events. A newspaper is also free from notifications and distractions, which some readers value.

In conclusion, printed newspapers are declining because online news is faster, cheaper and more convenient. However, I believe they are likely to survive in a smaller form, such as weekend and local editions, serving readers who prefer a slower and more focused way of following the news.
`,
    notes: [
      ['This essay will consider the reasons for this decline and argue that, although print will continue to shrink, it is unlikely to disappear altogether.', 'TA', 'Both questions are answered in outline at the start.'],
      ['so many people see little reason to pay for a paper that reports yesterday\'s events', 'LR', 'A vivid phrase explains the reason rather than just stating it.'],
      ['As a result, newspapers have lost income, raised their prices and cut staff, which makes them less attractive still.', 'CC', 'A cause-and-effect chain shows how one problem leads to another.'],
      ['Nevertheless, I do not think that printed newspapers will vanish completely.', 'TA', 'Body paragraph 2 opens with a direct answer to question 2.'],
      ['local papers are often the only source of news about council decisions or community events', 'TA', 'A specific reason why some newspapers will survive.'],
    ],
  }),
)
