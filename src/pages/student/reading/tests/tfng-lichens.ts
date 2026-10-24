import { passage, test, tfng } from '../build'

export default test('tfng-lichens', [
  passage({
    title: 'The Secret Life of Lichens',
    sub: 'They cover rocks, roofs and tree trunks on every continent, yet most people have never looked at one closely.',
    text: `
      A
      Lichens are among the most widespread living things on Earth.
      They grow on bare rock in Antarctica, on the bark of tropical trees, on gravestones, garden walls and even on the backs of some insects.
      Around 20,000 species have so far been described, and specialists believe many more remain to be discovered.
      Despite this, lichens are frequently mistaken for mosses or simply ignored, partly because most of them grow extremely slowly and change little from one year to the next.

      B
      A lichen is not a single organism but a partnership.
      Its body is formed by a fungus, which provides structure and protection, while tiny green algae or bacteria living inside it use sunlight to produce food through photosynthesis.
      Neither partner could survive alone in most of the places where lichens are found.
      For more than a century, scientists believed that every lichen consisted of exactly two partners, but in 2016 researchers reported that many common lichens also contain a second type of fungus, a yeast, living in their outer layer.
      The discovery surprised biologists and showed how much remains unknown about these familiar organisms.

      C
      The partnership allows lichens to survive conditions that would kill most other forms of life.
      Many species can lose almost all of their water and remain dormant for months, becoming active again within minutes of being wetted by rain or dew.
      In one experiment, lichens were carried into orbit and exposed to the vacuum and radiation of space for more than two weeks; once they were returned to Earth, most of them recovered and continued to grow.

      D
      The slow and steady growth of lichens has made them useful to scientists in an unexpected way.
      Some species expand at an almost constant rate, in certain cases by less than a millimetre a year.
      By measuring the largest lichens on a surface, such as a rock left behind by a retreating glacier, geologists can estimate how long the surface has been exposed.
      The technique is not precise, and it must be calibrated using surfaces of known age, such as dated gravestones, but it has helped to reconstruct the history of glaciers in many mountain regions.

      E
      Lichens are also sensitive indicators of air quality.
      Because they absorb water and minerals directly from the air rather than through roots, they take in pollutants as well.
      During the industrial revolution, many species disappeared completely from the centres of British cities, killed by the sulphur dioxide released by burning coal.
      As air quality has improved in recent decades, a number of these species have gradually returned, and volunteers now record lichens on urban trees as a simple way of tracking pollution.

      F
      People have found many practical uses for lichens over the centuries.
      They were once an important source of dyes, producing colours from yellow and orange to purple, and in parts of Scotland they were used to colour the wool for traditional cloth.
      Litmus, the substance that turns red in acid and blue in alkali, was originally extracted from lichens.
      In the far north, lichens provide the main winter food of reindeer, which dig through the snow to reach them.

      G
      Their slow growth, however, makes lichens vulnerable.
      A lichen scraped off a rock may take decades to grow back, and some rare species are threatened by the cleaning of old buildings and by changes in farming.
      Conservationists argue that lichens deserve far more attention than they receive, not least because they reveal so much about the health of the environment around them.
    `,
    groups: [
      tfng([
        ['More than 20,000 species of lichen have now been identified.', 'F', 'A3', '“Around 20,000 species have so far been described” — around, not more than. The extra species “remain to be discovered”.'],
        ['Lichens are often confused with another type of plant.', 'T', 'A4', 'Lichens “are frequently mistaken for mosses”.'],
        ['The fungus in a lichen produces food using sunlight.', 'F', 'B2', 'It is the algae or bacteria that “use sunlight to produce food”; the fungus provides structure and protection.'],
        ['The discovery of a yeast in lichens was made by accident.', 'NG', 'B4 B5', 'The discovery “surprised biologists”, but the passage does not say how it was made.'],
        ['Lichens can become active again soon after receiving water.', 'T', 'C2', 'They become active “within minutes of being wetted by rain or dew”.'],
        ['Lichens sent into space continued to grow while they were in orbit.', 'NG', 'C3', 'Most lichens “recovered and continued to grow” once back on Earth. We are not told whether they grew in orbit.'],
        ['Measuring lichens gives an exact date for when a rock surface was exposed.', 'F', 'D3 D4', 'The method gives an estimate and “is not precise”.'],
        ['Dated gravestones can be used to check the lichen-dating method.', 'T', 'D4', 'The technique “must be calibrated using surfaces of known age, such as dated gravestones”.'],
        ['All of the lichen species lost from British cities have now returned.', 'F', 'E4', 'Only “a number of these species have gradually returned”, not all of them.'],
        ['Volunteers who record urban lichens receive special training.', 'NG', 'E4', 'Volunteers record lichens on urban trees, but nothing is said about training.'],
        ['Litmus was first made from lichens.', 'T', 'F3', 'Litmus “was originally extracted from lichens”.'],
        ['Reindeer eat lichens mainly in summer.', 'F', 'F4', 'Lichens are “the main winter food of reindeer”.'],
      ]),
    ],
  }),
])
