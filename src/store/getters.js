import { createRSQLQuery, createBiobankRSQLQuery, createNetworkRSQLQuery, filterCollectionTree, getActiveFilters } from './helpers'
import { groupCollectionsByBiobankId, groupBiobanksByNetworkId } from '../utils/grouping'
import filterDefinitions from '../utils/filterDefinitions'

export default {
  filterDefinitions,
  bookmarkMappedToState: state => state.bookmarkMappedToState,
  loading: ({ viewMode, collectionInfo, biobankIds, networkIds, biobankInANetwork }) => {
    if (viewMode === 'biobankview') {
      return !(biobankIds && collectionInfo)
    } else {
      return !(networkIds && biobankInANetwork && collectionInfo)
    }
  },
  biobanks: ({ collectionInfo, biobankIds, biobanks }, { loading, rsql }) => {
    if (loading) {
      return []
    }
    let ids = biobankIds
    if (rsql && rsql.length) {
      ids = collectionInfo
      // biobank IDs present in collectionIds
        .map(({ biobankId }) => biobankId)
      // also present in biobankIds
        .filter(biobankId => biobankIds.includes(biobankId))
      // first occurrence of ID only
        .filter((value, index, self) => self.indexOf(value) === index)
    }
    return ids.map(biobankId => {
      if (!Object.prototype.hasOwnProperty.call(biobanks, biobankId)) {
        return biobankId
      }
      const biobank = biobanks[biobankId]
      return {
        ...biobank,
        collections: filterCollectionTree(collectionInfo.map(it => it.collectionId), biobank.collections)
      }
    })
  },
  parentCollections: (state) => {
    const allParentCollections = state.collectionInfo.filter(colInfo => !colInfo.isSubcollection).map(fci => fci.collectionId)
    let flattenedCollections = []
    allParentCollections.forEach(function (apc) {
      flattenedCollections = flattenedCollections.concat(apc)
    })
    return flattenedCollections
  },
  collectionBiobankDictionary: state => state.collectionBiobankDictionary,
  collectionDictionary: state => state.collectionDictionary,
  getFoundBiobankIds: (_, { biobanks }) => biobanks.map(b => b.id || b).filter(bid => bid !== undefined),
  foundBiobanks: (_, { biobanks }) => {
    return biobanks.length
  },
  foundCollectionIds (state, { getFoundBiobankIds }) {
    // only if there are biobanks, then there are collections. we can't have rogue collections :)
    if (getFoundBiobankIds.length && state.collectionInfo.length) {
      const biobanksWithCollections = groupCollectionsByBiobankId(state.collectionInfo)

      let collectionIds = []
      for (const id of getFoundBiobankIds) {
        const collectionsInBiobank = biobanksWithCollections[id]
        if (collectionsInBiobank) collectionIds = collectionIds.concat(collectionsInBiobank)
      }
      return collectionIds
    }
    return []
  },
  selectedNonCommercialCollections (state, { selectedCollections }) {
    const selectedNonCommercialCollections = selectedCollections.map(sc => sc.value).filter(sid => state.nonCommercialCollections.includes(sid))
    return selectedNonCommercialCollections.length
  },
  foundCollectionsAsSelection: (_, { parentCollections, foundCollectionIds, collectionDictionary }) => {
    const parentCollectionIds = foundCollectionIds.filter(fci => parentCollections.includes(fci))
    return parentCollectionIds.map(colId => ({ label: collectionDictionary[colId], value: colId }))
  },
  collectionsInPodium ({ podiumCollectionIds, collectionInfo, isPodium }, { foundCollectionIds, selectedCollections }) {
    if (isPodium && podiumCollectionIds && collectionInfo && foundCollectionIds) {
      const selectedCollectionIds = selectedCollections.map(sc => sc.value)
      const collectionInfoInSelection = collectionInfo.filter(colInfo => foundCollectionIds.includes(colInfo.collectionId))

      const collectionNames = collectionInfoInSelection.filter(colInfo => podiumCollectionIds
        .includes(colInfo.collectionId))
        .map(podCols => ({ label: podCols.collectionName, value: podCols.collectionId }))
        .filter(cn => selectedCollectionIds.includes(cn.value))

      return collectionNames
    } else return []
  },
  selectedCollections: state => state.selectedCollections,
  allCollectionsSelected: (_, { parentCollections, selectedCollections }) => {
    // if we don't have any selections present in our cart
    if (selectedCollections.length === 0) return false

    const selectedCollectionIds = selectedCollections.map(sc => sc.value)
    // parent collections are the collections currently shown based on filters, compared to the cart
    const allIdsPresentInSelection = parentCollections.every(cid => selectedCollectionIds.includes(cid))

    return allIdsPresentInSelection
  },
  selectedBiobankInNetwork: state => state.filters.selections.biobank_network,
  selectedBiobankQuality: state => state.filters.selections.biobank_quality,
  selectedCollectionQuality: state => {
    return state.filters.selections.collection_quality
  },
  rsql: createRSQLQuery,
  biobankRsql: createBiobankRSQLQuery,
  networkRsql: createNetworkRSQLQuery,
  resetPage: state => !state.isPaginating,
  showCountryFacet: state => state.showCountryFacet,
  /**
   * Get map of active filters
   */
  activeFilters: (state, { filterDefinitions }) => {
    // Select only the filters that are to be displayed in the current view mode
    return getActiveFilters(state, filterDefinitions)
  },
  getErrorMessage: state => {
    if (!state.error) {
      return undefined
    }
    if (state.error.errors) {
      return state.error.errors[0].message
    }
    if (state.error.message) {
      return state.error.message
    }
    return 'Something went wrong'
  },
  networks: ({ collectionInfo, biobankInfo, networks, networkIds }, { biobanks, loading }) => {
    if (loading) {
      return []
    }
    const biobanksByNetwork = groupBiobanksByNetworkId(biobanks, biobankInfo)
    return networkIds.map(networkId => {
      if (!Object.prototype.hasOwnProperty.call(networks, networkId)) {
        return networkId
      }
      // Filters the collections to keep only the ones that are part of the network.
      // Notice that if it's one subcollection to be part of the network the collection appears but only with the subcollection
      if (biobanksByNetwork[networkId] !== undefined) {
        biobanksByNetwork[networkId].forEach(biobank => {
          if (typeof biobank === 'object') { // Is it an object with all information needed or is it a string?
            // If the biobank is directly part of the network all its collections are included so nothing to do
            if (!biobank.network.map(network => network.id).includes(networkId)) {
              // Get the ids of the collections to keep: they are the ones of the collection in the biobank and in the network
              const collectionsInNetwork = collectionInfo.filter(
                collectionInfo => collectionInfo.biobankId === biobank.id && collectionInfo.networkIds.includes(networkId)
              ).map(collectionInfo => collectionInfo.collectionId)
              // Filters the collections
              biobank.collections = filterCollectionTree(collectionsInNetwork, biobank.collections)
            }
          }
        })
      }
      const network = networks[networkId]
      return {
        ...network,
        biobanks: biobanksByNetwork[networkId] || []
      }
    })
  },
  foundNetworks: ({ networkIds }) => {
    return networkIds ? networkIds.length : 0
  },
  viewMode: ({ viewMode }) => viewMode
}
