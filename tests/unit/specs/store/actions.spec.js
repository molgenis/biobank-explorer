import api from '@molgenis/molgenis-api-client'
import utils from '@molgenis/molgenis-vue-test-utils'
import helpers from '../../../../src/store/helpers'
import { mockState } from '../mockData'
import actions from '../../../../src/store/actions'
import filterDefinitions from '../../../../src//utils/filterDefinitions'

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    post: jest.fn(),
    get: jest.fn()
  }
})

describe('store', () => {
  beforeEach(() => {
    api.get.mockReset()
  })
  describe('actions', () => {
    describe('GetBiobanks', () => {
      it('should retrieve biobanks from the server and store them in state', (done) => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        api.get.mockResolvedValueOnce(response)
        const options = {
          payload: ['id1', 'id2'],
          expectedMutations: [
            { type: 'SetBiobanks', payload: response.items }
          ]
        }
        utils.testAction(actions.GetBiobanks, options, done)
      })

      it('should commit an error if the server response is bad', async () => {
        const error = new Error('something wrong')
        const commit = jest.fn()
        api.get.mockRejectedValueOnce(error)

        await actions.GetBiobanks({ commit }, ['b1', 'b2'])
        expect(commit.mock.calls[0]).toEqual(['SetError', error])
      })
    })

    describe('SendToNegotiator', () => {
      let state
      let getters
      const commit = jest.fn()
      beforeEach(() => {
        state = mockState()
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.filters.selections.search = 'Cell&Co'
        state.filters.selections.materials = ['CELL_LINES']
        getters = {
          rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
          filterDefinitions: filterDefinitions(state),
          activeFilters: state.filters.selections,
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }],
          biobanks: [
            { id: 'biobank1', collections: [{ id: 'collection1' }, { id: 'collection2' }] },
            { id: 'biobank2', collections: [{ id: 'collection3' }, { id: 'collection4' }] }
          ]
        }
        helpers.setLocationHref = jest.fn()
        api.get.mockResolvedValueOnce({ items: [] })
      })

      it('should send a negotiator query to the server and then surf to the negotiator', async () => {
        api.post.mockResolvedValueOnce('test')
        await actions.SendToNegotiator({ state, getters, commit })
        expect(helpers.setLocationHref).toBeCalledWith('test')
      })

      it('should commit the error if the server response was bad', async () => {
        api.post.mockRejectedValueOnce('test error')
        await actions.SendToNegotiator({ state, getters, commit })
        expect(commit).toBeCalledWith('SetError', 'test error')
      })
    })

    describe('GetBiobankIds', () => {
      it('should retrieve biobank ids from the server based on biobank filters', async () => {
        const response = {
          items: [
            { data: { id: 'biobank-1', name: 'Biobank 1', network: ['Network 1', 'Network 2'] } },
            { data: { id: 'biobank-2', name: 'Biobank 2', network: ['Network 1', 'Network 4'] } }
          ]
        }
        api.get.mockResolvedValueOnce(response)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }
        const commit = jest.fn()

        await actions.GetBiobankIds({ commit, getters })
        expect(commit.mock.calls[2]).toEqual(['SetBiobankIds', ['biobank-1', 'biobank-2']])
        expect(commit.mock.calls[3]).toEqual(['SetBiobankInfo', response])
      })

      it('should set an error if something wrong happens in rest call', async () => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }
        const commit = jest.fn()

        await actions.GetBiobankIds({ commit, getters })
        expect(commit.mock.calls[2]).toEqual(['SetError', error])
      })
    })

    describe('GetBiobankIdsInNetwork', () => {
      it('should retrieve biobank ids from the server based biobank_network filter', async () => {
        const response = {
          items: [
            { data: { id: 'biobank-1', name: 'Biobank 1', network: ['Network 1', 'Network 2'] } },
            { data: { id: 'biobank-2', name: 'Biobank 2', network: ['Network 1', 'Network 4'] } }
          ]
        }
        api.get.mockResolvedValueOnce(response)

        const state = {
          filters: {
            selections: {
              biobank_network: ['n1', 'n2']
            }
          }
        }
        const commit = jest.fn()

        await actions.GetBiobankIdsInNetwork({ state, commit })
        expect(api.get.mock.calls[0]).toEqual(['/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name&q=network=in=(n1,n2)'])
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsInANetwork', []])
        expect(commit.mock.calls[1]).toEqual(['SetBiobankIdsInANetwork', response])
      })

      it('should update the collection filter when in network view', async () => {
        const response = {
          items: [
            { data: { id: 'biobank-1', name: 'Biobank 1', network: ['Network 1', 'Network 2'] } },
            { data: { id: 'biobank-2', name: 'Biobank 2', network: ['Network 1', 'Network 4'] } }
          ]
        }
        api.get.mockResolvedValueOnce(response)

        const state = {
          filters: {
            selections: {
              biobank_network: ['n1', 'n2']
            },
            labels: {
              biobank_network: ['network 1', 'network 2']
            }
          },
          viewMode: 'networkview'
        }
        const commit = jest.fn()

        await actions.GetBiobankIdsInNetwork({ state, commit })
        expect(api.get.mock.calls[0]).toEqual(['/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name&q=network=in=(n1,n2)'])
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsInANetwork', []])
        expect(commit.mock.calls[1]).toEqual(['SetBiobankIdsInANetwork', response])
        expect(commit.mock.calls[2]).toEqual(
          ['UpdateFilter', { name: 'collection_network', value: [{ text: 'network 1', value: 'n1' }, { text: 'network 2', value: 'n2' }], router: undefined }])
      })

      it('should retrieve set the biobank ids in a network to empty lists when the biobank_network filter is empty', () => {
        const state = {
          filters: {
            selections: {
              biobank_network: []
            }
          }
        }
        const commit = jest.fn()

        actions.GetBiobankIdsInNetwork({ state, commit })
        expect(api.get).not.toHaveBeenCalled()
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsInANetwork', []])
      })

      it('should retrieve set the biobank ids in a network to empty lists when the biobank_network filter undefined', () => {
        const state = {
          filters: {
            selections: {}
          }
        }
        const commit = jest.fn()

        actions.GetBiobankIdsInNetwork({ state, commit })
        expect(api.get).not.toHaveBeenCalled()
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsInANetwork', []])
      })

      it('should set an error if something wrong happens in rest call', async () => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)

        const state = {
          filters: {
            selections: {
              biobank_network: ['n1', 'n2']
            }
          }
        }
        const commit = jest.fn()

        await actions.GetBiobankIdsInNetwork({ state, commit })
        expect(api.get.mock.calls[0]).toEqual(['/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name&q=network=in=(n1,n2)'])
        expect(commit.mock.calls[1]).toEqual(['SetError', error])
      })
    })

    describe('GetCollectionInfo', () => {
      const response = {
        items: [
          { data: { id: 'c1', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b1' } } } },
          { data: { id: 'c2', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b2' } } } }
        ]
      }

      it('should set the collection info, create a dictionary and map query to the state', async () => {
        api.get.mockResolvedValueOnce(response)
        const getters = { rsql: 'country=in=(NL,BE)' }
        const commit = jest.fn()

        await actions.GetCollectionInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionInfo', undefined])
        expect(commit.mock.calls[1]).toEqual(['SetCollectionInfo', response])
        expect(commit.mock.calls[2]).toEqual(['SetDictionaries', response])
        expect(commit.mock.calls[3]).toEqual(['MapQueryToState'])
      })

      it('should set an error if something wrong happens in rest call', async () => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)
        const getters = { rsql: 'country=in=(NL,BE)' }
        const commit = jest.fn()

        await actions.GetCollectionInfo({ commit, getters })
        expect(commit.mock.calls[1]).toEqual(['SetError', error])
      })
    })

    describe('GetNetworkIds', () => {
      const response = {
        items: [
          { data: { id: 'n1', name: 'cool network 1' } },
          { data: { id: 'n2', name: 'cool network 2' } }
        ]
      }

      const networkFilters = [
        { text: 'cool network 1', value: 'n1' },
        { text: 'cool network 2', value: 'n2' }
      ]

      it('should set the list of network ids, network dictionary and apply filters by network for biobanks and collections ', async () => {
        api.get.mockResolvedValueOnce(response)
        const getters = { networkRsql: 'commons_sops==true' }
        const commit = jest.fn()
        await actions.GetNetworkInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetNetworkIds', undefined])
        expect(commit.mock.calls[1]).toEqual(['SetNetworks', response.items.map(network => network.data)])
        expect(commit.mock.calls[2]).toEqual(['SetNetworkIds', response.items.map(network => network.data.id)])
        expect(commit.mock.calls[3]).toEqual(['UpdateFilter', { name: 'biobank_network', value: networkFilters, router: undefined }])
      })

      it('should set an error if something wrong happens in rest call', async () => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)
        const getters = { networkRsql: 'commons_sops==true' }
        const commit = jest.fn()
        await actions.GetNetworkInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetNetworkIds', undefined])
        expect(commit.mock.calls[1]).toEqual(['SetError', error])
      })
    })

    describe('GetBiobankReport', () => {
      it('should retrieve a single biobank entity from the server based on a biobank id and store it in the state', done => {
        const biobank = {
          _meta: {
            name: 'biobank'
          },
          id: 'biobank-1'
        }

        api.get.mockResolvedValueOnce(biobank)

        const options = {
          payload: 'biobank-1',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetBiobankReport', payload: biobank },
            { type: 'SetLoading', payload: false }
          ]
        }

        utils.testAction(actions.GetBiobankReport, options, done)
      })

      it('should return biobank from state if it is already there', done => {
        const state = {
          allBiobanks: [
            { id: 'biobank' }
          ]
        }

        const options = {
          state,
          payload: 'biobank',
          expectedMutations: [
            { type: 'SetBiobankReport', payload: { id: 'biobank' } }
          ]
        }

        utils.testAction(actions.GetBiobankReport, options, done)
      })

      it('should set an error if something wrong happens in rest call', done => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetError', payload: error },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetBiobankReport, options, done)
      })
    })

    describe('GetCollectionReport', () => {
      it('should retrieve a single collection entity from the server based on a collection id and store it in the state', done => {
        const response = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        api.get.mockResolvedValueOnce(response)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetCollectionReport', payload: response },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetCollectionReport, options, done)
      })

      it('should set an error if something wrong happens in rest call', done => {
        const error = new Error('something wrong')
        api.get.mockRejectedValueOnce(error)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetError', payload: error },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetCollectionReport, options, done)
      })
    })

    describe('GetNetworkReport', () => {
      const neverReturningPromise = new Promise(() => {})
      const collectionError = new Error('No way!')
      it('should set error', done => {
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockRejectedValueOnce(collectionError)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetError', payload: collectionError }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })

      it('should load network', done => {
        const network = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful network',
          description: 'beautiful data'
        }
        api.get.mockResolvedValueOnce(network)
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockResolvedValueOnce(neverReturningPromise)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetNetworkReport', payload: network },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })

      it('should retrieve the collections and biobanks of a network from the server based on a network id and store them in the state', done => {
        const networkPromise = new Promise(() => {})
        api.get.mockResolvedValueOnce(networkPromise)
        api.get.mockResolvedValueOnce([{ id: 'bb-1' }])
        api.get.mockResolvedValueOnce([{ id: 'col-1' }])

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetNetworkCollections', payload: [{ id: 'col-1' }] },
            { type: 'SetNetworkBiobanks', payload: [{ id: 'bb-1' }] }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })
    })
  })
})
