/*
 * ------------------------------------------
 * XMPP SESSION处理插件实现文件
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
        __proCORE_SESSION;
    if (!!p._$$CORE_SESSION) return;
    /**
     * SESSION处理插件
     * @class   SESSION处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_SESSION = NEJ.C();
    __proCORE_SESSION = p._$$CORE_SESSION._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_SESSION.__getXmlNS = function(){
        return p.NS.session;
    };
    /**
     * 发送片段
     * @return {Void}
     */
    __proCORE_SESSION._$send = function(_type,_options){
        
    };
    /**
     * 处理接收到的信息
     * @param  {Node|Object} _root 根节点
     * @return {Void}
     */
    __proCORE_SESSION.__onReceive = function(_root){
        
    };
    // do regist plugin
    p._$$CORE_SESSION._$regist();
};
define('{lib}util/xmpp/core/session.js',
      ['{lib}util/xmpp/plugin.js'],f);