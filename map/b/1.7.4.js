Jmap=function(a){var b={},c,d={},e={},f={},g=[],h={eventsBind:function(a,b){for(var c=0,d=a.length;c<d;c++){var e=a[c].fn;Jock.event.add(a[c].obj,a[c].type,function(){e.call(b)})}},overlaysType:{overlay:"overlays",marker:"markers",ployline:"ployline"},init:function(a){window.mapData={},window.mapData.base={},window.mapData.entity={},window.mapData.sign={},window.map={},Jock.extend(e,Jock.map.options||{}),Jock.extend(e,a||{}),e.latlng=this.getLatLng(e),e.d&&typeof console!="undefined"&&console.log(e),Jock.extend(d,Jock.map.icOpts||{});if(!e.elm||typeof BMap!="object")return;e.elm=document.getElementById(e.elm),e.elm.style.background="none",this.setWH(),this.createMap();var c=this;b.addEventListener("resize",function(){c.setWH(!0)})},setWH:function(a){var b=e.elm.style;if(a||!b.width)b.width="auto";if(a||!b.height)b.height=Jock.getHeight()-e.top+"px"},getMapWH:function(){return b.getSize()},createMap:function(){b=new BMap.Map(e.elm,{mapType:!e.u3d||e.city==""?BMAP_NORMAL_MAP:BMAP_PERSPECTIVE_MAP,minZoom:e.minz?e.minz:3,maxZoom:e.maxz?e.maxz:18}),!!e.u3d&&e.city!=""&&b.setCurrentCity(e.city),b.centerAndZoom(new BMap.Point(e.lng,e.lat),e.zoom);if(!!e.mark)var a=this.addMarker(e,"center");!e.ezoom||b.enableScrollWheelZoom(),b.enableKeyboard(),b.enableContinuousZoom(),b.enableInertialDragging();var c=new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:e.ctype?BMAP_NAVIGATION_CONTROL_LARGE:BMAP_NAVIGATION_CONTROL_ZOOM});b.addControl(c);if(!!e.scale){var d=new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});b.addControl(d)}},setOverlaysVisible:function(a,b,c){var d=f[a];for(var e in d)this.setOverlayVisible(a,e,b)},setOverlayVisible:function(a,b,c){f[a]&&f[a][b]&&f[a][b].setVisible(c||!1)},getOverlay:function(a,b){return f[a]=f[a]?f[a]:{},f[a][b]},getOverlays:function(a){return f[a]?f[a]:undefined},clearOverlays:function(){b.clearOverlays(),f={}},removeOverlays:function(a){var b=f[a];for(var c in b)this.removeOverlay(a,c)},removeOverlay:function(a,c,d){if(a){if(Object.prototype.toString.call(a)=="[object Object]")return b.removeOverlay(a),d&&d.call(this),!0;f[a]&&f[a][c]&&(b.removeOverlay(f[a][c]),delete f[a][c],d&&d.call(this))}},pushOverlayList:function(a,b,c){f[a]=f[a]?f[a]:{},f[a][b]=c},getLatLng:function(a){var a=a||e;return new BMap.Point(a.lng,a.lat)},getMap:function(){return b||{}},reset:function(){b.reset()},getBounds:function(){return b.getBounds()},getBoundsWE:function(a){var c=this.getBounds(),d=c.getSouthWest(),e=c.getNorthEast();if(a&&typeof a=="number"){var f=b.pointToOverlayPixel(d),g=b.pointToOverlayPixel(e);f.x+=-a,f.y+=a,g.x+=a-30,g.y+=-(a-20),d=b.overlayPixelToPoint(new BMap.Pixel(f.x,f.y)),e=b.overlayPixelToPoint(new BMap.Pixel(g.x,g.y))}return{swlat:d.lat,nelat:e.lat,swlng:d.lng,nelng:e.lng}},inBounds:function(a){var b=this.getBounds();return typeof b=="object"?b.containsPoint(a):!0},pointToPixel:function(a){return b.pointToPixel(a)},addMarker:function(a,c,e){a.latlng=a.latlng?a.latlng:this.getLatLng(a);var f=e||this.buildOverlayKey(a.latlng),g=c||this.overlaysType.overlay;if(this.getOverlay(g,f))return;var h=new BMap.Marker(a.latlng,{icon:this.getMarkerImage(Jock.extend(d,a,!0))});a.title&&h.setTitle(a.title);if(a.showInfo){var i=this;Jock.event.add(h,"click",function(){i.openMarkerWindow(a)})}return b.addOverlay(h),this.pushOverlayList(g,f,h),h},getMarkerImage:function(a){return new BMap.Icon(a.icon,new BMap.Size(a.size.w,a.size.h),{anchor:new BMap.Size(a.offset.x,a.offset.y),imageOffset:new BMap.Size(a.imgOffset.x,a.imgOffset.y)})},openWindow:function(a){var c={};typeof a.offset!="undefined"&&(c.pixelOffset=new BMap.Size(a.offset.x,a.offset.y));var d=new BMap.InfoWindow(a.popInfo,c);b.openInfoWindow(d,a.latlng)},openMarkerWindow:function(a){this.openWindow(a)},openOverlayWindow:function(a,b){this.openWindow(a)},clone:function(a){if(null==a||"object"!=typeof a)return a;var b=a.constructor();for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b},addOverlay:function(a,c,d){function k(a){this.p=a}var e=h.clone(a);e.latlng=e.latlng?e.latlng:h.getLatLng(e);var f=d||h.buildOverlayKey(e.latlng),g=c||h.overlaysType.overlay,i=h.getOverlay(g,f),j;if(i)return i;k.prototype=new BMap.Overlay,k.prototype.initialize=function(a){this._map=a,this._locked=!1,this._CName=this.p.className?this.p.className:"",this._CHover=this.p.classHover?this.p.classHover:"",this._barOffsetX=this.p.barOffset&&this.p.barOffset.x?this.p.barOffset.x:0,this._barOffsetY=this.p.barOffset&&this.p.barOffset.y?this.p.barOffset.y:0,j=this;var b=document.createElement("DIV");return b.style.position="absolute",b.style.cursor="pointer",b.style.zIndex=0,this._CName&&(b.className=j._CName),b.innerHTML=this.p.barInfo,b.title=this.p.title?this.p.title:"",this.p.showInfo&&Jock.event.add(b,"click",function(){h.openOverlayWindow(j.p,j)}),Jock.event.add(b,"mouseover",function(){j.setOver()}),Jock.event.add(b,"mouseout",function(){j.setOut()}),a.getPanes().labelPane.appendChild(b),this._div=b,b},k.prototype.setOver=function(){this._locked||(this._div.style.zIndex=1,this._CName&&this._CHover&&(this._div.className=this._CName+" "+this._CHover))},k.prototype.setOut=function(){this._locked||(this._div.style.zIndex=0,this._CName&&(this._div.className=this._CName))},k.prototype.setLock=function(a){a?this._locked=!0:this._locked=!1},k.prototype.draw=function(){var a=this._map,b=a.pointToOverlayPixel(this.p.latlng);this._div.style.left=b.x+this._barOffsetX+"px",this._div.style.top=b.y+this._barOffsetY+"px"},k.prototype.setVisible=function(a){this._div&&(this._div.style.visibility=a?"visible":"hidden")};var l=new k(e);return b.addOverlay(l),h.pushOverlayList(g,f,l),l},addPloyline:function(a,c,d,e){var f=e||this.buildOverlayKey(c.latlng),g=d||this.overlaysType.ployline;if(this.getOverlay(this.overlaysType.ployline,f))return;var h=Jock.extend({strokeColor:"#0030ff",strokeOpacity:.6,strokeWeight:6,enableMassClear:!0},c||{}),i=new BMap.Polyline(a,h);b.addOverlay(i),this.pushOverlayList(g,f,i)},buildOverlayKey:function(a){return a.lat+"_"+a.lng},getGeocoder:function(a,b,c){var d=new BMap.Geocoder;d.getPoint(a,b,c)},sw3d:function(){var b={};this.extend(b,opts||{}),this.extend(b,a||{}),this.extend(b,{u3d:1,zoom:17}||{}),this.init(b)},sw2d:function(){var b={};this.extend(b,opts||{}),this.extend(b,a||{}),this.extend(b,{u3d:0}||{}),this.init(b)},localSearch:function(a,c,d,e){var f=new BMap.LocalSearch(b);f.setPageCapacity(10),f.enableAutoViewport(),f.setSearchCompleteCallback(function(a){var b=[];if(f.getStatus()==BMAP_STATUS_SUCCESS){var g=a.getCurrentNumPois();while(g--){var h=a.getPoi(g),i={};i.title=h.title,i.point=h.point,i.address=h.address,b.push(i)}}c&&d&&(d.call(c,b,e),f=null)}),f.search(a)},geolocation:function(a,b){var c=new BMap.Geolocation;c.getCurrentPosition(function(c){a&&b&&c&&b.call(a,c.point)})}};return h.init(a),Jock.extend(h,function(){function d(a,b){Jock.extend(a,a||{}),Jock.extend(a,{routeType:b})}function e(a){return document.createElement(a)}function f(a){var c=new BMap.LocalSearch(b,{onSearchComplete:function(b){function j(b,c){return function(){a.startTitle=c,a.start=b,a.isReSearch=!0,k(a)}}a.container.innerHTML="";var c=[],d=b.getCurrentNumPois(),f;if(d<=0)return a.container.innerHTML=l(a),!1;var g=e("div"),h=e("b"),i;g.style.cssText="clear:both; height:244px; overflow-x:hidden; overflow-y:auto; padding:8px 0 0 8px; line-height:26px;",h.style.cssText="font-size:13px; color:#666;",h.innerHTML="请确认起点",g.appendChild(h);for(var m=0;m<d;m++)f=b.getPoi(m),i=e("li"),i.style.cssText="padding:0 0 0 14px; margin-bottom:10px; float:left; background:url("+a.background+") 0 -305px no-repeat; width:195px; line-height:26px;",f.address=f.address?f.address:"",i.innerHTML='<span style="display:block;line-height:17px; cursor: pointer;"><a href="javascript:void(0)">'+f.title+"</a> "+f.address+"</span>",i.onclick=j(f.point,f.title),g.appendChild(i);a.container.appendChild(g)}});c.search(a.start)}function g(a){var b=a.getNumLines(),c=[];for(var d=0;d<b;d++){var e=a.getLine(d).title.replace(/\(.*\)/,"");c.push(e.match(/^\d+$/)?e+"路":e)}return c}function i(a,b,c,d){var e=b.getPlan(c),f=e.getRoute(0),h="",i=a.startTitle||b.getStart().title,k=a.endTitle||b.getEnd().title,l=[];len=0;var m=['<div id="sec_result" style="clear:both; height:244px; overflow-x:hidden; overflow-y:auto; padding:8px 0 5px 6px; height:239px; *height:239px; font-size:12px;">'];m.push('<span style="margin:0 0 0 2px; display:block; color:#999; line-height:18px; font-size:12px;">');if(a.routeType=="driving")m.push('<b style="color:#666; font-size:13px;">全程</b>');else{h=g(e);for(var n=0;n<h.length;n++)l.push('<b style="color:#666; font-size:13px;">'+h[n]+"</b>");m.push(l.join('<b style="font-size:13px;">→</b>'))}m.push("    <br/>约"+e.getDuration()+" / "+e.getDistance()),m.push("</span>"),m.push('<span style="display:block; padding:2px 0 0 25px; height:24px; background:url('+a.background+') 0 -49px no-repeat; margin:10px 0 0; white-space:nowap; overflow:hidden;">'),m.push('    <span style="display:block; float:left; background:url('+a.background+') right 0 no-repeat; margin-left:2px; height:18px;">'),m.push('        <strong style="display:block; margin:0 8px 0 0; padding:0 0 0 8px; line-height:19px; background:url('+a.background+') 0 0 no-repeat; color:#fff;">'+i+"</strong>"),m.push("    </span>"),m.push("</span>"),m.push('<ul style="width:207px; border-top:1px solid #ddd;">');if(a.routeType=="driving"){len=f.getNumSteps();for(var n=0;n<len;n++)m.push(j(a,3,f.getStep(n).getDescription().replace(/<b>/gi,'<b style="color:#f60; font-weight: normal">'),n+1))}else{len=e.getNumRoutes();for(var o=0;o<len;o++){var f=e.getRoute(o),p=e.getLine(o);f.getDistance(!1)>0&&(o==len-1?m.push(j(a,2,'步行至<span style="color:#f60;">'+k+"</span>")):m.push(j(a,2,'步行至<span style="color:#f60;">'+p.getGetOnStop().title+"站</span>"))),o<len-1&&m.push(j(a,p.type,'乘坐<span style="color:#f60;">'+h[o]+"("+p.title.match(/-(.*[^)])[^\s]/)[1]+'方向)</span>在<span style="color:#f60;">'+p.getGetOffStop().title+"站</span>下车",a.background))}}return m.push("</ul>"),m.push('<span style="display:block; padding:2px 0 0 25px; height:24px; background:url('+a.background+') 0 -80px no-repeat; margin:5px 0 0; clear:both;">'),m.push('    <span style="display:block; float:left; background:url('+a.background+') right 0 no-repeat; margin-left:2px; height:18px;">'),m.push('        <strong style="display:block; margin:0 8px 0 0; padding:0 0 0 8px; line-height:19px; background:url('+a.background+') 0 0 no-repeat; color:#fff;">'+k+"</strong>"),m.push("    </span>"),m.push("</span>"),m.push("</div>"),m.join("")}function j(a,b,c,d){var e="",f=0;return b==0?f="-6px":b==1?f="-68px":b==2&&(f="-38px"),e='<li style="padding:5px 0; _padding:4px 0 0; width:207px; line-height:20px; border-bottom:1px solid #ddd;">',b==3?e+='  <i style="float:left;width:25px;height:18px;text-align:center;font-style: normal">'+d+".</i>":e+='  <i style="float:left; width:25px; height:18px; background:url('+a.background+") "+f+' -23px no-repeat;"></i>',e+='  <span style="float:left; width:180px;">'+c+"</span>",e+='  <div style="clear:both; margin:0; padding:0; height:0; line-height:0;"></div>',e+="</li>",e}function k(a){var b=null;return a.routeType=="transit"?(b=new BMap.TransitRoute(a.city),b.setPageCapacity(1)):b=new BMap.DrivingRoute(a.city),b.setSearchCompleteCallback(function(c){var d=b.getStatus(),e=0;if(d==BMAP_STATUS_SUCCESS)a.container.innerHTML=i(a,c,e),o(a,c,e);else if(d==BMAP_STATUS_UNKNOWN_ROUTE){if(a.isReSearch)return a.container.innerHTML=l(a),!1;f(a)}}),b.enableAutoViewport(),b.search(a.start,a.end),b}function l(a){return'<div style="clear:both; height:244px; overflow-x:hidden; overflow-y:auto; padding:8px 0 0 8px; line-height:26px;"><b style="font-size:13px; color:#666;">在 '+a.city+" 未找到相关地点，您可更换关键词再尝试。</b></div>"}function m(a){return d(a,"transit"),k(a)}function n(a){return d(a,"driving"),k(a)}function o(a,c,d){function i(a){for(var b=0;b<a.length;b++)e.push(a[b])}function j(a,b,c){Jock.extend(g,Jock.extend({latlng:a,title:b},c||{})),h.addMarker(g,"route")}h.removeOverlays("route");var e=[],f=c.getPlan(d),g={icon:a.background,showInfo:!1,size:{w:21,h:21},offset:{x:0,y:0},imgOffset:{x:0,y:0}};if(a.routeType=="transit")for(m=0;m<f.getNumLines();m++){var k=f.getLine(m);i(k.getPath()),k.type==BMAP_LINE_TYPE_BUS?(j(k.getGetOnStop().point,k.getGetOnStop().title,{size:{w:21,h:21},offset:{x:11,y:21},imgOffset:{x:0,y:-196}}),j(k.getGetOffStop().point,k.getGetOffStop().title,{size:{w:21,h:21},offset:{x:11,y:21},imgOffset:{x:0,y:-196}})):k.type==BMAP_LINE_TYPE_SUBWAY&&(j(k.getGetOnStop().point,k.getGetOnStop().title,{size:{w:21,h:21},offset:{x:11,y:21},imgOffset:{x:0,y:-227}}),j(k.getGetOffStop().point,k.getGetOffStop().title,{size:{w:21,h:21},offset:{x:11,y:21},imgOffset:{x:0,y:-227}})),h.addPloyline(k.getPath(),"","route","line"+m)}var l={strokeOpacity:.75,strokeWeight:4,enableMassClear:!0};a.routeType=="transit"?(l.strokeStyle="dashed",l.strokeColor="#30a208"):(l.strokeStyle="solid",l.strokeColor="#f0f");for(var m=0;m<f.getNumRoutes();m++){var n=f.getRoute(m);i(n.getPath()),n.getDistance(!1)>0&&h.addPloyline(n.getPath(),l,"route","route"+m)}j(c.getEnd().point,c.getEnd().title,{size:{w:40,h:32},offset:{x:20,y:16},imgOffset:{x:0,y:-154}}),j(c.getStart().point,a.startTitle||c.getStart().title,{size:{w:40,h:32},offset:{x:15,y:16},imgOffset:{x:0,y:-111}}),b.setViewport(e)}var a={container:"",city:"",background:"",start:"",end:"",startTitle:"",endTitle:"",routeType:"transit",isReSearch:!1},c=0;return{TransitRoute:m,DrivingRoute:n}}()),h};