<template>
  <div id="pageContainer" :class="{ loading: isLoading }">
    <!-- <div id="pageContainerLeft" class="pdfViewer"></div>
    <div id="pageContainerRight" class="pdfViewer"></div> -->
    <div class="page" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }">
      <canvas ref="canvas" :width="`${viewportWidth}px`" :height="`${viewportHeight}px`"/>
      <div ref="textLayer" :style="{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }" class="textLayer"></div>
      <div ref="imageLayer"></div>
      <div ref="annotationLayer"></div>
    </div>
  </div>
</template>

<!-- <script src="libs/pdfjs-dist/build/pdf.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/build/pdf.worker.js"></script> -->
<script src="/static/libs/pdfjs-dist/web/pdf_viewer.js"></script>
<script>
const pdfjsLib = require('pdfjs-dist');
// const pdfjsWebTextLayerBuilder = require('pdfjs-dist/lib/web/text_layer_builder.js');
// console.log(pdfjsWebTextLayerBuilder);
// const pdfjsWebAnnotationLayerBuilder = require('./annotation_layer_builder.js');
// /* global PDFJS */

// const pdfViewer = require('../../static/libs/pdfjs-dist/web/pdf_viewer.js');
// console.log(pdfViewer);
pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'pdf',
  props: {
    'src': {
      type: String
    },
    'width': {
      type: Number
    },
    'height': {
      default: 1,
      type: Number
    },
    'page': {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      pdf: undefined,
      numPages: 0,
      scale: 1,
      rotate: undefined,
      isLoading: true,
      viewportWidth: 0,
      viewportHeight: 0
    }
  },
  updated () {
  },
  mounted () {
    if (this.src) {
      this.loadDocument(this.src)
        .then(() => this.loadPage(this.page))
    }
  },
  watch: {
    src () {
      if (this.src) {
        this.loadDocument(this.src)
          .then(() => this.loadPage(this.page))
      }
    },
    page (pg) {
      if (this.page) {
        this.loadPage(this.page);
      }
    }
  },
  methods: {
    loadDocument (src) {
      console.log('src', src);
      return pdfjsLib.getDocument(src)
        .then((pdfDocument) => {
          // Document loaded, retrieving the page.
          var pagesCount = pdfDocument.numPages;
          // var noCover = settings.cover === false;
          this.numPages = pagesCount;

          this.pdf = pdfDocument;

          this.isLoading = false;

          this.$emit('loaded');
          // return pdfDocument.getPage(1);
        })
        // .then((firstPage) => {
        // // var viewport = firstPage.getViewport(SCALE);
        //   var CSS_UNITS = 96.0 / 72.0;
        //
        //   var widthScale = (window.innerWidth / 2) / firstPage.getViewport(CSS_UNITS).width;
        //   var heightScale = (window.innerHeight) / firstPage.getViewport(CSS_UNITS).height;
        //   var scale = (widthScale > heightScale ? heightScale : widthScale);
        //
        //   var viewport = firstPage.getViewport(scale);
        //
        // })
    },
    getPageScale (page = this.page) {
      const { scale, width } = this;

      // Be default, we'll render page at 100% * scale width.
      let pageScale = 1;

      // If width is defined, calculate the scale of the page so it could be of desired width.
      if (width) {
        pageScale = width / page.getViewport(scale).width;
      }

      return scale * pageScale;
    },
    loadPage (pageIndex) {
      const { pdf } = this;

      if (!pdf) {
        throw new Error('Unexpected call to getPage() before the document has been loaded.');
      }

      let pageNumber = pageIndex + 1;

      if (!pageIndex || pageNumber < 1) {
        pageNumber = 1;
      } else if (pageNumber >= pdf.numPages) {
        pageNumber = pdf.numPages;
      }

      return pdf.getPage(pageNumber)
        .then((page) => this.onPageLoad(page))
        .catch((page) => this.onPageError(page));
    },
    onPageLoad (page) {
      // const scale = this.getPageScale(page);
      const { canvas, textLayer } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale, rotate } = this;
      const viewport = page.getViewport(scale, rotate);
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

.page {
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
