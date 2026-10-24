import { passage, test, tfng } from '../build'

export default test('tfng-underground', [
  passage({
    title: 'Under the Streets of London',
    sub: 'How a railway that ran through smoke-filled tunnels became the model for cities all over the world.',
    text: `
      A
      By the middle of the nineteenth century, the streets of central London had become almost impossible to move through.
      The city’s population had more than doubled in fifty years, and every morning tens of thousands of workers poured in on foot, by horse-drawn bus and by cab.
      The main railway companies had built their stations on the edge of the centre, because Parliament would not allow lines to be driven through the crowded heart of the city, and passengers arriving by train simply added to the crush in the streets.

      B
      The idea of a railway beneath the streets was promoted for many years by Charles Pearson, a lawyer working for the City of London, who argued that it would relieve traffic and allow poorer workers to live further from their jobs.
      Many people thought the scheme absurd.
      Critics warned that passengers would be poisoned by smoke, that the tunnels would collapse, and that nobody would choose to travel underground.
      Pearson spent years persuading investors, and he died in 1862, just months before the line opened.

      C
      The Metropolitan Railway was opened to the public on 10 January 1863, running for about six kilometres between Paddington and Farringdon Street.
      It was built by a method known as cut and cover: workers dug a deep trench along the line of an existing road, built the tunnel inside it with brick walls and a roof, and then covered it over again.
      The method was relatively cheap, but it caused enormous disruption while the work was going on, and it meant that the route had to follow the roads above.

      D
      Despite the predictions, the railway was an immediate success.
      Around 38,000 passengers travelled on the first day, and in its first year the line carried more than nine million people.
      The trains were pulled by steam locomotives, which had been specially designed to reduce smoke, but conditions in the tunnels were still unpleasant, and openings were made in the roof at intervals to let the smoke escape.
      Some doctors even claimed that the sulphur-laden air was good for the health, a view that few passengers seem to have shared.

      E
      The company also introduced cheap tickets on early-morning trains for working people, partly because Parliament required it to do so.
      These ‘workmen’s trains’ allowed labourers and clerks to live in the new suburbs that were growing up along the line and travel to the centre each day, a pattern that would shape the development of London for the next century.

      F
      The great breakthrough came in 1890 with the opening of the City and South London Railway, the first deep-level line to use electric trains.
      Instead of being dug from the surface, its tunnels were bored through the clay far below ground using a tunnelling shield, a steel cylinder that protected the workers as they advanced.
      Because the tunnels no longer had to follow the roads, they could take the most direct routes, and because electric trains produced no smoke, they could run much deeper.
      The round shape of these tunnels soon earned the network its popular name: the Tube.

      G
      Within a few decades, cities across the world, from Budapest to Boston and Paris to Buenos Aires, had built underground railways of their own.
      Today, more than 180 cities have such systems, carrying many millions of passengers every day.
      London’s network, the oldest of them all, still uses parts of the original 1863 tunnels.
    `,
    groups: [
      tfng([
        ['In the mid-nineteenth century, London’s population was growing more slowly than before.', 'NG', 'A2', 'The population “had more than doubled in fifty years”, but nothing compares the rate with earlier periods.'],
        ['Parliament prevented the main railway companies from building lines through the centre of London.', 'T', 'A3', '“Parliament would not allow lines to be driven through the crowded heart of the city.”'],
        ['Charles Pearson believed an underground railway would help poorer workers.', 'T', 'B1', 'He argued it would “allow poorer workers to live further from their jobs”.'],
        ['Pearson travelled on the Metropolitan Railway soon after it opened.', 'F', 'B4', 'Pearson “died in 1862, just months before the line opened”, so he could not have travelled on it.'],
        ['The cut-and-cover method was more expensive than other ways of building tunnels.', 'F', 'C3', 'The method “was relatively cheap”.'],
        ['The route of the first line was decided by the position of existing roads.', 'T', 'C2 C3', 'The trench was dug along existing roads, so “the route had to follow the roads above”.'],
        ['Fewer people used the railway in its first year than its supporters had expected.', 'NG', 'D1 D2', 'We learn the line carried nine million people and was an “immediate success” despite critics, but not what its supporters had expected.'],
        ['The locomotives used on the Metropolitan Railway produced no smoke.', 'F', 'D3', 'They had been designed “to reduce smoke”, and openings were needed “to let the smoke escape”.'],
        ['Most passengers agreed with doctors who said the tunnel air was healthy.', 'F', 'D4', 'It was a view “that few passengers seem to have shared”.'],
        ['Cheap early-morning tickets were introduced partly because of a legal requirement.', 'T', 'E1', 'The company introduced them “partly because Parliament required it to do so”.'],
        ['The tunnelling shield was invented by the engineer who built the City and South London Railway.', 'NG', 'F2', 'The shield is described, but nothing is said about who invented it.'],
        ['None of the original 1863 tunnels is still in use today.', 'F', 'G3', 'London’s network “still uses parts of the original 1863 tunnels”.'],
      ]),
    ],
  }),
])
