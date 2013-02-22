/**
 * ------------------------------------------
 * PHONEGAP适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        m = NEJ.P('nej.mb'),
        p = NEJ.P('window.PhoneGap'),
        __cache = {};
    /**
     * 执行native接口
     * @param  {String} _command 接口名称
     * @param  {Object} _options 可选配置参数
     *                           param      [Array]    - 参数信息
     *                           onerror    [Function] - 出错回调
     *                           oncallback [Function] - 正常回调
     * @return {Void}
     */
    p._$exec = function(_command,_options){
        var _arr = (_command||'').split('.');
        if (_arr.length!=2) return;
        _options = _options||o;
        var _key = u._$randNumberString();
        __cache[_key] = {onerror:_options.onerror||f,
                         oncallback:_options.oncallback||f};
        var _result = m._$exec('PluginManager.exec',_arr[0],_arr[1],
                               _key,JSON.stringify(_options.param||[]),!0);
        if (!_result) return;
        var _args = (new Function('return '+_result))()||o;
        _args.status>1 ? p.callbackError(_key,_args)
                       : p.callbackSuccess(_key,_args);
    };
    /**
     * native接口成功回调
     * @param  {String} _cid  接口标识
     * @param  {String} _args 回调参数
     * @return {Void}
     */
    p.callbackSuccess = function(_cid,_args){
        var _cache = __cache[_cid];
        if (!_cache) return;
        _args = _args||o;
        // fix android multiple callback
        if (_args.status==null) return;
        if (_args.status==1)
            try{_cache.oncallback(_args.message);}catch(ex){alert(ex.message||ex);}
        if (!_args.keepCallback) delete __cache[_cid];
    };
    /**
     * native接口失败回调
     * @param  {String} _cid  接口标识
     * @param  {String} _args 回调参数
     * @return {Void}
     */
    p.callbackError = function(_cid,_args){
        var _cache = __cache[_cid];
        if (!_cache) return;
        try{_cache.onerror((_args||o).message);}catch(ex){}
        if (!_args.keepCallback) delete __cache[_cid];
    };
};
NEJ.define('{lib}native/android/phonegap.js',
      ['{lib}base/util.js','{lib}native/command.js'],f);