
<template>
  <div>
    <input
      id="select-deselect-all"
      type="checkbox"
      class="add-to-cart"
      @change="handleCollectionStatus"
      :checked="allCollectionsSelected"
      hidden
    />
    <label class="add-to-cart-label btn btn-outline-secondary" for="select-deselect-all">
      <span class="mr-2">Select all collections</span>
      <span class="fa fa-shopping-basket"></span>
    </label>
    <label class="remove-from-cart-label btn btn-outline-danger" for="select-deselect-all">
      <span class="mr-2">Deselect all collections</span>
      <span class="fa fa-times"></span>
    </label>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CollectionSelectAll',
  props: {
    routerEnabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    ...mapMutations([
      'AddCollectionsToSelection',
      'RemoveCollectionsFromSelection'
    ]),
    handleCollectionStatus (event) {
      const { checked } = event.target
      const collectionData = { collections: this.foundCollectionsAsSelection }

      // when it's required to be on the bookmark, we pass the router
      if (this.routerEnabled) {
        collectionData.router = this.$router
      }

      if (checked) {
        this.AddCollectionsToSelection(collectionData)
      } else {
        this.RemoveCollectionsFromSelection(collectionData)
      }
    }
  },
  computed: {
    ...mapGetters(['allCollectionsSelected', 'foundCollectionsAsSelection'])
  }
}
</script>

<style scoped>
.btn:hover {
  cursor: pointer;
}

.add-to-cart:checked ~ .add-to-cart-label {
  display: none;
}

.remove-from-cart-label {
  display: none;
}

.add-to-cart:checked ~ .remove-from-cart-label {
  display: inline-block;
}
</style>
