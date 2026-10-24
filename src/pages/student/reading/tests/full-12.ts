import { endings, info, mcq, notes, passage, summary, test, tfng, ynng } from '../build'

export default test('full-12', [
  passage({
    title: 'The Great Tea Race',
    sub: 'In the 1860s, the fastest sailing ships ever built raced halfway round the world to bring the new season’s tea to London.',
    text: `
      A
      By the middle of the nineteenth century, tea had become Britain’s national drink, consumed in vast quantities by rich and poor alike.
      Almost all of it came from China, more than twenty thousand kilometres away by sea, and the voyage around the southern tip of Africa took three to four months.
      Tea loses its flavour over time, so the first cargoes of each new season’s crop to reach London fetched the highest prices, and merchants were willing to pay a large bonus to the ship that arrived first.

      B
      To win this prize, shipowners commissioned a new kind of vessel: the clipper.
      Clippers were built for speed rather than for carrying capacity.
      Their hulls were long and narrow, their bows sharp enough to cut through the waves rather than push against them, and they carried an enormous area of sail on tall masts.
      In good winds, the fastest clippers could travel more than three hundred and fifty kilometres in a single day, faster than many of the steamships of the time.

      C
      Sailing such ships demanded great skill and courage.
      Captains were expected to carry as much sail as possible, even in strong winds, and some were known to lock the ropes in place so that nervous crew members could not reduce the sails without permission.
      Choosing a route was equally important: a captain who found favourable winds could gain days on his rivals, while one who was caught in a region of calm could lose a week or more.

      D
      The most famous contest took place in 1866.
      Sixteen clippers left the Chinese port of Fuzhou within a few days of each other, loaded with the first tea of the season.
      After more than three months at sea, two of the leading ships sighted each other off the south-west coast of England and raced up the English Channel side by side.
      They arrived in London on the same tide, just minutes apart, after a voyage of ninety-nine days.
      The owners agreed to share the bonus, and the race was reported in newspapers across the country.

      E
      Yet the age of the tea clipper was already ending.
      In 1869, the Suez Canal opened, creating a much shorter route between Europe and Asia through the Mediterranean and the Red Sea.
      Sailing ships were poorly suited to the canal, where they had to be towed, and to the light and unpredictable winds of the Red Sea.
      Steamships, on the other hand, could use the new route easily, and they were becoming more efficient every year.
      Within a decade, steamships carried most of the tea from China.

      F
      Ironically, the most famous clipper of all, the Cutty Sark, was launched in Scotland in 1869, the same year that the canal opened.
      She made several tea voyages but never won the race she had been built for.
      Later, she found new work carrying wool from Australia, a trade in which sailing ships could still compete, and she set records on that route.

      G
      After many years and several changes of ownership, the Cutty Sark was brought back to Britain and eventually placed in a dry dock in Greenwich, in south-east London, where she became a museum.
      Despite a serious fire in 2007, she has been restored and remains one of the few surviving clipper ships in the world, a reminder of a brief period when sailing ships reached the peak of their speed.
    `,
    groups: [
      notes(
        'Tea clippers',
        1,
        [
          '# The tea trade',
          '- tea lost its [[flavour]] on long voyages',
          '- the first ship to arrive received a [[bonus]]',
          '# Design of clippers',
          '- long, narrow hulls and sharp [[bows]]',
          '- large area of sail on tall [[masts]]',
          '# The 1866 race',
          '- sixteen ships left [[Fuzhou]]',
          '- two ships arrived in London on the same [[tide]]',
          '# The end of the clippers',
          '- sailing ships had to be [[towed]] through the Suez Canal',
        ],
        [
          ['A3', '“Tea loses its flavour over time.”'],
          ['A3', 'Merchants paid “a large bonus to the ship that arrived first”.'],
          ['B3', 'Clippers had “bows sharp enough to cut through the waves”.'],
          ['B3', 'They “carried an enormous area of sail on tall masts”.'],
          ['D2', '“Sixteen clippers left the Chinese port of Fuzhou.”'],
          ['D4', '“They arrived in London on the same tide, just minutes apart.”'],
          ['E3', 'In the canal, sailing ships “had to be towed”.'],
        ],
      ),
      tfng([
        ['Tea was popular only among wealthy people in nineteenth-century Britain.', 'F', 'A1', 'It was “consumed in vast quantities by rich and poor alike”.'],
        ['Clippers could carry more cargo than other ships of the time.', 'F', 'B2', 'They “were built for speed rather than for carrying capacity”.'],
        ['Some captains prevented their crews from reducing sail.', 'T', 'C2', 'Some captains locked the ropes so nervous crew “could not reduce the sails without permission”.'],
        ['The winners of the 1866 race received a medal from the government.', 'NG', 'D5', 'The owners shared the bonus; no medal is mentioned.'],
        ['The Cutty Sark won several tea races.', 'F', 'F2', 'She “never won the race she had been built for”.'],
        ['The Cutty Sark was badly damaged by fire in the twenty-first century.', 'T', 'G2', 'There was “a serious fire in 2007”.'],
      ]),
    ],
  }),

  passage({
    title: 'Natural Navigators',
    sub: 'Turtles, birds and fish travel thousands of kilometres and return to the exact place they started. How do they do it?',
    text: `
      A
      Every few years, female loggerhead turtles return to lay their eggs on the beach where they themselves hatched, often after travelling thousands of kilometres across the open ocean.
      Salmon find their way from the sea back to the stream of their birth, and many songbirds migrate between continents, returning each spring to the same garden.
      How animals accomplish these journeys has puzzled scientists for centuries, and while much has been discovered, important questions remain.

      B
      One of the most important tools is the Earth’s magnetic field.
      The strength of the field and the angle at which its lines meet the surface vary from place to place, so that each stretch of coast has its own magnetic signature.
      Experiments in which young turtles were placed in tanks surrounded by magnetic coils, which reproduced the field found at different locations in the ocean, showed that the turtles changed the direction in which they swam to match the route they would need to follow from each place.
      Researchers believe that turtles learn the signature of their birth beach as hatchlings and use it to find their way back years later.

      C
      How animals detect magnetism is less clear.
      In birds, one leading theory involves a protein in the eye that reacts to light in a way that is affected by magnetic fields.
      If this is correct, birds may literally see the magnetic field as a pattern of light and shade laid over their normal vision.
      Other animals may rely on tiny particles of a magnetic mineral in their bodies, although finding these particles has proved surprisingly difficult.

      D
      Magnetism is far from the only sense involved.
      Many birds use the position of the sun during the day, adjusting for its movement across the sky, and some songbirds learn the pattern of the stars around the pole while they are still young.
      Salmon appear to use magnetism to reach the general area of their home river, but then rely on smell to recognise the particular stream in which they were born.
      Homing pigeons have been shown to use smells carried by the wind, as well as familiar landmarks such as roads and rivers.

      E
      These different systems seem to work together, with animals switching between them as conditions change.
      Birds that are prevented from seeing the sun or stars, for instance, may rely more heavily on magnetic information, and young birds on their first migration often make more errors than experienced adults, which suggests that learning plays an important part.

      F
      Human activity may be interfering with these abilities.
      In one study, researchers found that European robins kept in huts on a university campus could not orient themselves correctly using the magnetic field.
      When the huts were screened with aluminium to block electromagnetic noise from electrical equipment, the birds’ sense of direction returned.
      Bright lights at night can also confuse migrating birds and newly hatched turtles, which normally head towards the brighter horizon over the sea but may instead crawl towards illuminated roads and buildings.

      G
      Understanding animal navigation is not only of scientific interest.
      If conservationists know which senses animals depend on, they can take steps to protect them, for example by reducing lighting near turtle nesting beaches during the hatching season.
      And the study of how animals navigate without satellites may one day help engineers to design better backup systems for human travel.
    `,
    groups: [
      info([
        ['a description of an experiment using artificial magnetic fields', 'B', 'B3', 'Turtles in tanks “surrounded by magnetic coils, which reproduced the field found at different locations”.'],
        ['evidence that experience improves navigation', 'E', 'E2', 'Young birds “often make more errors than experienced adults, which suggests that learning plays an important part”.'],
        ['a practical step that could protect a species', 'G', 'G2', 'Conservationists can reduce “lighting near turtle nesting beaches”.'],
        ['the idea that some animals may be able to see magnetism', 'C', 'C3', 'Birds “may literally see the magnetic field as a pattern of light and shade”.'],
        ['an explanation of why each coastline is magnetically different', 'B', 'B2', 'Field strength and angle “vary from place to place”, giving each stretch of coast “its own magnetic signature”.'],
      ]),
      endings(
        [
          'by using the smell of the water.',
          'by learning star patterns when they are young.',
          'because electrical equipment interfered with their senses.',
          'because they are attracted to brighter light.',
          'by following other animals of the same species.',
          'because the magnetic particles are so small.',
        ],
        [
          ['Some songbirds find their way at night', 'B', 'D2', 'Songbirds “learn the pattern of the stars around the pole while they are still young”.'],
          ['Salmon identify their home stream', 'A', 'D3', 'They “rely on smell to recognise the particular stream”.'],
          ['The robins on the university campus lost their sense of direction', 'C', 'F2 F3', 'Screening out “electromagnetic noise from electrical equipment” restored it.'],
          ['Newly hatched turtles may crawl the wrong way', 'D', 'F4', 'They head towards the brighter horizon but may “crawl towards illuminated roads and buildings”.'],
        ],
      ),
      summary(
        'The senses used in navigation',
        1,
        `Birds may detect magnetism through a [[protein]] in their eyes, while other animals may use particles of a magnetic [[mineral]].
        During the day, many birds navigate using the position of the [[sun]].
        Homing pigeons use smells as well as familiar [[landmarks]] such as roads and rivers.`,
        [
          ['C2', 'One theory involves “a protein in the eye that reacts to light”.'],
          ['C4', 'Other animals “may rely on tiny particles of a magnetic mineral in their bodies”.'],
          ['D2', '“Many birds use the position of the sun during the day.”'],
          ['D4', 'Pigeons use smells “as well as familiar landmarks such as roads and rivers”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'In Defence of Small Talk',
    sub: 'Conversations about the weather are often dismissed as meaningless. Research suggests they matter more than we think.',
    text: `
      A
      Small talk has few admirers.
      Remarks about the weather, the traffic or the queue at the coffee machine are widely regarded as superficial, a way of filling silence rather than saying anything worthwhile.
      Many people say they dislike it, and advice columns regularly encourage readers to skip the pleasantries and move straight to ‘real’ conversation.
      I want to argue that this attitude is mistaken, and that small talk deserves more respect than it receives.

      B
      Consider first how we behave towards strangers.
      In one well-known study, commuters on trains in a large city were asked either to talk to the person next to them, to keep to themselves as usual, or to commute however they wished.
      Before the journey, most predicted that talking to a stranger would be unpleasant and that the stranger would not want to talk.
      In fact, those who struck up a conversation reported the most enjoyable journeys, and almost none of them were rejected.
      People, it seems, consistently underestimate how much others are willing to talk and how much they themselves will enjoy it.

      C
      Brief exchanges also seem to matter for wellbeing.
      Research on what psychologists call ‘weak ties’, the acquaintances we see regularly but do not know well, such as neighbours, shop assistants and people at the gym, has found that people tend to feel happier on days when they have more of these small interactions.
      In one experiment, customers who were asked to have a short friendly exchange with the person serving them in a café reported a better mood afterwards than those who were asked to be as efficient as possible.

      D
      None of this means that deeper conversation is unimportant.
      A study that recorded fragments of people’s everyday speech found that those who were happiest spent less time in small talk and more time in substantive conversations about ideas, feelings and experiences.
      Some commentators have used this finding as evidence against small talk.
      In my view, that is the wrong conclusion.
      The study showed that meaningful conversation is valuable, not that brief conversation is harmful, and in practice, the first usually depends on the second.

      E
      This is because small talk serves as a kind of testing ground.
      Exchanging comments about a shared situation allows people to judge whether the other person is friendly, to find common interests and to build the trust needed before more personal subjects can be raised.
      Very few friendships begin with a discussion of life’s meaning; most begin with a remark about something trivial.
      Skipping that stage, as some advice suggests, may simply make conversations more awkward.

      F
      Small talk also has social functions beyond friendship.
      In the workplace, informal conversation helps colleagues to cooperate, and studies of remote working have suggested that the loss of casual encounters in corridors and kitchens may make teams less creative.
      In neighbourhoods, regular greetings and brief chats help residents to recognise one another, which may increase their sense of safety.

      G
      Of course, not everyone finds small talk easy, and for some people it causes real anxiety.
      But the research suggests that the rewards are usually greater, and the risks smaller, than we fear.
      The next time someone remarks on the weather, it may be worth replying with more than a polite nod.
    `,
    groups: [
      mcq([
        [
          'What does the writer say about common attitudes to small talk?',
          ['They are based on careful research.', 'They are generally negative.', 'They differ greatly between cultures.', 'They have recently become more positive.'],
          'B',
          'A1 A2',
          '“Small talk has few admirers” and it is “widely regarded as superficial”.',
        ],
        [
          'What did the train study show?',
          ['Most commuters preferred to travel in silence.', 'Commuters who talked to strangers were often rejected.', 'People expected talking to strangers to be worse than it was.', 'Strangers were unwilling to talk on crowded trains.'],
          'C',
          'B3 B4',
          'Most predicted it would be unpleasant, but those who talked “reported the most enjoyable journeys”.',
        ],
        [
          'What is the writer’s opinion of the conclusion drawn by some commentators in paragraph D?',
          ['It is supported by the evidence.', 'It misinterprets what the study found.', 'It applies only to unhappy people.', 'It is based on too few participants.'],
          'B',
          'D4 D5',
          '“That is the wrong conclusion. The study showed that meaningful conversation is valuable, not that brief conversation is harmful.”',
        ],
        [
          'Why does the writer describe small talk as a ‘testing ground’?',
          ['It helps people decide whether to trust each other.', 'It allows people to practise speaking a language.', 'It is used by employers in job interviews.', 'It shows who is the most confident person.'],
          'A',
          'E2',
          'It allows people “to judge whether the other person is friendly… and to build the trust needed”.',
        ],
      ]),
      summary(
        'Why brief conversations matter',
        0,
        `Research suggests that people feel happier on days when they have more contact with [[acquaintances]].
        Café customers who chatted briefly with staff were in a better [[mood]] than those who were simply efficient.
        Small talk helps people find common [[interests]] and builds the trust needed for deeper conversation.
        At work, the loss of casual meetings may make teams less [[creative]], and in neighbourhoods, regular greetings may make people feel [[safer]].`,
        [
          ['C2', 'People “tend to feel happier on days when they have more of these small interactions” with weak ties — acquaintances.'],
          ['C3', 'Customers who had a friendly exchange “reported a better mood afterwards”.'],
          ['E2', 'Small talk allows people “to find common interests and to build the trust needed”.'],
          ['F2', 'The loss of casual encounters “may make teams less creative”.'],
          ['F3', 'Greetings may “increase their sense of safety”: people feel safer.'],
        ],
        {
          words: ['acquaintances', 'mood', 'interests', 'creative', 'safer', 'strangers', 'efficient', 'anxious', 'friends', 'quieter'],
        },
      ),
      ynng([
        ['Many advice columns recommend avoiding small talk.', 'Y', 'A3', 'They “regularly encourage readers to skip the pleasantries”.'],
        ['People are generally good at predicting how much they will enjoy talking to strangers.', 'N', 'B5', 'People “consistently underestimate” how much they will enjoy it.'],
        ['Deep conversations are more valuable than small talk.', 'NG', 'D1 D5', 'The writer says meaningful conversation is valuable and depends on small talk, but does not rank one above the other.'],
        ['Most friendships start with a conversation about something unimportant.', 'Y', 'E3', 'Most friendships “begin with a remark about something trivial”.'],
        ['Small talk causes anxiety for everyone.', 'N', 'G1', 'It causes anxiety “for some people”, not everyone.'],
      ]),
    ],
  }),
])
