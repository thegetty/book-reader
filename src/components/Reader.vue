<template>
  <div id="page-wrap">

    <PDF :src="this.manifest.pdf" :page="page" @loaded="loaded" />
    <div id="prev" class="arrow" @click="page -= 1">‹</div>
    <div id="next" class="arrow" @click="page += 1">›</div>
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
    this.fetchManifest()
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
      // TODO: don't go over total pages
      this.page += 1;
    },
    prev () {
      if (this.page > 1) {
        this.page -= 1;
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
