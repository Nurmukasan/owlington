import { task2 } from '../build'

export default task2({
  id: 't2-adv-online-learning',
  type: 'advantages',
  instructions: [
    'More and more university courses are now taught entirely online.',
    'What are the advantages and disadvantages of this trend?',
  ],
  tips: [
    'This question does not ask which side is stronger — but a short view in the conclusion is still welcome.',
    'Two paragraphs: advantages, then disadvantages, each with an example.',
    'Think about cost, flexibility, motivation and practical subjects.',
  ],
  model: `
In the last decade, many universities have begun to offer complete degree programmes over the internet, so that students never need to attend a campus. This development offers clear benefits, but it also has some significant drawbacks.

The main advantage of online degrees is flexibility. Students can watch lectures and complete assignments at any time, which allows people with jobs or young children to study. Online courses are also usually cheaper, because students save on accommodation and travel, and universities need fewer buildings, so they can charge lower fees. In addition, they widen access to education. For example, a student in a remote village can now take a course at a leading university in another country without leaving home.

However, studying entirely online has disadvantages. Many students find it difficult to stay motivated without the routine of attending classes, and drop-out rates for online courses are often higher than for traditional ones. Students also miss out on the social side of university life, such as clubs, societies and informal discussions with classmates, which help to develop communication skills and professional networks. Finally, some subjects cannot be taught properly at a distance. Medicine, engineering and the sciences require laboratories and hands-on practice that a screen cannot replace.

In conclusion, online university courses make higher education more flexible, affordable and accessible, but they demand strong self-discipline and are unsuitable for practical subjects. In my view, the best solution for many students is a blended course that combines online lectures with regular face-to-face teaching.
`,
  notes: [
    ['This development offers clear benefits, but it also has some significant drawbacks.', 'TA', 'The introduction shows that both sides will be covered.'],
    ['The main advantage of online degrees is flexibility.', 'CC', 'A topic sentence names the paragraph’s first point.'],
    ['a student in a remote village can now take a course at a leading university in another country', 'TA', 'A concrete example of wider access.'],
    ['drop-out rates for online courses are often higher than for traditional ones', 'LR', '“Drop-out rates” is the precise term for this problem.'],
    ['a blended course that combines online lectures with regular face-to-face teaching', 'LR', 'A precise term (“blended”) for the writer’s proposed solution.'],
  ],
})
