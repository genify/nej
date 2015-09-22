/*
 * ------------------------------------------
 * 黏贴接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/file/paste */
NEJ.define([
    'base/util',
    'base/event',
    'base/element',
    '{platform}paste.js'
],function(u,v,e,h,p,o,f){
    // node cache
    var cache = [];
    /**
     * 绑定黏贴操作
     *
     * 结构举例
     * ```html
     * <input type="text" id="message"/>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/file/paste'
     * ],function(p){
     *     // 绑定黏贴行为
     *     p._$bind('message',{
     *         accept:'image',
     *         dataurl:true,
     *         onpaste:function(event){
     *             // event.type    - 内容类型，string或者file
     *             // event.content - 内容信息
     *             // event.dataurl - 如果是图片，此属性表示图片地址
     *         }
     *     });
     * });
     * ```
     *
     * @method module:util/file/paste._$bind
     * @see    module:util/file/paste._$unbind
     * @param  {String|Node} node        - 节点ID或者节点对象
     * @param  {Object}   config         - 配置信息
     * @param  {String}   config.accept  - 支持黏贴的格式，如image表示图片、text表示纯文本，或者text/plain表示精确的纯文本
     * @param  {Boolean}  config.dataurl - 如果accept为image，则标识是否导出dataurl，拿到的dataurl可以直接用于img标签的src属性预览本地图片
     * @param  {Function} config.onpaste - 黏贴回调，输入内容为 {type:'string|file',content:xxxx,dataurl:'xxxx'}
     * @return {Void}
     */
    p._$bind = function(node,options){
        // check node
        node = e._$get(node);
        if (!node){
            return;
        }
        // check binded
        var id = e._$id(node);
        if (!!cache[id]){
            return;
        }
        // past event handler
        var ret = u._$merge(
            {onpaste:f},options
        );
        ret.handler = h.
            __doDumpContent._$bind(null,ret);
        v._$addEvent(node,'paste',ret.handler);
        cache[id] = ret;
    };
    /**
     * 解绑黏贴行为
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/file/paste'
     * ],function(p){
     *     // 解绑黏贴行为
     *     p._$unbind('message');
     * });
     * ```
     *
     * @method module:util/file/paste._$unbind
     * @see    module:util/file/paste._$bind
     * @param  {String|Node} node - 节点ID或者节点对象
     * @return {Void}
     */
    p._$unbind = function(node){
        // check node
        node = e._$get(node);
        if (!node){
            return;
        }
        // check binded
        var id = e._$id(node),
            ret = cache[id];
        if (!!ret){
            v._$delEvent(
                node,'paste',
                ret.handler
            );
            delete cache[id];
        }
    };
});