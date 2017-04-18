<template>
  <div class="pageContainer" :class="{ loading: isLoading }">
    <div class="page" v-for="page in displayedPages">
      <page :page="page" :width="spreads ? width / 2 : width" :height="height" />
    </div>
  </div>
</template>

<!-- <script src="libs/pdfjs-dist/build/pdf.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/build/pdf.worker.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/web/pdf_viewer.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/web/compatibility.js"></script> -->
<script>
import Page from '@/components/Page'

const pdfjsLib = require('pdfjs-dist');
// require('pdfjs-dist/lib/shared/compatibility.js');

// const pdfjsWebTextLayerBuilder = require('pdfjs-dist/lib/web/text_layer_builder.js');
// console.log(pdfjsWebTextLayerBuilder);
// const pdfjsWebAnnotationLayerBuilder = require('./annotation_layer_builder.js');
// /* global PDFJS */

// const pdfViewer = require('../../static/libs/pdfjs-dist/web/pdf_viewer.js');
// console.log(pdfViewer);
pdfjsLib.PDFJS.workerSrc = '/static/libs/pdfjs-dist/build/pdf.worker.js';

export default {
  name: 'pdf',
  components: {
    'Page': Page
  },
  props: {
    'src': {
      type: String
    },
    'width': {
      type: Number
    },
    'height': {
      type: Number
    },
    'page': {
      default: 0,
      type: Number
    },
    'spreads': {
      default: true,
      type: Boolean
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
      viewportHeight: 0,
      displayedPage: 0,
      displayedPages: []
    }
  },
  updated () {
  },
  mounted () {
    if (this.src) {
      this.loadDocument(this.src)
        .then(() => this.display(this.page))
    }
  },
  watch: {
    src () {
      if (this.src) {
        this.loadDocument(this.src)
          .then(() => this.display(this.page))
      }
    },
    page (pg) {
      if (this.page) {
        this.display(this.page);
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
    display (page = this.page) {
      if (this.spreads) {
        this.displayedPages = []; // clear

        if (page % 2 === 0) {
          this.displayedPage = page;
        } else {
          this.displayedPage = page - 1;
        }

        this.loadPage(this.displayedPage); // left
        this.loadPage(this.displayedPage + 1); // right
      } else {
        this.displayedPage = page;
        this.loadPage(this.displayedPage);
      }
    },
    next () {
      // TODO: don't go over total pages
      this.displayedPage += this.spreads ? 2 : 1;
      this.display(this.displayedPage);
    },
    prev () {
      if (this.displayedPage > 1) {
        this.displayedPage -= this.spreads ? 2 : 1;
        this.display(this.displayedPage);
      }
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
      this.displayedPages.push(page);
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
.pageContainer {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}

.page {
  flex: none;
}
</style>
