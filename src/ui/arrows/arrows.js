/*
 * ------------------------------------------
 * 箭头控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}ui/base.js'
],function(NEJ,_k,_e,_u,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 箭头控件
     * @class   {_$$Arrows}
     * @extends {ui/base#_$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     * @config  {Number} direction 箭头方向
     * [ntb]
     *    1 | 正方向
     *   -1 | 反方向
     * [/ntb]
     */
    _p._$$Arrows = _k._$klass();
    _pro = _p._$$Arrows._$extend(_u._$$Abstract);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this._$direction(_options.direction);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _e._$delClassName(this.__body,this.__seed_css+'-reverse');
    };
    /**
     * 改变方向
     * @method {_$direction}
     * @param  {Number} 箭头方向
     * @return {Void}
     */
    _pro._$direction = function(_direction){
        var _class = this.__seed_css+'-reverse';
        _direction = parseInt(_direction)||1;
        _direction>0 ? _e._$delClassName(this.__body,_class)
                     : _e._$addClassName(this.__body,_class);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});