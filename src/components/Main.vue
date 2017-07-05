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
      default: 'https://s3.amazonaws.com/pubs-fchasen/books',
      type: String
    },
    'book': {
      default: '',
      type: String
    },
    'edition': {
      default: '',
      type: String
    },
    'page': {
      default: undefined
    },
    'image': {
      default: undefined,
      type: String
    }
  },
  data () {
    return {
      url: `${this.origin}/${this.book}/editions/${this.edition}/manifest.json`
    }
  }
}
</script>
