function stack(callback){
    var ret = {};
    var guid = 0;
    var num=0;
    var callback=callback;
    function getCallback(name,fn){
        var key;
        if(Object.prototype.toString.call(name)=='[object Function]'){
            fn = name;
            key = guid;
        }else{
            key = ret[name] === undefined ? name:guid;
        }
        ret[key] = undefined;
        guid++;
        ret.count = guid;
        return function(data){
            ret[key] = data;
            num++;
            ret.length = num;
            fn&&fn(data,ret);
            if(num==guid)callback&&callback(ret);
        };
    }
    return {
        getCallBack:getCallback
    }
}

