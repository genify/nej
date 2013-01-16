/*
 * ------------------------------------------
 * 列表项基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ui'),
        _proListItem,
        _supListItem;
    if (!!_p._$$ListItem) return;
    /**
     * 列表项基类对象
     * 
     * @class   {nej.ui._$$ListItem}
     * @extends {nej.ui._$$Item}
     * @param   {Object}  配置参数
     * @config  {String}  pkey  主键字段名称，默认为id
     * 
     * 
     * [hr]
     * 删除列表项触发事件
     * @event  {ondelete}
     * @param  {Object} 事件信息
     * @config {String} id   项标识
     * @config {Object} data 项绑定的数据
     * 
     */
    _p._$$ListItem = NEJ.C();
      _proListItem = _p._$$ListItem._$extend(_p._$$Item);
      _supListItem = _p._$$ListItem._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proListItem.__reset = function(_options){
        this.__supReset(_options);
        this.__pkey = _options.pkey||'id';
        this.__id = this.__data[this.__pkey];
    };
    /**
     * 删除列表项触发事件
     * @return {Void}
     */
    _proListItem.__onDelete = function(_event){
        _v._$stop(_event);
        this._$dispatchEvent('ondelete',{
            id:this._$getId(),
            data:this._$getData(),
            body:this._$getBody()
        });
    };
    /**
     * 删除列表项触发事件
     * @return {Void}
     */
    _proListItem.__onUpdate = function(_data){
        this._$dispatchEvent('onupdate',{
            id:this._$getId(),
            data:this._$getData(),
            body:this._$getBody()
        });
    };
};
define('{lib}ui/item/list.js',
      ['{lib}ui/item/item.js'],f);
