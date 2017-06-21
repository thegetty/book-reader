<template>
  <section class="box" v-if="currentDetail">
    <div class="image_detail">
      <img :src="currentDetail.asset" v-if="!currentDetail.copyright" />
      <img :src="currentDetail.downsampled" v-if="currentDetail.copyright" />
      <p><a :href="currentDetail.collection_uri">{{currentDetail.collection}}</a></p>
    </div>
    <div class="image_info" v-if="currentDetail.artwork_title">
      <h1>{{currentDetail.artwork_title}}</h1>

      <h4><a :href="currentDetail.artwork_uri">{{currentDetail.artwork_uri}}</a></h4>
      <aside v-if="this.imagesByArtwork[encodeURI(currentDetail.artwork_title)].length > 1">
        <h5>Also in this book</h5>
        <ul class="related_images">
          <li v-for="relatedImage in this.imagesByArtwork[encodeURI(currentDetail.artwork_title)]" v-if="currentDetail != relatedImage">
            <a class="related_img_link" @click="currentDetail = relatedImage">
              <img :src="relatedImage.thumbnail" />
              <span>{{ relatedImage.page_label || relatedImage.page }}</span>
            </a>
          </li>
        </ul>
      </aside>

      <h2>
        <a :href="currentDetail.artist_uri" @click="artistLookup">{{currentDetail.artist_name}}</a>
      </h2>
      <aside v-if="this.imagesByArtist[encodeURI(currentDetail.artist_name)].length > 1">
        <h5>Also in this book</h5>
        <ul class="related_images">
          <li v-for="relatedImage in this.imagesByArtist[encodeURI(currentDetail.artist_name)]"
              v-if="currentDetail != relatedImage && (imagesByArtwork[encodeURI(currentDetail.artwork_title)] && imagesByArtwork[encodeURI(currentDetail.artwork_title)].indexOf(relatedImage) === -1)">
            <a class="related_img_link" @click="currentDetail = relatedImage">
              <img :src="relatedImage.thumbnail" />
              <span>{{ relatedImage.page_label || relatedImage.page }}</span>
            </a>
          </li>
        </ul>
      </aside>

    </div>
    <a class="detail_view" @click="onPageSelected(currentDetail.page);">View in Book</a>
    <div id="prevDetail" class="detail_arrow" @click="this.prevDetail">‹</div>
    <div id="nextDetail" class="detail_arrow" @click="this.nextDetail">›</div>
    <a class="detail_close" @click="onDetailClosed">Close</a>
  </section>
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'Detail',
  components: {

  },
  props: {
    'image': {
      type: String
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
      currentDetail: undefined
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
      } else {
        this.currentDetail = undefined;
      }
    },
    currentDetail () {
      let imageRef;
      if (this.currentDetail) {
        imageRef = this.imageRef(this.currentDetail);
      }
      this.$emit('displayed', imageRef);
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
      this.currentDetail = undefined;
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

<style scoped>


.related_images {
  list-style: none;
  padding: 0;
}

.related_images li {
  display: inline-block;
  margin-right: 12px;
}

.related_images img {
  display: block;
}

.related_images span {
  display: block;
  text-align: center;
}

.related_images li a {
  cursor: pointer;
}

.detail_arrow {
  position: absolute;
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
  left: 8px;
}

#nextDetail {
  right: 8px;
}

.image_detail img {

  max-width: 50vw;
  max-height: calc(100vh - 152px);
}

.image_info {
  color: #eee;
  margin-left: 40px;
  min-width: 40vw;
}

.image_info h1 {
  font-size: 34px;
  font-weight: bold;
}

.image_info h2 {
  font-size: 24px;
}

.image_info h3 {
  font-size: 24px;
}

.image_info h4 {
  margin: 0 0 40px 0;
}

.detail_close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 10px 0 0;
  cursor: pointer;
}

.detail_view {
  position: absolute;
  top: 0;
  right: 50px;
  padding: 10px 10px 0 0;
  cursor: pointer;
}

h1, h2, h3 {
  font-weight: normal;
  display: inline;
  font-size: 16px;
}

a {
  color: #42b983;
}
</style>
