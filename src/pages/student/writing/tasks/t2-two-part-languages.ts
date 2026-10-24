import { task2 } from '../build'

export default task2({
  id: 't2-two-part-languages',
  type: 'two-part',
  instructions: [
    'Some of the world’s languages are disappearing, and only a few languages are spoken by more and more people.',
    'Why is this happening? Is it a positive or negative development?',
  ],
  parts: [
    ['why languages are disappearing', /\b(because|reason|why|globali[sz]ation|internet|jobs?|cities|economic|migrat|school)/i],
    ['positive or negative', /\b(positive|negative|benefit|loss|lose|development|good|bad|harm)\b/i],
  ],
  tips: [
    'Reasons: economics, migration to cities, education, the internet.',
    'Your answer to question 2 can be mixed, but say which side is stronger.',
    'Use examples: Welsh, Maori, or a language with very few speakers left.',
  ],
  model: `
Linguists estimate that around half of the world's seven thousand languages may disappear by the end of this century, while languages such as English, Spanish and Mandarin continue to spread. This essay will consider the causes of this trend and argue that, on balance, it is a negative development.

There are several reasons why small languages are dying out. The most important is economic. Parents often believe that their children will have better job prospects if they speak a major language, so they stop using their own language at home. Migration from villages to cities has a similar effect, as young people move to places where only the national language is spoken. Furthermore, the internet, films and music are dominated by a handful of global languages, which makes local languages seem old-fashioned to teenagers.

In my opinion, the loss of these languages is mostly negative. Each language contains a unique way of seeing the world, including knowledge about local plants, history and traditions that may not exist anywhere else. When the last speaker dies, this knowledge is lost forever. It is true that a shared global language makes international communication, trade and science easier. However, people can learn a global language without abandoning their own. For example, in Wales and New Zealand, schools teach Welsh and Maori alongside English, and the number of young speakers has started to rise.

In conclusion, small languages are disappearing mainly because of economic pressure, migration and global media. Although common languages have practical benefits, I believe the disappearance of so many languages is a serious cultural loss that governments should try to prevent.
`,
  notes: [
    ['This essay will consider the causes of this trend and argue that, on balance, it is a negative development.', 'TA', 'A direct answer to question 2 is given in the introduction.'],
    ['The most important is economic.', 'GRA', 'A short sentence introduces the main reason clearly.'],
    ['which makes local languages seem old-fashioned to teenagers', 'TA', 'Each reason is explained, not just listed.'],
    ['It is true that a shared global language makes international communication, trade and science easier.', 'CC', 'A concession introduced with “It is true that…”, followed by “However”.'],
    ['schools teach Welsh and Maori alongside English', 'TA', 'Real examples show that the problem can be addressed.'],
  ],
})
