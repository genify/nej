/**
 * ------------------------------------------
 * 桌面接口实现文件
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
        _v = _('nej.v'),
        _c = _('nej.c'), 
        _n = _('nej.n'),
        _p = _('nej.n');
    /**
     * 计算窗体位置
     * @param {Object} _size
     * @param {String} _align    窗体所处位置        默认为居中
     *                             topleft
     *                             topright
     *                             bottomleft
     *                             bottomright
     *                                 
     */
    _p._$getWindowPos = function(_size,_align){
        var _position = _n._$exec('os.getSystemInfo', 'desktop');
        var _pos ={};
        switch(_align){
            case 'topleft':
                _pos.x =0;
                _pos.y =0;
                break;
            case 'topright':
                _pos.x = _position.workArea.width - _size.width;
                _pos.y = 0;
                break;
            case 'bottomleft':
                _pos.x = 0;
                _pos.y = _position.workArea.height - _size.height;
                break;
            case 'bottomright':
                _pos.x = _position.workArea.width - _size.width;
                _pos.y = _position.workArea.height - _size.height;
                break;
            default:
                _pos.x = Math.floor((_position.workArea.width - _size.width) / 2);
                _pos.y = Math.floor((_position.workArea.height - _size.height) / 2);
                break;
        }
        return _pos;
    };
    /**
     * 窗体信息
     * @param {Object} _winInfo
     *                         x        体窗x坐标
     *                         y        窗体y坐标
     *                         width    窗体宽度
     *                         height    窗体高度
     *                         topmost    是否是一直最上层
     */
    _p._$setPosition = function(_winInfo){
        _p._$showWindow();
        if(!!_winInfo.sizeLimit){
            _p._$sizeLimit(_winInfo.sizeLimit);
        }
        _n._$exec('winhelper.setWindowPosition', _winInfo);
    };
    /**
     * 设置窗体最小拖动宽度和高度
     * @param    {Obejct}    _sizeLimit
     *                                 min
     *                                     width    最小宽度
     *                                     height    最小高度
     *                                 max
     *                                     width    最大宽度
     *                                     height    最大高度
     */
    _p._$sizeLimit = function(_sizeLimit){
        var _sizeMin,_sizeMax;
        if(!!_sizeLimit.min){
            _sizeMin ={};
            _sizeMin.x = _sizeLimit.min.width;
            _sizeMin.y = _sizeLimit.min.height;
        }
        if(!!_sizeLimit.max){
            _sizeMax ={};
            _sizeMax.x = _sizeLimit.max.width;
            _sizeMax.y = _sizeLimit.max.height;
        }
        _n._$exec('winhelper.setWindowSizeLimit', _sizeMin, _sizeMax);
    };
    /**
     * 显示窗体,但窗体不会放在最上层
     */
    _p._$showWindow = function(){
        _n._$exec('winhelper.showWindow', 'show');
    };
    /**
     * 将窗体置于最前
     */
    _p._$bringToTop = function() {
        _n._$exec('winhelper.bringWindowToTop');
    };
    /**
     * 隐藏窗体
     */
    _p._$hideWindow = function(){
        _n._$exec('winhelper.showWindow', 'hide');
    };
    /**
     * 程序退出
     */
    _p._$appExit = function(){
        var _trayIcon = _n._$exec('app.getTrayIcon');
        if (!!_trayIcon)
          _trayIcon.uninstall();
        _n._$exec('app.exit');
    };
    /**
     * 获取托盘对象
     * @return {Object}        托盘对象
     */
    _p._$getTrayIcon = function(){
        return _n._$exec('app.getTrayIcon');
    };
    /**
     * 程序退出
     * @param    {Array}        菜单列表结构如下：
     *                         [{menu:true,separator:false,text:'播放',enable:true,menu_id:1000,children:null}]
     */
    _p._$popMenu = function(_menu){
        _n._$exec('winhelper.popUpMenu',JSON.stringify(_menu));
    };
    /**
     * 气泡
     * @param    {Object}    _balloonInfo
     *                                         title        气泡标题
     *                                         cnt            气泡内容
     *                                         hasSound    是否播放声音
     *                                         delay        延时多少时间
     *                                         icon        气泡图标
     */
    _p._$popBalloon = function(_balloonInfo){
        var _trayIcon = _n._$exec('app.getTrayIcon');
        _trayIcon.popBalloon({
            title : _balloonInfo.title,
            text : _balloonInfo.cnt,
            icon : _trayIcon.icon,
            hasSound : _balloonInfo.hasSound,
            delayTime : _balloonInfo.delay
        });
    };
    /**
     * 设置任务栏图标和任务栏title
     * @param    _iconInfo
     *                     url        任务栏图标地址，如果没有icon从托盘里取icon地址
     *                     title    任务栏标题
     */
    _p._$setTaskIcon = function(_iconInfo){
        if(!_iconInfo.url){
            var _trayIcon = _n._$exec('app.getTrayIcon');
            _n._$exec('winhelper.setWindowIconFromLocalFile', _trayIcon.icon);
        }
        else
            _n._$exec('winhelper.setWindowIconFromLocalFile', _iconInfo.url);
        _n._$exec('winhelper.setWindowTitle', _iconInfo.title||'');
    };
    /**
     * 在浏览器中打开url
     * @param    {String}    _url    网页地址,必须是网页上地址http：//开头
     * @return    {Void}
     */
    _p._$openInNavigate = function(_url) {
        _n._$exec('os.navigateExternal', _url);
    };
    /**
     * 在新窗体中打开页面
     * 
     * @param {String}
     *            _url 页面地址
     * @param {Object}
     *            _info 
     *                    x         x坐标 
     *                    y         y坐标 
     *                    width     窗体宽度 
     *                    height     窗体高度
     * @param {Object}
     *            _setting 
     *                    visible                 打开窗体后是否可见 
     *                    resizable                 窗体是否可缩放 
     *                    taskbarButton           窗体是否要在任务栏显示
     * @param {Boolean}
     *            _openInNewWindow 强制在新窗体中打开
     * @return {Obejct} 新开窗的引用
     */
    _p._$open = (function() {
            var _windowHander = {};
            return function(_url, _info, _setting, _openInNewWindow){
                var _absoluteUrl = _u._$absolute(_url,location.href);
                if (!!_info.center) {
                    var _pos = _p._$getWindowPos(_info);
                    _info.x = _pos.x;
                    _info.y = _pos.y;
                }
                if (!!_openInNewWindow) {
                    return _n._$exec('winhelper.launchWindow', _absoluteUrl, _info,
                            _setting);
                } else {
                    var _page = _absoluteUrl;
                    if (!_windowHander[_page])
                        _windowHander[_page] = _n._$exec('winhelper.launchWindow',
                                _absoluteUrl, _info, _setting);
                    else if (!!_windowHander[_page] && !_windowHander[_page].location)
                        _windowHander[_page] = _n._$exec('winhelper.launchWindow',
                                _absoluteUrl, _info, _setting);
                    else
                        _windowHander[_page].location.href = _absoluteUrl;
                    return _windowHander[_page];
                }
        };
    })();
    /**
     * 设置开机启动
     * @param    {String}    程序代号
     * @param    {String}    开机启动时参数
     * 设置后开机启动会是　xxx-startup=auto  xxx是程序名
     */
    _p._$setAutoRun = function(){
        _n._$exec('app.setAutoRun', _name, _param);
    };
    /**
     * 取消开机启动
     * @return {String}    _name    程序代号
     */
    _p._$cancelAutoRun = function(_name){
        _n._$exec('app.cancelAutoRun', _name);
    };
    /**
     * 获取是否设置了开机启动
     * 
     * @param {String}
     *            _name 程序名字
     * @param {Boolean}
     *            是否已设置
     */
    _p._$getAutoRunState = function(_name) {
        return _n._$exec('app.getAutoRunState', _name);
    };
    /**
     * 移除指定域上的cookie
     * 
     * @param {String}
     *            _url 指定域 例：http://163.com
     * @param {String}
     *            _cookieName cookie名
     */
    _p._$removeCookie = function(_url, _cookieName) {
        _n._$exec('browser.removeCookie', _url, _cookieName);
    };
    /**
     * 移动cookie
     * 
     * @param {String}
     *            _fromDomain 源域 例：163.com
     * @param {String}
     *            _targetDomain 目标域 例：126.com
     * @param {String}
     *            _cookieName cookie名
     */
    _p._$moveCookie = function(_fromDomain, _targetDomain, _cookieName) {
        _n._$exec('browser.moveCookie', _fromDomain, _targetDomain,
                _cookieName);
    };
    /**
     * 设置指定域上的cookie
     * 
     * @param {String}
     *            _url 指定域 例：http://.163.com
     * @param {String
     *            _cookieName cookie名
     * @param {String}
     *            _cookie cookie值
     */
    _p._$setCookie = function(_url, _cookieName, _cookie) {
        _n._$exec('browser.setCookie', _url, _cookieName, _cookie);
    };
    /**
     * 点击节点移动窗体
     * 由于native的drag是鼠标按下时进行拖动
     * 但native又没要在mouseup时形成一个完整的鼠标click事件，所以普通的click事件在这些节点上都是无效的
     * 有多少个节点可以拖动，就添加多少个节点，只有事件源是这些节点的会触发拖动，事件源是他的子节点触发的不会拖动
     * @param {Element}
     *            _elm 节点
     */
    _p._$onDragWindow = (function() {
        var _dragElm =[];
        return function(_elm){
            var _elm = _e._$get(_elm);
            _dragElm.push(_elm);
            _v._$addEvent(_elm, 'mousedown', function(_event){
                var _elm = _v._$getElement(_event);
                var _index = _u._$indexOf(_dragElm, _elm);
                if (_event.which == 1 && _index != -1)
                    _n._$exec('winhelper.dragWindow');
            });
        };
    })();
    /**
     * 获取桌面的大小
     * 
     * @return {Object} 桌面大小
     */
    _p._$geDesktopSize = function() {
        var _position = _n._$exec('os.getSystemInfo', 'desktop');
        if(!!_position)
            return;
        else
            return _position.workArea;
    };
    /**
     * 获取当前窗体的位置信息
     * 
     * @returns {Object} _info height 窗体高度 width 窗体宽度 x 窗体x坐标 y 窗体y坐标
     */
    _p._$getWindowInfo = function() {
        var _info = _n._$exec('winhelper.getWindowPosition');
        return _info;
    };
};
NEJ.define('{lib}native/cef/api.js', ['{lib}native/command.js','{lib}base/util.js','{lib}base/element.js'], f);