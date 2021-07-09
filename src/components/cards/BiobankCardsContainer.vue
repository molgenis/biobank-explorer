<template>
  <div class="biobank-cards-container">
    <div v-if="!loading && foundBiobanks > 0">
      <biobank-card
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank"
        :initCollapsed="
          biobanksShown[0].id !== biobank.id || biobanksShown[0] !== biobank
        "
      >
      </biobank-card>
    </div>

    <div v-else-if="!loading && foundBiobanks === 0" class="status-text">
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

<script>
import BiobankCard from './BiobankCard'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'biobank-cards-container',
  methods: {
    ...mapActions(['GetBiobanks']),
    ...mapMutations(['SetCurrentPage'])
  },
  computed: {
    ...mapState(['pageSize', 'currentPage']),
    ...mapGetters([
      'biobanks',
      'foundBiobanks',
      'loading'
    ]),
    biobanksShown () {
      return this.loading
        ? []
        : this.biobanks.slice(
          this.pageSize * (this.currentPage - 1),
          this.pageSize * this.currentPage
        )
    },
    biobankIds () {
      return this.loading ? [] : this.biobanks.map((it) => it.id || it)
    },
    biobankIdsToFetch () {
      return this.biobanksShown.filter((it) => typeof it === 'string')
    }
  },
  components: {
    BiobankCard
  },
  watch: {
    biobankIds (newValue, oldValue) {
      if (
        newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])
      ) {
        this.SetCurrentPage(1)
      }
    },
    biobankIdsToFetch (value) {
      if (value.length) {
        this.GetBiobanks(value)
      }
    }
  }
}
</script>

<style>
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}

.biobank-cards-container {
  width: 100%;
  margin-top: 18rem;
}
</style>
