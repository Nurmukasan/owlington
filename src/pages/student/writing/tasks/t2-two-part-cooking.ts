import { task2 } from '../build'

export default task2({
  id: 't2-two-part-cooking',
  type: 'two-part',
  instructions: [
    'In many countries, people are cooking at home less often and eating more ready-made meals and takeaways.',
    'What are the reasons for this? What effects does it have on individuals and society?',
  ],
  parts: [
    ['reasons people cook less', /\b(because|reason|why|busy|time|apps?|delivery|cheap|convenien)/i],
    ['effects on individuals and society', /\b(effects?|result|consequence|health|obesity|waste|packaging|society|lead to)\b/i],
  ],
  tips: [
    'Question 2 asks about effects, not solutions — do not drift into a problem–solution essay.',
    'Give effects on individuals (health, money, skills) and on society (health systems, waste).',
    'One body paragraph per question.',
  ],
  model: `
Home cooking appears to be declining in many parts of the world, as people increasingly rely on ready meals and food delivered to their door. This essay will explain why this is happening and consider its consequences for both individuals and society as a whole.

The main reason is a lack of time. Long working hours and long commutes leave many adults too tired to prepare a meal in the evening, especially when both partners in a household work. Technology has made the alternative extremely easy, because delivery apps, such as Uber Eats, allow people to order almost any type of food in a few seconds. In addition, many young people never learn to cook properly at home or at school, so preparing a meal from fresh ingredients seems difficult and time-consuming.

This trend has a number of effects. For individuals, the most serious is on health. Ready meals and takeaways usually contain more salt, sugar and fat than home-cooked food, and portions are often larger, which can lead to weight gain and related illnesses such as diabetes. Eating out regularly is also expensive. For society, rising obesity places a heavy burden on public health systems. There are environmental consequences as well, as takeaway meals generate large amounts of plastic packaging that often ends up in landfill.

In conclusion, people cook less because they are busy, because ordering food has become effortless and because cooking skills are declining. As a result, both personal health and public resources suffer, and the environment pays a price in waste.
`,
  notes: [
    ['This essay will explain why this is happening and consider its consequences for both individuals and society as a whole.', 'TA', 'The introduction maps both questions.'],
    ['The main reason is a lack of time.', 'CC', 'A short, direct topic sentence.'],
    ['so preparing a meal from fresh ingredients seems difficult and time-consuming', 'LR', 'Natural collocations: fresh ingredients, time-consuming.'],
    ['For individuals, the most serious is on health.', 'TA', 'Effects are organised by who is affected, as the question asks.'],
    ['places a heavy burden on public health systems', 'LR', 'A precise collocation for effects on society.'],
  ],
})
