/*
 * ------------------------------------------
 * JSON编解码接口实现文件
 * https://github.com/douglascrockford
 * @version  1.0
 * @author   douglascrockford
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _p = NEJ.P('window.JSON');
    if (!!_p.parse||!!_p.stringify) return;
    /**
     * http://www.JSON.org/json2.js
     * [code]
     *   var contact = new Object();
     *   contact.firstname = "Jesper";
     *   contact.surname = "Aaberg";
     *   contact.phone = ["555-0100", "555-0120"];
     *   var memberfilter = new Array();
     *   memberfilter[0] = "surname";
     *   memberfilter[1] = "phone";
     *   var jsonText = JSON.stringify(contact, memberfilter, "\t");
     *   document.write(jsonText);
     *   // Output: 
     *   // { "surname": "Aaberg", "phone": [ "555-0100", "555-0120" ]
     * [/code]
     * @api    {JSON.stringify}
     * @params {Object|Array} value 必需 要转换的JavaScript值（通常为对象或数组）
     * @params {Function|Array} replacer
     * 可选 转换结果的函数或数组
     * 如果 为一个函数，则 JSON.stringify 会调用该函数，并传入每个成员的键和值 使用返回值而不是原始值 如果此函数返回 undefined，则排除成员 根对象的键是一个空字符串：""
     * 如果 为一个数组，则仅转换该数组中具有键值的成员 成员的转换顺序与键在数组中的顺序一样 当 value 参数也为数组时，将忽略 replacer 数组
     * @params {String|Number} 
     * 可选 向返回值 JSON 文本添加缩进、空白和换行符以使其更易于读取
     * 如果省略 ，则将生成返回值文本，而没有任何额外空白
     * 如果 为一个数字，则返回值文本在每个级别缩进指定数目的空格 如果 大于 10，则文本缩进 10 个空格
     * 如果 是非空字符串（例如“\t”），则返回值文本在每个级别中缩进字符串中的字符数
     * 如果 是长度大于 10 个字符的字符串，则使用前 10 个字符
     * @return {String} 一个包含 JSON 文本的字符串
     */
    _p.stringify=(function(){'use strict';function f(n){return n<10?'0'+n:n;};if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var C=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,t,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},H;function quote(string){C.lastIndex=0;return C.test(string)?'"'+string.replace(C,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';};function V(key,h){var i,O,l,length,R=t,L,value=h[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof H==='function'){value=H.call(h,key,value);}switch(typeof value){case 'string':return quote(value);case 'number':return isFinite(value)?String(value):'null';case 'boolean':case 'null':return String(value);case 'object':if(!value){return 'null';}t+=indent;L=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){L[i]=V(i,value)||'null';}l=L.length===0?'[]':t?'[\n'+t+L.join(',\n'+t)+'\n'+R+']':'['+L.join(',')+']';t=R;return l;}if(H&&typeof H==='object'){length=H.length;for(i=0;i<length;i+=1){if(typeof H[i]==='string'){O=H[i];l=V(O,value);if(l){L.push(quote(O)+(t?': ':':')+l);}}}}else{for(O in value){if(Object.prototype.hasOwnProperty.call(value,O)){l=V(O,value);if(l){L.push(quote(O)+(t?': ':':')+l);}}}}l=L.length===0?'{}':t?'{\n'+t+L.join(',\n'+t)+'\n'+R+'}':'{'+L.join(',')+'}';t=R;return l;}};return function(value,J,space){var i;t='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}H=J;if(J&&typeof J!=='function'&&(typeof J!=='object'||typeof J.length!=='number')){throw new Error('JSON.stringify');}return V('',{'':value});};})();
    /**
     * https://github.com/douglascrockford/JSON-js json_parse.js
     * 字符串转成对象
     * [code]
     *   var jsontext = '{"firstname":"Jesper","surname":"Aaberg","phone":["555-0100","555-0120"]}';
     *   var contact = JSON.parse(jsontext);
     *   document.write(contact.surname + ", " + contact.firstname);
     *   // Output: Aaberg, Jesper
     * [/code]
     * 加上特殊的过滤器
     * [code]
     * var jsontext = '{ "hiredate": "2008-01-01T12:00:00Z", "birthdate": "2008-12-25T12:00:00Z" }';
     * var dates = JSON.parse(jsontext, dateReviver);
     * document.write(dates.birthdate.toUTCString());
     * function dateReviver(key, value) {
     *     var a;
     *     if (typeof value === 'string') {
     *         a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
     *         if (a) {
     *             return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
     *             +a[5], +a[6]));
     *         }
     *     }
     *     return value;
     * };
     * // Output:
     * // Thu, 25 Dec 2008 12:00:00 UTC
     * [/code]
     * @api    {JSON.parse}
     * @params {String} 一个有效的 JSON 字符串
     * @params {Function}
     * 可选 一个转换结果的函数 将为对象的每个成员调用此函数 如果成员包含嵌套对象，则先于父对象转换嵌套对象 对于每个成员，会发生以下情况：
     * 如果 reviver 返回一个有效值，则成员值将替换为转换后的值
     * 如果 reviver 返回它接收的相同值，则不修改成员值
     * 如果 reviver 返回 null 或 undefined，则删除成员
     * @return {Object|Array} 一个对象或数组
     */
    _p.parse=(function(){'use strict';var at,ch,escapee={'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'},text,error=function(m){throw{name:'SyntaxError',message:m,at:at,text:text};},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'");}ch=text.charAt(at);at+=1;return ch;},number=function(){var number,string='';if(ch==='-'){string='-';next('-');}while(ch>='0'&&ch<='9'){string+=ch;next();}if(ch==='.'){string+='.';while(next()&&ch>='0'&&ch<='9'){string+=ch;}}if(ch==='e'||ch==='E'){string+=ch;next();if(ch==='-'||ch==='+'){string+=ch;next();}while(ch>='0'&&ch<='9'){string+=ch;next();}}number= +string;if(!isFinite(number)){error("Bad number");}else{return number;}},string=function(){var hex,i,string='',uffff;if(ch==='"'){while(next()){if(ch==='"'){next();return string;}if(ch==='\\'){next();if(ch==='u'){uffff=0;for(i=0;i<4;i+=1){hex=parseInt(next(),16);if(!isFinite(hex)){break;}uffff=uffff*16+hex;}string+=String.fromCharCode(uffff);}else if(typeof escapee[ch]==='string'){string+=escapee[ch];}else{break;}}else{string+=ch;}}}error("Bad string");},white=function(){while(ch&&ch<=' '){next();}},word=function(){switch(ch){case 't':next('t');next('r');next('u');next('e');return true;case 'f':next('f');next('a');next('l');next('s');next('e');return false;case 'n':next('n');next('u');next('l');next('l');return null;}error("Unexpected '"+ch+"'");},value,array=function(){var array=[];if(ch==='['){next('[');white();if(ch===']'){next(']');return array;}while(ch){array.push(value());white();if(ch===']'){next(']');return array;}next(',');white();}}error("Bad array");},object=function(){var key,object={};if(ch==='{'){next('{');white();if(ch==='}'){next('}');return object;}while(ch){key=string();white();next(':');if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"');}object[key]=value();white();if(ch==='}'){next('}');return object;}next(',');white();}}error("Bad object");};value=function(){white();switch(ch){case '{':return object();case '[':return array();case '"':return string();case '-':return number();default:return ch>='0'&&ch<='9'?number():word();}};return function(source,reviver){var result;text=source;at=0;ch=' ';result=value();white();if(ch){error("Syntax error");}return typeof reviver==='function'?(function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}({'':result},'')):result;};}()); 
};
NEJ.define('{lib}util/encode/json.js',
          ['{lib}base/global.js'],f);