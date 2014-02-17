;
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