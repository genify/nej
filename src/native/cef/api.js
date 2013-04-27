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
        _e = _('nej.e'), 
        _u = _('nej.u'), 
        _v = _('nej.v'),
        _n = _('nej.n'),
        _p = _('nej.cef');
    /**
     * 配置窗体信息
     * @see    {nej.cef._$configWindowPosition}
     * @see    {nej.cef._$configWindowSizeLimit}
     * @param  {Object} 配置信息，其他参数详情见@see指定接口配置信息
     * @return {Void}
     */
    _p._$configWindow = function(_options){
        _p._$configWindowSizeLimit(_options);
        _p._$configWindowPosition(_options);
    };
    /**
     * 配置窗体位置，对齐方式定义如下<br/>
     * 水平对齐方式：
     * [ntb]
     *   名称            |  描述
     *   ----------------------
     *   left   |  左侧对齐
     *   center |  中间对齐
     *   right  |  右侧对齐
     * [/ntb]
     * 
     * 垂直对齐方式：
     * [ntb]
     *   名称              |  描述
     *   ---------------------
     *   top     |  顶部对齐
     *   center  |  中间对齐
     *   bottom  |  底部对齐
     * [/ntb]
     * @api    {nej.cef._$configWindowPosition}
     * @param  {Object} 配置信息
     * @config {String}  name     窗体名称
     * @config {Number}  width    窗体宽度
     * @config {Number}  height   窗体高度
     * @config {Boolean} topmost  窗体是否置顶
     * @config {String}  align    对齐方式，格式定义：水平对齐方式+空格+垂直对齐方式，如 left top
     * @return {Void}
     */
    _p._$configWindowPosition = (function(){
        var _reg0 = /\s+/,
            _fmap = {
                left:function(_mbox,_total){
                    return 0;
                },
                center:function(_mbox,_total){
                    return Math.floor((_total-_mbox)/2);
                },
                right:function(_mbox,_total){
                    return _total;
                }
            };
        _fmap.top = _fmap.left;
        _fmap.bottom = _fmap.right;
        return function(_options){
            _options = _options||_o;
            // set window position
            var _aligns = (_options.align||'').trim().split(_reg0),
                _position = NEJ.EX({width:0,height:0,topmost:!1},_options),
                _wkarea = (_n._$exec('os.getSystemInfo','desktop')||_o).workArea||_o;
            _position.x = (_fmap[_aligns[0]]||_fmap.center)(_position.width,_wkarea.width);
            _position.y = (_fmap[_aligns[1]]||_fmap.center)(_position.height,_wkarea.height);
            if (!_options.name){
                _n._$exec('winhelper.setWindowPosition',_position);
            }else{
                _position.name = _options.name;
                _n._$exec('winhelper.setNativeWindowRect',_position);
            }
        };
    })();
    /**
     * 配置窗体大小限制
     * @api    {nej.cef._$configWindowSizeLimit}
     * @param  {Object} 配置信息
     * @config {Number}  minWidth  窗体最小宽度
     * @config {Number}  maxWidth  窗体最大宽度
     * @config {Number}  minHeight 窗体最小高度
     * @config {Number}  maxHeight 窗体最大高度
     */
    _p._$configWindowSizeLimit = (function(){
        // parse min/max - width/height 
        var _doParseBox = function(_width,_height){
            _width = parseInt(_width);
            _height = parseInt(_height);
            var _result;
            if (!isNaN(_width)){
                _result = _result||{};
                _result.x = _width;
            }
            if (!isNaN(_height)){
                _result = _result||{};
                _result.y = _height;
            }
            return _result;
        };
        return function(_options){
            _options = _options||_o;
            _n._$exec(
                'winhelper.setWindowSizeLimit',
                _doParseBox(_options.minWidth,_options.minHeight),
                _doParseBox(_options.maxWidth,_options.maxHeight)
            );
        };
    })();
    /**
     * 显示窗体,但窗体不会放在最上层
     * @api    {nej.cef._$showWindow}
     * @return {Void}
     */
    _p._$showWindow = function(_name){
        if (!_name){
            _n._$exec('winhelper.showWindow','show');
        }else{
            _n._$exec('winhelper.setNativeWindowShow',_name,!0);
        }
    };
    /**
     * 隐藏窗体
     * @api    {nej.cef._$hideWindow}
     * @return {Void}
     */
    _p._$hideWindow = function(_name){
        if (!_name){
            _n._$exec('winhelper.showWindow','hide');
        }else{
            _n._$exec('winhelper.setNativeWindowShow',_name,!1);
        }
    };
    /**
     * 打开新窗体
     * @param  {String} 新窗口地址，参数通过查询形式输入，如?width=1000&height=200
     * @return {Void}
     */
    _p._$open = (function(){
        var _doParseInt = function(_value,_key,_map){
            var _int = parseInt(_value);
            if (!isNaN(_int)){
                _map[_key] = _int;
            }else if(_value=='true'||_value=='false'){
                _map[_key] = _value=='true';
            }
        };
        return function(_url){
            // TODO parse param
            var _param = _u._$query2object(_url.split('?')[1]||'');
            _u._$forIn(_param,_doParseInt);
            _n._$exec('winhelper.launchWindow',_url,_param,_param);
        };
    })();
    
    
    // /**
     // * 将窗体置于最前
     // */
    // _p._$bringToTop = function() {
        // _n._$exec('winhelper.bringWindowToTop');
    // };
    // /**
     // * 隐藏窗体
     // */
    // _p._$hideWindow = function(){
        // _n._$exec('winhelper.showWindow','hide');
    // };
    // /**
     // * 程序退出
     // */
    // _p._$appExit = function(){
        // var _trayIcon = _n._$exec('app.getTrayIcon');
        // if (!!_trayIcon)
          // _trayIcon.uninstall();
        // _n._$exec('app.exit');
    // };
    // /**
     // * 获取托盘对象
     // * @return {Object}        托盘对象
     // */
    // _p._$getTrayIcon = function(){
        // return _n._$exec('app.getTrayIcon');
    // };
    // /**
     // * 程序退出
     // * @param    {Array}        菜单列表结构如下：
     // *                         [{menu:true,separator:false,text:'播放',enable:true,menu_id:1000,children:null}]
     // */
    // _p._$popMenu = function(_menu){
        // _n._$exec('winhelper.popUpMenu',JSON.stringify(_menu));
    // };
    // /**
     // * 气泡
     // * @param    {Object}    _balloonInfo
     // *                                         title        气泡标题
     // *                                         cnt            气泡内容
     // *                                         hasSound    是否播放声音
     // *                                         delay        延时多少时间
     // *                                         icon        气泡图标
     // */
    // _p._$popBalloon = function(_balloonInfo){
        // var _trayIcon = _n._$exec('app.getTrayIcon');
        // _trayIcon.popBalloon({
            // title : _balloonInfo.title,
            // text : _balloonInfo.cnt,
            // icon : _trayIcon.icon,
            // hasSound : _balloonInfo.hasSound,
            // delayTime : _balloonInfo.delay
        // });
    // };
    // /**
     // * 设置任务栏图标和任务栏title
     // * @param    _iconInfo
     // *                     url        任务栏图标地址，如果没有icon从托盘里取icon地址
     // *                     title    任务栏标题
     // */
    // _p._$setTaskIcon = function(_iconInfo){
        // if(!_iconInfo.url){
            // var _trayIcon = _n._$exec('app.getTrayIcon');
            // _n._$exec('winhelper.setWindowIconFromLocalFile', _trayIcon.icon);
        // }
        // else
            // _n._$exec('winhelper.setWindowIconFromLocalFile', _iconInfo.url);
        // _n._$exec('winhelper.setWindowTitle', _iconInfo.title||'');
    // };
    // /**
     // * 在浏览器中打开url
     // * @param    {String}    _url    网页地址,必须是网页上地址http：//开头
     // * @return    {Void}
     // */
    // _p._$openInNavigate = function(_url) {
        // _n._$exec('os.navigateExternal', _url);
    // };
    // /**
     // * 在新窗体中打开页面
     // * 
     // * @param {String}
     // *            _url 页面地址
     // * @param {Object}
     // *            _info 
     // *                    x         x坐标 
     // *                    y         y坐标 
     // *                    width     窗体宽度 
     // *                    height     窗体高度
     // * @param {Object}
     // *            _setting 
     // *                    visible                 打开窗体后是否可见 
     // *                    resizable                 窗体是否可缩放 
     // *                    taskbarButton           窗体是否要在任务栏显示
     // * @param {Boolean}
     // *            _openInNewWindow 强制在新窗体中打开
     // * @return {Obejct} 新开窗的引用
     // */
    // _p._$open = (function() {
            // var _windowHander = {};
            // return function(_url, _info, _setting, _openInNewWindow){
                // var _absoluteUrl = _u._$absolute(_url,location.href);
                // if (!!_info.center) {
                    // var _pos = _p._$getWindowPos(_info);
                    // _info.x = _pos.x;
                    // _info.y = _pos.y;
                // }
                // if (!!_openInNewWindow) {
                    // return _n._$exec('winhelper.launchWindow', _absoluteUrl, _info,
                            // _setting);
                // } else {
                    // var _page = _absoluteUrl;
                    // if (!_windowHander[_page])
                        // _windowHander[_page] = _n._$exec('winhelper.launchWindow',
                                // _absoluteUrl, _info, _setting);
                    // else if (!!_windowHander[_page] && !_windowHander[_page].location)
                        // _windowHander[_page] = _n._$exec('winhelper.launchWindow',
                                // _absoluteUrl, _info, _setting);
                    // else
                        // _windowHander[_page].location.href = _absoluteUrl;
                    // return _windowHander[_page];
                // }
        // };
    // })();
    // /**
     // * 设置开机启动
     // * @param    {String}    程序代号
     // * @param    {String}    开机启动时参数
     // * 设置后开机启动会是　xxx-startup=auto  xxx是程序名
     // */
    // _p._$setAutoRun = function(){
        // _n._$exec('app.setAutoRun', _name, _param);
    // };
    // /**
     // * 取消开机启动
     // * @return {String}    _name    程序代号
     // */
    // _p._$cancelAutoRun = function(_name){
        // _n._$exec('app.cancelAutoRun', _name);
    // };
    // /**
     // * 获取是否设置了开机启动
     // * 
     // * @param {String}
     // *            _name 程序名字
     // * @param {Boolean}
     // *            是否已设置
     // */
    // _p._$getAutoRunState = function(_name) {
        // return _n._$exec('app.getAutoRunState', _name);
    // };
    // /**
     // * 移除指定域上的cookie
     // * 
     // * @param {String}
     // *            _url 指定域 例：http://163.com
     // * @param {String}
     // *            _cookieName cookie名
     // */
    // _p._$removeCookie = function(_url, _cookieName) {
        // _n._$exec('browser.removeCookie', _url, _cookieName);
    // };
    // /**
     // * 移动cookie
     // * 
     // * @param {String}
     // *            _fromDomain 源域 例：163.com
     // * @param {String}
     // *            _targetDomain 目标域 例：126.com
     // * @param {String}
     // *            _cookieName cookie名
     // */
    // _p._$moveCookie = function(_fromDomain, _targetDomain, _cookieName) {
        // _n._$exec('browser.moveCookie', _fromDomain, _targetDomain,
                // _cookieName);
    // };
    // /**
     // * 设置指定域上的cookie
     // * 
     // * @param {String}
     // *            _url 指定域 例：http://.163.com
     // * @param {String
     // *            _cookieName cookie名
     // * @param {String}
     // *            _cookie cookie值
     // */
    // _p._$setCookie = function(_url, _cookieName, _cookie) {
        // _n._$exec('browser.setCookie', _url, _cookieName, _cookie);
    // };
    // /**
     // * 点击节点移动窗体
     // * 由于native的drag是鼠标按下时进行拖动
     // * 但native又没要在mouseup时形成一个完整的鼠标click事件，所以普通的click事件在这些节点上都是无效的
     // * 有多少个节点可以拖动，就添加多少个节点，只有事件源是这些节点的会触发拖动，事件源是他的子节点触发的不会拖动
     // * @param {Element}
     // *            _elm 节点
     // */
    // _p._$onDragWindow = (function() {
        // var _dragElm =[];
        // return function(_elm){
            // var _elm = _e._$get(_elm);
            // _dragElm.push(_elm);
            // _v._$addEvent(_elm, 'mousedown', function(_event){
                // var _elm = _v._$getElement(_event);
                // var _index = _u._$indexOf(_dragElm, _elm);
                // if (_event.which == 1 && _index != -1)
                    // _n._$exec('winhelper.dragWindow');
            // });
        // };
    // })();
    // /**
     // * 获取桌面的大小
     // * 
     // * @return {Object} 桌面大小
     // */
    // _p._$geDesktopSize = function() {
        // var _position = _n._$exec('os.getSystemInfo', 'desktop');
        // if(!!_position)
            // return;
        // else
            // return _position.workArea;
    // };
    // /**
     // * 获取当前窗体的位置信息
     // * 
     // * @returns {Object} _info height 窗体高度 width 窗体宽度 x 窗体x坐标 y 窗体y坐标
     // */
    // _p._$getWindowInfo = function() {
        // var _info = _n._$exec('winhelper.getWindowPosition');
        // return _info;
    // };
};
NEJ.define('{lib}native/cef/api.js', ['{lib}native/command.js','{lib}base/util.js','{lib}base/element.js'], f);