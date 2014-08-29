/*
 * ------------------------------------------
 * 跨文档消息交互API实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    /**
     * 格式化源信息
     * @param  {String} 源
     * @return {String} 格式化后源
     */
    _p.__formatOrigin = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_origin){
            _origin = _origin||'';
            if (_reg.test(_origin)){
                return RegExp.$1;
            }
            return '*';
        };
    })();
    /**
     * 解析消息传递数据
     * @param  {Variable} 数据
     * @return {Variable} 数据
     */
    _p.__formatPassData = function(_data){
        return _data;
    };
    /**
     * 跨文档发送数据
     * @param  {Window} 窗体对象
     * @param  {Object} 发送配置
     * @return {Void}
     */
    _p.__postMessage = function(_window,_options){
        if (!_window.postMessage){
            return;
        }
        _options = _options||_o;
        _window.postMessage(
            _p.__formatPassData(_options.data),
            _p.__formatOrigin(_options.origin)
        );
    };
    
    return _p;
});