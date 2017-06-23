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
      matches: [],
      textDivs: [],
      selected: {
        pageIdx: -1,
        matchIdx: -1
      },
      query: ''
    }
  },
  updated () {

  },
  mounted () {
    if (this.page) {
      this.getTextContent(this.page)
        .then((textContent) => this.onContent(textContent))
        .catch((err) => console.error(err));
    }
  },
  destroyed () {

  },
  watch: {
    page () {
      if (this.page) {
        this.getTextContent(this.page)
          .then((textContent) => this.onContent(textContent))
          .catch((err) => console.error(err));
      }
    },
    viewport () {
      if (this.textContent) {
        this.onContent(this.textContent);
      }
    }
  },
  methods: {
    getTextContent (page) {
      return page.getTextContent({ normalizeWhitespace: true });
    },
    onContent (textContent) {
      const { textLayer } = this.$refs;

      this.clearTextLayer();

      this.textContent = textContent;

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

        if (this.pageMatches) {
          this.matches = this.convertMatches(this.pageMatches, this.pageMatchesLength);
          this.renderMatches(this.matches);
        }
      }).catch((err) => console.error(err));
    },
    onPageError (page) {
      console.error(page);
    },
    clearTextLayer () {
      const { textLayer } = this.$refs;
      while (textLayer.firstChild) {
        textLayer.removeChild(textLayer.firstChild);
      }
    },
    updateTextLayerMatches(query, pageMatches, pageMatchesLength) {
      this.pageMatches = pageMatches;
      this.pageMatchesLength = pageMatchesLength;
      this.query = query;
      if (this.textContent) {
        this.clearMatches();
        this.matches = this.convertMatches(this.pageMatches, this.pageMatchesLength);
        this.renderMatches(this.matches);
      }
    },
    clearTextLayerMatches() {
      this.pageMatches = [];
      this.pageMatchesLength = [];
      this.query = '';
      this.clearMatches();
      this.selected = {pageIdx: -1, matchIdx: -1};
      this._sentSelected = false;
    },
    selectedMatch(pageIdx, matchIdx) {
      this._sentSelected = false;
      this.clearMatches();
      this.selected = {pageIdx, matchIdx};
      this.renderMatches(this.matches);
    },
    renderMatches(matches) {
      // Early exit if there is nothing to render.
      if (matches.length === 0) {
        return;
      }

      var bidiTexts = this.textContent.items;
      var textDivs = this.textDivs;
      var prevEnd = null;
      var pageIdx = this.page.pageIndex;
      var isSelectedPage = this.selected.pageIdx === pageIdx;
      var selectedMatchIdx = this.selected.matchIdx || -1;
      var highlightAll = true;
      var infinity = {
        divIdx: -1,
        offset: undefined,
      };

      function beginText(begin, className) {
        var divIdx = begin.divIdx;
        textDivs[divIdx].textContent = '';
        appendTextToDiv(divIdx, 0, begin.offset, className);
      }

      function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
        var div = textDivs[divIdx];
        var content = bidiTexts[divIdx].str.substring(fromOffset, toOffset);
        var node = document.createTextNode(content);
        if (className) {
          var span = document.createElement('span');
          span.className = className;
          span.appendChild(node);
          div.appendChild(span);
          return;
        }
        div.appendChild(node);
      }

      var i0 = selectedMatchIdx;
      var i1 = i0 + 1;
      if (highlightAll) {
        i0 = 0;
        i1 = matches.length;
      } else if (!isSelectedPage) {
        // Not highlighting all and this isn't the selected page, so do nothing.
        return;
      }

      for (var i = i0; i < i1; i++) {
        var match = matches[i];
        var begin = match.begin;
        var end = match.end;
        var isSelected = (isSelectedPage && match.matchIdx === selectedMatchIdx);
        var highlightSuffix = (isSelected ? ' selected' : '');

        if (isSelected && !this._sentSelected) {
          this.$emit('selected', textDivs[begin.divIdx].getBoundingClientRect());
          this._sentSelected = true;
        }

        // Match inside new div.
        if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
          // If there was a previous div, then add the text at the end.
          if (prevEnd !== null) {
            appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
          }
          // Clear the divs and set the content until the starting point.
          beginText(begin);
        } else {
          appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
        }

        if (begin.divIdx === end.divIdx) {
          appendTextToDiv(begin.divIdx, begin.offset, end.offset, 'highlight' + highlightSuffix);
        } else {
          appendTextToDiv(begin.divIdx, begin.offset, infinity.offset, 'highlight begin' + highlightSuffix);
          for (var n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
            textDivs[n0].className = 'highlight middle' + highlightSuffix;
          }
          beginText(end, 'highlight end' + highlightSuffix);
        }
        prevEnd = end;
      }

      if (prevEnd) {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
      }
    },
    convertMatches (matches, matchesLength) {
      var i = 0;
      var iIndex = 0;
      var bidiTexts = this.textContent.items;
      var end = bidiTexts.length - 1;
      var queryLen = this.query ? this.query.length : 0;
      var ret = [];
      if (!matches) {
        return ret;
      }
      for (var m = 0, len = matches.length; m < len; m++) {
        // Calculate the start position.
        var matchIdx = matches[m];

        // Loop over the divIdxs.
        while (i !== end && matchIdx >= (iIndex + bidiTexts[i].str.length)) {
          iIndex += bidiTexts[i].str.length;
          i++;
        }

        if (i === bidiTexts.length) {
          console.error('Could not find a matching mapping');
        }

        var match = {
          matchIdx: matchIdx,
          begin: {
            divIdx: i,
            offset: matchIdx - iIndex
          },
        };

        // Calculate the end position.
        if (matchesLength) { // multiterm search
          matchIdx += matchesLength[m];
        } else { // phrase search
          matchIdx += queryLen;
        }

        // Somewhat the same array as above, but use > instead of >= to get
        // the end position right.
        while (i !== end && matchIdx > (iIndex + bidiTexts[i].str.length)) {
          iIndex += bidiTexts[i].str.length;
          i++;
        }

        match.end = {
          divIdx: i,
          offset: matchIdx - iIndex,
        };
        ret.push(match);
      }

      return ret;
    },
    clearMatches () {
      if (!this.textContent) {
        return;
      }
      // Clear all matches.
      var matches = this.matches;
      var textDivs = this.textDivs;
      var bidiTexts = this.textContent.items;
      var clearedUntilDivIdx = -1;

      // Clear all current matches.
      for (var i = 0, len = matches.length; i < len; i++) {
        var match = matches[i];
        var begin = Math.max(clearedUntilDivIdx, match.begin.divIdx);
        for (var n = begin, end = match.end.divIdx; n <= end; n++) {
          var div = textDivs[n];
          div.textContent = bidiTexts[n].str;
          div.className = '';
        }
        clearedUntilDivIdx = match.end.divIdx + 1;
      }
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

.textLayer .highlight {
    margin: -1px;
    padding: 1px;
    background-color: rgb(180, 0, 170);
    border-radius: 4px;
}

.textLayer .highlight.selected {
    background-color: rgb(0, 100, 0);
}

</style>
