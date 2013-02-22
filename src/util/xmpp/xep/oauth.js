/*
 * ------------------------------------------
 * XMPP OAuth验证插件实现文件
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
        t = NEJ.P('nej.ut.oa'),
        p = NEJ.P('nej.ut.xmpp'),
        __proXEP_OAuth,
        __supXEP_OAuth;
    if (!!p._$$XEP_OAuth) return;
    /**
     * OAuth验证插件
     * @class   OAuth验证插件
     * @extends nej.ut.xmpp._$$PLUGIN
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$XEP_OAuth = NEJ.C();
    __proXEP_OAuth = p._$$XEP_OAuth._$extend(p._$$PLUGIN);
    __supXEP_OAuth = p._$$XEP_OAuth._$supro;
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$XEP_OAuth.__getXmlNS = function(){
        return p.NS.oauth;
    };
    /**
     * 注册用户信息
     * @param  {String} _username 用户名
     * @param  {String} _passport 验证信息
     * @param  {Object} _consumer 配置信息
     * @return {Void}
     */
    __proXEP_OAuth._$regist = function(_username,_passport,_consumer){
        this._$dispatchEvent('onudchange','username',_username);
        this._$dispatchEvent('onudchange','password',_passport);
        this._$dispatchEvent('onudchange','consumer',_consumer);
    };
    /**
     * 发送片段
     * @param  {String} _token 是否使用已有验证信息
     * @param  {String} _oauth 验证信息
     * @return {Void}
     */
    __proXEP_OAuth._$send = function(_token,_oauth){
        var _data = {tag:'auth'
                    ,attrs:{type:'netease'
                           ,token:_token
                           ,oauth:_oauth
                           ,xmlns:this.__getNameSapce()}};
        this.__proxy._$sendFragment(this.__getFragmentTag(_data));
    };
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proXEP_OAuth.__onReceive = function(_root){
        if (!_root) return;
        switch(_root.nodeName){
            case 'mechanisms':
                var _message = {url:'http://163.com',method:'GET'},
                    _oauth = t._$getAuthHeaderByKey(this.__ud.password,_message);
                if (!!_oauth){
                    this._$send('true',_oauth);
                    return;
                }
                _message.param = {
                    'x_auth_mode':'client_auth'
                   ,'x_auth_username':this.__ud.username
                   ,'x_auth_password':this.__ud.password
                   ,'x_auth_passtype':1
                };
                _oauth = t._$getAuthHeader(_message,this.__ud.consumer);
                this._$send('false',_oauth);
            return;
            case 'success':
                var _token,
                    _key = this.__ud.password,
                    _content = _root.textContent;
                if (!!_content){
                    var _data = u._$string2object(
                                u._$b642str(_content),';');
                    if (!!_data.secret&&
                        !!_data.access_token){
                        _key = t._$getIdentifier(this.__ud.username
                                                ,this.__ud.consumer.consumer_key);
                        _token = {token:_data.access_token,secret:_data.secret};
                        t._$setTokenInStorage(_key,this.__ud.consumer,_token);
                    }
                }
                this.__doOpenStream();
                this._$dispatchEvent('onstatechange',p.ST.oauth);
                this.__proxy._$dispatchEvent('onoauth',_key,_token);
            return;
            case 'failure':
                var _error = {code:-10158
                             ,message:'OAuth验证失败！'
                             ,name:e._$getChildren(_root)[0].nodeName};
                this.__proxy._$error(_error);
            return;
        }
    };
    // do regist plugin
    p._$$XEP_OAuth._$regist();
};
NEJ.define('{lib}util/xmpp/xep/oauth.js',
      ['{lib}util/oauth/util.js'
      ,'{lib}util/encode/base64.js'
      ,'{lib}util/xmpp/plugin.js'],f);