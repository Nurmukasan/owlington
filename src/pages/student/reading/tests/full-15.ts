import { choose2, flow, headings, mcq, passage, sentences, summary, test, tfng, ynng } from '../build'

export default test('full-15', [
  passage({
    title: 'The Concrete That Lasted',
    sub: 'Roman buildings have survived for two thousand years. Modern concrete structures sometimes fail within decades. Why?',
    text: `
      A
      Concrete is the most widely used building material in the world, and it is hardly a new invention.
      The Romans used it on a vast scale more than two thousand years ago, for aqueducts, harbours, bridges and public buildings.
      Many of these structures are still standing today, including the Pantheon in Rome, whose great dome remains the largest ever built of concrete without steel reinforcement.
      By contrast, many modern concrete buildings and bridges show serious cracking within fifty years and require expensive repairs.

      B
      Roman concrete was made differently from the modern material.
      Its main ingredients were lime, made by heating limestone, and volcanic ash, which the Romans obtained from deposits near the Bay of Naples.
      These were mixed with water and with chunks of rock or broken brick, which formed the bulk of the material.
      The volcanic ash reacted chemically with the lime to produce a strong, durable binder, and builders discovered that adding more ash made the concrete resistant to water.

      C
      Roman harbour walls are particularly impressive.
      Ancient writers described how builders lowered wooden frames into the sea and filled them with a mixture of lime and volcanic ash, which hardened even under water.
      Modern analysis has shown that, instead of slowly breaking down in seawater as modern concrete tends to do, the Roman material actually grew stronger over time, as seawater seeping through it caused new minerals to form in the cracks and gaps.

      D
      Another secret was discovered only recently.
      Samples of Roman concrete often contain small white lumps of lime, which earlier researchers had assumed were the result of careless mixing.
      A study published in 2023 suggested that these lumps were in fact deliberate.
      The researchers believe the Romans mixed quicklime, a highly reactive form of lime, directly with the other ingredients, a process that produces intense heat.
      When cracks later formed in the concrete and water entered them, the lime in the lumps dissolved and then hardened again, filling the cracks and allowing the material to repair itself.

      E
      Modern concrete is based on Portland cement, patented in England in 1824 and made by heating limestone and clay to very high temperatures.
      It sets quickly and achieves great strength, which is why it replaced older methods.
      Most modern structures are also reinforced with steel bars, which allow concrete to be used for long beams and tall buildings.
      However, when water and salt reach the steel, it rusts and expands, cracking the surrounding concrete from the inside, a problem that the unreinforced Roman structures did not face.

      F
      There is also an environmental reason to look again at Roman techniques.
      Producing cement requires enormous amounts of energy, and the chemical process itself releases carbon dioxide, so that the cement industry is responsible for around eight per cent of global carbon emissions.
      Roman-style mixtures are made at lower temperatures and could, in principle, reduce these emissions.

      G
      Engineers caution, however, that Roman concrete is not a simple replacement for the modern material.
      It is weaker under pressure, it takes much longer to harden, and its recipe depended on particular volcanic ash that is not available everywhere.
      Researchers are therefore trying to adapt its principles, such as self-healing, to modern mixtures rather than copying the ancient formula directly.
    `,
    groups: [
      flow(
        'How the Romans built harbour walls',
        1,
        [
          'Limestone is heated to produce [[lime]]',
          'Lime is mixed with volcanic [[ash]] from near the Bay of Naples',
          'Chunks of rock or broken [[brick]] form the bulk of the material',
          'Wooden [[frames]] are lowered into the sea and filled with the mixture',
          'The mixture hardens under water',
          'Over time, seawater causes new [[minerals]] to form, making the wall stronger',
        ],
        [
          ['B2', 'Lime was “made by heating limestone”.'],
          ['B2', 'The Romans used “volcanic ash, which the Romans obtained from deposits near the Bay of Naples”.'],
          ['B3', '“Chunks of rock or broken brick… formed the bulk of the material.”'],
          ['C2', 'Builders “lowered wooden frames into the sea and filled them”.'],
          ['C3', 'Seawater “caused new minerals to form in the cracks and gaps”.'],
        ],
      ),
      tfng([
        ['The Pantheon’s dome contains steel reinforcement.', 'F', 'A3', 'It is the largest dome built “of concrete without steel reinforcement”.'],
        ['Broken brick made up most of the volume of Roman concrete.', 'T', 'B3', 'Chunks of rock or broken brick “formed the bulk of the material”.'],
        ['Ancient writers described how harbour walls were built.', 'T', 'C2', '“Ancient writers described how builders lowered wooden frames into the sea.”'],
        ['Modern concrete becomes stronger when exposed to seawater.', 'F', 'C3', 'Modern concrete tends to break down in seawater.'],
        ['Researchers once believed the white lumps in Roman concrete were mistakes.', 'T', 'D2', 'Earlier researchers “had assumed [they] were the result of careless mixing”.'],
        ['The Romans understood the chemistry of self-healing concrete.', 'NG', 'D4 D5', 'Researchers believe the lumps were deliberate, but whether the Romans understood the chemistry is not stated.'],
        ['Portland cement was invented in Rome.', 'F', 'E1', 'It was “patented in England in 1824”.'],
        ['Roman concrete hardens more quickly than modern concrete.', 'F', 'G2', 'It “takes much longer to harden”.'],
      ]),
    ],
  }),

  passage({
    title: 'Science by the Crowd',
    sub: 'Millions of volunteers now help scientists to count birds, classify galaxies and solve puzzles. How useful is their work?',
    text: `
      A
      In 2007, astronomers at a British university faced a problem.
      They had images of around a million galaxies, and they needed to know which were spiral-shaped and which were elliptical, a task that computers of the time performed poorly.
      Classifying the images themselves would have taken years, so they set up a website inviting members of the public to help.
      Within twenty-four hours, volunteers were classifying tens of thousands of galaxies an hour, and within a year more than one hundred thousand people had taken part.

      B
      The project was a striking example of what is now called citizen science: research in which members of the public collect or analyse data.
      The idea is not entirely new.
      Birdwatchers in North America have taken part in an annual winter bird count since 1900, and the records they have gathered over more than a century are now among the most valuable sources of information on how bird populations have changed.
      What has transformed citizen science is the internet, which allows researchers to reach millions of potential volunteers and to collect their results instantly.

      C
      Volunteers have made genuine discoveries.
      In the galaxy project, a schoolteacher noticed a strange glowing cloud near one of the galaxies she was classifying and posted a question about it on the project’s forum.
      Professional astronomers investigated and concluded that it was an unusual object that had never been described before.
      In another project, players of an online puzzle game, in which they folded models of proteins into different shapes, worked out the structure of a protein from a virus in just a few weeks, after scientists had struggled with the problem for years.

      D
      The obvious concern is quality.
      Volunteers are not trained scientists, and they make mistakes.
      Projects deal with this in several ways.
      Many show each image or record to several volunteers and combine their answers, so that individual errors are cancelled out; others include examples with known answers, allowing researchers to check how reliable each volunteer is.
      Studies comparing volunteers’ results with those of experts have generally found that, when such methods are used, the combined results are as accurate as professional work.

      E
      Citizen science offers benefits beyond the data.
      Participants often learn a great deal about the subject, and some become passionate amateur experts.
      Projects that involve local communities in monitoring air or water quality can also give residents evidence to support their concerns, encouraging authorities to take action.

      F
      Critics raise other questions.
      Some point out that volunteers are usually unpaid, while the results of their work may contribute to profitable products or to the careers of professional scientists.
      Others note that participants tend to be well educated and relatively wealthy, so that the people taking part are not representative of the population as a whole.
      Many projects now make efforts to reach a wider range of people and to acknowledge volunteers’ contributions in published research.

      G
      As artificial intelligence improves, computers are now able to perform many of the tasks, such as classifying images, that once required human volunteers.
      Ironically, many of these programs were trained using the very data that volunteers produced.
      Yet researchers believe there will remain a role for human participants, especially in noticing the unexpected things that computers are not designed to look for.
    `,
    groups: [
      headings(
        [
          'An old idea transformed by new technology',
          'Ensuring that amateur results are reliable',
          'Unexpected findings by non-scientists',
          'A task too large for a small team',
          'Concerns about fairness and who takes part',
          'Advantages for participants and communities',
          'Why volunteers are paid for their work',
        ],
        [
          ['A', 'iv', 'A2 A3', 'Classifying a million galaxies “would have taken years”, so the astronomers asked the public.'],
          ['B', 'i', 'B2 B4', '“The idea is not entirely new”, but the internet “has transformed” it.'],
          ['C', 'iii', 'C1', '“Volunteers have made genuine discoveries.”'],
          ['D', 'ii', 'D1 D3 D4', '“The obvious concern is quality”, and projects combine answers and use known examples.'],
          ['E', 'vi', 'E1 E2 E3', 'Participants learn, and communities gain evidence to support their concerns.'],
          ['F', 'v', 'F2 F3', 'Volunteers are unpaid, and participants are “not representative”. Heading vii contradicts F2.'],
        ],
      ),
      choose2(
        'Which TWO methods do projects use to deal with volunteers’ mistakes?',
        [
          'giving each item to several volunteers',
          'paying the most accurate volunteers',
          'training volunteers before they start',
          'including examples where the answer is already known',
          'asking experts to repeat every task',
        ],
        ['A', 'D'],
        [
          ['D4', 'Many projects “show each image or record to several volunteers and combine their answers”.'],
          ['D4', 'Others “include examples with known answers”.'],
        ],
      ),
      sentences(2, [
        ['The North American bird count has taken place every [[winter]] since 1900.', 'B3', 'Birdwatchers “have taken part in an annual winter bird count since 1900”.'],
        ['A schoolteacher asked about a glowing cloud on the project’s [[forum]].', 'C2', 'She “posted a question about it on the project’s forum”.'],
        ['Game players discovered the structure of a [[protein]] from a virus.', 'C4', 'They “worked out the structure of a protein from a virus”.'],
        ['Community monitoring can give local [[residents]] evidence for their concerns.', 'E3', 'It can “give residents evidence to support their concerns”.'],
        ['Many artificial intelligence programs were trained with [[data]] produced by volunteers.', 'G2', 'They were trained “using the very data that volunteers produced”.'],
      ]),
    ],
  }),

  passage({
    title: 'Why We Collect',
    sub: 'Stamps, shells, trainers, teapots: around a third of people collect something. Psychologists are trying to understand why.',
    text: `
      A
      Collecting is one of the most widespread of human hobbies.
      Surveys in several countries suggest that around a third of adults collect something, from stamps, coins and books to vinyl records, football shirts and miniature cars.
      Some collections are worth fortunes; most are of little financial value.
      Yet collectors often devote enormous amounts of time, money and space to their passion, and many find it difficult to explain why.

      B
      Children begin collecting at a young age.
      By the age of six or seven, many have gathered sets of stones, stickers or cards, and they often take great pleasure in sorting and arranging them.
      Developmental psychologists believe that this behaviour helps children to make sense of the world by grouping objects into categories, and to experience a sense of control over their surroundings.
      For many adults, collecting may be a continuation of these early pleasures.

      C
      One explanation for adult collecting focuses on the thrill of the hunt.
      Searching for a rare item in markets, shops or online auctions can be intensely exciting, and finding it produces a feeling of triumph.
      Interestingly, many collectors report that the excitement fades soon after they acquire an item, and that they quickly begin searching for the next one.
      For this reason, some psychologists argue that the pleasure of collecting lies more in seeking than in owning.

      D
      Collections can also be closely connected to identity and memory.
      A collection of concert tickets or souvenirs from travels can serve as a record of a person’s life, and objects inherited from relatives can help to maintain a link with the past.
      Some researchers suggest that collecting provides a sense of continuity and security, which may explain why people are particularly likely to start or expand collections during periods of change or uncertainty.

      E
      Social connections matter too.
      Collectors often belong to clubs and online communities, where they share knowledge, swap items and admire one another’s finds.
      For many, these relationships are as important as the objects themselves, and expertise in an obscure field can bring recognition and respect that may be harder to find in other areas of life.

      F
      Collecting is not always harmless.
      A small number of people find it difficult to stop acquiring objects even when their collections create financial problems or take over their homes.
      Psychologists distinguish this kind of behaviour, which causes distress and interferes with daily life, from ordinary collecting, which is organised and brings satisfaction.
      The key difference is not the size of a collection but the relationship between the collector and the objects.

      G
      In my view, collecting deserves to be understood as a creative activity rather than dismissed as an eccentric habit.
      A good collection reflects knowledge, judgement and taste, and many important museum collections began as the private passions of individuals.
      Whatever motivates them, collectors preserve objects that would otherwise be lost, and in doing so they often keep alive the stories those objects tell.
    `,
    groups: [
      mcq([
        [
          'What does the writer say about most collections?',
          ['They are extremely valuable.', 'They are worth little money.', 'They are kept secret by their owners.', 'They are started by children.'],
          'B',
          'A3',
          '“Some collections are worth fortunes; most are of little financial value.”',
        ],
        [
          'According to paragraph B, collecting helps young children to',
          ['make friends at school.', 'organise the things they see into groups.', 'learn about the value of money.', 'remember family events.'],
          'B',
          'B3',
          'It helps children make sense of the world “by grouping objects into categories”.',
        ],
        [
          'What do many collectors report about acquiring a new item?',
          ['The pleasure lasts for a long time.', 'They feel guilty about the cost.', 'The excitement soon disappears.', 'They prefer to buy items online.'],
          'C',
          'C3',
          '“The excitement fades soon after they acquire an item.”',
        ],
        [
          'According to paragraph F, what separates harmful collecting from ordinary collecting?',
          ['the number of objects collected', 'the cost of the collection', 'how the person relates to the objects', 'the type of objects collected'],
          'C',
          'F4',
          '“The key difference is not the size of a collection but the relationship between the collector and the objects.”',
        ],
      ]),
      summary(
        'Reasons for collecting',
        0,
        `For many collectors, the main pleasure lies in [[searching]] rather than owning. Collections can also act as a [[record]] of a person’s life, and they may give a feeling of [[security]], especially when life is uncertain.
        Clubs and online communities allow collectors to share knowledge, and expert knowledge can bring them [[respect]].
        The writer believes collecting should be seen as a [[creative]] activity.`,
        [
          ['C4', 'The pleasure “lies more in seeking than in owning”: seeking = searching.'],
          ['D2', 'A collection “can serve as a record of a person’s life”.'],
          ['D3', 'Collecting “provides a sense of continuity and security”.'],
          ['E3', 'Expertise “can bring recognition and respect”.'],
          ['G1', 'Collecting “deserves to be understood as a creative activity”.'],
        ],
        { words: ['searching', 'record', 'security', 'respect', 'creative', 'selling', 'profit', 'boredom', 'eccentric', 'freedom'] },
      ),
      ynng([
        ['About one in three adults collects something.', 'Y', 'A2', '“Around a third of adults collect something.”'],
        ['Most collectors can easily explain why they collect.', 'N', 'A4', '“Many find it difficult to explain why.”'],
        ['People are more likely to collect during times of change.', 'Y', 'D3', 'People are “particularly likely to start or expand collections during periods of change or uncertainty”.'],
        ['Online communities have reduced the number of collectors’ clubs.', 'NG', 'E2', 'Both clubs and online communities are mentioned, but no effect of one on the other.'],
        ['Collecting should be regarded as a strange habit.', 'N', 'G1', 'It should be understood as creative “rather than dismissed as an eccentric habit”.'],
      ]),
    ],
  }),
])
