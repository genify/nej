/*
 * ------------------------------------------
 * 通用接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _f = NEJ.F,
        _e = _('nej.e'),
        _h = _('nej.h'),
        _u = _('nej.u');
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
     * 判断是否函数类型<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isFunction(123);
     *   // 返回true
     *   _u._$isFunction(fucntion(){});
     * [/code]
     * 
     * @api    {nej.u._$isFunction}
     * @param  {Variable} 数据
     * @return {Boolean}  是否函数类型
     */
    _u._$isFunction = function(_data){
        return _isTypeOf(_data,'function');
    };
    /**
     * 判断是否字符串<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isString(123);
     *   // 返回true
     *   _u._$isString("123");
     * [/code]
     * 
     * @api    {nej.u._$isString}
     * @param  {Variable} 数据
     * @return {Boolean}  是否字符串
     */
    _u._$isString = function(_data){
        return _isTypeOf(_data,'string');
    };
    /**
     * 判断是否数字<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isNumber("123");
     *   // 返回true
     *   _u._$isNumber(123);
     *   _u._$isNumber(-123);
     *   _u._$isNumber(Number.MAX_VALUE);
     * [/code]
     * 
     * @api    {nej.u._$isNumber}
     * @param  {Variable} 数据
     * @return {Boolean}  是否数字
     */
    _u._$isNumber = function(_data){
        return _isTypeOf(_data,'number');
    };
    /**
     * 判断是否布尔值<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isBoolean(0);
     *   // 返回true
     *   _u._$isBoolean(false);
     * [/code]
     * 
     * @api    {nej.u._$isBoolean}
     * @param  {Variable} 数据
     * @return {Boolean}  是否布尔值
     */
    _u._$isBoolean = function(_data){
        return _isTypeOf(_data,'boolean');
    };
    /**
     * 判断是否日期<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isDate(0);
     *   // 返回true
     *   _u._$isDate(new Date());
     * [/code]
     * 
     * @api    {nej.u._$isDate}
     * @param  {Variable} 数据
     * @return {Boolean}  是否日期
     */
    _u._$isDate = function(_data){
        return _isTypeOf(_data,'date');
    };
    /**
     * 判断是否数组<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isArray(0);
     *   // 返回true
     *   _u._$isArray([1,2]);
     * [/code]
     * 
     * @api    {nej.u._$isArray}
     * @param  {Variable} 数据
     * @return {Boolean}  是否数组
     */
    _u._$isArray = function(_data){
        return _isTypeOf(_data,'array');
    };
    /**
     * 判断是否对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回false
     *   _u._$isObject(function(){});
     *   // 返回true
     *   _u._$isObject({});
     *   _u._$isObject({a:"a"});
     * [/code]
     * 
     * @api    {nej.u._$isObject}
     * @param  {Variable} 数据
     * @return {Boolean}  是否对象
     */
    _u._$isObject = function(_data){
        return _isTypeOf(_data,'object');
    };
    /**
     * 计算字符串长度，中文算两个字符<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _str = "你i他";
     *   // 字符串实际长度为5
     *   _u._$length(_str);
     * [/code]
     * 
     * @api    {nej.u._$length}
     * @param  {String} 字符串
     * @return {Number} 字符串长度
     */
    _u._$length = (function(){
        var _reg = /[^\x00-\xfff]/g;
        return function(_content){
            return (''+(_content||'')).replace(_reg,'**').length;
        };
    })();
    /**
     * 线性查找指定项<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = ["你","我","他"];
     *   // 返回下标1
     *   _u._$indexOf(_list,"我");
     *   // 没有找到，返回-1
     *   _u._$indexOf(_list,"他们");
     *   // 如果第二个参数是过滤接口，根据接口的规则查找
     *   // 以下规则排除第一个下标
     *   _u._$indexOf(_list,function(_item,_index,_list){
     *       return _index > 0;
     *   });
     * [/code]
     * 
     * @api    {nej.u._$indexOf}
     * @param  {Array}    待搜索列表
     * @param  {Variable} 指定项，如果为function则表示过滤接口
     * @return {Number}   给定项所在的位置索引，以0开始，没有项返回-1
     */
    _u._$indexOf = function(_list,_item){
        var _filter = _u._$isFunction(_item) ? _item
                    : function(_value){return _value===_item;},
            _index  = _u._$forIn(_list,_filter);
        return _index!=null?_index:-1;
    };
    /**
     * 二分法查找指定项<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = [1,2,3];
     *   // 从有序列表里查找2，如果有返回下标1，没有返回-1
     *   _u._$binSearch(_list,function(_value){
     *       return _value - 2;
     *   });
     * [/code]
     * 
     * @api    {nej.u._$binSearch}
     * @param  {Array}    待查找列表
     * @param  {Function} 验证函数
     * [ntb]
     *  输入 | Variable | 中间值
     *  输出 | Number   | <0 - 值在小区间
     *       | Number   | 0 - 匹配到值
     *       | Number   | >0 - 值在大区间
     * [/ntb]
     * @return {Number}   找到匹配项索引，找不到返回-1
     */
    _u._$binSearch = (function(){
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
     * 逆序遍历列表<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = [1,2,3];
     *   // 从有序列表里逆序查找2，如果有返回下标1，没有返回null
     *   _u._$reverseEach(_list,function(_item,_index,_this){
     *       return _item == 2;
     *   });
     * [/code]
     * 
     * @see    {#_$forEach}
     * @api    {nej.u._$reverseEach}
     * @param  {Array}     列表
     * @param  {Function}  回调，如果返回true，则中断遍历
     * [ntb]
     *  输入 | Variable | value
     *       | Number   | 下标
     *       | Object   | 当前this对象
     *  输出 | Boolean  | 是否匹配
     * [/ntb]
     * @param  {Object}    回调函数调用时this对象
     * @return {Number}    返回遍历中断时的索引值，没有中断则返回null
     */
    _u._$reverseEach = function(_list,_callback,_this){
        if (!_list||!_list.length||
            !_u._$isFunction(_callback))
            return null;
        for(var i=_list.length-1;i>=0;i--)
            if (!!_callback.call(
                  _this,_list[i],i,_list))
                return i;
        return null;
    };
    /**
     * 遍历列表<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = [1,2,3];
     *   // 从有序列表里查找2，如果有返回下标1，没有返回null
     *   _u._$forEach(_list,function(_item,_index,_this){});
     * [/code]
     * 
     * @see    {#_$reverseEach}
     * @api    {nej.u._$forEach}
     * @param  {Array}     列表
     * @param  {Function}  回调
     * [ntb]
     *  输入 | Variable | value
     *       | Number   | 下标
     *       | Object   | 当前this对象
     * [/ntb]
     * @param  {Object}    回调函数调用时this对象
     * @return {nej.u}
     */
    _u._$forEach = function(_list,_callback,_this){
        if (!_list||!_list.length||
            !_u._$isFunction(_callback))
            return this;
        if (!!_list.forEach){
            _list.forEach(_callback,_this);
            return this;
        }
        for(var i=0,l=_list.length;i<l;i++)
            _callback.call(_this,_list[i],i,_list);
        return this;
    };
    /**
     * 遍历列表或对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = [1,2,3],
     *       _object = {a:1,b:2,c:3};
     *   // 从有序列表里查找2，如果有返回下标1，没有返回null
     *   _u._$forIn(_list,function(_item,_index,_this){
     *       return _item == 2;
     *   });
     *   // 从对象里查找3，如果有返回下标2，没有返回null
     *   _u._$forIn(_object,function(_item,_index,_this){
     *       return _item == 3;
     *   });
     * [/code]
     * 
     * @api    {nej.u._$forIn}
     * @param  {Object|Array}  列表或者对象
     * @param  {Function}      回调函数，如果返回结果为true，则中断后续递归返回当前索引或者标识
     * [ntb]
     *  输入 | Variable | value
     *       | Number   | 下标
     *       | Object   | 当前this对象
     *  输出 | Boolean  | 是否匹配
     * [/ntb]
     * @param  {Object}        回调函数调用时this对象
     * @return {String|Number} 返回中断时的索引或者标识，没有中断则统一返回null
     */
    _u._$forIn = function(_list,_callback,_this){
        if (!_list||
            !_u._$isFunction(_callback))
            return null;
        // list is array
        if (_list.length!=null){
            if (_list.length>0)
                for(var i=0,l=_list.length;i<l;i++)
                    if (!!_callback.call(
                          _this,_list[i],i,_list))
                        return i;
        }
        // list is object
        if (_u._$isObject(_list)){
            for(var x in _list)
                if (_list.hasOwnProperty(x)&&
                  !!_callback.call(_this,_list[x],x,_list))
                    return x;
        }
        return null;
    };
    /**
     * 合并列表，修改原始列表<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _list = [1,2,3],
     *       _list2 = [4,5,6];
     *   // 合并列表，把列表2加到列表1的起始位子，列表1从2开始截断
     *   // 生成结果[4,5,6,2,3]
     *   _u._$mergeList(_list,_list2,{union:true,
     *     begin:true,compare:function(_item){
     *         return _item == '2';
     *     }
     *  });
     * [/code]
     * 
     * @api    {nej.u._$mergeList}
     * @param  {Array}    原始列表
     * @param  {Array}    对比列表
     * @param  {Object}   可选参数
     * @config {Boolean}  union   是否取并集，对应为合并列表
     * @config {Boolean}  begin   合并列表时是否追加至起始位置
     * @config {Function} compare 搜索匹配接口，默认列表项匹配
     * [ntb]
     *  输入 | Variable | value
     *  输出 | Number   | 下标
     * [/ntb]
     * @return {Array}            合并后列表
     */
    _u._$mergeList = function(_slist,_dlist,_options){
        _slist = _slist||[];
        _options = _options||_o;
        var _added = !!_options.union,
            _begin = !!_options.begin,
            _compare = _options.compare,
            _floop = _added&&_begin
                   ? _u._$reverseEach
                   : _u._$forEach;
        _floop(_dlist,
            function(_item){
                if (!!_compare)
                    _compare = _compare._$bind2(_item);
                var _index = _u._$indexOf(_slist,_compare||_item);
                // remove item to list
                if (_index>=0)
                    _slist.splice(_index,1);
                // add item to list
                if (_added)
                    _slist[_begin?'unshift':'push'](_item);
            });
        return _slist;
    };
    /**
     * 编码字符串<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 把字符串99999根据规则9替换成t，结果：ttttt
     *   _u._$encode({r:/\d/g,'9':'t'},'99999');
     * [/code]
     * 
     * @api    {nej.u._$encode}
     * @param  {Object}  编码规则
     * @param  {String}  待编码的字串
     * @return {String}  编码后的字串
     */
    _u._$encode = function(_map,_content){
        if (!_map||!_content||!_content.replace) 
            return _content||'';
        return _content.replace(_map.r,function($1){
                   var _result = _map[!_map.i?$1.toLowerCase():$1];
                   return _result!=null?_result:$1;
               });
    };
    /**
     * 编码html代码，'<' -> '&lt;'<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 编码，结果：&lt;a&gt;util&lt;/a&gt;&amp;
     *   _u._$escape('<a>util</a>&');
     * [/code]
     * 
     * @see    {#_$unescape}
     * @api    {nej.u._$escape}
     * @param  {String}  待编码串
     * @return {String}  编码后的串
     */
    _u._$escape = (function(){
        var _reg = /<br\/?>$/,
            _map = {
                r:/\<|\>|\&|\r|\n|\s|\'|\"/g,
                '<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;',
                '"':'&quot;',"'":'&#39;','\n':'<br/>','\r':''
            };
        return function(_content){
            _content = _u._$encode(_map,_content);
            return _content.replace(_reg,'<br/><br/>');
        };
    })();
    /**
     * 反编码html代码，'&lt;' -> '<'<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 反编码，结果：<&a>util</a>
     *   _u._$unescape('&lt;&amp;a&gt;util&lt;/a&gt;');
     * [/code]
     * 
     * @see    {#_$escape}
     * @api    {nej.u._$unescape}
     * @param  {String}  待编码串
     * @return {String}  编码后的串
     */
    _u._$unescape = (function(){
        var _map = {r:/\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,
                   '&lt;':'<','&gt;':'>','&amp;':'&','&nbsp;':' ','&#39;':"'",'&quot;':'"','<br/>':'\n'};
        return function(_content){
            return _u._$encode(_map,_content);
        };
    })();
    /**
     * 格式化时间，yyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w<br/>
     * [ntb]
     *   标识         |  名称
     * ----------------------------
     *   yyyy  |  四位年份，如2001
     *   yy    |  两位年费，如01
     *   MM    |  两位月份，如08
     *   M     |  一位月份，如8
     *   dd    |  两位日期，如09
     *   d     |  一位日期，如9
     *   HH    |  两位小时，如07
     *   H     |  一位小时，如7
     *   mm    |  两位分钟，如03
     *   m     |  一位分钟，如3
     *   ss    |  两位秒数，如09
     *   s     |  一位秒数，如9
     *   ms    |  毫秒数，如234
     *   w     |  中文星期几，如一
     *   ct    |  12小时制中文后缀，上午/下午
     *   et    |  12小时制英文后缀，A.M./P.M.
     *   cM    |  中文月份，如三
     *   eM    |  英文月份，如Mar
     * [/ntb]
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 根据格式输出时间，比如:2012-01-11,连接符可自定义
     *   _u._$format(new Date(),'yyyy-MM-dd');
     * [/code]
     * 
     * @api    {nej.u._$format}
     * @param  {Number|String|Date}  时间
     * @param  {String}              格式
     * @return {String}              指定格式的时间串
     */
    _u._$format = (function(){
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
            _time = _u._$var2date(_time);
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
            return _u._$encode(_map,_format);
        };
    })();
    /**
     * 转日期对象<br/>
     * 字符串日期格式同ECMA规范定义：YYYY-MM-DDTHH:mm:ss.sssZ
     * [ntb]
     *   YYYY | the decimal digits of the year 0000 to 9999 in the Gregorian calendar
     *   -    | appears literally twice  in the string
     *   MM   | the month of t he year from 01 (January) to 12 (December)
     *   DD   | the day of the month from 01 to 31
     *   T    | appears literally in the string, to indicate the beginning of the time element
     *   HH   | the number of complete hours that have passed since midnight as two decimal digits from 00 to 24
     *   :    | appears literally twice in the string
     *   mm   | the number of complete minutes since the start of the hour as two decimal digits from 00 to 59
     *   ss   | the number of complete seconds since the start of the minute as two deci mal digits  from 00 to 59
     *   .    | appears literally in the string
     *   sss  | the number of complete milliseconds since the start of the second as three decimal digits
     *   Z    | the time zone offset specified as ― Z(for UTC) or either + or - followed by  a time expression HH:mm
     * [/ntb]
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 输入字符串，数字或日期，生成日期对象
     *   _u._$var2date(new Date());
     * [/code]
     * 
     * @api    {nej.u._$var2date}
     * @param  {Number|String|Date}  时间
     * @return {Date}                日期
     */
    _u._$var2date = function(_time){
        var _date = _time;
        if (_u._$isString(_time)){
            _time = _time.replace(/-/g,'/');
            _date = new Date(Date.parse(_time));
        }
        if (!_u._$isDate(_date))
            _date = new Date(_time);
        return _date;
    };
    /**
     * 浮点数值保留指定位数小数点<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 保留2位小数
     *   _u._$fixed(3.14159,2);
     * [/code]
     * 
     * @api    {nej.u._$fixed}
     * @param  {Float}  浮点数
     * @param  {Number} 小数位
     * @return {Number} 浮点数
     */
    _u._$fixed = function(_float,_fraction){
        return new Number(_float).toFixed(_fraction);
    };
    /**
     * 相对路径转绝对路径<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 相对路径./a/b.html转绝对路径http://root/a/b.html
     *   _u._$absolute("./a/b.html","root");
     * [/code]
     * 
     * @api    {nej.u._$absolute}
     * @param  {String}  相对路径
     * @param  {String}  绝对路径ROOT，必须以http://开始，默认为location目录
     * @return {String}  绝对路径地址
     */
    _u._$absolute = (function(){
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
     * 从URL地址中提取源信息<br/>
     * http://a.b.com:8080/a/b/ -> http://a.b.com:8080<br/>
     * /a/b -> <br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   //  提前url地址的源信息，返回http://a.b.com:8080
     *   _u._$url2origin("http://a.b.com:8080/a/b/");
     * [/code]
     * 
     * @api    {nej.u._$url2origin}
     * @param  {String} URL地址
     * @return {String} 源信息
     */
    _u._$url2origin = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_url){
            if (_reg.test(_url||''))
                return RegExp.$1.toLowerCase();
            return '';
        };
    })();
    /**
     * dom节点转对象<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _e = NEJ.P(nej.e);
     *   // 返回对象{div:"123"}
     *   _u._$dom2object(_e._$get("abc"),{});
     * [/code]
     * 
     * @api    {nej.u._$dom2object}
     * @param  {Node}    节点
     * @param  {Object}  接受数据的对象
     * @return {Object}  转换完成的对象
     */
     _u._$dom2object = function(_dom,_obj){
        if (!_dom) return _obj;
        var _name = _dom.tagName.toLowerCase(),
            _list = _e._$getChildren(_dom);
        if (!_list||!_list.length){
            _obj[_name] = _dom.textContent||_dom.text||'';
            return _obj;
        }
        var _tmp = {};
        _obj[_name] = _tmp;
        _u._$forEach(_list,
            function(_node){
                _u._$dom2object(_node,_tmp);
            });
        return _obj;
    };
    /**
     * XML转对象<br/>
     * @api    {nej.u._$xml2object}
     * @param  {String}  xml代码
     * @return {Object}  对象
     */
    _u._$xml2object = function(_xml){
        try{
            return _u._$dom2object(_e._$xml2dom(_xml),{});
        }catch(ex){
            return null;
        }
    };
    /**
     * key-value字符串转对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _str = "abc=abc,123=123";
     *   // 返回对象{abc:"abc",123:"123"}
     *   _u._$string2object(_str,",");
     * [/code]
     * 
     * @api    {nej.u._$string2object}
     * @param  {String}         待处理数据
     * @param  {String|RegExp}  分隔符
     * @return {Object}         hash表
     */
    _u._$string2object = function(_string,_split){
        var _obj = {};
        _u._$forEach(
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
     * key-value对象转成key=value对后用分隔符join<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _obj = {abc:"abc",123:"123"};
     *   // 返回数组[{abc:"abc"},{123:"123"}],不编码
     *   _u._$object2string(_obj,",",false);
     * [/code]
     * 
     * @api    {nej.u._$object2string}
     * @param  {Object}  对象
     * @param  {String}  分隔符，默认为逗号
     * @param  {Boolean} 是否编码
     * @return {String}  key-value串
     */
    _u._$object2string = function(_object,_split,_encode){
        if (!_object) return '';
        var _arr = [];
        _u._$forIn(
            _object,function(_value,_key){
                if (_u._$isFunction(_value)){
                    return;
                }
                if (_u._$isDate(_value)){
                    _value = _value.getTime();
                }else if(_u._$isArray(_value)){
                    _value = _value.join(',');
                }else if(_u._$isObject(_value)){
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
     * 查询串转对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回对象{abc:"abc",123:"123"}
     *   _u._$query2object("abc=abc&123=123");
     * [/code]
     * 
     * @api    {nej.u._$query2object}
     * @param  {String}  查询串
     * @return {Object}  对象
     */
    _u._$query2object = function(_query){
        return _u._$string2object(_query,'&');
    };
    /**
     * 查询串转对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 返回对象123=123&abc=abc
     *   _u._$object2query({abc:"abc",123:"123"});
     * [/code]
     * 
     * @api    {nej.u._$object2query}
     * @param  {String}  查询串
     * @return {Object}  对象
     */
    _u._$object2query = function(_object){
        return _u._$object2string(_object,'&',!0);
    };
    /**
     * 节点集合转数组，针对低版本<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’),
     *       _map = {0:'0',1:'1',2:'2',length:3};
     *   // 返回数组['1','2','3']
     *   _u._$object2array(_map);
     * [/code]
     *
     * @api    {nej.u._$object2array}
     * @param  {Object}  集合
     * @return {Array}   数组
     */
    _u._$object2array = function(_object){
        return _h.__col2array(_object);
    };
    /**
     * 数组转对象
     * @api    {nej.u._$array2object}
     * @param  {Array}    列表
     * @param  {Function} 过滤函数
     * @return {Object}   对象
     */
    _u._$array2object = function(_list,_filter){
        var _result = {};
        _u._$forEach(
            _list,function(_item){
                var _key = _item;
                if (!!_filter){
                    _key = _filter(_item);
                }
                _result[_key] = _item;
            }
        );
        return _result;
    };
    /**
     * 格式化数字为指定位数<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 2    -> 002
     *   // 22   -> 022
     *   // 222  -> 222
     *   // 2222 -> 2222
     *   var _str = _u._$number2string(2,3);
     * [/code]
     * 
     * @api    {nej.u._$number2string}
     * @param  {Number} 数值
     * @param  {Number} 位数，至少1位
     * @return {String} 格式化后字符串
     */
    _u._$number2string = function(_number,_limit){
        var _len1 = (''+_number).length,
            _len2 = Math.max(1,parseInt(_limit)||0),
            _delta = _len2-_len1;
        if (_delta>0){
            _number = new Array(_delta+1).join('0')+_number;
        }
        return ''+_number;
    };
    /**
     * 安全删除属性<br/>
     * @api    {nej.u._$safeDelete}
     * @param  {Object}        对象
     * @param  {String|Array}  属性
     * @return {nej.u}
     */
    _u._$safeDelete = function(_object,_name){
        if (!_u._$isArray(_name)){
            try{
                delete _object[_name];
            }catch(e){
                _object[_name] = undefined;
            }
            return this;
        }
        _u._$forEach(_name,_u
          ._$safeDelete._$bind(_u,_object));
        return this;
    };
    /**
     * 随机一个字符串<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 可能返回"13d1r1dt2"
     *   _u._$randString(9);
     * [/code]
     * 
     * @api    {nej.u._$randString}
     * @param  {String}  字符串长度
     * @return {String}  随机字符串
     */
    _u._$randString = (function(){
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
     * 随机生成一个给定范围的整数<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 可能返回3
     *   _u._$randNumber(0,9);
     * [/code]
     * 
     * @see    {#_$randNumberString}
     * @api    {nej.u._$randNumber}
     * @param  {Number}  小区间，包含
     * @param  {Number}  大区间，不包含
     * @return {Number}  随机整数
     */
    _u._$randNumber = function(_min,_max){
        return Math.floor(Math.random()*(_max-_min)+_min);
    };
    /**
     * 随机生成一个全部为数字的字符串<br/>
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 可能返回123456789
     *   _u._$randNumberString(9);
     * [/code]
     * 
     * @see    {#_$randNumber}
     * @api    {nej.u._$randNumberString}
     * @param  {Number}  随机字符串的长度[1,30]
     * @return {String}  随机生成的字符串
     */
    _u._$randNumberString = function(_length){
        _length = Math.max(0,Math.min(_length||8,30));
        var _min = Math.pow(10,_length-1),_max = _min*10;
        return _u._$randNumber(_min,_max).toString();
    };
    /**
     * 生成系统中的唯一标识，每次调用均生成一个新的标识
     * 
     * 脚本举例
     * [code]
     *   var _u = NEJ.P(‘nej.u’);
     *   // 可能返回123456789
     *   var _id1 = _u._$uniqueID(),
     *       _id2 = _u._$uniqueID();
     *   // _id1 != _id2
     * [/code]
     * 
     * @api    {nej.u._$uniqueID}
     * @return {String} 唯一标识
     */
    _u._$uniqueID = (function(){
        var _seed = +new Date;
        return function(){
            return ''+(_seed++);
        };
    })();
};
NEJ.define(
    '{lib}base/util.js',[
    '{lib}base/global.js',
    '{lib}base/element.js'
],f);