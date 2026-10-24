import { choose2, mcq, passage, test } from '../build'

export default test('mcq-memory', [
  passage({
    title: 'Palaces of Memory',
    sub: 'Memory champions can recall hundreds of random numbers. Their secret is a technique more than two thousand years old.',
    text: `
      A
      Every year, competitors at memory championships perform feats that seem almost impossible.
      They memorise the order of a shuffled pack of playing cards in well under a minute, recall hundreds of random digits after studying them briefly, and remember the names and faces of dozens of strangers.
      Most people assume that such individuals must have been born with extraordinary brains.
      When researchers have examined them, however, they have found little evidence for this.

      B
      In one study, scientists compared the brains and general abilities of leading memory competitors with those of ordinary volunteers of similar age and education.
      The competitors did not differ from the volunteers in intelligence, and brain scans revealed no obvious differences in the structure of their brains.
      What did differ was the way they used them.
      When memorising, almost all of the competitors reported using the same strategy, and their brains showed increased activity in regions involved in spatial memory and navigation.

      C
      The strategy is known as the method of loci, from the Latin word for ‘places’, or more popularly as the memory palace.
      To use it, a person imagines a familiar building or route, such as their own home or the walk to work, and mentally places the items to be remembered at specific points along the way.
      To recall them, they simply walk through the imagined space again and ‘see’ each item where they left it.
      The method works best when the images are vivid, unusual or even ridiculous: a list of shopping might become a loaf of bread blocking the front door and a giant egg sitting in the bath.

      D
      According to an ancient story, the technique was invented by the Greek poet Simonides.
      He is said to have left a banquet hall shortly before its roof collapsed, killing everyone inside, and to have identified the bodies by remembering where each guest had been sitting.
      Whether or not the story is true, the method was certainly taught to students of public speaking in ancient Greece and Rome, who used it to remember long speeches without notes, and it remained an important part of education in Europe for many centuries.

      E
      The technique fell out of fashion as printed books became cheap and widely available, reducing the need to store large amounts of information in memory.
      Its recent revival owes much to memory competitions, and also to research suggesting that it can be learned by almost anyone.
      In one experiment, volunteers with no previous experience trained in the method for around half an hour a day over six weeks.
      At the start, they could recall about twenty-six words from a list of seventy-two; by the end, the average was over sixty, and they still remembered far more than before when they were tested again four months later.

      F
      The method has limitations.
      It is excellent for remembering lists, sequences and isolated facts, but less useful for understanding complex ideas, which depends on making connections rather than storing separate items.
      Building a large memory palace also takes considerable time and practice.
      Some teachers worry that students might use it to memorise material without understanding it, although others argue that a good memory for basic facts makes deeper understanding easier.

      G
      What the research makes clear is that a remarkable memory is less a gift than a skill.
      The champions were not born different; they trained differently.
      For anyone who has ever walked into a room and forgotten why, that may be an encouraging thought.
    `,
    groups: [
      mcq([
        [
          'What did the study of memory competitors find?',
          ['They were more intelligent than the volunteers.', 'Their brains had an unusual structure.', 'They used their brains in a different way.', 'They had trained for longer than other people.'],
          'C',
          'B2 B3',
          'There were no differences in intelligence or brain structure: “What did differ was the way they used them.”',
        ],
        [
          'According to the writer, the method of loci works best when',
          ['the imagined building is very large.', 'the mental pictures are striking or strange.', 'the items are placed in alphabetical order.', 'the route is one the person has never used.'],
          'B',
          'C4',
          '“The method works best when the images are vivid, unusual or even ridiculous.”',
        ],
        [
          'What does the writer say about the story of Simonides?',
          ['It proves that the method was invented in Greece.', 'It may or may not be true.', 'It was invented by teachers in Rome.', 'It was forgotten for many centuries.'],
          'B',
          'D3',
          '“Whether or not the story is true” shows the writer is uncertain about it.',
        ],
        [
          'Why did the memory palace become less popular?',
          ['Teachers stopped believing that it worked.', 'It took too long to learn.', 'Books made memorising information less necessary.', 'Public speaking became less important.'],
          'C',
          'E1',
          'It fell out of fashion “as printed books became cheap and widely available, reducing the need to store large amounts of information in memory”.',
        ],
        [
          'What did the six-week training experiment show?',
          ['Only some volunteers were able to learn the method.', 'The improvement disappeared after a few months.', 'Beginners could greatly improve their memory.', 'Half an hour a day was not enough practice.'],
          'C',
          'E3 E4',
          'Volunteers “with no previous experience” rose from about twenty-six words to over sixty, and kept much of the gain four months later.',
        ],
      ]),
      choose2(
        'Which TWO limitations of the memory palace does the writer mention?',
        [
          'It is not well suited to understanding complex ideas.',
          'It only works for people with a good sense of direction.',
          'It requires a great deal of time to develop.',
          'It cannot be used to remember people’s names.',
          'It causes people to forget information more quickly.',
        ],
        ['A', 'C'],
        [
          ['F2', 'It is “less useful for understanding complex ideas”.'],
          ['F3', '“Building a large memory palace also takes considerable time and practice.” Names are remembered by champions (A2), so D is wrong.'],
        ],
      ),
    ],
  }),
])
