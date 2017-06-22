<template>
  <div class="container card_container">
    <!-- <ol>
      <li v-for="image in filteredData">
        <a class="img_link" @click="$emit('onClick', image)">
          <img v-lazy="image.thumbnail" />
          <span>{{ image.artwork_title }}</span>
        </a>
      </li>
    </ol> -->
      <div class="card card_wrapper" v-for="image in filteredData">
        <div class="card-image">
          <figure class="image">
            <a class="img_link" @click="$emit('onClick', image)">
              <img class="downsampled" v-lazy="image.downsampled || image.asset" />
            </a>
          </figure>
        </div>
        <div class="card-footer">
          <div class="card-footer-item">
            <span>{{ image.artwork_title }}</span>
          </div>
        </div>
      </div>
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

<style>
.img_link {
  cursor: pointer;
}

.img_link:hover {
  opacity: 0.8;
}

.img_link:active {
  opacity: 0.5;
}

.image .img_link img {
  object-fit: cover;
  max-width: none;
  width: 100%;
  height: 100%;
}

.card-image figure {
  width: 200px;
  height: 200px;
  overflow: hidden;
  display: block;
}

.card {
  width: 200px;
}

.card_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.card_wrapper {
  margin: 12px;
}
</style>
