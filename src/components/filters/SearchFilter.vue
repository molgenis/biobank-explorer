<template>
  <StringFilter
    name="Search"
    v-model="search"
    placeholder="Search by name, id, acronym"
  ></StringFilter>
</template>

<script>
import { StringFilter } from '@molgenis-ui/components-library'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    StringFilter
  },
  computed: {
    ...mapGetters(['activeFilters']),
    search: {
      get () {
        return this.activeFilters.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          this.UpdateFilter({
            name: 'search',
            value: search,
            router: this.$router
          }) // passing router so we can set bookmark
        }, 500)
      }
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter'])
  }
}
</script>
