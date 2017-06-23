<template>
</template>

<script>
import { createPromiseCapability } from 'pdfjs-dist';

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
    },
    'phraseSearch': {
      default: true,
      type: Boolean
    },
    'minQueryLength': {
      default: 3,
      type: Number
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
      extractTextPromises: [],
      matched: []
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

      clearTimeout(this.findTimeout);
      this.findTimeout = setTimeout(() => {
        if (this.query.length > this.minQueryLength) {
          this.find(this.query);
        }
      }, FIND_TIMEOUT);
    }
  },
  methods: {
    reset () {
      this.matched = [];
      this.pageMatches = [];
      this.pageMatchesLength = null;
      this.matchCount = 0;

      this.$emit('matched', this.matched, this.pageMatchesLength, this.matchCount);
      this.$emit('found', this.pageMatches, this.pageMatchesLength, this.matchCount);
    },

    find(query) {
      let numPages = this.pagesCount;

      if (this.prevQuery && this.prevQuery === query) {
        return; // unchanged
      }
      this.prevQuery = query;

      // Reset
      this.matched = [];
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
      if (pageIndex in this.pageMatches && this.pageMatches[pageIndex].length > 0) {
        this.matchCount += this.pageMatches[pageIndex].length;

        this.pageMatches[pageIndex].forEach((match) => {
          this.matched.push({
            matchIdx: match,
            pageIdx: pageIndex
          });
          this.$emit('matched', this.query, this.matched, this.pageMatches[pageIndex], this.pageMatchesLength ? this.pageMatchesLength[pageIndex] : null, this.matchCount);
        });
      }

      if (this.pageMatches.length === this.pagesCount) {
        this.$emit('found', this.query, this.matched, this.pageMatches, this.pageMatchesLength, this.matchCount);
      }
    },

    getPageTextContent (pageIndex) {
      return this.pdfDocument.getPage(pageIndex + 1).then(function (page) {
        return page.getTextContent({
          normalizeWhitespace: true,
        });
      }).catch((err) => console.error(err));
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
    }
  }
}
</script>
