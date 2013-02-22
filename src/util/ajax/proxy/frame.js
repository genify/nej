/*
 * ------------------------------------------
 * Ajax FRAME方式代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('nej.ut.j'),
        _cache = {},
        _proFrameProxy;
    if (!!_p._$$FrameProxy) return;
    /**
     * Frame代理方式Ajax请求对象
     * 
     * @class   {nej.ut.j._$$FrameProxy}
     * @extends {nej.ut.j._$$Proxy}
     * 
     * 
     */
    _p._$$FrameProxy = NEJ.C();
      _proFrameProxy = _p._$$FrameProxy._$extend(_p._$$Proxy);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proFrameProxy.__init = (function(){
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
                _v._$addEvent(window,'message',_doReceiveMessage);
            }
        };
        return function(){
            this.__supInit();
            _doInitMessage();
        };
    })();
    /**
     * 往服务器发送请求
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proFrameProxy.__doSendRequest = function(_options){
        var _request = _options.request,
            _proxy = _c._$getFrameProxy(_request.url),
            _frame = _cache[_proxy];
        // callback list
        if (_u._$isArray(_frame)){
            _frame.push(this.__doSendRequest
                            ._$bind(this,_options));
            return;
        }
        // build frame proxy
        if (!_frame){
            _cache[_proxy] = [this.__doSendRequest
                                  ._$bind(this,_options)];
            _e._$createXFrame({
                src:_proxy,visible:!1,
                onload:function(_event){
                    var _list = _cache[_proxy];
                    _cache[_proxy] = _v._$getElement(
                                     _event).contentWindow;
                    _u._$reverseEach(_list,
                        function(_handler){
                            try{_handler();}catch(e){}
                        });
                }
            });
            return;
        }
        // send message to frame
        this.__rkey = 'frm-'+_u._$randNumberString();
        _cache[this.__rkey] = this;
        var _data = NEJ.EX({
                url:'',data:null,
                timeout:0,method:'GET'
            },_request);
        _data.key = this.__rkey;
        _data.headers = _options.headers;
        _j._$postMessage(_cache[_proxy],{data:_data});
    };
    /**
     * 中断请求
     * @method {_$abort}
     * @return {nej.ut.j._$$FrameProxy}
     */
    _proFrameProxy._$abort = function(){
        delete _cache[this.__rkey];
        this.__onLoadRequest({status:0});
        return this;
    };
};
NEJ.define('{lib}util/ajax/proxy/frame.js',
      ['{lib}util/ajax/message.js'
      ,'{lib}util/ajax/proxy/proxy.js'],f);