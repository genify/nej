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
        _tkey = 'test-'+(+new Date),
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
     * @config  {String}       name     项标识属性名称，默认id，节点通过data-id指定项标识
     * @config  {String}       item     可选节点样式标识，默认为js-item
     * @config  {String}       selected 选中样式，默认为js-selected
     * 
     * [hr]
     * 选中变化触发事件
     * @event {onchange} 
     * @param {Object} 事件对象
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
        this.__selection = {count:0};
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
        this.__last = _tkey;
        this.__kname = _options.name||'id';
        this.__kfcls = _options.item||'js-item';
        this.__parent = _e._$get(_options.parent);
        this.__selected = _options.selected||'js-selected';
        this.__list = _e._$getByClassName(
            this.__parent,this.__kfcls
        );
        // init dom event
        this.__doInitDomEvent([[
            document,'click',
            this._$clear._$bind(this)
        ],[
            document,'keydown',
            this.__onItemSelectAll._$bind(this)
        ],[
            this.__parent,'click',_v._$stopBubble
        ],[
            this.__parent,'mouseup',
            this.__onItemSelect._$bind(this)
        ],[
            this.__parent,'mousedown',
            this.__onItemSelectCheck._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proMultiSelector.__destroy = function(){
        this.__supDestroy();
        this.__doItemClear();
        delete this.__last;
        delete this.__list;
        delete this.__parent;
        delete this.__selected;
    };
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
        this.__selection[_id] = _e._$id(_element);
        this.__selection.count++;
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
        this.__selection.count--;
    };
    /**
     * 清除选中项
     * @protected
     * @method {__doItemClear}
     * @param  {String} 保留节点ID
     * @return {Void}
     */
    _proMultiSelector.__doItemClear = function(_id){
        _u._$forIn(
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
    };
    /**
     * 选择项
     * @protected
     * @method {__onItemSelect}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proMultiSelector.__onItemSelect = function(_event){
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
        if (!_shift) this.__last = _id;
        this._$dispatchEvent('onchange');
    };
    /**
     * 检查元素选中情况
     * @return {Void}
     */
    _proMultiSelector.__onItemSelectCheck = function(_event){
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
            this._$dispatchEvent('onchange');
        }
    };
    /**
     * 全选
     * @protected
     * @method {__onItemSelectAll}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proMultiSelector.__onItemSelectAll = function(_event){
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
        this._$dispatchEvent('onchange');
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
        this._$dispatchEvent('onchange');
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
        var _result = NEJ.X({},this.__selection);
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
};
NEJ.define('{lib}util/selector/selector.js',
          ['{lib}util/event.js'],f);
