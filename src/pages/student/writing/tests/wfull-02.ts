import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-02',
  task1({
    id: 'wfull-02-t1',
    instructions:
      'The chart below shows the average number of hours per week that men and women in the town of Eastbridge spent on five types of unpaid work at home in 2024.',
    figure: {
      kind: 'bar',
      title: 'Weekly hours of unpaid work at home, Eastbridge, 2024',
      unit: 'hours per week',
      yLabel: 'Hours per week',
      categories: ['Cooking', 'Cleaning', 'Childcare', 'Shopping', 'Repairs'],
      yMax: 12,
      yStep: 2,
      series: [
        { id: 'men', label: 'Men', values: [4.5, 3, 5.5, 2.5, 3.5] },
        { id: 'women', label: 'Women', values: [7.5, 6, 10, 3, 1] },
      ],
    },
    tips: [
      'There are no years here, so this is a comparison, not a trend: use “more than”, “twice as much”, “the largest gap”.',
      'Group the five activities sensibly — where women did much more, and where the gap was small or reversed.',
      'Add the totals in your head: women did more overall, but men did more repairs. That is the overview.',
    ],
    model: `
The bar chart compares the time that male and female residents of Eastbridge devoted each week to five kinds of domestic work in 2024.

Overall, women spent more time than men on four of the five activities, and the difference was greatest for childcare. Repairs were the only area in which men did more.

Childcare took up the largest amount of time for both sexes. Women devoted 10 hours a week to looking after children, almost twice as long as men, whose figure was 5.5. A similar pattern can be seen for cooking and cleaning: women cooked for 7.5 hours and cleaned for 6, whereas the figures for men were 4.5 and 3 respectively, so women cleaned twice as much.

The remaining two activities were much more evenly shared. Shopping occupied both groups for a similar length of time, at 3 hours for women and 2.5 for men. Repairs, however, reversed the general pattern. Men spent 3.5 hours a week fixing things around the home. Women managed only 1, the lowest figure in the chart.
`,
    notes: [
      ['the time that male and female residents of Eastbridge devoted each week to five kinds of domestic work', 'LR', 'Paraphrase: men and women → male and female residents; unpaid work at home → domestic work.'],
      ['Overall, women spent more time than men on four of the five activities', 'TA', 'An overview built on comparison, because the chart has no time dimension.'],
      ['almost twice as long as men', 'TA', 'Comparing the two bars with a ratio is more informative than listing both numbers.'],
      ['The remaining two activities were much more evenly shared.', 'CC', 'Grouping: the second body paragraph collects the activities where the gap is small or reversed.'],
      ['Repairs, however, reversed the general pattern.', 'TA', 'The exception to the main pattern is a key feature and gets its own sentence.'],
    ],
  }),
  task2({
    id: 'wfull-02-t2',
    type: 'discussion',
    instructions: [
      'Some people think that children should begin formal education at a very early age. Others believe they should not start school until they are at least seven years old.',
      'Discuss both these views and give your own opinion.',
    ],
    tips: [
      'Discuss means both sides fairly: one body paragraph for each view, with reasons and an example.',
      'Your opinion must appear — in the introduction and again in the conclusion.',
      'Avoid “some people think” in every sentence: use supporters of, those in favour of, critics.',
    ],
    model: `
The age at which children should start school varies widely around the world, from four in some countries to seven in others. While some people favour an early start to formal learning, others argue that young children benefit more from a longer period of play. In my view, a later start is preferable, provided that children attend good-quality nursery education before it.

Those who support an early start believe that young minds absorb knowledge quickly, so the sooner children learn to read and count, the better. School also provides structure and friendship. For example, children from disadvantaged families often arrive at school with a smaller vocabulary than their classmates, and an earlier start can help to close this gap before it widens.

On the other hand, many educators argue that formal lessons at four or five can do more harm than good. Young children learn mainly through play, such as building, drawing and role-playing, and being asked to sit still and complete worksheets may make them anxious and reduce their enthusiasm for learning. It is often noted that in Finland, where school begins at seven, pupils perform very well in international tests by the age of fifteen, which suggests that a late start does not hold children back.

In conclusion, although early schooling can benefit some children, I believe that formal education should begin at around seven. Before that age, play-based nurseries can develop social and language skills without the pressure of tests, giving children a confident start when real lessons begin.
`,
    notes: [
      ['While some people favour an early start to formal learning, others argue that young children benefit more from a longer period of play', 'LR', 'Both views are paraphrased in one sentence before the writer’s opinion.'],
      ['In my view, a later start is preferable, provided that children attend good-quality nursery education before it', 'TA', 'A clear opinion with a condition — more nuanced than a simple yes or no.'],
      ['Those who support an early start believe that young minds absorb knowledge quickly', 'CC', 'The topic sentence names the view the paragraph will explain.'],
      ['in Finland, where school begins at seven, pupils perform very well in international tests', 'TA', 'A real-world example used as evidence, not decoration.'],
      ['play-based nurseries can develop social and language skills without the pressure of tests', 'LR', 'Precise collocations: play-based nurseries, social and language skills, the pressure of tests.'],
    ],
  }),
)
