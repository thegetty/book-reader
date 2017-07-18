<template>
  <div class="card detail_card" v-if="currentDetail">
    <div class="card-image">
      <figure class="image_detail">
        <a :href="currentDetail.artwork_uri">
          <img :src="currentDetail.asset" v-if="!currentDetail.copyright" />
          <img :src="currentDetail.downsampled" v-if="currentDetail.copyright" />
        </a>
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h1 class="title" :class="{'hover': hoverArtist}">
          <span class="is-hidden-mobile">{{currentDetail.artwork_title }}</span>
          <span class="is-hidden-tablet">{{currentDetail.artwork_title | truncate}}</span>
        </h1>
        <h2 class="subtitle" :class="{'hover': hoverArtwork}">
          {{currentDetail.artist_name}}
        </h2>
        <p v-if="currentDetail.collection" :class="{'hover': hoverCollection}">
          {{currentDetail.collection}}
        </p>
        <p class="filter_links" v-if="currentDetail.artwork_title">
          <span class="filter_header">Images in the book:&nbsp;</span>

          <a @click="$emit('infoSelected', {'artwork_title': currentDetail.artwork_title})" class="filter_item">
            <span>
              {{ imagesByArtwork[encodeURI(currentDetail.artwork_title)] && imagesByArtwork[encodeURI(currentDetail.artwork_title)].length }} of this artwork
            </span>
            <span class="icon is-small">
              <icon name="picture-o" title="Filter by Artist"></icon>
            </span>
          </a>
          <span class="spacer" v-if="currentDetail.artist_name">/</span>
          <a @click="$emit('infoSelected', {'artist_name': currentDetail.artist_name})" class="filter_item" v-if="currentDetail.artist_name">
            <span>
              {{ imagesByArtist[encodeURI(currentDetail.artist_name)] && imagesByArtist[encodeURI(currentDetail.artist_name)].length }} by this artist
            </span>
            <span class="icon is-small">
              <icon name="user" title="Filter by Artist"></icon>
            </span>
          </a>
          <span class="spacer" v-if="currentDetail.collection">/</span>
          <a @click="$emit('infoSelected', {'collection': currentDetail.collection})" class="filter_item" v-if="currentDetail.collection">
            <span>
              {{ imagesByCollection[encodeURI(currentDetail.collection)] && imagesByCollection[encodeURI(currentDetail.collection)].length }} from this collection
            </span>
            <span class="icon is-small">
              <icon name="institution" title="Filter by Artist"></icon>
            </span>
          </a>
        </p>
      </div>

    </div>
    <footer class="card-footer">
    <p class="card-footer-item" v-if="currentDetail.artwork_uri">
      <span>
        View in <a :href="currentDetail.artwork_uri" target="_blank">Collection</a>
      </span>
    </p>
    <p class="card-footer-item">
      <span>
        View in <a @click="onPageSelected(currentDetail.page)">Book</a>
      </span>
    </p>
  </footer>

  <div id="prevDetail" class="detail_arrow" @click="this.prevDetail" v-show="!atStart">‹</div>
  <div id="nextDetail" class="detail_arrow" @click="this.nextDetail" v-show="!atEnd">›</div>
  </div>
</template>

<script>
import 'whatwg-fetch'
import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/picture-o'

import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'Detail',
  components: {
    'icon': Icon
  },
  props: {
    'image': {
    },
    'manifest': {
      type: Object
    }
  },
  data () {
    return {
      images: [],
      imagesById: {},
      imagesByArtwork: {},
      imagesByArtist: {},
      imagesByCollection: {},
      currentDetail: undefined,
      hoverArtwork: false,
      hoverArtist: false,
      hoverCollection: false,
      atStart: true,
      atEnd: true
    }
  },
  created () {
    if (this.manifest) {
      this.loaded();
    }
    if (this.image) {
      let imageRef;
      if (typeof this.image === 'string') {
        imageRef = this.image;
      } else {
        imageRef = this.imageRef(this.image);
      }
      this.currentDetail = this.imagesById[imageRef];
    } else {
      this.currentDetail = undefined;
    }

    window.addEventListener('keyup', this.keyListener.bind(this), false);
  },
  beforeDestory () {
    window.removeEventListener('keyup', this.keyListener);
  },
  filters: {
    truncate: function (text, stop = 48, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '…' : '');
    }
  },
  watch: {
    manifest () {
      this.loaded();
    },
    image () {
      let imageRef;
      if (this.image) {
        if (typeof this.image === 'string') {
          imageRef = this.image;
        } else {
          imageRef = this.imageRef(this.image);
        }
        this.currentDetail = this.imagesById[imageRef];

        if (!this.currentDetail) {
          this.$emit('closed');
        }
      } else {
        this.currentDetail = undefined;
      }
    },
    currentDetail () {
      let imageRef;
      if (this.currentDetail) {
        imageRef = this.imageRef(this.currentDetail);
        this.$emit('displayed', imageRef);
      } else {
        this.$emit('closed');
      }

      const index = this.images.indexOf(this.currentDetail);
      if (index + 1 >= this.images.length) {
        this.atEnd = true;
      } else if (this.atEnd) {
        this.atEnd = false;
      }

      if (index <= 0) {
        this.atStart = true;
      } else if (this.atStart) {
        this.atStart = false;
      }
    }
  },
  methods: {
    imageRef (image) {
      return `img_p${image.page - 1}_${image.location}`;
    },
    reset () {
      this.images = [];
      this.imagesById = {};
      this.imagesByArtwork = {};
      this.imagesByArtist = {};
      this.imagesByCollection = {};
    },
    loaded () {
      if (!this.manifest || !this.manifest.images) {
        return;
      }
      this.images = this.manifest.images;

      this.images.forEach((image) => {
        let ref = this.imageRef(image);
        this.imagesById[ref] = image;

        if (image.artwork_title) {
          let artworkUri = encodeURI(image.artwork_title);
          if (!this.imagesByArtwork[artworkUri]) {
            this.imagesByArtwork[artworkUri] = [];
          }
          this.imagesByArtwork[artworkUri].push(image);
        }

        if (image.artist_name) {
          let artistUri = encodeURI(image.artist_name);
          if (!this.imagesByArtist[artistUri]) {
            this.imagesByArtist[artistUri] = [];
          }
          this.imagesByArtist[artistUri].push(image);
        }

        if (image.collection) {
          let collectionUri = encodeURI(image.collection);
          if (!this.imagesByCollection[collectionUri]) {
            this.imagesByCollection[collectionUri] = [];
          }
          this.imagesByCollection[collectionUri].push(image);
        }
      });
    },
    onPageSelected (page) {
      this.$emit('pageSelected', page);
      // this.currentDetail = undefined;
    },
    keyListener (e) {
      const { keyCode } = e;

      if (!this.currentDetail) {
        return;
      }

      if (keyCode === 37) {
        this.prevDetail();
      } else if (keyCode === 39) {
        this.nextDetail();
      }
    },
    nextDetail () {
      const index = this.images.indexOf(this.currentDetail);
      if (index + 1 < this.images.length) {
        this.currentDetail = this.images[index + 1];
      }
    },
    prevDetail () {
      const index = this.images.indexOf(this.currentDetail);
      if (index - 1 >= 0) {
        this.currentDetail = this.images[index - 1];
      }
    },
    onDetailClosed () {
      this.currentDetail = undefined;
      this.$emit('closed');
    },
    artistLookup (e) {
      let uri = this.currentDetail.artist_uri;
      if (uri.indexOf('.json') === uri.length - 5) {
        fetch(uri)
          .then((response) => {
            return response.json()
          })
          .then((artistJson) => {
            this.currentDetail.artist_json = artistJson;
            console.log(artistJson);
          })
          .catch((err) => console.error(err));

        e.preventDefault();
      }
    }
  }
}
</script>

<style lang="scss">

.detail_card {
  &.card {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    max-width: 50vw;
  }

  .content {
    /*max-width: 40vw;*/
  }

  .detail_arrow {
    position: fixed;
    top: 50%;
    margin-top: -32px;
    font-size: 64px;
    color: #E2E2E2;
    font-family: arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  #prevDetail {
    left: 20%;
  }

  #nextDetail {
    right: 20%;
  }

  .image_detail {
    background-color: #1d1d1d;
  }

  .image_detail a {
    overflow: hidden;
    display: block;
  }

  .image_detail img {
    max-width: 100%;
    max-height: calc(100vh - 360px);
    display: block;
    margin: 0 auto;
  }

  .card-content {
    position: relative;
  }

  .card-content .content .button {
    vertical-align: middle;
    position: absolute;
    right: 1.5rem;
    font-style: normal !important;
  }

  .card-content .content h1.hover,
  .card-content .content h2.hover,
  .card-content .content p.hover {
    text-decoration: underline;
  }

  .card-content .content .subtitle {
    font-style: italic;
  }

  .spacer {
    padding: 0 .25rem;
  }

  .filter_links {
    color: #777777;
    text-align: center;
    font-size: 0.75rem;
  }

  .filter_item {
    white-space: nowrap;
  }
}

@media screen and (max-width: 400px) {
  .detail_card {
    .detail_arrow {
      top: auto;
      bottom: 5px;
      font-size: 40px;
      margin-top: 0;
    }

    #prevDetail {
      left: 5%;
    }

    #nextDetail {
      right: 5%;
    }

    &.card {
      max-width: 90vw;
    }

    .content {
      max-width: 80vw;
    }

    .modal-content {
      font-size: 0.7rem;
    }
  }
}
</style>
