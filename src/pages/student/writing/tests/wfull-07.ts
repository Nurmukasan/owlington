import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-07',
  task1({
    id: 'wfull-07-t1',
    instructions:
      'The bar chart below shows the number of international students at Hallam University from 2010 to 2025. The pie chart shows the subjects they studied in 2025.',
    figure: {
      kind: 'multi',
      title: 'International students at Hallam University',
      parts: [
        {
          kind: 'bar',
          title: 'Number of international students',
          unit: 'students',
          yLabel: 'Students',
          categories: ['2010', '2015', '2020', '2025'],
          yMax: 6000,
          yStep: 1000,
          series: [{ id: 'students', label: 'International students', values: [1800, 3100, 2600, 5200] }],
        },
        {
          kind: 'pie',
          title: 'Subjects studied by international students, 2025',
          slices: ['Business', 'Engineering', 'Computing', 'Medicine', 'Arts'],
          pies: [{ label: '2025', values: [35, 22, 20, 13, 10] }],
        },
      ],
    },
    mode: 'trend',
    tips: [
      'Two visuals: write one overview sentence about each, then one body paragraph about each.',
      'The bar chart is a trend (with a dip in 2020); the pie chart is a comparison.',
      'You do not need to link the charts unless there is a real connection.',
    ],
    model: `
The bar chart illustrates how many students from overseas were enrolled at Hallam University between 2010 and 2025, while the pie chart breaks down their chosen fields of study in the final year.

Overall, the number of international students almost tripled over the period, despite a temporary fall in 2020. In 2025, business was by far the most popular subject among these students.

In 2010, the university had 1,800 international students. This figure rose rapidly to 3,100 in 2015 but then dropped to 2,600 five years later. After this dip, numbers doubled to reach a peak of 5,200 in 2025, roughly three times the starting level.

Turning to the subjects studied, business accounted for just over a third of international students (35%). Engineering and computing were the next most popular choices, with similar shares of 22% and 20% respectively. Medicine attracted 13%. Arts subjects were the least popular, with only one in ten overseas students choosing them.
`,
    notes: [
      ['while the pie chart breaks down their chosen fields of study in the final year', 'CC', 'One introduction covers both charts, joined with “while”.'],
      ['Overall, the number of international students almost tripled over the period', 'TA', 'The overview has one point for each chart.'],
      ['After this dip, numbers doubled to reach a peak of 5,200 in 2025', 'LR', 'Trend language for the bar chart: dip, doubled, peak.'],
      ['Turning to the subjects studied', 'CC', 'A clear signal that the second chart is now being described.'],
      ['with only one in ten overseas students choosing them', 'LR', 'Percentages expressed as fractions add variety.'],
    ],
  }),
  task2({
    id: 'wfull-07-t2',
    type: 'discussion',
    instructions: [
      'Some people believe that university education should be free for all students. Others think that students should pay the full cost of their studies.',
      'Discuss both these views and give your own opinion.',
    ],
    tips: [
      'Present each view fairly, with its strongest reasons.',
      'A middle position (free for some, or paid back after graduation) is fine — if you explain it.',
      'Use examples of real systems: free tuition in Germany, loans in England.',
    ],
    model: `
The question of who should pay for higher education divides opinion in many countries. Some argue that universities should be free, funded entirely by taxes, while others believe that students themselves should cover the full cost. In my opinion, the fairest solution lies between these two positions.

Supporters of free tuition believe that education is a public good. A society with more doctors, engineers and teachers benefits everyone, not only the graduates themselves, so it is reasonable for taxpayers to pay. Free tuition also ensures that talented young people from poor families are not discouraged by the price. For example, in Germany, where public universities charge almost no fees, students from all backgrounds can study without taking on large debts.

On the other hand, many people feel that it is unfair for everyone to pay for something that mainly benefits individuals. Graduates usually earn far more over their lifetimes than people without degrees, so it is argued that they should repay the investment. Fees may also make students more careful about choosing a course that leads to a good job, such as nursing or engineering.

In my view, the best approach is a combination of the two. Tuition should be free at the point of study, so that nobody is put off by the cost, but graduates should repay part of it once their income rises above a certain level. Such a system, similar to the loans used in England and Australia, shares the cost fairly between society and the individual.

In conclusion, both views have merit, but neither extreme is ideal. I believe that university should be free to enter but partly repaid by those who later benefit financially.
`,
    notes: [
      ['the fairest solution lies between these two positions', 'TA', 'The opinion is signalled in the introduction and developed later.'],
      ['Supporters of free tuition believe that education is a public good.', 'CC', 'The first view is introduced by naming its supporters, not by “some people”.'],
      ['in Germany, where public universities charge almost no fees', 'TA', 'A real example supports the first view.'],
      ['Graduates usually earn far more over their lifetimes than people without degrees', 'TA', 'The second view is given its strongest argument.'],
      ['free to enter but partly repaid by those who later benefit financially', 'LR', 'A concise, memorable restatement of the opinion.'],
    ],
  }),
)
