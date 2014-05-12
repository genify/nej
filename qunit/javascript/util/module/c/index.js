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
     * @config  {String}
     */
    _pp._$$ModuleC = NEJ.C();
    _pro = _pp._$$ModuleC._$extend(_pm._$$AbstractModule);

    _pro.__reset = function(_options){
        this.__supReset(_options);
    };

    _pro.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        dispatcher._$redirect('/?/c1',{input:{parent:this.__body}});
        dispatcher._$redirect('/?/c2',{input:{parent:this.__body}});
    };

    _pro.__doBuild = function(){
        this.__namespace = 'm-c';
        this.__supDoBuild();
        var _html = _e._$getTextTemplate(
                    this.__namespace+'-module');
        if (!!_html){
            this.__body = _e._$html2node(_html);
        }
    };

    dispatcher._$loaded('/m/root/c',_pp._$$ModuleC);
});