/**
 * ------------------------------------------
 * 动画效果接口实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/global',
    'base/element'
],function(NEJ,_e,_p,_o,_f,_r){
    var _suffix = {
        'opacity':1,
        'z-index':1,
        'background':1,
        'font-weight':1,
        'filter':1
    };
    /**
     * 检查属性是否需要加单位
     * @param  {String}  属性
     * @return {Boolean} true表示需要加单位，false表示不需要加单位
     */
    _p.__doCheckProp = function(_prop){
        return (_suffix[_prop] === undefined) && (_prop.indexOf('color') < 0);
    };
    /**
     * 执行动画
     * @param  {Node}   动画节点
     * @param  {String} 动画目标样式
     * @param  {String} 动画变换信息
     * @return {Void}
     */
    _p.__onStart = function(_node,_rules,_anim){
        _anim = _anim.slice(0,-1);
        _e._$setStyle(_node,'transition',_anim);
        _e._$style(_node,_rules);
    };

    /**
     * 取消动画
     * @param  {Node}   动画节点
     * @param  {String} 节点目标样式
     * @return {Void}
     */
    _p.__onStop = function(_node,_state,_stop,_flag){
        _e._$style(_node,_state);
        _e._$setStyle(_node,'transition','none');
        _stop.call(null,_state,_flag);
    };

    return _p;
});