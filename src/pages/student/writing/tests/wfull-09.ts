import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-09',
  task1({
    id: 'wfull-09-t1',
    instructions:
      'The chart below shows the percentage of adults in five age groups who did at least 150 minutes of exercise a week in one country in 2005 and 2025.',
    figure: {
      kind: 'bar',
      title: 'Adults doing 150+ minutes of exercise a week',
      unit: '% of adults',
      yLabel: '% of adults',
      categories: ['18–29', '30–44', '45–59', '60–74', '75+'],
      yMax: 70,
      yStep: 10,
      series: [
        { id: 'y2005', label: '2005', values: [58, 44, 36, 24, 9] },
        { id: 'y2025', label: '2025', values: [55, 49, 47, 41, 18] },
      ],
    },
    mode: 'trend',
    tips: [
      'Two years for each group: say which groups rose and which fell.',
      'There is a clear pattern by age — activity falls as people get older. Mention it in the overview.',
      'The biggest improvement was among older people: find the group with the largest increase.',
    ],
    model: `
The bar chart compares the proportion of adults in different age brackets who exercised for a minimum of 150 minutes weekly in one country, in 2005 and twenty years later.

Overall, the likelihood of doing this much exercise fell with age in both years. However, activity levels rose in every age group except the youngest, and the gap between younger and older adults narrowed considerably.

In 2005, 58% of 18- to 29-year-olds met the target, the highest figure in the chart, compared with 44% of those aged 30 to 44 and 36% of 45- to 59-year-olds. By 2025, the youngest group had become slightly less active, at 55%, whereas the next two groups had both improved, to 49% and 47% respectively.

The most striking increases were among older people. The proportion of 60- to 74-year-olds who exercised regularly rose from 24% to 41%, an increase of seventeen percentage points. Among the over-75s, the figure doubled. It went from just 9% to 18%, although this group remained the least active by a wide margin.
`,
    notes: [
      ['the proportion of adults in different age brackets who exercised for a minimum of 150 minutes weekly', 'LR', 'Every key word of the question is rephrased: percentage → proportion, at least → a minimum of.'],
      ['Overall, the likelihood of doing this much exercise fell with age in both years.', 'TA', 'The overview identifies the pattern across categories, not only the change over time.'],
      ['whereas the next two groups had both improved', 'CC', '“Whereas” contrasts the youngest group with the rest in one sentence.'],
      ['an increase of seventeen percentage points', 'LR', 'Changes in percentages are “percentage points” — a precise term examiners notice.'],
      ['although this group remained the least active by a wide margin', 'TA', 'Even an improving group is placed in context.'],
    ],
  }),
  task2({
    id: 'wfull-09-t2',
    type: 'problem',
    instructions: [
      'Many young people leave school without practical life skills, such as managing money or cooking.',
      'What are the causes of this problem? What solutions can you suggest?',
    ],
    tips: [
      'Causes in one paragraph, solutions in the next — and match them.',
      'Think about schools, parents and technology.',
      'Specific examples make solutions believable: a budgeting app, a cooking club, a bank visit.',
    ],
    model: `
It is often said that today's school leavers can write an essay about climate change but cannot cook a simple meal or plan a monthly budget. This essay will explore why so many young people lack these practical skills and propose some ways of addressing the problem.

One major cause is the pressure on schools to achieve high exam results. Because schools are judged mainly on academic grades, subjects such as home economics have been cut back or removed entirely to make room for more mathematics and science. A second reason is that busy parents have less time to pass on skills at home. In families where both parents work long hours, it is quicker to buy ready meals than to teach a teenager to cook. Technology has also played a part, as online banking and contactless payments make money feel abstract, so young people rarely handle cash or see a paper bank statement.

Several solutions could help. First, schools could include a short, compulsory life-skills course in the final two years, covering budgeting, cooking and basic household repairs. This need not take much time; one lesson a week would be enough. Second, banks and charities could run free workshops for teenagers. For example, some banks already send staff into schools to explain interest rates and credit cards through simple games. Finally, parents could involve children in everyday tasks, such as planning the weekly shopping.

In conclusion, a focus on exam results, busy family lives and digital money have all contributed to the problem. A combination of school courses, outside workshops and family involvement could ensure that young people leave school ready for independent life.
`,
    notes: [
      ['This essay will explore why so many young people lack these practical skills and propose some ways of addressing the problem.', 'TA', 'The introduction maps both parts of the question.'],
      ['One major cause is the pressure on schools to achieve high exam results.', 'CC', 'A clear topic sentence names the first cause.'],
      ['make money feel abstract', 'LR', 'A precise and less common way to describe the effect of digital payments.'],
      ['This need not take much time; one lesson a week would be enough.', 'GRA', 'A semicolon links a claim to its justification.'],
      ['some banks already send staff into schools to explain interest rates and credit cards through simple games', 'TA', 'The solution is made realistic with an existing example.'],
    ],
  }),
)
