import { task2 } from '../build'

export default task2({
  id: 't2-opinion-four-day-week',
  type: 'opinion',
  instructions: [
    'Some people believe that all companies should introduce a four-day working week, with no reduction in pay.',
    'To what extent do you agree or disagree?',
  ],
  tips: [
    '“All companies” is a strong claim — you may agree in principle but question “all”.',
    'Think about productivity, health, customers and different types of jobs (hospitals, shops).',
    'Real trials in several countries can provide an example.',
  ],
  model: `
In recent years, several companies have experimented with a four-day working week in which employees receive the same salary for fewer hours. Some argue that this model should be adopted by every business. While I agree that a shorter week has many benefits, I disagree that it should be compulsory for all companies.

There are strong reasons to support a four-day week. Trials in the United Kingdom and Iceland found that most employees were just as productive in four days as in five, because they wasted less time in unnecessary meetings and felt more focused. Workers also reported lower stress and better health, which reduced the number of days lost to sickness. A longer weekend gives people more time for family, exercise and further study, which benefits society as a whole.

However, a single rule for all companies would be unrealistic. Many organisations, such as hospitals, care homes and emergency services, must operate every day, and a shorter week for each worker would mean hiring many more staff at considerable cost. Small businesses, for example family-run shops and restaurants, may also struggle to stay open without longer hours from their employees. For these employers, a compulsory four-day week could lead to closures or higher prices for customers.

A better approach would be to encourage, rather than force, the change. Governments could offer support to companies that wish to try it, and businesses could choose the arrangement that suits their work, such as shorter days or flexible hours.

In conclusion, I believe the four-day week is a promising idea that many firms should adopt, but making it mandatory for every company would ignore the needs of essential services and small businesses.
`,
  notes: [
    ['While I agree that a shorter week has many benefits, I disagree that it should be compulsory for all companies.', 'TA', 'A precise, partial position that targets the word “all” in the question.'],
    ['Trials in the United Kingdom and Iceland found that most employees were just as productive', 'TA', 'Evidence from real trials supports the first argument.'],
    ['However, a single rule for all companies would be unrealistic.', 'CC', 'The topic sentence links back to the writer’s position.'],
    ['A better approach would be to encourage, rather than force, the change.', 'GRA', 'An interrupting phrase (“rather than force”) adds precision.'],
    ['making it mandatory for every company would ignore the needs of essential services and small businesses', 'LR', 'The conclusion paraphrases “compulsory” as “mandatory”.'],
  ],
})
