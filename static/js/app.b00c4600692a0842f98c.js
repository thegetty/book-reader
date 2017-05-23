webpackJsonp([2],[,function(t,e,i){i(92);var n=i(0)(i(37),i(118),null,null);t.exports=n.exports},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,i){"use strict";var n=i(5),a=i(121),r=i(103),s=i.n(r);n.a.use(a.a),e.a=new a.a({routes:[{path:"/",name:"Main",component:s.a},{path:"/book/:book/edition/:edition",name:"Manifest",component:s.a},{path:"/book/:book/edition/:edition/image/:image",name:"ImageLink",component:s.a}]})},function(t,e,i){i(90);var n=i(0)(i(38),i(116),null,null);t.exports=n.exports},,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(5),a=i(34),r=i.n(a),s=i(33);n.a.config.productionTip=!1,new n.a({el:"#app",router:s.a,template:"<App/>",components:{App:r.a}})},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(5),a={};e.default={name:"icon",props:{name:{type:String,validator:function(t){return t?t in a||(n.a.util.warn('Invalid prop: prop "icon" is referring to an unregistered icon "'+t+'".\nPlesase make sure you have imported this icon before using it.',this),!1):null}},scale:[Number,String],spin:Boolean,inverse:Boolean,flip:{validator:function(t){return"horizontal"===t||"vertical"===t}},label:String},data:function(){return{x:!1,y:!1,childrenWidth:0,childrenHeight:0,outerScale:1}},computed:{normalizedScale:function(){var t=this.scale;return t=void 0===t?1:Number(t),isNaN(t)||t<=0?(n.a.util.warn('Invalid prop: prop "scale" should be a number over 0.',this),this.outerScale):t*this.outerScale},clazz:function(){return{"fa-icon":!0,"fa-spin":this.spin,"fa-flip-horizontal":"horizontal"===this.flip,"fa-flip-vertical":"vertical"===this.flip,"fa-inverse":this.inverse}},icon:function(){return this.name?a[this.name]:null},box:function(){return this.icon?"0 0 "+this.icon.width+" "+this.icon.height:"0 0 "+this.width+" "+this.height},ratio:function(){if(!this.icon)return 1;var t=this.icon,e=t.width,i=t.height;return Math.max(e,i)/16},width:function(){return this.childrenWidth||this.icon&&this.icon.width/this.ratio*this.normalizedScale||0},height:function(){return this.childrenHeight||this.icon&&this.icon.height/this.ratio*this.normalizedScale||0},style:function(){return 1!==this.normalizedScale&&{fontSize:this.normalizedScale+"em"}}},mounted:function(){var t=this;if(!this.icon){this.$children.forEach(function(e){e.outerScale=t.normalizedScale});var e=0,i=0;this.$children.forEach(function(t){e=Math.max(e,t.width),i=Math.max(i,t.height)}),this.childrenWidth=e,this.childrenHeight=i,this.$children.forEach(function(t){t.x=(e-t.width)/2,t.y=(i-t.height)/2})}},register:function(t){for(var e in t){var i=t[e];i.paths||(i.paths=[]),i.d&&i.paths.push({d:i.d}),i.polygons||(i.polygons=[]),i.points&&i.polygons.push({points:i.points}),a[e]=i}},icons:a}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app"}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(22),a=i.n(n),r=i(32),s=i.n(r),o=i(5);o.a.use(s.a),e.default={name:"grid",components:{},props:{data:{type:Array}},data:function(){var t={};return this.columns=["thumbnail"],this.columns.forEach(function(e){t[e]=1}),{sortKey:"",sortOrders:t,filterKey:"",gridColumns:[]}},computed:{filteredData:function(){var t=this.sortKey,e=this.filterKey&&this.filterKey.toLowerCase(),i=this.sortOrders[t]||1,n=this.data;return e&&n&&(n=n.filter(function(t){return a()(t).some(function(i){return String(t[i]).toLowerCase().indexOf(e)>-1})})),t&&(n=n.slice().sort(function(e,n){return e=e[t],n=n[t],(e===n?0:e>n?1:-1)*i})),n}},methods:{sortBy:function(t){this.sortKey=t,this.sortOrders[t]=-1*this.sortOrders[t]},triggerLoad:function(){o.a.nextTick(this.$Lazyload.lazyLoadHandler)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"imagelayer",props:{images:{default:[],type:Array},viewport:{default:void 0,type:Object},onImageClicked:{default:void 0,type:Function}},data:function(){return{}},updated:function(){},mounted:function(){this.images},watch:{images:function(){this.images}},methods:{handleClick:function(t){this.onImageClicked&&this.onImageClicked(t),this.$emit("imageClicked",t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(107),a=i.n(n);e.default={name:"main",components:{Reader:a.a},data:function(){return{url:"https://s3.amazonaws.com/pubs-fchasen/books/"+(this.$route.params.book||371)+"/editions/"+(this.$route.params.edition||500)+"/manifest.json"}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(49),a=i.n(n),r=i(48),s=i.n(r);e.default={name:"outline",components:{},props:{data:{type:Array},page:{type:Number,default:void 0},pdf:{type:Object,default:void 0}},data:function(){return{pageList:[],activeItem:void 0}},mounted:function(){},methods:{handleLink:function(t){this.$emit("onClick",t.dest)},checkActive:function(){var t=!0,e=!1,i=void 0;try{for(var n,a=s()(this.pageList);!(t=(n=a.next()).done);t=!0){var r=n.value;if(r.page>this.page)break;this.activeItem=r}}catch(t){e=!0,i=t}finally{try{!t&&a.return&&a.return()}finally{if(e)throw i}}}},watch:{data:function(){var t=this;this.data.forEach(function(e,i){var n=a()({},e);t.pageList.push(n),t.pdf.getPageIndex(e.dest[0]).then(function(e){n.page=e,i===t.data.length-1&&t.checkActive()})})},page:function(){this.checkActive()}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(106),a=i.n(n),r=i(21);r.PDFJS.workerSrc="static/libs/pdfjs-dist/build/pdf.worker.js",e.default={name:"pdf",components:{Page:a.a},props:{src:{type:String},width:{type:Number,default:void 0},height:{type:Number,default:void 0},page:{default:0,type:Number},spreads:{default:!0,type:Boolean},onImageClicked:{default:void 0,type:Function},onOutlineReady:{default:void 0,type:Function}},data:function(){return{pdf:void 0,numPages:0,scale:1,rotate:void 0,isLoading:!0,viewportWidth:0,viewportHeight:0,displayedPage:0,displayedPages:[],displayedPagesNumbers:[],outline:void 0}},updated:function(){},mounted:function(){var t=this;this.src&&this.loadDocument(this.src).then(function(){return t.display(t.page)})},watch:{src:function(){var t=this;this.src&&this.loadDocument(this.src).then(function(){return t.display(t.page)})},page:function(t){void 0!==this.page&&this.display(this.page)},spreads:function(t){void 0!==this.displayedPage&&this.display(this.displayedPage)},displayedPage:function(){this.$emit("pageChanged",this.displayedPagesNumbers)}},methods:{loadDocument:function(t){var e=this;return console.log("src",t),r.getDocument(t).then(function(t){e.pdfDocument=t;var i=t.numPages;e.numPages=i,e.pdf=t,e.isLoading=!1,e.$emit("loaded"),e.outline=t.getOutline().then(function(t){return e.processOutline(t)})})},display:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.page;this.displayedPages=[],this.spreads?(this.displayedPage=t%2==0?t:t-1,this.loadPage(this.displayedPage),this.loadPage(this.displayedPage+1),this.displayedPagesNumbers=[this.displayedPage,this.displayedPage+1]):(this.displayedPage=t,this.loadPage(this.displayedPage),this.displayedPagesNumbers=[this.displayedPage,this.displayedPage+1])},next:function(){this.displayedPage+=this.spreads?2:1,this.displayedPage<this.numPages?this.display(this.displayedPage):this.displayedPage=this.numPages-(this.spreads?2:1)},prev:function(){this.displayedPage>1&&(this.displayedPage-=this.spreads?2:1,this.display(this.displayedPage))},loadPage:function(t){var e=this,i=this.pdf;if(!i)throw new Error("Unexpected call to getPage() before the document has been loaded.");var n=t+1;return!t||n<1?n=1:n>=i.numPages&&(n=i.numPages),i.getPage(n).then(function(t){return e.onPageLoad(t)}).catch(function(t){return e.onPageError(t)})},onPageLoad:function(t){this.displayedPages.push(t)},onPageError:function(t){console.error(t)},handleViewport:function(t){this.viewportWidth=t.width,this.viewportHeight=t.height},processOutline:function(t){return this.onOutlineReady&&this.onOutlineReady(t),t},getPageIndex:function(t){return this.pdfDocument.getPageIndex(t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(109),a=i.n(n),r=i(102),s=i.n(r);i(21).PDFJS.workerSrc="/static/libs/pdfjs-dist/build/pdf.worker.js",e.default={name:"page",components:{textlayer:a.a,imagelayer:s.a},props:{scale:{default:1,type:Number},rotate:{default:void 0,type:Number},width:{type:Number},height:{type:Number},page:{default:void 0,type:Object},onViewport:{default:void 0,type:Function},onImageClicked:{default:void 0,type:Function}},data:function(){return{pdf:void 0,isLoading:!0,viewportWidth:0,viewportHeight:0,viewportScale:1,viewport:void 0,textContent:void 0,images:[]}},updated:function(){},mounted:function(){this.page&&this.displayPage(this.page)},watch:{page:function(){this.page&&this.displayPage(this.page)}},methods:{getPageScale:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.page,e=this.scale,i=this.width,n=this.height,a=1;return a=i<n?i/t.getViewport(e).width:n/t.getViewport(e).height,e*a},displayPage:function(t){var e=this.$refs.canvas,i=e.getContext("2d"),n=this.scale,a=1!==n?n:this.getPageScale(t),r=t.getViewport(a),s=this.images,o=0,c={beginLayout:function(){},endLayout:function(){},appendImage:function(e){e.page=t.pageIndex,e.index=o,s.push(e),o++}};this.viewport=r,this.viewportScale=n,this.viewportHeight=r.height,this.viewportWidth=r.width,this.onViewport&&this.onViewport(r),t.render({canvasContext:i,viewport:r,imageLayer:c})},onPageError:function(t){console.error(t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(105),a=i.n(n),r=i(108),s=i.n(r),o=i(101),c=i.n(o),d=i(104),l=i.n(d),u=i(124),h=(i.n(u),i(97),i(98),i(95),i(96),i(99),i(100),i(1)),p=i.n(h);e.default={name:"reader",components:{PDF:a.a,grid:c.a,tablegrid:s.a,icon:p.a,outline:l.a},props:["manifest-url"],data:function(){var t=this.getBounds();return{manifest:{},images:[],imagesById:{},page:0,displayedPage:0,spreads:!0,showTable:!1,showGrid:!1,currentDetail:void 0,width:t.width,height:t.height,outline:void 0,outlineOpen:!1}},created:function(){this.fetchManifest(),window.addEventListener("keyup",this.keyListener.bind(this),!1)},beforeDestory:function(){window.removeEventListener("keyup",this.keyListener)},watch:{showTable:function(){this.$refs.table.triggerLoad()},showGrid:function(){this.$refs.grid.triggerLoad()}},methods:{fetchManifest:function(){var t=this;return fetch(this.manifestUrl).then(function(t){return t.json()}).then(function(e){console.log(e),t.manifest=e})},loaded:function(){var t=this;this.images=this.manifest.images,this.images.forEach(function(e){t.imagesById["img_p"+(e.page-1)+"_"+e.location]=e})},next:function(){this.$refs.pdf.next()},prev:function(){this.$refs.pdf.prev()},keyListener:function(t){var e=t.keyCode;37===e?this.prev():39===e&&this.next()},goto:function(t){var e=this,i=this.$refs.pdf;return this.outlineOpen=!1,i.getPageIndex(t[0]).then(function(t){e.page=t})},onImageSelected:function(t){this.currentDetail=t},onPageSelected:function(t){this.page=t-1,this.showGrid=!1,this.showTable=!1},onImageClicked:function(t){this.currentDetail=this.imagesById[t.objId]},getBounds:function(){var t=window.innerWidth,e=window.innerHeight;return{width:.8*t,height:.8*e}},setSpreads:function(t){this.spreads!==t&&(this.spreads=t)},onOutlineReady:function(t){this.outline=t},onPageChanged:function(t){this.displayedPage=t[t.length-1]},toggleTable:function(){this.showTable=!this.showTable,this.showGrid=!1},toggleGrid:function(){this.showGrid=!this.showGrid,this.showTable=!1}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(22),a=i.n(n),r=i(32),s=i.n(r),o=i(5);o.a.use(s.a,{preLoad:1.3,attempt:1}),e.default={name:"table",components:{},props:{data:{type:Array}},data:function(){var t={};return this.columns=["thumbnail","page","artwork_title","artist","collection"],this.columns.forEach(function(e){t[e]=1}),{sortKey:"",sortOrders:t,filterKey:"",gridColumns:[]}},computed:{filteredData:function(){var t=this.sortKey,e=this.filterKey&&this.filterKey.toLowerCase(),i=this.sortOrders[t]||1,n=this.data;return e&&n&&(n=n.filter(function(t){return a()(t).some(function(i){return String(t[i]).toLowerCase().indexOf(e)>-1})})),t&&(n=n.slice().sort(function(e,n){return e=e[t],n=n[t],(e===n?0:e>n?1:-1)*i})),n}},filters:{capitalize:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},titlecase:function(t){var e;return e=t.replace(/_/g," "),e=e.replace(/([^\W_]+[^\s-]*) */g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase()})}},methods:{sortBy:function(t){this.sortKey=t,this.sortOrders[t]=-1*this.sortOrders[t]},triggerLoad:function(){o.a.nextTick(this.$Lazyload.lazyLoadHandler)}},updated:function(){}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(21);e.default={name:"textlayer",props:{page:{default:void 0},viewport:{default:void 0},renderTimeout:{default:300,type:Number}},data:function(){return{}},updated:function(){},mounted:function(){var t=this;this.page&&this.getTextContent(this.page).then(function(e){return t.onContent(e)})},watch:{page:function(){var t=this;this.page&&this.getTextContent(this.page).then(function(e){return t.onContent(e)})}},methods:{getTextContent:function(t){return t.getTextContent({normalizeWhitespace:!0})},onContent:function(t){var e=this.$refs.textLayer;this.textDivs=[];var i=document.createDocumentFragment();this.textLayerRenderTask&&(this.textLayerRenderTask.cancel(),this.textLayerRenderTask=null),this.textLayerRenderTask=n.renderTextLayer({textContent:t,container:i,viewport:this.viewport,textDivs:this.textDivs,timeout:this.renderTimeout}),this.textLayerRenderTask.promise.then(function(){e.appendChild(i)})},onPageError:function(t){console.error(t)}}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,,,,,,function(t,e,i){i(84);var n=i(0)(i(39),i(111),"data-v-0da80b7f",null);t.exports=n.exports},function(t,e,i){i(91);var n=i(0)(i(40),i(117),"data-v-633d2fa2",null);t.exports=n.exports},function(t,e,i){i(83);var n=i(0)(i(41),i(110),"data-v-0b9bd71c",null);t.exports=n.exports},function(t,e,i){i(93);var n=i(0)(i(42),i(119),"data-v-7afe1999",null);t.exports=n.exports},function(t,e,i){i(94);var n=i(0)(i(43),i(120),"data-v-84dcc46e",null);t.exports=n.exports},function(t,e,i){i(85);var n=i(0)(i(44),i(112),"data-v-2ded1648",null);t.exports=n.exports},function(t,e,i){i(89);var n=i(0)(i(45),i(115),"data-v-59fa2e3c",null);t.exports=n.exports},function(t,e,i){i(86);var n=i(0)(i(46),i(113),"data-v-31beea36",null);t.exports=n.exports},function(t,e,i){i(88),i(87);var n=i(0)(i(47),i(114),"data-v-448030bb",null);t.exports=n.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("Reader",{attrs:{"manifest-url":t.url}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("ol",t._l(t.filteredData,function(e){return i("li",[i("a",{staticClass:"img_link",on:{click:function(i){t.$emit("onClick",e)}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.thumbnail,expression:"image.thumbnail"}]})])])}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pageWrapper",class:{loading:t.isLoading},style:{width:t.viewportWidth+"px",height:t.viewportHeight+"px"}},[i("canvas",{ref:"canvas",attrs:{width:t.viewportWidth+"px",height:t.viewportHeight+"px"}}),t._v(" "),i("textlayer",{attrs:{page:t.page,viewport:t.viewport}}),t._v(" "),i("imagelayer",{attrs:{images:t.images,viewport:t.viewport,onImageClicked:t.onImageClicked}}),t._v(" "),i("div",{ref:"annotationLayer"})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("form",{attrs:{id:"search"}},[t._v("\n    Search "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.filterKey,expression:"filterKey"}],attrs:{name:"query"},domProps:{value:t.filterKey},on:{input:function(e){e.target.composing||(t.filterKey=e.target.value)}}})]),t._v(" "),i("table",[i("thead",[i("tr",t._l(t.columns,function(e){return i("th",{class:{active:t.sortKey==e},on:{click:function(i){t.sortBy(e)}}},[t._v("\n          "+t._s(t._f("titlecase")(e))+"\n          "),i("span",{staticClass:"arrow",class:t.sortOrders[e]>0?"asc":"dsc"})])}))]),t._v(" "),i("tbody",t._l(t.filteredData,function(e){return i("tr",[i("td",[i("a",{staticClass:"img_link",on:{click:function(i){t.$emit("onImageClick",e)}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.thumbnail,expression:"entry['thumbnail']"}]})])]),t._v(" "),i("td",[i("a",{attrs:{href:"#"},on:{click:function(i){t.$emit("onPageClick",e.page)}}},[t._v("\n            "+t._s(e.page_label||e.page)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.artwork_uri,target:"_blank"}},[t._v("\n            "+t._s(e.artwork_title)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.artist_uri,target:"_blank"}},[t._v("\n            "+t._s(e.artist_name)+"\n          ")])]),t._v(" "),i("td",[i("a",{attrs:{href:e.collection_uri,target:"_blank"}},[t._v("\n            "+t._s(e.collection)+"\n          ")])])])}))])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"textLayer",staticClass:"textLayer",style:{width:(t.viewport?t.viewport.width:0)+"px",height:(t.viewport?t.viewport.height:0)+"px"}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"page-wrap"}},[i("header",{attrs:{id:"menu"}},[i("ul",{attrs:{id:"nav"}},[i("li",{attrs:{id:"toc-nav"}},[i("a",{on:{click:function(e){t.outlineOpen=!t.outlineOpen}}},[i("icon",{attrs:{name:"list-ul",title:"Outline"}})],1)]),t._v(" "),i("li",{attrs:{id:"search-nav"}},[i("a",[i("icon",{attrs:{name:"search",title:"Search"}})],1)]),t._v(" "),i("li",{attrs:{id:"title-nav"}},[t._v(t._s(t.manifest.title)+": "+t._s(t.manifest.subtitle)+", "+t._s(t.manifest.author_as_it_appears))]),t._v(" "),i("li",{attrs:{id:"book-nav"}},[t._v("\n        Book:\n        "),i("a",{attrs:{id:"artwork-nav-single"},on:{click:function(e){t.setSpreads(!1),t.showGrid=!1,t.showTable=!1}}},[i("icon",{staticStyle:{transform:"rotate(180deg) scaleX(-1)",height:".95em"},attrs:{name:"file-o",title:"Single"}})],1),t._v("\n         |\n        "),i("a",{attrs:{id:"artwork-nav-spread"},on:{click:function(e){t.setSpreads(!0),t.showGrid=!1,t.showTable=!1}}},[i("icon",{attrs:{name:"columns",title:"Spread"}})],1)]),t._v(" "),i("li",{attrs:{id:"artwork-nav"}},[t._v("\n        Artwork:\n        "),i("a",{attrs:{id:"artwork-nav-table"},on:{click:t.toggleTable}},[i("icon",{attrs:{name:"table",title:"Table"}})],1),t._v("\n         |\n        "),i("a",{attrs:{id:"artwork-nav-grid"},on:{click:t.toggleGrid}},[i("icon",{attrs:{name:"th",title:"Grid"}})],1)])])]),t._v(" "),i("section",{attrs:{id:"main"}},[i("PDF",{ref:"pdf",attrs:{id:"pdf",src:this.manifest.pdf,page:t.page,width:this.width,height:this.height,spreads:t.spreads,onImageClicked:this.onImageClicked,onOutlineReady:this.onOutlineReady},on:{loaded:t.loaded,pageChanged:this.onPageChanged}}),t._v(" "),i("div",{staticClass:"arrow",attrs:{id:"prev"},on:{click:this.prev}},[t._v("‹")]),t._v(" "),i("div",{staticClass:"arrow",attrs:{id:"next"},on:{click:this.next}},[t._v("›")]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showGrid||t.showTable,expression:"showGrid || showTable"}],attrs:{id:"images"}},[i("grid",{directives:[{name:"show",rawName:"v-show",value:t.showGrid,expression:"showGrid"}],ref:"grid",attrs:{id:"grid",data:t.images},on:{onClick:this.onImageSelected}}),t._v(" "),i("tablegrid",{directives:[{name:"show",rawName:"v-show",value:t.showTable,expression:"showTable"}],ref:"table",attrs:{id:"table",data:t.images},on:{onImageClick:this.onImageSelected,onPageClick:this.onPageSelected}})],1)],1),t._v(" "),t.currentDetail?i("section",{attrs:{id:"detail"}},[i("div",{staticClass:"image_detail"},[i("img",{attrs:{src:t.currentDetail.asset}})]),t._v(" "),t.currentDetail.artwork_title?i("div",{staticClass:"image_info"},[i("h1",[t._v(t._s(t.currentDetail.artwork_title))]),t._v(" "),i("h4",[i("a",{attrs:{href:t.currentDetail.artwork_uri}},[t._v(t._s(t.currentDetail.artwork_uri))])]),t._v(" "),i("h2",[t._v(t._s(t.currentDetail.artist_name))]),t._v(" "),i("h4",[i("a",{attrs:{href:t.currentDetail.artist_uri}},[t._v(t._s(t.currentDetail.artist_uri))])]),t._v(" "),i("h3",[t._v(t._s(t.currentDetail.collection))]),t._v(" "),i("h4",[i("a",{attrs:{href:t.currentDetail.collection_uri}},[t._v(t._s(t.currentDetail.collection_uri))])])]):t._e(),t._v(" "),i("a",{staticClass:"detail_view",on:{click:function(e){t.onPageSelected(t.currentDetail.page),t.currentDetail=void 0}}},[t._v("View in Book")]),t._v(" "),i("a",{staticClass:"detail_close",on:{click:function(e){t.currentDetail=void 0}}},[t._v("Close")])]):t._e(),t._v(" "),i("section",{directives:[{name:"show",rawName:"v-show",value:t.outlineOpen,expression:"outlineOpen"}],attrs:{id:"outline"}},[i("h2",[t._v("Outline")]),t._v(" "),i("outline",{attrs:{data:t.outline,pdf:t.$refs.pdf,page:t.displayedPage},on:{onClick:this.goto}}),t._v(" "),i("a",{staticClass:"detail_close",on:{click:function(e){t.outlineOpen=!1}}},[t._v("Close")])],1)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("router-view")],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"imageLayer",staticClass:"imageLayer",style:{width:(t.viewport?t.viewport.width:0)+"px",height:(t.viewport?t.viewport.height:0)+"px"}},t._l(t.images,function(e){return i("div",{staticClass:"imageLayerItem",style:{width:e.width+"px",height:e.height+"px",top:e.top-e.height+"px",left:e.left+"px"},on:{click:function(i){t.handleClick(e)}}})}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("svg",{class:t.clazz,style:t.style,attrs:{version:"1.1",role:t.label?"img":"presentation","aria-label":t.label,x:t.x,y:t.y,width:t.width,height:t.height,viewBox:t.box}},[t._t("default",[t.icon&&t.icon.paths?t._l(t.icon.paths,function(e){return i("path",t._b({},"path",e))}):t._e(),t._v(" "),t.icon&&t.icon.polygons?t._l(t.icon.polygons,function(e){return i("polygon",t._b({},"polygon",e))}):t._e(),t._v("\b\n    "),t.icon&&t.icon.raw?[i("g",{domProps:{innerHTML:t._s(t.icon.raw)}})]:t._e()])],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",t._l(t.pageList,function(e){return i("li",[i("a",{staticClass:"outline_link",class:{active:e===t.activeItem},on:{click:function(i){t.handleLink(e)}}},[t._v("\n      "+t._s(e.title||"")+"\n      "),e.items.length?i("outline",{attrs:{data:e.items},on:{onClick:t.handleLink}}):t._e()],1)])}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pageContainer",class:{loading:t.isLoading},style:{width:t.width+"px",height:(t.height?t.height:t.viewportHeight)+"px"}},t._l(t.displayedPages,function(e){return i("div",{staticClass:"page"},[i("page",{attrs:{page:e,width:t.spreads?t.width/2:t.width,height:t.height,onViewport:t.handleViewport,onImageClicked:t.onImageClicked}})],1)}))},staticRenderFns:[]}}],[36]);
//# sourceMappingURL=app.b00c4600692a0842f98c.js.map