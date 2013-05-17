/*
 * ------------------------------------------
 * 多选控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proMultiSelector;
    if (!!_p._$$MultiSelector) return;
    /**
     * 多选控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <style type="text/css">
     *       // 定制选择的样式
     *       .select{background:pink;}
     *       // 每一项统一的样式
     *       #box div{width:30px;height:30px;border:solid 1px #ccc;}
     *   </style>
     *   <div id="box"></div>
     * [/code]
     * 脚本举例
     * [code]
     *    var _html_seed = _e._$addHtmlTemplate('{list 1..31 as x}\
     *        <div class="item">${x}</div>\
     *        {/list}');
     *    var _  = NEJ.P,
     *        _e = _('nej._e'),
     *        _v = _('nej._v'),
     *        _p = _('nej.ut');
     *                
     *    _e._$get('box').innerHTML = _e._$getHtmlTemplate(_html_seed);
     *    // 支持ctrl和shift多选
     *    var _ms = _p._$$MultiSelector._$allocate({
     *        parent:'box',
     *        item:'item',
     *        select:'select'
     *    });
     * [/code]
     * @class   {nej.ut._$$MultiSelector} 多选控件
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下所示
     * @config  {Node|String}  parent   容器节点或者ID，如果不输入则在列表的每一项上检测事件
     * @config  {String}       item     可选节点样式标识，默认为js-item
     * @config  {String}       selected 选中样式，默认为js-selected
     * 
     * [hr]
     * 
     * @event {onchange} 选中变化触发事件
     * @param {Event} 事件对象
     * 
     */
    _p._$$MultiSelector = NEJ.C();
      _proMultiSelector = _p._$$MultiSelector._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proMultiSelector.__init = function(){
        this.__eopt = {
            clear:this.__onItemClear._$bind(this),
            select:this.__onItemSelect._$bind(this),
            selectall:this.__onItemSelectAll._$bind(this)
        };
        this.__selection = {length:0};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proMultiSelector.__reset = function(_options){
        this.__supReset(_options);
        this.__last = -1;
        this.__parent = _e._$get(_options.parent);
        this.__selected = _options.selected||'js-selected';
        this.__doInitNode(
            _e._$getByClassName(
            this.__parent,_options.item||'js-item'
        ));
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proMultiSelector.__destroy = (function(){
        var _doclear = function(_node){
            _u._$safeDelete(_node,'flag');
        };
        return function(){
            this.__supDestroy();
            this.__doItemClear();
            _u._$forEach(this.__list,_doclear);
            delete this.__last;
            delete this.__list;
            delete this.__parent;
            delete this.__selected;
        };
    })();
    /**
     * 列表转哈希表
     * @protected
     * @method {__doInitNode}
     * @param  {Array} 节点列表
     * @return {Void}
     */
    _proMultiSelector.__doInitNode = (function(){
        var _doflag = function(_node,_index){
            _node.flag = _index;
        };
        return function(_list){
            this.__list = _list||[];
            _u._$forEach(this.__list,_doflag);
            this.__doInitDomEvent([
                [document,'mousedown',this.__eopt.clear],
                [document,'keydown',this.__eopt.selectall],
                [this.__parent,'mousedown',this.__eopt.select]
            ]);
        };
    })();
    /**
     * 判断节点是否被选中
     * @protected
     * @method {__isItemSelected}
     * @param  {String}  节点标识
     * @return {Boolean} 是否选中
     */
    _proMultiSelector.__isItemSelected = function(_id){
        return !!this.__selection[_id];
    };
    /**
     * 选中节点
     * @protected
     * @method {__doItemAddToSelection}
     * @param  {String} 节点标识
     * @param  {Node}   节点对象
     * @return {Void}
     */
    _proMultiSelector.__doItemAddToSelection = function(_id,_element){
        if (!!this.__selection[_id]) return;
        _e._$addClassName(_element,this.__selected);
        this.__selection[_id] = _element;
        this.__selection.length++;
    };
    /**
     * 反选节点
     * @protected
     * @method {__doItemDelFromSelection}
     * @param  {String} 节点标识
     * @param  {Node}   节点对象
     * @return {Void}
     */
    _proMultiSelector.__doItemDelFromSelection = function(_id,_element){
        if (!this.__selection[_id]) return;
        _e._$delClassName(_element,this.__selected);
        delete this.__selection[_id];
        this.__selection.length--;
    };
    /**
     * 清除选中项
     * @protected
     * @method {__doItemClear}
     * @param  {String} 保留节点ID
     * @return {Void}
     */
    _proMultiSelector.__doItemClear = function(_id){
        for(var x in this.__selection){
            if (x==_id||x=='length'||x=='list') continue;
            this.__doItemDelFromSelection(x,this.__selection[x]);
        }
    };
    /**
     * 清除选中项
     * @protected
     * @method {__onItemClear}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proMultiSelector.__onItemClear = function(_event){
        if (_event.ctrlKey||
            _event.shiftKey)
            return;
        this.__doItemClear();
        this._$dispatchEvent('onchange');
    };
    /**
     * 选择项
     * @protected
     * @method {__onItemSelect}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proMultiSelector.__onItemSelect = (function(){
        var _dofilter = function(_element){
            return _element.flag!=null;
        };
        return function(_event){
            var _element = _v._$getElement(
                             _event,_dofilter);
            if (!_element) return;
            _v._$stop(_event);
            var _ctrl = _event.ctrlKey,
                _shift = _event.shiftKey,
                _id = _element.flag;
            // not ctrl and shift
            if (!_ctrl&&!_shift){
                this.__doItemClear(_id)
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
                for(var i=0,l=this.__list.length,
                    _selected = !1,_test,_item,_key,_last;i<l;i++){
                    _item = this.__list[i];
                    _key  = _item.flag;
                    _last = Math.max(0,this.__last);
                    _test = _key==_last||_key==_id;
                    if (_last!=_id&&_test) 
                        _selected = !_selected;
                    if (_selected||_test){
                        this.__doItemAddToSelection(_key,_item);
                        continue;
                    }
                    if (_ctrl) continue;
                    this.__doItemDelFromSelection(_key,_item);
                }
            }
            if (!_shift) this.__last = _id;
            this._$dispatchEvent('onchange',_event);
        };
    })();
    /**
     * 全选
     * @protected
     * @method {__onItemSelectAll}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proMultiSelector.__onItemSelectAll = function(_event){
        if (!_event.ctrlKey||_event.keyCode!=65) return;
        for(var i=0,l=this.__list.length,_item;i<l;i++){
            _item = this.__list[i];
            this.__doItemAddToSelection(_item.flag,_item);
        }
    };
    /**
     * 清除选中<br />
     * 脚本举例
     * [code]
     *   // 清除所有选中状态
     *   _ms._$clear();
     * [/code]
     * @method {_$clear}
     * @return {nej.ut._$$MultiSelector}
     */
    _proMultiSelector._$clear = function(){
        this.__doItemClear();
        return this;
    };
    /**
     * 取选项列表<br />
     * 脚本举例
     * [code]
     *   // 获取所有节点列表
     *   _ms._$getList();
     * [/code]
     * @method {_$getList}
     * @return {Array} 列表
     */
    _proMultiSelector._$getList = function(){
        return this.__list;
    };
    /**
     * 取当前选中信息<br />
     * 脚本举例
     * [code]
     *   // 获取被选中的节点列表
     *   _ms._$getSelection();
     * [/code]
     * @method {_$getSelection}
     * @param  {Boolean} 是否需要排序
     * @return {Object}  当前选中信息
     */
    _proMultiSelector._$getSelection = function(_sorted){
        this.__selection.list = null;
        if (!!_sorted){
            _list = [];
            for(var i=0,l=this.__list.length;i<l;i++){
                if (this.__isItemSelected(
                    this.__list[i].flag))
                _list.push(this.__list[i]);
            }
            this.__selection.list = _list;
        }
        return this.__selection;
    };
};
NEJ.define('{lib}util/selector/selector.js',
          ['{lib}util/event.js'],f);
