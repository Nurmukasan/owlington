import { task2 } from '../build'

export default task2({
  id: 't2-problem-traffic',
  type: 'problem',
  instructions: [
    'Traffic congestion is becoming a serious problem in many cities around the world.',
    'What are the causes of this problem, and what measures could be taken to reduce it?',
  ],
  tips: [
    'Causes: car ownership, poor public transport, city planning, deliveries.',
    'Match each solution to a cause.',
    'Use a real city as an example: London’s congestion charge, Singapore’s car permits.',
  ],
  model: `
In cities from Jakarta to Los Angeles, millions of commuters spend hours each week stuck in traffic. This essay will examine the main causes of this congestion and suggest measures that governments could take to reduce it.

The most obvious cause is the rapid rise in car ownership. As incomes increase, more families can afford a car, and many see it as a symbol of status as well as a convenient way to travel. A second reason is inadequate public transport. Where buses are slow and unreliable, people have little choice but to drive. City planning also plays a role. When homes are built in suburbs far from offices, shops and schools, residents must travel long distances every day, usually by car. Finally, the growth of online shopping has filled streets with delivery vans.

Several solutions could tackle these causes. Firstly, governments should invest in fast, frequent public transport, such as dedicated bus lanes and metro lines, so that leaving the car at home becomes an attractive option. Secondly, drivers could be charged for using the busiest roads at peak times. For example, London's congestion charge reduced traffic in the city centre noticeably in its first years. Thirdly, planners should build mixed neighbourhoods where people can live close to their work and walk or cycle to local services. Deliveries, too, could be organised from shared depots on the edge of the city.

In conclusion, congestion is caused mainly by growing car ownership, poor public transport and badly planned cities. A combination of better transport, road charges and smarter urban design offers the best chance of keeping cities moving.
`,
  notes: [
    ['This essay will examine the main causes of this congestion and suggest measures that governments could take to reduce it.', 'TA', 'Both questions are previewed.'],
    ['and many see it as a symbol of status as well as a convenient way to travel', 'TA', 'The cause is explained, not just named.'],
    ['City planning also plays a role.', 'GRA', 'A short topic sentence for a third cause.'],
    ['so that leaving the car at home becomes an attractive option', 'TA', 'The solution is linked to the cause it addresses.'],
    ["London's congestion charge reduced traffic in the city centre noticeably", 'TA', 'A real-world example shows the measure works.'],
  ],
})
