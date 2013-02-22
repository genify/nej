/*
 * ------------------------------------------
 * 模块调度器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('nej.ut'),
        _proDispatcher,
        _supDispatcher;
    if (!!_p._$$Dispatcher) return;
    /**
     * 调度器对象
     * @class   {nej.ut._$$Dispatcher} 调度器对象
     * @extends {nej.ut._$$Event}
     * @param   {Object}           可选配置参数，已处理的参数列表如下
     *                           onerror   [Function] - 异常回调事件
     */
    _p._$$Dispatcher = NEJ.C();
      _proDispatcher = _p._$$Dispatcher._$extend(_p._$$Event)
      _supDispatcher = _p._$$Dispatcher._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proDispatcher.__init = function(){
        this.__supInit();
        this.__rules  = {};
        // node pointer
        this.__pool   = {};   // umi<->node private module
        this.__source = null; // last dispatched
        this.__cmroot = null; // common root between node1 and node2
        this.__root   = _p._$$Node._$allocate({name:'/'});
        // component options
        this.__lopt = {onloaded:_e._$parseTemplate};
        _v._$addEvent(location,'urlchange',
                      this.__doURIChange._$bind(this));
        // interface for module call
        this._$loaded = this.__doModuleLoad._$bind(this);
    };
    /**
     * 判断是否模块实例
     * @protected
     * @method {__isModule}
     * @param  {nej.ut._$$Module} 模块实例
     * @return {Boolean}          是否模块实例
     */
    _proDispatcher.__isModule = function(_module){
        return _module instanceof _p._$$Module;
    };
    /**
     * 判断是否私有模块
     * @protected
     * @method {__isPrivateModule}
     * @param  {String}  统一模块标识符
     * @return {Boolean} 是否私有模块
     */
    _proDispatcher.__isPrivateModule = (function(){
        var _reg = /^\/?\?(?=\/|$)/;
        return function(_umi){
            return _reg.test(_umi||'');
        };
    })();
    /**
     * 取路径上的终节点
     * @protected
     * @method {__getNodeByPath}
     * @param  {String} 统一模块标识
     * @return {Void}
     */
    _proDispatcher.__getNodeByPath = (function(){
        var _search = function(_parent,_name){
            var _name = _name||'/',
                _pname = _parent._$getName();
            if (_pname=='/'&&_name=='/')
                return _parent;
            return _parent._$getChildByName(_name);
        };
        return function(_umi){
            return this.__doUMIParse(_umi,_search);
        };
    })();
    /**
     * 取两个节点最近的公共节点
     * @protected
     * @method {__getNearestRoot}
     * @param  {nej.ut._$$Node} 源节点
     * @param  {nej.ut._$$Node} 目标节点
     * @return {Void}
     */
    _proDispatcher.__getNearestRoot = function(_source,_target){
        if (!_source||!_target)
            return this.__root;
        var _index = 0,
            _path0 = _source._$getPath(),
            _path1 = _target._$getPath();
        for(var l=_path0.length;_index<l;_index++)
            if (_path0.charAt(_index)!=
                _path1.charAt(_index))
                break;
        if (_index!=0&&
            _path0.charAt(_index-1)=='/')
            _index -= 1;
        return this.__getNodeByPath(
               _path0.substring(0,_index)||'/');
    };
    /**
     * 取父节点的开放数据
     * @protected
     * @method {__getParentExport}
     * @param  {nej.ut._$$Node} 当前节点
     * @return {Object}               开放数据
     */
    _proDispatcher.__getParentExport = function(_node){
        var _module;
        _node = _node._$getParent();
        while(!!_node){
            _module = _node._$getData().module;
            if (this.__isModule(_module)){
                return _module._$getExportData();
            }
            _node = _node._$getParent();
        }
        return null;
    };
    /**
     * 设置标题
     * @protected
     * @method {__doSetTitleByURL}
     * @param  {String} 地址
     * @return {Void}
     */
    _proDispatcher.__doSetTitleByURL = (function(){
        var _reg = /\?|#/;
        return function(_url){
            _url = (_url||'').split(_reg)[0];
            document.title = (this.__rules.title||
                             _o)[_url]||document.title;
        };
    })();
    /**
     * 格式化UMI
     * @protected
     * @method {__doUMIFormat}
     * @param  {String} 初始UMI
     * @return {String} 格式化后UMI
     */
    _proDispatcher.__doUMIFormat = function(_umi){
        _umi = (_umi||'').trim();
        var _index = _umi.indexOf('?',2);
        return _index<0?_umi:_umi.substring(0,_index);
    };
    /**
     * 路径解析执行相应逻辑
     * @protected
     * @method {__doUMIParse}
     * @param  {String}   统一模块标识
     * @param  {Function} 回调，回调输入 （父节点，下一个子节点名称），返回下一个子节点
     * @return {Void}
     */
    _proDispatcher.__doUMIParse = function(_umi,_handler){
        var _umi = this.__doUMIFormat(_umi),
            _node = this.__root,
            _handler = _handler||_f;
        if (_umi!='/'){
            var _arr = _umi.split('/');
            for(var i=0,l=_arr.length,_tmp;i<l;i++){
                _tmp = _handler(_node,_arr[i]);
                if (!_tmp) break;
                _node = _tmp;
            }
        }
        return _node;
    };
    /**
     * 执行重写规则
     * @protected
     * @method {__doPathRewrite}
     * @param  {String} 重写前路径
     * @return {String} 重写后路径
     */
    _proDispatcher.__doPathRewrite = function(_path){
        var _result = _path;
        _u._$forIn(this.__rules.rewrite,
        function(_map){
            var _test = _map.test;
            if (_u._$isString(_test)&&_path==_test){
                _result = _map.value;
                return !0;
            }else if(!!_test.test&&_test.test(_path)){
                _result = _path.replace(_test,_map.value);
                return !0;
            }
        });
        return _result;
    };
    /**
     * 配置重写规则
     * @protected
     * @method {__doRuleRewrite}
     * @param  {Object} 重写规则
     * @return {Void}
     */
    _proDispatcher.__doRuleRewrite = function(_value){
        var _rewrite = this.__rules.rewrite;
        if (!_rewrite){
            _rewrite = [];
            this.__rules.rewrite = _rewrite;
        }
        if (_u._$isObject(_value)){
            if (!!_value.test&&!!_value.value){
                _rewrite.push(_value);
                return;
            }
            var _arr = [];
            _u._$forIn(_value,function(_item,_key){
                _arr.push({test:_key,value:_item});
            });
            _value = _arr;
        }
        if (_u._$isArray(_value)){
            _rewrite.push.apply(_rewrite,_value);
        }
    };
    /**
     * 地址变化触发事件
     * @protected
     * @method {__doURIChange}
     * @param  {Object} 地址信息
     * @return {Void}
     */
    _proDispatcher.__doURIChange = function(_location){
        _location = _location||_o;
        var _node = this.__getNodeByPath(
                    this.__doPathRewrite(_location.path));
        // no target
        if (!_node){
            this._$dispatchEvent('onerror',
                                {code:-10500,
                                 message:'目标['+_location.path+']不可达！'});
            return;
        }
        this.__doSetTitleByURL(_location.path);
        // save event information
        var _source = this.__source;
        this.__source = _node;
        var _event = {referer:''
                     ,href:_location.href
                     ,param:_location.query
                     ,target:_node._$getPath()};
        if (!!_source)
            _event.referer = _source._$getData()
                                    .event.href||'';
        _node._$getData().event = _event;
        // source==target
        if (_source==_node){
            this.__doModuleRefresh(this.__source);
            return;
        }
        // hide source
        this.__cmroot = this.__getNearestRoot(_source,_node);
        if (_source!=null){
            if (_source!=this.__cmroot)
                this.__doModuleHide(_source,
                                    this.__cmroot);
            this.__doModuleRefresh(this.__cmroot);
        }else{
            this.__doModuleShow(this.__cmroot,this.__root);
        }
        // show target
        if (_node!=this.__cmroot){
            this.__doModuleShow(_node,this.__cmroot);
        }
    };
    /**
     * 模块显示并检测
     * @protected
     * @method {__doModuleShow}
     * @param  {nej.ut._$$Node} 起始节点（包含）
     * @param  {nej.ut._$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _proDispatcher.__doModuleShow = function(_from,_to){
        if (!_from) return;
        this.__doModuleFlag(_from,_to);
        this.__doModuleActive(_from);
    };
    /**
     * 显示模块
     * @protected
     * @method {__doModuleFlag}
     * @param  {nej.ut._$$Node} 起始节点（包含）
     * @param  {nej.ut._$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _proDispatcher.__doModuleFlag = function(_from,_to){
        if (_from!=_to)
            this.__doModuleFlag(_from._$getParent(),_to);
        this.__doModuleDispatch(_from,'onshow');
    };
    /**
     * 隐藏模块
     * @protected
     * @method {__doModuleHide}
     * @param  {nej.ut._$$Node} 起始节点（包含）
     * @param  {nej.ut._$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _proDispatcher.__doModuleHide = function(_from,_to){
        this.__doModuleDispatch(_from,'onhide');
        if (_from!=_to)
            this.__doModuleHide(_from._$getParent(),_to);
    };
    /**
     * 模块构造载入
     * @protected
     * @method {__doModuleLoad}
     * @param  {String}           统一模块标识
     * @param  {nej.ut._$$Module} 模块构造
     * @return {Void}
     */
    _proDispatcher.__doModuleLoad = function(_umi,_module){
        this._$regist(_umi,_module);
        if (this.__isPrivateModule(_umi)){
            for(var x in this.__pool)
                if (x.indexOf(_umi)>=0)
                    this.__doModuleActive(
                        this.__pool[x],this.__root);
        }else{
            this.__doModuleActive(this.__source);
        }
    };
    /**
     * 模块激活
     * @protected
     * @method {__doModuleActive}
     * @param  {nej.ut._$$Node} 节点对象
     * @return {Void}
     */
    _proDispatcher.__doModuleActive = function(_node){
        if (!_node) return;
        var _data = _node._$getData();
        if (!!_data.action)
            this.__doModuleAction(_node);
        var _umi = _node._$getPath();
        if (!_data.action&&
            this.__isPrivateModule(_umi))
            delete this.__pool[_umi];
    };
    /**
     * 执行模块行为
     * @protected
     * @method {__doModuleAction}
     * @param  {nej.ut._$$Node} 节点对象
     * @return {Boolean}        节点行为是否执行完成
     */
    _proDispatcher.__doModuleAction = function(_node){
        if (!_node) return !0;
        var _data = _node._$getData(),
            _action = _data.action,
            _module = _data.module;
        // check parent dispatched
        // check module loading
        if (!this.__doModuleAction(
                  _node._$getParent())
            ||(!!_action&&_u._$isString(_module)))
            return !1;
        // dispatch action
        if (!!_module&&
            !!_module._$allocate
            &&_action!='onhide'){
            var _options = {umi:_node._$getPath()};
            _module = _module._$allocate(_options);
            if (this.__isModule(_module)){
                _data.module = _module;
                this.__doModuleDispatch(_node,!this
                    .__isPrivateModule(_options.umi)?'onshow':'onapply');
            }else{
                delete _data.module;
            }
        }
        delete _data.action;
        return !0;
    };
    /**
     * 刷新模块
     * @protected
     * @method {__doModuleRefresh}
     * @param  {nej.ut._$$Node} 节点对象
     * @return {Void}
     */
    _proDispatcher.__doModuleRefresh = function(_node){
        if (!_node) return;
        this.__doModuleRefresh(_node._$getParent());
        this.__doModuleDispatch(_node,'onrefresh');
    };
    /**
     * 调度模块事件
     * @protected
     * @method {__doModuleDispatch}
     * @param  {nej.ut._$$Node} 节点对象
     * @param  {String}         事件名称 onshow/onhide/onrefresh
     * @return {Void}
     */
    _proDispatcher.__doModuleDispatch = function(_node,_name){
        if (!_node) return;
        var _data = _node._$getData(),
            _module = _data.module;
        if (this.__isModule(_module)){
            var _event;
            if (_name=='onapply'){
                _event = _node._$getData().event;
            }else if(!!this.__source&&_name!='onhide'){
                _event = this.__source._$getData().event;
            }
            if (!!_event){
                _event.umi = _node._$getPath();
                _event.data = this.__getParentExport(_node);
            } 
            _module._$dispatchEvent(_name,_event);
        }else if(!!_module){
            _data.action = _name;
            if (_name=='onshow'&&_u._$isString(_module)){
                var _config = this.__rules.config||_o;
                this.__lopt.version = (_config.ver||_o)[_module];
                _j._$loadHtml((_config.root||'')+_module,this.__lopt);
            }
        }
    };
    /**
     * 模块退出检验
     * @protected
     * @method {__doModuleExitCheck}
     * @param  {nej.ut._$$Node} 节点对象
     * @param  {String}         切换目标
     * @return {Boolean}        是否允许退出
     */
    _proDispatcher.__doModuleExitCheck = function(_node,_target){
        if (!!_node){
            var _event = {target:_target},
                _module = _node._$getData().module;
            if (!!this.__isModule(_module)){
                _module._$dispatchEvent('onbeforehide',_event);
                return !_event.stopped;
            }
        }
        return !0;
    };
    /**
     * 模块发送消息
     * @protected
     * @method {__doModuleMessage}
     * @param  {nej.ut._$$Node} 结束节点
     * @param  {Object}         消息对象
     * @return {Void}
     */
    _proDispatcher.__doModuleMessage = function(_node,_message){
        var _data = _node._$getData(),
            _module = _data.module;
        if (this.__isModule(_module))
            _module._$dispatchEvent('onmessage',_message);
    };
    /**
     * 模块广播消息
     * @protected
     * @method {__doModuleMessageWithFromTo}
     * @param  {nej.ut._$$Node} 起始节点
     * @param  {nej.ut._$$Node} 结束节点
     * @param  {Object}         消息对象
     * @return {Void}
     */
    _proDispatcher.__doModuleMessageWithFromTo = function(_from,_to,_message){
        if (_from!=_to)
            this.__doModuleMessageWithFromTo(
                 _from,_to._$getParent(),_message);
        this.__doModuleMessage(_to,_message);
    };
    /**
     * 模块广播消息
     * @protected
     * @method {__doModuleBroadcast}
     * @param  {nej.ut._$$Node} 结束节点
     * @param  {Object}         消息对象
     * @return {Void}
     */
    _proDispatcher.__doModuleBroadcast = function(_node,_message){
        _node._$bfs(function(_target){
            if (_target==_node) return;
            this.__doModuleMessage(_target,_message);
        }._$bind(this));
    };
    /**
     * 注册模块
     * @method {_$regist}
     * @param  {String}           统一模块标识
     * @param  {String|Object|
     *          nej.ut._$$Module} 模块构造或者模块路径或者{title:'xx',url:'yy'}
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$regist = (function(){
        // build tree
        var _build = function(_parent,_name){
            var _pname = _parent._$getName();
            // root not add slash child
            if (!_name&&_pname=='/')
                return _parent;
            var _node = null;
            // check slash child first
            if (_pname!='/'){
                _node = _parent._$getChildByName('/');
                if (!_node){
                    _node = _p._$$Node._$allocate({name:'/'});
                    _parent._$appendChild(_node);
                }
            }
            // check non-slash child
            if (!!_name){
                _node = _parent._$getChildByName(_name);
                if (!_node){
                    _node = _p._$$Node._$allocate({name:_name});
                    _parent._$appendChild(_node);
                }
            }
            return _node;
        };
        return function(_umi,_module){
            _module = _module||_o;
            // module is {title:'xxx',url:'yyyy'}
            if (!!_module.url&&
                !!_module.title){
                var _rule = {};
                _rule[_umi] = _module.title;
                this._$rule('title',_rule);
                _module = _module.url;
            }
            var _data = this.__doUMIParse(
                        _umi,_build)._$getData(),
                _vmdl = _data.module;
            // ignore if module constructor has been registed
            if (!_vmdl||_u._$isString(_vmdl))
                _data.module = _module;
            return this;
        };
    })();
    /**
     * 一次注册所有模块
     * @method {_$registAll}
     * @param  {Object} 模块注册表
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$registAll = function(_maps){
        _maps = _maps||_o;
        for(var x in _maps) 
            this._$regist(x,_maps[x]);
        return this;
    };
    /**
     * 激活调度器
     * @method {_$active}
     * @return {Void}
     */
    _proDispatcher._$active = function(){
        location.active();
        return this;
    };
    /**
     * 应用私有模块
     * @method {_$apply}
     * @param  {String} 统一模块标识
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$apply = (function(){
        var _doParseParam = function(_umi){
            var _index = _umi.indexOf('?',2);
            if (_index<0) return null;
            var _query = _umi.substr(_index+1);
            return _u._$query2object(_query);
        };
        return function(_umi){
            if (!this.__isPrivateModule(_umi))
                return this;
            var _node = this.__getNodeByPath(_umi),
                _path = _node._$getPath();
            this.__pool[_path] = _node;
            _node._$getData().event = {
                href:_path,
                param:_doParseParam(_umi)
            };
            this.__doModuleShow(_node,this.__root);
            return this;
        };
    })();
    /**
     * 增加规则
     * @method {_$rule}
     * @param  {String}  规则名称,已处理规则
     * [ntb]
     *  title   | 页面标题配置{umi:'title'}
     *  config  | 路径版本配置{root:'',ver:{}}
     *  rewrite | 重写规则配置
     *                             [{'/':'/index','/a/':'/a/index'}
     *                          ,{test:'/',value:'/index'}
     *                          ,{test:/^(.*)\/$/,value:'$1/index'}]
     * [/ntb]
     * @param  {Variable} 规则内容
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$rule = function(_key,_value){
        _key = (_key||'').toLowerCase();
        switch(_key){
            case 'rewrite':
                this.__doRuleRewrite(_value);
            return this;
            case 'title':
                var _map = this.__rules.title;
                if (!_map){
                     _map = {};
                     this.__rules.title = _map;
                }
                _u._$forIn(_value,function(_title,_umi){
                    _map[_umi] = _title||document.title;
                });
            return this;
            default:
                this.__rules[_key] = _value;
            return this;
        }
    };
    /**
     * 在指定路径上分发消息
     * @method {_$message}
     * @param  {Object} _message 消息内容，消息包含以下信息
     * @config {String}   to   消息目标
     * @config {String}   from 消息来源
     * @config {Variable} data 消息数据
     * @config {String}   mode 消息模式
     * [ntb]
     *   0 | 目标消息【默认】
     *   1 | 目标广播
     *   2 | 群体广播
     * [/ntb]
     *                                             
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$message = function(_message){
        _message = _message||_o;
        if (!_message.to) return this;
        var _target = this.__getNodeByPath(_message.to);
        if (!_target) return this;
        var _mode = parseInt(_message.mode)||0,
            _event = {to:_target._$getPath()
                     ,from:_message.from
                     ,data:_message.data
                     ,path:_message.to};
        if (_mode==1||_mode==2){
            this.__doModuleMessageWithFromTo(
                   this.__root,_target,_event);
            if (_mode==2)
                this.__doModuleBroadcast(_target,_event);
            return this;
        }
        this.__doModuleMessage(_target,_event);
        return this;
    };
    /**
     * 重定向
     * @method {_$redirect}
     * @param  {String}  定向地址
     * @param  {Boolean} 是否替换原地址
     * @return {nej.ut._$$Dispatcher}
     */
    _proDispatcher._$redirect = function(_url,_replaced){
        if (!this.__doModuleExitCheck(
             this.__source,_url))
            return this;
        this.__doSetTitleByURL(_url);
        location.redirect(_url,_replaced);
        return this;
    };
};
NEJ.define('{lib}util/dispatcher/v1/dispatcher.js',
      ['{lib}util/ajax/tag.js'
      ,'{lib}util/template/tpl.js'
      ,'{lib}util/history/history.js'
      ,'{lib}util/dispatcher/v1/node.js'
      ,'{lib}util/dispatcher/v1/module.js'],f);