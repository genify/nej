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
        _p = _('nej.p');
    if (_p._$NOT_PATCH.trident1) return;

    _h.__onTransitionEnd = function(){
    	return !0;
    };
};
NEJ.define('{lib}patched/trident-1/effect.js',
      ['{lib}patched/effect.js'],f);