<template>
  <div id="pageContainer" :class="{ loading: isLoading }">
    <!-- <div id="pageContainerLeft" class="pdfViewer"></div>
    <div id="pageContainerRight" class="pdfViewer"></div> -->
    <canvas ref="canvas" />
  </div>
</template>

<!-- <script src="libs/pdfjs-dist/build/pdf.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/build/pdf.worker.js"></script> -->
<script src="/static/libs/pdfjs-dist/web/pdf_viewer.js"></script>
<script>
const pdfjsLib = require('pdfjs-dist');
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
      isLoading: true
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
      const { canvas } = this.$refs;
      const canvasContext = canvas.getContext('2d');
      const { scale, rotate } = this;
      const viewport = page.getViewport(scale, rotate);
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext, viewport });
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
</style>
