/**
 *
 * @param html 字符串
 * @param obj json格式
 * @returns {*}
 */
module.exports=function (html,obj){
    var i,
        regtxt=["<%\\s*",null,"\\s*%>"],//匹配单个
        blockBegainReg = ["<%\\s*",null,"\\s*begain\\s*%>"],
        blockEndReg = ["<%\\s*",null,"\\s*end\\s*%>"],parent = arguments.callee;
    for(i in obj){
        regtxt[1] = i;
        if(obj[i] instanceof Array){
            blockBegainReg[1]=blockEndReg[1] =i;
            var tmpReg = new RegExp(blockBegainReg.concat(["([\\s\\S]*)"],blockEndReg).join(''),'g');
            html = html.replace(tmpReg,function(p1,p2){
                if(p2){
                    var j= 0,str='';
                    for(j=0;j<obj[i].length;j++){
                        str = str +parent(p2,obj[i][j])
                    }
                    return str;
                }
                return '';
            });
        }else{
            var reg = new  RegExp(regtxt.join(''),'g');
            html = html.replace(reg,obj[i]);
        }
    }
    return html;
}

