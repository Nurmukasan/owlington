import { passage, sentences, test } from '../build'

export default test('sentences-umbrella', [
  passage({
    title: 'A Short History of the Umbrella',
    sub: 'From royal sunshade to lost-property favourite: the long journey of an everyday object.',
    text: `
      A
      Few objects are as familiar, or as frequently lost, as the umbrella.
      Yet for most of its history it had little to do with rain.
      In ancient Egypt, Assyria and India, large shades held over the heads of kings and nobles protected them from the sun, and also served as a sign of rank: only the most important people were entitled to walk beneath one.
      The English word ‘umbrella’ reflects this origin, since it comes from the Latin word for shade.

      B
      The first umbrellas designed to keep off rain are usually credited to China, where, according to tradition, craftsmen coated paper shades with oil or wax to make them waterproof more than two thousand years ago.
      Chinese umbrellas, made from bamboo and paper, could be folded, and they spread across East Asia, where they remain popular today as decorative objects.

      C
      In Europe, the umbrella was long regarded as an item for women.
      Ladies carried small parasols to protect their complexions from the sun, but a man seen holding one was likely to be mocked.
      Men were expected to protect themselves from the rain with hats and heavy coats, or to travel by carriage if they could afford it.

      D
      This attitude began to change in eighteenth-century London, largely thanks to a merchant and traveller named Jonas Hanway, who had seen umbrellas used in Persia.
      For around thirty years, Hanway carried an umbrella through the streets of London in all weathers, ignoring the jeers of passers-by.
      The drivers of hired coaches were particularly hostile, since every gentleman who stayed dry under an umbrella was a customer who did not need a coach.
      By the time Hanway died in 1786, however, umbrellas had become acceptable for men, and for many years they were known in England simply as ‘hanways’.

      E
      Early European umbrellas were heavy and awkward.
      Their frames were made of wood or whalebone, and their covers of oiled silk or canvas, so that a large umbrella could weigh several kilograms.
      The decisive improvement came in 1852, when an English manufacturer, Samuel Fox, introduced a frame with ribs made of steel.
      Fox had large stocks of steel left over from making corsets, and his new design was far lighter and stronger than anything before it.
      The basic form of the modern umbrella has changed surprisingly little since then.

      F
      The twentieth century brought the folding umbrella, which could be carried in a bag or pocket.
      A version patented in Germany in the late 1920s became widely popular, and later designs added automatic opening and frames that bend in the wind instead of turning inside out.
      Today, hundreds of millions of umbrellas are produced each year, most of them in China.

      G
      Their convenience, unfortunately, is matched by their disposability.
      Cheap umbrellas are difficult to repair because they combine metal, plastic and fabric, and most are thrown away after a short life.
      Umbrellas are also among the items most often left on public transport, and the lost-property offices of large cities collect thousands of them every year.
    `,
    groups: [
      sentences(2, [
        ['In ancient times, being allowed to use a sunshade was a sign of [[rank]].', 'A3', 'Shades “served as a sign of rank: only the most important people were entitled to walk beneath one”.'],
        ['The word ‘umbrella’ comes from a Latin word meaning [[shade]].', 'A4', 'It “comes from the Latin word for shade”.'],
        ['Chinese craftsmen made paper shades waterproof by using oil or [[wax]].', 'B1', 'They “coated paper shades with oil or wax”.'],
        ['Traditional Chinese umbrellas are still used today as [[decorative objects]].', 'B2', 'They “remain popular today as decorative objects”.'],
        ['In Europe, women used parasols to protect their [[complexions]].', 'C2', 'Ladies carried parasols “to protect their complexions from the sun”.'],
        ['Jonas Hanway first saw umbrellas being used in [[Persia]].', 'D1', 'Hanway “had seen umbrellas used in Persia”.'],
        ['To coach drivers, every gentleman with an umbrella was a lost [[customer]].', 'D3', 'Every dry gentleman “was a customer who did not need a coach”.'],
        ['Before the 1850s, umbrella frames were made from wood or [[whalebone]].', 'E2', '“Their frames were made of wood or whalebone.”'],
        ['Samuel Fox had spare steel left over from producing [[corsets]].', 'E4', 'Fox had “large stocks of steel left over from making corsets”.'],
        ['Cheap umbrellas are hard to [[repair]] because they contain several materials.', 'G2', 'They “are difficult to repair because they combine metal, plastic and fabric”.'],
      ]),
    ],
  }),
])
