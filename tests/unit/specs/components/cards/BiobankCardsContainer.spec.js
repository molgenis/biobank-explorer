import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankCardsContainer from '@/components/cards/BiobankCardsContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BiobankCardsContainer', () => {
  let store
  const globalBiobanks = ['b1', 'b2', { id: 'b3' }]
  let activeFilters = { filter1: 'foobar' }
  let viewMode = 'biobankview'
  let loading = true
  const GetBiobanks = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      commit: jest.fn(),
      state: {},
      actions: {
        GetBiobanks: GetBiobanks
      },
      getters: {
        biobanks: () => globalBiobanks,
        loading: () => loading,
        activeFilters: () => activeFilters,
        foundBiobanks: () => globalBiobanks.length,
        viewMode: () => viewMode
      }
    })
    GetBiobanks.mockReset()
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('<div class="biobank-cards-container">')
  })

  it('should reset the currentPage to 1 when the biobanks list changes', () => {
    activeFilters = {}
    const wrapper = shallowMount(BiobankCardsContainer, {
      store,
      computed: {
        globalBiobanks () {
          return globalBiobanks
        }
      },
      localVue
    })
    wrapper.setData({ currentPage: 5 })
    expect(wrapper.vm.currentPage).toEqual(5)
    // see https://github.com/vuejs/vue-test-utils/issues/331 for details
    wrapper.vm.$options.watch.biobankIds.call(wrapper.vm, ['id1'], ['id2'])
    expect(wrapper.vm.currentPage).toEqual(1)
  })

  it('should fetchbiobanks if biobankIdsFetch change', () => {
    const wrapper = shallowMount(BiobankCardsContainer, {
      store,
      localVue
    })

    wrapper.vm.$options.watch.biobankIdsToFetch.call(wrapper.vm, ['id1'])
    expect(GetBiobanks.mock.calls.length).toEqual(1)
    expect(GetBiobanks.mock.calls[0][1]).toEqual(['id1'])
  })

  it('should use global biobanks if props.biobanks is undefined', () => {
    loading = false

    const wrapper = shallowMount(BiobankCardsContainer, {
      store,
      localVue
    })

    expect(wrapper.vm.biobanksShown).toEqual(globalBiobanks)
    expect(wrapper.vm.biobankIdsToFetch).toEqual(['b1', 'b2'])
    expect(wrapper.vm.numberOfBiobanks).toEqual(3)
  })

  it('should fetch biobanks at mount in networkview', () => {
    viewMode = 'networkview'
    shallowMount(BiobankCardsContainer, {
      store,
      computed: {
        globalBiobanks () {
          return globalBiobanks
        }
      },
      localVue
    })
    expect(GetBiobanks.mock.calls.length).toEqual(1)
    expect(GetBiobanks.mock.calls[0][1]).toEqual(['b1', 'b2'])
  })

  it('should use the biobanks in props and not the global ones if they are given in input', () => {
    viewMode = 'networkview'
    loading = false

    const wrapper = shallowMount(BiobankCardsContainer, {
      propsData: {
        biobanks: ['e1', { id: 'e2' }]
      },
      store,
      localVue
    })
    expect(wrapper.vm.biobanksShown).toEqual(['e1', { id: 'e2' }])
    expect(wrapper.vm.biobankIdsToFetch).toEqual(['e1'])
    expect(wrapper.vm.numberOfBiobanks).toEqual(2)
  })
})
