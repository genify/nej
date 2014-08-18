/*
 * ------------------------------------------
 * 一段分页器业务逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/page/simple */
NEJ.define([
    'base/global',
    'base/klass',
    'util/page/base',
    'base/util'
],function(NEJ,_k,_t,_u,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 一段分页器业务逻辑封装，主要适合于以下形式的分页器
     * 
     * 此结构有首页，末页
     * 
     * ```
     *      ___   ____    _   _   _   __   __   ____   ___
     *     |首页| |上一页|  |7| |8| |9| |10| |11| |下一页| |尾页|
     *      ---   ----    -   -   -   --   --   ----   ---
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="page">
     *   <a href="#" class="zbtn sbtn">首页</a>
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
     *   <a href="#" class="zbtn ebtn">末页</a>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/page/simple',
     *     'base/element'
     * ],function(_t,_e,_p,_o,_f,_r){
     *     var _list = _e._$getChildren('page');
     *     var _page = _t._$$PageSimple._$allocate({
     *         list:_e._$getByClassName('page','zpgi'),
     *         event:'click',
     *         pbtn:_list[1],
     *         nbtn:_list[11],
     *         sbtn:_list[0],
     *         ebtn:_list[12],
     *         index:90,
     *         total:100,
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
     * });
     * ```
     * 
     * @class    module:util/page/simple._$$PageSimple
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
    _p._$$PageSimple = _k._$klass();
    _pro = _p._$$PageSimple._$extend(_t._$$PageAbstract);
    /**
     * 刷新页码列表算法
     * 
     * @protected
     * @method module:util/page/simple._$$PageSimple#__doRefreshPage
     * @return {Void}
     */
    _pro.__doRefreshPage = function(){
        var _length = this.__list.length;
        if (!_length) return;
        var _middle = Math.floor(_length/2),
            _offset = Math.min(this.__total-_length+1,
                      Math.max(1,this.__index-_middle));
        _u._$forEach(this.__list,
            function(_node,_index){
                var _page = _offset+_index;
                this.__doSetNodeIndex(_node,
                      _page>this.__total||_page<1?null:_page);
            },this);
    };
    /**
     * 设置是否禁用下一页功能
     *
     * @method module:util/page/simple._$$PageSimple#_$disableNext
     * @param  {Boolean} arg0 - 是否禁用
     * @return {Void}
     */
    _pro._$disableNext = function(_disabled){
        if (!_disabled){
            this.__total = Number.MAX_VALUE;
        }else{
            this.__total = this.__index;
        }
        this.__doSyncBtnState();
    };

    if (CMPT){
        NEJ.P('nej.ut')._$$SimplePage = _p._$$PageSimple;
    }

    return _p;
});