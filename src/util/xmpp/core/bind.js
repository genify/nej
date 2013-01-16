/*
 * ------------------------------------------
 * XMPP BIND处理插件实现文件
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
        __proCORE_BIND;
    if (!!p._$$CORE_BIND) return;
    /**
     * BIND处理插件
     * @class   {nej.ut.xmpp._$$CORE_BIND} BIND处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_BIND = NEJ.C();
    __proCORE_BIND = p._$$CORE_BIND._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_BIND.__getXmlNS = function(){
        return p.NS.bind;
    };
    /**
     * 绑定资源
     * @param  {String} _resource 资源
     * @return {Void}
     */
    __proCORE_BIND._$bind = function(_resource){
        if (!!_resource)
            this._$dispatchEvent('onudchange','resource',_resource);
        this._$send('resource');
    };
    /**
     * 发送片段
     * @return {Void}
     */
    __proCORE_BIND._$send = function(_type,_options){
        switch(_type){
            case 'resource':
                this.__proxy._$send('iq',{type:'set',
                                          id:'resource_'+u._$randNumberString(4),
                                          content:this.__getFragmentTag({tag:'bind',
                                                  attrs:{xmlns:this.__getNameSapce()}}),
                                          onreceive:this.__onReceiveResource._$bind(this)});
            return;
        }
    };
    /**
     * 处理接收到的信息
     * @param  {Node|Object} _root 根节点或者IQ对象
     * @return {Void}
     */
    __proCORE_BIND.__onReceive = function(_root){
        switch(_root.nodeName){
            case 'bind':
                this._$bind();
            return;
        }
    };
    /**
     * 资源绑定回调
     * @param  {Object} _iq IQ信息
     * @return {Void}
     */
    __proCORE_BIND.__onReceiveResource = function(_iq){
        if (!_iq) return;
        switch(_iq.type){
            case 'result':
                var _node = e._$getChildren(_iq.children[0])[0];
                this._$dispatchEvent('onudchange','jid',_node.textContent);
                this.__proxy._$dispatchEvent('onbind');
            return;
            case 'error':
                var _info = this.__attr2obj(_iq.children[1]);
                _info.name = e._$getChildren(_iq.children[1])[0].nodeName;
                this.__proxy._$error({code:-10159,message:'资源绑定失败!',info:_info});
            return;
        }
    };
    // do regist plugin
    p._$$CORE_BIND._$regist();
};
define('{lib}util/xmpp/core/bind.js',
      ['{lib}util/xmpp/plugin.js'],f);