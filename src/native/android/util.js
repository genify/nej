/**
 * ------------------------------------------
 * 工具函数
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var x = NEJ.P('x.util'),
        u = NEJ.P('nej.u'),
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        p = NEJ.P('nej.mb');
    /**
     * 隐藏软键盘
     * @return {Void}
     */
    p._$hideSoftKeyBoard = function(){
        p._$exec('NUtils.hideSoftKeyboard');
    };
    /**
     * 显示软键盘
     * @return {Void}
     */
    p._$showSoftKeyBoard = function(){
        p._$exec('NUtils.toggleSoftKeyboard');
    };
    /**
     * 取IP地址
     * @return {String} IP地址
     */
    p._$getIpAddress = function(){
        return p._$exec('NUtils.getLocalIpAddress');
    };
    /**
     * 取MAC地址
     * @return {String} MAC地址
     */
    p._$getMacAddress = function(){
        return p._$exec('NUtils.getLocalMacAddress');
    };
    /**
     * 判断是否在线
     * @return {Boolean} 是否在线
     */
    p._$isOnline = function(){
        return p._$exec('NUtils.isNetworkAvailable');
    };
    /**
     * 执行载入完成事件
     * @return {Void}
     */
    p._$doLoadFinish = function(){
        p._$exec('NUtils.onLoadFinish');
    };
    /**
     * 执行退出
     * @return {Void}
     */
    p._$doExit = function(){
        p._$exec('NUtils.Exit');
    };
    /**
     * 通过Native加载URL
     * @param  {String} _url 地址
     * @return {Boolean}     是否调用Native接口
     */
    p._$loadURL = function(_url){
        if (!p._$hasCMD('NUtils.loadUrl'))
            return !1;
        p._$exec('NUtils.loadUrl',_url||'');
        return !0;
    };
    /**
     * 重写回退按键
     * @param  {Function} _onback 回退事件
     * @return {Void}
     */
    p._$onButtonBack = function(_onback){
        NEJ.P('window.keyEvent').backTrigger = _onback||f;
        NEJ.P('document.keyEvent').backTrigger = _onback||f;
        p._$exec('BackButton.override');
    };
    /**
     * 移动平台模拟HOVER效果
     * @param  {String|Node} _element 节点ID或者对象
     * @param  {String}      _class   hover控制样式
     * @param  {Function}    _filter  可选，节点选择过滤器
     * @return {Void}
     */
    e._$mbhover = (function(){
        var __element;
        var __onTouchStart = function(_class,_filter,_event){
            if (!!__element) __onTouchEnd(_class);
            var _element = v._$getElement(_event,_filter);
            __element = _element;
            e._$addClassName(_element,_class);
        };
        var __onTouchEnd = function(_class,_filter,_event){
            e._$delClassName(__element,_class);
            __element = null;
        };
        return function(_element,_class){
            var _filter = arguments[2],
                _onend = __onTouchEnd._$bind(null,_class,_filter);
            v._$addEvent(_element,'touchend',_onend);
            v._$addEvent(_element,'tapcancel',_onend);
            v._$addEvent(_element,'touchstart',
                         __onTouchStart._$bind(null,_class,_filter));
        };
    })();
    /**
     * 输入框聚焦软键盘控制
     * @param  {String|Node} 输入标签
     * @return {Void}
     */
    e._$mbfocus = (function(){
        var __onBlur = function(_event){
            v._$stop(_event);
            if (!!p._$hideSoftKeyBoard)
                p._$hideSoftKeyBoard();
        };
        var __onFocus = function(){
            if (!!p._$showSoftKeyBoard)
                p._$showSoftKeyBoard();
        };
        return function(_element){
            _element = e._$get(_element);
            if (!_element) return;
            var _tag = _element.tagName.toLowerCase();
            if (_tag!='textarea'&&_tag!='input') return;
            v._$addEvent(_element,'focusout',__onBlur);
            v._$addEvent(_element,'focus',__onFocus);
        };
    })();
    
    // ---------------------------------------------
    // 以下内容后续将重构，不建议使用
    // ---------------------------------------------
    
    /**
     * 弹出菜单
     * @param {Object} _strJSON 菜单内容
     * @return {Void}
     */
    u.PopUpMenu = function(_title,_strJSON){
        NDialog.PopUpMenu(_title,_strJSON);
    };
    /**
     * 弹出对话框
     * @param {Object} _title    对话框标题
     * @param {Object} _description 对话框描述
     * @param {Object} _callbackYes 成功回调
     * @param {Object} _callbackNo 失败回调
     * @return {Void}
     */
    u.PopUpDialog = function(_title,_description,_optionTexts,_callback){
        x.callback = _callback;
        var _strJSON = '[{"title":"'+_optionTexts[0]+'","action":"window.x.util.callback(\'!0\')"}\
                          ,{"title":"'+_optionTexts[1]+'","action":"window.x.util.callback(\'!1\')"}]';
        NDialog.PopUpDialog(_title,_description,_strJSON);
    };
    /**
     * 提示消息显示
     * @param {Object} _content 消息内容
     * @param {Object} _duration 持续时间
     * @return {Void}
     */
    u.showToast = function(_content,_duration){
        NDialog.showToast(_content,_duration);
    };
    /**
     * 设置菜单显示状态
     * @param {Object} _state 消息内容
     * @return {Void}
     */
    u.SetLoginState = function(_state){
        if (!!window.NMenu)NMenu.SetLoginState(_state);
    };
    /**
     * 设置顶部导航
     * @param {Object} _strJSON
     * @return {Void}
     */
    u.SetCustomTitle = function(_strJSON){
        if (!!window.NDialog)NDialog.SetCustomTitle(_strJSON);
    };
    /**
     * 关闭软键盘
     * @return {Void}
     */
    // u.closeKeyBoard = function(){
    //     NUtils.hideSoftKeyboard();
    // };
    /**
     * 判断是否在线
     */
    // u.isOnline = function(){
    //     return NUtils.isNetworkAvailable();
    // };
};
NEJ.define('{lib}native/android/util.js',
      ['{lib}base/element.js'
      ,'{lib}native/android/phonegap.js'],f);