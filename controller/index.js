module.exports= function(req,res,module){
    var obj1 = {
        'view':'index',
        'data':{
            'title':"JOCKJS API",
            'item':[
                {item_title:'J.g("id")',item_text:"获取{id231}的dom对象"},
                {item_title:'J.g("id")',item_text:"获取{id123123}的dom对象"},
                {item_title:'J.g("id")',item_text:"获取{id123123132}的dom对象"}
            ]
        }

    };
    return obj1;

}