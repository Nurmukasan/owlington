import type { Lecture, PracticeInfo } from '../../../learn/types'

/*
 * Owl FM — the Listening course.
 * This file is imported by the shared catalog (main bundle), so it only holds
 * lecture notes and practice-set summaries. The full recordings, questions and
 * answer keys live in practice-data.ts, loaded only by the practice page.
 */

export const lectures: Lecture[] = [
  {
    id: 'predict',
    title: 'Predict the answer before you hear it',
    summary: 'Use the reading time like a pro: spot the keywords, guess the shape of each answer and stay one question ahead.',
    minutes: 9,
    level: 'Foundation',
    chapters: [
      {
        title: 'Use the silence',
        points: [
          'Before each recording you get time to read the questions. Spend every second reading ahead, never re-checking old answers.',
          'Underline the words that carry meaning: nouns, names and numbers. Skip the little words like “the” and “of”.',
          'Read the instruction as carefully as the questions. “ONE WORD AND/OR A NUMBER” decides which answers can score.',
        ],
      },
      {
        title: 'Predict the grammar',
        points: [
          'Look at the words around each gap. “a ___ of” needs a noun; “very ___” needs an adjective.',
          'Check singular or plural. After “two” or “several”, the answer will almost certainly end in -s.',
          'A £ sign, “at” before a time or “on” before a day tells you exactly what shape the answer will take.',
        ],
      },
      {
        title: 'Predict the meaning',
        points: [
          'Guess a likely answer for every gap. Even a wrong guess tunes your ear to the topic.',
          'Expect paraphrase: the paper says “cost”, the speaker says “fee”, “charge” or “it comes to”.',
          'Headings on a form or in notes are a map of the recording. Use them to know where you are.',
        ],
      },
      {
        title: 'Stay one step ahead',
        points: [
          'Answers come in question order, so keep your eyes on the next two questions, not just the current one.',
          'If you hear the answer to question 5, question 4 has gone. Let it go and keep moving.',
          'There is no penalty for a wrong answer. Fill every gap with your best guess before you finish.',
        ],
      },
    ],
  },
  {
    id: 'numbers-spelling',
    title: 'Numbers, dates & spelling',
    summary: 'Letter-by-letter names, phone numbers, prices and dates: the easy marks that most candidates throw away.',
    minutes: 12,
    level: 'Foundation',
    chapters: [
      {
        title: 'Letter by letter',
        points: [
          'Names and street names are often spelt out. Write each letter as you hear it, then read the whole word back.',
          'Practise the letters that sound alike: A/E/I, G/J, B/P/V, M/N and S/F.',
          '“Double L” means two Ls. Speakers also spell in chunks, so “W-H-I-T… M-O-R-E” is one word.',
        ],
      },
      {
        title: 'Numbers that sound alike',
        points: [
          'Thirteen or thirty? Teen numbers stress the end (thir-TEEN); tens stress the start (THIR-ty).',
          'In British English “oh” often means zero, and “double five” means 55.',
          'Phone numbers are read in groups. Write them in the same groups and count the digits at the end.',
        ],
      },
      {
        title: 'Dates, times and money',
        points: [
          'A date can be “the third of May” or “May the third”. Writing “3 May” is safe either way.',
          '“Nine ninety-five” is £9.95 and “half past seven” is 7.30. Write the figure, not the words.',
          'Listen past the first number. Prices and times are often updated: “it was £40, but now it’s £35.”',
        ],
      },
      {
        title: 'Write it so it counts',
        points: [
          'Spelling must be correct to score. British and American spellings are both accepted.',
          'Write numbers as digits. They are quicker to write and can never be misspelt.',
          'Capital letters don’t matter, but a missing plural -s can cost you the mark.',
        ],
      },
    ],
  },
  {
    id: 'distractors',
    title: 'Distractors & self-corrections',
    summary: 'Why the first answer you hear is so often wrong, and the signal words that warn you a correction is coming.',
    minutes: 14,
    level: 'Intermediate',
    chapters: [
      {
        title: 'How the trap works',
        points: [
          'IELTS recordings often mention a wrong answer first. The speaker then corrects it, rejects it or updates it.',
          'The correction can come from either speaker: “Tuesday?” — “No, sorry, the Tuesday group is full. It’s Thursday.”',
          'If you write the first word that fits the gap, you will fall for the trap again and again.',
        ],
      },
      {
        title: 'Words that flip an answer',
        points: [
          '“Actually”, “sorry, I mean”, “on second thoughts” and “oh, wait” usually cancel what came just before.',
          '“It used to be… but now” and “originally… but” point to the current answer, not the old one.',
          '“Rather than”, “instead of” and “not… but” tell you which option has been dropped.',
        ],
      },
      {
        title: 'Options that get ruled out',
        points: [
          'In conversations, both speakers suggest options and reject most of them: “too expensive”, “that’s booked”.',
          'Wait until a choice is confirmed (“Great, let’s go with that”) before you commit.',
          'Numbers are favourite traps: two prices, two dates, two room numbers. The question tells you which one it wants.',
        ],
      },
      {
        title: 'Train your patience',
        points: [
          'Note a possible answer lightly, then confirm or replace it a few seconds later.',
          'Keep listening after you write. The correction often arrives in the very next sentence.',
          'When you review practice tests, find every trap in the transcript. Spotting the pattern is how you stop falling for it.',
        ],
      },
    ],
  },
  {
    id: 'multiple-choice',
    title: 'Multiple choice without panic',
    summary: 'You will hear something about every option. Here is how to hear the one that actually answers the question.',
    minutes: 13,
    level: 'Intermediate',
    chapters: [
      {
        title: 'Read the stem first',
        points: [
          'The question stem tells you what to listen for: a reason, a problem, a plan. The options only tell you the topic.',
          'Underline the key idea in the stem, such as “main reason” or “most concerned about”.',
          'Rephrase each option in your head before the audio, so you can recognise it in other words.',
        ],
      },
      {
        title: 'Every option gets mentioned',
        points: [
          'Expect to hear something about A, B and C. The test is which one fits the stem, not which one you hear.',
          'Wrong options are often pushed away with “but”, “though” or “that’s not really the issue”.',
          'An option that repeats the speaker’s exact words is often the trap. The right one is usually paraphrased.',
        ],
      },
      {
        title: 'Choose TWO letters',
        points: [
          'Some questions ask for two answers from five options. Each correct letter scores a mark on its own.',
          'Cross out options as they are ruled out. The two that survive are your answers.',
          'The two answers can come in any order, and they may be separated by a lot of talk.',
        ],
      },
      {
        title: 'When you’re not sure',
        points: [
          'Never leave a letter blank. With three options, even a guess has a one-in-three chance.',
          'Attitude words like “unfortunately”, “luckily” and “to be honest” often signal the answer.',
          'Mark your best choice and move on. Dwelling on one question costs you the next one.',
        ],
      },
    ],
  },
  {
    id: 'maps-plans',
    title: 'Maps & plans',
    summary: 'Get your bearings fast and follow the speaker’s route with the direction language IELTS loves.',
    minutes: 15,
    level: 'Intermediate',
    chapters: [
      {
        title: 'Get your bearings',
        points: [
          'Before the audio, find the starting point: usually “You are here”, an entrance or a main gate.',
          'Check for a compass. If there is a north arrow, expect “north side”, “south-east corner” and so on.',
          'Notice what is already labelled. New places are described in relation to those landmarks.',
        ],
      },
      {
        title: 'Direction language',
        points: [
          'Position: opposite, next to, beside, between, in the corner, at the far end, just past, beyond.',
          'Movement: go straight ahead, follow the path round, cross the bridge, keep going until you reach…',
          '“Opposite” means facing it across a path or road. “Next to” means on the same side, right beside it.',
        ],
      },
      {
        title: 'Follow the route',
        points: [
          'Put your finger on the map and move it as the speaker moves. Your finger shows where you are.',
          'Speakers usually follow a logical route, so the answers tend to move in a line or loop around the map.',
          'Left and right depend on which way you face. Picture yourself walking the path the speaker describes.',
        ],
      },
      {
        title: 'Common traps',
        points: [
          '“It used to be by the gate, but it’s moved to…” — always label the new location.',
          'Two similar places may sit side by side. Listen for the detail that separates them.',
          'Each letter is used once at most, and some letters are not used at all.',
        ],
      },
    ],
  },
  {
    id: 'signposting',
    title: 'Signposting in Part 4 lectures',
    summary: 'Part 4 is a ten-question academic talk with no pause. Signpost language keeps you on the map.',
    minutes: 18,
    level: 'Advanced',
    chapters: [
      {
        title: 'Know the format',
        points: [
          'Part 4 is one speaker giving a talk on an academic subject, usually tested with note completion.',
          'There is no break in the middle, so read all ten questions before the talk begins.',
          'Most gaps take a single word, and it is the exact word the speaker uses.',
        ],
      },
      {
        title: 'Signposts to listen for',
        points: [
          'Sequence: “first of all”, “the next stage”, “finally”. Each one usually moves you to a new heading.',
          'Change of topic: “turning now to”, “let’s move on to”, “this brings me to”.',
          'Emphasis: “the key point is”, “what’s really striking” — an answer often follows straight after.',
        ],
      },
      {
        title: 'Notes are a map of the talk',
        points: [
          'The headings in the notes match the sections of the talk, in the same order.',
          'Expect nouns in most gaps: names of things, processes, materials and places.',
          'Technical words are often repeated or explained. If not, trust what you know about English spelling.',
        ],
      },
      {
        title: 'Recovering when you’re lost',
        points: [
          'If you miss a gap, jump to the next heading. The next signpost will put you back on track.',
          '“For instance” and “such as” often lead straight to an answer.',
          'Don’t stop to puzzle over a missed answer while the talk continues. Guess it at the end.',
        ],
      },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3: following a discussion',
    summary: 'Two students, one tutor, lots of opinions. Learn to track who thinks what, and who changes their mind.',
    minutes: 16,
    level: 'Advanced',
    chapters: [
      {
        title: 'Who’s speaking?',
        points: [
          'Part 3 is a conversation between up to four people in an education or training setting.',
          'Learn the voices in the first few lines. Names and roles are usually introduced at the start.',
          'Questions often ask about one person’s view, so note who says each idea, not just the idea.',
        ],
      },
      {
        title: 'Agree, disagree, decide',
        points: [
          'Agreement: “exactly”, “that’s a good point”, “I was thinking the same”.',
          'Disagreement is often polite: “I’m not so sure”, “maybe, but…”, “I see what you mean, however…”.',
          'The answer is usually what they decide in the end, not the first idea they discuss.',
        ],
      },
      {
        title: 'Matching tasks',
        points: [
          'You match a list of items to a box of options, and there are more options than items.',
          'Learn the options before the audio starts. You cannot scan six options while you listen.',
          'Items are heard in order, but the options are not. Any letter could come next.',
        ],
      },
      {
        title: 'Opinion or fact?',
        points: [
          '“Seems”, “I reckon” and “apparently” mark opinions. Check whether the question asks for one.',
          'In tutor discussions, the tutor’s advice and warnings often decide the answer.',
          'When a student changes their mind, the later view is the one that counts.',
        ],
      },
    ],
  },
]

export const practiceSets: PracticeInfo[] = [
  {
    id: 'part1-enrolment',
    title: 'Part 1 · Evening course enrolment',
    summary: 'A phone call to a community centre: names spelt out, a phone number, dates and prices, with plenty of self-corrections.',
    minutes: 10,
    questionCount: 10,
    kinds: ['Form completion'],
    level: 'Foundation',
  },
  {
    id: 'part2-park',
    title: 'Part 2 · Larkhill Country Park',
    summary: 'A ranger welcomes new volunteers. Answer multiple-choice questions, then label the park map as she walks you round.',
    minutes: 11,
    questionCount: 10,
    kinds: ['Multiple choice', 'Map labelling'],
    level: 'Intermediate',
  },
  {
    id: 'part3-podcast',
    title: 'Part 3 · The night-shift podcast',
    summary: 'Two students plan a podcast with their tutor. Track opinions, changes of plan and the tutor’s advice.',
    minutes: 11,
    questionCount: 9,
    kinds: ['Multiple choice', 'Matching'],
    level: 'Intermediate',
  },
  {
    id: 'part4-soundscapes',
    title: 'Part 4 · Listening to ecosystems',
    summary: 'A university lecture on soundscape ecology. Ten note-completion gaps, one word each, and no break.',
    minutes: 12,
    questionCount: 10,
    kinds: ['Note completion'],
    level: 'Advanced',
  },
]
