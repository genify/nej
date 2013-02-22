/*
 * ------------------------------------------
 * 一段分页器业务逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proSimplePage;
    if (!!_p._$$SimplePage) return;
    /**
     * 一段分页器业务逻辑封装，主要适合于以下形式的分页器
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
     *   var _page = e._$get('page');
     *   var _ps = t._$$SimplePage._$allocate({
     *       list:e._$getByClassName(_page,'zpgi'),
     *       event:'click',
     *       pbtn:e._$getByClassName(_page,'zprv')[0],
     *       nbtn:e._$getByClassName(_page,'znxt')[0],
     *       sbtn:e._$getByClassName(_page,'sbtn')[0],
     *       ebtn:e._$getByClassName(_page,'ebtn')[0],
     *       index:90,
     *       total:100,
     *       onchange:function(_obj){
     *           // 返回页码信息，last:上一次页面,index:当前页面，total:总页数
     *       }
     *   });
     *   // 翻到第4页
     *   _ps._$setIndex(4);
     *   // 改变总页数,状态复原到第一页
     *   _ps._$getTotal(20);
     *   // 想要保持页面信息状态
     *   _ps._$updatePage(5,10);
     * [/code]
     * @class   {nej.ut._$$SimplePage} 一段分页器业务逻辑封装
     * @extends {nej.ut._$$_$$PageBase}
     * @param   {Object} 可选配置参数，已处理参数列表如下
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
     * 
     * @event  {onchange} 页码变化触发事件，输入{last:3,index:1,total:12}
     * @param  {Object} 页码信息
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total 总页面数
     * 
     */
    _p._$$SimplePage = NEJ.C();
      _proSimplePage = _p._$$SimplePage._$extend(_p._$$PageBase);
    /**
     * 刷新页码列表算法
     * @protected
     * @method {__doRefreshPage}
     * @return {Void}
     */
    _proSimplePage.__doRefreshPage = function(){
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
};
NEJ.define('{lib}util/page/page.simple.js',
      ['{lib}util/page/page.base.js'],f);