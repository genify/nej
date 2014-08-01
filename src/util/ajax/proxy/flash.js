/*
 * ------------------------------------------
 * Ajax FLASH方式代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './proxy.js',
    '{lib}base/klass.js',
    '{lib}base/config.js',
    '{lib}base/util.js',
    '{lib}util/flash/flash.js'
],function(_t,_k,_c,_u,_e,_p,_o,_f,_r){
    var _pro,
        _cache = {},
        _seed = _u._$uniqueID();
    /*
     * 代理请求正常回调
     * @param  {String} 请求标识
     * @param  {String} 返回数据
     * @return {Void}
     */
    this['ld'+_seed] = function(_key,_text){
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
     * @param  {String} 请求标识
     * @param  {Number} 请求状态
     * @return {Void} 
     */
    this['er'+_seed] = function(_key,_status){
        var _proxy = _cache[_key];
        if (!_proxy) return;
        delete _cache[_key];
        _proxy.__onLoadRequest({
            status:_status||0
        });
    };
    /**
     * Flash代理方式Ajax请求对象
     * 
     * @class   {_$$FlashProxy}
     * @extends {_$$Proxy}
     * 
     * @param   {Object}  构造配置参数
     */
    _p._$$FlashProxy = _k._$klass();
    _pro = _p._$$FlashProxy._$extend(_t._$$Proxy);
    /**
     * 往服务器发送请求
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = function(_options){
        var _flash = _cache.flash;
        // callback list
        if (_u._$isArray(_flash)){
            _flash.push(
                this.__doSendRequest.
                    _$bind(this,_options)
            );
            return;
        }
        // build flash proxy
        if (!_flash){
            _cache.flash = [
                this.__doSendRequest.
                    _$bind(this,_options)
            ];
            _e._$flash({
                hidden:!0,
                src:_c._$get('ajax.swf'),
                onready:function(_flash){
                    if (!_flash) return;
                    var _list = _cache.flash;
                    _cache.flash = _flash;
                    _u._$reverseEach(
                        _list,function(_handler,_index,_list){
                            try{
                                _handler();
                            }catch(ex){
                                // ignore
                            }
                        }
                    );
                }
            });
            return;
        }
        // send request by flash
        this.__rkey = _u._$uniqueID();
        _cache[this.__rkey] = this;
        var _data = _u._$fetch({
            url:'',
            data:null,
            method:'GET'
        },_options.request);
        _data.key = this.__rkey;
        _data.headers  = _options.headers;
        _data.onerror  = 'cb.er'+_seed;
        _data.onloaded = 'cb.ld'+_seed;
        var _policy = _c._$getFlashProxy(_data.url);
        if (!!_policy){
            _data.policyURL = _policy;
        }
        _flash.request(_data);
    };
    /**
     * 中断请求
     * @method {_$abort}
     * @return {Void}
     */
    _pro._$abort = function(){
        delete _cache[this.__rkey];
        this.__onLoadRequest({status:0});
    };
});
