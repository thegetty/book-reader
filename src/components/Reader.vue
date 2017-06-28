 <template>
  <div>
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">

    <nav class="nav fixed" :class="{'open': navOpen || outlineOpen || artworkOpen}">
      <div class="nav-left">

        <!-- <a class="nav-item" href="http://www.getty.edu/" target="_blank" title="The Getty">
          <img src="../assets/getty_logo.png" alt="Getty Logo" class="logo">
        </a> -->

        <a class="nav-item" @click="outlineOpen = !outlineOpen; showGrid = false; showTable = false;">
          <span class="icon">
            <icon v-if="!outlineOpen" name="bars" title="Open Navigation"></icon>
            <icon v-if="outlineOpen" name="close" title="Close Navigation"></icon>
          </span>
        </a>

        <a class="nav-item" v-show="!artworkOpen && !showSearch">
          <span class="icon" @click="showSearch = !showSearch">
            <icon v-if="!showSearch" name="search" title="search"></icon>
            <icon v-if="showSearch" name="close" title="search"></icon>
          </span>
        </a>

        <div class="nav-item" v-if="showSearch && !artworkOpen">
          <div class="field has-addons">
            <p class="control has-icons-right" id="matchCount">
              <input class="input has-icons-right" name="query" v-model="query" results="5" placeholder="search">
              <span class="icon is-small is-right" v-if="matchCount">{{currentMatchIndex}} of {{matchCount}}</span>
              <!-- <span class="icon is-small is-right" v-if="!query">
                <icon name="search" title="Search"></icon>
              </span> -->
            </p>

            <p class="control">
              <a class="button" @click="prevMatch">
                <span class="icon is-small">
                  <icon name="chevron-left" title="Prev Match"></icon>
                </span>
              </a>
            </p>

            <p class="control">
              <a class="button" @click="nextMatch">
                <span class="icon is-small">
                  <icon name="chevron-right" title="Next Match"></icon>
                </span>
              </a>
            </p>

            <p class="control">
              <a class="button" @click="showSearch = false; query = ''">
                <span class="icon is-small">
                  <icon name="close" title="Close Search"></icon>
                </span>
              </a>
            </p>
          </div>


        </div>



      </div>

      <div class="nav-center">

        <div class="nav-item" v-if="!artworkOpen">
          <!-- <div id="prev" class="nav-item arrow" @click="this.prev">
            <span class="icon is-small">
              <icon name="chevron-left" title="Prev" v-show="!outlineOpen"></icon>
            </span>
          </div> -->
          <span v-if="!current">{{ title }}</span>
          <span v-if="current">
             {{ shortTitle }}<icon class="navbar-breadcrumb" name="caret-right"></icon>{{ current }}
          </span>
          <!-- <div id="next" class="nav-item arrow" @click="this.next">
            <span class="icon is-small">
              <icon name="chevron-right" title="Next" v-show="!outlineOpen"></icon>
            </span>
          </div> -->
        </div>

        <div class="nav-item" v-if="artworkOpen">
          {{ shortTitle }}<icon class="navbar-breadcrumb" name="caret-right"></icon>Artworks
        </div>

      </div>

      <div class="nav-right">
        <a class="nav-item" @click="artworkOpen = !artworkOpen; showGrid = false; showTable = false;">
          <span class="icon">
            <icon v-if="!artworkOpen" name="picture-o" title="Artwork"></icon>
            <icon v-if="artworkOpen" name="book" title="Book"></icon>
          </span>
        </a>
      </div>

    </nav>

    <section class="main" ref="main">
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

      <div id="prev" class="arrow" @click="this.prev">
        <span class="icon">
          <icon name="chevron-left" title="Prev" v-show="!outlineOpen"></icon>
        </span>
      </div>
      <div id="next" class="arrow" @click="this.next">
        <span class="icon">
          <icon name="chevron-right" title="Next" v-show="!outlineOpen"></icon>
        </span>
      </div>
      <div class="floater" :class="{'open': navOpen}" v-show="!artworkOpen">
        <div class="field has-addons is-pulled-left">
          <p class="control">
            <a class="button" @click="zoomOut">
              <span class="icon is-small">
                <icon name="search-minus" title="Zoom Out"></icon>
              </span>
            </a>
          </p>
          <p class="control zoom_input">
            <input class="input" type="text" :value="Math.round(zoomLevel * 100)+'%'">
          </p>
          <p class="control">
            <a class="button" @click="zoomIn">
              <span class="icon is-small">
                <icon name="search-plus" title="Zoom In"></icon>
              </span>
            </a>
          </p>
        </div>
        <div class="field has-addons is-pulled-left">
          <p class="control">
            <a class="button" :disabled="spreads ? null : 'disabled'" @click="setSpreads(false); showGrid = false; showTable = false;">
              <span class="icon is-small">
                <icon name="file-o" title="Single"></icon>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" :disabled="spreads ? 'disabled' : null" @click="setSpreads(true); showGrid = false; showTable = false;">
              <span class="icon is-small">
                <icon name="columns" title="Spread"></icon>
              </span>
            </a>
          </p>
        </div>
        <div class="field has-addons is-pulled-left">
          <p class="control">
            <a class="button" @click="this.prev">
              <span class="icon is-small">
                <icon name="chevron-left" title="Prev"></icon>
              </span>
            </a>
          </p>

          <p class="control page_input" v-if="!editingPage">
            <a class="button" @click="editingPage = true">
              {{ displayedPages }} / {{ totalPages }}
            </a>
          </p>
          <p class="control page_input" v-if="editingPage">
            <input class="input" type="text" :value="displayedPages" @keyup.enter="editingPage = false">
          </p>
          <p class="control">
            <a class="button" @click="this.next">
              <span class="icon is-small">
                <icon name="chevron-right" title="Next"></icon>
              </span>
            </a>
          </p>

        </div>
        <!-- <div class="field has-addons is-pulled-left" v-show="matchCount">
          <p class="control">
            <a class="button" @click="prevMatch" v-if="matchCount">
              <span class="icon is-small">
                <icon name="chevron-left" title="Prev Match"></icon>
              </span>
            </a>
          </p>
          <p class="control" v-if="matchCount">
            <a class="button" v-if="matchCount">
              {{currentMatchIndex}} of {{matchCount}}
            </a>
          </p>
          <p class="control" v-if="matchCount">
            <a class="button" @click="nextMatch" v-if="matchCount">
              <span class="icon is-small">
                <icon name="chevron-right" title="Next Match"></icon>
              </span>
            </a>
          </p>
        </div>  -->
      </div>
    </section>

    <div class="modal-background navigation_background" :class="{active: outlineOpen}" @click="outlineOpen = false;"></div>

    <section class="navigation" :class="{closed: !outlineOpen}">
      <nav class="nav">
        <div class="nav-left nav_closer">
          <a class="nav-item" @click="outlineOpen = !outlineOpen; showGrid = false; showTable = false;">
            <span class="icon">
              <icon v-if="outlineOpen" name="close" title="Close Navigation"></icon>
            </span>
          </a>
        </div>
        <div class="nav-right">
          <div class="nav-item">
            <!-- <a id="prevMatch" @click="prevMatch" v-if="matchCount">
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
            </a> -->

            <!-- <p class="control has-icons-right">
              <input class="input has-icons-right" name="query" v-model="query" results="5" placeholder="search" @keyup.enter="outlineOpen = false">
              <span class="icon is-small is-right">
                <icon name="search" title="Search"></icon>
              </span>
            </p> -->
          </div>

        </div>
      </nav>


      <div class="container">
        <div class="contents">
            <h1 class="title">
              {{ manifest.title }}
            </h1>
            <h2 class="subtitle">
              {{ manifest.subtitle }}
            </h2>
            <h2 class="subtitle">
              {{ manifest.author_as_it_appears }}
            </h2>
            <img class="cover_image" :src="manifest.cover_image_url">

          <!-- <div class="column is-two-thirds">
            <outline :data="outline" :pdf="$refs.pdf" :page="displayedPage" @onClick="this.goto" @current="this.onCurrentTitle"/>
          </div> -->
        </div>
        <outline :data="outline" :pdf="$refs.pdf" :page="displayedPage" @onClick="this.goto" @current="this.onCurrentTitle"/>

      </div>
    </section>

    <section class="artwork" v-show="artworkOpen">
      <div class="container">
        <b-tabs position="is-centered" v-model="activeTab" @change="onTabChanged">
          <b-tab-item label="Grid">
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
import 'vue-awesome/icons/picture-o'
import 'vue-awesome/icons/search-plus'
import 'vue-awesome/icons/search-minus'
import 'vue-awesome/icons/book'

import Icon from 'vue-awesome/components/Icon'
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

Vue.use(Buefy, {
  // defaultIconPack: 'fa'
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
      zoomLevel: 1.0,
      shownDetail: undefined,
      displayedDetail: undefined,
      activeTab: 0,
      title: '',
      shortTitle: '',
      current: '',
      isModalActive: false,
      showSearch: false,
      artworkOpen: false,
      navOpen: false,
      totalPages: 1,
      editingPage: false,
      navTimeout: undefined
    }
  },
  created () {
    this.fetchManifest();
    window.addEventListener('keyup', this.keyListener.bind(this), false);
    window.addEventListener('resize', this.handleResize.bind(this), false);
    this.currentDetail = undefined;

    this.toggleNav();

    // TODO: make these methods
    window.addEventListener('mousemove', (e) => {
      let {y} = e;
      let dist = 100;
      this.mouseMoved = true;

      if (y < dist || y > window.innerHeight - dist) {
        if (!this.openNav) {
          this.openNav = setTimeout(() => {
            this.showNav();
            // this.openNav = undefined;
          }, 300);
        }
      } else {
        if (this.openNav) {
          clearTimeout(this.openNav);
          this.openNav = undefined;

          if (this.navOpen) {
            this.hideNav();
          }
        }
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.mouseMoved = false;
    });

    window.addEventListener('click', (e) => {
      let {y} = e;
      let dist = 100;

      if (y > dist && y < window.innerHeight - dist) {
        if (!this.mouseMoved && !this.outlineOpen && !this.outlineOpen && !this.isModalActive) {
          this.toggleNav();
        }
      }
      this.mouseMoved = false;
    });

    window.addEventListener('touchend', (e) => {
      if (!this.mouseMoved && !this.outlineOpen && !this.outlineOpen && !this.isModalActive) {
        this.toggleNav();
      }
      this.mouseMoved = false;
    });

    window.addEventListener('touchstart', (e) => {
      this.mouseMoved = false;
    });

    window.addEventListener('touchmove', (e) => {
      this.mouseMoved = true;
    });
  },
  beforeDestory () {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keyup', this.keyListener);
  },
  computed: {
    displayedPages () {
      if (!this.spreads || this.displayedPage === 0) {
        return this.displayedPage + 1;
      } else {
        return `${this.displayedPage}–${this.displayedPage + 1}`;
      }
    }
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
    artworkOpen () {
      const { grid } = this.$refs;
      grid.handleResize();
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

      this.totalPages = pdfDocument.numPages;
    },
    next (e) {
      const { pdf } = this.$refs;
      pdf.next();
      e.stopPropagation();
      e.preventDefault();
    },
    prev (e) {
      const { pdf } = this.$refs;
      pdf.prev();
      e.stopPropagation();
      e.preventDefault();
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
      this.isModalActive = false;
      this.artworkOpen = false;
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
      // let header = 52;
      return {
        width: width,
        height: height
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

      if (index === 0) {
        grid.handleResize();
        grid.triggerLoad();
      }

      if (index === 1) {
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
    },
    showNav () {
      clearTimeout(this.navTimeout);
      this.navOpen = true;
    },
    hideNav () {
      this.navOpen = false;
    },
    toggleNav () {
      if (this.navOpen) {
        clearTimeout(this.navTimeout);
        this.hideNav();
      } else {
        this.showNav()
        this.navTimeout = setTimeout(() => {
          this.hideNav();
        }, 2000);
      }
    }
  }
}
</script>

<style>

.nav.fixed {
  top: -60px;
  left: 0;
  width: 100%;
  border-bottom: 1px solid rgba(219, 219, 219, 0.85);
  z-index: 15;
  background-color: rgba(255, 255, 255, 0.85);
  position: fixed;
  transition: top .25s ease-in;
}

.nav.fixed.open {
  top: 0;
  left: 0;
}

.nav.fixed .icon {
  /*color: #4a4a4a;*/
}

.nav.section_nav {
  background-color: whitesmoke;

}

.artwork {
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

.navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 100vh;
  margin-bottom: 0;
  /*padding: 0 40px 0 40px;*/
  background-color: white;
  overflow: hidden;
  overflow-y: auto;
  z-index: 40;
  transition: left .25s ease-in;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.navigation_background {
  opacity: 0;
  transition: opacity .25s ease-in;
  z-index: -1;
}

.navigation_background.active {
  opacity: 1;
  z-index: 39;
}

.navigation.closed {
  left: -400px;
}

.navigation .nav .nav-right {
  flex-grow: 2;
}

.main {
  background-color: whitesmoke;
}

.icon.is-small svg {
  height: 1em;
}

.zoom_input {
  width: 60px;
}

.page_input {
  width: auto;
}

.page_input input {
  width: 60px;
}
.contents {
  padding: 40px;
}

.cover_image {
  max-height: 100px;
  max-width: 100px;
}

.arrow {
  position: absolute;
  top: 50vh;
  margin-top: -24px;
  /*font-size: 64px;*/
  /*color: #E2E2E2;*/
  color: rgb(74, 74, 74);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: whitesmoke;
  opacity: .5;
  padding: 4px;
}

.arrow .icon {
  width: 30px;
}

.arrow:hover {
  /*color: #777;*/
}

#prev.arrow:active .icon {
  justify-content: flex-start;
}

#next.arrow:active .icon {
  justify-content: flex-end;
}

#prev {
  left: 0px;
  border-radius: 0 2px 2px 0;
}

#next {
  right: 0px;
  border-radius: 2px 0 0 2px;
}

#detail {
  z-index: 50;
}

#outline, #artwork {
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

.floater {
  position: absolute;
  bottom: -60px;
  left: 0;
  position: fixed;
  transition: bottom .25s ease-in;
  color: whitesmoke;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.floater.open {
  bottom: 20px;
}

.floater .field {
  margin: 0 4px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  margin-bottom: 0.75rem;
  height: auto;
}

.modal-content {
  width: auto !important;
}

#matchCount {
  align-items: flex-end;
}

#matchCount span {
  width: 5.25em;
}
</style>
