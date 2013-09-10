/**
 * ------------------------------------------
 * 实现动画效果
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _h = _('nej.h'),
        _e = _('nej.e'),
        _p = _('nej.p');
    if (_p._$NOT_PATCH.gecko) return;

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
        // FF toggle fix
        setTimeout(function(){
            _e._$style(_node,_rules);
        },33);
        return this;
    };
};
NEJ.define('{lib}patched/gecko/effect.js',
      ['{lib}patched/effect.js'],f);