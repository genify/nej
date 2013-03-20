/*
 * ------------------------------------------
 * 裁剪功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proClip;
    if (!!_p._$$Clip) return;
    /**
     * 裁剪功能封装
     * 
     * 脚本举例
     * [code]
     *   
     * [/code]
     * 
     * @class   {nej.ut._$$Clip}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Node}         resizer
     * 
     * [hr]
     * 大小变化开始触发事件
     * @event  {onresizestart}
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     * [hr]
     * 大小变化触发事件
     * @event  {onresize}
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     * [hr]
     * 大小变化结束触发事件
     * @event  {onresizeend} 
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高

     * [hr]
     * 区域移动触发事件
     * @event  {onmove} 
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     */
    _p._$$Clip = NEJ.C();
      _proClip = _p._$$Clip._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proClip.__reset = function(_options){
        this.__supReset(_options);
        
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proClip.__destroy = function(){
        this.__supDestroy();
        
    };
};
NEJ.define('{lib}util/clip/clip.js',
          ['{lib}util/resize/resize.js'],f);