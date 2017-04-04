<template>
  <Reader :manifest-url="url" />
</template>

<script>
import Reader from '@/components/Reader'

export default {
  name: 'main',
  components: {
    'Reader': Reader
  },
  data () {
    return {
      url: `https://s3.amazonaws.com/pubs-fchasen/books/${this.$route.params.book || 371}/editions/${this.$route.params.edition || 500}/manifest.json`
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
