import { endings, features, headings, mcq, passage, short, table, test, tfng, ynng } from '../build'

export default test('full-02', [
  passage({
    title: 'The Humble Pencil',
    sub: 'A stick of grey mineral in a wooden case has a surprisingly turbulent history.',
    text: `
      A
      Few objects are as ordinary as the pencil.
      It is cheap, it needs no power, it works upside down and in freezing conditions, and its marks can be rubbed out.
      Yet the pencil has a history that includes guarded mines, wartime shortages and fierce competition between nations.

      B
      The story begins in the sixteenth century in Borrowdale, a valley in the north-west of England, where an unusually pure deposit of graphite was discovered.
      Local shepherds are said to have used lumps of the dark, soft mineral to mark their sheep.
      At the time, nobody understood what graphite was; because it left a grey mark like lead, it was called ‘black lead’, and the name ‘lead pencil’ survives to this day, even though pencils have never contained any lead.

      C
      Graphite soon proved valuable for more than marking animals.
      It was used to line the moulds in which cannonballs were cast, which made it important to the military, and the Borrowdale mine became so valuable that it was guarded by armed men.
      At times the mine was deliberately flooded to stop thieves from entering, and in 1752 Parliament made the theft of graphite a serious crime, punishable by imprisonment or transportation to the colonies.

      D
      The first pencils were simply sticks of graphite, sometimes wrapped in string or sheepskin to keep the user’s fingers clean.
      Later, craftsmen began inserting the sticks into wooden holders.
      Because Borrowdale graphite was so pure, it could be sawn into thin rods and used directly, and for two centuries England dominated the production of high-quality pencils.

      E
      Other countries were less fortunate.
      Their graphite was impure and crumbly, and could not be cut into rods.
      The problem became urgent in France in the 1790s, when war with Britain cut off supplies of English pencils.
      The French government asked Nicolas-Jacques Conté, an engineer and inventor, to find a solution, and in 1795 he patented a method that is still used today.
      Conté ground the graphite into a fine powder, mixed it with clay and water, shaped the mixture into rods and baked them in a kiln.
      By changing the proportion of clay, he could make pencils harder or softer: more clay produced a harder, lighter line, and less clay a softer, darker one.

      F
      Conté’s process meant that good pencils could be made from poor graphite, and the industry spread across Europe and North America.
      The German city of Nuremberg became a major centre, and several family firms founded there in the eighteenth and nineteenth centuries are still in business.
      In the United States, pencil factories developed new machinery for cutting the wooden cases, and by the early twentieth century millions of pencils were being produced every day.

      G
      Some features that we now take for granted were added surprisingly late.
      A pencil with a rubber eraser attached to one end was patented in the United States in 1858, although the idea was not welcomed everywhere; some teachers believed it would encourage pupils to make careless mistakes.
      The familiar yellow paint became popular at the end of the nineteenth century, when one manufacturer used it to advertise the high quality of its graphite, and competitors quickly copied it.

      H
      Today, the world produces billions of pencils every year.
      Digital devices have replaced them for many purposes, but pencils remain essential for artists, architects, carpenters and children learning to write.
      It is often claimed that a single pencil contains enough graphite to draw a line more than fifty kilometres long.
    `,
    groups: [
      table(
        'The development of the pencil',
        1,
        ['Period', 'Event', 'Detail'],
        [
          ['16th century', 'pure graphite found at Borrowdale', 'used by [[shepherds]] to mark animals'],
          ['16th–18th centuries', 'graphite used in casting [[cannonballs]]', 'mine protected by guards and sometimes [[flooded]]'],
          ['1752', 'theft of graphite made a serious crime', 'punishment could be prison or [[transportation]]'],
          ['1795', 'Conté patents a new process', 'graphite powder mixed with [[clay]] and baked in a [[kiln]]'],
          ['1858', 'pencil with an [[eraser]] patented', 'some teachers feared it would lead to careless work'],
        ],
        [
          ['B2', '“Local shepherds are said to have used lumps of the dark, soft mineral to mark their sheep.”'],
          ['C2', 'Graphite “was used to line the moulds in which cannonballs were cast”.'],
          ['C3', '“At times the mine was deliberately flooded to stop thieves from entering.”'],
          ['C3', 'Theft was “punishable by imprisonment or transportation to the colonies”.'],
          ['E5', 'Conté “mixed it with clay and water”.'],
          ['E5', 'The rods were baked “in a kiln”.'],
          ['G2', '“A pencil with a rubber eraser attached to one end was patented in the United States in 1858.”'],
        ],
      ),
      tfng([
        ['Pencils were originally made with a small amount of lead.', 'F', 'B3', 'The name survives “even though pencils have never contained any lead”.'],
        ['English pencils were exported to many countries in the eighteenth century.', 'NG', 'D3', 'England “dominated the production of high-quality pencils”, but exports are never mentioned.'],
        ['French graphite could not be cut into thin rods.', 'T', 'E2', 'Other countries’ graphite “was impure and crumbly, and could not be cut into rods”. France is one of them (E3).'],
        ['Adding more clay to the mixture makes a pencil’s line darker.', 'F', 'E6', '“More clay produced a harder, lighter line.”'],
        ['Some of the pencil companies started in Nuremberg still exist.', 'T', 'F2', 'Several firms founded there “are still in business”.'],
        ['The first yellow pencils were made with graphite from Borrowdale.', 'NG', 'G3', 'One manufacturer used yellow paint to advertise its graphite, but we are not told where its graphite came from.'],
      ]),
    ],
  }),

  passage({
    title: 'Cities That Bake',
    sub: 'Urban areas can be several degrees hotter than the countryside around them. Planners are learning how to cool them down.',
    text: `
      A
      On a still summer evening, a person walking from the centre of a large city into the surrounding countryside may notice the air becoming steadily cooler.
      The difference can be striking: in some cities, temperatures in the centre are five degrees or more above those in nearby fields, particularly at night.
      This phenomenon, known as the urban heat island, was first described in the early nineteenth century by an amateur scientist who recorded temperatures in and around London, and it has since been measured in cities all over the world.

      B
      Several causes combine to produce the effect.
      Dark surfaces such as asphalt roads and roofs absorb a large proportion of the sun’s energy and release it slowly as heat, long after the sun has set.
      Tall buildings trap heat between them and block the breezes that would otherwise carry it away.
      Cities also generate heat of their own, from vehicles, factories and, increasingly, the air conditioners that pump warm air out of buildings into the streets.
      Finally, the replacement of trees and soil with concrete removes one of nature’s most effective cooling systems: the evaporation of water from leaves and the ground.

      C
      The consequences go well beyond discomfort.
      During heatwaves, death rates rise sharply, especially among elderly people and those with heart or lung conditions, and the risk is greatest in the hottest parts of cities, where night-time temperatures stay high and the body has no chance to recover.
      Higher temperatures also increase the demand for electricity for cooling, raise levels of some air pollutants and can make outdoor work dangerous.
      As the global climate warms, these problems are expected to grow, since the heat island effect adds to the general rise in temperatures.

      D
      Trees are among the most effective remedies.
      They shade streets and buildings, and their leaves release water vapour, cooling the surrounding air.
      Studies in several cities have found that streets lined with mature trees can be several degrees cooler at ground level than similar streets without them.
      Many cities have therefore set targets to increase the area covered by tree canopies, although finding space for roots among underground pipes and cables can be difficult, and young trees take many years to provide significant shade.

      E
      Another approach targets the surfaces themselves.
      Roofs and pavements coated in reflective materials stay much cooler in the sun, and some cities have begun painting roads and playgrounds in pale colours.
      Results have been mixed, however.
      Reflective pavements can bounce heat back onto pedestrians and the walls of nearby buildings, and their light colour soon fades as dirt accumulates, so the benefits must be weighed carefully against the costs.

      F
      Water can also play a part.
      Fountains, ponds and restored streams cool the air around them, and in some cities rivers that had been buried in underground pipes during the twentieth century have been opened up again.
      In Seoul, the removal of a raised motorway to restore a stream that ran beneath it created a green corridor several kilometres long, where temperatures on hot days are noticeably lower than on nearby streets.

      G
      Perhaps the most important lesson is that heat is not distributed equally.
      In many cities, wealthier neighbourhoods have more trees and parks, while poorer districts, with dense housing and few green spaces, are significantly hotter.
      Planners increasingly use satellite images and networks of cheap sensors to identify these hot spots, so that cooling measures can be directed to the people who need them most.
    `,
    groups: [
      headings(
        [
          'Turning to nature to provide shade',
          'The dangers of rising urban temperatures',
          'Why some residents suffer more than others',
          'A combination of reasons for urban heat',
          'Measuring temperatures from space',
          'Making surfaces reflect the sun',
          'The rising cost of electricity',
          'Bringing back hidden waterways',
        ],
        [
          ['B', 'iv', 'B1', '“Several causes combine to produce the effect”: dark surfaces, tall buildings, waste heat and the loss of vegetation.'],
          ['C', 'ii', 'C1 C2', 'Paragraph C covers rising death rates, pollution and dangerous outdoor work. Heading vii is too narrow: electricity is one detail.'],
          ['D', 'i', 'D1 D2', '“Trees are among the most effective remedies”: they shade streets and cool the air.'],
          ['E', 'vi', 'E2', 'Roofs and pavements are coated “in reflective materials”.'],
          ['F', 'viii', 'F2 F3', 'Rivers buried in pipes “have been opened up again”, as in Seoul.'],
          ['G', 'iii', 'G2', 'Poorer districts with few green spaces “are significantly hotter”. Heading v is only a detail of G.'],
        ],
      ),
      endings(
        [
          'because the body cannot recover at night.',
          'because their roots compete with pipes and cables.',
          'because they release heat after dark.',
          'because dirt makes them less effective over time.',
          'because they carry away warm air.',
          'because wealthy areas have more green space.',
        ],
        [
          ['Dark roads and roofs contribute to night-time heat', 'C', 'B2', 'They absorb energy and release it “long after the sun has set”.'],
          ['The hottest parts of a city are especially dangerous during heatwaves', 'A', 'C2', 'Night-time temperatures stay high “and the body has no chance to recover”.'],
          ['Planting trees in city streets can be difficult', 'B', 'D4', '“Finding space for roots among underground pipes and cables can be difficult.”'],
          ['Pale pavements may not keep their cooling effect', 'D', 'E3 E4', '“Their light colour soon fades as dirt accumulates.”'],
        ],
      ),
      short(
        3,
        [
          ['Who first described the urban heat island?', 'an amateur scientist|amateur scientist', 'A3', 'It was “first described… by an amateur scientist who recorded temperatures in and around London”.'],
          ['What structure was removed in Seoul to restore a stream?', 'a raised motorway|raised motorway|motorway', 'F3', '“The removal of a raised motorway to restore a stream.”'],
          ['Apart from satellite images, what do planners use to find hot spots?', 'sensors|cheap sensors|networks of sensors', 'G3', 'Planners use “satellite images and networks of cheap sensors”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'In Praise of Boredom',
    sub: 'We go to great lengths to avoid it. A growing number of psychologists think we should let ourselves be bored more often.',
    text: `
      A
      Boredom has a bad reputation.
      It is associated with wasted time, restless children and unproductive workers, and modern technology seems designed to eliminate it entirely: few people today need to spend even a minute waiting in a queue without a screen to look at.
      Yet some psychologists have begun to argue that boredom is not simply an unpleasant state to be avoided, but a signal that serves a useful purpose, and that losing it may carry hidden costs.

      B
      Defining boredom is harder than it sounds.
      Most researchers agree that it combines a lack of stimulation with a desire for something more engaging, together with difficulty in concentrating on the task at hand.
      Dr Rachel Osei, who has studied boredom for more than a decade, stresses that it is not the same as relaxation.
      ‘A relaxed person is content to do nothing,’ she explains. ‘A bored person wants to do something, but cannot find anything that satisfies them.’
      In her view, this restlessness is the key to understanding why boredom exists.

      C
      Osei argues that boredom acts as an alarm, telling us that our current activity is no longer worthwhile and pushing us to look for alternatives.
      Like pain, which warns us of physical damage, boredom is unpleasant precisely so that we will act on it.
      Without it, she suggests, people might remain in unrewarding situations indefinitely.
      The problem in modern life is not boredom itself but the ease with which we can silence the alarm without responding to it, by reaching for a phone instead of changing what we are doing.

      D
      Other researchers have focused on the link between boredom and creativity.
      In a frequently cited experiment, Professor Martin Hale asked one group of volunteers to spend fifteen minutes copying numbers from a telephone directory, a deliberately dull task, while a second group went straight to the next stage.
      Both groups were then asked to think of as many uses as possible for a pair of plastic cups.
      The volunteers who had been bored produced more ideas, and more original ones.
      Hale believes that boredom encourages the mind to wander, and that daydreaming allows unusual connections between ideas to form.

      E
      Not everyone is convinced.
      Dr Ines Moreau points out that the effects in such experiments are often small, and that some attempts to repeat them have produced weaker results.
      She also warns against romanticising boredom.
      People who experience boredom frequently and intensely, she notes, are more likely to suffer from depression and anxiety, to overeat and to take risks such as dangerous driving.
      ‘Occasional boredom may do us good,’ she says, ‘but chronic boredom is a genuine problem that deserves to be treated seriously.’

      F
      Educators face a particular dilemma.
      Children who are never bored may never learn to entertain themselves, and some teachers worry that constant stimulation, both at school and at home, leaves young people unable to tolerate quiet or slow activities such as reading.
      On the other hand, pupils who are bored in class are less likely to learn, and boredom is one of the most common reasons given by students who leave school early.
      Professor Yuki Tanaka, who studies motivation in schools, argues that the answer is not to make lessons constantly entertaining but to help pupils see why the material matters to them.

      G
      What emerges from this research is a more complicated picture than either the critics or the defenders of boredom suggest.
      Boredom is uncomfortable, and in large doses it is harmful.
      But it also seems to carry information, and perhaps opportunities, that we lose when we fill every empty moment.
      The next time a queue forms, it may be worth leaving the phone in a pocket and seeing where the mind goes.
    `,
    groups: [
      mcq([
        [
          'What point does the writer make about modern technology in paragraph A?',
          ['It has made people more productive.', 'It allows people to avoid boredom almost completely.', 'It is the main cause of boredom in children.', 'It has been studied less than other causes of boredom.'],
          'B',
          'A2',
          'Technology “seems designed to eliminate it entirely”: few people need to wait even a minute without a screen.',
        ],
        [
          'According to Rachel Osei, how is boredom different from relaxation?',
          ['A bored person wants to be active.', 'A bored person is usually tired.', 'A relaxed person concentrates better.', 'A relaxed person feels more restless.'],
          'A',
          'B4',
          '“A bored person wants to do something, but cannot find anything that satisfies them.”',
        ],
        [
          'Why does Osei compare boredom with pain?',
          ['Both become stronger over time.', 'Both are caused by physical damage.', 'Both are unpleasant so that we will respond to them.', 'Both can be removed by using technology.'],
          'C',
          'C2',
          '“Like pain… boredom is unpleasant precisely so that we will act on it.”',
        ],
        [
          'In Martin Hale’s experiment, the volunteers who copied numbers',
          ['found the second task more difficult.', 'came up with more creative ideas.', 'spent longer on the second task.', 'were less willing to take part again.'],
          'B',
          'D4',
          'The bored volunteers “produced more ideas, and more original ones”.',
        ],
        [
          'What is the writer’s conclusion in paragraph G?',
          ['Boredom should be avoided whenever possible.', 'The benefits of boredom have been exaggerated.', 'Boredom has both costs and possible benefits.', 'More research on boredom is unlikely to be useful.'],
          'C',
          'G1 G2 G3',
          'The picture is “more complicated”: boredom is harmful in large doses but also carries “information, and perhaps opportunities”.',
        ],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Rachel Osei', 'Martin Hale', 'Ines Moreau', 'Yuki Tanaka'],
        [
          ['Lessons should show learners the relevance of what they are studying.', 'D', 'F4', 'Tanaka: help pupils “see why the material matters to them”.'],
          ['Some findings about boredom may be weaker than first thought.', 'C', 'E2', 'Moreau notes that effects “are often small” and some repeats “produced weaker results”.'],
          ['Letting the mind wander can lead to new combinations of ideas.', 'B', 'D5', 'Hale: daydreaming “allows unusual connections between ideas to form”.'],
          ['The real difficulty is that people ignore what boredom is telling them.', 'A', 'C4', 'Osei: the problem is “the ease with which we can silence the alarm without responding to it”.'],
        ],
      ),
      ynng([
        ['Boredom has generally been seen as a positive experience.', 'N', 'A1', '“Boredom has a bad reputation”: it is associated with wasted time and unproductive workers.'],
        ['People who are often bored may be more likely to behave dangerously.', 'Y', 'E4', 'Frequent boredom is linked to taking “risks such as dangerous driving”.'],
        ['Children today read fewer books than previous generations.', 'NG', 'F2', 'Some teachers worry about reading, but no comparison with earlier generations is made.'],
        ['Boredom is a common reason why students drop out of school.', 'Y', 'F3', 'Boredom is “one of the most common reasons given by students who leave school early”.'],
        ['Teachers should make every lesson as entertaining as possible.', 'N', 'F4', 'Tanaka argues “the answer is not to make lessons constantly entertaining”.'],
      ]),
    ],
  }),
])
