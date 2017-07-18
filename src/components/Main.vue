<template>
  <Reader
    :manifest-url="url"
    :page-url="page"
    :image-url="image"
    :show-grid="tab === 'grid'"
    :show-table="tab === 'table'"
    />
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
      default: 'https://gettypubs-viewing-pdfs.s3.amazonaws.com',
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
    },
    'tab': {
      default: undefined
    }
  },
  data () {
    return {
      url: `${this.origin}/books/${this.book}/editions/${this.edition}/manifest.json`
    }
  }
}
</script>
