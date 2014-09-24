/*
 * ------------------------------------------
 * 排序功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/sort/sortable */
NEJ.define([
    'base/global',
    'base/klass',
    'base/event',
    'base/element',
    'base/util',
    'util/event'
],function(NEJ,_k,_v,_e,_u,_t,_p,_o,_f,_r,_pro){
    /**
     * 排序功能封装
     * 
     * @class   module:util/sort/sortable._$$Sortable
     * @extends module:util/event._$$EventTarget
     * 
     * @param    {Object} conifg      - 可选配置参数
     * @property {Node}   parent      - 容器节点
     * @property {String} clazz       - 可排序节点类标识，默认为j-sortable
     * @property {Node}   placeholder - 占位符，用于标识插入位置
     * @property {String} selected    - 排序节点选中样式，默认为j-selected
     */
    /** 
     * 排序之前触发事件
     * 
     * @event    module:util/sort/sortable._$$Sortable#onbeforesort
     * @param    {Object}  event - 事件信息
     * @property {Varable} value - 选中的排序节点或者节点列表
     */
    /** 
     * 排序变化触发事件
     * 
     * @event module:util/sort/sortable._$$Sortable#onsortchange
     * @param {Object} event - 事件信息
     */
    _p._$$Sortable = _k._$klass();
    _pro = _p._$$Sortable._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__clazz  = _options.clazz||'j-sortable';
        this.__selected = _options.selected||'j-selected';
        this.__parent = _e._$get(_options.parent);
        this.__holder = _e._$get(_options.placeholder);
        _e._$removeByEC(this.__holder);
        this.__doInitDomEvent([[
            this.__parent,'mousedown',
            this.__onSortStart._$bind(this)
        ],[
            document,'mousemove',
            this.__onSorting._$bind(this)
        ],[
            document,'mouseup',
            this.__onSortEnd._$bind(this)
        ],[
            this.__holder,'mousemove',
            _v._$stop._$bind(_v)
        ]]);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__doClearSort();
        this.__super();
    };
    /**
     * 清除排序信息
     * @return {Void}
     */
    _pro.__doClearSort = (function(){
        var _unSelect = function(_node,_clazz){
            if (!_u._$isArray(_node)){
                _e._$delClassName(_node,_clazz);
                return;
            }
            _u._$forEach(_node,function(_it){
                _unSelect(_it,_clazz);
            });
        };
        return function(){
            _e._$removeByEC(this.__holder);
            _unSelect(this.__lsort,this.__selected);
            delete this.__lsort;
            delete this.__place;
            delete this.__offset;
        };
    })();
    /**
     * 计算占位符位置信息
     * 
     * @abstract
     * @method module:util/sort/sortable._$$Sortable#__doCalPlaceHolder
     * @param  {Object} arg0 - 当前节点
     * @param  {Object} arg1 - 鼠标位置
     * @return {Object}        占位符信息
     */
    _pro.__doCalPlaceHolder = _f;
    /**
     * 开始排序
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__onSortStart
     * @return {Void}
     */
    _pro.__onSortStart = function(_event){
        // check sortable element
        var _element = _v._$getElement(
            _event,'c:'+this.__clazz
        );
        if (!_element) return;
        _v._$stop(_event);
        this.__lsort = _element;
        _e._$addClassName(
            this.__lsort,
            this.__selected
        );
        // check before sort for multi-selection
        try{
            var _eobj = {};
            this._$dispatchEvent(
                'onbeforesort',_eobj
            );
            if (!!_eobj.value){
                this.__lsort = _eobj.value;
            }
        }catch(ex){
            // ignore
        }
        this.__offset = _e._$offset(this.__parent);
    };
    /**
     * 排序过程
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__onSorting
     * @return {Void}
     */
    _pro.__onSorting = (function(){
        var _getOverBox = function(_from,_to){
            var _offset = _e._$offset(_from,_to);
            return {
                top:_offset.y,
                left:_offset.x,
                width:_from.clientWidth,
                height:_from.clientHeight
            };
        };
        return function(_event){
            if (!this.__lsort) return;
            var _element = _v._$getElement(
                _event,'c:'+this.__clazz
            );
            // single selection
            if (!_element||
                 _element==this.__lsort){
                delete this.__place;
                _e._$removeByEC(this.__holder);
                return;
            }
            // calculate placeholder position
            this.__parent.appendChild(this.__holder);
            var _obox = _getOverBox(_element,this.__parent);
            this.__place = this.__doCalPlaceHolder(
                _obox,{
                    top:_v._$pageY(_event)-_obox.top-this.__offset.y,
                    left:_v._$pageX(_event)-_obox.left-this.__offset.x
                }
            );
            this.__place.ref = _element;
            // update placeholder
            _e._$style(
                this.__holder,{
                    top:this.__place.top+'px',
                    left:this.__place.left+'px'
                }
            );
            if (this.__place.width!=null){
                _e._$setStyle(
                    this.__holder,'width',
                    this.__place.width+'px'
                );
            }
            if (this.__place.height!=null){
                _e._$setStyle(
                    this.__holder,'height',
                    this.__place.height+'px'
                );
            }
        };
    })();
    /**
     * 排序结束
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__onSortEnd
     * @return {Void}
     */
    _pro.__onSortEnd = (function(){
        var _doUpdateSort = function(_list,_place){
            if (!_place) return;
            // sort single
            if (!_u._$isArray(_list)){
                _place.ref.insertAdjacentElement(
                    _place.position,_list
                );
                return;
            }
            // sort multiple
            var _it;
            while(_it=_list[_place.method]()){
                _place.ref.insertAdjacentElement(
                    _place.position,_it
                );
            }
        };
        return function(_event){
            if (!this.__lsort) return;
            _doUpdateSort(
                this.__lsort,
                this.__place
            );
            this.__doClearSort();
            this._$dispatchEvent('onsortchange');
        };
    })();
    /**
     * 取排序列表，如果节点带data-value属性则返回该属性值的列表，否则返回节点列表
     * 
     * @method module:util/sort/sortable._$$Sortable#_$getSortList
     * @return {Array} 排序列表
     */
    _pro._$getSortList = function(){
        var _arr = [];
        _u._$forEach(
            _e._$getByClassName(
                this.__parent,this.__clazz
            ),function(_node){
                _arr.push(_e._$dataset(_node,'value')||_node);
            }
        );
        return _arr;
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
