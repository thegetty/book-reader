<template>
  <Reader :manifest-url="url" :page-url="page" :image-url="image"/>
</template>

<script>
import Reader from '@/components/Reader'

export default {
  name: 'main',
  components: {
    'Reader': Reader
  },
  data () {
    console.log('route', this.$route.params.book, this.$route.params.edition, this.$route.params.page, this.$route.params.image);
    return {
      url: `https://s3.amazonaws.com/pubs-fchasen/books/${this.$route.params.book || 711}/editions/${this.$route.params.edition || 884}/manifest.json`,
      page: this.$route.params.page,
      image: this.$route.params.image
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
</style>
