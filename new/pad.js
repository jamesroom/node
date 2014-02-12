;
/// require('map.Core');

(function(){
   function pad(opption){
       var defOpts ={
           url:'',
           id: "jmap_fill",
           lat: "31.230246775887",
           lng: "121.48246298372",
           mark: 0,
           zoom: 14,
           ezoom: 1,
           minz: 10,
           maxz: 18
       },opts,elm;
       function init(){
           opts = J.mix(defOpts,opption);
           elm = document.getElementById(opts.id);
           if(!elm)return;
           showContent();
           bindEvent();
           var map =  J.map.core(opts);
       }
       init();
        function showContent(){
            elm.style.height = J.page.viewHeight() - J.g('header').height() + 'px';
        }
       function bindEvent(){
           window.onresize = showContent;
           return
           J.g(window).on('resize',showContent);
       }




   }
    pad();
})();