import { choose2, features, headings, mcq, notes, passage, sentences, test, tfng, ynng } from '../build'

export default test('full-07', [
  passage({
    title: 'White Gold',
    sub: 'Salt is now so cheap that we hardly notice it. For most of history, it was worth fighting for.',
    text: `
      A
      Every human being needs salt to survive.
      The body uses it to control the balance of fluids, to carry signals along the nerves and to make muscles contract, and because we lose salt constantly in sweat, it must be replaced in our diet.
      Early hunters obtained much of what they needed from the meat they ate, but once people began to live mainly on cereals, they had to find additional sources.
      From that point on, the search for salt shaped trade routes, the location of towns and the policies of governments.

      B
      Salt also had a second, equally important use: it preserves food.
      Before the invention of refrigeration, salting was one of the few ways of keeping meat and fish edible for months, which made it possible to survive the winter and to supply armies and ships on long journeys.
      Whole industries depended on it; the fishing fleets of northern Europe, for example, needed enormous quantities of salt to preserve the herring and cod they caught.

      C
      Producing salt was often difficult.
      In warm, dry coastal areas, seawater could be let into shallow ponds, where the sun gradually evaporated the water and left a layer of salt behind.
      In cooler climates, salt water had to be boiled over fires, which required large amounts of fuel.
      Elsewhere, salt was dug from underground deposits left by ancient seas.
      One of the most famous mines, at Wieliczka in southern Poland, was worked for more than seven centuries, and its miners carved entire chapels, complete with statues and chandeliers, out of the rock salt.

      D
      Because salt was both essential and limited in supply, it was an ideal target for taxation.
      In China, the government took control of salt production more than two thousand years ago, and the income from salt remained one of the state’s main sources of revenue for centuries.
      In France, a salt tax called the gabelle was so unpopular that it became one of the grievances behind the French Revolution, and it was abolished in 1790.
      People who tried to avoid such taxes by smuggling salt risked severe punishments.

      E
      Salt has also given its name to roads, towns and words.
      One of the oldest roads in Italy, which led into Rome, was known as the Salt Road because salt from the coast was carried along it.
      It is often claimed that the English word ‘salary’ comes from payments of salt made to Roman soldiers, although many historians now doubt this story, and the exact origin of the word remains uncertain.

      F
      In the twentieth century, salt became a symbol of political resistance.
      In 1930, India was ruled by Britain, and the British government held a monopoly on salt, which made it illegal for Indians to produce or sell salt themselves.
      Mahatma Gandhi led a march of around 390 kilometres to the coast, where he picked up a handful of natural salt in deliberate defiance of the law.
      The march attracted worldwide attention, and tens of thousands of people were arrested for following his example.

      G
      Today, modern mining and transport have made salt abundant and cheap, and most of the salt produced is used not in food but in industry, to make chemicals, or to clear ice from roads in winter.
      Health authorities now warn that many people eat far more salt than they need, mostly from processed foods, increasing the risk of high blood pressure.
      For a substance that was once worth fighting over, it is a remarkable change of fortune.
    `,
    groups: [
      notes(
        'Salt in history',
        1,
        [
          '# Uses',
          '- needed by the body to control fluids, nerves and [[muscles]]',
          '- used to preserve meat and [[fish]] before refrigeration',
          '# Production',
          '- coastal ponds: water evaporated by the [[sun]]',
          '- cooler regions: salt water boiled, which needed a lot of [[fuel]]',
          '- Wieliczka miners carved [[chapels]] from the salt',
          '# Taxes',
          '- the French salt tax ended in [[1790]]',
          '- people caught [[smuggling]] salt were severely punished',
        ],
        [
          ['A2', 'Salt is used “to make muscles contract”.'],
          ['B2', 'Salting kept “meat and fish edible for months”.'],
          ['C2', '“The sun gradually evaporated the water and left a layer of salt behind.”'],
          ['C3', 'Boiling salt water “required large amounts of fuel”.'],
          ['C5', 'Miners “carved entire chapels… out of the rock salt”.'],
          ['D3', 'The gabelle “was abolished in 1790”.'],
          ['D4', 'People who avoided taxes “by smuggling salt risked severe punishments”.'],
        ],
        { number: true },
      ),
      tfng([
        ['Early hunters had to add salt to their food.', 'F', 'A3', 'They “obtained much of what they needed from the meat they ate”. It was cereal-eaters who needed extra sources.'],
        ['Northern European fishing fleets used large amounts of salt.', 'T', 'B3', 'They “needed enormous quantities of salt”.'],
        ['The Wieliczka mine is still producing salt today.', 'NG', 'C5', 'It “was worked for more than seven centuries”, but we are not told whether it still operates.'],
        ['Historians agree that the word ‘salary’ comes from Roman salt payments.', 'F', 'E3', '“Many historians now doubt this story.”'],
        ['Under British rule, Indians were not allowed to make their own salt.', 'T', 'F2', 'The monopoly “made it illegal for Indians to produce or sell salt themselves”.'],
        ['Most salt produced today is used in food.', 'F', 'G1', '“Most of the salt produced is used not in food but in industry.”'],
      ]),
    ],
  }),

  passage({
    title: 'The Return of the Bogs',
    sub: 'Wet, spongy and long regarded as useless, peatlands turn out to be among the most valuable landscapes on Earth.',
    text: `
      A
      For centuries, bogs and other peatlands were seen as wasteland.
      Too wet to farm and difficult to cross, they were drained wherever possible, planted with trees or cut for fuel.
      In many countries, dried peat was burned in homes and power stations, and it is still sold to gardeners as compost.
      Only in recent decades have scientists come to appreciate how important these landscapes are, and how much damage has been done to them.

      B
      Peat forms where plants die in waterlogged ground.
      Because there is little oxygen in the water, the dead plants do not fully decompose, and over thousands of years they build up into a thick layer of brown, spongy material.
      In many northern bogs, the main peat-forming plants are sphagnum mosses, which can hold many times their own weight in water and make their surroundings acidic, further slowing decay.
      A bog may grow by only a millimetre a year, so a peat layer several metres deep can represent many thousands of years of growth.

      C
      This slow accumulation makes peatlands extraordinary stores of carbon.
      Although they cover only about three per cent of the world’s land surface, they are estimated to hold more carbon than all the world’s forests combined.
      As long as the peat stays wet, that carbon remains locked away.
      When peatlands are drained, however, oxygen reaches the peat, which begins to decompose and release carbon dioxide into the atmosphere.
      Damaged peatlands are now thought to produce several per cent of all greenhouse gas emissions caused by human activity.

      D
      Drained peat is also vulnerable to fire.
      In 2015, fires on drained peatlands in Indonesia burned for months, covering large parts of South-East Asia in thick smoke and releasing more carbon in a few weeks than some industrialised countries emit in a year.
      Unlike forest fires, peat fires can smoulder underground for long periods, making them extremely difficult to put out.

      E
      Restoration usually begins with water.
      Drainage ditches are blocked with dams made of peat, wood or plastic sheets, so that the water level rises again.
      Where the surface has been left bare, it may be covered with a layer of cut vegetation to protect it, and small pieces of sphagnum moss are spread across it to encourage new growth.
      In some places, conifer plantations that were planted on drained bogs in the twentieth century have been felled so that the land can become wet again.

      F
      Researchers disagree about how quickly restored peatlands recover.
      Dr Fiona Grant, who has monitored restoration projects in Scotland for fifteen years, reports that water levels can recover within a few years, and that bog plants often return soon afterwards.
      Professor Henrik Dahl is more cautious: in his view, while a restored bog quickly stops losing carbon, it may take decades before it begins to store significant amounts again.
      Dr Amina Yusuf points out that restored bogs can release methane, another greenhouse gas, during their first years, although she believes the long-term benefits clearly outweigh this.
      Dr Owen Price, a hydrologist, emphasises a different benefit, noting that healthy bogs act like sponges, holding back rainwater and reducing flooding in the valleys below.

      G
      Several governments now fund peatland restoration as part of their climate policies, and some have banned the sale of peat compost to gardeners.
      In 2024, a vast area of blanket bog in the far north of Scotland, known as the Flow Country, became the first peatland to be listed as a World Heritage Site.
      For landscapes that were once dismissed as worthless, it is a striking change in status.
    `,
    groups: [
      headings(
        [
          'How a peatland is built up over time',
          'A landscape that was undervalued',
          'Disagreement about the speed of recovery',
          'The cost of buying peat compost',
          'Getting the water back',
          'Hidden carbon and what happens when it escapes',
          'A danger that burns below the surface',
        ],
        [
          ['A', 'ii', 'A1 A4', 'Peatlands “were seen as wasteland”; only recently have scientists appreciated their importance.'],
          ['B', 'i', 'B1 B2', 'Peat forms as dead plants build up “over thousands of years”.'],
          ['C', 'vi', 'C2 C4', 'Peatlands store more carbon than all forests, and draining them releases it.'],
          ['D', 'vii', 'D1 D3', 'Drained peat is vulnerable to fire, and peat fires “smoulder underground for long periods”.'],
          ['E', 'v', 'E1 E2', '“Restoration usually begins with water”: ditches are blocked so the water level rises.'],
        ],
      ),
      features(
        ['researcher', 'researchers'],
        ['Fiona Grant', 'Henrik Dahl', 'Amina Yusuf', 'Owen Price'],
        [
          ['Restored bogs may give off a harmful gas at first.', 'C', 'F4', 'Yusuf: restored bogs “can release methane… during their first years”.'],
          ['Peatlands can protect lower areas from floods.', 'D', 'F5', 'Price: bogs hold back rainwater, “reducing flooding in the valleys below”.'],
          ['Bog vegetation can come back fairly quickly.', 'A', 'F2', 'Grant: “bog plants often return soon afterwards”.'],
          ['A restored bog may take a long time to become a major carbon store.', 'B', 'F3', 'Dahl: “it may take decades before it begins to store significant amounts again”.'],
        ],
      ),
      sentences(1, [
        ['In northern bogs, [[sphagnum]] mosses are the main plants that form peat.', 'B3', '“The main peat-forming plants are sphagnum mosses.”'],
        ['Peat does not fully decompose because the water contains little [[oxygen]].', 'B2', '“Because there is little oxygen in the water, the dead plants do not fully decompose.”'],
        ['In 2015, smoke from peat fires in [[Indonesia]] spread across South-East Asia.', 'D2', '“Fires on drained peatlands in Indonesia burned for months.”'],
        ['On some restored bogs, [[conifer]] plantations have been cut down.', 'E4', '“Conifer plantations that were planted on drained bogs… have been felled.”'],
      ]),
    ],
  }),

  passage({
    title: 'When to Trust Your Gut',
    sub: 'Experts often make excellent decisions in an instant, without being able to explain how. But intuition can also be dangerously wrong.',
    text: `
      A
      A senior firefighter leads his team into a burning house to tackle what appears to be an ordinary kitchen fire.
      They spray water on the flames, but the fire does not die down as expected, and the room feels unusually hot and quiet.
      Without being able to say why, the commander orders everyone out.
      Moments later, the floor on which they had been standing collapses: the main fire had been burning in the basement beneath them.
      Asked afterwards how he knew, the commander credited a ‘sixth sense’.

      B
      Researchers who have studied such cases do not believe in a sixth sense, but they do take expert intuition seriously.
      Their explanation is that experienced professionals have stored a vast number of patterns from previous situations.
      When a new situation matches one of these patterns, or fails to match in a significant way, the expert recognises it immediately, without conscious reasoning.
      In the firefighter’s case, the heat and the silence did not fit his experience of kitchen fires, and that mismatch was enough to trigger alarm, even though he could not identify it at the time.

      C
      Some of the clearest evidence for this view comes from chess.
      In classic experiments, players were shown a position from a real game for a few seconds and then asked to reconstruct it on an empty board.
      Masters could place almost every piece correctly, while beginners remembered only a handful.
      When the pieces were arranged randomly, however, the masters’ advantage almost disappeared.
      Their skill lay not in a superior memory but in recognising meaningful groups of pieces, patterns built up over years of study.

      D
      Yet intuition is not always reliable.
      Studies of professionals who make forecasts about complex matters, such as long-term political events or the future price of shares, have found that their confident predictions are often barely more accurate than chance.
      Many of these experts feel just as certain as the firefighter or the chess master, but their feeling of confidence is not a sign that they are right.

      E
      What separates trustworthy intuition from the unreliable kind?
      Researchers from two schools of thought, one sceptical of expert judgement and one sympathetic to it, have reached broad agreement on two conditions.
      First, the environment must be regular enough to contain patterns that can be learned: fires, chess positions and medical symptoms follow consistent rules, whereas the stock market and world politics are influenced by countless unpredictable factors.
      Second, the expert must have had plenty of practice with rapid, clear feedback, so that they learn which judgements were correct.
      A firefighter quickly discovers whether a decision was right; a long-term forecaster may never find out.

      F
      These conditions have practical implications.
      In fields where they are met, it may be wise to give experienced professionals the freedom to act on their instincts, especially in emergencies where there is no time for analysis.
      In fields where they are not, decisions are likely to be improved by simple rules, checklists and statistical methods, which have been shown to outperform expert judgement in areas ranging from predicting the success of students to assessing the risk of loans.

      G
      The most difficult step may be recognising which kind of situation one is in.
      Experts rarely feel that their intuitions are unreliable, and confidence alone is no guide.
      I believe a better question to ask is not ‘How sure am I?’ but ‘Have I had the chance to learn this?’
    `,
    groups: [
      mcq([
        [
          'Why did the fire commander order his team out of the house?',
          ['He saw that the floor was about to collapse.', 'He knew the fire was in the basement.', 'Something about the situation felt wrong to him.', 'His team had run out of water.'],
          'C',
          'A2 A3',
          'The fire behaved unexpectedly and he acted “without being able to say why”. He did not know about the basement (B4).',
        ],
        [
          'According to researchers, expert intuition depends on',
          ['an unusual ability that some people are born with.', 'recognising patterns from earlier experience.', 'careful step-by-step reasoning.', 'a better memory than other people.'],
          'B',
          'B2 B3',
          'Experts “have stored a vast number of patterns from previous situations”. The chess studies (C5) rule out D.',
        ],
        [
          'What did the chess experiments show when the pieces were placed randomly?',
          ['Beginners performed better than masters.', 'Masters still remembered most pieces.', 'Masters performed little better than beginners.', 'Both groups remembered more pieces.'],
          'C',
          'C4',
          '“The masters’ advantage almost disappeared.”',
        ],
        [
          'What does the writer say about experts who make long-term forecasts?',
          ['They are usually less confident than other experts.', 'Their predictions are often not much better than guesses.', 'They rely on simple rules and checklists.', 'They receive feedback very quickly.'],
          'B',
          'D2',
          'Their predictions “are often barely more accurate than chance”.',
        ],
        [
          'The writer’s advice in paragraph G is that experts should',
          ['trust their feelings in an emergency.', 'measure their confidence more carefully.', 'consider whether they have had the opportunity to learn.', 'use statistical methods for every decision.'],
          'C',
          'G3',
          'The better question is “Have I had the chance to learn this?”',
        ],
      ]),
      choose2(
        'Which TWO conditions are needed for intuition to be trustworthy, according to paragraph E?',
        [
          'The expert must be able to explain their decisions.',
          'The situation must follow consistent patterns.',
          'The expert must work as part of a team.',
          'The expert must have received quick, clear feedback.',
          'The decision must be made in an emergency.',
        ],
        ['B', 'D'],
        [
          ['E3', '“The environment must be regular enough to contain patterns that can be learned.”'],
          ['E4', '“The expert must have had plenty of practice with rapid, clear feedback.”'],
        ],
      ),
      choose2(
        'Which TWO areas are given as examples where statistical methods have done better than experts?',
        ['medical diagnosis', 'predicting how well students will do', 'fighting fires', 'judging the risk of lending money', 'playing chess'],
        ['B', 'D'],
        [
          ['F2', 'Statistical methods outperform experts in “predicting the success of students”.'],
          ['F2', '…and in “assessing the risk of loans”: lending money.'],
        ],
      ),
      ynng([
        ['Firefighters really do have a sixth sense.', 'N', 'B1', 'Researchers “do not believe in a sixth sense”, and the writer presents their explanation without disagreeing.'],
        ['Chess masters have better memories than other people in general.', 'N', 'C5', 'Their skill lay “not in a superior memory but in recognising meaningful groups of pieces”.'],
        ['Feeling confident about a prediction does not mean it is correct.', 'Y', 'D3', '“Their feeling of confidence is not a sign that they are right.”'],
        ['Medical symptoms are too unpredictable for doctors to develop reliable intuition.', 'N', 'E3', 'Medical symptoms are listed among things that “follow consistent rules”.'],
        ['Checklists have been widely introduced in hospitals.', 'NG', 'F2', 'Checklists are recommended in general, but hospitals are not mentioned.'],
      ]),
    ],
  }),
])
