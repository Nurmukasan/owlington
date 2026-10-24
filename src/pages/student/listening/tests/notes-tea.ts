import { limit, notes, part, person, test } from '../build'

const prof = person('prof', 'Dr Lowe', 'Lecturer', 'f', 'en-GB', 'IbXTsH7MlHi5GQco8zZH')

export default test('notes-tea', [
  part({
    n: 4,
    title: 'The global history of tea',
    intro: 'You will hear a lecture about the history of tea.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Today's lecture is about tea, the most widely drunk beverage in the world after water.
          prof: Tea comes from a single plant, a type of camellia, which originally grew wild in the mountains of south-west China. All the different types, green, black and white, come from the same leaves; the difference lies in how they're processed.
          prof: For centuries, tea was used in China mainly as a medicine. It only became an everyday drink around the eighth century, when a writer called Lu Yu produced the first book about it, describing how tea should be grown, prepared and served.
          prof: Tea was originally sold in pressed blocks, or bricks, which were easy to transport and could even be used as money in some regions.
          prof: Tea reached Europe in the early seventeenth century, brought by Dutch traders. At first it was extremely expensive, and wealthy families kept it in locked boxes so that servants couldn't take it.
          prof: In Britain, tea became popular partly because of a royal marriage. A Portuguese princess who married the English king brought her love of tea with her, and it became fashionable at court.
          prof: Because China controlled the supply, Britain had a huge trade problem. Chinese merchants would only accept silver, and Britain was running out. This eventually led to conflict.
          prof: The British then began growing tea in India, in a region called Assam, where a local variety of the plant was discovered. Later, plantations spread to Sri Lanka and East Africa. Today, Kenya is one of the world's biggest exporters of tea.
          prof: The way tea is drunk has also changed. The tea bag was invented almost by accident in the early twentieth century, when an American merchant sent samples in small silk bags, and customers put the bags straight into the pot.
          prof: In the last few decades, tea has been through a revival, with specialist cafés and interest in rare varieties. Bubble tea, which contains balls made from tapioca, has become particularly popular among young people.
        `,
        groups: [
          notes(
            'The history of tea',
            limit(1),
            [
              '- all types of tea come from one plant; differences come from how it is [[processed]]',
              '- first used in China as a [[medicine]]',
              '- Lu Yu wrote the first [[book]] about tea',
              '- tea was sold in pressed blocks and was even used as [[money]]',
              '- in Europe, wealthy families kept tea in locked [[boxes]]',
              '- became fashionable in Britain after a royal [[marriage]]',
              '- Chinese merchants only accepted [[silver]]',
              '- Britain grew tea in Assam, in [[India]]',
              '- tea bags: first samples were sent in bags made of [[silk]]',
              '- bubble tea contains balls made from [[tapioca]]',
            ],
            [
              ["the difference lies in how they're processed", 'Green, black and white tea come from the same leaves.'],
              ['tea was used in China mainly as a medicine', 'For centuries, before it became an everyday drink.'],
              ['produced the first book about it', 'Around the eighth century.'],
              ['could even be used as money in some regions', 'Bricks of tea were easy to transport.'],
              ['kept it in locked boxes', 'So servants could not take it.'],
              ['partly because of a royal marriage', 'A Portuguese princess married the English king.'],
              ['Chinese merchants would only accept silver', 'Britain was running out.'],
              ['began growing tea in India, in a region called Assam', 'A local variety was discovered there.'],
              ['sent samples in small silk bags', 'Customers put the bags straight into the pot.'],
              ['balls made from tapioca', 'Popular among young people.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['brought by Dutch traders', 35, 'Not a gap.'],
      ["Today, Kenya is one of the world's biggest exporters of tea", 38, 'Assam is in India.'],
    ],
  }),
])
