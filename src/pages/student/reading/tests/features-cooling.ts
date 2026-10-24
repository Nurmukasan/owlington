import { features, passage, test } from '../build'

export default test('features-cooling', [
  passage({
    title: 'Keeping Cool Without Machines',
    sub: 'Long before air conditioning, builders in hot countries knew how to keep people comfortable. Their ideas are being rediscovered.',
    text: `
      A
      Air conditioning has transformed life in hot climates, but it comes at a price.
      Cooling buildings already accounts for a large share of electricity use in many warm countries, and as temperatures rise and incomes grow, demand is expected to increase sharply.
      Ironically, the machines also make cities hotter, since they release the heat they remove from buildings into the streets outside.
      Architects are therefore looking again at techniques that kept people cool for centuries without using any energy at all.

      B
      One of the most striking is the wind tower, found for hundreds of years in the desert cities of Iran and the Persian Gulf.
      These tall chimneys rise above the roofs and have openings at the top facing in several directions.
      They catch the breeze, which is stronger and cooler above the rooftops, and direct it down into the rooms below, while warm air inside the building escapes through other openings.
      In some traditional houses, the air was passed over a pool of water or through an underground channel before entering the living space, cooling it further.

      C
      A second method relies on the materials from which buildings are made.
      Thick walls of stone, brick or earth absorb heat slowly during the day, so that the interior stays cool while the sun is at its strongest.
      At night, the walls release this stored heat, much of it into the cooler outside air.
      The technique works best in deserts and other places where nights are much colder than days; in humid regions, where the temperature changes little between day and night, it is far less effective.

      D
      The courtyard house, common around the Mediterranean and in North Africa, combines several principles.
      The rooms are arranged around an open central space, often containing trees and a fountain.
      Cool night air settles in the courtyard and remains there for much of the morning, shaded by the surrounding walls, and the evaporation of water from the fountain and plants lowers the temperature still further.
      Because the outer walls have few windows, the house is also protected from the noise and dust of the street.

      E
      Colour is perhaps the simplest technique of all.
      Dark surfaces absorb most of the sunlight that falls on them, while white or pale surfaces reflect much of it away.
      In the Greek islands and many other hot places, houses have long been painted white, and modern research confirms that a white roof can be many degrees cooler on a sunny day than a dark one.
      Several cities now encourage or require owners to paint roofs in reflective colours, and special coatings have been developed that reflect even more heat than ordinary white paint.

      F
      Roofs covered with plants offer a further option.
      A layer of soil and vegetation shields the building from the sun, and the plants cool the air around them as water evaporates from their leaves.
      Such roofs are more expensive to build and need regular care, but they also absorb rainwater and provide habitats for insects and birds, benefits that have made them popular in many European cities.

      G
      None of these methods can match the cooling power of a modern machine on the hottest days.
      Used together, however, they can greatly reduce the need for it, and engineers increasingly combine traditional designs with modern materials and sensors.
      The lesson, many architects now argue, is that the cheapest energy is the energy a building never needs to use.
    `,
    groups: [
      features(
        ['cooling method', 'cooling methods'],
        ['wind towers', 'thick walls', 'courtyards', 'pale surfaces', 'planted roofs'],
        [
          ['It is less useful in places where days and nights have similar temperatures.', 'B', 'C4', 'Thick walls are “far less effective” in humid regions, “where the temperature changes little between day and night”.'],
          ['It brings moving air from above the building into the rooms.', 'A', 'B3', 'Wind towers “catch the breeze… and direct it down into the rooms below”.'],
          ['It also helps to keep out sounds from outside.', 'C', 'D4', 'Courtyard houses are “protected from the noise and dust of the street”.'],
          ['It provides a home for wildlife.', 'E', 'F3', 'Planted roofs “provide habitats for insects and birds”.'],
          ['Some local authorities now make it compulsory.', 'D', 'E4', '“Several cities now encourage or require owners to paint roofs in reflective colours.”'],
          ['It stores heat during the day and gives it out at night.', 'B', 'C2 C3', 'Walls absorb heat during the day and “at night… release this stored heat”.'],
          ['It sometimes used water to make incoming air cooler.', 'A', 'B4', 'Air “was passed over a pool of water or through an underground channel before entering the living space”.'],
          ['It requires ongoing maintenance.', 'E', 'F3', 'Such roofs “need regular care”.'],
          ['It makes use of cool air that collects overnight.', 'C', 'D3', '“Cool night air settles in the courtyard and remains there for much of the morning.”'],
          ['Newer versions perform better than the traditional form.', 'D', 'E4', '“Special coatings have been developed that reflect even more heat than ordinary white paint.”'],
        ],
      ),
    ],
  }),
])
