/**
 * ------------------------------------------
 * 文件接口实现文件
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
        p = NEJ.P('navigator.file'),
        __cache = {}; // callback cache
    /**
     * 清理缓存信息
     * @param  {String} _key 回调标识
     * @return {Void}
     */
    var __clear = function(_key){
        delete c[_key];
        delete __cache[_key];
    };
    /**
     * 执行回调
     * @param  {String} _key 回调标识
     * @return {Void}
     */
    var __callback = function(_key,_result){
        _result = _result||o;
        var _data = __cache[_key];
        if (!_data) return;
        switch(_result.action){
            case 'sending':
                (_data.onprogress||f)(
                    {total:_result.totalToWrite,
                     loaded:_result.totalWritten});
            return;
            case 'finish':
                (_data.onload||f)(decodeURIComponent(_result.result));
            break;
            case 'failed':
                __clear(_key);
                (_data.onerror||f)(
                    {code:-90000,
                     message:_result.reason});
            break;
        }
        __clear(_key);
    };
    /**
     * 选择图片文件
     * @param  {Function} _onselect 文件选择后回调
     * @return {Void}
     */
    p.select = function(_onselect){
        PhoneGap._$exec('Camera.getPicture',
                       {query:{sourceType:0,
                               destinationType:1},
                        oncallback:_onselect||f});
    };
    /**
     * 文件上传
     * @param  {String} _url     上传地址
     * @param  {String} _file    文件地址
     * @param  {Object} _options 可选配置参数，已处理参数列表
     *                           token      [String]   - 用户登录标识
     *                           headers    [Object]   - 头信息表
     *                           onload     [Function] - 上传成功回调
     *                           onerror    [Function] - 上传失败回调
     *                           onprogress [Function] - 上传过程回调
     * @return {Void}
     */
    p.upload = function(_url,_file,_options){
        _options = _options||o;
        var _key = 'up_'+u._$randNumberString(6);
        __cache[_key] = _options;
        c[_key] = __callback._$bind(null,_key);
        PhoneGap._$exec('File.upload',{param:
                       ['navigator.n2j.'+_key,
                        _url,_file,_options.token||'',
                        {headers:_options.headers||null}]});
    };
    /**
     * 进度信息
     * @param  {Float}  _ratio   比例，0-1之间的值，输入值大于1时自动关闭进度条
     * @param  {Object} _options 可选配置参数
     *                           action   [Number] - 操作标识 0-设置，1-显示
     *                           message  [String] - 提示信息，默认为：正在上传xx%
     *                           oncancel [String] - 取消上传回调
     * @return {Void}
     */
    p.progress = function(_ratio,_options){
        _options = _options||o;
        var _message = _options.message||('正在上传'+Math.floor(_ratio*100)+'%');
        _ratio = ''+_ratio;
        if (_options.action!=1){
            parseFloat(_ratio)>=1 ? PhoneGap._$exec('ProgressView.destroy')
                      : PhoneGap._$exec('ProgressView.setProgress',{param:[_ratio,_message]});
            return;
        }
        var _key = 'pg_'+u._$randNumberString(6);
        c[_key] = _options.oncancel||f;
        PhoneGap._$exec('ProgressView.show',{param:['navigator.n2j.'+_key,_ratio,_message]});
    };
};
define('{lib}native/ios/file.js',
      ['{lib}native/ios/phonegap.js'],f);