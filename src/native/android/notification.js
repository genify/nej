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
        x = NEJ.P('x.notify'),
        p = NEJ.P('navigator.notification');
    /**
     * 信息提示
     * @param  {String} _message 提示消息内容
     * @param  {Object} _options 可选配置参数,已处理参数列表如下
     *                           title      [String]   - 提醒标题
     *                           label      [String]   - 按钮文字
     *                           onbutton   [Function] - 按钮回调
     * @return {Void}
     */
    p.alert = function(_message,_options){
        _options = _options||o;
        PhoneGap._$exec('Notification.alert',
                       {param:[_message||'',
                               _options.title||'Alert',
                               _options.label||'OK'],
                        oncallback:_options.onbutton||f});
    };
    /**
     * 确认提示
     * @param  {String} _message 确认消息内容
     * @param  {Object} _options 可选配置参数,已处理参数列表如下
     *                           title      [String]   - 提醒标题
     *                           label      [String]   - 按钮文字
     *                           onbutton   [Function] - 按钮回调，输入按钮索引
     * @return {Void}
     */
    p.confirm = function(_message,_options){
        _options = _options||o;
        PhoneGap._$exec('Notification.confirm',
                       {param:[_message||'',
                               _options.title||'Confirm',
                               _options.label||'OK,Cancel'],
                        oncallback:_options.onbutton||f});
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
        NNotification.ToneNotify(_uri);
    };
    /**
     * 消息通知
     * @param  {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           ticker     [String]  - 通知栏提示文字
     *                           title      [String]  - 通知展开提示标题
     *                           message    [String]  - 通知展开提示内容
     *                           manual     [Boolean] - 是否手动取消
     * @return {Void}    
     */
    p.notify = function(_options){
        _options = _options||o;
        NNotification.ShowNotification(1,
                    _options.ticker||'',
                    _options.title||'',
                    _options.message||'',
                    !_options.manual);
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
    /**
     * 选择铃声
     * @param  {String}   _uri      默认铃声地址
     * @param  {Function} _callback 回调
     * @return {Void}
     */
    p.ringtone = function(_uri,_callback){
        x.onselect = _callback||f;
        NPreferences.ChoiceRingtone(_uri,'window.x.notify.onselect');
    };
    /**
     * 取消通知
     * @return {Void}
     */
    p.cancel = function(){
        NNotification.CancelNotification();
    };
};
define('{lib}native/android/notification.js',
      ['{lib}native/android/phonegap.js'],f);