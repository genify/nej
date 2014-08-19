/*
 * --------------------------------------------
 * 专辑-专辑详情模块实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * --------------------------------------------
 */
define(['{lib}util/dispatcher/module.base.js'],
function(){
    // variable
    var _   = NEJ.P,
        _e  = _('nej.e'),
        _pm = _('nej.ut'),
        _pp = _('t.y'),
        _pro;
    /**
     * 专辑详情模块对象
     * @class   {nm.m.y._$$MAlbumComment}
     * @extends {nm.m._$$Module}
     * @property  {String}
     */
    _pp._$$ModuleC1 = NEJ.C();
    _pro = _pp._$$ModuleC1._$extend(_pm._$$ModuleAbstract);

    _pro.__doBuild = function(){
        this.__namespace = 'm-c1';
        this.__supDoBuild();
        var _html = _e._$getTextTemplate(
                    this.__namespace+'-module');
        if (!!_html){
            this.__body = _e._$html2node(_html);
        }
    };

    dispatcher._$loaded('/?/c1',_pp._$$ModuleC1);
});