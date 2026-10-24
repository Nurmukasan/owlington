import { features, passage, test } from '../build'

export default test('features-play', [
  passage({
    title: 'Serious Play',
    sub: 'Why do young animals, and young humans, spend so much time doing things that seem to have no purpose?',
    text: `
      A
      Play is one of the most puzzling of all animal behaviours.
      Young goats leap into the air for no apparent reason, puppies chase one another in circles, and children spend hours building towers only to knock them down.
      All of this uses energy that could be spent on growing, and it can be dangerous: young seals, for example, are more likely to be caught by predators while playing.
      For a behaviour to survive despite such costs, biologists reason, it must bring some important benefit.

      B
      One of the oldest explanations is that play is practice for adult life.
      The psychologist Dr Helen Marsh, who has studied play in several mammal species, argues that kittens pouncing on a ball of wool are rehearsing the movements they will later need for hunting.
      She points out that the kinds of play an animal enjoys tend to match its adult way of life: predators play at chasing and pouncing, while animals that are usually hunted play at running and dodging.

      C
      Not everyone accepts this view.
      Professor Daniel Okoro notes that in experiments where young cats were prevented from playing, they still grew up to be perfectly competent hunters.
      In his opinion, the main value of play lies not in practising particular skills but in preparing animals for the unexpected.
      By deliberately putting themselves off balance, falling over and recovering, young animals learn to cope with sudden loss of control, and he believes this flexibility is what matters most when real emergencies occur.

      D
      Dr Lucia Ferrante, who studies social behaviour in primates, emphasises a different benefit.
      Play fighting, she observes, follows strict rules: stronger animals hold back their strength, and players regularly swap roles so that each has a turn at winning.
      Young monkeys that break these rules quickly find that others refuse to play with them.
      Ferrante argues that play teaches young animals how to cooperate, judge the intentions of others and maintain friendships, skills that are essential in species that live in groups.

      E
      Research on the brain offers further clues.
      Dr Samuel Price has found that in young rats, play is associated with the growth of connections in the front part of the brain, the region involved in planning and decision-making.
      Rats that were raised without playmates showed weaker development in this area and, as adults, reacted less appropriately to unfamiliar social situations.
      Price is cautious about applying these results to humans, but he suspects that play may shape the developing brain in many species.

      F
      In human children, play takes forms that no other animal can match, including make-believe games in which a stick becomes a horse or a cardboard box becomes a spaceship.
      Professor Anna Lindqvist, an expert in child development, believes that such pretend play helps children to separate ideas from objects, an ability that underlies later skills such as reading and abstract thinking.
      She is concerned that busy timetables of organised activities leave many modern children with too little time for free, unstructured play.

      G
      It is quite possible that all of these explanations are partly correct.
      Play may serve different purposes in different species, and even at different ages within the same animal.
      What seems clear is that a behaviour once dismissed as mere fun deserves to be taken seriously by scientists, parents and teachers alike.
    `,
    groups: [
      features(
        ['researcher', 'researchers'],
        ['Helen Marsh', 'Daniel Okoro', 'Lucia Ferrante', 'Samuel Price', 'Anna Lindqvist'],
        [
          ['Animals that are not allowed to play may still develop normal adult skills.', 'B', 'C2', 'Okoro notes that cats prevented from playing “still grew up to be perfectly competent hunters”.'],
          ['The type of play an animal prefers reflects how it will live as an adult.', 'A', 'B3', 'Marsh: “the kinds of play an animal enjoys tend to match its adult way of life”.'],
          ['Children today may not have enough opportunity for unorganised play.', 'E', 'F3', 'Lindqvist worries that busy timetables “leave many modern children with too little time for free, unstructured play”.'],
          ['Animals that do not follow the rules of play may be rejected by others.', 'C', 'D3', 'Ferrante: young monkeys that break the rules “find that others refuse to play with them”.'],
          ['Findings from animal studies should be applied to people with care.', 'D', 'E4', '“Price is cautious about applying these results to humans.”'],
          ['Play helps animals to deal with situations they cannot predict.', 'B', 'C3 C4', 'Okoro says play prepares animals “for the unexpected” and for “sudden loss of control”.'],
          ['Imaginative games may support the development of later academic abilities.', 'E', 'F2', 'Lindqvist believes pretend play underlies “later skills such as reading and abstract thinking”.'],
          ['A lack of play may affect the development of a particular part of the brain.', 'D', 'E3', 'Rats raised without playmates “showed weaker development in this area”.'],
          ['Play teaches young animals how to get along with others.', 'C', 'D4', 'Ferrante: play teaches young animals “how to cooperate, judge the intentions of others and maintain friendships”.'],
        ],
      ),
    ],
  }),
])
