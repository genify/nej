/*
 * ------------------------------------------
 * XMPP带内注册插件实现文件
 * en:http://xmpp.org/extensions/xep-0077.html
 * cn:http://wiki.jabbercn.org/XEP-0077
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
        __proXEP_REGISTER;
    if (!!p._$$XEP_REGISTER) return;
    /**
     * 带内注册插件
     * @class   带内注册插件
     * @extends nej.ut.xmpp._$$PLUGIN
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     */
    p._$$XEP_REGISTER = NEJ.C();
    __proXEP_REGISTER = p._$$XEP_REGISTER._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$XEP_REGISTER.__getXmlNS = function(){
        return p.NS.register;
    };
    /**
     * 初始化插件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proXEP_REGISTER.__init = function(_options){
        this.__supInit(_options);
        this.__fields = {username:'',password:''};
    };
    /**
     * 注册用户
     * @param  {Object} _user 用户信息
     * @return {Void}
     */
    __proXEP_REGISTER._$regist = function(_user){
        if (!this.__doCheckUser(
            _user.username,_user.password))
            return;
        if (!!this.__fields){
            this.__doReceiveField(_user);
            return;
        }
        this._$setEvent('onfield',this
            .__doReceiveField._$bind(this,_user));
        this._$send('field');
    };
    /**
     * 发送片段
     * @param  {String} _key  片段标识
     * @param  {Object} _data 数据信息
     * @return {Void}
     */
    __proXEP_REGISTER._$send = function(_key,_data){
        switch(_key){
            case 'field':
                this.__proxy._$send('iq',{type:'get',
                                          id:'field_'+u._$randNumberString(4),
                                          content:this.__getFragmentTag({tag:'query',
                                                  attrs:{xmlns:this.__getNameSapce()}}),
                                          onreceive:this.__onReceiveField._$bind(this)});
            return;
            case 'regist':
                this.__proxy._$send('iq',{type:'set',
                                          id:'regist_'+u._$randNumberString(4),
                                          content:this.__getFragmentTag({
                                                  tag:'query',
                                                  content:this.__data2xml(_data),
                                                  attrs:{xmlns:this.__getNameSapce()}}),
                                          onreceive:this.__onReceiveRegist._$bind(this)});
            return;
        }
    };
    /**
     * 检查用户名密码
     * @param  {String} _username 用户名
     * @param  {String} _password 密码或者AccessToken
     * @return {Boolean}          是否通过验证
     */
    __proXEP_REGISTER.__doCheckUser = function(_username,_password){
        // check username
        if (!_username){
            this.__proxy._$error({code:-10144,
                                  message:'请提供连接所需用户名！'});
            return !1;
        }
        // check token
        if (!_password){
            this.__proxy._$error({code:-10145,
                                  message:'请提供连接所需密码或令牌！'});
            return !1;
        }
        return !0;
    };
    /**
     * 收到注册字段回调
     * @param  {Object} _iq IQ信息
     * @return {Void}
     */
    __proXEP_REGISTER.__onReceiveField = (function(){
        var _reg = /^x|instructions|registered$/i;
        return function(_iq){
            var _obj = {},
                _child = e._$getChildren(_iq.children[0]);
            for(var i=0,l=_child.length,_name;i<l;i++){
                _name = _child[i].nodeName;
                if (_reg.test(_name)) continue;
                _obj[_name] = _child[i].nodeValue;
            }
            this.__fields = _obj;
            this._$dispatchEvent('onfield');
        };
    })();
    /**
     * 接收到注册字段回调
     * @param  {Object} _user 用户信息
     * @return {Void}
     */
    __proXEP_REGISTER.__doReceiveField = function(_user){
        var _data = {};
        _user = _user||o;
        for(var x in this.__fields){
            if (_user[x]!=null)
                _data[x] = _user[x];
        }
        this._$dispatchEvent('onudchange','username',_data.username);
        this._$dispatchEvent('onudchange','password',_data.password);
        this._$send('regist',_data);
    };
    /**
     * 收到注册结果回调
     * @param  {Object} _iq IQ信息
     * @return {Void}
     */
    __proXEP_REGISTER.__onReceiveRegist = function(_iq){
        if (!_iq||!_iq.id) return;
        var _flag = 0;
        if (_iq.type=='error'){
            var _info;
            for(var i=0,l=_iq.children.length,_node;i<l;i++){
                _node = _iq.children[i];
                if (_node.nodeName=='error'){
                    _info = this.__attr2obj(_node);
                    _info.name = e._$getChildren(_node)[0].nodeName;
                    break;
                }
            }
            if (_info.code!=409){
                this.__proxy._$error({code:-10155,message:'用户注册失败！',info:_info});
                return;
            }
            _flag = 1;
        }
        if (_flag==0)
            this._$dispatchEvent('onstatechange',p.ST.oauth);
        this.__proxy._$dispatchEvent('onregist',_flag);
    };
    // do regist plugin
    p._$$XEP_REGISTER._$regist();
};
NEJ.define('{lib}util/xmpp/xep/register.js',['{lib}util/xmpp/plugin.js'],f);