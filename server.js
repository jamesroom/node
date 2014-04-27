var http = require("http"),
    URL = require("url"),
    util = require("util"),
    fs = require("fs"),
    analysis = require("./config/analysis"),
    socket = require('socket.io');

var server = http.createServer(function(request, response) {
    var paths = URL.parse(request.url,true);
    var path = paths.path.substring(1).replace('/','_');//解析带/变成_
    if(!path){
        response.writeHead(404);
        response.end('not found');
    }else{
        var controller,module,view;
       fs.exists('./controller/'+path+".js",function(isExist){
           /**
            * if the contorller have not exist.
            */
           if(!isExist){
                //直接读html
               fs.exists('./views/'+path+".html",function(isExist){
                   if(!isExist){
                       response.writeHead(404);
                       response.end('file not found');
                       return;
                   }else{
                       haveNoController();
                       return;
                   }

               });
            return;
           }

           if(typeof ((controller= require('./controller/'+path)) == "function")){
               module = require('./module/'+path);
               var result  = new controller(request,response,module);
               if(!result.view){
                   response.end();
               }
               view = './views/'+result.view+'.html';
               //解析view
               response.writeHead(200, {"Content-Type": "text/html"});
                var data = fs.readFile(view,"utf-8",function(err,data){
                    var data = analysis(data,result.data);
                    response.write(data)
                    response.end();

                });


           }else{
               haveNoController();
           }

           /**
            * if have no contorll or controll return a empty object;
            */
           function haveNoController(){

               fs.readFile('./views/'+path+".html","utf-8",function(err,data){
                   response.writeHead(200, {"Content-Type": "text/html"});
                   response.write(data)
                   response.end();

               });
           }
       });

    }
}).listen(8080,function(){
        console.log('server have been start');

    });
socket.listen(server).on('connection',function(socket){
    socket.on('msg',function(data){
        socket.broadcast.emit("user message",data);
    })
});


