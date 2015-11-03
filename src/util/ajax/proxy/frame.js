/*
 * ------------------------------------------
 * Ajax FRAME方式代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/proxy/frame */
NEJ.define([
    './proxy.js',
    'base/util',
    'base/klass',
    'base/event',
    'base/config',
    'base/element',
    'util/ajax/message'
],function(_t,_u,_k,_v,_c,_e,_j,_p,_o,_f,_r){
    var _pro,
        _cache = {};
    /**
     * Frame代理方式Ajax请求对象
     * 
     * @class   module:util/ajax/proxy/frame._$$ProxyFrame
     * @extends module:util/ajax/proxy/proxy._$$ProxyAbstract
     * 
     * @param   {Object}  config - 构造配置参数
     */
    _p._$$ProxyFrame = _k._$klass();
    _pro = _p._$$ProxyFrame._$extend(_t._$$ProxyAbstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/ajax/proxy/frame._$$ProxyFrame#__init
     * @return {Void}
     */
    _pro.__init = (function(){
        var _flag = 'NEJ-AJAX-DATA:',
            _init = !1;
        // receive message
        var _doReceiveMessage = function(_event){
            var _data = _event.data;
            if (_data.indexOf(_flag)!=0) return;
            _data = JSON.parse(_data.replace(_flag,''));
            var _proxy = _cache[_data.key];
            if (!_proxy) return;
            delete _cache[_data.key];
            _data.result = decodeURIComponent(_data.result||'');
            _proxy.__onLoadRequest(_data);
        };
        // init message listener
        var _doInitMessage = function(){
            if (!_init){
                _init = !0;
                _v._$addEvent(
                    window,'message',
                    _doReceiveMessage
                );
            }
        };
        return function(){
            this.__super();
            _doInitMessage();
        };
    })();
    /**
     * 往服务器发送请求
     *
     * @protected
     * @method module:util/ajax/proxy/frame._$$ProxyFrame#__doSendRequest
     * @param  {Object} arg0 - 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = function(_options){
        var _request = _options.request,
            _proxy = _c._$getFrameProxy(_request.url),
            _frame = _cache[_proxy];
        // callback list
        if (_u._$isArray(_frame)){
            _frame.push(
                this.__doSendRequest.
                    _$bind(this,_options)
            );
            return;
        }
        // build frame proxy
        if (!_frame){
            _cache[_proxy] = [
                this.__doSendRequest.
                    _$bind(this,_options)
            ];
            _e._$createXFrame({
                src:_proxy,visible:!1,
                onload:function(_event){
                    var _list = _cache[_proxy];
                    _cache[_proxy] = _v.
                        _$getElement(_event).contentWindow;
                    _u._$reverseEach(
                        _list,function(_handler){
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
        // send message to frame
        this.__rkey = _u._$uniqueID();
        _cache[this.__rkey] = this;
        var _data = _u._$fetch({
            url:'',data:null,
            timeout:0,method:'GET'
        },_request);
        _data.key = this.__rkey;
        _data.headers = _options.headers;
        _j._$postMessage(_cache[_proxy],{data:_data});
    };
    /**
     * 中断请求
     * 
     * @method module:util/ajax/proxy/frame._$$ProxyFrame#_$abort
     * @return {Void}
     */
    _pro._$abort = function(){
        delete _cache[this.__rkey];
        this.__onAbort();
    };
    
    return _p;
});
