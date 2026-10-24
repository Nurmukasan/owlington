import { headings, passage, test } from '../build'

export default test('headings-laughter', [
  passage({
    title: 'Why We Laugh',
    sub: 'Laughter is older than language and more serious than it looks.',
    text: `
      A
      Most people assume that laughter is a response to humour: we hear a joke, we find it funny, and we laugh.
      Yet when researchers have recorded people laughing in everyday conversation, they have found that only a small proportion of laughter follows anything resembling a joke.
      Far more often, people laugh after ordinary remarks such as ‘See you later’ or ‘I know what you mean’.
      Laughter, it seems, is less about comedy than about the relationship between the people who are talking.

      B
      This social function is clear from the circumstances in which laughter occurs.
      In one study, volunteers who kept a diary of their laughter were around thirty times more likely to laugh when other people were present than when they were alone.
      Even when people watch a comedy on their own, they laugh far less than when they watch the same programme with friends.
      Television producers have long understood this, which is why many comedies are broadcast with recorded laughter, a technique that reliably makes viewers laugh more.

      C
      The roots of laughter go back much further than human speech.
      Chimpanzees, gorillas and orangutans all produce a breathy, panting sound when they are tickled or when they play-fight, and a study comparing these sounds across species found that they share a common origin with human laughter.
      Even rats emit high-pitched calls when tickled by researchers, calls that are too high for human ears to hear without special equipment.
      Laughter appears to have begun as a signal that rough behaviour was playful rather than aggressive.

      D
      The body responds to laughter in measurable ways.
      In experiments in which volunteers watched either comedy or dull documentaries, those who had been laughing could tolerate more pain afterwards, measured by how long they could keep a frozen cuff on their arm.
      The researchers believe that laughing releases chemicals in the brain known as endorphins, which reduce pain and produce a mild feeling of well-being.
      Crucially, the effect depended on real, prolonged laughter; simply smiling or being amused had no effect.

      E
      Some scientists think that this chemical reward explains how laughter helped early humans to live in large groups.
      Other primates strengthen friendships by grooming one another, picking dirt and insects from each other’s fur, but grooming is slow and can only be done with one partner at a time.
      Laughter, by contrast, can be shared by several people at once, allowing bonds to be maintained across a much larger social circle.

      F
      Not all laughter is the same, and listeners are surprisingly good at telling the difference.
      Spontaneous laughter, produced without thought, tends to be higher in pitch and less controlled than the polite laughter people produce deliberately.
      When recordings of the two kinds were played to listeners from many different countries, most could identify which was which, even when the speakers came from a culture very different from their own.
      This suggests that the ability to read laughter is shared across humanity rather than learned in one particular society.

      G
      One curious feature of laughter has puzzled people for centuries: nobody can tickle themselves.
      Brain scans suggest that when we move our own hands, a region at the back of the brain predicts the sensation that will follow and reduces our response to it.
      Because the touch is expected, it no longer feels surprising, and surprise appears to be essential to the tickling reaction.

      H
      Researchers still disagree about many aspects of laughter, including why some people laugh far more readily than others.
      What most now accept, however, is that it deserves to be taken seriously.
      Far from being a trivial reaction to jokes, laughter may be one of the oldest tools our species possesses for building trust and keeping groups together.
    `,
    groups: [
      headings(
        [
          'A sound we inherited from our animal relatives',
          'Why humour differs from one culture to another',
          'An unexpected finding about what makes people laugh',
          'Two kinds of laughter that most people can recognise',
          'A way of building friendships with many people at once',
          'The company we keep affects how much we laugh',
          'A natural painkiller',
          'The danger of laughing too much',
          'Why our own touch does not make us laugh',
          'A behaviour worth serious study',
          'How comedians learn their skills',
        ],
        [
          ['A', 'iii', 'A2 A3', 'Researchers found that only a small proportion of laughter follows a joke; people mostly laugh at ordinary remarks. That is an unexpected finding about what makes people laugh.'],
          ['B', 'vi', 'B2 B3', 'Paragraph B shows people laugh thirty times more with others present, and more when watching with friends: the company we keep.'],
          ['C', 'i', 'C1 C2', 'Apes produce a panting sound with “a common origin with human laughter”: a sound inherited from animal relatives.'],
          ['D', 'vii', 'D2 D3', 'Laughing volunteers tolerated more pain, probably because of endorphins, “which reduce pain”: a natural painkiller. Heading viii is a trap: no danger is mentioned.'],
          ['E', 'v', 'E3', 'Laughter “can be shared by several people at once, allowing bonds to be maintained across a much larger social circle”.'],
          ['F', 'iv', 'F2 F3', 'Spontaneous and polite laughter differ, and most listeners “could identify which was which”. Heading ii is a trap: F says the skill is shared across cultures.'],
          ['G', 'ix', 'G1 G2', 'Nobody can tickle themselves because the brain predicts the sensation of our own touch.'],
          ['H', 'x', 'H2 H3', '“It deserves to be taken seriously”: laughter is a behaviour worth serious study.'],
        ],
      ),
    ],
  }),
])
