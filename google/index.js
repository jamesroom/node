function AreaBlock(opption) {
    var defOpts={
            lng:'121.37240008907',
            lat:'31.262790393191',
            id:'map_container',
            zoom:17,
            minz:11,
            maxz:18,
            name:'浦发绿城'
    },opts,map,container,DATA,EVENT,VIEW;
        loadSource(init);
    function init(){
        opts =J.mix(defOpts,opption||{})
        map = new J.map.bmap(opts);
        map.enableScrollWheelZoom();
        addOverlay();
        container = J.g("map_block");
        bindEvent();
        DATA = new Data();
        VIEW = new View();
        EVENT = new Event();

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
        params.html='<div class="overlay">'+opts.name+'<span class="tip"></span></div>';
        map.addOverlay(params);
    }
    function bindEvent(){
        var chks = container.s(".chks").eq(0).s("input");
        chks.each(function(k,v){
            v.on('click',function(e){
                this.checked?EVENT.checkBoxChecked.call(this,e):EVENT.checkBoxCancled.call(this,e);
            });
        });
    }






    function View() {

        var config = {
            traffic: '交通',
            school: '学校',
            hospital: '医院',
            restaurant: '餐馆',
            bank: '银行',
            market: '超市'
        };


        var CACHE = {
            traffic: {target: null, nodes: {}, overlays: {}, data: null},
            school: {target: null, nodes: {}, overlays: {}, data: null},
            hospital: {target: null, nodes: {}, overlays: {}, data:null},
            restaurant: {target: null, nodes: {}, overlays: {}, data: null},
            bank: {target: null, nodes: {}, overlays: {}, data: null},
            market: {target: null, nodes: {}, overlays: {}, data: null}
        }

        /**
         *
         * @param title 类型：学校，交通，餐馆
         * @param name 浦三路，学校名字，餐馆名字
         * @param type school traffic
         * @param
         * @param params [{name,adddress,long}]
         */
        function buildBaseHTML(type, params) {
            var dl, dd, key, cache, title;

            cache = CACHE[type].nodes;

            dl = J.create("dl", {className: 'item ' + type});
            dt = document.createElement("")


            cache[key] = dd;
            title = config[type];

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

        function getTraffic(data) {
            var type = 'traffic';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

        }

        function getSchool(data) {
            var type = 'school';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

        }

        function getHospital(data) {
            var type = 'traffic';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

        }

        function getRestaurant(data) {
            var type = 'restaurant';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

        }

        function getBank(data) {
            var type = 'bank';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

        }

        function getMarket(data) {
            var type = 'market';
            CACHE[type].target = buildBaseHTML(type, data.list);
            CACHE[type].overlays = buildBaseOverlays(type, data.overlays)

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

        }

        function listItemMouseOut() {

        }

        function overlayMouseOver() {

        }

        function overlayMouseOut() {


        }

        function checkBoxChecked() {
           var fnName = this.id.split('_')[1];
            fnName ='get'+fnName.charAt(0).toUpperCase() + fnName.substring(1);
            DATA[fnName](function(data){
                console.log(data)
            });


        }

        function checkBoxCancled() {
            var fnName = this.id.split('_')[1];
        }

        function noneSelected() {

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
                callback(data);
            }, 5, 2000);
        }

        function getTraffic(callback) {
            var type = 'traffic';
            //地铁|4|地铁|700,公交车站|20|公交|600
            var data={
                subway:null,
                bus:null
            };
            /**
             * 地铁
             */
            function handler_1(ret){
                data.subway = ret;
                data.subway&&data.bus&&callback(data);
            }
            function handler_2(ret){
                data.bus = ret;
                data.subway&&data.bus&&callback(data);
            }
            getDataCommon('地铁站',handler_1);
            getDataCommon('公交',handler_2);

        }

        function getSchool(callback) {
            var type = 'school';
            getDataCommon('学校',callback);

        }

        function getHospital(callback) {
            var type = 'traffic';
            getDataCommon('医院',callback);

        }

        function getRestaurant(callback) {
            var type = 'restaurant';
            getDataCommon('餐馆',callback);


        }

        function getBank(callback) {
            var type = 'bank';
            getDataCommon('银行',callback);


        }

        function getMarket(callback) {
            var type = 'market';
            getDataCommon('超市',callback);
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


}
AreaBlock();
