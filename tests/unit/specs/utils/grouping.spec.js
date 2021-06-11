import { groupCollectionsByNetworkId, groupBiobanksByNetworkId } from '../../../../src/utils/grouping'

describe('grouping', () => {
  describe('groupCollectionsByNetworkId', () => {
    it('should create a dictionary which has network ids as key and collections as field', () => {
      const collectionInfo = [
        { id: 'c1', networkIds: ['n1', 'n2'] },
        { id: 'c2', networkIds: ['n1', 'n3'] },
        { id: 'c3', networkIds: ['n3'] },
        { id: 'c4', networkIds: ['n2'] },
        { id: 'c5', networkIds: ['n3', 'n2'] }
      ]

      const actual = groupCollectionsByNetworkId(collectionInfo)
      const expected = {
        n1: [
          { id: 'c1', networkIds: ['n1', 'n2'] },
          { id: 'c2', networkIds: ['n1', 'n3'] }
        ],
        n2: [
          { id: 'c1', networkIds: ['n1', 'n2'] },
          { id: 'c4', networkIds: ['n2'] },
          { id: 'c5', networkIds: ['n3', 'n2'] }
        ],
        n3: [
          { id: 'c2', networkIds: ['n1', 'n3'] },
          { id: 'c3', networkIds: ['n3'] },
          { id: 'c5', networkIds: ['n3', 'n2'] }
        ]
      }
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('groupBiobanksByNetworkId', () => {
    it('should create a dictionary which has network ids as key and biobanks as fields', () => {
      const biobanks = [
        'b1',
        { id: 'b2', collections: [{ id: 'c1' }] },
        'b3',
        'b4',
        { id: 'b5', collections: [{ id: 'c2' }] }
      ]
      const biobankInfo = {
        b1: { networkIds: ['n1', 'n2'] },
        b2: { networkIds: ['n1', 'n3'] },
        b3: { networkIds: ['n3'] },
        b4: { networkIds: ['n2'] },
        b5: { networkIds: ['n3', 'n2'] }
      }

      const actual = groupBiobanksByNetworkId(biobanks, biobankInfo)

      const expected = {
        n1: [
          'b1',
          { id: 'b2', collections: [{ id: 'c1' }] }
        ],
        n2: [
          'b1',
          'b4',
          { id: 'b5', collections: [{ id: 'c2' }] }
        ],
        n3: [
          { id: 'b2', collections: [{ id: 'c1' }] },
          'b3',
          { id: 'b5', collections: [{ id: 'c2' }] }
        ]
      }
      expect(actual).toStrictEqual(expected)
    })
  })
})
