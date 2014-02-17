/*opts
 * Jock
 * * Base api
 */
(function(win){
    J.map = {};
    var BmapVersion = 2.0;
    J.map.Bload = function(callback){

        J.load('http://api.map.baidu.com/getscript?v='+BmapVersion+'&ak=63c4ca91e854d14a9cbdd8f7cf663071','js',callback);
    }
})(J);
/**
 * Aifang Javascript Framework.
 * Copyright 2012 ANJUKE Inc. All rights reserved.
 *
 * @path: page/page.js
 * @author: Jock
 * @version: 1.0.0
 * @date: 2012/08/28
 *
 */
(function () {

    var W = window, D = document, DE = D.documentElement;

    function B(){
        return D.body
    }

    function C(){
        return D.compatMode == 'BackCompat' ? B() : DE
    }

    J.add('page', {
        /**
         * 获取页面高度
         * @name J.page.getHeight
         * @function
         * @grammar J.page.getHeight()
         * @see J.page.getWidth
         *
         * @returns {number} 页面高度
         */
        height:function () {
            return Math.max(DE.scrollHeight, B().scrollHeight, C().clientHeight);
        },

        /**
         * 获取页面宽度
         * @name J.page.getWidth
         * @function
         * @grammar J.page.getWidth()
         * @see J.page.getHeight
         *
         * @returns {number} 页面宽度
         */
        width:function () {
            return Math.max(DE.scrollWidth, B().scrollWidth, C().clientWidth);
        },
        /**
         * 获取横向滚动量
         *
         * @return {number} 横向滚动量
         */
        scrollLeft:function () {
            return W.pageXOffset || DE.scrollLeft || B().scrollLeft;
        },
        /**
         * 获取纵向滚动量
         *
         * @returns {number} 纵向滚动量
         */
        scrollTop:function () {
            return W.pageYOffset || DE.scrollTop || B().scrollTop;
        },

        /**
         * 获取页面视觉区域高度
         * @name J.page.viewHeight
         * @function
         * @grammar J.page.viewHeight()
         *
         * @returns {number} 页面视觉区域高度
         */
        viewHeight:function () {
            return C().clientHeight;
        },

        /**
         * 获取页面视觉区域宽度
         * @name J.page.viewWidth
         * @function
         * @grammar J.page.viewWidth()
         *
         * @returns {number} 页面视觉区域宽度
         */
        viewWidth:function () {
            return C().clientWidth;
        }
    });
})();

/// require('map.Bload');
/// require('page.page');


(function(J){
    function Bmap(opption){
        var baseDomain = "http://pages.lunjiang.dev.aifcdn.com/";
        var defOpts ={
            id:'',
            lng:0,
            lat:0,
            latlng:0,
            zoom:15,
            mark:0,
            u3d:0,
            city:'',
            ctype:1,
            cdn:baseDomain+'img/',
            ezoom:0,
            top:0,
            d:true,//debug
            minz:0,
            maxz:0,
            scale:0,
            onMoveStart:null,
            onMoveEnd:null,
            onZoomStart:null,
            onZoomEnd:null,
            target:document,//自定主事件触对的对象
            callback:null
        },elm,isLoaded;

        var io = {
                title: '',
                popInfo: '',
                barInfo: '',
                icon: 'http://pages.lunjiang.dev.aifcdn.com/img/jmap/1/mapMarker-Default.png',
                size: {
                    w: 35,
                    h: 34
                },
                offset: {
                    x: 9,
                    y: 34
                },
                imgOffset: {x: 0, y: 0}, lat: 0, lng: 0,
                latlng: {}
            },opts = {},
            OVERLAYS = {},
            map,
            skipOvList = [];

        function init(){
            opts = J.mix( defOpts,opption || {});
            opts.latlng = getLatLng(opts);
            if (!opts.id || typeof BMap!=='object') return;
            var elem = J.g(opts.id);
            if(!elem){
                alert('文档中未找到id：'+opts.id+'对像');
                return false;
            }
            opts.elm=elem;
            //opts.elm.setStyle({background:'none'});
            createMap();
        }
        J.map.Bload(init);//加载完百度地图后自动实例化地图对像

        function createMap(){
            map = new BMap.Map(opts.id, {
                mapType: !!opts.u3d && opts.city != '' ? BMAP_PERSPECTIVE_MAP : BMAP_NORMAL_MAP,
                minZoom: opts.minz ? opts.minz : 3,
                maxZoom: opts.maxz ? opts.maxz : 18
            });
            if (!!opts.u3d && opts.city != '')
                map.setCurrentCity(opts.city);
            map.centerAndZoom(new BMap.Point(opts.lng, opts.lat), opts.zoom);

            if (!!opts.mark){
                var marker = addMarker(opts,'center');
            }
            if (!!opts.ezoom)
                map.enableScrollWheelZoom();  // 开启鼠标滚轮缩放
            map.enableKeyboard();         // 开启键盘控制
            map.enableContinuousZoom();   // 开启连续缩放效果
            map.enableInertialDragging(); // 开启惯性拖拽效果

            var ctrl_nav = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: !!opts.ctype ? BMAP_NAVIGATION_CONTROL_LARGE : BMAP_NAVIGATION_CONTROL_ZOOM
            });
            map.addControl(ctrl_nav);
            if(!!opts.scale){
                var ctrl_scale = new BMap.ScaleControl({
                    anchor: BMAP_ANCHOR_BOTTOM_LEFT
                });
                map.addControl(ctrl_scale);
            }
            opts.callback&&opts.callback();
        }
        function setOverlaysVisible(t, visible, skip){
            var ovs = OVERLAYS[t];
            for(var ov in ovs){
                setOverlayVisible(t, ov, visible)
            }
        }
        function setOverlayVisible(t, key, visible){
            if(OVERLAYS[t] && OVERLAYS[t][key]) OVERLAYS[t][key].setVisible(visible||false);
        }
        function getOverlay(t, key){
            OVERLAYS[t] = OVERLAYS[t] ? OVERLAYS[t] : {};
            return OVERLAYS[t][key]
        }
        function getOverlays(t){
            return OVERLAYS[t] ? OVERLAYS[t] : undefined
        }
        function clearOverlays(){
            map.clearOverlays();
            OVERLAYS = {};
        }
        function pushOverlayList(t,k,o) {
            OVERLAYS[t] = OVERLAYS[t] ? OVERLAYS[t] : {}
            OVERLAYS[t][k] = o;
        }
        function getLatLng (p) {
            var p = p || opts;
            return new BMap.Point(p.lng, p.lat);
        }
        function getMap(){
            return map || {};
        }
        function reset(){
            map.reset()
        }
        function getBounds(){
            return map.getBounds();
        }
        function getBoundsWE(zoom){
            var b=getBounds(),w=b.getSouthWest(),e=b.getNorthEast();
            if(zoom && typeof zoom == 'number'){
                var _w = map.pointToOverlayPixel(w),_e = map.pointToOverlayPixel(e);
                _w.x+=-zoom; // w.lng 横向
                _w.y+=zoom; // w.lat 纵向
                _e.x+=zoom-30;
                _e.y+=-(zoom-20);
                w=map.overlayPixelToPoint(new BMap.Pixel(_w.x,_w.y));
                e=map.overlayPixelToPoint(new BMap.Pixel(_e.x,_e.y));
            }
            return {
                swlat:w.lat,
                nelat:e.lat,
                swlng:w.lng,
                nelng:e.lng
            }
        }
        function inBounds(latlng) {
            var b = getBounds();
            if(typeof b === 'object'){
                return b.containsPoint(latlng);
            }
            return true;
        }
        function pointToPixel(latlng){
            return map.pointToPixel(latlng);
        }
        function addMarker (p, overlayType, key) {
            p.latlng = p.latlng ? p.latlng : getLatLng(p);
            var _key = key || buildOverlayKey(p.latlng), _type = overlayType || overlaysType.overlay;
            if (getOverlay(_type, _key)) return;
            var marker = new BMap.Marker(p.latlng, {
                icon: getMarkerImage(J.mix(io, p, true))
            });
            if (p.title) {
                marker.setTitle(p.title)
            }
            if (p.showInfo) {
                var s = this;
                marker.addEventListener('click',function(){
                    s.openMarkerWindow(p);
                })
            }
            map.addOverlay(marker);
            pushOverlayList(_type, _key, marker);
            return marker;
        }
        function getMarkerImage(p){
            return new BMap.Icon(p.icon, new BMap.Size(p.size.w, p.size.h), {
                anchor: new BMap.Size(p.offset.x, p.offset.y),
                imageOffset: new BMap.Size(p.imgOffset.x, p.imgOffset.y)
            });
        }
        function openWindow(p){
            var opts={}
            if(typeof p.offset != 'undefined'){
                opts['pixelOffset'] = new BMap.Size(p.offset.x,p.offset.y)
            }
            var infoWindow = new BMap.InfoWindow(p.popInfo, opts);
            map.openInfoWindow(infoWindow, p.latlng);
        }
        function openMarkerWindow(p){
            openWindow(p)
        }
        function openOverlayWindow(p, openerOverlay){
            openWindow(p)
        }

        function clone (obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
        function userOverlay(){


        }
        function addOverlay(param, overlayType, key) {
            var p = fn.clone(param);
            p.latlng = p.latlng ? p.latlng : getLatLng(p);
            var _key = key||buildOverlayKey(p.latlng),
                _type = overlayType,
                oldOverlay = getOverlay(_type,_key),
                me;
            if(oldOverlay) return oldOverlay;

            function userOverlay(p){
                this.p = p;
            }
            userOverlay.prototype = new BMap.Overlay();
            userOverlay.prototype.initialize = function(map){
                this._map = map;
                this._locked = false;
                this._CName = !!this.p.className ? this.p.className : '';
                this._CHover = !!this.p.classHover ? this.p.classHover : '';
                this._barOffsetX = this.p.x || 0;
                this._barOffsetY = this.p.y || 0;
                me = this;
                var div = document.createElement("DIV");
                div.style.position = "absolute";
                div.style.cursor = "pointer";
                div.style.zIndex = 0;

                if(this._CName){
                    div.className = me._CName;
                }
                div.innerHTML = this.p.html;
                div.title = !!this.p.title ? this.p.title : '';

                if(this.p.showInfo){
                    J.on(div,'click',function(){
                        fn.openOverlayWindow(me.p, me)
                    });
                }
                J.on(div,"mouseover", function(){
                    me.setOver();
                });
                J.on(div,"mouseout", function(){
                    me.setOut();
                });
                map.getPanes().labelPane.appendChild(div);
                this._div = div;
                return div
            }
            userOverlay.prototype.setOver = function(){
                if(!this._locked){
                    this._div.style.zIndex = 1;
                    if(this._CName && this._CHover){
                        this._div.className = this._CName+' '+this._CHover;
                    }
                }
            }
            userOverlay.prototype.setOut = function(){
                if(!this._locked){
                    this._div.style.zIndex = 0;
                    if(this._CName){
                        this._div.className = this._CName;
                    }
                }
            }
            userOverlay.prototype.setLock = function(isLocked){
                if(isLocked) this._locked = true;
                else this._locked = false;
            }
            userOverlay.prototype.draw = function(){
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this.p.latlng);
                this._div.style.left = pixel.x + this._barOffsetX + "px";
                this._div.style.top  = pixel.y + this._barOffsetY + "px";
            }
            userOverlay.prototype.setVisible = function(b){
                if (this._div) {
                    this._div.style.visibility = (b) ? "visible" : "hidden";
                }
            }
            userOverlay.prototype.removeOverlay=function(){
                J.un(this._div);
                map.removeOverlay(this)
            }
            var uO = new userOverlay(p);
            uO.key = _key;
            map.addOverlay(uO);
            fn.pushOverlayList(_type,_key,uO);
            return uO;
        }
        function addPloyline(path, PloylineOptions, overlayType, key){
            var _key = key||buildOverlayKey(PloylineOptions.latlng), _type = overlayType || this.overlaysType.ployline;
            if(getOverlay(overlaysType.ployline,_key)) return;
            var _PloylineOptions = Jock.extend({
                strokeColor : "#0030ff",
                strokeOpacity : 0.60,
                strokeWeight : 6,
                enableMassClear : true
            }, PloylineOptions || {});
            var _polyline = new BMap.Polyline(path, _PloylineOptions)
            map.addOverlay(_polyline);
            pushOverlayList(_type,_key,_polyline);
        }
        function buildOverlayKey(latlng){
            return latlng.lat+'_'+latlng.lng;
        }
        function getGeocoder(address,callback,city){
            var geo = new BMap.Geocoder();
            geo.getPoint(address,callback,city);
        }

        function localSearch(keyword, obj, callback, args){
            var A = new BMap.LocalSearch(map);
            A.setPageCapacity(10);
            A.enableAutoViewport();
            //A.setLocation('北京市');
            A.setSearchCompleteCallback( function(D) {
                var s = [];
                if (A.getStatus() == BMAP_STATUS_SUCCESS) {
                    var l = D.getCurrentNumPois();
                    while (l--) {
                        var rs = D.getPoi(l);
                        var r = {};
                        r['title'] = rs.title;
                        r['point'] = rs.point;
                        r['address'] = rs.address;
                        s.push(r)
                    }
                }
                if (obj && callback){
                    callback.call(obj, s, args);
                    A = null;
                }
            });
            A.search(keyword)
        }
        function localSearchNearby(keyword, callback, capacity, radius){
            if(!keyword) return;
            var A = new BMap.LocalSearch(map);
            radius = radius || 1000;
            A.setPageCapacity(capacity || 50);
            A.enableAutoViewport();
            A.setSearchCompleteCallback( function(D) {
                var s = [];
                if (A.getStatus() == BMAP_STATUS_SUCCESS) {
                    var l = D.getCurrentNumPois();
                    for(var i=0;i<l;i++){
                        s.push( D.getPoi(i) );
                    }
                }
                callback && callback.call(null, s),A=null;
            });
            A.searchNearby(keyword, map.getCenter(), radius)
        }
        function setCenter(lng,lat,zoom){
            map.centerAndZoom(new BMap.Point(lng, lat),zoom);
            map.setCenter(new BMap.Point(lng, lat));
        }
        function geolocation(obj, callback){
            var gl = new BMap.Geolocation();
            gl.getCurrentPosition(function(result){
                if (obj && callback && result)
                    callback.call(obj, result.point)
            });
        }

        return {
            addOverlay:addOverlay,
            geolocation:geolocation,
            setCenter:setCenter,
            getGeocoder:getGeocoder,
            addMarker:addMarker,
            getOverlays:getOverlays,
            getMap:getMap

        }


    }

    J.map.bmap = Bmap;

})(J);















/// require('map.Bmap');

(function(J){
    function core(opption){
        var defOpts={
            url:'',
            id: "",
            lat: "31.230246775887",
            lng: "121.48246298372",
            mark: 0,
            zoom: 12,
            ezoom: 1,
            minz: 11,
            maxz: 18,
            cacheKey:['id','zoom'],//创建缓存的ｋｅｙ值
            onBeforeRequest:null,//取数据之前的操作　
            callback:null,
            target:document//自定义事件触发的对象
        }, BMap, opts, MSG, context, dataCenter, map, isLoaded = false,stack;

        (function() {
            opts = J.mix(defOpts, opption);
            stack = new Stack({
                duplicate:true
            });
            stack.push(eventBind);
            opts.callback = stack.run;
            context = new J.map.bmap(opts);
            dataCenter = DataCenter(opts);
        })();



        function Stack(opption) {
            var stack = [];
            var defOpts = {
                duplicate: true,//加入项是否允许重复
                callback: function () {
                }
            }
            function push(task) {
              stack.push(task);
            }

            function unShift(task) {
                stack.unshift(task);
            }
            function run(data) {
                stack.length && (stack.shift()(data) !== false) && run();
            }

            return {
                run: run,
                push: push,
                unShift: unShift,
                stack: stack
            }
        }



        function eventBind(){
            isLoaded = true;
            map = context.getMap();
            MSG = new MessageCenter(opts);
            dataCenter = new DataCenter(opts);
            map = context.getMap();
            dataCenter.getData();
          //  var event = ['click','dbclick','rightclick','rightdblclick','maptypechange','maptypechange'];
            map.addEventListener('click',function(){
                //map click
            });
            map.addEventListener('dbclick',function(){
                //map click
            });
            map.addEventListener('rightclick', function () {
                //map click
            });
            map.addEventListener('rightdblclick', function () {
                //map click
            });
            map.addEventListener('maptypechange', function () {
                //map click
            });
            map.addEventListener('mousemove', function () {
                //map click
            });
            map.addEventListener('mouseover', function () {
                //map click
            });
            map.addEventListener('mouseout', function () {
                //map click
            });
            map.addEventListener('movestart', function () {
                //map click
            });
            map.addEventListener('moveend', function () {
                dataCenter.getData();
            });
            map.addEventListener('zoomstart', function () {
                //map click
            });
            map.addEventListener('zoomend', function () {
                dataCenter.getData();

                //map click
            });
            map.addEventListener('touchstart', function () {
                //map click
            });
            map.addEventListener('touchmove', function () {
                //map click
            });
            map.addEventListener('touchend', function () {
                dataCenter.getData();
            });
            map.addEventListener('longpress', function () {
                //map click
            });


        }




        /**
         * 数据中心
         * @constructor
         */
        function DataCenter(opption){
            var defOpts = {
                    url:'',
                    type:'json',
                    onBeforeRequest:null//发送请求之前接收用户传递的参数

                },
                CACHE = [],
                opts,
                callback = {},
                guid= 0,
                key,
                isLocked;

            opts = J.mix(defOpts,opption);

            /**
             * 得到地图可视化区域坐标
             * @param zoom
             */
            function getBoundsWE(zoom){
                var b=map.getBounds(),w=b.getSouthWest(),e=b.getNorthEast();
                if(zoom && typeof zoom == 'number'){
                    var _w = map.pointToOverlayPixel(w),_e = map.pointToOverlayPixel(e);
                    _w.x+=-zoom; // w.lng 横向
                    _w.y+=zoom; // w.lat 纵向
                    _e.x+=zoom-30;
                    _e.y+=-(zoom-20);
                    w=map.overlayPixelToPoint(new BMap.Pixel(_w.x,_w.y));
                    e=map.overlayPixelToPoint(new BMap.Pixel(_e.x,_e.y));
                }
                return {
                    swlat:w.lat,
                    nelat:e.lat,
                    swlng:w.lng,
                    nelng:e.lng
                }
            }

            /**
             * 发送ajax请求数据
             */
            function getData(){
                if(!isLoaded || isLocked){
                    stack.push(getData);
                    return false;
                }
                var ajaxSetting={
                    type:opts.type,
                    onSuccess: null
                },params = beforeRequest(),data;
                if(!params){
                    return false;
                }
                data = CACHE[ key = getCacheKey(params)];
                if(data){
                    onResult(data);
                    return true;
                }
                callback[guid]&&(callback[guid]=J.map.bmap['callback'+guid]=function(){});
                guid++;
                ajaxSetting.callback =ajaxSetting.onSuccess = callback[guid]=J.map.bmap['callback'+guid] = onResult;
                ajaxSetting.data = params;
                console.log(ajaxSetting)
                J.get(ajaxSetting);
            }

            /**
             * 发送ajax请求之前所需要的参数
             * @returns {ajaxsetting} or {ajaxsetting.data}
             */
            function beforeRequest(){
                var params = getBoundsWE(),clientData;
                params.zoom =map.getZoom();
                clientData =  opts.onBeforeRequest&&opts.onBeforeRequest(params,map);
                return clientData ?  J.mix(params,clientData):false;
            }

            /**
             * ajax数据回来　，创建Ｏverlay 并发现消息
             * @param data
             */
            function onResult(data){
                if(data&&!CACHE[key])CACHE[key] = data;
                data&&(CACHE[key]= data);
                MSG.ajaxChange(data);//通过消息中心发送消息
            }

            /**
             * get the cache key
             * @returns {string}
             */
            function getCacheKey (params){
         /*       var str = opts.getCacheKey&&getCacheKey(params);
                if(str=str.replace(/\s+/g,'')){
                    return str;
                }*/
                var i,key='',searchRet=[],totalRet =[];
                for(i in params){
                    opts.cacheKey.indexOf(i) >-1 ? searchRet.push( params[i]+'_') :totalRet.push(params[i]+'_');
                }
                return searchRet.length === opts.cacheKey.length ? searchRet.join('') :totalRet.join('') ;
            }

            /**
             *
             * @param ret
             */
            function setLocked(ret){
               isLocked = !!ret;
            }

            return {
                getData:getData
            }
        }


        /**
         * 标点中心
         * @constructor
         */

        function OverlayCenter(option){
            var defOpts= {
                html:'',//标点要显示html
                onMouseOver:null,
                onMouseOut:null,
                onClick:null,
                onItemBuild:null,
                overlaysType:'overlays',//标点的类型
                showInfo:'',//点击要展示的文本,
                className:'',//默认展示的Class
                classHover:'',//鼠标放上去展示的样式
                x:0,//x轴要偏移的像素
                y:0//y轴要偏 移的像素
            },opts,preCache;
            (function(){
                opts= J.mix(defOpts,option);


            })();
            function addOverlay(data){

            }
            function onClick(elm,data){
                MSG.overlayClick({
                    target:elm,
                    data:data
                });
            }
            function onMouseOver(elm,data){
                MSG.overlayMouseOver({
                    target:elm,
                    data:data
                });

            }
            function onMouseOut(elm,data){
                MSG.overlayMouseOut({
                    target:elm,
                    data:data
                });
            }
            function remove(elm,data){
                MSG.overlayRemove({
                    target:elm,
                    data:data
                });
            }

            /**
             *
             * @param data array
             */
            function addOverlays(data){
                var i,len=data.length,itemOpts,item,key,tmpObj={},removeHandler;
                for(i=0;i<len;i++){
                    itemOpts = onItemBuild(data[i]);
                    if(!html) continue;
                    itemOpts = J.mix(defOpts,itemOpts,true);
                    key = buildOverlayKey(itemOpts);
                    if(!preCache[key+itemOpts.overlaysType]){
                        item =  context.addOverLays(itemOpts,itemOpts.overlaysType,key);
                        item.onClick = function(){
                            var ret = itemOpts.onClick&&itemOpts.onClick.call(this);
                            if(ret === false) return;
                            onClick(item,itemOpts);
                        };
                        item.onMouseOver = function(){
                            var ret = onMouseOver.call(this);
                            if(ret === false) return;
                            onMouseOver(item,itemOpts);

                        };

                        item.onMouseOut = function(){
                            var ret = onMouseOver.call(this);
                            if(ret === false) return;
                            onMouseOut(item,itemOpts);
                        }
                        item.onRemove = function(){
                            itemOpts.remove&&itemOpts.remove(item,itemOpts);
                            remove(item,itemOpts);
                        }
                        tmpObj[key+itemOpts.overlaysType] = item;
                    }
                    for(i in preCache){
                        remove(preCache[i]);
                    }
                    preCache = tmpObj;
                }
            }

            /**
             * 为创建的Overlay创建参数
             */
            function onItemBuild(data){
                var tmp ;
                var html = opts.onItemBuild&& (tmp =opts.onItemBuild(data))?opts.html:tmp;
                return html;
            }

            /**
             * 移除上次ajax所添加的数据，并移除不应该显示的点
             * data OverlaysArray
             */
            function removeOverlays(data){

            }
            function buildOverlayKey(latlng){
                return latlng.lat+'_'+latlng.lng;
            }
            function k_means(){


            }
            return {
                addOverLays:addOverlays
            }




        }

        /**
         * 消息中心
         * @returns {{ajaxChange: Function, overlayRemove: Function, overlayClick: Function, overlayMouseOver: Function}}
         * @constructor
         */
        function MessageCenter(option){

            var defOpts = {
                target:document,//触发对象
                data:null//附带消息
            },opts;
            (function(){
                opts = J.mix(defOpts,option);

            })();

            /**
             * 发送的ajax请求变化
             */
            function ajaxChange(data){
                sendMessage('ajaxChange',data);
            }
            /**
             *
             */
            function overlayRemove(data){
                sendMessage('overlayRemove',data);

            }
            function overlayClick(data){
                sendMessage('overlayClick',data);
            }
            function overlayMouseOver(data){
                sendMessage('overlayMouseOver',data);
            }
            function overlayMouseOut(data){
                sendMessage('overlayMouseOut',data);
            }
            function mapMoveStart(data){
                sendMessage('mapMoveStart',data);
            }
            function mapMoveStop(data){
                sendMessage('mapMoveStop',data);
            }
            function zoomChange(data){
                sendMessage('zoomChange',data);
            }
            function sendMessage(eventName,data){
                J.fire(opts.target,eventName,data,true);
            }
            return {
                ajaxChange:ajaxChange,
                overlayRemove:overlayRemove,
                overlayClick:overlayClick,
                overlayMouseOver:overlayMouseOver,
                overlayMouseOut:overlayMouseOut,
                mapMoveStart:mapMoveStart,
                mapMoveStop:mapMoveStop,
                zoomChange:zoomChange

            }
        }
        return J.mix({
            getData:dataCenter.getData
        },context);
    }
    J.map.core =core;

})(J);;
/// require('map.Core');
(function(){
   function pad(opption){
       var defOpts ={
           url:'http://sh.lunjiang.zu.dev.anjuke.com/newmap/search2',
           id: "jmap_fill",
           lat: "31.230246775887",
           lng: "121.48246298372",
           mark: 0,
           zoom: 12,
           ezoom: 1,
           minz: 11,//最小缩放等级
           maxz: 18,//最大缩放等级
           onBeforeRequest:beforeRequest
       },opts,
           elm,
           CACHE= {},
           listContainer;
       function init(){
           opts = J.mix(defOpts,opption);
           var listId,//列表id
               containerId;//地图容器ｉｄ
           listId = 'p_filter_result',
               containerId=opts.id;
           buildContainer(containerId);
           buildList(listId);

           bindEvent();
           var map =  J.map.core(opts);
           //map.getData();
       }
       init();
       function bindEvent(){
           J.on(window,'resize',function(){
               buildContainer();
               buildList();
           });
       }
       function beforeRequest(data){
           return J.mix(data,{
               model:1,
               order:null,
               p:1,
               bounds:'31.170346,31.290401,121.333425,121.613983',
               zoom:13
           })
       }

       /**
        * js动态添加ｃｏｎｔａｉｎｅｒ
        */
       function buildContainer(id){
           if(!elm){
               elm =J.create('div',{
                   id:id
               }).appendTo(J.g("pad_view"));
           }
           elm.setStyle({
              width:'100%',
              height:'100%'

          });
          return elm;
       }

       /**
        * 计算列表高度
        */
       function buildList(id){
           var pageHeight,listHeight;
           pageHeight= J.page.viewHeight();
           listHeight = pageHeight - J.g("filter_condition").height()- J.g("p_header").height()- J.g('propBarLeft').height()- J.g("listPager").height();
           listContainer = !listContainer ? J.g(id) :listContainer;
           listContainer.setStyle({
               height:listHeight+'px'
           })
       }





   }
    pad();
})();