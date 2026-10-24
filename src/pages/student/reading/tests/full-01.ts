import { features, info, mcq, notes, passage, summary, test, tfng, ynng } from '../build'

export default test('full-01', [
  passage({
    title: 'The Return of the Sea Otter',
    sub: 'Hunted almost to extinction for its fur, a small marine mammal has taught ecologists how much one species can matter.',
    text: `
      A
      On a calm morning off the coast of central California, a sea otter floats on its back among the kelp, a flat stone balanced on its chest.
      It brings a clam down hard against the stone, again and again, until the shell cracks open.
      Scenes like this draw crowds of visitors with binoculars today, but a century ago they had almost vanished from the Pacific coast.
      The story of how the sea otter disappeared, and how it has slowly come back, has become one of the most instructive cases in modern ecology.

      B
      Unlike seals and whales, sea otters have no thick layer of fat to keep them warm.
      Instead, they rely on their fur, which is the densest of any animal, with up to a million hairs in a single square inch of skin.
      Air trapped among the hairs forms an insulating layer next to the body, and otters spend hours each day grooming to keep it in working order.
      They also burn energy at a remarkable rate, and an adult must eat roughly a quarter of its own body weight every day simply to stay alive.

      C
      It was this extraordinary fur that nearly destroyed the species.
      From the mid-eighteenth century onwards, hunters from Russia, and later from Britain, Spain and the United States, pursued otters along the entire northern rim of the Pacific, from Japan to Mexico.
      The pelts fetched high prices in China, where they were made into luxury clothing.
      By the early twentieth century, a population that had once numbered in the hundreds of thousands had been reduced to perhaps 2,000 animals, scattered in a few remote colonies.
      In 1911, an international treaty finally banned the hunting, although by then many scientists believed the animal could not recover.

      D
      As the otters vanished, something unexpected happened beneath the waves.
      Sea otters feed heavily on sea urchins, spiny creatures that graze on kelp, the giant seaweed that forms underwater forests along rocky coasts.
      With their main predator gone, urchin numbers rose sharply, and in many places they consumed the kelp down to bare rock.
      These so-called ‘urchin barrens’ supported far fewer fish, crabs and other species than the forests they replaced.
      In the 1970s, researchers comparing Alaskan islands with and without otters found the difference was striking: where otters survived, kelp forests flourished; where they had been wiped out, the sea floor was largely empty.

      E
      This relationship made the sea otter a textbook example of what ecologists call a keystone species, an animal whose influence on its surroundings is far greater than its numbers would suggest.
      Kelp forests are not only home to wildlife; they also protect coastlines by reducing the force of waves, and they absorb carbon dioxide as they grow.
      Some scientists now argue that protecting otters may be one of the cheapest ways of keeping these benefits.

      F
      The animal’s influence is not limited to rocky shores.
      In Elkhorn Slough, a sheltered estuary in California, otters that returned in the 1980s began feeding on crabs.
      With fewer crabs around, the small sea slugs that crabs normally eat became more common, and these slugs graze on the algae that grows on seagrass leaves.
      Freed from this coating, the seagrass, which had been declining for years because of pollution from farmland, began to recover.
      Researchers had not predicted the effect, and it took several years of careful experiments to explain it.

      G
      Recovery has not been welcomed by everyone.
      Otters compete with people for shellfish, and in some areas where they have returned, fisheries for abalone, crab and clams have declined.
      Several attempts to move otters into new areas also ended in failure, with most of the animals swimming away or dying soon after release.
      Even so, numbers along much of the Pacific coast are now far higher than they were a century ago, and the otter’s return has changed the way many conservationists think about predators.
      Rather than seeing them as a threat to other wildlife, they increasingly view them as part of the machinery that keeps whole ecosystems working.
    `,
    groups: [
      notes(
        'The sea otter',
        1,
        [
          '# Keeping warm and fed',
          '- has no thick layer of [[fat]] under the skin',
          '- its fur holds a layer of [[air]] next to the body',
          '- spends hours every day [[grooming]]',
          '- eats about a quarter of its body weight daily',
          '# The fur trade',
          '- pelts were sold in [[China]] to make expensive clothes',
          '- hunting was banned by a [[treaty]] in 1911',
          '# Effects on the coast',
          '- eats sea [[urchins]], which feed on kelp',
          '- kelp forests lessen the power of [[waves]] reaching the shore',
        ],
        [
          ['B1', '“Sea otters have no thick layer of fat to keep them warm.” The note says the same thing in different words.'],
          ['B3', '“Air trapped among the hairs forms an insulating layer next to the body.”'],
          ['B3', 'Otters “spend hours each day grooming to keep it in working order”: hours every day = a long time daily.'],
          ['C3', '“The pelts fetched high prices in China, where they were made into luxury clothing.” Luxury = expensive.'],
          ['C5', '“In 1911, an international treaty finally banned the hunting.”'],
          ['D2', 'Sea otters “feed heavily on sea urchins, spiny creatures that graze on kelp”. The word “sea” is already printed, so only “urchins” goes in the gap.'],
          ['E2', 'Kelp forests “protect coastlines by reducing the force of waves”: reducing the force = lessen the power.'],
        ],
      ),
      tfng([
        [
          'Sea otters use objects to help them open their food.',
          'T',
          'A1 A2',
          'The otter balances a flat stone on its chest and brings a clam down against it until the shell cracks: the stone is an object used to open food.',
        ],
        [
          'Sea otter fur was sold mainly to buyers in Russia.',
          'F',
          'C2 C3',
          'Hunters came from Russia, but the pelts “fetched high prices in China”. The passage contradicts the statement about where the fur was sold.',
        ],
        [
          'When hunting was banned, most scientists expected the sea otter population to recover.',
          'F',
          'C5',
          '“By then many scientists believed the animal could not recover” is the opposite of expecting a recovery.',
        ],
        [
          'Urchin barrens are home to fewer kinds of animals than kelp forests.',
          'T',
          'D4',
          'Urchin barrens “supported far fewer fish, crabs and other species than the forests they replaced”.',
        ],
        [
          'The research on Alaskan islands in the 1970s was paid for by fishing companies.',
          'NG',
          'D5',
          'The passage describes what the researchers found, but says nothing at all about who funded the work.',
        ],
        [
          'The pollution affecting the seagrass in Elkhorn Slough has now stopped.',
          'NG',
          'F4',
          'We learn that pollution from farmland had caused the decline, and that the seagrass began to recover because of the slugs. Whether the pollution itself has stopped is never stated.',
        ],
      ]),
    ],
  }),

  passage({
    title: 'The Wood Wide Web',
    sub: 'Do trees really share food and warnings through fungi in the soil, or has a good story run ahead of the evidence?',
    text: `
      A
      Beneath almost every forest lies a dense web of fungal threads, far too fine to see without a microscope.
      These threads, known as hyphae, wrap around and even enter the roots of trees, forming partnerships called mycorrhizas.
      The arrangement benefits both sides: the fungus gathers water and minerals such as phosphorus from the soil and passes them to the tree, while the tree supplies the fungus with sugars it has made through photosynthesis.
      Botanists have understood this basic exchange for more than a century, and it is thought that around nine out of ten plant species form such partnerships.

      B
      What has changed in recent decades is the suggestion that a single fungus can connect several trees at once, creating a shared network through which the trees themselves might exchange resources.
      In the 1990s, experiments in which young trees were given air containing a traceable form of carbon appeared to show that some of this carbon later turned up in neighbouring trees of a different species.
      Newspapers soon described the discovery as a ‘wood wide web’, and the phrase spread quickly.

      C
      Since then, the idea has grown considerably in popular books and documentaries.
      Large, old ‘mother trees’ are said to recognise their own offspring and feed them through the network, and trees under attack from insects are said to send chemical warnings to their neighbours.
      For many readers, the image of a cooperative forest, in which trees look after one another, has proved deeply appealing.

      D
      Some researchers, however, believe the evidence is weaker than the story.
      In 2023, a group of forest scientists reviewed dozens of field studies and concluded that many of the most widely repeated claims rested on small experiments, sometimes carried out with seedlings in pots rather than in mature forests.
      Dr Marta Ruiz, one of the reviewers, points out that carbon moving from one tree to another does not prove that it travelled through fungal threads; it may simply have passed through the soil.
      ‘The experiments were valuable,’ she says, ‘but we have to be careful about the distance between what was measured and what has been reported.’

      E
      Others defend the broader picture while accepting that it needs refinement.
      Professor Alan Greaves, who has studied fungal networks in Scottish pine forests for twenty years, argues that the existence of shared networks is no longer seriously in doubt, since genetic testing has repeatedly shown the same individual fungus attached to several trees.
      What remains uncertain, he says, is how much material actually moves through them, and in which direction.
      ‘We have proved the roads exist,’ he notes. ‘We have not yet counted the traffic.’

      F
      A different question has led some biologists to reconsider the whole relationship.
      Dr Priya Nair, who works on fungal biology, suggests that what looks like generosity between trees may be better understood as trade managed by the fungus, which can reward the partners that supply it with the most sugar.
      In laboratory studies, some fungi have been seen to move phosphorus towards roots that provided more carbon in return, behaving almost like a market.
      Nair stresses that this does not make the network any less remarkable, only that ‘the trees may not be the main characters in the story’.

      G
      The debate matters beyond the laboratory.
      Foresters in several countries have begun to recommend leaving large old trees standing when timber is harvested, partly on the grounds that they support the network that young trees depend on.
      Kenji Watanabe, a forest manager in Japan, believes this advice is sensible whatever the final scientific verdict: ‘Old trees provide habitat, store carbon and hold the soil together. We do not need a perfect understanding of the fungi to know they are worth keeping.’
      Researchers on all sides agree that the next step is longer studies in real forests, using methods that can follow nutrients directly along fungal threads.
    `,
    groups: [
      info([
        [
          'a reference to the proportion of plants that form partnerships with fungi',
          'A',
          'A4',
          'Paragraph A: “around nine out of ten plant species form such partnerships”. Nine out of ten is a proportion.',
        ],
        [
          'an example of how the media made an idea popular',
          'B',
          'B3',
          'Paragraph B: “Newspapers soon described the discovery as a ‘wood wide web’, and the phrase spread quickly.”',
        ],
        [
          'a description of a change in the way forests are managed',
          'G',
          'G2',
          'Paragraph G: foresters now recommend “leaving large old trees standing when timber is harvested”.',
        ],
        [
          'mention of a claim that trees can identify trees they are related to',
          'C',
          'C2',
          'Paragraph C: old ‘mother trees’ “are said to recognise their own offspring”. Offspring = related trees.',
        ],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Marta Ruiz', 'Alan Greaves', 'Priya Nair', 'Kenji Watanabe'],
        [
          [
            'Fungi may favour the trees that give them the most food.',
            'C',
            'F2 F3',
            'Nair says the fungus “can reward the partners that supply it with the most sugar”, and fungi moved phosphorus to roots that gave more carbon.',
          ],
          [
            'Evidence that carbon moved between trees does not show which route it took.',
            'A',
            'D3',
            'Ruiz: carbon moving from one tree to another “does not prove that it travelled through fungal threads; it may simply have passed through the soil”.',
          ],
          [
            'A forestry practice is worth following even if the science is not settled.',
            'D',
            'G3',
            'Watanabe thinks keeping old trees is sensible “whatever the final scientific verdict”.',
          ],
          [
            'It is now certain that one fungus can be connected to many trees.',
            'B',
            'E2',
            'Greaves: shared networks are “no longer seriously in doubt”, because genetic tests show “the same individual fungus attached to several trees”.',
          ],
          [
            'Reports of the research have gone further than the research itself.',
            'A',
            'D4',
            'Ruiz warns about “the distance between what was measured and what has been reported”. Note that A is used twice: letters can repeat in this task.',
          ],
        ],
      ),
      summary(
        'How mycorrhizas work',
        1,
        `The fine threads of the fungus, which are called [[hyphae]], wrap around and enter the roots of trees.
        The fungus collects water from the soil, together with minerals like [[phosphorus]], and passes them to the tree.
        In return, the tree provides the fungus with [[sugars]] made during photosynthesis.
        In experiments in the 1990s, scientists followed a special form of [[carbon]] that seemed to travel between trees of different species.`,
        [
          ['A2', '“These threads, known as hyphae, wrap around and even enter the roots of trees.”'],
          ['A3', 'The fungus gathers “water and minerals such as phosphorus” and passes them to the tree.'],
          ['A3', 'The tree “supplies the fungus with sugars it has made through photosynthesis”.'],
          ['B2', 'Young trees were given air “containing a traceable form of carbon”, which later “turned up in neighbouring trees of a different species”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'The Procrastination Puzzle',
    sub: 'Putting things off is usually blamed on laziness or poor planning. A growing body of research suggests that the real cause lies elsewhere.',
    text: `
      A
      Almost everyone delays tasks from time to time, but for a sizeable minority of people, procrastination is a persistent problem that damages their work, their finances and even their health.
      Surveys in several countries suggest that around one adult in five considers themselves a chronic procrastinator, and the figure among university students is considerably higher.
      For a long time, the standard explanation was that procrastinators simply manage their time badly.
      Give them a diary, a timetable and a set of deadlines, the thinking went, and the problem would largely disappear.

      B
      That explanation has never matched the experience of procrastinators themselves, many of whom are highly organised in other areas of their lives.
      It also fails to explain one of the habit’s most puzzling features: people often delay tasks that they fully intend to do, and know they will regret postponing.
      A student may plan to start an essay on Monday, spend Monday tidying the kitchen instead, and feel worse on Tuesday than if they had simply written it.
      Poor scheduling cannot account for a decision that the person recognises, at the very moment of making it, as a mistake.

      C
      Researchers increasingly describe procrastination as a problem of managing emotions rather than time.
      Tasks that are boring, difficult or uncertain tend to produce unpleasant feelings, such as anxiety, frustration or self-doubt.
      Putting the task off brings immediate relief from those feelings, and that relief is rewarding in its own right, which makes the person more likely to delay again next time.
      In this view, the tidy kitchen is not a sign of laziness but a short-term strategy for feeling better, one whose cost is paid later, often with interest.

      D
      One influential line of research has examined how people think about their future selves.
      Brain-imaging studies suggest that, when some people imagine themselves ten years from now, the pattern of activity resembles the one produced when they think about a stranger.
      If the person who will have to finish the essay feels like someone else, it becomes much easier to hand them the problem.
      Experiments in which participants were shown digitally aged images of their own faces found that they subsequently made more far-sighted choices about saving money, and some psychologists believe a similar method could reduce procrastination, although this has yet to be convincingly demonstrated.

      E
      The emotional account also helps to explain why some popular remedies are less effective than they appear.
      Advice to ‘just get started’ assumes that the obstacle is practical, when for many people the difficulty is the feeling the task produces.
      Similarly, harsh self-criticism after a period of delay, which many procrastinators regard as a way of motivating themselves, tends to make matters worse.
      In one study of university students, those who forgave themselves for putting off revision before a first exam procrastinated less before the second.
      Self-compassion, it appears, reduces the negative feelings that trigger the delay in the first place.

      F
      None of this means that procrastination is impossible to change.
      Breaking a task into smaller steps, for instance, can make it seem less threatening, and focusing on the very next action rather than the whole project reduces the sense of being overwhelmed.
      Some researchers also recommend making tempting distractions harder to reach, since every small barrier increases the chance that the person will return to the task.
      What these techniques have in common is that they deal with the emotional reaction to the work rather than with the person’s calendar.

      G
      It would be a mistake, however, to treat every delay as a failing.
      Some writers deliberately postpone decisions in order to let ideas develop, and there is evidence that a short period of delay can lead to more original solutions to creative problems.
      The difference lies in whether the delay is chosen for a reason or driven by the need to escape discomfort.
      Recognising which kind of delay one is engaged in may be the most useful skill of all.
    `,
    groups: [
      mcq([
        [
          'What does the writer say about the traditional explanation of procrastination?',
          [
            'It was developed mainly through studies of students.',
            'It does not match what procrastinators actually experience.',
            'It has been replaced by a theory about poor memory.',
            'It is still accepted by most researchers.',
          ],
          'B',
          'B1',
          'Paragraph B opens: “That explanation has never matched the experience of procrastinators themselves.” Students are mentioned (A2) but not as the source of the theory, and C says researchers now prefer an emotional explanation, so D is wrong.',
        ],
        [
          'The writer uses the example of the student who tidies the kitchen to show that',
          [
            'household jobs are a common form of distraction.',
            'procrastinators often make a choice they know to be unwise.',
            'students are especially likely to delay their work.',
            'delaying work usually leads to lower marks.',
          ],
          'B',
          'B2 B4',
          'The example illustrates delaying tasks people “know they will regret postponing”, and B4 sums it up: the person recognises the decision “at the very moment of making it, as a mistake”.',
        ],
        [
          'According to paragraph D, brain-imaging studies suggest that some people',
          [
            'find it hard to remember their own past decisions.',
            'think about themselves in the future as if they were someone else.',
            'cannot imagine events that are more than a few years away.',
            'make better decisions when they look at photographs of strangers.',
          ],
          'B',
          'D2 D3',
          'Imagining themselves in ten years produces activity that “resembles the one produced when they think about a stranger”, so the future self “feels like someone else”.',
        ],
        [
          'What does the writer say about using aged images of people’s faces to reduce procrastination?',
          [
            'It has been shown to work only with older participants.',
            'It has not yet been proved to be effective.',
            'It is more effective than learning self-compassion.',
            'It is already widely used by psychologists.',
          ],
          'B',
          'D4',
          'Some psychologists believe the method could reduce procrastination, “although this has yet to be convincingly demonstrated”. The proven effect was on saving money, not procrastination.',
        ],
      ]),
      summary(
        'An emotional explanation',
        1,
        `Many researchers now believe that procrastination is less about [[time management]] than about emotions.
        Tasks that are hard or dull can cause [[anxiety]] and other unpleasant feelings, and avoiding them produces a sense of [[relief]], which makes further delay more likely.
        Although many people think it will motivate them, [[self-criticism]] after a delay generally makes the problem worse, whereas [[forgiveness]] appears to reduce it.`,
        [
          ['C1', 'Procrastination is “a problem of managing emotions rather than time” — not about time management.'],
          ['C2', 'Boring or difficult tasks “produce unpleasant feelings, such as anxiety, frustration or self-doubt”.'],
          ['C3', '“Putting the task off brings immediate relief from those feelings”, and that relief makes delay more likely next time.'],
          ['E3', '“Harsh self-criticism after a period of delay, which many procrastinators regard as a way of motivating themselves, tends to make matters worse.”'],
          ['E4 E5', 'Students “who forgave themselves” procrastinated less: forgiveness (self-compassion) reduces the problem.'],
        ],
        {
          words: [
            'time management',
            'anxiety',
            'relief',
            'self-criticism',
            'forgiveness',
            'boredom',
            'deadlines',
            'distractions',
            'strangers',
            'originality',
          ],
        },
      ),
      ynng([
        [
          'Procrastination can harm people’s physical well-being.',
          'Y',
          'A1',
          'The writer says procrastination can damage people’s work, finances “and even their health”.',
        ],
        [
          'Most chronic procrastinators are disorganised in every part of their lives.',
          'N',
          'B1',
          'The writer says the opposite: many procrastinators “are highly organised in other areas of their lives”.',
        ],
        [
          'Brain-imaging studies are too expensive to be used widely in procrastination research.',
          'NG',
          'D2',
          'Brain-imaging studies are mentioned, but the writer says nothing about their cost.',
        ],
        [
          'Telling procrastinators to ‘just get started’ is good advice for most of them.',
          'N',
          'E1 E2',
          'The writer calls it a remedy that is “less effective than it appears”, because for many people the problem is the feeling, not a practical obstacle.',
        ],
        [
          'Some delay can be useful in creative work.',
          'Y',
          'G2',
          '“A short period of delay can lead to more original solutions to creative problems.”',
        ],
      ]),
    ],
  }),
])
