import { passage, test, tfng } from '../build'

export default test('tfng-hedgehogs', [
  passage({
    title: 'The Hedgehog Moves to Town',
    sub: 'One of Britain’s best-loved animals is disappearing from the countryside. Gardens may be its last refuge.',
    text: `
      A
      For generations of British children, the hedgehog has been a familiar figure in picture books, and in surveys it is regularly voted the country’s favourite wild animal.
      Yet the real animal is becoming increasingly hard to find.
      Counts carried out by volunteers suggest that hedgehog numbers in the British countryside have fallen by around half since the year 2000.
      In towns and cities the decline has been smaller, and in some urban areas numbers now appear to be stable or even recovering.

      B
      The reasons for the rural decline are not fully understood, but several factors are thought to be involved.
      Modern farming has removed many of the hedgerows and rough field edges where hedgehogs once nested and fed, and the use of pesticides has reduced the number of beetles, caterpillars and other insects that make up much of their diet.
      Hedgehogs are also eaten by badgers, whose numbers have increased in many areas since they became a protected species.
      Where badgers are common, hedgehogs tend to be rare, and research suggests that they avoid areas where they can smell their larger neighbours.

      C
      Towns offer some protection from these pressures.
      Badgers are less common in built-up areas, and the patchwork of gardens, parks and railway embankments provides a variety of places to feed and shelter.
      However, urban life brings dangers of its own.
      Many hedgehogs are killed by cars, particularly in spring, when males travel long distances in search of a mate.
      Others are injured by garden machinery, poisoned by slug pellets or trapped in netting and drains.

      D
      Perhaps the greatest problem is that gardens have become increasingly difficult to move between.
      A hedgehog may travel one or two kilometres in a single night while searching for food, and it needs access to a large number of gardens to find enough to eat.
      Solid fences and walls, which have largely replaced the hedges that once divided gardens, turn each plot into an island.
      A population cut off in this way may be too small to survive for long.

      E
      In response, conservation groups have encouraged householders to create ‘hedgehog highways’ by cutting a small hole at the base of their fences.
      A gap of about thirteen centimetres square is large enough for a hedgehog to pass through but too small for most pets.
      Some new housing developments are now built with these gaps already in place, and in several towns volunteers have mapped hundreds of linked gardens.

      F
      Householders are also advised to leave part of the garden untidy, with piles of leaves or logs where hedgehogs can shelter and find insects.
      Hedgehogs spend the winter in hibernation, usually from November until March, and a pile of leaves is an ideal place for a nest.
      People who want to feed hedgehogs are encouraged to offer meaty cat or dog food and fresh water, but never milk, which hedgehogs are unable to digest properly.

      G
      Whether these efforts will be enough remains uncertain.
      Hedgehogs are difficult to count accurately, because they are active at night and spend much of their time hidden, so changes in their numbers can take years to detect.
      Nevertheless, many ecologists believe that the future of the species in Britain may depend less on the countryside than on the gardens of ordinary people.
    `,
    groups: [
      tfng([
        ['The hedgehog has been chosen as Britain’s favourite wild animal in surveys.', 'T', 'A1', 'In surveys “it is regularly voted the country’s favourite wild animal”.'],
        ['Hedgehog numbers have fallen equally in towns and in the countryside.', 'F', 'A3 A4', 'Rural numbers fell by around half, but “in towns and cities the decline has been smaller”.'],
        ['Scientists fully understand why hedgehogs are declining in rural areas.', 'F', 'B1', '“The reasons for the rural decline are not fully understood.”'],
        ['Pesticides have reduced the food available to hedgehogs.', 'T', 'B2', 'Pesticides have reduced the insects “that make up much of their diet”.'],
        ['Badgers became a protected species because their numbers were falling.', 'NG', 'B3', 'Badgers became protected, and their numbers have since increased. The reason for protecting them is never given.'],
        ['Hedgehogs appear to stay away from places where badgers live.', 'T', 'B4', 'Research suggests “they avoid areas where they can smell their larger neighbours”.'],
        ['Most hedgehogs killed on roads are young animals.', 'NG', 'C4', 'Many are killed by cars, especially males in spring, but the age of the victims is not mentioned.'],
        ['A hedgehog can find all the food it needs in one or two gardens.', 'F', 'D2', 'It “needs access to a large number of gardens to find enough to eat”.'],
        ['A thirteen-centimetre gap in a fence will let most pet dogs through.', 'F', 'E2', 'The gap is “too small for most pets”.'],
        ['Hedgehog highways are now required by law in new housing developments.', 'NG', 'E3', '“Some new housing developments” include the gaps, but no law is mentioned.'],
        ['Milk is a suitable drink for hedgehogs.', 'F', 'F3', 'Hedgehogs should “never” be given milk, “which hedgehogs are unable to digest properly”.'],
        ['It can take a long time to notice changes in hedgehog numbers.', 'T', 'G2', 'Because they are hard to count, “changes in their numbers can take years to detect”.'],
      ]),
    ],
  }),
])
