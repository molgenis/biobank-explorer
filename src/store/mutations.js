export const SET_COUNTRIES = '__SET_COUNTRIES__'
export const SET_MATERIALS = '__SET_MATERIALS__'
export const SET_STANDARDS = '__SET_STANDARDS__'
export const SET_DIAGNOSIS_AVAILABLE = '__SET_DIAGNOSIS_AVAILABLE__'
export const UPDATE_FILTER = '__UPDATE_FILTER__'
export const SET_BIOBANKS = '__SET_BIOBANKS__'
export const SET_FILTER = '__SET_FILTER__'
export const SET_ERROR = '__SET_ERROR__'
export const SET_SEARCH = '__SET_SEARCH__'
export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'
export const SET_LOADING = '__SET_LOADING__'

export default {
  /**
   * Update the options for the different filters available in the biobank explorer
   */
  [SET_COUNTRIES] (state, countries) {
    state.country.options = countries
  },
  [SET_MATERIALS] (state, materials) {
    state.materials.options = materials
  },
  [SET_STANDARDS] (state, standards) {
    state.standards.options = standards
  },
  [SET_DIAGNOSIS_AVAILABLE] (state, diagnoses) {
    state.diagnosis_available.options = diagnoses
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  [UPDATE_FILTER] (state, {name, filters}) {
    state[name].filters = filters
  },
  [SET_BIOBANKS] (state, biobanks) {
    state.biobanks = biobanks
  },
  [SET_FILTER] (state, {name, newSelectedOptions}) {
    state.filters[name].selectedOptions = newSelectedOptions
  },
  [SET_ERROR] (state, error) {
    state.error = error
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [MAP_QUERY_TO_STATE] (state, query) {
    if (query.search) state.search = query.search
    if (query.countries) state.filters.countries.selectedOptions = query.countries.split(',')
    if (query.materialTypes) state.filters.material_types.selectedOptions = query.materialTypes.split(',')
    if (query.quality) state.filters.quality.selectedOptions = query.quality.split(',')
    if (query.diseaseTypes) state.filters.disease_types.selectedOptions = query.diseaseTypes.split(',')
    if (query.nToken) state.nToken = query.nToken
  },
  [SET_LOADING] (state, loading) {
    state.loading = loading
  }
}
