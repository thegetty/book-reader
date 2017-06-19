<template>
  <div>
    <ol>
      <li v-for="image in filteredData">
        <a class="img_link" @click="$emit('onClick', image)">
          <img v-lazy="image.thumbnail" />
          <span>{{ image.page_label || image.page }}</span>
        </a>
      </li>
    </ol>
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
    this.columns = ['thumbnail'];
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
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    triggerLoad: function () {
      Vue.nextTick(this.$Lazyload.lazyLoadHandler)
    }
  }
}
</script>

<style scoped>

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
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
  display: inline-block;
  margin: 8px;
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
  display: block;
}

.img_link span {
  display: block;
  text-align: center;
}

</style>
