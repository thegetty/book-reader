<template>
  <div id="grid">
    <nav class="nav section_nav">
      <div class="nav-center" style="overflow: visible">

        <b-dropdown position="is-bottom-left" v-model="artworkFilter" v-show="!artworkFilter">
          <button class="button" slot="trigger" @click="artworkFilter = undefined;">
            <span class="icon is-small">
              <icon name="picture-o" title="Filter by Artwork"></icon>
            </span>
            <span>Artworks</span>
            <b-icon icon="arrow_drop_down" class="button_action"></b-icon>
          </button>

          <b-dropdown-option
            v-for="artwork in artworks"
            :key="artwork.uri"
            :value="artwork.name"
            :selected="artworkFilter === artwork.name">
            {{artwork.name | truncate }}
          </b-dropdown-option>

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

          <b-dropdown-option
            v-for="artist in artists"
            :key="artist.uri"
            :value="artist.name"
            :selected="artistFilter === artist.name">
            {{artist.name | truncate}}
          </b-dropdown-option>

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

          <b-dropdown-option
            v-for="collection in collections"
            :key="collection.uri"
            :value="collection.name"
            :selected="collectionFilter === collection.name">
            {{collection.name | truncate}}
          </b-dropdown-option>

        </b-dropdown>
        <span class="dropdown" v-if="collectionFilter">
          <button class="button" slot="trigger" @click="collectionFilter = undefined;">
              <span class="selected_title">{{collectionFilter}}</span>
              <b-icon icon="close" class="is-small button_action"></b-icon>
          </button>
        </span>
      </div>
    </nav>

    <div ref="container" class="container card_container">
      <div class="columns card_columns">
        <div class="column" v-for="images in chunkedData">
          <div class="card card_wrapper" v-for="image in images">
            <div class="card-image">
              <figure class="image">
                <a class="img_link" @click="$emit('onClick', image)">
                  <img class="downsampled" v-lazy="image.downsampled || image.asset" />
                </a>
              </figure>
            </div>
            <!-- <div class="card-footer">
              <div class="card-footer-item">
                <span>{{ image.artwork_title }}</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueLazyload from 'vue-lazyload'
import Vue from 'vue'

import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/picture-o'

import Icon from 'vue-awesome/components/Icon'

Vue.use(VueLazyload);

export default {
  name: 'grid',
  components: {
    'icon': Icon
  },
  props: {
    'images': {
      type: Array
    },
    'filter': {
      type: Object,
      default: undefined
    },
    'imagesByArtwork': {
      type: Object
    },
    'imagesByArtist': {
      type: Object
    },
    'imagesByCollection': {
      type: Object
    },
    'artworks': {
      type: Array
    },
    'artists': {
      type: Array
    },
    'collections': {
      type: Array
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
      gridColumns: 4,
      artistFilter: '',
      artworkFilter: '',
      collectionFilter: ''
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize.bind(this), false);
    this.$nextTick(() => this.handleResize());

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
  beforeDestory () {
    window.removeEventListener('resize', this.handleResize);
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
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase();
      var artworkFilter = this.artworkFilter && this.artworkFilter.toLowerCase();
      var artistFilter = this.artistFilter && this.artistFilter.toLowerCase();
      var collectionFilter = this.collectionFilter && this.collectionFilter.toLowerCase();
      var order = this.sortOrders[sortKey] || 1;
      var data = this.images;

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
    },
    chunkedData() {
      let cols = this.gridColumns || 4;
      let chunked = [];

      for (let c = 0; c < cols; c++) {
        chunked[c] = [];
      }

      for (let i = 0; i < this.filteredData.length; i++) {
        chunked[i % cols].push(this.filteredData[i]);
      }

      return chunked;
    }
  },
  watch: {
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
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    triggerLoad: function () {
      Vue.nextTick(this.$Lazyload.lazyLoadHandler)
    },
    handleResize () {
      let width = window.innerWidth;

      this.gridColumns = Math.floor((width - 200) / 200);
    }
  }
}
</script>

<style lang="scss">
#grid {
  .img_link {
    cursor: pointer;
  }

  .img_link:hover {
    opacity: 0.8;
  }

  .img_link:active {
    opacity: 0.5;
  }

  .card_container .image .img_link img {
    object-fit: cover;
    max-width: none;
    width: 100%;
    height: 100%;
  }

  .card_container .card-image figure {
    width: 200px;
    max-height: 400px;
    overflow: hidden;
    display: block;
  }

  .card_container .card {
    width: 200px;
    flex-grow: 0;
    margin-bottom: 24px;
  }

  .card_container .card .card-footer {
    /*display: none;*/
  }

  .card_container .card:hover .card-footer {
    display: block;
  }

  .card_container {
    /*display: flex;
    flex-direction: row;
    justify-content: center;*/
    padding-top: 24px;
  }

  .card_columns {
    justify-content: center;
  }


  .card_columns .column {
    flex-grow: 0;
  }
}

@media screen and (min-width: 400px) {
  .card_columns {
    display: flex;
  }
}

@media screen and (max-width: 768px) {
  #grid {
    .card_container .card-image figure {
      width: 292px;
      max-height: 400px;
    }

    .card_container .card {
      width: 292px;
      margin-left: 1px;
    }

    .nav, .nav-center {
      display: block;
      height: auto;
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
  }
}

</style>
