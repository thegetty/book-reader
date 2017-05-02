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
          <a id="artwork-nav-single" @click="spreads = false; showGrid = false; showTable = false;">Single</a>
           |
          <a id="artwork-nav-spread" @click="spreads = true; showGrid = false; showTable = false;">Spread</a>
           |
          <a id="artwork-nav-scroll">Scroll</a>
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
      <PDF id="pdf" ref="pdf" :src="this.manifest.pdf" :page="page" @loaded="loaded" :width="1000" :spreads="spreads"/>
      <div id="prev" class="arrow" @click="this.prev">‹</div>
      <div id="next" class="arrow" @click="this.next">›</div>
      <div id="images" v-show="showGrid || showTable">
        <grid id="grid" v-if="showGrid" :data="images" @onClick="this.onImageSelected" />
        <tablegrid id="table" v-if="showTable" :data="images" @onClick="this.onImageSelected" />
      </div>
      <div id="detail" v-if="currentDetail">
        <img :src="currentDetail.url">
      </div>
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
      page: 0,
      spreads: true,
      showTable: false,
      showGrid: false,
      currentDetail: undefined
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

#title-nav {
  flex-grow: 100;
}
</style>
