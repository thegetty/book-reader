<template>
  <div id="page-wrap">
    <PDF ref="pdf" :src="this.manifest.pdf" :page="page" @loaded="loaded" :width="1000" />
    <div id="prev" class="arrow" @click="this.prev">‹</div>
    <div id="next" class="arrow" @click="this.next">›</div>
    <header>
      <h1>{{manifest.title}}: </h1>
      <h2>{{manifest.subtitle}}, </h2>
      <h3>{{manifest.author_as_it_appears}}</h3>
    </header>
    <div id="images">
      <ol>
        <li v-for="image in images">
          <a class="img_link" @click="page = (image.page - 1)">
            <img :src="image.thumbnail" />
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import PDF from '@/components/PDF'
import 'whatwg-fetch'

export default {
  name: 'reader',
  components: {
    'PDF': PDF
  },
  props: ['manifest-url'],
  data () {
    return {
      manifest: {},
      images: [],
      page: 0
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
    }

  }
}
</script>

<style scoped>

header {

}

h1, h2, h3 {
  font-weight: normal;
  display: inline;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
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

.img_link {
  cursor: pointer;
}

.img_link:hover {
  opacity: 0.8;
}

.img_link:active {
  opacity: 0.5;
}

.img_link img {
  max-width: 100px;
  max-height: 100px;
}

header {
  margin: 24px;
}

#images {
  margin: 40px;
}

</style>
