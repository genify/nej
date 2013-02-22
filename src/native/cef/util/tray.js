/**
 * ------------------------------------------
 * 托盘控件实现文件
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
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
     * 菜单控件封装
     * @class 分页器控件封装
     * @extends {nej.ui._$$Event}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                        tooltip            托盘鼠标移上去时提示
     *                        icon            托盘图标，必须是绝对路径，是客户端协议形的绝对路径，不能用相对路径，不是一般的图片地址
     *                        onclick            点击回调
     *                        onrightclick    鼠标右击回调    
     */
    _p._$$Tray = NEJ.C();
      _proTray = _p._$$Tray._$extend(_t._$$Event);

    _proTray.__init = function(){
        this.__supInit();
    };
    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
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