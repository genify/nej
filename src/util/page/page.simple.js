/*
 * ------------------------------------------
 * 一段分页器业务逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/page/page.base.js',
    '{lib}base/util.js'
],function(NEJ,_k,_t,_u,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 一段分页器业务逻辑封装，主要适合于以下形式的分页器<br />
     * 此结构有首页，末页
     * <ul>
     *      ___   ____    _   _   _   __   __   ____   ___
     *     |首页| |上一页|  |7| |8| |9| |10| |11| |下一页| |尾页|
     *      ---   ----    -   -   -   --   --   ----   ---
     * </ul>
     * 页面结构举例
     * [code type="html"]
     *   <div id="page">
     *       <a href="#" class="zbtn sbtn">首页</a>
     *       <a href="#" class="zbtn zprv">上一页</a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zbtn znxt">下一页</a>
     *       <a href="#" class="zbtn ebtn">末页</a>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/page/page.simple.js',
     *       '{lib}base/element.js'
     *   ],function(_t,_e,_p,_o,_f,_r){
     *       var _page = _e._$get('page');
     *       var _ps = _t._$$SimplePage._$allocate({
     *           list:_e._$getByClassName(_page,'zpgi'),
     *           event:'click',
     *           pbtn:_e._$getByClassName(_page,'zprv')[0],
     *           nbtn:_e._$getByClassName(_page,'znxt')[0],
     *           sbtn:_e._$getByClassName(_page,'sbtn')[0],
     *           ebtn:_e._$getByClassName(_page,'ebtn')[0],
     *           index:90,
     *           total:100,
     *           onchange:function(_obj){
     *               // 返回页码信息，last:上一次页面,
     *               index:当前页面，total:总页数
     *           }
     *       });
     *       // 翻到第4页
     *       _ps._$setIndex(4);
     *       // 改变总页数,状态复原到第一页
     *       _ps._$getTotal(20);
     *       // 想要保持页面信息状态
     *       _ps._$updatePage(5,10);
     *   })
     * [/code]
     * @class   {_$$SimplePage}
     * @extends {util/page/page#_$$AbstractPage}
     * @param   {Object} 可选配置参数
     * @config  {Array}          list        页码节点列表【长度保持奇数】
     * @config  {String}         event       触发页码切换事件，默认为click
     * @config  {String|Node}    pbtn        上一页按钮
     * @config  {String|Node}    nbtn        下一页按钮
     * @config  {String|Node}    sbtn        首页按钮
     * @config  {String|Node}    ebtn        尾页按钮
     * @config  {Number}         index       当前页码
     * @config  {Number}         total       总页码数
     * @config  {String}         selected    选中样式，默认为js-selected
     * @config  {String}         disabled    禁用样式，默认为js-disabled
     *
     * [hr]
     * 页码变化触发事件，输入{last:3,index:1,total:12}
     * @event  {onchange}
     * @param  {Object} 页码信息
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total 总页面数
     *
     */
    _p._$$SimplePage = _k._$klass();
    _pro = _p._$$SimplePage._$extend(_t._$$AbstractPage);
    /**
     * 刷新页码列表算法
     * @protected
     * @method {__doRefreshPage}
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
     * @param  {Boolean} 是否禁用
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
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});