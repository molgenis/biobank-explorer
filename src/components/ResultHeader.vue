<template>
  <div class="search-box-container">
    <div class="row">
      <div class="col-md-12">
        <div class="biobank-number-report-container">
          <small class="biobank-number-report">
            <em>
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

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['foundBiobanks', 'foundCollectionIds', 'parentCollections']),
    numberOfSubCollections () {
      return this.foundCollectionIds.length - this.parentCollections.length
    }
  }
}
</script>

<style>
.biobank-number-report-container {
  border-bottom: solid 1px black;
  width: 100%;
}
</style>
