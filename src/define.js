(function(d,p){
var __config = {root:{/*lib,pro*/}/*patch,native,charset,global*/},
    __queue  = [], // item:{n:'filename',d:[],f:function}
    __cache  = {}, // uri:STATE   0-loading  1-waiting  2-defined
    __stack  = []; // for define stack
/*
 * 显示日志
 * @param  {String} _msg 日志内容
 * @return {Void}
 */
var _doLog = (function(){
    var _div,_div1,_css1 = {cursor:'pointer',textAlign:'center',backgroundColor:'#ddd'},
        _css = {display:'none',position:'absolute',top:0,right:0,boder:'1px solid #aaa',overflow:'auto',height:'300px',width:'400px',zIndex:'1000',fontSize:'12px',color:'#fff',backgroundColor:'#000',lineHeight:'20px',textAlign:'left'};
    return function(_msg){
        if (!_div){
            _div = document.createElement('div');
            var _style = _div.style;
            for(var x in _css)
                _style[x] = _css[x];
            document.body.appendChild(_div);
            _div1 = document.createElement('div');
            _div1.title = '关闭控制台信息';
            _div1.innerHTML = '×';
            _style = _div1.style;
            for(var x in _css1)
                _style[x] = _css1[x];
            _div.appendChild(_div1);
            _div1.onclick = function(){_div.style.display='none';};
            document.attachEvent('onkeypress',function(_event){
                // press ~ to show console
                if (_event.keyCode==96)
                    _div.style.display = 'block';
            });
        }
        var p = document.createElement('div');
        p.innerHTML = _msg;
        _div1.insertAdjacentElement('afterEnd',p);
    };
})();
/*
 * 文件初始化
 * @return {Void}
 */
var _doInit = function(){
    if (!p.console)
        p.console = {log:_doLog};
    // do init add loaded script and remove node
    var _list = d.getElementsByTagName('script');
    if (!_list||!_list.length) return;
    var _reg = /\/define(?:\.cmp)?\.js(?=\?|#|$)/;
    for(var i=_list.length-1,_script;i>=0;i--){
        _script = _list[i];
        _script.xxx = !0;
        _reg.test(_script.src) 
            ? _doParseConfig(_script.src)
            : _doScriptLoaded(_script,!0);
    }
    if (!__config.global)
        p.define = NEJ.define;
};
/**
 * 解析地址
 * @param  {String} 
 * @return {Void}
 */
var _doParseConfig = function(_uri){
    _uri = _doFormatURI(_uri);
    if (!_uri) return;
    var _arr = _uri.split('?');
    __config.root.lib = _arr[0].replace(/define(?:\.cmp)?\.js/,'');
    var _obj = _doStr2Obj(_arr[1]);
    __config.charset = _obj.c||'utf-8';
    __config.global = _obj.g=='true';
    delete _obj.c;
    delete _obj.g;
    _doParsePlatform(_obj.p);
    delete _obj.p;
    var _root = __config.root;
    for(var x in _obj)
        _root[x] = _obj[x];
    if (!_root.pro)
        _root.pro = '../javascript/';
};
/*
 * 初始化平台信息
 * @param  {String} _config 平台配置信息
 * @return {Void}
 */
var _doParsePlatform = function(_config){
    if (!_config)
        _config = 'td|gk|wk|pt';
    var _root = __config,
        _pmap = {win:'trident-1'},
        _bmap = {td:['trident-0','trident-1','trident'],
                'td-0':['trident-1','trident'],
                'td-1':'trident-1',gk:'gecko',wk:'webkit',pt:'presto'},
        _reg0 = /(cef|ios|win|android)/;
    // hybrid development
    if (_reg0.test(_config)){
        var _name = RegExp.$1;
        _root['native'] = '{lib}native/'+_name+'/';
        _root['patch']  = '{lib}patched/'+(_pmap[_name]||'webkit')+'/';
        return;
    }
    // browser development
    _root.patch = [];
    var _arr = _config.split('|');
    for(var i=0,l=_arr.length,_name;i<l;i++){
        _name = _bmap[_arr[i]];
        if (!_name) continue;
        if (_isTypeOf(_name,'Array'))
            for(var j=0,k=_name.length;j<k;j++)
                _root.patch.push('{lib}patched/'+_name[j]+'/');
        else
            _root.patch.push('{lib}patched/'+_name+'/');
    }
};
/*
 * 依赖列表平台补丁处理
 * @param  {Array} _list 依赖列表
 * @return {Void}
 */
var _doParsePatched = function(_list){
    if (!_list||!_list.length) return;
    var _native  = __config['native'],
        _patched = __config['patch'],
        _istring = _isTypeOf(_patched,'String');
    for(var i=_list.length-1,_name;i>=0;i--){
        _name = _list[i];
        if (!!_native&&_name.indexOf('{native}')>=0)
            _list[i] = _name.replace('{native}',_native);
        if (_name.indexOf('{patch}')>=0){
            if (_istring)
                _list[i] = _name.replace('{patch}',_patched);
            else{
                _name = _name.replace('{patch}','');
                _name =(_patched.join(_name+',')+_name).split(',');
                _name.unshift(i,1);
                _list.splice.apply(_list,_name);
            }
        }
    }
};
/**
 * 根据给定地址指定请求编码
 * @param  {String} _uri 地址
 * @return {String}      编码方式
 */
var _doParseCharset = function(_uri){
    return _uri.indexOf(__config.root.lib)>=0?'utf-8':__config.charset;
};
/*
 * 判断是否字符串
 * @param  {Varable} _data 数据
 * @param  {String}  _type 类型
 * @return {Boolean}       是否字符串
 */
var _isTypeOf = function(_data,_type){
    return Object.prototype.toString.call(_data)==='[object '+_type+']';
};
/*
 * 取事件触发元素
 * @param  {Event} _event 事件对象
 * @return {Void}
 */
var _getElement = function(_event){
    return !_event?null:(_event.target||_event.srcElement);
};
/*
 * 查询串转对象
 * @param  {String} _query 查询串
 * @return {Object}        对象
 */
var _doStr2Obj = function(_query){
    var _result = {},
        _list = (_query||'').split('&');
    if (!!_list&&!!_list.length)
        for(var i=0,l=_list.length,_brr,_key;i<l;i++){
            _brr = _list[i].split('=');
            _key = _brr.shift();
            if (!_key) continue;
            _result[decodeURIComponent(_key)] = 
                    decodeURIComponent(_brr.join('='));
        }
    return _result;
};
/*
 * 格式化地址,取绝对路径
 * @param  {String} _uri 待格式化地址
 * @return {String}      格式化后地址
 */
var _doFormatURI = (function(){
    var _reg = /{(.*?)}/gi,
        _anchor = d.createElement('a');
    var _absolute = function(_uri){
        return _uri.indexOf('://')>0;
    };
    return function(_uri){
        if (!_uri) return '';
        if (_absolute(_uri)) return _uri;
        var _uri = _uri.replace(_reg,function($1,$2){
                       return __config.root[$2]||$2;
                   });
        _anchor.href = _uri;
        _uri = _anchor.href;
        return _absolute(_uri) ? _uri :
               _anchor.getAttribute('href',4); // ie6/7
    };
})();
/*
 * 侦测脚本载入情况
 * @param  {Node} _script 脚本节点
 * @return {Void}
 */
var _doAddListener = (function(){
    var _statechange = function(_event){
        var _element = _getElement(_event)||this;
        if (!_element) return;
        var _state = _element.readyState;
        if (_state==='loaded'||
            _state==='complete')
            _doScriptLoaded(_element,!0);
    };
    return function(_script){
        _script.onload = function(e){_doScriptLoaded(_getElement(e),!0);};
        _script.onerror = function(e){_doScriptLoaded(_getElement(e),!1);};
        _script.onreadystatechange = _statechange;
    };
})();
/*
 * 页面已存在的script节点添加事件检测
 * @return {Void}
 */
var _doAddAllListener = function(){
    var _list = document.getElementsByTagName('script');
    for(var i=_list.length-1,_script;i>=0;i--){
        _script = _list[i];
        if (!_script.xxx){
            _script.xxx = !0;
            !_script.src ? _doClearStack()
                         : _doAddListener(_list[i]);
        }
    }
};
/*
 * 清理脚本节点
 * @param  {Node} _script 脚本节点
 * @return {Void}
 */
var _doClearScript = function(_script){
    if (!_script||!_script.parentNode) return;
    _script.onload = null;
    _script.onerror = null;
    _script.onreadystatechange = null;
    _script.parentNode.removeChild(_script);
};
/*
 * 检查所有文件是否都载入
 * @return {Boolean} 是否都载入
 */
var _isFinishLoaded = function(){
    for(var x in __cache)
        if (__cache[x]===0)
            return !1;
    return !0;
};
/*
 * 检查列表是否都载入
 * @param  {Array}   _list   列表
 * @param  {Boolean} _format 是否做格式化
 * @return {Void}
 */
var _isListLoaded = function(_list,_format){
    var _isok = !0;
    if (!!_list&&!!_list.length)
        for(var i=_list.length-1,_item;i>=0;i--){
            _item = _list[i];
            if (!!_format)
                _list[i] = _doFormatURI(_item);
            if (_isok&&__cache[_item]!==2)
                _isok = !1;
        }
    return _isok;
};
/*
 * 载入依赖脚本
 * @param  {String} _uri 脚本地址
 * @return {Void}
 */
var _doLoadScript = function(_uri){
    if (!_uri) return;
    var _state = __cache[_uri];
    if (_state!=null) return;
    // load file
    __cache[_uri] = 0;
    var _script = d.createElement('script');
    _script.xxx = !0;
    _script.type = 'text/javascript';
    _script.charset = _doParseCharset(_uri);
    _doAddListener(_script);
    _script.src = _uri;
    d.body.appendChild(_script);
};
/*
 * 脚本载入完成回调
 * @param  {Node}    _script 脚本节点对象
 * @param  {Boolean} _isok   脚本载入是否成功
 * @return {Void}
 */
var _doScriptLoaded = function(_script,_isok){
    var _uri = _doFormatURI(_script.src);
    if (!_uri) return;
    var _arr = __stack.pop();
    if (!!_arr){
        _arr.unshift(_uri);
        _doDefine.apply(null,_arr);
    }
    if (!_isok){
        delete __cache[_uri];
    }else if (!!_uri&&__cache[_uri]!=1){
        __cache[_uri] = 2;
    }
    _doClearScript(_script);
    _doCheckLoading();
};
/*
 * 搜索循环引用
 * @return {Object} 需解环项
 */
var _doFindCircularRef = (function(){
    var _result;
    var _index = function(_array,_name){
        for(var i=_array.length-1;i>=0;i--)
            if (_array[i].n==_name)
                return i;
        return -1;
    };
    var _loop = function(_item){
        if (!_item) return;
        var i = _index(_result,_item.n);
        if (i>=0) return _item;
        _result.push(_item);
        var _deps = _item.d;
        if (!_deps||!_deps.length) return;
        for(var i=0,l=_deps.length,_citm;i<l;i++){
            _citm = _loop(__queue[_index(__queue,_deps[i])]);
            if (!!_citm) return _citm;
        }
    };
    return function(){
        _result = [];
        return _loop(__queue[__queue.length-1]);
    };
})();
/*
 * 检查依赖载入情况
 * @return {Void}
 */
var _doCheckLoading = function(){
    if (!__queue.length) return;
    for(var i=__queue.length-1,_item;i>=0;){
        _item = __queue[i];
        if (__cache[_item.n]!==2&&
           !_isListLoaded(_item.d)){
            i--; continue;
        }
        __queue.splice(i,1);
        if (__cache[_item.n]!==2){
            _item.f();
            __cache[_item.n] = 2;
            console.log('do '+_item.n)
        }
        i = __queue.length-1;
    }
    // check circular reference
    if (__queue.length>0&&_isFinishLoaded()){
        var _item = _doFindCircularRef()||__queue.pop();
        _item.f();
        __cache[_item.n] = 2;
        console.log('do+ '+_item.n)
        _doCheckLoading();
    }
};
/*
 * 清理函数定义缓存栈
 * @return {Void}
 */
var _doClearStack = function(){
    var _args = __stack.pop();
    while(!!_args){
        _doDefine.apply(null,_args);
        _args = __stack.pop();
    }
};
/*
 * 查找当前执行的脚本
 * @return {Node} 当前执行脚本
 */
var _doFindScriptRunning = function(){
    var _list = document.getElementsByTagName('script');
    for(var i=_list.length-1,_script;i>=0;i--){
        _script = _list[i];
        if (_script.readyState=='interactive')
            return _script;
    }
};
/*
 * 执行模块定义
 * @param  {String}   _uri      当前所在文件，确定文件中模块不会被其他文件依赖时可以不用传此参数，比如入口文件
 * @param  {Array}    _deps     模块依赖的其他模块文件，没有依赖其他文件可不传此参数
 * @param  {Function} _callback 模块定义回调【必须】
 * @return {Void}
 */
var _doDefine = (function(){
    var _seed = new Date().getTime();
    return function(_uri,_deps,_callback){
        // check input
        if (_isTypeOf(_deps,'Function')){
            _callback = _deps;
            _deps = null;
        }
        if (_isTypeOf(_uri,'Array')){
            _deps = _uri;
            _uri = ''+_seed++;
        }
        if (_isTypeOf(_uri,'Function')){
            _callback = _uri;
            _deps = null;
            _uri = ''+_seed++;
        }
        _doParsePatched(_deps);
//        console.log(_uri+' -> ['+(_deps||[]).join(',')+']')
        // check module defined in file 
        _uri = _doFormatURI(_uri);
        var _state = __cache[_uri];
        if (_state===2) return; // duplication
        __cache[_uri] = 1;
        __queue.push({n:_uri,d:_deps,f:_callback});
//        console.log('define -> '+_uri);
        // load dependence
        if (!!_deps&&!!_deps.length)
            for(var i=0,l=_deps.length,_item;i<l;i++){
                _item = _doFormatURI(_deps[i]);
                _deps[i] = _item;
                _doLoadScript(_item);
            }
        _doCheckLoading();
    };
})();
/**
 * 模块定义，单个文件内模块依赖关系自行解决，使用方式如
 * 
 * 脚本举例：
 * [code]
 * 
 *  // 依赖{lib}base/global.js和{lib}base/util.js
 *  // 可能被其他文件依赖
 *  define('{lib}base/event.js',
 *        ['{lib}base/global.js'
 *        ,'{lib}base/util.js'],
 *  function(){
 *      // TODO something
 *  });
 * 
 *  // 不会被其他模块依赖
 *  // 依赖于{lib}base/global.js文件
 *  define(['{lib}base/global.js'],
 *  function(){
 *      // TODO something
 *  });
 * 
 *  // 没有依赖其他文件
 *  // 可能被其他文件依赖
 *  define('{lib}base/event.js',
 *  function(){
 *      // TODO something
 *  });
 * 
 *  // 不依赖其他文件
 *  // 不会被其他文件依赖
 *  // 等价于直接执行(function(){})()
 *  define(
 *  function(){
 *      // TODO something
 *  });
 * [/code]
 * 
 * @api    {NEJ.define}
 * @param  {String}   当前所在文件，确定文件中模块不会被其他文件依赖时可以不用传此参数，比如入口文件
 * @param  {Array}    模块依赖的其他模块文件，没有依赖其他文件可不传此参数
 * @param  {Function} 模块定义回调【必须】
 */
window.NEJ = {};
NEJ.define = function(_uri,_deps,_callback){
    // has uri
    if (_isTypeOf(_uri,'String'))
        return _doDefine.apply(null,arguments);
    // without uri
    var _args = [].slice.call(arguments,0),
        _script = _doFindScriptRunning();
    // for ie check running script
    if (!!_script){
        var _src = _script.src;
        if (!!_src)
            _args.unshift(_doFormatURI(_src));
        return _doDefine.apply(null,_args);
    }
    // for other 
    __stack.push(_args);
    _doAddAllListener();
};
// init
_doInit();
})(document,window);
