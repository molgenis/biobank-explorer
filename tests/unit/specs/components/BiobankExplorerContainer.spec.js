import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankExplorerContainer from '@/components/BiobankExplorerContainer'
import BootstrapVue from 'bootstrap-vue'
import { mockState } from '../mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

/**
 * We're not doing unittests here, but focus on the shopping cart & podium modal because those
 * parts are the most complex.
 */
describe('BiobankExplorerContainer', () => {
  let store
  const collectionsWithBiobank = [{ collectionId: 'A', biobankId: 'B', collectionName: 'Collection A' },
    { collectionId: 'C', biobankId: 'B', collectionName: 'Collection C' }, { collectionId: 'D', biobankId: 'E', collectionName: 'Collection D' }]

  const rsqlMock = jest.fn().mockReturnValue('')
  // const networkRsqlMock = jest.fn().mockReturnValue('')
  const podiumCollectionsMock = jest.fn().mockReturnValue([])
  const selectedCollectionMock = jest.fn().mockReturnValue([])
  const foundCollectionsAsSelectionMock = jest.fn()
  const AddCollectionsToSelectionMock = jest.fn()
  const allCollectionsSelectedMock = jest.fn()
  const MapQueryToStateMock = jest.fn()
  const GetNetworkInfo = jest.fn()
  const GetBiobankIds = jest.fn()
  const GetCollectionInfo = jest.fn()
  const SetViewMode = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      state: mockState(),
      getters: {
        rsql: rsqlMock,
        activeFilters: () => {},
        biobankRsql: () => '',
        selectedBiobankQuality: () => [],
        selectedCollectionQuality: () => [],
        selectedCollections: selectedCollectionMock,
        foundCollectionIds: () => collectionsWithBiobank.map(cb => cb.collectionsWithBiobank),
        loading: () => false,
        allCollectionsSelected: allCollectionsSelectedMock,
        collectionsInPodium: podiumCollectionsMock,
        foundCollectionsAsSelection: foundCollectionsAsSelectionMock,
        collectionBiobankDictionary: () => [],
        ie11Bookmark: jest.fn().mockReturnValue('http://mytest.org/#/?materials=CDNA&cart=YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5')
      },
      mutations: {
        AddCollectionsToSelection: AddCollectionsToSelectionMock,
        MapQueryToState: MapQueryToStateMock,
        SetViewMode: SetViewMode
      },
      actions: {
        SendToNegotiator: jest.fn(),
        GetBiobankIds: GetBiobankIds,
        GetPodiumCollections: jest.fn(),
        GetCollectionInfo: GetCollectionInfo,
        GetBiobankIdsForQuality: jest.fn(),
        GetCollectionIdsForQuality: jest.fn(),
        GetNetworkInfo: GetNetworkInfo
      }
    })
    GetNetworkInfo.mockReset()
    GetBiobankIds.mockReset()
    GetCollectionInfo.mockReset()
    SetViewMode.mockReset()
  })

  it('should not render cart when no selection is made', () => {
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).not.toContain('cart-selection-toast')
  })

  it('should render biobank-card-container if the view mode is biobankview or undefined', () => {
    let wrapper = shallowMount(BiobankExplorerContainer, { propsData: { mode: 'biobankview' }, store, localVue })
    expect(wrapper.html()).toContain('<biobank-cards-container-stub>')

    wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).toContain('<biobank-cards-container-stub>')
  })

  it('should render network-card-container if the view mode is networkview', () => {
    const wrapper = shallowMount(BiobankExplorerContainer, { propsData: { mode: 'networkview' }, store, localVue })
    expect(wrapper.html()).toContain('<network-cards-container-stub>')
  })

  it('should render cart when one more more items are selected', async () => {
    selectedCollectionMock.mockReturnValueOnce(['a', 'b', 'c'])
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).toContain('3 collection(s) selected')
  })

  it('should trigger GetNetworkInfo if the view mode is networkview', async () => {
    shallowMount(BiobankExplorerContainer, { propsData: { mode: 'networkview' }, store, localVue })
    expect(SetViewMode.mock.calls[0]).toEqual([store.state, 'networkview'])
    expect(GetNetworkInfo.mock.calls.length).toEqual(1)
    expect(GetBiobankIds.mock.calls.length).toEqual(0)
    expect(GetCollectionInfo.mock.calls.length).toEqual(0)
  })

  it('should trigger GetBiobankIds and GetCollectionInfo if the view mode is biobankview', async () => {
    shallowMount(BiobankExplorerContainer, { propsData: { mode: 'biobankview' }, store, localVue })
    expect(SetViewMode.mock.calls[0]).toEqual([store.state, 'biobankview'])
    expect(GetNetworkInfo.mock.calls.length).toEqual(0)
    expect(GetBiobankIds.mock.calls.length).toEqual(1)
    expect(GetCollectionInfo.mock.calls.length).toEqual(1)
  })

  describe('Podium logic', () => {
    it('should show "no podium collections" message when there are no podium collections and isPodium is true', () => {
      selectedCollectionMock.mockReturnValueOnce(['a', 'b', 'c'])
      store.state.isPodium = true

      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })

      wrapper.vm.showSelection()
      wrapper.vm.$nextTick()

      expect(wrapper.html()).toContain('Sorry, none of the samples are currently in Podium.')
    })

    it('should render a list of names of collections which are in podium', () => {
      rsqlMock.mockReturnValueOnce('rsql-query')
      store.state.isPodium = true
      podiumCollectionsMock.mockReturnValueOnce([{ label: 'Collection A', value: 'A' }, { label: 'Collection D', value: 'D' }])

      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })

      wrapper.vm.sendRequest()
      wrapper.vm.$nextTick()
      expect(wrapper.html()).toContain('Collection A')
      expect(wrapper.html()).toContain('Collection D')
    })

    it('should render podium specific modal footer when podium is active', () => {
      store.state.isPodium = true
      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
      expect(wrapper.vm.modalFooterText).toEqual('0 collection(s) present in Podium')
    })
  })

  describe('IE11 Bookmark logic', () => {
    it('Should map a IE11 bookmark to the state', () => {
      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
      wrapper.setData({ ie11BookmarkToApply: 'http://mytest.org/#/?materials=CDNA&cart=YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5' })
      wrapper.vm.applyIE11Bookmark()
      expect(MapQueryToStateMock).toHaveBeenCalledWith(expect.anything(), { cart: 'YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5', materials: 'CDNA' })
    })
  })
})
