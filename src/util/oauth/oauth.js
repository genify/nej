/*
 * ------------------------------------------
 * OAuth/XAuth认证实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        g = NEJ.P('nej.g'),
        u = NEJ.P('nej.u'),
        j = NEJ.P('nej.j'),
        p = NEJ.P('nej.ut'),
        t = NEJ.P('nej.ut.oa'),
        __proOAuthCache,
        __supOAuthCache;
    if (!!p._$$OAuthCache) return;
    /**
     * OAuth验证对象，已处理的回调列表如下所示
     * [ntb]
     *  onrequesttokenload    | OAuth临时令牌载入回调
     *  onauthorizedtokenload | OAuth授权令牌载入回调
     *  onaccesstokenload     | OAuth验证信息载入回调
     *  onaccexxtokenload     | XAuth验证信息载入回调
     *  onaccexxtokencancel   | XAuth验证信息取消回调函数
     * [/ntb]
     * @class   {nej.ut._$$OAuthCache} OAuth验证对象
     * @extends {nej.ut._$$Cache}
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示：
     * @config  {String} consumer_id        应用缓存标识，默认自动生成
     * @config  {String} consumer_key      使用者标识
     * @config  {String} consumer_secret 使用者标识对应密钥
     * @config  {String} url_request      请求令牌地址（获取未授权的RequestToken）
     * @config  {String} url_authorize   验证地址（获取用户授权的RequestToken）
     * @config  {String} url_access      取访问令牌地址（用授权的RequestToken换取AccessToken）
     * @config  {String} url_cancel      取消令牌地址（取消AccessToken）
     * 
     * [hr]
     * 
     * @event  {onrequesttokenload}    OAuth临时令牌载入回调函数
     * @param  {Object} 令牌信息
     * @config {String} token  
     * @config {String} secret
     * 
     * [hr]
     * 
     * @event  {onauthorizedtokenload} OAuth授权令牌载入回调函数
     * @param  {Object} 令牌信息
     * @config {String} token  
     * @config {String} secret
     * @config {String} verifier
     * 
     * [hr]
     * 
     * @event  {onaccesstokenload}        OAuth验证信息载入回调函数
     * @param  {String} 缓存标识
     * @param  {Object} 令牌信息
     * @config {String} token
     * @config {String} secret
     * @config {String} username
     * 
     * [hr]
     * 
     * @event  {onaccexxtokenload}        XAuth验证信息载入回调函数
     * @param  {String} 缓存标识
     * @param  {Object} 令牌信息
     * 
     * [hr]
     * 
     * @event  {onaccexxtokencancel}   XAuth验证信息取消回调函数
     * @param  {Boolean} 是否取消令牌信息
     * 
     */
    p._$$OAuthCache = NEJ.C();
    __proOAuthCache = p._$$OAuthCache._$extend(p._$$Cache);
    __supOAuthCache = p._$$OAuthCache._$supro;
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proOAuthCache.__reset = (function(){
        var _id = u._$randNumberString();
        return function(_options){
            this.__supReset(_options);
            this.__id = _options.consumer_id||_id;
            if (!this.__getDataInCache(this.__id)) 
                 this.__setDataInCache(this.__id,{});
            this.__method = 'POST'; // default method
            // request status
            // 0 - init
            // 1 - begin get request token
            // 2 - begin get authorized token
            // 3 - begin get access token
            this._$clearStatus();
            this.__config = {
                realm:''
               ,signature:'HMAC-SHA1'
               ,consumer_key:_options.consumer_key
               ,consumer_secret:_options.consumer_secret
            };
            this.__urlmap = {
                authorize:_options.url_authorize
               ,request:_options.url_request
               ,access:_options.url_access
               ,cancel:_options.url_cancel
            };
        };
    })();
    /**
     * 控件销毁，子类实现具体逻辑
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proOAuthCache.__destroy = function(){
        this.__supDestroy();
        delete this.__config;
        delete this.__urlmap;
        delete this.__passport;
    };
    /**
     * 设置缓存数据
     * @protected
     * @method {__set}
     * @param  {String}   数据标识
     * @param  {Variable} 数据
     * @return {Void}
     */
    __proOAuthCache.__set = function(_key,_value){
        this.__getDataInCache(this.__id)[_key] = _value;
    };
    /**
     * 取缓存数据
     * @protected
     * @method {__get}
     * @param  {String}   数据标识
     * @return {Variable} 数据
     */
    __proOAuthCache.__get = function(_key){
        return this.__getDataInCache(this.__id)[_key];
    };
    /**
     * 队列任务
     * @protected
     * @method {__queue}
     * @param  {Function} 回调函数
     * @return {Void}
     */
    __proOAuthCache.__queue = function(_handler){
        var _queue = this.__get('queue');
        if (!_queue){
            _queue = [];
            this.__set('queue',_queue);
        } 
        if (u._$isFunction(_handler)) 
            _queue.push(_handler);
    };
    /**
     * 检测队列任务
     * @protected
     * @method {__doQueueCheck}
     * @return {Void}
     */
    __proOAuthCache.__doQueueCheck = function(){
        var _queue = this.__get('queue');
        if (!_queue||!_queue.length) return;
        _queue.shift().call(window);
    };
    /**
     * 清除请求状态
     * @method {_$clearStatus}
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$clearStatus = function(){
        this.__set('status',0);
        return this;
    };
    /**
     * 取临时令牌
     * @method {_$getRequestToken}
     * @param  {Object} 请求参数集合
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$getRequestToken = function(_param){
        var _status = this.__get('status');
        if (_status>0){
            this.__queue(this._$getRequestToken
                             ._$bind(this,_param));
            return this;
        }
        this.__set('status',1);
        var _message = {
            url:this.__urlmap.request
           ,param:_param
           ,method:this.__method
        };
        j._$request(_message.url,
                   {method:_message.method,
                    data:t._$formatParam(_message.param),
                    headers:{Authorization:t._$getAuthHeader(_message,this.__config)
                            ,'Content-Type':'application/x-www-form-urlencoded'
                            ,'signature-url':_message.url},
                    onload:this.__getRequestToken._$bind(this),
                    onerror:this.__getRequestToken._$bind(this,null)});
        return this;
    };
    /**
     * 取临时令牌回调函数
     * @protected
     * @method {__getRequestToken}
     * @param  {String} 临时令牌信息
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache.__getRequestToken = function(_text){
        var _result,
            _data = u._$query2object(_text);
        if (!!_data.oauth_token&&
            !!_data.oauth_token_secret)
            _result = {token:_data.oauth_token
                      ,secret:_data.oauth_token_secret};
        this._$dispatchEvent('onrequesttokenload',_result);
        return this;
    };
    /**
     * 默认临时令牌取回回调函数
     * @protected
     * @method {__doLoadRequestToken}
     * @param  {Object} 临时令牌信息
     * @return {Void}
     */
    __proOAuthCache.__doLoadRequestToken = function(_result){
        !_result ? this.__getAuthorizedToken(null,_result)
                 : this._$getAuthorizedToken({account:this.__passport.u
                                             ,password:this.__passport.p
                                             ,requestToken:_result.token},_result);
    };
    /**
     * 取授权的令牌
     * @method {_$getAuthorizedToken}
     * @param  {Object} 请求参数集合
     * @param  {Object} 临时令牌信息(token/secret)
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$getAuthorizedToken = function(_param,_token){
        var _status = this.__get('status');
        if (_status>1){
            this.__queue(this._$getAuthorizedToken
                             ._$bind(this,_param,_token));
            return this;
        }
        this.__set('status',2);
        var _message = {
            url:this.__urlmap.authorize
           ,param:_param
           ,method:this.__method
        };
        j._$request(_message.url,
                   {type:'json',
                    method:_message.method,
                    data:t._$formatParam(_message.param),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    onload:this.__getAuthorizedToken._$bind2(this,_token),
                    onerror:this.__getAuthorizedToken._$bind(this,null,_token)});
        return this;
    };
    /**
     * 取授权的令牌回调
     * @protected
     * @method {__getAuthorizedToken}
     * @param  {Object} 授权令牌信息
     * @return {Void}
     */
    __proOAuthCache.__getAuthorizedToken = function(_result,_token){
        if (!!_result&&
            !!_result.oauth_verifier){
            _token = _token||{};
            _token.verifier = _result.oauth_verifier;
        }
        this._$dispatchEvent('onauthorizedtokenload',_token);
    };
    /**
     * 默认授权令牌取回回调函数
     * @protected
     * @method {__doLoadAuthorizedToken}
     * @param  {Object} 令牌信息
     * @return {Void}
     */
    __proOAuthCache.__doLoadAuthorizedToken = function(_result){
        !!_result ? this._$getAccessToken(_result)
                  : this.__getAccessToken(null,_result);
    };
    /**
     * 取令牌信息
     * @method {_$getAccessToken}
     * @param  {Object} _token 授权令牌信息(token/secret/verifier)
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$getAccessToken = function(_token){
        var _status = this.__get('status');
        if (_status>2){
            this.__queue(this._$getAccessToken
                             ._$bind(this,_token));
            return this;
        }
        this.__set('status',3);
        var _message = {
            url:this.__urlmap.access
           ,method:this.__method
        };
        j._$request(_message.url,
                   {method:_message.method,
                    headers:{Authorization:t._$getAuthHeader
                            (_message,this.__config,_token)
                            ,'signature-url':_message.url},
                    onload:this.__getAccessToken._$bind2(this,_token),
                    onerror:this.__getAccessToken._$bind(this,null,_token)});
        return this;
    };
    /**
     * 取令牌信息回调
     * @protected
     * @method {__getAccessToken}
     * @param  {String} 访问令牌信息
     * @param  {Object} 授权令牌信息
     * @return {Void}
     */
    __proOAuthCache.__getAccessToken = function(_result,_token){
        var _key,
            _data = u._$query2object(_result);
        if (!!_data.oauth_token||
            !!_data.oauth_token_secret){
            _token = _token||{};
            _token.token = _data.oauth_token;
            _token.secret = _data.oauth_token_secret;
            // extend information exclude token and secret
            delete _data.oauth_token;
            delete _data.oauth_token_secret;
            NEJ.X(_token,_data);
            // save to localstorage
            _token.username = (this.__passport||o).u;
            _key = this._$saveAccessToken(_token);
        }
        this.__set('status',0);
        window.setTimeout(this.__doQueueCheck._$bind(this),20);
        this._$dispatchEvent('onaccesstokenload',_key,_token);
    };
    /**
     * 通过用户名密码取访问令牌
     * @method {_$getAccessTokenByUser}
     * @param  {Object} 验证信息
     * @config {String} username 用户名
     * @config {String} password 密码
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$getAccessTokenByUser = function(_passport){
        var _status = this.__get('status');
        if (_status>0){
            this.__queue(this._$getAccessTokenByUser
                             ._$bind(this,_passport));
            return this;
        }
        _passport = _passport||o;
        var _username = _passport.username,
            _password = _passport.password;
        var _key = t._$getIdentifier(_username,
                   this.__config.consumer_key),
            _data = t._$getTokenInStorage(_key);
        if (!!_data){
            window.setTimeout(this.__doQueueCheck._$bind(this),20);
            this._$dispatchEvent('onaccesstokenload',_key,_data.passport);
            return this;
        }
        this.__passport = {u:_username,p:_password};
        this._$getRequestToken({scope:''});
        return this;
    };
    /**
     * 通过用户名密码取访问令牌
     * @method {_$getAccexxTokenByUser}
     * @param  {Object} 验证信息
     * @config {Boolean} nocache  不做缓存验证
     * @config {String}  username 用户名
     * @config {String}  password 密码
     * @config {Number}  type       密码类型  0-MD5/1-明文
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$getAccexxTokenByUser = function(_passport){
        _passport = _passport||o;
        var _data = null,
            _username = _passport.username,
            _key = t._$getIdentifier(_username,
                   this.__config.consumer_key);
        !!_passport.nocache ? t._$setTokenInStorage(_key)
                            : _data = t._$getTokenInStorage(_key);
        if (!!_data){
            this._$dispatchEvent('onaccexxtokenload',_key,_data.passport);
            return this;
        }
        var _type = parseInt(_passport.type);
        _type = isNaN(_type)?1:_type;
        var _password = _passport.password;
        if (_type==0)
            _password = u._$md52hex(_password);
        var _message = {
            url:this.__urlmap.access
           ,method:this.__method
           ,param:{'x_auth_mode':'client_auth',
                   'x_auth_username':_username,
                   'x_auth_password':_password,
                   'x_auth_passtype':_type}
        };
        j._$request(_message.url,
                   {method:_message.method,
                    headers:{Authorization:t._$getAuthHeader(_message,this.__config)
                            ,'Content-Type':'application/x-www-form-urlencoded'
                            ,'signature-url':_message.url},
                    onload:this.__getAccexxTokenByUser._$bind(this,_key),
                    onerror:this.__getAccexxTokenByUser._$bind(this,_key,null)});
        return this;
    };
    /**
     * 取令牌信息回调函数
     * @protected
     * @method {__getAccexxTokenByUser}
     * @param  {String} 缓存键值
     * @param  {String} 令牌信息
     * @param  {Object} 错误信息
     * @return {Void}
     */
    __proOAuthCache.__getAccexxTokenByUser = function(_key,_result,_error){
        var _token,
            _data = u._$query2object(_result);
        if (!!_data.oauth_token||
            !!_data.oauth_token_secret){
            _token = {token:_data.oauth_token
                     ,secret:_data.oauth_token_secret};
            t._$setTokenInStorage(_key,this.__config,_token);
        }else{
            _key = null;
            if (!!_error
                &&_error.code===g._$CODE_ERRSERV)
                _token = _error.data;
        }
        this._$dispatchEvent('onaccexxtokenload',_key,_token);
    };
    /**
     * 取消令牌信息
     * @method {_$cancelAccexxToken}
     * @param  {String} 缓存键值
     * @return {nej.ut._$$OAuthCache}
     */
    __proOAuthCache._$cancelAccexxToken = function(_key){
        var _message = {
            url:this.__urlmap.cancel
           ,method:this.__method
        };
        j._$request(_message.url,
                   {method:_message.method,
                    headers:{'signature-url':_message.url
                            ,Authorization:t._$getAuthHeaderByKey(_key,_message)},
                    onload:this.__cancelAccexxToken._$bind(this,_key),
                    onerror:this.__cancelAccexxToken._$bind(this,_key,!1)});
        return this;
    };
    /**
     * 取消令牌信息
     * @protected
     * @method {__cancelAccexxToken}
     * @param  {String} 缓存键值
     * @return {Void}
     */
    __proOAuthCache.__cancelAccexxToken = function(_key,_result){
        var _isok = !1;
        if ((_result||'').trim()=='true'){
            _isok = !0;
            t._$setTokenInStorage(_key);
        }
        this._$dispatchEvent('onaccexxtokencancel',_isok);
    };
    /**
     * 保存验证信息
     * @method {_$saveAccessToken}
     * @param  {Object} 验证信息，内容如下
     * @config {String} token    令牌
     * @config {String} secret   密钥
     * @config {String} username 用户名
     * @return {String}          验证缓存标识
     */
    __proOAuthCache._$saveAccessToken = function(_passport){
        _passport = _passport||o;
        if (!_passport.token||
            !_passport.secret) return;
        var _key = t._$getIdentifier(
                   _passport.username,
                   this.__config.consumer_key);
        delete _passport.username;
        t._$setTokenInStorage(_key,this.__config,_passport);
        return _key;
    };
};
NEJ.define('{lib}util/oauth/oauth.js',
      ['{lib}util/ajax/xdr.js'
      ,'{lib}util/oauth/util.js'
      ,'{lib}util/cache/cache.js'],f);