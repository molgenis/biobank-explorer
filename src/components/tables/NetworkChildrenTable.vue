<template>
  <b-tabs content-class="mt-2">
    <b-tab title="Biobanks">
      <b-table sticky-header :fields="biobankFields" :items="biobanks" class="table table-condensed table-responsive">
        <template #cell(name)="data">
          <span>
            <router-link :to="'/biobank/' + data.item.id">
              <button
                class="btn btn-link collection-link text-left pt-0 border-0"
              >
                {{ data.value }}
              </button>
            </router-link>
          </span>
        </template>
      </b-table>
    </b-tab>
  </b-tabs>
</template>

<script>
export default {
  name: 'network-children-table',
  props: {
    collections: {
      type: Array,
      default: () => []
    },
    biobanks: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      fields: ['select', {
        key: 'collectionName',
        label: 'Name'
      }],
      biobankFields: [{
        key: 'name',
        label: 'Name'
      }]
    }
  }
}
</script>

<style>
.table-title {
  font-weight: bold;
  padding-left: 6px;
  margin-bottom: 6px;
  margin-top: 6px;

}

.collection-selection-button {
  margin-left: 0.75rem;
}

.collapsed > .when-visible {
  display: none;
}
:not(.collapsed) > .when-hidden {
  display: none;
}

.table-text-content-columns {
  font-size: 13px;
  font-weight: bold;
}

.table-text-content-columns-has-sub {
  font-size: 13px;
  font-weight: bold;
  border-style: hidden;
  border-width: 0px;
}

.sub-table-cell {
  padding-top: 0px;
}

.collection-link {
  white-space: normal !important;
  line-height: normal;
}
</style>
