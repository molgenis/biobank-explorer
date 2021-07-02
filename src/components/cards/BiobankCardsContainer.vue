<template>
  <div class="biobank-cards-container">
    <div v-if="!loading && numberOfBiobanks > 0">
      <b-pagination
        v-if="numberOfBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="numberOfBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
      <biobank-card
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank"
        :initCollapsed="(biobanksShown[0].id !== biobank.id || biobanksShown[0] !== biobank)">
      </biobank-card>

      <b-pagination
        v-if="numberOfBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="numberOfBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
    </div>

    <div v-else-if="!loading && numberOfBiobanks === 0" class="status-text">
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
import BiobankCard from './BiobankCard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'biobank-cards-container',
  data () {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  props: {
    biobanks: {
      type: [Array]
    }
  },
  methods: {
    ...mapActions(['GetBiobanks'])
  },
  computed: {
    ...mapGetters({
      globalBiobanks: 'biobanks',
      foundBiobanks: 'foundBiobanks',
      loading: 'loading',
      viewMode: 'viewMode'
    }),
    biobanksShown () {
      const biobanks = this.$props.biobanks ? this.$props.biobanks : this.globalBiobanks
      return this.loading ? [] : biobanks.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    biobankIds () {
      const biobanks = this.$props.biobanks ? this.$props.biobanks : this.globalBiobanks
      return this.loading ? [] : biobanks.map(it => it.id || it)
    },
    biobankIdsToFetch () {
      return this.biobanksShown.filter(it => typeof it === 'string')
    },
    numberOfBiobanks () {
      return this.$props.biobanks ? this.$props.biobanks.length : this.foundBiobanks
    }
  },
  components: {
    BiobankCard
  },
  watch: {
    biobankIds (newValue, oldValue) {
      if (newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])) {
        this.currentPage = 1
      }
    },
    biobankIdsToFetch (value) {
      if (value.length > 0) {
        this.GetBiobanks(value)
      }
    }
  },
  mounted () {
    // Forces fetching of first set of biobanks since, in networkview, the first set of biobanksIds is not fetched automatically
    if (this.viewMode === 'networkview' && this.biobankIdsToFetch.length > 0) {
      this.GetBiobanks(this.biobankIdsToFetch)
    }
  }
}
</script>
