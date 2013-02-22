/*
 * ------------------------------------------
 * XMPP插件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ut.xmpp'),
        __proPLUGIN,
        __supPLUGIN;
    if (!!p._$$PLUGIN) return;
    // plugin namespace
    p.NS = {
        iq       : 'client:iq'
       ,message  : 'client:message'
       ,presence : 'client:presence'
       ,stream   : 'jabber:client'
       ,nonsasl  : 'jabber:iq:auth'
       ,register : 'jabber:iq:register'
       ,oauth    : 'urn:ietf:params:xml:ns:xmpp-sasl'
       ,tls      : 'urn:ietf:params:xml:ns:xmpp-tls'
       ,sasl     : 'urn:ietf:params:xml:ns:xmpp-sasl'
       ,bind     : 'urn:ietf:params:xml:ns:xmpp-bind'
       ,session  : 'urn:ietf:params:xml:ns:xmpp-session'
       ,dwr      : 'netease:ajax:dwr'
    };
    /**
     * XMPP插件基类
     * @class   {nej.ut.xmpp._$$PLUGIN} XMPP插件基类
     * @extends {nej.ut._$$Event}
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {Object} ud 用户信息
     * 
     * [hr]
     * 
     * @event  {onudchange} 用户信息需要变化触发事件
     * 
     * [hr]
     * 
     * @event  {onstatechange} 状态需要变化触发事件
     * 
     */
    p._$$PLUGIN = NEJ.C();
    __proPLUGIN = p._$$PLUGIN._$extend(t._$$Event);
    __supPLUGIN = p._$$PLUGIN._$supro;
    /**
     * 取插件名字空间
     * @return {String} 名字空间
     */
    p._$$PLUGIN.__getXmlNS = f;
    /**
     * 注册插件实现
     * @return {Void}
     */
    p._$$PLUGIN._$regist = function(){
        p._$$Proxy._$registPlugin(this.__getXmlNS(),this);
    };
    /**
     * 重置控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proPLUGIN.__reset = function(_options){
        this.__ud = _options.ud;
        this.__supReset(_options);
    };
    /**
     * 节点转对象
     * @param  {Node} _root 根节点
     * @return {Object}     对象
     */
    __proPLUGIN.__attr2obj = function(_root){
        var _node,_object = {},
            _attrs = _root.attributes||o;
        for(var i=0,l=_attrs.length;i<l;i++){
            _node = _attrs[i];
            _object[_node.nodeName] = _node.nodeValue||'';
        }
        return _object;
    };
    /**
     * 对象转xml代码
     * @param  {Object} _data 对象
     * @return {String}       xml代码
     */
    __proPLUGIN.__data2xml = function(_data){
        if (!_data) return '';
        var _arr = [];
        for(var x in _data){
            if (!u._$isObject(_data[x]))
                _arr.push('<'+x+'>'+_data[x]+'</'+x+'>');
            else
                _arr.push('<'+x+'>'+this.__data2xml(_data[x])+'</'+x+'>');
        }
        return _arr.join('');
    };
    /**
     * 错误节点转对象
     * @param  {Node} _root 节点
     * @return {Object}     对象
     */
    __proPLUGIN.__err2obj = function(_root){
        var _obj = this.__attr2obj(_root),
            _child = e._$getChildren(_root)[0];
        if (!!_child)
            _obj.name = _child.nodeName||'';
        return _obj;
    };
    /**
     * 收到信息事件
     * @return {Void}
     */
    __proPLUGIN.__onReceive = f;
    /**
     * 打开流
     * @return {Void}
     */
    __proPLUGIN.__doOpenStream = function(){
        this.__proxy._$send('stream','open',
                           {to:this.__ud.domain,
                            from:this.__ud.username});
    };
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    __proPLUGIN.__getNameSapce = function(){
        return this.constructor.__getXmlNS();
    };
    /**
     * 取标签串
     * @param  {Object} _data 数据
     * @return {String}       标签串
     */
    __proPLUGIN.__getFragmentTag = (function(){
        var _tag = e._$addHtmlTemplate("<${tag} {if defined('attrs')}{for x in attrs} ${x_key}='${x}'{/for}{/if}{if defined('content')}>${content}</${tag}>{else}/>{/if}");
        return function(_data){
            return e._$getHtmlTemplate(_tag,_data);
        };
    })();
    /**
     * 根据服务器配置特性执行操作
     * @return {Boolean} 是否执行了特性
     */
    __proPLUGIN._$feature = function(){
        return this.__proxy._$doFeature(this.__getNameSapce());
    };
    /**
     * 绑定到指定代理
     * @param  {nej.ut._$$XmppProxy} _proxy 代理
     * @return {Void}
     */
    __proPLUGIN._$attach = function(_proxy){
        if (!(_proxy instanceof p._$$Proxy))
            return;
        var _xmlns = this.__getNameSapce();
        if (!!this.__proxy)
            this.__proxy._$clearEvent(_xmlns);
        this.__proxy = _proxy;
        this.__proxy._$setEvent(_xmlns,this.__onReceive._$bind(this));
    };
    /**
     * 发送片段
     * @return {Void}
     */
    __proPLUGIN._$send = f;
};
NEJ.define('{lib}util/xmpp/plugin.js',
      ['{lib}util/template/jst.js','{lib}util/xmpp/proxy.js'],f);