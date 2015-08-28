/*
 * ------------------------------------------
 * 模块调度器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dispatcher/dispatcher */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/history/history',
    'util/template/tpl',
    'util/event',
    './dsp/util.js',
    './dsp/node.js',
    './dsp/group.js',
    './dsp/single.js',
    './module.js',
    '{platform}dispatcher.js'
],function(NEJ,_k,_e,_v,_u,_t0,_t1,_t2,_t3,_t4,_t5,_t6,_t7,_h,_p,_o,_f,_r){
    var _pro;
    /**
     * 调度器对象，项目仅允许实例化一个调度器
     *
     * 代码举例
     * ```javascript
     * NEJ.define([
     *     'util/template/tpl',
     *     'util/dispatcher/dispatcher'
     * ],function(_e,_p){
     *     // 取调度器实例
     *     var dispatcher = _p._$$Dispatcher._$getInstance();
     *
     *     // 添加规则
     *     dispatcher._$rule({
     *         title:{
     *             '/m/a':'模块标题',
     *             '/m/b':'模块标题'
     *         },
     *         rewrite:[
     *             {'/m/a':''},
     *             {'/m/b':/^\/m\/d.*$/i}
     *         ]
     *     });
     *
     *     // 注册模块
     *     dispatcher._$regist({
     *         '/m/a':'/m/a.html',
     *         '/m/b':'/m/b.html',
     *         '/m/c':'/m/c.html'
     *     });
     *
     *     // 激活调度器
     *     dispatcher._$active();
     *
     *     // 以上逻辑也可通过构造参数方式输入
     *     var dispatcher = _p._$$Dispatcher._$getInstance({
     *         rules:{
     *             title:{
     *                 '/m/a':'模块标题',
     *                 '/m/b':'模块标题'
     *             },
     *             rewrite:[
     *                {'/m/a':''},
     *                {'/m/b':/^\/m\/b.*$/i}
     *             ]
     *         },
     *         modules:{
     *             '/m/a':'/m/a.html',
     *             '/m/b':'/m/b.html',
     *             '/m/c':'/m/c.html'
     *         },
     *         onbeforechange:function(_event){
     *             // 根据dispatcher规则解析出来的路径信息
     *             // _event.path   <--- 模块UMI
     *             // _event.href   <--- 路径完整信息
     *             // _event.query  <--- 查询参数信息
     *             // 可以通过修改以上参数调整调度模块
     *         }
     *     })
     *     dispatcher._$active();
     *
     *     // 调度器激活前需确保当前可能出现的模块均已注册到调度器中
     *     // 实际应用中常出现以下情况
     *     var dispatcher = _$$Dispatcher._$getInstance({
     *         modules:{
     *             '/m/a':'/m/a.html',
     *             '/m/b':'/m/b.html',
     *             '/m/c':'/m/c.html'
     *         }
     *     });
     *     // 先解析页面模板，因为在解析模板的过程中可能会有模块构造器的注册逻辑
     *     // 注册模块构造器的优先级要比注册模板文件地址的优先级高，
     *     // 因此必须确保此处可能出现注册构造器的逻辑已处理以避免调度器激活时发出模块模板文件的请求
     *     // 比如 在模板内联了'/m/c'模块的相关模板（包括样式、结构和逻辑），如果此处不先解析模板，
     *     // 则在调度器激活时，调度器会识别出'/m/c'对应的是模板文件'/m/c.html'，因此回去加载这个文件，
     *     // 而实际上这个文件的内容已内联在页面的模板中，因此会产生额外的请求开销
     *     _e._$parseTemplate('template-box');
     *     // 激活调度器
     *     dispatcher._$active();
     * });
     * ```
     *
     * @class    module:util/dispatcher/dispatcher._$$Dispatcher
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}  config  - 可选配置参数，已处理的参数列表如下
     * @property {Object}  modules - 模块配置
     * @property {Object}  rules   - 规则配置
     * @property {Boolean} rest    - 是否支持REST风格的UMI解析
     */
    /**
     * 行为解析之前触发事件，一般用于解析节点中行为相关信息
     *
     * 结构举例
     * ```html
     * <div data-res-id="xxxx"
     *      data-res-type="2"
     *      data-res-action="show"
     *      data-res-data="a=aaaa&b=bbbb&c=cccc">
     *   <!-- content here -->
     * </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/dispatcher/dispatcher'
     * ],function(_p){
     *     // startup dispatcher
     *     _p._$startup({
     *         // ...
     *         onbeforeaction:function(_event){
     *             var _data = _e._$dataset(_event.target,'resData');
     *             // _event.result -> {id:'xxxx',type:'2',action:'show'}
     *             _event.result.param = _data;
     *         }
     *     });
     * });
     * ```
     *
     * @event    module:util/dispatcher/dispatcher._$$Dispatcher#onbeforeaction
     * @param    {Object} event  - 行为相关信息
     * @property {Node}   target - 触发行为的节点对象
     * @property {Event}  event  - 原始事件对象
     * @property {Object} result - 行为相关信息
     */
    /**
     * 地址变换之前触发事件
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/dispatcher/dispatcher'
     * ],function(_p){
     *     // startup dispatcher
     *     _p._$startup({
     *         // ...
     *         onbeforechange:function(_event){
     *             // _event -> {path:'/m/a',href:'http://a.b.com/m/a',query:{a:'aaaaa'}}
     *             var _umi = _event.path||'';
     *             if (!!_umi&&_umi.indexOf('/?')<0&&_umi.indexOf('/m')<0){
     *                 _event.path = '/m'+_umi;
     *             }
     *         }
     *     });
     * });
     * ```
     *
     * @event    module:util/dispatcher/dispatcher._$$Dispatcher#onbeforechange
     * @param    {Object} event - 地址信息
     * @property {String} path  - 路径信息，不带查询参数
     * @property {String} href  - 完整路径，带查询参数
     * @property {Object} query - 查询参数解析出来的对象
     */
    _p._$$Dispatcher = _k._$klass();
    _pro = _p._$$Dispatcher._$extend(_t2._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        var _seed = _u._$uniqueID();
        this.__pbseed = 'pb-'+_seed;
        this.__pvseed = 'pv-'+_seed;
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        // temporary params
        // umi - input params
        this.__dtmp = {};
        this.__rest = !!_options.rest;
        this.__root = _t4._$$Node._$allocate();
        // config map
        // - m   config for module, umi:{title:'xxx' ... }
        // - mg  umi to group id map, umi:gid
        // - r   config for rewrite, [{umi:regexp or string or function or array}]
        // - rr  build-in rewrite
        // - al  alias map
        // - am  actions map, {click:[],dblclick:[]}
        this.__config = {m:{},mg:{},r:[],rr:{},al:{},am:{}};
        this.__groups = {};
        // for public module umi manager
        this.__doBuildGroup(this.__pbseed);
        // for private module umi manager
        this.__groups[this.__pvseed] =
            _t5._$$GroupManager._$allocate({
                root:this.__root,
                dispatcher:this
            });
        // bugfix hash title for ie with flash
        _h.__doFixHashTitle(document.title);
        // add listeners
        this.__doInitDomEvent([[
            location,'urlchange',
            this.__onURLChange._$bind(this)
        ]]);
        this.__super(_options);
        // init config
        this._$rule(_options.rules);
        this._$regist(_options.modules);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__destroy
     * @return {Void}
     */
    _pro.__destroy = (function(){
        var _doRecycle = function(_group,_key,_map){
            delete _map[_key];
            _group._$recycle();
        };
        return function(){
            delete this.__config;
            this.__root = this.__root._$recycle();
            _u._$loop(this.__groups,_doRecycle);
            this.__super();
        };
    })();
    /**
     * 设置模块配置信息
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__setModuleConf
     * @param  {String}   arg0 - 模块UMI
     * @param  {String}   arg1 - 配置类别
     * @param  {Variable} arg2 - 配置信息
     * @return {Void}
     */
    _pro.__setModuleConf = function(_umi,_key,_value){
        var _mconf = this.__config.m[_umi];
        if (!_mconf){
            _mconf = {};
            this.__config.m[_umi] = _mconf;
        }
        _mconf[_key] = _value;
    };
    /**
     * 取模块配置信息
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__getModuleConf
     * @param  {String} arg0 - 模块UMI
     * @param  {String} arg1 - 配置标识
     * @return {String}        配置信息
     */
    _pro.__getModuleConf = function(_umi,_key){
        var _mconf = this.__config.m[_umi];
        return !_mconf?'':_mconf[_key];
    };
    /**
     * 构建分组管理器
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__doBuildGroup
     * @param  {String} arg0 - 管理器标识
     * @return {module:util/dispatcher/dsp/single._$$GroupManagerSingle} 分组管理器实例
     */
    _pro.__doBuildGroup = function(_gid){
        if (!_gid) return;
        var _group = this.__groups[_gid];
        if (!_group){
            _group = _t6._$$GroupManagerSingle._$allocate({
                root:this.__root,
                dispatcher:this,
                classed:_gid==this.__pbseed
            });
            this.__groups[_gid] = _group;
        }
        return _group;
    };
    /**
     * 添加UMI至分组管理器
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__doAddUMI2Group
     * @param  {String} arg0 - 模块UMI
     * @param  {String} arg1 - 分组标识
     * @return {Void}
     */
    _pro.__doAddUMI2Group = function(_umi,_gid){
        var _group = this.__doBuildGroup(_gid);
        if (!_group){
            _gid = _t3._$isUMIPrivate(_umi)
                 ? this.__pvseed : this.__pbseed;
            _group = this.__groups[_gid];
        }
        _group._$addUMI(_umi);
        this.__config.mg[_umi] = _gid;
    };
    /**
     * 重写UMI规则
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__doRewriteUMI
     * @param  {String} arg0 - 模块UMI
     * @return {String}        重写后模块UMI
     */
    _pro.__doRewriteUMI = (function(){
        var _reg = /\$\d/;
        return function(_umi,_href){
            var _result;
            _u._$forIn(this.__config.r,
                function(_config){
                    _u._$forIn(_config,
                        function(_value,_key){
                            // fix safari array bug #{404:'/'}
                            if (_value==null){
                                return;
                            }
                            // function
                            if (_u._$isFunction(_value)){
                                var _ret = !1;
                                try{
                                    _ret = _value.call(null,{
                                        umi:_umi,
                                        href:_href
                                    });
                                }catch(ex){
                                    // ignore
                                }
                                if (!!_ret){
                                    _result = _key;
                                    return !0;
                                }
                            }
                            // array
                            if (_u._$isArray(_value)){
                                var _index = _u._$indexOf(_value,function(v){
                                    return v===_umi||v===_href;
                                });
                                if (_index>=0){
                                    _result = _key;
                                    return !0;
                                }
                            }
                            // regexp
                            if (!!_value.test&&(
                                  _value.test(_umi)||
                                  _value.test(_href))){
                                // /^\/a\/([\d]+)\/([\d]+)\/$/ ---> /a/?p=$1&k=$2
                                // /a/123/456/ ---> /a/?p=123&k=456
                                _result = _reg.test(_key)?_umi.replace(_value,_key):_key;
                                return !0;
                            }
                            // string
                            if (_value===_umi||
                                _value===_href){
                                _result = _key;
                                return !0;
                            }
                        });
                    return !!_result;
                });
            return _result||_umi;
        };
    })();
    /**
     * URL变化触发事件
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__onURLChange
     * @param  {Object} arg0 - 地址信息
     * @return {Void}
     */
    _pro.__onURLChange = (function(){
        var _trim = /(?:^\/+)|(?:\/+$)/gi,
            _reg0 = /#(\$.*?)$/,
            _reg1 = /\/$/;
        var _doParseRestParam = function(_umi,_node){
            var _path = _node._$getPath(),
                _umi = _umi.replace(_path,'')
                           .replace(_trim,'');
            return _umi.split('/');
        };
        var _doTryGroupId = function(_umi,_map){
            // TODO improve performance
            var _value,
                _arr = _umi.split('/');
            while(_arr.length>0){
                if (!_arr[_arr.length-1]){
                    _arr.pop();
                }else{
                    _arr[_arr.length-1] = '';
                }
                _value = _map[_arr.join('/')];
                if (!!_value) return _value;
            }
            return '';
        };
        return function(_location){
            // ignore if hash start with $
            if (_location.path.indexOf('$')==0) return;
            // check input param
            var _input = this.__dtmp[_location.path];
            delete this.__dtmp[_location.path];
            // check outer logic
            this._$dispatchEvent('onbeforechange',_location);
            var _umi = this.__doRewriteUMI(
                    _location.path,
                    _location.href
                ),
                _gid = this.__config.mg[_umi];
            // try umi from rest path
            if (!_gid&&this.__rest){
                _gid = _doTryGroupId(
                       _umi,this.__config.mg);
            }
            // public umi not registed
            if (!_gid&&!_t3._$isUMIPrivate(_umi)){
                _umi = this.__config.rr['404'];
                _gid = this.__config.mg[_umi];
            }
            // try umi from rest path
            if (!_gid&&this.__rest){
                _gid = _doTryGroupId(
                       _umi,this.__config.mg);
            }
            if (!_gid) return;
            // save dispatch event
            var _node = _t3._$getNodeByUMI(this.__root,_umi),
                _prst = null;
            if (this.__rest){
                _prst = _doParseRestParam(_umi,_node);
                // try rest umi end with /
                if (!_reg1.test(_umi)&&
                    !!this.__config.mg[_umi+'/']){
                    _node = _node._$getChildByName('/');
                }
            }
            // fix umi for module
            var _source = _umi;
            _umi = _node._$getPath();
            _node._$getData().event = {
                target:_umi,
                source:_source,
                href:_location.href,
                param:_location.query,
                input:_input,
                prest:_prst,
                clazz:this.__getModuleConf(_umi,'clazz'),
                pos:_reg0.test(_location.href)?RegExp.$1:''
            };
            // dispatch module
            var _title = this.__getModuleConf(_source,'title');
            if (!!_title) document.title = _title;
            this.__groups[_gid]._$dispatchUMI(_umi);
        };
    })();
    /**
     * 点击代理
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__onClickDelegate
     * @param  {Event} arg0 - 点击事件对象
     * @return {Void}
     */
    _pro.__onClickDelegate = (function(){
        // check event need delegated
        var _doCheckUMI = function(_url,_href){
            if (!_url) return;
            var _info = location.parse(_url);
            this._$dispatchEvent('onbeforechange',_info);
            var _umi = this.__doRewriteUMI(
                _info.path,_href||_info.href
            );
            return this.__groups[this.__pbseed]._$hasUMI(_umi);
        };
        var _doParseUMI = function(_node){
            // parse data-href
            var _umi = _e._$dataset(_node,'href');
            if (!!_umi) return _umi;
            // parse href without data-not-umi
            var _href = _e._$attr(_node,'href');
            if (!!_href&&!_e._$dataset(_node,'notUmi')){
                // umi in hash
                var _arr = _href.split('#');
                _arr.shift();
                var _umi = _arr.join('#');
                if (_doCheckUMI.call(this,_umi,_href)){
                    return _umi;
                }
                // umi in path
                if (_doCheckUMI.call(this,_href)){
                    var _info = location.parse(_href);
                    return _info.path+'?'+
                           _u._$object2query(_info.query);
                }
            }
        };
        var _isNode = function(_node){
            return !!_doParseUMI.call(this,_node);
        };
        return function(_event){
            var _element = _v._$getElement(
                _event,_isNode._$bind(this)
            );
            if (!!_element){
                _v._$stopDefault(_event);
                this._$redirect(
                    _doParseUMI.call(this,_element)
                );
            }
        };
    })();
    /**
     * 解析行为代理
     *
     * @protected
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#__onActionDelegate
     * @param  {Event} arg0 - 点击事件对象
     * @return {Void}
     */
    _pro.__onActionDelegate = function(_event){
        var _am = this.__config.am,
            _conf = _am[_event.type];
        if (!_conf) return;
        // has action delegate
        var _element = _v._$getElement(_event,'d:resAction');
        if (!_element) return;
        var _action = _e._$dataset(_element,'resAction')||'',
            _handler = _conf[_action.toLowerCase()];
        if (!_handler) return;
        // has action node
        var _options = {
            action:_action,
            target:_element,
            id:_e._$dataset(_element,'resId'),
            type:_e._$dataset(_element,'resType'),
            extra:_e._$dataset(_element,'resExtra')
        };
        // do other parse
        this._$dispatchEvent('onbeforeaction',{
            event:_event,
            target:_element,
            result:_options
        });
        // trigger action
        _handler.call(this,_options);
    };
    /**
     * 添加调度规则
     *
     * 脚本举例
     * ```javascript
     * // 配置模块标题
     * dispatcher._$rule('title',{
     *     '/m/a':'模块标题',
     *     '/m/b':'模块标题',
     *     '/m/c':'模块标题'
     * });
     *
     * // 配置别名
     * dispatcher._$rule('alias',{
     *     'a':'/m/a',
     *     'b':['/m/b','/m/bb'],
     *     'c':'/m/c'
     * });
     *
     * // 配置与匹配顺序无关重写规则
     * // 重写规则配置结构：{ 目标UMI:重写规则 }
     * // 重写规则可以是字符串（全字符匹配）或者正则表达式
     * dispatcher._$rule('rewrite',{
     *     '/m/b':/^\/m\/b.*$/i,
     *     '/m/c':'/m/d'
     * });
     *
     * // 批量配置重写规则
     * // 重写规则内置匹配代码支持
     * // 404 - 当模块不存在时重定向的模块UMI
     * dispatcher._$rule([
     *     {'/m/a':'/m/','/m/c':'/m/d'},  // <---- 此处两条规则匹配与顺序无关
     *     {'/m/b':/^\/m\/b.*$/i},
     *     {'404':'/m/a'}                 // <---- 模块不存在时定向到/m/a模块
     * ]);
     *
     * // 配置行为，默认为click行为，模块中通过options.input接收配置信息
     * // 默认行为信息解析节点上的以下内容：
     * // data-res-id         资源标识
     * // data-res-type       资源类型
     * // data-res-action     对资源操作的行为
     * // data-res-extra      其他信息，如a=aaa&b=bbb或者{"a":"aaa","b":"bbb"}等等，根据实际情况配置
     * dispatcher._$rule('action',{
     *     'show':'/m/a',    // 等价于dispatcher._$redirect('/m/a')
     *     'play':function(_options){
     *         // _options -> {type:'xxxx',id:'xxxx'}
     *         // TODO something
     *         // 返回结果如果为：
     *         // undefined/null  表明业务逻辑已在此函数内处理完毕
     *         // string          表明返回的是UMI，后续会调用_$redirect到该UMI
     *     },
     *     'fav':{
     *         event:'dblclick',
     *         value:'/m/b' // or function
     *     }
     * });
     *
     * // 批量配置标题和重写规则
     * dispatcher._$rule({
     *     'title':{
     *         '/m/a':'模块标题',
     *         '/m/b':'模块标题',
     *         '/m/c':'模块标题'
     *     },
     *     'rewrite':{
     *         '/m/b':/^\/m\/b.*$/i,
     *         '/m/c':'/m/d'
     *     },
     *     'alias':{
     *         'a':'/m/a',
     *         'b':['/m/b','/m/bb'],
     *         'c':'/m/c'
     *     },
     *     action:{
     *         'show':'/m/a',
     *         'play':function(_options){
     *             // TODO something
     *         }
     *     }
     * });
     * ```
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$rule
     * @param  {String}       arg0 - 规则类型，支持类型: title/rewrite/alias/action
     * @param  {Object|Array} arg1 - 规则配置，对于重写规则存在匹配的先后顺序
     * @return {Void}
     */
    _pro._$rule = (function(){
        var _buildin = ['404'];
        // regist rule
        var _doRegistRule = function(_config,_key){
            this._$rule(_key,_config);
        };
        // regist title
        var _doRegistTitle = function(_title,_umi){
            this.__setModuleConf(_umi,'title',_title);
        };
        // regist alias map
        var _doRegistAlias = function(_umi,_alias){
            this.__config.al[_alias] = _umi;
        };
        // regist rewrite
        var _doRegistRewrite = function(_config){
            if (!_config) return;
            this.__config.r.push(_config);
            // parse build-in rewrite rule
            _u._$forEach(_buildin,
                function(_key){
                    if (!_config[_key]) return;
                    this.__config.rr[_key] = _config[_key];
                    delete _config[_key];
                },this);
        };
        // regist actions
        var _doRegistAction = function(_action,_name){
            var _am = this.__config.am;
            // parse event/handler from object
            var _event = 'click',
                _handler = _action,
                _name = (_name||'').toLowerCase();
            if (_u._$isObject(_action)){
                _event = _action.event||_event;
                _handler = _action.value;
            }
            // parse handler
            if (_u._$isString(_handler)){
                _handler = function(_umi,_options){
                    this._$redirect(_umi,{
                        force:!0,
                        input:_options
                    });
                }._$bind(this,_handler);
            }else if(_u._$isFunction(_handler)){
                _handler = _handler._$aop(null,function(_event){
                    var _result = _event.value;
                    if (_u._$isString(_result)){
                        this._$redirect(_result,{
                            force:!0,
                            input:_event.args[0]
                        });
                    }
                }._$bind(this));
            }
            // push handler to cache
            if (_u._$isFunction(_handler)){
                // add event delegate
                if (!_am[_event]) {
                    this.__doInitDomEvent([[
                        document,_event,
                        this.__onActionDelegate._$bind(this)
                    ]]);
                    _am[_event] = {};
                }
                _am[_event][_name] = _handler;
            }
        };
        // rule parse function map
        var _fmap = {
            title:function(_config){
                _u._$loop(_config,
                   _doRegistTitle,this);
            },
            rewrite:function(_config){
                if (!_u._$isArray(_config)){
                    _doRegistRewrite.call(this,_config);
                }else{
                    _u._$forEach(
                        _config,
                        _doRegistRewrite,this
                    );
                }
            },
            alias:function(_config){
                _u._$loop(
                    _config,
                    _doRegistAlias,this
                );
            },
            action:function(_config){
                _u._$loop(
                    _config,
                    _doRegistAction,this
                );
            }
        };
        return function(_key,_config){
            if (_u._$isArray(_key)){
                _config = _key;
                _key = 'rewrite';
            }else if (!_u._$isString(_key)){
                _u._$forIn(_key,_doRegistRule,this);
                return;
            }
            // regist rule by type
            (_fmap[_key]||_f).call(this,_config);
        };
    })();
    /**
     * 注册UMI与模块的对应关系
     *
     * 脚本举例
     * ```javascript
     * // 注册模块的模板文件路径
     * dispatcher._$regist('/m/a/','/m/a.html');
     *
     * // 注册模块的配置信息，包括标题和文件路径
     * dispatcher._$regist('/m/a/',{
     *     title:'模块标题',
     *     clazz:'g-ma',
     *     module:'/m/a.html'
     * });
     *
     * // 注册模块的配置信息，包括标题和模块构造器
     * dispatcher._$regist('/m/a/',{
     *     title:'模块标题',
     *     clazz:'g-ma',
     *     module:np.m._$$ModuleA
     * });
     *
     * // 注册模块的构造器
     * dispatcher._$regist('/m/a/',np.m._$$ModuleA);
     *
     * // 注册私有模块指定分组ID，同一分组的私有模块调度时仅显示一个模块
     * dispatcher._$regist('/?/a/b/',{
     *     gid:'234567890',
     *     module:'/m/a/b.html'
     * });
     *
     * // 批量注册模块
     * dispatcher._$regist({
     *     '/m/a/':'/m/a.html',
     *     '/m/a/a':np.m._$$ModuleAA,
     *     '/m/b/':{
     *               title:'模块标题',
     *               clazz:'g-mb',
     *               module:'/m/b.html'
     *             },
     *     '/m/c/':{
     *               title:'模块标题',
     *               clazz:'g-mc',
     *               module:np.m._$$ModuleC
     *             },
     *     '/?/m/a/':'/m/s/a.html',
     *     '/?/m/a/a':np.m.s._$$ModuleAA,
     *     '/?/m/b/':{
     *                 gid:'abc',
     *                 title:'模块标题',
     *                 module:'/m/b.html'
     *               },
     *     '/?/m/c/':{
     *                 gid:'abc',
     *                 title:'模块标题',
     *                 module:np.m._$$ModuleC
     *               },
     * });
     * ```
     *
     * @method   module:util/dispatcher/dispatcher._$$Dispatcher#_$regist
     * @param    {String|Object} arg0      - 统一模块标识或者模块批量添加信息
     * @param    {String|Object|module:util/dispatcher/module._$$ModuleAbstract}
     *                           arg1      - 模块构造或者模块路径或者模块配置信息
     * @property {String}        gid       - 指定模块分组，仅对私有模块有效，对外模块忽略此配置
     * @property {String}        title     - 模块标题，显示模块时修改页面的标题
     * @property {String}        clazz     - 模块切换时body样式调整，仅对公共模块有效
     * @property {String|module:util/dispatcher/module._$$ModuleAbstract}
     *                           module    - 指定模块对应的模板文件地址或者模块的构造函数
     * @property {Object}        composite - 组合模块容器对应关系,{pid:umi},其中pid为umi对应模块的容器
     * @return   {Void}
     */
    _pro._$regist = (function(){
        // regist single module
        var _doRegistUMI = function(_config,_umi){
            this._$regist(_umi,_config);
        };
        // check if module constructor
        var _isModuleClass = function(_module){
            return !!_module&&!!_module._$extend;
        };
        // function body
        return function(_umi,_config){
            // batch regist
            if (!_u._$isString(_umi)){
                _u._$forIn(_umi,_doRegistUMI,this);
                return;
            }
            // regist module with umi
            var _data = _t3._$appendNodeByUMI(
                    this.__root,_umi
                )._$getData(),
                _module = _data.module;
            // ignore if
            // - module constructor is registed
            // - module is instanced
            if (_t3._$isModule(_module)||
                _isModuleClass(_module)){
                return;
            }
            // parse conifg
            var _gid = this.__config.mg[_umi],_module;
            if (_u._$isString(_config)||
                _isModuleClass(_config)){
                // config is module template file or module constructor
                _module = _config;
            }else{
                // conifg is module information
                _config = _config||_o;
                _gid = _config.gid;
                _module = _config.module;
                // cache module title
                if (!!_config.title){
                    this.__setModuleConf(
                        _umi,'title',
                        _config.title
                    );
                }
                // cache module clazz
                if (!!_config.clazz){
                    this.__setModuleConf(
                        _umi,'clazz',
                        _config.clazz
                    );
                }
                // cache module composite
                if (!!_config.composite){
                    _data.composite = _config.composite;
                }
            }
            // save module
            this.__doAddUMI2Group(_umi,_gid);
            _data.module = _module;
        };
    })();
    /**
     * 发送消息，消息模式
     *
     * * 0 - 目标消息【默认】，只有目标节点收到消息
     * * 1 - 目标广播，从根节点至路目标节点径上的节点收到消息
     * * 2 - 群体广播，节点下所有子孙子孙节点收到消息
     *
     * @method   module:util/dispatcher/dispatcher._$$Dispatcher#_$message
     * @param    {Object} arg0 - 消息相关信息
     * @property {String} to   - 消息目标UMI
     * @property {String} from - 消息来源UMI
     * @property {Object} data - 消息数据
     * @property {Number} mode - 消息模式
     * @return   {Void}
     */
    _pro._$message = (function(){
        // send message
        var _doSendMessage = function(_node,_message){
            var _module = _node._$getData().module;
            if (_t3._$isModule(_module)){
                _module._$dispatchEvent('onmessage',_message);
            }
        };
        // message mode function
        var _fmap = [
            _doSendMessage,
            // send message to every node in target path
            function(_target,_message){
                var _from = _message.from;
                while(!!_target){
                    if (_target._$getPath()!=_from){
                        _doSendMessage(_target,_message);
                    }
                    _target = _target._$getParent();
                }
            },
            // broadcast to all target descendants
            function(_target,_message){
                var _from = _message.from;
                _t3._$breadthFirstSearch(
                    _target,function(_node){
                        if (_node._$getPath()!=_from){
                            _doSendMessage(_node,_message);
                        }
                    }
                );
            }
        ];
        return function(_message){
            var _event = _u._$merge({},_message),
                _target = _t3._$getNodeByUMI(this.__root,_event.to);
            _event.path = _target._$getPath();
           (_fmap[_event.mode]||_fmap[0]).call(this,_target,_event);
        };
    })();
    /**
     * 发布消息
     *
     * 脚本举例
     * ```javascript
     *   dispatcher._$publish(
     *       'onchange',{
     *           from:'/m/login/',
     *           data:{action:'delete',value:'xxxxxx'}
     *       }
     *   );
     * ```
     *
     * @method   module:util/dispatcher/dispatcher._$$Dispatcher#_$publish
     * @param    {String} arg0 - 消息类型
     * @param    {Object} arg0 - 消息相关信息
     * @property {String} from - 消息来源UMI
     * @property {Object} data - 消息数据
     * @return   {Void}
     */
    _pro._$publish = function(_type,_message){
        var _message = _u._$merge({},_message);
        _message.type = _type||'';
        this._$dispatchEvent(
            (_message.from||'')+':'
            +_message.type,_message
        );
    };
    /**
     * 订阅消息
     *
     * 脚本举例
     * ```javascript
     *   dispatcher._$subscribe(
     *       '/m/login/','onchange',
     *       function(_event){
     *           // _event.type
     *           // _event.from
     *           // _event.data
     *       }
     *   );
     * ```
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$subscribe
     * @param  {String}   arg0 - 目标模块的UMI
     * @param  {String}   arg1 - 消息类型
     * @param  {Function} arg2 - 消息处理回调
     * @return {Void}
     */
    _pro._$subscribe = function(_umi,_type,_callback){
        _umi = this.__config.al[_umi]||_umi;
        this._$addEvent(
            (_umi||'')+':'+(_type||''),_callback
        );
    };
    /**
     * 取消订阅消息
     *
     * 脚本举例
     * ```javascript
     *   dispatcher._$unsubscribe(
     *       '/m/login/','onchange',
     *       function(_event){
     *           // 必须同添加的事件一致
     *       }
     *   );
     * ```
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$unsubscribe
     * @param  {String}   arg0 - 目标模块的UMI
     * @param  {String}   arg1 - 消息类型
     * @param  {Function} arg2 - 消息处理回调
     * @return {Void}
     */
    _pro._$unsubscribe = function(_umi,_type,_callback){
        _umi = this.__config.al[_umi]||_umi;
        this._$delEvent(
            (_umi||'')+':'+(_type||''),_callback
        );
    };
    /**
     * 隐藏非分组私有模块
     *
     * 脚本举例
     * ```javascript
     *   // 隐藏私有模块
     *   dispatcher._$hide('/?/m/a/b/');
     * ```
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$hide
     * @param  {String} arg0 - 私有模块地址
     * @return {Void}
     */
    _pro._$hide = function(_umi){
        var _gid = this.__config.mg[_umi];
        if (_gid==this.__pvseed){
            this.__groups[_gid]._$hideUMI(_umi);
        }
    };
    /**
     * 隐藏私有分组
     * 
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$hideGroup
     * @param  {String} arg0 - 分组ID
     * @return {Void}
     */
    _pro._$hideGroup = function(_gid){
        var _group = this.__groups[_gid];
        if (!!_group){
            _group._$hide();
        }
    };
    /**
     * 重定向模块，此接口支持
     *
     * * 私有模块重定向
     * * 可访问模块退出前验证
     * * 重定向地址带查询参数
     *
     * 脚本举例
     * ```javascript
     *   // 重定向私有模块
     *   dispatcher._$redirect('/?/m/a/b?a=aa&b=bb');
     *
     *   // 系统存在需退出验证模块时需使用以下业务逻辑接管页面自动调整的逻辑
     *   _v._$addEvent(document,'click',function(_event){
     *       var _element = _v._$getElement(_event,
     *                      function(_node){
     *                          // filter node here
     *                          // e.g. _node.tagName=='A'
     *                      });
     *       if (!!_element){
     *           _v._$stopDefault(_event);
     *           dispatcher._$redirect(_e._$dataset(_element,'href'));
     *       }
     *   });
     *
     *   // 如果页面带跳转的节点有data-href标识跳转地址的情况可以使用{#_$delegate}处理以上业务逻辑
     *   // <span data-href="#/m/a/?a=aa">aaaa</span>
     *   // <a href="#/m/a/?a=aa" data-href="#/m/a/?a=aa">bbbbbb</a>
     *   dispatcher._$delegate();
     * ```
     *
     * @method   module:util/dispatcher/dispatcher._$$Dispatcher#_$redirect
     * @param    {String}   arg0    - 模块UMI，可以带查询参数
     * @param    {Object}   arg1    - 配置信息
     * @property {Boolean}  replace - 是否替换当前历史
     * @property {Boolean}  force   - 是否强制刷新
     * @property {Variable} input   - 输入数据
     * @property {Boolean}  ignored - 是否忽略地址变化前的验证
     * @return   {Void}
     */
    _pro._$redirect = function(_url,_options){
        _options = _options||_o;
        var _umi = _t3._$path2umi(_url),
            _location = location.parse(_url);
        this.__dtmp[_location.path] = _options.input;
        if (_t3._$isUMIPrivate(_umi)){
            // dispatch private module
            this.__onURLChange(_location);
        }else{
            // dispatch public module
            var _group = this.__groups[this.__pbseed],
                _event = {target:_location,umi:_umi};
            if (!!_group._$exitable(_event)){
                if (location.same(_url)&&!!_options.force){
                    this.__onURLChange(_location);
                }else{
                    location.ignored = !!_options.ignored;
                    location.redirect(_url,!!_options.replace);
                }
            }
        }
    };
    /**
     * 刷新模块
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$refresh
     * @param  {String} arg0 - 模块UMI，可以带查询参数
     * @return {Void}
     */
    _pro._$refresh = function(_url){
        if (!!_url){
            this._$redirect(_url,{
                replace:!0,force:!0
            });
        }else{
            this.__groups[this.__pbseed]._$refresh();
        }
    };
    /**
     * 模块切换跳转委托，
     * 如果系统存在需退出验证模块时需使用此接口接管页面自动调整的逻辑
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$delegate
     * @see    module:util/dispatcher/dispatcher._$$Dispatcher#_$redirect
     * @return {Void}
     */
    _pro._$delegate = function(){
        this.__doInitDomEvent([[
            document,'click',
            this.__onClickDelegate._$bind(this)
        ]]);
    };
    /**
     * 激活调度器，激活之前确保注册完会被调用的模块
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$active
     * @return {Void}
     */
    _pro._$active = function(){
        location.active();
    };
    /**
     * 模块载入回调
     *
     * @method module:util/dispatcher/dispatcher._$$Dispatcher#_$loaded
     * @param  {String} arg0 - 模块UMI
     * @param  {module:util/dispatcher/module._$$ModuleAbstract} arg1 - 模块构造器
     * @return {Void}
     */
    _pro._$loaded = function(_umi,_module){
        _umi = this.__config.al[_umi]||_umi;
        if (!_u._$isArray(_umi)){
            this._$regist(_umi,_module);
            this.__groups[this.__config.mg[_umi]]._$loadedUMI(_umi);
        }else{
            _u._$forEach(
                _umi,function(_key){
                    this._$loaded(_key,_module);
                },this
            );
        }
    };
    /**
     * 启动调度系统
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/dispatcher/dispatcher'
     * ],function(_p){
     *     // 实例化调度器，并在全局设置dispatcher变量供模块使用
     *     _p._$startup({
     *         // 设置规则
     *         rules:{
     *             title:{
     *                 '/m/a/':'模块A',
     *                 '/m/b/':'模块B',
     *                 '/m/c/':'模块C'
     *             },
     *             rewrite:{
     *                 '404':'/m/c/0/',
     *                 '/m/c/$1/':/^\/c\/([\d])\/$/
     *             }
     *         },
     *         // 注册模块
     *         modules:{
     *             '/m':'/module/m.html',
     *             '/m/a/':'/module/m.c.html',
     *             '/m/b/':'/module/m.c.html',
     *             '/m/c/':{module:'/module/m.c.html',clazz:'g-mdl-c'}
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/dispatcher/dispatcher._$startup
     * @param    {Object} arg0 - 配置信息，其他配置同调度器实例化配置
     * @property {String} tid  - 模版ID，默认template-box
     * @return   {module:util/dispatcher/dispatcher._$$Dispatcher} 调度器实例
     */
    _p._$startup = function(_options){
        window.dispatcher =
            _p._$$Dispatcher.
            _$getInstance(_options);
        _t7._$dumpModules();
        _t1._$parseTemplate(
            (_options||_o).tid||'template-box',
            location.config
        );
        _v._$addEvent(
            document,'templateready',function(){
                window.setTimeout(
                    dispatcher._$active._$bind(dispatcher),0
                );
            }
        );
        return window.dispatcher;
    };

    if (CMPT){
        NEJ.P('nej.e')._$startup = _p._$startup;
        NEJ.P('nej.ut')._$$Dispatcher = _p._$$Dispatcher;
    }

    return _p;
});
