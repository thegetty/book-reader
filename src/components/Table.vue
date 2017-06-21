<template>
  <div>
    <nav class="nav section_nav">
      <div class="nav-right">
        <div class="nav-item">
          <p class="control has-icons-right">
            <input class="input has-icons-right" name="query" v-model="filterKey">
            <span class="icon is-small is-right">
              <icon name="search" title="Search"></icon>
            </span>
          </p>
        </div>
      </div>
    </nav>

    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">

    <b-table
      :data="filteredData"
      :bordered="true"
      :striped="true"
      :mobile-cards="true"
      :paginated="false"
      :per-page="10"
      :pagination-simple="true"
      >
        <template scope="tb">
            <b-table-column field="thumbnail" label="" >
              <a class="img_link" @click="$emit('onImageClick', tb.row)">
                <img v-lazy="tb.row['thumbnail']" />
              </a>
            </b-table-column>

            <b-table-column field="page" label="Page" sortable>
              <a href="#" @click="$emit('onPageClick', tb.row.page)">
                {{ tb.row['page_label'] || tb.row['page'] }}
              </a>
            </b-table-column>

            <b-table-column field="artwork" label="Artwork" sortable>
              <a :href="tb.row['artwork_uri']" target="_blank" >
                {{ tb.row['artwork_title'] }}
              </a>
            </b-table-column>

            <b-table-column field="artist" label="Artist" sortable>
              <a :href="tb.row['artist_uri']" target="_blank" >
                {{ tb.row['artist_name'] }}
              </a>
            </b-table-column>

            <b-table-column field="collection" label="Collection" sortable>
              <a :href="tb.row['collection_uri']" target="_blank" >
                {{ tb.row['collection'] }}
              </a>
            </b-table-column>
        </template>
    </b-table>
  </div>
</template>

<script>
import VueLazyload from 'vue-lazyload'
import Vue from 'vue'
import 'vue-awesome/icons/search'

import Icon from 'vue-awesome/components/Icon'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  // loading: 'dist/loading.gif',
  attempt: 1
})

export default {
  name: 'table',
  components: {
    'icon': Icon
  },
  props: {
    'data': {
      type: Array
    }
  },
  data () {
    var sortOrders = {}
    this.columns = ['thumbnail', 'page', 'artwork_title', 'artist', 'collection'];
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      filterKey: '',
      // searchQuery: '',
      gridColumns: []
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey && data) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    titlecase: function (_str) {
      var str;
      str = _str.replace(/_/g, ' ');
      str = str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });

      return str;
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    triggerLoad: function () {
      Vue.nextTick(this.$Lazyload.lazyLoadHandler);
    }
  },
  updated () {

  }
}
</script>

<style scoped>

table {
  /*border: 2px solid #cecece;
  border-radius: 3px;
  background-color: #fff;
  width: 80vw;
  margin: 24px auto;*/
}

th {
  background-color: #cecece;
  color: #000;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
  min-width: 140px;
}

th, td {
  /*min-width: 220px;*/
  padding: 10px 40px;
  border: 2px solid #cecece;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

.img_link {
  cursor: pointer;
}

.img_link:hover {
  opacity: 0.8;
}

.img_link:active {
  opacity: 0.5;
}

.img_link img {
  max-width: 100px;
  max-height: 100px;
}

#search {
  text-align: center;
}

</style>
