<template>
  <div>
    <form id="search">
      Search <input name="query" v-model="filterKey">
    </form>
    <table>
      <thead>
        <tr>
          <th v-for="key in columns"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }">
            {{ key | titlecase }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in filteredData">
          <td>
            <a class="img_link" @click="$emit('onClick', entry)">
              <img v-lazy="entry['thumbnail']" />
            </a>
          </td>
          <td>
            <a @click="$emit('onClick', entry)">
              {{ entry['page'] }}
            </a>
          </td>
          <td>
            <a :href="entry['artwork_uri']" target="_blank" >
              {{ entry['artwork_title'] }}
            </a>
          </td>
          <td>
            <a :href="entry['collection_uri']" target="_blank" >
              {{ entry['collection'] }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import VueLazyload from 'vue-lazyload'
import Vue from 'vue'

Vue.use(VueLazyload);

export default {
  name: 'grid',
  components: {

  },
  props: {
    'data': {
      type: Array
    }
  },
  data () {
    var sortOrders = {}
    this.columns = ['thumbnail', 'page', 'artwork_title', 'collection'];
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
    }
  }
}
</script>

<style scoped>

table {
  border: 2px solid #cecece;
  border-radius: 3px;
  background-color: #fff;
  width: 80vw;
  margin: 24px auto;
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
}

th, td {
  /*min-width: 220px;*/
  padding: 10px 20px;
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

</style>
