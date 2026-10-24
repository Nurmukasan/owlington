import { flow, limit, part, person, test } from '../build'

const guide = person('guide', 'Martin', 'Factory guide', 'm', 'en-GB', 'HOLINJYuuNipXUTD7z8k')

export default test('flow-chocolate', [
  part({
    n: 2,
    title: 'From bean to bar',
    intro: 'You will hear a guide explaining how chocolate is made during a factory tour.',
    speakers: [guide],
    blocks: [
      {
        lines: `
          guide: Welcome to the Cocoa Works. I'm going to take you through how we turn cocoa beans into chocolate bars.
          guide: It all starts on farms in West Africa and South America. The cocoa pods are cut from the trees, and the beans inside are left in piles under banana leaves for about a week. This is called fermentation, and it's what develops the chocolate flavour.
          guide: The beans are then spread out in the sun to dry, and packed into sacks for shipping. When they arrive here, the first thing we do is clean them, to remove stones and dust.
          guide: Next, the beans are roasted. This is the stage that fills the factory with that wonderful smell. Every type of bean has its own roasting time and temperature.
          guide: After roasting, the beans go into a machine that cracks them and blows away the shells, leaving small pieces called nibs.
          guide: The nibs are ground between heavy rollers into a thick paste. Then sugar and milk powder are added, depending on the recipe.
          guide: The mixture is then stirred for up to three days in a process called conching. This makes the chocolate smooth. If you skip this step, the chocolate feels gritty in your mouth.
          guide: Then comes tempering, where the chocolate is heated and cooled very carefully. This is what gives it a shine and makes it snap cleanly when you break it.
          guide: Finally, the chocolate is poured into moulds, cooled in a tunnel, and wrapped by machine.
          guide: At the end of the tour, you'll get to taste some, and you can make your own bar in our workshop.
        `,
        groups: [
          flow(
            'How chocolate is made',
            limit(1),
            [
              'Beans are left under banana [[leaves]] to ferment',
              'Beans are dried in the [[sun]] and shipped',
              'Beans are cleaned to remove stones and [[dust]]',
              'Beans are [[roasted]]',
              'Shells are removed, leaving [[nibs]]',
              'Nibs are ground into a paste between [[rollers]]',
              'Sugar and [[milk]] powder are added',
              'Conching: stirred for up to 3 days to make it [[smooth]]',
              'Tempering gives it a [[shine]]',
              'Chocolate is poured into [[moulds|molds]] and wrapped',
            ],
            [
              ['left in piles under banana leaves for about a week', 'Fermentation develops the flavour.'],
              ['spread out in the sun to dry', 'Then packed into sacks.'],
              ['to remove stones and dust', 'The first step at the factory.'],
              ['Next, the beans are roasted', 'This fills the factory with the smell.'],
              ['leaving small pieces called nibs', 'A machine cracks the beans and blows away the shells.'],
              ['ground between heavy rollers into a thick paste', 'The nibs become a paste.'],
              ['sugar and milk powder are added', 'Depending on the recipe.'],
              ['This makes the chocolate smooth', 'Without conching, it feels gritty.'],
              ['This is what gives it a shine', 'It also makes it snap cleanly.'],
              ['the chocolate is poured into moulds', 'Then cooled and wrapped by machine.'],
            ],
          ),
        ],
      },
    ],
    traps: [['the chocolate feels gritty in your mouth', 18, 'What happens without conching.']],
  }),
])
