<template>
  <div ref="imageLayer"
        :style="{ width: `${viewport ? viewport.width : 0}px`, height: `${viewport ? viewport.height : 0}px` }"
        class="imageLayer">
    <div v-for="image in images" class="imageLayerItem"
         :style="{ width: `${image.width}px`, height: `${image.height}px`, top: `${image.top-image.height}px`, left: `${image.left}px`}"
         @click="handleClick(image)">

    </div>
  </div>
</template>


<script>
// const pdfjsLib = require('pdfjs-dist');
// pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'imagelayer',
  props: {
    'images': {
      default: [],
      type: Array
    },
    'viewport': {
      default: undefined,
      type: Object
    },
    'onImageClicked': {
      default: undefined,
      type: Function
    }
  },
  data () {
    return {

    }
  },
  updated () {
  },
  mounted () {
    if (this.images) {
      // console.log('images', this.images);
    }
  },
  watch: {
    images () {
      if (this.images) {
        // console.log('images', this.images);
      }
    }
  },
  methods: {
    handleClick (image) {
      console.log('CLICK', image.objId);
      if (this.onImageClicked) {
        this.onImageClicked(image);
      }
      this.$emit('imageClicked', image);
    }
  }
}
</script>

<style scoped>
.imageLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}
.imageLayerItem {
  position: absolute;
  pointer-events: all;
}
</style>
