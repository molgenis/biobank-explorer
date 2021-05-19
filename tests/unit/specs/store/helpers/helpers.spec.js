import helpers, {
  filterCollectionTree,
  isCodeRegex
} from '../../../../../src/store/helpers'
import filterDefinitions from '../../../../../src/utils/filterDefinitions'
import { mockState } from '../../mockData'

const getInitialState = () => {
  return mockState()
}
let state

describe('store', () => {
  beforeEach(() => {
    state = getInitialState()
  })
  describe('Vuex store helper functions', () => {
    describe('filterCollectionTree', () => {
      it('should filter collections with matching IDs', () => {
        const collections = [
          { id: 1, sub_collections: [] },
          { id: 2, sub_collections: [] },
          { id: 3, sub_collections: [] },
          { id: 4, sub_collections: [] },
          { id: 5, sub_collections: [] }
        ]
        const expected = [
          { id: 2, sub_collections: [] },
          { id: 4, sub_collections: [] }
        ]
        expect(filterCollectionTree([2, 4], collections)).toStrictEqual(expected)
      })
      it('should filter subcollections', () => {
        expect(filterCollectionTree([2, 4], [{
          id: 1,
          sub_collections: [
            { id: 2, sub_collections: [] },
            { id: 3, sub_collections: [] },
            { id: 4, sub_collections: [] },
            { id: 5, sub_collections: [] }
          ]
        }])).toStrictEqual([{
          id: 1,
          sub_collections: [
            { id: 2, sub_collections: [] },
            { id: 4, sub_collections: [] }
          ]
        }])
      })
      it('should filter deeply nested tree of collections', () => {
        expect(filterCollectionTree([2, 4], [{
          id: 1,
          sub_collections: [{
            id: 2,
            sub_collections: [{
              id: 3,
              sub_collections: [{
                id: 4,
                sub_collections: [{
                  id: 5, sub_collections: []
                }]
              }]
            }]
          }]
        }])).toStrictEqual([{
          id: 1,
          sub_collections: [{
            id: 2,
            sub_collections: [{
              id: 3,
              sub_collections: [{
                id: 4,
                sub_collections: []
              }]
            }]
          }]
        }])
      })
    })

    describe('Code regex', () => {
      it('should match single uppercase character', () => {
        expect(isCodeRegex.test('A')).toEqual(true)
      })

      it('should be case-insensitive', () => {
        expect(isCodeRegex.flags).toEqual('i')
      })

      it('should match chapter code', () => {
        expect(isCodeRegex.test('A10-A12')).toEqual(true)
      })

      it('should match top level chapter code', () => {
        expect(isCodeRegex.test('XIX')).toEqual(true)
      })

      it('should match disease code', () => {
        expect(isCodeRegex.test('A10.001')).toEqual(true)
      })

      it('should not match other query string', () => {
        expect(isCodeRegex.test('he')).toEqual(false)
      })
    })

    describe('createRSQLQuery', () => {
      afterEach(() => { state = getInitialState() })

      it('should create a query with only a country filter', () => {
        state.filters.selections.country = ['NL', 'BE']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'country=in=(NL,BE)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a materials filter', () => {
        state.filters.selections.materials = ['RNA', 'DNA']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'materials=in=(RNA,DNA)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a collection quality filter', () => {
        state.filters.selections.collection_quality = ['collection1']
        state.collectionIdsWithSelectedQuality = ['collection1']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'id=in=(collection1)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a disease type filter', () => {
        state.filters.selections.diagnosis_available = ['G71', 'ORPHA:10', 'ORPHA:100']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'diagnosis_available.code=in=(G71,ORPHA:10,ORPHA:100)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a biobank filter', () => {
        state.biobankInANetwork = ['b1', 'b2', 'b3']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'biobank=in=(b1,b2,b3)'

        expect(actual).toBe(expected)
      })

      it('should create a query with no filters and no search', () => {
        const actual = helpers.createRSQLQuery(state)
        const expected = ''

        expect(actual).toBe(expected)
      })

      it('should create a query with only a search', () => {
        state.filters.selections.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = 'name=q=\'test search\',id=q=\'test search\',acronym=q=\'test search\',biobank.name=q=\'test search\',biobank.id=q=\'test search\',biobank.acronym=q=\'test search\''

        expect(actual).toBe(expected)
      })

      it('should create a query with filters and a search', () => {
        state.filters.selections.country = ['NL', 'BE']
        state.filters.selections.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = 'country=in=(NL,BE);(name=q=\'test search\',id=q=\'test search\',acronym=q=\'test search\',biobank.name=q=\'test search\',biobank.id=q=\'test search\',biobank.acronym=q=\'test search\')'

        expect(actual).toBe(expected)
      })
    })

    describe('createNegotiatorQueryBody', () => {
      it('should generate a negotiator query with collection and biobank filter expressions', async () => {
        state.negotiatorBiobankEntityId = 'eu_bbmri_eric_biobanks'
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.filters.selections.search = 'free text search'
        state.filters.selections.country = ['NL', 'BE']
        state.filters.selections.materials = ['RNA']
        state.filters.selections.collection_quality = ['eric']
        state.filters.selections.type = ['type']
        state.filters.selections.dataType = ['dataType']
        state.filters.selections.diagnosis_available = [
          { label: 'small disease' },
          { label: 'medium disease' },
          { label: 'big disease' }
        ]
        state.filters.selections.covid19 = ['covid19']
        state.nToken = '2837538B50189SR237489X14098A2374'
        state.filters.labels = {
          country: ['Netherlands', 'Belgium'],
          materials: ['RNA'],
          collection_quality: ['eric'],
          type: ['type'],
          dataType: ['dataType'],
          diagnosis_available: ['small disease', 'medium disease', 'big disease'],
          covid19: ['covid19']
        }

        const getters = {
          rsql: 'country=in=(NL,BE);name=q=\'free text search\'',
          biobankRsql: 'name=q=\'free text search\'',
          filterDefinitions: filterDefinitions(state),
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }],
          activeFilters: () => state.filters.selections
        }

        const actual = await helpers.createNegotiatorQueryBody(state, getters, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
        const expected = {
          URL: 'http://test.com?id=1',
          humanReadable: 'Text search is free text search and Countries: Netherlands,Belgium and Material type(s): RNA and Collection quality mark(s): eric and Collection type(s): type and Data type(s): dataType and Disease type(s): small disease,medium disease,big disease and Covid-19 service(s): covid19 and with custom collection selection.',
          nToken: state.nToken,
          entityId: 'eu_bbmri_eric_collections',
          rsql: 'id=in=(collection1,collection4)'
        }

        expect(actual).toStrictEqual(expected)
      })

      it('should generate a negotiator query with collection filter expressions', async () => {
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.filters.selections.materials = ['RNA']
        state.nToken = '2837538B50189SR237489X14098A2374'
        state.filters.labels = { materials: ['RNA'] }

        const getters = {
          rsql: 'materials=in=(RNA)',
          filterDefinitions: filterDefinitions(state),
          activeFilters: () => state.filters.selections,
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }]
        }

        const actual = await helpers.createNegotiatorQueryBody(state, getters, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
        const expected = {
          URL: 'http://test.com?id=1',
          humanReadable: 'Material type(s): RNA and with custom collection selection.',
          nToken: state.nToken,
          entityId: 'eu_bbmri_eric_collections',
          rsql: 'id=in=(collection1,collection4)'
        }

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getHumanReadableString', () => {
      let state
      let getters

      beforeEach(() => {
        state = getInitialState()
        state.filters.labels = { materials: ['PLASMA', ' RNA'] }
        state.filters.selections.search = ['this is a free text search']
        state.filters.selections.materials = ['PLASMA', 'RNA']
        getters = {
          filterDefinitions: filterDefinitions(state),
          activeFilters: () => state.filters.selections,
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }]
        }
      })

      it('should generate a human readable string based on the filters', async () => {
        const actual = await helpers.getHumanReadableString(state, getters)
        const expected = 'Text search is this is a free text search and Material type(s): PLASMA, RNA'

        expect(actual).toBe(expected)
      })
    })
  })
})
