/*
 * ------------------------------------------
 * 列表项控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/item/item */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}ui/base.js'
],function(NEJ,_k,_i,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表项控件基类
     *
     * 页面结构举例
     *
     * ```html
     * <div id='item-box'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     '{lib}base/klass.js',
     *     '{lib}ui/item/item.js'
     * ],function(_k,_i0,_p,_o,_f,_r){
     *     var _  = NEJ.P,
     *         _p = _('nej.ut'),
     *         _e = _('nej.e');
     *     // 第一步：新建一个类，继承自此基类
     *     var _html_key = _e._$addNodeTemplate('<div>123</div>');
     *
     *     _p._$$MyItem = _k._$klass();
     *     _proMyItem = _p._$$MyItem._$extend(_i0._$$Item);
     *     _proMyItem.__reset = function(_options){
     *         this.__data = _options.data;
     *         this.__supReset(_options);
     *     }
     *
     *     _proMyItem.__doRefresh = function(){
     *         // 刷新一项，设置数据{name:'sean'}
     *         this.__body.innerText = this.__data.name;
     *     };
     *
     *     _proMyItem.__initXGui = function(){
     *         this.__seed_html = _html_key;
     *     };
     * });
     * // 第二步：生成item列表
     * // 可以自己循环list，生成item
     * NEJ.define([
     *     '{lib}base/event.js',
     *     'path/to/custom/myitem.js'
     * ],function(_e,_i0,_p,_o,_f,_r){
     *     var _item = _i0._$$MyItem._$allocate({
     *         parent:'item-box',
     *         data:list[i]
     *     });
     *     // 可以利用_e._$getItemTemplate接口，返回item列表
     *     _e._$getItemTemplate(
     *         [{name:'jack'},{name:'sean'}],
     *         _i0._$$MyItem,
     *         {parent:'item-box'}
     *     );
     * });
     * ```
     *
     * @class     module:ui/item/item._$$Item
     * @extends   module:ui/base._$$Abstract
     * @param     {Object} arg0  - 可选配置参数
     * @property  {Object} data  - 当前项绑定的数据
     * @property  {Number} index - 当前项的索引
     * @property  {Number} total - 总列表长度
     * @property  {Array}  range - 当前项所在的列表片段方位(begin,end)
     */
    _p._$$Item = _k._$klass();
    _pro = _p._$$Item._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/item/item._$$Item#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__id = this.__genId();
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/item/item._$$Item#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__index = _options.index;
        this.__total = _options.total;
        this.__range = _options.range;
        this._$refresh(_options.data);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/item/item._$$Item#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__data;
        delete this.__index;
        delete this.__total;
        delete this.__range;
    };
    /**
     * 刷新项,子类实现具体逻辑
     *
     * @abstract
     * @method module:ui/item/item._$$Item#__doRefresh
     * @return {Void}
     */
    _pro.__doRefresh = _f;
    /**
     * 生成ID
     *
     * @protected
     * @method module:ui/item/item._$$Item#__genId
     * @return {String} ID
     */
    _pro.__genId = (function(){
        var _seed = +new Date;
        return function(){
            return 'itm-'+(++_seed);
        };
    })();
    /**
     * 取项标识
     *
     * 脚本举例
     * ```javascript
     * // 获取当前item的id标识
     * _item._$getId();
     * ```
     *
     * @method module:ui/item/item._$$Item#_$getId
     * @return {String} 项标识
     */
    _pro._$getId = function(){
        return this.__id;
    };
    /**
     * 取项绑定数据
     *
     * 脚本举例：
     * ```javascript
     * // 获取当前item的数据信息
     * _item._$getData();
     * ```
     *
     * @method module:ui/item/item._$$Item#_$getData
     * @return {Object} 数据信息
     */
    _pro._$getData = function(){
        return this.__data;
    };
    /**
     * 刷新项绑定的数据
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
     * @method module:ui/item/item._$$Item#_$refresh
     * @param  {Object} arg0 - 项绑定的数据
     * @return {Void}
     */
    _pro._$refresh = function(_data){
        this.__data  = _data||{};
        this.__doRefresh(this.__data);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});
