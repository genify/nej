/*
 * ------------------------------------------
 * 三段分页器业务逻辑封装实现文件
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
        _x = _('nej.x'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$Page) return;
    /**
     * 三段分页器业务逻辑封装，适合于以下形式的分页器<br />
     * 此结构没有首页，末页，因为首页，末页都可点击
     * <ul>
     *     ____    _       _   _   _   _   _       ___    ____
     *    |上一页|  |1| ... |5| |6| |7| |8| |9| ... |100|  |下一页|
     *     ----    -       -   -   -   -   -       ---    ----
     * </ul>
     * 页面结构举例
     * [code type="html"]
     *   <div id="pagebox">
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
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   var e = NEJ.P('nej.e');
     *   var _box = e._$get('pagebox');
     *   var _pg = e._$page(_box,{
     *       event:'click',
     *       index:9,
     *       total:10,
     *       onchange:function(_obj){
     *           // 返回页码信息，last:上一次页面,index:当前页面，total:总页数
     *       }
     *   });
     *   // 翻到第4页
     *   _pg._$setIndex(4);
     *   // 改变总页数,状态复原到第一页
     *   _pg._$getTotal(20);
     *   // 想要保持页面信息状态
     *   _pg._$updatePage(5,10);
     * [/code]
     * @class   {nej.ut._$$Page} 三段分页器业务逻辑封装
     * @extends {nej.ut._$$AbstractPage}
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
     * @event  {onchange} 切换页面处理
     * @param  {Object} 页码信息
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total 总页面数
     * 
     */
    _p._$$Page = NEJ.C();
    _pro = _p._$$Page._$extend(_p._$$AbstractPage);
    /**
     * 初始化控件
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__supInit();
        var _node = _e._$create('span','zdot');
        _node.innerText = '...';
        this.__ndot = [_node.cloneNode(true),_node];
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        this.__doRecycleDotNode();
    };
    /**
     * 回收省略节点
     * @protected
     * @method {__doRecycleDotNode}
     * @return {Void}
     */
    _pro.__doRecycleDotNode = function(){
        _e._$removeByEC(this.__ndot[0]);
        _e._$removeByEC(this.__ndot[1]);
    };
    /**
     * 刷新页码列表算法
     * @protected
     * @method {__doRefreshPage}
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
                this.__list[0].insertAdjacentElement(
                    'afterEnd',this.__ndot[0]
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
                this.__list[_point].insertAdjacentElement(
                    'beforeBegin',this.__ndot[1]
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
    /**
     * 分页器加入分页算法
     * [code]
     *    // 构建一个pager控件
     *    nej.e._$page('abc',{
     *        index:2,
     *        total:10,
     *        onchange:function(_event){}
     *    });
     *    // 调用page控件接口
     *    nej.e._$page('abc')._$setIndex(5);
     *    // 回收page控件
     *    nej.e._$page('abc')._$recycle();
     * [/code]
     * @api    {nej.e._$page}
     * @param  {String|Node} 分页器容器节点
     * @param  {Object}      可选配置参数，参见nej.ut._$$Page控件的可选配置参数
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
     * @config  {String}         clazz       需要做Page控件封装的节点标识，如没有此参数则选取父节点下的所有子节点
     * @return  {Function}                   控件实例
     */
    _e._$page = 
    _x._$page = function(_parent,_options){
        var _id = _e._$id(_parent);
        if (!_id) return null;
        if (!_p._$api(_id,_p._$$Page)){
            _options = _options||{};
            var _list = !_options.clazz
                        ? _e._$getChildren(_id)
                        : _e._$getByClassName(_id,_options.clazz);
            _options.pbtn = _list.shift();
            _options.nbtn = _list.pop();
            _options.list = _list;
            delete _options.clazz;
        }
        return _p._$api(_id,_p._$$Page,_options||_o);
    };
    _x.isChange = !0;
};
NEJ.define(
    '{lib}util/page/page.js',[
    '{lib}util/page/page.base.js'
],f);