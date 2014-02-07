/**
 * Created by kathleen on 14-1-25.
 */
J={
    /**
     * 支持传多个参数
     * @param fun
     * @param delay
     */
    
    setTimeout:function(fun,delay){
	var type = Object.prototype.toString.call(fun);
	if(type == '[object Function]'){
	    var argu = Array.prototype.slice(2,arguments);
	    var f= function(){
		    fun.apply(null,argu);
		}
	   return setTimeout(f,delay);
	}	
    }
}
