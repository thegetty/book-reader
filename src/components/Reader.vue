<template>
  <div id="page-wrap">
    <header id="menu">
      <ul id="nav">
        <li id="toc-nav">
          <a>ToC</a>
        </li>
        <li id="search-nav">
          <a>Search</a>
        </li>
        <li id="title-nav">{{manifest.title}}: {{manifest.subtitle}}, {{manifest.author_as_it_appears}}</li>
        <li id="book-nav">
          Book:
          <a id="artwork-nav-single" @click="setSpreads(false); showGrid = false; showTable = false;">Single</a>
           |
          <a id="artwork-nav-spread" @click="setSpreads(true); showGrid = false; showTable = false;">Spread</a>
        </li>
        <li id="artwork-nav">
          Artwork:
          <a id="artwork-nav-table" @click="showTable = !showTable; showGrid = false">Table</a>
           |
          <a id="artwork-nav-grid" @click="showGrid = !showGrid; showTable = false">Grid</a>
        </li>
      </ul>
    </header>
    <section id="main">
      <PDF id="pdf" ref="pdf" :src="this.manifest.pdf" :page="page" @loaded="loaded" :width="this.width" :spreads="spreads" :onImageClicked="this.onImageClicked"/>
      <div id="prev" class="arrow" @click="this.prev">‹</div>
      <div id="next" class="arrow" @click="this.next">›</div>
      <div id="images" v-show="showGrid || showTable">
        <grid id="grid" v-if="showGrid" :data="images" @onClick="this.onImageSelected" />
        <tablegrid id="table" v-if="showTable" :data="images" @onClick="this.onImageSelected" />
      </div>
      <section id="detail" v-if="currentDetail">
        <div class="image_detail">
          <img :src="currentDetail.asset">
        </div>
        <div class="image_info">
          <h1>{{currentDetail.artwork_title}}</h1>
          <h4><a :href="currentDetail.artwork_uri">{{currentDetail.artwork_uri}}</a></h4>

          <h2>{{currentDetail.artist_name}}</h2>
          <h4><a :href="currentDetail.artist_uri">{{currentDetail.artist_uri}}</a></h4>

          <h3>{{currentDetail.collection}}</h3>
          <h4><a :href="currentDetail.collection_uri">{{currentDetail.collection_uri}}</a></h4>
        </div>
        <a class="detail_close" @click="currentDetail = undefined">Close</a>
      </section>
    </section>
  </div>
</template>

<script>
import PDF from '@/components/PDF'
import Table from '@/components/Table'
import Grid from '@/components/Grid'
import 'whatwg-fetch'

export default {
  name: 'reader',
  components: {
    'PDF': PDF,
    'grid': Grid,
    'tablegrid': Table
  },
  props: ['manifest-url'],
  data () {
    return {
      manifest: {},
      images: [],
      imagesById: {},
      page: 0,
      spreads: true,
      showTable: false,
      showGrid: false,
      currentDetail: undefined,
      width: this.getWidth()
    }
  },
  created () {
    this.fetchManifest();
    window.addEventListener('keyup', this.keyListener.bind(this), false);
  },
  beforeDestory () {
    window.removeEventListener('keyup', this.keyListener);
  },
  methods: {
    fetchManifest () {
      return fetch(this.manifestUrl)
        .then((response) => {
          return response.json()
        })
        .then((manifest) => {
          console.log(manifest)
          this.manifest = manifest;
        })
    },
    loaded () {
      // Wait for PDF to load
      this.images = this.manifest.images;

      this.images.forEach((image) => {
        this.imagesById[`img_p${image.page - 1}_${image.location}`] = image;
      });
    },
    next () {
      const { pdf } = this.$refs;
      pdf.next();
    },
    prev () {
      const { pdf } = this.$refs;
      pdf.prev();
    },
    keyListener (e) {
      const { keyCode } = e;
      if (keyCode === 37) {
        this.prev();
      } else if (keyCode === 39) {
        this.next();
      }
    },
    onImageSelected (image) {
      this.page = (image.page - 1);
      this.showGrid = false;
      this.showTable = false;
      this.currentDetail = image;
    },
    onImageClicked (image) {
      this.currentDetail = this.imagesById[image.objId];
    },
    getWidth () {
      let width = window.innerWidth;
      let scaler = 0.8;
      return width * scaler;
    },
    setSpreads (spreads) {
      if (this.spreads !== spreads) {
        this.spreads = spreads;

        if (spreads) {
          this.width = this.width * 2;
        } else {
          this.width = this.width / 2;
        }
      }
    }

  }
}
</script>

<style scoped>

h1, h2, h3 {
  font-weight: normal;
  display: inline;
  font-size: 16px;
}

a {
  color: #42b983;
}

#prev {
  left: 40px;
}

#next {
  right: 40px;
}

.arrow {
  position: absolute;
  top: 50vh;
  margin-top: -32px;
  font-size: 64px;
  color: #E2E2E2;
  font-family: arial, sans-serif;
  font-weight: bold;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  /*display: none;*/
}

.arrow:hover {
  color: #777;
}

.arrow:active {
  color: #000;
}

header {
  padding: 15px;
}

#main {
  position: relative;
  width: calc(100vw - 80px);
  min-height: calc(100vh - 132px);
  margin: 0 auto;
  padding: 40px;
  background: #D3D3D3;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  overflow: auto;
}

#pdf {
  margin: 40px auto;
}

#images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #D3D3D3;
}

#grid {
  margin: 0 auto;
}

#table {
  margin: 0 auto;
}

#nav {
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
}

#nav li {
  margin: 0 6px;
}

#nav li a {
  cursor: pointer;
}

#title-nav {
  flex-grow: 100;
}

#detail {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw - 80px);
  min-height: calc(100vh - 132px);
  margin: 0 auto;
  padding: 40px;
  background: #333333;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  overflow: auto;
}

.image_detail img {
  float: left;
  max-width: 50vw;
  max-height: calc(100vh - 132px);
  margin-right: 40px;
}

.image_info {
  color: #eee;
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
  padding: 20px;
  cursor: pointer;
}
</style>
