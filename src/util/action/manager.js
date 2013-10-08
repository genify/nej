/*
 * ------------------------------------------
 * 行为管理控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$ActionManager) return;
    /**
     * 行为管理控件封装<br />
     * 页面结构举例
     * [code type="html"]
     *   
     * [/code]
     * 脚本举例
     * [code]
     *   
     * [/code]
     * 
     * @class   {nej.ut._$$ActionManager} 标签切换控件封装
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Object} actions 行为配置信息
     * 
     */
    _p._$$ActionManager = NEJ.C();
      _pro = _p._$$ActionManager._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__init = function(_options){
        this.__actions = {};
        this.__supInit(_options);
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        
        
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        
        
    };
    /**
     * 注册行为
     * @param  {}
     * @return {Void}
     */
    _pro.__doRegistAction = function(){
        
        
    };
    /**
     * 注册行为
     * @param  {Object} 行为配置信息
     * @config {}
     * @return {Void}
     */
    _pro._$regist = function(_conf){
        
        
        
    };
    
    
};
NEJ.define('{lib}util/action/manager.js',
          ['{lib}base/event.js'
          ,'{lib}base/element.js'
          ,'{lib}util/event.js'],f);