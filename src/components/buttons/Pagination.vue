<template>
  <b-pagination
    v-if="foundBiobanks > pageSize && !loading"
    class="m-0"
    size="md"
    align="right"
    :total-rows="foundBiobanks"
    v-model="pageNumber"
    :per-page="pageSize"
  ></b-pagination>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['currentPage', 'pageSize']),
    ...mapGetters(['foundBiobanks', 'loading']),
    pageNumber: {
      get () {
        return this.currentPage
      },
      set (pageNumber) {
        this.SetCurrentPage(pageNumber)
      }
    }
  },
  methods: {
    ...mapMutations(['SetCurrentPage'])
  }
}
</script>
