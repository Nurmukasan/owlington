import { endings, info, mcq, passage, short, summary, table, test, tfng, ynng } from '../build'

export default test('full-06', [
  passage({
    title: 'How the Cat Moved In',
    sub: 'Dogs were tamed by people. Cats, it seems, largely tamed themselves.',
    text: `
      A
      Hundreds of millions of cats live alongside people today, more than any other pet in many countries.
      Yet for a long time, remarkably little was known about how and when cats came to share our homes.
      Unlike dogs, which were bred by humans for hunting, guarding and herding, cats perform few obvious tasks, and most breeds look much like their wild ancestors.
      Over the past two decades, however, archaeology and genetics have together produced a far clearer picture.

      B
      Genetic studies show that all domestic cats descend from a single wild subspecies, the African wildcat, which still lives across North Africa and the Middle East.
      This small, sandy-coloured animal looks very like a tabby house cat, and the two can still interbreed.
      The question is how a solitary, territorial hunter came to live with humans at all.

      C
      The answer seems to lie in the beginning of farming.
      Around ten thousand years ago, people in the region known as the Fertile Crescent, stretching from modern Iraq to the eastern Mediterranean, began growing cereals and storing grain.
      These stores attracted mice and rats, and the rodents in turn attracted wildcats.
      Cats that were less fearful of humans could take advantage of this new supply of food, and farmers had good reason to tolerate animals that protected their harvests.
      Over many generations, the bolder cats became the ancestors of domestic ones.
      In this sense, cats were not so much domesticated by people as domesticated by circumstances.

      D
      The earliest evidence of a close relationship comes from the island of Cyprus.
      There, archaeologists found a grave around 9,500 years old in which a person had been buried with a young cat lying beside them.
      Since there are no native wild cats on Cyprus, the animal must have been brought by boat, which suggests that people already valued cats enough to transport them.

      E
      Cats later held a special place in ancient Egypt.
      They were associated with a goddess, and killing a cat could be punished severely.
      Hundreds of thousands of cats were mummified and buried in temple cemeteries, often as offerings.
      A genetic study of ancient cat remains published in 2017 found that cats spread from the Near East in two waves: first with early farmers into Europe, and later from Egypt, when Egyptian cats were carried along trade routes by ships, probably to control rodents on board.

      F
      Despite thousands of years of living with people, cats have changed surprisingly little.
      The same 2017 study found that the striped coat of the wildcat remained the norm until the Middle Ages, when cats with a blotched tabby pattern became common.
      Most of the distinctive breeds known today, from long-haired Persians to hairless Sphynx cats, were developed only in the last 150 years or so, following the first organised cat shows in the late nineteenth century.

      G
      This history may explain why cats often seem more independent than dogs.
      They have kept much of their wild behaviour, including their hunting instinct, and many pet cats that are allowed outdoors still catch large numbers of birds and small mammals, a habit that worries conservationists in some countries.
      Researchers continue to debate how far cats can be said to be truly domesticated, but there is no doubt about their success: having found a place in human settlements thousands of years ago, they have spread to almost every corner of the world.
    `,
    groups: [
      table(
        'Key stages in the history of the domestic cat',
        2,
        ['Time', 'Place', 'Evidence or event'],
        [
          ['around 10,000 years ago', 'Fertile Crescent', 'grain stores attracted [[rodents]] and then wildcats'],
          ['around 9,500 years ago', '[[Cyprus]]', 'a person buried with a young cat'],
          ['ancient Egypt', 'temple cemeteries', 'huge numbers of cats were [[mummified]]'],
          ['later', 'trade routes', 'cats taken on [[ships]] to control rodents'],
          ['Middle Ages', 'Europe and elsewhere', 'cats with a [[blotched tabby]] pattern became common'],
          ['late 19th century', '—', 'first organised [[cat shows]]; most modern breeds developed'],
        ],
        [
          ['C3', 'The grain stores “attracted mice and rats, and the rodents in turn attracted wildcats”.'],
          ['D1', 'The earliest evidence “comes from the island of Cyprus”.'],
          ['E3', '“Hundreds of thousands of cats were mummified.”'],
          ['E4', 'Egyptian cats “were carried along trade routes by ships, probably to control rodents on board”.'],
          ['F2', 'In the Middle Ages, “cats with a blotched tabby pattern became common”.'],
          ['F3', 'Modern breeds followed “the first organised cat shows in the late nineteenth century”.'],
        ],
      ),
      tfng([
        ['In many countries, cats are the most common pet.', 'T', 'A1', 'There are “more than any other pet in many countries”.'],
        ['Domestic cats are descended from several different wild subspecies.', 'F', 'B1', 'They “descend from a single wild subspecies”.'],
        ['The African wildcat and the domestic cat are able to breed together.', 'T', 'B2', '“The two can still interbreed.”'],
        ['Early farmers deliberately caught wildcats to protect their grain.', 'F', 'C4 C6', 'The bolder cats took advantage of the food and farmers “tolerate[d]” them: cats were domesticated “by circumstances”, not deliberately captured.'],
        ['The cat buried on Cyprus had been killed for the burial.', 'NG', 'D2', 'A young cat lay beside the person, but nothing says how it died.'],
        ['In ancient Egypt, harming a cat could lead to serious punishment.', 'T', 'E2', '“Killing a cat could be punished severely.”'],
        ['Cats kept outdoors no longer hunt wild animals.', 'F', 'G2', 'Many “still catch large numbers of birds and small mammals”.'],
      ]),
    ],
  }),

  passage({
    title: 'Half Asleep',
    sub: 'Some animals can rest one half of the brain while the other stays awake. Humans may do something similar.',
    text: `
      A
      For most land mammals, including humans, sleep is an all-or-nothing affair: the whole brain switches into a different state, the eyes close and the body becomes still.
      Sleep is essential, but it is also dangerous, since a sleeping animal cannot watch for predators.
      Some species have found a remarkable solution to this problem.
      They are able to sleep with only one half of the brain at a time, keeping the other half awake and alert.

      B
      This ability, known as unihemispheric sleep, was first studied in detail in dolphins.
      Because dolphins breathe air, they must rise to the surface regularly, and they cannot afford to lose consciousness completely in the water.
      Recordings of their brain activity show that one half of the brain enters deep sleep while the other remains awake, and after a period the two halves swap.
      During this time the dolphin usually keeps swimming slowly, and the eye connected to the waking half of the brain stays open.

      C
      Birds use the same strategy, often in a particularly clever way.
      In one study of ducks resting in a row, the birds at each end of the line spent much more time sleeping with one eye open than those in the middle, and they kept the open eye turned away from the group, towards the direction from which a predator would come.
      The ducks in the middle, protected by their neighbours, could more often afford to sleep with both halves of the brain at once.

      D
      Perhaps the most extraordinary example comes from frigatebirds, large seabirds that spend weeks at a time flying over the ocean without landing.
      Scientists had long wondered whether these birds slept in the air.
      To find out, researchers fitted small devices to the heads of frigatebirds to record their brain activity during long flights.
      The results showed that the birds did sleep while flying, usually with one half of the brain at a time, but only for a few seconds at a time, and for a total of less than an hour a day.
      On land, the same birds slept for more than twelve hours a day.

      E
      Some seals can switch between the two forms of sleep depending on where they are.
      When fur seals sleep on land, they sleep like most mammals, with both halves of the brain.
      In the water, however, they switch to sleeping with one half at a time, keeping one flipper moving to maintain their position and holding their heads above the surface.

      F
      Humans cannot sleep with half of the brain in the same way, but recent research suggests we may have a weaker version of the ability.
      Many people sleep badly on their first night in an unfamiliar place, a well-known effect that sleep researchers must take into account when they study volunteers in laboratories.
      Scientists examining this ‘first-night effect’ found that, during deep sleep, the left half of the brain remained more active than the right, and responded more strongly to unusual sounds.
      Volunteers also woke up more quickly when an unusual sound was played to the more alert side.
      On the following nights, the difference between the two halves disappeared.

      G
      The researchers suggest that this may be a form of night watch, allowing us to remain partly alert to danger in places we do not yet know to be safe.
      If so, the common experience of a restless first night in a hotel may be a faint echo of the strategy that allows dolphins to sleep at sea and frigatebirds to sleep in the sky.
      Some sleep experts recommend taking a familiar pillow when travelling, although whether this reduces the effect has not been tested.
    `,
    groups: [
      info([
        ['a comparison between how a species sleeps in two different places', 'E', 'E2 E3', 'Fur seals sleep with both halves on land but one half at a time in the water.'],
        ['a reason why sleep puts animals at risk', 'A', 'A2', 'A sleeping animal “cannot watch for predators”.'],
        ['a description of equipment used to study sleep during flight', 'D', 'D3', 'Researchers “fitted small devices to the heads of frigatebirds to record their brain activity”.'],
        ['a suggestion that has not yet been scientifically checked', 'G', 'G3', 'Taking a familiar pillow may help, “although whether this reduces the effect has not been tested”.'],
        ['a problem that sleep scientists must allow for in their research', 'F', 'F2', 'The first-night effect is one “that sleep researchers must take into account when they study volunteers in laboratories”.'],
      ]),
      endings(
        [
          'kept their open eye facing away from the group.',
          'slept with both halves of the brain more often.',
          'need to come up to the surface to breathe.',
          'slept for only a few seconds at a time.',
          'reacted more strongly to unexpected noises.',
          'stopped swimming while they slept.',
        ],
        [
          ['Dolphins cannot become completely unconscious because they', 'C', 'B2', 'Dolphins “must rise to the surface regularly”.'],
          ['Ducks at the ends of a row', 'A', 'C2', 'They “kept the open eye turned away from the group”.'],
          ['When frigatebirds slept in flight, they', 'D', 'D4', 'They slept “only for a few seconds at a time”.'],
          ['During the first night in a new place, the left half of the brain', 'E', 'F3', 'It “responded more strongly to unusual sounds”.'],
        ],
      ),
      short(
        2,
        [
          ['Which animal’s unihemispheric sleep was the first to be studied closely?', 'dolphins|dolphin', 'B1', 'It “was first studied in detail in dolphins”.'],
          ['On land, frigatebirds slept for more than how many hours a day?', 'twelve|12', 'D5', 'On land they “slept for more than twelve hours a day”.'],
          ['What part of its body does a fur seal keep moving while sleeping in water?', 'one flipper|flipper|a flipper', 'E3', 'Seals keep “one flipper moving to maintain their position”.'],
          ['What do researchers think the first-night effect may act as?', 'night watch', 'G1', 'It “may be a form of night watch”.'],
        ],
        true,
      ),
    ],
  }),

  passage({
    title: 'The Myth of Multitasking',
    sub: 'We believe we can do several things at once. The evidence suggests we are mostly switching between them, and paying a price.',
    text: `
      A
      Modern life seems to demand multitasking.
      Office workers answer emails during meetings, students revise with messages arriving on their phones, and drivers take calls on the motorway.
      Many people regard the ability to juggle several tasks as a valuable skill, and some job advertisements even list it as a requirement.
      Yet decades of psychological research suggest that what we call multitasking is, for most tasks, something quite different from what we imagine.

      B
      When two tasks both require our attention, the brain cannot usually perform them at the same time.
      Instead, it switches rapidly from one to the other, and each switch carries a cost.
      In laboratory experiments, people asked to alternate between two simple tasks, such as classifying numbers and letters, are consistently slower and make more mistakes than people who complete one task before starting the other.
      Each individual cost may be only a fraction of a second, but over a working day of constant interruptions, the losses add up.

      C
      The exceptions tend to involve activities that have become automatic.
      An experienced driver can hold a conversation with a passenger while steering along a familiar road, and most people can walk and talk at the same time.
      Problems arise when both activities require conscious thought, or when an automatic activity suddenly demands attention, as when traffic ahead stops without warning.
      Studies of drivers using phones, even hands-free phones, have found that their reactions are significantly slower, in some experiments as slow as those of drivers who are over the legal alcohol limit.

      D
      Interestingly, the people who multitask most may be among the worst at it.
      In one well-known study, researchers compared students who frequently used several forms of media at once, such as watching videos while messaging and browsing the internet, with students who rarely did so.
      Contrary to expectations, the heavy multitaskers performed worse on tests that required them to ignore irrelevant information, and they were slower at switching between tasks.
      It is not clear whether multitasking caused these weaknesses or whether people who are easily distracted are simply more drawn to multitasking, but the result challenges the idea that practice makes perfect.

      E
      A small minority of people do appear to manage remarkably well.
      In a driving-simulator study, around two or three per cent of participants performed just as well when they were also carrying out a demanding memory task as when they were driving alone.
      Researchers called them ‘supertaskers’.
      Unfortunately, most people who believe they are supertaskers are not; in fact, people who rate their own multitasking ability most highly often perform worst when tested.

      F
      Interruptions present a related problem.
      Research in offices suggests that after being interrupted, workers often take many minutes to return fully to their original task, and that they frequently turn to other small tasks in the meantime.
      Some organisations have responded by introducing periods of the day without meetings or messages, allowing staff to concentrate on demanding work.

      G
      None of this means that we should never do two things at once.
      Listening to music while exercising, or talking while cooking a familiar meal, causes few problems.
      But for work that requires real thought, the evidence strongly favours doing one thing at a time.
      I suspect that the most valuable skill in a world full of distractions is not the ability to juggle, but the ability to choose what to ignore.
    `,
    groups: [
      mcq([
        [
          'What does the writer say about multitasking in paragraph A?',
          ['Few people regard it as a useful ability.', 'It is often thought of as a desirable skill.', 'It was rare before the invention of phones.', 'Research supports the popular view of it.'],
          'B',
          'A3',
          'Many people regard it “as a valuable skill”, and some employers list it as a requirement.',
        ],
        [
          'According to paragraph B, what happens when people switch between tasks?',
          ['They lose a small amount of time with each change.', 'They perform the second task better than the first.', 'They make fewer mistakes than expected.', 'They become tired more quickly.'],
          'A',
          'B2 B4',
          '“Each switch carries a cost… only a fraction of a second, but… the losses add up.”',
        ],
        [
          'What is said about drivers using hands-free phones?',
          ['They are safer than drivers using hand-held phones.', 'Their reactions may be as slow as those of drunk drivers.', 'They are able to talk while concentrating on the road.', 'They should only use phones on familiar roads.'],
          'B',
          'C4',
          'Reactions were in some experiments “as slow as those of drivers who are over the legal alcohol limit”.',
        ],
        [
          'What does the writer say about the study of heavy media multitaskers?',
          ['It proved that multitasking damages concentration.', 'Its results were the opposite of what was expected.', 'It was carried out with too few students.', 'It showed that practice improves multitasking.'],
          'B',
          'D3 D4',
          '“Contrary to expectations”, heavy multitaskers did worse. The cause is unclear, so A is wrong.',
        ],
      ]),
      summary(
        'Supertaskers and interruptions',
        0,
        `A very small [[minority]] of people, known as supertaskers, can perform two demanding tasks as well as one. However, people who are most [[confident]] about their multitasking ability are often the least skilled.
        In offices, workers who are [[interrupted]] can take a long time to return to their original task. Some employers now offer periods free from meetings and messages so that staff can [[concentrate]].
        The writer believes the most important skill is knowing what to [[ignore]].`,
        [
          ['E1 E2', '“A small minority of people do appear to manage remarkably well”: around two or three per cent.'],
          ['E4', '“People who rate their own multitasking ability most highly often perform worst when tested.”'],
          ['F2', '“After being interrupted, workers often take many minutes to return fully to their original task.”'],
          ['F3', 'Periods without meetings or messages allow “staff to concentrate on demanding work”.'],
          ['G4', 'The writer suspects the most valuable skill is “the ability to choose what to ignore”.'],
        ],
        { words: ['minority', 'confident', 'interrupted', 'concentrate', 'ignore', 'majority', 'relax', 'trained', 'juggle', 'nervous'] },
      ),
      ynng([
        ['Some employers look for people who can multitask.', 'Y', 'A3', '“Some job advertisements even list it as a requirement.”'],
        ['Walking and talking at the same time causes serious problems for most people.', 'N', 'C2', '“Most people can walk and talk at the same time.”'],
        ['Multitasking has been proved to cause poor concentration.', 'N', 'D4', '“It is not clear whether multitasking caused these weaknesses.”'],
        ['Supertaskers are usually older than other people.', 'NG', 'E2 E3', 'Supertaskers are described, but their age is never mentioned.'],
        ['People should avoid doing two things at once in all situations.', 'N', 'G1 G2', '“None of this means that we should never do two things at once.”'],
      ]),
    ],
  }),
])
