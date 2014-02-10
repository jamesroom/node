/// require('map.Bmap');
(function(J){
    function business(opts){
        var defOpts={
            url:''


        },BMap,opts,MSG,context;
        init(opts);
        function init(options){
            opts = J.mix(defOpts,options);
            MSG = new MessageCenter();
            context = new  J.map.bmap();
        }
        function eventBind(){

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
                key;

            opts = J.mix(defOpts,opption);
            /**
             * 获得请求的ajax setting
             * @returns {string|url|url|url|url|url|*}
             */
            function buildAjaxSetting() {
                var url = opts.url;
                var WestEast = getBoundsWE(-40), i,
                    customerUrl = opts.buildUrl&&opts.buildUrl(url,WestEast);
                url = customerUrl || url;

                return url;
            }

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
                J.get(ajaxSetting);
            }

            /**
             * 发送ajax请求之前所需要的参数
             * @returns {ajaxsetting} or {ajaxsetting.data}
             */
            function beforeRequest(){
                var params = getBoundsWE(),clientData;
                clientData =  opts.onBeforeRequest&&opts.onBeforeRequest(params);
                return clientData ? false : J.mix(params,clientData);
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
                var i,key='';
                for(i in params){
                    key= key+i;
                }
                return key;
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
                html:'',
                onClick:null,
                onMouseOver:null,
                onMouseOut:null,
                onClick:null

            },opts;
            (function(){
                opts= J.mix(defOpts,option)

            })();
            function addOverlay(data){

            }
            function onClick(data){

            }
            function onMouseOver(data){


            }
            function onMouseOut(data){

            }

            /**
             *
             * @param data array
             */
            function addOverlays(data){
                var i,len=data.length;
                for(i=0;i<len;i++){

                }
            }

            /**
             * 为创建的Overlay创建参数
             */
            function buildParams(){

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
                target:null//触发对象

            },opts;
            (function(){
                opts = J.mix(defOpts,option);

            })();
            var data ={
                target:null//触发对象
            }

            /**
             * 发送的ajax请求变化
             */
            function ajaxChange(){

            }

            /**
             *
             */
            function overlayRemove(){

            }
            function overlayClick(){

            }
            function overlayMouseOver(){

            }
            function overlayMouseOut(){

            }
            function mapMoveStart(){

            }
            function mapMoveStop(){

            }
            function zoomChange(){

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
        return {

        }




    }


})(J);