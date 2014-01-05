var http = require("http"),
    router = require("./config/router"),
    URL = require("url"),
    util = require("util"),
    fs = require("fs");

http.createServer(function(request, response) {
    var paths = URL.parse(request.url,true);
    var path = paths.path.substring(1).replace('/','_');//解析带/变成_
    if(!path || !router[path]){
        response.writeHead(404);
        response.end('not found');
    }else{
        var controller,module,view;
        module= require('./module/'+router[path])
       fs.stat('./module/'+router[path]+".js",function(err,stat){
           if(err || !stat.isFile()){
               response.writeHead(404);
               response.end('file not found');
               return;
           }
           if( module ){
               module = typeof module == "function" ? new module(paths.query):module;
           }
           if(typeof (controller= require('./controller/'+router[path])) == "function"){
               console.log(module)
               controller.prototype = {module:module};
               controller = new controller(request,response);


               view = './views/index.html';
               //解析view

               response.writeHead(200, {"Content-Type": "text/html"});
             //  res.write("hello world");
              // res.end();
                var data = fs.readFile(view,"utf-8",function(err,data){
                    var obj1 = {
                        'view':'',
                        'data':{
                          'title':"JOCKJS API",
                           'dom':[
                               {title:'J.g("id")',text:"获取{id}的dom对象"}
                           ]
                        }

                    }
                    var obj1 = {
                        'view':'',
                        'data':function(){

                        }

                    }

                    response.write(data)
                    response.end();

                });


           }
       });

    }
}).listen(8000);
function analysis(data,obj){
    var i;
    for(i in obj){
        var tmp = obj[i];


    }
}
