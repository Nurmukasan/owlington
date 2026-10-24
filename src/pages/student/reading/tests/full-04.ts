import { features, flow, info, mcq, passage, sentences, summary, test, tfng, ynng } from '../build'

export default test('full-04', [
  passage({
    title: 'Roads Made of Ice',
    sub: 'For a few weeks each winter, frozen lakes in northern Canada become highways for some of the heaviest trucks on Earth.',
    text: `
      A
      In the far north of Canada, many communities and mines have no permanent road connecting them to the rest of the country.
      For most of the year, everything they need, from fuel and building materials to heavy machinery, must arrive by aircraft, which is extremely expensive and limits the size of the loads that can be carried.
      For a brief period in winter, however, the landscape changes.
      Lakes and rivers freeze solid, and it becomes possible to build roads across them.

      B
      The longest of these winter roads runs for around four hundred kilometres from the city of Yellowknife to a group of diamond mines in the north.
      More than eighty per cent of its length crosses frozen lakes, linked by short sections over land known as portages.
      Each winter, thousands of truckloads travel along it, carrying the fuel and supplies that the mines need to keep working for the rest of the year.

      C
      Building an ice road is a skilled process that begins long before the first truck arrives.
      As soon as the ice is thick enough to support a person, workers measure it using radar equipment or by drilling holes.
      Light vehicles are then used to clear the snow from the surface, since snow acts as a blanket that slows the freezing of the water beneath.
      Once the ice has thickened further, water is pumped from beneath it and spread across the surface, where it freezes into an additional layer.
      This process, called flooding, is repeated until the road can carry the heaviest loads, which may require ice more than a metre thick.

      D
      Driving on the finished road requires strict discipline.
      Speed limits are typically low, often between ten and thirty kilometres an hour for loaded trucks.
      The reason is not only the danger of skidding: a heavy vehicle moving across floating ice pushes the ice down slightly, creating a wave in the water underneath.
      If the truck travels too fast, this wave can reach the shore or meet another wave and break through the ice from below, an event known as a blowout.
      Trucks are also required to keep a long distance from one another, so that the weight on any section of ice is limited.

      E
      Safety is monitored constantly.
      Inspectors check the thickness of the ice every day, and maintenance crews repair cracks by filling them with water, which then freezes.
      Despite these precautions, accidents do occur, and drivers are trained to escape quickly from a vehicle that breaks through the ice.
      Many keep their doors slightly open or their seat belts unfastened while crossing the thinnest sections.

      F
      The greatest threat to ice roads is now the changing climate.
      In recent decades, winters in northern Canada have become noticeably warmer, and the season during which the roads can be used has become shorter and less predictable.
      In some years, the road has had to close weeks earlier than planned, forcing mining companies to fly in supplies at enormous cost.
      Some winter roads have been rerouted onto land, where they are less affected by warming but more expensive to build and maintain.

      G
      For the small communities along these routes, the roads are more than a commercial link.
      They allow families to visit relatives, to buy goods at lower prices and to travel to hospitals and schools that are otherwise reachable only by air.
      As the season shortens, several communities have called for permanent all-weather roads to be built, although the cost of constructing roads across hundreds of kilometres of wilderness is very high.
    `,
    groups: [
      flow(
        'Building an ice road',
        1,
        [
          'The thickness of the ice is measured with radar or by [[drilling]] holes',
          '[[Snow]] is cleared from the surface so that the ice freezes faster',
          'Water is pumped onto the surface to form an extra layer, a process called [[flooding]]',
          'Inspectors check the ice every day',
          'Crews fill [[cracks]] with water, which freezes',
        ],
        [
          ['C2', 'Workers measure the ice “using radar equipment or by drilling holes”.'],
          ['C3', 'Snow is cleared because it “acts as a blanket that slows the freezing of the water beneath”.'],
          ['C5', '“This process, called flooding, is repeated until the road can carry the heaviest loads.”'],
          ['E2', 'Crews “repair cracks by filling them with water, which then freezes”.'],
        ],
      ),
      tfng([
        ['Flying supplies into northern mines limits the size of what can be delivered.', 'T', 'A2', 'Air transport “limits the size of the loads that can be carried”.'],
        ['Most of the road from Yellowknife to the diamond mines is built over land.', 'F', 'B2', '“More than eighty per cent of its length crosses frozen lakes.”'],
        ['The diamond mines depend on the ice road for supplies for the whole year.', 'T', 'B3', 'Trucks carry the supplies “that the mines need to keep working for the rest of the year”.'],
        ['Radar is a more reliable way to measure ice than drilling.', 'NG', 'C2', 'Both methods are mentioned, but they are never compared.'],
        ['Low speed limits are needed only to stop trucks from skidding.', 'F', 'D3', '“The reason is not only the danger of skidding”: trucks also create waves under the ice.'],
        ['Drivers are taught how to get out of a truck that falls through the ice.', 'T', 'E3', 'Drivers “are trained to escape quickly from a vehicle that breaks through the ice”.'],
        ['Roads rerouted onto land are cheaper to maintain than ice roads.', 'F', 'F4', 'Land routes are “more expensive to build and maintain”.'],
        ['The government has agreed to build all-weather roads to several communities.', 'NG', 'G3', 'Communities “have called for” permanent roads; no decision is reported.'],
        ['Ice roads give some communities access to medical care.', 'T', 'G2', 'They allow people to travel “to hospitals and schools that are otherwise reachable only by air”.'],
      ]),
    ],
  }),

  passage({
    title: 'Gardening the Reef',
    sub: 'As coral reefs decline, scientists are growing corals by hand and replanting them. Can it work on a large enough scale?',
    text: `
      A
      Coral reefs cover less than one per cent of the ocean floor, yet they support around a quarter of all marine species.
      They protect coastlines from storms, provide food for hundreds of millions of people and attract tourists whose spending supports entire local economies.
      Over recent decades, however, reefs around the world have suffered dramatic losses.
      Rising sea temperatures cause corals to expel the tiny algae that live inside them and supply most of their food, a process known as bleaching, and if high temperatures persist the corals starve and die.

      B
      Faced with this decline, a growing number of scientists and volunteers have turned to coral gardening.
      The basic idea is simple.
      Small fragments are cut from healthy corals and attached to underwater frames, ropes or structures shaped like trees, in sheltered areas known as nurseries.
      Protected from predators and storms, the fragments grow far faster than they would on the reef, and after a year or two they are large enough to be transplanted onto damaged reefs, where they are fixed in place with special cement or ties.

      C
      One discovery has greatly increased the speed of the process.
      Marine biologist Dr Elena Vasquez found, almost by accident, that when certain slow-growing corals are cut into very small pieces, each only a centimetre or two across, they grow many times faster than larger fragments.
      When several of these tiny pieces from the same parent coral are placed close together, they spread across the surface and fuse into a single colony.
      Using this technique, corals that would normally take decades to reach a useful size can do so in a few years.

      D
      Other researchers are focusing on which corals to plant.
      Professor James Whitfield points out that replanting the same corals that died in a heatwave may simply lead to another loss when the next one arrives.
      His team identifies individual corals that survived recent bleaching events and breeds from them, in the hope of producing reefs that can better withstand warmer water.
      He acknowledges that this approach is controversial, since it may reduce the genetic variety of reefs in ways that are difficult to predict.

      E
      A third approach works with corals’ own reproduction.
      Many corals reproduce by releasing enormous numbers of eggs and sperm into the water on a few nights each year, but only a tiny fraction of the resulting larvae survive to settle on the reef.
      Dr Amara Nwosu and her colleagues collect these spawn, raise the larvae in tanks until they are ready to settle, and then release them over damaged areas inside mesh enclosures, which prevent them from drifting away.
      This method can produce many thousands of young corals at once, although many still die in their first year.

      F
      Despite these advances, critics warn that restoration cannot keep pace with destruction.
      Most projects cover areas of only a few hundred square metres, while reefs are being lost across thousands of square kilometres.
      Professor Lars Eriksen, an ocean scientist, argues that restoration risks becoming a distraction: governments and companies may point to small replanting projects while failing to reduce the greenhouse gas emissions that are warming the oceans.
      ‘Without action on climate,’ he says, ‘we are planting gardens in a house that is on fire.’

      G
      Supporters of restoration largely accept this point.
      They see coral gardening not as a solution in itself but as a way of buying time, keeping important reefs alive and preserving their genetic diversity until the threats they face can be reduced.
      They also note that restoration projects often involve local communities, providing employment and encouraging people to protect reefs in other ways.
    `,
    groups: [
      info([
        ['a description of how young corals are prevented from being carried away', 'E', 'E3', 'Larvae are released “inside mesh enclosures, which prevent them from drifting away”.'],
        ['a reference to the economic importance of reefs', 'A', 'A2', 'Reefs attract tourists “whose spending supports entire local economies”.'],
        ['an explanation of how corals become starved', 'A', 'A4', 'Bleaching makes corals expel the algae that supply their food, and “the corals starve and die”.'],
        ['the social benefits of restoration projects', 'G', 'G3', 'Projects involve local communities, “providing employment”.'],
        ['the methods used to attach corals to a reef', 'B', 'B4', 'Corals are “fixed in place with special cement or ties”.'],
      ]),
      features(
        ['researcher', 'researchers'],
        ['Elena Vasquez', 'James Whitfield', 'Amara Nwosu', 'Lars Eriksen'],
        [
          ['Restoration projects may give an excuse for failing to tackle the main cause of coral loss.', 'D', 'F3', 'Eriksen: restoration “risks becoming a distraction” from reducing emissions.'],
          ['An important finding was made unintentionally.', 'A', 'C2', 'Vasquez found the effect “almost by accident”.'],
          ['Choosing corals that can tolerate heat may have unexpected effects.', 'B', 'D3 D4', 'Whitfield breeds from survivors but admits it “may reduce the genetic variety of reefs in ways that are difficult to predict”.'],
          ['Large numbers of young corals can be produced at one time.', 'C', 'E4', 'Nwosu’s method “can produce many thousands of young corals at once”.'],
        ],
      ),
      summary(
        'Coral gardening',
        0,
        `In coral gardening, small pieces of healthy coral are grown in [[nurseries]] where they are safe from predators and storms.
        Corals cut into very small fragments grow much more [[quickly]], and pieces from the same parent eventually join together.
        However, restoration projects are usually very [[small]] compared with the area of reef being lost, and supporters see them mainly as a way of [[buying time]].`,
        [
          ['B3 B4', 'Fragments are kept “in sheltered areas known as nurseries”, “protected from predators and storms”.'],
          ['C2', 'Tiny pieces “grow many times faster than larger fragments”.'],
          ['F2', 'Most projects cover “only a few hundred square metres”, while reefs are lost “across thousands of square kilometres”.'],
          ['G2', 'Supporters see coral gardening “as a way of buying time”.'],
        ],
        {
          words: ['nurseries', 'quickly', 'small', 'buying time', 'tanks', 'slowly', 'expensive', 'saving money', 'cement'],
        },
      ),
    ],
  }),

  passage({
    title: 'The Psychology of the Queue',
    sub: 'Why does a five-minute wait sometimes feel like half an hour? The answer has less to do with clocks than with minds.',
    text: `
      A
      Most of us spend a surprising amount of our lives waiting: in shops, at airports, on the telephone and in traffic.
      Businesses have long understood that customers dislike waiting, and many have spent heavily on reducing the time it takes.
      Yet research on queues suggests that how long people wait often matters less than how the wait feels.
      The same five minutes can seem trivial in one situation and intolerable in another.

      B
      One of the best-known illustrations comes from an airport in the United States.
      Passengers had complained repeatedly about the time it took for their luggage to arrive, so the airport hired more baggage handlers and reduced the average wait to around eight minutes, a figure well within industry standards.
      The complaints continued.
      When the airport looked more closely, it found that passengers walked for only about a minute from their plane to the baggage area and then stood waiting for around seven minutes.
      The solution was to move the arrival gates further away and send luggage to the most distant carousel, so that passengers spent most of the time walking.
      The complaints almost disappeared, even though the total time had not changed.

      C
      The story illustrates a principle that psychologists have confirmed many times: occupied time feels shorter than unoccupied time.
      This explains why lifts often have mirrors beside them, which give waiting people something to look at, and why some restaurants hand out menus to customers who are waiting for a table.
      Anything that gives the mind something to do reduces the sense of time passing slowly.

      D
      Uncertainty is another powerful factor.
      People who do not know how long they will have to wait tend to feel that the wait is longer than people who have been given an estimate, even when the actual time is the same.
      This is why many transport systems now display the minutes until the next train or bus, and why theme parks post expected waiting times at the entrance to each ride.
      Interestingly, some parks deliberately overstate these times slightly, so that visitors are pleasantly surprised when they reach the front sooner than expected.

      E
      Waits also feel longer when they seem unfair.
      Customers become particularly annoyed if someone who arrived after them is served first, and many will accept a longer wait in exchange for a guarantee that the order of arrival will be respected.
      This is one reason why many banks and post offices have replaced separate queues for each counter with a single winding line that feeds all the counters.
      A single queue is not necessarily faster on average, but it removes the frustration of watching a neighbouring line move more quickly.

      F
      Finally, the end of an experience has a disproportionate effect on how it is remembered.
      Studies of people waiting on the telephone, for example, have found that a long wait that ends with a helpful, friendly conversation is remembered more positively than a shorter wait that ends badly.
      Some researchers have therefore argued that businesses would gain more from improving the final moments of a wait than from reducing its overall length.

      G
      None of this means that the actual length of a wait is irrelevant; beyond a certain point, no amount of distraction will satisfy an impatient customer.
      But the research does suggest that the experience of time is shaped as much by attention, expectation and fairness as by the clock.
    `,
    groups: [
      mcq([
        [
          'What was the airport’s first response to complaints about luggage?',
          ['It moved the arrival gates.', 'It employed more staff.', 'It explained the delay to passengers.', 'It changed the baggage carousels.'],
          'B',
          'B2',
          'The airport “hired more baggage handlers”, reducing the wait to around eight minutes. Moving the gates came later.',
        ],
        [
          'The airport finally solved the problem by',
          ['reducing the total time passengers waited.', 'giving passengers information about their luggage.', 'making passengers spend more of the wait walking.', 'providing entertainment in the baggage area.'],
          'C',
          'B5 B6',
          'Gates were moved so “passengers spent most of the time walking”, and the total time “had not changed”.',
        ],
        [
          'Why do some theme parks overstate waiting times?',
          ['to discourage visitors from joining long queues', 'to make visitors feel the wait was shorter than expected', 'because the times are difficult to calculate', 'because visitors tend to ignore the estimates'],
          'B',
          'D4',
          'They overstate times “so that visitors are pleasantly surprised when they reach the front sooner than expected”.',
        ],
        [
          'What is the main advantage of a single queue for several counters?',
          ['It serves customers more quickly on average.', 'It needs fewer staff.', 'It prevents customers feeling that others are treated better.', 'It takes up less space.'],
          'C',
          'E3 E4',
          'A single queue “is not necessarily faster on average, but it removes the frustration of watching a neighbouring line move more quickly”.',
        ],
      ]),
      ynng([
        ['The airport’s eight-minute wait was longer than the industry standard.', 'N', 'B2', 'The figure was “well within industry standards”.'],
        ['Mirrors beside lifts help to make waiting feel shorter.', 'Y', 'C2', 'Mirrors give people “something to look at”, and occupied time feels shorter.'],
        ['Displays showing the time until the next train were first introduced in Europe.', 'NG', 'D3', 'Transport displays are mentioned, but not where they began.'],
        ['Many customers would rather wait longer than see others served out of turn.', 'Y', 'E2', 'Many “will accept a longer wait in exchange for a guarantee that the order of arrival will be respected”.'],
        ['The length of a wait makes no difference once customers are distracted.', 'N', 'G1', '“Beyond a certain point, no amount of distraction will satisfy an impatient customer.”'],
      ]),
      sentences(2, [
        ['Psychologists have found that [[occupied time]] seems to pass more quickly than empty time.', 'C1', '“Occupied time feels shorter than unoccupied time.”'],
        ['Some restaurants give out [[menus]] to people waiting for a table.', 'C2', 'Restaurants “hand out menus to customers who are waiting for a table”.'],
        ['Waits seem longer to people who have not been given an [[estimate]].', 'D2', 'People who do not know how long they will wait feel it is longer “than people who have been given an estimate”.'],
        ['A long telephone wait may be remembered positively if it ends with a [[friendly conversation|helpful conversation]].', 'F2', 'The wait “ends with a helpful, friendly conversation”. Either adjective with “conversation” fits the limit.'],
        ['Some researchers believe businesses should focus on improving the [[final moments]] of a wait.', 'F3', 'Businesses “would gain more from improving the final moments of a wait”.'],
      ]),
    ],
  }),
])
