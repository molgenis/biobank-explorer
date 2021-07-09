import Vue from 'vue'
import { createBookmark } from '../utils/bookmarkMapper'
import { fixCollectionTree } from './helpers'
import filterDefinitions from '../utils/filterDefinitions'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

export default {
  SetCovidNetworkFilter (state, { name, value, router }) {
    if (state.filters.selections[name]) {
      Vue.set(state.filters.selections, name, [...new Set([...state.filters.selections[name], value.value])])
      Vue.set(state.filters.labels, name, [...new Set([...state.filters.labels[name], value.text])])
    } else {
      Vue.set(state.filters.selections, name, [value.value])
      Vue.set(state.filters.labels, name, [value.text])
    }
    createBookmark(router, state.filters.selections, state.selectedCollections)
  },
  UnsetCovidNetworkFilter (state, { name, value, router }) {
    if (state.filters.selections[name]) {
      Vue.set(state.filters.selections, name, [...state.filters.selections[name].filter(item => item !== value.value)])
      Vue.set(state.filters.labels, name, [...state.filters.labels[name].filter(item => item !== value.text)])
    }
    createBookmark(router, state.filters.selections, state.selectedCollections)
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  UpdateFilter (state, { name, value, router }) {
    if (name === 'search') {
      Vue.set(state.filters.selections, name, value)
      createBookmark(router, state.filters.selections, state.selectedCollections)
      return
    }

    const filterValues = []
    const filterTexts = []

    for (const item of value) {
      filterValues.push(item.value)
      filterTexts.push(item.text)
    }
    Vue.set(state.filters.selections, name, [...new Set(filterValues)])
    Vue.set(state.filters.labels, name, [...new Set(filterTexts)])
    createBookmark(router, state.filters.selections, state.selectedCollections, state.filters.satisfyAll)
  },
  UpdateFilterSatisfyAll (state, { name, value, router }) {
    if (value && !state.filters.satisfyAll.includes(name)) {
      state.filters.satisfyAll.push(name)
    } else {
      if (state.filters.satisfyAll.includes(name)) {
        state.filters.satisfyAll.splice(state.filters.satisfyAll.indexOf(name), 1)
      }
    }
    createBookmark(router, state.filters.selections, state.selectedCollections, state.filters.satisfyAll)
  },

  UpdateAllFilters (state, selections) {
    state.filters.selections = {}
    state.filters.satisfyAll = []
    for (const [key, value] of Object.entries(selections)) {
      if (key === 'search') {
        Vue.set(state.filters.selections, key, value)
        continue
      }

      Vue.set(state.filters.selections, key, value)
      const leftoverLabels = [...new Set(state.filterLabelCache.filter(flc => value.includes(flc.value)).map(flc => flc.text))]
      Vue.set(state.filters.labels, key, leftoverLabels)
    }
  },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.filters.selections = {}
    state.filters.satisfyAll = []
  },
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  // TODO name more specifically
  SetDictionaries (state, response) {
    const collections = response.items.map(item => (
      {
        id: item.data.id,
        label: item.data.label || item.data.name,
        biobankName: item.data.biobank.data.label || item.data.biobank.data.name,
        commercialUse: item.data.collaboration_commercial
      }))

    collections.forEach(function (collection) {
      state.collectionBiobankDictionary[collection.id] = collection.biobankName
      state.collectionDictionary[collection.id] = collection.label
    })

    const newNonCommercialCollections = state.nonCommercialCollections.concat(collections.filter(collection => !collection.commercialUse).map(collection => collection.id))
    state.nonCommercialCollections = [...new Set(newNonCommercialCollections)]
  },
  SetQualityStandardDictionary (state, response) {
    // Combine arrays from two tables and deduplicate
    const allStandards = [...new Set(
      response.map(response => response.items)
        .reduce((prev, next) => prev.concat(next)))
    ]
    const qualityStandardsDictionary = {}

    allStandards.forEach((standard) => {
      qualityStandardsDictionary[standard.label] = standard.description || ''
    })

    state.qualityStandardsDictionary = qualityStandardsDictionary
  },
  SetCollectionInfo (state, response) {
    if (response === undefined) {
      state.collectionInfo = response
      return
    }

    const collectionInfo = response.items.map(item => ({
      collectionId: item.data.id,
      collectionName: item.data.label || item.data.name,
      biobankId: item.data.biobank.data.id,
      isSubcollection: item.data.parent_collection !== undefined
    }))
    state.collectionInfo = collectionInfo
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  SetBiobankReport (state, biobank) {
    state.biobankReport = biobank
  },
  SetCollectionReport (state, collection) {
    state.collectionReport = collection
  },
  SetNetworkReport (state, network) {
    state.networkReport.network = network
  },
  SetNetworkCollections (state, collections) {
    state.networkReport.collections = collections
  },
  SetNetworkBiobanks (state, biobanks) {
    state.networkReport.biobanks = biobanks
  },
  // methods for rehydrating bookmark
  SetCollectionIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.collectionIdsWithSelectedQuality = []
      state.collectionIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.collection.id))]
    } else {
      const collectionQualityFilter = state.filters.selections.collection_quality
      const isCollectionQualityFilterActive = (collectionQualityFilter && collectionQualityFilter.length > 0) || state.route.query.collection_quality

      state.collectionIdsWithSelectedQuality = isCollectionQualityFilterActive ? ['no-collection-found'] : []
    }
  },
  SetBiobankIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.biobankIdsWithSelectedQuality = []
      state.biobankIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.biobank.id))]
    } else {
      const biobankQualityFilter = state.filters.selections.biobank_quality
      const isBiobankQualityFilterActive = (biobankQualityFilter && biobankQualityFilter.length > 0) || state.route.query.biobank_quality

      state.biobankIdsWithSelectedQuality = isBiobankQualityFilterActive ? ['no-biobank-found'] : []
    }
  },
  AddCollectionsToSelection (state, { collections, router }) {
    const currentIds = state.selectedCollections.map(sc => sc.value)
    const newCollections = collections.filter(cf => !currentIds.includes(cf.value))
    state.selectedCollections = state.selectedCollections.concat(newCollections)

    if (router) {
      createBookmark(router, state.filters.selections, state.selectedCollections)
    }
  },
  RemoveCollectionsFromSelection (state, { collections, router }) {
    const collectionsToRemove = collections.map(c => c.value)
    state.selectedCollections = state.selectedCollections.filter(sc => !collectionsToRemove.includes(sc.value))

    if (router) {
      createBookmark(router, state.filters.selections, state.selectedCollections)
    }
  },
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state, ie11Query) {
    const query = ie11Query || state.route.query
    const keysInQuery = Object.keys(query)
    // we load the filterdefinitions, grab the names, so we can loop over it to map the selections
    const filters = filterDefinitions(state).map(fd => fd.name)
      .filter(name => keysInQuery.includes(name))
      .filter(fr => !['search', 'nToken'].includes(fr)) // remove specific filters, else we are doing them again.

    if (query.search) {
      Vue.set(state.filters.selections, 'search', query.search)
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }

    if (query.satisfyAll) {
      Vue.set(state.filters, 'satisfyAll', decodeURIComponent(query.satisfyAll).split(','))
    }

    if (query.cart) {
      const decoded = decodeURIComponent(query.cart)
      const cartIdString = atob(decoded)
      const cartIds = cartIdString.split(',')
      state.selectedCollections = cartIds.map(id => ({ label: state.collectionDictionary[id], value: id }))
    }

    for (const filterName of filters) {
      if (query[filterName]) {
        Vue.set(state.filters.selections, filterName, decodeURIComponent(query[filterName]).split(','))
      }
    }
    state.bookmarkMappedToState = true
  },
  SetError (state, error) {
    state.error = error
  },
  SetLoading (state, loading) {
    state.isLoading = loading
  },
  SetCurrentPage (state, currentPage) {
    state.currentPage = currentPage
  },
  SetPodium (state, response) {
    state.isPodium = response.items.map(item => item.id.toLowerCase()).some(id => id.includes('podium'))
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  },
  SetNegotiatorEntities (state, negotiatorConfig) {
    const negotiatorEntities = negotiatorConfig.items.map(nci => {
      return { id: nci.id, collectionEntityId: nci.entity.id, biobankEntityId: nci.biobankId.refEntityType.id } // We need to have the table
    }).filter(ne => negotiatorConfigIds.includes(ne.id))[0]

    if (negotiatorEntities) {
      state.negotiatorCollectionEntityId = negotiatorEntities.collectionEntityId
      state.negotiatorBiobankEntityId = negotiatorEntities.biobankEntityId
    }
  }
}
