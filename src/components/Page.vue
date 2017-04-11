<template>
  <div class="pageWrapper" :class="{ loading: isLoading }" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }">
    <canvas ref="canvas" :width="`${viewportWidth}px`" :height="`${viewportHeight}px`"/>
    <div ref="textLayer" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }" class="textLayer"></div>
    <div ref="imageLayer"></div>
    <div ref="annotationLayer"></div>
  </div>
</template>

<script>
const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'page',
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
      viewportHeight: 0
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
      if (this.width) {
        pageScale = this.width / page.getViewport(scale).width;
      }
      console.log('pageScale', pageScale);

      return scale * pageScale;
    },
    // loadPage (pageIndex) {
    //   const { pdf } = this;
    //
    //   if (!pdf) {
    //     throw new Error('Unexpected call to getPage() before the document has been loaded.');
    //   }
    //
    //   let pageNumber = pageIndex + 1;
    //
    //   if (!pageIndex || pageNumber < 1) {
    //     pageNumber = 1;
    //   } else if (pageNumber >= pdf.numPages) {
    //     pageNumber = pdf.numPages;
    //   }
    //
    //   return pdf.getPage(pageNumber)
    //     .then((page) => this.onPageLoad(page))
    //     .catch((page) => this.onPageError(page));
    // },
    displayPage (page) {
      // const scale = this.getPageScale(page);
      const { canvas, textLayer } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale, rotate } = this;
      const scaled = scale !== 1 ? scale : this.getPageScale(page);
      const viewport = page.getViewport(scaled, rotate);
      const imageLayer = {
        beginLayout () { },
        endLayout () { },
        appendImage (i) { console.log(i); }
      };

      this.viewportHeight = viewport.height;
      this.viewportWidth = viewport.width;

      page.render({ canvasContext, viewport, imageLayer })
        .then(() => {
          textLayer.innerHTML = '';
          page.getTextContent({ normalizeWhitespace: true }).then(
            (textContent) => {
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
            }
          );
        });
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
