/**
 * ------------------------------------------
 * 文件接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var f = NEJ.F,
        u = NEJ.P('nej.u'),
        t = NEJ.P('x.file'),
        p = NEJ.P('navigator.file');
    /**
     * 打开文件选择
     * @param  {Object} _options 可选配置参数,已处理参数列表如下所示
     *                           filter     [String]   - 文件类型限制
     *                           onsuccess  [Function] - 选择成功回调
     * @return {Void}
     */
    p.open = function(_options){
        // TODO file open
    };
    /**
     * 文件选择接口
     * @param  {Function} _onselect 文件选择后回调
     * @return {Void}
     */
    p.select = function(_onselect){
        t.onselect = _onselect||f;
        NPreferences.SelectPicture('window.x.file.onselect');
    };
    /**
     * 文件生成缩略图接口
     * @param  {String}   _file    文件路径
     * @param  {Function} _onthumb 缩略图回调
     * @return {Void}
     */
    p.thumb = function(_file,_onthumb){
        t.onthumb = _onthumb||f;
        NUtils.ThumbnailJPEG(_file,"window.x.file.onthumb");
    };
    t.onthumb = f;
    //if (!!window.SampleJSPAPI){
    //    SampleJSPAPI.RegisterOnThumbnailJPEG("window.x.file.onthumb");
    //}
    /**
     * 文件上传
     * @param  {String} _url     上传地址
     * @param  {String} _file    文件地址
     * @param  {Object} _options 可选配置参数，已处理参数列表
     *                           headers    [Object]    头信息
     *                           finish     [String]    上传结束跳转url
     *                           pgtitle    [String]    进度标题
     *                           pgdesc     [String]    进度描述
     *                           pgsucc     [String]    上传成功提示
     *                           pgfail     [String]    上传失败提示
     *                           tipcnt     [String]    提示内容
     *                           tiptime    [Number]    提示延时时间
     *                           onload     [Function]  上传成功回调
     *                           onerror    [Function]  上传失败回调
     *                           onprogress [Function]  上传过程回调
     * @return {Void}
     */
    p.upload = function(_url,_file,_options){
        _options = _options||o;
        var _key = u._$randNumberString();
        t['cb_'+_key] = {onload:_options.onload||f,
                         onerror:_options.onerror||f,
                         onprogress:_options.onprogress||f,
                         oncallback:t.onupload._$bind(t,_key)};
        UploadMan.SetUploadBarTitleInfo(_options.pgtitle||'网易博客',
                                        _options.pgdesc||'正在上传文件...',
                                        _options.pgsucc||'上传成功',
                                        _options.pgfail||'上传出现错误');
        UploadMan[_file.indexOf('content://')>=0?'Upload':'UploadByFilePath']
                 (_key,_url,_file,
                  JSON.stringify({finish:_options.finish||null,
                                  headers:_options.headers||null}),
                  'window.x.file.cb_'+_key+'.oncallback');
        nej.u.showToast(_options.tipcnt||'',_options.tiptime||3000);
    };
    /**
     * 文件上传回调
     * @param  {String} _key   上传标识
     * @param  {Number} _state 上传状态
     *                          1 - 上传过程
     *                          2 - 上传完成
     *                          3 - 上传出错
     * @return {Void}
     */
    t.onupload = (function(){
        var _name = ['','onprogress','onload','onerror'];
        return function(_key,_state){
            _state = parseInt(_state)||0;
            if (!_state) return;
            var _cache = t['cb_'+_key];
            if (!_cache) return;
            var _callback = _cache[_name[_state]];
            if (!_callback) return;
            try{
                switch(_state){
                    case 1:
    //                    _callback({total:parseInt(arguments[3])||0,loaded:parseInt(arguments[2])||0});
                    return;
                    case 2:
                        _callback(arguments[4]);
                    break;
                    case 3:
                        _callback();
                    break;
                }
            }catch(ex){
                alert(ex.message)
            }
            delete t['cb_'+_key];
        };
    })();
};
NEJ.define('{lib}native/android/file.js',
      ['{lib}native/android/phonegap.js'],f);