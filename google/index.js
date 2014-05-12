(function(){
    function initScrollBar(){
        var scrollbar = new J.ui.Scrollbar('Y', J.g('for_scroll').get(), J.g('map_content').get(), {border: 0});
        initScrollBar = function(num){
            scrollbar.calcHeight();
            scrollbar.scrollTo(num === undefined ?100000:num);
        }
    }




    function AreaBlock(opption) {
        var defOpts={
            lng:'121.37240008907',
            lat:'31.262790393191',
            id:'map_container',
            zoom:17,
            minz:11,
            maxz:18,
            name:'浦发绿城'
        },opts,map,container,DATA,EVENT,VIEW,point,chks,defBlock;
        loadSource(init);
        function init(){
            opts =J.mix(defOpts,opption||{})
            map = new J.map.bmap(opts);
            map.enableScrollWheelZoom();
            container = J.g("map_block");
            defBlock = container.s(".def").eq(0);
            bindEvent();
            var mvc = new MVC();
            DATA = mvc.Data;
            VIEW = mvc.View;
            EVENT = mvc.Event;
            AREA.clearList = EVENT.clearList;
            addOverlay();
            point = new BMap.Point(opts.lng,opts.lat);
            //chks[0].click();


        }
        function loadSource(callback){
            var version = '1.5';
            (function(){
                callback();
                map.moveToCenter=function(){
                    map.setCenter(opts.lng,opts.lat,opts.zoom);
                };

                SearchLocation(map);
            }).require('map.Bmap','')
        }

        function addOverlay(){
            var params = J.mix({},opts);
            params.x=-8;
            params.y=-45;
            params.className = 'overlay_comm'
            params.html='<div class="">'+opts.name+'<span class="tip"></span></div>';
            map.addOverlay(params);
        }
        function bindEvent(){
             chks = container.s(".chks").eq(0).s("input");
            chks.each(function(k,v){
                v.on('click',function(e){
                    if(this.checked){
                        EVENT.checkBoxChecked.call(this,e);
                        AREA.clearSearchResult&&AREA.clearSearchResult();
                        return;
                    }else{
                        EVENT.checkBoxCancled.call(this,e)
                        var num=0;
                        J.each(chks,function(k,v){
                            v.checked&&num++;
                        })
                        !num&&EVENT.noneSelected();
                    }
                });
            });
        }




        function MVC(){
            var CACHE = {
                    traffic: {target: null, nodes: {}, overlays: [], data: null},
                    school: {target: null, nodes: {}, overlays: [], data: null},
                    hospital: {target: null, nodes: {}, overlays: [], data:null},
                    restaurant: {target: null, nodes: {}, overlays: [], data: null},
                    bank: {target: null, nodes: {}, overlays: [], data: null},
                    market: {target: null, nodes: {}, overlays: [], data: null}
                },
                DATA,VIEW,EVENT,list;
            function init(){
                DATA = new Data();
                VIEW = new View();
                EVENT = new Event();
                list = container.s(".r").eq(0);

            }
            init();
            function View() {

                var config = {
                    traffic: '交通',
                    school: '学校',
                    hospital: '医院',
                    restaurant: '餐馆',
                    bank: '银行',
                    market: '超市'
                };
                /**
                 *
                 * @param title 类型：学校，交通，餐馆
                 * @param name 浦三路，学校名字，餐馆名字
                 * @param type school traffic
                 * @param
                 * @param params [{name,adddress,long}]
                 */
                function buildBaseHTML(type, params) {
                    var dl,dt, key, cache, title;
                    var pos=[];

                    cache = CACHE[type].nodes;

                    dl = document.createElement('dl');
                    dl.className = "item "+ type;

                    dt = document.createElement("dt");
                    dt.innerHTML=config[type];

                    dl.appendChild(dt);

                    J.each(params,function(k,v){
                        var dd,distance ;
                        distance = v.distance+"米";
                        dd = document.createElement("dd");
                        dd.innerHTML='<span class="tip"></span>'+
                            '<em>'+distance+'</em>'+
                            '<div>' +
                            '<a href="###">'+ v.title+'</a>' +
                            (!v.address?'':'&nbsp;-&nbsp;<label>'+ v.address+'</label>')+
                            '</div>'
                        J.g(dd).on('mouseenter',EVENT.listItemMouseOver);
                        J.g(dd).on('mouseleave',EVENT.listItemMouseOut);

                        buildOverlay(type,v,dd);
                        pos.push(v.point);
                        dl.appendChild(dd);

                    })
                    pos.push(point);
                    CACHE[type].viewport = map.getViewport(pos);
                    map.setViewport(CACHE[type].viewport);
                    //  map.setViewport(getViewport());
                    list.append(dl);
                    initScrollBar();
                    list.get().scrollTop=10000;
                    return dl;
                }

                function buildOverlay(type,v,dd){
                    v.className="overlay";
                    v.html='<div class="'+type+'"></div>';
                    v.lat = v.point.lat;
                    v.lng = v.point.lng;
                    v.x = -10;
                    v.y = -10;
                    v.zIndex=1;
                    var tmp =map.addOverlay(v);
                    dd.relatedTarget = tmp;
                    tmp.relatedTarget = dd;

                    tmp.onMouseOver = EVENT.listItemMouseOver;
                    tmp.onMouseOut = EVENT.listItemMouseOut;
                    /*   tmp.onClick = EVENT.listItemClick;*/
                    CACHE[type=='bus'?'traffic':type].overlays.push(tmp);
                }

                function buildTrafficHtml(subData,busData){
                    var dl,dt, key, cache, title;
                    var pos=[];
                    var type = 'traffic';
                    cache = CACHE[type].nodes;
                    dl = document.createElement('dl');
                    dl.className = "item "+ type;

                    dt = document.createElement("dt");
                    dt.innerHTML=config[type];

                    dl.appendChild(dt);

                    J.each(subData,function(k,v){
                        var dd,distance ;
                        distance = v.distance+"米";
                        dd = document.createElement("dd");
                        dd.className ='sub'
                        dd.innerHTML='<span class="tip"></span>'+
                            '<em>'+distance+'</em>'+
                            '<div>' +
                            '<a href="###">'+ v.title+'</a>' +
                            (!v.address?'':'&nbsp;-&nbsp;<label>'+ v.address+'</label>')+
                            '</div>'
                        J.g(dd).on('mouseenter',EVENT.listItemMouseOver);
                        J.g(dd).on('mouseleave',EVENT.listItemMouseOut);

                        buildOverlay(type,v,dd);
                        pos.push(v.point);
                        dl.appendChild(dd);
                    })


                    J.each(busData,function(k,v){
                        var dd,distance ;
                        distance = v.distance+"米";
                        dd = document.createElement("dd");
                        dd.className ='bus'
                        dd.innerHTML='<span class="tip"></span>'+
                            '<em>'+distance+'</em>'+
                            '<div>' +
                            '<a href="###">'+ v.title+'</a>' +
                            (!v.address?'':'&nbsp;-&nbsp;<label>'+ v.address+'</label>')+
                            '</div>'
                        J.g(dd).on('mouseenter',EVENT.listItemMouseOver);
                        J.g(dd).on('mouseleave',EVENT.listItemMouseOut);

                        buildOverlay('bus',v,dd);
                        pos.push(v.point);
                        dl.appendChild(dd);
                    })
                    CACHE[type].viewport = map.getViewport(pos);
                    map.setViewport(CACHE[type].viewport);
                    list.append(dl);
                    initScrollBar();
                    list.get().scrollTop=10000;
                    return dl;
                }


                /**
                 *
                 * @param params 创建mark所需要的参数
                 * @param infoWindowParams 弹框所需要的参数
                 * @returns {*}
                 */
                function buildBaseOverlays(type, params) {
                    var overlays;


                    return overlays;
                }

                function getTraffic(subwaydata,busdata) {
                    var type = 'traffic';
                    var target;
                    CACHE[type].target =target = buildTrafficHtml(subwaydata, busdata);
                    //CACHE[type].overlays = buildBaseOverlays(type, data)

                }

                function getSchool(data) {
                    var type = 'school';
                    var target;
                    CACHE[type].target =target = buildBaseHTML(type, data);
                }

                function getHospital(data) {
                    var type = 'hospital';
                    var target;
                    CACHE[type].target =target = buildBaseHTML(type, data);

                }

                function getRestaurant(data) {
                    var type = 'restaurant';
                    var target;
                    CACHE[type].target =target = buildBaseHTML(type, data);

                }

                function getBank(data) {
                    var type = 'bank';
                    var target;
                    CACHE[type].target =target = buildBaseHTML(type, data);

                }

                function getMarket(data) {
                    var type = 'market';
                    var target;
                    CACHE[type].target =target = buildBaseHTML(type, data);
                }

                var handlers = {
                    getTraffic: getTraffic,
                    getSchool: getSchool,
                    getHospital: getHospital,
                    getRestaurant: getRestaurant,
                    getBank: getBank,
                    getMarket: getMarket
                }


                J.each(CACHE, function (k, v) {
                    var inx = k;
                    handlers['remove' + k.charAt(0).toUpperCase() + k.substring[1]] = function () {
                        var cache = CACHE[inx];
                        cache.target.remove();
                        cache.nodes = {};
                        J.each(cahce.overlays, function (i, e) {
                            e.remove();
                            cache.overlays = null;
                            delete cache.overlays[i]
                        });//移除所有overlays
                    }
                });
                return handlers;


            }
            function Event() {

                function listItemMouseOver() {
                    var node,overlay;

                    if(!this.nodeType){
                        node = this.relatedTarget;
                        overlay = this;
                    }else{
                        node = this;
                        overlay = this.relatedTarget;
                    }
                    J.g(node).addClass('hover');
                    overlay._div.addClass('hover');

                    if(!overlay.infoWindow){
                        var params = J.mix({},overlay.p);
                        params.html= '<div class="overlay_container"><span class="tip"></span><b>'+params.title+'</b><div>'+params.distance+'米，步行'+parseInt(params.distance/75)+'分钟</div></div>'
                        params.className='overlay_info';
                        params.y =-75;
                        params.x =-32;
                        params.zIndex=1000;
                        overlay.infoWindow=map.addOverlay(params);
                        return
                    }
                    overlay.infoWindow.show();

                    /*
                     var info = new BMap.InfoWindow("12312312312312312");
                     map.openInfoWindow(info,point);*/

                }

                function listItemMouseOut() {
                    var node,overlay;
                    if(!this.nodeType){
                        node = this.relatedTarget;
                        overlay = this;
                    }else{
                        node = this;
                        overlay = this.relatedTarget;
                    }
                    // console.log(this,this.relatedTarget)
                    J.g(node).removeClass('hover');
                    overlay._div.removeClass('hover');
                    overlay.infoWindow.hide();


                }

                function listItemClick(){
                    var params = J.mix({},this.p);
                    params.html= '<div class="overlay_container"><span class="tip"></span><b>'+params.title+'</b><div>'+params.distance+'米，步行'+parseInt(params.distance/75)+'分钟</div></div>'
                    params.className='overlay_info';
                    params.y =-72;
                    params.x =-32;
                    map.addOverlay(params);

                }


                function checkBoxChecked() {
                    list.addClass("auto");

                    var fnName = this.id.split('_')[1];
                    if(CACHE[fnName].target){
                        list.append(CACHE[fnName].target);
                        initScrollBar();
                        J.each( CACHE[fnName].overlays,function(k,v){
                            v.show();
                            map.setViewport( CACHE[fnName].viewport);
                        })
                    }else{
                        fnName ='get'+fnName.charAt(0).toUpperCase() + fnName.substring(1);
                        DATA[fnName](function(data){
                            VIEW[fnName].apply(this,Array.prototype.slice.call(arguments));
                        });
                    }
                }

                function checkBoxCancled() {
                    var fnName = this.id.split('_')[1];
                    CACHE[fnName].target&&J.g(CACHE[fnName].target).remove();
                    initScrollBar();
                    J.each( CACHE[fnName].overlays,function(k,v){
                        v.hide();
                    })
                }

                function noneSelected() {
                    container.s(".def").eq(0).show();
                    container.s(".r").eq(0).removeClass("auto");

                }
                function clearList(){
                    J.each(chks,function(k,v){

                        v.checked&& EVENT.checkBoxCancled.call(v);
                        v.checked = false;
                    });
                }

                return {
                    listItemMouseOver: listItemMouseOver,
                    listItemMouseOut: listItemMouseOut,
                    checkBoxChecked: checkBoxChecked,
                    checkBoxCancled: checkBoxCancled,
                    noneSelected: noneSelected,
                    listItemClick:listItemClick,
                    clearList:clearList
                }

            }
            function Data() {
                function getDataCommon(type,callback) {
                    map.localSearchNearby(type, function(data){
                        J.each(data,function(k,v){
                            v.address = v.address== v.undefined?'': v.address;
                            v.distance = parseInt(map.getDistance(point, v.point))
                        });
                        data.sort(function(a,b){
                            if(a.distance< b.distance) return -1;
                            if(a.distance == b.distance) return 0;
                            if(a.distance > b.distance) return 1;
                        })
                        callback(data);
                    }, 5, 2000);
                }

                function getTraffic(callback) {
                    var type = 'traffic';
                    var busData,subwayData;
                    //地铁|4|地铁|700,公交车站|20|公交|600
                    var data={
                        subway:null,
                        bus:null
                    };
                    function handler(data){
                        var ret=[];
                        var num =data.subway.length+data.bus.length;
                        if(num>5){
                            var sub = data.subway.length>3?3:data.subway.length;
                            subwayData =data.subway.slice(0,sub);
                            busData = data.bus.slice(0,5-sub)
                        }else{
                            subwayData = data.subway;
                            busData = data.bus;
                        }
                        ret = callback(subwayData,busData);
                    }
                    /**
                     * 地铁
                     */
                    function handler_1(ret){
                        data.subway = ret;
                        data.subway&&data.bus&&(CACHE[type].data = data,handler(data));
                    }
                    function handler_2(ret){
                        data.bus = ret;
                        data.subway&&data.bus&&(CACHE[type].data = data,handler(data));
                    }
                    getDataCommon('地铁站',handler_1);
                    getDataCommon('公交',handler_2);

                }

                function getSchool(callback) {
                    var type = 'school';
                    CACHE[type].data&&callback(CACHE[type].data);
                    getDataCommon('学校',function(data){
                        CACHE[type].data = data;
                        callback(data);
                    });

                }

                function getHospital(callback) {
                    var type = 'traffic';
                    CACHE[type].data&&callback(CACHE[type].data);
                    getDataCommon('医院',function(data){
                        CACHE[type].data = data;
                        callback(data);
                    });

                }

                function getRestaurant(callback) {
                    var type = 'restaurant';
                    CACHE[type].data&&callback(CACHE[type].data);
                    getDataCommon('餐馆',function(data){
                        CACHE[type].data = data;
                        callback(data);
                    });


                }

                function getBank(callback) {
                    var type = 'bank';
                    CACHE[type].data&&callback(CACHE[type].data);
                    getDataCommon('银行',function(data){
                        CACHE[type].data = data;
                        callback(data);
                    });


                }

                function getMarket(callback) {
                    var type = 'market';
                    CACHE[type].data&&callback(CACHE[type].data);
                    getDataCommon('超市',function(data){
                        CACHE[type].data = data;
                        callback(data);
                    });
                }

                var handlers = {
                    getTraffic: getTraffic,
                    getSchool: getSchool,
                    getHospital: getHospital,
                    getRestaurant: getRestaurant,
                    getBank: getBank,
                    getMarket: getMarket
                }
                return handlers;

            }
            return {
                View:VIEW,
                Event:EVENT,
                Data:DATA
            }
        }


        return {
            map:map
        }


    }
    var AREA = AreaBlock();



    function SearchLocation(map){

        var container,EVENT,DATA,VIEW,list,wayBlock,CACHE={};


        var titleStart,titleEnd;
        ;(function(){
            container = J.g("map_block");

            list = container.s(".r").eq(0);
            wayBlock=list.s(".way").eq(0);
            VIEW = new View();
            DATA = new Data();
            EVENT = new Event();
            bindEvent();



        })();

        function bindEvent(){
            var changeBtn,searchBtn;
            var btnByBus;
            var btnByCar;

            changeBtn = container.s(".change").eq(0);
            searchBtn = container.s(".btn").eq(0);

            btnByBus = container.s(".bybus").eq(0);
            btnByCar = container.s(".bycar").eq(0);

            changeBtn.on('click',EVENT.change);
            searchBtn.on('click',EVENT.search);

            btnByBus.on('click',function(){
                btnByBus.addClass("hover");
                btnByCar.removeClass("hover");
                EVENT.byBus.call(this);
            })
            btnByCar.on('click',function(){
                btnByCar.addClass("hover");
                btnByBus.removeClass("hover");
                EVENT.byCar.call(this);
            })



        }



        function Event(){
            var iptStart,iptEnd;
            var pointStart,pointEnd;
            ;(function(){
                iptStart = container.s(".begain").eq(0).s("input").eq(0);
                iptEnd = container.s(".end").eq(0).s("input").eq(0);
                iptStart.on('focus',function(){this.parentNode.style.borderColor=""});
                iptEnd.on('focus',function(){this.parentNode.style.borderColor=""});

            })();

            function search(){
                var startStr,endStar;
                startStr = iptStart.val();
                endStar = iptEnd.val();
                !startStr&& (iptStart.get().parentNode.style.borderColor="red");
                !endStar && ( iptEnd.get().parentNode.style.borderColor="red")
                list.addClass("auto");
                list.s(".def").eq(0).hide();
                if(!startStr|| !endStar){
                    return;
                }
                AREA.clearList();
                AREA.clearSearchResult&&AREA.clearSearchResult();
                wayBlock.hide();
                pointEnd = null;
                pointStart = null;
                //删除原有的
                J.each(CACHE,function(k,v){
                    v.remove();
                    delete CACHE[k];
                });
                //保证起点先返回后返回终点
                var firstHandler,buildbegainSelect;
                DATA.getAddress(startStr,this,function(){
                    firstHandler = true;
                    VIEW.buildbegainSelect.apply(this,Array.prototype.slice.call(arguments));
                    buildbegainSelect&&buildbegainSelect();
                },startStr);
                DATA.getAddress(endStar,this,function(){
                    var args =Array.prototype.slice.call(arguments)
                    buildbegainSelect =firstHandler?VIEW.buildEndSelect.apply(this,args):function(){
                        VIEW.buildEndSelect.apply(EVENT,args);
                        args = null;
                        buildbegainSelect = null;
                        firstHandler = null;
                    };
                },endStar);
            }

            /**
             * 值互换
             */
            function change(){
                var tmp = iptStart.val();
                iptStart.val(iptEnd.val());
                iptEnd.val(tmp);
            }

            function byBus(p1,p2){
                p1= p1 || pointStart;
                p2 = p2 || pointEnd;

                container.s(".bybus").eq(0).addClass('hover');
                container.s(".bycar").eq(0).removeClass('hover');

                AREA.clearSearchResult&&AREA.clearSearchResult();
                J.each(CACHE,function(k,v){
                    v.remove();
                })
                wayBlock.show();


                var transit = new BMap.TransitRoute(map, {
                    renderOptions: {
                        map: map,
                        onPolylinesSet:function(data){
                        },
                        policy:BMAP_TRANSIT_POLICY_LEAST_TIME,
                        panel:document.getElementById("none_for_baidy"),
                        selectFirstResult:true
                    }
                });
                transit.setPageCapacity(1);
                transit.setResultsHtmlSetCallback(function(data){
                });
                transit.setMarkersSetCallback(function(data){
                });
                transit.setInfoHtmlSetCallback(function(data){
                });
                transit.setSearchCompleteCallback(function(data){
                    var distance = data.Ym[0].getDistance();
                    var time = data.Ym[0].getDuration();
                    var traffic =[];
                    AREA.clearSearchResult =function(){
                        transit.clearResults();
                        wayBlock.hide();
                        map.moveToCenter();
                        transit = null;
                        AREA.clearSearchResult=null;

                    } ;
                    J.each(data.Ym[0].dk,function(k1,v1){
                        traffic.push(v1.title);
                    })


                    var html = data.Ym[0].bi;
                    var reg= /，(?=乘坐|<b>步行)/;
                    var data = html.split(reg);
                    J.each(data,function(i,v){
                        v=v.replace(/<b>步行<\/b>/,function(){
                            return '步行';
                        })
                        v = v.replace(/约\d+米/,function(data){
                            return '<span class="tip">'+data.match(/\d+/)[0]+'米</span>';
                        })
                        v = v.replace(/经过\d+站，/,function(data){
                            return '<span class="tip">'+data.match(/\d+/)[0]+'站</span>';
                        })
                        v = v.replace(/<b>/g,'<a href="###">');
                        v = v.replace(/<\/b>/g,'</a>');
                        data[i] = v;
                    });


                    VIEW.buildRouter(data,traffic,distance,time);



                });
                transit.search(p1, p2);
            }

            function byCar(p1,p2){
                p1= p1 || pointStart;
                p2 = p2 || pointEnd;

                container.s(".bybus").eq(0).removeClass('hover');
                container.s(".bycar").eq(0).addClass('hover');

                // J.s(".Vscroll").eq(0).hide();
                AREA.clearSearchResult&&AREA.clearSearchResult();
                J.each(CACHE,function(k,v){
                    v.remove();
                })
                wayBlock.show();


                var transit = new BMap.DrivingRoute(map, {
                    renderOptions: {
                        map: map,
                        policy:BMAP_DRIVING_POLICY_LEAST_DISTANCE,
                        onInfoHtmlSet:function(data){
                            //console.log(data,111);
                        }

                    }
                });
            //    transit.setPageCapacity(1);
                transit.setResultsHtmlSetCallback(function(data){
                });
                transit.setMarkersSetCallback(function(data){
                });
                transit.setInfoHtmlSetCallback(function(data){
                });
                transit.setSearchCompleteCallback(function(data){
                    var distance = data.Ym[0].getDistance();
                    var time = data.Ym[0].getDuration();
                    var traffic =[];
                    AREA.clearSearchResult =function(){
                        transit.clearResults();
                        wayBlock.hide();
                        map.moveToCenter();
                        transit = null;
                        AREA.clearSearchResult=null;

                    } ;
                    data = data.Ym[0].bh[0].ln;
                    VIEW.buildCarRouter(data,distance,time);



                });
                transit.search(p1, p2);
            }



            function setStartAddress(){
                var point = this.parentNode.point;
                var dl = J.g(this.parentNode.parentNode);
                dl.removeClass("q");
                titleStart = J.g(this.parentNode).s("a").eq(0).html();
                dl.first().s(".tit").eq(0).html(titleStart);
                pointStart = point;
                pointStart&&pointEnd&&byBus(pointStart,pointEnd);

            }
            function setEndAddress(){
                var point = this.parentNode.point;
                var dl = J.g(this.parentNode.parentNode);
                 dl.removeClass("q");
                titleEnd = J.g(this.parentNode).s("a").eq(0).html();
                 dl.first().s(".tit").eq(0).html(titleEnd);
                pointEnd = point;
                pointStart&&pointEnd&&byBus(pointStart,pointEnd);
            }

            function onMouseOverListItem(){

            }
            function onMouseOverOverlay(){

            }
            function listOnMouseOVer(){
                J.g(this).addClass('hover');
            }
            function listOnMouseOut(){
                J.g(this).removeClass('hover');

            }


            return {
                search:search,
                change:change,
                byBus:byBus,
                byCar:byCar,
                setStartAddress:setStartAddress,
                setEndAddress:setEndAddress,
                onMouseOverListItem:onMouseOverListItem,
                onMouseOverOverlay:onMouseOverOverlay,
                listOnMouseOVer:listOnMouseOVer,
                listOnMouseOut:listOnMouseOut
            }

        }


        function Data(){



            //获得下拉框数据
            function getAddress(keyword, obj, callback, args){
                map.localSearch(keyword, obj, callback, args);
            }


            function getTransit(p1,p2,callback){
                var transit = new BMap.TransitRoute(map, {
                    renderOptions: {map: map}
                });
                transit.setSearchCompleteCallback(callback);
                transit.search(p1,p2);
            }
            return {
                getAddress:getAddress,
                getTransit:getTransit
            }






        }
        function View(){
            function buildbegainSelect(data,kw){
                var dl,dt, key, cache, title;
                var type = 'traffic';
                dl = document.createElement('dl');
                dl.className = "select q";

                dt = document.createElement("dt");
                dt.innerHTML='<label>起点：</label><span class="tit">'+kw+
                    '</span><span class="row"></span>';
                dl.appendChild(dt);
                J.each(data,function(k,v){
                    var dd,distance ;
                    distance = v.distance+"米";
                    dd = document.createElement("dd");
                    dd.innerHTML=
                        '<div class="select_item">'+
                            '<a href="###">'+ v.title+'</a>'+
                            '<div>'+ v.address+'</div>' +
                            '</div>'+
                            '<a href="###" class="tip">设为起点</a>';
                    J.g(dd).on('mouseenter',EVENT.listOnMouseOVer);
                    J.g(dd).on('mouseleave',EVENT.listOnMouseOut);
                    dd.point = v.point;
                    dl.appendChild(dd);
                });
                list.append(dl);
                dl = J.g(dl);
                dl.on('click',function(e){
                    if(e.target&&e.target.className=="tip"){
                        EVENT.setStartAddress.call(e.target);
                    }
                    if(e.target&&e.target.className=="row"){
                        dl.addClass("q");
                    }
                })
                CACHE['begain'] = dl;
                initScrollBar(0);
                AREA.clearSearchResult = function(){
                    J.each(CACHE,function(k,v){
                        v.remove();
                    })
                }
                return dl;
            }
            function buildEndSelect(data,kw){
                var dl,dt, key, cache, title;

                dl = document.createElement('dl');
                dl.className = "select q";

                dt = document.createElement("dt");
                dt.innerHTML='<label>终点：</label><span class="tit">'+kw+
                    '</span><span class="row"></span>';
                dl.appendChild(dt);
                J.each(data,function(k,v){
                    var dd,distance ;
                    distance = v.distance+"米";
                    dd = document.createElement("dd");
                    dd.innerHTML=
                        '<div class="select_item">'+
                            '<a href="###">'+ v.title+'</a>'+
                            '<div>'+ v.address+'</div>' +
                            '</div>'+
                            '<a href="###" class="tip">设为终点</a>';
                    J.g(dd).on('mouseenter',EVENT.listOnMouseOVer);
                    J.g(dd).on('mouseleave',EVENT.listOnMouseOut);
                    dd.point = v.point;
                    dl.appendChild(dd);
                });
                list.append(dl);
                dl = J.g(dl);
                dl.on('click',function(e){
                    if(e.target&&e.target.className=="tip"){
                        EVENT.setEndAddress.call(e.target);
                    }
                    if(e.target&&e.target.className=="row"){
                        dl.addClass("q");
                    }

                })
                CACHE['end'] = dl;
                initScrollBar(0);
                AREA.clearSearchResult = function(){
                    J.each(CACHE,function(k,v){
                        v.remove();
                    })
                }
                return dl;
            }


            function buildBaseSelect(){

            }
            function buildCarRouter(data,distance,time){
                list.addClass("q");
                var begain = wayBlock.s(".begain").eq(0);
                var end = wayBlock.s(".end").eq(0);
                begain.html(titleStart)
                end.html(titleEnd)
                //var
                var lines = wayBlock.s(".gre").eq(0);
                var topLines = [];
                lines.html(distance+'/'+time)
                var content = wayBlock.s("ul").eq(0);
                content.html('');


                J.each(data,function(k,v){
                    var li = document.createElement('li')
                    v.bi = v.bi.replace(/<b>/g,'<a href="###">');
                    v.bi = v.bi.replace(/<\/b>/g,'</a>')

                    li.innerHTML= v.bi;
                    content.append(li);
                })
                J.s(".Vscroll").eq(0).get().style.display="none";
            }

            function buildRouter(data,traffic,long,time){

                list.addClass("q");
                var begain = wayBlock.s(".begain").eq(0);
                var end = wayBlock.s(".end").eq(0);
                begain.html(titleStart)
                end.html(titleEnd)
                //var
                var lines = wayBlock.s(".gre").eq(0);
                var topLines = [];
                J.each(traffic,function(k,v){
                    var tmp ="<span class='g'>"+ v.replace(/\(.*\)/,'')+"</span>";
                     traffic[k] = tmp;
                });
                var bus_line =traffic.join('<span class="right_tip"></span>');
                bus_line= bus_line+'<span class="long">全程约'+time+'/'+long+'</span>';
                lines.html(bus_line)
                var content = wayBlock.s("ul").eq(0);
                content.html('');


                J.each(data,function(k,v){
                    var li = document.createElement('li')
                    li.innerHTML= v;
                    content.append(li);
                })
                J.s(".Vscroll").eq(0).get().style.display="none";
            }
            return {
                buildbegainSelect:buildbegainSelect,
                buildEndSelect:buildEndSelect,
                buildBaseSelect:buildBaseSelect,
                buildRouter:buildRouter,
                buildCarRouter:buildCarRouter
            }

        }

    }


})();

