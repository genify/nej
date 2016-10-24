/*
 * ------------------------------------------
 * JSONP控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/jsonp */
NEJ.define([
    'base/util',
    './tag.js'
],function(u, j, exports){
    /**
     * 发送 jsonp 请求
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/jsonp'
     * ],function(j){
     *     var id = j._$request(
     *         'http://a.b.com/api',{
     *             query:'a=1&b=2',
     *             onload:function(_data){
     *                 // 正常回调处理
     *             }
     *         }
     *     );
     * });
     * ```
     *
     * @method   module:util/ajax/jsonp._$request
     * @param    {String}   arg0 - 请求地址
     * @param    {Object}   arg1 - 配置参数
     * @property {Variable} data - 查询参数,字符串格式a=b&c=d,对象格式{a:'b',c:'d'}
     *
     * @property {module:util/ajax/xdr.onload}  onload  - 数据载入回调
     *
     * @return   {String} 分配给请求的ID
     */
    exports._$request = (function(){
        var merge = function (url, data, callback) {
            url += (url.indexOf('?')<0?'?':'&')
                +  'callback='+callback;
            if (!data){
                return url;
            }
            if (u._$isObject(data)){
                data = u._$object2query(data);
            }
            url += '&'+data;
        };
        return function (url, options) {
            var sn = u._$uniqueID(),
                cb = 'cb_'+sn,
                url = merge(url, options.data, cb);
            if (!!options.onload){
                window[cb] = function (result) {
                    options.onload(result);
                    u._$safeDelete(window,cb);
                };
            }
            var opt = u._$merge({},options);
            opt.onload = null;
            opt.onerror = function (error) {
                if (options.onerror){
                    u._$safeDelete(window,cb);
                    options.onerror(error);
                }
            };
            j._$loadScript(url,opt);
            return sn;
        };
    })();
});
