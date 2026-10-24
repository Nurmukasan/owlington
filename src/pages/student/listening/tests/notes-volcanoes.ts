import { limit, notes, part, person, test } from '../build'

const prof = person('prof', 'Dr Hamid', 'Lecturer', 'm', 'en-GB', '1P9lzrAhggxzcHA9jcDZ')

export default test('notes-volcanoes', [
  part({
    n: 4,
    title: 'Living with volcanoes',
    intro: 'You will hear a lecture about why people live near volcanoes and how eruptions are predicted.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: Around eight hundred million people live within a hundred kilometres of an active volcano. Today I want to ask why, and how scientists try to keep them safe.
          prof: The main attraction is the soil. Volcanic ash breaks down into soil that's extremely fertile, which is why some of the most productive farmland in the world is found on the slopes of volcanoes. In parts of Indonesia, farmers can grow three crops of rice a year.
          prof: Volcanoes also provide energy. In Iceland, almost all homes are heated using hot water from underground, and a large share of the country's electricity comes from geothermal power stations.
          prof: Tourism is another factor. Visitors come to see lava, hot springs and dramatic landscapes, and in some places this is the main source of jobs.
          prof: So how do scientists predict eruptions? There are several warning signs. The most important is earthquakes. As magma rises, it breaks the rock around it, causing many small earthquakes, sometimes hundreds a day.
          prof: Second, the ground itself changes shape. As magma collects underground, the surface of the volcano can rise, like a balloon being blown up. Satellites can now measure movements of just a few millimetres.
          prof: Third, scientists measure gases. An increase in sulphur dioxide often means that fresh magma is getting close to the surface. Some volcanoes are now monitored by drones that fly through the gas clouds.
          prof: Even so, prediction isn't perfect. Scientists can usually say that an eruption is likely, but not exactly when it will happen or how big it will be. This creates a difficult problem for authorities. If they order people to leave and nothing happens, people may ignore the next warning.
          prof: The deadliest danger is often not lava, which usually moves slowly enough for people to escape. It's fast-moving clouds of hot gas and rock, called pyroclastic flows, which can travel at over a hundred kilometres an hour.
          prof: Education is crucial. In Japan, children practise evacuation drills at school, in the same way that children elsewhere practise fire drills.
        `,
        groups: [
          notes(
            'Living with volcanoes',
            limit(1, true),
            [
              '# Why people live near volcanoes',
              '- volcanic ash produces very [[fertile]] soil',
              '- some Indonesian farmers grow [[3|three]] rice crops a year',
              '- in Iceland, most homes are [[heated]] with underground hot water',
              '- tourism provides [[jobs]] in some areas',
              '# Warning signs',
              '- many small [[earthquakes]] as magma rises',
              '- the ground rises like a [[balloon]]',
              '- satellites measure movements of a few [[millimetres|millimeters]]',
              '- more sulphur dioxide; gas clouds monitored by [[drones]]',
              '# Dangers and safety',
              '- pyroclastic flows: clouds of hot gas and [[rock]]',
              '- Japanese children practise evacuation [[drills]]',
            ],
            [
              ["soil that's extremely fertile", 'Volcanic ash breaks down into fertile soil.'],
              ['farmers can grow three crops of rice a year', 'In parts of Indonesia.'],
              ['almost all homes are heated using hot water from underground', 'Geothermal energy in Iceland.'],
              ['this is the main source of jobs', 'In some places, tourism.'],
              ['causing many small earthquakes', 'The most important warning sign.'],
              ['like a balloon being blown up', 'Magma collecting underground.'],
              ['movements of just a few millimetres', 'Satellites measure them.'],
              ['monitored by drones that fly through the gas clouds', 'Gas increases suggest rising magma.'],
              ['clouds of hot gas and rock', 'They can travel at over 100 km/h.'],
              ['children practise evacuation drills at school', 'Like fire drills elsewhere.'],
            ],
          ),
        ],
      },
    ],
    traps: [
      ['Around eight hundred million people', 31, 'Not a question.'],
      ['which usually moves slowly enough for people to escape', 39, 'Lava is not the deadliest danger.'],
    ],
  }),
])
