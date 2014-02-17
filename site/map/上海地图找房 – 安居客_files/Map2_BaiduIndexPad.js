/**
 * Created with JetBrains PhpStorm.
 * User: zhanghanhui
 * Date: 13-12-26
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */
J.ready(function(){
    padNav();
    /*pad的导航*/
    function padNav(){

        var tool = J.g('h_tool'),
            tool_background = J.g('h_tool_background');  //蒙层
        
        bindEvent();
        /*事件绑定*/
        function bindEvent(){
            var toolIcon = J.g('h_toolIcon'),    //开按钮
                cityBtn = J.g('h_oC_a_city'), //城市列表按钮
                toolBtn = J.g('h_toolBtn');      //关按钮
                citylist = J.s(".h_m_city").eq(0); //city list

            toolIcon&&toolIcon.on('touchend',function(e){
                showSideNav();
            },false);

            toolBtn&&toolBtn.on('touchend',function(e){
                hideSideNav();
                hideCityList();
            },false);

            cityBtn && cityBtn.on('click',function(e){
                J.s(".h_m_city").eq(0).get().style["display"] == "none" ? showCityList() : hideCityList();
                e.preventDefault();
                e.stopPropagation();
            },false);
            //给蒙层添加事件
            tool_background&&tool_background.on('touchend',function(e){
                hideSideNav();
                hideCityList();
                e.preventDefault();//防止点击到list
            },false);
            //tool fixed
            tool && tool.on("touchmove",function(e){
                e.preventDefault();
                e.stopPropagation();
            });
            citylist.on("touchmove",function(e){
                e.stopPropagation();
            });
            /*hack*/
            tool_background&&tool_background.on('touchmove',function(event){
                event.preventDefault();
                event.stopPropagation();
            },false);
        }

        /* 显示side导航*/
        function showSideNav(){
            tool&&tool.addClass('h_t_show');
            tool_background&&tool_background.addClass('h_t_bg_show');
        }
        /* 隐藏side导航*/
        function hideSideNav(){
            tool&&tool.removeClass('h_t_show');
            tool_background&&tool_background.removeClass('h_t_bg_show');
        }
        // control citylist show and hidden 
        function showCityList(){
            J.s(".h_m_city").eq(0).get().style["display"] = "block";
            J.s(".h_m_arrow").eq(0).get().style["display"] = "block";
        }
        function hideCityList(){
            J.s(".h_m_city").eq(0).get().style["display"] = "none";
            J.s(".h_m_arrow").eq(0).get().style["display"] = "none";
        }
    }

});;
(function(w){
    init();
    function init(){
        search();
    }
    function search(){
        var ipt = J.g('p_search_input'),
            pHd = J.g('p_header'),
            shade_bg=J.g('shade_bg'),
            cancel_search = J.g('p_cancel_search'),
            del_searchWord = J.g('p_delete_searchWord'),
            p_search_result_con = J.g('p_search_result_con'),
            p_search_btn = J.g('p_search_button'),
            p_mainCon = J.g('p_main'),
            _scrollTopHei, //屏幕滚动的距离
            _iptSearchValue="", //下次搜索之前的搜索词，用于判断用户点击了取消之后还会出现
            _defListSearchWord="", //默认列表页，取消搜索时记录输入的关键字
            _trackInput=false        //判断是否发送了search input的
            ;
        searchAutoComplete(ipt);//初始化autoComplete
        ipt&&ipt.on('click', function(){
            goToSearch();
        });
        cancel_search&&cancel_search.on('click',function(){
            goToMainPage();

        });
        shade_bg&&shade_bg.on('click',function(){
            goToMainPage();
        });
        del_searchWord.on('click',function(){
            delete_searchWord();
        });
        shade_bg.down(0).on('touchstart',function(){
            ipt.get().blur();
        });
        /*autoComplete组件使用*/
        function searchAutoComplete(elm){
            var data_type,
                is_contain_num = null,
                cid = J.g('currentcityid').val(),
                r = {
                    width: 500,
                    params: {
                        c:cid,
                        n:10,
                        g:1
                    },
                    offset:{
                        x: 0,
                        y: 0
                    },
                    autoSubmit:false,
                    url: J.g("search_baseUrl").html() + "ajax/indexautocomplete",
                    tpl: "autocomplete_ajk_pad", //设置的class
                    boxTarget: function(){
                        return J.g('p_search_result_con');
                    },
                    itemBuild:function(item){
                        var number = is_contain_num ?  item.keyword + '<i>约' + item.num + '套</i>' : item.keyword ;
                        return {
                            l:number,
                            v:item.keyword
                        }
                    },
                    source: function(params, response){
                        if(elm.attr("placeholder").trim() === elm.val().trim()){
                            return;
                        }
                        data_type =  3;//好租房源
                        params.t = data_type;
                        if(params.t != 0){
                            try{
                                window.global = global || {};
                            }catch(e){
                                window.global = {};
                            }
                            window.global.callbackGetListAutocomplete=function(data){
                                if(data){
                                    is_contain_num = data&&data.is_contain_num; //是否有右侧的个数
                                    var data = data&&data.list;
                                    response( data);
                                }
                                else{
                                    response( [] );
                                }
                            }
                            J.get({
                                url:this.url,
                                type:'jsonp',
                                data:params,
                                callback:'global.callbackGetListAutocomplete'
                            });

                        }
                    },
                    onKeyUp:function(elm){
                        if(elm.val() !='' && elm.val() != elm.attr('placeholder').trim()){
                            del_searchWord.show();
                        }else{
                            del_searchWord.hide();
                        }
                    },
                    onSelect:function(data){
                        elm.val(data.v.replace(/<[^>]+>/g,""));
                        J.g('search_pre_tip')&&J.g('search_pre_tip').show();
                        J.g("global_search_form")&&J.g("global_search_form").submit();
                    }
                    /*onFocus:function(elm){

                     },
                     onBlur:function(){

                     },
                     onChange:function(elm){

                     }*/
                };
            return elm.autocomplete(r);
        }
        /*点击取消搜索要执行的方法*/
        function goToMainPage(){
            _trackInput = false;
            trackEvent(J.g('p_cancel_search').attr('data-event'))
            p_mainCon.show();
            window.scrollTo(0,_scrollTopHei); //页面设置到点击前状态
            shade_bg.hide();
            del_searchWord.hide();
            cancel_search.hide();
            pHd.setStyle({position:'absolute'}); //将fixed的定位去掉
            ipt.up(1).removeClass('h_s_focus'); //给整个搜索form加新的样式
            ipt.removeClass('h_s_ipt_focus');
            p_search_btn.removeClass('h_s_btn_focus');
            ipt.get().blur();
            _defListSearchWord = ipt.val().replace(/(^\s*)/g,""); //将取消搜索的文字记录
            ipt.val(_iptSearchValue);//将搜索词记录
        }

        /*点击删除图标需要执行的方法*/
        function delete_searchWord(){
            ipt.val('');
            del_searchWord.hide();
            ipt.get().focus();
        }

        /*点击搜索需要执行的操作*/
        function goToSearch(){
            if(!_trackInput){
                trackEvent(J.g('p_search_input').attr('data-event')); //加track，取点击次数
                _trackInput = true;

            }
            p_mainCon.hide();
            _scrollTopHei = J.W.scrollY;
            window.scrollTo(0,0); //for pad1
            //shade_bg.setStyle({'height':document.height+'px'}); //设置背景层的高度，全部遮盖
            shade_bg.show();
            cancel_search.show();
            pHd.setStyle({position:'static'}); //将fixed的定位去掉
            ipt.up(1).addClass('h_s_focus'); //给整个搜索form加新的样式
            ipt.addClass('h_s_ipt_focus');
            p_search_btn.addClass('h_s_btn_focus');
            if(ipt.val().replace(/(^\s*)/g,"")!==""){ //如果有搜索词，则出现删除
                del_searchWord.show();
                _iptSearchValue = ipt.val();//将搜索词记录
            }
            else{
                ipt.val(_defListSearchWord); //如果没有关键词，将上次搜索的词记录
            }
        }
    }
}(J.W));
;
window.PadSelecter = window.PadSelecter || {};
function PadSelecter(select_id){
    var ps = PadSelecter;
    ps.select_id = select_id;
    ps.select_body = J.g(select_id);
    ps.categorys = ps.select_body&&ps.select_body.s('.category');//下拉菜单
    ps.showing_list = false;//正在显示菜单
    ps.showing_option_up = false;//正在显示一级分类
    ps.showing_option_sub = false;//正在显示的二级option
    //阻止selecter冒泡
    ps.select_body&&ps.select_body.on('touchmove',function(e){
        e.stopPropagation();
    });
    //绑定下拉菜单事件
    ps.categorys&&ps.categorys.each(function(i,v){
        bound_list(v);//绑定列表弹出
        //判断是否二级菜单
        if(v.attr('level')){
            //绑定分类事件
            var option_box = v&&v.s('.option_box');
            var option_box_second = v&&v.s('.option_box_second');
            option_box&&option_box.eq().s('.option').each(function(k,w){
                bound_option_up(w,option_box_second[k]&&option_box_second.eq(k),k);
            });
            //绑定option事件
            v&&v.s('.option_box_second .option').each(function(k,w){
                bound_option(w);
            });
        }else{
            //绑定option事件
            v&&v.s('.option').each(function(k,w){
                bound_option(w);
            });
        }

    });

  //绑定弹出选项事件
  function bound_list(v){
      v&&v.on('click',function(e){
            J.g("head_menu_con")&&J.g("head_menu_con").hide();
            option_switch(v);
            //ps.bg&&ps.bg.show();
            e.stopPropagation();
        });
      v&&v.on('touchend',function(e){
          e.stopPropagation();
      });
      v&&v.get().focus();
  }
    //绑定打开连接事件
  function bound_option(v){
      //初始化普通菜单
      if(v&&v.attr('selected')){
            var selected_title = v.eq().html();
            //v&&v.up(2).down().html(selected_title);
            v&&v.eq().html(selected_title+'　√');
      }
      //绑定连接打开事件
      v&&v.on('click',function(e){
          v.addClass('select');
          setTimeout(function(){
              v.removeClass('select');
              option_switch(false);
          },500)
          window.location.href = v.attr('v');
          return false;
      });
      v&&v.on('touchend',function(e){
          e.stopPropagation();
      });
      v&&v.get().focus();
    }
  //绑定二级菜单的筛选事件
  function bound_option_up(v,o,k){
      var icon_on = v.up(1).s('.icon2').eq();
      //初始化二级菜单
      if(v&&v.attr('selected')){
          v&&v.addClass('select_up');
          o&&o.show();
          ps.showing_option_up = v&&v;
          ps.showing_option_sub= o&&o;
          //初始化箭头样式
          if(k==0){
              icon_on&&icon_on.addClass('icon_on');
          }
    }
      v&&v.on('click',function(e){
          //隐藏上一个筛选想背景和二级菜单
          ps.showing_option_up&&ps.showing_option_up.removeClass('select_up');
          ps.showing_option_sub&&ps.showing_option_sub.hide();
          //显示筛选想背景和二级菜单
          o&&o.show();
          o&&o.get().focus();
          v&&v.addClass('select_up');
          //保存删选结果
          ps.showing_option_up = v&&v;
          ps.showing_option_sub= o&&o;
          //改变箭头样式
          if(k===0){
              icon_on&&icon_on.addClass('icon_on');
          }else{
              icon_on&&icon_on.removeClass('icon_on');
          }
          e.stopPropagation();
      });
    }
    //body绑定关闭窗口事件
    J.on(document.body,'touchend',function(e){
        option_switch(false);
        document.activeElement.focus();
        e.stopPropagation();
    });
    /**普通菜单开关select*/
    function option_switch(v){
        if(v==ps.showing_list){
            v&&v.down(2).hide();
            ps.showing_list = false;
        }else{
            ps.showing_list&&ps.showing_list.down(2).hide();
            v&&v.down(2).show();
            v&&v.get().focus();
            ps.showing_list = v&&v;
        }
    }
    window.option_switch = option_switch;
}/**
 * Created with JetBrains PhpStorm.
 * User: zhanghanhui
 * Date: 13-12-10
 * Time: 下午8:29
 * To change this template use File | Settings | File Templates.
 */

function usercenter_count_favorite_header(){
    var coUrl=user_anjuke_favorite_header + "ajax/favorite/count_favorite";
    J.get({url:coUrl,type:'jsonp',data:{time:Math.random()},callback:'usercenter_count_favorite_success_header'});
}
function usercenter_count_favorite_success_header(result){
    if(result && result.code==0){
        if(result.num){
            J.g("myFavorite_header").html(result.num);
            J.g("p_myFavorite_Link").removeClass("h_f_a_n");
        }
    }
}
(function(){
	if(J.g("myFavorite_header")){
		usercenter_count_favorite_header();
	}
})();/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;
function isRetina() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5)";
    if (window.devicePixelRatio > 1)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;
    return false;
}

function showGreatImgs(target_id) {
    if(target_id){
        var imgs = document.getElementById(target_id)&&document.getElementById(target_id).getElementsByTagName("img");
    }else{
        var imgs = document.getElementsByTagName("img");
    }
    if(!imgs){
        return;
    }
    var retina = isRetina();
    for ( var i = 0; i < imgs.length; i++) {
        var rsrc = imgs[i].getAttribute("r-src");
        if (retina && rsrc && rsrc.match(/display/i) == 'display') {
            rsrc = rsrc.replace(/(\d{2,4}x\d{2,4}.*)(\.jpg)/i, "$1@2x$2");
        }
        imgs[i].setAttribute("src", rsrc);
    }
}function dw_add_link_from(target_id,tagOne,tagTwo,tagThree){
	var reg=/^http:\/\/./;
	if(target_id){
		var a = document.getElementById(target_id).getElementsByTagName("a");
	}else{
		var a = document.getElementsByTagName("a");
	}
    for(var i=0;i<a.length;i++){
        var soj = a[i].getAttribute(tagOne);
        var spd = a[i].getAttribute(tagTwo);
        var dvc = a[i].getAttribute(tagThree);
        //dvc = dvc ? dvc : 'ipad';//前期切流量，为了知道是这10%，所有A标签都加这个参数
        var isSoj = soj!=null && soj != "" ? true : false;
        var isSpd = spd!=null && spd != "" ? true : false;
        var isDvc = dvc!=null && dvc != "" ? true : false;

        if(isSoj || isSpd || isDvc){
            var url = a[i].href;
            if(!url.match(reg)) continue;
            soj = encodeURIComponent(soj);

            var plusLink = '';
            var u_params = new Array();
            if(isSpd && (url.indexOf('spread=') == -1)){
            	plusLink += 'spread='+spd;
            	u_params.push('spread');
            }
            if(isSoj && (url.indexOf('from=') == -1)){
            	if(plusLink){
            		plusLink += '&';
            	}
            	plusLink += 'from='+soj;
            	u_params.push('from');
            }
            if(isDvc &&  (url.indexOf('device=') == -1)){//所有a标签都添加device参数
            	if(plusLink){
            		plusLink += '&';
            	}
            	plusLink += 'device='+dvc;
            	u_params.push('device');
            }

            if(plusLink){
            	var u = url.split("#");
            	if(url.indexOf("?")!=-1){
                    url = u[0]+"&"+plusLink;
                }else{
                    url = u[0]+"?"+plusLink;
                }
            	if(u.length>1){
                    for(var j=1;j<u.length;j++){
                        url+="#"+u[j];
                    }
                }
            }

            a[i].href = ' '+ url;
        }
    }
}
(function(){
    dw_add_link_from('','_soj','_spd','_dvc');
}.ready());
/**
 *
 * @param page
 * @param customparam
 */
    (function(){
        FavoritePad();
    }())
function FavoritePad(options){
    var defaultOptions = {
            target:null, //作用的对象
            class:null,
            life:86400000,//设置复活间隔
            //life:0,
            onShow:null,
            onHide:null,
            onClose:null
        },
        UA_STASH_DEF = {
            title:'添加安居客到桌面',
            disc1:'请点击',
            disc2:'并选择 "添加到主屏幕"',
            class:'p_favorite',
            icon:''
        },
        UA_STASH = {
            iPadSafari6: J.mix(UA_STASH_DEF,{icon:'safari6'},true),
            iPadSafari7:J.mix(UA_STASH_DEF,{icon:'safari7'},true)
        },
        opts = {};
    (function(){
        opts = J.mix(defaultOptions, options || {}, true);
        var date = new Date(),
            tipsEmp = getStorage('tipsEmp'),
            flag = tipsEmp?(parseInt(date.valueOf()) - parseInt(tipsEmp))>parseInt(opts.life):true;
        if(getStorage('tips')!==1&&flag){ //如果没有被擦掉，则继续显示提示框
            createTip();
            setStorage('tipsEmp',date.valueOf());
        }
    })();
    function createTip(){
        var bro = getUaKey()?UA_STASH[getUaKey()]:false;
        if(bro){
            var tpl = '<div class='+bro.class+'_content'+'><b class='+bro.class+'_arrow'+'></b><span class='+bro.class+'_close'+'>╳</span><p>'+bro.title+'</p><p>'+bro.disc1+'</p><i class='+bro.icon+'></i><p>'+bro.disc2+'</p></div>',
                tip = J.create('div',{
                    class:bro.class,
                    'data-event':'padFavoriteClose'
                }).html(tpl).appendTo(opts.target||'body');
            bindEvents(tip);
        }
    }
    function getStorage(key){
        if(localStorage){
            return localStorage[key]?localStorage[key]:0;
        }
    }
    function setStorage(key,value){
        if(localStorage){
            try{localStorage[key] = value;}catch(e){};
        }
    }
    //get the browser
    function getUaKey(){
        var ua = J.ua.ua.replace(/\s/g,'');//将ua里面的空格去掉
        //for iPad 自带safari
        if(ua.match(/Mac.*OS.*Version\/[456].*Mobile.*Safari/i)){
            return 'iPadSafari6';
        }
        else if(ua.match(/Mac.*OS.*Version\/7.*Mobile.*Safari/i)){
            return 'iPadSafari7';
        }
    }
    function bindEvents(tip){
        tip.s('span').eq(0).on('click',function(){
            tip.hide();
            setStorage('tips',1);
            trackEvent(tip.attr('data-event'));
            return;
        });
        setTimeout(function(){ //如果没有点击关闭，则10s之后
            tip.hide();
            var date = new Date();
        },10000);

    }
}
;PadSelecter('filter_condition');/**
 * Created with JetBrains PhpStorm.
 * User: kathleen
 * Date: 14-2-17
 * Time: 上午11:41
 * To change this template use File | Settings | File Templates.
 */
    (function(){}).require(['map.pad'],'');