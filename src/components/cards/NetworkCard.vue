<template>
  <div
    :class="['card network-card']"
  >
    <div
      class="card-header network-card-header bg-warning"
      @click.prevent="collapsed=!collapsed"
    >
      <div class="row">
        <div class="col-md-5 d-flex flex-column" v-if="!loading">
          <div class="mb-2">
            <h5>
              <router-link :to="'/network/' +  network.id">
                <span
                  class="fa fa-table network-icon mr-2 icon-alignment"
                  aria-hidden="true"
                  aria-labelledby="network-name"
                ></span>
              </router-link>
              <span id="network-name">{{ network.name }}</span>
            </h5>
          </div>
        </div>
        <div class="col-md-6" v-if="!loading">
          <p>
            <small class="mr-2">
              <span class="font-weight-bold">Number of biobanks:</span>
            </small>
            <small>{{ network.biobanks.length }}</small>
            <br />
          </p>
        </div>
        <div v-else class="col-md-12 text-center">
          <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div class="card-body" v-if="!collapsed && !loading">
      <biobank-cards-container
        :biobanks="network.biobanks">
      </biobank-cards-container>
    </div>
  </div>
</template>

<script>
import BiobankCardsContainer from './BiobankCardsContainer.vue'

export default {
  name: 'network-card',
  components: {
    BiobankCardsContainer
  },
  props: {
    network: {
      type: [Object, String]
    },
    initCollapsed: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      collapsed: this.initCollapsed
    }
  },
  computed: {
    loading () {
      return typeof this.network === 'string'
    }
  }
}
</script>

<style>
.network-card {
  margin-bottom: 1em;
}

.network-card-header {
  background-color: #f5f5f5;
}

.network-card-header:hover {
  cursor: pointer;
  background-color: #e4e4e4;
}

.network-icon {
  color: white;
}

.network-icon:hover {
  cursor: pointer;
}

.icon-alignment {
  position: relative;
  top: 1px;
  left: 2px;
}
</style>
