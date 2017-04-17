<template>
  <div ref="textLayer" :style="{ width: `${width}px`, height: `${height}px` }" class="textLayer"></div>
</template>


<script>
const pdfjsLib = require('pdfjs-dist');
// pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'textlayer',
  props: {
    'width': {
      type: Number
    },
    'height': {
      default: 1,
      type: Number
    },
    'page': {
      default: undefined,
    }
  },
  data () {
    return {

    }
  },
  updated () {
  },
  mounted () {

  },
  watch: {
    page () {
      if (this.page) {
        this.getTextContent(this.page).then((textContent) => this.onContent(textContent))
      }
    }
  },
  methods: {
    getTextContent (page) {
      return page.getTextContent({ normalizeWhitespace: true });
    }
    onContent (page) {
      // const scale = this.getPageScale(page);
      const { textLayer } = this.$refs;

      console.log(textContent);
      // textLayer.setTextContent(textContent);
      // textLayer.render(TEXT_LAYER_RENDER_DELAY);
      this.textDivs = [];
      let textLayerFrag = document.createDocumentFragment();

      if (this.textLayerRenderTask) {
        this.textLayerRenderTask.cancel();
        this.textLayerRenderTask = null;
      }

      this.textLayerRenderTask = pdfjsLib.renderTextLayer({
        textContent: textContent,
        container: textLayerFrag,
        viewport: viewport,
        textDivs: this.textDivs,
        timeout: 300
      });

      this.textLayerRenderTask.promise.then(() => {
        console.log(textLayerFrag);
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
