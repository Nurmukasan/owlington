import { passage, summary, test } from '../build'

export default test('summary-stink', [
  passage({
    title: 'The Great Stink',
    sub: 'In the hot summer of 1858, the smell of the River Thames finally forced Britain’s lawmakers to act.',
    text: `
      A
      In the middle of the nineteenth century, London was the largest and richest city in the world, yet it had no proper system for removing human waste.
      Most houses emptied their waste into cesspits, brick-lined holes in the ground that had to be emptied by hand, and many of these overflowed into the streets.
      The introduction of the flushing toilet, which became fashionable among the middle classes, made matters worse, because the extra water filled the cesspits faster and sent their contents into the old drains that flowed directly into the Thames.
      The river, from which much of the city still took its drinking water, had effectively become an open sewer.

      B
      The consequences for public health were devastating.
      Cholera, a disease that causes severe diarrhoea and can kill within hours, swept through London in several major outbreaks, killing tens of thousands of people.
      At the time, most doctors and officials believed that the disease was spread by ‘miasma’, a poisonous form of bad air rising from rotting waste.
      In 1854, the physician John Snow traced one outbreak to a single public water pump in Soho and argued that cholera was carried in contaminated water, but his ideas were not widely accepted for many years.

      C
      Ironically, it was the belief in miasma that finally brought about change.
      The summer of 1858 was exceptionally hot, and the sewage in the Thames began to rot in the sun, producing a smell so overpowering that it became known as the Great Stink.
      The Houses of Parliament, standing on the riverbank, were badly affected.
      Curtains soaked in chemicals were hung at the windows in an attempt to block the smell, and members considered moving their work out of London altogether.
      Faced with what they believed was a deadly threat to their own health, politicians acted with remarkable speed, and within weeks a law had been passed giving the city’s authorities the power and the money to build a new sewer system.

      D
      The man chosen to design it was Joseph Bazalgette, the chief engineer of the Metropolitan Board of Works.
      His plan was to build large new sewers running parallel to the river, which would intercept the waste from the old drains before it reached the Thames and carry it eastwards, away from the centre of the city.
      Because much of London is low and flat, the waste could not flow the whole way by gravity, so huge pumping stations were built to lift it to a higher level.
      The sewage was finally released into the river far downstream, where the tide would carry it out to sea.

      E
      Construction began in 1859 and took around sixteen years.
      Bazalgette’s workers built more than 1,000 miles of local street sewers and around 80 miles of main sewers, using hundreds of millions of bricks.
      In central London, the main sewers were built inside new embankments along the river, which also provided space for roads, gardens and an underground railway.
      Bazalgette famously decided to make the pipes twice as wide as his calculations suggested was necessary, reasoning that the city’s population would continue to grow, a decision that allowed the system to cope with London’s expansion well into the twentieth century.

      F
      The results were dramatic.
      The last major cholera outbreak in London, in 1866, was confined mainly to an area in the east of the city that had not yet been connected to the new system, which strongly supported Snow’s argument that the disease was spread through water.
      Today much of Bazalgette’s network remains in use, although it is now under strain from a population far larger than he could have imagined, and a new tunnel beneath the Thames has been built to relieve it.
    `,
    groups: [
      summary(
        'Before the new sewers',
        1,
        `Most London homes stored their waste in [[cesspits]], which often overflowed. The spread of the flushing toilet increased the amount of [[water]] in the system, sending more waste into the Thames.
        Although many people believed that diseases were carried by bad air, the doctor John Snow linked cholera to a public [[pump]] in Soho.
        In the hot summer of 1858, chemical-soaked [[curtains]] were hung in Parliament to keep out the smell.`,
        [
          ['A2', 'Houses emptied their waste “into cesspits”, many of which “overflowed into the streets”.'],
          ['A3', '“The extra water filled the cesspits faster and sent their contents into the old drains.”'],
          ['B4', 'Snow “traced one outbreak to a single public water pump in Soho”.'],
          ['C4', '“Curtains soaked in chemicals were hung at the windows.”'],
        ],
      ),
      summary(
        'Bazalgette’s solution',
        2,
        `Joseph Bazalgette designed new sewers that ran [[parallel to]] the river and stopped waste from entering it.
        Because the land was flat, [[pumping stations]] raised the waste so that it could keep moving.
        In the centre of London, the main sewers were placed inside new [[embankments]], which also held roads and a railway.
        Bazalgette made the pipes much wider than necessary because he expected the [[population]] to increase.
        The 1866 cholera outbreak mostly affected an area that was not yet [[connected]] to the system.`,
        [
          ['D2', 'The sewers ran “parallel to the river” and intercepted the waste “before it reached the Thames”.'],
          ['D3', '“Huge pumping stations were built to lift it to a higher level.”'],
          ['E3', '“The main sewers were built inside new embankments along the river.”'],
          ['E4', 'He reasoned “that the city’s population would continue to grow”.'],
          ['F2', 'The outbreak was confined to an area “that had not yet been connected to the new system”.'],
        ],
      ),
    ],
  }),
])
