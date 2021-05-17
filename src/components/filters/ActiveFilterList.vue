<template>
  <ActiveFilters
    :value="activeFilters"
    @input="changeAllFilters"
    :filters="filters">
  </ActiveFilters>
</template>

<script>
import { createBookmark } from '../../utils/bookmarkMapper'
import { mapGetters, mapMutations } from 'vuex'
import { ActiveFilters } from '@molgenis-ui/components-library'

export default {
  components: { ActiveFilters },
  name: 'active-filter-list',
  methods: {
    ...mapMutations(['UpdateAllFilters']),
    changeAllFilters (value) {
      this.UpdateAllFilters(value)
      createBookmark(this.$router, value, this.selectedCollections)
    }
  },
  computed: {
    ...mapGetters(['showCountryFacet', 'activeFilters', 'filterDefinitions', 'selectedCollections']),
    filters () {
      return this.filterDefinitions.filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  }
}
</script>
