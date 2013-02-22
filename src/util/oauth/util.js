/*
 * ------------------------------------------
 * OAuth验证辅助工具类实现文件
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
        p = NEJ.P('nej.ut.oa'),
        __skey = 'netease-oauth-storage',
        __storage = j._$getDataInStorageWithDefault(__skey,{});
    /*
     * 持久化缓存数据
     * @return {Void}
     */
    var __flush = function(){
        j._$setDataInStorage(__skey,__storage);
    };
    /*
     * 取时间戳
     * @return {Number} 时间戳
     */
    var __timestamp = function(){
        return Math.floor(new Date().getTime()/1000);
    };
    /*
     * 编码字符串
     * @param  {String} _content 待转换字符串
     * @return {String}          转换后字符串
     */
    var __encode = (function(){
        var _map = {r:/\!|\*|\'|\(|\)/g,'!':'%21','*':'%2A',"'":'%27','(':'%28',')':'%29'};
        return function(_content){
            return u._$encode(_map,encodeURIComponent(''+_content));
        };
    })();
    /*
     * 反编码字符串
     * @param  {String} _content 待转换字符串
     * @return {String}          转换后字符串
     */
    var __decode = (function(){
        var _reg = /\+/g;
        return function(_content){
            return decodeURIComponent((''+_content).replace(_reg,' '));
        };
    })();
    /*
     * 解析URI信息
     * @param  {String} _uri URI串
     * @return {Object}      URI信息
     */
    var __parseURI = (function(){
        var _key = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
            _reg = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
        return function(_uri){
            var _obj = {},
                _arr = _reg.exec(_uri);
            for(var i=_key.length-1;i>=0;i--)
                _obj[_key[i]] = _arr[i]||'';
            return _obj;
        };
    })();
    /*
     * 格式化URL信息
     * @param  {String} _url 待格式化URL信息
     * @return {String}      格式化后URL信息
     */
    var __formatURL = function(_url){
        var _info = __parseURI(_url),
            _scheme = _info.protocol.toLowerCase(),
            _authority = _info.authority.toLowerCase(),
            _ignoreport = (_scheme=='http'&&_info.port==80)||
                          (_scheme=='https'&&_info.port==443);
        if (_ignoreport){
            var _index = _authority.lastIndexOf(':');
            if (_index>0) _authority = _authority.substring(0,_index);
        }
        return _scheme+'://'+_authority+(_info.path||'/');
    };
    /*
     * 格式化参数
     * @param  {Object} _param 参数列表
     * @return {String}        参数串
     */
    var __formatParam = (function(){
        // replace _o_ to oauth_ prefix
        var _reg = /^_o_/i;
        return function(_param){
            _param = _param||o;
            var _arr = [];
            for(var x in _param)
                _arr.push(__encode(
                         x.replace(_reg,'oauth_'))
                         +'='+__encode(_param[x]));
            _arr.sort();
            return _arr.join('&');
        };
    })();
    /*
     * 取加密私钥
     * @param  {Object} _message 消息参数
     * @return {String}          加密私钥
     */
    var __getBaseKey = function(_message){
        var _query,
            _url = _message.url||'',
            _index = _url.indexOf('?');
        if (_index>=0)
            _query = u._$query2object(_url.substring(_index+1));
        return __encode(_message.method.toUpperCase())+'&'+
               __encode(__formatURL(_message.url))+'&'+(
               !_query?'':__encode(__formatParam(_query)+'&'))+
               __encode(__formatParam(_message.param));
    };
    /*
     * 取数字签名
     * @param  {Object} _message  消息内容
     * @param  {Object} _config   配置信息
     * @param  {Object} _passport 验证信息
     * @return {String}           数字签名
     */
    var __getSignature = (function(){
        var _signature = {
             'PLAINTEXT':function(_key,_content){return _key;}
            ,'HMAC-SHA1':function(_key,_content){return u._$hmacsha12b64(_key,_content);}
        };
        for(var x in _signature)
            if (x.indexOf('-Accessor')<0)
                _signature[x+'-Accessor'] = _signature[x];
        return function(_message,_config,_passport){
            return (_signature[_config.signature]||f)
                              (__encode(_config.consumer_secret)+'&'+
                              (_passport.secret||''),__getBaseKey(_message));
        };
    })();
    /**
     * 格式化参数列表
     * @api    {nej.ut.oa._$formatParam}
     * @param  {Object} 参数列表
     * @return {String} 参数串
     */
    p._$formatParam = function(_param){
        return __formatParam(_param);
    };
    /**
     * 计算用户名密码的标识信息
     * @api    {nej.ut.oa._$getIdentifier}
     * @param  {String} 用户名
     * @param  {String} 密码
     * @return {String} 标识信息
     */
    p._$getIdentifier = function(_username,_password){
        return u._$sha12b64(_username+':'+_password);
    };
    /**
     * 根据缓存键值取本地验证信息
     * @api    {nej.ut.oa._$getTokenInStorage}
     * @param  {String} 缓存键值
     * @return {Object} 验证信息
     */
    p._$getTokenInStorage = function(_key){
        return __storage[_key];
    };
    /**
     * 缓存验证信息
     * @api    {nej.ut.oa._$setTokenInStorage}
     * @param  {String} 缓存键值
     * @param  {Object} 配置信息
     * @config {String} realm              应用范围标识串
     * @config {String} signature         签名方式
     * @config {String} consumer_key     使用者标识
     * @config {String} consumer_secret 标识对应密钥
     * @param  {Object} 令牌信息
     * @config {String} token              令牌
     * @config {String} secret            密钥
     * @return {nej.ut.oa}
     */
    p._$setTokenInStorage = function(_key,_config,_token){
        if (!_config&&!_token){
            delete __storage[_key];
        }else{
            var _data = {config:_config
                        ,passport:{token:_token.token
                                  ,secret:_token.secret}};
            __storage[_key] = _data;
        }
        __flush();
        return this;
    };
    /**
     * 构造验证头信息
     * @api    {nej.ut.oa._$getAuthHeader}
     * @param  {Object} 消息内容，已处理的参数列表如下：
     * @config {String} url 请求地址
     * @config {String} param 参数列表
     * @config {String} method 请求方式
     * @param  {Object} 配置信息，已处理的参数列表如下：
     * @config {String} realm              应用范围标识串
     * @config {String} signature          签名方式
     * @config {String} consumer_key     使用者标识
     * @config {String} consumer_secret 标识对应密钥
     * @param  {Object} 验证信息，已处理的参数列表如下：
     * @config {String} token      令牌
     * @config {String} secret   密钥
     * @config {String} verifier 校验码
     * @return {String}           
     */
    p._$getAuthHeader = function(_message,_config,_passport){
        // format data
        var _message  = _message||{},
            _param    = _message.param||{},
            _passport = _passport||o,
            _config   = _config||o;
        _message.param= _param;
        // build data
        _param.oauth_version = '1.0';
        _param.oauth_nonce = u._$randString(6);
        _param.oauth_timestamp = __timestamp();
        _param.oauth_consumer_key = _config.consumer_key;
        _param.oauth_signature_method = _config.signature;
        if (!!_passport.token) 
            _param.oauth_token = _passport.token;
        if (!!_passport.verifier) 
            _param.oauth_verifier = _passport.verifier;
        _param.oauth_signature = __getSignature(_message,_config,_passport);
        var _arr = [];
        for(var x in _param)
            if (x.indexOf('oauth_')>=0||x.indexOf('x_auth')>=0)
                _arr.push(__encode(x)+'="'+__encode(_param[x])+'"');
        return 'OAuth realm="'+__encode(_config.realm||'')+'",'+_arr.join(',');
    };
    /**
     * 根据缓存键值生成验证头信息
     * @api    {nej.ut.oa._$getAuthHeaderByKey}
     * @param  {String} 缓存键值
     * @param  {Object} 待签名消息
     * @return {String} 验证头信息
     */
    p._$getAuthHeaderByKey = function(_key,_message){
        var _data = p._$getTokenInStorage(_key);
        return !_data?'':p._$getAuthHeader(_message,
                         _data.config,_data.passport);
    };
    /**
     * 过滤待验证请求
     * @api    {nej.ut.oa._$filterAuthRequest}
     * @param  {String} 验证缓存键值
     * @param  {Object} 请求相关信息
     * @config {String} headers 请求头信息
     * @config {String} request 请求信息，{url:'http://a.b.com/api',method:'GET',data:'a=aa&b=bb'}
     * @return {nej.ut.oa}
     */
    p._$filterAuthRequest = function(_key,_event){
        if (!_key) return this;
        var _data = _event.request.data,
            _headers = _event.headers||o,
            _message = {url:'',method:''};
        NEJ.EX(_message,_event.request);
        if (!!_data&&_headers
           [g._$HEAD_CT]===g._$HEAD_CT_FORM)
            _message.param = u._$query2object(_data);
        _headers['signature-url'] = _message.url;
        _headers.Authorization = p._$getAuthHeaderByKey(_key,_message);
        return this;
    };
};
NEJ.define('{lib}util/oauth/util.js',
      ['{lib}base/constant.js'
      ,'{lib}base/util.js'
      ,'{lib}util/cache/storage.js'
      ,'{lib}util/encode/sha.md5.js'],f);