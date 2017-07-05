<template>
  <div>
    <nav class="nav section_nav">
      <div class="nav-right" style="overflow: visible">
        <!-- <b-dropdown>
          <button class="button" slot="trigger">
              <span>Artworks</span>
              <b-icon icon="arrow_drop_down"></b-icon>
          </button>

          <b-dropdown-option v-for="artwork in artworks" key="option_${artwork.uri}">{{artwork.name}}</b-dropdown-option>
        </b-dropdown> -->

        <b-dropdown position="is-bottom-left" v-model="artworkFilter" v-show="!artworkFilter">
          <button class="button" slot="trigger" @click="artworkFilter = undefined;">
              <span>Artworks</span>
              <b-icon icon="arrow_drop_down"></b-icon>
          </button>

          <b-dropdown-option v-for="artwork in artworks" :key="artwork.uri" :value="artwork.name" :selected="artworkFilter === artwork.name">{{artwork.name}}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="artworkFilter">
          <button class="button" slot="trigger" @click="artworkFilter = undefined;">
              <span>{{artworkFilter}}</span>
              <b-icon icon="close" class="is-small"></b-icon>
          </button>
        </span>

        <b-dropdown position="is-bottom-left" v-model="artistFilter" v-show="!artistFilter">
          <button class="button" slot="trigger" @click="artistFilter = undefined;">
              <span>Artist</span>
              <b-icon icon="arrow_drop_down"></b-icon>
          </button>

          <b-dropdown-option v-for="artist in artists" :key="artist.uri" :value="artist.name" :selected="artistFilter === artist.name">{{artist.name}}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="artistFilter">
          <button class="button" slot="trigger" @click="artistFilter = undefined;">
              <span>{{artistFilter}}</span>
              <b-icon icon="close" class="is-small"></b-icon>
          </button>
        </span>

        <b-dropdown position="is-bottom-left" v-model="collectionFilter" v-show="!collectionFilter">
          <button class="button" slot="trigger" @click="collectionFilter = undefined;">
              <span>Collection</span>
              <b-icon icon="arrow_drop_down"></b-icon>
          </button>

          <b-dropdown-option v-for="collection in collections" :key="collection.uri" :value="collection.name" :selected="collectionFilter === collection.name">{{collection.name}}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="collectionFilter">
          <button class="button" slot="trigger" @click="collectionFilter = undefined;">
              <span>{{collectionFilter}}</span>
              <b-icon icon="close" class="is-small"></b-icon>
          </button>
        </span>

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

    <b-table
      :data="filteredData"
      :bordered="true"
      :striped="true"
      :mobile-cards="true"
      :paginated="true"
      :per-page="8"
      :pagination-simple="true"
      >
        <template scope="tb">
            <b-table-column field="thumbnail" label="" width="40">
              <a class="img_link" @click="$emit('onImageClick', tb.row)">
                <img v-lazy="tb.row['thumbnail']" />
              </a>
            </b-table-column>

            <b-table-column field="artwork" label="Artwork" sortable>
              <!-- <a :href="tb.row['artwork_uri']" target="_blank" >
                {{ tb.row['artwork_title'] }}
              </a> -->
              <a @click="artworkFilter = tb.row.artwork_title" v-if="artworkFilter != tb.row.artwork_title">
                {{ tb.row['artwork_title'] }}
              </a>
              <span v-if="artworkFilter === tb.row.artwork_title">
                {{ tb.row['artwork_title'] }}
              </span>
              <a class="button is-small is-pulled-right" :href="tb.row['collection_uri']" target="_blank"  v-if="tb.row.collection">
                <span>View in Collection</span>
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a>
            </b-table-column>

            <b-table-column field="artist" label="Artist" sortable>
              <!-- <a :href="tb.row['artist_uri']" target="_blank" >
                {{ tb.row['artist_name'] }}
              </a> -->
              <a @click="artistFilter = tb.row.artist_name" v-if="artistFilter != tb.row.artist_name">
                {{ tb.row['artist_name'] }}
              </a>
              <span v-if="artistFilter === tb.row.artist_name">
                {{ tb.row['artist_name'] }}
              </span>
            </b-table-column>

            <b-table-column field="collection" label="Collection" sortable>
              <!-- <a :href="tb.row['collection_uri']" target="_blank" >
                {{ tb.row['collection'] }}
              </a> -->
              <a @click="collectionFilter = tb.row.collection" v-if="collectionFilter != tb.row.collection">
                {{ tb.row['collection'] }}
              </a>
              <span v-if="collectionFilter === tb.row.collection">
                {{ tb.row['collection'] }}
              </span>
              <!-- <a class="button is-small is-pulled-right" :href="tb.row['collection_uri']" target="_blank"  v-if="tb.row.collection">
                <span>In Collection</span>
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a> -->
            </b-table-column>

            <b-table-column field="page" label="Page" sortable width="30">
              <a href="#" @click="$emit('onPageClick', tb.row.page)" class="button">
                <span>{{ tb.row['page_label'] || tb.row['page'] }}</span>
                <b-icon icon="keyboard_arrow_right" class="is-small"></b-icon>
              </a>
            </b-table-column>

            <!-- <b-table-column field="viewin" label="View">
              <a class="button" :href="tb.row['collection_uri']" target="_blank">
                In Collection
              </a>
            </b-table-column> -->
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
    },
    'filter': {
      type: Object,
      default: undefined
    }
  },
  created () {
    if (this.filter) {
      Object.keys(this.filter).forEach((key) => {
        let value = this.filter[key];

        if (key === 'artwork_title') {
          this.artworkFilter = value;
        }

        if (key === 'artist_name') {
          this.artistFilter = value;
        }

        if (key === 'collection') {
          this.collectionFilter = value;
        }
      });
    }
  },
  data () {
    var sortOrders = {}
    this.columns = ['thumbnail', 'page', 'artwork_title', 'artist', 'collection'];
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      filterKey: '',
      // searchQuery: '',
      gridColumns: [],
      imagesByArtwork: {},
      imagesByArtist: {},
      imagesByCollection: {},
      artworks: [],
      artists: [],
      collections: [],
      artistFilter: '',
      artworkFilter: '',
      collectionFilter: ''
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase();
      var artworkFilter = this.artworkFilter && this.artworkFilter.toLowerCase();
      var artistFilter = this.artistFilter && this.artistFilter.toLowerCase();
      var collectionFilter = this.collectionFilter && this.collectionFilter.toLowerCase();
      var order = this.sortOrders[sortKey] || 1;
      var data = this.data;

      if (artworkFilter && data) {
        data = data.filter(function (row) {
          if (row.artwork_title) {
            return String(row.artwork_title).toLowerCase().indexOf(artworkFilter) > -1;
          }
        });
      }

      if (artistFilter && data) {
        data = data.filter(function (row) {
          if (row.artist_name) {
            return String(row.artist_name).toLowerCase().indexOf(artistFilter) > -1;
          }
        });
      }

      if (collectionFilter && data) {
        data = data.filter(function (row) {
          if (row.collection) {
            return String(row.collection).toLowerCase().indexOf(collectionFilter) > -1;
          }
        });
      }

      if (filterKey && data) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        })
      }
      return data;
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
  watch: {
    data () {
      this.data.forEach((image) => {
        if (image.artist_name) {
          let artistUri = encodeURI(image.artist_name);
          if (!this.imagesByArtist[artistUri]) {
            this.imagesByArtist[artistUri] = [];
            this.artists.push({
              uri: artistUri,
              name: image.artist_name
            });
          }
          this.imagesByArtist[artistUri].push(image);
        }

        if (image.artwork_title) {
          let artworkUri = encodeURI(image.artwork_title);
          if (!this.imagesByArtwork[artworkUri]) {
            this.imagesByArtwork[artworkUri] = [];
            this.artworks.push({
              uri: artworkUri,
              name: image.artwork_title
            });
          }
          this.imagesByArtwork[artworkUri].push(image);
        }

        if (image.collection) {
          let collectionUri = encodeURI(image.collection);
          if (!this.imagesByCollection[collectionUri]) {
            this.imagesByCollection[collectionUri] = [];
            this.collections.push({
              uri: collectionUri,
              name: image.collection
            });
          }
          this.imagesByCollection[collectionUri].push(image);
        }
      });
    },
    filter () {
      if (this.filter) {
        Object.keys(this.filter).forEach((key) => {
          let value = this.filter[key];

          if (key === 'artwork_title') {
            this.artworkFilter = value;
          }

          if (key === 'artist_name') {
            this.artistFilter = value;
          }

          if (key === 'collection') {
            this.collectionFilter = value;
          }
        });
      }
    }
  },
  methods: {
    reset () {
      this.data = [];
      this.imagesByArtwork = {};
      this.imagesByArtist = {};
      this.imagesByCollection = {};
      this.artworks = {};
      this.artists = {};
      this.collections = {};
    },
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
  width: 100px;
  height: 100px;
  text-align: center;
  margin: 0 auto;
  display: block;
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

.table td, .table th {
  vertical-align: middle;
}

</style>

<style>
  .artwork .b-tabs .tab-content {
    overflow: visible !important;
  }
</style>
