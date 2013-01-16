/*
 * ------------------------------------------
 * XMPP流处理插件实现文件
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
        __proCORE_STREAM,
        __supCORE_STREAM;
    if (!!p._$$CORE_STREAM) return;
    /**
     * 流处理插件
     * @class   流处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_STREAM = NEJ.C();
    __proCORE_STREAM = p._$$CORE_STREAM._$extend(p._$$PLUGIN);
    __supCORE_STREAM = p._$$CORE_STREAM._$supro;
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_STREAM.__getXmlNS = function(){
        return p.NS.stream;
    };
    /**
     * 发送片段
     * @param  {String} _key  片段标识
     * @param  {Object} _data 数据信息
     * @return {Void}
     */
    __proCORE_STREAM._$send = (function(){
        var _tclose = '</stream:stream>',
            _topen  = e._$addHtmlTemplate("<?xml version='1.0'?><stream:stream version='1.0' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams'{if defined('from')} from='${from}'{/if}{if defined('to')} to='${to}'{/if}>");
        return function(_key,_data){
            var _content;
            switch(_key){
                case 'open':
                    _content = e._$getHtmlTemplate(_topen,_data);
                break;
                case 'close':
                    _content = _tclose;
                break;
            }
            if (!!_content) this.__proxy._$sendFragment(_content);
        };
    })();
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_STREAM.__onReceive = function(_root){
        if (!_root){
            this.__proxy._$dispatchEvent('onstream');
            return;
        }
        switch(_root.localName){
            case 'error':
                this.__doReceiveSteamError(_root);
            return;
            case 'features':
                this.__doReceiveSteamFeatures(_root);
                this.__proxy._$dispatchEvent('onfeature');
            return;
        }
    };
    /**
     * 处理接收到的stream:error标记
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_STREAM.__doReceiveSteamError = (function(){
        var _xmlns = 'urn:ietf:params:xml:ns:xmpp-streams';
        return function(_root){
            var _child = e._$getChildren(_root);
            if (!_child||!_child.length) return;
            var _text,
                _extra = [],
                _error = {code:-10149,message:'流错误！'};
            for(var i=0,l=_child.length,_tag;i<l;i++){
                _tag = _child[i].nodeName||'';
                if (_child[i].namespaceURI!=_xmlns){
                    _extra.push(_tag);
                    continue;
                }
                _tag!='text' ? _error.name = _tag
                             : _text = _child[i].textContent||'';
            }
            if (_extra.length>0) _error.extra = _extra;
            _error.message = '流错误['+(_text||_error.name||'未知错误')+']！';
            this.__proxy._$error(_error);
        };
    })();
    /**
     * 处理接收到的stream:features标记
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_STREAM.__doReceiveSteamFeatures = function(_root){
        var _child = e._$getChildren(_root);
        if (!_child||!_child.length) return;
        for(var i=0,l=_child.length,_name;i<l;i++){
            _name = _child[i].getAttribute('xmlns')||'';
            if (!!_name) this.__proxy._$addFeature(_name,_child[i]);
        }
    };
    // do regist plugin
    p._$$CORE_STREAM._$regist();
};
define('{lib}util/xmpp/core/stream.js',
      ['{lib}util/xmpp/plugin.js'],f);