/**
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _h = _('nej.h'),
        _p = _('nej.p');
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
    _h.__doCheckProp = function(_prop){
        return (_suffix[_prop] === undefined) && (_prop.indexOf('color') < 0);
    };
    /**
     * 执行动画
     * @param  {Node}   动画节点
     * @param  {String} 动画目标样式
     * @param  {String} 动画变换信息
     * @return {nej.h} 
     */
    _h.__onStart = function(_node,_rules,_anim){
        _anim = _anim.slice(0,-1);
        _e._$setStyle(_node,'transition',_anim);
        _e._$style(_node,_rules);
        return this;
    };

    /**
     * 取消动画
     * @param  {Node}   动画节点
     * @param  {String} 节点目标样式
     * @return {nej.h}
     */
    _h.__onStop = function(_node,_state){
        _e._$style(_node,_state);
        _e._$setStyle(_node,'transition','none');
        return this;
    };

    /**
     * 暂停动画
     * @param  {Node}   动画节点
     * @param  {String} 暂停时的节点样式
     * @return {nej.h} 
     
    _h.__onPaused = function(_node,_state){
        _h.__onStop(_node,_state);
        return this;
    };

    /**
     * 暂停后重新开始动画
     * @param  {Node}   动画节点
     * @return {nej.h} 
     
    _h.__onRestart = function(_node,_rules,_anim){
        _h.__onStart(_node,_rules,_anim);
        return this;
    };*/
};
NEJ.define('{lib}patched/effect.js',
      ['{lib}base/platform.js'],f);