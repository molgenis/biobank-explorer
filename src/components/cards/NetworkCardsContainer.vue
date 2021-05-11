<template>
  <div class="network-cards-container">
    <div v-if="!loading && foundNetworks > 0">
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

    <div v-else-if="!loading && foundNetworks === 0" class="status-text">
      <h4>No networks were found</h4>
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

.network-cards-container {
  width: 100%;
}
</style>

<script>
import NetworkCard from './NetworkCard'
import { mapGetters } from 'vuex'

export default {
  name: 'network-cards-container',
  data () {
    return {
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    ...mapGetters([
      'networks',
      'foundNetworks',
      'loading'
    ]),
    networksShown () {
      return this.loading ? [] : this.networks.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    networkIds () {
      return this.loading ? [] : this.networks.map(it => it.id || it)
    }
  },
  components: {
    NetworkCard
  },
  watch: {
    networkIds (newValue, oldValue) {
      if (newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])) {
        this.currentPage = 1
      }
    }
  }
}
</script>
