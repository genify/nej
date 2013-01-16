/*
 * ------------------------------------------
 * XMPP MESSAGE处理插件实现文件
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
        p = NEJ.P('nej.ut.xmpp'),
        __proCORE_MESSAGE,
        __timer = null,
        __cache = {}; // message callback by to field,{to:[function1,function2]}
    if (!!p._$$CORE_MESSAGE) return;
    /**
     * MESSAGE处理插件
     * @class   MESSAGE处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_MESSAGE = NEJ.C();
    __proCORE_MESSAGE = p._$$CORE_MESSAGE._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_MESSAGE.__getXmlNS = function(){
        return p.NS.message;
    };
    /**
     * 连接超时
     * @return {Void}
     */
    __proCORE_MESSAGE.__onTimeout = function(){
        for(var x in __cache)
            this.__doMsgCallback(null,x);
        this.__proxy._$resetConnect();
    };
    /**
     * 执行消息回调
     * @param  {Object} _message 消息对象
     * @param  {String} _key     回调标识
     * @return {Void}
     */
    __proCORE_MESSAGE.__doMsgCallback = function(_message,_key){
        var _callback = __cache[_key];
        if (!!_callback){
            for(var i=0,l=_callback.length;i<l;i++){
                try{_callback[i](_message);}catch(ex){};
            }
        }
        delete __cache[_key];
    };
    /**
     * 检查节点的私有协议
     * @param  {Node} _root 根节点
     * @return {Boolean}    是否做了私有协议
     */
    __proCORE_MESSAGE.__doCheckUDProtocol = function(_root){
        var _child = e._$getChildren(_root);
        if (!_child||!_child.length) return;
        var _uded = !1;
        for(var i=0,l=_child.length,_xmlns;i<l;i++){
            _xmlns = _child[i].getAttribute('xmlns')||'';
            if (!!_xmlns){
                _uded = !0;
                this.__proxy._$dispatchEvent(_xmlns,_child[i]);
            }
        }
        return _uded;
    };
    /**
     * 清理超时检测
     * @return {Void}
     */
    __proCORE_MESSAGE._$clear = function(){
        __timer = window.clearTimeout(__timer);
    };
    /**
     * 发送消息
     * @param  {Object} _message 消息信息对象,可包含以下信息
     *                           to        [String]   - 接受者JID
     *                           type      [String]   - 消息类型
     *                           body      [String]   - 消息内容
     *                           subject   [String]   - 消息主题
     *                           thread    [String]   - 会话线索
     *                           onreceive [Function] - 收到消息回调
     *                           
     * @return {Void}
     */
    __proCORE_MESSAGE._$send = (function(){
        var _tmpl = e._$addHtmlTemplate("<message {if defined('to')} to='${to}'{/if}{if defined('from')} from='${from}'{/if}{if defined('type')} type='${type}'{/if}>{if defined('subject')}<subject>${subject|escape}</subject>{/if}<body>${body}</body>{if defined('thread')}<thread>${thread}</thread>{/if}</message>");
        return function(_message){
            _message = _message||o;
            if (!_message.to){
                this.__proxy._$error({code:-10154,message:'请指定消息接收者ID！'});
                return;
            }
            _message.from = this.__ud.jid;
            if (!!_message.onreceive){
                var _callback = __cache[_message.to];
                if (!u._$isArray(_callback)){
                    _callback = [];
                    __cache[_message.to] = _callback;
                }
                _callback.push(_message.onreceive);
            }
            this.__proxy._$sendFragment(e._$getHtmlTemplate(_tmpl,_message));
            if (!!__timer) this._$clear();
            __timer = window.setTimeout(this.__onTimeout._$bind(this),5000);
        };
    })();
    /**
     * 处理接收到的信息
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_MESSAGE.__onReceive = function(_root){
        var _child = e._$getChildren(_root);
        if (!_child) return;
        // check private protocol just in root
        if (this.__doCheckUDProtocol(_root)) return;
        // {to:'xxx',
        //  from:'xxx',
        //  type:'chat',
        // 'xml:lang':'en',
        //  subject:'aaaaa bbb',
        //  subject_node:dom node,
        //  subject_cn:'xxxxx',
        //  subject_cn_node:dom node,
        //  ...}
        var _message = this.__attr2obj(_root);
        for(var i=0,l=_child.length,_xmlns,_tag,_attr,_key;i<l;i++){
            _tag  = _child[i].nodeName;
            _attr = _child[i].getAttribute('xml:lang')||'';
            _key  = _tag+(!_attr?'':'_')+_attr;
            _message[_key] = _child[i].textContent||'';
            if (e._$getChildren(_child[i]).length>0)
                _message[_key+'_node'] = _child[i];
        }
        // check private protocol just in body tag
        if (this.__doCheckUDProtocol(_message.body_node)) return;
        // do message callback
        this.__doMsgCallback(_message,_message.from);
        this.__proxy._$dispatchEvent('onmessage',_message);
    };
    // do regist plugin
    p._$$CORE_MESSAGE._$regist();
};
define('{lib}util/xmpp/core/message.js',
      ['{lib}util/xmpp/plugin.js'],f);