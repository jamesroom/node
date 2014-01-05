module.exports= function(req,res){

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("hello world");
    console.log(this)
    res.end();

}