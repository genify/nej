/*
 * ------------------------------------------
 * 标签切换控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proTabView;
    if (!!_p._$$TabView) return;
    /**
     * 标签切换控件封装<br />
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="box">
     *     <a href="#" data-abc="111">1</a>
     *     <a href="#" data-abc="222">2</a>
     *     <a href="#" data-abc="333">3</a>
     *     <a href="#" data-abc="444">4</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _v = _('nej.v'),
     *       _p = _('nej.ut');
     *   // instance
     *   var _tv = _p._$$TabView._$allocate({
     *       dataset:'abc',
     *       list:_e._$getChildren('box'),
     *       oncheck:function(_event){
     *           _event.matched = _event.target.indexOf(_event.source)>=0;
     *       }
     *   });
     *   // check match
     *   _tv._$match('333');
     * [/code]
     * @class   {nej.ut._$$TabView}
     * @extends {nej.ut._$$EventTarget}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Array}   list     标签项列表
     * @config  {Number}  dataset  属性名称，默认为id
     * @config  {String}  selected 选中样式名，默认为js-selected
     * 
     * [hr]
     * 标签值验证事件
     * @event  {oncheck} 
     * @param  {Object}  事件信息
     * @config {Number}  source  原始值
     * @config {Number}  target  目标值
     * @config {Boolean} matched 是否匹配
     */
    _p._$$TabView = NEJ.C();
      _proTabView = _p._$$TabView._$extend(_p._$$EventTarget);
    /**
     * 控件重置
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proTabView.__reset = (function(){
        // check equal
        var _doMatchEq = function(_event){
            _event.matched = _event.source==_event.target;
        };
        return function(_options){
            _options.oncheck = 
                _options.oncheck||_doMatchEq;
            this.__supReset(_options);
            this.__list = _options.list;
            this.__name = _options.dataset||'id';
            this.__selected = _options.selected||'js-selected';
        };
    })();
    /**
     * 验证匹配情况
     * @param  {String} 待匹配值
     * @return {Node}   匹配的节点
     */
    _proTabView._$match = function(_value){
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
};
NEJ.define('{lib}util/tab/tab.view.js',
          ['{lib}util/event.js'],f);