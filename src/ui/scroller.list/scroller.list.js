/*
 * ------------------------------------------
 * 列表滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        u = NEJ.P('nej.u'),
        p = NEJ.P('nej.ui'),
        __proListScroller,
        __supListScroller;
    if (!!p._$$ListScroller) return;
    // ui css text
    var _seed_css = e._$pushCSSText('.#<uispace>{position:relative;}');
    /**
     * 列表滚动控件
     * @class   {nej.ui._$$ListScroller} 列表滚动控件
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     * @config  {Object} config 滚动参数配置信息
     * 
     * [hr]
     * 
     * @event  {onscroll} 列表滚动触发事件
     * @param  {Number} _offset 当前位置
     * 
     * [hr]
     * 
     * @event  {onbounce} 弹性触发事件
     * @param  {Object} 弹性信息
     * @config {Number} movement  偏移量
     * @config {Number} direction 方向
     * [ntb]
     *  正向滚动(远离顶部的滚动) | <0
     *  反向滚动(接近顶部的滚动) | >0
     * [/ntb]
     * 
     * [hr]
     * 
     * @event  {onbouncestart} 弹性开始时触发事件
     * 
     * [hr]
     * 
     * @event  {onlistupdate} 列表更新触发事件
     * @param  {Node} 更新后的节点
     * [hr]
     * 
     * @event  {onbeforeclear} 列表清除之前触发事件
     * @param  {Node} 缓存的节点
     */
    p._$$ListScroller = NEJ.C();
    __proListScroller = p._$$ListScroller._$extend(p._$$Abstract);
    __supListScroller = p._$$ListScroller._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proListScroller.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    __proListScroller.__initNode = function(){
        this.__supInitNode();
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
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proListScroller.__reset = function(_options){
        this.__supReset(_options);
        this.__body.appendChild(this.__nlist);
        this.__sopt.parent = this.__parent;
        this.__sopt.config = _options.config;
        this.__scroller = p._$$ScrollerY._$allocate(this.__sopt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proListScroller.__destroy = function(){
        this._$setList();
        e._$removeByEC(this.__nlist);
        this.__supDestroy();
        if (!!this.__puller)
            this.__puller = this.__puller.constructor
                                ._$recycle(this.__puller);
        this.__scroller = p._$$ScrollerY._$recycle(this.__scroller);
    };
    /**
     * 内容封装
     * @protected
     * @method {__doParseWrapBox}
     * @param  {String} 内容
     * @return {Node}   封装后的内容节点
     */
    __proListScroller.__doParseWrapBox = function(_html){
        if (!_html) return null;
        var _node = e._$create('div','z-box');
        _node.id = 'box-'+u._$randNumberString();
        _node.innerHTML = _html;
        return _node;
    };
    /**
     * 列表清理
     * @protected
     * @method {__doPerformListClear}
     * @return {Void}
     */
    __proListScroller.__doPerformListClear = function(){
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
     * @protected
     * @method {__doPerformImage}
     * @param  {Node}    容器节点
     * @return {Boolean} 是否存在未处理的图片
     */
    __proListScroller.__doPerformImage = function(_node){
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
     * @protected
     * @method {__doPerformNode}
     * @param  {Node} 节点
     * @return {Void}
     */
    __proListScroller.__doPerformNode = function(_node){
        this.__scroller._$isInViewPoint(_node)
        ? this.__doPerformAppend(_node.id) 
        : this.__doPerformRecycle(_node.id);
    };
    /**
     * 执行节点追加
     * @protected
     * @method {__doPerformAppend}
     * @param  {String} 节点ID
     * @return {Void}
     */
    __proListScroller.__doPerformAppend = function(_id){
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
     * @protected
     * @method {__doPerformRecycle}
     * @param  {String} 节点ID
     * @return {Void}
     */
    __proListScroller.__doPerformRecycle = function(_id){
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
     * @protected
     * @method {__doPerformWithTimer}
     * @return {Void}
     */
    __proListScroller.__doPerformWithTimer = function(){
        var _list = e._$getChildren(this.__nlist);
        if (!_list||!_list.length) return;
        this.__doPerformImage(_list[0]);
        for(var i=1,l=_list.length,_id,_tmp0;i<l;i++){
            _id = _list[i].id;
            _tmp0 = this.__scroller._$isInViewPoint(_list[i]);
            _tmp0 ? this.__doPerformAppend(_id)
                  : this.__doPerformRecycle(_id);
        }
        /*
        for(var i=0,l=_list.length,_id,_tmp0,_tmp1=!1;i<l;i++){
            _id = _list[i].id;
            _tmp0 = this.__scroller._$isInViewPoint(_list[i]);
            _tmp0||_tmp1 ? this.__doPerformAppend(_id)
                         : this.__doPerformRecycle(_id);
            _tmp1 = _tmp0;
        }
        */
    };
    /**
     * 滚动事件
     * @protected
     * @method {__onScrolling}
     * @param  {Number} 当前位置
     * @return {Void}
     */
    __proListScroller.__onScrolling = (function(){
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
     * @protected
     * @method {__onScrollRelease}
     * @return {Void}
     */
    __proListScroller.__onScrollRelease = function(_event){
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
     * @protected
     * @method {__onScrollBounce}
     * @param  {Object} 弹性信息
     * @return {Void}
     */
    __proListScroller.__onScrollBounce = function(_event){
        var _distance = _event.movement||0;
        if (!!this.__puller&&_distance>0&&
            this.__puller._$getState()!=2)
            this.__puller._$setState(this.__puller
                         ._$isOutThreshold(_distance)?1:0);
        this._$dispatchEvent('onbounce',_event);
    };
    /**
     * 执行性能优化
     * @method {_$performance}
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$performance = function(){
        this.__performed = !0;
        return this;
    };
    /**
     * 绑定下拉更新控件
     * @method {_$bindPuller}
     * @param  {nej.ui._$$Puller} 下拉更新控件
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$bindPuller = function(_puller){
        if (!(_puller instanceof p._$$Puller)) return;
        if (!!this.__puller){
            _puller._$setState(this.__puller._$getState());
            this.__puller.constructor._$recycle(this.__puller);
        }
        this.__puller = _puller;
        this.__body.insertAdjacentElement(
            'afterBegin',this.__puller._$getBody());
        return this;
    };
    /**
     * 追加更多列表
     * @method {_$addMore}
     * @param  {String} 列表html代码
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$addMore = function(_html){
        var _node = this.__doParseWrapBox(_html);
        if (!!_node){
            this.__nlist.appendChild(_node);
            this.__doPerformImage(_node);
            this._$dispatchEvent('onlistupdate',_node);
        }
        return this;
    };
    /**
     * 追加最新列表
     * @method {_$addLast}
     * @param  {String} 列表html代码
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$addLast = function(_html){
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
        return this;
    };
    /**
     * 设置列表
     * @method {_$setList}
     * @param  {String} 列表html代码
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$setList = function(_html){
        this.__doPerformListClear();
        this.__nlist.innerHTML = '';
        this._$addMore(_html);
        this._$scrollTop();
        return this;
    };
    /**
     * 判断偏移是否在可视范围内
     * @method {_$isInViewPoint}
     * @param  {String|Node} 检测节点
     * @return {Boolean}     是否在可视范围内
     */
    __proListScroller._$isInViewPoint = function(_element){
        return this.__scroller._$isInViewPoint.apply(this.__scroller,arguments);
    };
    /**
     * 取当前滚动高度
     * @method {_$getScrollTop}
     * @return {Number} 滚动高度
     */
    __proListScroller._$getScrollTop = function(){
        return this.__scroller._$getScrollTop.apply(this.__scroller,arguments);
    };
    /**
     * 滚动至偏移位置
     * @method {_$scrollBy}
     * @param  {Number}  偏移量
     * @param  {Boolean} 是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollBy = function(_delta,_refresh){
        this.__scroller._$scrollBy.apply(this.__scroller,arguments);
        return this;
    };
    /**
     * 滚动至指定位置
     * @method {_$scrollTo}
     * @param  {Number}  偏移量
     * @param  {Boolean} 是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollTo = function(_offset,_refresh){
        this.__scroller._$scrollTo.apply(this.__scroller,arguments);
        return this;
    };
    /**
     * 滚动至顶部
     * @method {_$scrollTop}
     * @param  {Boolean} 是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollTop = function(_refresh){
        this.__scroller._$scrollTop.apply(this.__scroller,arguments);
        return this;
    };
    /**
     * 滚动至中部
     * @method {_$scrollMiddle}
     * @param  {Boolean} 是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollMiddle = function(_refresh){
        this.__scroller._$scrollMiddle.apply(this.__scroller,arguments);
        return this;
    };
    /**
     * 滚动至底部
     * @method {_$scrollBottom}
     * @param  {Boolean} 是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollBottom = function(_refresh){
        this.__scroller._$scrollBottom.apply(this.__scroller,arguments);
        return this;
    };
    /**
     * 滚动到指定元素
     * @method {_$scrollToElement}
     * @param  {String|Node} 目标元素
     * @param  {Boolean}     是否需要刷新
     * @return {nej.ui._$$ListScroller}
     */
    __proListScroller._$scrollToElement = function(_element,_refresh){
        this.__scroller._$scrollToElement.apply(this.__scroller,arguments);
        return this;
    };
};
define('{lib}ui/scroller.list/scroller.list.js',
      ['{lib}ui/scroller/scroller.y.js'
      ,'{lib}ui/pullrefresh/puller.js'],f);
