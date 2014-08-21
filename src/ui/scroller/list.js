/*
 * ------------------------------------------
 * 列表滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/scroller/list */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/base',
    'ui/scroller/scroller.y',
    'ui/pullrefresh/puller'
],function(NEJ,_k,_e,_u,_i,_i0,_i1,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css;
    /**
     * 列表滚动控件
     *
     * @class     module:ui/scroller/list._$$ListScroller
     * @extends   module:ui/base._$$Abstract
     * @param     {Object} arg0   - 可选配置参数
     * @property  {module:ui/scroller/y._$$ScrollerY.Config} config - 滚动参数配置信息
     */
    /**
     * 列表滚动触发事件
     *
     * @event  module:ui/scroller/list._$$ListScroller#onscroll 列表滚动触发事件
     * @param  {Number} offset - 当前位置
     */
    /**
     * 弹性触发事件
     *
     * @event    module:ui/scroller/list._$$ListScroller#onbounce
     * @param    {Object} arg0      - 弹性信息
     * @property {Number} movement  - 偏移量
     * @property {Number} direction - 方向
     * |       数值 |  含义                     |
     * |       :--- |  :---                     |
     * |       <0   |  正向滚动(远离顶部的滚动) |
     * |       >0   |  反向滚动(接近顶部的滚动) |
     */
    /**
     * 弹性开始时触发事件
     *
     * @event  module:ui/scroller/list._$$ListScroller#onbouncestart
     */
    /**
     * 列表更新触发事件
     *
     * @event  module:ui/scroller/list._$$ListScroller#onlistupdate
     * @param  {Node} arg0 - 更新后的节点
     */
    /**
     * 列表清除之前触发事件
     *
     * @event  module:ui/scroller/list._$$ListScroller#onbeforeclear
     * @param  {Node} arg0 - 缓存的节点
     */
    _p._$$ListScroller = _k._$klass();
    _pro = _p._$$ListScroller._$extend(_i._$$Abstract);
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__cache = {};
        this.__nlist = e._$create('div','z-list');
        this.__sopt  = {container:this.__body,style:'z-bar',
                        onscroll:this.__onScrolling._$bind(this),
                        onbounce:this.__onScrollBounce._$bind(this),
                        onrelease:this.__onScrollRelease._$bind(this),
                        onbouncestart:this._$dispatchEvent._$bind(this,'onbouncestart')};
    };
    /**
     * 控件重置
     *
     * @protected
     * @method   module:ui/scroller/list._$$ListScroller#__reset
     * @param    {Object} arg0 - 可选配置参数
     * @property {module:ui/scroller/y._$$ScrollerY.Config} config - 滚动参数配置信息
     * @return   {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__body.appendChild(this.__nlist);
        this.__sopt.parent = this.__parent;
        this.__sopt.config = _options.config;
        this.__scroller = p._$$ScrollerY._$allocate(this.__sopt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this._$setList();
        e._$removeByEC(this.__nlist);
        this.__super();
        if (!!this.__puller)
            this.__puller = this.__puller.constructor
                                ._$recycle(this.__puller);
        this.__scroller = p._$$ScrollerY._$recycle(this.__scroller);
    };
    /**
     * 内容封装
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doParseWrapBox
     * @param  {String} arg0 - 内容
     * @return {Node}   封装后的内容节点
     */
    _pro.__doParseWrapBox = function(_html){
        if (!_html) return null;
        var _node = e._$create('div','z-box');
        _node.id = 'box-' + _u._$randNumberString();
        _node.innerHTML = _html;
        return _node;
    };
    /**
     * 列表清理
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformListClear
     * @return {Void}
     */
    _pro.__doPerformListClear = function(){
        var _list = e._$getChildren(this.__nlist);
        if (!_list||!_list.length) return;
        for(var i=0,l=_list.length,_id,_box;i<l;i++){
            _box = _list[i]; _id = _box.id;
            _box = this.__cache[_id]||_box;
            delete this.__cache[_id];
            this._$dispatchEvent('onbeforeclear',_box);
        }
    };
    /**
     * 图片延时载入优化
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformImage
     * @param  {Node} arg0 -    容器节点
     * @return {Boolean} 是否存在未处理的图片
     */
    _pro.__doPerformImage = function(_node){
        if (!!_node.finished) return;
        var _ndpf = !1,
            _images = _node.getElementsByTagName('img');
        if (!!_images&&!!_images.length)
            for(var i=0,l=_images.length,_image,_src;i<l;i++){
                _image = _images[i];
                _src   = e._$dataset(_image,'src');
                if (!_src) continue;
                if (!this.__scroller._$isInViewPoint(_image)){
                    _ndpf = !0; continue;
                }
                _image.src = _src;
                e._$dataset(_image,'src','');
            }
        if (!_ndpf) _node.finished = !0;
    };
    /**
     * 优化节点的显示
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformNode
     * @param  {Node} arg0 - 节点
     * @return {Void}
     */
    _pro.__doPerformNode = function(_node){
        this.__scroller._$isInViewPoint(_node)
        ? this.__doPerformAppend(_node.id)
        : this.__doPerformRecycle(_node.id);
    };
    /**
     * 执行节点追加
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformAppend
     * @param  {String} arg0 - 节点ID
     * @return {Void}
     */
    _pro.__doPerformAppend = function(_id){
        var _parent = e._$get(_id),
            _children = this.__cache[_id];
        if (!!_parent&&!!_children){
            _parent.appendChild(_children);
            _parent.style.height = 'auto';
        }
        delete this.__cache[_id];
        this.__doPerformImage(_parent);
    };
    /**
     * 执行节点回收
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformRecycle
     * @param  {String} arg0 - 节点ID
     * @return {Void}
     */
    _pro.__doPerformRecycle = function(_id){
        var _parent = e._$get(_id);
        if (!_parent||!!this.__cache[_id]) return;
        var _fragment = document.createDocumentFragment();
        this.__cache[_id] = _fragment;
        _parent.style.height = _parent.scrollHeight+'px';
        var _children = e._$getChildren(_parent);
        if (!_children||!_children.length) return;
        var _element = _children.shift();
        while(!!_element){
            _fragment.appendChild(_element);
            _element = _children.shift();
        }
    };
    /**
     * 优化滚动
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__doPerformWithTimer
     * @return {Void}
     */
    _pro.__doPerformWithTimer = function(){
        var _list = e._$getChildren(this.__nlist);
        if (!_list||!_list.length) return;
        this.__doPerformImage(_list[0]);
        for(var i=1,l=_list.length,_id,_tmp0;i<l;i++){
            _id = _list[i].id;
            _tmp0 = this.__scroller._$isInViewPoint(_list[i]);
            _tmp0 ? this.__doPerformAppend(_id)
                  : this.__doPerformRecycle(_id);
        }
    };
    /**
     * 滚动事件
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__onScrolling
     * @param  {Number} arg0 - 当前位置
     * @return {Void}
     */
    _pro.__onScrolling = (function(){
        var _timer = null;
        return function(_offset){
            if (!_timer)
                _timer = window.setTimeout(function(){
                    _timer = window.clearTimeout(_timer);
                    this.__performed ? this.__doPerformWithTimer()
                                     : this.__doPerformImage(this.__nlist);
                }._$bind(this),150);
            this._$dispatchEvent('onscroll',_offset);
        };
    })();
    /**
     * 滚动结束
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__onScrollRelease
     * @return {Void}
     */
    _pro.__onScrollRelease = function(_event){
        if (!this.__puller||
             this.__puller._$getState()!=1) return;
        // auto revert bounce to state bar
        _event.offset = this.__puller._$getRange();
        this.__puller._$setState(2);
        window.setTimeout(function(){
            this.__puller._$dispatchEvent('onrefresh');
        }._$bind(this),250);
    };
    /**
     * 滚动弹性
     *
     * @protected
     * @method module:ui/scroller/list._$$ListScroller#__onScrollBounce
     * @param  {Object} arg0 - 弹性信息
     * @return {Void}
     */
    _pro.__onScrollBounce = function(_event){
        var _distance = _event.movement||0;
        if (!!this.__puller&&_distance>0&&
            this.__puller._$getState()!=2)
            this.__puller._$setState(this.__puller
                         ._$isOutThreshold(_distance)?1:0);
        this._$dispatchEvent('onbounce',_event);
    };
    /**
     * 执行性能优化
     *
     * @method module:ui/scroller/list._$$ListScroller#_$performance
     * @return {Void}
     */
    _pro._$performance = function(){
        this.__performed = !0;
    };
    /**
     * 绑定下拉更新控件
     *
     * @method module:ui/scroller/list._$$ListScroller#_$bindPuller
     * @param  {nej.ui._$$Puller} arg0 - 下拉更新控件
     * @return {Void}
     */
    _pro._$bindPuller = function(_puller){
        if (!(_puller instanceof p._$$Puller)) return;
        if (!!this.__puller){
            _puller._$setState(this.__puller._$getState());
            this.__puller.constructor._$recycle(this.__puller);
        }
        this.__puller = _puller;
        this.__body.insertAdjacentElement(
            'afterBegin',this.__puller._$getBody());
    };
    /**
     * 追加更多列表
     *
     * @method module:ui/scroller/list._$$ListScroller#_$addMore
     * @param  {String} arg0 - 列表html代码
     * @return {Void}
     */
    _pro._$addMore = function(_html){
        var _node = this.__doParseWrapBox(_html);
        if (!!_node){
            this.__nlist.appendChild(_node);
            this.__doPerformImage(_node);
            this._$dispatchEvent('onlistupdate',_node);
        }
    };
    /**
     * 追加最新列表
     * @method module:ui/scroller/list._$$ListScroller#_$addLast
     * @param  {String} arg0 - 列表html代码
     * @return {Void}
     */
    _pro._$addLast = function(_html){
        this.__scroller._$revertBounce();
        window.setTimeout(function(){
            this.__puller._$setState(3);
            var _node = this.__doParseWrapBox(_html);
            if (!!_node){
                this.__nlist.insertAdjacentElement('afterBegin',_node);
                this.__doPerformImage(_node);
                this._$dispatchEvent('onlistupdate',_node);
            }
        }._$bind(this),250);
    };
    /**
     * 设置列表
     *
     * @method module:ui/scroller/list._$$ListScroller#_$setList
     * @param  {String} arg0 - 列表html代码
     * @return {Void}
     */
    _pro._$setList = function(_html){
        this.__doPerformListClear();
        this.__nlist.innerHTML = '';
        this._$addMore(_html);
        this._$scrollTop();
    };
    /**
     * 判断偏移是否在可视范围内
     *
     * @method module:ui/scroller/list._$$ListScroller#_$isInViewPoint
     * @param  {String|Node} arg0 - 检测节点
     * @return {Boolean}     是否在可视范围内
     */
    _pro._$isInViewPoint = function(_element){
        return this.__scroller._$isInViewPoint.apply(this.__scroller,arguments);
    };
    /**
     * 取当前滚动高度
     *
     * @method module:ui/scroller/list._$$ListScroller#_$getScrollTop
     * @return {Number} 滚动高度
     */
    _pro._$getScrollTop = function(){
        return this.__scroller._$getScrollTop.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至偏移位置
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollBy
     * @param  {Number}  delta   - 偏移量
     * @param  {Boolean} refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollBy = function(_delta,_refresh){
        this.__scroller._$scrollBy.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至指定位置
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollTo
     * @param  {Number}  delta   - 偏移量
     * @param  {Boolean} refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollTo = function(_offset,_refresh){
        this.__scroller._$scrollTo.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至顶部
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollTop
     * @param  {Boolean} arg0 - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollTop = function(_refresh){
        this.__scroller._$scrollTop.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至中部
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollMiddle
     * @param  {Boolean} arg0 - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollMiddle = function(_refresh){
        this.__scroller._$scrollMiddle.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至底部
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollBottom
     * @param  {Boolean} arg0 - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollBottom = function(_refresh){
        this.__scroller._$scrollBottom.apply(this.__scroller,arguments);
    };
    /**
     * 滚动到指定元素
     *
     * @method module:ui/scroller/list._$$ListScroller#_$scrollToElement
     * @param  {String|Node} element - 目标元素
     * @param  {Boolean}     refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollToElement = function(_element,_refresh){
        this.__scroller._$scrollToElement.apply(this.__scroller,arguments);
    };
    // ui css text
    _seed_css = _e._$pushCSSText('.#<uispace>{position:relative;}');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});