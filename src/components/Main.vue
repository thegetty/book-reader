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
  props: {
    'origin': {
      default: 'https://s3.amazonaws.com/pubs-fchasen/books/',
      type: String
    }
  },
  data () {
    return {
      url: `${this.origin}${this.$route.params.book}/editions/${this.$route.params.edition}/manifest.json`,
      page: this.$route.params.page,
      image: this.$route.params.image
    }
  }
}
</script>
