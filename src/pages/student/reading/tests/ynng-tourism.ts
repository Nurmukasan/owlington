import { passage, test, ynng } from '../build'

export default test('ynng-tourism', [
  passage({
    title: 'Too Many Visitors?',
    sub: 'Crowded streets, rising rents and angry residents have made “overtourism” a familiar phrase. A travel economist asks what can be done.',
    text: `
      A
      Ten years ago, few people outside the travel industry had heard the word ‘overtourism’.
      Today it appears regularly in newspapers, usually alongside photographs of cruise ships towering over historic harbours or crowds squeezing through narrow medieval streets.
      Residents of popular cities have held protests, some of them directed at the visitors themselves, and several governments have introduced measures to limit numbers.
      It is tempting to conclude that tourism has simply grown too large, and that the solution is to reduce it.
      I think that conclusion is too simple.

      B
      The first point to make is that the problem is highly concentrated.
      Most tourists visit a small number of famous places, and within those places they gather in a few well-known streets and squares, often at the same times of day.
      A city that feels unbearably crowded around its main cathedral at noon may be almost empty a kilometre away.
      The difficulty, in other words, is less the total number of visitors than the way they are distributed.

      C
      This is not to deny that the effects on local people can be severe.
      In some historic centres, so many flats have been converted into short-term holiday rentals that families can no longer afford to live there, and the shops that once served residents have been replaced by souvenir stalls.
      When a neighbourhood loses its residents, it loses much of the character that attracted visitors in the first place, and I believe this is the most serious long-term danger that tourism poses.

      D
      Some cities have responded by charging visitors a daily fee or raising tourist taxes.
      Such charges can raise useful money for maintaining streets and monuments, but I am doubtful that they reduce crowding to any great extent.
      For most visitors, a few extra euros is a small part of the cost of a holiday, and the people most likely to be discouraged are those with the least money, which raises questions of fairness.

      E
      Measures that spread visitors more evenly seem to me far more promising.
      Timed tickets for major attractions, which allow a fixed number of people to enter in each period, have greatly reduced queues at several museums.
      Promoting lesser-known districts and nearby towns, and encouraging travel outside the peak summer months, can ease pressure on the busiest places while bringing income to areas that need it.
      None of this is easy, and some of these campaigns have achieved little, but the principle is sound.

      F
      Controls on short-term rentals are also essential.
      Several cities now limit the number of nights a home can be rented to visitors each year, or require owners to register with the authorities, and early evidence suggests that these rules have returned some homes to long-term residents.
      Enforcement is difficult, however, and the rules work only if cities are prepared to spend money checking that they are followed.

      G
      Finally, we should remember what tourism provides.
      In many regions it is one of the largest employers, and the money visitors spend supports restaurants, transport and cultural institutions that residents enjoy too.
      Reducing tourism across the board would harm many people who depend on it, often those on the lowest incomes.
      The aim should not be fewer visitors but better-managed ones.
    `,
    groups: [
      ynng([
        ['The word ‘overtourism’ has been widely used in the media for several decades.', 'N', 'A1', 'Ten years ago “few people outside the travel industry had heard the word”.'],
        ['Reducing the number of tourists is the obvious answer to overtourism.', 'N', 'A4 A5', 'The writer says that conclusion is “too simple”.'],
        ['The main problem is how visitors are spread across a city.', 'Y', 'B4', '“The difficulty… is less the total number of visitors than the way they are distributed.”'],
        ['Cruise ships cause more damage than any other kind of tourism.', 'NG', 'A2', 'Cruise ships appear in photographs, but the writer never compares their impact with other tourism.'],
        ['The loss of residents is the greatest long-term threat from tourism.', 'Y', 'C3', 'The writer believes this “is the most serious long-term danger that tourism poses”.'],
        ['Daily visitor fees are an effective way of reducing crowds.', 'N', 'D2', 'The writer is “doubtful that they reduce crowding to any great extent”.'],
        ['Tourist charges may affect poorer travellers unfairly.', 'Y', 'D3', 'Those most likely to be discouraged “are those with the least money, which raises questions of fairness”.'],
        ['Every campaign to promote lesser-known areas has been successful.', 'N', 'E4', '“Some of these campaigns have achieved little.”'],
        ['Rules on short-term rentals are easy to enforce.', 'N', 'F3', '“Enforcement is difficult.”'],
        ['Tourism jobs are usually better paid than jobs in other industries.', 'NG', 'G2 G3', 'The writer says tourism is a large employer and that cutting it would hurt people on low incomes, but makes no comparison of pay.'],
      ]),
    ],
  }),
])
