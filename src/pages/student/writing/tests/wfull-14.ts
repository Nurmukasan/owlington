import { fullTest, task1, task2 } from '../build'

export default fullTest(
  'wfull-14',
  task1({
    id: 'wfull-14-t1',
    instructions:
      'The graph below shows the percentage of retail sales made online in one country between 2010 and 2025. The table shows the share of online sales in four product categories in 2025.',
    figure: {
      kind: 'multi',
      title: 'Online shopping in one country',
      parts: [
        {
          kind: 'line',
          title: 'Online sales as a share of all retail sales',
          unit: '% of retail sales',
          yLabel: '% of retail sales',
          xs: ['2010', '2013', '2016', '2019', '2022', '2025'],
          yMax: 40,
          yStep: 10,
          series: [{ id: 'online', label: 'Online', values: [6, 9, 13, 18, 31, 29] }],
        },
        {
          kind: 'table',
          title: 'Share of sales made online, by category, 2025',
          unit: '% of sales in each category',
          columns: ['Category', 'Online share'],
          rows: [
            ['Books and music', '68%'],
            ['Electronics', '52%'],
            ['Clothing', '34%'],
            ['Groceries', '12%'],
          ],
        },
      ],
    },
    tips: [
      'One overview sentence for each visual: steady growth with a jump, and big differences between categories.',
      'The line peaked in 2022 and fell slightly — do not miss that.',
      'For the table, compare: books and music versus groceries.',
    ],
    model: `
The line graph illustrates how the proportion of retail spending that took place online changed in one country from 2010 to 2025, while the table compares the online share of four types of product in the final year.

Overall, online shopping grew substantially over the fifteen years, with a particularly sharp rise around 2020. In 2025, the importance of online sales varied greatly between categories, from a majority for books and music to a small minority for groceries.

In 2010, only 6% of retail sales were made online. This figure increased gradually to 18% by 2019, before jumping to a peak of 31% in 2022. It then dipped slightly, to 29% in 2025, but this was still almost five times the level at the start of the period.

As for the categories, books and music were the most likely to be bought online, with over two thirds (68%) of sales made this way. Electronics followed, at just over half. Clothing was lower at 34%. By contrast, only 12% of groceries were purchased online, which suggests that most people still prefer to choose food in person.
`,
    notes: [
      ['while the table compares the online share of four types of product in the final year', 'CC', 'Both visuals are introduced in one sentence.'],
      ['Overall, online shopping grew substantially over the fifteen years', 'TA', 'The overview covers the graph and then the table.'],
      ['before jumping to a peak of 31% in 2022', 'LR', 'Trend language that captures speed: jumping, peak, dipped.'],
      ['this was still almost five times the level at the start of the period', 'TA', 'A comparison across the whole period puts the small fall in context.'],
      ['which suggests that most people still prefer to choose food in person', 'TA', 'A cautious interpretation with “suggests” — not an invented opinion.'],
    ],
  }),
  task2({
    id: 'wfull-14-t2',
    type: 'problem',
    instructions: [
      'In many countries, a growing number of elderly people live alone and feel lonely.',
      'What are the causes of this problem? What can be done to solve it?',
    ],
    tips: [
      'Causes: smaller families, children moving away, loss of a partner, fewer community spaces.',
      'Solutions: who acts? Families, local councils, volunteers, technology.',
      'Give each solution a concrete example.',
    ],
    model: `
As life expectancy rises, more and more older people are spending their final years alone, and many of them experience loneliness. This essay will discuss why this is happening and suggest ways in which families, communities and governments can help.

Several factors explain the trend. Firstly, families have become smaller and more scattered. Adult children often move to other cities or countries for work, so they can visit their parents only occasionally because of the distance and the cost of travel. Secondly, older people are increasingly likely to outlive their partners, and losing a husband or wife can suddenly remove their main source of company. Finally, many of the places where older people used to meet, such as local shops, post offices and community centres, have closed, especially in rural areas.

There are, however, practical solutions. Local councils could fund community hubs where older residents can share meals, take part in classes and meet others regularly. Volunteer schemes can also make a big difference. For instance, some charities match students with elderly neighbours for a weekly visit, which benefits both generations. Technology has a role to play as well, as simple video-calling devices allow grandparents to see their families every day. Families, too, should make the effort to keep in touch, even if only through a short daily phone call.

In conclusion, loneliness among older people is caused mainly by changing family patterns, bereavement and the loss of community spaces. A combination of public investment, volunteering, technology and family effort could ensure that nobody has to grow old in isolation.
`,
    notes: [
      ['This essay will discuss why this is happening and suggest ways in which families, communities and governments can help.', 'TA', 'Both questions are addressed, and the solutions are previewed by who will act.'],
      ['Firstly, families have become smaller and more scattered.', 'CC', 'Causes are signposted clearly: firstly, secondly, finally.'],
      ['losing a husband or wife can suddenly remove their main source of company', 'LR', 'Natural, sensitive vocabulary for a difficult topic.'],
      ['some charities match students with elderly neighbours for a weekly visit, which benefits both generations', 'TA', 'A concrete example shows the solution works.'],
      ['nobody has to grow old in isolation', 'LR', 'A strong final phrase that returns to the topic of loneliness.'],
    ],
  }),
)
