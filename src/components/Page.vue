<template>
  <div class="pageWrapper" :class="{ loading: isLoading }" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }">
    <canvas ref="canvas" :width="`${viewportWidth}px`" :height="`${viewportHeight}px`"/>
    <textlayer :page="page" :viewport="viewport"></textlayer>
    <div ref="imageLayer"></div>
    <div ref="annotationLayer"></div>
  </div>
</template>

<script>
import TextLayer from '@/components/TextLayer'

const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'page',
  components: {
    'textlayer': TextLayer
  },
  props: {
    'scale': {
      default: 1,
      type: Number
    },
    'rotate': {
      default: undefined,
      type: Number
    },
    'width': {
      type: Number
    },
    'height': {
      type: Number
    },
    'page': {
      default: undefined,
      type: Object
    }
  },
  data () {
    return {
      pdf: undefined,
      isLoading: true,
      viewportWidth: 0,
      viewportHeight: 0,
      viewportScale: 1,
      viewport: undefined,
      textContent: undefined
    }
  },
  updated () {
  },
  mounted () {
    if (this.page) {
      this.displayPage(this.page);
    }
  },
  watch: {
    page () {
      if (this.page) {
        this.displayPage(this.page);
      }
    }
  },
  methods: {
    getPageScale (page = this.page) {
      const { scale, width } = this;

      // Be default, we'll render page at 100% * scale width.
      let pageScale = 1;

      // If width is defined, calculate the scale of the page so it could be of desired width.
      if (width) {
        pageScale = width / page.getViewport(scale).width;
      }
      // console.log('pageScale', pageScale);

      return scale * pageScale;
    },
    displayPage (page) {
      // const scale = this.getPageScale(page);
      const { canvas } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale, rotate } = this;
      const scaled = scale !== 1 ? scale : this.getPageScale(page);
      const viewport = page.getViewport(scaled, rotate);
      const imageLayer = {
        beginLayout () { },
        endLayout () { },
        appendImage (i) { console.log(i); }
      };

      this.viewport = viewport;
      this.viewportScale = scale;
      this.viewportHeight = viewport.height;
      this.viewportWidth = viewport.width;

      page.render({ canvasContext, viewport, imageLayer });
    },
    onPageError (page) {
      console.error(page);
    }
  }
}
</script>

<style scoped>
.loading {
  /*background: #eee url('../assets/loading-icon.gif') center no-repeat;*/
}
canvas {
  /*background-color: #eee;*/
}

.pageWrapper {
  direction: ltr;
  position: relative;
  overflow: visible;
  margin: 0 auto;
}
</style>
