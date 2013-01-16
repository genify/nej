/**
 * ------------------------------------------
 * 多媒体捕捉接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('navigator.capture');
    /**
     * 相机拍照
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     *                           quality    [Number]   - 照片质量[0,100]
     *                           type       [Number]   - 照片返回格式
     *                                                   0 - base64
     *                                                   1 - uri
     *                           onsuccess  [Function] - 成功回调函数
     *                           onerror    [Function] - 失败回调函数
     * @return {Void}
     */
    p.getImage = function(_options){
        _options = _options||o;
        // [quality,destinationType,sourceType]
        var _query = {sourceType:1,allowEdit:!1,
                      quality:parseInt(_options.quality)||80},
            _value = _options.type;
        _query.destinationType = _value!=null?_value:1;
        PhoneGap._$exec('Camera.getPicture',
                       {query:_query,
                        onerror:_options.onerror||f,
                        oncallback:_options.onsuccess||f});
    };
    /**
     * 相机视频
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     *                           onsuccess       [Function] - 成功回调函数
     *                           onerror         [Function] - 失败回调函数
     * @return {Void}
     */
    p.getVideo = function(_options){
        // TODO capture video
    };
    /**
     * 录音
     * @param  {Object} _options 可选配置参数，已处理参数列表如下
     *                           onsuccess       [Function] - 成功回调函数
     *                           onerror         [Function] - 失败回调函数
     * @return {Void}
     */
    p.getAudio = function(_options){
        // TODO capture audio
    };
};
define('{lib}native/ios/capture.js',
      ['{lib}native/ios/phonegap.js'],f);