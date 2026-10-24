import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-15',
  task1({
    id: 'wfull-15-t1',
    instructions:
      'The chart below shows the amount of energy used by four sectors in the country of Corland in 1990, 2005 and 2020, measured in millions of tonnes of oil equivalent.',
    figure: {
      kind: 'bar',
      title: 'Energy use by sector in Corland',
      unit: 'million tonnes of oil equivalent',
      yLabel: 'Million tonnes of oil equivalent',
      categories: ['Industry', 'Transport', 'Homes', 'Services'],
      yMax: 60,
      yStep: 10,
      series: [
        { id: 'y1990', label: '1990', values: [52, 38, 41, 18] },
        { id: 'y2005', label: '2005', values: [40, 49, 44, 22] },
        { id: 'y2020', label: '2020', values: [28, 51, 36, 21] },
      ],
    },
    mode: 'trend',
    tips: [
      'The chart groups bars by sector: track each sector across the three years.',
      'Industry and transport swapped places — that belongs in the overview.',
      'Homes rose then fell; services barely moved.',
    ],
    model: `
The bar chart illustrates how much energy, in millions of tonnes of oil equivalent, was consumed by four sectors of the Corland economy in three different years between 1990 and 2020.

Overall, transport replaced industry as the largest consumer of energy over the thirty years. Industrial use fell steadily, while the other three sectors changed much less.

In 1990, industry used 52 million tonnes, more than any other sector. However, this figure declined consistently, to 40 million in 2005 and just 28 million in 2020, little more than half its original level. Transport moved in the opposite direction. It rose from 38 million tonnes to 49 million in 2005, overtaking industry, and then increased slightly to 51 million at the end of the period.

Household consumption followed a different pattern. It grew from 41 to 44 million tonnes between 1990 and 2005, but then dropped to 36 million in 2020, perhaps reflecting better insulation. The services sector was consistently the smallest user of energy. Its consumption stayed at around 20 million tonnes throughout, peaking at 22 million in 2005.
`,
    notes: [
      ['how much energy, in millions of tonnes of oil equivalent, was consumed by four sectors of the Corland economy', 'LR', 'The unit is kept exactly, but the rest of the question is rephrased.'],
      ['Overall, transport replaced industry as the largest consumer of energy over the thirty years.', 'TA', 'The most important change — a reversal — leads the overview.'],
      ['little more than half its original level', 'TA', 'The overall change is summarised as a fraction of the start.'],
      ['Transport moved in the opposite direction.', 'CC', 'A short contrasting topic sentence.'],
      ['perhaps reflecting better insulation', 'TA', 'A cautious possible reason, marked with “perhaps” — Task 1 should not speculate further than this.'],
    ],
  }),
  task2({
    id: 'wfull-15-t2',
    type: 'two-part',
    instructions: [
      'Nowadays, many people change their career several times during their working lives.',
      'Why is this happening? Is it a positive or a negative development?',
    ],
    parts: [
      ['why people change careers', /\b(because|reason|why|technology|automation|longer|retire|satisf|fulfil|pay|jobs? (?:disappear|change))\b/i],
      ['positive or negative', /\b(positive|negative|benefit|beneficial|harm|drawback|development|good thing)\b/i],
    ],
    tips: [
      'Question 1: two or three reasons (technology, longer working lives, changing values).',
      'Question 2: a direct answer — mainly positive, mainly negative, or both, with reasons.',
      'Use one example of a real career change to make your essay concrete.',
    ],
    model: `
In the past, many people stayed in the same profession, and sometimes with the same employer, from leaving school until retirement. Today, however, it is common to change careers two or three times. This essay will examine the reasons for this shift and argue that it is mostly a positive development.

There are three main reasons why people change careers more often. The first is technological change. Automation and artificial intelligence are transforming industries, so jobs such as bank clerk or factory worker are disappearing, and workers are forced to retrain. Secondly, people are working for longer. With retirement ages rising towards seventy, a career that began at twenty may last half a century, and it is natural for interests to change over such a long period. Finally, younger generations place more value on job satisfaction than on security, and they are more willing to leave a well-paid post if they find it unfulfilling.

In my view, this trend is largely positive. Changing careers allows people to find work that suits them better, and those who enjoy their jobs tend to be more productive and healthier. Economies also benefit when workers move from declining industries into growing ones. For example, a former engineer who retrains as a teacher brings valuable practical knowledge into the classroom. The main drawback is the cost of retraining, which can be stressful for people with families to support. Governments can reduce this problem by offering affordable adult education.

In conclusion, people change careers more often because of technology, longer working lives and a desire for fulfilment. Provided that retraining is accessible, I believe this flexibility benefits both individuals and society.
`,
    notes: [
      ['This essay will examine the reasons for this shift and argue that it is mostly a positive development.', 'TA', 'The introduction answers both questions in outline.'],
      ['There are three main reasons why people change careers more often.', 'CC', 'Body paragraph 1 is announced as the answer to question 1.'],
      ['a career that began at twenty may last half a century', 'LR', 'A memorable way of expressing a long working life.'],
      ['In my view, this trend is largely positive.', 'TA', 'Body paragraph 2 gives a direct answer to question 2.'],
      ['a former engineer who retrains as a teacher brings valuable practical knowledge into the classroom', 'TA', 'A concrete example of a positive career change.'],
    ],
  }),
)
