import { choose2, features, headings, mcq, passage, short, table, test, tfng, ynng } from '../build'

export default test('full-13', [
  passage({
    title: 'Frozen Water for Sale',
    sub: 'Before refrigerators, a Boston businessman built a fortune by shipping ice to the tropics.',
    text: `
      A
      In 1806, a young man from Boston named Frederic Tudor loaded a ship with ice cut from a frozen pond and sent it to the Caribbean island of Martinique.
      Many people thought the idea was absurd.
      Newspapers mocked him, and sailors were reluctant to sail on a ship whose cargo, they feared, would melt and sink it.
      The voyage was a financial failure: although much of the ice survived the journey, the island’s inhabitants had no experience of ice, no way of storing it and little idea of what to do with it.

      B
      Tudor was not easily discouraged.
      Over the following years he experimented with different ways of insulating his cargo, eventually discovering that sawdust, a waste product of the timber industry that was available almost free of charge, kept ice frozen far longer than straw or hay.
      He built ice houses in the ports he supplied, so that the ice could be stored after it arrived, and he worked to create demand, offering free ice to bar owners so that they could serve chilled drinks, which customers soon came to expect.

      C
      Harvesting ice was hard, cold work.
      Each winter, when the ice on New England’s lakes and ponds had grown thick enough, workers cleared the snow from its surface and marked it into a grid.
      Horse-drawn ploughs with metal blades then cut grooves into the ice, and the blocks were separated with saws and long poles and floated to the shore.
      An inventor working with Tudor developed improved tools that made it possible to cut blocks of a uniform size, which could be packed closely together and therefore melted more slowly.

      D
      By the 1830s, the business was highly profitable, and Tudor was known as the ‘Ice King’.
      In 1833, one of his ships carried ice on a four-month voyage to Calcutta in India, and around two-thirds of the cargo arrived intact.
      The ice was welcomed enthusiastically by the British community there, and the trade continued for decades.
      At its peak, ice from New England was shipped to destinations across the Caribbean, South America and Asia.

      E
      At home, the ice trade changed daily life.
      Ice boxes, wooden cabinets lined with metal and filled with blocks of ice, allowed families to keep food fresh for longer, and deliveries of ice became as routine as deliveries of milk.
      Butchers, brewers and fishermen used ice to preserve their products, and railway wagons cooled with ice made it possible to transport meat over long distances.

      F
      The trade, however, depended on cold winters and clean water.
      Mild winters could produce thin ice and poor harvests, and as cities grew, many lakes and rivers became polluted, raising concerns about the safety of natural ice.
      From the late nineteenth century, factories began producing ice artificially using mechanical refrigeration, which could be done anywhere and at any time of year.
      By the early twentieth century, the natural ice trade was in steep decline, and the spread of electric refrigerators in homes completed its disappearance.
    `,
    groups: [
      table(
        'The natural ice trade',
        1,
        ['Stage', 'Details'],
        [
          ['First voyage (1806)', 'ice shipped to [[Martinique]]; the trip lost money'],
          ['Insulation', 'Tudor found that [[sawdust]] worked better than straw or hay'],
          ['Creating demand', 'free ice given to bar owners so that they could serve chilled [[drinks]]'],
          ['Harvesting', 'grooves cut by [[ploughs]] pulled by horses'],
          ['Long-distance trade', 'about two-thirds of the ice survived a voyage to [[Calcutta]]'],
          ['Decline', 'ice made in [[factories]] replaced natural ice'],
        ],
        [
          ['A1', 'Tudor sent ice “to the Caribbean island of Martinique”.'],
          ['B2', 'Sawdust “kept ice frozen far longer than straw or hay”.'],
          ['B3', 'He offered free ice to bar owners “so that they could serve chilled drinks”.'],
          ['C3', '“Horse-drawn ploughs with metal blades then cut grooves into the ice.”'],
          ['D2', 'A ship carried ice to Calcutta, and “around two-thirds of the cargo arrived intact”.'],
          ['F3', '“Factories began producing ice artificially.”'],
        ],
      ),
      tfng([
        ['Sailors were worried about the safety of Tudor’s first ship.', 'T', 'A3', 'Sailors “feared” the melting cargo “would melt and sink it”.'],
        ['Most of the ice on the first voyage melted before it reached Martinique.', 'F', 'A4', '“Much of the ice survived the journey.”'],
        ['Sawdust was expensive in the early nineteenth century.', 'F', 'B2', 'It was “available almost free of charge”.'],
        ['Blocks of the same size lasted longer because they could be packed tightly.', 'T', 'C4', 'Uniform blocks “could be packed closely together and therefore melted more slowly”.'],
        ['Tudor travelled to India with his ice in 1833.', 'NG', 'D2', 'One of his ships went to Calcutta; whether he travelled with it is not stated.'],
        ['Ice made it possible to transport meat by rail over long distances.', 'T', 'E3', 'Railway wagons cooled with ice “made it possible to transport meat over long distances”.'],
        ['Pollution made people question whether natural ice was safe.', 'T', 'F2', 'Polluted lakes and rivers raised “concerns about the safety of natural ice”.'],
      ]),
    ],
  }),

  passage({
    title: 'Banking Seeds for the Future',
    sub: 'Inside a mountain near the North Pole, millions of seeds are stored as insurance against disaster.',
    text: `
      A
      Humanity depends on a surprisingly small number of plants for most of its food.
      Yet within each crop there is enormous variety: thousands of kinds of wheat, rice and beans, each adapted to particular soils, climates and diseases.
      Much of this variety has been lost over the past century, as farmers around the world have switched to a limited number of high-yielding varieties.
      Scientists fear that the lost varieties may have contained exactly the characteristics, such as resistance to drought or disease, that future farmers will need as the climate changes.

      B
      Seed banks are intended to prevent further losses.
      There are more than a thousand of them around the world, ranging from large national collections to small community banks in which farmers store and exchange local varieties.
      Most keep seeds in cold, dry conditions, which slow the processes that cause them to age.
      Under these conditions, the seeds of many crops can remain alive for decades, and some for centuries.

      C
      The most famous is the Svalbard Global Seed Vault, which opened in 2008 on a remote Norwegian island in the Arctic.
      Built deep inside a mountain, it is designed to act as a backup for the world’s other seed banks, which send duplicate samples to be stored there.
      The vault is kept at minus eighteen degrees Celsius, and even if its cooling equipment failed, the surrounding permafrost would keep the seeds frozen for many years.
      The depositing institutions remain the owners of their samples, which can be returned to them if their own collections are lost.

      D
      That is exactly what happened in 2015.
      A major research centre for dry-land agriculture, based in Syria, had been forced to leave its headquarters because of the war there.
      It asked for some of its duplicate samples to be returned from Svalbard so that it could rebuild its collection at new sites in Lebanon and Morocco.
      It was the first withdrawal from the vault, and it demonstrated the value of keeping copies in a safe location.

      E
      Not all seeds can be stored in this way.
      The seeds of many tropical trees, as well as crops such as cocoa and avocado, die if they are dried, and cannot therefore be kept in conventional seed banks.
      For these species, scientists are developing other methods, including storing small pieces of plant tissue in liquid nitrogen at extremely low temperatures, a technique known as cryopreservation.
      These methods are expensive and technically demanding, and only a small proportion of such species have been preserved so far.

      F
      Seed banks also face criticism.
      Some researchers point out that seeds stored in a freezer do not continue to adapt to changing conditions as they would in farmers’ fields, and argue that conserving crop varieties in active use on farms is just as important.
      Community seed banks, which are run by farmers themselves, are designed to combine both approaches, keeping seeds in storage while ensuring that they are regularly planted and exchanged.
    `,
    groups: [
      headings(
        [
          'A disaster that proved the system’s worth',
          'Plants that need a different approach',
          'Why the loss of crop variety matters',
          'The high cost of national seed banks',
          'A secure back-up store in the Arctic',
          'How seeds are kept alive in storage',
        ],
        [
          ['A', 'iii', 'A3 A4', 'Varieties have been lost, and they may have contained characteristics future farmers will need.'],
          ['B', 'vi', 'B3 B4', 'Cold, dry conditions “slow the processes that cause them to age”, so seeds stay alive for decades.'],
          ['C', 'v', 'C2', 'The Svalbard vault “is designed to act as a backup for the world’s other seed banks”.'],
          ['D', 'i', 'D4', 'The first withdrawal “demonstrated the value of keeping copies in a safe location”.'],
          ['E', 'ii', 'E1 E3', 'Some seeds die if dried, so scientists are developing other methods.'],
        ],
      ),
      features(
        ['method', 'methods'],
        ['the Svalbard vault', 'community seed banks', 'cryopreservation'],
        [
          ['It allows seeds to continue adapting to local conditions.', 'B', 'F3', 'Community banks ensure seeds “are regularly planted and exchanged”.'],
          ['It stores copies that remain the property of other institutions.', 'A', 'C4', '“The depositing institutions remain the owners of their samples.”'],
          ['It has so far been used for only a few of the species that need it.', 'C', 'E4', '“Only a small proportion of such species have been preserved so far.”'],
          ['It would stay cold even if its machinery stopped working.', 'A', 'C3', 'The permafrost “would keep the seeds frozen for many years”.'],
        ],
      ),
      short(
        2,
        [
          ['What kind of varieties have most farmers switched to?', 'high-yielding varieties|high-yielding', 'A3', 'Farmers “switched to a limited number of high-yielding varieties”. A hyphenated word counts as one.'],
          ['What is the temperature inside the Svalbard vault?', 'minus eighteen|-18|minus 18|-18 degrees', 'C3', 'It “is kept at minus eighteen degrees Celsius”.'],
          ['Apart from Morocco, in which country did the Syrian centre set up a new site?', 'Lebanon', 'D3', 'New sites were set up “in Lebanon and Morocco”.'],
          ['What substance is used to store plant tissue at very low temperatures?', 'liquid nitrogen', 'E3', 'Tissue is stored “in liquid nitrogen”.'],
        ],
        true,
      ),
    ],
  }),

  passage({
    title: 'Why Cities Grow Taller',
    sub: 'Skyscrapers are symbols of modern cities. But are they really the best way to fit more people into less space?',
    text: `
      A
      The skyscraper was born in American cities in the late nineteenth century, and its origins were as much economic as architectural.
      As businesses crowded into city centres, land became extremely expensive, and building upwards allowed owners to make the most of a small and costly plot.
      Two inventions made this possible.
      Steel frames could carry the weight of many floors without requiring enormously thick walls at the base, and the passenger lift, made safe by a braking device that stopped the car from falling if a cable broke, meant that people no longer had to climb dozens of flights of stairs.

      B
      Today, tall buildings are often presented as the solution to the problems of growing cities.
      By housing more people on less land, the argument goes, they reduce the spread of cities into the countryside, shorten journeys to work and make public transport more efficient.
      Many economists also emphasise the benefits of concentration: when large numbers of businesses and workers are close together, ideas spread more quickly and companies find it easier to recruit skilled staff.

      C
      Yet the link between height and density is weaker than it appears.
      Tall towers usually need open space around them for light and access, and they often contain fewer homes than expected because of the space taken up by lifts, stairs and service equipment.
      Some of the most densely populated neighbourhoods in Europe consist mainly of buildings of five to eight storeys, arranged along streets and around courtyards.
      Paris, for example, houses more people per square kilometre than many cities with far more skyscrapers.

      D
      Height also brings costs.
      The taller a building becomes, the more must be spent on its structure, its foundations and the lifts needed to move people efficiently, so that the cost of each square metre of floor space rises sharply above a certain height.
      Very tall residential towers are also expensive to maintain, and the flats in them are often bought by wealthy investors rather than by people who need homes.

      E
      The environmental record of tall buildings is mixed.
      They may reduce the need for travel, but constructing them requires large quantities of steel and concrete, whose production releases a great deal of carbon dioxide, and glass-covered towers can use large amounts of energy for cooling.
      Some engineers are now experimenting with tall buildings made largely of timber, which store carbon rather than releasing it, although these are still limited in height.

      F
      I do not believe the answer is to reject tall buildings altogether.
      In locations with excellent public transport, and for offices whose occupants benefit from being close together, they can make good sense.
      But I am sceptical of the idea that height is a measure of a city’s success.
      Too many towers, I suspect, have been built as symbols of prestige rather than as practical answers to a city’s needs.
      Well-designed streets of medium-rise buildings may often achieve the same density at lower cost, and create neighbourhoods in which people actually prefer to live.
    `,
    groups: [
      mcq([
        [
          'According to paragraph A, why were the first skyscrapers built?',
          ['to show off the skills of architects', 'because land in city centres was very expensive', 'because steel had become cheap', 'to provide housing for workers'],
          'B',
          'A2',
          '“Land became extremely expensive, and building upwards allowed owners to make the most of a small and costly plot.”',
        ],
        [
          'What made lifts safe for passengers?',
          ['a stronger cable', 'a device that stopped the lift falling', 'a lighter steel frame', 'a slower speed of travel'],
          'B',
          'A4',
          'Lifts were made safe “by a braking device that stopped the car from falling if a cable broke”.',
        ],
        [
          'Why does the writer mention Paris?',
          ['to show that density does not require skyscrapers', 'to give an example of a city with too many towers', 'to show that European cities are less crowded', 'to compare its transport with that of other cities'],
          'A',
          'C3 C4',
          'Paris houses more people per square kilometre than many cities with more skyscrapers.',
        ],
        [
          'What does the writer say about the cost of tall buildings?',
          ['It falls as buildings get taller.', 'It rises steeply beyond a certain height.', 'It is mainly due to the price of land.', 'It is lower for residential towers.'],
          'B',
          'D2',
          'The cost of each square metre “rises sharply above a certain height”.',
        ],
      ]),
      choose2(
        'Which TWO reasons why towers may contain fewer homes than expected are mentioned?',
        [
          'They need open space around them.',
          'Many flats are left empty.',
          'Lifts and stairs take up space.',
          'Building regulations limit their height.',
          'Families prefer larger flats.',
        ],
        ['A', 'C'],
        [
          ['C2', 'Towers “usually need open space around them for light and access”.'],
          ['C2', 'Space is “taken up by lifts, stairs and service equipment”.'],
        ],
      ),
      choose2(
        'Which TWO environmental problems of tall buildings are mentioned in paragraph E?',
        [
          'the carbon released in producing building materials',
          'the destruction of countryside',
          'the energy used to cool glass towers',
          'the noise caused by construction',
          'the shadows they cast on nearby streets',
        ],
        ['A', 'C'],
        [
          ['E2', 'Steel and concrete production “releases a great deal of carbon dioxide”.'],
          ['E2', '“Glass-covered towers can use large amounts of energy for cooling.”'],
        ],
      ),
      ynng([
        ['The height of a city’s buildings is a good measure of its success.', 'N', 'F3', 'The writer is “sceptical of the idea that height is a measure of a city’s success”.'],
        ['Concentrating businesses in one area can help companies to find skilled workers.', 'Y', 'B3', 'Companies “find it easier to recruit skilled staff”. The writer reports this without disputing it.'],
        ['Many flats in very tall towers are bought as investments.', 'Y', 'D3', 'Flats are “often bought by wealthy investors rather than by people who need homes”.'],
        ['Timber towers can now be built as tall as steel ones.', 'N', 'E3', 'Timber buildings “are still limited in height”.'],
        ['Tall buildings are suitable for offices in well-connected locations.', 'Y', 'F2', '“In locations with excellent public transport, and for offices… they can make good sense.”'],
        ['Some tall towers were built mainly to impress people.', 'Y', 'F4', 'Towers “have been built as symbols of prestige rather than as practical answers”.'],
      ]),
    ],
  }),
])
