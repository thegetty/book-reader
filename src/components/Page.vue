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
    }
  },
  methods: {
    getPageScale (page = this.page) {
      const { scale, width, height } = this;

      // Be default, we'll render page at 100% * scale width.
      let pageScale = 1;

      // If width is defined, calculate the scale of the page so it could be of desired width.
      if (width < height) {
        pageScale = width / page.getViewport(1 / scale).width;
      } else {
        pageScale = height / page.getViewport(1 / scale).height;
      }

      return pageScale;
    },
    displayPage (page) {
      const { canvas } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale } = this;
      const scaled = this.getPageScale(page);
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

<style>
canvas {
  background-color: #fff;
}

.pageWrapper {
  direction: ltr;
  position: relative;
  overflow: visible;
}
</style>
