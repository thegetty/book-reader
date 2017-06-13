<template>
</template>

<script>
import { createPromiseCapability } from 'pdfjs-dist';

const FindState = {
  FOUND: 0,
  NOT_FOUND: 1,
  WRAPPED: 2,
  PENDING: 3,
};

// const FIND_SCROLL_OFFSET_TOP = -50;
// const FIND_SCROLL_OFFSET_LEFT = -400;
const FIND_TIMEOUT = 250; // ms

const CHARACTERS_TO_NORMALIZE = {
  '\u2018': '\'', // Left single quotation mark
  '\u2019': '\'', // Right single quotation mark
  '\u201A': '\'', // Single low-9 quotation mark
  '\u201B': '\'', // Single high-reversed-9 quotation mark
  '\u201C': '"', // Left double quotation mark
  '\u201D': '"', // Right double quotation mark
  '\u201E': '"', // Double low-9 quotation mark
  '\u201F': '"', // Double high-reversed-9 quotation mark
  '\u00BC': '1/4', // Vulgar fraction one quarter
  '\u00BD': '1/2', // Vulgar fraction one half
  '\u00BE': '3/4', // Vulgar fraction three quarters
};

// Compile the regular expression for text normalization once.
const replace = Object.keys(CHARACTERS_TO_NORMALIZE).join('');
const normalizationRegex = new RegExp('[' + replace + ']', 'g');

export default {
  name: 'search',
  props: {
    'waitTimeout': {
      default: 30,
      type: Number
    },
    'pdfDocument': {
      default: undefined
    },
    'query': {
      default: '',
      type: String
    }
  },
  data () {
    return {
      matches: [],
      textDivs: [],
      pageContents: [],
      pageMatches: [],
      pageMatchesLength: null,
      matchCount: 0,
      pagesCount: 0,
      pendingFindMatches: {},
      active: false,
      pagesToSearch: null,
      extractTextPromises: []
    }
  },
  updated () {

  },
  mounted () {
    if (this.pdfDocument) {
      this.extractText();
    }
  },
  watch: {
    pdfDocument () {
      if (this.pdfDocument) {
        this.extractText();
      }
    },
    query () {
      if (this.query === '') {
        this.reset();
      }
      this.findTimeout = setTimeout(() => {
        this.find(this.query);
      }, FIND_TIMEOUT);
    }
  },
  methods: {
    reset () {
      this.pageMatches = [];
      this.pageMatchesLength = null;
      this.matchCount = 0;

      this.$emit('matched', this.pageMatches, this.pageMatchesLength, this.matchCount);
      this.$emit('found', this.pageMatches, this.pageMatchesLength, this.matchCount);
    },

    find(query) {
      let numPages = this.pagesCount;

      if (this.prevQuery && this.prevQuery === query) {
        return; // unchanged
      }
      this.prevQuery = query;

      // Reset
      this.pageMatches = [];
      this.pageMatchesLength = null;
      this.matchCount = 0;
      this.selected = {
        pageIdx: -1,
        matchIdx: -1
      };

      for (let i = 0; i < numPages; i++) {
        // Wipe out any previously highlighted matches.
        // this.updatePage(i);

        // Start finding the matches as soon as the text is extracted.
        if (!(i in this.pendingFindMatches)) {
          this.pendingFindMatches[i] = true;
          this.extractTextPromises[i].then((pageIdx) => {
            delete this.pendingFindMatches[pageIdx];
            this.calcFindMatch(pageIdx);
          });
        }
      }
    },

    normalize(text) {
      return text.replace(normalizationRegex, function (ch) {
        return CHARACTERS_TO_NORMALIZE[ch];
      });
    },

    /**
     * Helper for multi-term search that fills the `matchesWithLength` array
     * and handles cases where one search term includes another search term (for
     * example, "tamed tame" or "this is"). It looks for intersecting terms in
     * the `matches` and keeps elements with a longer match length.
     */
    _prepareMatches (matchesWithLength, matches, matchesLength) {
      function isSubTerm(matchesWithLength, currentIndex) {
        let currentElem = matchesWithLength[currentIndex];
        let nextElem = matchesWithLength[currentIndex + 1];

        // Check for cases like "TAMEd TAME".
        if (currentIndex < matchesWithLength.length - 1 &&
            currentElem.match === nextElem.match) {
          currentElem.skipped = true;
          return true;
        }

        // Check for cases like "thIS IS".
        for (let i = currentIndex - 1; i >= 0; i--) {
          let prevElem = matchesWithLength[i];
          if (prevElem.skipped) {
            continue;
          }
          if (prevElem.match + prevElem.matchLength < currentElem.match) {
            break;
          }
          if (prevElem.match + prevElem.matchLength >=
              currentElem.match + currentElem.matchLength) {
            currentElem.skipped = true;
            return true;
          }
        }
        return false;
      }

      // Sort the array of `{ match: <match>, matchLength: <matchLength> }`
      // objects on increasing index first and on the length otherwise.
      matchesWithLength.sort(function(a, b) {
        return a.match === b.match ? a.matchLength - b.matchLength : a.match - b.match;
      });
      for (let i = 0, len = matchesWithLength.length; i < len; i++) {
        if (isSubTerm(matchesWithLength, i)) {
          continue;
        }
        matches.push(matchesWithLength[i].match);
        matchesLength.push(matchesWithLength[i].matchLength);
      }
    },

    calcFindPhraseMatch (query, pageIndex, pageContent) {
      let matches = [];
      let queryLen = query.length;
      let matchIdx = -queryLen;
      while (true) {
        matchIdx = pageContent.indexOf(query, matchIdx + queryLen);
        if (matchIdx === -1) {
          break;
        }
        matches.push(matchIdx);
      }
      this.pageMatches[pageIndex] = matches;
    },

    calcFindWordMatch (query, pageIndex, pageContent) {
      let matchesWithLength = [];
      // Divide the query into pieces and search for text in each piece.
      let queryArray = query.match(/\S+/g);
      for (let i = 0, len = queryArray.length; i < len; i++) {
        let subquery = queryArray[i];
        let subqueryLen = subquery.length;
        let matchIdx = -subqueryLen;
        while (true) {
          matchIdx = pageContent.indexOf(subquery, matchIdx + subqueryLen);
          if (matchIdx === -1) {
            break;
          }
          // Other searches do not, so we store the length.
          matchesWithLength.push({
            match: matchIdx,
            matchLength: subqueryLen,
            skipped: false,
          });
        }
      }

      // Prepare arrays for storing the matches.
      if (!this.pageMatchesLength) {
        this.pageMatchesLength = [];
      }
      this.pageMatchesLength[pageIndex] = [];
      this.pageMatches[pageIndex] = [];

      // Sort `matchesWithLength`, remove intersecting terms and put the result
      // into the two arrays.
      this._prepareMatches(matchesWithLength, this.pageMatches[pageIndex],
        this.pageMatchesLength[pageIndex]);
    },

    calcFindMatch (pageIndex) {
      let pageContent = this.normalize(this.pageContents[pageIndex]);
      let query = this.normalize(this.query);
      let caseSensitive = this.caseSensitive;
      let phraseSearch = this.phraseSearch;
      let queryLen = query.length;

      if (queryLen === 0) {
        // Do nothing: the matches should be wiped out already.
        return;
      }

      if (!caseSensitive) {
        pageContent = pageContent.toLowerCase();
        query = query.toLowerCase();
      }

      if (phraseSearch) {
        this.calcFindPhraseMatch(query, pageIndex, pageContent);
      } else {
        this.calcFindWordMatch(query, pageIndex, pageContent);
      }

      // this.updatePage(pageIndex);
      // this.updateMatches();

      // Update the match count.
      if (this.pageMatches[pageIndex].length > 0) {
        this.matchCount += this.pageMatches[pageIndex].length;
      }

      this.$emit('matched', this.pageMatches, this.pageMatchesLength, this.matchCount);

      if (this.pageMatches.length === this.pagesCount) {
        this.$emit('found', this.pageMatches, this.pageMatchesLength, this.matchCount);
      }
    },

    getPageTextContent (pageIndex) {
      return this.pdfDocument.getPage(pageIndex + 1).then(function (page) {
        return page.getTextContent({
          normalizeWhitespace: true,
        });
      });
    },

    extractText () {
      if (this.startedTextExtraction) {
        return;
      }
      this.startedTextExtraction = true;
      this.pageContents.length = 0;
      this.pagesCount = this.pdfDocument.numPages - 1;

      let promise = Promise.resolve();
      for (let i = 0, ii = this.pagesCount; i < ii; i++) {
        let extractTextCapability = createPromiseCapability();
        this.extractTextPromises[i] = extractTextCapability.promise;

        promise = promise.then(() => {
          return this.getPageTextContent(i).then((textContent) => {
            let textItems = textContent.items;
            let strBuf = [];

            for (let j = 0, jj = textItems.length; j < jj; j++) {
              strBuf.push(textItems[j].str);
            }
            // Store the pageContent as a string.
            this.pageContents[i] = strBuf.join('');
            extractTextCapability.resolve(i);
          });
        });
      }
    },
    /*
    nextMatch () {
      let previous = this.state.findPrevious;
      let currentPageIndex = this.pdfDocument.currentPageNumber - 1;
      let numPages = this.pagesCount;

      this.active = true;

      if (this.dirtyMatch) {
        // Need to recalculate the matches, reset everything.
        this.dirtyMatch = false;
        this.selected.pageIdx = this.selected.matchIdx = -1;
        this.offset.pageIdx = currentPageIndex;
        this.offset.matchIdx = null;
        this.hadMatch = false;
        this.resumePageIdx = null;
        this.pageMatches = [];
        this.matchCount = 0;
        this.pageMatchesLength = null;

        for (let i = 0; i < numPages; i++) {
          // Wipe out any previously highlighted matches.
          // this.updatePage(i);

          // Start finding the matches as soon as the text is extracted.
          if (!(i in this.pendingFindMatches)) {
            this.pendingFindMatches[i] = true;
            this.extractTextPromises[i].then((pageIdx) => {
              delete this.pendingFindMatches[pageIdx];
              this.calcFindMatch(pageIdx);
            });
          }
        }
      }

      // If there's no query there's no point in searching.
      if (this.query === '') {
        this.updateUIState(FindState.FOUND);
        return;
      }

      // If we're waiting on a page, we return since we can't do anything else.
      if (this.resumePageIdx) {
        return;
      }

      let offset = this.offset;
      // Keep track of how many pages we should maximally iterate through.
      this.pagesToSearch = numPages;
      // If there's already a `matchIdx` that means we are iterating through a
      // page's matches.
      if (offset.matchIdx !== null) {
        let numPageMatches = this.pageMatches[offset.pageIdx].length;
        if ((!previous && offset.matchIdx + 1 < numPageMatches) ||
            (previous && offset.matchIdx > 0)) {
          // The simple case; we just have advance the matchIdx to select
          // the next match on the page.
          this.hadMatch = true;
          offset.matchIdx = (previous ? offset.matchIdx - 1 : offset.matchIdx + 1);
          this.updateMatch(true);
          return;
        }
        // We went beyond the current page's matches, so we advance to
        // the next page.
        this.advanceOffsetPage(previous);
      }
      // Start searching through the page.
      this.nextPageMatch();
    },
    */
    /*
    matchesReady(matches) {
      let offset = this.offset;
      let numMatches = matches.length;
      let previous = this.state.findPrevious;

      if (numMatches) {
        // There were matches for the page, so initialize `matchIdx`.
        this.hadMatch = true;
        offset.matchIdx = (previous ? numMatches - 1 : 0);
        this.updateMatch(true);
        return true;
      }
      // No matches, so attempt to search the next page.
      this.advanceOffsetPage(previous);
      if (offset.wrapped) {
        offset.matchIdx = null;
        if (this.pagesToSearch < 0) {
          // No point in wrapping again, there were no matches.
          this.updateMatch(false);
          // While matches were not found, searching for a page
          // with matches should nevertheless halt.
          return true;
        }
      }
      // Matches were not found (and searching is not done).
      return false;
    }
    */

  }
}
</script>
