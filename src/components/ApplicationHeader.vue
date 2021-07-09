<template>
  <!-- using container for bootstrap's max-width -->
  <div class="position-fixed container pl-0 pr-0 header-bar">
    <filter-bar />
    <div aria-label="action-bar" class="py-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3 pl-0">
            <collection-select-all
              v-if="!loading && foundCollectionIds.length"
              router-enabled
            />
          </div>
          <div class="col-md-5 pl-0">
            <search-filter />
          </div>
          <div class="col-md-4 pr-0">
            <pagination />
          </div>
        </div>
      </div>
    </div>
    <result-header v-if="!loading" />
  </div>
</template>

<script>
import SearchFilter from './filters/SearchFilter.vue'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll.vue'
import Pagination from './buttons/Pagination.vue'
import { mapGetters } from 'vuex'
import ResultHeader from './ResultHeader.vue'
import FilterBar from './filters/FilterBar.vue'

export default {
  components: {
    SearchFilter,
    CollectionSelectAll,
    Pagination,
    ResultHeader,
    FilterBar
  },
  computed: {
    ...mapGetters(['loading', 'foundCollectionIds'])
  }
}
</script>

<style>
.header-bar {
  top:0;
  padding-top: 80px; /* Molgenis header is 50px */
  background-color: white;
  z-index: 100;
}
</style>
