import { INITIAL_STATE } from '../store/state'
/**
 * Generate the attribute selector for quality parameters (can be either for collection or for biobank)
 * */
const qualityAttributeSelector = (type) => {
  return `quality(id,standards(*),assess_level_${type}(*),certification_number,certification_image_link,certification_report,label)`
}

/**
 * Create an RSQL 'in' query for filters
 *
 * @example in query for country filter
 * country=in=(NL,BE,DE)
 */
export const createInQuery = (attribute, filters) => filters.length > 0
  ? [{ selector: attribute, comparison: '=in=', arguments: filters }]
  : []

/**
 * Create an array of == comparisons for each filter value
 */
export const createComparisons = (attribute, filters) =>
  filters.map(filterValue => ({ selector: attribute, comparison: '==', arguments: filterValue }))

/**
 * Return an Array of unique identifiers
 *
 * @param list List of strings
 * @returns Array containing unique string values
 */
export const getUniqueIdArray = (list) => {
  return Array.from(new Set(list))
}

/**
 * Return an Array of Filter IDs without the selectedFilterId
 */
export const removeFilterFromFilterArrayById = (filters, selectedFilterId) => {
  return filters.filter(filter => filter.id !== selectedFilterId).map(filter => filter.id)
}

/**
 * Return the whole base url comprising protocol, host, and base path of the application.
 */
export const getBaseUrl = () => {
  const baseUrl = INITIAL_STATE.baseUrl || ''
  return `${window.location.protocol}//${window.location.host}${baseUrl}/#`
}

export const arrayEqual = (a, b) => {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index])
}

export default {
  getUniqueIdArray,
  createInQuery,
  createComparisons,
  removeFilterFromFilterArrayById,
  qualityAttributeSelector,
  getBaseUrl,
  arrayEqual
}
