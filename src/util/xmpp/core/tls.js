/*
 * ------------------------------------------
 * XMPP TLS处理插件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('nej.ut.xmpp'),
        __proCORE_TLS;
    if (!!p._$$CORE_TLS) return;
    /**
     * TLS处理插件
     * @class   TLS处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_TLS = NEJ.C();
    __proCORE_TLS = p._$$CORE_TLS._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_TLS.__getXmlNS = function(){
        return p.NS.tls;
    };
    /**
     * 发送片段
     * @param  {String} _tag  片段标识
     * @return {Void}
     */
    __proCORE_TLS._$send = function(_tag){
        this.__proxy._$sendFragment(
             this.__getFragmentTag({tag:_tag,
                  attrs:{xmlns:this.__getNameSapce()}}));
    };
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_TLS.__onReceive = function(_root){
        if (!_root) return;
        switch(_root.nodeName){
            case 'starttls':
                this._$send('starttls');
            return;
            case 'proceed':
                this.__doOpenStream();
            return;
            case 'failure':
                this.__proxy._$error({code:-10150,message:'TLS握手失败'});
            return;
        }
    };
    // do regist plugin
    p._$$CORE_TLS._$regist();
};
define('{lib}util/xmpp/core/tls.js',
      ['{lib}util/xmpp/plugin.js'],f);