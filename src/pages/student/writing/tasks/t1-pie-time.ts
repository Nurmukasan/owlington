import { task1 } from '../build'

export default task1({
  id: 't1-pie-time',
  instructions: 'The pie charts below show how university students and working adults in one country spend a typical weekday.',
  figure: {
    kind: 'pie',
    title: 'A typical weekday (% of 24 hours)',
    slices: ['Sleep', 'Study or work', 'Travel', 'Leisure', 'Other'],
    pies: [
      { label: 'University students', values: [35, 25, 5, 22, 13] },
      { label: 'Working adults', values: [30, 38, 8, 12, 12] },
    ],
  },
  tips: [
    'Two groups, not two years: compare them, do not describe change.',
    'Biggest differences: work/study and leisure. Smallest: travel and other.',
    'Convert some percentages to hours for variety (25% of a day = 6 hours).',
  ],
  model: `
The two pie charts compare the way in which students at university and people in employment in one country divide up an ordinary weekday.

Overall, working adults devote much more of their day to work than students do to study, whereas students enjoy considerably more leisure time and sleep. Both groups spend only a small part of the day travelling.

The largest single activity for students is sleep, which takes up 35% of their day, or more than eight hours. Studying accounts for a quarter of their time (25%), and leisure for 22%, almost as much. By contrast, working adults spend the biggest share of the day, 38%, at work, and they sleep for less time than students (30%).

The remaining categories are more similar. Leisure is the most notable exception. Working adults have only 12% of their day for free time, roughly half the figure for students. Travel takes up 8% of the day for workers compared with 5% for students, and other activities, such as cooking and housework, account for 12% and 13% respectively.
`,
  notes: [
    ['the way in which students at university and people in employment in one country divide up an ordinary weekday', 'LR', 'Paraphrase of both groups and of “spend a typical weekday”.'],
    ['Overall, working adults devote much more of their day to work than students do to study', 'TA', 'An overview of the biggest differences between the two charts.'],
    ['which takes up 35% of their day, or more than eight hours', 'LR', 'Converting a percentage into hours adds meaning and variety.'],
    ['Leisure is the most notable exception.', 'GRA', 'A short sentence introduces the key difference in the final paragraph.'],
    ['roughly half the figure for students', 'TA', 'A comparison between the two groups, not just two numbers.'],
  ],
})
