<template>
  <div ref="textLayer" :style="{ width: `${viewport ? viewport.width : 0}px`, height: `${viewport ? viewport.height : 0}px` }" class="textLayer"></div>
</template>


<script>
const pdfjsLib = require('pdfjs-dist');
// pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'textlayer',
  props: {
    'page': {
      default: undefined
    },
    'viewport': {
      default: undefined
    },
    'renderTimeout': {
      default: 300,
      type: Number
    }
  },
  data () {
    return {

    }
  },
  updated () {
  },
  mounted () {
    if (this.page) {
      this.getTextContent(this.page).then((textContent) => this.onContent(textContent));
    }
  },
  watch: {
    page () {
      if (this.page) {
        this.getTextContent(this.page).then((textContent) => this.onContent(textContent));
      }
    }
  },
  methods: {
    getTextContent (page) {
      return page.getTextContent({ normalizeWhitespace: true });
    },
    onContent (textContent) {
      const { textLayer } = this.$refs;
      this.textDivs = [];
      let textLayerFrag = document.createDocumentFragment();

      if (this.textLayerRenderTask) {
        this.textLayerRenderTask.cancel();
        this.textLayerRenderTask = null;
      }

      this.textLayerRenderTask = pdfjsLib.renderTextLayer({
        textContent: textContent,
        container: textLayerFrag,
        viewport: this.viewport,
        textDivs: this.textDivs,
        timeout: this.renderTimeout
      });

      this.textLayerRenderTask.promise.then(() => {
        textLayer.appendChild(textLayerFrag);
      });
    },
    onPageError (page) {
      console.error(page);
    }
  }
}
</script>

<style scoped>
.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
}
</style>

<style>
.textLayer > div {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    -webkit-transform-origin: 0% 0%;
    -moz-transform-origin: 0% 0%;
    -o-transform-origin: 0% 0%;
    -ms-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
}
</style>
