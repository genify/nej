/*
 * ------------------------------------------
 * 长连接实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        j = NEJ.P('nej.j'),
        __cache = {}; // 请求缓存，结构
                      // url : {req:eventsource/socket,
                      //        cb:[{onopen:function(){},
                      //             onerror:function(){},
                      //             onmessage:function(){}} ...]}
    /*
     * 回调
     * @param  {String} _url   地址
     * @param  {String} _type  回调类型
     * @param  {Event}  _event 事件对象
     * @return {Void}
     */
    var __callback = function(_url,_type,_event){
        var _tmp = __cache[_url];
        if (!_tmp) return;
        _tmp = _tmp.cb;
        if (!!_tmp&&_tmp.length>0)
            for(var i=0,l=_tmp.length;i<l;i++)
                try{(_tmp[i][_type])(_event);}catch(ex){}
    };
    /**
     * 建立长连接
     * @api    {nej.j._$connect}
     * @param  {String} 地址
     * @param  {Object} 可选配置参数，已处理参数列表如下：
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onopen} 连接打开回调函数
     * 
     * [hr]
     * 
     * @event  {onclose} 连接关闭回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 连接失败回调函数
     * 
     * [hr]
     * 
     * @event  {onmessage} 收到消息回调函数
     * 
     */
    j._$connect = function(_url,_options){
        if (!_url) return;
        _options = _options||o;
        var _callback = {onopen:_options.onopen||f,
                         onclose:_options.onclose||f,
                         onerror:_options.onerror||f,
                         onmessage:_options.onmessage||f};
        var _cache = __cache[_url];
        if (!!_cache){
            _cache.cb.unshift(_callback);
            return this;
        }
        var _req = new (window[_url.search(/wss?:\/\//i)==0
                       ? 'WebSocket' : 'EventSource'])(_url);
        __cache[_url] = {req:_req,cb:[_callback]};
        _req.onopen = __callback._$bind(null,_url,'onopen');
        _req.onclose = __callback._$bind(null,_url,'onclose');
        _req.onerror = __callback._$bind(null,_url,'onerror');
        _req.onmessage = __callback._$bind(null,_url,'onmessage');
        return this;
    };
    /**
     * 关闭长连接
     * @api    {nej.j._$closeConnection}
     * @param  {String} 地址
     * @return {nej.j}
     */
    j._$closeConnection = function(_url){
        var _cache = __cache[_url];
        if (!_cache) return this;
        var _tmp = _cache.req;
        _tmp.onopen = null;
        _tmp.onerror = null;
        _tmp.onmessage = null;
        _tmp.close();
        __callback(_url,'onclose');
        delete _cache.cb;
        delete _cache.req;
        delete __cache[_url];
        return this;
    };
    /**
     * 通过长连接发送数据
     * @api    {nej.j._$sendDataByCNT}
     * @param  {String} 地址
     * @param  {String} 数据
     * @return {nej.j}
     */
    j._$sendDataByCNT = function(_url,_data){
        var _cache = __cache[_url];
        try{_cache.req.send(_data);}catch(ex){}
        return this;
    };
};
NEJ.define('{lib}util/ajax/connect.js',
      ['{lib}base/global.js'],f);