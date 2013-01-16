/*
 * ------------------------------------------
 * XMPP SASL处理插件实现文件
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
        __proCORE_SASL;
    if (!!p._$$CORE_SASL) return;
    /**
     * SASL处理插件
     * @class   SASL处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$CORE_SASL = NEJ.C();
    __proCORE_SASL = p._$$CORE_SASL._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_SASL.__getXmlNS = function(){
        return p.NS.sasl;
    };
    /**
     * 注册用户信息
     * @param  {String} _username 用户名
     * @param  {String} _password 密码
     * @return {Void}
     */
    __proCORE_SASL._$regist = function(_username,_password){
        this._$dispatchEvent('onudchange','username',_username);
        this._$dispatchEvent('onudchange','password',_password);
    };
    /**
     * 发送片段
     * @param  {Object} _data 数据信息
     * @return {Void}
     */
    __proCORE_SASL._$send = function(_data){
        _data = _data||{};
        _data.attrs = _data.attrs||{};
        _data.attrs.xmlns = this.__getNameSapce();
        this.__proxy._$sendFragment(this.__getFragmentTag(_data));
    };
    /**
     * 收到信息事件
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_SASL.__onReceive = (function(){
        var _qot = /"/g,
            _seq = ['username','realm','nonce','cnonce','nc',
                    'qop','digest-uri','response','charset'];
        var _obj2str = function(_data){
            var _arr = [];
            for(var i=0,l=_seq.length;i<l;i++)
                _arr.push(_seq[i]+'='+_data[_seq[i]]);
            return _arr.join(',');
        };
        var _digest = function(_bstr,_data,_auth){
            return u._$md52hex(
                   u._$md52hex(u._$md52hex(_bstr)+':'+
                               _data.nonce+':'+_data.cnonce)+':'+
                   _data.nonce+':'+_data.nc+':'+_data.cnonce+':auth:'+
                   u._$md52hex((_auth||'')+':'+_data['digest-uri']));
        };
        return function(_root){
            if (!_root) return;
            var _error = {code:-10151,message:'SASL验证失败！'};
            switch(_root.nodeName){
                case 'mechanisms':
                    var _child = e._$getChildren(_root);
                    this._$send({tag:'auth',attrs:{mechanism:_child[0].textContent}});
                return;
                case 'challenge':
                    var _data = u._$string2object(
                                u._$b642str(_root.textContent),',');
                    if (!this.__challenge)
                         this.__challenge = _data;
                    var _basestr = this.__ud.username+':'+
                                   this.__ud.domain+':'+
                                   this.__ud.password;
                    // STEP TWO
                    if (!!_data.rspauth){
                        var _result = _digest(_basestr,this.__challenge);
                        delete this.__challenge;
                        if (_result==_data.rspauth)
                            this._$send({tag:'response'});
                        else{
                            _error.name = 'not-authorized';
                            this.__proxy._$error(_error);
                        }
                        return;
                    }
                    // STEP ONE
                    this.__challenge['digest-uri'] = '"xmpp/'+this.__ud.domain+'"';
                    this.__challenge.username = this.__ud.username;
                    this.__challenge.cnonce   = u._$randString(14);
                    this.__challenge.nonce    = this.__challenge.nonce.replace(_qot,'');
                    this.__challenge.qop      = 'auth';
                    this.__challenge.nc       = '00000001';
                    this.__challenge.response = _digest(_basestr,this.__challenge,'AUTHENTICATE');
                    this._$send({tag:'response',content:u._$str2b64(_obj2str(this.__challenge))});
                return;
                case 'success':
                    this.__doOpenStream();
                    this._$dispatchEvent('onstatechange',p.ST.oauth);
                return;
                case 'failure':
                    _error.name = e._$getChildren(_root)[0].nodeName;
                    this.__proxy._$error(_error);
                return;
            }
        };
    })();
    // do regist plugin
    p._$$CORE_SASL._$regist();
};
define('{lib}util/xmpp/core/sasl.js',
      ['{lib}util/encode/base64.js','{lib}util/xmpp/plugin.js'],f);