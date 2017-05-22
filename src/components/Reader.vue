<template>
  <div id="page-wrap">
    <header id="menu">
      <ul id="nav">
        <li id="toc-nav">
          <a @click="outlineOpen = !outlineOpen"><icon name="list-ul" title="Outline"></icon></a>
        </li>
        <li id="search-nav">
          <a><icon name="search" title="Search"></icon></a>
        </li>
        <li id="title-nav">{{manifest.title}}: {{manifest.subtitle}}, {{manifest.author_as_it_appears}}</li>
        <li id="book-nav">
          Book:
          <a id="artwork-nav-single" @click="setSpreads(false); showGrid = false; showTable = false;"><icon name="file-o" title="Single" style="transform: rotate(180deg) scaleX(-1); height: .95em"></icon></a>
           |
          <a id="artwork-nav-spread" @click="setSpreads(true); showGrid = false; showTable = false;"><icon name="columns" title="Spread"></icon></a>
        </li>
        <li id="artwork-nav">
          Artwork:
          <a id="artwork-nav-table" @click="toggleTable"><icon name="table" title="Table"></icon></a>
           |
          <a id="artwork-nav-grid" @click="toggleGrid"><icon name="th" title="Grid"></icon></a>
        </li>
      </ul>
    </header>
    <section id="main">
      <PDF id="pdf" ref="pdf"
          :src="this.manifest.pdf"
          :page="page"
          @loaded="loaded"
          :width="this.width"
          :height="this.height"
          :spreads="spreads"
          :onImageClicked="this.onImageClicked"
          :onOutlineReady="this.onOutlineReady"
          @pageChanged="this.onPageChanged"
        />
      <div id="prev" class="arrow" @click="this.prev">‹</div>
      <div id="next" class="arrow" @click="this.next">›</div>
      <div id="images" v-show="showGrid || showTable">
        <grid id="grid" ref="grid" v-show="showGrid" :data="images" @onClick="this.onImageSelected" />
        <tablegrid id="table" ref="table" v-show="showTable" :data="images" @onImageClick="this.onImageSelected" @onPageClick="this.onPageSelected" />
      </div>
    </section>
    <section id="detail" v-if="currentDetail">
      <div class="image_detail">
        <img :src="currentDetail.asset">
      </div>
      <div class="image_info" v-if="currentDetail.artwork_title">
        <h1>{{currentDetail.artwork_title}}</h1>
        <h4><a :href="currentDetail.artwork_uri">{{currentDetail.artwork_uri}}</a></h4>

        <h2>{{currentDetail.artist_name}}</h2>
        <h4><a :href="currentDetail.artist_uri">{{currentDetail.artist_uri}}</a></h4>

        <h3>{{currentDetail.collection}}</h3>
        <h4><a :href="currentDetail.collection_uri">{{currentDetail.collection_uri}}</a></h4>
      </div>
      <a class="detail_view" @click="onPageSelected(currentDetail.page); currentDetail = undefined">View in Book</a>
      <a class="detail_close" @click="currentDetail = undefined">Close</a>
    </section>
    <section id="outline" v-show="outlineOpen">
      <h2>Outline</h2>
      <outline :data="outline" :pdf="$refs.pdf" :page="displayedPage" @onClick="this.goto"/>
      <a class="detail_close" @click="outlineOpen = false">Close</a>
    </section>
  </div>
</template>

<script>
import PDF from '@/components/PDF'
import Table from '@/components/Table'
import Grid from '@/components/Grid'
import Outline from '@/components/Outline'
import 'whatwg-fetch'

// Icons
import 'vue-awesome/icons/list-ul'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/columns'
import 'vue-awesome/icons/file-o'
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/th'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'reader',
  components: {
    'PDF': PDF,
    'grid': Grid,
    'tablegrid': Table,
    'icon': Icon,
    'outline': Outline
  },
  props: ['manifest-url'],
  data () {
    let bounds = this.getBounds();

    return {
      manifest: {},
      images: [],
      imagesById: {},
      page: 0,
      displayedPage: 0,
      spreads: true,
      showTable: false,
      showGrid: false,
      currentDetail: undefined,
      width: bounds.width,
      height: bounds.height,
      outline: undefined,
      outlineOpen: false
    }
  },
  created () {
    this.fetchManifest();
    window.addEventListener('keyup', this.keyListener.bind(this), false);
  },
  beforeDestory () {
    window.removeEventListener('keyup', this.keyListener);
  },
  watch: {
    showTable () {
      const { table } = this.$refs;
      table.triggerLoad();
    },
    showGrid () {
      const { grid } = this.$refs;
      grid.triggerLoad();
    }
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
    goto (dest) {
      const { pdf } = this.$refs;
      this.outlineOpen = false;
      return pdf.getPageIndex(dest[0]).then((pg) => {
        this.page = pg;
      });
    },
    onImageSelected (image) {
      // this.page = (image.page - 1);
      this.currentDetail = image;
    },
    onPageSelected (page) {
      this.page = (page - 1);
      this.showGrid = false;
      this.showTable = false;
    },
    onImageClicked (image) {
      this.currentDetail = this.imagesById[image.objId];
    },
    getBounds () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let scaler = 0.8;
      return {
        width: width * scaler,
        height: height * scaler
      };
    },
    setSpreads (spreads) {
      if (this.spreads !== spreads) {
        this.spreads = spreads;
      }
    },
    onOutlineReady (outline) {
      this.outline = outline;
    },
    onPageChanged (pages) {
      this.displayedPage = pages[pages.length - 1];
    },
    toggleTable () {
      this.showTable = !this.showTable;
      this.showGrid = false;
    },
    toggleGrid () {
      this.showGrid = !this.showGrid;
      this.showTable = false;
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

#page-wrap {
  background: #D3D3D3;
}

#page-wrap > header {
  padding: 15px;
  -webkit-transition: opacity 1s;
  transition: opacity 0.8s;
  opacity: 0.3;
  height: 24px;
  overflow: hidden;
}

#page-wrap > header:hover {
  opacity: 1;
}

#main {
  position: relative;
  width: calc(100vw - 80px);
  min-height: calc(100vh - 54px);
  margin: 0;
  padding: 0 40px;
  background: #D3D3D3;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  overflow: auto;
  display: flex;
  justify-content: center;
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
  color: #696969;
}

#nav li a {
  cursor: pointer;
  color: #696969;
  display: inline-block;
}

#nav li a:active {
  color: #151515;
}

#nav li a:active .fa-icon {
  margin-bottom: -4px;
}

#title-nav {
  flex-grow: 100;
}

#detail {
  position: absolute;
  top: 60px;
  left: 20px;
  width: calc(100vw - 120px);
  height: calc(100vh - 160px);
  padding: 40px;
  background: #333333;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  overflow: auto;
  display: flex;
  justify-content: center;
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

.fa-icon {
  width: auto;
  height: 1em;
  margin-bottom: -3px;
}

#outline {
  position: absolute;
  top: 60px;
  left: 20px;
  width: calc(100vw - 120px);
  height: calc(100vh - 160px);
  padding: 40px;
  background: #333333;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  overflow: auto;
}

#outline h2 {
  display: block;
  color: #fff;
}

#outline ul {
  list-style: none;
}

#outline a.outline_link {
  color: #eee;
}

</style>
