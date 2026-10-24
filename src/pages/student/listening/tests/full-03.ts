import type { MapSpec } from '../practice-data'
import { choose2, limit, map, matching, mcq, notes, part, person, test } from '../build'

const ISLAND: MapSpec = {
  title: 'Gull Island',
  description:
    'Map of Gull Island, with north at the top. The ferry jetty, marked You are here, is in the middle of the south coast. A path runs north from the jetty to a farmhouse in the centre of the island. ' +
    'A lighthouse stands on the far north-east point. A large lake fills the north-west of the island, and a wood covers the south-west. Sandy beaches run along the east coast. ' +
    'Letter A is at the southern edge of the wood, west of the jetty. Letter B is on the eastern shore of the lake. Letter C is at the north end of the path, just past the farmhouse. ' +
    'Letter D is beside the lighthouse. Letter E is on the east coast, on the beach. Letter F is just east of the jetty, on the south coast. Letter G is next to the farmhouse, on its west side. Letter H is in the middle of the wood.',
  shapes: [
    { kind: 'water', x: 40, y: 40, w: 220, h: 150, round: true, label: 'Lake' },
    { kind: 'trees', x: 40, y: 250, w: 200, h: 170, label: 'Wood' },
    { kind: 'sand', x: 540, y: 140, w: 70, h: 240, label: 'Beach' },
    { kind: 'path', d: 'M320 430 V 150' },
    { kind: 'path', d: 'M320 150 C 400 120, 480 90, 560 70' },
    { kind: 'building', x: 290, y: 200, w: 70, h: 50, label: 'Farm' },
    { kind: 'building', x: 560, y: 40, w: 40, h: 50, label: 'Light-\nhouse' },
    { kind: 'label', x: 320, y: 455, text: 'Jetty', small: true },
  ],
  points: { A: [205, 410], B: [280, 120], C: [320, 125], D: [505, 105], E: [575, 300], F: [400, 425], G: [255, 225], H: [100, 385] },
  here: [320, 400],
  hereLabel: 'JETTY',
}

const clerk = person('clerk', 'Rob', 'Lost property clerk', 'm', 'en-AU', 'bnkqMLCB8HHkYK9Gd6Xj')
const lucy = person('lucy', 'Lucy', 'Caller', 'f', 'en-GB', 'pFZP5JQG7iQjIQuC4Bku')
const warden = person('warden', 'Gareth', 'Island warden', 'm', 'en-GB', 'JBFqnCBsd6RMkjVDRZzb')
const hannah = person('hannah', 'Hannah', 'Student', 'f', 'en-GB', 'tPDVQaZ6fdDCUmYpHyYd')
const ben = person('ben', 'Ben', 'Student', 'm', 'en-AU', 'IKne3meq5aSn9XLyUdCD')
const oli = person('oli', 'Dr Fletcher', 'Lecturer', 'm', 'en-GB', '1P9lzrAhggxzcHA9jcDZ')

export default test('full-03', [
  part({
    n: 1,
    title: 'A lost bag',
    intro: 'You will hear a woman phoning the lost property office at a railway station.',
    speakers: [clerk, lucy],
    blocks: [
      {
        lines: `
          clerk: Lost property, Central Station. Rob speaking.
          lucy: Oh, hello. I left a bag on a train yesterday, and I'm hoping someone handed it in.
          clerk: I'll take the details and have a look. Which train were you on?
          lucy: The ten forty from Oxford. I got off here at about half past eleven.
          clerk: And can you describe the bag?
          lucy: It's a small backpack. It's dark green, with a brown leather strap on the front.
          clerk: Any name or label on it?
          lucy: There's a luggage label with my name on it, Lucy Penrose.
          clerk: Penrose. Is that P-E-N-R-O-S-E? || Penrose. Is that P, E, N, R, O, S, E?
          lucy: That's right.
          clerk: And what was inside it?
          lucy: Let me think. My laptop wasn't in it, thank goodness, I had that with me. But there was a book, a pair of glasses in a red case, and my camera. That's the thing I'm most worried about.
          clerk: Was the camera expensive?
          lucy: Not really, but it has all my photos from a trip to Scotland on it.
          clerk: I understand. Anything else?
          lucy: Oh, yes, a scarf. A blue one. And I think there was an umbrella, but I'm not sure. I might have left that at home.
          clerk: I'll put the scarf down, then, and not the umbrella.
        `,
        groups: [
          notes(
            'Lost property report',
            limit(2, true),
            [
              '# Journey',
              'Train: the [[10.40|10:40|ten forty]] from Oxford',
              '# Description of bag',
              'Type: small [[backpack]]',
              'Colour: dark green with a brown leather [[strap]]',
              'Owner’s name on luggage label: Lucy [[Penrose]]',
              '# Contents',
              'a book, glasses in a red case, a [[camera]] and a blue [[scarf]]',
            ],
            [
              ['The ten forty from Oxford', 'Half past eleven is when she got off, not the train time.'],
              ["It's a small backpack", 'The bag type comes before the colour.'],
              ['with a brown leather strap on the front', 'The strap is brown leather; the bag is green.'],
              ['P-E-N-R-O-S-E', 'The clerk checks the spelling, and she confirms it.'],
              ['and my camera', 'Her laptop was not in the bag.'],
              ['a scarf. A blue one', 'The umbrella is not listed because she may have left it at home.'],
            ],
          ),
        ],
      },
      {
        lines: `
          clerk: Right. I'm checking the system now. Hmm, nothing matching yet, but items from the Oxford trains often take a day or two to reach us.
          lucy: Oh, I see.
          clerk: Can I take a phone number so we can contact you?
          lucy: Yes, it's 0161 496 0723. || Yes, it's oh one six one, four nine six, oh seven two three.
          clerk: Thanks. If we find the bag, you can collect it from this office. We're open from seven in the morning until eight at night, except on Sundays, when we close at four.
          lucy: And is there a charge?
          clerk: There's a small handling fee of three pounds for each item. If you can't come in person, we can post it to you, but then you'd pay the postage as well.
          lucy: I'll come and collect it. I work near the station. When you phone, do I need to bring anything?
          clerk: Yes, some kind of photo identification. A passport or a driving licence is best. And please bring the reference number I'm about to give you.
          lucy: OK, I've got a pen.
          clerk: It's LP 3847. || It's L, P, three eight four seven.
          lucy: LP 3847. Thank you so much. || L, P, three eight four seven. Thank you so much.
        `,
        groups: [
          notes(
            'Collecting the bag',
            limit(2, true),
            [
              'Phone number: [[0161 496 0723]]',
              'Office closes at [[4|four|4 pm]] pm on Sundays',
              'Handling fee: £3 per item',
              'Bring: photo identification, e.g. passport or [[driving licence|driving license]]',
              'Reference number: [[LP 3847|LP3847]]',
            ],
            [
              ["Yes, it's 0161 496 0723", 'Write all eleven digits; spaces do not matter.'],
              ["except on Sundays, when we close at four", 'On other days the office closes at eight.'],
              ['A passport or a driving licence is best', 'Two kinds of photo ID are mentioned; the passport is printed already.'],
              ["It's LP 3847", 'Letters and numbers together count as one reference.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['about half past eleven', 1, 'When she arrived, not the train.'],
      ['My laptop wasn\'t in it', 5, 'She had the laptop with her.'],
      ['I think there was an umbrella', 6, 'She is not sure.'],
      ['from seven in the morning until eight at night', 8, 'Weekday hours.'],
    ],
  }),

  part({
    n: 2,
    title: 'A volunteer week on Gull Island',
    intro: 'You will hear a warden talking to volunteers who have just arrived on an island nature reserve.',
    speakers: [warden],
    blocks: [
      {
        lines: `
          warden: Welcome to Gull Island, everyone. I'm Gareth, the warden here, and I'll be looking after you during your volunteer week.
          warden: First, some background. The island was farmed for about two hundred years, but the last family left in the nineteen sixties, and the land was bought by a wildlife charity twenty years later. Today it's one of the most important breeding sites for seabirds on this coast.
          warden: You'll be doing a range of jobs this week. Some of you were expecting to spend your time counting birds, and you will do a little of that, but the most urgent work is repairing the stone walls. Sheep from the farm used to keep the grass short, and now that they've gone, the walls are being damaged by plants growing through them.
          warden: A few rules. Please stay on the paths during May and June, because birds nest on the ground and the nests are almost impossible to see. Fires aren't allowed anywhere on the island. And although the water from the taps in the farmhouse is perfectly safe, please don't drink from the lake.
          warden: Meals will be in the farmhouse kitchen. We take turns to cook, and there's a list on the wall, so check it each morning to see whether it's your turn.
        `,
        groups: [
          mcq([
            [
              'When did the wildlife charity buy the island?',
              ['about two hundred years ago', 'in the 1960s', 'about twenty years after the last family left'],
              'C',
              'bought by a wildlife charity twenty years later',
              'The family left in the 1960s; the charity bought it twenty years after that.',
            ],
            [
              'What is the most urgent work for the volunteers?',
              ['counting birds', 'repairing walls', 'cutting the grass'],
              'B',
              'the most urgent work is repairing the stone walls',
              'Counting birds is something they will do “a little of”.',
            ],
            [
              'Why must volunteers stay on the paths in May and June?',
              ['to avoid damaging nests', 'because the paths are safer', 'to protect rare plants'],
              'A',
              'birds nest on the ground and the nests are almost impossible to see',
              'Nests on the ground could be stepped on.',
            ],
          ]),
        ],
      },
      {
        lines: `
          warden: Now, let me show you on the map where everything is. We're standing on the jetty, where the ferry comes in, at the bottom of the map.
          warden: If you look to your right, just along the coast from the jetty, you'll see a small wooden hut. That's the tool store, where you'll collect your equipment every morning.
          warden: The main path goes straight up the middle of the island to the farmhouse, where you'll be sleeping. On the left-hand side of the farmhouse, the west side, there's a garden with a picnic table, which we call the courtyard. That's where we'll meet each morning at eight.
          warden: If you carry on along the path past the farmhouse, right at the end, before it turns towards the lighthouse, you'll find the bird hide. It's a great place to watch the seabirds without disturbing them.
          warden: On the western side of the island there's the lake. You'll see there's a little wooden platform on the eastern shore of the lake; that's where we test the water quality each week, so please don't swim from there.
          warden: The lighthouse itself is closed to visitors, but next to it is a small weather station, and one of your jobs will be to record the readings every evening.
          warden: In the south-west, there's the wood. People sometimes ask about camping there, but it isn't allowed. On the southern edge of the wood, at the end of the beach path, is the compost toilet, which is the only toilet outside the farmhouse.
          warden: And finally, the beaches on the east coast are where the seals come ashore. Along the beach, roughly halfway up, there's an observation point with information boards about the seals. Please keep at least fifty metres away from the animals.
        `,
        groups: [
          map(ISLAND, [
            ['Tool store', 'F', "just along the coast from the jetty, you'll see a small wooden hut", 'To the right (east) of the jetty, on the coast: F.'],
            ['Courtyard', 'G', 'On the left-hand side of the farmhouse, the west side', 'Next to the farmhouse on its west side: G.'],
            ['Bird hide', 'C', "right at the end, before it turns towards the lighthouse, you'll find the bird hide", 'At the north end of the path, past the farmhouse: C.'],
            ['Water testing platform', 'B', 'a little wooden platform on the eastern shore of the lake', 'On the eastern shore of the lake: B.'],
            ['Weather station', 'D', 'next to it is a small weather station', 'Beside the lighthouse: D.'],
            ['Compost toilet', 'A', 'On the southern edge of the wood', 'At the southern edge of the wood: A. Camping in the wood (H) is not allowed.'],
            ['Seal observation point', 'E', "Along the beach, roughly halfway up, there's an observation point", 'Halfway up the east-coast beach: E.'],
          ]),
        ],
      },
    ],
    traps: [
      ['Some of you were expecting to spend your time counting birds', 12, 'Only a little bird counting.'],
      ['People sometimes ask about camping there', 19, 'Camping is not allowed; H is not used.'],
    ],
  }),

  part({
    n: 3,
    title: 'A presentation on the bicycle',
    intro: 'You will hear two design students, Hannah and Ben, discussing a presentation they are preparing on the history of the bicycle.',
    speakers: [hannah, ben],
    blocks: [
      {
        lines: `
          hannah: Ben, have you had a chance to look at the notes I sent about the early bicycles?
          ben: Yes, thanks. I hadn't realised the first ones had no pedals at all. You just pushed yourself along with your feet.
          hannah: I know. I think that's a good way to start the presentation, actually. Show a picture and ask the audience how they think it worked.
          ben: Good idea. It gets people involved straight away. So what do you think the key points of the talk should be? We've only got fifteen minutes.
          hannah: Well, I think we should definitely explain why bicycles became so popular in the late nineteenth century. It wasn't just about transport, was it? For a lot of people, especially women, the bicycle meant freedom to travel on their own.
          ben: Absolutely. And it changed fashion too. Women started wearing much more practical clothes for cycling.
          hannah: Right. I'd also like to include something about safety. The early bikes with a huge front wheel were incredibly dangerous.
          ben: True, but we can't cover everything. I'd rather leave out the racing history, which is interesting but doesn't really fit, and spend the time on how the design changed.
          hannah: Agreed. What about the materials? You said you'd found some information on frames.
          ben: Yes, I've got quite a lot on the move from wood to steel, and later aluminium. But I don't think the audience will find the details of the chemistry very exciting, so I'll keep it short.
          hannah: That makes sense. Do we need to say anything about the future?
          ben: I think so. Electric bikes are a big part of the story now. And maybe bike-sharing schemes in cities.
          hannah: Let's just do electric bikes. Bike-sharing is more about cities than about design.
        `,
        groups: [
          choose2(
            'Which TWO effects of the bicycle in the late nineteenth century will the students mention?',
            [
              'It gave women more independence.',
              'It reduced the number of horses in cities.',
              'It led to new styles of clothing.',
              'It made train travel less popular.',
              'It created jobs in factories.',
            ],
            ['A', 'C'],
            [
              ['the bicycle meant freedom to travel on their own', 'For many women, the bicycle meant the freedom to travel alone.'],
              ['Women started wearing much more practical clothes for cycling', 'Fashion changed: more practical clothes.'],
            ],
          ),
          choose2(
            'Which TWO topics do the students agree to leave out or keep brief?',
            ['early bicycles without pedals', 'the history of bicycle racing', 'the safety of early bicycles', 'the chemistry of frame materials', 'electric bicycles'],
            ['B', 'D'],
            [
              ["I'd rather leave out the racing history", 'It is interesting, but does not fit their focus on design.'],
              ["I don't think the audience will find the details of the chemistry very exciting, so I'll keep it short", 'The chemistry of materials will be kept short.'],
            ],
          ),
        ],
      },
      {
        lines: `
          ben: Now, we need to divide up the work. Shall we go through the sections?
          hannah: OK. The opening, with the picture of the early bike, should be you, since you found the picture.
          ben: Fine. Then the section on social changes. You know much more about that than I do.
          hannah: Yes, I'll take that one. And for the design changes, why don't we do it together? We could take turns describing each model.
          ben: Good, that'll keep it lively. Then materials is mine, obviously.
          hannah: And the section on electric bikes?
          ben: Hmm. Neither of us knows much about it yet. Shall we ask Dr Lewis if one of the engineering students could help?
          hannah: I'd rather we did it ourselves. Why don't I research it this week, and if I struggle, you can help me.
          ben: OK, it's yours for now.
          hannah: And the conclusion?
          ben: Let's write that together at the end, once we know what we've actually said.
        `,
        groups: [
          matching(
            'Who will present each section? Choose the correct letter, A, B or C.',
            'Presenters',
            ['Hannah', 'Ben', 'both Hannah and Ben'],
            [
              ['the opening', 'B', 'should be you, since you found the picture', 'Hannah says Ben should do it, and he agrees.'],
              ['social changes', 'A', "Yes, I'll take that one", 'Hannah knows more about this topic.'],
              ['design changes', 'C', "why don't we do it together", 'They will take turns describing each model.'],
              ['materials', 'B', 'Then materials is mine, obviously', 'Ben found the information on frames.'],
              ['electric bikes', 'A', "OK, it's yours for now", 'Ben suggests asking an engineering student, but Hannah takes it on.'],
              ['the conclusion', 'C', "Let's write that together at the end", 'They will do the conclusion together.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['maybe bike-sharing schemes in cities', 24, 'They drop bike-sharing, not electric bikes.'],
      ['ask Dr Lewis if one of the engineering students could help', 29, 'Hannah prefers to do it herself.'],
    ],
  }),

  part({
    n: 4,
    title: 'The sense of smell',
    intro: 'You will hear part of a lecture about the human sense of smell.',
    speakers: [oli],
    blocks: [
      {
        lines: `
          oli: Today I want to talk about the most neglected of our senses: smell. For a long time, scientists believed that humans had a poor sense of smell compared with other mammals. It was often claimed that we could distinguish only about ten thousand different smells.
          oli: That figure turns out to have had no real basis. A study published in 2014 tested volunteers with mixtures of chemicals and estimated that people can, in theory, tell apart more than a trillion different smells. The exact number has been debated, but it's clear that the old figure was far too low.
          oli: So how does smell work? When we breathe in, molecules from the air reach a small patch of tissue high up inside the nose. This contains millions of nerve cells, each carrying receptors that respond to particular molecules. Humans have around four hundred different types of receptor, and the brain identifies a smell from the pattern of receptors that are activated, rather like recognising a chord in music from the combination of notes.
          oli: Smell is unusual among the senses in one important way. Signals from the nose travel directly to the parts of the brain involved in emotion and memory, without first passing through the area that processes most other sensory information. This may explain why a smell can bring back a memory so vividly, often from early childhood.
          oli: Smell also plays a much larger role in taste than most people realise. Our tongues detect only a few basic tastes, such as sweet, salty and bitter. Most of what we think of as flavour actually comes from smell, which is why food seems tasteless when we have a cold.
          oli: Our sense of smell changes over our lives. It tends to be at its best between the ages of about thirty and sixty, and then gradually declines. Smoking speeds up this decline. Interestingly, women on average perform slightly better than men in smell tests, although the reasons for this are not fully understood.
          oli: The loss of smell has received much more attention since the recent pandemic, when millions of people lost the sense, some of them for many months. People who lose their sense of smell often report that it affects their enjoyment of food and their relationships with others, and some become depressed. There are also safety risks: without smell, people may not notice smoke or food that has gone bad.
          oli: One promising treatment is called smell training. Patients sniff a set of strong smells, such as rose, lemon and eucalyptus, twice a day for several months. Many patients improve, although it's hard to know how many would have recovered anyway.
          oli: Finally, researchers are exploring whether smell could help to diagnose disease. A decline in the sense of smell can be one of the earliest signs of some conditions that affect the brain, appearing years before other symptoms, so a simple smell test might one day be used for early diagnosis.
        `,
        groups: [
          notes(
            'The sense of smell',
            limit(1),
            [
              '# Research',
              '- old claim: humans can tell apart only about 10,000 smells',
              '- 2014 study: possibly more than a [[trillion]] smells',
              '# How smell works',
              '- receptors are found on [[nerve]] cells high in the nose',
              '- brain recognises the [[pattern]] of activated receptors, like a chord in music',
              '- signals go straight to areas of the brain linked with emotion and [[memory]]',
              '- most of what we call [[flavour|flavor]] comes from smell',
              '# Changes and loss',
              '- best between about 30 and 60; the decline is speeded up by [[smoking]]',
              '- loss of smell can lead to people becoming [[depressed]]',
              '- risk of not noticing [[smoke]] or bad food',
              '# Treatment and diagnosis',
              '- smell training: sniffing strong smells such as rose, lemon and [[eucalyptus]]',
              '- loss of smell may be an early sign of diseases affecting the [[brain]]',
            ],
            [
              ['more than a trillion different smells', 'The 10,000 figure had no real basis.'],
              ['millions of nerve cells, each carrying receptors', 'The receptors are carried by nerve cells.'],
              ['the brain identifies a smell from the pattern of receptors', 'Like recognising a chord from its notes.'],
              ['involved in emotion and memory', 'This may explain why smells bring back memories.'],
              ['Most of what we think of as flavour actually comes from smell', 'The tongue detects only a few basic tastes.'],
              ['Smoking speeds up this decline', 'The sense declines after about sixty, and smoking makes it decline faster.'],
              ['some become depressed', 'Loss of smell can affect mood.'],
              ['people may not notice smoke', 'A safety risk of losing smell.'],
              ['such as rose, lemon and eucalyptus', 'Three example smells are given.'],
              ['some conditions that affect the brain', 'A smell test might help early diagnosis.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['only about ten thousand different smells', 31, 'The old, wrong figure.'],
      ['the area that processes most other sensory information', 34, 'Smell bypasses this area.'],
    ],
  }),
])
