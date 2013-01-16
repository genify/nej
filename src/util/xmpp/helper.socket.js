/*
 * ------------------------------------------
 * XMPP SOCKET交互辅助实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var p = NEJ.P('nej.ut'),
        __proXmppSocketHelper;
    if (!!p._$$XmppSocketHelper) return;
    /**
     * XMPP SOCKET交互辅助类
     * @class   XMPP SOCKET交互辅助类
     * @extends nej.ut._$$XmppHelper
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     */
    p._$$XmppSocketHelper = NEJ.C();
    __proXmppSocketHelper = p._$$XmppSocketHelper._$extend(p._$$XmppHelper);
    /**
     * 取XMPP代理对象
     * @return {nej.ut._$$XmppProxy} 代理对象
     */
    __proXmppSocketHelper.__getXmppProxy = function(){
        return p.xmpp._$$SocketProxy._$allocate(this.__mopt);
    };
};
define('{lib}util/xmpp/helper.socket.js',
      ['{lib}util/xmpp/proxy.socket.js','{lib}util/xmpp/helper.js'],f);