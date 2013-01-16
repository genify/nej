/*
 * ------------------------------------------
 * XMPP交互辅助基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ut'),
        __proXmppHelper,
        __supXmppHelper;
    if (!!p._$$XmppHelper) return;
    /**
     * XMPP交互辅助基类
     * @class   XMPP交互辅助基类
     * @extends nej.ut._$$Event
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     *                           url         [String]    - xmpp服务器地址
     *                           robot       [String]    - 消息机器人JID
     *                           domain      [String]    - xmpp服务器域名（适用于使用代理时）
     *                           onerror     [Function]  - 异常触发事件
     *                           onoauth     [Function]  - OAuth验证成功
     *                           onaccess    [Function]  - 登录成功触发事件
     *                           onmessage   [Function]  - 收到消息时触发事件
     */
    p._$$XmppHelper = NEJ.C();
    __proXmppHelper = p._$$XmppHelper._$extend(p._$$Event);
    __supXmppHelper = p._$$XmppHelper._$supro;
    /**
     * 初始化控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proXmppHelper.__init = function(){
        this.__supInit();
        this.__mopt = {onerror:this.__onError._$bind(this)
                      ,onclose:this.__onClose._$bind(this)
                      ,onmessage:this.__onMessage._$bind(this)
                      ,onstream:this.__onFeature._$bind(this)
                      ,onfeature:this.__onFeature._$bind(this)
                      ,onoauth:this.__onOAuthOK._$bind(this)
                      ,onauth:this.__onAuthOK._$bind(this)
                      ,onbind:this.__onAuthOK._$bind(this)
                      ,onpresence:this.__onPresence._$bind(this)};
    };
    /**
     * 重置控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proXmppHelper.__reset = function(_options){
        this.__robot = _options.robot||'';
        this.__mopt.url = _options.url;
        this.__mopt.domain = _options.domain;
        this.__proxy = this.__getXmppProxy();
        this.__supReset(_options);
    };
    /**
     * 销毁控件
     * @return {Void}
     */
    __proXmppHelper.__destroy = function(){
        this.__supDestroy();
        delete this.__consumer;
        if (!!this.__proxy)
            this.__proxy = this.__proxy.constructor
                               ._$recycle(this.__proxy);
    };
    /**
     * 取XMPP代理对象
     * @return {nej.ut._$$XmppProxy} 代理对象
     */
    __proXmppHelper.__getXmppProxy = f;
    /**
     * 异常回调
     * @param  {Object} _error 错误信息
     * @return {Void}
     */
    __proXmppHelper.__onError = function(_error){
        // TODO error filter
        this._$dispatchEvent('onerror',_error);
    };
    /**
     * 连接断开触发事件
     * @return {Void}
     */
    __proXmppHelper.__onClose = function(){
        window.setTimeout(
           this._$connect._$bind(this,
                                 this.__username,
                                 this.__passport,
                                 this.__consumer),2000);
    };
    /**
     * 处理完特性列表触发事件
     * @return {Void}
     */
    __proXmppHelper.__onFeature = function(){
        // do tls
        var _plugin = this.__proxy._$getPlugin('tls');
        if (!!_plugin&&_plugin._$feature()){
            this.__proxy._$delFeature('tls');
            return;
        }
        // do oauth
        _plugin = this.__proxy._$getPlugin('oauth');
        if (!!_plugin){
            _plugin._$regist(this.__username
                            ,this.__passport
                            ,this.__consumer);
            if (_plugin._$feature()){
                this.__proxy._$delFeature('sasl');
                return;
            }
        }
        // do sasl
        _plugin = this.__proxy._$getPlugin('sasl');
        if (!!_plugin){
            _plugin._$regist(this.__username
                            ,this.__passport);
            if (_plugin._$feature()){
                this.__proxy._$delFeature('sasl');
                this.__proxy._$delFeature('register');
                return;
            }
        }
        // do bind
        _plugin = this.__proxy._$getPlugin('bind');
        if (!!_plugin&&_plugin._$feature()){
            this.__proxy._$delFeature('bind');
            return;
        }
    };
    /**
     * 用户注册成功触发事件
     * @return {Void}
     */
    __proXmppHelper.__onRegistOK = function(_flag){
        var _plugin = this.__proxy._$getPlugin('nonsasl');
        if (!!_plugin) _plugin._$feature();
    };
    /**
     * OAuth验证成功触发事件
     * @param  {String} _key 验证信息标识
     * @return {Void}
     */
    __proXmppHelper.__onOAuthOK = function(_key){
        if (!!_key) this.__passport = _key;
        this._$dispatchEvent('onoauth',_key);
    };
    /**
     * 验证成功触发事件
     * @return {Void}
     */
    __proXmppHelper.__onAuthOK = function(){
        this.__proxy
            ._$getPlugin('presence')
            ._$send();
        this.__onPresence();
    };
    /**
     * 出席成功
     * @return {Void}
     */
    __proXmppHelper.__onPresence = function(){
        this._$dispatchEvent('onaccess');
    };
    /**
     * 收到消息触发事件
     * @param  {Object} _message 消息
     * @return {Void}
     */
    __proXmppHelper.__onMessage = function(_message){
        // TODO message filter
        this._$dispatchEvent('onmessage',_message);
    };
    /**
     * 关闭连接
     * @return {Void}
     */
    __proXmppHelper._$close = function(){
        this.__proxy._$close();
    };
    /**
     * 连接服务器
     * @param  {String}        _username 用户名
     * @param  {String|Object} _passport 验证信息，密码或者验证键值
     * @param  {Object}        _config   OAuth配置信息
     *                                   realm           应用方式，默认为空
     *                                   signature       签名方式，默认为HMAC-SHA1，可选HMAC-SHA1、RSA-SHA1、PLAINTEXT
     *                                   consumer_key    使用者的ID
     *                                   consumer_secret 使用者的ID对应的密钥
     * @return {Void}
     */
    __proXmppHelper._$connect = function(_username,_passport,_config){
        this.__username = _username;
        this.__passport = _passport;
        if (!!_config){
            this.__consumer = {
                realm:''
               ,signature:'HMAC-SHA1'
               ,consumer_key:''
               ,consumer_secret:''
            };
            NEJ.EX(this.__consumer,_config);
        }
        this.__proxy._$connect(this.__username);
    };
    /**
     * 远程调用
     * @param  {Object} _data 请求信息
     *                        protocol [Number] - 协议类型
     *                                            0 - DWR
     *                                            1 - REST
     * @return {Void}
     */
    __proXmppHelper._$rpc = (function(){
        var _xmlns = ['dwr'];
        return function(_data){
            _data = _data||o;
            var _name = _xmlns[_data.protocol]||_xmlns[0];
            _data.to = _data.to||this.__robot;
            delete _data.protocol;
            this.__proxy._$send(_name,_data);
        };
    })();
    /**
     * 发送IQ片段
     * @param  {String} _id      片段标识
     * @param  {String} _type    类型
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     *                           content    [String|Node] - IQ内容片段
     *                           onreceive  [Function]    - IQ响应回调函数
     * @return {Void}
     */
    __proXmppHelper._$sendIQ = function(_id,_type,_options){
        _options = _options||o;
        var _iq = {type:_type,id:_id};
        NEJ.EX(_iq,_options);
        var _content = _iq.content;
        if (_content!=null){
            if (!u._$isString(_content))
                _content = e._$dom2xml(_content);
            _iq.content = _content;
        }
        this.__proxy._$send('iq',_iq);
    };
    /**
     * 发送消息
     * @param  {String} _content 消息内容
     * @param  {Object} _options 可选配置参数,已处理参数信息
     *                           to      [String] - 消息接收者JID
     *                           type    [String] - 消息类型chat/error/groupchat/headline/normal[default]
     *                           subject [String] - 消息主题
     *                           thread  [String] - 会话线索
     * @return {Void}
     */
    __proXmppHelper._$sendMessage = function(_content,_options){
        var _message = {type:'normal'};
        NEJ.EX(_message,_options);
        _message.to = _message.to||this.__robot;
        _message.body = _content||'';
        this.__proxy._$send('message',_message);
    };
    /**
     * 发送出席信息
     * @param  {Object} _presence  出席信息，已处理参数信息
     *                             show     [String] - 可用性状态
     *                             status   [String] - 状态描述
     *                             priority [String] - 优先级
     * @return {Void}
     */
    __proXmppHelper._$sendPresence = function(_presence){
        this.__proxy._$send('presence',_presence);
    };
};
define('{lib}util/xmpp/helper.js',
      ['{lib}base/element.js'
      ,'{lib}util/event.js'
      ,'{lib}util/xmpp/core/stream.js'
      ,'{lib}util/xmpp/core/tls.js'
      ,'{lib}util/xmpp/core/bind.js'
      ,'{lib}util/xmpp/core/session.js'
      ,'{lib}util/xmpp/core/iq.js'
      ,'{lib}util/xmpp/core/message.js'
      ,'{lib}util/xmpp/core/presence.js'],f);