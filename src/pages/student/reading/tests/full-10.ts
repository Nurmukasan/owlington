import { endings, features, info, mcq, notes, passage, short, test, tfng, ynng } from '../build'

export default test('full-10', [
  passage({
    title: 'Harvesting the Fog',
    sub: 'In some of the driest places on Earth, villagers collect their water from the clouds.',
    text: `
      A
      The coastal deserts of northern Chile are among the driest places on the planet.
      In some areas, years can pass without measurable rain.
      Yet on many mornings, a thick sea fog rolls in from the Pacific Ocean and settles over the hills, carrying with it a huge quantity of tiny water droplets.
      For centuries, this fog passed overhead without benefiting the people living below, until scientists began to look for ways of capturing it.

      B
      The idea was inspired partly by nature.
      Some plants and insects in coastal deserts survive by collecting moisture from fog: certain cacti and lichens absorb it directly, and a beetle living in the Namib Desert of south-western Africa stands with its back to the wind so that droplets gather on its shell and run down towards its mouth.
      If living things could gather water from fog, researchers reasoned, then so could carefully designed structures.

      C
      The technology that resulted is remarkably simple.
      A fog collector consists of a large rectangle of fine plastic mesh, typically several metres wide, stretched between two posts and positioned across the direction of the prevailing wind.
      As the fog blows through, droplets hit the threads of the mesh, join together and grow heavier until they run down into a gutter at the bottom.
      From there, the water flows through pipes into a storage tank.
      A well-placed collector can produce several litres of water per square metre of mesh on a foggy day.

      D
      One of the first large projects began in the early 1990s in a small fishing village in northern Chile, where dozens of collectors were built on a nearby ridge.
      For several years, the system supplied the village with drinking water and allowed residents to grow vegetables.
      However, the project eventually declined, partly because the community was not closely involved in maintaining the nets, and partly because a pipeline later brought water from elsewhere.
      Engineers learned an important lesson: the technology works only if local people are trained and willing to look after it.

      E
      Later projects took this lesson to heart.
      In south-western Morocco, a system built on the slopes of a mountain now supplies water to several villages, and local women, who previously spent hours each day carrying water from distant wells, were involved in planning it from the beginning.
      The project includes a text-messaging service that allows residents to report problems with the nets or pipes, so that repairs can be made quickly.

      F
      Fog collection has clear limitations.
      It works only where fog is frequent and dense, the wind is reliable and there are hills or mountains to catch the clouds.
      The amount of water varies greatly from season to season and from year to year, and strong winds can tear the mesh.
      For these reasons, fog water is usually used alongside other sources rather than replacing them completely.

      G
      Researchers continue to improve the design.
      New types of mesh, with threads of different shapes and coatings that help droplets to slide off more quickly, can collect considerably more water than the original nets.
      In places where suitable conditions exist, fog collectors offer a cheap source of clean water that requires no energy to operate.
    `,
    groups: [
      notes(
        'Fog collection',
        1,
        [
          '# Inspiration',
          '- a desert [[beetle]] collects droplets on its shell',
          '# How a collector works',
          '- plastic [[mesh]] stretched between two posts',
          '- placed across the direction of the [[wind]]',
          '- water runs into a [[gutter]], then pipes and a tank',
          '# Lessons from Chile and Morocco',
          '- local people must be [[trained]] to maintain the nets',
          '- in Morocco, a [[text-messaging]] service is used to report problems',
        ],
        [
          ['B2', 'A beetle in the Namib Desert lets droplets gather “on its shell”.'],
          ['C2', 'A collector is “a large rectangle of fine plastic mesh”.'],
          ['C2', 'It is “positioned across the direction of the prevailing wind”.'],
          ['C3', 'Droplets “run down into a gutter at the bottom”.'],
          ['D4', '“The technology works only if local people are trained and willing to look after it.”'],
          ['E3', 'A “text-messaging service… allows residents to report problems”. A hyphenated word counts as one word.'],
        ],
      ),
      tfng([
        ['It never rains in the coastal deserts of northern Chile.', 'F', 'A2', '“Years can pass without measurable rain” — rain is rare, not impossible.'],
        ['Some cacti in coastal deserts take in water from fog.', 'T', 'B2', '“Certain cacti and lichens absorb it directly.”'],
        ['Fog collectors are expensive to build.', 'NG', 'C2', 'The design is “remarkably simple”, but construction cost is not discussed. (G3 says the water is cheap, not the building.)'],
        ['The Chilean village project failed mainly because the nets were badly designed.', 'F', 'D3', 'It declined because the community was not involved in maintenance and a pipeline arrived — not because of design.'],
        ['Women in the Moroccan villages helped to plan the fog project.', 'T', 'E2', 'Local women “were involved in planning it from the beginning”.'],
        ['Fog collectors usually provide all of a community’s water.', 'F', 'F4', 'Fog water “is usually used alongside other sources rather than replacing them completely”.'],
        ['Newer types of mesh can gather more water than the original nets.', 'T', 'G2', 'They “can collect considerably more water than the original nets”.'],
      ]),
    ],
  }),

  passage({
    title: 'An Invisible Tide',
    sub: 'Tiny fragments of plastic have been found almost everywhere scientists have looked, including inside our own bodies.',
    text: `
      A
      Plastic does not disappear.
      Exposed to sunlight, waves and wear, it breaks into smaller and smaller pieces, and those smaller than five millimetres across are known as microplastics.
      Some are visible to the naked eye; others are so small that they can be detected only with powerful microscopes.
      Over the past two decades, researchers have found them in rivers, soils, ocean sediments and the air, from the deepest ocean trenches to the snow on remote mountains.

      B
      Microplastics come from two broad sources.
      Some are manufactured at a tiny size, such as the beads that were once added to face scrubs and toothpaste; several countries have now banned these from cosmetic products.
      Most, however, are created when larger items break down.
      Car tyres shed particles as they wear against the road, synthetic clothing releases fibres every time it is washed, and plastic bags and bottles gradually fragment in the environment.

      C
      Dr Hannah Clarke, who studies plastic pollution in rivers, believes that washing machines are one of the most underestimated sources.
      A single load of synthetic clothing, she points out, can release hundreds of thousands of fibres, many of which pass through water treatment plants and into rivers.
      She argues that filters fitted to washing machines could greatly reduce the problem, and several countries are considering making them compulsory.

      D
      Professor Luis Moreno has focused on the oceans.
      His team has found that microplastics are not distributed evenly but gather in particular areas, including the floor of the deep sea, where currents deposit them along with sediment.
      He warns that because so much of the material sinks, estimates based on samples from the ocean surface may greatly underestimate the total amount.

      E
      The greatest concern is the effect on living things.
      Microplastics have been found in the stomachs of fish, seabirds and whales, and in shellfish sold for human consumption.
      Dr Grace Owusu has shown that some small marine animals that eat microplastics grow more slowly and produce fewer young, possibly because the particles fill their stomachs without providing nutrition.
      She stresses, however, that most of her experiments used concentrations higher than those usually found in the sea.

      F
      Human exposure is now well established.
      Microplastics have been detected in drinking water, salt, honey and the air inside homes, and in recent years scientists have reported finding them in human blood and lungs.
      What this means for health is far less certain.
      Professor Ravi Menon, a toxicologist, cautions against alarm: there is as yet no clear evidence that the levels found in people cause disease, he says, but the question deserves urgent research, since some plastics contain chemicals known to be harmful in larger doses.

      G
      Because microplastics are so widespread and so difficult to remove from the environment, most experts agree that the only effective long-term solution is to reduce the amount of plastic that enters it in the first place.
      This will require changes in how products are designed, how waste is managed and, ultimately, how much plastic the world uses.
    `,
    groups: [
      info([
        ['a definition of microplastics according to size', 'A', 'A2', 'Pieces “smaller than five millimetres across are known as microplastics”.'],
        ['examples of everyday foods in which microplastics have been found', 'F', 'F2', 'They have been detected “in drinking water, salt, honey”.'],
        ['a reference to a type of product that some governments have banned', 'B', 'B2', 'Beads in cosmetics: “several countries have now banned these”.'],
        ['places where microplastics have been found far from human activity', 'A', 'A4', '“From the deepest ocean trenches to the snow on remote mountains.”'],
        ['a view about the most effective way to solve the problem', 'G', 'G1', 'The only effective solution “is to reduce the amount of plastic that enters it in the first place”.'],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Hannah Clarke', 'Luis Moreno', 'Grace Owusu', 'Ravi Menon'],
        [
          ['Some research used higher levels of microplastics than occur naturally.', 'C', 'E4', 'Owusu stresses her experiments “used concentrations higher than those usually found in the sea”.'],
          ['A simple device could reduce one source of microplastics.', 'A', 'C3', 'Clarke: “filters fitted to washing machines could greatly reduce the problem”.'],
          ['The total quantity of microplastics may be much larger than thought.', 'B', 'D3', 'Moreno: surface samples “may greatly underestimate the total amount”.'],
          ['People should not panic about the health effects of microplastics.', 'D', 'F4', 'Menon “cautions against alarm”.'],
        ],
      ),
      short(
        2,
        [
          ['What source of microplastics do vehicles produce as they wear?', 'tyres|car tyres', 'B4', '“Car tyres shed particles as they wear against the road.”'],
          ['Which part of the ocean collects large amounts of microplastics?', 'deep sea|floor', 'D2', 'Microplastics gather on “the floor of the deep sea”.'],
          ['Which seafood sold for people to eat contains microplastics?', 'shellfish', 'E2', 'They have been found “in shellfish sold for human consumption”.'],
          ['Apart from blood, in which part of the human body have microplastics been found?', 'lungs|the lungs', 'F2', 'They were found “in human blood and lungs”.'],
        ],
      ),
    ],
  }),

  passage({
    title: 'The Power of a Sugar Pill',
    sub: 'Treatments with no active ingredient can make people feel better. Researchers are still discovering why, and what to do about it.',
    text: `
      A
      In clinical trials of new medicines, some patients are given the real drug while others receive a placebo: a pill that looks identical but contains no active ingredient.
      Neither the patients nor the doctors know who has received which.
      The purpose is to separate the effect of the drug from everything else that happens when a person is treated, and the results are often striking.
      In trials of treatments for pain, depression and many other conditions, a substantial proportion of patients who take the placebo report real improvements.

      B
      For a long time, the placebo effect was regarded mainly as a nuisance, something to be subtracted from the results so that the true value of a drug could be measured.
      Increasingly, however, researchers are studying it in its own right.
      They have found that placebos can produce measurable changes in the body, particularly in the experience of pain, where they appear to trigger the release of the brain’s own pain-relieving chemicals.

      C
      The strength of the effect depends heavily on expectations, and some of the details are surprising.
      In one experiment, volunteers given a painkiller described as expensive reported greater relief than those told the same pill was cheap.
      Two placebo pills tend to work better than one, injections better than pills, and the colour of a tablet can also make a difference.
      The manner of the doctor matters too: patients who are treated warmly and given time to explain their symptoms tend to show larger improvements than those treated briskly.

      D
      Perhaps the most puzzling finding is that placebos can work even when patients know they are taking them.
      In several studies of patients with long-term conditions such as back pain and digestive disorders, people were openly given ‘sugar pills’ and told that, although these contained no medicine, placebos had been shown to help some patients.
      Many reported significant improvements compared with patients who received no pills at all.
      Researchers are not sure why this happens, but one suggestion is that the ritual of taking a pill regularly, combined with the hope of improvement, is itself beneficial.

      E
      The placebo effect also has a dark twin, known as the nocebo effect.
      Patients who are warned about possible side effects of a treatment are more likely to experience them, even if they are actually taking a placebo.
      In some trials, a considerable number of patients in the placebo group stopped taking their pills because of side effects that could not have been caused by any drug.
      Doctors therefore face a difficult balance between informing patients honestly and avoiding suggestions that might make them feel worse.

      F
      It is important not to exaggerate what placebos can do.
      They may relieve symptoms such as pain, tiredness and nausea, but there is little evidence that they can shrink tumours, cure infections or repair damaged tissue.
      A patient who feels better is not necessarily a patient who is better, and relying on placebos instead of effective treatment could be dangerous.

      G
      Nevertheless, I believe the research has an important message for medicine.
      If expectations, trust and attention can influence how patients feel, then the human side of medical care is not a pleasant extra but part of the treatment itself.
      In health systems under pressure to see patients as quickly as possible, that is a lesson worth remembering.
    `,
    groups: [
      mcq([
        [
          'What is the main purpose of using placebos in clinical trials?',
          ['to reduce the cost of testing new drugs', 'to identify the effect of the drug itself', 'to protect patients from side effects', 'to test the honesty of doctors'],
          'B',
          'A3',
          'The purpose “is to separate the effect of the drug from everything else that happens when a person is treated”.',
        ],
        [
          'According to paragraph B, how have researchers’ attitudes to the placebo effect changed?',
          ['They now study it as a subject of interest.', 'They now believe it is too small to matter.', 'They now try to avoid it completely.', 'They now think it only affects pain.'],
          'A',
          'B1 B2',
          'Once “a nuisance”, it is now increasingly studied “in its own right”.',
        ],
        [
          'Which of the following increases the placebo effect, according to paragraph C?',
          ['being told a pill is cheap', 'taking one pill instead of two', 'a friendly doctor who listens', 'a short appointment'],
          'C',
          'C4',
          'Patients “treated warmly and given time to explain their symptoms” improve more.',
        ],
        [
          'What does the writer say about open-label placebos in paragraph D?',
          ['They only work for patients who do not understand them.', 'Their effect has been clearly explained.', 'They helped many patients despite being openly described.', 'They were less effective than no treatment at all.'],
          'C',
          'D2 D3',
          'Patients were told the pills had no medicine, yet “many reported significant improvements”. Researchers are “not sure why”, so B is wrong.',
        ],
      ]),
      endings(
        [
          'because it may cause patients to experience side effects.',
          'because they activate the brain’s own pain relief.',
          'because it is part of the treatment process.',
          'because they cannot cure the underlying illness.',
          'because the pills contained a small amount of medicine.',
          'because they expected it to be more effective.',
          'because it was given as an injection.',
        ],
        [
          ['Placebos can reduce pain', 'B', 'B3', 'They “appear to trigger the release of the brain’s own pain-relieving chemicals”.'],
          ['Volunteers felt more relief from a pill described as expensive', 'F', 'C1 C2', '“The strength of the effect depends heavily on expectations.”'],
          ['Warning patients about a treatment can be harmful', 'A', 'E2', 'Warned patients “are more likely to experience them [side effects], even if they are actually taking a placebo”.'],
          ['Relying on placebos could be risky', 'D', 'F2 F3', 'There is little evidence they “cure infections or repair damaged tissue”.'],
          ['The writer believes the personal side of medicine matters', 'C', 'G2', 'It is “not a pleasant extra but part of the treatment itself”.'],
        ],
      ),
      ynng([
        ['In clinical trials, doctors know which patients receive the placebo.', 'N', 'A2', '“Neither the patients nor the doctors know who has received which.”'],
        ['Injections tend to produce a stronger placebo effect than pills.', 'Y', 'C3', '“Injections better than pills.”'],
        ['Open-label placebos work better than hidden ones.', 'NG', 'D3', 'Open-label pills are compared only with no pills, not with hidden placebos.'],
        ['Some patients in placebo groups stop treatment because of side effects.', 'Y', 'E3', 'Patients in the placebo group “stopped taking their pills because of side effects”.'],
        ['Health systems are giving doctors more time with each patient.', 'NG', 'G3', 'Health systems are under pressure to see patients quickly; no change is reported.'],
      ]),
    ],
  }),
])
