<template>
  <div>

    <nav class="nav fixed">
      <div class="nav-left">

        <!-- <a class="nav-item" href="http://www.getty.edu/" target="_blank" title="The Getty">
          <img src="../assets/getty_logo.png" alt="Getty Logo" class="logo">
        </a> -->

        <a class="nav-item">
          <span class="icon" @click="showSearch = !showSearch">
            <icon v-if="!showSearch" name="search" title="search"></icon>
            <icon v-if="showSearch" name="close" title="close"></icon>
          </span>
        </a>



      </div>

      <div class="nav-center">

        <div class="nav-item" v-if="!showSearch">
          <div id="prev" class="nav-item arrow" @click="this.prev">
            <span class="icon is-small">
              <icon name="chevron-left" title="Prev" v-show="!outlineOpen"></icon>
            </span>
          </div>
          <span v-if="!current">{{ title }}</span>
          <span v-if="current">
             {{ shortTitle}}<icon class="navbar-breadcrumb" name="caret-right"></icon>{{ current }}
          </span>
          <div id="next" class="nav-item arrow" @click="this.next">
            <span class="icon is-small">
              <icon name="chevron-right" title="Next" v-show="!outlineOpen"></icon>
            </span>
          </div>
        </div>

        <div class="nav-item" v-if="showSearch">
          <a id="prevMatch" @click="prevMatch" v-if="matchCount">
            <span class="icon is-small">
              <icon name="chevron-left" title="Prev Match"></icon>
            </span>
          </a>
          <p class="control" v-if="matchCount">
            <span class="found" v-if="matchCount">{{currentMatchIndex}} of {{matchCount}}</span>
          </p>
          <a id="nextMatch" @click="nextMatch" v-if="matchCount">
            <span class="icon is-small">
              <icon name="chevron-right" title="Next Match"></icon>
            </span>
          </a>

          <p class="control has-icons-right">
            <input class="input has-icons-right" name="query" v-model="query" results="5" placeholder="search">
            <span class="icon is-small is-right">
              <icon name="search" title="Search"></icon>
            </span>
          </p>
        </div>

      </div>

      <div class="nav-right">

        <div class="nav-item has-addons" v-show="!outlineOpen">
          <p class="control">
            <a id="zoomOut" @click="zoomOut">
              <span class="button is-white is-small">
                <icon name="minus" title="Zoom Out"></icon>
              </span>
            </a>
          </p>
          <p class="control zoom">
            <input class="input is-white is-small" type="text" :value="Math.round(zoomLevel * 100)+'%'">
          </p>
          <p class="control">
            <a id="zoomIn" @click="zoomIn">
              <span class="button is-white is-small">
                <icon name="plus" title="Zoom In"></icon>
              </span>
            </a>
          </p>
          <p class="control">
            <a v-if="spreads" @click="setSpreads(false); showGrid = false; showTable = false;">
              <span class="button is-white is-small">
                <icon name="file-o" title="Single"></icon>
              </span>
            </a>
            <a v-if="!spreads" @click="setSpreads(true); showGrid = false; showTable = false;">
              <span class="button is-white is-small">
                <icon name="columns" title="Spread"></icon>
              </span>
            </a>
          </p>
          <!-- <p class="control">
            <a v-if="false" @click="">
              <span class="button is-white is-small">
                <icon name="i-cursor" title="Cursor"></icon>
              </span>
            </a>
            <a v-if="true" @click="">
              <span class="button is-white is-small">
                <icon name="hand-paper-o" title="Hand"></icon>
              </span>
            </a>
          </p> -->
        </div>

        <a class="nav-item" @click="outlineOpen = !outlineOpen; showGrid = false; showTable = false;">
          <span class="icon">
            <icon v-if="!outlineOpen" name="bars" title="Open Navigation"></icon>
            <icon v-if="outlineOpen" name="close" title="Close Navigation"></icon>
          </span>
        </a>

      </div>
      <!-- <div class="nav-right">
        <div class="nav-item">
          <a id="zoomOut" @click="zoomOut">-</a>
          <span id="zoomLevel" v-if="zoomLevel">{{Math.round(zoomLevel * 100)}}%</span>
          <a id="zoomIn" @click="zoomIn">+</a>
        </div>
        <div class="nav-item">
          Book:
          <a id="artwork-nav-single" @click="setSpreads(false); showGrid = false; showTable = false;">
            <span class="icon is-small">
              <icon name="file-o" title="Single" style="transform: rotate(180deg) scaleX(-1); height: .95em"></icon>
            </span>
          </a>
           |
          <a id="artwork-nav-spread" @click="setSpreads(true); showGrid = false; showTable = false;">
            <span class="icon is-small">
              <icon name="columns" title="Spread"></icon>
            </span>
          </a>
        </div>
        <div class="nav-item">
          Artwork:
          <a id="artwork-nav-table" @click="toggleTable">
            <span class="icon is-small">
              <icon name="table" title="Table"></icon>
            </span>
          </a>
           |
          <a id="artwork-nav-grid" @click="toggleGrid">
            <span class="icon is-small">
              <icon name="th" title="Grid"></icon>
            </span>
          </a>
        </div>
      </div> -->


    </nav>

    <section class="main">
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
    </section>

    <section class="navigation" v-show="outlineOpen">
      <div class="container">
        <b-tabs position="is-centered" v-model="activeTab" @change="onTabChanged">
          <b-tab-item label="Outline">
            <outline :data="outline" :pdf="$refs.pdf" :page="displayedPage" @onClick="this.goto" @current="this.onCurrentTitle"/>
          </b-tab-item>
          <b-tab-item label="Artworks">
            <grid id="grid" ref="grid" :data="images" @onClick="this.onImageSelected" />
          </b-tab-item>
          <b-tab-item label="Table">
            <tablegrid id="table" ref="table" :data="images" @onImageClick="this.onImageSelected" @onPageClick="this.onPageSelected" />
          </b-tab-item>
        </b-tabs>
      </div>
    </section>

    <!-- <section id="outline" v-show="outlineOpen">
      <h2>Outline</h2>
      <outline :data="outline" :pdf="$refs.pdf" :page="displayedPage" @onClick="this.goto" @current="this.onCurrentTitle"/>
      <a class="detail_close" @click="outlineOpen = false">Close</a>
    </section> -->

    <div class="modal" :class="{'is-active': isModalActive}">
      <div class="modal-background" @click="isModalActive = false"></div>
      <div class="modal-content">
        <detail :image="currentDetail" :manifest="manifest" @pageSelected="this.onPageSelected" @closed="this.onDetailClosed" @displayed="this.onDetailDisplayed"/>
      </div>
      <button class="modal-close" @click="isModalActive = false"></button>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import PDF from '@/components/PDF'
import Table from '@/components/Table'
import Grid from '@/components/Grid'
import Outline from '@/components/Outline'
import Detail from '@/components/Detail'
import 'whatwg-fetch'

// Icons
import 'vue-awesome/icons/bars'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/columns'
import 'vue-awesome/icons/file-o'
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/th'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/caret-right'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/minus'
import 'vue-awesome/icons/hand-paper-o'
import 'vue-awesome/icons/i-cursor'

import Icon from 'vue-awesome/components/Icon'
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})
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
      zoomLevel: 0.80,
      shownDetail: undefined,
      displayedDetail: undefined,
      activeTab: 0,
      title: '',
      shortTitle: '',
      current: '',
      isModalActive: false,
      showSearch: false
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
    },
    displayedDetail () {
      if (this.displayedDetail) {
        this.$router.push({ name: 'ImageLink', params: { image: this.displayedDetail } });
      } else {
        this.$router.push({ name: 'Manifest' });
      }
    },
    displayedPage () {
      if (this.displayedPage) {
        this.$router.push({ name: 'PageLink', params: { page: this.displayedPage } });
      } else {
        this.$router.push({ name: 'Manifest' });
      }
    },
  },
  methods: {
    fetchManifest () {
      return fetch(this.manifestUrl)
        .then((response) => {
          return response.json()
        })
        .then((manifest) => {
          this.manifest = manifest;

          this.shortTitle = manifest.title;
          this.title = manifest.title;
          if (manifest.subtitle) {
            this.title += ': ' + manifest.subtitle;
          }

          this.title += ' – ' + manifest.author_as_it_appears;
        }).catch((err) => console.error(err));
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
      }).catch((err) => console.error(err));
    },
    onImageSelected (image) {
      // this.page = (image.page - 1);
      this.currentDetail = image;
      this.isModalActive = true;
    },
    onPageSelected (page) {
      this.page = (page - 1);
      this.showGrid = false;
      this.showTable = false;
      this.currentDetail = undefined;
    },
    onImageClicked (image) {
      this.currentDetail = image.objId;
      this.isModalActive = true;
    },
    onDetailClosed () {
      this.currentDetail = undefined;
    },
    onDetailDisplayed (detail) {
      this.displayedDetail = detail;
    },
    onFound (count) {
      this.matchCount = count;
    },
    onMatch (index) {
      this.currentMatchIndex = index + 1;
    },
    onCurrentTitle (title) {
      this.current = title;

      if (title === 'Cover') {
        this.current = '';
      }
    },
    getBounds () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let header = 52;
      return {
        width: width,
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
    onTabChanged (index) {
      const { grid, table } = this.$refs;

      if (index === 1) {
        grid.triggerLoad();
      }

      if (index === 2) {
        table.triggerLoad();
      }
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

<style>

.nav.fixed {
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #dbdbdb;
  z-index: 15;
}

.nav.section_nav {
  background-color: whitesmoke;

}

.navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin-bottom: 0;
  padding: 60px 40px 0 40px;
  background-color: whitesmoke;
  overflow: auto;
}

.main {
  background-color: #757575;
}

.icon.is-small svg {
  height: 1em;
}

.zoom {
  width: 45px;
}

/*h1, h2, h3 {
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
*/
#detail {
  z-index: 50;
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
  /*z-index: 50;*/
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

.navbar-breadcrumb {
  margin: 0 0.7em;
  height: .7em;
}
</style>
