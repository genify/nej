/*
 * ------------------------------------------
 * 列表项基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/item/list */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}ui/item/item.js'
],function(NEJ,_k,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表项基类对象
     *
     * @class     module:ui/item/list._$$ListItem
     * @extends   module:ui/item/item._$$Item
     * @param     {Object} arg0 - 配置参数
     * @property  {String} pkey - 主键字段名称，默认为id
     */
    /**
     * 删除列表项触发事件
     *
     * @event    module:ui/item/list._$$ListItem#ondelete
     * @param    {Object} arg0 - 事件信息
     * @property {String} id   - 项标识
     * @property {Object} data - 项绑定的数据
     *
     */
    _p._$$ListItem = _k._$klass();
    _pro = _p._$$ListItem._$extend(_i0._$$Item);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/item/list._$$ListItem#__reset
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__pkey = _options.pkey||'id';
        this.__prefix = _options.prefix||'';
        this.__super(_options);
    };
    /**
     * 删除列表项触发事件
     *
     * @protected
     * @method module:ui/item/list._$$ListItem#__onDelete
     * @return {Void}
     */
    _pro.__onDelete = function(_data){
        this._$dispatchEvent('ondelete',{
            ext:_data,
            id:this._$getId(),
            data:this._$getData(),
            body:this._$getBody()
        });
    };
    /**
     * 删除列表项触发事件
     *
     * @protected
     * @method module:ui/item/list._$$ListItem#__onUpdate
     * @return {Void}
     */
    _pro.__onUpdate = function(_data){
        this._$dispatchEvent('onupdate',{
            ext:_data,
            id:this._$getId(),
            data:this._$getData(),
            body:this._$getBody()
        });
    };
    /**
     * 刷新项绑定的数据<br/>
     *
     * 脚本举例：
     * ```javascript
     * // 获取当前item的数据信息
     * _item._$refresh({
     *     a:'aaaaa',
     *     b:'bbbbb'
     * });
     * ```
     *
     * @method module:ui/item/list._$$ListItem#_$refresh
     * @param  {Object} arg0 - 项绑定的数据
     * @return {Void}
     */
    _pro._$refresh = function(_data){
        this.__super();
        var _id = this.__data[this.__pkey];
        this.__id = (this.__prefix+_id)||this.__genId();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});