/*
 * ------------------------------------------
 * 箭头控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ui'),
        __proArrows,
        __supArrows;
    if (!!p._$$Arrows) return;
    /**
     * 箭头控件
     * @class   {nej.ui._$$Arrows} 箭头控件
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     * @config  {Number} direction 箭头方向
     * [ntb]
     *    1 | 正方向
     *   -1 | 反方向
     * [/ntb]
     */
    p._$$Arrows = NEJ.C();
    __proArrows = p._$$Arrows._$extend(p._$$Abstract);
    __supArrows = p._$$Arrows._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proArrows.__reset = function(_options){
        this.__supReset(_options);
        this._$direction(_options.direction);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proArrows.__destroy = function(){
        this.__supDestroy();
        e._$delClassName(this.__body,this.__seed_css+'-reverse');
    };
    /**
     * 改变方向
     * @method {_$direction}
     * @param  {Number} 箭头方向
     * @return {Void}
     */
    __proArrows._$direction = function(_direction){
        var _class = this.__seed_css+'-reverse';
        _direction = parseInt(_direction)||1;
        _direction>0 ? e._$delClassName(this.__body,_class)
                     : e._$addClassName(this.__body,_class);
    };
};
NEJ.define('{lib}ui/arrows/arrows.js',['{lib}ui/base.js'],f);