import { notes, passage, table, test } from '../build'

export default test('completion-tern', [
  passage({
    title: 'The Longest Journey',
    sub: 'A seabird weighing about as much as a bar of soap flies from one end of the Earth to the other, and back, every year.',
    text: `
      A
      The Arctic tern is a slender grey and white seabird with a black cap and a bright red beak.
      It weighs only around one hundred grams, yet it makes the longest regular migration of any animal on the planet.
      Each year it breeds in the far north, in places such as Greenland, Iceland and northern Canada, and then flies south to spend the northern winter around the edges of Antarctica, before returning north the following spring.

      B
      For a long time, the true length of this journey could only be guessed at.
      Terns are too small to carry the satellite transmitters used to follow larger birds, and rings fitted to their legs revealed only where a bird had been caught, not the route it had taken.
      The breakthrough came with the development of geolocators, devices weighing little more than a paperclip which record the time of sunrise and sunset each day.
      From these records, scientists can calculate the bird’s approximate position, although the data can only be collected by catching the bird again a year later.

      C
      The first major study using geolocators, published in 2010, followed terns from colonies in Greenland and Iceland.
      It found that the average bird travelled about 70,000 kilometres in a year, far more than the 40,000 kilometres previously estimated.
      Later studies of terns from other colonies recorded even greater distances, with some birds covering more than 90,000 kilometres.

      D
      The terns do not take the most direct route.
      After leaving their breeding colonies, most stop for around a month in an area of the North Atlantic where cold and warm waters meet and food is plentiful.
      They then continue south, some following the coast of Africa and others crossing to follow the coast of South America.
      On the return journey they fly in a wide S-shape across the Atlantic, a route that is longer than a straight line but allows them to take advantage of the prevailing winds.

      E
      The Arctic tern’s way of life has a remarkable consequence: by moving between the northern and southern summers, it experiences more hours of daylight each year than any other animal.
      Terns can also live for thirty years or more.
      Over its lifetime, a long-lived bird may fly well over two million kilometres, equal to around three return journeys to the Moon.

      F
      Such a demanding lifestyle leaves the birds vulnerable to change.
      Arctic terns feed mainly on small fish, which they catch by diving into the surface of the sea, and in several colonies breeding success has fallen sharply in years when warmer waters have reduced the number of fish available.
      Researchers continue to fit geolocators to the birds, hoping to understand how changes along their route affect their ability to complete the journey.
    `,
    groups: [
      notes(
        'The Arctic tern',
        1,
        [
          '# Appearance',
          '- grey and white with a black cap and a red [[beak]]',
          '- weighs about one hundred grams',
          '# Tracking the journey',
          '- leg rings showed only where a bird had been [[caught]]',
          '- geolocators record the times of sunrise and [[sunset]]',
          '- data can be collected only when the bird is caught again after a [[year]]',
        ],
        [
          ['A1', 'The tern has “a black cap and a bright red beak”.'],
          ['B2', 'Rings “revealed only where a bird had been caught, not the route it had taken”.'],
          ['B3', 'Geolocators “record the time of sunrise and sunset each day”.'],
          ['B4', 'The data can be collected only “by catching the bird again a year later”.'],
        ],
      ),
      table(
        'Findings about the migration',
        2,
        ['Topic', 'Finding'],
        [
          ['Distance', 'average of about [[70,000|70000]] kilometres a year in the 2010 study'],
          ['Stopover', 'about one month in the [[North Atlantic]], where food is plentiful'],
          ['Return route', 'an S-shape that makes use of the [[prevailing winds]]'],
          ['Daylight', 'more hours of daylight than any other [[animal]]'],
          ['Lifetime', 'over two million kilometres, about three return trips to the [[Moon]]'],
          ['Threat', 'warmer waters reduce the number of [[fish]]'],
        ],
        [
          ['C2', 'The average bird “travelled about 70,000 kilometres in a year”. The word “kilometres” is already printed.'],
          ['D2', 'Most stop “in an area of the North Atlantic where cold and warm waters meet and food is plentiful”.'],
          ['D4', 'The S-shaped route “allows them to take advantage of the prevailing winds”.'],
          ['E1', 'It “experiences more hours of daylight each year than any other animal”.'],
          ['E3', 'A lifetime of flying equals “around three return journeys to the Moon”.'],
          ['F2', 'Warmer waters “have reduced the number of fish available”.'],
        ],
        { number: true },
      ),
    ],
  }),
])
