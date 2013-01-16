/*
 * ------------------------------------------
 * XMPP NON-SASL验证插件实现文件
 * en:http://xmpp.org/extensions/xep-0078.html
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
        __proXEP_NONSASL;
    if (!!p._$$XEP_NONSASL) return;
    /**
     * NON-SASL验证插件
     * @class   NON-SASL验证插件
     * @extends nej.ut.xmpp._$$PLUGIN
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$XEP_NONSASL = NEJ.C();
    __proXEP_NONSASL = p._$$XEP_NONSASL._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$XEP_NONSASL.__getXmlNS = function(){
        return p.NS.nonsasl;
    };
    /**
     * 初始化控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proXEP_NONSASL.__init = function(_options){
        this.__supInit(_options);
        this.__fields = {username:'',password:'',resource:''};
    };
    /**
     * 发送片段
     * @param  {String} _key  片段标识
     * @param  {Object} _data 数据信息
     * @return {Void}
     */
    __proXEP_NONSASL._$send = function(_key,_data){
        switch(_key){
            case 'field':
                this.__proxy._$send('iq',{type:'get',
                                          id:'field_'+u._$randNumberString(4),
                                          content:this.__getFragmentTag({tag:'query',
                                                  attrs:{xmlns:this.__getNameSapce()}}),
                                          onreceive:this.__onReceiveField._$bind(this)});
            return;
            case 'auth':
                this.__proxy._$send('iq',{type:'set',
                                          id:'auth_'+u._$randNumberString(4),
                                          content:this.__getFragmentTag({
                                                  tag:'query',
                                                  content:this.__data2xml(_data),
                                                  attrs:{xmlns:this.__getNameSapce()}}),
                                          onreceive:this.__onReceiveAuth._$bind(this)});
            return;
        }
    };
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proXEP_NONSASL.__onReceive = function(_root){
        if (!_root) return;
        switch(_root.nodeName){
            case 'auth':
                !!this.__fields ? this.__doAuth()
                                : this._$send('field');
            return;
            case 'query':
                var _obj = {},
                    _child = e._$getChildren(_root);
                for(var i=0,l=_child.length;i<l;i++)
                    _obj[_child[i].nodeName] = _child[i].nodeValue;
                this.__fields = _obj;
                this.__doAuth();
            return;
            case 'error':
                this.__proxy._$error({
                     code:-10156,
                     message:'用户验证失败！',
                     reason:this.__err2obj(_root)});
            return;
        }
    };
    /**
     * 验证字段返回
     * @param  {Object} _iq IQ信息
     * @return {Void}
     */
    __proXEP_NONSASL.__onReceiveField = function(_iq){
        this.__onReceive(_iq.children[0]);
    };
    /**
     * 验证结果返回
     * @param  {Object} _iq IQ信息
     * @return {Void}
     */
    __proXEP_NONSASL.__onReceiveAuth = function(_iq){
        if (!_iq) return;
        if (_iq.type=='error'){
            var _child = _iq.children;
            for(var i=0,l=_child.length;i<l;i++)
                if (_child[i].nodeName=='error'){
                    this.__onReceive(_child[i]);
                    return;
                }
        }
        this._$dispatchEvent('onstatechange',p.ST.oauth);
        this.__proxy._$dispatchEvent('onauth');
    };
    /**
     * 执行验证
     * @return {Void}
     */
    __proXEP_NONSASL.__doAuth = function(){
        var _data = {};
        for(var x in this.__fields)
            if (this.__ud[x]!=null)
                _data[x] = this.__ud[x];
        this._$send('auth',_data);
    };
    // do regist plugin
    p._$$XEP_NONSASL._$regist();
};
define('{lib}util/xmpp/xep/nonsasl.js',
      ['{lib}util/xmpp/plugin.js'],f);