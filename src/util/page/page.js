/*
 * ------------------------------------------
 * 三段分页器业务逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/page/page */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    './base.js'
],function(NEJ,_k,_e,_u,_t,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 三段分页器业务逻辑封装，适合于以下形式的分页器
     * 
     * 此结构没有首页，末页，因为首页，末页都可点击
     * 
     * ```
     *     ____      _       _   _   _   _   _       ___    ____
     *    |上一页|  |1| ... |5| |6| |7| |8| |9| ... |100|  |下一页|
     *     ----      -       -   -   -   -   -       ---    ----
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="pagebox">
     *   <a href="#" class="zbtn zprv">上一页</a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zbtn znxt">下一页</a>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/element',
     *     'util/page/page'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _page  = _t._$$PageFragment._$allocate({
     *         parent:'pagebox',
     *         event:'click',
     *         index:9,
     *         total:10,
     *         onchange:function(_event){
     *             // 返回页码信息，last:上一次页面,index:当前页面，total:总页数
     *         }
     *     });
     *     
     *     // 翻到第4页
     *     _page._$setIndex(4);
     *     // 改变总页数,状态复原到第一页
     *     _page._$getTotal(20);
     *     // 想要保持页面信息状态
     *     _page._$updatePage(5,10);
     * })
     * ```
     * 
     * @class    module:util/page/page._$$PageFragment
     * @extends  module:util/page/base._$$PageAbstract
     * 
     * @param    {Object}      config   - 可选配置参数
     * @property {Array}       list     - 页码节点列表【长度保持奇数】
     * @property {String}      event    - 触发页码切换事件，默认为click
     * @property {String|Node} pbtn     - 上一页按钮
     * @property {String|Node} nbtn     - 下一页按钮
     * @property {String|Node} sbtn     - 首页按钮
     * @property {String|Node} ebtn     - 尾页按钮
     * @property {Number}      index    - 当前页码
     * @property {Number}      total    - 总页码数
     * @property {String}      selected - 选中样式，默认为js-selected
     * @property {String}      disabled - 禁用样式，默认为js-disabled
     */
    _p._$$PageFragment = _k._$klass();
    _pro = _p._$$PageFragment._$extend(_t._$$PageAbstract);
    /**
     * 初始化控件
     * 
     * @protected
     * @method module:util/page/page._$$PageFragment#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__ndot = [];
        this.__super();
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/page/page._$$PageFragment#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__doRecycleDotNode();
    };
    /**
     * 回收省略节点
     * 
     * @protected
     * @method module:util/page/page._$$PageFragment#__doRecycleDotNode
     * @return {Void}
     */
    _pro.__doRecycleDotNode = (function(){
        var _doRecycle = function(_node,_index,_list){
            _e._$remove(_node);
            _list.splice(_index,1);
        };
        return function(){
            _u._$reverseEach(
                this.__ndot,_doRecycle
            );
        };
    })();
    /**
     * 刷新页码列表算法
     * 
     * @protected
     * @method module:util/page/page._$$PageFragment#__doRefreshPage
     * @return {Void}
     */
    _pro.__doRefreshPage = function(){
        this.__extdata = {
            last:!1,
            first:!1,
            list:this.__list
        };
        this.__doRecycleDotNode();
        this.__doSetNodeIndex(this.__list[0],1);
        // for total<length
        var _point = 1,
            _length = this.__list.length;
        if (this.__total<_length){
            for(var _page;_point<_length;_point++){
                _page = _point+1;
                this.__doSetNodeIndex(
                    this.__list[_point],
                    _page>this.__total?null:_page
                );
            }
            return;
        }
        // 2 -> index
        if (this.__index>1){
            var _count = Math.floor((_length-2)/2),
                _mxbeg = this.__total-_length+2,
                _start = Math.max(2,this.__index-_count);
            if (this.__total>=_length){
                _start = Math.min(_start,_mxbeg);
            }
            if (_start>2){
                var _node = _e._$create('span','zdot');
                this.__ndot.push(_node);
                _node.innerText = '...';
                this.__list[0].insertAdjacentElement(
                    'afterEnd',_node
                );
                this.__extdata.first = !0;
            }
            for(var _index;;_point++){
                _index = _start+_point-1;
                if (_index>this.__index)
                    break;
                this.__doSetNodeIndex(
                    this.__list[_point],_index
                );
            }
        }
        // index -> total
        if (this.__index<this.__total){
            var _index,_start = this.__index+1;
            for(var i=0,l=_length-2;;i++,_point++){
                _index = _start+i;
                if (_point>l||_index>this.__total)
                    break;
                this.__doSetNodeIndex(
                    this.__list[_point],_index
                );
            }
            if (_index<this.__total){
                var _node = _e._$create('span','zdot');
                this.__ndot.push(_node);
                _node.innerText = '...';
                this.__list[_point].insertAdjacentElement(
                    'beforeBegin',_node
                );
                this.__extdata.last = !0;
            }
            if (_index<=this.__total){
                this.__doSetNodeIndex(
                    this.__list[_point++],
                    this.__total
                );
            }
        }
        // hidden point -> length
        for(;_point<_length;_point++){
            this.__doSetNodeIndex(this.__list[_point]);
        }
    };

    if (CMPT){
        NEJ.P('nej.ut')._$$Page = _p._$$PageFragment;
    }

    return _p;
});