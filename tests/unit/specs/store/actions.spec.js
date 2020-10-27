import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import td from 'testdouble'
import api from '@molgenis/molgenis-api-client'
import actions, {
  GET_BIOBANKS,
  GET_COLLECTION_QUALITY_COLLECTIONS,
  GET_DATA_TYPE_OPTIONS,
  GET_TYPES_OPTIONS,
  SEND_TO_NEGOTIATOR,
  COLLECTION_REPORT_ATTRIBUTE_SELECTOR
} from '../../../../src/store/actions'
import utils from '@molgenis/molgenis-vue-test-utils'
import {
  MAP_QUERY_TO_STATE,
  SET_BIOBANKS,
  SET_BIOBANK_IDS,
  SET_BIOBANK_REPORT,
  SET_COLLECTION_REPORT,
  SET_COLLECTION_QUALITY,
  SET_COLLECTION_TYPES,
  SET_COUNTRIES,
  SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_NETWORK_REPORT,
  SET_MATERIALS,
  SET_COLLECTION_QUALITY_COLLECTIONS,
  SET_BIOBANK_QUALITY_BIOBANKS,
  SET_BIOBANK_QUALITY,
  SET_NETWORK_BIOBANKS,
  SET_NETWORK_COLLECTIONS,
  SET_COVID_19,
  SET_COLLECTION_INFO
} from '../../../../src/store/mutations'
import helpers from '../../../../src/store/helpers'
import { mockState } from '../mockState'

chai.use(sinonChai)

describe('store', () => {
  describe('actions', () => {
    afterEach(() => td.reset())

    describe('GET_COUNTRIES', () => {
      it('should retrieve list of available countries from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'NL', label: 'Netherlands' },
            { id: 'BE', label: 'Belgium' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_countries')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_COUNTRIES, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_COUNTRY_OPTIONS__, options, done)
      })
    })

    describe('GET_TYPES_OPTIONS', () => {
      it('should retrieve list of available collection types from the server and store them in the state', done => {
        const response = {
          items: [
            {
              _href: '/api/v2/eu_bbmri_eric_collection_types/BIRTH_COHORT',
              description: 'A cohort study for which the subjects are followed from the time of birth usually including information about gestation and follow up.',
              id: 'BIRTH_COHORT',
              label: 'Birth cohort'
            },
            {
              _href: '/api/v2/eu_bbmri_eric_collection_types/CASE_CONTROL',
              description: 'A case-control study design compares two groups of subjects: those with the disease or condition under study (cases) and a very similar group of subjects who do not have the disease or condition (controls).',
              id: 'CASE_CONTROL',
              label: 'Case-Control'
            }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_collection_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_COLLECTION_TYPES, payload: response.items }
          ]
        }

        utils.testAction(actions[GET_TYPES_OPTIONS], options, done)
      })
    })

    describe('GET_DATA_TYPES_OPTIONS', () => {
      it('should retrieve list of available collection types from the server and store them in the state', done => {
        const response = {
          items: [
            {
              _href: '/api/v2/eu_bbmri_eric_data_types/BIOLOGICAL_SAMPLES',
              description: 'Y/N if biological samples are collected from the participants in the sample collection/study',
              id: 'BIOLOGICAL_SAMPLES',
              label: 'Biological samples'
            },
            {
              _href: '/api/v2/eu_bbmri_eric_data_types/GENEALOGICAL_RECORDS',
              description: 'Y/N if genealogical records are associated with the participants in the sample collection/study',
              id: 'GENEALOGICAL_RECORDS',
              label: 'Genealogical records',
              ontology: 'Miabis'
            }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_data_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_DATA_TYPES, payload: response.items }
          ]
        }

        utils.testAction(actions[GET_DATA_TYPE_OPTIONS], options, done)
      })
    })

    describe('GET_MATERIALS', () => {
      it('should retrieve list of available material types from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'RNA', label: 'RNA' },
            { id: 'PLASMA', label: 'Plasma' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_material_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_MATERIALS, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_MATERIALS_OPTIONS__, options, done)
      })
    })

    describe('GET_COLLECTION_QUALITY_OPTIONS', () => {
      it('should retrieve list of available collection quality standards from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'a-cool_standard', label: 'A cool standard' },
            { id: 'a-smart_standard', label: 'A smart standard' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_assess_level_col')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_COLLECTION_QUALITY, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_COLLECTION_QUALITY_OPTIONS__, options, done)
      })
    })

    describe('GET_BIOBANK_QUALITY_OPTIONS', () => {
      it('should retrieve list of available biobank quality standards from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'a-cool_standard', label: 'A cool standard' },
            { id: 'a-smart_standard', label: 'A smart standard' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_assess_level_bio')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_BIOBANK_QUALITY, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_QUALITY_OPTIONS__, options, done)
      })
    })

    describe('GET_COVID_19_OPTIONS', () => {
      it('should retrieve list of available covid19 options from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'covid19', label: 'Member of the COVID-19 network' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_COVID_19')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: SET_COVID_19, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_COVID_19_OPTIONS__, options, done)
      })
    })

    describe('QUERY_DIAGNOSIS_AVAILABLE_OPTIONS', () => {
      it('should store an empty list in the state when query is empty', done => {
        const options = {
          payload: '',
          expectedMutations: [
            { type: SET_DIAGNOSIS_AVAILABLE, payload: [] }
          ]
        }

        utils.testAction(actions.__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__, options, done)
      })

      it('should retrieve a list of disease types based on a search query from the server and store them in the state', done => {
        const response = {
          items: [{ label: 'search' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=label=q=search')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'search',
          expectedMutations: [
            { type: SET_DIAGNOSIS_AVAILABLE, payload: response.items }
          ]
        }

        utils.testAction(actions.__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__, options, done)
      })

      it('should retrieve a list of disease types based on a code query from the server and store them in the state', done => {
        const response = {
          items: [{ code: 'A01' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=like=A01&sort=code')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'a01',
          expectedMutations: [
            { type: SET_DIAGNOSIS_AVAILABLE, payload: response.items }
          ]
        }

        utils.testAction(actions.__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__, options, done)
      })
    })

    describe('GET_QUERY', () => {
      it('should commit GET_QUERY mutation when no diagnosis ids are in the URL', done => {
        const response = { items: [{ code: 'L40' }] }
        const get = td.function('api.get')

        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=in=(C18,L40)')).thenResolve(response)
        td.replace(api, 'get', get)

        // rewrite tis to use mockState
        const state = {
          route: {
            query: {
              country: 'NL,BE',
              diagnosis_available: 'C18,L40'
            }
          }
        }

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.__GET_QUERY__({ state, dispatch, commit })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit, MAP_QUERY_TO_STATE, { diagnoses: [{ code: 'L40' }] })
          done()
        }, 300)
      })

      it('should fetch diagnoses from the server and map result + URL query to state', () => {
        const state = {
          route: {
            query: {
              diagnosis_available: 'C18,L40'
            }
          }
        }

        const response = {
          items: [
            { code: 'L40' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=in=(C18,L40)')).thenResolve(response)
        td.replace(api, 'get', get)

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.__GET_QUERY__({ state, dispatch, commit })
        expect(commit).to.have.been.calledWith(MAP_QUERY_TO_STATE)
      })

      it('should trigger the action to get the collections matching the applied quality standards and map result + URL query to state', () => {
        const state = {
          route: {
            query: {
              collection_quality: 'eric,self'
            }
          }
        }

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.__GET_QUERY__({ state, dispatch, commit })
        expect(dispatch).to.have.been.calledWith(GET_COLLECTION_QUALITY_COLLECTIONS)
        expect(commit).to.have.been.calledWith(MAP_QUERY_TO_STATE)
      })
    })

    describe('GET_BIOBANKS', () => {
      it('should retrieve biobanks from the server and store them in state', (done) => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?num=10000&attrs=collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories),*&q=id=in=(id1,id2)')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: ['id1', 'id2'],
          expectedMutations: [
            { type: SET_BIOBANKS, payload: response.items }
          ]
        }

        utils.testAction(actions[GET_BIOBANKS], options, done)
      })
    })

    describe('SEND_TO_NEGOTIATOR', () => {
      const state = mockState()

      state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
      state.search = 'Cell&Co'
      state.materials.filters = ['CELL_LINES']

      const getters = {
        rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
        biobanks: [
          { id: 'biobank1', collections: [{ id: 'collection1' }, { id: 'collection2' }] },
          { id: 'biobank2', collections: [{ id: 'collection3' }, { id: 'collection4' }] }
        ]
      }
      const location = 'https://www.example.org/biobankexplorer?search=Cell%26Co&materials=CELL_LINES'

      it('should send a negotiator query to the server and then surf to the negotiator', (done) => {
        const post = td.function('api.post')
        const getLocationHref = td.function('getLocationHref')
        const setLocationHref = td.function('setLocationHref')
        td.replace(api, 'post', post)
        td.replace(helpers, 'setLocationHref', setLocationHref)
        td.replace(helpers, 'getLocationHref', getLocationHref)

        td.when(getLocationHref()).thenReturn(location)

        const bodyCaptor = td.matchers.captor()
        const negotiatorResponse = Promise.resolve('http://example.org/negotiator')
        td.when(post('/plugin/directory/export', bodyCaptor.capture())).thenReturn(negotiatorResponse)

        utils.testAction(actions[SEND_TO_NEGOTIATOR], { state, getters }, (arg) => {
          if (arg) {
            // testAction found an error
            done(arg)
          } else {
            negotiatorResponse.then(() => {
              expect(JSON.parse(bodyCaptor.value.body)).to.deep.eq({
                URL: location,
                entityId: 'eu_bbmri_eric_collections',
                rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
                nToken: null,
                humanReadable: 'Free text search contains Cell&Co and selected material types are CELL_LINES'
              })
              td.verify(setLocationHref('http://example.org/negotiator'))
            }).then(done).catch(done)
          }
        })
      })

      it('should commit the error if the server response was bad', (done) => {
        const post = td.function('api.post')
        const getLocationHref = td.function('getLocationHref')
        td.replace(api, 'post', post)
        td.replace(helpers, 'getLocationHref', getLocationHref)

        td.when(getLocationHref()).thenReturn(location)

        const error = { errors: [{ message: 'Negotiator not configured' }] }
        td.when(post('/plugin/directory/export', td.matchers.anything())).thenReject(error)

        utils.testAction(actions[SEND_TO_NEGOTIATOR], {
          state,
          getters,
          expectedMutations: [{ type: SET_ERROR, payload: error }]
        }, done)
      })
    })

    describe('GET_BIOBANK_IDS', () => {
      it('should retrieve biobank ids from the server based on biobank filters', done => {
        const response = {
          items: [
            { data: { id: 'biobank-1' } },
            { data: { id: 'biobank-2' } }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name&q=covid19=in=(covid19)'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }
        const commit = sinon.spy()

        actions.__GET_BIOBANK_IDS__({ commit, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, SET_BIOBANK_IDS, ['biobank-1', 'biobank-2'])
          done()
        }, 300)
      })
    })

    describe('GET_COLLECTION_INFO', () => {
      const response = {
        items: [
          { data: { id: 'c1', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b1' } } } },
          { data: { id: 'c2', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b2' } } } }
        ]
      }

      it('should retrieve collection and biobank ids from the server based on collection filters', done => {
        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_collections?filter=id,biobank,name,label&size=10000&sort=biobank_label&q=country=in=(NL,BE)'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { rsql: 'country=in=(NL,BE)' }
        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.__GET_COLLECTION_INFO__({ commit, dispatch, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, SET_COLLECTION_INFO, [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
            { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }])

          sinon.assert.calledWith(dispatch, '__GET_QUERY__')
          done()
        }, 300)
      })

      it('should retrieve all collection and biobank ids if there is no collection filter', done => {
        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_collections?filter=id,biobank,name,label&size=10000&sort=biobank_label'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { rsql: '' }
        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.__GET_COLLECTION_INFO__({ commit, dispatch, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, SET_COLLECTION_INFO, [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
            { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }])
          sinon.assert.calledWith(dispatch, '__GET_QUERY__')
          done()
        }, 300)
      })
    })

    describe('GET_COLLECTION_QUALITY_COLLECTIONS', () => {
      it('should retrieve the collections for which certain level of assessment is applied for the quality standards', done => {
        const response = {
          meta: {
            name: 'meta'
          },
          items: [
            { id: 'random-1', collection: 'col-1', quality_standard: '1', asses_level_col: 'eric' },
            { id: 'random-2', collection: 'col-1', quality_standard: '2', asses_level_col: 'self' },
            { id: 'random-3', collection: 'col-2', quality_standard: '2', asses_level_col: 'eric' }
          ]
        }

        const state = {
          route: {
            query: {
              collection_quality: 'eric,self'
            }
          }
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_col_qual_info?q=assess_level_col=in=(eric,self)')).thenResolve(response)
        td.replace(api, 'get', get)
        const options = {
          state: state,
          expectedMutations: [
            { type: SET_COLLECTION_QUALITY_COLLECTIONS, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_COLLECTION_QUALITY_COLLECTIONS__, options, done)
      })

      it('should pass empty array to mutation when no quality standards are selected', done => {
        const state = {
          route: {
            query: {}
          }
        }

        const options = {
          state: state,
          expectedMutations: [
            { type: SET_COLLECTION_QUALITY_COLLECTIONS, payload: [] }
          ]
        }

        utils.testAction(actions.__GET_COLLECTION_QUALITY_COLLECTIONS__, options, done)
      })
    })

    describe('GET_BIOBANK_REPORT', () => {
      it('should retrieve a single biobank entity from the server based on a biobank id and store it in the state', done => {
        const biobank = {
          _meta: {
            name: 'biobank'
          },
          id: 'biobank-1'
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_biobanks/biobank-1?attrs=collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories),quality(id,standards(*),assess_level_bio(*),certification_number,certification_image_link,certification_report,label),contact(*),*')).thenResolve(biobank)
        td.replace(api, 'get', get)

        const options = {
          payload: 'biobank-1',
          expectedMutations: [
            { type: SET_LOADING, payload: true },
            { type: SET_BIOBANK_REPORT, payload: biobank },
            { type: SET_LOADING, payload: false }
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_REPORT__, options, done)
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
            { type: SET_BIOBANK_REPORT, payload: { id: 'biobank' } }
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_REPORT__, options, done)
      })
    })
    describe('GET_COLLECTION_REPORT', () => {
      it('should retrieve a single collection entity from the server based on a collection id and store it in the state', done => {
        const response = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        const get = td.function('api.get')

        td.when(get(`/api/v2/eu_bbmri_eric_collections/001?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`)).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: SET_LOADING, payload: true },
            { type: SET_COLLECTION_REPORT, payload: response },
            { type: SET_LOADING, payload: false }
          ]
        }
        utils.testAction(actions.__GET_COLLECTION_REPORT__, options, done)
      })
    })

    describe('GET_NETWORK_REPORT', () => {
      const neverReturningPromise = new Promise(() => {})
      const collectionCall = `/api/v2/eu_bbmri_eric_collections?q=network==001&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`
      it('should set error', done => {
        const collectionError = new Error('No way!')
        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenReturn(neverReturningPromise)
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenReturn(neverReturningPromise)
        td.when(get(collectionCall)).thenReject(collectionError)
        td.replace(api, 'get', get)
        const options = {
          payload: '001',
          expectedMutations: [
            { type: SET_NETWORK_BIOBANKS, payload: undefined },
            { type: SET_NETWORK_COLLECTIONS, payload: undefined },
            { type: SET_NETWORK_REPORT, payload: undefined },
            { type: SET_LOADING, payload: true },
            { type: SET_ERROR, payload: collectionError }
          ]
        }
        utils.testAction(actions.__GET_NETWORK_REPORT__, options, done)
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
        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenResolve(network)

        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenReturn(neverReturningPromise)
        td.when(get(collectionCall)).thenReturn(neverReturningPromise)
        td.replace(api, 'get', get)
        const options = {
          payload: '001',
          expectedMutations: [
            { type: SET_NETWORK_BIOBANKS, payload: undefined },
            { type: SET_NETWORK_COLLECTIONS, payload: undefined },
            { type: SET_NETWORK_REPORT, payload: undefined },
            { type: SET_LOADING, payload: true },
            { type: SET_NETWORK_REPORT, payload: network },
            { type: SET_LOADING, payload: false }
          ]
        }
        utils.testAction(actions.__GET_NETWORK_REPORT__, options, done)
      })

      it('should retrieve the collections and biobanks of a network from the server based on a network id and store them in the state', done => {
        const get = td.function('api.get')
        const networkPromise = new Promise(() => {})
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenReturn(networkPromise)
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenResolve([{ id: 'bb-1' }])
        td.when(get(collectionCall)).thenResolve([{ id: 'col-1' }])
        td.replace(api, 'get', get)
        const options = {
          payload: '001',
          expectedMutations: [
            { type: SET_NETWORK_BIOBANKS, payload: undefined },
            { type: SET_NETWORK_COLLECTIONS, payload: undefined },
            { type: SET_NETWORK_REPORT, payload: undefined },
            { type: SET_LOADING, payload: true },
            { type: SET_NETWORK_COLLECTIONS, payload: [{ id: 'col-1' }] },
            { type: SET_NETWORK_BIOBANKS, payload: [{ id: 'bb-1' }] }
          ]
        }
        utils.testAction(actions.__GET_NETWORK_REPORT__, options, done)
      })
    })

    describe('GET_BIOBANK_QUALITY_BIOBANKS', () => {
      it('should retrieve the biobanks for which certain level of assessment is applied for the quality standards', done => {
        const response = {
          meta: {
            name: 'meta'
          },
          items: [
            { id: 'random-1', biobank: 'col-1', quality_standard: '1', asses_level_bio: 'eric' }
          ]
        }

        const state = {
          route: {
            query: {
              biobank_quality: 'eric'
            }
          }
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_bio_qual_info?q=assess_level_bio=in=(eric)')).thenResolve(response)
        td.replace(api, 'get', get)
        const options = {
          state: state,
          expectedMutations: [
            { type: SET_BIOBANK_QUALITY_BIOBANKS, payload: response.items }
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_QUALITY_BIOBANKS__, options, done)
      })

      it('should pass empty array to mutation when no quality standards are selected', (done) => {
        const state = {
          route: {
            query: {}
          }
        }

        const options = {
          state: state,
          expectedMutations: [
            { type: SET_BIOBANK_QUALITY_BIOBANKS, payload: [] }
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_QUALITY_BIOBANKS__, options, done)
      })
    })
  })
})
