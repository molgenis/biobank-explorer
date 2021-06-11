import { shallowMount } from '@vue/test-utils'
import NetworkCard from '@/components/cards/NetworkCard'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

describe('NetworkCard', () => {
  let propsData, stubs

  beforeEach(() => {
    propsData = {
      network: {
        biobanks: [{
          id: 'biobank-1',
          collections: [{
            name: 'z',
            type: [{ label: 'col-type-a' }],
            sub_collections: [{
              type: [{ label: 'col-type-b' }],
              sub_collections: []
            }]
          },
          {
            name: 'a',
            type: [{ label: 'col-type-d' }],
            sub_collections: [{
              type: [{ label: 'col-type-e' }],
              sub_collections: []
            }]
          }]
        },
        'biobank2']
      }
    }

    stubs = ['router-link', 'router-view']
  })

  it('should initialize the collapsed prop to true if none is passed', () => {
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    expect(wrapper.props().initCollapsed).toBe(true)
  })

  it('should use the passed collapsed setting if passed', () => {
    propsData.initCollapsed = false
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    expect(wrapper.props().initCollapsed).toBe(false)
  })

  it('should expose the number of biobanks of the network', () => {
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    expect(wrapper.html()).toContain(
      '<small class="mr-2">' +
        '<span class="font-weight-bold">Number of biobanks:</span>' +
      '</small> ' +
      '<small>2</small>')
  })

  it('should not be loading if the network is an object', () => {
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    expect(wrapper.vm.loading).toBe(false)
  })

  it('should not be loading if the network is a string', () => {
    propsData.network = 'network 1'
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    expect(wrapper.vm.loading).toBe(true)
  })

  it('should show the biobank-cards-container if not collapsed and not loading', () => {
    propsData.initCollapsed = false
    const wrapper = shallowMount(NetworkCard, { propsData, stubs })
    // wrapper.setData({ collapsed: false })
    expect(wrapper.html()).toContain('<biobank-cards-container-stub')
  })
})
