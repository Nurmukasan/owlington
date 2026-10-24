import { endings, headings, info, mcq, notes, passage, summary, test, tfng, ynng } from '../build'

export default test('full-03', [
  passage({
    title: 'Partners in the Hunt',
    sub: 'In parts of Africa, wild birds lead people to bees’ nests, and people answer with a special call.',
    text: `
      A
      In the woodlands of northern Mozambique, a man walks through the trees making a loud, rolling call: a trill followed by a short grunt.
      Within minutes, a small brown bird appears, chattering excitedly and flitting from branch to branch ahead of him.
      The man follows, and after a few hundred metres the bird falls silent near a tree.
      High in the trunk is a nest of wild bees, full of honey.

      B
      The bird is the greater honeyguide, and its partnership with humans is one of the very few known examples of cooperation between people and a wild animal.
      Honeyguides feed on beeswax, which few other animals can digest, but they cannot easily break into bees’ nests on their own, since the nests are usually inside trees and are fiercely defended.
      Humans, armed with axes and smoke to calm the bees, can open the nests easily but often have difficulty finding them.
      By working together, each partner gains something it could not easily obtain alone: the people take the honey, and the birds feed on the wax and larvae that are left behind.

      C
      The relationship was described by European travellers as early as the seventeenth century, and many communities in Africa have traditional stories about it.
      Scientists, however, long debated whether the birds really guided people deliberately, or whether people simply followed birds that happened to be travelling towards nests.
      Careful studies in the late twentieth century, in which researchers followed honeyguides and recorded their behaviour, showed that the birds’ flights did lead reliably towards nests, and that the birds adjusted their behaviour to keep the humans following.

      D
      More recent research has shown that the communication works in both directions.
      In Mozambique, honey hunters from the Yao community use the distinctive trill-and-grunt call, which is passed down from one generation to the next.
      A team of biologists played recordings of this call, as well as recordings of other human sounds, while walking through the woodland.
      The special call more than doubled the chance of being guided by a honeyguide, and tripled the chance of being shown a bees’ nest, compared with the other sounds.

      E
      Interestingly, the call differs from place to place.
      In Tanzania, honey hunters of the Hadza people use a melodious whistle rather than a trill, and experiments there found that local honeyguides respond much more strongly to the whistle than to the Mozambican call.
      This suggests that the birds learn the particular signals used by people in their own area, in much the same way that people learn a local language.
      How young honeyguides acquire this knowledge is still unknown, since they are raised not by their own parents but by other species of bird, in whose nests the honeyguide mother lays her eggs.

      F
      Sadly, the partnership is disappearing in many places.
      As sugar becomes cheaper and more widely available, fewer people go honey hunting, and in some areas honeyguides no longer lead people at all.
      Some researchers believe the birds stop guiding when people stop responding, and that the knowledge can be lost within a few generations of birds.
      Others worry about a practice reported in some communities, where hunters destroy the leftover wax instead of leaving it for the bird, in the belief that a hungry bird will guide them again sooner.

      G
      Scientists studying the relationship hope that it can be preserved, not only for its own sake but because it reveals how cooperation between species can develop.
      It is possible that the partnership is extremely old; some have suggested it may have begun with early humans who first learned to control fire, since smoke is needed to subdue the bees.
      If so, the call of the honey hunter may be one of the oldest forms of conversation between people and another species.
    `,
    groups: [
      notes(
        'The greater honeyguide',
        1,
        [
          '# What each partner gains',
          '- birds eat the [[wax]] and larvae left in the nest',
          '- people use axes and [[smoke]] to open nests safely',
          '# Research in Mozambique',
          '- the Yao call is a trill followed by a [[grunt]]',
          '- the call is passed from one [[generation]] to the next',
          '- tripled the chance of being shown a nest',
          '# Research in Tanzania',
          '- Hadza hunters use a [[whistle]] instead',
          '- young honeyguides are raised by other [[species]]',
        ],
        [
          ['B4', 'The birds “feed on the wax and larvae that are left behind”.'],
          ['B3', 'Humans are “armed with axes and smoke to calm the bees”.'],
          ['A1', 'The call is “a trill followed by a short grunt”. “Short” is not needed in the gap.'],
          ['D2', 'The call “is passed down from one generation to the next”.'],
          ['E2', 'The Hadza “use a melodious whistle rather than a trill”.'],
          ['E4', 'Young honeyguides “are raised… by other species of bird”.'],
        ],
      ),
      tfng([
        ['Honeyguides are able to digest beeswax.', 'T', 'B2', '“Honeyguides feed on beeswax, which few other animals can digest.”'],
        ['Honeyguides regularly open bees’ nests without human help.', 'F', 'B2', 'They “cannot easily break into bees’ nests on their own”.'],
        ['European travellers learned about honeyguides from African stories.', 'NG', 'C1', 'Travellers described the relationship and communities had stories, but no link between the two is stated.'],
        ['Scientists once doubted that honeyguides deliberately led people to nests.', 'T', 'C2', 'Scientists “long debated whether the birds really guided people deliberately”.'],
        ['Honeyguides in Tanzania respond equally to the Mozambican and Hadza calls.', 'F', 'E2', 'They respond “much more strongly to the whistle than to the Mozambican call”.'],
        ['Honey hunting has declined partly because sugar has become cheaper.', 'T', 'F2', '“As sugar becomes cheaper and more widely available, fewer people go honey hunting.”'],
        ['Destroying leftover wax has been shown to make honeyguides guide again sooner.', 'NG', 'F4', 'Some hunters destroy the wax “in the belief” that it works, but the passage gives no evidence either way.'],
      ]),
    ],
  }),

  passage({
    title: 'Waking Sleeping Languages',
    sub: 'Thousands of the world’s languages are in danger of disappearing. A few that seemed lost have been brought back to life.',
    text: `
      A
      Of the roughly seven thousand languages spoken in the world today, linguists estimate that around forty per cent are endangered, many with only a few elderly speakers remaining.
      When a language disappears, it takes with it a unique way of describing the world: knowledge of local plants and animals, songs, stories and jokes that cannot be fully translated.
      For the communities concerned, the loss is often felt as a loss of identity, and it is frequently the result of past policies that punished children for speaking their parents’ language at school.

      B
      The most famous example of a language returning from the brink is Hebrew.
      For nearly two thousand years it was used mainly for religious study and prayer rather than in everyday conversation.
      In the late nineteenth century, a group of enthusiasts in what is now Israel began insisting on speaking Hebrew at home and inventing new words for modern objects.
      Within a few decades, a generation of children had grown up speaking it as their first language, and today it has millions of native speakers.

      C
      Hebrew’s success, however, depended on unusual circumstances: a large community with strong religious and political reasons to adopt the language, and a vast body of written texts to draw on.
      Most endangered languages have neither.
      Many have never been written down, and their speakers are scattered and few in number.
      For these communities, revival is a slower and more uncertain process.

      D
      One approach that has proved remarkably effective is the ‘language nest’, first developed by the Māori community in New Zealand in the early 1980s.
      In these preschools, young children are looked after by fluent speakers, often grandparents, who speak to them only in Māori.
      Children absorb the language naturally through play and daily routine, in the same way that they learn their first language at home.
      The model spread rapidly, and has since been adopted by indigenous communities in Hawaii, Canada and Scandinavia.

      E
      Even languages with no living speakers have been revived.
      Cornish, once spoken in the far south-west of England, died out as an everyday language in the late eighteenth century.
      In the twentieth century, enthusiasts reconstructed it from old manuscripts, plays and word lists, and there are now families who use it at home and children who have learned it from birth.
      Similarly, in the United States, members of the Myaamia nation have taught themselves their ancestral language using documents recorded by missionaries and linguists more than a century ago.

      F
      Technology is increasingly part of these efforts.
      Recordings of the last native speakers, once stored in archives, are being digitised and made available online, and some communities have developed apps that teach basic vocabulary.
      Social media allows scattered speakers to communicate with one another daily, which can be just as important as formal lessons.
      Linguists caution, though, that apps alone rarely produce fluent speakers; a language survives only if people use it in everyday life.

      G
      Revival raises difficult questions too.
      Reconstructed languages may differ from the original in pronunciation and vocabulary, and older speakers sometimes criticise the language spoken by younger learners as artificial.
      Some linguists respond that all living languages change constantly, and that a revived language, like any other, must be allowed to develop in the hands of those who speak it.
    `,
    groups: [
      headings(
        [
          'An ancient language becomes a mother tongue again',
          'Learning through everyday care and play',
          'Digital tools and their limits',
          'Why most languages face a harder task',
          'Arguments over how a language should sound',
          'Bringing back languages that had completely died',
          'The government policies that saved languages',
        ],
        [
          ['B', 'i', 'B3 B4', 'Hebrew, used mainly for religious study, became a first language for a generation of children.'],
          ['C', 'iv', 'C1 C2 C4', 'Most endangered languages lack Hebrew’s advantages, so revival is “slower and more uncertain”.'],
          ['D', 'ii', 'D2 D3', 'In language nests, children absorb the language “naturally through play and daily routine”.'],
          ['E', 'vi', 'E1', '“Even languages with no living speakers have been revived”, such as Cornish and Myaamia.'],
          ['F', 'iii', 'F1 F4', 'Technology helps, but “apps alone rarely produce fluent speakers”.'],
        ],
      ),
      info([
        ['a reason why the loss of a language may be connected to education', 'A', 'A3', 'Loss is often the result of “policies that punished children for speaking their parents’ language at school”.'],
        ['examples of the sources used to rebuild a language', 'E', 'E3', 'Cornish was reconstructed “from old manuscripts, plays and word lists”.'],
        ['a view that change in a revived language is natural', 'G', 'G3', '“All living languages change constantly.”'],
        ['the spread of a teaching method to other countries', 'D', 'D4', 'Language nests have been adopted “in Hawaii, Canada and Scandinavia”.'],
      ]),
      summary(
        'The revival of Hebrew',
        1,
        `For centuries, Hebrew was used mainly for study and [[prayer]]. In the late nineteenth century, enthusiasts began speaking it at home and created new [[words]] for modern things.
        Its success was helped by a large community and a great number of written [[texts]]. Within a few decades, it had become the first language of a [[generation]] of children.`,
        [
          ['B2', 'It was used “mainly for religious study and prayer”.'],
          ['B3', 'Enthusiasts began “inventing new words for modern objects”.'],
          ['C1', 'Hebrew had “a vast body of written texts to draw on”.'],
          ['B4', '“A generation of children had grown up speaking it as their first language.”'],
        ],
      ),
    ],
  }),

  passage({
    title: 'Can a Machine Be Creative?',
    sub: 'Computers now compose music, paint pictures and write poems. Whether any of this counts as creativity is another question.',
    text: `
      A
      Not long ago, creativity was often described as the one human ability that machines would never share.
      Computers could calculate faster than any mathematician and defeat champions at chess, but writing a poem or painting a picture seemed to require something they could not possess.
      That confidence has been badly shaken.
      Computer programs can now produce images in the style of famous painters, compose music that listeners cannot reliably distinguish from human work, and generate stories and poems in seconds.

      B
      These systems work in a way that is very different from earlier software.
      Rather than following rules written by programmers, they are trained on enormous collections of existing material: millions of images, songs or texts.
      From these examples they learn statistical patterns, such as which colours tend to appear together or which words tend to follow one another, and they use these patterns to produce new material that resembles what they have seen.
      The results can be impressive, but critics argue that this is imitation rather than creation, a sophisticated form of recombining what already exists.

      C
      Defenders reply that human creativity works in a similar way.
      No artist creates from nothing; every painter has studied other painters, and every writer has absorbed thousands of books.
      Much of what we call originality, they argue, consists of combining familiar elements in unfamiliar ways, which is exactly what these programs do.
      I find this argument partly persuasive, but I think it overlooks something important.

      D
      Human creativity is not only about producing something new; it is also about intention and judgement.
      An artist chooses what to express, decides when a work is finished and is able to explain, at least in part, why it matters.
      Current machines do none of these things.
      They produce output when asked, and they cannot tell a good result from a poor one without a human to judge it.
      In that sense, the creative decisions in machine-made art are still largely made by the people who choose the prompts and select the best results.

      E
      The question of value is also more complicated than it appears.
      Experiments have found that people often rate a painting or poem lower when they are told it was produced by a computer, even if they had admired it a moment earlier.
      This suggests that much of what we value in art lies not in the object itself but in our sense of the human experience behind it.
      Whether this attitude will survive as machine-made work becomes more common is impossible to predict.

      F
      Meanwhile, the practical consequences are already being felt.
      Illustrators, translators and writers of routine texts have reported losing work to automated systems, and there are unresolved disputes about whether it is fair to train programs on artists’ work without their permission.
      At the same time, many artists have begun to use these tools themselves, treating them as instruments that can suggest ideas or handle repetitive tasks, much as photographers once adapted to digital cameras.

      G
      Perhaps the most useful conclusion is that the question ‘Can machines be creative?’ is less important than the question of how humans and machines will create together.
      The camera did not end painting, but it changed what painters chose to do.
      Something similar may happen now, and the most interesting art of the coming decades may come from people who learn to use these new tools in ways their inventors never imagined.
    `,
    groups: [
      mcq([
        [
          'In paragraph A, the writer suggests that the belief that machines cannot be creative',
          ['was always unrealistic.', 'is now much less certain.', 'came mainly from artists.', 'has been proved correct.'],
          'B',
          'A3',
          '“That confidence has been badly shaken.”',
        ],
        [
          'According to paragraph B, how do the new systems produce material?',
          ['by following rules written by programmers', 'by copying a single existing work', 'by learning patterns from large amounts of existing work', 'by asking human users to choose between options'],
          'C',
          'B2 B3',
          'They are “trained on enormous collections of existing material” and learn “statistical patterns”.',
        ],
        [
          'What is the writer’s view of the argument in paragraph C?',
          ['It is entirely convincing.', 'It is convincing but incomplete.', 'It is based on a misunderstanding of art.', 'It applies only to music.'],
          'B',
          'C4',
          '“I find this argument partly persuasive, but I think it overlooks something important.”',
        ],
        [
          'What do the experiments described in paragraph E show?',
          ['People cannot tell machine art from human art.', 'People prefer art made by machines.', 'Knowing who made a work affects how people judge it.', 'Most people are unwilling to look at machine-made art.'],
          'C',
          'E2 E3',
          'People rate a work lower “when they are told it was produced by a computer, even if they had admired it a moment earlier”.',
        ],
      ]),
      endings(
        [
          'because they have been trained on examples created by people.',
          'because they cannot judge the quality of their own work.',
          'because it lacks any human intention.',
          'because they have lost work to automated systems.',
          'because they treat it as a tool that suggests ideas.',
          'because it changed rather than replaced an art form.',
          'because they understand the history of art.',
        ],
        [
          ['Critics describe machine-made art as imitation', 'A', 'B3 B4', 'The programs reproduce patterns from what they were trained on, so critics call it “imitation rather than creation”.'],
          ['The writer believes people still make most of the creative decisions in machine-made art', 'B', 'D4 D5', 'Machines “cannot tell a good result from a poor one without a human to judge it”.'],
          ['Some illustrators and translators are concerned about these systems', 'D', 'F2', 'They “have reported losing work to automated systems”.'],
          ['Many artists have begun to use the new technology', 'E', 'F3', 'They treat the tools “as instruments that can suggest ideas or handle repetitive tasks”.'],
          ['The writer mentions the camera', 'F', 'G2', '“The camera did not end painting, but it changed what painters chose to do.”'],
        ],
      ),
      ynng([
        ['Some music composed by computers is hard to tell apart from human music.', 'Y', 'A4', 'Programs “compose music that listeners cannot reliably distinguish from human work”.'],
        ['Automated systems have already affected some people’s employment.', 'Y', 'F2', 'Illustrators, translators and writers “have reported losing work to automated systems”.'],
        ['Current machines decide for themselves when a work is complete.', 'N', 'D2 D3', 'An artist decides when a work is finished; “current machines do none of these things”.'],
        ['People will always value human art more than machine art.', 'N', 'E4', 'The writer says whether this attitude will survive “is impossible to predict”, so “always” contradicts the writer.'],
        ['Laws on training programs with artists’ work will soon be introduced.', 'NG', 'F2', 'The writer mentions “unresolved disputes” but makes no prediction about new laws.'],
      ]),
    ],
  }),
])
