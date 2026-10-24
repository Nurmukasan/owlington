import { mcq, part, person, test } from '../build'

const tutor = person('tutor', 'Dr Barker', 'Tutor', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')
const elsa = person('elsa', 'Elsa', 'Student', 'f', 'en-GB', 'y1LQSw6x4O5I1qZEI77j')
const ravi = person('ravi', 'Ravi', 'Student', 'm', 'en-GB', 'hEZploiPJinU5zriiU1l')

export default test('mcq-tutorial', [
  part({
    n: 3,
    title: 'Planning a study of school gardens',
    intro: 'You will hear two education students, Elsa and Ravi, discussing their research project with their tutor.',
    speakers: [tutor, elsa, ravi],
    blocks: [
      {
        lines: `
          tutor: So, Elsa, Ravi, you want to study school gardens. Tell me why.
          elsa: Well, a lot of primary schools have started growing vegetables recently. Most of the articles we've read are enthusiastic, but they're mainly opinion pieces. There's very little actual data.
          tutor: That's a fair point. What exactly do you want to find out?
          ravi: At first we wanted to see whether gardening improves children's diets. But measuring what children eat at home is almost impossible.
          elsa: So now we're focusing on whether it changes their attitude to trying new vegetables. That's something we can measure in school.
          tutor: Sensible. How will you measure it?
          ravi: We'll offer children small tastes of vegetables they haven't eaten before, and record whether they try them. We'll do that before the gardening programme starts and again at the end.
          tutor: And you'll compare with a school that doesn't have a garden?
          elsa: We'd like to, but we haven't found one yet. Most schools nearby have some kind of garden.
          tutor: You could compare classes within the same school. Some schools only let older children do gardening.
          ravi: Oh, that's a good idea. It would also mean the children have the same school meals, so that's one less difference.
          tutor: Exactly. What worries you most about the project?
          elsa: Honestly, getting permission from parents. We need written consent for every child.
          ravi: I'm more worried about the timing. If the programme starts late, we might not have results before our deadline.
          tutor: Talk to the head teacher about the start date as soon as possible. And for consent, send the forms home early, with a short explanation that's easy to read.
          elsa: And how long should the final report be?
          tutor: About eight thousand words. But don't spend too long on the literature review. Most of the marks are for your analysis.
        `,
        groups: [
          mcq([
            [
              'What do the students say about earlier writing on school gardens?',
              ['It is mostly negative.', 'It is based on little evidence.', 'It is out of date.'],
              'B',
              "There's very little actual data",
              'The articles are mainly opinion pieces.',
            ],
            [
              'Why did the students change their research question?',
              ['Children’s home diets are hard to measure.', 'The tutor rejected their first idea.', 'Schools would not cooperate.'],
              'A',
              'measuring what children eat at home is almost impossible',
              'They now study attitudes to trying new vegetables.',
            ],
            [
              'How will the students collect data?',
              ['by interviewing parents', 'by recording whether children taste new vegetables', 'by weighing school meals'],
              'B',
              'record whether they try them',
              'Before and after the gardening programme.',
            ],
            [
              'What does the tutor suggest about the comparison group?',
              ['using classes in the same school', 'visiting a school further away', 'leaving it out'],
              'A',
              'You could compare classes within the same school',
              'Some schools only let older children garden.',
            ],
            [
              'Why does Ravi like the tutor’s suggestion?',
              ['It is cheaper.', 'It reduces differences between the groups.', 'It involves more children.'],
              'B',
              "the children have the same school meals, so that's one less difference",
              'Fewer differences make the comparison fairer.',
            ],
            [
              'What is Ravi most worried about?',
              ['getting consent', 'the start date of the programme', 'the length of the report'],
              'B',
              "I'm more worried about the timing",
              'Elsa is worried about consent.',
            ],
            [
              'What does the tutor say about the final report?',
              ['The literature review is worth the most marks.', 'The analysis is the most important part.', 'It should be shorter than 8,000 words.'],
              'B',
              'Most of the marks are for your analysis',
              'They should not spend too long on the literature review.',
            ],
          ]),
        ],
      },
    ],
    traps: [
      ['At first we wanted to see whether gardening improves children', 22, 'Their first idea.'],
      ['Honestly, getting permission from parents', 26, 'Elsa’s worry, not Ravi’s.'],
      ['About eight thousand words', 27, 'The length is about 8,000 words.'],
    ],
  }),
])
