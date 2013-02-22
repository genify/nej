/*
 * ------------------------------------------
 * XMPP PRESENCE处理插件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        p = NEJ.P('nej.ut.xmpp'),
        __proCORE_PRESENCE;
    if (!!p._$$CORE_PRESENCE) return;
    /**
     * PRESENCE处理插件
     * @class   PRESENCE处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     * 
     * 
     */
    p._$$CORE_PRESENCE = NEJ.C();
    __proCORE_PRESENCE = p._$$CORE_PRESENCE._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_PRESENCE.__getXmlNS = function(){
        return p.NS.presence;
    };
    /**
     * 发送出席信息
     * @param  {Object} _presence 出席信息
     *                            to        [String] - 目标
     *                            type      [String] - 类型
     *                            show      [String] - 出席标识away/chat/dnd/xa
     *                            status    [String] - 自定义状态
     *                            priority  [Number] - 优先级
     * @return {Void}
     */
    __proCORE_PRESENCE._$send = function(_presence){
        _presence = _presence||o;
        var _options = {tag:'presence',attrs:{}};
        if (_presence.to!=null){
            _options.attrs.to = _presence.to;
            delete _presence.to;
        }
        if (_presence.type!=null){
            _options.attrs.type = _presence.type;
            delete _presence.type;
        }
        _options.content = this.__data2xml(_presence);
        this.__proxy._$sendFragment(this.__getFragmentTag(_options));
    };
    /**
     * 处理接收到的信息
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_PRESENCE.__onReceive = function(_root){
        var _attrs = this.__attr2obj(_root);
        if (!_attrs) return;
        switch(_attrs.type){
            case 'subscribe':
                this._$send({to:_attrs.from,type:'subscribed'});
            return;
            case 'unsubscribe':
                this._$send({to:_attrs.from,type:'unsubscribed'});
            return;
        }
        this.__proxy._$dispatchEvent('onpresence',_attrs);
    };
    // do regist plugin
    p._$$CORE_PRESENCE._$regist();
};
NEJ.define('{lib}util/xmpp/core/presence.js',
      ['{lib}util/xmpp/plugin.js'],f);