/*
 * ------------------------------------------
 * 标签切换控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/tab/tab */
NEJ.define([
    'base/global',
    'base/klass',
    'base/event',
    'base/util',
    'base/element',
    'util/event'
],function(NEJ,_k,_v,_u,_e,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 标签切换控件封装
     *
     * 结构举例
     *
     * ```html
     *   <div id="box">
     *       <a>1</a>
     *       <a>2</a>
     *       <a class="js-disabled">3</a>
     *       <a>4</a>
     *   </div>
     * ```
     *
     * 脚本举例
     *
     * ```javascript
     * NEJ.define([
     *     'util/tab/tab'
     * ],function(_t){
     *     // 实例化控件
     *     var _tab = _t._$$Tab._$allocate({
     *         list:_e._$getChildren('box'),
     *         index:1,
     *         onchange:function(_event){
     *             // TODO
     *         }
     *     });
     *     // 使用控件
     *     _tab._$go(2);
     * });
     * ```
     *
     * @class   module:util/tab/tab._$$Tab
     * @extends module:util/event._$$EventTarget
     *
     * @param    {Object}  config   - 可选配置参数，已处理参数列表如下
     * @property {Array}   list     - 标签项列表
     * @property {Number}  index    - 初始选中项索引值，默认为0
     * @property {String}  event    - 触发选择事件名称，默认为click
     * @property {Boolean} inverse  - 是否反过程，true表示选中时删除选中样式，否则选中时添加样式
     * @property {String}  disabled - 选项禁用样式，默认为js-disabled
     * @property {String}  selected - 选中样式名，默认为js-selected
     */
    /**
     * 标签切换事件，输入{last:1,index:5}
     *
     * ```javascript
     * NEJ.define([
     *     'util/tab/tab'
     * ],function(_t){
     *     // 实例化控件
     *     var _tab = _t._$$Tab._$allocate({
     *         list:_e._$getChildren(_e._$get('box')),
     *         index:1,
     *         onchange:function(_event){
     *             // _event.last   上一次的tab索引
     *             // _event.index  需要切换到的tab索引
     *             // _event.list   节点列表
     *             // _event.data   节点上通过data-value设置的内容
     *             // TODO
     *         }
     *     });
     * });
     * ```
     *
     * @event    module:util/tab/tab._$$Tab#onchange
     * @param    {Object}  event   - tab信息
     * @property {Number}  last    - 上一次的tab索引
     * @property {Number}  index   - 需要切换到的tab索引
     * @property {Array}   list    - 节点列表
     * @property {String}  data    - 节点上通过data-value设置的内容
     * @property {Boolean} stopped - 是否阻止触发节点的默认事件，回调过程中如果设置为false则后续继续触发节点的默认事件
     */
    _p._$$Tab = _k._$klass();
    _pro = _p._$$Tab._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/tab/tab._$$Tab#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__name = _options.event||'click';
        this.__selected = _options.selected||'js-selected';
        this.__disabled = _options.disabled||'js-disabled';
        this.__inversed = !!_options.inverse;
        this.__doTabListCheck(_options.list);
        this._$go(_options.index||0);
    };
    /**
     * 控件回收
     *
     * @protected
     * @method module:util/tab/tab._$$Tab#__destroy
     * @return {Void}
     */
    _pro.__destroy = (function(){
        var _doResetSelect = function(_node){
            this.__doTabItemSelect(_node,!1);
        };
        return function(){
            this.__supDestroy();
            _u._$forEach(
                this.__list,
                _doResetSelect,this
            );
            delete this.__list;
            delete this.__name;
            delete this.__index;
            delete this.__disabled;
            delete this.__selected;
            delete this.__inversed;
       };
    })();
    /**
     * 初始化标签列表
     *
     * @protected
     * @method module:util/tab/tab._$$Tab#__doTabListCheck
     * @param  {Array} arg0 - 标签节点列表
     * @return {Void}
     */
    _pro.__doTabListCheck = (function(){
        var _doInitDomEvent = function(_item){
            if (!_item) return;
            this.__list.push(_item);
            var _index = this.__list.length-1,
                _handler = this.__cblist[_index];
            if (!_handler){
                _handler = this._$go._$bind(this,_index);
                this.__cblist[_index] = _handler;
            }
            this.__doInitDomEvent([[_item,this.__name,_handler]]);
        };
        return function(_list){
            this.__list = [];
            if (!this.__cblist) this.__cblist = [];
            _u._$forEach(_list,_doInitDomEvent,this);
        };
    })();
    /**
     * 设置标签选中状态
     *
     * @protected
     * @method module:util/tab/tab._$$Tab#__doTabItemSelect
     * @param  {Node}    arg0 - 标签节点
     * @param  {Boolean} arg1 - 是否选中
     * @return {Void}
     */
    _pro.__doTabItemSelect = function(_element,_selected){
        !!_selected&&!this.__inversed
        ? _e._$addClassName(_element,this.__selected)
        : _e._$delClassName(_element,this.__selected);
    };
    /**
     * 切换到指定索引位置
     *
     * ```javascript
     *   // 切换到索引为2的位置，如果当前索引为2则不触发回调
     *   _tab._$go(2);
     *   // 切换索引为2，如果当前索引为2也触发onchange回调
     *   _tab._$go(2,true);
     * ```
     *
     * @method module:util/tab/tab._$$Tab#_$go
     * @param  {Number}  arg0 - 索引值
     * @param  {Boolean} arg1 - 是否强行触发onchange事件
     * @return {Void}
     */
    _pro._$go = function(_index,_force){
        var _element = this.__list[_index];
        if (_force!=!0&&(_index==this.__index||!_element||
            _e._$hasClassName(_element,this.__disabled))){
            _v._$stopDefault(arguments[1]);
        }
        var _event = {
            stopped:!0,
            index:_index,
            last:this.__index,
            list:this._$getList(),
            data:_e._$dataset(_element,'value')
        };
        this.__index = _index;
        _element = this.__list[_event.last];
        if (!!_element){
            this.__doTabItemSelect(_element,!1);
        }
        _element = this.__list[this.__index];
        this.__doTabItemSelect(_element,!0);
        this._$dispatchEvent('onchange',_event);
        if (_event.stopped){
            _v._$stopDefault(arguments[1]);
        }
    };
    /**
     * 取当前选中项索引
     *
     * ```javascript
     *   // 获取当前选中的索引
     *   var index = _tab._$getIndex();
     * ```
     *
     * @method module:util/tab/tab._$$Tab#_$getIndex
     * @return {Number} 当前选中项索引
     */
    _pro._$getIndex = function(){
        return this.__index;
    };
    /**
     * 取Tab控件关联的节点列表
     *
     * ```javascript
     *   // 获取关联的节点列表
     *   _tab._$getList();
     * ```
     *
     * @method module:util/tab/tab._$$Tab#_$getList
     * @return {Array} 关联的节点列表
     */
    _pro._$getList = function(){
        return this.__list;
    };

    if (CMPT){
        NEJ.copy('nej.ut',_p);
    }

    return _p;
});
