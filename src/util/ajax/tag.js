/*
 * ------------------------------------------
 * 脚本载入控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/ajax/tag */
NEJ.define([
    'base/global',
    'base/element',
    'base/util',
    './loader/text.js',
    './loader/html.js',
    './loader/style.js',
    './loader/script.js'
],function(NEJ,e,u,_t0,_t1,_t2,_t3,_p,_o,_f,_r){
    /**
     * 载入完成回调函数
     *
     * @callback module:util/ajax/tag.onload
     * @param    {Variable} event - 请求返回数据
     */
    /**
     * 载入出错回调函数
     *
     * @callback module:util/ajax/tag.onerror
     * @param    {Object} event   - 错误信息
     * @property {Number} code    - 错误码
     * @property {String} message - 错误信息
     */
    /**
     * 载入脚本文件
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$loadScript('../../../javascript/log.js',{
     *         onload:function(){
     *             // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *             // 抛出异常回调
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$loadScript
     * @see      module:util/ajax/tag._$queueScript
     * @param    {String}  arg0    - 请求地址
     * @param    {Object}  arg1    - 可选配置参数
     * @property {Boolean} async   - 异步载入并立刻执行，默认为!0
     * @property {Number}  timeout - 超时时间,0表示禁止超时监测
     * @property {String}  version - 版本信息
     * @property {String}  charset - 脚本编码
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return   {Void}
     */
    _p._$loadScript = function(_url,_options){
        _t3._$$LoaderScript._$allocate(_options)._$load(_url);
    };
    /**
     * 载入队列脚本并依次执行
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$queueScript([
     *         '../../../javascript/log.js',
     *         'http://123.163.com/a.js'
     *     ],{
     *         onload:function(){
     *            // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *            // 异常回调方法
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$queueScript
     * @see      module:util/ajax/tag._$loadScript
     * @param    {Array}  arg0    - 脚本队列
     * @param    {Object} arg1    - 可选配置参数
     * @property {String} version - 版本信息
     * @property {String} charset - 脚本编码
     * @property {Number} timeout - 每个脚本超时时间,0表示禁止超时监测
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return   {Void}
     */
    _p._$queueScript = function(_list,_options){
        _t3._$$LoaderScript._$allocate(_options)._$queue(_list);
    };
    /**
     * 载入样式文件
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$loadStyle('http://123.163.com/a.css',{
     *         onload:function(){
     *             // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *             // 异常回调方法
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$loadStyle
     * @see      module:util/ajax/tag._$queueStyle
     * @param    {String} arg0    - 样式文件地址
     * @param    {Object} arg1    - 可选配置参数
     * @property {Number} timeout - 超时时间,0表示禁止超时监测
     * @property {String} version - 版本信息
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return   {Void}
     */
    _p._$loadStyle = function(_url,_options){
        _t2._$$LoaderStyle._$allocate(_options)._$load(_url);
    };
    /**
     * 载入样式队列
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$queueStyle([
     *         'http://123.163.com/a.css',
     *         'http://123.163.com/b.css'
     *     ],{
     *         onload:function(){
     *             // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *             // 异常回调方法
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$queueStyle
     * @see      module:util/ajax/tag._$loadStyle
     * @param    {Array}  arg0    - 样式队列
     * @param    {Object} arg1    - 可选配置参数
     * @property {Number} timeout - 超时时间,0表示禁止超时监测
     * @property {String} version - 版本信息
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return   {Void}
     */
    _p._$queueStyle = function(_list,_options){
        _t2._$$LoaderStyle._$allocate(_options)._$queue(_list);
    };
    /**
     * 载入HTML文件
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$loadHtml('http://123.163.com/a.html',{
     *         onload:function(){
     *             // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *             // 异常回调方法
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$loadHtml
     * @param    {String} arg0    - 文件地址
     * @param    {Object} arg1    - 可选配置参数
     * @property {String} version - 版本信息
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return   {Void}
     */
    _p._$loadHtml = function(_url,_options){
        var org1 = u._$url2origin(_url),
            org2 = u._$url2origin(location.href);
        if (!org1||org1==org2){
            _t1._$$LoaderHtml._$allocate(_options)._$load(_url);
        }else{
            var callback = _options.onload;
            _options.onload = function(event){
                callback(e._$html2node(event.content));
            };
            _p._$loadText(_url, _options);
        }
    };
    /**
     * 载入HTML文件
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/tag'
     * ],function(_j){
     *     _j._$loadText('http://123.163.com/a.txt',{
     *         onload:function(){
     *             // 载入成功的回调方法
     *         },
     *         onerror:function(_error){
     *             // 异常回调方法
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/ajax/tag._$loadText
     * @param    {String} arg0    - 文件地址
     * @param    {Object} arg1    - 可选配置参数
     * @property {String} version - 版本信息
     * @property {module:util/ajax/tag.onload}  onload  - 载入回调
     * @property {module:util/ajax/tag.onerror} onerror - 异常回调
     * @return {Void}
     */
    _p._$loadText = function(_url,_options){
        _t0._$$LoaderText._$allocate(_options)._$load(_url);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.j'),_p);
    }

    return _p;
});
