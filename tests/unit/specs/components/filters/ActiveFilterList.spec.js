import ActiveFilterList from '@/components/filters/ActiveFilterList'
import { ActiveFilters } from '@molgenis-ui/components-library'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockData'
import filterDefinitions from '../../../../../src/utils/filterDefinitions'
const localVue = createLocalVue()
localVue.use(Vuex)

describe('ActiveFilterList', () => {
  let store, wrapper, getters, mutations
  const UpdateAllFilters = jest.fn()

  beforeEach(() => {
    getters = {
      showCountryFacet: () => true,
      activeFilters: () => [],
      filterDefinitions,
      selectedCollections: () => []
    }

    mutations = {
      UpdateAllFilters: UpdateAllFilters
    }
  })

  describe('filters', () => {
    it('should include the country filters if showCountryFacet is set to true', () => {
      store = new Vuex.Store({
        state: mockState(),
        mutations,
        getters
      })
      wrapper = shallowMount(ActiveFilterList, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country').name).toEqual('country')
    })

    it('should exclude the country filters if showCountryFacet is set to false', () => {
      getters.showCountryFacet = () => false
      store = new Vuex.Store({
        state: mockState(),
        mutations,
        getters
      })
      wrapper = shallowMount(ActiveFilterList, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country')).toEqual(undefined)
    })

    it('should update all filters when the active filters channge', () => {
      store = new Vuex.Store({
        state: mockState(),
        mutations,
        getters
      })
      const newActiveFilters = { materials: ['DNA'], dataType: ['something'] }
      wrapper = shallowMount(ActiveFilterList, { store, localVue })

      wrapper.findComponent(ActiveFilters).vm.$emit('input', newActiveFilters)
      expect(UpdateAllFilters.mock.calls[0][1]).toEqual({ materials: ['DNA'], dataType: ['something'] })
    })
  })
})
