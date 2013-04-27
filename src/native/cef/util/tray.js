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
        _u = _('nej.u'), 
        _t = _('nej.ut'), 
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
     * 控件初始化
     * @return {Void}
     */
    _proTray.__init = (function(){
        var _nevt = ['click','rightclick'];
        // add native event
        var _doAddEvent = function(_name){
            this.__tray['on'+_name] = this.
                 __onNativeEvent._$bind(this,_name);
        };
        return function(){
            this.__tray = _n._$exec('app.getTrayIcon');
            _u._$forEach(_nevt,_doAddEvent,this);
            this.__supInit();
        };
    })();
    /**
     * 控件重置
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proTray.__reset = function(_options) {
        this.__supReset(_options);
        if (!!_options.icon){
            this.__tray.icon = _options.icon;
        }
        if (!!_options.tooltip){
            this.__tray.toolTip = _options.tooltip;
        }
    };
    /**
     * 托盘事件回调
     * @param  {String} 名称
     * @return {Void}
     */
    _proTray.__onNativeEvent = function(_name){
        this._$dispatchEvent('on'+_name);
    };
    /**
     * 显示托盘图标
     * @return {Void}
     */
    _proTray._$show = function(){
        if (!this.__tray.wasInstall){
            this.__tray.install();
        }
    };
    /**
     * 隐藏托盘图标
     * @return {Void}
     */
    _proTray._$hide = function(){
        if (this.__tray.wasInstall){
            this.__tray.uninstall();
        }
    };
    /**
     * 显示气泡提示
     * @param  {Object} 配置信息
     * @config {String}  title     气泡标题，默认为空
     * @config {String}  text      气泡内容，默认为空
     * @config {String}  icon      气泡图标，本地路径
     * @config {Boolean} hasSound  是否有声音提示，默认为false
     * @config {Number}  delayTime 显示时间长度，默认使用系统配置
     * @return {Void}
     */
    _proTray._$showBalloon = function(_options){
        this.__tray.popBalloon(_options);
    };
};
NEJ.define('{lib}native/cef/util/tray.js', 
          ['{lib}base/util.js'
          ,'{lib}util/event.js'
          ,'{lib}native/command.js'
          ,'{lib}native/cef/api.js'],f);