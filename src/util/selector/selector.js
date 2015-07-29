/*
 * ------------------------------------------
 * 多选控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/selector/selector */
NEJ.define([
    'base/global',
    'base/klass',
    'base/event',
    'base/element',
    'base/util',
    'util/event'
],function(NEJ,_k,_v,_e,_u,_t,_p,_o,_f,_r){
    var _tkey = 'test-'+(+new Date),
        _pro;
    /**
     * 多选控件
     *
     * 样式举例
     * ```css
     * .itm{width:30px;height:30px;border:solid 1px #ccc;}
     * .js-selected{background:pink;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="box">
     *   <div class="itm" data-id="0">&nbsp;</div>
     *   <div class="itm" data-id="1">&nbsp;</div>
     *   <div class="itm" data-id="2">&nbsp;</div>
     *   <div class="itm" data-id="3">&nbsp;</div>
     *   <div class="itm" data-id="4">&nbsp;</div>
     *   <div class="itm" data-id="5">&nbsp;</div>
     *   <div class="itm" data-id="6">&nbsp;</div>
     *   <div class="itm" data-id="7">&nbsp;</div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/selector/selector'
     * ],function(_t){
     *     var _selector = _t._$$MultiSelector._$allocate({
     *         parent:'box',
     *         item:'itm',
     *         onchange:function(_event){
     *             var _selection = this._$getSelection();
     *             
     *             // TODO something
     *         }
     *     });
     * });
     * ```
     * @class    module:util/selector/selector._$$MultiSelector
     * @extends  module:util/event._$$EventTarget
     * @param    {Object}      event    - 可选配置参数
     * @property {Node|String} parent   - 容器节点或者ID，如果不输入则在列表的每一项上检测事件
     * @property {String}      name     - 项标识属性名称，默认id，节点通过data-id指定项标识
     * @property {String}      item     - 可选节点样式标识，默认为js-item
     * @property {String}      selected - 选中样式，默认为js-selected
     */
    /** 
     * 选中变化触发事件
     * 
     * @event module:util/selector/selector._$$MultiSelector#onchange
     */
    _p._$$MultiSelector = _k._$klass();
    _pro = _p._$$MultiSelector._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__last = _tkey;
        this.__selection = {count:0};
        this.__kname = _options.name||'id';
        this.__kfcls = _options.item||'js-item';
        this.__parent = _e._$get(_options.parent);
        this.__selected = _options.selected||'js-selected';
        this.__list = _e._$getByClassName(
            this.__parent,this.__kfcls
        );
        // init dom event
        this.__parent.tabIndex = 10000;
        this.__doInitDomEvent([[
            this.__parent,'keydown',
            this.__onItemSelectAll._$bind(this)
        ],[
            this.__parent,'mouseup',
            this.__onItemSelect._$bind(this)
        ],[
            this.__parent,'mousedown',
            this.__onItemSelectCheck._$bind(this)
        ]]);
        // init selection
        _u._$forEach(
            this.__list,function(_node){
                if (_e._$hasClassName(_node,this.__selected))
                    this.__doItemAddToSelection(
                        _e._$dataset(_node,this.__kname),_node
                    );
            },this
        );
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__doItemClear();
        delete this.__last;
        delete this.__list;
        delete this.__parent;
        delete this.__selected;
        delete this.__selection;
    };
    /**
     * 判断节点是否被选中
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__isItemSelected
     * @param  {String}  arg0 - 节点标识
     * @return {Boolean}        是否选中
     */
    _pro.__isItemSelected = function(_id){
        return !!this.__selection[_id];
    };
    /**
     * 选中节点
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__doItemAddToSelection
     * @param  {String} arg0 - 节点标识
     * @param  {Node}   arg1 - 节点对象
     * @return {Void}
     */
    _pro.__doItemAddToSelection = function(_id,_element){
        if (!!this.__selection[_id]) return;
        _e._$addClassName(_element,this.__selected);
        this.__selection[_id] = _e._$id(_element);
        this.__selection.count++;
    };
    /**
     * 反选节点
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__doItemDelFromSelection
     * @param  {String} arg0 - 节点标识
     * @param  {Node}   arg1 - 节点对象
     * @return {Void}
     */
    _pro.__doItemDelFromSelection = function(_id,_element){
        if (!this.__selection[_id]) return;
        _e._$delClassName(_element,this.__selected);
        delete this.__selection[_id];
        this.__selection.count--;
    };
    /**
     * 清除选中项
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__doItemClear
     * @param  {String} arg0 - 保留节点ID
     * @return {Void}
     */
    _pro.__doItemClear = function(_id){
        _u._$loop(
            this.__selection,
            function(_node,_key){
                if (_key==_id||
                    _key=='list'||
                    _key=='count')
                    return;
                this.__doItemDelFromSelection(_key,_node);
            },this
        );
    };
    /**
     * 清除选中项
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__onItemClear
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onItemClear = function(_event){
        if (_event.ctrlKey||
            _event.shiftKey)
            return;
        this.__doItemClear();
    };
    /**
     * 选择项
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__onItemSelect
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onItemSelect = function(_event){
        // check element
        var _element = _v._$getElement(
            _event,'c:'+this.__kfcls
        );
        if (!_element) return;
        _v._$stopBubble(_event);
        var _ctrl = _event.ctrlKey,
            _shift = _event.shiftKey,
            _id = _e._$dataset(_element,this.__kname);
        // right click
        if (_event.button==2&&
            this.__isItemSelected(_id))
            return;
        // not ctrl and shift
        if (!_ctrl&&!_shift){
            this.__doItemClear(_id);
            this.__doItemAddToSelection(_id,_element);
        }
        // ctrl
        if (_ctrl){
            ! this.__isItemSelected(_id)
            ? this.__doItemAddToSelection(_id,_element)
            : this.__doItemDelFromSelection(_id,_element);
        }
        // shift
        if (_shift){
            var _last,_test,
                _selected = !1,
                _last = this.__last!=_tkey?this.__last:
                        _e._$dataset(this.__list[0],this.__kname);
            _u._$forEach(
                this.__list,
                function(_item,_index,_list){
                    var _key = _e._$dataset(_item,this.__kname);
                    _test = _key==_last||_key==_id;
                    if (_last!=_id&&_test) 
                        _selected = !_selected;
                    if (_selected||_test){
                        this.__doItemAddToSelection(_key,_item);
                    }else if(!_ctrl){
                        this.__doItemDelFromSelection(_key,_item);
                    }
                },this
            );
        }
        if (!_shift){
            this.__last = _id;
        }
        this.__doSelectionChange();
    };
    /**
     * 检查元素选中情况
     *
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__onItemSelectCheck
     * @return {Void}
     */
    _pro.__onItemSelectCheck = function(_event){
        // check element
        var _element = _v._$getElement(
            _event,'c:'+this.__kfcls
        );
        if (!_element) return;
        _v._$stopBubble(_event);
        var _id = _e._$dataset(_element,this.__kname);
        // not ctrl and shift
        if (!_event.ctrlKey&&
            !_event.shiftKey&&
            !this.__isItemSelected(_id)){
            this.__doItemClear(_id);
            this.__doItemAddToSelection(_id,_element);
            this.__doSelectionChange();
        }
    };
    /**
     * 全选
     * 
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__onItemSelectAll
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onItemSelectAll = function(_event){
        if (!_event.ctrlKey||
             _event.keyCode!=65) 
            return;
        _u._$forEach(
            this.__list,
            function(_node){
                this.__doItemAddToSelection(
                    _e._$dataset(_node,this.__kname),_node
                );
            },this
        );
        this.__doSelectionChange();
    };
    /**
     * 选项变化事件
     *
     * @protected
     * @method module:util/selector/selector._$$MultiSelector#__doSelectionChange
     * @return {Void}
     */
    _pro.__doSelectionChange = function(){
        try{
            // remove selection if multi-select
            if (this.__selection.count>1){
                if (!!document.getSelection){
                    document.getSelection().collapse(document,0);
                }else if(!!document.selection){
                    document.selection.empty();
                }
            }
        }catch(ex){
            // ignore
        }
        this._$dispatchEvent('onchange');
    };
    /**
     * 清除选中
     * 
     * 脚本举例
     * ```javascript
     *   // 清除所有选中状态
     *   _selector._$clear();
     * ```
     * @method module:util/selector/selector._$$MultiSelector#_$clear
     * @return {Void}
     */
    _pro._$clear = function(){
        this.__doItemClear();
        this.__doSelectionChange();
    };
    /**
     * 取选项列表
     * 
     * 脚本举例
     * ```javascript
     *   // 获取所有节点列表
     *   _selector._$getList();
     * ```
     * 
     * @method module:util/selector/selector._$$MultiSelector#_$getList
     * @return {Array} 列表
     */
    _pro._$getList = function(){
        return this.__list;
    };
    /**
     * 取当前选中信息
     * 
     * 脚本举例
     * ```javascript
     *   // 获取被选中的节点列表
     *   _selector._$getSelection();
     * ```
     * 
     * @method module:util/selector/selector._$$MultiSelector#_$getSelection
     * @param  {Boolean} arg0 - 是否需要排序
     * @return {Object}         当前选中信息
     */
    _pro._$getSelection = function(_sorted){
        var _result = _u._$merge({},this.__selection);
        if (!!_sorted){
            _list = [];
            _u._$forEach(
                this.__list,
                function(_node){
                    var _id = _e._$dataset(_node,this.__kname);
                    if (this.__isItemSelected(_id)) _list.push(_id);
                },this
            );
            _result.list = _list;
        }
        return _result;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
