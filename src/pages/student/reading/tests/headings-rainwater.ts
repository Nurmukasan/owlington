import { headings, passage, test } from '../build'

export default test('headings-rainwater', [
  passage({
    title: 'Catching the Rain',
    sub: 'One of the oldest water technologies on Earth is enjoying a quiet revival.',
    text: `
      A
      For most of human history, people living in dry regions have had no choice but to collect rain where it falls.
      Archaeologists have found stone channels and underground storage tanks thousands of years old in the Middle East, while in parts of India communities built elaborate stepped wells and reservoirs to capture the monsoon rains.
      Many of these systems were maintained by the communities themselves, which shared both the work and the water according to long-established customs.

      B
      In the twentieth century, much of this knowledge fell out of use.
      Piped water supplies, fed by large dams and deep wells, reached growing numbers of towns and villages, and traditional tanks were often abandoned or filled in.
      In some places this brought real improvements in health and convenience; in others, the new supplies proved unreliable, while the old systems that might have filled the gap had already been lost.

      C
      Interest in rainwater harvesting has grown again in recent decades, and for several reasons.
      In many regions, underground water is being pumped out faster than rain can replace it, and the water table has fallen so far that wells must be dug ever deeper.
      Changes in climate are also making rainfall less predictable, with longer dry periods broken by short, intense storms.
      Capturing water during these storms, rather than letting it run off into rivers and the sea, makes obvious sense.

      D
      The technology itself is remarkably simple.
      A typical household system consists of a roof, gutters to carry the water, a filter to remove leaves and dirt, and a tank in which the water is stored.
      The first rain after a dry spell, which washes dust and bird droppings off the roof, is usually directed away from the tank by a simple device.
      With a little maintenance, such a system can provide water for washing, cleaning and watering gardens for much of the year.

      E
      Whether rainwater is safe to drink is another matter.
      Although rain itself is generally clean, it can pick up bacteria and chemicals from roofs, gutters and tanks.
      Health authorities in most countries recommend that harvested water should be boiled, filtered or otherwise treated before it is used for drinking, and that tanks should be cleaned regularly.

      F
      Rainwater harvesting is not only for rural areas.
      In cities, where roads and buildings cover much of the ground, heavy rain can overwhelm drains and cause flooding within minutes.
      Collecting water from roofs and storing it temporarily reduces the amount that reaches the drains during a storm.
      Several cities now require large new buildings to include rainwater tanks for this reason, and some offer discounts on water bills to households that install them.

      G
      Critics point out that the benefits can be exaggerated.
      In regions with a long dry season, a household tank may be empty for months, precisely when water is most needed, and building large enough tanks can be expensive.
      Rainwater harvesting is therefore best seen not as a replacement for public water supplies but as a way of reducing the pressure on them.
    `,
    groups: [
      headings(
        [
          'Ancient systems managed by local people',
          'Making harvested water fit to drink',
          'The cost of building public water supplies',
          'A useful supplement rather than a complete solution',
          'Why the old methods were set aside',
          'Protecting towns from sudden floods',
          'How a basic system works',
          'The pressures that have revived an old idea',
          'Rain as a source of pollution',
        ],
        [
          ['A', 'i', 'A2 A3', 'Paragraph A describes ancient tanks and reservoirs that “were maintained by the communities themselves”.'],
          ['B', 'v', 'B1 B2', 'In the twentieth century piped supplies arrived and “traditional tanks were often abandoned”: why the old methods were set aside.'],
          ['C', 'viii', 'C1 C2 C3', 'C lists the reasons interest “has grown again”: falling water tables and less predictable rain.'],
          ['D', 'vii', 'D1 D2', '“The technology itself is remarkably simple”, followed by the parts of a household system.'],
          ['E', 'ii', 'E3', 'Harvested water should be “boiled, filtered or otherwise treated before it is used for drinking”. Heading ix is a trap: rain “itself is generally clean”.'],
          ['F', 'vi', 'F2 F3', 'Storing roof water “reduces the amount that reaches the drains during a storm”, preventing sudden flooding in cities.'],
          ['G', 'iv', 'G3', 'Rainwater harvesting is “best seen not as a replacement for public water supplies but as a way of reducing the pressure on them”.'],
        ],
      ),
    ],
  }),
])
