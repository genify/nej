/*
 * ------------------------------------------
 * 通用接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/util */
NEJ.define([
    './global.js',
    '{platform}util.js'
],function(NEJ,_h,_p,_o,_f,_r){
    /*
     * 查看数据是否指定类型
     * @param  {Variable} 数据
     * @param  {String}   类型
     * @return {Boolean}  是否指定类型
     */
    var _isTypeOf = function(_data,_type){
        try{
            _type = _type.toLowerCase();
            if (_data===null) return _type=='null';
            if (_data===undefined) return _type=='undefined';
            return _o.toString.call(_data).toLowerCase()=='[object '+_type+']';
        }catch(e){
            return !1;
        }
    };
    /**
     * 判断是否函数类型
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isFunction(123);
     *     // 返回true
     *     var is = _u._$isFunction(fucntion(){});
     * });
     * ```
     *
     * @method module:base/util._$isFunction
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否函数类型
     */
    _p._$isFunction = function(_data){
        return _isTypeOf(_data,'function');
    };
    /**
     * 判断是否字符串
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isString(123);
     *     // 返回true
     *     var is = _u._$isString("123");
     * });
     * ```
     *
     * @method module:base/util._$isString
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否字符串
     */
    _p._$isString = function(_data){
        return _isTypeOf(_data,'string');
    };
    /**
     * 判断是否数字
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isNumber("123");
     *     // 返回true
     *     var is = _u._$isNumber(123);
     *     var is = _u._$isNumber(-123);
     *     var is = _u._$isNumber(Number.MAX_VALUE);
     * });
     * ```
     *
     * @method module:base/util._$isNumber
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否数值类型
     */
    _p._$isNumber = function(_data){
        return _isTypeOf(_data,'number');
    };
    /**
     * 判断是否布尔值
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isBoolean(0);
     *     // 返回true
     *     var is = _u._$isBoolean(false);
     * });
     * ```
     *
     * @method module:base/util._$isBoolean
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否布尔值
     */
    _p._$isBoolean = function(_data){
        return _isTypeOf(_data,'boolean');
    };
    /**
     * 判断是否日期
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isDate(0);
     *     // 返回true
     *     var is = _u._$isDate(new Date());
     * });
     * ```
     *
     * @method module:base/util._$isDate
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否日期
     */
    _p._$isDate = function(_data){
        return _isTypeOf(_data,'date');
    };
    /**
     * 判断是否数组
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isArray(0);
     *     // 返回true
     *     var is = _u._$isArray([1,2]);
     * });
     * ```
     *
     * @method module:base/util._$isArray
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否数组
     */
    _p._$isArray = function(_data){
        return _isTypeOf(_data,'array');
    };
    /**
     * 判断是否对象
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回false
     *     var is = _u._$isObject(function(){});
     *     // 返回true
     *     var is = _u._$isObject({});
     *     var is = _u._$isObject({a:"a"});
     * });
     * ```
     *
     * @method module:base/util._$isObject
     * @param  {Variable} arg0 - 待检测类型的数据
     * @return {Boolean}         是否对象
     */
    _p._$isObject = function(_data){
        return _isTypeOf(_data,'object');
    };
    /**
     * 计算字符串长度，中文算两个字符
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 字符串长度为5
     *     var len = _u._$length('你i他');
     * });
     * ```
     *
     * @method module:base/util._$length
     * @param  {String} arg0 - 待计算长度字符串
     * @return {Number}        字符串长度
     */
    _p._$length = (function(){
        var _reg = /[^\x00-\xfff]/g;
        return function(_content){
            return (''+(_content||'')).replace(_reg,'**').length;
        };
    })();
    /**
     * 遍历对象
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *       var obj = {a:{id:1,name:'a'},b:{id:2,name:'b'},...};
     * 
     *       // 遍历对象    
     *       _u._$loop(obj,function(_item,_key){
     *           // TODO
     *       });
     * 
     *       // 从对象里查找id为2的元素，如果有返回KEY，没有返回null
     *       var key = _u._$loop(obj,function(_item){
     *           return _item.id==2;
     *       });
     * });
     * ```
     * 
     * @method module:base/util._$loop
     * @see    module:base/util._$forIn
     * @param  {Object}   arg0 - 对象
     * @param  {Function} arg1 - 回调，如果返回true，则中断遍历
     * @param  {Object}   arg2 - 回调函数调用时this对象
     * @return {String}          返回中断时的标识，没有中断则统一返回null
     */
    _p._$loop = function(_obj,_callback,_this){
        if (_p._$isObject(_obj)&&
            _p._$isFunction(_callback)){
            return _h.__forIn.apply(_h,arguments);
        }
        return null;
    };
    /**
     * 线性查找指定项
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     var list = ["你","我","他"];
     *     // 返回下标1
     *     var index = _u._$indexOf(list,"我");
     *     // 没有找到，返回-1
     *     var index = _u._$indexOf(list,"他们");
     *     // 如果第二个参数是过滤接口，根据接口的规则查找
     *     // 以下规则排除第一个下标
     *     var index = _u._$indexOf(list,function(_item,_index,_list){
     *           return _item==='他';
     *     });
     * });
     * ```
     *
     * @method module:base/util._$indexOf
     * @param  {Array}    arg0 - 待搜索列表
     * @param  {Variable} arg1 - 指定项，如果为function则表示过滤接口
     * @return {Number}          给定项所在的位置索引，以0开始，没有项返回-1
     */
    _p._$indexOf = function(_list,_item){
        var _filter = _p._$isFunction(_item) ? _item
                    : function(_value){return _value===_item;},
            _index  = _p._$forIn(_list,_filter);
        return _index!=null?_index:-1;
    };
    /**
     * 二分法查找指定项
     * 
     * 验证函数输入输出说明
     * 
     * |      | 类型          | 结果说明 |
     * | :--  | :--      | :-- |
     * | 输入  | Variable | 中间项元素 |
     * | 输出  | Number   | < 0  目标元素在低位区间 |
     * |      |          | = 0  匹配到目标元素 |
     * |      |          | > 0  目标元素在高位区间 |
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 二分查找id为2的项的索引值
     *     var list = [{id:1,name:'aaa'},{id:2,name:'bbbb'},...];
     *     var index = _u._$binSearch(list,function(_item){
     *         return _item.id-2;
     *     });
     * });
     * ```
     *
     * @method module:base/util._$binSearch
     * @param  {Array}    arg0 - 待查找列表
     * @param  {Function} arg1 - 验证函数
     * @return {Number}          找到匹配项索引，找不到返回-1
     */
    _p._$binSearch = (function(){
        var _docheck;
        // do binary search
        var _doSearch = function(_list,_low,_high){
            if (_low>_high) return -1;
            var _middle = Math.ceil((_low+_high)/2),
                _result = _docheck(_list[_middle],_middle,_list);
            if (_result==0)
                return _middle;
            if (_result<0)
                return _doSearch(_list,_low,_middle-1);
            return _doSearch(_list,_middle+1,_high);
        };
        return function(_list,_check){
            _docheck = _check||_f;
            return _doSearch(_list,0,_list.length-1);
        };
    })();
    /**
     * 逆序遍历列表，支持中断
     * 
     * 回调函数输入输出说明
     * 
     * |      | 类型          | 说明 |
     * | :--  | :--      | :-- |
     * | 输入  | Variable | 值 |
     * |      | Number   | 下标 |
     * |      | Array    | 列表对象 |
     * | 输出  | Boolean  | 是否匹配 |
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 删除id为3的项，并退出循环
     *     var list = [{id:1,name:'aaa'},{id:2,name:'bbbb'},...];
     *     _u._$reverseEach(list,function(_item,_index,_list){
     *         if (_item.id==3){
     *             _list.splice(_index,1);
     *             return !0;
     *         }
     *     });
     * });
     * ```
     *
     * @method module:base/util._$reverseEach
     * @see    module:base/util._$forEach
     * @param  {Array}    arg0 - 列表
     * @param  {Function} arg1 - 回调，如果返回true，则中断遍历
     * @param  {Object}   arg2 - 回调函数调用时this对象
     * @return {Number}          返回遍历中断时的索引值，没有中断则返回null
     */
    _p._$reverseEach = function(_list,_callback,_this){
        if (!!_list&&!!_list.length&&_p._$isFunction(_callback)){
            for(var i=_list.length-1;i>=0;i--){
                if (!!_callback.call(_this,_list[i],i,_list)){
                    return i;
                }
            }
        }
        return null;
    };
    /**
     * 正序遍历列表，不支持中断
     * 
     * 回调函数输入输出说明
     * 
     * |      | 类型          | 说明 |
     * | :--  | :--      | :-- |
     * | 输入  | Variable | 值 |
     * |      | Number   | 下标 |
     * |      | Array    | 列表对象 |
     * | 输出  | Boolean  | 是否匹配 |
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     var list = [1,2,3];
     *     _u._$forEach(list,function(_item,_index,_list){
     *         // TODO somthing
     *     });
     * });
     * ```
     *
     * @method module:base/util._$forEach
     * @see    module:base/util._$reverseEach
     * @param  {Array}    arg0 - 列表
     * @param  {Function} arg1 - 回调，如果返回true，则中断遍历
     * @param  {Object}   arg2 - 回调函数调用时this对象
     * @return {Void}
     */
    _p._$forEach = function(_list,_callback,_this){
        if (!!_list&&!!_list.length&&
            _p._$isFunction(_callback)){
            if (!_list.forEach){
                _p._$forIn.apply(_p,arguments);
            }else{
                _h.__forEach(_list,_callback,_this);
            }
        }
    };
    /**
     * 遍历列表或对象，如果带length属性，则作为数组遍历，如果要遍历带length属性的对象用_$loop接口，支持中断退出
     *
     * 回调函数输入输出说明
     * 
     * |      | 类型          | 说明 |
     * | :--  | :--      | :-- |
     * | 输入  | Variable | 值 |
     * |      | Number   | 下标 |
     * |      | Object_Array | 列表或者集合对象 |
     * | 输出  | Boolean  | 是否匹配 |
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *       // 从有序列表里查找id为2的元素，如果有则返回索引，没有返回null
     *       var list = [{id:1,name:'a'},{id:2,name:'b'},...];
     *       var index = _u._$forIn(list,function(_item){
     *           return _item.id==2;
     *       });
     *
     *       // 从对象里查找id为2的元素，如果有返回KEY，没有返回null
     *       var obj = {a:{id:1,name:'a'},b:{id:2,name:'b'},...};
     *       var key = _u._$forIn(obj,function(_item){
     *           return _item.id==2;
     *       });
     * });
     * ```
     *
     * @method module:base/util._$forIn
     * @param  {Object|Array} arg0 - 列表或者对象
     * @param  {Function}     arg1 - 回调，如果返回true，则中断遍历
     * @param  {Object}       arg2 - 回调函数调用时this对象
     * @return {String|Number}       返回中断时的索引或者标识，没有中断则统一返回null
     */
    _p._$forIn = function(_list,_callback,_this){
        if (!_list||!_p._$isFunction(_callback)){
            return null;
        }
        if (_list.length!=null&&_list.length>0){
            // list see as array
            for(var i=0,l=_list.length;i<l;i++){
                if (!!_callback.call(_this,_list[i],i,_list)){
                    return i;
                }
            }
        }else if (_p._$isObject(_list)){
            // list is object
            return _p._$loop(_list,_callback,_this);
        }
        return null;
    };
    /**
     * 编码字符串，
     * 编码规则对象中r正则表达式参数提取字符串需要编码的内容，
     * 然后使用编码规则对象中的映射表进行替换
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 把字符串99999根据规则9替换成t，结果：ttttt
     *     var str = _u._$encode({r:/\d/g,'9':'t'},'99999');
     * });
     * ```
     *
     * @method module:base/util._$encode
     * @param  {Object} arg0 - 编码规则
     * @param  {String} arg1 - 待编码的字串
     * @return {String}        编码后的字串
     */
    _p._$encode = function(_map,_content){
        if (!_map||!_content||!_content.replace){
            return _content||'';
        }
        return _content.replace(_map.r,function($1){
            var _result = _map[!_map.i?$1.toLowerCase():$1];
            return _result!=null?_result:$1;
        });
    };
    /**
     * 编码html代码，'<' -> '&amp;lt;'
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 编码，结果：&amp;lt;a&amp;gt;util&amp;lt;/a&amp;gt;&amp;amp;
     *     var str = _u._$escape('<a>util</a>&');
     * });
     * ```
     *
     * @method module:base/util._$escape
     * @see    module:base/util._$unescape
     * @param  {String} arg0 - 待编码串
     * @return {String}        编码后的串
     */
    _p._$escape = (function(){
        var _reg = /<br\/?>$/,
            _map = {
                r:/\<|\>|\&|\r|\n|\s|\'|\"/g,
                '<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;',
                '"':'&quot;',"'":'&#39;','\n':'<br/>','\r':''
            };
        return function(_content){
            _content = _p._$encode(_map,_content);
            return _content.replace(_reg,'<br/><br/>');
        };
    })();
    /**
     * 反编码html代码，'&amp;lt;' -> '<' 
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 反编码，结果：<&a>util</a>
     *     var str = _u._$unescape('&amp;lt;&amp;amp;a&amp;gt;util&amp;lt;/a&amp;gt;');
     * });
     * ```
     *
     * @method module:base/util._$unescape
     * @see    module:base/util._$escape
     * @param  {String} arg0 - 待反编码串
     * @return {String}        反编码后的串
     */
    _p._$unescape = (function(){
        var _map = {r:/\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,'&lt;':'<','&gt;':'>','&amp;':'&','&nbsp;':' ','&#39;':"'",'&quot;':'"','<br/>':'\n'};
        return function(_content){
            return _p._$encode(_map,_content);
        };
    })();
    /**
     * 格式化时间，yyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w
     *
     * 各标识说明：
     * 
     * | 标识  | 说明 |
     * | :--  | :-- |
     * | yyyy | 四位年份，如2001 |
     * | yy   | 两位年费，如01 |
     * | MM   | 两位月份，如08 |
     * | M    | 一位月份，如8 |
     * | dd   | 两位日期，如09 |
     * | d    | 一位日期，如9 |
     * | HH   | 两位小时，如07 |
     * | H    | 一位小时，如7 |
     * | mm   | 两位分钟，如03 |
     * | m    | 一位分钟，如3 |
     * | ss   | 两位秒数，如09 |
     * | s    | 一位秒数，如9 |
     * | ms   | 毫秒数，如234 |
     * | w    | 中文星期几，如一 |
     * | ct   | 12小时制中文后缀，上午/下午 |
     * | et   | 12小时制英文后缀，A.M./P.M. |
     * | cM   | 中文月份，如三 |
     * | eM   | 英文月份，如Mar |
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 根据格式输出时间，比如:2012-01-11,连接符可自定义
     *     var str = _u._$format(new Date(),'yyyy-MM-dd');
     * });
     * ```
     *
     * @method module:base/util._$format
     * @param  {Number|String|Date} arg0 - 时间
     * @param  {String}             arg1 - 格式
     * @return {String}                    指定格式的时间串
     */
    _p._$format = (function(){
        var _map = {i:!0,r:/\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g},
            _12cc = ['上午','下午'],
            _12ec = ['A.M.','P.M.'],
            _week = ['日','一','二','三','四','五','六'],
            _cmon = ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
            _emon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        var _fmtnmb = function(_number){
            _number = parseInt(_number)||0;
            return (_number<10?'0':'')+_number;
        };
        var _fmtclc = function(_hour){
            return _hour<12?0:1;
        };
        return function(_time,_format,_12time){
            if (!_time||!_format)
                return '';
            _time = _p._$var2date(_time);
            _map.yyyy = _time.getFullYear();
            _map.yy   = (''+_map.yyyy).substr(2);
            _map.M    = _time.getMonth()+1;
            _map.MM   = _fmtnmb(_map.M);
            _map.eM   = _emon[_map.M-1];
            _map.cM   = _cmon[_map.M-1];
            _map.d    = _time.getDate();
            _map.dd   = _fmtnmb(_map.d);
            _map.H    = _time.getHours();
            _map.HH   = _fmtnmb(_map.H);
            _map.m    = _time.getMinutes();
            _map.mm   = _fmtnmb(_map.m);
            _map.s    = _time.getSeconds();
            _map.ss   = _fmtnmb(_map.s);
            _map.ms   = _time.getMilliseconds();
            _map.w    = _week[_time.getDay()];
            var _cc   = _fmtclc(_map.H);
            _map.ct   = _12cc[_cc];
            _map.et   = _12ec[_cc];
            if (!!_12time){
                _map.H = _map.H%12;
            }
            return _p._$encode(_map,_format);
        };
    })();
    /**
     * 日期字符串转日期对象
     * 
     * 字符串日期格式同ECMA规范定义：YYYY-MM-DDTHH:mm:ss.sssZ
     * 
     * 各标识说明：
     * 
     * | 标识 | 说明 |
     * | :--  | :-- |
     * | YYYY | 四位年份，0000-9999，如2001 |
     * | -    | 年月日分隔符 |
     * | MM   | 两位月份，01-12，如03 |
     * | DD   | 两位日期，01-31，如07 |
     * | T    | 时间起始标识 |
     * | HH   | 两位小时，00-24，如05 |
     * | :    | 时分秒分隔符 |
     * | mm   | 两位分钟，00-59，如30 |
     * | ss   | 两位秒数，00-59，如08 |
     * | .    | 秒/毫秒分隔符 |
     * | sss  | 三位毫秒数，000-999，如004 |
     * | Z    | 时区偏移 |
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 输入YYYY-MM-DDTHH:mm:ss.sssZ格式字符串，生成日期对象
     *     var date = _u._$var2date('2013-07-29T13:12:45.300');
     *
     *     // 输入YYYY-MM-DDTHH:mm:ss格式字符串，生成日期对象
     *     var date = _u._$var2date('2013-07-29T13:12:45');
     *
     *     // 输入YYYY-MM-DD格式字符串，生成日期对象
     *     var date = _u._$var2date('2013-07-29');
     * });
     * ```
     *
     * @method module:base/util._$var2date
     * @param  {String} arg0 - 日期串
     * @return {Date}          日期对象
     */
    _p._$var2date = function(_time){
        var _date = _time;
        if (_p._$isString(_time)){
            _date = new Date(
                _h.__str2time(_time)
            );
        }
        if (!_p._$isDate(_date)){
            _date = new Date(_time);
        }
        return _date;
    };
    /**
     * 浮点数值保留指定位数小数点
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 保留2位小数，返回3.14
     *     var value = _u._$fixed(3.14159,2);
     * });
     * ```
     *
     * @method module:base/util._$fixed
     * @param  {Float}  arg0 - 浮点数
     * @param  {Number} arg1 - 小数位
     * @return {Number}        浮点数
     */
    _p._$fixed = function(_float,_fraction){
        return parseFloat(new Number(_float).toFixed(_fraction));
    };
    /**
     * 相对路径转绝对路径
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 相对路径../a/b.html转绝对路径http://a.b.com:8010/a/b.html
     *     var url = _u._$absolute(
     *         '../a/b.html',
     *         'http://a.b.com:8010/z/'
     *     );
     * });
     * ```
     * 
     * @method module:base/util._$absolute
     * @param  {String} arg0 - 相对路径
     * @param  {String} arg1 - 绝对路径ROOT，必须以http://开始，默认为location目录
     * @return {String}        绝对路径地址
     */
    _p._$absolute = (function(){
        var _reg0 = /([^\/:])\/.*$/,
            _reg1 = /\/[^\/]+$/,
            _reg2 = /[#\?]/,
            _base = location.href.split(/[?#]/)[0],
            _anchor = document.createElement('a');
        var _isAbsolute = function(_uri){
            return (_uri||'').indexOf('://')>0;
        };
        var _doFormat = function(_uri){
            return (_uri||'').split(_reg2)[0]
                             .replace(_reg1,'/');
        };
        var _doMergeURI = function(_uri,_root){
            // for /a/b/c
            if (_uri.indexOf('/')==0)
                return _root.replace(_reg0,'$1')+_uri;
            // for a/b or ./a/b or ../a/b
            return _doFormat(_root)+_uri;
        };
        _base = _doFormat(_base);
        return function(_uri,_root){
            _uri = (_uri||'').trim();
            if (!_isAbsolute(_root))
                _root = _base;
            if (!_uri) return _root;
            if (_isAbsolute(_uri))
                return _uri;
            _uri = _doMergeURI(_uri,_root);
            _anchor.href = _uri;
            _uri = _anchor.href;
            return _isAbsolute(_uri) ? _uri :
                   _anchor.getAttribute('href',4); // ie6/7
        };
    })();
    /**
     * 从URL地址中提取源信息
     * 
     * * http://a.b.com:8080/a/b/ -> http://a.b.com:8080
     * * /a/b -> 
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 提取url地址的源信息
     *     // 返回http://a.b.com:8080
     *     var origin = _u._$url2origin("http://a.b.com:8080/a/b/");
     * });
     * ```
     *
     * @method module:base/util._$url2origin
     * @param  {String} arg0 - URL地址
     * @return {String}        源信息
     */
    _p._$url2origin = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_url){
            if (_reg.test(_url||''))
                return RegExp.$1.toLowerCase();
            return '';
        };
    })();
    /**
     * key-value字符串转对象
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     var str = "abc=abc,123=123";
     *     // 返回对象{abc:"abc",123:"123"}
     *     var obj = _u._$string2object(_str,",");
     * });
     * ```
     *
     * @method module:base/util._$string2object
     * @see    module:base/util._$object2string
     * @param  {String}        arg0 - 待处理数据
     * @param  {String|RegExp} arg1 - 分隔符
     * @return {Object}               转换后对象
     */
    _p._$string2object = function(_string,_split){
        var _obj = {};
        _p._$forEach(
            (_string||'').split(_split),
            function(_name){
                var _brr = _name.split('=');
                if (!_brr||!_brr.length) return;
                var _key = _brr.shift();
                if (!_key) return;
                _obj[decodeURIComponent(_key)] =
                     decodeURIComponent(_brr.join('='));
            }
        );
        return _obj;
    };
    /**
     * key-value对象转成key=value对后用分隔符join
     * 
     * 对象中不同类型的取值规则如下：
     * 
     * | 类型            |  取值规则 |
     * | :--       | :-- |
     * | Function  |  过滤掉，不输出 |
     * | Date      |  转成时间戳，getTime取值 |
     * | Array     |  值用逗号分隔，如[1,2,3] -> 1,2,3 |
     * | Object    |  使用JSON转成字符串 |
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回字符串 abc=abc,123=123
     *     var obj = {
     *         abc:"abc",
     *         123:"123"
     *     };
     *     var str = _u._$object2string(obj);
     *
     *     // 返回字符串
     *     // a=1871406603152186&b=1,2,3&d={"a":"a","b":"b"}&e=e&f=1&g=true
     *     var obj = {
     *         a:new Date,
     *         b:[1,2,3],
     *         c:function(){},
     *         d:{a:'a',b:'b'},
     *         e:'e',
     *         f:1,
     *         g:true
     *     };
     *     var str = _u._$object2string(obj,'&');
     * });
     * ```
     *
     * @method module:base/util._$object2string
     * @see    module:base/util._$string2object
     * @param  {Object}  arg0 - 对象
     * @param  {String}  arg1 - 分隔符，默认为逗号
     * @param  {Boolean} arg2 - 是否编码
     * @return {String}         key-value串
     */
    _p._$object2string = function(_object,_split,_encode){
        if (!_object) return '';
        var _arr = [];
        _p._$loop(
            _object,function(_value,_key){
                if (_p._$isFunction(_value)){
                    return;
                }
                if (_p._$isDate(_value)){
                    _value = _value.getTime();
                }else if(_p._$isArray(_value)){
                    _value = _value.join(',');
                }else if(_p._$isObject(_value)){
                    _value = JSON.stringify(_value);
                }
                if (!!_encode){
                    _value = encodeURIComponent(_value);
                }
                _arr.push(encodeURIComponent(_key)+'='+_value);
            }
        );
        return _arr.join(_split||',');
    };
    /**
     * 查询串转对象
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回对象{abc:"abc",123:"123"}
     *     var obj = _u._$query2object("abc=abc&123=123");
     * });
     * ```
     *
     * @method module:base/util._$query2object
     * @see    module:base/util._$object2query
     * @see    module:base/util._$string2object
     * @param  {String} arg0 - 查询串
     * @return {Object}        转换出来的对象
     */
    _p._$query2object = function(_query){
        return _p._$string2object(_query,'&');
    };
    /**
     * 对象转查询串
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回对象123=123&abc=abc
     *     var query = _u._$object2query({abc:"abc",123:"123"});
     * });
     * ```
     *
     * @method module:base/util._$object2query
     * @see    module:base/util._$query2object
     * @see    module:base/util._$object2string
     * @param  {Object} arg0 - 对象
     * @return {String}        查询串
     */
    _p._$object2query = function(_object){
        return _p._$object2string(_object,'&',!0);
    };
    /**
     * 集合转数组，集合具有length属性
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 返回数组['1','2','3']
     *     var map = {0:'0',1:'1',2:'2',length:3};
     *     var arr = _u._$object2array(map);
     *
     *     // 多用于对节点集合的转换
     *     var nodes = document.body.childNodes;
     *     var arr = _u._$object2array(nodes);
     * });
     * ```
     *
     * @method module:base/util._$object2array
     * @see    module:base/util._$array2object
     * @param  {Object} arg0 - 集合，必须有length属性
     * @return {Array}         数组
     */
    _p._$object2array = function(_object){
        return _h.__col2array(_object);
    };
    /**
     * 数组转对象，将列表中元素按照指定KEY组成对象<br/>
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 输出结果为 {2:{id:2,name:'b'},...}
     *     var arr = [{id:1,name:'a'},{id:2,name:'b'},...];
     *     var obj = _u._$array2object(
     *         arr,function(_item){
     *             // 过滤name为a的项
     *             if (_item.name=='a'){
     *                 return;
     *             }
     *             // 组对象的KEY用每项的id
     *             return _item.id;
     *         }
     *     );
     *
     *     // 默认使用每项的值组对象
     *     var brr = ['a','b','c',...];
     *     // 输出 {a:'a',b:'b',c:'c',...}
     *     var obj = _u._$array2object(brr);
     * });
     * ```
     *
     * @method module:base/util._$array2object
     * @see    module:base/util._$object2array
     * @param  {Array}    arg0 - 列表
     * @param  {Function} arg1 - 过滤函数，返回每一项的KEY，没有返回则过滤当前项
     * @return {Object}   对象
     */
    _p._$array2object = function(_list,_filter){
        var _result = {};
        _p._$forEach(
            _list,function(_item){
                var _key = _item;
                if (!!_filter){
                    _key = _filter(_item);
                }
                if (_key!=null){
                    _result[_key] = _item;
                }
            }
        );
        return _result;
    };
    /**
     * 格式化数字为指定位数，不足位数前面用0补足
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 2    -> 002
     *     // 22   -> 022
     *     // 222  -> 222
     *     // 2222 -> 2222
     *     var str = _u._$number2string(2,3);
     * });
     * ```
     *
     * @method module:base/util._$number2string
     * @param  {Number} arg0 - 数值
     * @param  {Number} arg1 - 位数，至少1位
     * @return {String}        格式化后字符串
     */
    _p._$number2string = function(_number,_limit){
        var _len1 = (''+_number).length,
            _len2 = Math.max(1,parseInt(_limit)||0),
            _delta = _len2-_len1;
        if (_delta>0){
            _number = new Array(_delta+1).join('0')+_number;
        }
        return ''+_number;
    };
    /**
     * 安全删除属性，
     * 部分浏览器（如低版本IE）禁止直接delete节点上的属性
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 节点上保存的数据
     *     _node.data = {a:'aaaaa',b:'bbbbb'};
     *     _node.test = 'aaaaa';
     *
     *     // 删除单个属性
     *     _u._$safeDelete(_node,'test');
     *     // 批量删除
     *     _u._$safeDelete(_node,['test','data']);
     * });
     * ```
     *
     * @method module:base/util._$safeDelete
     * @param  {Object}       arg0 - 对象
     * @param  {String|Array} arg1 - 属性
     * @return {Void}
     */
    _p._$safeDelete = function(_object,_name){
        if (!_p._$isArray(_name)){
            try{
                delete _object[_name];
            }catch(e){
                _object[_name] = undefined;
            }
        }else{
            _p._$forEach(
                _name,function(_item){
                    _p._$safeDelete(_object,_item);
                }
            );
        }
    };
    /**
     * 随机一个字符串
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 可能返回"13d1r1dt2"
     *     var seed = _u._$randString(9);
     * });
     * ```
     *
     * @method module:base/util._$randString
     * @param  {String} arg0 - 字符串长度
     * @return {String}        随机字符串
     */
    _p._$randString = (function(){
        var _chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        return function(_length){
            _length = _length||10;
            var _result = [];
            for(var i=0,_rnum;i<_length;++i){
                _rnum = Math.floor(Math.random()*_chars.length);
                _result.push(_chars.charAt(_rnum));
            }
            return _result.join('');
        };
    })();
    /**
     * 随机生成一个给定范围的整数
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 可能返回3
     *     var seed = _u._$randNumber(0,9);
     * });
     * ```
     * 
     * @method module:base/util._$randNumber
     * @see    module:base/util._$randNumberString
     * @param  {Number} arg0 - 小区间，包含
     * @param  {Number} arg1 - 大区间，不包含
     * @return {Number}        随机整数
     */
    _p._$randNumber = function(_min,_max){
        return Math.floor(Math.random()*(_max-_min)+_min);
    };
    /**
     * 随机生成一个全部为数字的字符串
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 可能返回123456789
     *     var seed = _u._$randNumberString(9);
     * });
     * ```
     *
     * @deprecated
     * @method module:base/util._$randNumberString
     * @see    module:base/util._$randNumber
     * @see    module:base/util._$uniqueID
     * @param  {Number} arg0 - 随机字符串的长度[1,30]
     * @return {String}        随机生成的字符串
     */
    _p._$randNumberString = function(_length){
        _length = Math.max(0,Math.min(_length||8,30));
        var _min = Math.pow(10,_length-1),_max = _min*10;
        return _p._$randNumber(_min,_max).toString();
    };
    /**
     * 生成系统中的唯一标识，每次调用均生成一个新的标识
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_p){
     *    // 可能返回123456789
     *    var _id1 = _p._$uniqueID(),
     *        _id2 = _p._$uniqueID();
     *    // _id1 != _id2
     * });
     * ```
     *
     * @method module:base/util._$uniqueID
     * @return {String} 唯一标识
     */
    _p._$uniqueID = (function(){
        var _seed = +new Date;
        return function(){
            return ''+(_seed++);
        };
    })();
    /**
     * 读取上下文中指定名字空间的值
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     var obj = {
     *         a:{
     *             b:{
     *                 c:{
     *                     d:'ddddd'
     *                 }
     *             }
     *         }
     *     };
     *     // 输出 ddddd
     *     var value = _u._$query(obj,'a.b.c.d');
     *     // 输出 undefined
     *     var value = _u._$query(null,'a.b.c.d');
     * });
     * ```
     *
     * @method module:base/util._$query
     * @param  {Object} arg0 - 上下文
     * @param  {String} arg1 - 名字空间
     * @return {Varaible}      查询到的值
     */
    _p._$query = function(_context,_namespace){
        _context = _context||_o;
        var _arr = (_namespace||'').split('.');
        for(var i=0,l=_arr.length;i<l;i++){
            _context = _context[_arr[i]];
            if (!_context) break;
        }
        return _context;
    };
    /**
     * 合并数据，同名属性右侧覆盖左侧，
     * 最后一个如果是函数则用做数据过滤，
     * 第一个参数作为合并数据结果集对象，如果为空则新建对象
     * 
     * 过滤接口输入输出说明
     * 
     * |      | 类型          | 说明 |
     * | :--  | :--      | :-- |
     * | 输入  | Variable | 值 |
     * |      | String   | 键 |
     * | 输出  | Boolean  | 是否过滤 |
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 合并多个数据至obj0中
     *     var obj0 = {a:0,b:1},
     *         obj1 = {a:"a",b:"b",c:"c"},
     *         obj2 = {c:"c",d:"d",e:"f"},
     *         ... ;
     *     var obj = _u._$merge(obj0,obj1,obj2,...);
     *
     *     // 带过滤接口合并
     *     // 阻止a属性的覆盖
     *     var obj = _u._$merge(
     *         obj0,obj1,obj2,...,
     *         function(_value,_key){
     *             return _key=='a';
     *         }
     *     );
     * });
     * ```
     *
     * @method module:base/util._$merge
     * @see    module:base/util._$fetch
     * @param  {Object}   arg0 - 原始对象
     * @param  {Object}   arg1 - 待拷贝对象
     * @param  {Function} arg2 - 过滤接口
     * @return {Object}          拷贝后对象
     */
    _p._$merge = function(){
        var _last = arguments.length-1,
            _filter = arguments[_last];
        // check filter function for last args
        if (_p._$isFunction(_filter)){
            _last -= 1;
        }else{
            _filter = _f;
        }
        // args0 as result
        var _result = arguments[0]||{};
        // merge
        for(var i=1;i<=_last;i++){
            _p._$loop(arguments[i],function(v,k){
                if (!_filter(v,k)){
                    _result[k] = v;
                }
            });
        }
        return _result;
    };
    /**
     * 根据原始对象属性，从目标对象提取非空值
     *
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     var obj0 = {a:0,b:1},
     *         obj1 = {a:"a",b:"b",c:"c"};
     *     // 根据obj0的属性,从obj1拷贝非null属性到obj0中
     *     // 结果是obj0.a = "a",obj.b = "b",没有拷贝c属性;
     *     var obj = _u._$fetch(obj0,obj1);
     * });
     * ```
     *
     * @method module:base/util._$fetch
     * @see    module:base/util._$merge
     * @param  {Object} arg0 - 原始对象
     * @param  {Object} arg1 - 目标对象
     * @return {Object}        合并后的对象
     */
    _p._$fetch = function(_object,_config){
        if (!!_config){
            _p._$loop(_object,function(v,k,m){
                var _value = _config[k];
                if (_value!=null){
                    m[k] = _value;
                }
            });
        }
        return _object;
    };
    /**
     * 判断对象自生是否包含元素
     * 
     * ```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 判断空对象是否有属性
     *     // 输出 false
     *     var has = _u._$hasProperty({});
     *       
     *     // 判断非空对象是否有属性
     *     // 输出 true
     *     var has = _u._$hasProperty({a:'a',b:'b',c:'c'});
     *       
     *     // 判断空数组是否有属性
     *     // 输出 false
     *     var has = _u._$hasProperty([]);
     *       
     *     // 判断非空数组是否有属性
     *     // 输出 true
     *     var has = _u._$hasProperty([1,2,3]);
     * });
     * ```
     * 
     * @method module:base/util._$hasProperty
     * @param  {Object|Array} arg0 - 对象
     * @return {Boolean}             是否有元素
     */
    _p._$hasProperty = function(_obj){
        // for null
        if (!_obj){
            return !1;
        }
        // for object with length
        if (_obj.length!=null){
            return _obj.length>0;
        }
        // for object
        var _length = 0;
        _p._$loop(_obj,function(){
            _length++;
            return _length>0;
        });
        return _length>0;
    };
    
    if (CMPT){
        NEJ.Q  = _p._$query;
        NEJ.X  = _p._$merge;
        NEJ.EX = _p._$fetch;
        NEJ.copy(this.NEJ,NEJ);
        NEJ.copy(NEJ.P('nej.u'),_p);
    }

    return _p;
});
