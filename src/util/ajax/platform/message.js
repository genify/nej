/**
 * ------------------------------------------
 * 跨文档消息交互API实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _h = _('nej.h');
    /**
     * 格式化源信息
     * @param  {String} 源
     * @return {String} 格式化后源
     */
    _h.__formatOrigin = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_origin){
            _origin = _origin||'';
            if (_reg.test(_origin))
                return RegExp.$1;
            return '*';
        };
    })();
    /**
     * 解析消息传递数据
     * @param  {Variable} 数据
     * @return {Variable} 数据
     */
    _h.__formatPassData = function(_data){
        return _data;
    };
    /**
     * 跨文档发送数据
     * @param  {Window} 窗体对象
     * @param  {Object} 发送配置
     * @return {Void}
     */
    _h.__postMessage = function(_window,_options){
        if (!_window.postMessage) 
            return;
        _options = _options||_o;
        _window.postMessage(
            _h.__formatPassData(_options.data),
            _h.__formatOrigin(_options.origin)
        );
    };
};
NEJ.define('{lib}util/ajax/platform/message.js',['{lib}base/platform.js'],f);