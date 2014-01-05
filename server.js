var http = require("http"),
    router = require("./config/router"),
    URL = require("url");

http.createServer(function(request, response) {
    var paths = URL.parse(request.url,true);
    var path = paths.path.substring(1).replace('/','_');//解析带/变成_
    if(!path || !router[path]){
        response.writeHead(404,'服务器未找到相关资源');
    }else{
        var controller,module,view;
        module= require('./module/'+router[path])
        console.log(typeof module)
        if( module ){
            module = typeof module == "function" ? new module(paths.query):module;
        }
        if(typeof (controller= require('./controller/'+router[path])) == "function"){
            controller.module= module;
            controller.call(module,request,response)
          //  new controller(request,response);
        }

    }




}).listen(8000);
console.log("this is server ");
