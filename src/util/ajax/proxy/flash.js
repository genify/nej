/*
 * ------------------------------------------
 * Ajax FLASH方式代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut.j'),
        _w = _('nej.ut.j.cb'),
        _cache = {},
        _seed = +new Date,
        _proFlashProxy;
    if (!!_p._$$FlashProxy) return;
    /*
     * 代理请求正常回调
     * @param {Object} _key
     * @param {Object} _text
     */
    _w['ld'+_seed] = function(_key,_text){
        var _proxy = _cache[_key];
        if (!_proxy) return;
        delete _cache[_key];
        _proxy.__onLoadRequest({
            status:200,
            result:_text
        });
    };
    /*
     * 代理请求异常回调
     * @param {Object} _key
     */
    _w['er'+_seed] = function(_key,_status){
        var _proxy = _cache[_key];
        if (!_proxy) return;
        delete _cache[_key];
        _proxy.__onLoadRequest({
            status:_status||0
        });
    };
    /**
     * Flash代理方式Ajax请求对象
     * @class   {nej.ut.j._$$FlashProxy}
     * @extends {nej.ut.j._$$Proxy}
     */
    _p._$$FlashProxy = NEJ.C();
      _proFlashProxy = _p._$$FlashProxy._$extend(_p._$$Proxy);
    /**
     * 往服务器发送请求
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proFlashProxy.__doSendRequest = function(_options){
        var _flash = _cache.flash;
        // callback list
        if (_u._$isArray(_flash)){
            _flash.push(this.__doSendRequest
                            ._$bind(this,_options));
            return;
        }
        // build flash proxy
        if (!_flash){
            _cache.flash = [this.__doSendRequest
                                ._$bind(this,_options)];
            _e._$flash({
                hidden:!0,
                src:_c._$get('ajax.swf'),
                onready:function(_flash){
                    if (!_flash) return;
                    var _list = _cache.flash;
                    _cache.flash = _flash;
                    _u._$reverseEach(_list,
                        function(_handler){
                            try{_handler();}catch(e){}
                        });
                }
            });
            return;
        }
        // send request by flash
        this.__rkey = 'swf-'+_u._$randNumberString();
        _cache[this.__rkey] = this;
        var _data = NEJ.EX({
                url:'',
                data:null,
                method:'GET'
            },_options.request);
        _data.key = this.__rkey;
        _data.headers  = _options.headers;
        _data.onerror  = 'nej.ut.j.cb.er'+_seed;
        _data.onloaded = 'nej.ut.j.cb.ld'+_seed;
        var _policy = _c._$getFlashProxy(_data.url);
        if (!!_policy) _data.policyURL = _policy;
        _flash.request(_data);
    };
    /**
     * 中断请求
     * @method {_$abort}
     * @return {nej.ut.j._$$FlashProxy}
     */
    _proFlashProxy._$abort = function(){
        delete _cache[this.__rkey];
        this.__onLoadRequest({status:0});
        return this;
    };
};
NEJ.define('{lib}util/ajax/proxy/flash.js',
      ['{lib}util/flash/flash.js'
      ,'{lib}util/ajax/proxy/proxy.js'],f);
