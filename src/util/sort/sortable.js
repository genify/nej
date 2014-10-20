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
    'util/event',
    'util/auto/scroll'
],function(NEJ,_k,_v,_e,_u,_t,_x,_p,_o,_f,_r,_pro){
    /**
     * 排序功能封装
     * 
     * @class   module:util/sort/sortable._$$Sortable
     * @extends module:util/event._$$EventTarget
     * 
     * @param    {Object} conifg      - 可选配置参数
     * @property {Node}   parent      - 容器节点
     * @property {Node}   viewport    - 滚动条所在容器，拖拽超出此容器自动滚动
     * @property {String} clazz       - 可排序节点的类标识，默认为j-sortable
     * @property {String} trigger     - 触发排序节点的类标识，默认为clazz标识的节点
     * @property {Node}   placeholder - 占位符，用于标识插入位置
     * @property {Node}   thumbnail   - 移动缩略图，跟随鼠标移动
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
    /** 
     * 排序缩略图更新事件 
     * 
     * @event    module:util/sort/sortable._$$Sortable#onthumbupdate
     * @param    {Object}     event   - 事件信息
     * @property {Varable}    state   - 状态值，1-开始排序，2-排序中，3-排序结束
     * @property {Number}     top     - 鼠标距页面顶部位置
     * @property {Number}     left    - 鼠标距页面左侧位置
     * @property {Node}       target  - 缩略图节点
     * @property {Node|Array} source  - 排序节点或者节点列表
     * @property {Boolean}    stopped - 是否阻止后续逻辑
     */
    /** 
     * 排序占位符更新事件
     * 
     * @event    module:util/sort/sortable._$$Sortable#onholderupdate
     * @param    {Object}     event    - 事件信息
     * @property {Number}     top      - 鼠标相对于容器顶部偏移量
     * @property {Number}     left     - 鼠标相对于容器左侧偏移量
     * @property {Number}     width    - 排序节点宽度
     * @property {Number}     height   - 排序节点高度
     * @property {String}     position - 占位符插入位置，beforeBegin/afterEnd
     * @property {Node}       target   - 占位符节点
     * @property {Node|Array} source   - 排序节点或者节点列表
     * @property {Node}       ref      - 插入点参考节点
     * @property {Boolean}    stopped  - 是否阻止后续逻辑
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
        this.__trigger = _options.trigger||this.__clazz;
        this.__selected = _options.selected||'j-selected';
        this.__viewport = _e._$get(_options.viewport);
        this.__parent = _e._$get(_options.parent);
        this.__holder = _e._$get(_options.placeholder);
        this.__thumb  = _e._$get(_options.thumbnail);
        _e._$removeByEC(this.__thumb);
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
        this.__super();
        this.__doClearSort();
    };
    /**
     * 取滚动条所在容器
     * @return {Void}
     */
    _pro.__getScrollParent = function(){
        var _parent = this.__parent;
        if (_parent.scrollHeight>_parent.offsetHeight){
            return _parent;
        }
        return _e._$getScrollViewPort(_parent);
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
            this.__doUpdateThumb(3);
            _e._$removeByEC(this.__holder);
            _unSelect(this.__lsort,this.__selected);
            if (!!this.__auto){
                this.__auto._$recycle();
                delete this.__auto;
            }
            delete this.__lsort;
            delete this.__place;
            delete this.__offset;
        };
    })();
    /**
     * 更新缩略图
     * @return {Void}
     */
    _pro.__doUpdateThumb = function(_flag,_pointer){
        if (!this.__thumb) return;
        // check thumb update
        _pointer = _pointer||_o;
        var _event = {
            // 1 - first, 2 - doing, 3 - end
            state:_flag, 
            top:_pointer.y||0,
            left:_pointer.x||0,
            target:this.__thumb,
            source:this.__lsort
        };
        this._$dispatchEvent(
            'onthumbupdate',_event
        );
        // sort end
        if (_flag==3){
            _e._$removeByEC(this.__thumb);
            return;
        }
        // user updated
        document.body.appendChild(this.__thumb);
        if (!!_event.stopped){
            return;
        }
        // update position
        _e._$style(
            this.__thumb,{
                top:_event.top+'px',
                left:_event.left+'px'
            }
        );
    };
    /**
     * 更新缩略图
     * @return {Void}
     */
    _pro.__doUpdateHolder = (function(){
        var _getOverBox = function(_from,_to){
            var _offset = _e._$offset(_from,_to);
            return {
                top:_offset.y,
                left:_offset.x,
                width:_from.clientWidth,
                height:_from.clientHeight
            };
        };
        return function(_element,_pointer){
            // calculate placeholder position
            this.__parent.appendChild(this.__holder);
            var _obox = _getOverBox(_element,this.__parent);
            this.__place = this.__doCalPlaceHolder(
                _obox,{
                    top:_pointer.y-_obox.top-this.__offset.y,
                    left:_pointer.x-_obox.left-this.__offset.x
                }
            );
            this.__place.ref = _element; 
            this.__place.source = this.__lsort;
            this.__place.target = this.__holder;
            // check placeholder update
            this._$dispatchEvent(
                'onholderupdate',this.__place
            );
            if (!!this.__place.stopped){
                return;
            }
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
        // check sortable trigger element
        var _element = _v._$getElement(
            _event,'c:'+this.__trigger
        );
        if (!_element) return;
        _v._$stop(_event);
        // dump sort element
        this.__lsort = _element;
        if (!_e._$hasClassName(
               _element,this.__clazz
           )){
            this.__lsort = _v._$getElement(
                _event,'c:'+this.__clazz
            );
        }
        // update selected
        _e._$addClassName(
            this.__lsort,
            this.__selected
        );
        // check before sort for multi-selection
        try{
            var _eobj = {
                target:this.__lsort
            };
            this._$dispatchEvent(
                'onbeforesort',_eobj
            );
            if (!!_eobj.value){
                this.__lsort = 
                    _eobj.value||this.__lsort;
            }
        }catch(ex){
            // ignore
        }
        // holder info
        this.__offset = _e._$offset(this.__parent);
        this.__doUpdateThumb(1,{
            x:_v._$clientX(_event),
            y:_v._$clientY(_event)
        });
        // for auto scroll
        var _node = _u._$isArray(this.__lsort)
                  ? this.__lsort[0]:this.__lsort;
        this.__auto = _x._$$SmartScroll._$allocate({
            viewport:this.__getScrollParent(),
            step:_node.offsetHeight/5
        });
    };
    /**
     * 排序过程
     * 
     * @protected
     * @method module:util/sort/sortable._$$Sortable#__onSorting
     * @return {Void}
     */
    _pro.__onSorting = function(_event){
        if (!this.__lsort) return;
        var _element = _v._$getElement(
            _event,'c:'+this.__clazz
        );
        if (!_element) return;
        // single selection
        if (_element==this.__lsort){
            delete this.__place;
            _e._$removeByEC(this.__holder);
            return;
        }
        // update thumbnail
        this.__doUpdateThumb(2,{
            x:_v._$clientX(_event),
            y:_v._$clientY(_event)
        });
        // update placeholder
        this.__doUpdateHolder(
            _element,{
                x:_v._$pageX(_event),
                y:_v._$pageY(_event)
            }
        );
    };
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
