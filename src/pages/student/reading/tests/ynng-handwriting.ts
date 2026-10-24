import { passage, test, ynng } from '../build'

export default test('ynng-handwriting', [
  passage({
    title: 'The Case for the Pen',
    sub: 'Schools are quietly abandoning handwriting. A teacher and researcher argues that they are making a mistake.',
    text: `
      A
      In many classrooms, the pen is slowly disappearing.
      Pupils take notes on laptops, submit homework online and, in some countries, sit examinations on screen.
      Several education systems have already reduced the time spent teaching handwriting, and a few have stopped teaching joined-up writing altogether.
      The reasoning is understandable: young people will spend their working lives at keyboards, so why devote precious lessons to a skill that seems to belong to the past?
      I believe this reasoning is mistaken, and that we are giving up something valuable without fully understanding what it is.

      B
      Let me be clear about what I am not arguing.
      I am not suggesting that children should stop learning to type, or that computers have no place in the classroom.
      Typing is an essential skill, and for pupils with certain physical or learning difficulties it can be transformative.
      Nor do I believe that beautiful handwriting matters for its own sake; a legible, reasonably quick hand is all that anyone needs.

      C
      My concern is with what happens in the brain when we write by hand.
      Forming letters requires a child to plan and control a complex series of movements, and studies using brain imaging have found that this activity engages areas involved in reading far more strongly than typing does.
      Children who learn letters by writing them recognise them more quickly afterwards than those who learn them by pressing keys.
      For young pupils, in other words, handwriting is not simply a way of recording language; it is part of the process of learning to read.

      D
      The benefits do not seem to end in childhood.
      In a widely reported series of experiments, university students who took lecture notes by hand remembered the ideas better than those who typed, even though the typists recorded far more words.
      The researchers suggested that because handwriting is slower, students are forced to summarise and rephrase what they hear, which requires them to think about its meaning.
      Typists, by contrast, tended to copy the lecturer’s words more or less exactly.
      Some later studies have failed to repeat these results, and the question is not settled, but I find the explanation persuasive.

      E
      There is also a practical argument that is rarely mentioned.
      Technology fails: batteries run flat, networks go down and devices are lost.
      An adult who cannot write a clear note, fill in a form or sign a document quickly is at a real disadvantage, and I have met school leavers who struggle to do all three.

      F
      Some of my colleagues argue that schools simply do not have time for everything, and that handwriting must give way to newer priorities such as coding.
      I sympathise with the pressure they are under, but I think the choice is a false one.
      A few minutes of regular practice in the early years is enough to establish a fluent hand, and the time saved later, when pupils can write quickly and without effort, more than repays the investment.

      G
      None of this requires us to reject technology.
      The best approach, I believe, is a balanced one in which children learn to write by hand first and to type soon afterwards, and in which older students are encouraged to think about which tool suits which task.
      What we should avoid is abandoning a centuries-old skill simply because something newer has come along.
    `,
    groups: [
      ynng([
        ['It is easy to see why some schools have reduced handwriting lessons.', 'Y', 'A4', 'The writer calls the reasoning “understandable”, even though they disagree with it.'],
        ['Children should spend less time learning to type.', 'N', 'B2 B3', 'The writer is “not suggesting that children should stop learning to type” and calls typing “an essential skill”.'],
        ['Neat, attractive handwriting is important for its own sake.', 'N', 'B4', '“Nor do I believe that beautiful handwriting matters for its own sake.”'],
        ['Writing letters by hand helps young children learn to read.', 'Y', 'C3 C4', 'For young pupils, handwriting “is part of the process of learning to read”.'],
        ['The students who typed their notes wrote down fewer words than those who wrote by hand.', 'N', 'D2', 'The typists “recorded far more words”.'],
        ['The research on note-taking proves that handwriting improves memory.', 'N', 'D5', 'The writer admits that “the question is not settled”, although they find the explanation persuasive.'],
        ['Most employers prefer job applications that are written by hand.', 'NG', 'E2 E3', 'The writer discusses forms and documents, but says nothing about employers’ preferences.'],
        ['Teaching coding is more important than teaching handwriting.', 'N', 'F1 F2', 'The writer calls the choice between them “a false one”.'],
        ['Schools should invest in more computers for younger pupils.', 'NG', 'G2', 'The writer recommends a balanced approach but does not discuss buying more computers.'],
        ['Children should learn handwriting before they learn to type.', 'Y', 'G2', 'Children should “learn to write by hand first and to type soon afterwards”.'],
      ]),
    ],
  }),
])
