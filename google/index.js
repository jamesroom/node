function AreaBlock(opption) {
    var defOpts={
            lng:'121.37240008907',
            lat:'31.262790393191',
            id:'map_container',
            zoom:17,
            minz:11,
            maxz:18,
            name:'浦发绿城'
    },opts,map,container,DATA,EVENT,VIEW,point;
        loadSource(init);
    function init(){
        opts =J.mix(defOpts,opption||{})
        map = new J.map.bmap(opts);
        map.enableScrollWheelZoom();
        container = J.g("map_block");
        bindEvent();
        var mvc = new MVC();
        DATA = mvc.Data;
        VIEW = mvc.View;
        EVENT = mvc.Event;
        addOverlay();
        point = new BMap.Point(opts.lng,opts.lat);

    }
    function loadSource(callback){
        var version = '1.5';
        (function(){
            callback();
        }).require('map.Bmap','')
    }

    function addOverlay(){
        var params = J.mix({},opts);
        params.x=-8;
        params.y=-45;
        params.html='<div class="overlay_comm">'+opts.name+'<span class="tip"></span></div>';
        map.addOverlay(params);
    }
    function bindEvent(){
        var chks = container.s(".chks").eq(0).s("input");
        chks.each(function(k,v){
            v.on('click',function(e){
                if(this.checked){
                    EVENT.checkBoxChecked.call(this,e);
                    return;
                }else{
                    EVENT.checkBoxCancled.call(this,e)
                    var num=0;
                    J.each(chks,function(k,v){
                        !v.checked&&num++;
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



                    v.className="overlay";
                    v.html='<div class="'+type+'"></div>';
                    v.lat = v.point.lat;
                    v.lng = v.point.lng;
                   pos.push(v.point);

                    var tmp =map.addOverlay(v);

                    dd.relatedTarget = tmp;
                    tmp.relatedTarget = dd;

                    tmp.onMouseOver = EVENT.listItemMouseOver;
                    tmp.onMouseOut = EVENT.listItemMouseOut;

                    CACHE[type].overlays.push(tmp);
                    dl.appendChild(dd);
                })
                pos.push(point);
                CACHE[type].viewport = map.getViewport(pos);
                map.setViewport(CACHE[type].viewport);
              //  map.setViewport(getViewport());
                return dl;
            }


            function buildTrafficHtml(subData,busData){
                var dl,dt, key, cache, title;
                var pos=[];
                var type = 'traffic';
                cache = CACHE[type].nodes;
                console.log(subData,busData);
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

                    v.className="overlay";
                    v.html='<div class="'+ type+'"></div>';
                    v.title='12313';
                    v.lat = v.point.lat;
                    v.lng = v.point.lng;

                    var tmp =map.addOverlay(v);

                    dd.relatedTarget = tmp;
                    tmp.relatedTarget = dd;

                    tmp.onMouseOver = EVENT.listItemMouseOver;
                    tmp.onMouseOut = EVENT.listItemMouseOut;

                    CACHE[type].overlays.push(tmp);
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

                    v.className="overlay_"+type;
                    v.html='<div style="background: red;">aaaaa</div>';
                    v.title='12313';
                    v.lat = v.point.lat;
                    v.lng = v.point.lng;
                    var tmp =map.addOverlay(v);

                    dd.relatedTarget = tmp;
                    tmp.relatedTarget = dd;

                    tmp.onMouseOver = EVENT.listItemMouseOver;
                    tmp.onMouseOut = EVENT.listItemMouseOut;

                    CACHE[type].overlays.push(tmp);
                    pos.push(v.point);
                    dl.appendChild(dd);
                })
                CACHE[type].viewport = map.getViewport(pos);
                map.setViewport(CACHE[type].viewport);
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
                list.append(target);
                //CACHE[type].overlays = buildBaseOverlays(type, data)

            }

            function getSchool(data) {
                var type = 'school';
                var target;
                CACHE[type].target =target = buildBaseHTML(type, data);
                list.append(target);
            }

            function getHospital(data) {
                var type = 'hospital';
                var target;
                CACHE[type].target =target = buildBaseHTML(type, data);
                list.append(target);

            }

            function getRestaurant(data) {
                var type = 'restaurant';
                var target;
                CACHE[type].target =target = buildBaseHTML(type, data);
                list.append(target);

            }

            function getBank(data) {
                var type = 'bank';
                var target;
                CACHE[type].target =target = buildBaseHTML(type, data);
                list.append(target);

            }

            function getMarket(data) {
                var type = 'market';
                var target;
                CACHE[type].target =target = buildBaseHTML(type, data);
                list.append(target);
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

               /* if(!overlay.infoWindow){
                    var params = J.mix(overlay.p,{
                        html:"asdfasdfasdfasdf"
                    },true)
                    overlay.infowindow=map.addOverlay(params);
                }
                overlay.infowindow.show();*/

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
               /* overlay.infowindow.hide();*/

            }

            function overlayMouseOver() {

            }

            function overlayMouseOut() {


            }

            function checkBoxChecked() {
                var fnName = this.id.split('_')[1];
                if(CACHE[fnName].target){
                    list.append(CACHE[fnName].target);
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

                console.log(CACHE[fnName].overlays)

               J.each( CACHE[fnName].overlays,function(k,v){
                    v.hide();
                })
            }

            function noneSelected() {
                container.s(".def").eq(0).show();
                container.s(".r").eq(0).removeClass("auto");
            }

            return {
                listItemMouseOver: listItemMouseOver,
                listItemMouseOut: listItemMouseOut,
                overlayMouseOver: overlayMouseOver,
                overlayMouseOut: overlayMouseOut,
                checkBoxChecked: checkBoxChecked,
                checkBoxCancled: checkBoxCancled,
                noneSelected: noneSelected
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
                CACHE[type].data&&callback(CACHE[type].data);
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





}
AreaBlock();
