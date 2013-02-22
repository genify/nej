/*
 * ------------------------------------------
 * SOCKET方式XMPP实现文件
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
        __proSocketProxy,
        __supSocketProxy;
    if (!!p._$$SocketProxy) return;
    /**
     * XMPP协议WEB SOCKET封装对象
     * @class   XMPP协议WEB SOCKET封装对象
     * @extends nej.ut._$$Proxy
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     * 
     */
    p._$$SocketProxy = NEJ.C();
    __proSocketProxy = p._$$SocketProxy._$extend(p._$$Proxy);
    __supSocketProxy = p._$$SocketProxy._$supro;
    /**
     * 执行连接
     * @param  {String} _username 用户名
     * @return {Void}
     */
    __proSocketProxy._$connect = function(_username){
        __supSocketProxy._$connect.apply(this,arguments);
        try{
            this.__connector = new WebSocket(this.__popt.ud.url);
            this.__connector.onopen    = this.__onOpen._$bind(this);
            this.__connector.onclose   = this.__onClose._$bind(this);
            this.__connector.onerror   = this.__onError._$bind(this);
            this.__connector.onmessage = this.__onMessage._$bind(this);
            this.__onStateChange(p.ST.connect);
        }catch(ex){
            this._$error({code:-10142,
                          message:'给定地址['+this.__popt.ud.url+']无法建立SOCKET连接！'});
        }
    };
    /**
     * 关闭连接
     * @return {Void}
     */
    __proSocketProxy._$close = function(){
        this.__doFeatureClear();
        this.__onStateChange(p.ST.close);
        __supSocketProxy._$close.apply(this,arguments);
        if (!!this.__connector){
            this.__connector.onopen    = null;
            this.__connector.onclose   = null;
            this.__connector.onerror   = null;
            this.__connector.onmessage = null;
            delete this.__connector;
        }
    };
    /**
     * 连接打开事件
     * @return {Void}
     */
    __proSocketProxy.__onOpen = function(){
        this.__onStateChange(p.ST.auth);
        this._$send('stream','open',{to:this.__popt.ud.domian,
                                     from:this.__popt.ud.username});
    };
    /**
     * 连接关闭事件
     * @return {Void}
     */
    __proSocketProxy.__onClose = function(){
        this._$close();
        this._$dispatchEvent('onclose');
    };
    /**
     * 连接异常事件
     * @return {Void}
     */
    __proSocketProxy.__onError = function(_error){
        this._$error({code:-10143,
                      message:'连接异常['+(_error.message||_error)+']'});
    };
    /**
     * 收到消息事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    __proSocketProxy.__onMessage = (function(){
        var _reg = /<\/stream:stream>/i;
        var _wrapper = function(_fragment){
            var _xml = '';
            _fragment = _fragment.replace(_reg,'');
            if (_fragment.indexOf('<stream:')>=0)
                _xml = _fragment+'</stream:stream>';
            if (_xml.indexOf('<stream:stream')<0&&
                _xml.indexOf('</stream:stream>')>=0)
                _xml = "<stream:stream xmlns:stream='http://etherx.jabber.org/streams'>"+_xml;
            return _xml;
        };
        return function(_event){
            var _fragment = (_event||o).data||'';
            if (!_fragment) return;
//            console.log('receive:'+_fragment);
            // check heart beat
            if (_fragment==' '){
                var _plugin = this._$getPlugin(p.NS.message);
                if (!!_plugin) _plugin._$clear();
                return;
            }
            // TODO do parse </stream:stream>
            // stream:stream
            // stream:features
            // stream:error
            var _xml = _wrapper(_fragment);
            if (!!_xml){
                var _root = e._$xml2dom(_xml),
                    _child = e._$getChildren(_root);
                if (_child.length>0)
                    _root = _child[0];
                this._$dispatchEvent(p.NS.stream,_root);
                return;
            }
            this.__doParseFragment(_fragment);
        };
    })();
};
NEJ.define('{lib}util/xmpp/proxy.socket.js',['{lib}util/xmpp/proxy.js'],f);