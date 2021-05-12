import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NetworkCardsContainer from '@/components/cards/NetworkCardsContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('NetworkCardsContainer', () => {
  let networks = ['n1', 'n2', { id: 'n3' }]
  let store
  let loading = true

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        networks: () => networks,
        loading: () => loading,
        foundNetworks: () => networks.length
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(NetworkCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('<div class="network-cards-container">')
  })

  it('should show Loading if loading is true ', () => {
    const wrapper = shallowMount(NetworkCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('Loading data...')
  })

  it('should show network cards message if loading is false ', () => {
    loading = false
    networks = ['n1', 'n2', { id: 'n3' }]
    const wrapper = shallowMount(NetworkCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('<network-card')
    expect(wrapper.html()).not.toContain('<b-pagination')
  })

  it('should show pagination if number of networks > page size message if loading is false ', () => {
    loading = false
    networks = ['n1', 'n2', { id: 'n3' }]
    const data = () => {
      return {
        currentPage: 1,
        pageSize: 1
      }
    }
    const wrapper = shallowMount(NetworkCardsContainer, { data, store, localVue })
    expect(wrapper.html()).toContain('<network-card')
    expect(wrapper.html()).toContain('<b-pagination')
  })

  it('should show "No networks were found" if loading is false and network length is 0', () => {
    loading = false
    networks = []
    const wrapper = shallowMount(NetworkCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('No networks were found')
  })

  it('should set networkShown and networkIds to empty list if loading is true', () => {
    loading = true
    networks = []
    const wrapper = shallowMount(NetworkCardsContainer, { store, localVue })
    expect(wrapper.vm.networksShown).toEqual([])
    expect(wrapper.vm.networkIds).toEqual([])
  })

  it('should set networksShown to a subset of networks if loading is false', () => {
    loading = false
    networks = ['n1', 'n2', { id: 'n3' }]
    const data = () => {
      return {
        currentPage: 1,
        pageSize: 1
      }
    }
    const wrapper = shallowMount(NetworkCardsContainer, { data, store, localVue })
    expect(wrapper.vm.networksShown).toEqual(['n1'])
  })

  it('should reset the currentPage to 1 when the biobanks list changes', () => {
    loading = false
    networks = ['n1', 'n2', { id: 'n3' }]
    const wrapper = shallowMount(NetworkCardsContainer, {
      store,
      computed: {
        networks () {
          return networks
        }
      },
      localVue
    })
    wrapper.setData({ currentPage: 5 })
    expect(wrapper.vm.currentPage).toEqual(5)
    // see https://github.com/vuejs/vue-test-utils/issues/331 for details
    wrapper.vm.$options.watch.networkIds.call(wrapper.vm, ['n1'], ['n2'])
    expect(wrapper.vm.currentPage).toEqual(1)

    wrapper.setData({ currentPage: 5 })
    expect(wrapper.vm.currentPage).toEqual(5)

    wrapper.vm.$options.watch.networkIds.call(wrapper.vm, ['n1', 'n3'], ['n2'])
    expect(wrapper.vm.currentPage).toEqual(1)
  })
})
