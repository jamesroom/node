;(function(){
//this copy form top html


    $(document).ready(function(){
        $(".menuList>ul>li").click(function(){
            $(this).addClass("dq").siblings().removeClass("dq");
        });
    });



    //this copy form left html

    //说明 所有的元素以ul li ul li ul li的循环格式嵌套 如果没有下级分类 就用li a结束嵌套
    $(document).ready(function(){
//$(".nav ul li").children("ul").hide();
        $(".nav").find("li").not(":has(ul)").children("a").css({textDecoration:"none",color:"#333"})
            .click(function(){
               // $(this).get(0).location.href="'"+$(this).attr("href")+"'";
            });
        $(".nav").find("li:has(ul)").children("a").css({background:"url(images/statu_close.gif) no-repeat left top;"})
            .click(function(){
                if($(this).next("ul").is(":hidden")){
                    $(this).next("ul").show();
                    if($(this).parent("li").siblings("li").children("ul").is(":visible")){
                        $(this).parent("li").siblings("li").find("ul").hide();
                        $(this).parent("li").siblings("li:has(ul)").children("a").css({background:"url(images/statu_close.gif) no-repeat left top;"})
                            .end().find("li:has(ul)").children("a").css({background:"url(images/statu_close.gif) no-repeat left top;"});}
                    $(this).css({background:"url(images/statu_open.gif) no-repeat left top;"});
                    return false;
                }else{
                    $(this).next("ul").hide();
//不用toggle()的原因是为了在收缩菜单的时候同时也将该菜单的下级菜单以后的所有元素都隐藏
                    $(this).css({background:"url(images/statu_close.gif) no-repeat left top;"});
                    $(this).next("ul").children("li").find("ul").fadeOut("normal");
                    $(this).next("ul").find("li:has(ul)").children("a").css({background:"url(images/statu_close.gif) no-repeat left top;"});
                    return false;
                }
            });
    });


    /*向左收起代码*/
    $(function(){
        $(window).bind('resize',function(){
            $(".container").height($("body").height()-108);
            $(".r").width($("body").width()-225);
        });
        $(".container").height($("body").height()-108);
        $(".r").width($("body").width()-240);

    });


    $("#left_toggle").bind('click',function(){
        var leftBar = $("#left_bar");
        leftBar.toggle();
        $(".container").height($("body").height()-108);
        $(".r").width($("body").width()-leftBar.get()[0].offsetWidth-6);
    })


    /**
     * 以下是核心单开窗口事件
     */
    MenuPanel();
     ;function MenuPanel(){
        var defOpts = {
            selector:''
            },
            CACHE={},
            MenuBars,
            LOG,
            prePanel,
            container;
        (function init(){
            container = $(".r").eq(0);
            LOG = new log();
            MenuBars = MenuBar(LOG);
            bindEvent();
        })();
        function buildKey(src){
            //正则表达，过滤掉
            var key = src.replace(/[\/\\\.]/g,'_');
            return key;
        }

        function bindEvent(){
            $(".item_open").bind('click',function(e){
                var target = $(e.target);
                var src = target.attr("data-href");
                showPanel(src,target.html());
                MenuBars.addItem(src,target.html());
            });
            $(document).bind( "showPanel",function(e,key){
                showPanel(key);
            });

            $(document).bind( "removePanel",function(e,key){
               closePanel(key);
            });
        }



        function closePanel(key){
            var recentKey = LOG.remove(key);
            CACHE[key]&&CACHE[key].remove();
            CACHE[key] = null;
            delete CACHE[key];
            if(recentKey){
                CACHE[recentKey].show();
                prePanel = CACHE[recentKey];
            }


        }
        //显示窗口
        function showPanel(src,name){
            var key = buildKey(src);
            prePanel&&prePanel.hide();
            prePanel = CACHE[key]?CACHE[key].show():create(src);
        }

       function create(src){
           var key = buildKey(src);
           var dom = $('<div class="block_iframe"><iframe frameborder="0" width="100%" height="100%" src="'+src+'"></iframe></div>');
           dom.appendTo($(".r").eq(0));
           CACHE[key] = dom;
           LOG.add(key);
           return dom;
       }



        /**
         * 用于记录最近开的tab
         * @param key
         * @returns {{add: add, remove: remove}}
         */
        function log(key){
            var LOG = [];
            function add(key){
                var inx = jQuery.inArray(key,LOG)
                if(inx>-1){
                    LOG.splice(inx,1)
                }
                LOG.push(key);
                return key;
            }
            //删除key,返回最近打开的key
            function remove(key){
                $.each(LOG,function(k,v){
                    (v === key)&&LOG.splice(k,1)
                })

                return LOG.length ? LOG[LOG.length-1]:false;

            }
            return {
                add:add,
                remove:remove
            }
        }


        /**
         * 用于管理菜单项事件
         * @constructor
         */
        function MenuBar(log){
            var menuContainer,
                menuBars={},
                LOG;

            ;(function(){
                menuContainer = $(".menuList ul").eq(0);
                LOG = log;
                bindEvent();
            })();
            function bindEvent(){
                $(".close").live('click',function(e){
                    var key = $(e.target).attr("data-key");
                    removeItem(key);
                    e.stopPropagation();
                })
                $(".menuList li").live('click',function(e){
                    var key =  $(this).attr('data-key');
                    activeItem(key);
                    hideItem(key);
                    $(document).trigger( "showPanel",key);
                })
            }

            /**
             *
             **/
            function addItem(src,name){
                var key = buildKey(src);
                if(menuBars[key]){
                    activeItem(key);
                    hideItem(key);
                    return;
                }
                var dom = document.createElement("li");
                dom.className="dq";
                dom.setAttribute('data-key',key);
                dom.innerHTML='<a href="javascript:void(0)">'+name+
                    '<i class="close" data-key="'+key+'" onclick=""></i></a>'
                menuContainer.append(dom)

                dom = $(dom);
                //console.log($(d0.append(html));
                menuBars[key] = dom;
                activeItem(key);
                hideItem(key);
                return dom;

            }
            function removeItem(key){
                var rectKey = LOG.remove(key);
                menuBars[key]&&menuBars[key].remove();
                menuBars[key] = null;
                delete menuBars[key];
                $(document).trigger( "removePanel",key);
                rectKey&&activeItem(rectKey);
            }

            function activeItem(key){
                LOG.add(key);
                menuBars[key]&&menuBars[key].addClass("dq");
            }

            function hideItem(key){
                $.each(menuBars,function(k,v){
                    (k !== key) && v.removeClass('dq');
                });
            }
            //alert(1);
            return {
                addItem:addItem
            }
        }













    }







})();