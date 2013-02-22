/**
 * ------------------------------------------
 * WebSocket实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var f = NEJ.F,
        u = NEJ.P('nej.u'),
        x = NEJ.P('MSocket'),
        t = NEJ.P('x.socket'),
        p = window,
        __proWebSocket;
    if (!!p.WebSocket) return;
    /**
     * WebSocket适配对象,Java开放接口如下
     *  MSocket.RegisterOnOpenCB('SOCKET_KEY','CALLBACK_NAME')
     *  MSocket.RegisterOnMessageCB('SOCKET_KEY','CALLBACK_NAME')
     *  MSocket.RegisterOnCloseCB('SOCKET_KEY','CALLBACK_NAME')
     *  MSocket.Connet('SOCKET_KEY','SOCKET_URL')
     *  MSocket.Send('SOCKET_KEY','SEND_DATA')
     *  MSocket.Close('SOCKET_KEY')
     * @constructor
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
        this.onclose = f;
        this.onmessage = f;
        this.__key = u._$randNumberString();
        // init socket
        t['cb_'+this.__key] = 
         {onopen:this.__onOpen._$bind(this),
          onclose:this.__onClose._$bind(this),
          onmessage:this.__onMessage._$bind(this)};
        var _package = 'window.x.socket.cb_'+this.__key;
        if (!!x.RegisterOnOpenCB) 
            x.RegisterOnOpenCB(this.__key,_package+'.onopen');
        if (!!x.RegisterOnCloseCB) 
            x.RegisterOnCloseCB(this.__key,_package+'.onclose');
        if (!!x.RegisterOnMessageCB) 
            x.RegisterOnMessageCB(this.__key,_package+'.onmessage');
        window.setTimeout(this.__open._$bind(this,_url),0);
    };
    /**
     * 发送数据
     * @param  {String} _data 发送的数据
     * @return {Boolean}      是否发送成功
     */
    __proWebSocket.send = function(_data){
        return !!x.Send&&x.Send(this.__key,_data)||!1;
    };
    /**
     * 关闭socket
     * @return {Void}
     */
    __proWebSocket.close = function(){
        if (!x.Close) return;
        x.RegisterOnCloseCB(this.__key,'');
        x.Close(this.__key);
        delete t['cb_'+this.__key];
    };
    /**
     * 建立Socket连接
     * @param  {String} _url 连接地址
     * @return {Void}
     */
    __proWebSocket.__open = function(_url){
        !x.Connet||x.Connet(this.__key,_url);
    };
    /**
     * 打开socket回调
     * @return {Void}
     */
    __proWebSocket.__onOpen = function(){
        this.onopen();
    };
    /**
     * 关闭socket回调
     * @return {Void}
     */
    __proWebSocket.__onClose = function(){
        this.onclose();
    };
    /**
     * 收到消息回调
     * @param  {String} _data 消息内容
     * @return {Void}
     */
    __proWebSocket.__onMessage = function(_data){
        this.onmessage({data:decodeURIComponent(_data)});
    };
};
NEJ.define('{lib}native/android/socket.js',
      ['{lib}native/android/phonegap.js'],f);