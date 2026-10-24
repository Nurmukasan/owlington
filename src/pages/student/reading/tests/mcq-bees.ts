import { choose2, mcq, passage, test } from '../build'

export default test('mcq-bees', [
  passage({
    title: 'The Dance Language of Honeybees',
    sub: 'How a forager tells her sisters where to find food, and why scientists argued about it for decades.',
    text: `
      A
      When a honeybee returns to the hive after finding a rich patch of flowers, she does something remarkable.
      On the vertical surface of the honeycomb, in complete darkness, she begins to run in a straight line while shaking her body from side to side, then loops back to her starting point and repeats the run, sometimes dozens of times.
      Other bees crowd around her, following her movements closely, and soon some of them leave the hive and fly directly to the flowers she has found.
      This behaviour, known as the waggle dance, is one of the very few examples in the animal world of a creature communicating the location of something it can no longer see.

      B
      The meaning of the dance was worked out by the Austrian biologist Karl von Frisch, who spent much of the first half of the twentieth century studying bees.
      By placing dishes of sugar water at measured distances and directions from his hives, and watching the dances of the bees that found them, he discovered that the dance contains two separate pieces of information.
      The direction of the straight run, measured against the vertical, matches the angle between the food and the sun as seen from the hive.
      The length of the run, meanwhile, indicates how far away the food is: the longer the waggle, the greater the distance.
      Von Frisch was awarded a Nobel Prize for this work in 1973.

      C
      The system is more sophisticated than it first appears.
      Because the sun moves across the sky during the day, a bee that dances for a long time gradually changes the angle of her runs, keeping the information accurate even though she has not been outside to check.
      Bees also seem to measure distance not by time or effort but by the amount of visual movement they experience during the flight, a fact that was revealed when bees were trained to fly through narrow tunnels lined with patterns and then danced as though the food had been much further away than it really was.

      D
      Not everyone was convinced.
      In the 1960s, a group of American researchers argued that the dance might be little more than a ritual, and that recruits actually found food by following the scent carried on the dancer’s body.
      Their experiments showed that bees could indeed locate food using odour alone, and for several years the debate became bitter.
      Later studies, which carefully separated scent from dance information, persuaded most scientists that the dance does carry real meaning, but the critics had raised an important point: recruits use many sources of information, and the dance is only one of them.

      E
      The question was finally settled in 2005, when scientists attached tiny radar transponders to bees that had just followed a dance.
      The radar showed that the recruits flew straight towards the area the dance had indicated, even when the researchers had moved them to a different starting point before release.
      However, the tracks also showed that the bees often searched for some time when they reached the right area, apparently relying on scent and sight to find the exact flowers.

      F
      Surprisingly, the dance does not always seem to help the colony.
      In experiments where hives were arranged so that the dances became disoriented, colonies collected food almost as successfully as normal ones at certain times of year.
      The advantage of the dance appears to be greatest when good flowers are scarce and scattered across the landscape, as they often are in the tropical forests where honeybees are thought to have first evolved.
      In landscapes where flowers are plentiful, bees that simply search on their own may do nearly as well.

      G
      The waggle dance is not used only for food.
      When a colony becomes too large and splits, several hundred scout bees search for a new home, and each one dances to advertise the site she has found.
      Scouts that have found better sites dance for longer and with more enthusiasm, gradually attracting more supporters, until one site wins and the whole swarm flies off together.
      Researchers studying these debates have compared them to a form of democracy, in which the group reaches a decision that is often better than any single bee could make.
    `,
    groups: [
      mcq([
        [
          'What makes the waggle dance unusual in the animal world, according to paragraph A?',
          [
            'It is performed in complete darkness.',
            'It describes a place the animal can no longer see.',
            'It is repeated many times without stopping.',
            'It is followed by large numbers of other animals.',
          ],
          'B',
          'A4',
          'The dance is “one of the very few examples… of a creature communicating the location of something it can no longer see”. Darkness and repetition are true details, but they are not what the writer calls unusual.',
        ],
        [
          'Von Frisch discovered that the angle of the waggle run shows',
          [
            'the height of the flowers above the ground.',
            'the position of the hive in relation to the sun.',
            'the direction of the food in relation to the sun.',
            'the number of bees needed to collect the food.',
          ],
          'C',
          'B3',
          'The run’s angle “matches the angle between the food and the sun as seen from the hive”. Option B reverses the relationship.',
        ],
        [
          'What did the experiments with patterned tunnels show?',
          [
            'Bees judge distance by how much movement they see while flying.',
            'Bees fly more slowly when the route is narrow.',
            'Bees lose their sense of direction in enclosed spaces.',
            'Bees dance for longer when they are tired.',
          ],
          'A',
          'C3',
          'Bees in patterned tunnels danced as if the food were further away, revealing that they measure distance “by the amount of visual movement they experience during the flight”.',
        ],
        [
          'What does the writer say about the American researchers of the 1960s?',
          [
            'Their experiments were badly designed.',
            'They proved that bees cannot follow the dance.',
            'They identified something that later research accepted.',
            'They were the first to suggest that bees use scent.',
          ],
          'C',
          'D4',
          'Most scientists were later persuaded the dance has meaning, “but the critics had raised an important point”: recruits use many sources of information. Nothing says they proved bees cannot follow the dance or were first to propose scent.',
        ],
        [
          'What did the radar study of 2005 reveal?',
          [
            'Recruits ignore the dance once they leave the hive.',
            'Recruits fly towards the place indicated by the dance.',
            'Recruits find the exact flowers without searching.',
            'Recruits return to the hive if they are moved.',
          ],
          'B',
          'E2',
          'The recruits “flew straight towards the area the dance had indicated”. They did have to search on arrival (E3), so C is wrong.',
        ],
        [
          'The writer suggests that the waggle dance is most useful when',
          [
            'a colony is very large.',
            'flowers are found close to the hive.',
            'the weather makes flying difficult.',
            'good sources of food are hard to find.',
          ],
          'D',
          'F3',
          'The advantage “appears to be greatest when good flowers are scarce and scattered across the landscape”: scarce and scattered = hard to find.',
        ],
      ]),
      choose2(
        'Which TWO of the following statements about scout bees are true, according to the passage?',
        [
          'They search for a new home when a colony divides.',
          'They are older than the bees that collect food.',
          'They dance more energetically for better sites.',
          'They always agree on a site within a few hours.',
          'They lead the swarm to the site they found first.',
        ],
        ['A', 'C'],
        [
          ['G2', 'When a colony “becomes too large and splits, several hundred scout bees search for a new home”.'],
          ['G3', '“Scouts that have found better sites dance for longer and with more enthusiasm.” The age of scouts and the speed of the decision are never mentioned.'],
        ],
      ),
      choose2(
        'Which TWO facts about the sun does the passage mention?',
        [
          'Bees use it to judge the time of day.',
          'Bees cannot see it on cloudy days.',
          'Its position is used as a reference point in the dance.',
          'Bees adjust their dance as it moves across the sky.',
          'Its heat affects how far bees are able to fly.',
        ],
        ['C', 'D'],
        [
          ['B3', 'The run’s direction shows “the angle between the food and the sun”: the sun is the reference point.'],
          ['C2', 'A bee that dances for a long time “gradually changes the angle of her runs” as the sun moves. Cloudy days and heat are not mentioned.'],
        ],
      ),
    ],
  }),
])
