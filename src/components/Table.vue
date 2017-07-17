<template>
  <div>
    <nav class="nav section_nav">
      <div class="nav-left">
        <div class="nav-item first-nav-item">
          <p class="control has-icons-right search">
            <input class="input has-icons-right" name="query" v-model="filterKey">
            <span class="icon is-small is-right">
              <icon name="search" title="Search"></icon>
            </span>
          </p>
        </div>
      </div>

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
            <span class="icon is-small">
              <icon name="picture-o" title="Filter by Artwork"></icon>
            </span>
            <span>Artworks</span>
            <b-icon icon="arrow_drop_down" class="button_action"></b-icon>
          </button>

          <b-dropdown-option v-for="artwork in artworks" :key="artwork.uri" :value="artwork.name" :selected="artworkFilter === artwork.name">{{artwork.name | truncate }}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="artworkFilter">
          <button class="button" slot="trigger" @click="artworkFilter = undefined;">
            <span class="selected_title">{{artworkFilter}}</span>
            <b-icon icon="close" class="is-small button_action"></b-icon>
          </button>
        </span>

        <b-dropdown position="is-bottom-left" v-model="artistFilter" v-show="!artistFilter">
          <button class="button" slot="trigger" @click="artistFilter = undefined;">
            <span class="icon is-small">
              <icon name="user" title="Filter by Artist"></icon>
            </span>
            <span>Artist</span>
            <b-icon icon="arrow_drop_down" class="button_action"></b-icon>
          </button>

          <b-dropdown-option v-for="artist in artists" :key="artist.uri" :value="artist.name" :selected="artistFilter === artist.name">{{artist.name | truncate}}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="artistFilter">
          <button class="button" slot="trigger" @click="artistFilter = undefined;">
              <span class="selected_title">{{artistFilter}}</span>
              <b-icon icon="close" class="is-small button_action"></b-icon>
          </button>
        </span>

        <b-dropdown position="is-bottom-left" v-model="collectionFilter" v-show="!collectionFilter">
          <button class="button" slot="trigger" @click="collectionFilter = undefined;">
            <span class="icon is-small">
              <icon name="institution" title="Filter by Collection"></icon>
            </span>
            <span>Collection</span>
            <b-icon icon="arrow_drop_down" class="button_action"></b-icon>
          </button>

          <b-dropdown-option v-for="collection in collections" :key="collection.uri" :value="collection.name" :selected="collectionFilter === collection.name">{{collection.name | truncate}}</b-dropdown-option>
        </b-dropdown>
        <span class="dropdown" v-if="collectionFilter">
          <button class="button" slot="trigger" @click="collectionFilter = undefined;">
              <span class="selected_title">{{collectionFilter}}</span>
              <b-icon icon="close" class="is-small button_action"></b-icon>
          </button>
        </span>


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
      class="artwork_table"
      >
        <template scope="tb">
            <b-table-column field="thumbnail" label="" width="40" height="120" class="img_thumbnail_row">
              <a class="img_link" @click="$emit('onImageClick', tb.row)">
                <img v-lazy="tb.row['thumbnail']" />
              </a>
            </b-table-column>

            <b-table-column field="artwork" label="Artwork" sortable>
              {{ tb.row['artwork_title'] }}
              <!-- <a @click="artworkFilter = tb.row.artwork_title" v-show="artworkFilter != tb.row.artwork_title">
                {{ tb.row['artwork_title'] }}
              </a>
              <span v-show="artworkFilter === tb.row.artwork_title">
                {{ tb.row['artwork_title'] }}
              </span> -->
              <!-- <a :href="tb.row['artwork_uri']" target="_blank" class="external_link">
                {{ tb.row['artwork_title'] }}
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a>

              <a @click="artworkFilter = tb.row.artwork_title" class="button is-small is-pulled-right filterer">
                <b-icon
                    icon="filter"
                    size="is-small">
                </b-icon>
                <span>
                {{ imagesByArtwork[encodeURI(tb.row.artwork_title)] && imagesByArtwork[encodeURI(tb.row.artwork_title)].length }}
                </span>
              </a> -->
            </b-table-column>

            <b-table-column field="artist" label="Artist" sortable>
              {{ tb.row['artist_name'] }}
              <!-- <a :href="tb.row['artist_uri']" target="_blank" class="external_link">
                {{ tb.row['artist_name'] }}
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a> -->
              <!-- <a @click="artistFilter = tb.row.artist_name" v-show="artistFilter != tb.row.artist_name">
                {{ tb.row['artist_name'] }}
              </a>
              <span v-show="artistFilter === tb.row.artist_name">
                {{ tb.row['artist_name'] }}
              </span> -->
              <!-- <a class="button is-small is-pulled-right" :href="tb.row['artist_uri']" target="_blank"  v-if="tb.row.artist_uri">
                <span>ULAN</span>
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a> -->

              <!-- <a @click="artistFilter = tb.row.artist_name" class="button is-small is-pulled-right filterer">
                <b-icon
                    icon="filter"
                    size="is-small">
                </b-icon>
                <span>
                {{ imagesByArtist[encodeURI(tb.row.artist_name)] && imagesByArtist[encodeURI(tb.row.artist_name)].length }}
                </span>
              </a> -->
            </b-table-column>

            <b-table-column field="collection" label="Collection" class="artwork_info" sortable>
              {{ tb.row['collection'] }}
              <!-- <a :href="tb.row['collection_uri']" target="_blank" class="external_link">
                {{ tb.row['collection'] }}
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a> -->
              <!-- <a @click="collectionFilter = tb.row.collection" v-show="collectionFilter != tb.row.collection">
                {{ tb.row['collection'] }}
              </a>
              <span v-show="collectionFilter === tb.row.collection">
                {{ tb.row['collection'] }}
              </span> -->
              <!-- <a class="button is-small" :href="tb.row['collection_uri']" target="_blank"  v-if="tb.row.collection_uri">
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a> -->

              <!-- <a @click="collectionFilter = tb.row.collection" class="button is-small is-pulled-right filterer">
                <b-icon
                    icon="filter"
                    size="is-small">
                </b-icon>
                <span>
                {{ imagesByCollection[encodeURI(tb.row.collection)] && imagesByCollection[encodeURI(tb.row.collection)].length }}
                </span>
              </a> -->

            </b-table-column>

            <b-table-column field="page" label="Location" sortable width="10" class="location">
              <!-- <a @click="$emit('onPageClick', tb.row.page)">
                <span v-if="parseInt(tb.row.page)">pg. {{ tb.row.page }}</span>
                <span v-if="!parseInt(tb.row.page)">{{ tb.row.page }}</span>
              </a> -->
              <span v-if="parseInt(tb.row.page)">pg. {{ tb.row.page }}</span>
              <span v-if="!parseInt(tb.row.page)">{{ tb.row.page }}</span>
            </b-table-column>

            <b-table-column label="View" sortable width="30">
              <a class="button is-small" :href="tb.row['artwork_uri']" target="_blank"  v-if="tb.row.artwork_uri">
                <span>View in Collection</span>
                <b-icon icon="open_in_new" class="is-small"></b-icon>
              </a>
              <a class="button is-small view_in_book" @click="$emit('onPageClick', tb.row.page)">
                <span>View in Book</span>
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
import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/picture-o'

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
    },
    truncate: function (text, stop = 60, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '…' : '');
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
        this.artworkFilter = undefined;
        this.artistFilter = undefined;
        this.collectionFilter = undefined;
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
    artworkFilter () {
      this.$emit('update:filter', {
        'artwork_title': this.artworkFilter,
        'artist_name': this.artistFilter,
        'collection': this.collectionFilter
      });
    },
    artistFilter () {
      this.$emit('update:filter', {
        'artwork_title': this.artworkFilter,
        'artist_name': this.artistFilter,
        'collection': this.collectionFilter
      });
    },
    collectionFilter () {
      this.$emit('update:filter', {
        'artwork_title': this.artworkFilter,
        'artist_name': this.artistFilter,
        'collection': this.collectionFilter
      });
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

<style>

table.table {
  background-color: transparent;
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
  /*padding: 10px 40px;*/
  /*border: 2px solid #cecece;*/
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

#table .arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

#table .arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

#table .arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

#table .img_link {
  cursor: pointer;
  width: 100px;
  text-align: center;
}

#table  .img_link:hover {
  opacity: 0.8;
}

#table .img_link:active {
  opacity: 0.5;
}

#table .img_link img {
  max-width: 100px;
  max-height: 100px;
}

#search {
  text-align: center;
}

.artwork_table .table td, .artwork_table .table th {
  vertical-align: middle;
}

.artwork_table .table td.location {
  text-align: center;
}

.view_in_book {
  width: 134px;
  margin-top: 0.2rem;
}

.filterer {
  visibility: hidden;
}

.table td:hover .filterer {
  visibility: visible;
}

.first-nav-item {
  padding-left: 0;
}

.artwork .b-tabs .tab-content {
  overflow: visible !important;
}

.external_link .icon {
  visibility: hidden;
}

.external_link:hover .icon {
  visibility: visible;
}

.img_thumbnail_row {
  background: #1d1d1d;
}

@media screen and (max-width: 400px) {
  .card_container .card-image figure {
    width: 100%;
    max-height: 400px;
  }

  .card_container .card {
    width: 300px;
  }

  #table .nav, #table .nav-left , #table .nav-right {
    display: block;
    height: auto;
    margin-bottom: 4px;
  }

  .dropdown, .dropdown + .dropdown {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
  }


  .dropdown a, .dropdown .button {
    width: 100%;
    display: inline-block;
    max-width: 100%;
  }

  .dropdown + .dropdown {
    margin-top: 4px;
  }

  .dropdown .button {
    text-align: left;
  }

  .dropdown .button .button_action {
    float: right;
  }

  .dropdown .box.is-dropdown {
    overflow: scroll;
    margin-top: 24px;
  }

  .dropdown .selected_title {
    max-width: 80%;
    overflow: hidden;
    display: inline-block;
    height: 100%;
    line-height: 1.5rem;
  }

  #table .is-hidden-tablet {
    display: none;
  }

  #table .nav-left .nav-item {
    padding: 0;
  }

  #table .search {
    width: 100%;
  }

  #table .img_thumbnail_row {
    text-align: center;
    width: 100%;
  }
}
</style>
