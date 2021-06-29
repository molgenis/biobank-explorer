<template>
  <div class="card network-card">
    <div
      class="card-header network-card-header"
    >
      <div class="row">
        <div class="collapse-column" v-if="!loading">
          <font-awesome-icon
            icon="caret-right"
            :style="iconStyle"
            class="collapse-button mr-2"
            @click.prevent="collapsed=!collapsed"
          />
        </div>
        <div class="col-md-5 d-flex flex-column" v-if="!loading">
          <div class="mb-2">
            <h5>
              <router-link :to="'/network/' +  network.id">
                <font-awesome-icon
                  transform="shrink-3"
                  class="mr-2"
                  :icon="['fas', 'project-diagram']"
                />
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
    },
    iconStyle () {
      return {
        transform: `rotate(${this.collapsed ? 0 : 90}deg)`,
        transition: 'transform 0.2s'
      }
    }
  }
}
</script>

<style>
.collapse-column {
  margin-left: 10px;
  margin-right: 6px;
  display: table-cell !important;
  vertical-align: middle;
}

.collapse-button {
  cursor: pointer;
}

.network-card {
  margin-bottom: 1em;
}

.network-card-header {
  background-color: #e4e4e4;
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
