import { info, passage, test } from '../build'

export default test('info-glacier', [
  passage({
    title: 'Rivers of Ice',
    sub: 'Glaciers look still, but they are always moving, and what they leave behind can be read like a book.',
    text: `
      A
      A glacier begins as nothing more than snow that does not melt.
      In high mountains and polar regions, more snow falls in winter than can disappear in summer, and year after year the layers build up.
      As they do, the weight of the snow above squeezes the air out of the layers below, turning soft flakes first into a dense, grainy material and eventually, over decades or even centuries, into solid blue ice.
      Once the ice becomes thick enough, typically several tens of metres, it begins to move under its own weight.

      B
      This movement surprises many people, since ice seems so rigid.
      Under great pressure, however, the crystals inside it can slowly change shape and slide past one another, so that the glacier flows downhill rather like extremely thick syrup.
      Where meltwater reaches the base, the whole glacier can also slide over the rock beneath it.
      Most glaciers move between a few centimetres and a few metres a day, but some outlet glaciers in Greenland have been measured travelling more than forty metres in a single day.

      C
      The surface of a glacier tells the story of this motion.
      Where the ice moves over a steep drop or around a bend, the brittle upper layer cracks open into deep crevasses, some of them hidden beneath bridges of snow.
      These are among the greatest dangers for climbers, and mountaineers crossing glaciers normally travel roped together so that a person who falls can be held by the others.

      D
      As it flows, a glacier acts like a giant bulldozer and file combined.
      Rocks frozen into its base scrape and polish the ground beneath, leaving long parallel scratches that show the direction in which the ice travelled.
      Over thousands of years, glaciers can carve narrow river valleys into broad U-shaped valleys, and in coastal areas such valleys later flooded by the sea form the deep inlets known as fjords.

      E
      Glaciers also carry enormous quantities of rock and soil, which they drop when the ice melts.
      Ridges of this material, called moraines, mark the furthest point a glacier reached, and scientists use them to reconstruct how far the ice extended in the past.
      Single boulders carried far from their place of origin are sometimes left stranded in fields, and in the eighteenth and nineteenth centuries these puzzling rocks helped to convince geologists that great sheets of ice had once covered much of northern Europe.

      F
      Today, the great majority of the world’s mountain glaciers are shrinking.
      Photographs taken a century ago show ice filling valleys that are now bare rock, and in some mountain ranges small glaciers have disappeared altogether.
      The loss matters far beyond the mountains: in parts of Asia and South America, meltwater from glaciers keeps rivers flowing during dry seasons, supplying drinking water and irrigation for many millions of people.

      G
      Shrinking glaciers can also create sudden dangers.
      As the ice retreats, meltwater often collects in lakes held back only by loose moraine, and if this natural wall collapses the lake can empty in hours, sending a destructive flood down the valley.
      Several countries now monitor such lakes using satellites, and in some cases engineers have built channels to lower the water level gradually before a collapse can occur.
    `,
    groups: [
      info(
        [
          ['a description of how people protect themselves when crossing glaciers', 'C', 'C3', 'Mountaineers “normally travel roped together so that a person who falls can be held by the others”.'],
          ['an example of a glacier moving unusually fast', 'B', 'B4', 'Some Greenland glaciers “travelling more than forty metres in a single day”.'],
          ['an explanation of how snow changes into ice', 'A', 'A3', 'The weight of snow squeezes out the air, “turning soft flakes first into a dense, grainy material and eventually… into solid blue ice”.'],
          ['evidence that helped to change scientific thinking about the past', 'E', 'E3', 'Stranded boulders “helped to convince geologists that great sheets of ice had once covered much of northern Europe”.'],
          ['a reference to the importance of glaciers for farming', 'F', 'F3', 'Meltwater supplies “drinking water and irrigation for many millions of people”. Irrigation = farming.'],
          ['a method used to reduce the risk of flooding', 'G', 'G3', 'Engineers “have built channels to lower the water level gradually before a collapse can occur”.'],
          ['marks on the ground that reveal the direction of the ice', 'D', 'D2', 'Rocks leave “long parallel scratches that show the direction in which the ice travelled”.'],
          ['a comparison between moving ice and a liquid', 'B', 'B2', 'The glacier flows downhill “rather like extremely thick syrup”.'],
          ['visual evidence of how glaciers have changed', 'F', 'F2', '“Photographs taken a century ago show ice filling valleys that are now bare rock.”'],
          ['the origin of a type of coastal landscape', 'D', 'D3', 'Glacial valleys “later flooded by the sea form the deep inlets known as fjords”.'],
        ],
        true,
      ),
    ],
  }),
])
