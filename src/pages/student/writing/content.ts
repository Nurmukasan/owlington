import type { Lecture, PracticeInfo } from '../../../learn/types'

/*
 * The Inkwell Study — Writing lectures and practice prompts.
 *
 * This file lands in the main bundle (catalog.ts imports it), so it only holds
 * light metadata. Prompts, charts, model answers and checklists live in
 * prompts.ts, which only the lazy Practice page imports.
 */

export const lectures: Lecture[] = [
  {
    id: 'essay-types',
    title: 'Task 2 essay types, decoded',
    summary:
      'Every Task 2 question is one of five types in disguise. Learn to spot the instruction, answer every part of it, and pick the essay shape that fits.',
    minutes: 12,
    level: 'Foundation',
    chapters: [
      {
        title: 'Five questions in disguise',
        points: [
          'Opinion: “To what extent do you agree or disagree?” You must take a clear position and keep it to the last line.',
          'Discussion: “Discuss both views and give your own opinion.” That is three jobs: view one, view two, and where you stand.',
          'Advantages and disadvantages: if it asks whether the advantages outweigh the disadvantages, you have to weigh them and say which side wins.',
          'Problem–solution and two-part questions: answer every question you are asked. Two questions means two clearly answered halves.',
        ],
      },
      {
        title: 'Read the instruction, not just the topic',
        points: [
          'Underline two things: the topic (what it is about) and the instruction (what you must do with it).',
          'The most common Task 2 mistake is writing a good essay about the topic that never answers the actual question.',
          'Watch the limiting words. “Children under 12”, “in your country”, “in cities” narrow what you should discuss.',
        ],
      },
      {
        title: 'Match the shape to the type',
        points: [
          'Opinion: introduction with your position, two body paragraphs that support it, conclusion that restates it in fresh words.',
          'Discussion: one body paragraph per view, with your opinion stated in the introduction and confirmed in the conclusion.',
          'Problem–solution: one paragraph of causes or problems, one of solutions — and make each solution answer a problem you named.',
        ],
      },
      {
        title: 'Time and length',
        points: [
          'Give Task 2 about 40 minutes: roughly 5 to plan, 30 to write and 5 to check.',
          'The minimum is 250 words and short answers lose marks. Aim for 270–320 well-controlled words rather than 400 rushed ones.',
          'Task 2 counts twice as much as Task 1, and you may do the tasks in either order — many candidates start with Task 2.',
        ],
      },
    ],
  },
  {
    id: 'thesis-paragraphs',
    title: 'Building a thesis & paragraph structure',
    summary:
      'A thesis is a promise and every paragraph keeps part of it. Write introductions that earn their place, PEEL body paragraphs and conclusions that close the loop.',
    minutes: 14,
    level: 'Foundation',
    chapters: [
      {
        title: 'The thesis is a promise',
        points: [
          'Your thesis is one sentence that answers the question directly: “I firmly believe that…” or “While X has merits, I would argue that…”.',
          'A strong thesis previews your two main reasons, so the examiner can predict your body paragraphs.',
          'Everything after the thesis should support it. If a paragraph does not, cut it or change the thesis.',
        ],
      },
      {
        title: 'Introductions that earn their place',
        points: [
          'Two sentences are enough: paraphrase the question, then state your thesis.',
          'Do not copy the question. Text copied from the prompt does not show your language and is not counted towards your words.',
          'Skip empty openers like “Nowadays this is a hot topic”. Every sentence should do a job.',
        ],
      },
      {
        title: 'PEEL body paragraphs',
        points: [
          'Point: open with a topic sentence that states the paragraph’s one main idea.',
          'Explain: say why or how it is true. This is where your reasoning and complex sentences live.',
          'Example and Link: give one specific, realistic example, then link back to the question or your position.',
          'One idea per paragraph. Two half-developed ideas score lower than one idea explained well.',
        ],
      },
      {
        title: 'Conclusions that close the loop',
        points: [
          'Restate your position in new words — never introduce a new argument at the end.',
          'Briefly sum up the two main reasons in one sentence.',
          'Signal it clearly with “In conclusion” or “To sum up”, and keep it to two or three sentences.',
        ],
      },
    ],
  },
  {
    id: 'coherence-cohesion',
    title: 'Coherence & cohesion: linking and referencing',
    summary:
      'A quarter of your Writing score is how easily the reader can follow you. Use linking words with precise jobs, avoid mechanical overuse and master referencing.',
    minutes: 15,
    level: 'Intermediate',
    chapters: [
      {
        title: 'Coherence vs cohesion',
        points: [
          'Coherence is the logic: ideas in a sensible order, one clear purpose per paragraph.',
          'Cohesion is the glue: linking words, pronouns, “this/these” and synonyms that tie sentences together.',
          'Together they make up one of the four equally weighted criteria — 25% of your Writing band.',
        ],
      },
      {
        title: 'Linkers with precise jobs',
        points: [
          'Addition: moreover, in addition, furthermore. Contrast: however, whereas, in contrast. Result: as a result, consequently, therefore.',
          'Choose by meaning, not by sound. “On the other hand” must introduce a genuinely opposite side, not just another point.',
          'Mix sentence linkers (However, …) with clause linkers (although, whereas, because) for natural rhythm.',
        ],
      },
      {
        title: 'Overuse is a red flag',
        points: [
          'Starting every sentence with a linker reads as mechanical, and examiners mark it down.',
          'Move linkers inside the sentence for variety: “This approach, however, is expensive.”',
          'If the logic is already obvious from the order of your ideas, you do not need a linker at all.',
        ],
      },
      {
        title: 'Referencing and substitution',
        points: [
          '“This/These + summary noun” links ideas elegantly: “This trend…”, “Such policies…”, “These figures…”.',
          'Every “it” and “they” needs one clear antecedent. If the reader could ask “which?”, use a noun.',
          'Substitute sensibly: “cars… vehicles… they” keeps the thread without repeating the same word five times.',
        ],
      },
    ],
  },
  {
    id: 'lexical-resource',
    title: 'Lexical resource: collocations & avoiding repetition',
    summary:
      'Precision beats fancy words. Learn the collocations that sound natural, vary key terms without changing their meaning and protect your score from spelling slips.',
    minutes: 13,
    level: 'Intermediate',
    chapters: [
      {
        title: 'Range with precision',
        points: [
          'A precise everyday word beats a rare word used wrongly. “A serious problem” is better than “a gargantuan problem”.',
          'Upgrade vague words: “good” → beneficial, effective, worthwhile; “bad” → harmful, damaging, counterproductive.',
          'Use less common words only when you know their meaning, grammar and typical partners.',
        ],
      },
      {
        title: 'Collocations sound native',
        points: [
          'Natural pairs: pose a threat, play a crucial role, a sharp rise, heavy traffic, reach a consensus.',
          'Learn verb + noun pairs as one chunk: “conduct research”, never “make research”; “make a decision”, not “do a decision”.',
          'Keep a notebook of collocations by topic: environment, education, technology, health, work.',
        ],
      },
      {
        title: 'Repeating without repeating',
        points: [
          'Some repetition of key topic words is fine — but the same word in every sentence looks limited.',
          'Rotate synonyms and word families: economy, economic, financially; teenagers, young people, adolescents.',
          'Never swap in a synonym that changes your meaning. “Pupils” and “students” are close; “kids” is too informal.',
        ],
      },
      {
        title: 'Spelling & word formation',
        points: [
          'Errors in spelling and word formation lower Lexical Resource. Check suffixes: economic (of the economy) vs economical (saves money).',
          'Usual suspects: environment, government, necessary, accommodation, definitely, receive.',
          'British and American spelling are both accepted — pick one and be consistent.',
        ],
      },
    ],
  },
  {
    id: 'grammar-range',
    title: 'Grammatical range without errors',
    summary:
      'Band 7 needs a variety of complex structures and frequent error-free sentences. Build range on purpose, then run a quick accuracy audit before time runs out.',
    minutes: 16,
    level: 'Advanced',
    chapters: [
      {
        title: 'Range means variety',
        points: [
          'Mix simple, compound and complex sentences. A paragraph of only short sentences, or only long ones, limits your band.',
          'Useful structures: relative clauses, conditionals, passives, participle clauses and comparatives.',
          'Range only counts if it is controlled. Frequent error-free sentences are the band 7 signal.',
        ],
      },
      {
        title: 'Complex sentences that work',
        points: [
          'Lead with a subordinate clause: “Although public transport is cheaper, many commuters still drive.”',
          'Add information with a relative clause: “Cities that invest in cycle lanes see fewer short car trips.”',
          'One complex structure per sentence is plenty. Stacking three clauses is where errors creep in.',
        ],
      },
      {
        title: 'The accuracy audit',
        points: [
          'Articles: “the government”, “a significant rise”, and no article for general uncountable nouns like “education”.',
          'Agreement and countability: “the number of cars is…”, “much information”, never “informations” or “advices”.',
          'Task 1 tenses: past simple for past data, present for no date, and “is projected to” for predictions.',
        ],
      },
      {
        title: 'Punctuation that carries meaning',
        points: [
          'Put a comma after an opening clause or phrase: “In many countries, …”.',
          'Never join two full sentences with just a comma. Use a full stop, a semicolon or a linking word.',
          'Leave the final five minutes to reread for missing words, plurals and verb endings.',
        ],
      },
    ],
  },
  {
    id: 'task1-overview',
    title: 'Task 1 Academic: the overview & key features',
    summary:
      'Task 1 is a report, not an essay. Write an overview that captures the big picture, select the features that matter and back every claim with data.',
    minutes: 12,
    level: 'Foundation',
    chapters: [
      {
        title: 'What Task 1 asks',
        points: [
          'At least 150 words in about 20 minutes, summarising the main features and making comparisons where relevant.',
          'Report only what the visual shows. No opinions, no causes you invented, no recommendations.',
          'You may get a line graph, bar chart, pie chart, table, map or process diagram — or a combination.',
        ],
      },
      {
        title: 'The overview is the heart',
        points: [
          'In two sentences, describe the biggest picture: the main trends, the extremes or the number of stages.',
          'An overview usually needs no numbers. “Overall, X rose steadily while Y fell” is enough.',
          'Without a clear overview, your Task Achievement score is held back however accurate the details are.',
        ],
      },
      {
        title: 'Selecting key features',
        points: [
          'Do not describe every number. Group similar items and highlight the highest, lowest, biggest change and any exception.',
          'Crossing points are gold: “By 2016, the youngest group had overtaken the oldest.”',
          'For a process, mention where it starts, where it ends and the stages that change something.',
        ],
      },
      {
        title: 'A reliable four-paragraph shape',
        points: [
          'Paragraph 1: paraphrase what the visual shows, with the place, time period and units.',
          'Paragraph 2: the overview. Paragraphs 3–4: details for each group of features, with figures.',
          'Support every claim with data and units, and check that each number matches the visual.',
        ],
      },
    ],
  },
  {
    id: 'trends-comparisons',
    title: 'Describing trends & comparisons',
    summary:
      'The vocabulary and grammar of change: verbs and nouns of movement, precise numbers, comparison structures and the right tenses for every time frame.',
    minutes: 14,
    level: 'Intermediate',
    chapters: [
      {
        title: 'Verbs and nouns of change',
        points: [
          'Up: rise, increase, climb, grow. Down: fall, decline, drop, decrease. Also: fluctuate, peak at, level off.',
          'Switch between verbs and nouns: “Sales rose sharply” / “There was a sharp rise in sales.”',
          'Grade the change with adverbs: slightly, gradually, steadily, considerably, dramatically.',
        ],
      },
      {
        title: 'Numbers with precision',
        points: [
          '“From 20% to 35%” is a rise of 15 percentage points, not 15 percent.',
          'Approximate naturally: just over a third, roughly half, nearly doubled, almost quadrupled.',
          'Always include units — hours per week, millions of tonnes, percentage of households.',
        ],
      },
      {
        title: 'Comparison structures',
        points: [
          'Comparatives and superlatives: higher than, the lowest, twice as many as, the same as.',
          'Contrast two items in one sentence: “Car use fell, whereas cycling doubled.”',
          'Compare at the key moments — start, end, peaks, crossings — not at every single year.',
        ],
      },
      {
        title: 'Tenses and time phrases',
        points: [
          'Past simple for finished periods; past perfect for “by 2016, it had overtaken…”.',
          'Future data needs prediction language: “is projected to”, “is expected to reach”.',
          'Vary time phrases: over the period, between 2000 and 2020, by the end of the decade.',
        ],
      },
    ],
  },
  {
    id: 'gt-letters',
    title: 'General Training letters & tone',
    summary:
      'For General Training Task 1 you write a letter. Read the relationship, choose the right tone, cover all three bullet points and open and close like a native writer.',
    minutes: 11,
    level: 'Foundation',
    chapters: [
      {
        title: 'Know your reader',
        points: [
          'Formal: someone you do not know, such as a company or an official. Semi-formal: someone you know a little, like a manager or landlord.',
          'Informal: a friend or relative. The relationship decides your vocabulary, contractions and greeting.',
          'Whatever the tone, the letter must stay clear and polite — tone is part of your Task Achievement score.',
        ],
      },
      {
        title: 'Openings and sign-offs',
        points: [
          '“Dear Sir or Madam” closes with “Yours faithfully”; “Dear Ms Okafor” closes with “Yours sincerely”.',
          'Friends get “Dear Sam” or “Hi Sam”, closed with “Best wishes” or “Take care”.',
          'Say why you are writing in the first line: “I am writing to…”. No addresses are needed.',
        ],
      },
      {
        title: 'Cover every bullet point',
        points: [
          'Each bullet point usually becomes one paragraph. Missing one limits your Task Achievement band.',
          'Develop each bullet with a detail or reason; invented details are fine as long as they are believable.',
          'Aim for 160–190 words: enough to develop all three bullets without rushing.',
        ],
      },
      {
        title: 'The tone toolkit',
        points: [
          'Formal requests: “I would be grateful if you could…”. Informal: “Could you…?” or “It’d be great if…”.',
          'Formal letters avoid contractions and slang; informal letters can use them naturally.',
          'Keep the tone consistent from greeting to sign-off. A switch mid-letter is noticeable.',
        ],
      },
    ],
  },
]

/** Which Writing task a prompt belongs to; used for grouping, stamps and timers. */
export type WritingTask = 'task1-academic' | 'task1-gt' | 'task2'

export interface PromptMeta {
  task: WritingTask
  /** Minimum words. */
  minWords: number
  /** Short stamp text, e.g. "LINE GRAPH". */
  stamp: string
}

export const practiceSets: PracticeInfo[] = [
  {
    id: 't1-volunteering',
    title: 'Volunteering hours by age group',
    summary:
      'A line graph of weekly volunteering hours for three age groups in one city, 2000–2020. Write the overview, find the crossing points and compare.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Line graph'],
    tags: ['Task 1 · Line graph'],
    level: 'Foundation',
  },
  {
    id: 't1-coffee-kits',
    title: 'From coffee grounds to mushrooms',
    summary:
      'A process diagram showing how used coffee grounds become home mushroom-growing kits. Sequence eight stages with the passive voice.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Process diagram'],
    tags: ['Task 1 · Process diagram'],
    level: 'Intermediate',
  },
  {
    id: 'gt-festival-letter',
    title: 'A letter to the festival organiser',
    summary:
      'General Training: give feedback on a reading festival you helped at. Cover all three bullet points in the right semi-formal tone.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · General Training', 'Letter'],
    tags: ['Task 1 · Letter (General Training)'],
    level: 'Foundation',
  },
  {
    id: 't2-cooking-school',
    title: 'Cooking lessons for every teenager',
    summary:
      'An opinion essay: should every secondary school student learn to cook healthy meals? Take a clear position and keep it to the last line.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Opinion essay'],
    tags: ['Task 2 · Opinion'],
    level: 'Intermediate',
  },
  {
    id: 't2-language-abroad',
    title: 'Learning a language: abroad or at home?',
    summary:
      'A discussion essay: is living abroad the best way to learn a language, or can technology do it at home? Discuss both views and give your own.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Discussion essay'],
    tags: ['Task 2 · Discussion'],
    level: 'Advanced',
  },
  {
    id: 't2-outdoor-play',
    title: 'Why children play outdoors less',
    summary:
      'A problem–solution essay: why do city children spend less time outdoors, and what can be done? Match every solution to a cause.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Problem–solution essay'],
    tags: ['Task 2 · Problem–solution'],
    level: 'Intermediate',
  },
  {
    id: 'wfull-01',
    title: 'Full Test 1',
    summary: 'Task 1: how people in one city travel to work, 2005–2025 (line graph). Task 2: should museums be free, paid for by the state? (opinion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-02',
    title: 'Full Test 2',
    summary: 'Task 1: how men and women share five kinds of housework (bar chart). Task 2: should children start school early or at seven? (discussion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-03',
    title: 'Full Test 3',
    summary: 'Task 1: where a region’s electricity came from in 2005 and 2025 (two pie charts). Task 2: working from home — do the advantages outweigh the disadvantages?',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-04',
    title: 'Full Test 4',
    summary: 'Task 1: visitors to five city attractions in three years (table). Task 2: why households waste food, and what can be done (problem–solution).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-05',
    title: 'Full Test 5',
    summary: 'Task 1: how olive oil is made (process). Task 2: why people buy second-hand clothes — and is it a good thing? (two-part question).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-06',
    title: 'Full Test 6',
    summary: 'Task 1: how a village changed between 1995 and today (two maps). Task 2: public transport or new roads — where should governments spend? (opinion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-07',
    title: 'Full Test 7',
    summary: 'Task 1: international students at a university, and what they studied (bar chart + pie chart). Task 2: should university be free, or paid for by students? (discussion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Advanced',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-08',
    title: 'Full Test 8',
    summary: 'Task 1: monthly spending on CDs, downloads and streaming, 2000–2025 (line graph). Task 2: banning cars from city centres — do the advantages outweigh the disadvantages?',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-09',
    title: 'Full Test 9',
    summary: 'Task 1: who exercises enough, by age group, in 2005 and 2025 (bar chart). Task 2: why school leavers lack life skills, and how to fix it (problem–solution).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-10',
    title: 'Full Test 10',
    summary: 'Task 1: how four countries use water each day (table). Task 2: why fewer people read newspapers — and will print disappear? (two-part question).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Advanced',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-11',
    title: 'Full Test 11',
    summary: 'Task 1: a fishing port turned into a leisure waterfront (two maps). Task 2: should advertising aimed at children be banned? (opinion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Advanced',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-12',
    title: 'Full Test 12',
    summary: 'Task 1: how a house collects and reuses rainwater (process). Task 2: is space exploration a waste of money? (discussion).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-13',
    title: 'Full Test 13',
    summary: 'Task 1: how household spending changed between 1985 and 2025 (two pie charts). Task 2: tourism to remote places — do the advantages outweigh the disadvantages?',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Intermediate',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-14',
    title: 'Full Test 14',
    summary: 'Task 1: the growth of online shopping, and which products people buy online (line graph + table). Task 2: why elderly people are lonely, and what can be done (problem–solution).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Advanced',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 'wfull-15',
    title: 'Full Test 15',
    summary: 'Task 1: energy use by four sectors in 1990, 2005 and 2020 (bar chart). Task 2: why people change careers — and is it a good thing? (two-part question).',
    minutes: 60,
    questionCount: 20,
    kinds: ['Task 1 · Academic', 'Task 2', 'Full test'],
    level: 'Advanced',
    format: 'full',
    added: '2026-10-24',
  },
  {
    id: 't1-bar-libraries',
    title: 'Library loans: printed books and e-books',
    summary: 'A bar chart with two series over four years — one falls, one rises, and they cross. Find the moment of overtaking.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Bar chart'],
    tags: ['Task 1 · Bar chart'],
    level: 'Foundation',
    added: '2026-10-24',
  },
  {
    id: 't1-bar-transport',
    title: 'How students get to school',
    summary: 'A bar chart comparing three schools and four ways of travelling. No years: this one is all about comparison.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Bar chart'],
    tags: ['Task 1 · Bar chart'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-pie-waste',
    title: 'Where a town’s rubbish goes',
    summary: 'Two pie charts, 2000 and 2024: landfill collapses and recycling takes over. Describe shares with fractions and percentages.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Pie chart'],
    tags: ['Task 1 · Pie chart'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-pie-time',
    title: 'A day in the life: students and workers',
    summary: 'Two pie charts comparing two groups, not two years. Compare, do not describe change — and turn percentages into hours.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Pie chart'],
    tags: ['Task 1 · Pie chart'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-table-cinema',
    title: 'Cinema in four countries',
    summary: 'A table with three different measures. Keep the units apart and spot the one relationship that matters.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Table'],
    tags: ['Task 1 · Table'],
    level: 'Advanced',
    added: '2026-10-24',
  },
  {
    id: 't1-table-population',
    title: 'Five cities over fifty years',
    summary: 'A table of populations in three years. Group the cities by trend: fast-growing, stable and shrinking.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Table'],
    tags: ['Task 1 · Table'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-mixed-cafe',
    title: 'A café’s busy hours and best-sellers',
    summary: 'Two visuals: a line graph of customers per hour and a pie chart of sales. One overview point for each.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Mixed charts'],
    tags: ['Task 1 · Mixed charts'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-map-campus',
    title: 'A college campus, then and now',
    summary: 'Two plans of a college: a car park disappears, a library grows and student housing replaces half the fields.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Map'],
    tags: ['Task 1 · Map'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't1-map-island',
    title: 'An island becomes a resort',
    summary: 'An almost untouched island before and after tourist development. Follow the new road and locate every change.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Map'],
    tags: ['Task 1 · Map'],
    level: 'Advanced',
    added: '2026-10-24',
  },
  {
    id: 't1-process-glass',
    title: 'Recycling glass bottles',
    summary: 'An eight-stage man-made cycle. Practise the passive and a full range of sequencers.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Process diagram'],
    tags: ['Task 1 · Process diagram'],
    level: 'Foundation',
    added: '2026-10-24',
  },
  {
    id: 't1-line-tourism',
    title: 'Overseas visitors to three countries',
    summary: 'A line graph with growth, decline and a shared crash in 2020 — then one country overtakes another.',
    minutes: 20,
    questionCount: 10,
    kinds: ['Task 1 · Academic', 'Line graph'],
    tags: ['Task 1 · Line graph'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't2-adv-online-learning',
    title: 'Degrees taught entirely online',
    summary: 'An advantages–disadvantages essay: flexibility and cost against motivation and practical subjects.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Advantages–disadvantages essay'],
    tags: ['Task 2 · Advantages–disadvantages'],
    level: 'Foundation',
    added: '2026-10-24',
  },
  {
    id: 't2-adv-tourism-city',
    title: 'Mass tourism in famous cities',
    summary: 'Do the advantages of mass tourism outweigh the disadvantages? Give a verdict and defend it to the last line.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Advantages–disadvantages essay'],
    tags: ['Task 2 · Advantages–disadvantages'],
    level: 'Advanced',
    added: '2026-10-24',
  },
  {
    id: 't2-two-part-cooking',
    title: 'Why we cook less at home',
    summary: 'Two questions: why people cook less, and what effects this has. Answer both — effects, not solutions.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Two-part question'],
    tags: ['Task 2 · Two-part question'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't2-two-part-languages',
    title: 'Disappearing languages',
    summary: 'Why are small languages dying out, and does it matter? A two-part question with a clear position.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Two-part question'],
    tags: ['Task 2 · Two-part question'],
    level: 'Advanced',
    added: '2026-10-24',
  },
  {
    id: 't2-opinion-four-day-week',
    title: 'A four-day week for everyone?',
    summary: 'An opinion essay on a strong claim — “all companies”. Agree, disagree, or agree in part, and say exactly where you stand.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Opinion essay'],
    tags: ['Task 2 · Opinion'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't2-discussion-ai-homework',
    title: 'AI tools and homework',
    summary: 'Discuss both views — learning aid or shortcut? — and give a clear opinion of your own.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Discussion essay'],
    tags: ['Task 2 · Discussion'],
    level: 'Intermediate',
    added: '2026-10-24',
  },
  {
    id: 't2-problem-traffic',
    title: 'Traffic jams in big cities',
    summary: 'A problem–solution essay: causes of congestion and measures to reduce it. Match every solution to a cause.',
    minutes: 40,
    questionCount: 10,
    kinds: ['Task 2', 'Problem–solution essay'],
    tags: ['Task 2 · Problem–solution'],
    level: 'Foundation',
    added: '2026-10-24',
  },
]

/** Light per-prompt facts the hub needs (the heavy material is in prompts.ts). */
export const PROMPT_META: Record<string, PromptMeta> = {
  't1-volunteering': { task: 'task1-academic', minWords: 150, stamp: 'LINE GRAPH' },
  't1-coffee-kits': { task: 'task1-academic', minWords: 150, stamp: 'PROCESS' },
  'gt-festival-letter': { task: 'task1-gt', minWords: 150, stamp: 'LETTER' },
  't2-cooking-school': { task: 'task2', minWords: 250, stamp: 'OPINION' },
  't2-language-abroad': { task: 'task2', minWords: 250, stamp: 'DISCUSSION' },
  't2-outdoor-play': { task: 'task2', minWords: 250, stamp: 'PROBLEM–SOLUTION' },
  'wfull-01': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-02': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-03': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-04': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-05': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-06': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-07': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-08': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-09': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-10': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-11': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-12': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-13': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-14': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  'wfull-15': { task: 'task2', minWords: 400, stamp: 'FULL TEST' },
  't1-bar-libraries': { task: 'task1-academic', minWords: 150, stamp: 'BAR CHART' },
  't1-bar-transport': { task: 'task1-academic', minWords: 150, stamp: 'BAR CHART' },
  't1-pie-waste': { task: 'task1-academic', minWords: 150, stamp: 'PIE CHART' },
  't1-pie-time': { task: 'task1-academic', minWords: 150, stamp: 'PIE CHART' },
  't1-table-cinema': { task: 'task1-academic', minWords: 150, stamp: 'TABLE' },
  't1-table-population': { task: 'task1-academic', minWords: 150, stamp: 'TABLE' },
  't1-mixed-cafe': { task: 'task1-academic', minWords: 150, stamp: 'MIXED CHARTS' },
  't1-map-campus': { task: 'task1-academic', minWords: 150, stamp: 'MAP' },
  't1-map-island': { task: 'task1-academic', minWords: 150, stamp: 'MAP' },
  't1-process-glass': { task: 'task1-academic', minWords: 150, stamp: 'PROCESS DIAGRAM' },
  't1-line-tourism': { task: 'task1-academic', minWords: 150, stamp: 'LINE GRAPH' },
  't2-adv-online-learning': { task: 'task2', minWords: 250, stamp: 'ADVANTAGES' },
  't2-adv-tourism-city': { task: 'task2', minWords: 250, stamp: 'ADVANTAGES' },
  't2-two-part-cooking': { task: 'task2', minWords: 250, stamp: 'TWO-PART' },
  't2-two-part-languages': { task: 'task2', minWords: 250, stamp: 'TWO-PART' },
  't2-opinion-four-day-week': { task: 'task2', minWords: 250, stamp: 'OPINION' },
  't2-discussion-ai-homework': { task: 'task2', minWords: 250, stamp: 'DISCUSSION' },
  't2-problem-traffic': { task: 'task2', minWords: 250, stamp: 'PROBLEM–SOLUTION' },
}

export const metaFor = (id: string): PromptMeta => PROMPT_META[id] ?? { task: 'task2', minWords: 250, stamp: 'ESSAY' }

/** What the student is writing: a report, a letter or an essay. */
export const pieceNoun = (task: WritingTask) => (task === 'task1-gt' ? 'letter' : task === 'task1-academic' ? 'report' : 'essay')

/** localStorage key for a prompt's autosaved draft. */
export const draftKey = (userId: string, practiceId: string) => `wr-draft:${userId}:${practiceId}`
