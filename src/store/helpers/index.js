import api from '@molgenis/molgenis-api-client'
import { createInQuery, createComparisons } from '../../utils'
import { flatten } from 'lodash'
import { transformToRSQL, encodeRsqlValue } from '@molgenis/rsql'

export const isCodeRegex = /^([A-Z]|[XVI]+)(\d{0,2}(-([A-Z]\d{0,2})?|\.\d{0,3})?)?$/i

/**
 * @example queries
 * q=country.id=in=(NL,BE)
 * q=materials.id=in=(RNA,DNA)
 * q=diagnosis_available.code=in=(C18,L40)
 * q=standards.id=in=(cen-ts-16835-1-2015,cen-ts-16827-1-2015)
 */
export const createRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    createInQuery('country', state.filters.selections.country || []),
    createInQuery('materials', state.filters.selections.materials || []),
    createInQuery('type', state.filters.selections.type || []),
    createInQuery('data_categories', state.filters.selections.dataType || []),
    createInQuery('diagnosis_available', state.filters.selections.diagnosis_available || []),
    createInQuery('id', state.collectionIdsWithSelectedQuality),
    createInQuery('commercial', state.filters.selections.commercial_use || []),
    createInQuery('network', state.filters.selections.collection_network || []),
    state.filters.selections.search ? [{
      operator: 'OR',
      operands: ['name', 'id', 'acronym', 'biobank.name', 'biobank.id', 'biobank.acronym']
        .map(attr => ({ selector: attr, comparison: '=q=', arguments: state.filters.selections.search || '' }))
    }] : []
  ])
})

export const createBiobankRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    createInQuery('country', state.filters.selections.country || []),
    createInQuery('id', state.biobankIdsWithSelectedQuality),
    createInQuery('network', state.filters.selections.biobank_network || []),
    createComparisons('covid19biobank', state.filters.selections.covid19 || [])
  ])
})

const createNegotiatorQueryBody = async (state, getters, url) => {
  const result = {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    entityId: state.negotiatorCollectionEntityId,
    humanReadable: await getHumanReadableString(state, getters),
    nToken: state.nToken
  }

  const collections = state.isPodium ? getters.collectionsInPodium : getters.selectedCollections
  result.rsql = transformToRSQL({ operator: 'AND', operands: createInQuery('id', collections.map(sc => sc.value)) })
  result.humanReadable += result.humanReadable.length ? ' and with custom collection selection.' : 'Custom collection selection.'

  return result
}

const getHumanReadableString = async (state, { filterDefinitions, activeFilters }) => {
  let humanReadableString = ''
  const additionText = ' and '

  const filterNegotiatorLabelsDictionary = {}
  const filterLabels = state.filters.labels

  for (const fd of filterDefinitions) {
    filterNegotiatorLabelsDictionary[fd.name] = fd.humanReadableString
    if (!filterLabels[fd.name] && activeFilters[fd.name] && fd.name !== 'search') {
      const url = `/api/v2/${fd.table}?attrs=*&q=${encodeRsqlValue(`id=in=(${activeFilters[fd.name].join(',')})`)}`
      const { items } = await api.get(url)

      filterLabels[fd.name] = fd.name === 'diagnosis_available' ? items.map((obj) => `[ ${obj.code} ] - ${obj.label || obj.name}`) : items.map((obj) => obj.label || obj.name)
    }
  }

  for (const [filterName, filterValue] of Object.entries(state.filters.selections)) {
    if (!filterValue) continue
    humanReadableString += filterNegotiatorLabelsDictionary[filterName]
    if (filterName === 'search') {
      humanReadableString += ` ${filterValue}`
    } else {
      humanReadableString += ` ${filterLabels[filterName].join(',')}`
    }
    humanReadableString += additionText
  }

  if (humanReadableString === '') return humanReadableString

  return humanReadableString.substr(0, humanReadableString.length - additionText.length)
}

const setLocationHref = (href) => { window.location.href = href }
const getLocationHref = () => window.location.href

const fixSubCollectionTree = (collections, collectionId) => {
  const collection = collections.find(c => c.id === collectionId)
  const subCollections = collection.sub_collections
    .map(subCollection => fixSubCollectionTree(collections, subCollection.id))
  return {
    ...collection,
    sub_collections: subCollections
  }
}
export const fixCollectionTree = (biobank) => ({
  ...biobank,
  collections: biobank.collections
    .filter(collection => !collection.parent)
    .map(collection => fixSubCollectionTree(biobank.collections, collection.id))
})

export const filterCollectionTree = (collectionIds, collections) =>
  collections.reduce(
    (accumulator, collection) => {
      const filteredSubCollections = filterCollectionTree(collectionIds, collection.sub_collections)
      if (collectionIds.includes(collection.id) || filteredSubCollections.length) {
        return [...accumulator, { ...collection, sub_collections: filteredSubCollections }]
      }
      return accumulator
    }, [])

export default {
  createRSQLQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  setLocationHref,
  getLocationHref
}
