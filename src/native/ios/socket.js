/**
 * ------------------------------------------
 * WebSocket实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var b = NEJ.P('nej.p'),
        p = window;
    // crash on ios when has proxy setting
    if (b._$IS.desktop&&!!p.WebSocket) return;
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        c = NEJ.P('navigator.n2j'),
        __cache = {}, // key:websocket instance
        __proWebSocket;
    /**
     * 清理链接
     * @param  {String} _key 链接标识
     * @return {Void}
     */
    var __clear = function(_key){
        delete c[_key];
        delete __cache[_key];
    };
    /**
     * 执行回调
     * @param  {String} _key 回调标识
     * @return {Void}
     
    */
    var __callback = function(_key,_result){
        _result = _result||o;
        var _socket = __cache[_key];
        if (!_socket) return;
        switch(_result.action){
            case 'opened':
                _socket.onopen();
            return;
            case 'closed':
                _socket.onclose();
            break;
            case 'data':
                _socket.onmessage({data:_result.data});
            return;
            case 'failed':
                _socket.onerror({code:-90010,message:_result.reason||''});
            break;
        }
        __clear(_key);
    };
    /**
     * WebSocket适配对象,支持事件
     *  onopen     -  连接打开回调
     *  onerror    -  连接失败回调
     *  onclose    -  连接关闭回调
     *  onmessage  -  收到消息回调
     * @class WebSocket适配对象
     */
    p.WebSocket = NEJ.C();
    __proWebSocket = p.WebSocket.prototype;
    /**
     * 对象初始化
     * @param  {String} _url socket地址
     * @return {Void}
     */
    __proWebSocket.__init = function(_url){
        this.onopen = f;
        this.onerror = f;
        this.onclose = f;
        this.onmessage = f;
        this.__key = 'sk_'+u._$randNumberString();
        __cache[this.__key] = this;
        this.__ncb = 'navigator.n2j.'+this.__key;
        c[this.__key] = __callback._$bind(null,this.__key);
        // init socket
        window.setTimeout(this.__open._$bind(this,_url),10);
    };
    /**
     * 发送数据
     * @param  {String} _data 发送的数据
     * @return {Boolean}      是否发送成功
     */
    __proWebSocket.send = function(_data){
        PhoneGap._$exec('WebSocketMgr.send',
                       {param:[this.__ncb,_data]});
    };
    /**
     * 关闭socket
     * @return {Void}
     */
    __proWebSocket.close = function(){
        PhoneGap._$exec('WebSocketMgr.close',
                       {param:[this.__ncb]});
    };
    /**
     * 建立Socket连接
     * @param  {String} _url 连接地址
     * @return {Void}
     */
    __proWebSocket.__open = function(_url){
        PhoneGap._$exec('WebSocketMgr.connect',
                       {param:[this.__ncb,_url]});
    };
};
define('{lib}native/ios/socket.js',
      ['{lib}base/platform.js','{lib}native/ios/phonegap.js'],f);
