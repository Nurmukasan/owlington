import { endings, headings, mcq, passage, summary, table, test, tfng, ynng } from '../build'

export default test('full-09', [
  passage({
    title: 'Building with Bamboo',
    sub: 'Fast-growing, strong and light, bamboo has been called the steel of the twenty-first century. Builders are not yet convinced.',
    text: `
      A
      Bamboo has been used for building for thousands of years across Asia, Africa and Latin America, for everything from houses and bridges to the scaffolding that still surrounds skyscrapers under construction in Hong Kong.
      Yet in most of the world it is regarded as a material for temporary structures or for the poor.
      Architects and engineers who champion it argue that this reputation is undeserved, and that bamboo could become one of the most important building materials of the coming century.

      B
      Although it looks like a tree, bamboo is in fact a giant grass.
      Some species are among the fastest-growing plants on Earth, able to grow almost a metre in a single day during the growing season.
      A bamboo plant sends up new stems from its underground roots every year, so that when mature stems are harvested the plant itself survives and continues to produce.
      Stems can be cut for building after three to five years, compared with the decades needed to grow most timber trees.

      C
      Bamboo’s mechanical properties are equally impressive.
      Its stems are hollow and divided into sections by solid joints, a structure that makes them very light for their strength.
      When pulled along its length, good-quality bamboo can resist forces comparable to those that mild steel can withstand, and its flexibility allows bamboo buildings to bend rather than break in earthquakes and strong winds.

      D
      Despite these advantages, bamboo has serious weaknesses.
      Untreated stems are attacked by insects and fungi, particularly because they contain starch, and in damp conditions they may rot within a few years.
      Traditionally, builders reduced this risk by harvesting stems in the dry season, when starch levels are lower, or by soaking them in water for several weeks.
      Today, stems are often treated with solutions of boron salts, which protect them for many decades without being highly toxic to people.

      E
      A further difficulty is that no two stems are exactly the same.
      Each varies in diameter, wall thickness and straightness, which makes it hard for engineers to calculate how a structure will behave and for builders to make precise joints.
      In many countries, building regulations contain no rules for bamboo, so architects who wish to use it must carry out expensive tests to prove that their designs are safe.

      F
      One solution is engineered bamboo.
      Stems are split into strips, which are flattened, dried and glued together under pressure to form boards and beams of uniform size and strength.
      These products can be used in much the same way as timber, and they are increasingly found in floors, furniture and wall panels.
      Critics point out, however, that the glues and the energy used in manufacturing reduce some of bamboo’s environmental advantages.

      G
      Supporters remain optimistic.
      Bamboo absorbs carbon dioxide quickly as it grows, it can be cultivated on land that is too steep or degraded for other crops, and it provides income for millions of small farmers.
      Several countries have begun to write building codes for bamboo, and a number of striking public buildings have shown what the material can do.
      Whether it can move beyond its image as a material for the poor, however, may depend as much on changing attitudes as on improving technology.
    `,
    groups: [
      table(
        'Bamboo as a building material',
        2,
        ['Feature', 'Details'],
        [
          ['Growth', 'some species grow almost a metre in a [[single day]]'],
          ['Harvesting', 'stems ready after three to five years; the [[plant]] itself survives'],
          ['Structure', 'hollow stems divided by solid [[joints]]'],
          ['Strength', 'can resist forces similar to [[mild steel]]'],
          ['Protection', 'traditionally cut in the [[dry season]]; now treated with boron salts'],
          ['Engineered bamboo', 'strips are glued together under [[pressure]] to make boards and beams'],
        ],
        [
          ['B2', 'Some species are “able to grow almost a metre in a single day”.'],
          ['B3', '“When mature stems are harvested the plant itself survives.”'],
          ['C2', 'Stems are “hollow and divided into sections by solid joints”.'],
          ['C3', 'Bamboo resists “forces comparable to those that mild steel can withstand”.'],
          ['D3', 'Builders harvested stems “in the dry season, when starch levels are lower”.'],
          ['F2', 'Strips are “glued together under pressure to form boards and beams”.'],
        ],
      ),
      tfng([
        ['Bamboo scaffolding is still used in Hong Kong.', 'T', 'A1', 'Bamboo scaffolding “still surrounds skyscrapers under construction in Hong Kong”.'],
        ['Bamboo is a type of tree.', 'F', 'B1', '“Although it looks like a tree, bamboo is in fact a giant grass.”'],
        ['Bamboo buildings perform well in earthquakes.', 'T', 'C3', 'Its flexibility “allows bamboo buildings to bend rather than break in earthquakes”.'],
        ['The starch in bamboo makes it attractive to insects.', 'T', 'D2', 'Stems are attacked by insects and fungi, “particularly because they contain starch”.'],
        ['Boron salt treatment is dangerous for the people who live in bamboo houses.', 'F', 'D4', 'It protects stems “without being highly toxic to people”.'],
        ['Most countries have building regulations for bamboo.', 'F', 'E3', '“In many countries, building regulations contain no rules for bamboo.”'],
        ['Engineered bamboo is cheaper than ordinary timber.', 'NG', 'F3 F4', 'It can be used “in much the same way as timber”, but prices are never compared.'],
      ]),
    ],
  }),

  passage({
    title: 'Stuck in a Loop',
    sub: 'Almost everyone has had a tune they cannot stop hearing. Researchers are finally discovering why.',
    text: `
      A
      You hear a few bars of a song on the radio in the morning, and by lunchtime it is still playing in your head, repeating the same short phrase again and again.
      This experience, known as an earworm, is one of the most common forms of what psychologists call involuntary musical imagery.
      Surveys suggest that around nine in ten people experience an earworm at least once a week, and for most of them it is a mild annoyance that fades within an hour or so.

      B
      For a long time, earworms received little scientific attention, partly because they seemed trivial and partly because they are difficult to study: they cannot be produced on demand in a laboratory, and they exist only inside people’s heads.
      Over the past fifteen years, however, researchers have collected thousands of descriptions from volunteers through online questionnaires and diaries, building up a detailed picture of when earworms occur and which songs cause them.

      C
      The songs most likely to become earworms share certain features.
      A large study in which several thousand people named their most frequent earworms found that these tended to be faster than average and to have melodies that were simple and easy to sing.
      At the same time, they usually contained something slightly unexpected, such as an unusual leap between notes or a repeated pattern that broke off in a surprising place.
      Familiarity matters too: earworms are most often songs that a person has heard many times, especially recently.

      D
      What usually loops in the mind is not a whole song but a fragment, typically fifteen to thirty seconds long, often from the chorus.
      One theory suggests that the brain finds it difficult to leave an incomplete pattern alone, and keeps returning to it as if trying to finish it.
      This may explain why some people find that listening to the complete song brings the loop to an end.

      E
      Earworms are particularly likely to appear when the mind is not fully occupied.
      Walking, showering and doing housework are common situations, as are moments of stress or tiredness.
      They can also be triggered by associations: seeing a person, a place or even a word connected with a song can bring it back.
      Interestingly, tasks that are either very easy or very difficult seem to leave room for earworms, whereas tasks of moderate difficulty, which absorb attention without overwhelming it, tend to keep them away.

      F
      Researchers have tested several remedies.
      In one experiment, volunteers who chewed gum after hearing catchy songs reported fewer unwanted repetitions than those who did not, apparently because chewing interferes with the silent movements of the mouth and throat involved in ‘singing along’ in one’s head.
      Solving puzzles of moderate difficulty, such as anagrams, has also been found to help.
      Trying hard not to think about the song, on the other hand, often makes matters worse.

      G
      Although earworms are usually harmless, a small number of people experience them so frequently and intensely that they interfere with sleep or concentration.
      Studying these cases may help scientists to understand other kinds of unwanted repetitive thoughts.
      For most of us, however, the occasional musical guest is simply a reminder of how deeply music becomes woven into memory.
    `,
    groups: [
      headings(
        [
          'Characteristics of songs that get stuck',
          'Why earworms were overlooked, and how this changed',
          'When the mind is most open to repeating music',
          'A common but usually brief experience',
          'Ways of getting rid of an unwanted tune',
          'Music as a treatment for stress',
          'The part of a song that repeats, and a possible reason',
          'A rare but serious form of the problem',
        ],
        [
          ['A', 'iv', 'A3', 'Nine in ten people experience earworms weekly, and for most “it is a mild annoyance that fades within an hour or so”.'],
          ['B', 'ii', 'B1 B2', 'Earworms were neglected because they seemed trivial and hard to study; recently researchers have collected thousands of descriptions.'],
          ['C', 'i', 'C1', '“The songs most likely to become earworms share certain features.”'],
          ['D', 'vii', 'D1 D2', 'What loops is “a fragment… often from the chorus”, perhaps because the brain wants to finish an incomplete pattern.'],
          ['E', 'iii', 'E1', '“Earworms are particularly likely to appear when the mind is not fully occupied.”'],
          ['F', 'v', 'F1', '“Researchers have tested several remedies.”'],
        ],
      ),
      endings(
        [
          'because chewing interferes with silently singing along.',
          'because the songs had been heard many times.',
          'because they absorb attention without overwhelming it.',
          'because they exist only inside people’s heads.',
          'because the brain may try to complete the pattern.',
          'because it makes people think about the song more.',
        ],
        [
          ['Earworms are hard to study in a laboratory', 'D', 'B1', 'They “exist only inside people’s heads” and cannot be produced on demand.'],
          ['Hearing the whole song may stop an earworm', 'E', 'D2 D3', 'The brain keeps returning to an incomplete pattern “as if trying to finish it”.'],
          ['Tasks of moderate difficulty tend to prevent earworms', 'C', 'E4', 'Such tasks “absorb attention without overwhelming it”.'],
          ['Trying to suppress an earworm is often unsuccessful', 'F', 'F4', 'Trying hard not to think about the song “often makes matters worse”.'],
        ],
      ),
      summary(
        'Who suffers most?',
        2,
        `For a small number of people, earworms are so intense that they disturb [[sleep]] or concentration.
        Research into these cases may help scientists understand other repetitive [[thoughts]].
        For most people, however, earworms simply show how closely music is connected to [[memory]].`,
        [
          ['G1', 'They “interfere with sleep or concentration”.'],
          ['G2', 'Studying them may help “understand other kinds of unwanted repetitive thoughts”.'],
          ['G3', 'Music “becomes woven into memory”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'Does Language Shape Thought?',
    sub: 'A once-discredited idea about how our words affect our minds has made a careful comeback.',
    text: `
      A
      In the 1930s and 1940s, the American linguist Benjamin Lee Whorf made a bold claim: the language we speak determines the way we think.
      Speakers of languages with very different grammars, he argued, must see the world in fundamentally different ways.
      The idea captured the public imagination, but it was later heavily criticised.
      Many of Whorf’s examples turned out to be based on misunderstandings of the languages he described, and for several decades most linguists dismissed his hypothesis as unscientific.

      B
      In its strongest form, the claim is certainly false.
      If language determined thought completely, people would be unable to understand ideas for which their language had no word, and translation between languages would be impossible.
      Yet speakers of every language can learn new concepts, and translators manage, however imperfectly, to carry meaning across.
      What has returned to serious discussion is a much weaker version: the idea that language influences certain habits of thought, making some distinctions easier or more natural to notice than others.

      C
      Some of the most convincing evidence comes from the study of direction.
      Speakers of English generally describe space in relation to their own bodies: the cup is to the left of the plate.
      Speakers of some languages, including a community in north-eastern Australia, use compass directions instead, saying that the cup is to the north of the plate even when they are indoors.
      Researchers have found that speakers of such languages are remarkably good at keeping track of direction, able to point accurately towards distant places even after walking through unfamiliar terrain or sitting in a windowless room.
      The language does not give them a special sense, but it forces them to pay constant attention to direction from early childhood.

      D
      Colour provides another example.
      Russian has two separate basic words for light blue and dark blue, where English has one.
      In experiments, Russian speakers were slightly faster at telling apart shades that fell on different sides of the boundary between their two words than shades that fell within the same category, an advantage English speakers did not show.
      The effect disappeared when the Russian speakers were asked to remember a series of numbers at the same time, which suggests that their language was actively involved in the task.

      E
      Not all such findings have survived closer examination.
      A widely reported study suggested that speakers of languages that assign grammatical gender to objects describe them in ways that match the gender: a bridge, for instance, might be called ‘strong’ by speakers of a language in which bridge is masculine, and ‘elegant’ by speakers of a language in which it is feminine.
      Later attempts to repeat these results with larger groups of participants largely failed, and many researchers now regard the original findings as unreliable.

      F
      In my view, the debate has become more productive precisely because both sides have moderated their positions.
      Few researchers today believe that language imprisons thought, but few would deny that the habits of a lifetime of speaking may leave some mark on how we attend to the world.
      The interesting questions now concern how large these effects are, how long they last, and whether they can change when people learn a new language.
      Early studies of bilingual speakers suggest that they sometimes shift their patterns of attention depending on which language they are using, a finding that, if confirmed, would show that the influence of language is flexible rather than fixed.
    `,
    groups: [
      mcq([
        [
          'Why did many linguists reject Whorf’s hypothesis?',
          ['It was too difficult to test.', 'Some of his examples were based on errors.', 'It was popular with the public.', 'It applied only to American languages.'],
          'B',
          'A4',
          '“Many of Whorf’s examples turned out to be based on misunderstandings of the languages he described.”',
        ],
        [
          'According to the writer, the strong version of the hypothesis must be false because',
          ['languages change too quickly.', 'people can learn ideas their language has no word for.', 'most people speak more than one language.', 'grammar has little influence on vocabulary.'],
          'B',
          'B2 B3',
          'If language determined thought, people could not understand ideas without words for them, “yet speakers of every language can learn new concepts”.',
        ],
        [
          'What explains the sense of direction of the Australian community described in paragraph C?',
          ['They are born with a special sense.', 'They spend more time outdoors than other people.', 'Their language makes them pay attention to direction.', 'They are taught to read maps at school.'],
          'C',
          'C5',
          'The language “forces them to pay constant attention to direction from early childhood”. It “does not give them a special sense”.',
        ],
        [
          'Why does the writer mention the memory task in the colour experiment?',
          ['to show that language was involved in the effect', 'to show that Russian speakers have better memories', 'to explain why English speakers were slower', 'to suggest that the experiment was badly designed'],
          'A',
          'D4',
          'When the effect disappeared, it “suggests that their language was actively involved in the task”.',
        ],
      ]),
      ynng([
        ['Whorf’s ideas were popular outside academic circles.', 'Y', 'A3', '“The idea captured the public imagination.”'],
        ['Most researchers now accept the strongest form of Whorf’s claim.', 'N', 'B1 F2', 'In its strongest form the claim “is certainly false”, and “few researchers today believe that language imprisons thought”.'],
        ['English speakers performed as well as Russian speakers in distinguishing light and dark blue.', 'N', 'D3', 'Russian speakers had “an advantage English speakers did not show”.'],
        ['The study on grammatical gender has been successfully repeated.', 'N', 'E3', 'Later attempts “largely failed”.'],
        ['The discussion about language and thought has improved in recent years.', 'Y', 'F1', '“The debate has become more productive.”'],
      ]),
      summary(
        'The current view',
        0,
        `Today, few researchers think that language completely [[controls]] the way people think. However, many accept that long-established speaking [[habits]] may affect what people notice.
        Researchers now want to know how [[large]] these effects are and how long they last. Research on [[bilingual]] speakers suggests that the influence of language may be [[flexible]].`,
        [
          ['F2', 'Few believe “that language imprisons thought”: controls it completely.'],
          ['F2', '“The habits of a lifetime of speaking may leave some mark on how we attend to the world.”'],
          ['F3', 'Questions now “concern how large these effects are, how long they last”.'],
          ['F4', '“Early studies of bilingual speakers suggest…”'],
          ['F4', 'The influence of language would be “flexible rather than fixed”.'],
        ],
        {
          words: ['controls', 'habits', 'large', 'bilingual', 'flexible', 'fixed', 'young', 'improves', 'common', 'grammar'],
        },
      ),
    ],
  }),
])
