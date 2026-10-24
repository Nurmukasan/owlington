import { task2 } from '../build'

export default task2({
  id: 't2-discussion-ai-homework',
  type: 'discussion',
  instructions: [
    'Some people think that students should be allowed to use artificial intelligence tools to help with their homework. Others believe these tools should be banned in education.',
    'Discuss both these views and give your own opinion.',
  ],
  tips: [
    'Give each view a full paragraph, with its best reasons.',
    'Your opinion might depend on how the tools are used — say exactly where you stand.',
    'Avoid the word “AI” in every sentence: chatbots, these tools, digital assistants.',
  ],
  model: `
Artificial intelligence tools that can write essays, solve equations and explain difficult ideas have quickly become part of many students' lives. While some people welcome them as learning aids, others argue that they should be prohibited in schools and universities. In my view, these tools should be allowed, but only under clear rules.

Those who support their use point out that chatbots can act as a patient personal tutor. A student who does not understand a topic in class can ask for an explanation as many times as necessary, at any time of day, which is especially valuable for families who cannot afford private lessons. Supporters also argue that young people will use these technologies throughout their working lives, so schools should teach them to use them well rather than pretend they do not exist.

On the other hand, critics fear that students will simply let the software do their work. If an essay can be produced in seconds, learners may never develop the ability to organise their own ideas or write clearly, and teachers cannot tell what a student really knows. There are also concerns about accuracy, since these tools sometimes produce convincing but false information, such as invented statistics or references.

In my opinion, banning these tools is neither realistic nor desirable. Instead, schools should set clear guidelines. For example, students could be allowed to use a chatbot to check their understanding or get feedback on a draft, but important assessments should be written in class.

In conclusion, both views raise valid points. I believe that artificial intelligence can support learning if its use is guided, while traditional, supervised tests ensure that students still develop their own skills.
`,
  notes: [
    ['In my view, these tools should be allowed, but only under clear rules.', 'TA', 'The opinion is clear from the first paragraph.'],
    ['Those who support their use point out that chatbots can act as a patient personal tutor.', 'CC', 'The first view is introduced with its supporters and main argument.'],
    ['which is especially valuable for families who cannot afford private lessons', 'TA', 'The argument is extended to show who benefits most.'],
    ['these tools sometimes produce convincing but false information', 'LR', 'A precise, balanced phrase: convincing but false.'],
    ['banning these tools is neither realistic nor desirable', 'GRA', '“Neither… nor…” presents two reasons in a compact structure.'],
  ],
})
