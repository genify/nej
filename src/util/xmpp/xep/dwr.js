/*
 * ------------------------------------------
 * XMPP DWR数据交互插件实现文件
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
        __proXEP_DWR,
        __supXEP_DWR;
    if (!!p._$$XEP_DWR) return;
    /**
     * DWR数据交互插件
     * @calss   DWR数据交互插件
     * @extends nej.ut.xmpp._$$PLUGIN
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$XEP_DWR = NEJ.C();
    __proXEP_DWR = p._$$XEP_DWR._$extend(p._$$PLUGIN);
    __supXEP_DWR = p._$$XEP_DWR._$supro;
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$XEP_DWR.__getXmlNS = function(){
        return p.NS.dwr;
    };
    /**
     * 发送片段
     * @param  {Object} _data 要发送的数据
     *                        url   [String] - 请求地址
     *                        param [String] - 消息参数内容
     * @return {Void}
     */
    __proXEP_DWR._$send = (function(){
        var _tmpl = e._$addHtmlTemplate('<dwr xmlns="'+p.NS.dwr+'"><url>${encodeURIComponent(url)}</url><params>${param}</params></dwr>');
        return function(_data){
            _data = _data||{};
            _data.body = e._$getHtmlTemplate(_tmpl,_data);
            this.__proxy._$send('message',_data);
        };
    })();
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proXEP_DWR.__onReceive = function(_root){
        if (!_root) retuurn;
        e._$addScript(_root.textContent);
    };
    // do regist plugin
    p._$$XEP_DWR._$regist();
};
define('{lib}util/xmpp/xep/dwr.js',
      ['{lib}util/xmpp/plugin.js'],f);