/*
 * Full practice material for the Moonlit Library: passages (split into
 * sentences so answers can point at their evidence), question groups and
 * answer keys with explanations. Only the lazy-loaded practice page imports it.
 *
 * Every passage is original writing for Owlington.
 */

export interface Sentence {
  /** Paragraph letter + sentence number, e.g. "B3". Used as evidence. */
  id: string
  text: string
}

export interface Paragraph {
  label: string
  sentences: Sentence[]
}

export interface Choice {
  value: string
  label: string
}

interface QuestionBase {
  id: string
  explanation: string
  /** Sentence ids that prove the answer. */
  evidence: string[]
}

export type Question =
  | (QuestionBase & { type: 'tfng'; prompt: string; answer: 'TRUE' | 'FALSE' | 'NOT GIVEN' })
  | (QuestionBase & { type: 'ynng'; prompt: string; answer: 'YES' | 'NO' | 'NOT GIVEN' })
  | (QuestionBase & { type: 'mcq'; prompt: string; options: string[]; answer: string })
  /** Pick one option from the group's list (headings, paragraph letters, people, sentence endings…). */
  | (QuestionBase & { type: 'choose'; prompt: string; paragraph?: string; answer: string })
  /** A gap in a sentence, summary, note, table or flow-chart: typed (accepted answers) or picked from the group's word box. */
  | (QuestionBase & { type: 'gap'; before: string; after: string; answers: string[] })
  /**
   * One of the answers to a "Choose TWO letters" question. The prompt and options live on the group,
   * and the answers can be given in either order.
   */
  | (QuestionBase & { type: 'pick'; answer: string })

export type GroupKind =
  | 'tfng'
  | 'ynng'
  | 'mcq'
  | 'choose2'
  | 'headings'
  | 'paragraphs'
  | 'features'
  | 'endings'
  | 'sentences'
  | 'summary'
  | 'wordbox'
  | 'notes'
  | 'table'
  | 'flow'
  | 'short'

/** Text around the gaps of a note, table or flow-chart; a number is the index of a question in the group. */
export type Segment = string | number

export type Layout =
  | { type: 'notes'; lines: { segs: Segment[]; heading?: boolean; bullet?: boolean }[] }
  | { type: 'table'; head: string[]; rows: Segment[][][] }
  | { type: 'flow'; steps: Segment[][] }

export interface QuestionGroup {
  kind: GroupKind
  instructions: string
  /** Typed gaps: maximum words per answer, and the label printed in capitals. */
  maxWords?: number
  limit?: string
  /** Shared options (list of headings, paragraph letters, people, endings, word box). */
  options?: Choice[]
  optionsTitle?: string
  /** Summary-style groups render their gaps inline under this title. */
  summaryTitle?: string
  /** "Choose TWO letters": the question both answers share. */
  prompt?: string
  /** Note, table and flow-chart completion: where each gap sits. */
  layout?: Layout
  questions: Question[]
}

export interface PracticeSet {
  id: string
  passageTitle: string
  passageSubtitle: string
  paragraphs: Paragraph[]
  groups: QuestionGroup[]
}

/** A practice test: one passage for a focused test, three for a full Academic Reading paper. */
export interface ReadingTest {
  id: string
  passages: PracticeSet[]
}

const para = (label: string, ...texts: string[]): Paragraph => ({
  label,
  sentences: texts.map((text, i) => ({ id: `${label}${i + 1}`, text })),
})

const letters = (labels: string[]): Choice[] => labels.map((l) => ({ value: l, label: `Paragraph ${l}` }))

const TFNG_INSTRUCTIONS =
  'Do the following statements agree with the information given in the reading passage? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.'

const YNNG_INSTRUCTIONS =
  'Do the following statements agree with the claims of the writer in the reading passage? Choose YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.'

// ------------------------------------------------------------ The Night Shift ---

const nightShift: PracticeSet = {
  id: 'night-shift',
  passageTitle: 'The Night Shift',
  passageSubtitle: 'While the bees sleep, an overlooked workforce keeps the flowers in business.',
  paragraphs: [
    para(
      'A',
      'When people picture pollination, they usually imagine a bee drifting between flowers on a summer afternoon.',
      'Yet as the light fades, a second shift begins.',
      'Moths, along with some beetles, flies and even bats, take over the work of carrying pollen from flower to flower.',
      'For most of the twentieth century, scientists paid this night shift little attention, largely because animals that work in the dark are so difficult to observe.',
    ),
    para(
      'B',
      'Flowers that depend on night visitors tend to share a recognisable style.',
      'Many are pale or white, which makes them easier to see by moonlight, and they often release their strongest scent after sunset.',
      'Honeysuckle and evening primrose are familiar examples.',
      'Some species go much further: one Madagascan orchid hides its nectar at the bottom of a tube up to 35 centimetres long.',
      'In 1862, Charles Darwin predicted that a moth with an equally long tongue must exist to reach it.',
      'No such moth was formally described until 1903, more than twenty years after Darwin’s death.',
    ),
    para(
      'C',
      'For a long time, moths were dismissed as minor pollinators, casual visitors that sipped nectar without doing much useful work.',
      'Recent research has challenged that view.',
      'When ecologists in England examined moths caught at night, they found pollen from dozens of plant species on their bodies, including several that bees and hoverflies rarely visit.',
      'Some researchers also suggest that, because moths can travel long distances in a single night, they may help to move pollen between separate groups of plants, which keeps those populations genetically healthy.',
    ),
    para(
      'D',
      'This hidden workforce is now in trouble.',
      'Long-term monitoring in Britain suggests that the total number of larger moths fell by roughly a third in the fifty years after 1968.',
      'Habitat loss and pesticides are part of the story, as they are for bees, but night pollinators face an additional threat that daytime insects largely escape: artificial light.',
    ),
    para(
      'E',
      'Streetlamps, floodlights and illuminated buildings draw moths away from flowers, and many insects circle a bulb until they are exhausted or eaten.',
      'In an experiment in Switzerland, researchers installed streetlights in meadows that had previously been dark.',
      'The lit plots received far fewer visits from night-flying insects than the dark ones, and one plant species growing there produced noticeably less fruit, even though bees and other daytime insects were still visiting it.',
    ),
    para(
      'F',
      'The good news is that light pollution is one of the easier environmental problems to solve.',
      'Switching lamps off when they are not needed, pointing them downwards and choosing warmer colours of light all reduce their pull on insects.',
      'Several towns have already begun dimming their streetlights after midnight.',
      'Unlike lost habitat, which can take decades to restore, darkness returns the moment a switch is flicked.',
    ),
  ],
  groups: [
    {
      kind: 'headings',
      instructions:
        'The reading passage has six paragraphs, A–F. Choose the correct heading for paragraphs B–E from the list of headings below. There are more headings than paragraphs.',
      optionsTitle: 'List of Headings',
      options: [
        { value: 'i', label: 'A reputation that research has overturned' },
        { value: 'ii', label: 'Why bees will always be better pollinators' },
        { value: 'iii', label: 'Flowers designed for visitors after dark' },
        { value: 'iv', label: 'A shrinking population faces an extra danger' },
        { value: 'v', label: 'Evidence of harm from a field experiment' },
        { value: 'vi', label: 'A problem with a simple solution' },
        { value: 'vii', label: 'How scientists observe insects at night' },
      ],
      questions: [
        {
          id: 'ns-1',
          type: 'choose',
          prompt: 'Paragraph B',
          paragraph: 'B',
          answer: 'iii',
          evidence: ['B1', 'B2'],
          explanation:
            'Paragraph B describes the style that night-pollinated flowers share: pale colours, evening scent and, at the extreme, an orchid with a very long nectar tube. Darwin’s prediction is an example inside that idea, not the main idea itself.',
        },
        {
          id: 'ns-2',
          type: 'choose',
          prompt: 'Paragraph C',
          paragraph: 'C',
          answer: 'i',
          evidence: ['C1', 'C2'],
          explanation:
            'C starts with the old view that moths were “minor pollinators”, then says “Recent research has challenged that view”: a reputation overturned. Heading ii is a word-match trap: bees are mentioned, but the paragraph argues for moths.',
        },
        {
          id: 'ns-3',
          type: 'choose',
          prompt: 'Paragraph D',
          paragraph: 'D',
          answer: 'iv',
          evidence: ['D2', 'D3'],
          explanation:
            'D reports that larger moths “fell by roughly a third” (a shrinking population) and names “an additional threat… artificial light” (an extra danger).',
        },
        {
          id: 'ns-4',
          type: 'choose',
          prompt: 'Paragraph E',
          paragraph: 'E',
          answer: 'v',
          evidence: ['E2', 'E3'],
          explanation:
            'E is built around the Swiss experiment: lit meadows got fewer night visitors and one plant produced less fruit. That is evidence of harm from a field experiment. Heading vi fits paragraph F, which is not tested.',
        },
      ],
    },
    {
      kind: 'tfng',
      instructions: TFNG_INSTRUCTIONS,
      questions: [
        {
          id: 'ns-5',
          type: 'tfng',
          prompt: 'Night-time pollination was a major research topic throughout the twentieth century.',
          answer: 'FALSE',
          evidence: ['A4'],
          explanation:
            'Paragraph A says that for most of the twentieth century scientists “paid this night shift little attention”, which contradicts the idea of a major research topic.',
        },
        {
          id: 'ns-6',
          type: 'tfng',
          prompt: 'Flowers pollinated at night often smell strongest after dark.',
          answer: 'TRUE',
          evidence: ['B2'],
          explanation:
            '“They often release their strongest scent after sunset” is a direct paraphrase: strongest scent = smell strongest, after sunset = after dark.',
        },
        {
          id: 'ns-7',
          type: 'tfng',
          prompt: 'Darwin lived long enough to see the moth he had predicted described.',
          answer: 'FALSE',
          evidence: ['B6'],
          explanation:
            'The moth was not formally described until 1903, “more than twenty years after Darwin’s death”, so he did not live to see it.',
        },
        {
          id: 'ns-8',
          type: 'tfng',
          prompt: 'Pesticides harm moths more seriously than they harm bees.',
          answer: 'NOT GIVEN',
          evidence: ['D3'],
          explanation:
            'Pesticides are mentioned as “part of the story, as they are for bees”, but the passage never compares how serious the harm is for each. No comparison means NOT GIVEN.',
        },
        {
          id: 'ns-9',
          type: 'tfng',
          prompt: 'In the Swiss experiment, daytime insects continued to visit the plants in the lit meadows.',
          answer: 'TRUE',
          evidence: ['E3'],
          explanation: 'The plant produced less fruit “even though bees and other daytime insects were still visiting it”.',
        },
      ],
    },
    {
      kind: 'sentences',
      instructions: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      maxWords: 2,
      limit: 'NO MORE THAN TWO WORDS',
      questions: [
        {
          id: 'ns-10',
          type: 'gap',
          before: 'Pale flowers are easier for night visitors to see by',
          after: '.',
          answers: ['moonlight'],
          evidence: ['B2'],
          explanation: 'Paragraph B: pale or white flowers are “easier to see by moonlight”.',
        },
        {
          id: 'ns-11',
          type: 'gap',
          before: 'Moths may help to keep separate groups of plants',
          after: 'healthy.',
          answers: ['genetically'],
          evidence: ['C4'],
          explanation:
            'Paragraph C: moving pollen between separate groups of plants “keeps those populations genetically healthy”. The word “healthy” is already printed, so the answer is just “genetically”.',
        },
        {
          id: 'ns-12',
          type: 'gap',
          before: 'Lamps attract fewer insects when they are pointed',
          after: 'and give off warmer light.',
          answers: ['downwards', 'downward'],
          evidence: ['F2'],
          explanation:
            'Paragraph F lists “pointing them downwards” among the ways to reduce lamps’ “pull on insects”. “Downward” is also accepted, but the safe habit is to copy the passage’s exact form: “downwards”.',
        },
      ],
    },
  ],
}

// ------------------------------------------------------------ Owls and Larks ---

const owlsAndLarks: PracticeSet = {
  id: 'owls-and-larks',
  passageTitle: 'Owls and Larks',
  passageSubtitle: 'Why some of us come alive at dawn, and others only after dark.',
  paragraphs: [
    para(
      'A',
      'Some people spring out of bed at dawn; others only come alive after dark.',
      'Scientists call these personal timing preferences chronotypes, and they are more than a matter of habit.',
      'Every human carries an internal clock, a cluster of around 20,000 nerve cells in the brain’s hypothalamus, which runs on a cycle of roughly 24 hours.',
      'It tells the body when to release hormones, when to raise its temperature and when to feel sleepy.',
    ),
    para(
      'B',
      'These clocks do not all run to the same schedule.',
      'Early types, nicknamed “larks”, tend to feel sleepy early in the evening and wake naturally at first light.',
      'Late types, or “owls”, reach their mental peak in the evening and struggle to fall asleep before midnight.',
      'Most people sit somewhere between the two extremes.',
      'Studies of twins suggest that genes explain a substantial part of the difference, and several gene variants linked to body timing have now been identified.',
    ),
    para(
      'C',
      'Chronotype also shifts across a lifetime.',
      'Young children are usually early risers, but during adolescence the clock drifts later, which is why many teenagers find it genuinely hard to fall asleep early.',
      'This drift typically reaches its latest point at around the age of twenty, after which people gradually become earlier again.',
      'By old age, many former night owls have turned into larks.',
    ),
    para(
      'D',
      'Problems arise when the body’s clock and the clock on the wall disagree.',
      'An owl who must start work at eight o’clock is effectively living in a different time zone from their own body, a mismatch that researchers call “social jet lag”.',
      'Owls on early schedules typically build up a sleep debt during the week and then sleep late at weekends to recover, a pattern that has been linked to poorer mood and health.',
      'Larks, by contrast, rarely suffer on standard schedules, though they may struggle with late shifts or evening social events.',
    ),
    para(
      'E',
      'Light is the clock’s most powerful signal.',
      'Bright light in the morning pulls the clock earlier, while light in the evening, including the glow from screens and lamps, pushes it later.',
      'In one well-known study, volunteers who spent a week camping without electric light found that their internal clocks shifted about two hours earlier, and the gap between the owls and the larks among them narrowed sharply.',
    ),
    para(
      'F',
      'All this suggests that modern night owls are partly made, not just born.',
      'Experts advise people who want to shift earlier to seek out daylight soon after waking, to dim the lights in the evening and to keep regular hours, even at weekends.',
      'Yet some differences are likely to remain.',
      'For employers and schools, the more practical lesson may be that a single fixed timetable cannot suit every brain equally well.',
    ),
  ],
  groups: [
    {
      kind: 'mcq',
      instructions: 'Choose the correct letter, A, B, C or D.',
      questions: [
        {
          id: 'ol-1',
          type: 'mcq',
          prompt: 'What does the writer say about chronotypes in paragraph A?',
          options: [
            'They are mainly the result of daily habits.',
            'They can be changed within a single week.',
            'They only affect the time people fall asleep.',
            'They are linked to a biological clock in the brain.',
          ],
          answer: 'D',
          evidence: ['A2', 'A3'],
          explanation:
            'Chronotypes are “more than a matter of habit” (so not A) and are explained by an internal clock of nerve cells in the brain (D). The clock also controls hormones and temperature, which rules out C. B is not discussed in paragraph A.',
        },
        {
          id: 'ol-2',
          type: 'mcq',
          prompt: 'According to the passage, why do many teenagers find it hard to fall asleep early?',
          options: [
            'They spend too long looking at screens.',
            'Their body clock moves later during adolescence.',
            'They inherit a late chronotype from their parents.',
            'They sleep late at weekends.',
          ],
          answer: 'B',
          evidence: ['C2'],
          explanation:
            '“During adolescence the clock drifts later, which is why many teenagers find it genuinely hard to fall asleep early.” Screens (A) and weekend sleep (D) appear elsewhere in the passage but are not given as the reason.',
        },
        {
          id: 'ol-3',
          type: 'mcq',
          prompt: 'What happened to the volunteers in the camping study?',
          options: [
            'The owls adjusted more slowly than the larks.',
            'Their internal clocks moved later.',
            'The difference between owls and larks became much smaller.',
            'They slept for two extra hours each night.',
          ],
          answer: 'C',
          evidence: ['E3'],
          explanation:
            '“The gap between the owls and the larks among them narrowed sharply” = the difference became much smaller. The clocks moved earlier, not later (B), and “two hours” describes the shift in the clock, not extra sleep (D).',
        },
      ],
    },
    {
      kind: 'paragraphs',
      instructions:
        'The reading passage has six paragraphs, A–F. Which paragraph contains the following information? You may use any letter more than once.',
      options: letters(['A', 'B', 'C', 'D', 'E', 'F']),
      questions: [
        {
          id: 'ol-4',
          type: 'choose',
          prompt: 'evidence that our genes partly determine our chronotype',
          answer: 'B',
          evidence: ['B5'],
          explanation: 'Paragraph B: “Studies of twins suggest that genes explain a substantial part of the difference.”',
        },
        {
          id: 'ol-5',
          type: 'choose',
          prompt: 'the name given to a clash between body time and working hours',
          answer: 'D',
          evidence: ['D2'],
          explanation: 'Paragraph D calls the mismatch between an owl’s body clock and an 8 a.m. start “social jet lag”.',
        },
        {
          id: 'ol-6',
          type: 'choose',
          prompt: 'the age at which people are usually at their latest',
          answer: 'C',
          evidence: ['C3'],
          explanation: 'Paragraph C: the drift “typically reaches its latest point at around the age of twenty”.',
        },
        {
          id: 'ol-7',
          type: 'choose',
          prompt: 'the number of cells that make up the body’s clock',
          answer: 'A',
          evidence: ['A3'],
          explanation: 'Paragraph A describes the clock as “a cluster of around 20,000 nerve cells”.',
        },
        {
          id: 'ol-8',
          type: 'choose',
          prompt: 'a recommendation for organisations',
          answer: 'F',
          evidence: ['F4'],
          explanation:
            'Paragraph F ends with a lesson “for employers and schools”: one fixed timetable cannot suit every brain. Employers and schools are organisations.',
        },
      ],
    },
    {
      kind: 'summary',
      instructions: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
      maxWords: 1,
      limit: 'ONE WORD ONLY',
      summaryTitle: 'Light and the body clock',
      questions: [
        {
          id: 'ol-9',
          type: 'gap',
          before: 'Light is the strongest',
          after: 'that the body clock receives.',
          answers: ['signal'],
          evidence: ['E1'],
          explanation: '“Light is the clock’s most powerful signal.” Strongest is a paraphrase of most powerful.',
        },
        {
          id: 'ol-10',
          type: 'gap',
          before: 'Morning light moves the clock earlier, whereas evening light, including the light from',
          after: 'and lamps, delays it.',
          answers: ['screens'],
          evidence: ['E2'],
          explanation: 'Evening light “including the glow from screens and lamps” pushes the clock later. Keep the plural: “screens”.',
        },
        {
          id: 'ol-11',
          type: 'gap',
          before: 'People who want to become earlier risers are advised to get',
          after: 'soon after they wake up and to keep regular hours.',
          answers: ['daylight'],
          evidence: ['F2'],
          explanation:
            'Experts advise people “to seek out daylight soon after waking”. Copy “daylight”: plain “light” is not enough, because the same sentence tells you to dim the (electric) lights in the evening.',
        },
      ],
    },
  ],
}

// ------------------------------------------------- In Praise of Slow Reading ---

const slowReading: PracticeSet = {
  id: 'slow-reading',
  passageTitle: 'In Praise of Slow Reading',
  passageSubtitle: 'A columnist argues that the race for reading speed is the wrong race.',
  paragraphs: [
    para(
      'A',
      'Every few years, a new technology promises to double our reading speed.',
      'The latest apps flash words one at a time in the centre of a screen, sparing the eyes the supposed waste of travelling along a line.',
      'Their marketing is persuasive, and their users often report feeling remarkably productive.',
      'Feeling productive, however, is simply not the same thing as understanding more.',
    ),
    para(
      'B',
      'The case for speed rests on a misunderstanding of what the eyes actually do.',
      'The quick, jerky movements that carry our eyes across a line of text, known as saccades, are not an inefficiency to be engineered away.',
      'Together with the brief pauses between them, they allow the brain to glance back at a word it has misjudged and to preview what is coming next.',
      'Researchers who have tested word-by-word displays generally report that comprehension falls as speed rises, particularly when a text is complex.',
      'In my view, a method that cannot cope with difficult texts is of little use to students, since difficult texts are precisely what they need to read.',
    ),
    para(
      'C',
      'None of this means that speed is worthless.',
      'Skilled readers vary their pace constantly: they skim a news article for its gist and slow down for the small print of a contract.',
      'This flexibility, rather than raw speed, is the mark of an expert reader, and it can be trained.',
      'Admittedly, it takes far longer to develop than the few weeks that speed-reading courses tend to promise.',
    ),
    para(
      'D',
      'Some educators go further and argue that screens themselves are the problem, and that serious study should return to paper.',
      'The evidence here is more mixed than either side tends to admit.',
      'Several reviews of the research have found a small advantage for paper, especially when people read longer factual texts under time pressure.',
      'Even so, I suspect that the habits we bring to a screen, such as skimming, switching between tabs and half-reading, matter more than the screen itself.',
    ),
    para(
      'E',
      'What, then, should a student preparing for a demanding exam do?',
      'Not, I would argue, chase a higher words-per-minute figure.',
      'Far more useful is learning where to slow down: at the key words of a question, at the turning point of a paragraph, at a sentence that seems to say the opposite of what was expected.',
      'Slow reading in the right places is what makes fast reading elsewhere possible.',
    ),
    para(
      'F',
      'There is a final, less measurable reason to defend slow reading.',
      'A text read slowly can surprise us; it leaves room for a thought of our own.',
      'That may never appear on a score report, but it is, I think, the reason most of us came to love books in the first place.',
    ),
  ],
  groups: [
    {
      kind: 'ynng',
      instructions: YNNG_INSTRUCTIONS,
      questions: [
        {
          id: 'sr-1',
          type: 'ynng',
          prompt: 'People who use speed-reading apps tend to feel that they are working efficiently.',
          answer: 'YES',
          evidence: ['A3'],
          explanation: 'The writer states that users “often report feeling remarkably productive”, which matches feeling efficient.',
        },
        {
          id: 'sr-2',
          type: 'ynng',
          prompt: 'Feeling productive shows that a reader has understood more.',
          answer: 'NO',
          evidence: ['A4'],
          explanation:
            '“Feeling productive, however, is simply not the same thing as understanding more.” The writer directly rejects the link, so the answer is NO, not NOT GIVEN.',
        },
        {
          id: 'sr-3',
          type: 'ynng',
          prompt: 'The eye movements we make when reading are a flaw that technology should remove.',
          answer: 'NO',
          evidence: ['B2'],
          explanation: 'Saccades “are not an inefficiency to be engineered away”. The writer directly disagrees.',
        },
        {
          id: 'sr-4',
          type: 'ynng',
          prompt: 'Speed-reading courses are too expensive for most students.',
          answer: 'NOT GIVEN',
          evidence: ['C4'],
          explanation:
            'The writer mentions speed-reading courses only to say what they “tend to promise” about time. Their cost is never discussed.',
        },
        {
          id: 'sr-5',
          type: 'ynng',
          prompt: 'The ability to change reading speed can be improved with practice.',
          answer: 'YES',
          evidence: ['C3'],
          explanation: 'This flexibility “is the mark of an expert reader, and it can be trained”.',
        },
        {
          id: 'sr-6',
          type: 'ynng',
          prompt: 'The way people use screens may matter more than the screens themselves.',
          answer: 'YES',
          evidence: ['D4'],
          explanation:
            '“I suspect that the habits we bring to a screen… matter more than the screen itself.” Note the hedge: “suspect” matches “may”.',
        },
      ],
    },
    {
      kind: 'mcq',
      instructions: 'Choose the correct letter, A, B, C or D.',
      questions: [
        {
          id: 'sr-7',
          type: 'mcq',
          prompt: 'Why does the writer mention a news article and a contract in paragraph C?',
          options: [
            'to illustrate how skilled readers adjust their speed',
            'to show that some texts are more important than others',
            'to compare reading on paper with reading on screen',
            'to suggest that legal documents are hard to understand',
          ],
          answer: 'A',
          evidence: ['C2', 'C3'],
          explanation:
            'The examples follow “Skilled readers vary their pace constantly”: skim one, slow down for the other. They illustrate flexible speed.',
        },
        {
          id: 'sr-8',
          type: 'mcq',
          prompt: 'What is the writer’s main purpose in the passage?',
          options: [
            'to recommend a new kind of reading app',
            'to prove that paper is always better than screens',
            'to explain how scientists discovered saccades',
            'to argue that slowing down at the right moments is valuable',
          ],
          answer: 'D',
          evidence: ['E3', 'E4'],
          explanation:
            'The whole essay builds to “Slow reading in the right places is what makes fast reading elsewhere possible.” B is too extreme: the writer calls the paper-versus-screen evidence “mixed”.',
        },
      ],
    },
    {
      kind: 'sentences',
      instructions: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      maxWords: 2,
      limit: 'NO MORE THAN TWO WORDS',
      questions: [
        {
          id: 'sr-9',
          type: 'gap',
          before: 'Speed-reading apps show',
          after: 'one at a time in the centre of a screen.',
          answers: ['words'],
          evidence: ['A2'],
          explanation: 'The apps “flash words one at a time in the centre of a screen”.',
        },
        {
          id: 'sr-10',
          type: 'gap',
          before: 'The quick movements of the eyes along a line of text are called',
          after: '.',
          answers: ['saccades'],
          evidence: ['B2'],
          explanation: 'The movements are “known as saccades”. Spelling counts: s-a-c-c-a-d-e-s.',
        },
        {
          id: 'sr-11',
          type: 'gap',
          before: 'Comprehension tends to fall as reading speed rises, particularly when a text is',
          after: '.',
          answers: ['complex'],
          evidence: ['B4'],
          explanation: 'Comprehension falls “particularly when a text is complex”.',
        },
        {
          id: 'sr-12',
          type: 'gap',
          before: 'According to the writer, slow reading leaves room for',
          after: 'of our own.',
          answers: ['a thought', 'thought'],
          evidence: ['F2'],
          explanation: 'A slowly read text “leaves room for a thought of our own”. “A thought” is two words, so it fits the limit.',
        },
      ],
    },
  ],
}

// ---------------------------------------------- The Ink That Eats Its Words ---

const ironGall: PracticeSet = {
  id: 'iron-gall',
  passageTitle: 'The Ink That Eats Its Words',
  passageSubtitle: 'For centuries it was prized for lasting forever. Now it threatens the very pages it was written on.',
  paragraphs: [
    para(
      'A',
      'For more than a thousand years, much of the Western world’s knowledge was written in a single kind of ink.',
      'Iron gall ink recorded medieval laws, Renaissance notebooks and the scores of Baroque composers, and it remained in everyday use well into the twentieth century.',
      'Its recipe was simple: tannins extracted from oak galls, iron sulphate, and a little gum arabic to thicken the mixture.',
    ),
    para(
      'B',
      'Oak galls themselves are an accident of nature.',
      'They form when a tiny wasp lays its eggs in an oak bud, prompting the tree to grow a hard, round swelling around the developing larvae.',
      'Crushed and soaked in water, the galls release acids rich in tannin.',
      'When these are combined with iron sulphate, the result is a liquid that looks surprisingly pale when first applied but darkens to a deep black over the following days as it reacts with the air.',
    ),
    para(
      'C',
      'Scribes valued the ink above all for its permanence.',
      'Unlike carbon inks, which sat on the surface of the page and could be wiped away with a damp cloth, iron gall ink bit into the fibres of parchment and paper.',
      'A mistake could only be removed by scraping the surface with a knife.',
      'For record-keepers this was a virtue: a contract written in iron gall ink was difficult to alter without leaving evidence.',
    ),
    para(
      'D',
      'Yet the quality that made the ink so durable has also proved destructive.',
      'Many historical recipes contained more iron sulphate than the tannins could bind, and over the centuries the excess iron and acid attack the cellulose that gives paper its strength.',
      'The damage often begins as a brown halo around each letter.',
      'Later, the paper beneath the strokes becomes brittle and cracks, until whole words fall out and the page comes to resemble lace.',
      'Some of Johann Sebastian Bach’s handwritten scores, for instance, have needed urgent conservation for exactly this reason.',
    ),
    para(
      'E',
      'The speed of this decay is not fixed.',
      'It accelerates sharply in damp conditions, which is why manuscripts kept in humid cellars or flooded archives often fare worst.',
      'Light and changes in temperature also play a part, though conservators generally regard moisture as the most serious enemy.',
      'Keeping collections in stable, relatively dry storage is therefore the first line of defence.',
    ),
    para(
      'F',
      'For pages that are already damaged, chemistry offers a more active remedy.',
      'In the 1990s, conservators in the Netherlands developed a treatment in which affected sheets are bathed in a solution containing calcium phytate, a compound that binds to the free iron and stops it from fuelling further decay.',
      'The sheets are then deacidified and carefully dried.',
      'The process is slow and demands skilled hands, and it cannot restore words that have already crumbled away.',
    ),
    para(
      'G',
      'As a result, many libraries now combine conservation with high-resolution digital imaging, so that the text survives even if the original continues to fade.',
      'Some specialists warn, however, that a digital copy is no substitute for the object itself, which can still reveal information about the paper, the ink and the writer’s hand that no scan captures.',
    ),
  ],
  groups: [
    {
      kind: 'headings',
      instructions:
        'The reading passage has seven paragraphs, A–G. Choose the correct heading for paragraphs B–F from the list of headings below. There are more headings than paragraphs.',
      optionsTitle: 'List of Headings',
      options: [
        { value: 'i', label: 'How a natural growth becomes a dark ink' },
        { value: 'ii', label: 'A strength that turned into a weakness' },
        { value: 'iii', label: 'Prized because it was hard to remove' },
        { value: 'iv', label: 'Conditions that speed up the damage' },
        { value: 'v', label: 'A chemical cure and its limits' },
        { value: 'vi', label: 'Modern inks take over' },
        { value: 'vii', label: 'Saving the words but not the page' },
        { value: 'viii', label: 'Famous musicians who wrote in iron gall ink' },
      ],
      questions: [
        {
          id: 'ig-1',
          type: 'choose',
          prompt: 'Paragraph B',
          paragraph: 'B',
          answer: 'i',
          evidence: ['B2', 'B4'],
          explanation:
            'B follows the ink from its natural source, a swelling an oak grows around wasp larvae, to the liquid that “darkens to a deep black”.',
        },
        {
          id: 'ig-2',
          type: 'choose',
          prompt: 'Paragraph C',
          paragraph: 'C',
          answer: 'iii',
          evidence: ['C1', 'C3'],
          explanation:
            'C opens with “Scribes valued the ink above all for its permanence” and explains that mistakes could only be scraped off with a knife.',
        },
        {
          id: 'ig-3',
          type: 'choose',
          prompt: 'Paragraph D',
          paragraph: 'D',
          answer: 'ii',
          evidence: ['D1'],
          explanation:
            '“The quality that made the ink so durable has also proved destructive”: a strength turned weakness. Heading viii is a trap built on the single mention of Bach.',
        },
        {
          id: 'ig-4',
          type: 'choose',
          prompt: 'Paragraph E',
          paragraph: 'E',
          answer: 'iv',
          evidence: ['E2', 'E3'],
          explanation: 'E explains what makes decay faster: damp above all, plus light and temperature changes.',
        },
        {
          id: 'ig-5',
          type: 'choose',
          prompt: 'Paragraph F',
          paragraph: 'F',
          answer: 'v',
          evidence: ['F2', 'F4'],
          explanation:
            'F describes the calcium phytate treatment (a chemical cure) and ends with its limits: it is slow, needs skill and “cannot restore words that have already crumbled away”.',
        },
      ],
    },
    {
      kind: 'tfng',
      instructions: TFNG_INSTRUCTIONS,
      questions: [
        {
          id: 'ig-6',
          type: 'tfng',
          prompt: 'Iron gall ink had gone out of use before the twentieth century.',
          answer: 'FALSE',
          evidence: ['A2'],
          explanation: 'It “remained in everyday use well into the twentieth century”, the opposite of the statement.',
        },
        {
          id: 'ig-7',
          type: 'tfng',
          prompt: 'Iron gall ink looks darker when first applied than it does a few days later.',
          answer: 'FALSE',
          evidence: ['B4'],
          explanation: 'It “looks surprisingly pale when first applied but darkens to a deep black over the following days”, so it gets darker, not lighter.',
        },
        {
          id: 'ig-8',
          type: 'tfng',
          prompt: 'Carbon inks were more expensive to make than iron gall ink.',
          answer: 'NOT GIVEN',
          evidence: ['C2'],
          explanation:
            'Carbon inks are compared with iron gall ink only on how easily they could be wiped away. Their cost is never mentioned.',
        },
        {
          id: 'ig-9',
          type: 'tfng',
          prompt: 'Conservators consider humidity a greater threat than light.',
          answer: 'TRUE',
          evidence: ['E3'],
          explanation:
            'Light “also plays a part”, but conservators “regard moisture as the most serious enemy”. Humidity = moisture.',
        },
      ],
    },
    {
      kind: 'wordbox',
      instructions: 'Complete the summary using the list of words, A–H, below.',
      summaryTitle: 'Treating damaged manuscripts',
      optionsTitle: 'Word box',
      options: [
        { value: 'A', label: 'binds' },
        { value: 'B', label: 'dissolves' },
        { value: 'C', label: 'time-consuming' },
        { value: 'D', label: 'inexpensive' },
        { value: 'E', label: 'digital' },
        { value: 'F', label: 'printed' },
        { value: 'G', label: 'removes' },
        { value: 'H', label: 'risky' },
      ],
      questions: [
        {
          id: 'ig-10',
          type: 'gap',
          before: 'Since the 1990s, damaged pages have been treated by soaking them in a solution that',
          after: 'the free iron. Afterwards, the pages are deacidified and dried.',
          answers: ['A'],
          evidence: ['F2'],
          explanation:
            'Calcium phytate “binds to the free iron”. It does not dissolve or remove it; it stops the iron fuelling decay.',
        },
        {
          id: 'ig-11',
          type: 'gap',
          before: 'However, the method is',
          after: 'and cannot bring back text that has already been lost.',
          answers: ['C'],
          evidence: ['F4'],
          explanation: '“The process is slow and demands skilled hands”: slow = time-consuming. Nothing suggests it is risky or cheap.',
        },
        {
          id: 'ig-12',
          type: 'gap',
          before: 'For this reason, many libraries also make',
          after: 'copies of their manuscripts.',
          answers: ['E'],
          evidence: ['G1'],
          explanation: 'Libraries “combine conservation with high-resolution digital imaging”, which creates digital copies.',
        },
      ],
    },
    {
      kind: 'mcq',
      instructions: 'Choose the correct letter, A, B, C or D.',
      questions: [
        {
          id: 'ig-13',
          type: 'mcq',
          prompt: 'What point do some specialists make in paragraph G?',
          options: [
            'Digital imaging can damage fragile manuscripts.',
            'Scanning is too expensive for most libraries.',
            'Original documents hold information that copies cannot record.',
            'Conservation should stop once a page has been scanned.',
          ],
          answer: 'C',
          evidence: ['G2'],
          explanation:
            'The originals “can still reveal information about the paper, the ink and the writer’s hand that no scan captures”.',
        },
      ],
    },
  ],
}

const single = (set: PracticeSet): ReadingTest => ({ id: set.id, passages: [set] })

/** The original one-passage practice sets. Newer tests live in ./tests/ and load on demand. */
export const PRACTICE: Record<string, ReadingTest> = Object.fromEntries(
  [nightShift, owlsAndLarks, slowReading, ironGall].map((set) => [set.id, single(set)]),
)
