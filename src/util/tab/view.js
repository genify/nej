/*
 * ------------------------------------------
 * 标签切换控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/tab/view */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 标签切换控件封装
     * 
     * 结构举例
     * ```html
     * <div id="box">
     *   <a href="#" data-abc="111">1</a>
     *   <a href="#" data-abc="222">2</a>
     *   <a href="#" data-abc="333">3</a>
     *   <a href="#" data-abc="444">4</a>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/tab/tab.view'
     * ],function(_t){
     *     // instance
     *     var _tv = _t._$$TabView._$allocate({
     *         dataset:'abc',
     *         list:_e._$getChildren('box'),
     *         oncheck:function(_event){
     *             _event.matched = _event.target.indexOf(_event.source)>=0;
     *         }
     *     });
     *     // check match
     *     _tv._$match('333');
     * });
     * ```
     * 
     * @class    module:util/tab/view._$$TabView
     * @extends  module:util/event._$$EventTarget
     * @param    {Object} config   - 可选配置参数
     * @property {Array}  list     - 标签项列表
     * @property {Number} dataset  - 属性名称，默认为id
     * @property {String} selected - 选中样式名，默认为js-selected
     */
    /** 
     * 标签值验证事件
     * 
     * @event    module:util/tab/view._$$TabView#oncheck
     * @param    {Object}  event   - 事件信息
     * @property {Number}  source  - 原始值
     * @property {Number}  target  - 目标值
     * @property {Boolean} matched - 是否匹配
     */
    _p._$$TabView = _k._$klass();
    _pro = _p._$$TabView._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/tab/view._$$TabView#__reset
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__reset = (function(){
        // check equal
        var _doMatchEq = function(_event){
            _event.matched = _event.source==_event.target;
        };
        return function(_options){
            _options.oncheck = 
                _options.oncheck||_doMatchEq;
            this.__super(_options);
            this.__list = _options.list;
            this.__name = _options.dataset||'id';
            this.__selected = _options.selected||'js-selected';
        };
    })();
    /**
     * 验证匹配情况
     *
     * @method module:util/tab/view._$$TabView#_$match
     * @param  {String} arg0 - 待匹配值
     * @return {Node}          匹配的节点
     */
    _pro._$match = function(_value){
        var _element,
            _event = {target:_value};
        _u._$forEach(
            this.__list,
            function(_node){
                delete _event.matched;
                _event.source = _e._$dataset(_node,this.__name);
                this._$dispatchEvent('oncheck',_event);
                if (!_event.matched){
                    _e._$delClassName(_node,this.__selected);
                }else{
                    _element = _node;
                    _e._$addClassName(_node,this.__selected);
                }
            },this
        );
        return _element;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
