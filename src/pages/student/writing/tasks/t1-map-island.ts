import { task1 } from '../build'

const BEFORE = {
  title: 'Tarn Island, before development',
  description:
    'Map of Tarn Island before development, north at the top. The island is mostly covered by trees, with a beach along the south coast and a small hill in the north-east. There are no buildings or roads. A small pier stands in the middle of the south coast.',
  points: {},
  shapes: [
    { kind: 'trees' as const, x: 40, y: 40, w: 420, h: 260, label: 'Forest' },
    { kind: 'green' as const, x: 480, y: 40, w: 130, h: 130, label: 'Hill' },
    { kind: 'sand' as const, x: 40, y: 320, w: 570, h: 60, label: 'Beach' },
    { kind: 'stage' as const, x: 300, y: 385, w: 40, h: 50, label: 'Pier' },
  ],
}

const AFTER = {
  title: 'Tarn Island, after development',
  description:
    'Map of Tarn Island after development, north at the top. A road runs from the pier, which has been lengthened, north through the middle of the island to a restaurant on the hill. ' +
    'West of the road there is a hotel with a swimming pool, and a row of holiday cabins along the beach. East of the road there is a reception building near the pier. Part of the forest remains in the north-west, and the beach is unchanged.',
  points: {},
  shapes: [
    { kind: 'trees' as const, x: 40, y: 40, w: 220, h: 140, label: 'Forest' },
    { kind: 'green' as const, x: 480, y: 40, w: 130, h: 130, label: 'Hill' },
    { kind: 'building' as const, x: 500, y: 70, w: 90, h: 60, label: 'Restaurant' },
    { kind: 'road' as const, d: 'M320 380 V 220 C 320 150, 420 110, 500 100' },
    { kind: 'building' as const, x: 60, y: 200, w: 160, h: 80, label: 'Hotel' },
    { kind: 'water' as const, x: 230, y: 210, w: 60, h: 50, label: 'Pool' },
    { kind: 'building' as const, x: 360, y: 270, w: 100, h: 40, label: 'Reception' },
    { kind: 'room' as const, x: 60, y: 300, w: 200, h: 20, label: '' },
    { kind: 'label' as const, x: 160, y: 296, text: 'Cabins', small: true },
    { kind: 'sand' as const, x: 40, y: 330, w: 570, h: 50, label: 'Beach' },
    { kind: 'stage' as const, x: 300, y: 385, w: 40, h: 70, label: 'Pier' },
  ],
}

export default task1({
  id: 't1-map-island',
  instructions: 'The maps below show an island before and after the construction of some tourist facilities.',
  figure: {
    kind: 'map',
    title: 'Tarn Island, before and after development',
    panels: [
      { label: 'Before', spec: BEFORE },
      { label: 'After', spec: AFTER },
    ],
  },
  tips: [
    'Before: almost nothing man-made. After: a small resort. That is the overview.',
    'Use the road as your guide: describe what lies along it, west and east.',
    'Remember what stayed the same: the beach and part of the forest.',
  ],
  model: `
The maps illustrate how Tarn Island has been transformed by the building of tourist facilities.

Overall, the island has changed from an undeveloped natural area into a small holiday resort. Much of the forest has been cleared, but the beach has remained unchanged.

Before development, the island was almost entirely covered by forest, apart from a hill in the north-east and a beach along the southern coast. The only man-made structure was a short pier. However, after the development, this pier has been extended so that larger boats can dock, and a reception building has been constructed to the east of it.

A road now runs north from the pier through the centre of the island and then curves eastwards to the hill, where a restaurant has been built. In addition, to the west of the road, a large area of forest has been replaced by a hotel with a swimming pool next to it, and a row of holiday cabins has been erected just behind the beach. Only the north-western part of the forest has survived.
`,
  notes: [
    ['how Tarn Island has been transformed by the building of tourist facilities', 'LR', 'Paraphrase: construction → building; island before and after → transformed.'],
    ['Overall, the island has changed from an undeveloped natural area into a small holiday resort.', 'TA', 'The overview contrasts the general character of the two maps.'],
    ['this pier has been extended so that larger boats can dock', 'GRA', 'Passive plus a purpose clause.'],
    ['and then curves eastwards to the hill', 'TA', 'Directions help the reader follow the new road.'],
    ['a row of holiday cabins has been erected just behind the beach', 'LR', '“Erected” varies the verbs built, constructed, added.'],
  ],
})
