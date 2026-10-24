import { info, passage, short, test } from '../build'

export default test('skim-timekeeping', [
  passage({
    title: 'Keeping Time',
    sub: 'From shadows and water to atoms: a brief history of how people have measured the hours.',
    text: `
      A
      The oldest clocks used the sky.
      More than three thousand years ago, Egyptians divided the day into hours by watching the shadow cast by an upright stick or stone, a device later known as a sundial.
      At night, they tracked the hours by observing the rising of particular stars.
      Sundials were simple and reliable, but they were useless on cloudy days and at night, and the length of their hours changed with the seasons.

      B
      To solve these problems, people turned to water.
      A water clock, or clepsydra, measured time by the steady flow of water into or out of a container marked with lines.
      In ancient Athens, water clocks were used in courts of law to limit the length of speeches, and in China, an engineer named Su Song built an enormous water-driven astronomical clock tower in the year 1088, more than ten metres high.

      C
      Mechanical clocks, driven by falling weights, appeared in Europe towards the end of the thirteenth century.
      The earliest examples were large iron machines installed in church towers and town halls, and many of them had no faces at all; they simply rang a bell to mark the hours.
      Their accuracy was poor, and they could gain or lose a quarter of an hour in a day.

      D
      A major advance came in 1656, when the Dutch scientist Christiaan Huygens built the first pendulum clock.
      Because a pendulum swings at a very regular rate, his clock was accurate to within about a minute a day, and later improvements reduced the error to a few seconds.
      For the first time, it became worthwhile to add a minute hand to clock faces.

      E
      Measuring time at sea presented a much harder challenge.
      Sailors could find their latitude from the sun and stars, but to calculate their longitude, their position east or west, they needed to know the exact time at their home port.
      Pendulum clocks did not work on a rolling ship.
      In 1714, the British government offered a prize of up to £20,000 for a practical solution, and a self-taught carpenter, John Harrison, spent decades developing a series of sea clocks.
      His fourth design, a large pocket watch completed in 1759, lost only a few seconds on a voyage to Jamaica.

      F
      The spread of railways in the nineteenth century created a new problem.
      Each town kept its own local time based on the position of the sun, so that noon in Bristol came about ten minutes later than noon in London.
      Railway timetables made this confusion intolerable, and in 1847 most British railway companies adopted a single standard time.
      In 1884, an international conference in Washington chose the meridian passing through Greenwich, in London, as the starting point for the world’s time zones.

      G
      In the twentieth century, clocks became far more accurate than any natural rhythm.
      Quartz clocks, which use the vibrations of a tiny crystal, became common in the 1970s and are now found in almost every watch.
      Atomic clocks, first built in 1955, measure the vibrations of atoms and are so precise that the best modern versions would lose less than a second in the entire age of the universe.
      Since 1967, the second itself has been defined not by the turning of the Earth but by the behaviour of the caesium atom.
    `,
    groups: [
      info(
        [
          ['the reason a type of clock could not be used on ships', 'E', 'E3', '“Pendulum clocks did not work on a rolling ship.”'],
          ['a clock that told the time without showing it visually', 'C', 'C2', 'Many early mechanical clocks “had no faces at all; they simply rang a bell”.'],
          ['an official decision to use one time across a country’s transport network', 'F', 'F3', 'In 1847 most British railway companies “adopted a single standard time”.'],
          ['a method used to tell the time after dark', 'A', 'A3', 'At night, Egyptians “tracked the hours by observing the rising of particular stars”.'],
          ['the use of timekeeping to control speakers', 'B', 'B3', 'In Athens, water clocks “were used in courts of law to limit the length of speeches”.'],
          ['the addition of a new feature to clocks', 'D', 'D3', '“It became worthwhile to add a minute hand to clock faces.”'],
        ],
      ),
      short(
        2,
        [
          ['In which year did Su Song build his clock tower?', '1088', 'B3', 'Su Song built the tower “in the year 1088”.'],
          ['Who built the first pendulum clock?', 'Christiaan Huygens|Huygens', 'D1', '“The Dutch scientist Christiaan Huygens built the first pendulum clock.”'],
          ['What was John Harrison’s original trade?', 'carpenter|a carpenter', 'E4', 'Harrison was “a self-taught carpenter”.'],
          ['Where did Harrison’s fourth clock travel to on its test voyage?', 'Jamaica', 'E5', 'It “lost only a few seconds on a voyage to Jamaica”.'],
          ['In which city was the 1884 time conference held?', 'Washington', 'F4', '“An international conference in Washington chose the meridian passing through Greenwich.”'],
          ['Which atom is now used to define the second?', 'caesium|caesium atom', 'G4', 'The second is defined “by the behaviour of the caesium atom”.'],
        ],
        true,
      ),
    ],
  }),
])
