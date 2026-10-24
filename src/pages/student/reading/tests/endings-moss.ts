import { endings, passage, test } from '../build'

export default test('endings-moss', [
  passage({
    title: 'The Moss Detectives',
    sub: 'Some of the cheapest and most sensitive pollution monitors in the world grow on walls and tree trunks.',
    text: `
      A
      Measuring air pollution accurately is expensive.
      A single professional monitoring station can cost tens of thousands of pounds to install and a considerable sum each year to maintain, so even wealthy cities can afford only a handful of them.
      As a result, large areas, including many neighbourhoods close to factories and busy roads, are never measured at all.
      In recent decades, scientists have increasingly turned to an unlikely partner to fill these gaps: moss.

      B
      Mosses are unusually suited to the task because of the way they feed.
      Unlike most plants, they have no true roots, and they take in water and nutrients directly through the surface of their leaves.
      Along with rainwater and dust, they absorb whatever is carried in the air, including heavy metals such as lead, cadmium and mercury.
      Because mosses have no way of getting rid of these metals, the substances build up in their tissue over time, providing a record of the pollution the plant has been exposed to.

      C
      Since 1990, a Europe-wide survey has collected moss samples roughly every five years from thousands of sites, many of them far from any monitoring station.
      The samples are dried, ground into powder and analysed in laboratories to measure their metal content.
      The results have revealed a dramatic fall in lead pollution across the continent since leaded petrol was phased out, a trend that would have been difficult to confirm so widely using conventional instruments alone.

      D
      Moss can also uncover problems that nobody suspected.
      In one American city, researchers collected moss from trees in hundreds of locations and mapped the levels of metals it contained.
      Two small areas stood out with unusually high concentrations of cadmium, and both turned out to lie close to factories producing coloured glass.
      Official monitors had not detected the problem because none of them was located nearby, and the discovery led to new restrictions on the factories’ emissions.

      E
      Where natural moss is scarce, as in many city centres, scientists use moss bags instead.
      Moss collected from a clean area is washed, dried and placed in small nylon mesh bags, which are then hung from lamp posts or buildings for several weeks.
      Because the moss starts with almost no pollutants, everything it contains when it is collected again must have been absorbed during that period.
      This allows researchers to compare different streets or seasons using identical material.

      F
      The method has limitations, however.
      Different species of moss absorb metals at different rates, so samples from different places can be compared reliably only if the same species is used.
      The amount absorbed also depends on the weather: a moss that has been soaked by heavy rain may have taken in more pollution from the rain itself than from the dry air.
      Most importantly, moss shows how much of a metal has been deposited over time, not how much is present in the air at a given moment, which is the figure that health regulations usually refer to.

      G
      For these reasons, few scientists see moss as a replacement for conventional monitoring.
      Instead, they regard it as an early warning system: an inexpensive way of surveying large areas quickly and pointing out the places where expensive instruments should be installed.
      In a world where pollution is often measured only where it is easiest to measure, the humble moss may help to show where it really is.
    `,
    groups: [
      endings(
        [
          'because they have no means of removing them.',
          'because it lacks true roots.',
          'because no monitoring stations were near them.',
          'because leaded petrol was no longer used.',
          'because it is cheaper than laboratory analysis.',
          'because the moss already contained high levels of metal.',
          'because the moss was too wet to be analysed.',
        ],
        [
          ['Moss takes in nutrients through its leaves', 'B', 'B2', 'Mosses “have no true roots, and they take in water and nutrients directly through the surface of their leaves”.'],
          ['Heavy metals gradually build up in moss', 'A', 'B4', '“Because mosses have no way of getting rid of these metals, the substances build up in their tissue.”'],
          ['Lead levels across Europe have fallen sharply', 'D', 'C3', 'The surveys revealed a fall in lead pollution “since leaded petrol was phased out”.'],
          ['High cadmium levels near two glass factories had not been noticed before', 'C', 'D4', '“Official monitors had not detected the problem because none of them was located nearby.”'],
        ],
      ),
      endings(
        [
          'washed and dried before it is put in the bags.',
          'taken from the same species in every location.',
          'used to replace professional monitoring stations.',
          'treated as a guide to where better equipment is needed.',
          'compared with the pollution recorded in rain.',
          'left in the bags for at least a year.',
          'collected only in the centre of large cities.',
        ],
        [
          ['Before being placed in city streets, moss from a clean area is', 'A', 'E2', 'Moss from a clean area “is washed, dried and placed in small nylon mesh bags”.'],
          ['To compare samples fairly, moss must be', 'B', 'F2', 'Samples can be compared reliably “only if the same species is used”.'],
          ['Most scientists believe moss should not be', 'C', 'G1', '“Few scientists see moss as a replacement for conventional monitoring.” F is wrong: bags stay up for “several weeks”, not a year.'],
          ['According to the writer, moss is best', 'D', 'G2', 'Moss is “an early warning system… pointing out the places where expensive instruments should be installed”.'],
        ],
      ),
    ],
  }),
])
