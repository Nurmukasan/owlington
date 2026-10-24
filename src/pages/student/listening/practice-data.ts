/*
 * Owl FM practice broadcasts: recording scripts, questions and answer keys.
 * Only the practice page imports this module (it is part of a lazy chunk).
 *
 * All scripts are original. Every answer appears word for word in the script,
 * every question names the exact phrase that proves it (`evidence`), and the
 * distractors the recording plants are listed in `traps`.
 */

export interface Speaker {
  id: string
  name: string
  role: string
  gender: 'f' | 'm'
  /** Preferred voice accents, best first (BCP 47 prefixes). */
  accents: string[]
  /** The studio (ElevenLabs) voice the recording uses. */
  voice?: string
}

/** One spoken line. `say` overrides what the voice reads (e.g. digits read as “double five”). */
export interface SpokenLine {
  s: string
  t: string
  say?: string
}

/** Silent reading time before a block of questions, as in the real test. */
export interface ReadingPause {
  wait: number
  label: string
}

export type ScriptItem = SpokenLine | ReadingPause

export const isPause = (item: ScriptItem): item is ReadingPause => 'wait' in item

export interface Option {
  key: string
  text: string
}

export interface WordLimit {
  words: number
  /** Whether a number may be added on top of the words (“AND/OR A NUMBER”). */
  number: boolean
  text: string
}

interface BaseQuestion {
  n: number
  /** A phrase copied exactly from the script that proves the answer. */
  evidence: string
  explain: string
}

export interface GapQuestion extends BaseQuestion {
  kind: 'gap'
  answer: string
  /** Other accepted spellings / forms (compared case- and space-insensitively). */
  accept?: string[]
  /** Compare as a number: spaces, £, ordinal endings and “.00” are ignored. */
  numeric?: boolean
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'choice'
  stem: string
  options: Option[]
  answer: string
}

export interface LetterQuestion extends BaseQuestion {
  kind: 'letter'
  label: string
  answer: string
}

/** One of the two answers to a "Choose TWO letters" question (stem and options live on the group). */
export interface PickQuestion extends BaseQuestion {
  kind: 'pick'
  answer: string
}

export type Question = GapQuestion | ChoiceQuestion | LetterQuestion | PickQuestion

export interface Row {
  kind?: 'heading' | 'sub' | 'item' | 'example'
  label?: string
  /** Gaps are written as {n}, e.g. "27 {3} Street". */
  text: string
}

export interface TaskGroup {
  id: string
  type: 'form' | 'notes' | 'table' | 'flow' | 'sentences' | 'choice' | 'choose2' | 'map' | 'matching'
  instruction: string
  limit?: WordLimit
  title?: string
  rows?: Row[]
  /** Table completion: column headings, then rows of cells (gaps written {n}). */
  columns?: string[]
  cells?: string[][]
  /** "Choose TWO letters": the question both answers share. */
  stem?: string
  /** Matching box, the choose-two options, or the letters on the map. */
  options?: Option[]
  optionsTitle?: string
  /** A drawn map or plan (groups without one use the Larkhill park map). */
  map?: MapSpec
  /** Part of a full test (1–4) the group belongs to. */
  part?: number
  questions: Question[]
}

/** A map or floor plan, drawn on a 640 × 460 grid unless given another size. */
export interface MapSpec {
  title: string
  /** What a screen reader hears: the layout, never the answers. */
  description: string
  width?: number
  height?: number
  /** Outdoor maps sit on grass; plans of buildings on a floor. */
  ground?: 'grass' | 'floor'
  shapes: MapShape[]
  /** Where each letter sits. */
  points: Record<string, [number, number]>
  /** The speaker's position ("You are here"). */
  here?: [number, number]
  /** Label under the star, e.g. "Entrance". */
  hereLabel?: string
}

export type MapShape =
  | {
      kind: 'building' | 'room' | 'water' | 'green' | 'trees' | 'parking' | 'field' | 'sand' | 'stage'
      x: number
      y: number
      w: number
      h: number
      label?: string
      round?: boolean
    }
  | { kind: 'path' | 'road' | 'river' | 'wall'; d: string }
  | { kind: 'label'; x: number; y: number; text: string; small?: boolean }

/** A studio recording of the script: one audio file, and where each spoken line sits in it (seconds). */
export interface Recording {
  src: string
  /** Script item index → [start, end]. */
  clips: Record<number, [number, number]>
}

export interface Trap {
  phrase: string
  q: number
  note: string
}

export interface PracticeSet {
  id: string
  /** What the announcer tells you before the recording. */
  context: string
  speakers: Speaker[]
  script: ScriptItem[]
  groups: TaskGroup[]
  traps: Trap[]
  /** Present once the script has been recorded; otherwise browser voices read it. */
  audio?: Recording
  /** Full tests: the four parts, with the script item where each begins. */
  parts?: { n: number; title: string; start: number }[]
}

const ONE_WORD_AND_OR_NUMBER: WordLimit = { words: 1, number: true, text: 'ONE WORD AND/OR A NUMBER' }
const ONE_WORD_ONLY: WordLimit = { words: 1, number: false, text: 'ONE WORD ONLY' }

const ANNOUNCER: Speaker = { id: 'ann', name: 'Announcer', role: 'Test announcer', gender: 'm', accents: ['en-GB', 'en-AU', 'en-US'] }

// ------------------------------------------------------------- Part 1 ---

const part1: PracticeSet = {
  id: 'part1-enrolment',
  context: 'A telephone conversation between a receptionist at a community centre and a man who wants to join an evening course.',
  speakers: [
    ANNOUNCER,
    { id: 'maria', name: 'Maria', role: 'Receptionist', gender: 'f', accents: ['en-GB', 'en-IE', 'en-AU'] },
    { id: 'daniel', name: 'Daniel', role: 'Caller', gender: 'm', accents: ['en-AU', 'en-GB', 'en-NZ', 'en-US'] },
  ],
  script: [
    { s: 'ann', t: 'Part 1. You will hear a telephone conversation between a receptionist at a community centre and a man who wants to join an evening course.' },
    { s: 'ann', t: 'First, you have some time to look at questions 1 to 5.' },
    { wait: 30, label: 'questions 1–5' },
    { s: 'ann', t: 'Now listen carefully and answer questions 1 to 5.' },
    { s: 'maria', t: 'Good evening, Northgate Community Centre, Maria speaking. How can I help?' },
    { s: 'daniel', t: "Oh, hello. I'm ringing about your evening courses. I'd like to sign up for one, if there are still places." },
    { s: 'maria', t: 'Of course. Which course are you interested in?' },
    { s: 'daniel', t: "Well, I was going to do pottery, but a friend told me it's always full by now. So I'd like to join the photography course instead." },
    { s: 'maria', t: 'Photography. Yes, we still have a few places on that one. Can I take your name?' },
    { s: 'daniel', t: "Sure. It's Daniel Whitmore." },
    { s: 'maria', t: 'Could you spell your surname for me?' },
    { s: 'daniel', t: "Yes, it's W-H-I-T-M-O-R-E.", say: "Yes, it's W, H, I, T, M, O, R, E." },
    { s: 'maria', t: 'Lovely. And your address?' },
    { s: 'daniel', t: "It's 27 Ashby Street. That's A-S-H-B-Y.", say: "It's twenty-seven Ashby Street. That's A, S, H, B, Y." },
    { s: 'maria', t: 'Is that here in Northgate?' },
    { s: 'daniel', t: 'Yes, just behind the station.' },
    { s: 'maria', t: "And what's the best number to contact you on?" },
    {
      s: 'daniel',
      t: "My home number is 01632… oh, actually, I'm hardly ever in. You'd better have my mobile. It's 07700 900155.",
      say: "My home number is oh one six three two... oh, actually, I'm hardly ever in. You'd better have my mobile. It's oh seven seven double oh, nine double oh, one double five.",
    },
    { s: 'maria', t: '07700 900155. Got it.', say: 'Oh seven seven double oh, nine double oh, one double five. Got it.' },
    { s: 'daniel', t: 'Which evening is the class on?' },
    { s: 'maria', t: "The beginners' group used to meet on Tuesdays, but this term it's moved to Wednesdays, from seven till nine." },
    { s: 'daniel', t: 'Wednesdays are fine for me.' },
    { s: 'ann', t: 'Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.' },
    { wait: 30, label: 'questions 6–10' },
    { s: 'ann', t: 'Now listen and answer questions 6 to 10.' },
    { s: 'daniel', t: 'And when does the course start?' },
    {
      s: 'maria',
      t: "Let me check. It starts on the 5th of March… oh no, sorry, that's the pottery group. Photography begins a week later, on the 12th.",
      say: "Let me check. It starts on the fifth of March... oh no, sorry, that's the pottery group. Photography begins a week later, on the twelfth.",
    },
    { s: 'daniel', t: 'The 12th of March. OK. And how much does it cost?', say: 'The twelfth of March. OK. And how much does it cost?' },
    {
      s: 'maria',
      t: "The full fee for the ten weeks is £110. But you said you live in Northgate, didn't you? Local residents pay £95.",
      say: "The full fee for the ten weeks is a hundred and ten pounds. But you said you live in Northgate, didn't you? Local residents pay ninety-five pounds.",
    },
    { s: 'daniel', t: "Oh, that's good news. Do I need to buy a camera?" },
    { s: 'maria', t: 'Not yet. We lend cameras to beginners for the first few weeks. Just bring a notebook. The tutor gives you lots of tips to write down.' },
    { s: 'daniel', t: 'Great. And is there anywhere to park?' },
    { s: 'maria', t: "Don't use the car park at the front. That's only for the health clinic. There's free parking behind the library, and it's a two-minute walk from there." },
    { s: 'daniel', t: 'Perfect.' },
    { s: 'maria', t: 'One last thing, just for our records. How did you hear about the course?' },
    { s: 'daniel', t: 'Hmm. My sister mentioned it, but what actually made me call was an advert on the radio.' },
    {
      s: 'maria',
      t: "Ah, Owl FM, I bet. Right, Daniel, you're all booked in. We'll see you on the 12th.",
      say: "Ah, Owl FM, I bet. Right, Daniel, you're all booked in. We'll see you on the twelfth.",
    },
    { s: 'daniel', t: 'Thanks very much. Bye.' },
    { s: 'ann', t: 'That is the end of Part 1. You now have some time to check your answers.' },
  ],
  groups: [
    {
      id: 'p1-form',
      type: 'form',
      instruction: 'Complete the form below.',
      limit: ONE_WORD_AND_OR_NUMBER,
      title: 'Northgate Community Centre — Evening course enrolment',
      rows: [
        { kind: 'example', label: 'Receptionist', text: 'Maria' },
        { label: 'Course', text: '{1} (beginners)' },
        { label: 'Name', text: 'Daniel {2}' },
        { label: 'Address', text: '27 {3} Street, Northgate' },
        { label: 'Mobile number', text: '{4}' },
        { label: 'Classes', text: '{5} evenings, 7–9 pm' },
        { kind: 'heading', text: 'Course details' },
        { label: 'First class', text: '{6} March' },
        { label: 'Fee for local residents', text: '£{7}' },
        { label: 'Bring', text: 'a {8}' },
        { label: 'Free parking', text: 'behind the {9}' },
        { label: 'Heard about the course from', text: 'an advert on the {10}' },
      ],
      questions: [
        {
          kind: 'gap',
          n: 1,
          answer: 'photography',
          evidence: 'join the photography course instead',
          explain: 'Daniel first mentions pottery, but rejects it because it is always full. “Instead” signals his real choice: photography.',
        },
        {
          kind: 'gap',
          n: 2,
          answer: 'Whitmore',
          evidence: 'W-H-I-T-M-O-R-E',
          explain: 'The surname is spelt out letter by letter, and spelling must be exact to score. Write each letter as you hear it, then read the word back.',
        },
        {
          kind: 'gap',
          n: 3,
          answer: 'Ashby',
          evidence: 'A-S-H-B-Y',
          explain: 'Street names are classic spelling questions. The number 27 and “Street” are already on the form, so only “Ashby” is needed.',
        },
        {
          kind: 'gap',
          n: 4,
          answer: '07700 900155',
          numeric: true,
          evidence: "have my mobile. It's 07700 900155",
          explain: 'He starts to give his home number, then switches to his mobile. “Double oh” means 00 and “double five” means 55. Spaces in the number don’t matter.',
        },
        {
          kind: 'gap',
          n: 5,
          answer: 'Wednesday',
          accept: ['Wednesdays'],
          evidence: "this term it's moved to Wednesdays",
          explain: '“Used to meet on Tuesdays, but this term…” is a time-shift trap. The class is now on Wednesdays.',
        },
        {
          kind: 'gap',
          n: 6,
          answer: '12',
          accept: ['12th', 'twelfth'],
          numeric: true,
          evidence: 'begins a week later, on the 12th',
          explain: 'Maria reads out the 5th of March, then corrects herself: that is the pottery date. Photography starts a week later, on the 12th.',
        },
        {
          kind: 'gap',
          n: 7,
          answer: '95',
          accept: ['ninety-five'],
          numeric: true,
          evidence: 'Local residents pay £95',
          explain: 'Two prices are mentioned. £110 is the full fee; the form asks for the local residents’ price, which is £95.',
        },
        {
          kind: 'gap',
          n: 8,
          answer: 'notebook',
          accept: ['note-book'],
          evidence: 'Just bring a notebook',
          explain: 'A camera seems the obvious answer, but beginners are lent cameras. The only thing he needs to bring is a notebook.',
        },
        {
          kind: 'gap',
          n: 9,
          answer: 'library',
          evidence: 'free parking behind the library',
          explain: 'The front car park is only for the health clinic. Free parking is behind the library.',
        },
        {
          kind: 'gap',
          n: 10,
          answer: 'radio',
          evidence: 'an advert on the radio',
          explain: 'His sister mentioned the course, but the question asks about the advert, and he says it was on the radio.',
        },
      ],
    },
  ],
  traps: [
    { phrase: 'I was going to do pottery', q: 1, note: 'Pottery was his first idea, but he changes his mind.' },
    { phrase: 'My home number is 01632', q: 4, note: 'He abandons the home number halfway through.' },
    { phrase: 'used to meet on Tuesdays', q: 5, note: '“Used to” means this is no longer true.' },
    { phrase: 'It starts on the 5th of March', q: 6, note: 'She corrects herself: that is the pottery start date.' },
    { phrase: 'The full fee for the ten weeks is £110', q: 7, note: 'The full fee, not the local residents’ price.' },
    { phrase: 'Do I need to buy a camera?', q: 8, note: 'Cameras are lent to beginners.' },
    { phrase: "Don't use the car park at the front", q: 9, note: 'That car park is only for the health clinic.' },
    { phrase: 'My sister mentioned it', q: 10, note: 'The form asks where the advert was.' },
  ],
}

// ------------------------------------------------------------- Part 2 ---

/** Letters on the Larkhill Country Park map (see practice/ParkMap.tsx for where each one sits). */
export const PARK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const ABC = (a: string, b: string, c: string): Option[] => [
  { key: 'A', text: a },
  { key: 'B', text: b },
  { key: 'C', text: c },
]

const part2: PracticeSet = {
  id: 'part2-park',
  context: 'A park ranger talking to a group of new volunteers at Larkhill Country Park.',
  speakers: [ANNOUNCER, { id: 'helen', name: 'Helen', role: 'Park ranger', gender: 'f', accents: ['en-AU', 'en-NZ', 'en-GB', 'en-US'] }],
  script: [
    { s: 'ann', t: 'Part 2. You will hear a park ranger talking to a group of new volunteers at Larkhill Country Park.' },
    { s: 'ann', t: 'First, you have some time to look at questions 11 to 14.' },
    { wait: 25, label: 'questions 11–14' },
    { s: 'ann', t: 'Now listen carefully and answer questions 11 to 14.' },
    { s: 'helen', t: "Good morning, everyone, and welcome to Larkhill Country Park. My name's Helen, and I'm one of the rangers here." },
    { s: 'helen', t: "Before we head out, I'll give you a bit of background, and then I'll show you on the map where everything is." },
    {
      s: 'helen',
      t: 'Some of you will remember that the park was closed for most of last year. A lot of people assume that was because of the spring floods, but in fact the paths coped really well with all that water.',
    },
    { s: 'helen', t: 'The real problem was the lake. It had become so full of weeds that the water was dying, and clearing it took eight months.' },
    { s: 'helen', t: 'We did use the time to repaint the visitor centre, but that only took a couple of weeks.' },
    { s: 'helen', t: 'So, what will you actually be doing? Most volunteers expect to spend their time planting trees, and we will do some of that in November.' },
    { s: 'helen', t: 'But your main job this season will be talking to visitors: explaining what they can see and answering their questions.' },
    { s: 'helen', t: "And you won't need to worry about litter. Our contractors take care of that now." },
    {
      s: 'helen',
      t: "There's one thing that's new this year, and I'm very excited about it. For the first time, we're running night walks on Friday evenings, so visitors can hear the owls.",
    },
    {
      s: 'helen',
      t: "We did think about an outdoor cinema in the summer, but the neighbours weren't keen. And the children's nature club has been running for years. It's as popular as ever.",
    },
    {
      s: 'helen',
      t: "Now, a few rules. You don't have to wear a uniform, although there are green jackets if you'd like one. Radios are only for rangers, so don't worry about those.",
    },
    { s: 'helen', t: "What you must always do is sign in at the visitor centre when you arrive, so we know who's in the park." },
    { s: 'ann', t: 'Now look at the map. You have some time to look at questions 15 to 20.' },
    { wait: 25, label: 'questions 15–20' },
    { s: 'ann', t: 'Now listen and answer questions 15 to 20.' },
    {
      s: 'helen',
      t: "Right, let's look at the map. We're standing at the main gate, at the bottom of the map, and the main path runs straight ahead of you, north towards the lake.",
    },
    {
      s: 'helen',
      t: "First, the café. It used to be inside the visitor centre, but it's moved to a new building by the lake. As you walk up the main path, it's on your right, just before you reach the water.",
    },
    { s: 'helen', t: 'Directly opposite the café, on the other side of the main path, is the adventure playground.' },
    {
      s: 'helen',
      t: "Now, if you take the path round the lake to the left and keep going, you'll come to the far side, the north shore. That's where you'll find the bird hide, right at the water's edge.",
    },
    { s: 'helen', t: "People sometimes look for it near Beech Wood, because that's where the old one was. Don't go there; it was taken down years ago." },
    { s: 'helen', t: 'The picnic area is on the far western side of the park, right next to the fence, between the car park and Beech Wood.' },
    { s: 'helen', t: "The toilets aren't in the visitor centre any more. You'll find them in a small block just to the east of it." },
    {
      s: 'helen',
      t: "And finally, the wildflower meadow. Follow the stream from the lake towards the bridge. The meadow's on the north side of the stream, before you reach the bridge.",
    },
    { s: 'helen', t: "Please don't cross the bridge to the south bank, though. That's private farmland." },
    { s: 'helen', t: 'OK. Any questions before we head off?' },
    { s: 'ann', t: 'That is the end of Part 2.' },
  ],
  groups: [
    {
      id: 'p2-mc',
      type: 'choice',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          kind: 'choice',
          n: 11,
          stem: 'Why was the park closed for most of last year?',
          options: ABC('Flooding had damaged the paths.', 'The lake had to be cleared.', 'The visitor centre was being repainted.'),
          answer: 'B',
          evidence: 'The real problem was the lake.',
          explain: 'Floods are mentioned but the paths “coped really well”. The repainting happened during the closure but only took two weeks. “The real problem” was clearing the weeds from the lake.',
        },
        {
          kind: 'choice',
          n: 12,
          stem: 'What will volunteers mainly do this season?',
          options: ABC('plant trees', 'collect litter', 'talk to visitors'),
          answer: 'C',
          evidence: 'your main job this season will be talking to visitors',
          explain: 'Tree planting is only “some” work in November, and contractors handle litter. “Your main job” matches “mainly” in the question.',
        },
        {
          kind: 'choice',
          n: 13,
          stem: 'What is new at the park this year?',
          options: ABC('an outdoor cinema', 'evening walks to listen to owls', 'a nature club for children'),
          answer: 'B',
          evidence: "For the first time, we're running night walks on Friday evenings",
          explain: '“For the first time” means new. The cinema was only considered, and the children’s club “has been running for years”.',
        },
        {
          kind: 'choice',
          n: 14,
          stem: 'Volunteers must always',
          options: ABC('wear a green jacket.', 'sign in when they arrive.', 'carry a radio.'),
          answer: 'B',
          evidence: 'What you must always do is sign in at the visitor centre',
          explain: 'Jackets are optional and radios are only for rangers. “Must always” is repeated almost word for word with signing in.',
        },
      ],
    },
    {
      id: 'p2-map',
      type: 'map',
      instruction: 'Label the map below. Choose the correct letter, A–H, for questions 15–20.',
      optionsTitle: 'Larkhill Country Park',
      options: PARK_LETTERS.map((key) => ({ key, text: `Location ${key}` })),
      questions: [
        {
          kind: 'letter',
          n: 15,
          label: 'Café',
          answer: 'B',
          evidence: "it's on your right, just before you reach the water",
          explain: 'Walking north up the main path, “on your right” is the east side, and “just before you reach the water” puts it beside the lake: B. Its old home, the visitor centre, is a trap.',
        },
        {
          kind: 'letter',
          n: 16,
          label: 'Adventure playground',
          answer: 'A',
          evidence: 'Directly opposite the café, on the other side of the main path',
          explain: '“Opposite” means facing the café across the main path, so it is on the west side at the same point: A.',
        },
        {
          kind: 'letter',
          n: 17,
          label: 'Bird hide',
          answer: 'D',
          evidence: "the north shore. That's where you'll find the bird hide",
          explain: 'Going round the lake to the far side brings you to the north shore, at the water’s edge: D. C, near Beech Wood, is where the old hide used to be.',
        },
        {
          kind: 'letter',
          n: 18,
          label: 'Picnic area',
          answer: 'H',
          evidence: 'between the car park and Beech Wood',
          explain: 'Far western side, next to the fence, between the car park and the wood: only H fits all three details.',
        },
        {
          kind: 'letter',
          n: 19,
          label: 'Toilets',
          answer: 'G',
          evidence: 'in a small block just to the east of it',
          explain: 'They are no longer inside the visitor centre, but in a block just east of it: G.',
        },
        {
          kind: 'letter',
          n: 20,
          label: 'Wildflower meadow',
          answer: 'E',
          evidence: "The meadow's on the north side of the stream, before you reach the bridge",
          explain: 'North of the stream, between the lake and the bridge: E. F is across the bridge on the south bank, which is private farmland.',
        },
      ],
    },
  ],
  traps: [
    { phrase: 'because of the spring floods', q: 11, note: 'People assume this, but the paths coped well.' },
    { phrase: 'repaint the visitor centre', q: 11, note: 'Done during the closure, not the reason for it.' },
    { phrase: 'planting trees', q: 12, note: 'Only some of the time, in November.' },
    { phrase: 'Our contractors take care of that now', q: 12, note: 'Litter is not the volunteers’ job.' },
    { phrase: 'an outdoor cinema in the summer', q: 13, note: 'Only considered, never happening.' },
    { phrase: 'has been running for years', q: 13, note: 'The nature club is not new.' },
    { phrase: "there are green jackets if you'd like one", q: 14, note: 'Optional, not a rule.' },
    { phrase: 'Radios are only for rangers', q: 14, note: 'Volunteers don’t carry radios.' },
    { phrase: 'It used to be inside the visitor centre', q: 15, note: 'The café has moved.' },
    { phrase: "that's where the old one was", q: 17, note: 'The old hide near Beech Wood (C) was taken down.' },
    { phrase: "Please don't cross the bridge to the south bank", q: 20, note: 'The south bank (F) is farmland, not the meadow.' },
  ],
}

// ------------------------------------------------------------- Part 3 ---

const part3: PracticeSet = {
  id: 'part3-podcast',
  context: 'Two media students, Maya and Leo, discussing their podcast project with their tutor, Dr Grant.',
  speakers: [
    ANNOUNCER,
    { id: 'grant', name: 'Dr Grant', role: 'Tutor', gender: 'f', accents: ['en-GB', 'en-IE', 'en-ZA'] },
    { id: 'maya', name: 'Maya', role: 'Student', gender: 'f', accents: ['en-AU', 'en-NZ', 'en-US', 'en-GB'] },
    { id: 'leo', name: 'Leo', role: 'Student', gender: 'm', accents: ['en-US', 'en-CA', 'en-IN', 'en-GB'] },
  ],
  script: [
    { s: 'ann', t: 'Part 3. You will hear two media students, Maya and Leo, discussing their podcast project with their tutor, Dr Grant.' },
    { s: 'ann', t: 'First, you have some time to look at questions 21 to 24.' },
    { wait: 25, label: 'questions 21–24' },
    { s: 'ann', t: 'Now listen carefully and answer questions 21 to 24.' },
    { s: 'grant', t: "Come in, both of you. So, how's the podcast going? Have you settled on a topic yet?" },
    { s: 'maya', t: "We have, finally. We started with the history of the city's markets." },
    { s: 'leo', t: "I was worried we wouldn't find anyone to interview, but actually that wasn't a problem at all. There were plenty of people." },
    {
      s: 'maya',
      t: "The trouble was that there was just too much material for one episode. So we've switched to night-shift workers: people who work while the rest of the city's asleep.",
    },
    { s: 'grant', t: "That's a shame about the markets, in a way. As far as I know, nobody's done that before. But night workers is a lovely idea." },
    { s: 'grant', t: 'Now, the guidelines say twenty minutes per episode.' },
    { s: 'leo', t: "That's what's worrying us. We're not sure we've got twenty minutes of really good content." },
    {
      s: 'grant',
      t: "Honestly, I'd rather have fifteen strong minutes than twenty minutes of padding. And please don't fill the gaps with music. I mark that down.",
    },
    { s: 'maya', t: "We were going to record in the library studio, but it's booked for weeks. And Leo suggested my flat…" },
    { s: 'leo', t: 'Which is far too noisy, with the trains going past.' },
    {
      s: 'maya',
      t: "So we'll record the interviews where people actually work: the bakery, the hospital canteen. The background sounds will make it feel real.",
    },
    { s: 'grant', t: 'Good. Just record your introduction somewhere quiet, separately.' },
    {
      s: 'grant',
      t: "What I am worried about is permission. Every person you record has to sign a consent form, and you'll need their employers to agree, too.",
    },
    { s: 'leo', t: 'What about the sound quality?' },
    {
      s: 'grant',
      t: "I'm not concerned about that. You've both done the recording workshop. And the deadline isn't until May, so you've got plenty of time.",
    },
    { s: 'ann', t: 'Before you hear the rest of the discussion, you have some time to look at questions 25 to 29.' },
    { wait: 25, label: 'questions 25–29' },
    { s: 'ann', t: 'Now listen and answer questions 25 to 29.' },
    { s: 'maya', t: "So, we've got four people in mind. The first is a nurse who works nights at the city hospital." },
    { s: 'grant', t: "Excellent. But nurses' shifts change at short notice, so it may be hard to fix a time. Have a back-up date ready." },
    { s: 'leo', t: "Then there's a baker. He starts work at three in the morning, and he's been doing it for forty years." },
    {
      s: 'grant',
      t: 'Forty years? Then he can tell you how the city at night has changed over the decades. That would give the whole episode a sense of history.',
    },
    { s: 'maya', t: "We'd also like to talk to a taxi driver." },
    {
      s: 'grant',
      t: "Hmm. Isn't that rather like the bus driver you interviewed for your pilot episode? I'd worry you'd get the same stories twice.",
    },
    { s: 'leo', t: 'And finally, the presenter of the late show on Owl FM.' },
    { s: 'grant', t: "Oh, she's hilarious on air. She'd lighten the mood nicely after the hospital interview." },
    { s: 'leo', t: "We thought we'd interview her first, actually." },
    { s: 'grant', t: "I'd start with whoever is easiest to reach, so you get some practice." },
    { s: 'maya', t: 'OK. So what should we do next? Write the interview questions?' },
    {
      s: 'grant',
      t: "Not yet. The first thing is to contact the employers. Without their agreement, there's no episode. The questions can wait until next week.",
    },
    { s: 'leo', t: "And we'll book the editing suite after that." },
    { s: 'grant', t: 'Perfect. Come and see me again on Thursday.' },
    { s: 'ann', t: 'That is the end of Part 3.' },
  ],
  groups: [
    {
      id: 'p3-mc',
      type: 'choice',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          kind: 'choice',
          n: 21,
          stem: 'Why did the students change the topic of their podcast?',
          options: ABC('They could not find people to interview.', 'There was too much material.', 'The topic had already been covered.'),
          answer: 'B',
          evidence: 'there was just too much material for one episode',
          explain: 'Leo feared a lack of interviewees, but “that wasn’t a problem at all”. Dr Grant says nobody has done the markets before. “The trouble was” too much material.',
        },
        {
          kind: 'choice',
          n: 22,
          stem: 'What does Dr Grant say about the length of the episode?',
          options: ABC('It must be exactly twenty minutes.', 'It can be shorter if the content is strong.', 'Music can be added to make it longer.'),
          answer: 'B',
          evidence: "I'd rather have fifteen strong minutes than twenty minutes of padding",
          explain: 'Twenty minutes is only the guideline, and she marks down music used as filler. She prefers a shorter, strong episode.',
        },
        {
          kind: 'choice',
          n: 23,
          stem: 'Where will the interviews be recorded?',
          options: ABC('in the library studio', 'in Maya’s flat', 'at the guests’ workplaces'),
          answer: 'C',
          evidence: "we'll record the interviews where people actually work",
          explain: 'The studio is booked and the flat is too noisy. They choose to record “where people actually work”, a paraphrase of workplaces.',
        },
        {
          kind: 'choice',
          n: 24,
          stem: 'What is Dr Grant most concerned about?',
          options: ABC('getting permission', 'the sound quality', 'the deadline'),
          answer: 'A',
          evidence: 'What I am worried about is permission',
          explain: 'She says directly that she is “not concerned” about sound quality and that the deadline gives them plenty of time.',
        },
      ],
    },
    {
      id: 'p3-match',
      type: 'matching',
      instruction: 'What comment does Dr Grant make about each guest? Choose FOUR answers from the box and write the correct letter, A–E, next to questions 25–28.',
      optionsTitle: 'Comments',
      options: [
        { key: 'A', text: 'would add humour' },
        { key: 'B', text: 'may be difficult to schedule' },
        { key: 'C', text: 'is too similar to a previous guest' },
        { key: 'D', text: 'would add a historical perspective' },
        { key: 'E', text: 'should be interviewed first' },
      ],
      questions: [
        {
          kind: 'letter',
          n: 25,
          label: 'the nurse',
          answer: 'B',
          evidence: 'it may be hard to fix a time',
          explain: 'Shifts that change at short notice make a time hard to fix: difficult to schedule.',
        },
        {
          kind: 'letter',
          n: 26,
          label: 'the baker',
          answer: 'D',
          evidence: 'That would give the whole episode a sense of history',
          explain: 'Forty years of night work means he can describe how the city has changed: a historical perspective.',
        },
        {
          kind: 'letter',
          n: 27,
          label: 'the taxi driver',
          answer: 'C',
          evidence: "Isn't that rather like the bus driver you interviewed for your pilot episode?",
          explain: 'She worries the taxi driver would repeat the bus driver’s stories from the pilot: too similar to a previous guest.',
        },
        {
          kind: 'letter',
          n: 28,
          label: 'the radio presenter',
          answer: 'A',
          evidence: "she's hilarious on air",
          explain: '“Hilarious” and “lighten the mood” point to humour. Interviewing her first is Leo’s idea, not Dr Grant’s comment.',
        },
      ],
    },
    {
      id: 'p3-next',
      type: 'choice',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          kind: 'choice',
          n: 29,
          stem: 'What will the students do next?',
          options: ABC('write the interview questions', 'contact the employers', 'book the editing suite'),
          answer: 'B',
          evidence: 'The first thing is to contact the employers.',
          explain: 'Maya suggests writing questions, but Dr Grant says “Not yet”. Booking the editing suite comes “after that”.',
        },
      ],
    },
  ],
  traps: [
    { phrase: "I was worried we wouldn't find anyone to interview", q: 21, note: 'A worry that turned out to be wrong.' },
    { phrase: "nobody's done that before", q: 21, note: 'The topic has NOT been covered before.' },
    { phrase: 'the guidelines say twenty minutes per episode', q: 22, note: 'Only a guideline; she accepts fifteen minutes.' },
    { phrase: "please don't fill the gaps with music", q: 22, note: 'Music as filler is marked down.' },
    { phrase: "record in the library studio, but it's booked for weeks", q: 23, note: 'The studio is unavailable.' },
    { phrase: 'Leo suggested my flat', q: 23, note: 'Rejected: too noisy.' },
    { phrase: "I'm not concerned about that", q: 24, note: 'Sound quality is not her worry.' },
    { phrase: "the deadline isn't until May", q: 24, note: 'Plenty of time, so not a concern.' },
    { phrase: "We thought we'd interview her first", q: 28, note: 'The students’ idea, not the tutor’s comment.' },
    { phrase: 'The questions can wait until next week', q: 29, note: 'Writing questions comes later.' },
    { phrase: "we'll book the editing suite after that", q: 29, note: '“After that” means not next.' },
  ],
}

// ------------------------------------------------------------- Part 4 ---

const part4: PracticeSet = {
  id: 'part4-soundscapes',
  context: 'A lecture about soundscape ecology: how recording the sounds of a place helps scientists measure the health of ecosystems.',
  speakers: [ANNOUNCER, { id: 'ellis', name: 'Dr Ellis', role: 'Lecturer', gender: 'm', accents: ['en-GB', 'en-IN', 'en-AU', 'en-US'] }],
  script: [
    { s: 'ann', t: 'Part 4. You will hear a lecture about soundscape ecology.' },
    { s: 'ann', t: 'You now have some time to look at questions 31 to 40.' },
    { wait: 40, label: 'questions 31–40' },
    { s: 'ann', t: 'Now listen carefully and answer questions 31 to 40.' },
    { s: 'ellis', t: 'Good afternoon, everyone. Today I want to introduce a field that has grown enormously over the last twenty years: soundscape ecology.' },
    { s: 'ellis', t: "Put simply, it's the study of all the sounds in a landscape, and of what those sounds can tell us about the health of an ecosystem." },
    { s: 'ellis', t: 'Researchers usually divide a soundscape into three parts. The first is biophony: the sounds made by living things, such as birdsong, insects or whale calls.' },
    { s: 'ellis', t: "The second is geophony. That covers natural sounds that don't come from living things: wind, rain and running water." },
    { s: 'ellis', t: 'And the third part is anthrophony, which is all the noise produced by humans: traffic, aircraft, machinery and so on.' },
    { s: 'ellis', t: 'So how is this research actually done? In the past, a scientist had to sit in the field and listen, which limited most studies to a few hours.' },
    { s: 'ellis', t: 'Today, the key tool is a small, weatherproof recorder that can be fixed to a tree and left there for months.' },
    {
      s: 'ellis',
      t: "These devices are not much bigger than a microphone, and they're surprisingly cheap. Some cost less than a pair of headphones, so a team can place dozens of them across a forest.",
    },
    { s: 'ellis', t: 'The challenge, of course, is the sheer amount of data. A single recorder can produce thousands of hours of audio, and nobody can listen to all of that.' },
    { s: 'ellis', t: 'So researchers use software that turns the sound into a picture, called a spectrogram, and then artificial intelligence to identify the species.' },
    { s: 'ellis', t: "Let's look at some findings. One of the clearest examples comes from coral reefs." },
    { s: 'ellis', t: 'You might imagine that the sea is quiet, but a healthy reef is extremely noisy. Fish grunt, and shrimps snap their claws.' },
    {
      s: 'ellis',
      t: 'When a reef is damaged, it becomes much quieter. In one experiment, researchers put underwater speakers on a damaged reef and played recordings of a healthy one.',
    },
    { s: 'ellis', t: 'Young fish were attracted by the sound, and far more of them settled on the damaged reef. The hope is that this could help reefs recover more quickly.' },
    { s: 'ellis', t: "Turning now to cities. Human noise doesn't just annoy people; it changes how animals behave." },
    {
      s: 'ellis',
      t: "Some birds simply sing louder, but many urban birds now sing at a higher pitch than birds of the same species in the countryside, so their songs aren't masked by the low rumble of traffic.",
    },
    {
      s: 'ellis',
      t: "Others change their timing. Robins are famous for singing at dawn, but in some noisy cities they've been recorded singing at night, when the streets are quieter.",
    },
    {
      s: 'ellis',
      t: "Finally, why does all this matter for conservation? Because recorders work day and night, they're especially good at detecting animals that are rare, shy, or only active after dark, such as owls and bats.",
    },
    {
      s: 'ellis',
      t: "And every recording is a permanent record. In fifty years' time, scientists will be able to compare today's soundscapes with their own, and hear exactly what has been lost, or gained.",
    },
    { s: 'ann', t: 'That is the end of Part 4.' },
  ],
  groups: [
    {
      id: 'p4-notes',
      type: 'notes',
      instruction: 'Complete the notes below.',
      limit: ONE_WORD_ONLY,
      title: 'Soundscape ecology',
      rows: [
        { kind: 'item', text: 'Definition: the study of all the sounds in a {31} and what they reveal about the health of an ecosystem' },
        { kind: 'sub', text: 'Three parts of a soundscape' },
        { kind: 'item', text: 'Biophony: sounds made by living things, e.g. birdsong, insects' },
        { kind: 'item', text: 'Geophony: natural sounds not made by living things, e.g. wind, {32} and running water' },
        { kind: 'item', text: 'Anthrophony: all the noise produced by {33}' },
        { kind: 'sub', text: 'Methods' },
        { kind: 'item', text: 'In the past: scientists listened in the field, so studies lasted only a few hours' },
        { kind: 'item', text: 'Today: a small, weatherproof {34} is fixed to a tree for months' },
        { kind: 'item', text: 'Devices are cheap: some cost less than a pair of {35}' },
        { kind: 'item', text: 'Software turns sound into a picture called a {36}; AI identifies the species' },
        { kind: 'sub', text: 'Findings' },
        { kind: 'item', text: 'Coral reefs: a healthy reef is extremely {37}' },
        { kind: 'item', text: 'Recordings of a healthy reef attracted young {38} to a damaged one' },
        { kind: 'item', text: 'Cities: many birds sing at a higher {39}, so traffic does not mask their songs' },
        { kind: 'item', text: 'Some robins sing at {40}, when the streets are quieter' },
        { kind: 'sub', text: 'Conservation' },
        { kind: 'item', text: 'Recorders detect rare, shy and nocturnal animals, e.g. owls and bats' },
      ],
      questions: [
        {
          kind: 'gap',
          n: 31,
          answer: 'landscape',
          evidence: 'the study of all the sounds in a landscape',
          explain: '“Put simply” introduces the definition. The notes copy it almost word for word.',
        },
        {
          kind: 'gap',
          n: 32,
          answer: 'rain',
          evidence: 'wind, rain and running water',
          explain: 'The example list is read in the same order as the notes: wind, rain, running water.',
        },
        {
          kind: 'gap',
          n: 33,
          answer: 'humans',
          evidence: 'all the noise produced by humans',
          explain: 'Anthrophony is human-made noise. The examples (traffic, aircraft) come straight after the answer.',
        },
        {
          kind: 'gap',
          n: 34,
          answer: 'recorder',
          evidence: 'a small, weatherproof recorder',
          explain: '“Today, the key tool is…” signals the answer. The note needs a singular noun after “a small, weatherproof”.',
        },
        {
          kind: 'gap',
          n: 35,
          answer: 'headphones',
          evidence: 'Some cost less than a pair of headphones',
          explain: 'A microphone is mentioned as a size comparison. The price comparison, which the notes ask for, is headphones.',
        },
        {
          kind: 'gap',
          n: 36,
          answer: 'spectrogram',
          evidence: 'called a spectrogram',
          explain: '“Called a…” introduces the technical term. Spell it the way it sounds: spectro + gram.',
        },
        {
          kind: 'gap',
          n: 37,
          answer: 'noisy',
          evidence: 'a healthy reef is extremely noisy',
          explain: '“You might imagine that the sea is quiet, but…” sets up the contrast. The answer comes after “but”.',
        },
        {
          kind: 'gap',
          n: 38,
          answer: 'fish',
          evidence: 'Young fish were attracted by the sound',
          explain: 'Shrimps are mentioned as reef noise-makers, but it was young fish that the recordings attracted.',
        },
        {
          kind: 'gap',
          n: 39,
          answer: 'pitch',
          evidence: 'sing at a higher pitch',
          explain: '“Louder” is mentioned first, but it doesn’t fit “a higher ___”. The answer is pitch.',
        },
        {
          kind: 'gap',
          n: 40,
          answer: 'night',
          evidence: 'recorded singing at night',
          explain: 'Robins usually sing at dawn. In noisy cities they have been recorded singing at night, when it is quieter.',
        },
      ],
    },
  ],
  traps: [
    { phrase: 'not much bigger than a microphone', q: 35, note: 'A size comparison, not a price one.' },
    { phrase: 'You might imagine that the sea is quiet', q: 37, note: 'An assumption the speaker contradicts.' },
    { phrase: 'shrimps snap their claws', q: 38, note: 'Noise-makers on the reef, not the animals attracted.' },
    { phrase: 'Some birds simply sing louder', q: 39, note: 'Doesn’t fit “a higher ___”.' },
    { phrase: 'Robins are famous for singing at dawn', q: 40, note: 'Their usual time, not the change.' },
  ],
}

export const PRACTICE_SETS: Record<string, PracticeSet> = {
  [part1.id]: part1,
  [part2.id]: part2,
  [part3.id]: part3,
  [part4.id]: part4,
}

export const questionsOf = (set: PracticeSet) => set.groups.flatMap((g) => g.questions)

/** First and last question numbers on the paper (Part 2 runs 11–20, as in the real test). */
export function paperRange(set: PracticeSet): [number, number] {
  const qs = questionsOf(set)
  return [qs[0].n, qs[qs.length - 1].n]
}
