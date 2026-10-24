import { choose2, features, headings, mcq, passage, sentences, summary, test, tfng, ynng } from '../build'

export default test('full-11', [
  passage({
    title: 'Reading with the Fingertips',
    sub: 'A blind teenager in nineteenth-century Paris invented a writing system that is now used all over the world.',
    text: `
      A
      Louis Braille was born in 1809 in a small town east of Paris, where his father made harnesses and saddles for horses.
      At the age of three, while playing in his father’s workshop, he injured one of his eyes with a sharp tool.
      The wound became infected, the infection spread to his other eye, and by the age of five he was completely blind.
      In an era when blind children rarely received any education, his parents were determined that he should learn, and he attended the village school, where he proved an exceptional pupil.

      B
      At the age of ten, Louis won a place at the Royal Institute for Blind Youth in Paris, one of the first schools of its kind in the world.
      Its founder had developed a method of printing books with raised letters that pupils could trace with their fingers.
      The books, however, were enormous and heavy, each letter had to be felt one by one, and reading was painfully slow.
      Worse still, the pupils had no practical way of writing in the same form, since producing raised letters required special printing equipment.

      C
      In 1821, a former army officer, Charles Barbier, visited the school to demonstrate a system he had designed.
      Known as ‘night writing’, it represented sounds with patterns of raised dots punched into card, and it had been intended to allow soldiers to read messages in the dark without lighting a lamp that might reveal their position.
      The army had rejected it as too complicated, but Barbier hoped it might be useful to the blind.
      His system used cells of up to twelve dots, too many to be felt with a single touch of the finger, and it represented sounds rather than letters, so that spelling and punctuation were impossible.

      D
      The young Louis Braille immediately saw the potential of dots and set about improving the system.
      By the age of fifteen, he had developed a much simpler code based on a cell of just six dots, arranged in two columns of three.
      Each cell was small enough to be felt with one fingertip, and the sixty-three possible combinations of dots were enough to represent every letter, number and punctuation mark, as well as musical notation.
      Crucially, the system could be written by hand using a simple frame and a pointed tool.
      Braille published a description of his method in 1829.

      E
      Recognition came slowly.
      Many sighted teachers at the institute preferred the raised-letter system because they could read it themselves, and for a time the use of Braille’s code was actually forbidden at the school, although pupils continued to use it in secret.
      Braille became a teacher at the institute and spent the rest of his life there, but he suffered from poor health and died in 1852 at the age of forty-three.
      It was only two years after his death that the school officially adopted his system.

      F
      From there it spread around the world, adapted to many languages and writing systems.
      Today, braille is used for books, signs, lift buttons and medicine packets, and refreshable braille displays allow blind users to read text from computers and phones, with small pins rising and falling to form each character.
      Some campaigners worry that the growth of audio books and text-to-speech software is reducing the number of blind people who learn braille, which they argue is essential for full literacy, including spelling and the ability to read independently.
    `,
    groups: [
      sentences(2, [
        ['Louis Braille’s father made harnesses and [[saddles]] for horses.', 'A1', 'His father “made harnesses and saddles for horses”.'],
        ['The books at the Institute were very large and [[heavy]].', 'B3', 'The books “were enormous and heavy”.'],
        ['Barbier’s system was designed so that soldiers could read in the [[dark]].', 'C2', 'It allowed soldiers “to read messages in the dark”.'],
        ['Barbier’s system was based on sounds, so [[spelling]] and punctuation could not be shown.', 'C4', 'It represented sounds, “so that spelling and punctuation were impossible”.'],
        ['Braille’s system could be written using a frame and a [[pointed tool]].', 'D4', 'It could be written “using a simple frame and a pointed tool”.'],
        ['Refreshable displays use small [[pins]] to form characters.', 'F2', '“Small pins rising and falling to form each character.”'],
      ]),
      tfng([
        ['Louis Braille lost his sight in both eyes as a result of the same accident.', 'T', 'A2 A3', 'He injured one eye, and the resulting infection spread to the other.'],
        ['Braille’s parents sent him to a special school for blind children at the age of five.', 'F', 'A4 B1', 'He attended the village school, and went to the Institute at ten.'],
        ['Pupils at the Institute could easily write using raised letters.', 'F', 'B4', 'They had “no practical way of writing in the same form”.'],
        ['The army used night writing successfully for several years.', 'F', 'C3', '“The army had rejected it as too complicated.”'],
        ['Braille’s code could be used to write music.', 'T', 'D3', 'The combinations could represent “musical notation”.'],
        ['Braille was paid well for his work as a teacher.', 'NG', 'E3', 'He became a teacher, but his pay is not mentioned.'],
        ['The Institute adopted Braille’s system during his lifetime.', 'F', 'E4', 'It adopted it “two years after his death”.'],
      ]),
    ],
  }),

  passage({
    title: 'The Return of the Beaver',
    sub: 'Hunted out of Britain centuries ago, the beaver is back, and its dams are changing rivers in ways that surprise even ecologists.',
    text: `
      A
      Beavers once lived along rivers throughout Britain, but they were hunted for their fur, their meat and a substance from their glands that was used in medicine and perfume.
      By the sixteenth century, they had disappeared completely.
      For more than four hundred years, British rivers developed without them, and people forgot how different a river with beavers can look.
      Over the past two decades, however, beavers have returned, partly through official reintroduction projects and partly through animals that escaped or were released without permission.

      B
      Beavers are famous for building dams.
      Using branches, mud and stones, they block streams to create ponds deep enough to protect the entrances to their homes from predators and to store food for the winter.
      A single family may build several dams along a stretch of stream, turning a narrow channel into a chain of pools and wetlands.
      Few other animals change their surroundings so dramatically, which is why beavers are often described as ecosystem engineers.

      C
      The effects on wildlife can be remarkable.
      Studies at sites where beavers have been reintroduced have recorded large increases in the number and variety of insects, amphibians, birds and bats.
      The ponds provide shelter for young fish, and the dead trees left standing in the water are used by woodpeckers and other birds.
      Ecologists who had expected some benefits were surprised by how quickly and how widely the changes spread.

      D
      Beaver dams also affect how water moves through a landscape.
      In a long-term study in south-west England, researchers measured the water flowing out of an area of farmland before and after beavers moved in.
      During storms, the peak flow leaving the site was significantly reduced, because the dams and ponds held back water and released it gradually.
      During dry periods, by contrast, the ponds continued to release water, helping to keep streams flowing.
      The dams also trapped soil washed off nearby fields, so that the water leaving the site was cleaner.

      E
      Not everyone welcomes the beaver’s return.
      Farmers have reported fields flooded by blocked drainage ditches, valuable trees felled and riverbanks damaged by burrowing.
      Some anglers fear that dams will prevent salmon and trout from swimming upstream to breed, although studies so far suggest that fish are usually able to pass.
      In areas where beavers cause serious problems, the law allows dams to be removed or the animals to be moved elsewhere, and in some cases they may be killed under licence.

      F
      Many conflicts can be managed with simple measures.
      Pipes can be installed through a dam to keep the water below a certain level, a technique that allows the dam to remain while preventing flooding of nearby land.
      Valuable trees can be protected by wrapping their trunks with wire mesh or painting them with a gritty mixture that beavers dislike chewing.
      Advisers argue that the key to success is to involve landowners early and to provide practical help when problems arise.

      G
      In 2020, the government in England allowed a wild population of beavers in Devon to remain permanently, the first time in centuries that a wild population of a native mammal had been legally accepted in England.
      Further releases have since been permitted.
      Whether beavers become a familiar sight across the country will depend not only on ecology but on whether people are prepared to share their rivers with them.
    `,
    groups: [
      headings(
        [
          'Unexpected gains for other species',
          'Why beavers vanished and how they came back',
          'Changes to the flow and quality of water',
          'The cost of official reintroduction projects',
          'Practical solutions to common problems',
          'An animal that reshapes its surroundings',
          'Complaints from people who use the land and rivers',
        ],
        [
          ['A', 'ii', 'A1 A4', 'Beavers were hunted until they disappeared, and have returned “over the past two decades”.'],
          ['B', 'vi', 'B3 B4', 'Beavers turn channels into pools and wetlands: “ecosystem engineers”.'],
          ['C', 'i', 'C2 C4', 'Large increases in insects, amphibians, birds and bats surprised ecologists.'],
          ['D', 'iii', 'D3 D5', 'Dams reduced peak flows and made the water cleaner.'],
          ['E', 'vii', 'E2 E3', 'Farmers and anglers report problems. Heading iv is never discussed.'],
          ['F', 'v', 'F1', '“Many conflicts can be managed with simple measures.”'],
        ],
      ),
      summary(
        'Managing conflict',
        1,
        `Pipes placed through a dam can stop nearby land from [[flooding]].
        Trees can be protected with wire mesh or with a [[gritty]] mixture that beavers do not like to chew.
        Advisers believe it is important to involve [[landowners]] from the start.`,
        [
          ['F2', 'Pipes keep water low, “preventing flooding of nearby land”.'],
          ['F3', 'Trees can be painted “with a gritty mixture that beavers dislike chewing”.'],
          ['F4', '“The key to success is to involve landowners early.”'],
        ],
      ),
      choose2(
        'Which TWO reasons for building dams are given in paragraph B?',
        ['to catch fish', 'to protect their homes from predators', 'to keep warm in winter', 'to store food', 'to attract a mate'],
        ['B', 'D'],
        [
          ['B2', 'Ponds are deep enough “to protect the entrances to their homes from predators”.'],
          ['B2', '…“and to store food for the winter”.'],
        ],
      ),
      choose2(
        'Which TWO effects of the beaver dams were recorded in the study in south-west England?',
        [
          'Less water left the site during storms.',
          'Fish were unable to swim upstream.',
          'Streams kept flowing in dry weather.',
          'Farmers’ crops grew more quickly.',
          'More soil was washed into the river.',
        ],
        ['A', 'C'],
        [
          ['D3', '“During storms, the peak flow leaving the site was significantly reduced.”'],
          ['D4', 'In dry periods, the ponds released water, “helping to keep streams flowing”. E is the opposite of D5.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'Paying with Our Attention',
    sub: 'Many of the most popular services on the internet are free. Critics argue that we pay for them in a different currency.',
    text: `
      A
      Most of the apps on a typical phone cost nothing to download.
      Social networks, video platforms, search engines and many games are free to use, yet the companies behind them are among the most valuable in the world.
      The explanation is simple: they earn their income mainly from advertising, and advertisers pay for access to users’ attention.
      The longer people spend using a service, the more advertisements they see, and the more data the company can collect to target those advertisements precisely.
      In this ‘attention economy’, the product being sold is, in effect, the user.

      B
      This business model creates a powerful incentive to keep people engaged for as long as possible.
      Dr Sarah Klein, a former designer at a technology company, describes how features are tested on millions of users and kept only if they increase the time people spend on an app.
      Endless scrolling, which removes natural stopping points, and videos that start playing automatically are among the most effective.
      ‘Nobody set out to make people unhappy,’ she says. ‘The goal was engagement, and the tools for measuring it became extraordinarily precise.’

      C
      Some critics compare these designs to the techniques used in gambling.
      Professor Tom Adeyemi, a psychologist, points out that notifications and feeds deliver rewards, such as messages, likes and interesting posts, at unpredictable intervals.
      Research on learning has long shown that unpredictable rewards are especially effective at encouraging repeated behaviour, which is why people check their phones dozens of times a day, often without thinking.

      D
      Others believe these concerns are overstated.
      Dr Julia Moretti, who studies the effects of technology on young people, notes that studies linking heavy phone use to anxiety and depression have mostly found small effects, and that it is difficult to establish whether phone use causes unhappiness or unhappy people simply use their phones more.
      She warns that exaggerated fears may distract attention from other causes of poor mental health, such as poverty and loneliness.

      E
      Whatever the size of the effects, there is growing pressure for change.
      Some governments have introduced rules limiting how companies can collect and use personal data, and several have proposed restrictions on features thought to be particularly harmful to children.
      Professor Ahmed Rashid, an economist, argues that more fundamental reform is needed: as long as companies earn more by holding attention, he believes, they will continue to design products that do so, whatever the rules on individual features.
      He suggests that services funded by subscriptions rather than advertising would have different incentives.

      F
      In the meantime, individuals have developed their own strategies.
      Some turn off notifications or switch their screens to black and white, which makes apps less visually appealing.
      Others keep their phones out of the bedroom or delete the apps they find hardest to resist.
      Research on these methods is still limited, but small studies suggest that simple changes can reduce the time people spend on their phones without making them feel cut off.

      G
      I do not think the answer lies in rejecting technology, which brings genuine benefits, from keeping in touch with distant friends to finding information instantly.
      But I believe we should recognise that attention is a limited resource, and that the companies competing for it are very good at what they do.
      Choosing where to spend our attention may be one of the most important decisions we make each day.
    `,
    groups: [
      mcq([
        [
          'According to paragraph A, how do most free apps make money?',
          ['by selling personal data to governments', 'by charging for extra features', 'by selling advertising', 'by sharing profits with users'],
          'C',
          'A3',
          'They “earn their income mainly from advertising”.',
        ],
        [
          'What does Sarah Klein say about the design of apps?',
          ['Designers intended to make users unhappy.', 'Features were kept if they increased usage.', 'Most features were tested on small groups.', 'Automatic videos proved unpopular.'],
          'B',
          'B2',
          'Features are “kept only if they increase the time people spend on an app”.',
        ],
        [
          'Why does Tom Adeyemi compare apps to gambling?',
          ['Both involve spending money.', 'Both offer rewards at unpredictable times.', 'Both are popular among young people.', 'Both are strictly regulated.'],
          'B',
          'C2',
          'Notifications and feeds “deliver rewards… at unpredictable intervals”.',
        ],
        [
          'What point does Julia Moretti make about research on phone use?',
          ['It has clearly proved that phones cause depression.', 'It shows that poor people use phones more.', 'It cannot easily show which factor causes the other.', 'It has mostly been carried out by technology companies.'],
          'C',
          'D2',
          'It is “difficult to establish whether phone use causes unhappiness or unhappy people simply use their phones more”.',
        ],
        [
          'What does the writer say in paragraph G?',
          ['People should stop using social networks.', 'Technology has both benefits and risks.', 'Companies will soon change their methods.', 'Attention is easier to control than people think.'],
          'B',
          'G1 G2',
          'Technology “brings genuine benefits”, but companies competing for attention “are very good at what they do”.',
        ],
      ]),
      features(
        ['person', 'people'],
        ['Sarah Klein', 'Tom Adeyemi', 'Julia Moretti', 'Ahmed Rashid'],
        [
          ['A different way of paying for services could change companies’ behaviour.', 'D', 'E4', 'Rashid: services funded by subscriptions “would have different incentives”.'],
          ['Too much focus on phones may lead people to ignore other problems.', 'C', 'D3', 'Moretti: exaggerated fears “may distract attention from other causes of poor mental health”.'],
          ['Companies became very good at measuring how people use their products.', 'A', 'B4', 'Klein: “the tools for measuring it became extraordinarily precise”.'],
          ['Rules about particular features will not be enough on their own.', 'D', 'E3', 'Rashid believes companies will keep holding attention “whatever the rules on individual features”.'],
        ],
      ),
      ynng([
        ['The companies behind free apps are often extremely valuable.', 'Y', 'A2', 'They “are among the most valuable in the world”.'],
        ['Endless scrolling encourages people to stop using an app.', 'N', 'B3', 'Endless scrolling “removes natural stopping points”.'],
        ['Most governments have banned features that are harmful to children.', 'NG', 'E2', 'Several governments “have proposed restrictions”; no bans are reported, and “most” is never discussed.'],
        ['Switching a screen to black and white can make apps less attractive.', 'Y', 'F2', 'It “makes apps less visually appealing”.'],
        ['People should give up using technology altogether.', 'N', 'G1', '“I do not think the answer lies in rejecting technology.”'],
      ]),
    ],
  }),
])
