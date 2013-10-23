/*
 * --------------------------------------------
 * 接口配置实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
var f = function(){
    // variable
    var _  = NEJ.P,
        _o = NEJ.O,
        _u = _('nej.u'),
        _p = _('nej.ut'),
        // url      - 请求地址，批处理请求此属性配置为组成请求的KEY列表
        // filter   - 请求之前过滤数据，主要用于格式化发送到服务器的数据
        // format   - 请求回调后格式化数据
        // onload   - 成功回调事件名称
        // onerror  - 失败回调事件名称
        _config = {};
    /**
     * 取列表配置信息
     * @param  {String} 标识
     * @return {Object} 配置信息
     */
    _p._$get = function(_key){
        return _config[_key];
    };
    /**
     * 设置列表配置信息
     * @param  {String} 标识
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _p._$set = function(_key,_conf){
        _config[_key] = _conf;
    };
    /**
     * 合并测试数据
     * @param  {Object} 测试数据
     * @return {Void}
     */
    _p._$merge = function(_data){
        _u._$forIn(_data,
            function(_item,_key){
                var _conf = _p._$get(_key)||{};
                _p._$set(_key,NEJ.X(_conf,_item));
            }
        );
    };
};
NEJ.define('{lib}util/cache/config.js',
          ['{lib}base/util.js']);