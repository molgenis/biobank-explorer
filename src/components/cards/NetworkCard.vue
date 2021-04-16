<template>
  <div
    :class="['card network-card']"
  >
    <div
      class="card-header network-card-header"
      @click.prevent="collapsed = !collapsed"
    >
      <div class="row">
        <div class="col-md-5 d-flex flex-column" v-if="!loading">
          <div class="mb-2">
            <h5>
              <router-link :to="'/network/' +  network.id">
                <span
                  class="fa fa-table mr-2 icon-alignment"
                  aria-hidden="true"
                  aria-labelledby="network-name"
                ></span>
              </router-link>
              <span id="network-name">{{ network.name }}</span>
            </h5>
          </div>
          <!-- <collection-selector
            class="align-with-table mt-auto w-25"
            v-if="biobank.collections.length > 0"
            :collectionData="biobank.collections"
            icon-only
            router-enabled
          ></collection-selector> -->
        </div>
        <div class="col-md-6" v-if="!loading">
          <p>
            <small class="mr-2">
              <span class="font-weight-bold">Number of collections:</span>
            </small>
            <small>{{ network.collections.length }}</small>
            <br />
          </p>
        </div>
        <div v-else class="col-md-12 text-center">
          <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div class="card-body table-card" v-if="!collapsed && !loading">
      <network-children-table
        v-if="network.collections.length > 0"
        :collections="network.collections"
      ></network-children-table>
    </div>
  </div>
</template>

<script>
// import CollectionSelector from '@/components/buttons/CollectionSelector'
import NetworkChildrenTable from '../tables/NetworkChildrenTable.vue'
import { mapGetters, mapState } from 'vuex'
// import utils from '../../utils'
// import { sortCollectionsByName } from '../../utils/sorting'
// import QualityColumn from '../tables/QualityColumn'
import 'array-flat-polyfill'

export default {
  name: 'network-card',
  components: {
    NetworkChildrenTable
    // QualityColumn,
    // CollectionSelector
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
      networkSelected: false,
      collapsed: this.initCollapsed
    }
  },
  computed: {
    ...mapState(['qualityStandardsDictionary']),
    ...mapGetters(['selectedCollections']),
    // biobankInSelection () {
    //   if (!this.biobank.collections) return false

    //   const biobankCollectionSelection = this.biobank.collections
    //     .filter((bcf) => !bcf.parent_collection)
    //     .map((bc) => ({ label: bc.label || bc.name, value: bc.id }))
    //   return this.selectedCollections
    //     .map((sc) => sc.value)
    //     .some((id) =>
    //       biobankCollectionSelection.map((pc) => pc.value).includes(id)
    //     )
    // },
    // sortedCollections () {
    //   return sortCollectionsByName(this.biobank.collections)
    // },
    loading () {
      return typeof this.network === 'string'
    // },
    // collectionTypes () {
    //   const getSubCollections = (collection) => [
    //     collection,
    //     ...collection.sub_collections.flatMap(getSubCollections)
    //   ]
    //   const types = this.biobank.collections
    //     .flatMap(getSubCollections)
    //     .flatMap((collection) => collection.type)
    //     .map((type) => type.label)
    //   return utils.getUniqueIdArray(types).join(', ')
    // },
    // availableCovidTypes () {
    //   if (
    //     this.biobank.covid19biobank &&
    //     this.biobank.covid19biobank.length > 0
    //   ) {
    //     return this.biobank.covid19biobank
    //       .map((covidItem) => covidItem.label || covidItem.name)
    //       .join(', ')
    //   } else return ''
    }
  },
  mounted () {
    // console.log(this.network)
  }
}
</script>

<style>
.table-card {
  padding: 0.1rem;
}
.align-with-table {
  margin-left: 0.1rem;
}

.added-to-selection {
  position: absolute;
  z-index: 2;
  top: 9px;
  right: -5px;
  background: white;
  border-radius: 50%;
}
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
.network-icon:hover {
  cursor: pointer;
}

.covid-icon {
  height: 1.5rem;
  width: auto;
}

.icon-alignment {
  position: relative;
  top: 1px;
  left: 2px;
}

.fa-question-circle {
  position: relative;
  top: 4px;
}

/* Add popover overrides so that it is always clearly visible in any theme (even custom ones) */
.quality-marks-popover {
  background-color: white !important;
  border: solid black 0.5px;
  max-width: 40rem;
}

.quality-marks-popover[x-placement^='top'] > .arrow::before {
  border-top-color: black !important;
}
.quality-marks-popover[x-placement^='top'] > .arrow::after {
  border-top-color: white !important;
}

.quality-marks-popover[x-placement^='bottom'] > .arrow::before {
  border-bottom-color: black !important;
}
.quality-marks-popover[x-placement^='bottom'] > .arrow::after {
  border-bottom-color: white !important;
}

.popover-trigger-area {
  position: relative;
}

/* for touch screens, so you have a nice area to press and still get a popover */
.popover-trigger-area::after {
  content: '';
  position: absolute;
  top: -0.5rem;
  bottom: -1rem;
  right: -7rem;
  left: -0.5rem;
}
</style>
