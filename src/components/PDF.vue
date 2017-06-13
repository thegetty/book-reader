<template>
  <div class="pageContainer" :class="{ loading: isLoading }" :style="{ width: `${width}px`, height: `${height ? height : viewportHeight }px` }" >
    <div class="page" v-for="page in displayedPages">
      <page
        :ref="'page_'+page.pageIndex"
        :page="page"
        :width="spreads ? width / 2 : width"
        :height="height"
        :onViewport="handleViewport"
        :onImageClicked="onImageClicked"
        :pageMatchesLength="{pageMatchesLength}"
        :pageMatches="{pageMatches}"
      />
    </div>
    <search :pdfDocument="pdfDocument" :query="query" @matched="this.onMatched"/>
  </div>
</template>

<!-- <script src="libs/pdfjs-dist/build/pdf.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/build/pdf.worker.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/web/pdf_viewer.js"></script> -->
<!-- <script src="/static/libs/pdfjs-dist/web/compatibility.js"></script> -->
<script>
import Page from '@/components/Page'
import Search from '@/components/Search'

const pdfjsLib = require('pdfjs-dist');
// require('pdfjs-dist/lib/shared/compatibility.js');

// const pdfjsWebTextLayerBuilder = require('pdfjs-dist/lib/web/text_layer_builder.js');
// console.log(pdfjsWebTextLayerBuilder);
// const pdfjsWebAnnotationLayerBuilder = require('./annotation_layer_builder.js');
// /* global PDFJS */

// const pdfViewer = require('../../static/libs/pdfjs-dist/web/pdf_viewer.js');
// console.log(pdfViewer);
pdfjsLib.PDFJS.workerSrc = 'static/libs/pdfjs-dist/build/pdf.worker.js';

// import { PDFFindController } from './search_manager'

export default {
  name: 'pdf',
  components: {
    'Page': Page,
    'Search': Search
  },
  props: {
    'src': {
      type: String
    },
    'width': {
      type: Number,
      default: undefined
    },
    'height': {
      type: Number,
      default: undefined
    },
    'page': {
      default: 0,
      type: Number
    },
    'spreads': {
      default: true,
      type: Boolean
    },
    'onImageClicked': {
      default: undefined,
      type: Function
    },
    'onOutlineReady': {
      default: undefined,
      type: Function
    },
    'query': {
      default: undefined,
      type: String
    }
  },
  data () {
    return {
      pdfDocument: undefined,
      numPages: 0,
      scale: 1,
      rotate: undefined,
      isLoading: true,
      viewportWidth: 0,
      viewportHeight: 0,
      displayedPage: 0,
      displayedPages: [],
      displayedPagesNumbers: [],
      outline: undefined,
      pageMatchesLength: [],
      pageMatches: []
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
      if (typeof this.page !== 'undefined') {
        this.display(this.page);
      }
    },
    spreads (spreads) {
      if (typeof this.displayedPage !== 'undefined') {
        this.display(this.displayedPage);
      }
    },
    displayedPage () {
      this.$emit('pageChanged', this.displayedPagesNumbers);
    },
    query () {
      if (this.query) {
        // this.findController.executeCommand('find', {query: this.query});
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

          this.pdfDocument = pdfDocument;

          this.$emit('loaded', pdfDocument);

          this.outline = pdfDocument.getOutline().then((outline) => {
            return this.processOutline(outline);
          });

          /*
          this.findController = new PDFFindController({
            pdfDocument: pdfDocument,
            onUpdateMatches: ({pageMatchesLength, pageMatches}) => {
              this.pageMatchesLength = pageMatchesLength;
              this.pageMatches = pageMatches;
            }
          });

          this.findController.resolveFirstPage();
          */
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
      this.displayedPages = []; // clear

      if (this.spreads) {
        if (page % 2 === 0) {
          this.displayedPage = page;
        } else {
          this.displayedPage = page - 1;
        }

        this.loadPage(this.displayedPage) // left
        this.loadPage(this.displayedPage + 1)  // right

        this.displayedPagesNumbers = [this.displayedPage, this.displayedPage + 1];
      } else {
        this.displayedPage = page;
        this.loadPage(this.displayedPage);

        this.displayedPagesNumbers = [this.displayedPage, this.displayedPage + 1];
      }
    },
    next () {
      this.displayedPage += this.spreads ? 2 : 1;
      if (this.displayedPage < this.numPages) {
        this.display(this.displayedPage);
      } else {
        this.displayedPage = this.numPages - (this.spreads ? 2 : 1);
      }
    },
    prev () {
      if (this.displayedPage > 1) {
        this.displayedPage -= this.spreads ? 2 : 1;
        this.display(this.displayedPage);
      }
    },
    loadPage (pageIndex) {
      const { pdfDocument } = this;

      if (!pdfDocument) {
        throw new Error('Unexpected call to getPage() before the document has been loaded.');
      }

      let pageNumber = pageIndex + 1;

      if (!pageIndex || pageNumber < 1) {
        pageNumber = 1;
      } else if (pageNumber >= pdfDocument.numPages) {
        pageNumber = pdfDocument.numPages;
      }

      return pdfDocument.getPage(pageNumber)
        .then((page) => this.onPageLoad(page))
        .catch((page) => this.onPageError(page));
    },
    onPageLoad (page) {
      this.displayedPages.push(page);
    },
    onPageError (page) {
      console.error(page);
    },
    handleViewport (viewport) {
      this.viewportWidth = viewport.width;
      this.viewportHeight = viewport.height;
    },
    processOutline (outline) {
      this.onOutlineReady && this.onOutlineReady(outline);
      return outline;
    },
    getPageIndex (dest) {
      return this.pdfDocument.getPageIndex(dest);
    },
    onMatched (pageMatches, pageMatchesLength, count) {
      this.pageMatches = pageMatches;
      this.pageMatchesLength = pageMatchesLength;
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
  align-items: center;
}

.page {
  flex: none;
}
</style>
