import { endings, features, info, mcq, notes, passage, summary, test, tfng, ynng } from '../build'

export default test('full-14', [
  passage({
    title: 'Steps Down to Water',
    sub: 'For more than a thousand years, communities in western India built magnificent staircases into the earth to reach their water.',
    text: `
      A
      In the dry regions of western India, rain falls for only a few months of the year, during the monsoon.
      For the rest of the year, water must be found underground, and the depth of the water table rises and falls dramatically with the seasons.
      To cope with this, communities developed a remarkable type of structure: the stepwell, a deep well reached by long flights of stone steps that descend, level by level, to the water below.

      B
      The earliest stepwells were simple pits with steps cut into their sides, but over the centuries they became increasingly elaborate.
      By the eleventh century, the largest were several storeys deep, with columns, landings and galleries at each level.
      Because the steps continued all the way down, people could reach the water whatever its height: after the monsoon, the lower levels were submerged, while in the dry season, users had to climb further down to fill their containers.

      C
      Stepwells were far more than sources of water.
      The temperature at the bottom could be several degrees cooler than at the surface, and in the hottest months they provided a welcome refuge from the heat.
      Collecting water was traditionally the work of women, and the stepwells became important meeting places where they could talk away from the restrictions of the household.
      Travellers and traders also stopped at stepwells built along major routes, and many wells included shaded areas where they could rest.

      D
      Many stepwells were decorated with carvings of extraordinary quality.
      One of the most celebrated, in the state of Gujarat, was built in the eleventh century by a queen in memory of her husband.
      Its walls are covered with hundreds of sculptures of gods, goddesses and scenes from religious stories.
      Not long after it was completed, the stepwell was buried by floods from a nearby river, and it remained almost entirely hidden under silt until archaeologists excavated it in the twentieth century.
      The silt, ironically, protected the carvings, which are in unusually good condition, and in 2014 the site was added to the list of World Heritage Sites.

      E
      Another famous example, in the neighbouring state of Rajasthan, is famous for its geometry rather than its sculpture.
      Its steps, arranged in a dense criss-cross pattern on three sides of a square shaft, are said to number around three and a half thousand, and the well descends thirteen levels.
      Seen from above, the pattern of light and shadow creates a dizzying effect that has made it a popular location for films.

      F
      During the colonial period, British officials considered stepwells unhygienic, and they encouraged the use of pumps and pipes instead.
      As piped water spread, many stepwells fell out of use.
      Some were filled with rubbish, others collapsed, and in many places the groundwater sank so low, because of pumping for farming and cities, that the wells ran dry.

      G
      In recent years, interest in stepwells has revived.
      Historians and photographers have documented hundreds of them, and some have been cleaned and restored.
      Several local governments have also begun to see them as part of the answer to modern water shortages, since restored wells can collect and store rainwater and help to recharge the ground beneath them.
    `,
    groups: [
      notes(
        'Stepwells',
        1,
        [
          '# Purpose',
          '- rain falls mainly during the [[monsoon]]',
          '- steps allowed people to reach water at any level',
          '# Social role',
          '- cooler than the surface in hot weather',
          '- important meeting places for [[women]]',
          '- shaded areas for travellers and [[traders]]',
          '# The Gujarat stepwell',
          '- built by a [[queen]] in the eleventh century',
          '- buried under [[silt]] after a flood',
          '# Decline',
          '- British officials thought stepwells were [[unhygienic]]',
          '- many filled with [[rubbish]] or collapsed',
        ],
        [
          ['A1', 'Rain falls “during the monsoon”.'],
          ['C3', 'Stepwells became “important meeting places” for women.'],
          ['C4', '“Travellers and traders also stopped at stepwells.”'],
          ['D2', 'It “was built in the eleventh century by a queen in memory of her husband”.'],
          ['D4', 'It “remained almost entirely hidden under silt”.'],
          ['F1', 'British officials “considered stepwells unhygienic”.'],
          ['F3', '“Some were filled with rubbish, others collapsed.”'],
        ],
      ),
      tfng([
        ['The earliest stepwells were decorated with columns and galleries.', 'F', 'B1', 'The earliest “were simple pits with steps cut into their sides”.'],
        ['In the dry season, people had to go further down a stepwell to find water.', 'T', 'B3', '“In the dry season, users had to climb further down.”'],
        ['The flood that buried the Gujarat stepwell damaged most of its carvings.', 'F', 'D5', 'The silt “protected the carvings, which are in unusually good condition”.'],
        ['The Rajasthan stepwell has around three and a half thousand steps.', 'T', 'E2', 'Its steps “are said to number around three and a half thousand”.'],
        ['The Rajasthan stepwell is older than the one in Gujarat.', 'NG', 'E1', 'No date is given for the Rajasthan stepwell.'],
        ['Restored stepwells can help to increase underground water supplies.', 'T', 'G3', 'They “help to recharge the ground beneath them”.'],
      ]),
    ],
  }),

  passage({
    title: 'The Dialects of Birdsong',
    sub: 'Songbirds learn their songs much as children learn to speak, and like human speech, their songs vary from place to place.',
    text: `
      A
      To a casual listener, all birds of the same species seem to sing the same song.
      Yet ornithologists have known for decades that this is far from true.
      In many songbirds, the song of a bird in one valley can differ noticeably from that of a bird of the same species a few kilometres away, and some species have distinct regional dialects with surprisingly sharp boundaries between them.

      B
      These differences exist because, for many songbirds, singing is learned rather than inherited.
      Young males listen to the songs of adult birds around them during a particular period early in life, often only a few weeks long, and then practise, producing rough, rambling sounds at first, much as a human baby babbles, before gradually refining them into a copy of what they have heard.
      Birds raised in isolation, without adult tutors, develop songs that are simpler and unusual, which shows that the full song is not present at birth.
      Because young birds copy the adults in their own area, local variations are passed from one generation to the next.

      C
      One of the earliest detailed studies of bird dialects was carried out on a species of sparrow living around a large bay in California.
      Researchers recorded the songs of birds at sites only a short distance apart and found that each population had its own recognisable version of the song.
      Remarkably, when the same sites were revisited decades later, some of the dialects had changed, while others had survived almost unchanged, and the boundaries between them had shifted.

      D
      Cities have created new pressures on birdsong.
      Studies in several European cities have found that birds living near busy roads sing at a higher pitch than birds of the same species in quieter areas.
      Traffic noise is concentrated at low frequencies, and by singing higher, birds make their songs easier to hear above the noise.
      Some species also sing earlier in the morning, before the traffic begins, or sing louder in noisy places.

      E
      Songs can also change very quickly.
      In one recent case in Canada, researchers noticed that some birds of a common sparrow species had begun ending their song with a new pattern of notes.
      Over the following two decades, the new ending spread thousands of kilometres across the country, replacing the older version in many areas.
      The researchers believe that young birds learned it from adults they met during the winter, when birds from different regions gather in the same places.

      F
      Why do dialects matter to the birds themselves?
      In some species, females appear to prefer males that sing the local dialect, possibly because a familiar song indicates a bird that has grown up in the area and is well adapted to local conditions.
      If that is the case, dialects may help to keep populations distinct, and some biologists have suggested that, over very long periods, differences in song could contribute to the formation of new species.

      G
      For scientists, birdsong offers a rare opportunity to study how a learned behaviour changes over time.
      Because songs can be recorded and compared precisely, researchers can track their changes across generations in a way that is very difficult for other forms of animal culture, and the parallels with the history of human languages continue to attract linguists as well as biologists.
    `,
    groups: [
      info([
        ['evidence that the complete song is not inherited', 'B', 'B3', 'Birds raised in isolation “develop songs that are simpler and unusual”.'],
        ['a description of changes found when research sites were visited again', 'C', 'C3', 'When sites were revisited decades later, some dialects had changed and boundaries had shifted.'],
        ['a reason why female birds may prefer a particular song', 'F', 'F2', 'A familiar song “indicates a bird that has grown up in the area”.'],
        ['an explanation of how a new song spread over a large area', 'E', 'E4', 'Young birds learned it “from adults they met during the winter”.'],
        ['a reference to interest in birdsong from another academic field', 'G', 'G2', 'The parallels “continue to attract linguists as well as biologists”.'],
      ]),
      summary(
        'How young birds learn to sing',
        1,
        `Young male songbirds listen to adult songs during a short [[period]] early in life.
        At first they produce rough sounds, rather like a human baby who [[babbles]], and these are gradually refined into a [[copy]] of the adult song.
        Because birds copy the adults near them, local [[variations]] are handed down through the generations.`,
        [
          ['B2', 'They listen “during a particular period early in life”.'],
          ['B2', 'Their rough sounds are made “much as a human baby babbles”.'],
          ['B2', 'They refine the sounds “into a copy of what they have heard”.'],
          ['B4', '“Local variations are passed from one generation to the next.”'],
        ],
      ),
      endings(
        [
          'because traffic noise is mainly low-pitched.',
          'because they have no adults to copy.',
          'because birds from different regions meet in winter.',
          'because the songs are recorded precisely.',
          'because quieter areas have fewer birds.',
          'because they want to attract more than one mate.',
        ],
        [
          ['City birds near busy roads sing at a higher pitch', 'A', 'D3', '“Traffic noise is concentrated at low frequencies.”'],
          ['A new song ending travelled across Canada', 'C', 'E4', 'Young birds learned it from adults met in winter, when birds from different regions gather.'],
          ['Birds raised alone develop unusual songs', 'B', 'B3', 'They grow up “without adult tutors”.'],
          ['Birdsong is valuable for studying cultural change', 'D', 'G2', '“Because songs can be recorded and compared precisely, researchers can track their changes.”'],
        ],
      ),
    ],
  }),

  passage({
    title: 'What Do Intelligence Tests Measure?',
    sub: 'For more than a century, people have tried to capture intelligence in a single number. The results have been useful, controversial and puzzling.',
    text: `
      A
      The first modern intelligence test was developed in France in the early twentieth century.
      The government wanted a way of identifying children who were struggling at school and might benefit from extra help, and two psychologists designed a series of tasks of increasing difficulty to measure children’s reasoning, memory and understanding.
      Importantly, the test’s creators did not believe they were measuring a fixed quality.
      They saw their scale as a practical tool for identifying children who needed support, and they warned against using it to label children permanently.

      B
      Those warnings were soon forgotten.
      In the decades that followed, intelligence tests were adopted on a large scale, particularly in the United States, where they were used to sort soldiers, schoolchildren and immigrants.
      Results were often interpreted as evidence of inborn and unchangeable ability, and in some cases they were used to justify discrimination against particular groups.
      This history has left many people deeply suspicious of intelligence testing.

      C
      Modern tests are far more carefully designed, and psychologists generally agree that they measure something real.
      People who do well on one kind of mental task, such as solving puzzles, tend to do well on others, such as remembering lists or understanding vocabulary, and test scores predict performance at school and, to a lesser extent, success at work.
      Dr Karen Holt, a psychologist who has studied testing for thirty years, argues that this makes the tests useful, provided their limitations are understood.
      ‘A test score is a measurement taken on one day, under particular conditions,’ she says. ‘It is not a verdict on a person’s worth.’

      D
      One of the most surprising discoveries about intelligence tests concerns how scores have changed over time.
      During the twentieth century, average scores in many countries rose by around three points every ten years, so that a typical person in 2000 would have scored well above average on a test designed in 1900.
      Professor Daniel Reyes, who has analysed this rise, believes it cannot be explained by genetic change, which would take far longer.
      He attributes it instead to better nutrition, more years of schooling and a world that increasingly demands abstract thinking.
      In some countries, the rise has recently slowed or even reversed, and researchers are still debating why.

      E
      Other critics question whether a single score can capture something as complex as intelligence.
      Dr Amira Haddad argues that tests largely ignore abilities such as creativity, practical problem-solving and the capacity to understand other people, all of which matter greatly in everyday life.
      Professor Simon Clarke disagrees with some of her conclusions, pointing out that attempts to measure separate ‘intelligences’ have produced little reliable evidence, but he accepts that test scores tell only part of the story.

      F
      Cultural background is another concern.
      Many test questions assume familiarity with particular objects, words or ways of thinking, and people from different backgrounds may approach them differently.
      Dr Lena Fischer, who has adapted tests for use in several countries, notes that simply translating a test is not enough; questions must be rewritten and tested again so that they measure the same skills in each culture.

      G
      Perhaps the most important lesson from more than a century of testing is that intelligence, as measured by tests, is not fixed.
      It responds to education, nutrition and experience, and it varies across a person’s lifetime.
      I believe the tests can be valuable tools for identifying needs and evaluating education, but they should never be used, as they once were, to set limits on what people are allowed to become.
    `,
    groups: [
      mcq([
        [
          'What was the original purpose of the first intelligence test?',
          ['to select the most able students for university', 'to identify children who needed help at school', 'to compare the intelligence of different countries', 'to measure a fixed quality in each child'],
          'B',
          'A2',
          'The government wanted to identify “children who were struggling at school and might benefit from extra help”.',
        ],
        [
          'What does the writer say about the use of tests in the decades that followed?',
          ['The original warnings were ignored.', 'Tests were used only in schools.', 'Results were interpreted with great care.', 'Few people trusted the results.'],
          'A',
          'B1 B3',
          '“Those warnings were soon forgotten”, and results were interpreted as evidence of unchangeable ability.',
        ],
        [
          'Which of the following shows that intelligence tests measure something real, according to paragraph C?',
          ['People’s scores never change.', 'People who do well on one task tend to do well on others.', 'Test scores perfectly predict success at work.', 'Tests are now used in every country.'],
          'B',
          'C2',
          'People who do well on one kind of task “tend to do well on others”. Scores predict work success only “to a lesser extent”.',
        ],
        [
          'What is the writer’s main conclusion in paragraph G?',
          ['Intelligence tests should no longer be used.', 'Intelligence cannot be changed by education.', 'Tests are useful but should not limit people’s futures.', 'Tests are most useful for adults.'],
          'C',
          'G3',
          'Tests “can be valuable tools”, but “should never be used… to set limits on what people are allowed to become”.',
        ],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Karen Holt', 'Daniel Reyes', 'Amira Haddad', 'Simon Clarke', 'Lena Fischer'],
        [
          ['Tests must be rewritten, not just translated, for other cultures.', 'E', 'F3', 'Fischer: “simply translating a test is not enough”.'],
          ['A test result should not be seen as a judgement of a person’s value.', 'A', 'C4', 'Holt: “It is not a verdict on a person’s worth.”'],
          ['There is little good evidence for several separate types of intelligence.', 'D', 'E3', 'Clarke: attempts to measure separate intelligences “have produced little reliable evidence”.'],
          ['Rising scores are linked to changes in diet and education.', 'B', 'D4', 'Reyes attributes the rise to “better nutrition, more years of schooling”.'],
          ['Tests overlook skills that are important in daily life.', 'C', 'E2', 'Haddad: tests “largely ignore abilities such as creativity”, which “matter greatly in everyday life”.'],
        ],
      ),
      ynng([
        ['The creators of the first test believed intelligence could not change.', 'N', 'A3', 'They “did not believe they were measuring a fixed quality”.'],
        ['Intelligence tests have sometimes been used unfairly against certain groups.', 'Y', 'B3', 'They were “used to justify discrimination against particular groups”.'],
        ['Average test scores have risen in every country in recent years.', 'N', 'D5', '“In some countries, the rise has recently slowed or even reversed.”'],
        ['Creativity tests are more reliable than intelligence tests.', 'NG', 'E2', 'Creativity is mentioned as an ignored ability, but no creativity tests are discussed.'],
        ['A person’s measured intelligence can change during their life.', 'Y', 'G2', '“It varies across a person’s lifetime.”'],
      ]),
    ],
  }),
])
