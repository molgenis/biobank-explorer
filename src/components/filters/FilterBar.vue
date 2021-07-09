<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 px-0 py-2">
        <b-dropdown
          :variant="filterVariant(filter.label || filter.name)"
          v-for="filter in filters"
          :key="filter.name"
          class="mr-2 mb-1 mt-1"
        >
          <template #button-content>
            <span>{{ filter.label || filter.name }}</span>
            <span class="badge badge-light ml-3" v-if="filterSelectionCount(filter.name) > 0">
              {{ filterSelectionCount(filter.name) }}</span
            >
          </template>
          <div class="bg-white p-2 dropdown-contents">
            <component
              v-if="bookmarkMappedToState"
              :is="filter.component"
              :value="activeFilters[filter.name]"
              v-bind="filter"
              @input="(value) => filterChange(filter.name, value)"
              :returnTypeAsObject="true"
              :bulkOperation="true"
            >
            </component>
          </div>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
/** Components used for filters */
import CovidFilter from '../filters/CovidFilter'
import CovidNetworkFilter from '../filters/CovidNetworkFilter'
import {
  FilterCard,
  CheckboxFilter,
  MultiFilter
} from '@molgenis-ui/components-library'
/** */

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    CheckboxFilter,
    MultiFilter,
    FilterCard,
    CovidFilter,
    CovidNetworkFilter
  },
  data () {
    return {
      debounce: undefined,
      filterBarShown: false
    }
  },
  computed: {
    ...mapGetters([
      'showCountryFacet',
      'activeFilters',
      'filterDefinitions',
      'bookmarkMappedToState'
    ]),
    filters () {
      return this.filterDefinitions
        .filter((facet) => {
          // config option showCountryFacet is used to toggle Country facet
          return !(this.showCountryFacet === false && facet.name === 'country')
        })
        .filter((item) => item.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter']),
    filterChange (name, value) {
      this.UpdateFilter({ name, value, router: this.$router })
    },
    filterVariant (filterName) {
      if (filterName.toLowerCase().includes('covid')) {
        return 'warning'
      }

      return 'secondary'
    },
    filterSelectionCount (filterName) {
      const filtersActive = this.activeFilters[filterName]
      if (!filtersActive) {
        return 0
      } else {
        return filtersActive.length
      }
    }
  }
}
</script>

<style scoped>
::v-deep span {
  white-space: nowrap;
}
</style>
