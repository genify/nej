/*
 * ------------------------------------------
 * 分页器控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/pager/pager */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/pager/pager.base',
    'util/page/page'
],function(NEJ,_k,_e,_i0,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 分页器控件封装
     *
     * 页面结构举例
     * ```html
     *   <div id="pagerCnt">page</div>
     *   <div id="pagerCnt2">page</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'ui/pager/pager'
     *   ],function(_u,_p,_o,_f,_r){
     *           // 默认第一页
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
     * ```
     *
     * @class     module:ui/pager/pager._$$Pager
     * @uses      module:util/page/page._$$PageFragment
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}  arg0 - 可选配置参数
     * @property  {Number}  index - 当前页码
     * @property  {Number}  total - 总页码数
     * @property  {Boolean} noend - 无尾页显示
     */
    /**
     * 页码切换事件，输入{last:3,index:1,total:12}
     *
     * @event  module:ui/pager/pager._$$Pager#onchange
     * @param  {Object}   arg0  - 页码状态对象
     * @property {Number} last  - 上一次的页码
     * @property {Number} index - 当前要切换的页面
     * @property {Number} total - 总页面数
     *
     */
    _p._$$Pager = _k._$klass();
    _pro = _p._$$Pager._$extend(_i0._$$AbstractPager);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/pager/pager._$$Pager#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        _options.number =
            parseInt(_options.number)||9;
        this.__super(_options);
        this.__page = _t0._$$PageFragment._$allocate(this.__popt);
    };
    /**
     * 页面变化触发事件
     *
     * @protected
     * @method module:ui/pager/pager._$$Pager#__onChange
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onChange = function(_event){
        if (!!this.__bopt.noend){
            var _dext = _event.ext||_o,
                _list = _dext.list||_r;
            if (_dext.last){
                _e._$setStyle(
                    _list[_list.length-1],
                    'display','none'
                );
            }
        }
        this.__super(_event);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});