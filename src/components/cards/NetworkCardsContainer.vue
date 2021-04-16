<template>
  <div class="biobank-cards-container">
    <div v-if="!networksLoading && foundNetworks > 0">
      <b-pagination
        v-if="foundNetworks > pageSize"
        size="md"
        align="center"
        :total-rows="foundNetworks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
      <network-card
        v-for="network in networksShown"
        :key="network.id || network"
        :network="network"
      >
      </network-card>
      <b-pagination
        v-if="foundNetworks > pageSize"
        size="md"
        align="center"
        :total-rows="foundNetworks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
    </div>

    <div v-else-if="!networksLoading && foundNetworks === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>
        Loading data...
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
      </h4>
    </div>
  </div>
</template>

<style>
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}

.biobank-cards-container {
  width: 100%;
}
</style>

<script>
import NetworkCard from './NetworkCard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'network-cards-container',
  data () {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    ...mapActions(['GetBiobanks'])
  },
  computed: {
    ...mapGetters([
      'networks',
      'biobanks',
      'foundNetworks',
      'networksLoading'
    ]),
    // biobanksShown () {
    //   return this.loading ? [] : this.biobanks.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    // },
    // biobankIds () {
    //   return this.loading ? [] : this.biobanks.map(it => it.id || it)
    // },
    // biobankIdsToFetch () {
    //   return this.networksShown.map()
    // },
    networksShown () {
      return this.networksLoading ? [] : this.networks.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    networksIds () {
      return this.networksLoading ? [] : this.networks.map(it => it.id || it)
    },
    networksIdsToFetch () {
      return this.networksShown.filter(it => typeof it === 'string')
    }
  },
  components: {
    NetworkCard
  },
  watch: {
    biobankIds (newValue, oldValue) {
      if (newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])) {
        this.currentPage = 1
      }
    },
    networkIds (newValue, oldValue) {
      if (newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])) {
        this.currentPage = 1
      }
    },
    biobankIdsToFetch (value) {
      if (value.length) {
        // this.GetBiobanks(value)
      }
    }
  }
}
</script>
