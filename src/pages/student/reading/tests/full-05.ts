import { choose2, features, headings, mcq, notes, passage, summary, test, tfng, ynng } from '../build'

export default test('full-05', [
  passage({
    title: 'Keepers of the Light',
    sub: 'For centuries, lighthouses and the people who tended them stood between sailors and disaster.',
    text: `
      A
      Long before satellites and electronic charts, sailors approaching a coast at night had only their own eyes to guide them.
      Rocks and sandbanks invisible in the dark wrecked countless ships, and from ancient times people lit fires on high ground to warn vessels away from danger and guide them into harbour.
      The most famous early lighthouse, the Pharos of Alexandria in Egypt, was built in the third century BCE and is thought to have stood more than one hundred metres high, making it one of the tallest structures of the ancient world.

      B
      Building a lighthouse on land was difficult enough, but many of the most dangerous hazards lay offshore, on rocks covered by the sea at high tide.
      The Eddystone rocks, fourteen kilometres off the south-west coast of England, illustrate the challenge.
      The first lighthouse there, a wooden tower completed in 1698, was destroyed in a great storm only five years later, killing its designer, who was on the rock at the time.
      A second wooden tower burned down in 1755.

      C
      The third Eddystone lighthouse, designed by the engineer John Smeaton and completed in 1759, set the pattern for those that followed.
      Smeaton studied the shape of oak trees, which survive storms because their trunks widen towards the base, and gave his tower a similar curved profile.
      He built it from blocks of granite cut so that each one locked into its neighbours, and he developed a new kind of lime mortar that would set hard even under water.
      The tower stood for more than a century, until the rock beneath it began to crack; it was then taken down and rebuilt on land in the city of Plymouth, where it can still be visited.

      D
      Just as important as the tower was the light itself.
      Early lighthouses burned wood, coal or candles, and much of their light was wasted, shining upwards or inland.
      In 1822, the French physicist Augustin Fresnel designed a new kind of lens made of rings of glass prisms, which gathered light from a single lamp and bent it into a powerful horizontal beam.
      Fresnel lenses allowed lights to be seen from more than thirty kilometres away, and they were soon installed in lighthouses around the world.

      E
      To prevent confusion between neighbouring lighthouses, each was given its own pattern, known as its character.
      One light might flash once every five seconds, another twice every fifteen seconds, and a third might show a steady light that changed colour.
      Sailors could identify each lighthouse by consulting a published list, and so work out their position even when no land could be seen.

      F
      For most of their history, lighthouses depended on keepers.
      They lit the lamps at sunset, trimmed the wicks through the night to stop them smoking, wound the clockwork that turned the lens and kept the glass spotlessly clean.
      On remote rock stations, keepers usually worked in teams of three, spending several weeks at a time cut off from the mainland, and storms could delay their relief for days.
      Many found the isolation hard, although others valued the quiet and the sense of doing important work.

      G
      In the twentieth century, electric lamps, automatic switches and radio communication gradually made keepers unnecessary.
      In Britain, the last staffed lighthouse was automated in 1998, and the same process has taken place in most other countries.
      Today, lights are monitored from control centres, and satellite navigation means that many ships rarely rely on them at all.
      Yet lighthouses continue to operate around the world, as a backup when electronic systems fail, and many of the old towers have found new lives as museums and holiday homes.
    `,
    groups: [
      notes(
        'The development of lighthouses',
        1,
        [
          '# Eddystone',
          '- the first tower was [[wooden]] and was destroyed by a storm',
          '- Smeaton copied the shape of [[oak]] trees',
          '- his granite blocks [[locked]] into one another',
          '- his tower was later rebuilt in [[Plymouth]]',
          '# Lights',
          '- Fresnel’s lens was made of rings of glass [[prisms]]',
          '- each lighthouse had a pattern called its [[character]]',
          '# Keepers',
          '- on rock stations, usually worked in teams of [[three]]',
        ],
        [
          ['B3', 'The first lighthouse was “a wooden tower completed in 1698”, destroyed in a storm five years later.'],
          ['C2', 'Smeaton “studied the shape of oak trees”.'],
          ['C3', 'Blocks were cut “so that each one locked into its neighbours”.'],
          ['C4', 'The tower was “rebuilt on land in the city of Plymouth”.'],
          ['D3', 'Fresnel’s lens was “made of rings of glass prisms”.'],
          ['E1', 'Each lighthouse had its own pattern, “known as its character”.'],
          ['F3', 'Keepers “usually worked in teams of three”.'],
        ],
        { number: true },
      ),
      tfng([
        ['The Pharos of Alexandria was the tallest structure of the ancient world.', 'F', 'A3', 'It was “one of the tallest structures”, not the tallest.'],
        ['The designer of the first Eddystone lighthouse died when it was destroyed.', 'T', 'B3', 'The storm destroyed it, “killing its designer, who was on the rock at the time”.'],
        ['Smeaton’s mortar could harden in wet conditions.', 'T', 'C3', 'It “would set hard even under water”.'],
        ['Fresnel’s lens required several lamps to produce its beam.', 'F', 'D3', 'It gathered light “from a single lamp”.'],
        ['Most keepers disliked working on remote rock stations.', 'NG', 'F4', '“Many found the isolation hard, although others valued the quiet.” No proportion is given.'],
        ['Lighthouses are no longer used now that ships have satellite navigation.', 'F', 'G4', 'Lighthouses “continue to operate around the world, as a backup”.'],
      ]),
    ],
  }),

  passage({
    title: 'Farming Upwards',
    sub: 'Indoor farms stacked floor upon floor promise fresh food in the heart of the city. Their record so far is mixed.',
    text: `
      A
      In a warehouse on the edge of a large city, rows of lettuces grow on shelves that rise almost to the ceiling.
      There is no soil and no sunlight; the plants sit in trays through which water enriched with nutrients is pumped, and they are lit by strips of pink and blue light.
      Temperature, humidity and even the level of carbon dioxide in the air are controlled by computers.
      This is vertical farming, and its supporters believe it could transform the way cities are fed.

      B
      The arguments in its favour are considerable.
      Because the plants are grown indoors, they are protected from bad weather, pests and disease, and crops can be harvested all year round.
      Most vertical farms use no pesticides at all.
      Water is recycled within the system, so that far less is needed than in conventional agriculture, and because the farms can be built inside cities, fresh produce can reach shops within hours of being picked, cutting the cost and pollution of long-distance transport.
      Stacking crops in layers also means that a small building can produce as much as many hectares of open fields.

      C
      The idea is not entirely new.
      Greenhouses have allowed farmers to control growing conditions for centuries, and growing plants in water rather than soil, known as hydroponics, has been practised commercially for decades.
      What has made vertical farming possible on a large scale is the falling cost of light-emitting diodes, or LEDs.
      Unlike older forms of lighting, LEDs produce little heat and can be tuned to the particular colours of light that plants use most efficiently, which is why many indoor farms glow pink.

      D
      Even so, light remains the industry’s greatest weakness.
      Sunlight is free, whereas electric light is not, and the energy needed to light and cool a vertical farm is enormous.
      In regions where electricity is expensive or produced mainly from fossil fuels, the environmental benefits of saving water and transport may be outweighed by the emissions from the power station.
      When energy prices rose sharply in the early 2020s, several well-funded vertical farming companies were forced to close.

      E
      The range of crops that can be grown profitably is also limited.
      Leafy greens such as lettuce and spinach, along with herbs like basil, are ideal: they grow quickly, need relatively little light and can be sold at high prices.
      Staple crops such as wheat, rice and potatoes are a different matter.
      They require far more light and space for the value they produce, and growing them indoors would cost many times more than growing them in fields.
      For the foreseeable future, therefore, vertical farms are unlikely to replace conventional agriculture as a source of basic foods.

      F
      Supporters argue that the technology is still young and that costs will continue to fall.
      Some companies are experimenting with robots to plant and harvest crops, reducing labour costs, while others are building farms next to sources of cheap renewable energy.
      Researchers are also developing varieties of plants suited to indoor conditions, such as compact fruit trees and fast-growing strawberries.

      G
      The most realistic future may be one in which vertical farms complement rather than replace traditional farming.
      In places with little fertile land or water, such as desert cities and remote northern communities, indoor farms already offer a way of producing fresh vegetables that would otherwise have to be imported over long distances.
      Elsewhere, they may find a role producing high-value crops close to the people who eat them.
    `,
    groups: [
      headings(
        [
          'The technology that made large-scale indoor farming possible',
          'Robots replacing farm workers',
          'A description of a farm without soil or sun',
          'Benefits claimed for growing food indoors',
          'The high cost of artificial light',
          'Crops that do and do not suit indoor farming',
          'A role alongside traditional agriculture',
          'Why governments have banned vertical farms',
        ],
        [
          ['A', 'iii', 'A2', 'Paragraph A describes the warehouse farm: “There is no soil and no sunlight.”'],
          ['B', 'iv', 'B1', '“The arguments in its favour are considerable”, followed by a list of benefits.'],
          ['C', 'i', 'C3', '“What has made vertical farming possible on a large scale is the falling cost of… LEDs.”'],
          ['D', 'v', 'D1 D2', '“Light remains the industry’s greatest weakness… the energy needed to light and cool a vertical farm is enormous.”'],
          ['E', 'vi', 'E1 E2 E3', 'Leafy greens are ideal, but staple crops “are a different matter”. Heading ii is a detail of F, not this paragraph.'],
          ['G', 'vii', 'G1', 'Vertical farms may “complement rather than replace traditional farming”.'],
        ],
      ),
      choose2(
        'Which TWO advantages of vertical farms are mentioned in paragraph B?',
        [
          'Crops can be grown in every season.',
          'Farm workers are paid higher wages.',
          'Plants grow larger than in fields.',
          'Less water is required.',
          'Vegetables stay fresh for longer once picked.',
        ],
        ['A', 'D'],
        [
          ['B2', '“Crops can be harvested all year round.”'],
          ['B4', '“Far less is needed than in conventional agriculture”: water is recycled. Produce reaches shops quickly, but nothing says it stays fresh longer.'],
        ],
      ),
      choose2(
        'Which TWO methods do companies use to try to reduce costs, according to paragraph F?',
        [
          'building farms in desert cities',
          'using robots for planting and harvesting',
          'growing crops in soil instead of water',
          'locating farms near cheap renewable energy',
          'selling crops directly to customers',
        ],
        ['B', 'D'],
        [
          ['F2', 'Companies “are experimenting with robots to plant and harvest crops, reducing labour costs”.'],
          ['F2', 'Others “are building farms next to sources of cheap renewable energy”.'],
        ],
      ),
      summary(
        'The limits of vertical farming',
        1,
        `Vertical farms use huge amounts of [[energy]] for lighting and cooling, and several companies closed when prices rose.
        They are well suited to leafy greens and [[herbs]], but staple crops such as wheat need much more light and space.
        Indoor farms are most useful in places with little fertile land, such as [[desert]] cities and remote northern communities.`,
        [
          ['D2', '“The energy needed to light and cool a vertical farm is enormous.”'],
          ['E2', 'Leafy greens “along with herbs like basil, are ideal”.'],
          ['G2', 'Places with little fertile land or water, “such as desert cities and remote northern communities”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'Measuring What Matters',
    sub: 'For eighty years, nations have judged their progress by how much they produce. Should they be measuring happiness instead?',
    text: `
      A
      Every few months, governments around the world publish figures for gross domestic product, or GDP, the total value of the goods and services produced in their country.
      When GDP rises, politicians celebrate; when it falls, newspapers warn of recession.
      Few statistics have more influence on public policy.
      Yet from the very beginning, economists have warned that GDP was never designed to measure how well people’s lives are going.

      B
      The economist who developed the first national income accounts for the United States in the 1930s was himself cautious about how they might be used.
      He pointed out that the welfare of a nation could hardly be inferred from a measure of national income.
      GDP counts the money spent on cleaning up after a disaster as a gain, but ignores unpaid work such as caring for children or elderly relatives.
      It takes no account of how income is shared, so that a country’s total can rise even if most of its people become poorer.
      And it treats the destruction of forests or fisheries as income rather than as the loss of a valuable resource.

      C
      In the 1970s, the young king of Bhutan, a small country in the Himalayas, famously declared that ‘gross national happiness’ was more important than gross national product.
      The phrase attracted attention around the world, and Bhutan later developed a detailed index that measures wellbeing across areas such as health, education, community life, culture and the environment.
      Critics have pointed out that Bhutan remains a poor country with serious social problems, but the idea that governments should measure wellbeing directly has spread widely.

      D
      Since 2012, an annual World Happiness Report has ranked countries according to how people evaluate their own lives.
      The rankings are based on surveys in which respondents imagine a ladder with steps numbered from zero to ten, the top representing the best possible life for them, and say on which step they feel they stand.
      Nordic countries such as Finland and Denmark regularly appear near the top, while countries affected by war and severe poverty are usually near the bottom.

      E
      The relationship between money and happiness, however, is not simple.
      In the 1970s, an American economist observed that, although richer people within a country tended to be happier than poorer people, average happiness in the United States had not risen over several decades in which incomes had grown considerably.
      This puzzle, known as the Easterlin paradox, has been debated ever since.
      One explanation is that people judge their income by comparing it with that of others around them, so that when everyone becomes richer, nobody feels much better off.
      Another is that people quickly become used to improvements in their circumstances, a process psychologists call adaptation.

      F
      Not everyone is convinced that happiness should guide policy.
      Dr Paul Ashworth, an economist, argues that surveys of happiness are too unreliable to be the basis for decisions, since answers can be affected by the weather on the day or by the order of the questions.
      Professor Mei Lin, a philosopher, raises a different objection: she believes that governments should provide the conditions for people to live well, such as health care and education, but that it is not their role to make people happy.
      Dr Sofia Petrov, who advises governments on statistics, takes a middle position, arguing that wellbeing measures should be used alongside GDP rather than instead of it.

      G
      Several countries have followed her advice.
      New Zealand introduced a ‘wellbeing budget’ in 2019, requiring government departments to show how their spending would improve areas such as mental health and child poverty, and other governments now publish regular wellbeing statistics.
      Dr Tom Okafor, who has evaluated such programmes, believes their greatest value lies not in any single number but in forcing politicians to think about aspects of life that GDP leaves out.
    `,
    groups: [
      mcq([
        [
          'What does the writer say about GDP in paragraph A?',
          ['It is published less often than other statistics.', 'It has a great influence on government decisions.', 'It was designed to measure wellbeing.', 'It is rarely reported in newspapers.'],
          'B',
          'A3',
          '“Few statistics have more influence on public policy.” C contradicts A4.',
        ],
        [
          'Which of the following is a criticism of GDP mentioned in paragraph B?',
          ['It is difficult to calculate accurately.', 'It ignores work that is not paid.', 'It is affected by changes in the weather.', 'It underestimates the wealth of poor countries.'],
          'B',
          'B3',
          'GDP “ignores unpaid work such as caring for children or elderly relatives”. The weather (C) relates to happiness surveys in F.',
        ],
        [
          'What is the writer’s purpose in mentioning Bhutan’s problems?',
          ['to show that its approach has been widely rejected', 'to present a criticism of its approach', 'to explain why its king changed policy', 'to compare it with the Nordic countries'],
          'B',
          'C3',
          '“Critics have pointed out that Bhutan remains a poor country with serious social problems”: a criticism, although the idea “has spread widely”, so A is wrong.',
        ],
        [
          'In the World Happiness Report surveys, people are asked to',
          ['compare their lives with those of their neighbours.', 'describe how happy they felt on the previous day.', 'rate their own lives on a scale from zero to ten.', 'list the things that make them happy.'],
          'C',
          'D2',
          'Respondents imagine a ladder “with steps numbered from zero to ten” and say where they stand.',
        ],
        [
          'According to paragraph E, the Easterlin paradox refers to the fact that',
          ['poor people are often happier than rich people.', 'happiness in a country did not rise as incomes rose.', 'people in rich countries work longer hours.', 'incomes rose more slowly than expected.'],
          'B',
          'E2 E3',
          'Average happiness “had not risen over several decades in which incomes had grown considerably”.',
        ],
      ]),
      features(
        ['person', 'people'],
        ['Paul Ashworth', 'Mei Lin', 'Sofia Petrov', 'Tom Okafor'],
        [
          ['Wellbeing data should supplement traditional economic statistics.', 'C', 'F4', 'Petrov: wellbeing measures “should be used alongside GDP rather than instead of it”.'],
          ['Making citizens happy is not a government’s responsibility.', 'B', 'F3', 'Lin: “it is not their role to make people happy”.'],
          ['Wellbeing measures encourage politicians to consider a wider range of issues.', 'D', 'G3', 'Okafor: their value lies in “forcing politicians to think about aspects of life that GDP leaves out”.'],
          ['People’s answers about happiness can be influenced by minor factors.', 'A', 'F2', 'Ashworth: answers “can be affected by the weather on the day or by the order of the questions”.'],
        ],
      ),
      ynng([
        ['GDP can increase even when most citizens become worse off.', 'Y', 'B4', '“A country’s total can rise even if most of its people become poorer.”'],
        ['Bhutan’s index measures only people’s income and health.', 'N', 'C2', 'It measures wellbeing across “health, education, community life, culture and the environment”.'],
        ['Finland has topped the World Happiness Report every year since 2012.', 'NG', 'D3', 'Nordic countries “regularly appear near the top”, but no year-by-year record is given.'],
        ['People quickly get used to better living conditions.', 'Y', 'E5', 'People “quickly become used to improvements in their circumstances”.'],
        ['New Zealand’s wellbeing budget has reduced child poverty.', 'NG', 'G2', 'The budget requires departments to show how spending would improve child poverty, but its results are not reported.'],
      ]),
    ],
  }),
])
