/*
 * ------------------------------------------
 * 滚动内存优化控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        r = NEJ.R,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        p = NEJ.P('nej.ut'),
        __cache = {}, // id:node
        __proScrollPerf,
        __supScrollPerf;
    if (!!p._$$ScrollPerf) return;
    /**
     * 滚动内存优化控件，限垂直方向
     * @class  {nej.ut._$$ScrollPerf} 滚动内存优化控件
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {Number} level 优化等级，计算位置时位置的缓存控制
     * [ntb]
     *   0 | 不做任何优化，每个优化项每次必须重新计算位置【默认】
     *   1 | 第一次计算位置，后续使用缓存数据
     * [/ntb]
     * @config {Number}      offset   当前可视节点的上下偏移个节点可见，如该参数为1则表示当前节点加前后1个节点（共3个节点）可见
     * @config {String|Node} viewport 滚动条所在的节点，默认为document.body
     * 
     * [hr]
     * 
     * @event  {onoptimize} 优化触发事件回调函数，输入优化放入内存或放入页面的节点
     * @param  {Node}       被操作的节点
     * 
     */
    p._$$ScrollPerf = NEJ.C();
    __proScrollPerf = p._$$ScrollPerf._$extend(p._$$Event);
    __supScrollPerf = p._$$ScrollPerf._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {Number} level 优化等级，计算位置时位置的缓存控制
     * [ntb]
     *   0 | 不做任何优化，每个优化项每次必须重新计算位置【默认】
     *   1 | 第一次计算位置，后续使用缓存数据
     * [/ntb]
     * @config {Number}      offset   当前可视节点的上下偏移个节点可见，如该参数为1则表示当前节点加前后1个节点（共3个节点）可见
     * @config {String|Node} viewport 滚动条所在的节点，默认为document.body
     * @return {Void}
     */
    __proScrollPerf.__reset = function(_options){
        this.__supReset(_options);
        this.__level = Math.max(0,
                       Math.min(1,parseInt(_options.level)||0));
        this.__number = Math.max(0,parseInt(_options.offset)||0);
        this.__viewport = e._$get(_options.viewport)||document.body;
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proScrollPerf.__destroy = function(){
        this.__supDestroy();
        delete this.__number;
        delete this.__viewport;
        delete this.__scrolltop;
    };
    /**
     * 检测节点是否在可视范围内
     * @protected
     * @method {__doCheckViewPort}
     * @param  {Node}   节点
     * @return {Number} 节点相对可视区域位置
     * [ntb]
     *      -1 | 区域在当前节点之上
     *      0  | 节点在可视区域中
     *      1  | 区域在当前节点之下
     * [/ntb]
     *                        
     */
    __proScrollPerf.__doCheckViewPort = function(_element){
        var _y0 = _element.t,
            _y1 = _element.b;
        if (_y0==null||_y1==null){
            var _offset = e._$offset(_element,this.__viewport),
            _y0 = _offset.y,
            _y1 = _y0+_element.offsetHeight;
            if (this.__level==1){
                _element.t = _y0;
                _element.b = _y1;
            }
        }
        if (_y1-this.__scrolltop<0) return 1;
        if (_y0-this.__scrolltop>this.__viewport.clientHeight) return -1;
        return 0;
    };
    /**
     * 解析视图范围内的节点
     * @protected
     * @method {__doParseListInViewPort}
     * @param  {Array}  列表
     * @param  {Number} 偏移
     * @return {Array}  视图范围内的索引[begin,end]
     */
    __proScrollPerf.__doParseListInViewPort = function(_list,_offset){
        if (!_list||!_list.length) return;
        // search first item in viewport
        var _index = u._$binSearch(_list,
                     this.__doCheckViewPort._$bind(this));
        if (_index<0) return;
        var _beg,_end;
        _offset = _offset||0;
        for(var i=1,_node;;i++){
            _node = _list[_index-i];
            if (_beg==null&&(!_node||
                this.__doCheckViewPort(_node)!==0))
                _beg = _index-i-_offset;
            _node = _list[_index+i];
            if (_end==null&&(!_node||
                this.__doCheckViewPort(_node)!==0))
                _end = _index+i+_offset;
            if (_beg!=null&&_end!=null) break;
        }
        return [_beg,_end];
    };
    /**
     * 优化图片延时载入
     * @protected
     * @method {__doPerformImage}
     * @param  {Node} 节点
     * @return {Void}
     */
    __proScrollPerf.__doPerformImage = function(_element){
        if (!!_element.finished) return;
        var _ndpf = !1,
            _list = _element.getElementsByTagName('img');
        for(var i=0,l=_list.length,_src,_img;i<l;i++){
            _img = _list[i];
            _src = e._$dataset(_img,'src');
            if (!_src) continue;
            if (!this.__doCheckViewPort(_img)){
                _ndpf = !0;
                continue;
            }
            e._$dataset(_img,'src','');
            _img.src = _src;
        }
        if (!_ndpf) _element.finished = !0;
    };
    /**
     * 执行优化追加
     * @protected
     * @method {__doPerformAppend}
     * @param  {Node} 节点
     * @return {Void}
     */
    __proScrollPerf.__doPerformAppend = function(_element){
        var _node = __cache[_element.id];
        if (!!_node){
            _element.insertAdjacentElement('beforeBegin',_node);
            delete __cache[_element.id];
            e._$remove(_element,true);
            _element = _node;
        }
        this.__doPerformImage(_element);
        if (!!_node){
            _element.memory = false;
            this._$dispatchEvent('onoptimize',_element);
        }
    };
    /**
     * 执行优化回收
     * @protected
     * @method {__doPerformRecycle}
     * @param  {Node} 节点
     * @return {Void}
     */
    __proScrollPerf.__doPerformRecycle = function(_element){
        var _cache = __cache[_element.id];
        if (!!_cache) return;
        var _id = u._$randString(8),
            _hold = e._$create('div','z-ph js-perf');
        __cache[_id] = _element;
        _hold.id = _id;
        _hold.t  = _element.t;
        _hold.b  = _element.b;
        _hold.innerHTML = '&nbsp;';
        _hold.style.height = _element.offsetHeight+'px';
        _element.insertAdjacentElement('beforeBegin',_hold);
        e._$removeByEC(_element);
        _element.memory = true;
        this._$dispatchEvent('onoptimize',_element);
    };
    /**
     * 优化图片显示，<img data-src="source image src"
     *              data-default="default image src"/>
     * @method {_$perfimage}
     * @param  {Number} 滚动条距顶部高度
     * @param  {Array}  待还原图片列表
     * @return {Array}  设置了原图的图片列表
     */
    __proScrollPerf._$perfimage = function(_offset,_list){
        this.__scrolltop = _offset||0;
        // reset image list to default src
        if (!!_list&&_list.length>0)
            for(var i=0,l=_list.length,_img,_src;i<l;i++){
                _img = _list[i];
                _src = e._$dataset(_img,'default');
                if (!!_src) _img.src = _src;
            }
        var _list = document.getElementsByTagName('img'),
            _range = this.__doParseListInViewPort(_list);
        if (!_range) return;
        // set image list to source src
        var _result = [];
        for(var i=_range[0]+1,_img,_src;i<_range[1];i++){
            _img = _list[i];
            _src = e._$dataset(_img,'src');
            if (!!_src&&_src!=_img.src)
                _img.src = _src;
            _result.push(_img);
        }
        return _result;
    };
    /**
     * 执行滚动优化，<div class="js-perf">content</div>
     * @method {_$performance}
     * @param  {Number} 滚动条距顶部高度
     * @return {nej.ut._$$ScrollPerf}
     */
    __proScrollPerf._$performance = function(_offset){
        this.__scrolltop = _offset||0;
        var _list = e._$getByClassName(this.__viewport,'js-perf'),
            _range = this.__doParseListInViewPort(_list,this.__number);
        if (!_range) return this;
        for(var i=0,l=_list.length,_beg=_range[0],_end=_range[1];i<l;i++)
            i>_beg&&i<_end ? this.__doPerformAppend(_list[i])
                           : this.__doPerformRecycle(_list[i]);
        return this;
    };
    /**
     * 取可视区域内的指定节点列表
     * @method {_$getListInViewPort}
     * @param  {Number} 滚动条偏移量
     * @param  {String} 节点标识
     * @return {Array}  区域内节点列表
     */
    __proScrollPerf._$getListInViewPort = function(_offset,_class){
        this.__scrolltop = _offset||0;
        var _list = e._$getByClassName(this.__viewport,_class),
            _range = this.__doParseListInViewPort(_list,this.__number);
        return !_range?null:_list.slice(_range[0]+1,_range[1]);
    };
};
define('{lib}util/profile/profile.js',
      ['{lib}base/element.js','{lib}util/event.js'],f);