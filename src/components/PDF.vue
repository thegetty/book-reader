<template>
  <div :ref="'container'" class="pageContainer" :class="{ loading: isLoading, centered: (!spreads || zoom <= 1) }" :style="{ width: `${width}px`, height: `${height ? height : viewportHeight }px` }" >
    <div class="page" v-for="page in displayedPages" :key="page.pageIndex">
      <page
        :ref="'page_'+page.pageIndex"
        :page="page"
        :width="spreads ? width / 2 : width"
        :height="height"
        :scale="zoom"
        :onViewport="handleViewport"
        :onImageClicked="onImageClicked"
        :onSelected="onSelected"
        @displayed="afterDisplayed"
      />
    </div>
    <search :pdfDocument="pdfDocument" :query="query" @matched="this.onMatched" @found="this.onFound"/>
  </div>
</template>

<script>
import Page from '@/components/Page'
import Search from '@/components/Search'

const pdfjsLib = require('pdfjs-dist');
// require('pdfjs-dist/lib/shared/compatibility.js');

pdfjsLib.PDFJS.workerSrc = 'static/libs/pdfjs-dist/build/pdf.worker.js';

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
    },
    'zoom': {
      default: 1,
      type: Number
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
      pageMatches: [],
      matched: [],
      selectedMatch: {}
    }
  },
  updated () {
  },
  mounted () {
    if (this.src) {
      this.loadDocument(this.src)
        .then(() => this.display(this.page))
        .catch((err) => console.error(err));
    }
  },
  watch: {
    src () {
      if (this.src) {
        this.loadDocument(this.src)
          .then(() => this.display(this.page))
          .catch((err) => console.error(err));
      }
    },
    page (pg) {
      if (typeof this.page !== 'undefined' && this.page > -1) {
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
      if (this.query === '') {
        // this.findController.executeCommand('find', {query: this.query});
        this.clearMatches();
      }
    },
    zoom () {
      let container = this.$refs.container;
      let bounds = container.getBoundingClientRect();
      this.scrollLeftDelta = (container.scrollLeft - ((container.scrollWidth - bounds.width) / 2));
      this.scrollTopDelta = (container.scrollTop - ((container.scrollHeight - bounds.height) / 2));
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
        })
        .catch((err) => console.error(err));
    },
    display (page = this.page) {
      this.displayedPages = []; // clear

      if (page < 0) {
        return;
      }

      if (this.spreads) {
        if (page % 2 !== 0 || page === 0) {
          this.displayedPage = page;
        } else {
          this.displayedPage = page - 1;
        }

        if (this.displayedPage > 0) {
          this.loadPage(this.displayedPage) // left
          this.loadPage(this.displayedPage + 1)  // right
          this.displayedPagesNumbers = [this.displayedPage, this.displayedPage + 1];
        } else {
          this.loadPage(this.displayedPage) // cover
          this.displayedPagesNumbers = [this.displayedPage];
        }
      } else {
        this.displayedPage = page;
        this.loadPage(this.displayedPage);

        this.displayedPagesNumbers = [this.displayedPage];
      }
    },
    next () {
      if (this.displayedPage === 0) {
        this.displayedPage += 1;
      } else {
        this.displayedPage += this.spreads ? 2 : 1;
      }
      if (this.displayedPage < this.numPages) {
        this.display(this.displayedPage);
      } else {
        this.displayedPage = this.numPages - (this.spreads ? 2 : 1);
      }
    },
    prev () {
      if (this.displayedPage > 0) {
        if (this.displayedPage === 1) {
          this.displayedPage -= 1;
        } else {
          this.displayedPage -= this.spreads ? 2 : 1;
        }
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
      if (!this.displayedPagesNumbers.includes(page.pageIndex)) {
        return;
      }

      this.displayedPages.push(page);

      this.$nextTick(() => {
        let pg = this.$refs[`page_${page.pageIndex}`][0];
        pg.updatedSelectedMatch(this.selectedMatch);
        pg.updateTextLayerMatches(this.query, this.pageMatches, this.pageMatchesLength);
      });
    },
    afterDisplayed () {
      let container = this.$refs.container;
      let bounds = container.getBoundingClientRect();
      container.scrollLeft = (container.scrollWidth - bounds.width) / 2 + this.scrollLeftDelta;
      container.scrollTop = (container.scrollHeight - bounds.height) / 2 + this.scrollTopDelta;
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
    onMatched (matched, pageMatches, pageMatchesLength, count) {
      // per page
    },
    onFound (query, matched, pageMatches, pageMatchesLength, count) {
      this.pageMatches = pageMatches;
      this.pageMatchesLength = pageMatchesLength;
      this.matched = matched;
      this.$emit('found', count);
      if (this.matched && this.matched.length) {
        this.currentMatchIndex = 0;
        this.selectedMatch = this.matched[this.currentMatchIndex];
        this.$emit('match', this.currentMatchIndex);

        if (!this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)) {
          this.display(this.selectedMatch.pageIdx);
        } else {
          let pg = this.$refs[`page_${this.selectedMatch.pageIdx}`][0];
          pg.updatedSelectedMatch(this.selectedMatch);
          pg.updateTextLayerMatches(this.query, this.pageMatches, this.pageMatchesLength);
        }
      }
    },
    onSelected (selected) {
      let container = this.$refs.container;
      let bounds = container.getBoundingClientRect();
      container.scrollLeft = bounds.left + selected.left;
      container.scrollTop = bounds.top + selected.top;
    },
    clearMatches () {
      this.displayedPagesNumbers.forEach((pageIndex) => {
        let pg = this.$refs[`page_${pageIndex}`][0];
        pg.updateTextLayerMatches('', [], null);
      });
    },
    nextMatch () {
      if (!this.matched || this.matched.length === 0) {
        return;
      }

      if (this.currentMatchIndex < this.matched.length - 1) {
        this.currentMatchIndex += 1;
      } else {
        this.currentMatchIndex = 0;
      }

      this.selectedMatch = this.matched[this.currentMatchIndex];
      this.$emit('match', this.currentMatchIndex);

      if (!this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)) {
        this.display(this.selectedMatch.pageIdx);
      } else {
        let pg = this.$refs[`page_${this.selectedMatch.pageIdx}`][0];
        pg.updatedSelectedMatch(this.selectedMatch);
      }
    },
    prevMatch () {
      if (!this.matched || this.matched.length === 0) {
        return;
      }

      if (this.currentMatchIndex > 0) {
        this.currentMatchIndex -= 1;
      } else {
        this.currentMatchIndex = this.matched.length - 1;
      }

      this.selectedMatch = this.matched[this.currentMatchIndex];
      this.$emit('match', this.currentMatchIndex);

      if (!this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)) {
        this.display(this.selectedMatch.pageIdx);
      } else {
        let pg = this.$refs[`page_${this.selectedMatch.pageIdx}`][0];
        pg.updatedSelectedMatch(this.selectedMatch);
      }
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
  overflow: auto;
}

.pageContainer.centered {
  justify-content: center;
  align-items: center;
}

.page {
  flex: none;
}
</style>
