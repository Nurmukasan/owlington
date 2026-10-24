import { info, passage, short, test } from '../build'

export default test('skim-festivals', [
  passage({
    title: 'Festivals of Light',
    sub: 'In the darkest months of the year, people across the world have found reasons to light lamps, candles and lanterns.',
    text: `
      A
      It is perhaps no surprise that so many cultures celebrate light.
      Before electricity, darkness shaped daily life, especially in winter, when nights in northern regions could last sixteen hours or more.
      Festivals of light, held in many different religions and traditions, often mark the turning of the seasons, the victory of good over evil or the hope of a new beginning.
      Although their origins differ widely, they share a common image: a small flame shining against the dark.

      B
      Diwali, celebrated by hundreds of millions of Hindus, Sikhs and Jains, is among the largest of these festivals.
      It usually falls in October or November and lasts five days.
      Homes are cleaned and decorated with rows of small clay oil lamps called diyas, and patterns made from coloured powder, known as rangoli, are created at doorways to welcome guests.
      Families exchange sweets and gifts, and in many places the evenings are filled with fireworks.

      C
      The Jewish festival of Hanukkah lasts eight nights and generally falls in December.
      It commemorates the rededication of the Temple in Jerusalem in the second century BCE, when, according to tradition, a small supply of oil kept the temple lamp burning for eight days.
      On each night of the festival, an additional candle is lit on a special candlestick called a menorah, until all eight are burning, and foods fried in oil, such as potato pancakes and doughnuts, are traditionally eaten.

      D
      In Sweden, the festival of Saint Lucia takes place on 13 December, which under the old calendar was the longest night of the year.
      Early in the morning, a girl chosen to represent Lucia, dressed in a white gown with a crown of candles on her head, leads a procession of singers through schools, churches and workplaces.
      The celebration is accompanied by coffee and saffron buns, and it has spread to Swedish communities around the world.

      E
      In Thailand, the festival of Loy Krathong is held on the evening of the full moon in the twelfth month of the traditional Thai calendar, usually in November.
      People float small decorated baskets, traditionally made from banana leaves and containing candles, incense and flowers, on rivers and lakes.
      The custom is said to show respect for the goddess of water, and many people believe that sending the basket away also carries away bad luck.
      In recent years, concerns about waste have encouraged the use of baskets made from bread or other materials that break down naturally.

      F
      The Chinese Lantern Festival marks the end of the New Year celebrations, on the fifteenth day of the first month of the lunar calendar.
      Streets and parks are hung with paper lanterns of every shape and colour, and riddles are often written on the lanterns for visitors to solve.
      Families eat sweet rice balls, whose round shape symbolises unity and completeness.

      G
      Some light festivals are much more recent.
      In the French city of Lyon, the Festival of Lights began in 1852, when residents placed candles in their windows to celebrate the unveiling of a statue of the Virgin Mary.
      Today, the four-day event attracts millions of visitors to see buildings across the city transformed by elaborate light projections designed by artists from many countries.
    `,
    groups: [
      info(
        [
          ['a festival that began with a single local event', 'G', 'G2', 'Lyon’s festival began in 1852 when residents lit candles to celebrate the unveiling of a statue.'],
          ['an environmental change to a traditional custom', 'E', 'E4', 'Concerns about waste have encouraged baskets “made from bread or other materials that break down naturally”.'],
          ['puzzles that people try to answer', 'F', 'F2', '“Riddles are often written on the lanterns for visitors to solve.”'],
          ['a festival that is now celebrated outside its country of origin', 'D', 'D3', 'Saint Lucia “has spread to Swedish communities around the world”.'],
          ['designs made at the entrance to homes', 'B', 'B3', 'Rangoli patterns “are created at doorways to welcome guests”.'],
          ['an explanation of why light was so important in the past', 'A', 'A2', '“Before electricity, darkness shaped daily life”, with winter nights of sixteen hours or more.'],
        ],
      ),
      short(
        2,
        [
          ['How many days does Diwali last?', 'five|5', 'B2', 'Diwali “lasts five days”.'],
          ['What is the candlestick used at Hanukkah called?', 'menorah|a menorah', 'C3', 'Candles are lit on “a special candlestick called a menorah”.'],
          ['On what date is Saint Lucia celebrated?', '13 December|December 13', 'D1', 'The festival “takes place on 13 December”.'],
          ['What is Lucia’s crown made of?', 'candles', 'D2', 'She wears “a crown of candles on her head”.'],
          ['What were Loy Krathong baskets traditionally made from?', 'banana leaves', 'E2', 'Baskets are “traditionally made from banana leaves”.'],
          ['Apart from completeness, what does the shape of rice balls symbolise?', 'unity', 'F3', 'Their round shape “symbolises unity and completeness”.'],
        ],
        true,
      ),
    ],
  }),
])
