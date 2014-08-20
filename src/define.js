(function(d,p){
var __config = {root:{/*lib,pro*/}/*patch,native,charset,global,platform*/},
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
    if (!__config.global&&!p.define){
        p.define = NEJ.define;
    }
};
/*
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
    var _deps = _obj.d;
    delete _obj.d;
    var _root = __config.root;
    for(var x in _obj){
        _root[x] = _obj[x];
    }
    _root.platform = './platform/';
    if (!_root.pro){
        _root.pro = '../javascript/';
    }
    if (!!_deps){
        document.write('<script src="'+_deps+'"></scr'+'ipt>');
    }
};
/*
 * 解析列表依赖关系
 * @return {Array} 列表
 */
var _doParseDependency = (function(){
    var _dependency = function(_list,_dmap,_test){
        if (!_list||!_list.length) 
            return null;
        var _result = [];
        for(var i=0,l=_list.length,_file,_files;i<l;i++){
            _file = _list[i];
            if (!!_test[_file])
                continue;
            _test[_file] = !0;
            _files = _dependency(_dmap[_file],_dmap,_test);
            if (!!_files&&_files.length>0)
                _result.push.apply(_result,_files);
            _result.push(_file);
        }
        return _result;
    };
    return function(_list,_dmap){
        return _dependency(_list,_dmap,{});
    };
})();
/*
 * 序列化配置依赖关系
 * @return {Void}
 */
var _doSerializeDepList = function(_map){
    if (!_map) return;
    // format url
    var _xlist = [],
        _result = {};
    for(var x in _map){
        _doParsePatched(_map[x]);
        var _list = _map[x],
            _file = _doFormatURI(x);
        _xlist.push(_file);
        _result[_file] = _list;
        if (!_list||!_list.length) continue;
        for(var i=0,l=_list.length;i<l;i++){
            _list[i] = _doFormatURI(_list[i]);
        }
    }
    // merge result
    return _doParseDependency(_xlist,_result);
};
/*
 * 初始化平台信息
 * @param  {String} _config 平台配置信息
 * @return {Void}
 */
var _doParsePlatform = (function(){
    var _reg0 = /(cef|ios|win|android)/,
        _pmap = {win:'trident-1'},
        _emap = {gk:'G',wk:'W',td:'T',pt:'P'},
        _bmap = {
            gk:'gecko',wk:'webkit',pt:'presto',
            td:['trident-0','trident-1','trident'],
           'td-0':['trident-1','trident'],'td-1':'trident-1'
        };
    return function(_config){
        _config = _config||'td|gk|wk|pt';
        var _root = __config;
        // hybrid development
        if (_reg0.test(_config)){
            var _name = RegExp.$1;
            _root.platform = _name=='win'?/T/i:/W/i;
            _root.native = '{lib}native/'+_name+'/';
            _root.patch  = '{lib}patched/'+(_pmap[_name]||'webkit')+'/';
            return;
        }
        // browser development
        _root.patch = [];
        // parse patch root
        var _arr = _config.split('|');
        for(var i=0,l=_arr.length,_name;i<l;i++){
            _name = _bmap[_arr[i]];
            if (!_name) continue;
            if (_isTypeOf(_name,'Array')){
                for(var j=0,k=_name.length;j<k;j++){
                    _root.patch.push('{lib}patched/'+_name[j]+'/');
                }
            }else{
                _root.patch.push('{lib}patched/'+_name+'/');
            }
        }
        // parse platform
        var _reg = [];
        for(var x in _emap){
            if (_config.indexOf(x)>=0){
                _reg.push(_emap[x]);
            }
        }
        _root.platform = new RegExp(_reg.join('|'),'i');
    };
})();
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
/*
 * 解析平台识别表达式
 * @param  {String} 平台识别串
 * @return {Object} 平台信息，{pkey:'engine',isEngOK:function(_engine){},vkey:'release',isVerOK:function(version){}}
 */
var _doParsePatchExp = (function(){
    var _reg0 = /\s/g,
        _reg1 = /(TR|WR|GR|TV|WV|GV)/i,
        _reg2 = /([<>=]=?)/,
        _pkey = '[VERSION]',
        _emap = {T:'trident',W:'webkit',G:'gecko'},
        _vmap = {R:'release',V:'version'};
    var _doParseVersion = function(_exp){
        return _exp.replace(_reg2,"'$1'");
    };
    return function(_exp){
        _exp = (_exp||'').replace(_reg0,'');
        if (!_reg1.test(_exp)){
            return null;
        }
        var _key = RegExp.$1,
            _brr = _key.split(''),
            _result = {
                pkey:'engine',
                vkey:_vmap[_brr[1]]
            },
            _pstr = _emap[_brr[0]];
        _result.isEngOK = function(_platform){
            return _platform==_pstr;
        };
        var _arr = _exp.split(_key),
            _left = "'"+_doParseVersion(_arr[0])+_pkey+"'",
            _right = "'"+_pkey+_doParseVersion(_arr[1])+"'";
        _result.isVerOK = function(_version){
            var _arr = ['true'];
            if (!!_left){
                _arr.push(_left.replace(_pkey,_version));
            }
            if (!!_right){
                _arr.push(_right.replace(_pkey,_version));
            }
            return eval(_arr.join('&&'));
        };
        return _result;
    };
})();
/*
 * 根据给定地址指定请求编码
 * @param  {String} _uri 地址
 * @return {String}      编码方式
 */
var _doParseCharset = function(_uri){
    return _uri.indexOf(__config.root.lib)>=0?'utf-8':__config.charset;
};
/*
 * 解析平台依赖的文件
 * @param  {Array} 依赖列表
 * @return {Array} 合并了平台信息后的依赖列表
 */
var _doMergePlatform = (function(){
    var _reg0 = /\\|\//;
    // {platform}xxx -> ['./platform/xxx','./platform/xxx.patch']
    // {platform}xxx.yy -> ['./platform/xxx.yy','./platform/xxx.patch.yy']
    var _doParsePlatformURI = function(_uri){
        _uri = (_uri||'').replace(
            '{platform}',
            __config.root.platform
        );
        var _arr = _uri.split(_reg0),
            _name = _arr.pop(),
            _path = _arr.join('/')+'/',
            _patch = _name.split('.'),
            _sufix = '';
        if (_patch.length>1){
            _sufix = '.'+_patch.pop();
        }
        return [
            _path+_name,
            _path+_patch.join('.')+'.patch'+_sufix
        ];
    };
    return function(_deps){
        for(var i=0,_it;_it=_deps[i];i++){
            if (_it.indexOf('{platform}')>=0){
                _it = _doParsePlatformURI(_it);
                _it.unshift(i,1);
                _deps.splice.apply(_deps,_it);
                //console.log('--------\n'+_deps.join('\n')+'\n--------');
            }
        }
        return _deps;
    };
})();
/*
 * 从NEJ.patch中提取依赖列表合并至define依赖列表中
 * @param  {Array}     define中的依赖列表
 * @param  {Function}  define执行函数
 * @return {Array}     合并了patch后的依赖列表
 */
var _doMergePatched = function(_deps,_callback){
    var _func = _callback.toString();
    if (_func.indexOf('NEJ.patch')<0){
        return _deps;
    }
    _deps = _deps||[];
    var _tmp = NEJ.patch,
        _reg = __config.platform;
    NEJ.patch = function(){
        var _args = _doFormatARG.apply(
            null,arguments
        );
        // check platform
        if (!_args[0]||!_args[1]||
            !_reg.test(_args[0])){
            return;
        }
        // merge dependency
        _deps.push.apply(_deps,_args[1]);
    };
    _callback();
    NEJ.patch = _tmp;
    //console.log('++++++++++++++\n'+_deps.join('\n')+'\n++++++++++++++');
    return _deps;
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
    var _xxx = !1,
        _reg = /{(.*?)}/gi,
        _reg1= /([^:])\/+/g,
        _reg3= /[^\/]*$/,
        _anchor = d.createElement('a');
    var _absolute = function(_uri){
        return _uri.indexOf('://')>0;
    };
    var _slash = function(_uri){
        return _uri.replace(_reg1,'$1/');
    };
    var _append = function(){
        if (_xxx) return;
        _xxx = !0;
        _anchor.style.display = 'none';
        document.body.appendChild(_anchor);
    };
    var _root = function(_uri) {
        return _uri.replace(_reg3,'');
    };
    var _format = function(_uri){
        _append();
        _anchor.href = _uri;
        _uri = _anchor.href;
        return _absolute(_uri)&&_uri.indexOf('./')<0 ? 
               _uri : _anchor.getAttribute('href',4); // ie6/7
    };
    return function(_uri,_baseuri){
        if(_isTypeOf(_uri,'Array')){
            var _list = [];
            for(var i = 0; i < _uri.length; i++){
                _list.push(
                    _doFormatURI(_uri[i],_baseuri)
                );
            }
            return _list;
        }
        if (!_uri) return '';
        if (_absolute(_uri)){
            return _format(_uri);
        } 
        if (_baseuri&&_uri.indexOf('.')==0){
            _uri = _root(_baseuri)+_uri;
        }
        _uri = _slash(_uri);
        var _uri = _uri.replace(_reg,function($1,$2){
                       return __config.root[$2]||$2;
                   });
        return _format(_uri);
    };
})();
/*
 * 格式化输入参数
 * @param  {String}   字符串
 * @param  {Array}    数组
 * @param  {Function} 函数
 * @return {Array}    格式化后的参数列表
 */
var _doFormatARG = function(_str,_arr,_fun){
    var _args = [null,null,null],
        _kfun = [
            function(_arg){return _isTypeOf(_arg,'String');},
            function(_arg){return _isTypeOf(_arg,'Array');},
            function(_arg){return _isTypeOf(_arg,'Function');}
        ];
    for(var i=0,l=arguments.length,_it;i<l;i++){
        _it = arguments[i];
        for(var j=0,k=_kfun.length;j<k;j++){
            if (_kfun[j](_it)){
                _args[j] = _it;
                break;
            }
        }
    }
    return _args;
};
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
    var _scriptLen = _list.length;
    for(var i=_scriptLen-1,_script;i>=0;i--){
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
        // check from begin to end
        return _loop(__queue[0]);
        //return _loop(__queue[__queue.length-1]);
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
            !_item.f||_item.f();
            __cache[_item.n] = 2;
            console.log('do '+_item.n);
        }
        i = __queue.length-1;
    }
    // check circular reference
    if (__queue.length>0&&_isFinishLoaded()){
        var _item = _doFindCircularRef()||__queue.pop();
        !_item.f||_item.f();
        __cache[_item.n] = 2;
        console.log('do+ '+_item.n);
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
    var _seed = +new Date;
    var _doComplete = function(_list,_base){
        if (!_list||!_list.length) return;
        for(var i=0,l=_list.length,_it;i<l;i++){
            _it = _list[i];
            if(_it.indexOf('.')!=0) continue;
            _list[i] = _doFormatURI(_it,_base);
        }
    };
    return function(_uri,_deps,_callback){
        // check input
        var _args = _doFormatARG.apply(
            null,arguments
        );
        _uri = _args[0]||(''+(_seed++));
        _deps = _args[1];
        _callback = _args[2];
        // merge platform and patch
        if (!!_deps){
            _doMergePlatform(_deps,_uri);
        }
        if (!!_callback){
            _deps = _doMergePatched(_deps,_callback);
        }
        _doComplete(_deps,_uri);
        _doParsePatched(_deps);
        // check module defined in file 
        _uri = _doFormatURI(_uri);
        // console.log(_uri+' -> '+(_deps||[]).join(','));
        var _state = __cache[_uri];
        if (_state===2) return; // duplication
        __cache[_uri] = 1;
        __queue.push({n:_uri,d:_deps,f:_callback});
//        console.log('define -> '+_uri);
        // load dependence
        if (!!_deps&&!!_deps.length){
            for(var i=0,l=_deps.length,_item;i<l;i++){
                _item = _doFormatURI(_deps[i],_uri);
                _deps[i] = _item;
                _doLoadScript(_item);
            }
        }
        _doCheckLoading();
    };
})();
window.NEJ = {};
/**
 * 模块定义，单个文件内模块依赖关系自行解决，使用方式如
 * 
 * 脚本举例：
 * [code]
 * 
 *  // 定义自己的文件标识为{lib}base/event.js
 *  // 依赖{lib}base/global.js和{lib}base/util.js
 *  define('{lib}base/event.js',
 *        ['{lib}base/global.js',
 *         '{lib}base/util.js'],
 *  function(){
 *      // TODO something
 *  });
 * 
 *  // 依赖于{lib}base/global.js文件
 *  define(['{lib}base/global.js'],
 *  function(){
 *      // TODO something
 *  });
 *  
 *  // 定义自己的文件标识为{lib}base/event.js
 *  // 没有依赖其他文件
 *  define('{lib}base/event.js',
 *  function(){
 *      // TODO something
 *  });
 * 
 *  // 不依赖其他文件
 *  // 等价于直接执行(function(){})()
 *  define(
 *  function(){
 *      // TODO something
 *  });
 *  
 *  // 仅用于引入依赖文件列表而不执行业务逻辑
 *  define(['{lib}base/global.js']);
 *  
 *  // 定义自己的文件标识为{lib}base/event.js
 *  // 仅用于引入依赖文件列表而不执行业务逻辑
 *  define('{lib}base/event.js',
 *        ['{lib}base/global.js']);
 * 
 * [/code]
 * 
 * @api    {NEJ.define}
 * @param  {String}   当前文件路径标识，不传自动解析
 * @param  {Array}    模块依赖的其他模块文件，没有依赖其他文件可不传此参数
 * @param  {Function} 模块定义回调
 * @return {Void}
 */
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
/**
 * 根据条件判断是否在当前平台执行，
 * 平台支持TR|WR|GR，没有比较操作符表示支持当前内核所有release版本
 * [ntb]
 * 标识符 | 说明
 * --------------------------
 *  T    | Trident引擎，如ie
 *  W    | Webkit引擎，如chrome
 *  G    | Gecko引擎，如firefox
 * [/ntb]
 * 平台内置的Trident引擎版本对应的IE版本关系：
 * [ntb]
 * Trident版本 | IE版本
 * --------------------
 *  2.0       | 6
 *  3.0       | 7
 *  4.0       | 8
 *  5.0       | 9
 *  6.0       | 10
 *  7.0       | 11
 * [/ntb]
 * 代码举例：
 * [code]
 *     NEJ.define(['./hack.js'],
 *     function(){
 *         // 针对trident平台的处理逻辑
 *         NEJ.patch('TR',function(){
 *             // TODO
 *             console.log('from inline ie');
 *          });
 *          // 针对webkit平台的处理逻辑
 *          NEJ.patch('WR',['./hack.chrome.js'],function(){
 *              // TODO
 *              console.log('from inline chrome');
 *          });
 *          // 针对gecko平台的处理逻辑
 *          NEJ.patch('GR',['./hack.firefox.js'],function(){
 *              // TODO
 *              console.log('from inline firefox');
 *          });
 *       
 *          // 针对IE6平台的处理逻辑
 *          NEJ.patch('TR==2.0',['./hack.ie6.js']);
 *       
 *          // 针对IE7-IE9的处理逻辑
 *          NEJ.patch('3.0<=TR<=5.0',function(){
 *              // TODO
 *              console.log('from inline ie7-ie9');
 *          });
 *   });
 * [/code]
 * @api    {NEJ.patch}
 * @param  {String}    平台识别条件，如：6<=TR<=9
 * @param  {Array}     依赖文件列表
 * @param  {Function}  执行函数
 * @return {Void}  
 */
NEJ.patch = function(_exp,_deps,_callback){
    var _args = _doFormatARG.apply(
        null,arguments
    );
    if (!_args[0]) return;
    // check platform
    var _kernel = nej.p._$KERNEL,
        _result = _doParsePatchExp(_args[0]);
    if (!!_result&&!!_args[2]&&
        _result.isEngOK(_kernel[_result.pkey])&&
        _result.isVerOK(_kernel[_result.vkey])){
        _args[2]();
    }
};
/**
 * 载入依赖配置，对于老项目或者使用第三方框架的项目，可以使用此接口配置
 * 
 * 项目某个页面加载的脚本列表
 * [code type="html"]
 *   <script src="./a.js"></script>
 *   <script src="./b.js"></script>
 *   <script src="./c.js"></script>
 *   <script src="./d.js"></script>
 *   <script src="./e.js"></script>
 *   <script src="./f.js"></script>
 * [/code]
 * 
 * 根据脚本规则提取文件的依赖关系，没有依赖其他文件可不配置，假设页面入口文件为f.js
 * [code]
 *   var deps = {
 *       '{pro}f.js':['{pro}d.js'],
 *       '{pro}e.js':['{pro}a.js','{pro}b.js','{pro}c.js'],
 *       '{pro}c.js':['{pro}b.js'],
 *       '{pro}b.js':['{pro}a.js']
 *   };
 * [/code]
 * 
 * 通过NEJ.config配置依赖关系，假设以下配置文件的路径为./deps.js
 * [code]
 *   NEJ.config(deps,['{pro}f.js']);
 * [/code]
 * 
 * 修改页面使用文件依赖管理，使用d参数配置依赖文件地址
 * [code type="html"]
 *   <script src="http://nej.netease.com/nej/src/define.js?d=./deps.js&pro=./"></script>
 *   <script src="./f.js"></script>
 * [/code]
 * 
 * 之后项目只需要维护deps.js中的依赖配置信息即可
 * 说明：
 * 开发阶段deps.js中配置的文件均会被载入页面中，
 * 发布上线时仅提取页面使用到的脚本，
 * 比如上例中页面只用到f.js，
 * 通过配置文件可以发现f.js只依赖了d.js，
 * 因此这个页面最终发布时只会导出d.js和f.js
 * 
 * @api    {NEJ.config}
 * @param  {Object}   依赖映射表，如'{pro}a.js':['{pro}b.js','{pro}c.js']
 * @param  {Array}    入口屏蔽文件列表，页面载入依赖配置文件中的文件时不载入此列表中的文件，多为页面入口文件
 * @return {Void}
 */
NEJ.config = function(_map,_entry){
    var _list = _doSerializeDepList(_map);
    if (!_list||!_list.length) return;
    // ignore entry list
    var _map = {};
    if (!!_entry&&_entry.length>0){
        for(var i=0,l=_entry.length;i<l;i++){
            _map[_doFormatURI(_entry[i])] = !0;
        }
    }
    for(var i=_list.length-1;i>=0;i--){
        if (!!_map[_list[i]]){
            _list.splice(i,1);
        }
    }
    // load script
    var _arr = [];
    for(var i=0,l=_list.length,_it;i<l;i++){
        _it = _list[i];
        _arr.push('<script src="'+_it+'"></scr'+'ipt>');
        __cache[_it] = 2;
    }
    document.writeln(_arr.join(''));
};
// init
_doInit();
})(document,window);
