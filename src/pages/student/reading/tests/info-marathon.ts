import { info, passage, test } from '../build'

export default test('info-marathon', [
  passage({
    title: 'Forty-Two Kilometres',
    sub: 'The marathon claims to be an ancient race. Its real history is stranger, and much more recent.',
    text: `
      A
      Every year, more than a million people around the world complete a marathon, and many of them have heard the story behind the race.
      In 490 BCE, it is said, a Greek messenger ran from the battlefield at Marathon to Athens to announce victory over the Persian army, delivered his news and immediately collapsed and died.
      The modern race, according to this account, simply recreates his heroic run.

      B
      Historians are far less certain.
      The earliest detailed account of the battle, written by the Greek historian Herodotus within a few decades of it, describes a runner called Pheidippides, but his famous journey was from Athens to Sparta, a distance of around 240 kilometres, to ask for military help before the fighting began.
      The tale of a messenger dying in Athens after announcing the victory appears only in writers who lived several centuries later, and many scholars suspect that the two stories became mixed together over time.

      C
      Whatever its origins, the story inspired the organisers of the first modern Olympic Games, held in Athens in 1896.
      A French scholar, Michel Bréal, suggested that a long-distance race from Marathon to the Olympic stadium would link the new Games with the glories of ancient Greece, and he offered a silver cup to the winner.
      The race, run over roughly forty kilometres of dusty roads, became the most celebrated event of the Games when it was won by Spyridon Louis, a Greek water carrier, in a little under three hours.

      D
      For the next few years the distance varied from race to race.
      The figure now used, 42.195 kilometres, comes from the London Olympics of 1908, when the course was planned to start at Windsor Castle and finish in front of the royal box in the new stadium.
      This particular length was not formally adopted as the official distance until 1921, and even today runners sometimes joke that the final 195 metres exist only for the convenience of a king.

      E
      Marathon running spread quickly beyond the Olympics.
      The Boston Marathon, first held in 1897, is the oldest annual marathon in the world, and city races in New York, London, Berlin and elsewhere now attract tens of thousands of entrants each year.
      Unlike most sports, these events allow ordinary amateurs to compete on the same course, on the same day, as the world’s best professional athletes.

      F
      For much of the twentieth century, however, women were excluded.
      Officials claimed that the distance was dangerous for women’s health, a belief for which there was no scientific evidence.
      In 1967, a runner named Kathrine Switzer entered the Boston race using only her initials, and an official famously tried to pull her off the course when he realised she was a woman.
      Photographs of the incident were published around the world, and the women’s marathon was finally added to the Olympic programme in 1984.

      G
      Performance has improved dramatically.
      The winning time in 1896 would not be good enough today to qualify for many amateur races, and the fastest men now run the distance in a little over two hours.
      In 2019, the Kenyan runner Eliud Kipchoge became the first person to run a marathon in under two hours, although his time was not accepted as an official record because it was achieved in a specially organised event with teams of pacemakers.
      Scientists continue to debate how much faster humans can go, and how much of the recent improvement is due to new shoe technology rather than to the athletes themselves.
    `,
    groups: [
      info(
        [
          ['the reason why one achievement was not officially recognised', 'G', 'G3', 'Kipchoge’s sub-two-hour time “was not accepted as an official record because it was achieved in a specially organised event with teams of pacemakers”.'],
          ['a reference to a prize offered for the first modern marathon', 'C', 'C2', 'Bréal “offered a silver cup to the winner”.'],
          ['an explanation of how the modern distance was chosen', 'D', 'D2', 'The distance “comes from the London Olympics of 1908”, from Windsor Castle to the royal box.'],
          ['a claim that two separate stories may have been combined', 'B', 'B3', 'Scholars suspect “that the two stories became mixed together over time”.'],
          ['an unsupported argument used to exclude a group of runners', 'F', 'F2', 'Officials claimed the distance was dangerous for women, “a belief for which there was no scientific evidence”.'],
          ['a feature that makes marathons different from most other sports', 'E', 'E3', '“Unlike most sports, these events allow ordinary amateurs to compete on the same course… as the world’s best professional athletes.”'],
          ['the occupation of a famous winner', 'C', 'C3', 'Spyridon Louis was “a Greek water carrier”.'],
          ['a possible non-human cause of faster times', 'G', 'G4', 'Scientists debate how much improvement “is due to new shoe technology rather than to the athletes themselves”.'],
          ['the popular version of the legend behind the race', 'A', 'A2', 'Paragraph A tells the story of the messenger who ran to Athens, announced victory and died.'],
          ['an event that received attention in many countries', 'F', 'F4', '“Photographs of the incident were published around the world.”'],
        ],
        true,
      ),
    ],
  }),
])
