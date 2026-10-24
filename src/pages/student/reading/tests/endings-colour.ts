import { endings, passage, test } from '../build'

export default test('endings-colour', [
  passage({
    title: 'Seeing Red',
    sub: 'Can the colours around us really change how we think and feel? The evidence is more colourful than conclusive.',
    text: `
      A
      Claims about the power of colour are everywhere.
      Restaurants are said to use red to stimulate appetite, hospitals to choose green because it calms patients, and sports teams to wear red because it intimidates opponents.
      Interior designers, marketing consultants and self-help authors confidently explain how different colours affect mood, concentration and even honesty.
      Yet scientists who study colour psychology often sound far less certain than the people who apply it.

      B
      Part of the difficulty is that colour is rarely experienced on its own.
      A red sports car, a red warning sign and a red rose all carry very different associations, and the meaning a person attaches to a colour depends heavily on the context in which it appears.
      A colour that seems exciting on a dress may feel alarming on a medicine bottle.
      For this reason, many researchers argue that it makes little sense to ask what a colour does in general, only what it does in a particular situation.

      C
      Some of the best-known findings concern red.
      In a series of experiments, students who saw a red cover on a test booklet, or a red number on the page, performed slightly worse on intelligence-style questions than those who saw green or grey.
      The researchers suggested that because red is associated with mistakes and danger, particularly in education, where teachers mark errors in red ink, it may trigger a mild sense of threat that interferes with concentration.
      Other studies found that athletes in combat sports who were randomly assigned red clothing won slightly more often than those in blue.

      D
      More recently, however, several attempts to repeat these experiments with larger groups of participants have failed to find the same effects.
      This is part of a wider problem in psychology, where many striking results from small studies have turned out to be weaker than first reported, or not to exist at all.
      Colour researchers now place greater emphasis on large samples and on publishing their methods in advance, so that the results cannot be adjusted after the data have been collected.

      E
      Cultural differences add another layer of complexity.
      In much of Europe and North America, white is associated with weddings and purity, while in parts of East Asia it has traditionally been the colour of mourning.
      Red represents luck and celebration in China but can signal danger or debt elsewhere.
      Surveys do show one remarkably consistent pattern, however: when people in many different countries are asked to name their favourite colour, blue is chosen more often than any other.

      F
      Some practical applications have been tested directly.
      In the 1980s, a shade of bright pink was widely promoted as a way of calming aggressive prisoners, and some prisons painted cells in the colour.
      Later, more careful studies found no lasting effect on behaviour, and the idea has largely been abandoned.
      Research on lighting has been more productive: exposure to blue-rich light in the evening, such as the light from screens, appears to delay the body’s preparation for sleep, a finding that has influenced the design of phones and computers.

      G
      None of this means that colour is unimportant.
      It clearly affects how easily we can read a sign, find an object or recognise a warning, and people undoubtedly have strong personal preferences.
      What seems less certain is the idea that a particular colour can reliably change how well we think or how we behave.
    `,
    groups: [
      endings(
        [
          'because it is linked with mistakes in many schools.',
          'because their meaning depends on where they are seen.',
          'because the original studies were too small.',
          'because people in many countries say they prefer it.',
          'because it is used for mourning in some cultures.',
          'because later research found it had no lasting effect.',
          'because it influences the body’s readiness for sleep.',
          'because it makes food look more attractive.',
        ],
        [
          ['Many researchers believe it is pointless to discuss the effects of colours in general', 'B', 'B2 B4', 'The meaning of a colour “depends heavily on the context in which it appears”, so researchers ask only what it does in a particular situation.'],
          ['Red may reduce test performance', 'A', 'C3', 'Red is “associated with mistakes and danger, particularly in education, where teachers mark errors in red ink”.'],
          ['Some well-known results about colour may be unreliable', 'C', 'D1 D2', 'Repeats with larger groups failed, part of a wider problem where “striking results from small studies have turned out to be weaker”.'],
          ['Blue stands out in international surveys', 'D', 'E4', 'Blue “is chosen more often than any other” favourite colour.'],
          ['Pink prison cells have largely gone out of use', 'F', 'F3', '“More careful studies found no lasting effect on behaviour, and the idea has largely been abandoned.”'],
          ['Evening light from screens has affected technology design', 'G', 'F4', 'Blue-rich light “appears to delay the body’s preparation for sleep, a finding that has influenced the design of phones and computers”.'],
        ],
      ),
    ],
  }),
])
