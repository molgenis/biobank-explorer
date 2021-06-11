<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row mb-3">
        <collection-select-all
          v-if="!loading && foundCollectionIds.length"
          class="mt-1 ml-3"
          router-enabled
        />
        <div class="col-md-8">
          <div v-if="isIE11">
            <input
              class="w-50 mr-2 p-1"
              type="text"
              v-model="ie11BookmarkToApply"
              placeholder="Place your recieved bookmark here"
            /><input
              type="button"
              class="btn btn-sm btn-secondary"
              @click="applyIE11Bookmark"
              value="Apply"
              :disabled="!ie11BookmarkToApply"
            />
            <div class="mt-1">
              <input
                class="w-50 d-inline p-1"
                id="ie11bookmark"
                :value="ie11Bookmark"
                placeholder="Your current bookmark"
              />
              <button
                class="btn btn-sm btn-success ml-2 d-inline"
                @click="copyIE11Bookmark"
                :disabled="!ie11Bookmark"
              >
                Copy<span class="fa fa-copy ml-1"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4"></div>
      </div>
      <div class="row">
        <div class="col-md-12" v-if="!loading">
          <result-header></result-header>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <network-cards-container v-if="mode === 'networkview'"></network-cards-container>
          <biobank-cards-container v-else></biobank-cards-container>
        </div>
      </div>
    </div>

    <cart-selection-toast
      v-if="
        !loading &&
        hasSelection &&
        !collectionCartShown &&
        this.foundCollectionIds.length
      "
      :cartSelectionText="`${this.selectedCollections.length} collection(s) selected`"
      :clickHandler="showSelection"
      :title="negotiatorButtonText"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText> Show selection </template>
    </cart-selection-toast>

    <b-modal
      hide-header
      id="collectioncart-modal"
      size="lg"
      scrollable
      centered
      body-bg-variant="white"
      footer-bg-variant="warning"
      body-class="pb-0"
      @hide="closeModal"
    >
      <template v-if="collectionCart.length > 0">
        <div
          class="card mb-3 border"
          :key="`${cart.biobankLabel}-${index}`"
          v-for="(cart, index) in collectionCart"
        >
          <div class="card-header font-weight-bold">{{ cart.biobankLabel }}</div>
          <div class="collection-cart">
            <div
              class="card-body d-flex border-bottom"
              :key="`${collection.label}-${index}`"
              v-for="(collection, index) in cart.collections"
            >
              <div>
                <font-awesome-icon
                  title="Not available for commercial use"
                  v-if="isNonCommercialCollection(collection.value)"
                  class="text-danger non-commercial mr-1"
                  :icon="['fab', 'creative-commons-nc-eu']"
                />
                <span> {{ collection.label }}</span>
              </div>
              <div class="pl-3 ml-auto">
                <span
                  class="fa fa-times text-bold remove-collection"
                  title="Remove collection"
                  @click="
                    RemoveCollectionsFromSelection({
                      collections: [collection],
                      router: $router,
                    })
                  "
                ></span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <p v-if="isPodium && !collectionsInPodium.length">
        Sorry, none of the samples are currently in Podium.
      </p>
      <template v-slot:modal-footer>
        <b-button class="btn btn-dark mr-auto" @click="removeAllCollections"
          >Remove all</b-button
        >
        <div>
          <span class="text-white font-weight-bold d-block">{{
            modalFooterText
          }}</span>
          <span class="text-white" v-if="selectedNonCommercialCollections > 0">
            <font-awesome-icon
              title="Not available for commercial use"
              class="text-white non-commercial mr-1"
              :icon="['fab', 'creative-commons-nc-eu']"
            />
            {{ selectedNonCommercialCollections }} are non-commercial only
          </span>
        </div>
        <div class="ml-auto">
          <b-button class="btn btn-dark mr-2" @click="hideModal"
            >Cancel</b-button
          >
          <b-button
            :disabled="
              (isPodium && !collectionsInPodium.length) ||
              !selectedCollections.length
            "
            class="btn btn-secondary ml-auto"
            @click="sendRequest"
            >{{ negotiatorButtonText }}</b-button
          >
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { CartSelectionToast } from '@molgenis-ui/components-library'
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import NetworkCardsContainer from './cards/NetworkCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { createBookmark } from '../utils/bookmarkMapper'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll.vue'

export default {
  name: 'biobank-explorer-container',
  props: {
    mode: {
      type: String,
      default: 'biobankview'
    }
  },
  components: {
    BiobankCardsContainer,
    NetworkCardsContainer,
    FilterContainer,
    ResultHeader,
    CartSelectionToast,
    CollectionSelectAll
  },
  data: () => {
    return {
      modalEnabled: false,
      ie11BookmarkToApply: ''
    }
  },
  computed: {
    ...mapGetters([
      'rsql',
      'biobankRsql',
      'networkRsql',
      'loading',
      'foundCollectionIds',
      'activeFilters',
      'collectionsInPodium',
      'selectedBiobankInNetwork',
      'selectedBiobankQuality',
      'selectedCollectionQuality',
      'selectedCollections',
      'collectionBiobankDictionary',
      'foundCollectionsAsSelection',
      'selectedNonCommercialCollections'
    ]),
    ...mapState([
      'isPodium',
      'nonCommercialCollections',
      'isIE11',
      'ie11Bookmark'
    ]),
    modalFooterText () {
      const collectionCount = this.isPodium
        ? this.collectionsInPodium.length
        : this.selectedCollections.length
      return this.isPodium
        ? `${collectionCount} collection(s) present in Podium`
        : `${collectionCount} collection(s) selected`
    },
    negotiatorButtonText () {
      return this.isPodium ? 'Send to Podium' : 'Send to the negotiator'
    },
    collectionCartShown () {
      return this.modalEnabled
    },
    currentSelectedCollections () {
      return this.isPodium ? this.collectionsInPodium : this.selectedCollections
    },
    collectionCart () {
      return this.groupCollectionsByBiobank(this.currentSelectedCollections)
    },
    hasSelection () {
      return this.selectedCollections.length > 0
    }
  },
  watch: {
    selectedBiobankInNetwork: {
      immediate: false,
      handler: 'GetBiobankIdsInNetwork'
    },
    selectedBiobankQuality: {
      immediate: true,
      handler: 'GetBiobankIdsForQuality'
    },
    selectedCollectionQuality: {
      immediate: true,
      handler: 'GetCollectionIdsForQuality'
    },
    rsql: {
      immediate: false,
      handler: 'GetCollectionInfo'
    },
    biobankRsql: {
      immediate: false,
      handler: 'GetBiobankIds'
    },
    networkRsql: {
      immediate: false,
      handler: 'GetNetworkInfo'
    },
    isPodium: {
      immediate: true,
      handler: 'GetPodiumCollections'
    }
  },
  methods: {
    ...mapMutations(['RemoveCollectionsFromSelection', 'MapQueryToState', 'SetViewMode']),
    ...mapActions([
      'GetCollectionInfo',
      'GetBiobankIds',
      'GetNetworkInfo',
      'GetPodiumCollections',
      'GetBiobankIdsForQuality',
      'GetCollectionIdsForQuality',
      'GetBiobankIdsInNetwork'
    ]),
    isNonCommercialCollection (collectionId) {
      return this.nonCommercialCollections.indexOf(collectionId) >= 0
    },
    groupCollectionsByBiobank (collectionSelectionArray) {
      const biobankWithSelectedCollections = []
      collectionSelectionArray.forEach((cs) => {
        const biobankLabel = this.collectionBiobankDictionary[cs.value]
        const biobankPresent = biobankWithSelectedCollections.find(
          (bsc) => bsc.biobankLabel === biobankLabel
        )

        if (biobankPresent) {
          biobankPresent.collections.push(cs)
        } else {
          biobankWithSelectedCollections.push({
            biobankLabel,
            collections: [cs]
          })
        }
      })
      return biobankWithSelectedCollections
    },
    removeAllCollections () {
      this.hideModal()
      this.RemoveCollectionsFromSelection({
        collections: this.currentSelectedCollections,
        router: this.$router
      })
    },
    hideModal () {
      this.$bvModal.hide('collectioncart-modal')
      this.closeModal()
    },
    closeModal () {
      this.modalEnabled = false
    },
    sendRequest () {
      this.$bvModal.hide('collectioncart-modal')
      this.$store.dispatch('SendToNegotiator').finally(this.closeModal)
    },
    showSelection () {
      this.$bvModal.show('collectioncart-modal')
      this.modalEnabled = true
    },
    applyIE11Bookmark () {
      const rawQuery = this.ie11BookmarkToApply.split('?')[1]
      const queryParts = rawQuery.split('&')
      const queryObject = {}

      queryParts.forEach((part) => {
        const propAndValue = part.split('=')
        queryObject[propAndValue[0]] = propAndValue[1]
      })
      this.MapQueryToState(queryObject)
      this.applyIE11Bookmark = ''
    },
    copyIE11Bookmark () {
      const ie11BookmarkElement = document.getElementById('ie11bookmark')
      ie11BookmarkElement.select()
      ie11BookmarkElement.setSelectionRange(0, 99999)
      document.execCommand('copy')
    }
  },
  mounted () {
    // check if collections have been added off-screen.
    if (this.selectedCollections.length) {
      createBookmark(this.$router, this.activeFilters, this.selectedCollections)
    }
    this.SetViewMode(this.mode)
    if (this.mode === 'networkview') {
      this.GetNetworkInfo()
    } else {
      this.GetCollectionInfo()
      this.GetBiobankIds()
    }
  }
}
</script>

<style>
.non-commercial .fa-times {
  font-size: 1em;
}
.biobank-explorer-container {
  padding-top: 1rem;
}
.remove-collection:hover,
.btn:hover,
#select-all-label:hover {
  cursor: pointer;
}

.collection-cart > div:last-child {
  border:none !important;
}
</style>
