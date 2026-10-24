import { flow, notes, passage, table, test } from '../build'

export default test('completion-paper', [
  passage({
    title: 'A Second Life for Paper',
    sub: 'Every day, millions of tonnes of used paper begin a journey back to the paper mill. What happens to it there?',
    text: `
      A
      Paper is one of the most widely recycled materials in the world, and in many European countries more than two-thirds of the paper that is used is eventually collected and turned into new products.
      The process is so familiar that it is easy to forget how much work it involves.
      A used newspaper or cardboard box must be broken down, cleaned and rebuilt before it can become paper again, and each stage has its own technical challenges.

      B
      The journey begins with collection and sorting.
      Paper is not a single material but a family of grades, and mixing them carelessly lowers the quality of the final product.
      Sorting centres therefore separate the incoming material into groups such as newspapers, office paper and cardboard, and remove obvious contaminants like plastic bags.
      The sorted paper is then pressed into large bales, which are easier to store and transport to the mill.

      C
      At the mill, the bales are fed into a machine called a pulper, a huge tank in which the paper is mixed with water and stirred by a rotating blade.
      Within minutes, the paper falls apart into individual fibres, producing a thick grey liquid known as slurry.
      This slurry is then pumped through a series of screens, which catch larger pieces of rubbish such as staples, paper clips and fragments of plastic.
      Heavier items, including small stones and bits of glass, are removed in cleaners that spin the slurry rapidly, so that dense particles are thrown outwards and separated.

      D
      The next stage, de-inking, is needed only when the new product must be bright and clean.
      The most common method is flotation.
      Air is blown into the slurry together with chemicals similar to soap, and the ink particles stick to the rising bubbles.
      At the surface, the bubbles form a dark foam, which is skimmed off and removed.
      Paper intended for high-quality products may also be bleached at this point, usually with hydrogen peroxide rather than the chlorine compounds that were once common.

      E
      Finally, the cleaned fibres are turned back into paper.
      The slurry, which by now is more than ninety-nine per cent water, is spread onto a fast-moving belt of fine mesh, through which most of the water drains away.
      The remaining sheet passes between heavy rollers that squeeze out more water, and then around a series of steam-heated cylinders that dry it completely.
      At the end of the machine, the finished paper is wound onto enormous reels, some of which weigh more than twenty tonnes.

      F
      Recycling cannot continue for ever, however.
      Every time paper is pulped, its fibres become shorter and weaker, and after five to seven cycles they are too short to bond into a sheet.
      For this reason, mills usually add some new fibre from wood to keep the product strong, and the shortest fibres end up in products where strength matters little.
      Different grades of collected paper therefore tend to follow different routes.
      Old newspapers are commonly turned back into newsprint or into moulded packaging such as egg boxes, office paper is valued for making tissues and new printing paper because its fibres are long and white, and used cardboard is mostly made into new boxes, for which appearance is unimportant.

      G
      Supporters of recycling point out that it uses considerably less energy and water than making paper from trees, and that it keeps large quantities of material out of landfill sites.
      Critics reply that the benefits depend heavily on local conditions, including how far the paper must be transported and how the mill’s energy is produced.
      Both sides agree, however, that the most effective step happens long before the mill: keeping paper clean and dry, and free from food and plastic, makes every later stage easier.
    `,
    groups: [
      flow(
        'Recycling paper',
        1,
        [
          'Paper is sorted into groups and pressed into [[bales]]',
          'At the mill, a [[pulper]] mixes the paper with water and breaks it into fibres',
          'The resulting [[slurry]] passes through screens that remove items like staples',
          'Spinning [[cleaners]] separate stones and glass',
          'Air and soap-like chemicals are added; [[ink]] sticks to the bubbles and is removed in a foam',
          'The fibres are spread on a mesh belt, pressed by [[rollers]] and dried by heated cylinders',
        ],
        [
          ['B4', 'The sorted paper “is then pressed into large bales”.'],
          ['C1', 'The bales are fed into “a machine called a pulper”, where the paper is mixed with water.'],
          ['C2 C3', 'The paper becomes “a thick grey liquid known as slurry”, which is pumped through screens.'],
          ['C4', 'Stones and glass “are removed in cleaners that spin the slurry rapidly”.'],
          ['D3 D4', '“The ink particles stick to the rising bubbles”, which form a dark foam that is skimmed off.'],
          ['E3', 'The sheet “passes between heavy rollers that squeeze out more water”.'],
        ],
      ),
      table(
        'Where collected paper goes',
        3,
        ['Collected grade', 'Typical new products', 'Reason'],
        [
          ['Old newspapers', 'newsprint and [[egg boxes]]', '—'],
          ['Office paper', 'tissues and printing paper', 'its fibres are [[long and white]]'],
          ['Cardboard', '[[new boxes]]', '[[appearance]] does not matter'],
        ],
        [
          ['F5', 'Old newspapers become “newsprint or… moulded packaging such as egg boxes”.'],
          ['F5', 'Office paper is valued “because its fibres are long and white”: three words, exactly the limit.'],
          ['F5', 'Used cardboard “is mostly made into new boxes”.'],
          ['F5', 'New boxes are a product “for which appearance is unimportant”.'],
        ],
      ),
      notes(
        'Limits and debate',
        2,
        [
          '- fibres get shorter each time; usable for five to seven [[cycles]]',
          '- mills add new fibre from [[wood]] to keep paper strong',
          '- benefits depend on transport distance and the source of the mill’s [[energy]]',
        ],
        [
          ['F2', '“After five to seven cycles they are too short to bond into a sheet.”'],
          ['F3', 'Mills “add some new fibre from wood to keep the product strong”.'],
          ['G2', 'Critics say the benefits depend on transport distance “and how the mill’s energy is produced”.'],
        ],
      ),
    ],
  }),
])
