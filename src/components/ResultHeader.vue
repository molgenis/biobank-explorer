<template>
  <div class="search-box-container">
    <div class="mb-3">
      <div class="col-md-12 p-0">
        <active-filter-list></active-filter-list>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="biobank-number-report-container">
          <small class="biobank-number-report">
            <em>
              <template v-if="foundNetworks > 0">
                {{ foundNetworks }} networks with
              </template>
              {{ foundBiobanks }} organisations with
              {{ parentCollections.length }} collection(s)
              <template v-if="numberOfSubCollections > 0">
                and {{ numberOfSubCollections }} subcollection(s)
              </template>
              matching the search criteria
            </em>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.biobank-number-report-container {
  border-bottom: solid 1px black;
  width: 100%;
}

.search-input-container {
  margin-bottom: 1rem;
}

.search-box-container {
  margin-bottom: 1rem;
}

.search-input-addon:hover {
  cursor: pointer;
}
</style>

<script>
import ActiveFilterList from './filters/ActiveFilterList'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['foundNetworks', 'foundBiobanks', 'foundCollectionIds', 'parentCollections']),
    numberOfSubCollections () {
      return this.foundCollectionIds.length - this.parentCollections.length
    }
  },
  components: {
    ActiveFilterList
  }
}
</script>
