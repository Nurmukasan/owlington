import { task2 } from '../build'

export default task2({
  id: 't2-adv-tourism-city',
  type: 'advantages',
  instructions: [
    'Some cities now receive millions of tourists every year.',
    'Do the advantages of mass tourism for these cities outweigh the disadvantages?',
  ],
  tips: [
    'Choose a side, say it in the introduction, and keep it.',
    'Venice, Barcelona and Amsterdam are well-known examples of “overtourism”.',
    'Consider residents as well as businesses.',
  ],
  model: `
Cities such as Barcelona, Venice and Amsterdam now welcome tens of millions of visitors every year. Although this brings considerable economic benefits, I believe that when tourism reaches such a scale, its disadvantages for local people outweigh its advantages.

There is no doubt that tourism creates wealth. Hotels, restaurants, museums and shops employ large numbers of people, and the taxes paid by visitors help fund public services. Tourism can also protect cultural heritage, because the income from ticket sales pays for the restoration of historic buildings. For instance, many cathedrals and palaces in Europe are maintained largely with money from visitors.

However, mass tourism has serious costs. The most damaging is its effect on housing. When apartments in the centre are rented to tourists through online platforms, rents rise sharply and local families are forced to move out. In some districts of Venice, for example, the permanent population has fallen to a fraction of what it once was. Crowds, noise and litter also make daily life difficult for those who remain, and traditional shops are replaced by souvenir stores that serve only visitors.

These problems matter more than the economic gains because they threaten the very character that attracts tourists in the first place. A city without residents becomes a theme park. Moreover, the profits from tourism are often concentrated in the hands of large companies, while the costs are shared by everyone.

In conclusion, tourism clearly benefits city economies, but beyond a certain level its disadvantages become greater. Cities should therefore limit short-term rentals and cruise ship visits to protect their residents.
`,
  notes: [
    ['I believe that when tourism reaches such a scale, its disadvantages for local people outweigh its advantages', 'TA', 'A qualified verdict: the writer argues that scale is what matters.'],
    ['There is no doubt that tourism creates wealth.', 'CC', 'The advantages are acknowledged fully before the counter-argument.'],
    ['rents rise sharply and local families are forced to move out', 'TA', 'Cause and effect explained clearly.'],
    ['A city without residents becomes a theme park.', 'GRA', 'A short, memorable sentence that sums up the argument.'],
    ['while the costs are shared by everyone', 'LR', 'A balanced contrast between profits and costs.'],
  ],
})
