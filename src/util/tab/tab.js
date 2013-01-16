/*
 * ------------------------------------------
 * 标签切换控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proTab;
    if (!!_p._$$Tab) return;
    /**
     * 标签切换控件封装<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id="box">
     *       <a>1</a>
     *       <a>2</a>
     *       <a class="js-disabled">3</a>
     *       <a>4</a>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _v = _('nej.v'),
     *       _p = _('nej.ut');
     *   
     *   var _tb = _p._$$Tab._$allocate({
     *       list:_e._$getChildren(_e._$get('box')),
     *       index:1,
     *       onchange:function(_event){
     *       }
     *   });
     *   _tb._$go(2);
     * [/code]
     * @class   {nej.ut._$$Tab} 标签切换控件封装
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Array}   list     标签项列表
     * @config  {Number}  index    初始选中项索引值，默认为0
     * @config  {String}  event    触发选择事件名称，默认为click
     * @config  {Boolean} inverse  是否反过程，true表示选中时删除选中样式，否则选中时添加样式
     * @config  {String}  disabled 选项禁用样式，默认为js-disabled
     * @config  {String}  selected 选中样式名，默认为js-selected
     * 
     * [hr]
     * 
     * @event  {onchange} 标签切换事件，输入{last:1,index:5}
     * @param  {Object} tab信息
     * @config {Number} last  上一次的tab索引
     * @config {Number} index 需要切换到的tab索引
     * 
     */
    _p._$$Tab = NEJ.C();
      _proTab = _p._$$Tab._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proTab.__reset = function(_options){
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
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proTab.__destroy = (function(){
        var _doResetSelect = function(_node){
            this.__doTabItemSelect(_node,!1);
        };
        return function(){
            this.__supDestroy();
            _u._$forEach(this.__list,
                        _doResetSelect,this);
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
     * @protected
     * @method {__doTabListCheck}
     * @param  {Array} 标签列表
     * @return {Void}
     */
    _proTab.__doTabListCheck = (function(){
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
     * @protected
     * @method {__doTabItemSelect}
     * @param  {Node}    标签节点
     * @param  {Boolean} 是否选中
     * @return {Void}
     */
    _proTab.__doTabItemSelect = function(_element,_selected){
        !!_selected&&!this.__inversed
        ? _e._$addClassName(_element,this.__selected)
        : _e._$delClassName(_element,this.__selected);
    };
    /**
     * 切换到指定索引位置<br />
     * 脚本举例
     * [code]
     *   // 切换到索引为2的位置，如果当前索引为2则不触发回调
     *   _tb._$go(2);
     *   // 切换索引为2，如果当前索引为2也触发回调
     *   _tb._$go(2,true);
     * [/code]
     * @method {_$go}
     * @param  {Number}  索引值
     * @param  {Boolean} 是否强行回调
     * @return {nej.ut._$$Tab}
     */
    _proTab._$go = function(_index,_force){
        var _element = this.__list[_index];
        if (!_force&&(_index==this.__index||
            !_element||_e._$hasClassName(
                _element,this.__disabled))){
            _v._$stopDefault(arguments[1]);
            return this;
        }
        var _event = {index:_index
                     ,last:this.__index
                     ,data:_e._$dataset(_element,'value')};
        this.__index = _index;
        _element = this.__list[_event.last];
        if (!!_element)
            this.__doTabItemSelect(_element,!1);
        _element = this.__list[this.__index];
        this.__doTabItemSelect(_element,!0);
        this._$dispatchEvent('onchange',_event);
        if (!_event.nostop) _v._$stopDefault(arguments[1]);
        return this;
    };
    /**
     * 取当前选中项索引<br />
     * 脚本举例
     * [code]
     *   // 获取当前选中的索引
     *   _tb._$getIndex();
     * [/code]
     * @method {_$getIndex}
     * @return {Number} 当前选中项索引
     */
    _proTab._$getIndex = function(){
        return this.__index;
    };
    /**
     * 取Tab控件关联的节点列表<br />
     * 脚本举例
     * [code]
     *   // 获取关联的节点列表
     *   _tb._$getList();
     * [/code]
     * @method {_$getList}
     * @return {Array} 关联的节点列表
     */
    _proTab._$getList = function(){
        return this.__list;
    };
    /**
     * 将某个父容器下的相关节点构造成一个TAB控件
     * [code]
     *    // 构建一个tab控件
     *    nej.e._$tab('abc',{onchange:function(){}});
     *    // 调用tab控件接口
     *    nej.e._$tab('abc')._$go(5);
     *    // 回收tab控件
     *    nej.e._$tab('abc')._$recycle();
     * [/code]
     * @api    {nej.e._$tab}
     * @param  {String|Node}  TAB控件父容器
     * @param  {Object}       可选配置参数，参见nej.ut._$$Tab控件的可选配置参数
     * @config {String} clazz 需要做TAB控件的节点标识，如没有此参数则选取父节点下的所有子节点
     * @return {nej.ut._$$Tab}
     */
    _e._$tab = function(_parent,_options){
        var _id = _e._$id(_parent);
        if (!_id) return null;
        if (!_p._$api(_id,_p._$$Tab)){
            _options = _options||{};
            _options.list = !_options.clazz
                          ? _e._$getChildren(_id)
                          : _e._$getByClassName(_id,_options.clazz);
            delete _options.clazz;
        }
        return _p._$api(_id,_p._$$Tab,_options||_o);
    };
};
define('{lib}util/tab/tab.js',
      ['{lib}base/event.js'
      ,'{lib}base/element.js'
      ,'{lib}util/event.js'],f);