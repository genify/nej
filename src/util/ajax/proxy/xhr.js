/*
 * ------------------------------------------
 * XHR方式Ajax代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './proxy.js',
    '{lib}base/util.js',
    '{lib}base/klass.js',
    '{platform}xhr.js'
],function(_t,_u,_k,_h,_p,_o,_f,_r){
    /**
     * Ajax代理对象
     * 
     * @class   {_$$XHRProxy}
     * @extends {_$$Proxy}
     * 
     * @param   {Object}  构造配置参数
     */
    _p._$$XHRProxy = _k._$klass();
    _pro = _p._$$XHRProxy._$extend(_t._$$Proxy);
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        // clear timeout
        window.clearTimeout(this.__timer);
        delete this.__timer;
        // clear request
        try{
            this.__xhr.onreadystatechange = _f;
            this.__xhr.abort();
        }catch(e){
            // ignore
        }
        delete this.__xhr;
    };
    /**
     * 往服务器发送请求
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = (function(){
        // set header
        var _doSetHeader = function(_value,_key){
            this.__xhr.setRequestHeader(_key,_value);
        };
        // split input.file for multiple files
        var _doSplitMultFiles = function(_form){
            var _result = [];
            _u._$reverseEach(
                _form.getElementsByTagName('input'),
                function(_input){
                    if (_input.type!='file'){
                        return;
                    }
                    _u._$forEach(_input.files,function(_file){
                        _result.push(_file);
                    });
                    _input.parentNode.removeChild(_input);
                }
            );
            return _result.length>0?_result:null;
        };
        return function(_options){
            var _request = _options.request,
                _headers = _options.headers;
            this.__xhr = _h.__getXMLHttpRequest();
            // add event listener
            // upload progress
            if (_headers[_g._$HEAD_CT]===_g._$HEAD_CT_FILE){
                delete _headers[_g._$HEAD_CT];
                this.__xhr.upload.onprogress = 
                    this.__onStateChange._$bind(this,1);
                if (_request.data.tagName==='FORM'){
                    var _files = _doSplitMultFiles(_request.data);
                    _request.data = new FormData(_request.data);
                    _u._$forEach(_files,function(_file){
                        _request.data.append(_file.name||'',_file);
                    });
                }
            }
            // state change
            this.__xhr.onreadystatechange = 
                this.__onStateChange._$bind(this,2);
            // timeout
            if (_request.timeout!==0){
                this.__timer = window.setTimeout(
                    this.__onStateChange._$bind(this,3),
                    _request.timeout
                );
            }
            // prepare and send request
            this.__xhr.open(
                _request.method,
                _request.url,
               !_request.sync
            );
            _u._$forIn(_headers,_doSetHeader,this);
            // support credential
            if (!!this.__request.cookie&&
               ('withCredentials' in this.__xhr)){
                this.__xhr.withCredentials = !0;
            }
            this.__xhr.send(_request.data);
        };
    })();
    /**
     * 请求状态变化事件
     * @protected
     * @method {__onStateChange}
     * @param  {Number} 状态变化类型
     * @return {Void}
     */
    _pro.__onStateChange = function(_type){
        switch(_type){
            // upload progress
            case 1 :
                this._$dispatchEvent('onuploading',arguments[1]);
            break;
            // state change
            case 2 :
                if (this.__xhr.readyState==4){
                    this.__onLoadRequest({
                        status:this.__xhr.status,
                        result:this.__xhr.responseText||''
                    });
                }
            break;
            // timeout
            case 3:
                this.__onLoadRequest({status:-1});
            break;
        }
    };
    /**
     * 取头信息
     * @protected
     * @method {__getResponseHeader}
     * @param  {String} 要取的头信息名称
     * @return {String} 头信息结果或集合
     */
    _pro.__getResponseHeader = function(_key){
        return !this.__xhr?'':this.__xhr.getResponseHeader(_key);
    };
    /**
     * 中断请求
     * @method {_$abort}
     * @return {Void}
     */
    _pro._$abort = function(){
        this.__onLoadRequest({status:0});
    };
    
    return _p;
});
