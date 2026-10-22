/*
 * Writing prompts, Task 1 visuals, model answers and the self-assessment
 * rubric. Imported only by the (lazy) Practice page.
 *
 * Everything here is original Owlington material. The band descriptors are
 * short paraphrases for self-assessment, not the official IELTS wording.
 */
import { analyse, runChecks, type CheckContext, type CheckId, type Criterion } from './analysis'
import { metaFor, type WritingTask } from './content'

export interface LineSeries {
  id: string
  label: string
  values: number[]
}

export interface LineFigure {
  kind: 'line'
  title: string
  unit: string
  yLabel: string
  xs: string[]
  yMax: number
  yStep: number
  series: LineSeries[]
}

export interface ProcessStage {
  title: string
  detail: string
  icon: ProcessIcon
}

export type ProcessIcon = 'bike' | 'mix' | 'heat' | 'spawn' | 'box' | 'dark' | 'spray' | 'harvest'

export interface ProcessFigure {
  kind: 'process'
  title: string
  stages: ProcessStage[]
  /** Labelled zones: [label, first stage index, last stage index]. */
  zones: [string, number, number][]
}

export type Figure = LineFigure | ProcessFigure

export interface Annotation {
  /** An exact substring of the model answer. */
  quote: string
  criterion: Criterion
  note: string
}

export interface WritingPrompt {
  id: string
  task: WritingTask
  minutes: number
  minWords: number
  /** The task as the exam paper prints it (paragraphs). */
  instructions: string[]
  /** Bullet points (letters). */
  bullets?: string[]
  /** Closing line, e.g. "Write at least 150 words." */
  footer: string[]
  /** The core question, for the paraphrase check. */
  question: string
  figure?: Figure
  plan: { label: string; hint: string }[]
  tips: string[]
  checks: CheckId[]
  bulletChecks?: { label: string; pattern: RegExp }[]
  model: { text: string; notes: Annotation[] }
}

// ------------------------------------------------------------------ prompts ---

const T1_FOOTER = ['Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', 'Write at least 150 words.']
const T2_FOOTER = ['Give reasons for your answer and include any relevant examples from your own knowledge or experience.', 'Write at least 250 words.']

export const PROMPTS: WritingPrompt[] = [
  {
    id: 't1-volunteering',
    task: 'task1-academic',
    minutes: 20,
    minWords: 150,
    instructions: [
      'The graph below shows the average number of hours per week that people in three age groups spent volunteering in the city of Kelsford between 2000 and 2020.',
    ],
    footer: T1_FOOTER,
    question:
      'The graph below shows the average number of hours per week that people in three age groups spent volunteering in the city of Kelsford between 2000 and 2020.',
    figure: {
      kind: 'line',
      title: 'Average weekly hours spent volunteering, Kelsford',
      unit: 'hours per week',
      yLabel: 'Hours per week',
      xs: ['2000', '2004', '2008', '2012', '2016', '2020'],
      yMax: 3.5,
      yStep: 0.5,
      series: [
        { id: 'young', label: 'Aged 16–24', values: [0.8, 1.0, 1.3, 1.9, 2.5, 3.0] },
        { id: 'middle', label: 'Aged 25–49', values: [1.6, 1.5, 1.4, 1.2, 1.1, 1.2] },
        { id: 'older', label: 'Aged 50+', values: [2.6, 2.7, 2.6, 2.5, 2.4, 2.0] },
      ],
    },
    plan: [
      { label: 'Overview', hint: 'The biggest picture in one sentence: who went up, who went down, any reversal?' },
      { label: 'Key feature 1', hint: 'The 16–24 group: start, crossings, end figure.' },
      { label: 'Key feature 2', hint: 'The two older groups: peak, decline, lowest point.' },
    ],
    tips: [
      'Spend 2–3 minutes finding the story before you write: what changed most, what crossed, what ended highest?',
      'Group the two older age groups together in one paragraph — they move in a similar direction.',
      'Hours per week are small numbers: write “0.8 hours”, “3 hours”, and use “almost quadrupled” for the big change.',
    ],
    checks: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'data', 'trend-words', 'comparisons', 'no-opinion', 'linkers-4', 'sentence-variety'],
    model: {
      text: `The line graph compares how many hours a week residents of Kelsford in three age brackets devoted to voluntary work over a twenty-year period from 2000.

Overall, the youngest group went from being the least active volunteers to the most active, whereas the time given by both older groups fell. In the later years, people aged 25 to 49 volunteered the least.

In 2000, people aged 16 to 24 volunteered for just 0.8 hours per week, half the figure for 25–49-year-olds (1.6 hours). However, young people's involvement then rose steadily, overtaking the middle group between 2008 and 2012 and the over-50s by 2016. By 2020, it had reached 3 hours, almost four times its starting level.

The over-50s were the most committed volunteers for most of the period, peaking at 2.7 hours in 2004. Their contribution then eased gradually before dropping more sharply to 2 hours in 2020. The 25–49 group, by contrast, was the least active from 2012 onwards, falling to a low of 1.1 hours in 2016 and recovering only slightly to 1.2 hours by the end of the period.`,
      notes: [
        {
          quote: 'how many hours a week residents of Kelsford in three age brackets devoted to voluntary work',
          criterion: 'LR',
          note: 'The question is paraphrased, not copied: people → residents, age groups → age brackets, volunteering → devoted to voluntary work.',
        },
        {
          quote: 'Overall, the youngest group went from being the least active volunteers to the most active',
          criterion: 'TA',
          note: 'A clear overview with no numbers: the single biggest story comes first, which is what band 7+ needs.',
        },
        {
          quote: 'half the figure for 25–49-year-olds (1.6 hours)',
          criterion: 'TA',
          note: 'A comparison built into the detail, with the figure in brackets as evidence.',
        },
        {
          quote: 'overtaking the middle group between 2008 and 2012 and the over-50s by 2016',
          criterion: 'TA',
          note: 'Crossing points are key features. They are placed accurately, without inventing an exact year the graph does not show.',
        },
        {
          quote: 'By 2020, it had reached 3 hours, almost four times its starting level',
          criterion: 'GRA',
          note: 'Past perfect after “By 2020”, plus a natural approximation (0.8 → 3.0) instead of a raw calculation.',
        },
        {
          quote: 'eased gradually before dropping more sharply',
          criterion: 'LR',
          note: 'Graded trend language: the adverbs show how fast the change was.',
        },
        {
          quote: 'The 25–49 group, by contrast,',
          criterion: 'CC',
          note: 'The linker sits mid-sentence, contrasting the two older groups without sounding mechanical.',
        },
      ],
    },
  },
  {
    id: 't1-coffee-kits',
    task: 'task1-academic',
    minutes: 20,
    minWords: 150,
    instructions: ['The diagram below shows how used coffee grounds from city cafés are turned into kits for growing mushrooms at home.'],
    footer: T1_FOOTER,
    question: 'The diagram below shows how used coffee grounds from city cafés are turned into kits for growing mushrooms at home.',
    figure: {
      kind: 'process',
      title: 'From café waste to home-grown mushrooms',
      stages: [
        { title: 'Collection', detail: 'Used grounds collected from cafés every day by electric cargo bike', icon: 'bike' },
        { title: 'Mixing', detail: 'Grounds mixed with chopped straw', icon: 'mix' },
        { title: 'Pasteurising', detail: 'Mixture heated to 70°C for 1 hour to kill bacteria', icon: 'heat' },
        { title: 'Adding spawn', detail: 'Cooled mixture combined with oyster mushroom spawn', icon: 'spawn' },
        { title: 'Packing', detail: 'Packed into recycled cardboard boxes', icon: 'box' },
        { title: 'Incubation', detail: 'Stored in a dark room at 22°C for 3 weeks; fungus spreads through the mixture', icon: 'dark' },
        { title: 'Growing', detail: 'Kit sold; customer sprays it with water twice a day', icon: 'spray' },
        { title: 'Harvest', detail: 'Mushrooms picked after about 10 days; used kit composted', icon: 'harvest' },
      ],
      zones: [
        ['IN THE WORKSHOP', 0, 5],
        ['AT HOME', 6, 7],
      ],
    },
    plan: [
      { label: 'Overview', hint: 'How many stages? Where does it start and end? Where does it happen?' },
      { label: 'Stages 1–4', hint: 'Collecting, mixing, heating, adding spawn — in the passive.' },
      { label: 'Stages 5–8', hint: 'Packing, incubation, growing at home, harvest and compost.' },
    ],
    tips: [
      'Count the stages and note where the process begins and ends — that is your overview.',
      'Use the passive for actions: “the grounds are collected”, “the mixture is heated to 70°C”.',
      'Vary your sequencers: first, then, once, at the next stage, after about ten days, finally.',
    ],
    checks: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'sequencers', 'passive', 'no-opinion', 'no-overuse', 'lexical-variety', 'sentence-variety'],
    model: {
      text: `The diagram illustrates the stages by which coffee waste from urban cafés is recycled into boxes that people can use to grow their own mushrooms.

Overall, there are eight stages, beginning with the collection of used grounds and ending with a harvest of mushrooms and the composting of the spent kit. The first six stages take place in a workshop, while the last two happen in customers' homes.

First, used coffee grounds are collected from cafés every day by electric cargo bike. They are then mixed with chopped straw. Next, the mixture is heated to 70°C for one hour to kill bacteria, and once it has cooled, oyster mushroom spawn is added. After that, the material is packed into recycled cardboard boxes.

At the next stage, the boxes are stored in a dark room at 22°C for three weeks, during which time the fungus spreads through the mixture. The finished kits are then sold, and customers spray them with water twice a day. After about ten days, the mushrooms can be picked, and finally, the used kit is turned into compost.`,
      notes: [
        {
          quote: 'the stages by which coffee waste from urban cafés is recycled into boxes',
          criterion: 'LR',
          note: 'Paraphrase: used coffee grounds → coffee waste, city → urban, kits → boxes.',
        },
        {
          quote: 'Overall, there are eight stages, beginning with the collection of used grounds',
          criterion: 'TA',
          note: 'The process overview: number of stages, the start and the end.',
        },
        {
          quote: 'The first six stages take place in a workshop, while the last two happen in customers\' homes.',
          criterion: 'TA',
          note: 'A second overview point groups the stages by location, using the zones in the diagram.',
        },
        {
          quote: 'used coffee grounds are collected from cafés every day',
          criterion: 'GRA',
          note: 'Passive voice: the action matters, not who does it.',
        },
        {
          quote: 'once it has cooled, oyster mushroom spawn is added',
          criterion: 'CC',
          note: '“Once” + present perfect links two stages in one complex sentence.',
        },
        {
          quote: 'during which time the fungus spreads through the mixture',
          criterion: 'GRA',
          note: 'A relative clause adds the detail of stage six without starting a new sentence.',
        },
        {
          quote: 'the mushrooms can be picked',
          criterion: 'GRA',
          note: 'A modal passive (can be + past participle) for variety.',
        },
      ],
    },
  },
  {
    id: 'gt-festival-letter',
    task: 'task1-gt',
    minutes: 20,
    minWords: 150,
    instructions: [
      'Last month you helped as a volunteer at your city library’s weekend reading festival. The organiser, Ms Okafor, has asked all volunteers for feedback.',
      'Write a letter to the organiser. In your letter',
    ],
    bullets: [
      'describe what you enjoyed most about the festival',
      'explain one problem you noticed',
      'suggest how next year’s festival could be improved',
    ],
    footer: ['Write at least 150 words. You do NOT need to write any addresses.', 'Begin your letter as follows: Dear Ms Okafor,'],
    question:
      'Last month you helped as a volunteer at your city library’s weekend reading festival. The organiser, Ms Okafor, has asked all volunteers for feedback. Describe what you enjoyed most about the festival, explain one problem you noticed, suggest how next year’s festival could be improved.',
    plan: [
      { label: 'Enjoyed most', hint: 'One specific moment or activity, and why it mattered.' },
      { label: 'The problem', hint: 'What went wrong, and its effect on visitors or volunteers.' },
      { label: 'Suggestion', hint: 'A practical fix for next year that answers your problem.' },
    ],
    tips: [
      'You know Ms Okafor a little: be polite and fairly formal. Start “Dear Ms Okafor,” and end “Yours sincerely,”.',
      'Give each bullet point its own paragraph, and make your suggestion solve the problem you described.',
      'Avoid contractions (“I am”, not “I’m”) to keep the tone consistent.',
    ],
    checks: ['min-words', 'salutation', 'purpose', 'bullet-1', 'bullet-2', 'bullet-3', 'paragraphs-4', 'signoff', 'no-contractions', 'linkers-4'],
    bulletChecks: [
      { label: 'what you enjoyed', pattern: /\b(enjoy\w*|loved?|highlight|best part|favourite|favorite|impress\w*|delight\w*|wonderful|rewarding|memorable|fantastic|inspir\w*)\b/i },
      { label: 'a problem', pattern: /\b(problems?|issues?|unfortunately|difficult\w*|confus\w*|crowded|queues?|noisy|noise|late|lack\w*|not enough|too few|too many|could not|couldn't|disappoint\w*|struggl\w*)\b/i },
      { label: 'a suggestion', pattern: /\b(suggest\w*|recommend\w*|next year|in (?:the )?future|propos\w*|perhaps|might|improv\w*|would be (?:better|helpful|useful|good|great)|could (?:also )?(?:be|add|provide|offer|print|place|hire|move|use|put|ask))\b/i },
    ],
    model: {
      text: `Dear Ms Okafor,

I am writing in response to your request for feedback on last month's reading festival, where I volunteered at the children's storytelling tent.

What I enjoyed most was seeing how the authors' readings brought families together. On Saturday morning, nearly every seat in the tent was taken, and several parents told me afterwards that their children had asked to borrow the books they had just heard. It was genuinely rewarding to be part of that.

However, I did notice that the signs around the venue were confusing. Many visitors could not find the main hall, so some sessions started late while people were still arriving, and volunteers spent much of their time giving directions.

For next year, I would suggest printing a simple map on the back of the programme and placing larger signs at each entrance. It might also be helpful to station one volunteer at the main door during the busiest hours.

Thank you for organising such a wonderful event. I would be delighted to help again next year.

Yours sincerely,
Leila Hassan`,
      notes: [
        {
          quote: 'I am writing in response to your request for feedback',
          criterion: 'TA',
          note: 'The purpose is clear from the first line, and the context (which tent) is set up briefly.',
        },
        {
          quote: 'What I enjoyed most was seeing how the authors\' readings brought families together.',
          criterion: 'GRA',
          note: 'A cleft sentence (“What I enjoyed most was…”) answers bullet 1 directly and adds grammatical range.',
        },
        {
          quote: 'several parents told me afterwards that their children had asked to borrow the books',
          criterion: 'TA',
          note: 'A specific, believable detail develops the bullet instead of just saying “it was good”.',
        },
        {
          quote: 'However, I did notice that the signs around the venue were confusing.',
          criterion: 'CC',
          note: 'A clear shift to bullet 2. The emphatic “did notice” softens the criticism politely.',
        },
        {
          quote: 'I would suggest printing a simple map on the back of the programme',
          criterion: 'TA',
          note: 'The suggestion answers the problem from the previous paragraph, so the letter hangs together.',
        },
        {
          quote: 'It might also be helpful to station one volunteer at the main door',
          criterion: 'LR',
          note: 'Tentative, polite language (“it might be helpful”) suits a semi-formal letter.',
        },
        {
          quote: 'Yours sincerely,',
          criterion: 'TA',
          note: 'A named reader (“Dear Ms Okafor”) takes “Yours sincerely”.',
        },
      ],
    },
  },
  {
    id: 't2-cooking-school',
    task: 'task2',
    minutes: 40,
    minWords: 250,
    instructions: [
      'Some people believe that every secondary school should teach students how to cook healthy meals as a compulsory subject.',
      'To what extent do you agree or disagree?',
    ],
    footer: T2_FOOTER,
    question:
      'Some people believe that every secondary school should teach students how to cook healthy meals as a compulsory subject. To what extent do you agree or disagree?',
    plan: [
      { label: 'Position', hint: 'Agree, disagree or partly agree — and the one reason that decides it.' },
      { label: 'Idea 1', hint: 'Your strongest reason + a specific example.' },
      { label: 'Idea 2', hint: 'A second reason, or the opposing view and why it is weaker.' },
    ],
    tips: [
      'Decide your position before you write and state it in the introduction — then keep it to the last line.',
      'One main idea per body paragraph, each explained and supported with an example.',
      'A short concession (“Admittedly, timetables are crowded…”) shows balance without changing your position.',
    ],
    checks: ['min-words', 'paragraphs-4', 'paraphrase', 'position', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety', 'lexical-variety'],
    model: {
      text: `In many countries, teenagers leave school able to solve equations but unable to prepare a simple, nutritious dinner. For this reason, some argue that healthy cooking should be a compulsory part of the secondary curriculum. I largely agree with this view, because cooking is a life skill with clear benefits for health and independence, although I believe it should complement rather than replace core academic subjects.

The strongest argument for compulsory cooking lessons concerns public health. Young people who rely on fast food and ready meals, such as instant noodles and frozen pizza, consume far more salt, sugar and fat than is recommended, and these habits often continue into adulthood. A weekly practical class, in which students learn to plan a balanced meal and prepare it on a budget, would give every teenager the knowledge to make better choices. Crucially, making the subject compulsory means that it would reach children whose families do not cook at home, who arguably need it most.

Cooking also builds independence and a range of transferable skills. Following a recipe involves measuring, timing and organisation, while cooking for others encourages teamwork and responsibility. For example, students who have managed a small kitchen budget at school are likely to find the transition to university or their first job far less daunting.

Admittedly, timetables are already crowded, and some parents worry that academic results could suffer. However, cooking does not need to be taught daily; one double lesson a week, perhaps replacing part of an existing health course, would be enough to make a lasting difference.

In conclusion, I largely agree that healthy cooking should be taught to all secondary students, provided it is given a modest place in the timetable. Its benefits for long-term health and independence clearly outweigh the cost of finding room for it in the school week.`,
      notes: [
        {
          quote: 'some argue that healthy cooking should be a compulsory part of the secondary curriculum',
          criterion: 'LR',
          note: 'The question is paraphrased: “every secondary school should teach… as a compulsory subject” becomes “a compulsory part of the secondary curriculum”.',
        },
        {
          quote: 'I largely agree with this view, because cooking is a life skill with clear benefits for health and independence',
          criterion: 'TA',
          note: 'A clear, qualified position that previews both body paragraphs: health and independence.',
        },
        {
          quote: 'The strongest argument for compulsory cooking lessons concerns public health.',
          criterion: 'CC',
          note: 'A topic sentence that states the paragraph’s one main idea.',
        },
        {
          quote: 'in which students learn to plan a balanced meal and prepare it on a budget',
          criterion: 'GRA',
          note: 'A controlled relative clause (“in which…”) adds detail inside a longer sentence.',
        },
        {
          quote: 'it would reach children whose families do not cook at home, who arguably need it most',
          criterion: 'TA',
          note: 'Extends the idea: this is why the word “compulsory” in the question matters.',
        },
        {
          quote: 'far less daunting',
          criterion: 'LR',
          note: 'A precise, less common adjective with a natural intensifier.',
        },
        {
          quote: 'Admittedly, timetables are already crowded',
          criterion: 'TA',
          note: 'A concession and rebuttal: the opposing view is answered, and the position never wavers.',
        },
        {
          quote: 'In conclusion, I largely agree',
          criterion: 'CC',
          note: 'The conclusion repeats exactly the position from the introduction — consistent from start to finish.',
        },
      ],
    },
  },
  {
    id: 't2-language-abroad',
    task: 'task2',
    minutes: 40,
    minWords: 250,
    instructions: [
      'Some people believe that the best way to learn a foreign language is to live in a country where it is spoken. Others think that, with modern technology, a language can be learned just as effectively at home.',
      'Discuss both views and give your own opinion.',
    ],
    footer: T2_FOOTER,
    question:
      'Some people believe that the best way to learn a foreign language is to live in a country where it is spoken. Others think that, with modern technology, a language can be learned just as effectively at home. Discuss both views and give your own opinion.',
    plan: [
      { label: 'Your opinion', hint: 'Which side do you favour, or do you combine them? Say it in the introduction.' },
      { label: 'View 1: at home', hint: 'Technology: cost, structure, flexibility — with an example.' },
      { label: 'View 2: abroad', hint: 'Immersion: constant real use, fluency, culture — with an example.' },
    ],
    tips: [
      'Three jobs: explain view one, explain view two, and give your own opinion — in the introduction and conclusion.',
      'Give each view a full, fair paragraph before you show which side you prefer.',
      'Signpost clearly: “Those who favour…”, “On the other hand, supporters of… argue…”, “In my view…”.',
    ],
    checks: ['min-words', 'paragraphs-4', 'paraphrase', 'both-views', 'position', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety'],
    model: {
      text: `It is often said that the most effective way to master a foreign language is to move abroad and use it every day. Others argue that apps, video calls and online courses now make it possible to reach the same level without leaving home. While technology has transformed language learning, I believe that living abroad still offers advantages that are difficult to replicate on a screen.

Those who favour learning at home make a convincing case. Online platforms provide structured grammar practice, instant feedback and access to native speakers through video lessons, often at a fraction of the cost of living overseas. Moreover, learners can study at their own pace and fit lessons around work or family commitments. For instance, many professionals now prepare for international exams entirely online and achieve impressive results.

On the other hand, supporters of immersion point out that a language is not only a set of rules but a social skill. Living abroad forces learners to use the language constantly and unpredictably, whether they are opening a bank account, understanding a regional accent or joining a conversation at work. This daily exposure develops fluency and listening skills far faster than scheduled lessons, because learners cannot simply switch to their mother tongue when a situation becomes difficult. Immersion also teaches cultural knowledge, such as humour and politeness conventions, that textbooks rarely cover.

In my view, technology is an excellent foundation, but it cannot fully replace immersion. Apps and online lessons build vocabulary and grammar efficiently, yet it is time spent abroad that turns this knowledge into confident, natural communication.

In conclusion, although modern tools allow people to make remarkable progress without travelling, they lay the foundation rather than finish the job: living in a country where the language is spoken is still what turns that knowledge into real fluency.`,
      notes: [
        {
          quote: 'It is often said that the most effective way to master a foreign language',
          criterion: 'LR',
          note: 'An impersonal opening paraphrases “some people believe”, and “the most effective way” keeps the exact meaning of “the best way” without copying it — or overstating it.',
        },
        {
          quote: 'I believe that living abroad still offers advantages that are difficult to replicate on a screen',
          criterion: 'TA',
          note: 'The opinion arrives in the introduction, so the examiner knows the writer’s position from the start.',
        },
        {
          quote: 'Those who favour learning at home make a convincing case.',
          criterion: 'CC',
          note: 'Signposts view two (technology) and gives it a fair hearing before disagreeing.',
        },
        {
          quote: 'often at a fraction of the cost of living overseas',
          criterion: 'LR',
          note: 'A natural, precise collocation: “at a fraction of the cost”.',
        },
        {
          quote: 'On the other hand, supporters of immersion point out',
          criterion: 'CC',
          note: '“On the other hand” correctly introduces the genuinely opposite view.',
        },
        {
          quote: 'whether they are opening a bank account, understanding a regional accent or joining a conversation at work',
          criterion: 'TA',
          note: 'Concrete, relatable examples make the argument vivid and convincing.',
        },
        {
          quote: 'because learners cannot simply switch to their mother tongue when a situation becomes difficult',
          criterion: 'GRA',
          note: 'A reason clause containing a time clause — complex, but fully controlled.',
        },
        {
          quote: 'In my view, technology is an excellent foundation, but it cannot fully replace immersion.',
          criterion: 'TA',
          note: 'A separate paragraph for the writer’s own view: technology lays the foundation, immersion brings fluency. The conclusion repeats exactly this, so the position is clear from the first line to the last.',
        },
      ],
    },
  },
  {
    id: 't2-outdoor-play',
    task: 'task2',
    minutes: 40,
    minWords: 250,
    instructions: [
      'In many cities, children now spend far less time playing outdoors than previous generations did.',
      'What are the reasons for this? What can be done to encourage children to spend more time outside?',
    ],
    footer: T2_FOOTER,
    question:
      'In many cities, children now spend far less time playing outdoors than previous generations did. What are the reasons for this? What can be done to encourage children to spend more time outside?',
    plan: [
      { label: 'Main answer', hint: 'Your two causes and two solutions in one sentence each.' },
      { label: 'Causes', hint: 'Two reasons, each explained — screens? safety? space? time?' },
      { label: 'Solutions', hint: 'One solution for each cause, with who should act and how.' },
    ],
    tips: [
      'Two questions means two halves: one body paragraph for causes, one for solutions.',
      'Match your solutions to your causes so the essay reads as one connected argument.',
      'Say who should act (schools, councils, parents) — vague “people should” solutions are weaker.',
    ],
    checks: ['min-words', 'paragraphs-4', 'paraphrase', 'causes-solutions', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety', 'lexical-variety'],
    model: {
      text: `In many urban areas, the sight of children playing in the street has become increasingly rare. This essay will argue that the decline is mainly caused by the appeal of screen-based entertainment and by parents' safety concerns, and that both schools and local councils can help to reverse it.

The first reason is the attraction of digital devices. Video games, streaming services and social media are designed to be engaging, and many children would rather spend an afternoon online than in a park. As a result, outdoor play now competes with entertainment that is available instantly and indoors. A second, equally important factor is fear. Busy roads and worries about strangers mean that many parents no longer allow young children to go out without an adult, and since most parents work long hours, unsupervised outdoor play has largely disappeared.

These problems, however, are not impossible to solve. To tackle the pull of screens, schools could make outdoor activity a routine part of the day, for example by holding some lessons outside or running after-school clubs for gardening and sport. Once children experience outdoor play regularly, they are more likely to choose it in their free time. To address safety concerns, local councils could introduce "play streets", where roads near homes are closed to traffic for a few hours each week so that children can play while neighbours keep an eye on them. Similar schemes have been trialled in a number of cities with encouraging results.

In conclusion, children spend less time outdoors mainly because of the appeal of technology and their parents' fears for their safety. Schools and councils can respond by building outdoor time into children's routines and by creating safer spaces, such as play streets, where young people can play freely.`,
      notes: [
        {
          quote: 'the sight of children playing in the street has become increasingly rare',
          criterion: 'LR',
          note: 'A vivid paraphrase of “children spend far less time playing outdoors”.',
        },
        {
          quote: 'This essay will argue that the decline is mainly caused by the appeal of screen-based entertainment and by parents\' safety concerns',
          criterion: 'TA',
          note: 'The thesis answers both questions at once: two causes, then who can solve them.',
        },
        {
          quote: 'As a result, outdoor play now competes with entertainment that is available instantly and indoors.',
          criterion: 'CC',
          note: 'A result linker that explains the consequence of the first cause.',
        },
        {
          quote: 'A second, equally important factor is fear.',
          criterion: 'CC',
          note: 'A short, punchy sentence signals the second cause — sentence variety with a purpose.',
        },
        {
          quote: 'These problems, however, are not impossible to solve.',
          criterion: 'CC',
          note: 'Referencing (“These problems”) bridges the two halves; “however” sits mid-sentence.',
        },
        {
          quote: 'To tackle the pull of screens, schools could make outdoor activity a routine part of the day',
          criterion: 'TA',
          note: 'Each solution is explicitly matched to a cause and names who should act.',
        },
        {
          quote: 'where roads near homes are closed to traffic for a few hours each week so that children can play',
          criterion: 'GRA',
          note: 'A relative clause with a passive and a purpose clause, all accurate.',
        },
      ],
    },
  },
]

export const findPrompt = (id: string | undefined) => PROMPTS.find((p) => p.id === id)

// content.ts keeps a light copy of each prompt's task and minimum for the hub; make sure the two never drift.
if (import.meta.env?.DEV) {
  for (const p of PROMPTS) {
    const meta = metaFor(p.id)
    if (meta.task !== p.task || meta.minWords !== p.minWords) {
      console.warn(`[writing] PROMPT_META for “${p.id}” does not match prompts.ts (task/minWords).`)
    }
  }
}

/** Everything the checklist needs to know about a prompt, so every caller judges an essay the same way. */
export function checkContextFor(prompt: WritingPrompt, text: string, analysis = analyse(text, prompt.question)): CheckContext {
  const fig = prompt.figure
  const labels = fig?.kind === 'line' ? [...fig.series.map((s) => s.label), ...fig.xs, fig.title] : []
  return {
    text,
    analysis,
    minWords: prompt.minWords,
    question: prompt.question,
    bullets: prompt.bulletChecks,
    figureValues: fig?.kind === 'line' ? fig.series.flatMap((s) => s.values) : [],
    ignoreNumbers: [...[prompt.question, ...labels].join(' ').matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0])),
  }
}

/** Runs the prompt's 10-point checklist on a text. */
export const checkEssay = (prompt: WritingPrompt, text: string, analysis = analyse(text, prompt.question)) =>
  runChecks(prompt.checks, checkContextFor(prompt, text, analysis))

export const taskLabel = (p: WritingPrompt) =>
  p.task === 'task2' ? 'Writing Task 2' : p.task === 'task1-gt' ? 'Writing Task 1 · General Training' : 'Writing Task 1 · Academic'

// ------------------------------------------------------------------- rubric ---

export interface CriterionInfo {
  id: Criterion
  name: string
  short: string
  question: string
  bands: Record<5 | 6 | 7 | 8, string>
}

/** Short paraphrased descriptors for self-assessment (bands 5–8). Not the official wording. */
export function rubricFor(task: WritingTask): CriterionInfo[] {
  const ta: CriterionInfo =
    task === 'task2'
      ? {
          id: 'TA',
          name: 'Task Response',
          short: 'TR',
          question: 'Did you answer every part of the question, with a clear position and developed ideas?',
          bands: {
            8: 'Every part of the question is answered in depth. My position is clear throughout and my ideas are well extended and supported.',
            7: 'All parts are answered and a clear position runs through the essay. Main ideas are extended and supported, though one may lack focus.',
            6: 'All parts are addressed, some more fully than others. I have a relevant position, but my conclusion or some ideas are underdeveloped.',
            5: 'I only partly answer the question. My position is unclear in places and ideas are limited, repetitive or not well supported.',
          },
        }
      : task === 'task1-gt'
        ? {
            id: 'TA',
            name: 'Task Achievement',
            short: 'TA',
            question: 'Did you cover all three bullet points with a clear purpose and the right tone?',
            bands: {
              8: 'All three bullets are fully covered and developed. The purpose is clear and the tone is consistently right for the reader.',
              7: 'All bullets are covered and the purpose is clear. The tone is appropriate and consistent; some bullets could go further.',
              6: 'All bullets are addressed, though some unevenly. The purpose is generally clear, but the tone slips in places.',
              5: 'All bullets are mentioned, but some are barely developed. The purpose is unclear in places and the tone is inconsistent. (A missing bullet is below band 5.)',
            },
          }
        : {
            id: 'TA',
            name: 'Task Achievement',
            short: 'TA',
            question: 'Did you give a clear overview and select the key features with accurate data?',
            bands: {
              8: 'All requirements are covered well. Key features are clearly presented and highlighted with well-chosen data.',
              7: 'There is a clear overview of the main trends, differences or stages. Key features are highlighted, though they could be extended.',
              6: 'An overview is attempted and the information is suitably selected, but some details are irrelevant, inaccurate or missing.',
              5: 'Details are recounted mechanically with no clear overview. Too much detail or too little data, or the answer is under length.',
            },
          }
  return [
    ta,
    {
      id: 'CC',
      name: 'Coherence & Cohesion',
      short: 'CC',
      question: 'Is your writing easy to follow, with logical paragraphs and well-used linking?',
      bands: {
        8: 'Ideas follow logically and are easy to follow. Paragraphs are well managed and linking is skilful with rare lapses.',
        7: 'Clear progression throughout. A range of linkers is used well, with a little over- or under-use. Each paragraph has a clear focus.',
        6: 'Coherent overall, but some linking is mechanical or faulty and referencing is not always clear. Paragraphing could be more logical.',
        5: 'Some organisation but no clear overall progression. Linkers are limited, inaccurate or overused; paragraphing is weak or missing.',
      },
    },
    {
      id: 'LR',
      name: 'Lexical Resource',
      short: 'LR',
      question: 'Did you use precise, varied vocabulary and natural collocations, with few spelling errors?',
      bands: {
        8: 'A wide vocabulary used fluently and precisely, including less common words used skilfully. Errors are rare.',
        7: 'Enough range for flexibility and precision, with some less common words and good collocation. Occasional slips in word choice or spelling.',
        6: 'Adequate range for the task. Attempts at less common words are sometimes inaccurate; some spelling or word-form errors.',
        5: 'Limited range, only just adequate. Noticeable spelling and word-form errors that may make the reader work harder.',
      },
    },
    {
      id: 'GRA',
      name: 'Grammatical Range & Accuracy',
      short: 'GRA',
      question: 'Did you mix simple and complex sentences, and are most of them error-free?',
      bands: {
        8: 'A wide range of structures. Most sentences are completely error-free, with only very occasional slips.',
        7: 'A variety of complex structures and frequent error-free sentences. Good control of grammar and punctuation, with a few errors.',
        6: 'A mix of simple and complex sentences. Some grammar and punctuation errors, but they rarely affect meaning.',
        5: 'A limited range. Complex sentences are attempted but tend to contain errors; mistakes are frequent.',
      },
    },
  ]
}

/** The mean of the four criteria, rounded to the nearest half band (quarters round up). */
export function estimateBand(scores: number[]) {
  if (!scores.length) return 0
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.floor(mean * 2 + 0.5) / 2
}
