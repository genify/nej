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
        r = NEJ.R,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        p = NEJ.P('window.PhoneGap');
    // native will set queue.ready = !0
    // native will callback function in PhoneGap.queue.callback.xxx
    p.queue = {ready:!0,callback:{}};
    // private data
    var __ihack = e._$create('iframe'),
        __queue = [],   // command key queue
        __cache = {},   // key:{cmd:'',param:[],query:{},
                        //      oncallback:function,onerror:function}
        __timer = null;
    // hack innerHTML
    __ihack.style.display = 'none';
    if (!!document.body) document.body.appendChild(__ihack);
    /**
     * 检查执行命令队列
     * @return {Void}
     */
    var __checkCmdQueue = function(){
        if (!p.queue.ready) return;
        if (__queue.length<1){
            __timer = window.clearInterval(__timer);
            return;
        }
        __doCommand(__queue.shift());
    };
    /**
     * 执行命令
     * @param  {String} 命令标识
     * @return {Void}
     */
    var __doCommand = function(_key){
        var _data = __cache[_key];
        if (!_data) return;
        p.queue.ready = !1;
        var _uri = ['gap:/',_data.cmd];
        u._$forEach(_data.param,function(_name){
            _uri.push(encodeURIComponent(_name));
        });
        if (!!_data.oncallback)
            _uri.push('PhoneGap.queue.callback.'+_key+'_succ');
        if (!!_data.onerror)
            _uri.push('PhoneGap.queue.callback.'+_key+'_fail');
        _uri = _uri.join('/');
        if (!!_data.query)
            _uri += '?'+encodeURIComponent(JSON.stringify(_data.query||o));
        //document.location = _uri;
        __ihack.src = _uri;
    };
    /**
     * native执行命令回调
     * @param  {String} _key 执行命令标识
     * @return {Void}
     */
    var __doCallback = function(_key,_type){
        var _data = __cache[_key];
        if (!_data) return;
        var _callback = _data[_type];
        if (!_callback) return;
        var _queue = PhoneGap.queue.callback;
        delete _queue[_key+'_succ'];
        delete _queue[_key+'_fail'];
        delete __cache[_key];
        try{_callback.apply(null,r.slice.call(arguments,2));}catch(ex){}
    };
    /**
     * 执行native接口
     * @param  {String} _command 接口名称
     * @param  {Object} _options 可选配置参数
     *                           param      [Array]    - 参数信息
     *                           query      [Object]   - 查询参数
     *                           onerror    [Function] - 出错回调
     *                           oncallback [Function] - 正常回调
     * @return {Void}
     */
    p._$exec = function(_command,_options){
        var _dat = _options||{},
            _key = 'nk_'+u._$randNumberString(4);
        _dat.cmd = _command;
        __cache[_key] = _dat;
        __queue.push(_key);
        var _cb = p.queue.callback;
        _cb[_key+'_fail'] = __doCallback._$bind(null,_key,'onerror');
        _cb[_key+'_succ'] = __doCallback._$bind(null,_key,'oncallback');
        if (!__timer)
            __timer = window.setInterval(__checkCmdQueue,10);
    };
};
define('{lib}native/ios/phonegap.js',
      ['{lib}base/element.js','{lib}native/command.js'],f);