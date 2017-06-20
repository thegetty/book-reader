<template>
  <div id="page-wrap">
    <header id="menu">
      <ul id="nav">
        <li id="toc-nav">
          <a @click="outlineOpen = !outlineOpen; showGrid = false; showTable = false;"><icon name="list-ul" title="Outline"></icon></a>
        </li>
        <li id="search-nav">
          <input id="search" name="query" v-model="query" type="search" results="5">
          <a id="prevMatch" @click="prevMatch" v-if="matchCount">‹</a>
          <span id="found" v-if="matchCount">{{currentMatchIndex}} of {{matchCount}}</span>
          <a id="nextMatch" @click="nextMatch" v-if="matchCount">›</a>
          <!-- <icon name="search" title="Search"></icon> -->
        </li>
        <li id="title-nav">{{manifest.title}}: {{manifest.subtitle}}, {{manifest.author_as_it_appears}}</li>
        <li id="zoom-nav">
          <a id="zoomOut" @click="zoomOut">-</a>
          <span id="zoomLevel" v-if="zoomLevel">{{Math.round(zoomLevel * 100)}}%</span>
          <a id="zoomIn" @click="zoomIn">+</a>
        </li>
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
          @found="this.onFound"
          @match="this.onMatch"
          :query="query"
          :zoom="zoomLevel"
        />
      <div id="prev" class="arrow" @click="this.prev">‹</div>
      <div id="next" class="arrow" @click="this.next">›</div>
      <div id="images" v-show="showGrid || showTable">
        <grid id="grid" ref="grid" v-show="showGrid" :data="images" @onClick="this.onImageSelected" />
        <tablegrid id="table" ref="table" v-show="showTable" :data="images" @onImageClick="this.onImageSelected" @onPageClick="this.onPageSelected" />
      </div>
    </section>
    <detail :image="currentDetail" :manifest="manifest" @pageSelected="this.onPageSelected" @detailClosed="this.onDetailClosed"/>
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
import Detail from '@/components/Detail'
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
    'outline': Outline,
    'detail': Detail
  },
  props: {
    'manifest-url': {
      type: String
    },
    'page-url': {
      type: String
    },
    'image-url': {
      type: String
    }
  },
  data () {
    let bounds = this.getBounds();

    return {
      manifest: {},
      images: [],
      page: 0,
      displayedPage: 0,
      spreads: true,
      showTable: false,
      showGrid: false,
      currentDetail: undefined,
      width: bounds.width,
      height: bounds.height,
      outline: undefined,
      outlineOpen: false,
      query: '',
      matchCount: undefined,
      currentMatchIndex: undefined,
      zoomLevel: 1.0
    }
  },
  created () {
    this.fetchManifest();
    window.addEventListener('keyup', this.keyListener.bind(this), false);
    window.addEventListener('resize', this.handleResize.bind(this), false);
    this.currentDetail = undefined;
  },
  beforeDestory () {
    window.removeEventListener('resize', this.handleResize);
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
    },
    pageUrl () {
      if (this.loaded) {
        this.page = parseInt(this.pageUrl);
      }
    },
    imageUrl () {
      if (this.loaded) {
        this.currentDetail = this.imageUrl;
      }
    }
  },
  methods: {
    fetchManifest () {
      return fetch(this.manifestUrl)
        .then((response) => {
          return response.json()
        })
        .then((manifest) => {
          this.manifest = manifest;
        })
        .catch((err) => console.error(err));
    },
    loaded (pdfDocument) {
      this.loaded = true;

      this.pdfDocument = pdfDocument;
      // Wait for PDF to load
      this.images = this.manifest.images;

      if (this.imageUrl) {
        this.currentDetail = this.imageUrl;
      }

      if (this.pageUrl) {
        this.page = parseInt(this.pageUrl);
      }
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
    handleResize () {
      let bounds = this.getBounds();
      this.width = bounds.width;
      this.height = bounds.height;
    },
    goto (dest) {
      const { pdf } = this.$refs;
      this.outlineOpen = false;
      return pdf.getPageIndex(dest[0]).then((pg) => {
        this.page = pg;
      })
      .catch((err) => console.error(err));
    },
    onImageSelected (image) {
      // this.page = (image.page - 1);
      this.currentDetail = image.objId;
    },
    onPageSelected (page) {
      this.page = (page - 1);
      this.showGrid = false;
      this.showTable = false;
      this.currentDetail = undefined;
    },
    onImageClicked (image) {
      this.currentDetail = image.objId;
    },
    onDetailClosed () {
      this.currentDetail = undefined;
    },
    onFound (count) {
      this.matchCount = count;
    },
    onMatch (index) {
      this.currentMatchIndex = index + 1;
    },
    getBounds () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let header = 134;
      return {
        width: width - header,
        height: height - header
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
      this.page = -1; // reset
    },
    toggleTable () {
      this.showTable = !this.showTable;
      this.showGrid = false;
    },
    toggleGrid () {
      this.showGrid = !this.showGrid;
      this.showTable = false;
    },
    nextMatch () {
      const { pdf } = this.$refs;
      pdf.nextMatch();
    },
    prevMatch () {
      const { pdf } = this.$refs;
      pdf.prevMatch();
    },
    zoomIn () {
      // Handle https://en.wikipedia.org/wiki/IEEE_floating_point
      this.zoomLevel = Math.round(this.zoomLevel * 10 + 2) / 10;
    },
    zoomOut () {
      if (this.zoomLevel > 0.20) {
        this.zoomLevel = Math.round(this.zoomLevel * 10 - 2) / 10;
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
