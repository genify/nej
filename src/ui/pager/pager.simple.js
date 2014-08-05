/*
 * ------------------------------------------
 * 分页器控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}ui/pager/pager.base.js',
    '{lib}util/page/page.simple.js'
],function(_u,_t,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_html;
    /**
     * 分页器控件封装<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id="pagerCnt">page</div>
     *   <div id="pagerCnt2">page</div>
     * [/code]
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}ui/pager/pager.simple.js'
     *   ],function(_u,_p,_o,_f,_r){
     *       // 默认第一页
     *       var _setIndex = 1;
     *       // 页面更改的回调方法
     *       var _onchangeHandle = function(_obj){
     *           var _index = _obj.index;
     *       };
     *       // 实例化一个pager对象，总共10页
     *       var _pager = _u._$$Pager._$allocate({
     *           parent:'pagerCnt',
     *           onchange: _onchangeHandle,
     *           total: 10,
     *           index:_setIndex
     *       });
     *       // 从第2页翻到第10页
     *       for(var i = 2 ; i < 11 ; i++){
     *           _setIndex = i;
     *           _pager._$setIndex(_setIndex);
     *       }
     *       // 绑定一个翻页器,视觉上翻页器会联动，
     *       但最后触发一次翻页器的回调,避免重复触发
     *       _pager._$bind('pagerCnt2');
     *   })
     * [/code]
     * @class   {_$$Pager} 分页器控件封装
     * @uses    {util/page#_$$Page}
     * @extends {ui#_$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Number} index 当前页码
     * @config  {Number} total 总页码数
     *
     * [hr]
     *
     * @event  {onchange} 页码切换事件，输入{last:3,index:1,total:12}
     * @param  {Object} 页码状态对象
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total  总页面数
     *
     */
    _p._$$SimplePager = _k._$klass();
    _pro = _p._$$SimplePager._$extend(_u._$$AbstractPager);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        _options.number =
            parseInt(_options.number)||1;
        if (_options.total==null)
            _options.total = 10000;
        this.__supReset(_options);
        this.__page = _t._$$SimplePage._$allocate(this.__popt);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
})