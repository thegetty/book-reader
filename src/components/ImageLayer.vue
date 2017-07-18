<template>
  <div ref="imageLayer"
        :style="computedStyle"
        class="imageLayer">
    <div v-for="image in images" class="imageLayerItem"
         :ref="image.objId"
         :id="image.objId"
         :style="imageStyle(image)"
         @click="handleClick(image)">

    </div>
  </div>
</template>


<script>
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
  computed: {
    computedStyle () {
      return {
        width: `${this.viewport ? this.viewport.width : 0}px`,
        height: `${this.viewport ? this.viewport.height : 0}px`
      }
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
      if (this.onImageClicked) {
        this.onImageClicked(image);
      }
      this.$emit('imageClicked', image);
    },
    imageStyle (image) {
      return {
        width: `${image.width}px`,
        height: `${image.height}px`,
        top: `${image.top - image.height}px`,
        left: `${image.left}px`
      }
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
  cursor: pointer;
}
</style>
