<template>
  <div>
    <b-form-checkbox
      id="covidBiobankNetwork"
      v-model="biobankNetwork"
      name="covidBiobankNetwork"
    >
      <span>Biobanks providing COVID-19 services</span>
    </b-form-checkbox>
    <b-form-checkbox
      id="covidCollectionNetwork"
      v-model="collectionNetwork"
      name="covidCollectionNetwork"
    >
      <span>COVID-19 collections</span>
    </b-form-checkbox>
  </div>
</template>

<script>
/* istanbul ignore file */

import { mapState, mapMutations } from 'vuex'
const covid19NetworkId = 'bbmri-eric:networkID:EU_BBMRI-ERIC:networks:COVID19'

export default {
  name: 'CovidNetworkFilter',
  methods: {
    ...mapMutations(['SetCovidNetworkFilter', 'UnsetCovidNetworkFilter'])
  },
  computed: {
    ...mapState(['filters']),
    biobankNetwork: {
      get () {
        const network = this.filters.selections.biobank_network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      },
      set (value) {
        if (value) {
          this.SetCovidNetworkFilter({
            name: 'biobank_network',
            value: { text: 'COVID_19', value: covid19NetworkId },
            router: this.$router
          })
        } else {
          this.UnsetCovidNetworkFilter({
            name: 'biobank_network',
            value: { text: 'COVID_19', value: covid19NetworkId },
            router: this.$router
          })
        }
      }
    },
    collectionNetwork: {
      get () {
        const network = this.filters.selections.collection_network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      },
      set (value) {
        if (value) {
          this.SetCovidNetworkFilter({
            name: 'collection_network',
            value: { text: 'COVID_19', value: covid19NetworkId },
            router: this.$router
          })
        } else {
          this.UnsetCovidNetworkFilter({
            name: 'collection_network',
            value: { text: 'COVID_19', value: covid19NetworkId },
            router: this.$router
          })
        }
      }
    }
  }
}
</script>
