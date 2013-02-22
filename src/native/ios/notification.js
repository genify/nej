/**
 * ------------------------------------------
 * 通知接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        c = NEJ.P('navigator.n2j'),
        p = NEJ.P('navigator.notification'),
        __cache = {};
    /**
     * 执行回调
     * @param  {String} _key 回调标识
     * @return {Void}
     */
    var __callback = function(_key,_result){
        var _cb = __cache[_key]||f;
        try{_cb((_result||o).result,(_result||o).data);}catch(ex){}
        delete c[_key];
        delete __cache[_key];
    };
    /**
     * 信息提示
     * @param  {String} _message 提示消息内容
     * @param  {Object} _options 可选配置参数,已处理参数列表如下
     *                           title   [String]  - 提醒标题
     *                           label   [String]  - 按钮文字
     *                           callback[Function]- 回调函数
     * @return {Void}
     */
    p.alert = function(_message,_options){
        _options = _options||o;
        var _key = 'an_'+u._$randNumberString();
        c[_key] = _options.callback||f;
        PhoneGap._$exec('Notification.alert',
                       {param:[_message||''],
                        query:{title:_options.title||'Alert',
                               buttonLabel: _options.label||'OK',
                               callback:'navigator.n2j.'+_key}
                               });
    };
    /**
     * 确认提示
     * @param  {String} _message 确认消息内容
     * @param  {Object} _options 可选配置参数,已处理参数列表如下
     *                           title   [String] - 提醒标题
     *                           label   [String] - 按钮文字
     * @return {Void}
     */
    p.confirm = function(_message,_options){
        _options = _options||o;
        PhoneGap._$exec('Notification.confirm',
                       {param:[_message||'',
                               _options.title||'Confirm',
                               _options.label||'OK,Cancel']});
    };
    /**
     * 声音提示
     * @param  {Number} _count 重复次数
     * @return {Void}
     */
    p.beep = function(_count){
        PhoneGap._$exec('Notification.beep',{param:[_count]});
    };
    /**
     * 响铃
     * @param {Object} _uri 铃声地址
     * @return {Void}
     */
    p.ring = function(_uri){
        PhoneGap._$exec('Sound.play',{param:[_uri]});
    };
    /**
     * 设置应用数字标记
     * @param  {Number} _number 数量
     * @return {Void}
     */
    p.badge = function(_number){
        PhoneGap._$exec('Notification.setAppBadgeNumber',{param:[_number]});
    };
    /**
     * 消息通知
     * @param  {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           ticker  [String] - 通知栏提示文字
     *                           title   [String] - 通知展开提示标题
     *                           message [String] - 通知展开提示内容
     * @return {Void}    
     */
    p.notify = function(_options){
        _options = _options||o;
        NNotification.ShowNotification(1,
                    _options.ticker||'',
                    _options.title||'',
                    _options.message||'');
    };
    /**
     * 震动提示
     * @param  {Number} _milliseconds 震动时间
     * @return {Void}
     */
    p.vibrate = function(_milliseconds){
        PhoneGap._$exec('Notification.vibrate',
                       {param:[_milliseconds]});
    };
};
NEJ.define('{lib}native/ios/notification.js',
      ['{lib}native/ios/phonegap.js'],f);