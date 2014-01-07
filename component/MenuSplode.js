/**
 * Created by lunjiang on 14-1-7.
 */
function MenuSplode(opts){
    var defOpts = {
        id:'',
        onMouseOver:null,
        onMouseOut:null,
        time:1000
        },context,list,topR,botR,points=[];
    var POINT_LEN = 5;
    (function(){
        if(opts){
            var i;
            for(i in defOpts){
                defOpts[i] = opts[i];
            }
        }
        context = document.getElementById(defOpts.id);
        list= context.childNodes;

        var pos = getPostion();
        topR = {x:pos.x+pos.w,y:pos.y};
        botR = {x:topR, y:pos.y+pos.h};


    })();


    function bindEvent(){
        bind(document,'mousemove',function(e){
            var point = {
                x: e.x,
                y: e.y
            }
            points.length<POINT_LEN ? points.push(point):(points.shift(),points.push(point));
        });
        bind(list,'mouseover',function(){
            setTimeout(function(){
                if(defOpts.onMouseOver.call(this) === false) return;
            },getDelayTime())

        })
        bind(list,'mouseout',function(){
            setTimeout(function(){
                if(defOpts.onMouseOut.call(this)===false) return;
            },getDelayTime());
        })

    }

    /**
     * 当鼠标移到每一个菜单时触发的事件
     * @returns {number}
     */
    function getDelayTime(){
        
        return 0;
    }

    function  getPostion(){
        var offset = context.getBoundingClientRect();
        return {
            x:offset.left+document.documentElement.scrollLeft,
            y:offset.top+ document.documentElement.scrollTop,
            w:context.offsetWidth,
            h:context.offsetHeight
        }
    }




    /**
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function slope(a,b){
        return (b.y- a.y)/ (b.x- a.x);
    }

    function bind(elm,type,fun){
        if(!elm.nodeType){
            var i,len;
            for(i=0,len= elm.length;i<len;i++){
                if(elm[i].nodeType !=1){
                    continue;
                }
                bind(elm[i],type,fun)
            }
            return ;
        }

        if(document.addEventListener){
            elm.addEventListener(type,fun,false)
        }else{
            elm.attachEvent('on'+type,fun)
        }
        return false;
    }



}