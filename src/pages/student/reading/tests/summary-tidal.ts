import { passage, summary, test } from '../build'

export default test('summary-tidal', [
  passage({
    title: 'Power from the Tides',
    sub: 'Twice a day, every day, the sea rises and falls. Why has it proved so hard to turn that motion into electricity?',
    text: `
      A
      Of all the renewable sources of energy, the tides are the most reliable.
      Wind and sunshine come and go with the weather, but the rise and fall of the sea is driven by the gravitational pull of the Moon and the Sun, and can be predicted many years in advance.
      For electricity networks, which must match supply to demand at every moment, this predictability is extremely valuable.
      Yet tidal power still produces only a tiny fraction of the world’s electricity.

      B
      The first large tidal power station opened in 1966 on the estuary of the Rance river in Brittany, in the north-west of France.
      It uses a barrage, a dam built across the mouth of the estuary, with turbines set into it.
      As the tide comes in and goes out, water flows through the turbines, generating electricity.
      The Rance station has operated successfully for more than half a century, and for many years it was the largest of its kind in the world, until a slightly larger plant opened in South Korea in 2011.

      C
      Barrages, however, have serious drawbacks.
      They are enormously expensive to build, and they change the environment of the estuary behind them.
      By holding back water, a barrage reduces the area of mudflats exposed at low tide, which are important feeding grounds for wading birds, and it can trap sediment and pollution.
      Proposals for a barrage across the estuary of the Severn, between England and Wales, have been discussed for decades and repeatedly rejected, largely because of their cost and their likely impact on wildlife.

      D
      Engineers have therefore turned to a different approach, known as tidal stream power.
      Instead of blocking an estuary, tidal stream devices are placed in channels where tidal currents flow especially fast, often between islands or around headlands.
      Most look rather like underwater wind turbines, with blades that are turned by the moving water.
      Because water is around eight hundred times denser than air, a tidal turbine can be much smaller than a wind turbine of similar power.

      E
      Several projects have demonstrated that the technology works.
      Off the northern coast of Scotland, for example, an array of turbines on the seabed has been feeding electricity into the national grid since 2016.
      However, the sea is a harsh place for machinery.
      Salt water corrodes metal, marine organisms attach themselves to every surface, and storms can damage equipment that is difficult and costly to reach.
      As a result, electricity from tidal stream projects remains considerably more expensive than electricity from wind or solar power.

      F
      Supporters argue that costs will fall as more devices are built, as happened with offshore wind.
      They also point out that the best sites are limited but extremely powerful, and that tidal energy could provide a steady contribution to supply at times when wind and sunshine are scarce.
      Sceptics doubt that the industry will ever grow large enough for prices to fall significantly, and argue that public money would be better spent on cheaper technologies.
      For now, the tides remain a promising but largely untapped resource.
    `,
    groups: [
      summary(
        'Tidal barrages',
        0,
        `The main advantage of tidal energy is that the tides are [[predictable]]. The first large tidal power station, in France, uses a [[dam]] with turbines built into it.
        Such schemes are very [[expensive]], and they can harm wildlife by reducing the area of [[mudflats]] where birds feed.
        A plan to build one in the Severn estuary has been [[rejected]] several times.`,
        [
          ['A2', 'The tides “can be predicted many years in advance”.'],
          ['B2', 'A barrage is “a dam built across the mouth of the estuary, with turbines set into it”.'],
          ['C2', 'Barrages “are enormously expensive to build”.'],
          ['C3', 'A barrage “reduces the area of mudflats exposed at low tide, which are important feeding grounds for wading birds”.'],
          ['C4', 'Proposals for the Severn have been “repeatedly rejected”.'],
        ],
        {
          words: [
            'predictable',
            'dam',
            'expensive',
            'mudflats',
            'rejected',
            'renewable',
            'channel',
            'cheap',
            'islands',
            'approved',
          ],
        },
      ),
      summary(
        'Tidal stream power',
        0,
        `Tidal stream turbines are placed in [[fast]] currents and resemble wind turbines. They can be smaller than wind turbines because water is far [[denser]] than air.
        In the sea, however, [[salt]] water damages metal and equipment can be hard to reach. Supporters believe that costs will fall, while [[sceptics]] think the money should go to cheaper technologies.`,
        [
          ['D2', 'Devices are placed “in channels where tidal currents flow especially fast”.'],
          ['D4', '“Water is around eight hundred times denser than air.”'],
          ['E4', '“Salt water corrodes metal.”'],
          ['F3', '“Sceptics… argue that public money would be better spent on cheaper technologies.”'],
        ],
        {
          words: ['fast', 'denser', 'salt', 'sceptics', 'shallow', 'lighter', 'engineers', 'warm'],
        },
      ),
    ],
  }),
])
