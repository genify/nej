/*
 * ------------------------------------------
 * XMPP交互代理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var r = NEJ.R,
        o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ut.xmpp'),
        __proProxy,
        __plugin_impl = {};
    // xmpp state
    p.ST = {
        init    :  0
       ,connect :  1
       ,auth    :  2
       ,oauth   :  3
       ,normal  :  4
       ,close   :  5
       ,error   : -1
       ,recycle : -2
    };
    if (!!p._$$Proxy) return;
    /**
     * XMPP交互代理基类
     * @class   XMPP交互代理基类
     * @extends nej.ut._$$Event
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     *                           url         [String]    - xmpp服务器地址
     *                           domian      [String]    - xmpp域名
     *                           onerror     [Function]  - 异常触发事件
     *                           onclose     [Function]  - 断开连接触发事件
     *                           onmessage   [Function]  - 收到消息时触发事件
     *                           onstream    [Function]  - 收到流信息触发事件
     *                           onfeature   [Function]  - 收到Feature信息触发事件【STREAM】
     *                           onregist    [Function]  - 用户注册成功回调【REGISTER】
     *                           onauth      [Function]  - 用户验证成功回调【SASL/NON-SASL】
     *                           onbind      [Function]  - 资源绑定回调【BIND】
     *                           onpresence  [Function]  - 出席信息发送完成回调【PRESENCE】
     *                           onoauth     [Function]  - OAuth验证成功回调【OAUTH】
     */
    p._$$Proxy = NEJ.C();
    __proProxy = p._$$Proxy._$extend(t._$$Event);
    /**
     * 注册插件实现
     * @param  {String}                _xmlns  名字空间
     * @param  {nej.ut.xmpp._$$PLUGIN} _plugin 插件实现
     * @return {Void}
     */
    p._$$Proxy._$registPlugin = function(_xmlns,_plugin){
        __plugin_impl[_xmlns] = _plugin;
    };
    /**
     * 控件初始化
     * @return {Void}
     */
    __proProxy.__init = function(){
        this.__supInit();
        this.__popt = {ud:{resource:u._$randString(4)}
                      ,onudchange:this.__onUDChange._$bind(this)
                      ,onstatechange:this.__onStateChange._$bind(this)};
        this.__plugins = {};
        this.__onStateChange(p.ST.init);
        for(var x in __plugin_impl) 
            this._$addPlugin(x,__plugin_impl[x]);
    };
    /**
     * 控件重置
     * @return {Void}
     */
    __proProxy.__reset = (function(){
        var _reg = /\:\/\/(.+?)(?:\:|\/|$)/i;
        var _url2domain = function(_url){
            if (_reg.test(_url))
                return RegExp.$1;
            return document.domain;
        };
        return function(_options){
            this.__features = {};
            this.__supReset(_options);
            // check state
            if (this.__state!=null&&this.__state!=5){
                this._$error({code:-10140,
                              message:'当前实例使用中，请重新分配一个实例！'});
                return;
            }
            this.__onStateChange(p.ST.init);
            // check server url
            var _url = _options.url||'';
            if (!_url){
                this._$error({code:-10141,
                              message:'请先指定连接服务器的地址！'});
                return;
            }
            this.__onUDChange('url',_url);
            this.__onUDChange('domain',_options.domain||_url2domain(_url));
        };
    })();
    /**
     * 控件销毁
     * @return {Void}
     */
    __proProxy.__destroy = function(){
        this.__onStateChange(p.ST.recycle);
        this.__doUDClear();
        this._$clearEvent();
        this._$disconnect();
    };
    /**
     * 判断当前状态是否允许发送信息
     * @param  {String} _name 插件名称
     * @return {Boolean}      是否允许发送
     */
    __proProxy.__canSendFragment = function(){
        return !0;
    };
    /**
     * 是否允许发送心跳信息
     * @return {Boolean} 是否允许
     */
    __proProxy.__canSendHeartbeat = function(){
        return this.__status==p.ST.oauth||
               this.__status==p.ST.normal;
    };
    /*
    (function(){
        var _reg = /^stream|tls|sasl|bind|session|iq$/i;
        return function(_name){
            if (_reg.test(_name))
                return this.__status>=p.ST.connect
                     &&this.__status<=p.ST.auth;
            return this.__status==p.ST.normal;
        };
    })();
    */
    /**
     * 清理用户信息
     * @return {Void}
     */
    __proProxy.__doUDClear = function(){
        for(var x in this.__popt.ud)
            delete this.__popt.ud[x];
    };
    /**
     * 用户信息变化触发事件
     * @param  {String} _name  用户信息标识
     * @param  {String} _value 用户信息
     * @return {Void}
     */
    __proProxy.__onUDChange = function(_name,_value){
        var _ud = this.__popt.ud;
        _ud[_name] = _value;
        if (_name=='username')
            _ud.jid = _ud.username+'@'+_ud.domain+'/'+_ud.resource;
        if (_name=='domain')
            _ud.robot = 'blogrobot@'+_ud.domain;
    };
    /**
     * 状态变化触发事件
     * @param  {Number} _state 状态
     * @return {Void}
     */
    __proProxy.__onStateChange = function(_state){
        // -2 - recycle
        // -1 - error/exception
        //  0 - init
        //  1 - connect to xmpp server
        //  2 - auth to xmpp server
        //  3 - auth to oauth server
        //  4 - normal
        //  5 - close
        this.__status = _state;
    };
    /**
     * 清理特性
     * @return {Void}
     */
    __proProxy.__doFeatureClear = function(){
        for(var x in this.__features)
            delete this.__features[x];
    };
    /**
     * 解析服务器端返回的xml片段
     * @param  {String} _fragment xml片段
     * @return {Void}
     */
    __proProxy.__doParseFragment = (function(){
        var _reg = /iq|message|presence/i;
        return function(_fragment){
            // iq / message / presence
            var _root = e._$xml2dom(_fragment),
                _name = _root.nodeName;
            if (_reg.test(_name)){
                this._$dispatchEvent(p.NS[_name],_root);
                return;
            }
            var _xmlns = _root.getAttribute('xmlns')||'';
            // check error
            if (_name=='error'&&!_xmlns){
                this.__doParseError(_root);
                return;
            }
            // fragment with namespace
            if (!!_xmlns) this._$dispatchEvent(_xmlns,_root);
        };
    })();
    /**
     * 异常处理
     * @param  {Node} _root 异常节点
     * @return {Void}
     */
    __proProxy.__doParseError = function(_root){
        var _error = {code:-10160,message:'常规错误！'},
            _attrs = _root.attributes,_info = {};
        for(var i=0,l=_attrs.length,_node;i<l;i++){
            _node = _attrs[i];
            _info[_node.nodeName] = _node.nodeValue||'';
        }
        var _child = e._$getChildren(_root);
        if (!!_child&&_child.length>0)
            _error.name = _child[0].nodeName||'';
        _error.info = _info;
        this._$error(_error);
    };
    /**
     * 取当前状态信息
     * @return {Number} 当前状态
     */
    __proProxy._$getStatus = function(){
        return this.__status;
    };
    /**
     * 注册协议处理插件
     * @param  {nej.ut.xmpp._$$PLUGIN} _plugin 插件构造函数
     * @return {Void}
     */
    __proProxy._$addPlugin = function(_name,_plugin){
        if (!_name||!_plugin){
            this._$error({code:-10146,
                          message:'未提供插件名称['+_name+']或者插件构造函数['+_plugin+']'});
            return;
        }
        _plugin = _plugin._$allocate(this.__popt);
        if (!(_plugin instanceof p._$$PLUGIN)){
            this._$error({code:-10147,
                          message:'提供的插件不是合法的XMPP插件['+_plugin+']'});
            return;
        }
        _plugin._$attach(this);
        this.__plugins[_name] = _plugin;
    };
    /**
     * 取插件对象
     * @return {nej.ut.xmpp._$$PLUGIN} 插件对象
     */
    __proProxy._$getPlugin = function(_name){
        return this.__plugins[p.NS[_name]||_name]||null;
    };
    /**
     * 添加特性
     * @param  {String} _name 特性名称
     * @param  {Function}     特性执行动作
     * @return {Void}
     */
    __proProxy._$addFeature = function(_name,_root){
        if (!_root) return;
        if (_name.indexOf('/iq-auth')>=0)
            _name = p.NS.nonsasl;
        if (_name.indexOf('/iq-register')>=0)
            _name = p.NS.register;
        if (!this.__features[_name])
            this.__features[_name] = _root;
    };
    /**
     * 取特性信息
     * @param  {String} _name 特性名称
     * @return {Node}         特性节点
     */
    __proProxy._$getFeature = function(_name){
        var _feature = this.__features[p.NS[_name]||_name];
        return _feature==!0?null:_feature;
    };
    /**
     * 删除特性
     * @param  {String} _name 特性名称
     * @return {Void}
     */
    __proProxy._$delFeature = function(_name){
        this.__features[p.NS[_name]||_name] = !0;
    };
    /**
     * 执行特性动作
     * @param  {String} _name 特性名称
     * @return {Boolean}      是否执行了特性
     */
    __proProxy._$doFeature = function(_name){
        var _root = this._$getFeature(_name);
        if (!_root) return !1;
        this._$dispatchEvent(_name,_root);
        return !0;
    };
    /**
     * 关闭连接
     * @return {Void}
     */
    __proProxy._$close = function(){
        if (!!this.__connector) 
            try{this.__connector.close();}catch(ex){}
    };
    /**
     * 连接服务器
     * @param  {String} _username 用户名
     * @return {Void}
     */
    __proProxy._$connect = function(_username){
        this.__popt.ud.username = _username;
    };
    /**
     * 断开服务器连接
     * @return {Void}
     */
    __proProxy._$disconnect = function(){
        //this._$send('stream','close');
        this._$close();
    };
    /**
     * 连接重置，子类实现具体逻辑
     * @return {Void}
     */
    __proProxy._$resetConnect = function(){
        this._$error({code:-10139,message:'连接重置！'});
        this._$close();
        window.setTimeout(this._$connect._$bind(this,
                          this.__popt.ud.username),1000);
    };
    /**
     * 异常回调
     * @param  {Object} _error 异常信息
     * @return {Void}
     */
    __proProxy._$error = function(_error){
        this.__onStateChange(p.ST.error);
        this._$dispatchEvent('onerror',_error);
        this._$disconnect();
    };
    /**
     * 调用插件发送片段
     * @param  {String} _name 插件注册名称
     * @return {Void}
     */
    __proProxy._$send = function(_name){
        if (!this.__canSendFragment(_name)){
            this._$error({code:-10148,
                          message:'当前状态['+this.__status+']不允许发送数据！'});
            return;
        }
        var _plugin = this._$getPlugin(_name);
        if (!_plugin){
            this._$error({code:-10147,
                          message:'指定插件['+_name+']不存在！'});
            return;
        }
        _plugin._$send.apply(_plugin,r.slice.call(arguments,1));
    };
    /**
     * 发送片段
     * @param  {String} _fragment 片段
     * @return {Void}
     */
    __proProxy._$sendFragment = function(_fragment){
//        console.log('send:'+_fragment);
        try{this.__connector.send(_fragment);}catch(ex){console.log(ex.message)}
        this.__timer = window.clearTimeout(this.__timer);
        if (!this.__canSendHeartbeat()) return;
        this.__timer = window.setTimeout(this._$sendFragment._$bind(this,' '),25000);
    };
};
NEJ.define('{lib}util/xmpp/proxy.js',
      ['{lib}base/element.js','{lib}util/event.js'],f);