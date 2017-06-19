<template>
  <div class="pageWrapper" :class="{ loading: isLoading }" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }">
    <canvas ref="canvas" :width="`${viewportWidth}px`" :height="`${viewportHeight}px`"/>
    <textlayer :page="page" :viewport="viewport" :scale="scale" @selected="onSelected" ref="textLayer"></textlayer>
    <imagelayer :images="images" :viewport="viewport" :scale="scale" :onImageClicked="onImageClicked"></imagelayer>
    <div ref="annotationLayer"></div>
  </div>
</template>

<script>
import TextLayer from '@/components/TextLayer'
import ImageLayer from '@/components/ImageLayer'

const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'page',
  components: {
    'textlayer': TextLayer,
    'imagelayer': ImageLayer
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
    },
    'onViewport': {
      default: undefined,
      type: Function
    },
    'onImageClicked': {
      default: undefined,
      type: Function
    },
    'onSelected': {
      default: undefined,
      type: Function
    }
    // 'pageMatchesLength': {
    //   default: undefined,
    //   type: Object
    // },
    // 'pageMatches': {
    //   default: undefined,
    //   type: Object
    // },
    // 'selectedMatch': {
    //   default: undefined,
    //   type: Object
    // },
    // 'query': {
    //   default: undefined,
    //   type: String
    // }
  },
  data () {
    return {
      pdf: undefined,
      isLoading: true,
      viewportWidth: 0,
      viewportHeight: 0,
      viewportScale: 1,
      viewport: undefined,
      textContent: undefined,
      images: [],
      pageIndex: undefined
    }
  },
  updated () {
  },
  mounted () {
    if (this.page) {
      this.displayPage(this.page);
    }

    // if (this.pageMatches && this.pageMatchesLength) {
    //   // For some reason changes to the array isn't picked up, so sent as an object.
    //   const {pageMatches} = this.pageMatches;
    //   const {pageMatchesLength} = this.pageMatchesLength;
    //
    //   if (this.pageIndex in pageMatches) {
    //     this.$refs.textLayer.updateTextLayerMatches(this.query, pageMatchesLength ? pageMatchesLength[this.pageIndex] : null, pageMatches[this.pageIndex]);
    //   } else {
    //     this.$refs.textLayer.clearTextLayerMatches();
    //   }
    // }
    //
    // if (this.pageIndex === this.selectedMatch.pageIdx) {
    //   this.$refs.textLayer.selectedMatch(this.selectedMatch.pageIdx, this.selectedMatch.matchIdx);
    // }
  },
  watch: {
    page () {
      if (this.page) {
        this.displayPage(this.page);
      }
    },
    scale () {
      if (this.displaying) {
        return;
      }
      if (typeof this.scale !== 'undefined') {
        this.displayPage(this.page);
      }
    },
    width () {
      if (this.displaying) {
        return;
      }
      if (typeof this.scale !== 'undefined') {
        this.displayPage(this.page);
      }
    },
    height () {
      if (this.displaying) {
        return;
      }
      if (typeof this.scale !== 'undefined') {
        this.displayPage(this.page);
      }
    },
    pageMatches () {
      // if (this.pageMatches && this.pageMatchesLength) {
      //   // For some reason changes to the array isn't picked up, so sent as an object.
      //   const {pageMatches} = this.pageMatches;
      //   const {pageMatchesLength} = this.pageMatchesLength;
      //
      //   if (this.pageIndex in pageMatches) {
      //     this.$refs.textLayer.updateTextLayerMatches(this.query, pageMatchesLength ? pageMatchesLength[this.pageIndex] : null, pageMatches[this.pageIndex]);
      //   } else {
      //     this.$refs.textLayer.clearTextLayerMatches();
      //   }
      // }
    }
    // selectedMatch () {
    //   if (this.pageIndex === this.selectedMatch.pageIdx) {
    //     this.$refs.textLayer.selectedMatch(this.selectedMatch.pageIdx, this.selectedMatch.matchIdx);
    //   }
    // }
  },
  methods: {
    getPageScale (page = this.page) {
      const { scale, width, height } = this;

      // Be default, we'll render page at 100% * scale width.
      let pageScale = 1;

      // If width is defined, calculate the scale of the page so it could be of desired width.
      if (width < height) {
        pageScale = width / page.getViewport(scale).width;
      } else {
        pageScale = height / page.getViewport(scale).height;
      }

      // console.log('pageScale', pageScale, width, height);

      return scale * pageScale;
    },
    displayPage (page) {
      // const scale = this.getPageScale(page);
      const { canvas } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale } = this;
      const scaled = scale !== 1 ? scale : this.getPageScale(page);
      const viewport = page.getViewport(scaled);
      let images = this.images;
      let imageCount = 0;
      const imageLayer = {
        beginLayout () { },
        endLayout () { },
        appendImage (i) {
          i.page = page.pageIndex;
          i.index = imageCount;
          images.push(i);
          imageCount++;
        }
      };

      this.pageIndex = page.pageIndex;
      this.viewport = viewport;
      this.viewportScale = scale;
      this.viewportHeight = viewport.height;
      this.viewportWidth = viewport.width;

      this.onViewport && this.onViewport(viewport);

      this.displaying = true;
      page.render({ canvasContext, viewport, imageLayer })
        .then(() => {
          this.$emit('displayed', this);
          this.displaying = false;
        })
        .catch((err) => console.error(err));
    },
    onPageError (page) {
      console.error(page);
    },
    updateTextLayerMatches (query, pageMatches, pageMatchesLength) {
      this.query = query;
      this.pageMatchesLength = pageMatchesLength;
      this.pageMatches = pageMatches;

      if (pageMatches && pageMatches.length > this.pageIndex) {
        this.$refs.textLayer.updateTextLayerMatches(query, pageMatches[this.pageIndex], pageMatchesLength ? pageMatchesLength[this.pageIndex] : null);
      } else {
        this.$refs.textLayer.clearTextLayerMatches();
      }
    },
    updatedSelectedMatch (selectedMatch) {
      this.selectedMatch = selectedMatch;
      if (this.pageIndex === selectedMatch.pageIdx) {
        this.$refs.textLayer.selectedMatch(selectedMatch.pageIdx, selectedMatch.matchIdx);
      }
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
