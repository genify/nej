/*
 * ------------------------------------------
 * 拖拽排序控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _o = NEJ.O,
        _f = NEJ.F,
        _e = NEJ.P('nej.e'),
        _v = NEJ.P('nej.v'),
        _u = NEJ.P('nej.u'),
        _p = NEJ.P('nej.ut'),
        __proSorter,
        __supSorter;
    if (!!_p._$$Sorter) return;
    /**
     * 拖拽排序器控件
     * [code type="html"]
     *    // html结构中排序节点用data-id属性来标识序列标识
     *    <div class="sort-parent">
     *      <div class="js-item" data-id="1">xxxx</div>
     *      <div class="js-item" data-id="2">xxxx</div>
     *      <div class="js-item" data-id="3">xxxx</div>
     *    </div>
     * [/code]
     * @class   {nej.ut._$$Sorter} 拖拽排序器
     * @uses    {nej.ut._$$MultiSelector}
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数,已处理参数列表如下所示
     * @config  {Node|String}               holder   占位节点
     * @config  {Node|String}               mover    移动示意节点
     * @config  {nej.ut._$$MultiSelector}   selector 选择器控件
     * 
     * [hr]
     * 
     * @event  {onbeforesort} 排序开始触发事件
     * @param  {Object} 可选配置参数
     * @config {Node|String} mover 移动示意节点
     * @config {Number}      count 选中的节点总数量
     * [hr]
     * 
     * @event  {onaftersort} 排序结束触发事件
     * 
     * [hr]
     * 
     * @event  {onsort} 排序过程触发事件
     * @param  {Object} 可选配置参数
     * @config {Number} x 节点横坐标
     * @config {Number} y 节点纵坐标
     * 
     */
    _p._$$Sorter = NEJ.C();
    __proSorter = _p._$$Sorter._$extend(_p._$$Event);
    __supSorter = _p._$$Sorter._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    __proSorter.__init = function(){
        this.__eopt = {
            end:this.__onSortEnd._$bind(this)
           ,move:this.__onSortCheck._$bind(this)
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proSorter.__reset = function(_options){
        this.__supReset(_options);
        this.__selector = _options.selector;
        this.__holder = _e._$get(_options.holder);
        this.__mover = _e._$get(_options.mover);
        if (!!this.__selector)
            this.__selector._$setEvent('onchange',
                   this.__onSortFlag._$bind(this));
        this.__doInitDomEvent([
            [document,'mouseup',this.__eopt.end],
            [document,'mousemove',this.__eopt.move]
        ]);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proSorter.__destroy = function(){
        this.__supDestroy();
        delete this.__flag;
        delete this.__drag;
        delete this.__mover;
        delete this.__holder;
        delete this.__selector;
        delete this.__from;
        delete this.__to;
    };
    /**
     * 计算排序项网格
     * @protected
     * @method {__doCalculateGrid}
     * @return {Void}
     */
    __proSorter.__doCalculateGrid = (function(){
        var _docalculate = function(_node){
            var _offset = _e._$offset(_node);
            _node.rng = {
                top:_offset.y
               ,left:_offset.x
               ,right:_offset.x+_node.offsetWidth
               ,bottom:_offset.y+_node.offsetHeight
            };
        };
        return function(){
            this.__list = this.__selector._$getList();
            _u._$forEach(this.__list,_docalculate);
        };
    })();
    /**
     * 计算占位符位置
     * @protected
     * @method {__doCalculateHolderPosition}
     * @param  {Number} 顶部偏移
     * @param  {Number} 左侧偏移
     * @return {Void}
     */
    __proSorter.__doCalculateHolderPosition = (function(){
        var _inrange = function(_pointer,_range){
            return _pointer.x>=_range.left&&
                   _pointer.x<=_range.right&&
                   _pointer.y>=_range.top&&
                   _pointer.y<=_range.bottom;
        };
        return function(_offset){
            var _index = 0,_inner = false,
                _list = this.__selector._$getList();
            for(var l=_list.length;_index<l;_index++){
                if (_inrange(_offset,_list[_index].rng)){
                    _inner = true;
                    break;
                }
            }
            return _inner?_index:-1;
        };
    })();
    /**
     * 拖拽标记
     * @protected
     * @method {__onSortFlag}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    __proSorter.__onSortFlag = function(_event){
        if (!_event) return;
        this.__drag = !0;
    };
    /**
     * 排序检测
     * @protected
     * @method {__onSortCheck}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    __proSorter.__onSortCheck = function(_event){
        if (!this.__drag) return;
        var _list = this.__selector._$getSelection();
        if (!_list.length) return;
        if (!this.__flag)
            this.__onSortStart(_event);
        this.__onSorting(_event);
    };
    /**
     * 开始排序
     * @protected
     * @method {__onSortStart}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    __proSorter.__onSortStart = function(_event){
        this.__flag = !0;
        var _list = this.__selector._$getSelection(true).list,
            _options = {mover:this.__mover
                       ,count:_list.length};
        this.__from = _list[0];
        this.__doCalculateGrid();
        document.body.appendChild(this.__mover);
        this._$dispatchEvent('onbeforesort',_options);
    };
    /**
     * 排序过程
     * @protected
     * @method {__onSorting}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    __proSorter.__onSorting = function(_event){
        var _offset  = {x:_v._$pageX(_event)
                       ,y:_v._$pageY(_event)},
            _options = {x:_offset.x,y:_offset.y},
            _style   = this.__mover.style;
        this._$dispatchEvent('onsort',_options);
        _style.top = (_options.y-3)+'px';
        _style.left = (_options.x-3)+'px';
        this.__to = this.__doCalculateHolderPosition(_offset);
        _style.cursor = (this.__to < 0) ? 'not-allowed' : 'move';

    };
    /**
     * 结束排序
     * @protected
     * @method {__onSortEnd}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    __proSorter.__onSortEnd =(function(){
        // 检查顺序有没有改变
        var _doCheckSort = function(){
            _u._$forEach(this.__list,function(_item,_i){
                if(this.__from == _item)
                    this.__from = _i;
            }._$bind(this));
            if(this.__from == this.__to)
                return true;
        };
        // 排序
        var _doSort = function(){
            var _item = this.__list[this.__from];
            this.__list.splice(this.__from,1);
            this.__list.splice(this.__to,0,_item);
            this._$dispatchEvent('onaftersort',{
                list:this.__list
            });
        };
        return function(_event){
            if (!this.__flag) return;
            delete this.__flag;
            delete this.__drag;
            this.__selector._$clear();
            _e._$remove(this.__mover);
            if(this.__to < 0) return;
            if(_doCheckSort.call(this)) return;
            _doSort.call(this);
        };
    })();
};
NEJ.define('{lib}util/sorter/sorter.js',
      ['{lib}util/event.js'],f);