/**
 * ------------------------------------------
 * 托盘图标控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _e = _('nej.e'), 
        _u = _('nej.u'), 
        _t = _('nej.ut'), 
        _c = _('nej.c'), 
        _n = _('nej.n'),
        _p = _('nej.cef.ut'), 
        _proTray;
    /**
     * 托盘图标控件
     * 
     * @class   {nej.cef.ut._$$Tray}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String} tooltip  托盘鼠标移上去时提示
     * @config  {String} icon     托盘图标，必须是绝对路径，是客户端协议形的绝对路径，不能用相对路径，不是一般的图片地址
     * 
     * [hr]
     * 图标左键点击事件
     * @event   {onclick}
     * @param   {Object} 事件信息
     * 
     * [hr]
     * 图标右键点击事件
     * @event   {onrightclick}
     * @param   {Object} 事件信息
     * 
     */
    _p._$$Tray = NEJ.C();
      _proTray = _p._$$Tray._$extend(_t._$$Event);
    
    
    
    /**
     * 控件重置
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proTray.__reset = function(_options) {
        this.__supReset(_options);
        this.__trayIcon = _n._$getTrayIcon();
        this.__trayIcon.toolTip = _options.tooltip;
        this.__trayIcon.icon = _options.icon;//"orpheus://orpheus/images/ico/ntes_mail_assist.ico";
        this.__trayIcon.onclick = this.__onClick._$bind(this);
        this.__trayIcon.onrightclick = this.__onRightClick._$bind(this); 
        if(!this.__trayIcon.wasInstall)
            this.__trayIcon.install();
    };
    /**
     * 托盘点击事件回调
     */
    _proTray.__onClick = function(){
        this._$dispatchEvent('onclick');
    };
    /**
     * 托盘右击事件回调
     */
    _proTray.__onRightClick = function(){
        this._$dispatchEvent('onrightclick');
    };
};
NEJ.define('{lib}native/cef/util/tray.js', ['{lib}util/event.js','{lib}native/command.js','{lib}base/util.js','{lib}native/cef/api.js'], f);