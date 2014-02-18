;
/// require('map.Core');
(function(){
   function pad(opption){
       var defOpts ={
           url:'http://shanghai.release.lunjiang.dev.anjuke.com/newmap/search2',
           id: "jmap_fill",
           lat: "31.230246775887",
           lng: "121.48246298372",
           mark: 0,
           zoom: 12,
           ezoom: 1,
           minz: 11,//最小缩放等级
           maxz: 18,//最大缩放等级
           onBeforeRequest:beforeRequest,
           onResult:onResult,
           onItemBuild:onItemBuild,
           target:document
       },opts,map,
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

           map =  J.map.core(opts);
           bindEvent();

           console.log(map)
           //map.getData();
       }
       init();
       function bindEvent(){
           J.on(window,'resize',function(){
               buildContainer();
               buildList();
           });
           J.on(opts.target,map.eventType.overlay.click,function(data){
               alert(1);
               console.log(data);
           })
       }
       function beforeRequest(data){
           //points.swlat + "," + points.nelat + "," + points.swlng + "," + points.nelng;
           return J.mix(data,{
               model:1,
               order:null,
               p:1,
               bounds:data.swlat + "," + data.nelat + "," + data.swlng + "," + data.nelng,
               zoom:13
           })
       }
       function onResult(data){
           return data.groups;
       }
       function onItemBuild(item){
           item.html = '<div class="OverlayCom OverlayA"><b>'+item.areaName+'</b><br/><p>'+item.propCount+'</p></div>';
           return item;
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
          // buildProgress();

           return elm;
       }


      /* function buildProgress(){
           var progress =J.create('div',{
                   id:'progrss'
               }).appendTo(J.g("pad_view"));
           progress.setStyle({
               width:'100%',
               height:'100%',
               zIndex:'1'

           });
           var html ='<div class="pace pace-active"><div class="pace-progress" data-progress="50" data-progress-text="50%" style="width: 50%;"><div class="pace-progress-inner"></div></div><div class="pace-activity"></div></div>';
           progress.html(html);
       }*/

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