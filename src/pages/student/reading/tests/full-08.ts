import { choose2, features, flow, info, mcq, passage, summary, test, tfng, ynng } from '../build'

export default test('full-08', [
  passage({
    title: 'The Box That Changed the World',
    sub: 'A plain steel container, invented by a trucking businessman, quietly reshaped the global economy.',
    text: `
      A
      Until the middle of the twentieth century, loading a cargo ship was slow, expensive and labour-intensive.
      Goods arrived at the docks in sacks, barrels, crates and bundles of every shape and size, and gangs of dockworkers carried them on board piece by piece, fitting them together in the hold as best they could.
      A large ship might spend a week or more in port being loaded and unloaded, and theft and damage were common.
      In many cases, the cost of handling goods at the ports was greater than the cost of carrying them across the ocean.

      B
      The man usually credited with changing this was Malcolm McLean, an American who had built up a successful trucking company.
      Frustrated by the hours his drivers spent waiting at the docks while their loads were transferred to ships, McLean wondered whether it would be possible to lift the whole trailer, or at least the box on top of it, straight onto a vessel.
      In 1956, he bought an old tanker, strengthened its deck and sent it from New Jersey to Texas carrying fifty-eight metal containers.

      C
      The economics were dramatic.
      Shortly afterwards, McLean calculated that loading cargo by container cost only a small fraction of the price of loading it by hand.
      Ships that had spent days in port could now be turned around in hours, and because containers were sealed, theft fell sharply.
      Other shipping companies soon began to design vessels specifically for containers, with cells into which the boxes could be slotted by cranes.

      D
      For the system to work internationally, however, containers had to be the same size everywhere.
      In the early 1960s, companies used boxes of many different dimensions, which could not be handled by each other’s cranes or ships.
      After years of difficult negotiations, international standards were agreed later in the decade, and the containers most widely used today are twenty or forty feet long, with standard fittings at each corner so that they can be locked onto ships, trains and lorries.

      E
      The new technology had enormous consequences for the world’s ports.
      Container ships needed deep water, large areas of flat land for storing boxes and good connections to roads and railways.
      Many traditional city-centre docks could not provide these, and they declined rapidly, while new container ports were built elsewhere.
      Tens of thousands of dockworkers lost their jobs, since a single crane operator could now do the work of a large gang.

      F
      The effects reached far beyond the docks.
      As the cost of transport fell, it became economical to make goods in one country, assemble them in another and sell them in a third.
      Factories no longer needed to be close to their customers, and manufacturers increasingly moved production to places where wages were lower.
      Many economists believe that containerisation did more to encourage international trade in the late twentieth century than all the trade agreements signed in the same period.

      G
      Today, container ships are among the largest vessels ever built, and the biggest can carry more than twenty thousand standard containers.
      Yet the system’s efficiency also makes it fragile.
      When a single large ship became stuck in the Suez Canal in 2021, blocking it for six days, the delays affected supply chains around the world, a reminder of how much of modern life now depends on the steel box.
    `,
    groups: [
      flow(
        'McLean’s idea and its results',
        1,
        [
          'McLean’s [[drivers]] waste hours waiting at the docks',
          'He converts an old [[tanker]] to carry containers',
          'Loading by container proves far cheaper; ships are turned around in hours',
          'Because containers are [[sealed]], less cargo is stolen',
          'Standard sizes are agreed, with fittings at each [[corner]]',
          'Many old city-centre docks [[declined]] as new ports were built',
        ],
        [
          ['B2', 'McLean was frustrated “by the hours his drivers spent waiting at the docks”.'],
          ['B3', 'In 1956 “he bought an old tanker, strengthened its deck” and loaded containers.'],
          ['C3', '“Because containers were sealed, theft fell sharply.”'],
          ['D3', 'Containers have “standard fittings at each corner”.'],
          ['E3', 'Many traditional city-centre docks “declined rapidly, while new container ports were built elsewhere”.'],
        ],
      ),
      tfng([
        ['Before containers, handling cargo in port could cost more than shipping it overseas.', 'T', 'A4', '“The cost of handling goods at the ports was greater than the cost of carrying them across the ocean.”'],
        ['McLean had worked as a ship’s captain before starting his trucking company.', 'NG', 'B1', 'Only his trucking company is mentioned.'],
        ['The first container voyage in 1956 carried more than one hundred containers.', 'F', 'B3', 'It carried “fifty-eight metal containers”.'],
        ['Other shipping companies were slow to adopt container ships.', 'F', 'C4', 'Other companies “soon began to design vessels specifically for containers”.'],
        ['International agreement on container sizes was reached quickly.', 'F', 'D3', 'It came “after years of difficult negotiations”.'],
        ['Container ports required good transport links on land.', 'T', 'E2', 'They needed “good connections to roads and railways”.'],
        ['Containerisation led to job losses among dockworkers.', 'T', 'E4', '“Tens of thousands of dockworkers lost their jobs.”'],
        ['The ship that blocked the Suez Canal in 2021 was the largest container ship in the world.', 'NG', 'G3', 'It was “a single large ship”; no comparison of size is made.'],
      ]),
    ],
  }),

  passage({
    title: 'Plague of Locusts',
    sub: 'An ordinary grasshopper can transform into one of the most destructive creatures on Earth. Scientists now understand how.',
    text: `
      A
      For most of the time, the desert locust is an unremarkable insect.
      It lives alone in the dry regions stretching from West Africa to India, is coloured to blend in with its surroundings and tends to avoid other locusts.
      In this solitary form, it does little harm.
      But when conditions change, it can undergo an astonishing transformation, becoming part of a swarm that may contain billions of insects and devastate crops across entire countries.

      B
      The trigger is crowding.
      After unusually heavy rains, plants grow quickly in the desert and locusts breed rapidly.
      When the vegetation dries out again, the insects are forced together on the remaining patches of green.
      Experiments have shown that repeated touching of the hind legs, which happens constantly in a crowd, is the key signal.
      Within a few hours, it causes a sharp rise in a chemical called serotonin in the locust’s nervous system, and the insect begins to seek out others rather than avoid them.
      Over the following days and generations, crowded locusts change colour, becoming yellow and black, and develop stronger muscles for long flights.

      C
      Once swarms form, they can travel up to around one hundred and fifty kilometres in a day, carried by the wind.
      Each locust eats roughly its own weight in fresh food every day, so that even a small swarm can consume as much food in a day as thousands of people.
      Swarms have crossed the Red Sea and, on rare occasions, the Atlantic Ocean.

      D
      Between 2019 and 2020, East Africa suffered its worst outbreak for decades.
      Unusual cyclones had brought heavy rain to the deserts of the Arabian Peninsula, creating ideal breeding conditions, and swarms spread into Ethiopia, Somalia and Kenya, where some farmers lost entire harvests.
      The outbreak coincided with the early months of the global pandemic, which disrupted the delivery of pesticides and equipment.

      E
      Controlling locusts relies mainly on early warning.
      An international monitoring service collects reports from teams in the field and combines them with satellite data showing where rain has fallen and vegetation is growing.
      If young locusts can be found and treated before they are able to fly, the chances of preventing a swarm are much higher.
      Once swarms are airborne, they are extremely difficult to stop.

      F
      Most control still uses chemical pesticides sprayed from vehicles or aircraft, but these can harm other wildlife and people living nearby.
      An alternative is a biological pesticide made from a fungus that infects and kills locusts but does not affect most other insects.
      It acts more slowly than chemicals, taking a week or more to kill the insects, which makes it less suitable once swarms are already destroying crops.

      G
      Researchers hope that a better understanding of the change from solitary to swarming behaviour may eventually lead to new methods of control.
      If the chemical signals involved could be blocked, it might be possible to stop locusts from forming swarms at all.
      For now, however, the most effective weapon remains vigilance: finding the first signs of crowding in remote deserts before the insects take to the air.
    `,
    groups: [
      info([
        ['a description of the physical changes that crowded locusts undergo', 'B', 'B6', 'Crowded locusts “change colour, becoming yellow and black, and develop stronger muscles”.'],
        ['an explanation of why one method is less useful at a later stage', 'F', 'F3', 'The fungus acts slowly, “which makes it less suitable once swarms are already destroying crops”.'],
        ['a reference to swarms crossing large areas of water', 'C', 'C3', 'Swarms “have crossed the Red Sea and, on rare occasions, the Atlantic Ocean”.'],
        ['an unrelated event that made a problem harder to deal with', 'D', 'D3', 'The pandemic “disrupted the delivery of pesticides and equipment”.'],
        ['a possible future method of preventing swarms', 'G', 'G2', 'Blocking the chemical signals might “stop locusts from forming swarms at all”.'],
      ]),
      summary(
        'How swarms begin',
        1,
        `Swarms usually follow periods of heavy [[rains]], which allow locusts to breed. When plants dry out, the insects are crowded together, and contact with their hind [[legs]] causes a rise in a chemical called [[serotonin]].
        As a result, locusts start to look for [[others]] instead of avoiding them.`,
        [
          ['B2', '“After unusually heavy rains, plants grow quickly in the desert and locusts breed rapidly.”'],
          ['B4', '“Repeated touching of the hind legs… is the key signal.”'],
          ['B5', 'It causes “a sharp rise in a chemical called serotonin”.'],
          ['B5', 'The insect “begins to seek out others rather than avoid them”.'],
        ],
      ),
      choose2(
        'Which TWO facts about locust swarms are given in paragraph C?',
        [
          'They can cover around 150 kilometres in a day.',
          'They usually fly at night.',
          'Each insect eats about its own weight daily.',
          'They avoid travelling over the sea.',
          'They are attracted to cities.',
        ],
        ['A', 'C'],
        [
          ['C1', 'Swarms “can travel up to around one hundred and fifty kilometres in a day”.'],
          ['C2', '“Each locust eats roughly its own weight in fresh food every day.” D is wrong: they have crossed seas.'],
        ],
      ),
      choose2(
        'Which TWO sources of information does the monitoring service use?',
        ['reports from farmers’ markets', 'satellite data', 'weather balloons', 'reports from teams in the field', 'records kept by airlines'],
        ['B', 'D'],
        [
          ['E2', 'It combines field reports “with satellite data showing where rain has fallen”.'],
          ['E2', 'It “collects reports from teams in the field”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'The Uses of Nostalgia',
    sub: 'Once classified as a dangerous illness, longing for the past is now seen by many psychologists as a source of strength.',
    text: `
      A
      In 1688, a Swiss medical student wrote a thesis describing a strange illness that affected soldiers serving far from home.
      Its victims became sad and listless, lost their appetite and, in some cases, were said to die of their condition.
      He gave it a name formed from the Greek words for ‘homecoming’ and ‘pain’: nostalgia.
      For the next two centuries, doctors regarded nostalgia as a disease, and various cures were proposed, some of them harsh.

      B
      By the twentieth century, the meaning of the word had changed.
      Nostalgia came to refer not to homesickness but to a sentimental longing for the past, and it was widely regarded as a weakness: a refusal to accept change, or a retreat from present difficulties into an idealised memory.
      Even in recent decades, it has often been dismissed as harmless at best and, at worst, as a sign of an inability to move on.

      C
      Over the past twenty years, however, psychologists have begun to take a very different view.
      In a series of studies, Professor Daniel Harte and his colleagues asked volunteers to recall a nostalgic memory, or an ordinary one, and then measured their mood and attitudes.
      Those who had recalled nostalgic events consistently reported feeling more connected to other people, more optimistic about the future and more confident that their lives had meaning.
      Harte argues that, far from being an escape from life, nostalgia helps people to cope with it.

      D
      One of the most consistent findings is that nostalgia is triggered by negative feelings, especially loneliness.
      Dr Sara Lindgren found that volunteers who were made to feel lonely, for example by being told that they had scored highly on a test of loneliness, became more nostalgic, and that nostalgia in turn increased their sense of being supported by others.
      In her view, the mind turns to memories of close relationships when present relationships seem lacking, rather as the body shivers when it is cold.

      E
      Remarkably, the link with cold may be more than a metaphor.
      In experiments led by Dr Kenji Mori, people sitting in a chilly room reported more nostalgic feelings than those in a warm one, and people who were asked to recall nostalgic memories later estimated the room temperature as higher and could keep their hands in icy water for longer.
      Mori suggests that nostalgia may provide a kind of psychological warmth, though he admits that the physical effects found so far are small.

      F
      Not everyone shares this enthusiasm.
      Dr Rachel Abbot warns that nostalgia can be bittersweet, and that for some people, especially those who are already anxious, dwelling on the past increases sadness rather than relieving it.
      She also notes that collective nostalgia, a longing for a supposedly better past shared by a whole society, can be exploited by advertisers and politicians to sell products or ideas.
      Professor Marco Bellini, a historian, adds that nostalgic memories are often selective, and that a romantic image of the past can make people less willing to recognise its injustices.

      G
      Most researchers now agree that nostalgia is neither a disease nor simply a pleasant indulgence.
      It appears to be a normal part of human psychology, used by people in every culture studied, that helps to connect the person we were with the person we have become.
      Like most psychological resources, its value depends on how it is used.
    `,
    groups: [
      mcq([
        [
          'What does paragraph A say about nostalgia in the seventeenth century?',
          ['It was first noticed among sailors.', 'It was believed to be capable of causing death.', 'It was treated mainly with rest.', 'It was named by an experienced doctor.'],
          'B',
          'A2',
          'Some victims “were said to die of their condition”. The name came from a student, so D is wrong.',
        ],
        [
          'How was nostalgia regarded for much of the twentieth century?',
          ['as a form of homesickness', 'as a sign of weakness', 'as a useful way of coping', 'as a serious illness'],
          'B',
          'B2',
          'It “was widely regarded as a weakness”.',
        ],
        [
          'What did Harte’s volunteers report after recalling nostalgic memories?',
          ['They felt more anxious about the future.', 'They wanted to change their lives.', 'They felt closer to other people.', 'They remembered fewer ordinary events.'],
          'C',
          'C3',
          'They reported “feeling more connected to other people”.',
        ],
        [
          'What is the writer’s conclusion in paragraph G?',
          ['Nostalgia is harmful for most people.', 'Nostalgia is mainly found in Western cultures.', 'The benefits of nostalgia depend on how people use it.', 'More research is needed before conclusions can be drawn.'],
          'C',
          'G3',
          '“Its value depends on how it is used.” It is used “in every culture studied”, so B is wrong.',
        ],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Daniel Harte', 'Sara Lindgren', 'Kenji Mori', 'Rachel Abbot', 'Marco Bellini'],
        [
          ['Nostalgia may make people overlook the unfair aspects of the past.', 'E', 'F4', 'Bellini: a romantic image “can make people less willing to recognise its injustices”.'],
          ['The evidence for a physical effect of nostalgia is limited so far.', 'C', 'E3', 'Mori “admits that the physical effects found so far are small”.'],
          ['Nostalgia can be used to persuade people to buy things.', 'D', 'F3', 'Abbot: collective nostalgia “can be exploited by advertisers”.'],
          ['Nostalgia works in a similar way to a physical reaction to cold.', 'B', 'D3', 'Lindgren: the mind turns to memories “rather as the body shivers when it is cold”.'],
          ['Nostalgia helps people deal with life rather than avoid it.', 'A', 'C4', 'Harte: “far from being an escape from life, nostalgia helps people to cope with it”.'],
        ],
      ),
      ynng([
        ['The word ‘nostalgia’ was created from Latin.', 'N', 'A3', 'It was formed “from the Greek words for ‘homecoming’ and ‘pain’”.'],
        ['Some early treatments for nostalgia were unpleasant.', 'Y', 'A4', 'Various cures were proposed, “some of them harsh”.'],
        ['Loneliness is one of the main triggers of nostalgia.', 'Y', 'D1', 'Nostalgia “is triggered by negative feelings, especially loneliness”.'],
        ['Anxious people benefit from nostalgia more than others.', 'N', 'F2', 'For anxious people, “dwelling on the past increases sadness rather than relieving it”.'],
        ['Older people experience nostalgia more often than younger people.', 'NG', 'G2', 'Nostalgia is described as universal, but age is never discussed.'],
      ]),
    ],
  }),
])
