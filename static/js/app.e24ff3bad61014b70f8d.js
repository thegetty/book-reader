webpackJsonp([2],[,,,,,function(t,e,i){i(108);var n=i(0)(i(47),i(136),null,null);t.exports=n.exports},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,i){"use strict";var n=i(7),a=i(139),s=i(119),r=i.n(s);n.a.use(a.a),e.a=new a.a({routes:[{path:"/",name:"Main",component:r.a},{path:"/books/:book/editions/:edition",name:"Manifest",component:r.a},{path:"/books/:book/editions/:edition/images/:image",name:"ImageLink",component:r.a}]})},function(t,e,i){i(106);var n=i(0)(i(48),i(134),null,null);t.exports=n.exports},,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(7),a=i(44),s=i.n(a),r=i(43);n.a.config.productionTip=!1,new n.a({el:"#app",router:r.a,template:"<App/>",components:{App:s.a}})},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(7),a={};e.default={name:"icon",props:{name:{type:String,validator:function(t){return t?t in a||(n.a.util.warn('Invalid prop: prop "icon" is referring to an unregistered icon "'+t+'".\nPlesase make sure you have imported this icon before using it.',this),!1):null}},scale:[Number,String],spin:Boolean,inverse:Boolean,flip:{validator:function(t){return"horizontal"===t||"vertical"===t}},label:String},data:function(){return{x:!1,y:!1,childrenWidth:0,childrenHeight:0,outerScale:1}},computed:{normalizedScale:function(){var t=this.scale;return t=void 0===t?1:Number(t),isNaN(t)||t<=0?(n.a.util.warn('Invalid prop: prop "scale" should be a number over 0.',this),this.outerScale):t*this.outerScale},clazz:function(){return{"fa-icon":!0,"fa-spin":this.spin,"fa-flip-horizontal":"horizontal"===this.flip,"fa-flip-vertical":"vertical"===this.flip,"fa-inverse":this.inverse}},icon:function(){return this.name?a[this.name]:null},box:function(){return this.icon?"0 0 "+this.icon.width+" "+this.icon.height:"0 0 "+this.width+" "+this.height},ratio:function(){if(!this.icon)return 1;var t=this.icon,e=t.width,i=t.height;return Math.max(e,i)/16},width:function(){return this.childrenWidth||this.icon&&this.icon.width/this.ratio*this.normalizedScale||0},height:function(){return this.childrenHeight||this.icon&&this.icon.height/this.ratio*this.normalizedScale||0},style:function(){return 1!==this.normalizedScale&&{fontSize:this.normalizedScale+"em"}}},mounted:function(){var t=this;if(!this.icon){this.$children.forEach(function(e){e.outerScale=t.normalizedScale});var e=0,i=0;this.$children.forEach(function(t){e=Math.max(e,t.width),i=Math.max(i,t.height)}),this.childrenWidth=e,this.childrenHeight=i,this.$children.forEach(function(t){t.x=(e-t.width)/2,t.y=(i-t.height)/2})}},register:function(t){for(var e in t){var i=t[e];i.paths||(i.paths=[]),i.d&&i.paths.push({d:i.d}),i.polygons||(i.polygons=[]),i.points&&i.polygons.push({points:i.points}),a[e]=i}},icons:a}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app"}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(18),a=i.n(n),s=i(42),r=i.n(s),o=i(7);o.a.use(r.a),e.default={name:"grid",components:{},props:{data:{type:Array}},data:function(){var t={};return this.columns=["thumbnail"],this.columns.forEach(function(e){t[e]=1}),{sortKey:"",sortOrders:t,filterKey:"",gridColumns:[]}},computed:{filteredData:function(){var t=this.sortKey,e=this.filterKey&&this.filterKey.toLowerCase(),i=this.sortOrders[t]||1,n=this.data;return e&&n&&(n=n.filter(function(t){return a()(t).some(function(i){return String(t[i]).toLowerCase().indexOf(e)>-1})})),t&&(n=n.slice().sort(function(e,n){return e=e[t],n=n[t],(e===n?0:e>n?1:-1)*i})),n}},methods:{sortBy:function(t){this.sortKey=t,this.sortOrders[t]=-1*this.sortOrders[t]},triggerLoad:function(){o.a.nextTick(this.$Lazyload.lazyLoadHandler)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"imagelayer",props:{images:{default:[],type:Array},viewport:{default:void 0,type:Object},onImageClicked:{default:void 0,type:Function}},data:function(){return{}},updated:function(){},mounted:function(){this.images},watch:{images:function(){this.images}},methods:{handleClick:function(t){this.onImageClicked&&this.onImageClicked(t),this.$emit("imageClicked",t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(123),a=i.n(n);e.default={name:"main",components:{Reader:a.a},data:function(){return console.log(this.$route.params.book,this.$route.params.edition),{url:"https://s3.amazonaws.com/pubs-fchasen/books/"+(this.$route.params.book||711)+"/editions/"+(this.$route.params.edition||884)+"/manifest.json"}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(59),a=i.n(n),s=i(60),r=i.n(s);e.default={name:"outline",components:{},props:{data:{type:Array},page:{type:Number,default:void 0},pdf:{type:Object,default:void 0}},data:function(){return{pageList:[],activeItem:void 0}},mounted:function(){this.data&&this.processData()},methods:{processData:function(){var t=this;this.pageList=[],this.data.forEach(function(e,i){var n=r()({},e);t.pageList.push(n),t.pdf.getPageIndex(e.dest[0]).then(function(e){n.page=e,i===t.data.length-1&&t.checkActive()})})},handleLink:function(t){this.$emit("onClick",t.dest)},checkActive:function(){var t=!0,e=!1,i=void 0;try{for(var n,s=a()(this.pageList);!(t=(n=s.next()).done);t=!0){var r=n.value;if(r.page>this.page)break;this.activeItem=r}}catch(t){e=!0,i=t}finally{try{!t&&s.return&&s.return()}finally{if(e)throw i}}}},watch:{data:function(){this.processData()},page:function(){this.checkActive()}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(122),a=i.n(n),s=i(124),r=i.n(s),o=i(17);o.PDFJS.workerSrc="static/libs/pdfjs-dist/build/pdf.worker.js",e.default={name:"pdf",components:{Page:a.a,Search:r.a},props:{src:{type:String},width:{type:Number,default:void 0},height:{type:Number,default:void 0},page:{default:0,type:Number},spreads:{default:!0,type:Boolean},onImageClicked:{default:void 0,type:Function},onOutlineReady:{default:void 0,type:Function},query:{default:void 0,type:String},zoom:{default:1,type:Number}},data:function(){return{pdfDocument:void 0,numPages:0,scale:1,rotate:void 0,isLoading:!0,viewportWidth:0,viewportHeight:0,displayedPage:0,displayedPages:[],displayedPagesNumbers:[],outline:void 0,pageMatchesLength:[],pageMatches:[],matched:[],selectedMatch:{}}},updated:function(){},mounted:function(){var t=this;this.src&&this.loadDocument(this.src).then(function(){return t.display(t.page)}).catch(function(t){return console.error(t)})},watch:{src:function(){var t=this;this.src&&this.loadDocument(this.src).then(function(){return t.display(t.page)}).catch(function(t){return console.error(t)})},page:function(t){void 0!==this.page&&this.page>-1&&this.display(this.page)},spreads:function(t){void 0!==this.displayedPage&&this.display(this.displayedPage)},displayedPage:function(){this.$emit("pageChanged",this.displayedPagesNumbers)},query:function(){""===this.query&&this.clearMatches()},zoom:function(){var t=this.$refs.container,e=t.getBoundingClientRect();this.scrollLeftDelta=t.scrollLeft-(t.scrollWidth-e.width)/2,this.scrollTopDelta=t.scrollTop-(t.scrollHeight-e.height)/2}},methods:{loadDocument:function(t){var e=this;return console.log("src",t),o.getDocument(t).then(function(t){var i=t.numPages;e.numPages=i,e.pdfDocument=t,e.$emit("loaded",t),e.outline=t.getOutline().then(function(t){return e.processOutline(t)})}).catch(function(t){return console.error(t)})},display:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.page;this.displayedPages=[],t<0||(this.spreads?(this.displayedPage=t%2!=0||0===t?t:t-1,this.displayedPage>0?(this.loadPage(this.displayedPage),this.loadPage(this.displayedPage+1),this.displayedPagesNumbers=[this.displayedPage,this.displayedPage+1]):(this.loadPage(this.displayedPage),this.displayedPagesNumbers=[this.displayedPage])):(this.displayedPage=t,this.loadPage(this.displayedPage),this.displayedPagesNumbers=[this.displayedPage]))},next:function(){0===this.displayedPage?this.displayedPage+=1:this.displayedPage+=this.spreads?2:1,this.displayedPage<this.numPages?this.display(this.displayedPage):this.displayedPage=this.numPages-(this.spreads?2:1)},prev:function(){this.displayedPage>0&&(1===this.displayedPage?this.displayedPage-=1:this.displayedPage-=this.spreads?2:1,this.display(this.displayedPage))},loadPage:function(t){var e=this,i=this.pdfDocument;if(!i)throw new Error("Unexpected call to getPage() before the document has been loaded.");var n=t+1;return!t||n<1?n=1:n>=i.numPages&&(n=i.numPages),i.getPage(n).then(function(t){return e.onPageLoad(t)}).catch(function(t){return e.onPageError(t)})},onPageLoad:function(t){var e=this;this.displayedPagesNumbers.includes(t.pageIndex)&&(this.displayedPages.push(t),this.$nextTick(function(){var i=e.$refs["page_"+t.pageIndex][0];i.updatedSelectedMatch(e.selectedMatch),i.updateTextLayerMatches(e.query,e.pageMatches,e.pageMatchesLength)}))},afterDisplayed:function(){var t=this.$refs.container,e=t.getBoundingClientRect();t.scrollLeft=(t.scrollWidth-e.width)/2+this.scrollLeftDelta,t.scrollTop=(t.scrollHeight-e.height)/2+this.scrollTopDelta},onPageError:function(t){console.error(t)},handleViewport:function(t){this.viewportWidth=t.width,this.viewportHeight=t.height},processOutline:function(t){return this.onOutlineReady&&this.onOutlineReady(t),t},getPageIndex:function(t){return this.pdfDocument.getPageIndex(t)},onMatched:function(t,e,i,n){},onFound:function(t,e,i,n,a){if(this.pageMatches=i,this.pageMatchesLength=n,this.matched=e,this.$emit("found",a),this.matched&&this.matched.length)if(this.currentMatchIndex=0,this.selectedMatch=this.matched[this.currentMatchIndex],this.$emit("match",this.currentMatchIndex),this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)){var s=this.$refs["page_"+this.selectedMatch.pageIdx][0];s.updatedSelectedMatch(this.selectedMatch),s.updateTextLayerMatches(this.query,this.pageMatches,this.pageMatchesLength)}else this.display(this.selectedMatch.pageIdx)},onSelected:function(t){var e=this.$refs.container,i=e.getBoundingClientRect();e.scrollLeft=i.left+t.left,e.scrollTop=i.top+t.top},clearMatches:function(){var t=this;this.displayedPagesNumbers.forEach(function(e){t.$refs["page_"+e][0].updateTextLayerMatches("",[],null)})},nextMatch:function(){if(this.matched&&0!==this.matched.length)if(this.currentMatchIndex<this.matched.length-1?this.currentMatchIndex+=1:this.currentMatchIndex=0,this.selectedMatch=this.matched[this.currentMatchIndex],this.$emit("match",this.currentMatchIndex),this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)){var t=this.$refs["page_"+this.selectedMatch.pageIdx][0];t.updatedSelectedMatch(this.selectedMatch)}else this.display(this.selectedMatch.pageIdx)},prevMatch:function(){if(this.matched&&0!==this.matched.length)if(this.currentMatchIndex>0?this.currentMatchIndex-=1:this.currentMatchIndex=this.matched.length-1,this.selectedMatch=this.matched[this.currentMatchIndex],this.$emit("match",this.currentMatchIndex),this.displayedPagesNumbers.includes(this.selectedMatch.pageIdx)){var t=this.$refs["page_"+this.selectedMatch.pageIdx][0];t.updatedSelectedMatch(this.selectedMatch)}else this.display(this.selectedMatch.pageIdx)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(126),a=i.n(n),s=i(118),r=i.n(s);i(17).PDFJS.workerSrc="/static/libs/pdfjs-dist/build/pdf.worker.js",e.default={name:"page",components:{textlayer:a.a,imagelayer:r.a},props:{scale:{default:1,type:Number},rotate:{default:void 0,type:Number},width:{type:Number},height:{type:Number},page:{default:void 0,type:Object},onViewport:{default:void 0,type:Function},onImageClicked:{default:void 0,type:Function},onSelected:{default:void 0,type:Function}},data:function(){return{pdf:void 0,isLoading:!0,viewportWidth:0,viewportHeight:0,viewportScale:1,viewport:void 0,textContent:void 0,images:[],pageIndex:void 0}},updated:function(){},mounted:function(){this.page&&this.displayPage(this.page)},watch:{page:function(){this.page&&this.displayPage(this.page)},scale:function(){this.displaying||void 0!==this.scale&&this.displayPage(this.page)},width:function(){this.displaying||void 0!==this.scale&&this.displayPage(this.page)},height:function(){this.displaying||void 0!==this.scale&&this.displayPage(this.page)},pageMatches:function(){}},methods:{getPageScale:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.page,e=this.scale,i=this.width,n=this.height,a=1;return a=i<n?i/t.getViewport(e).width:n/t.getViewport(e).height,e*a},displayPage:function(t){var e=this,i=this.$refs.canvas,n=i.getContext("2d"),a=this.scale,s=1!==a?a:this.getPageScale(t),r=t.getViewport(s),o=this.images,h=0,c={beginLayout:function(){},endLayout:function(){},appendImage:function(e){e.page=t.pageIndex,e.index=h,o.push(e),h++}};this.pageIndex=t.pageIndex,this.viewport=r,this.viewportScale=a,this.viewportHeight=r.height,this.viewportWidth=r.width,this.onViewport&&this.onViewport(r),this.displaying=!0,t.render({canvasContext:n,viewport:r,imageLayer:c}).then(function(){e.$emit("displayed",e),e.displaying=!1}).catch(function(t){return console.error(t)})},onPageError:function(t){console.error(t)},updateTextLayerMatches:function(t,e,i){this.query=t,this.pageMatchesLength=i,this.pageMatches=e,e&&e.length>this.pageIndex?this.$refs.textLayer.updateTextLayerMatches(t,e[this.pageIndex],i?i[this.pageIndex]:null):this.$refs.textLayer.clearTextLayerMatches()},updatedSelectedMatch:function(t){this.selectedMatch=t,this.pageIndex===t.pageIdx&&this.$refs.textLayer.selectedMatch(t.pageIdx,t.matchIdx)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(121),a=i.n(n),s=i(125),r=i.n(s),o=i(117),h=i.n(o),c=i(120),d=i.n(c),l=i(142),u=(i.n(l),i(113),i(114),i(111),i(112),i(115),i(116),i(5)),p=i.n(u);e.default={name:"reader",components:{PDF:a.a,grid:h.a,tablegrid:r.a,icon:p.a,outline:d.a},props:["manifest-url"],data:function(){var t=this.getBounds();return{manifest:{},images:[],imagesById:{},imagesByArtwork:{},imagesByArtist:{},imagesByCollection:{},page:0,displayedPage:0,spreads:!0,showTable:!1,showGrid:!1,currentDetail:void 0,width:t.width,height:t.height,outline:void 0,outlineOpen:!1,query:"",matchCount:void 0,currentMatchIndex:void 0,zoomLevel:1}},created:function(){this.fetchManifest(),window.addEventListener("keyup",this.keyListener.bind(this),!1),window.addEventListener("resize",this.handleResize.bind(this),!1)},beforeDestory:function(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("keyup",this.keyListener)},watch:{showTable:function(){this.$refs.table.triggerLoad()},showGrid:function(){this.$refs.grid.triggerLoad()}},methods:{fetchManifest:function(){var t=this;return fetch(this.manifestUrl).then(function(t){return t.json()}).then(function(e){t.manifest=e}).catch(function(t){return console.error(t)})},loaded:function(t){var e=this;this.pdfDocument=t,this.images=this.manifest.images,this.images.forEach(function(t){if(e.imagesById["img_p"+(t.page-1)+"_"+t.location]=t,t.artwork_title){var i=encodeURI(t.artwork_title);e.imagesByArtwork[i]||(e.imagesByArtwork[i]=[]),e.imagesByArtwork[i].push(t)}if(t.artist_name){var n=encodeURI(t.artist_name);e.imagesByArtist[n]||(e.imagesByArtist[n]=[]),e.imagesByArtist[n].push(t)}if(t.collection){var a=encodeURI(t.collection);e.imagesByCollection[a]||(e.imagesByCollection[a]=[]),e.imagesByCollection[a].push(t)}})},next:function(){this.$refs.pdf.next()},prev:function(){this.$refs.pdf.prev()},keyListener:function(t){var e=t.keyCode;37===e?this.prev():39===e&&this.next()},handleResize:function(){var t=this.getBounds();this.width=t.width,this.height=t.height},goto:function(t){var e=this,i=this.$refs.pdf;return this.outlineOpen=!1,i.getPageIndex(t[0]).then(function(t){e.page=t}).catch(function(t){return console.error(t)})},onImageSelected:function(t){this.currentDetail=t},onPageSelected:function(t){this.page=t-1,this.showGrid=!1,this.showTable=!1,this.currentDetail=void 0},onImageClicked:function(t){this.currentDetail=this.imagesById[t.objId]},onFound:function(t){this.matchCount=t},onMatch:function(t){this.currentMatchIndex=t+1},getBounds:function(){var t=window.innerWidth,e=window.innerHeight;return{width:t-134,height:e-134}},setSpreads:function(t){this.spreads!==t&&(this.spreads=t)},onOutlineReady:function(t){this.outline=t},onPageChanged:function(t){this.displayedPage=t[t.length-1],this.page=-1},toggleTable:function(){this.showTable=!this.showTable,this.showGrid=!1},toggleGrid:function(){this.showGrid=!this.showGrid,this.showTable=!1},nextDetail:function(){var t=this.images.indexOf(this.currentDetail);t+1<this.images.length&&(this.currentDetail=this.images[t+1])},prevDetail:function(){var t=this.images.indexOf(this.currentDetail);t-1>=0&&(this.currentDetail=this.images[t-1])},nextMatch:function(){this.$refs.pdf.nextMatch()},prevMatch:function(){this.$refs.pdf.prevMatch()},zoomIn:function(){this.zoomLevel=Math.round(10*this.zoomLevel+2)/10},zoomOut:function(){this.zoomLevel>.2&&(this.zoomLevel=Math.round(10*this.zoomLevel-2)/10)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(61),a=i.n(n),s=i(18),r=i.n(s),o=i(17),h=(i.n(o),{"‘":"'","’":"'","‚":"'","‛":"'","“":'"',"”":'"',"„":'"',"‟":'"',"¼":"1/4","½":"1/2","¾":"3/4"}),c=r()(h).join(""),d=new RegExp("["+c+"]","g");e.default={name:"search",props:{waitTimeout:{default:30,type:Number},pdfDocument:{default:void 0},query:{default:"",type:String},phraseSearch:{default:!0,type:Boolean},minQueryLength:{default:3,type:Number}},data:function(){return{matches:[],textDivs:[],pageContents:[],pageMatches:[],pageMatchesLength:null,matchCount:0,pagesCount:0,pendingFindMatches:{},active:!1,pagesToSearch:null,extractTextPromises:[],matched:[]}},updated:function(){},mounted:function(){this.pdfDocument&&this.extractText()},watch:{pdfDocument:function(){this.pdfDocument&&this.extractText()},query:function(){var t=this;""===this.query&&this.reset(),clearTimeout(this.findTimeout),this.findTimeout=setTimeout(function(){t.query.length>t.minQueryLength&&t.find(t.query)},250)}},methods:{reset:function(){this.matched=[],this.pageMatches=[],this.pageMatchesLength=null,this.matchCount=0,this.$emit("matched",this.matched,this.pageMatchesLength,this.matchCount),this.$emit("found",this.pageMatches,this.pageMatchesLength,this.matchCount)},find:function(t){var e=this,i=this.pagesCount;if(!this.prevQuery||this.prevQuery!==t){this.prevQuery=t,this.matched=[],this.pageMatches=[],this.pageMatchesLength=null,this.matchCount=0,this.selected={pageIdx:-1,matchIdx:-1};for(var n=0;n<i;n++)n in this.pendingFindMatches||(this.pendingFindMatches[n]=!0,this.extractTextPromises[n].then(function(t){delete e.pendingFindMatches[t],e.calcFindMatch(t)}))}},normalize:function(t){return t.replace(d,function(t){return h[t]})},_prepareMatches:function(t,e,i){t.sort(function(t,e){return t.match===e.match?t.matchLength-e.matchLength:t.match-e.match});for(var n=0,a=t.length;n<a;n++)(function(t,e){var i=t[e],n=t[e+1];if(e<t.length-1&&i.match===n.match)return i.skipped=!0,!0;for(var a=e-1;a>=0;a--){var s=t[a];if(!s.skipped){if(s.match+s.matchLength<i.match)break;if(s.match+s.matchLength>=i.match+i.matchLength)return i.skipped=!0,!0}}return!1})(t,n)||(e.push(t[n].match),i.push(t[n].matchLength))},calcFindPhraseMatch:function(t,e,i){for(var n=[],a=t.length,s=-a;;){if(-1===(s=i.indexOf(t,s+a)))break;n.push(s)}this.pageMatches[e]=n},calcFindWordMatch:function(t,e,i){for(var n=[],a=t.match(/\S+/g),s=0,r=a.length;s<r;s++)for(var o=a[s],h=o.length,c=-h;;){if(-1===(c=i.indexOf(o,c+h)))break;n.push({match:c,matchLength:h,skipped:!1})}this.pageMatchesLength||(this.pageMatchesLength=[]),this.pageMatchesLength[e]=[],this.pageMatches[e]=[],this._prepareMatches(n,this.pageMatches[e],this.pageMatchesLength[e])},calcFindMatch:function(t){var e=this,i=this.normalize(this.pageContents[t]),n=this.normalize(this.query),a=this.caseSensitive,s=this.phraseSearch;0!==n.length&&(a||(i=i.toLowerCase(),n=n.toLowerCase()),s?this.calcFindPhraseMatch(n,t,i):this.calcFindWordMatch(n,t,i),t in this.pageMatches&&this.pageMatches[t].length>0&&(this.matchCount+=this.pageMatches[t].length,this.pageMatches[t].forEach(function(i){e.matched.push({matchIdx:i,pageIdx:t}),e.$emit("matched",e.query,e.matched,e.pageMatches[t],e.pageMatchesLength?e.pageMatchesLength[t]:null,e.matchCount)})),this.pageMatches.length===this.pagesCount&&this.$emit("found",this.query,this.matched,this.pageMatches,this.pageMatchesLength,this.matchCount))},getPageTextContent:function(t){return this.pdfDocument.getPage(t+1).then(function(t){return t.getTextContent({normalizeWhitespace:!0})}).catch(function(t){return console.error(t)})},extractText:function(){var t=this;if(!this.startedTextExtraction){this.startedTextExtraction=!0,this.pageContents.length=0,this.pagesCount=this.pdfDocument.numPages-1;for(var e=a.a.resolve(),n=0,s=this.pagesCount;n<s;n++)!function(n,a){var s=i.i(o.createPromiseCapability)();t.extractTextPromises[n]=s.promise,e=e.then(function(){return t.getPageTextContent(n).then(function(e){for(var i=e.items,a=[],r=0,o=i.length;r<o;r++)a.push(i[r].str);t.pageContents[n]=a.join(""),s.resolve(n)})})}(n)}}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(18),a=i.n(n),s=i(42),r=i.n(s),o=i(7);o.a.use(r.a,{preLoad:1.3,attempt:1}),e.default={name:"table",components:{},props:{data:{type:Array}},data:function(){var t={};return this.columns=["thumbnail","page","artwork_title","artist","collection"],this.columns.forEach(function(e){t[e]=1}),{sortKey:"",sortOrders:t,filterKey:"",gridColumns:[]}},computed:{filteredData:function(){var t=this.sortKey,e=this.filterKey&&this.filterKey.toLowerCase(),i=this.sortOrders[t]||1,n=this.data;return e&&n&&(n=n.filter(function(t){return a()(t).some(function(i){return String(t[i]).toLowerCase().indexOf(e)>-1})})),t&&(n=n.slice().sort(function(e,n){return e=e[t],n=n[t],(e===n?0:e>n?1:-1)*i})),n}},filters:{capitalize:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},titlecase:function(t){var e;return e=t.replace(/_/g," "),e=e.replace(/([^\W_]+[^\s-]*) */g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase()})}},methods:{sortBy:function(t){this.sortKey=t,this.sortOrders[t]=-1*this.sortOrders[t]},triggerLoad:function(){o.a.nextTick(this.$Lazyload.lazyLoadHandler)}},updated:function(){}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(17);e.default={name:"textlayer",props:{page:{default:void 0},viewport:{default:void 0},renderTimeout:{default:300,type:Number}},data:function(){return{matches:[],textDivs:[],selected:{pageIdx:-1,matchIdx:-1},query:""}},updated:function(){},mounted:function(){var t=this;this.page&&this.getTextContent(this.page).then(function(e){return t.onContent(e)}).catch(function(t){return console.error(t)})},destroyed:function(){},watch:{page:function(){var t=this;this.page&&this.getTextContent(this.page).then(function(e){return t.onContent(e)}).catch(function(t){return console.error(t)})},viewport:function(){this.textContent&&this.onContent(this.textContent)}},methods:{getTextContent:function(t){return t.getTextContent({normalizeWhitespace:!0})},onContent:function(t){var e=this,i=this.$refs.textLayer;this.clearTextLayer(),this.textContent=t,this.textDivs=[];var a=document.createDocumentFragment();this.textLayerRenderTask&&(this.textLayerRenderTask.cancel(),this.textLayerRenderTask=null),this.textLayerRenderTask=n.renderTextLayer({textContent:t,container:a,viewport:this.viewport,textDivs:this.textDivs,timeout:this.renderTimeout}),this.textLayerRenderTask.promise.then(function(){i.appendChild(a),e.pageMatches&&(e.matches=e.convertMatches(e.pageMatches,e.pageMatchesLength),e.renderMatches(e.matches))}).catch(function(t){return console.error(t)})},onPageError:function(t){console.error(t)},clearTextLayer:function(){for(var t=this.$refs.textLayer;t.firstChild;)t.removeChild(t.firstChild)},updateTextLayerMatches:function(t,e,i){this.pageMatches=e,this.pageMatchesLength=i,this.query=t,this.textContent&&(this.clearMatches(),this.matches=this.convertMatches(this.pageMatches,this.pageMatchesLength),this.renderMatches(this.matches))},clearTextLayerMatches:function(){this.pageMatches=[],this.pageMatchesLength=[],this.query="",this.clearMatches(),this.selected={pageIdx:-1,matchIdx:-1},this._sentSelected=!1},selectedMatch:function(t,e){this._sentSelected=!1,this.clearMatches(),this.selected={pageIdx:t,matchIdx:e},this.renderMatches(this.matches)},renderMatches:function(t){function e(t,e){var n=t.divIdx;a[n].textContent="",i(n,0,t.offset,e)}function i(t,e,i,s){var r=a[t],o=n[t].str.substring(e,i),h=document.createTextNode(o);if(s){var c=document.createElement("span");return c.className=s,c.appendChild(h),void r.appendChild(c)}r.appendChild(h)}if(0!==t.length){var n=this.textContent.items,a=this.textDivs,s=null,r=this.page.pageIndex,o=this.selected.pageIdx===r,h=this.selected.matchIdx||-1,c={divIdx:-1,offset:void 0},d=h,l=d+1;d=0,l=t.length;for(var u=d;u<l;u++){var p=t[u],f=p.begin,g=p.end,m=o&&p.matchIdx===h,v=m?" selected":"";if(m&&!this._sentSelected&&(this.$emit("selected",a[f.divIdx].getBoundingClientRect()),this._sentSelected=!0),s&&f.divIdx===s.divIdx?i(s.divIdx,s.offset,f.offset):(null!==s&&i(s.divIdx,s.offset,c.offset),e(f)),f.divIdx===g.divIdx)i(f.divIdx,f.offset,g.offset,"highlight"+v);else{i(f.divIdx,f.offset,c.offset,"highlight begin"+v);for(var y=f.divIdx+1,x=g.divIdx;y<x;y++)a[y].className="highlight middle"+v;e(g,"highlight end"+v)}s=g}s&&i(s.divIdx,s.offset,c.offset)}},convertMatches:function(t,e){var i=0,n=0,a=this.textContent.items,s=a.length-1,r=this.query?this.query.length:0,o=[];if(!t)return o;for(var h=0,c=t.length;h<c;h++){for(var d=t[h];i!==s&&d>=n+a[i].str.length;)n+=a[i].str.length,i++;i===a.length&&console.error("Could not find a matching mapping");var l={matchIdx:d,begin:{divIdx:i,offset:d-n}};for(d+=e?e[h]:r;i!==s&&d>n+a[i].str.length;)n+=a[i].str.length,i++;l.end={divIdx:i,offset:d-n},o.push(l)}return o},clearMatches:function(){if(this.textContent)for(var t=this.matches,e=this.textDivs,i=this.textContent.items,n=-1,a=0,s=t.length;a<s;a++){for(var r=t[a],o=Math.max(n,r.begin.divIdx),h=o,c=r.end.divIdx;h<=c;h++){var d=e[h];d.textContent=i[h].str,d.className=""}n=r.end.divIdx+1}}}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,,,,,,function(t,e,i){i(100);var n=i(0)(i(49),i(128),"data-v-0da80b7f",null);t.exports=n.exports},function(t,e,i){i(107);var n=i(0)(i(50),i(135),"data-v-633d2fa2",null);t.exports=n.exports},function(t,e,i){i(99);var n=i(0)(i(51),i(127),"data-v-0b9bd71c",null);t.exports=n.exports},function(t,e,i){i(109);var n=i(0)(i(52),i(137),"data-v-7afe1999",null);t.exports=n.exports},function(t,e,i){i(110);var n=i(0)(i(53),i(138),"data-v-84dcc46e",null);t.exports=n.exports},function(t,e,i){i(101);var n=i(0)(i(54),i(129),"data-v-2ded1648",null);t.exports=n.exports},function(t,e,i){i(105);var n=i(0)(i(55),i(133),"data-v-59fa2e3c",null);t.exports=n.exports},function(t,e,i){var n=i(0)(i(56),i(130),null,null);t.exports=n.exports},function(t,e,i){i(102);var n=i(0)(i(57),i(131),"data-v-31beea36",null);t.exports=n.exports},function(t,e,i){i(104),i(103);var n=i(0)(i(58),i(132),"data-v-448030bb",null);t.exports=n.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("Reader",{attrs:{"manifest-url":t.url}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("ol",t._l(t.filteredData,function(e){return i("li",[i("a",{staticClass:"img_link",on:{click:function(i){t.$emit("onClick",e)}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.thumbnail,expression:"image.thumbnail"}]}),t._v(" "),i("span",[t._v(t._s(e.page_label||e.page))])])])}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pageWrapper",class:{loading:t.isLoading},style:{width:t.viewportWidth+"px",height:t.viewportHeight+"px"}},[i("canvas",{ref:"canvas",attrs:{width:t.viewportWidth+"px",height:t.viewportHeight+"px"}}),t._v(" "),i("textlayer",{ref:"textLayer",attrs:{page:t.page,viewport:t.viewport,scale:t.scale},on:{selected:t.onSelected}}),t._v(" "),i("imagelayer",{attrs:{images:t.images,viewport:t.viewport,scale:t.scale,onImageClicked:t.onImageClicked}}),t._v(" "),i("div",{ref:"annotationLayer"})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div")},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("form",{attrs:{id:"search"}},[t._v("\n    Search "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.filterKey,expression:"filterKey"}],attrs:{name:"query"},domProps:{value:t.filterKey},on:{input:function(e){e.target.composing||(t.filterKey=e.target.value)}}})]),t._v(" "),i("table",[i("thead",[i("tr",t._l(t.columns,function(e){return i("th",{class:{active:t.sortKey==e},on:{click:function(i){t.sortBy(e)}}},[t._v("\n          "+t._s(t._f("titlecase")(e))+"\n          "),i("span",{staticClass:"arrow",class:t.sortOrders[e]>0?"asc":"dsc"})])}))]),t._v(" "),i("tbody",t._l(t.filteredData,function(e){return i("tr",[i("td",[i("a",{staticClass:"img_link",on:{click:function(i){t.$emit("onImageClick",e)}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.thumbnail,expression:"entry['thumbnail']"}]})])]),t._v(" "),i("td",[i("a",{attrs:{href:"#"},on:{click:function(i){t.$emit("onPageClick",e.page)}}},[t._v("\n            "+t._s(e.page_label||e.page)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.artwork_uri,target:"_blank"}},[t._v("\n            "+t._s(e.artwork_title)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.artist_uri,target:"_blank"}},[t._v("\n            "+t._s(e.artist_name)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.collection_uri,target:"_blank"}},[t._v("\n            "+t._s(e.collection)+"\n          ")])])])}))])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"textLayer",staticClass:"textLayer",style:{width:(t.viewport?t.viewport.width:0)+"px",height:(t.viewport?t.viewport.height:0)+"px"}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"page-wrap"}},[i("header",{attrs:{id:"menu"}},[i("ul",{attrs:{id:"nav"}},[i("li",{attrs:{id:"toc-nav"}},[i("a",{on:{click:function(e){t.outlineOpen=!t.outlineOpen,t.showGrid=!1,t.showTable=!1}}},[i("icon",{attrs:{name:"list-ul",title:"Outline"}})],1)]),t._v(" "),i("li",{attrs:{id:"search-nav"}},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],attrs:{id:"search",name:"query",type:"search",results:"5"},domProps:{value:t.query},on:{input:function(e){e.target.composing||(t.query=e.target.value)}}}),t._v(" "),t.matchCount?i("a",{attrs:{id:"prevMatch"},on:{click:t.prevMatch}},[t._v("‹")]):t._e(),t._v(" "),t.matchCount?i("span",{attrs:{id:"found"}},[t._v(t._s(t.currentMatchIndex)+" of "+t._s(t.matchCount))]):t._e(),t._v(" "),t.matchCount?i("a",{attrs:{id:"nextMatch"},on:{click:t.nextMatch}},[t._v("›")]):t._e()]),t._v(" "),i("li",{attrs:{id:"title-nav"}},[t._v(t._s(t.manifest.title)+": "+t._s(t.manifest.subtitle)+", "+t._s(t.manifest.author_as_it_appears))]),t._v(" "),i("li",{attrs:{id:"zoom-nav"}},[i("a",{attrs:{id:"zoomOut"},on:{click:t.zoomOut}},[t._v("-")]),t._v(" "),t.zoomLevel?i("span",{attrs:{id:"zoomLevel"}},[t._v(t._s(Math.round(100*t.zoomLevel))+"%")]):t._e(),t._v(" "),i("a",{attrs:{id:"zoomIn"},on:{click:t.zoomIn}},[t._v("+")])]),t._v(" "),i("li",{attrs:{id:"book-nav"}},[t._v("\n        Book:\n        "),i("a",{attrs:{id:"artwork-nav-single"},on:{click:function(e){t.setSpreads(!1),t.showGrid=!1,t.showTable=!1}}},[i("icon",{staticStyle:{transform:"rotate(180deg) scaleX(-1)",height:".95em"},attrs:{name:"file-o",title:"Single"}})],1),t._v("\n         |\n        "),i("a",{attrs:{id:"artwork-nav-spread"},on:{click:function(e){t.setSpreads(!0),t.showGrid=!1,t.showTable=!1}}},[i("icon",{attrs:{name:"columns",title:"Spread"}})],1)]),t._v(" "),i("li",{attrs:{id:"artwork-nav"}},[t._v("\n        Artwork:\n        "),i("a",{attrs:{id:"artwork-nav-table"},on:{click:t.toggleTable}},[i("icon",{attrs:{name:"table",title:"Table"}})],1),t._v("\n         |\n        "),i("a",{attrs:{id:"artwork-nav-grid"},on:{click:t.toggleGrid}},[i("icon",{attrs:{name:"th",title:"Grid"}})],1)])])]),t._v(" "),i("section",{attrs:{id:"main"}},[i("PDF",{ref:"pdf",attrs:{id:"pdf",src:this.manifest.pdf,page:t.page,width:this.width,height:this.height,spreads:t.spreads,onImageClicked:this.onImageClicked,onOutlineReady:this.onOutlineReady,query:t.query,zoom:t.zoomLevel},on:{loaded:t.loaded,pageChanged:this.onPageChanged,found:this.onFound,match:this.onMatch}}),t._v(" "),i("div",{staticClass:"arrow",attrs:{id:"prev"},on:{click:this.prev}},[t._v("‹")]),t._v(" "),i("div",{staticClass:"arrow",attrs:{id:"next"},on:{click:this.next}},[t._v("›")]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showGrid||t.showTable,expression:"showGrid || showTable"}],attrs:{id:"images"}},[i("grid",{directives:[{name:"show",rawName:"v-show",value:t.showGrid,expression:"showGrid"}],ref:"grid",attrs:{id:"grid",data:t.images},on:{onClick:this.onImageSelected}}),t._v(" "),i("tablegrid",{directives:[{name:"show",rawName:"v-show",value:t.showTable,expression:"showTable"}],ref:"table",attrs:{id:"table",data:t.images},on:{onImageClick:this.onImageSelected,onPageClick:this.onPageSelected}})],1)],1),t._v(" "),t.currentDetail?i("section",{attrs:{id:"detail"}},[i("div",{staticClass:"image_detail"},[t.currentDetail.copyright?t._e():i("img",{attrs:{src:t.currentDetail.asset}}),t._v(" "),t.currentDetail.copyright?i("img",{attrs:{src:t.currentDetail.downsampled}}):t._e(),t._v(" "),i("p",[i("a",{attrs:{href:t.currentDetail.collection_uri}},[t._v(t._s(t.currentDetail.collection))])])]),t._v(" "),t.currentDetail.artwork_title?i("div",{staticClass:"image_info"},[i("h1",[t._v(t._s(t.currentDetail.artwork_title))]),t._v(" "),i("h4",[i("a",{attrs:{href:t.currentDetail.artwork_uri}},[t._v(t._s(t.currentDetail.artwork_uri))])]),t._v(" "),this.imagesByArtwork[encodeURI(t.currentDetail.artwork_title)].length>1?i("aside",[i("h5",[t._v("Also in this book")]),t._v(" "),i("ul",{staticClass:"related_images"},t._l(this.imagesByArtwork[encodeURI(t.currentDetail.artwork_title)],function(e){return t.currentDetail!=e?i("li",[i("a",{staticClass:"related_img_link",on:{click:function(i){t.currentDetail=e}}},[i("img",{attrs:{src:e.thumbnail}})])]):t._e()}))]):t._e(),t._v(" "),i("h2",[t._v(t._s(t.currentDetail.artist_name))]),t._v(" "),i("h4",[i("a",{attrs:{href:t.currentDetail.artist_uri}},[t._v(t._s(t.currentDetail.artist_uri))])]),t._v(" "),this.imagesByArtist[encodeURI(t.currentDetail.artist_name)].length>1?i("aside",[i("h5",[t._v("Also in this book")]),t._v(" "),i("ul",{staticClass:"related_images"},t._l(this.imagesByArtist[encodeURI(t.currentDetail.artist_name)],function(e){return t.currentDetail!=e&&t.imagesByArtwork[encodeURI(t.currentDetail.artwork_title)]&&-1===t.imagesByArtwork[encodeURI(t.currentDetail.artwork_title)].indexOf(e)?i("li",[i("a",{staticClass:"related_img_link",on:{click:function(i){t.currentDetail=e}}},[i("img",{attrs:{src:e.thumbnail}})])]):t._e()}))]):t._e()]):t._e(),t._v(" "),i("a",{staticClass:"detail_view",on:{click:function(e){t.onPageSelected(t.currentDetail.page)}}},[t._v("View in Book")]),t._v(" "),i("a",{staticClass:"detail_close",on:{click:function(e){t.currentDetail=void 0}}},[t._v("Close")]),t._v(" "),i("div",{staticClass:"detail_arrow",attrs:{id:"prevDetail"},on:{click:this.prevDetail}},[t._v("‹")]),t._v(" "),i("div",{staticClass:"detail_arrow",attrs:{id:"nextDetail"},on:{click:this.nextDetail}},[t._v("›")])]):t._e(),t._v(" "),i("section",{directives:[{name:"show",rawName:"v-show",value:t.outlineOpen,expression:"outlineOpen"}],attrs:{id:"outline"}},[i("h2",[t._v("Outline")]),t._v(" "),i("outline",{attrs:{data:t.outline,pdf:t.$refs.pdf,page:t.displayedPage},on:{onClick:this.goto}}),t._v(" "),i("a",{staticClass:"detail_close",on:{click:function(e){t.outlineOpen=!1}}},[t._v("Close")])],1)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("router-view")],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"imageLayer",staticClass:"imageLayer",style:{width:(t.viewport?t.viewport.width:0)+"px",height:(t.viewport?t.viewport.height:0)+"px"}},t._l(t.images,function(e){return i("div",{staticClass:"imageLayerItem",style:{width:e.width+"px",height:e.height+"px",top:e.top-e.height+"px",left:e.left+"px"},on:{click:function(i){t.handleClick(e)}}})}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("svg",{class:t.clazz,style:t.style,attrs:{version:"1.1",role:t.label?"img":"presentation","aria-label":t.label,x:t.x,y:t.y,width:t.width,height:t.height,viewBox:t.box}},[t._t("default",[t.icon&&t.icon.paths?t._l(t.icon.paths,function(e){return i("path",t._b({},"path",e))}):t._e(),t._v(" "),t.icon&&t.icon.polygons?t._l(t.icon.polygons,function(e){return i("polygon",t._b({},"polygon",e))}):t._e(),t._v("\b\n    "),t.icon&&t.icon.raw?[i("g",{domProps:{innerHTML:t._s(t.icon.raw)}})]:t._e()])],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",t._l(t.pageList,function(e){return i("li",[i("a",{staticClass:"outline_link",class:{active:e===t.activeItem},on:{click:function(i){t.handleLink(e)}}},[t._v("\n      "+t._s(e.title||"")+"\n      "),e.items.length?i("outline",{attrs:{data:e.items},on:{onClick:t.handleLink}}):t._e()],1)])}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"container",staticClass:"pageContainer",class:{loading:t.isLoading,centered:!t.spreads||t.zoom<=1},style:{width:t.width+"px",height:(t.height?t.height:t.viewportHeight)+"px"}},[t._l(t.displayedPages,function(e){return i("div",{key:e.pageIndex,staticClass:"page"},[i("page",{ref:"page_"+e.pageIndex,refInFor:!0,attrs:{page:e,width:t.spreads?t.width/2:t.width,height:t.height,scale:t.zoom,onViewport:t.handleViewport,onImageClicked:t.onImageClicked,onSelected:t.onSelected},on:{displayed:t.afterDisplayed}})],1)}),t._v(" "),i("search",{attrs:{pdfDocument:t.pdfDocument,query:t.query},on:{matched:this.onMatched,found:this.onFound}})],2)},staticRenderFns:[]}}],[46]);
//# sourceMappingURL=app.e24ff3bad61014b70f8d.js.map