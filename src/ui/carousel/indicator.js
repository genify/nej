/*
 * ------------------------------------------
 * 指示器对象实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ui'),
        __proIndicator,
        __supIndicator;
    if (!!p._$$Indicator) return;
    /**
     * 指示器对象
     * @class   {nej.ui._$$Indicator}
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     * @config  {String|Node} parent 控件所在容器节点
     * @config  {Number}       cindex 当前指示项
     * @config  {String}       cstyle 当前指示项样式
     * 
     * [hr]
     * 
     * @event  {onactive} 指定项触发事件
     * @param  {Number}   指定项在所有项目中的位置
     * 
     */                           
    p._$$Indicator = NEJ.C();
    __proIndicator = p._$$Indicator._$extend(t._$$Event);
    __supIndicator = p._$$Indicator._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proIndicator.__reset = function(_options){
        this.__supReset(_options);
        this.__body = e._$get(_options.parent);
        this.__cstyle = _options.cstyle;
        this.__doInitDomEvent([
            [this.__body,'tap',this.__onActive._$bind(this)]
        ]);
        this._$setEvent('onactive',_options.onactive);
        this._$update(_options.cindex);
    };
    /**
     * 更新指示器位置
     * @method {_$update}
     * @param  {Object} 当前项索引
     * @return {nej.ui._$$Indicator}
     */
    __proIndicator._$update = function(_current){
        var _child = this.__body.children,
            _ntmp=e._$getByClassName(this.__body,this.__cstyle);
        if(!!_ntmp&&_ntmp.length>0){
            for(var i=0;i<_ntmp.length;i++){
                e._$delClassName(_ntmp[i],this.__cstyle);
            }
        }
        e._$addClassName(_child[_current],this.__cstyle);
        this.__current = _current;
        return this;
    };
    /**
     * 点击指示器事件
     * @protected
     * @method {__onActive}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    __proIndicator.__onActive = function(_event){
        var _element = _event.target;
            _child = this.__body.children;
        for(var i=0;i<_child.length;i++){
            if(_child[i]==_element){
                this._$dispatchEvent('onactive',i);
                break;
            }
        }
    };
};
NEJ.define('{lib}ui/carousel/indicator.js',
      ['{lib}base/event.js','{lib}util/event.js'],f);