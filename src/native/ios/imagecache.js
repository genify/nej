/**
 * ------------------------------------------
 * 文件缓存实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o=MWF.O,
        f=MWF.F,
        u=MWF.P('nej.u'),
        c=MWF.P('navigator.n2j'),
        p=MWF.P('nej.ic');
    var __cache = {};
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
     * 执行回调函数
     * @param  {String} _key 回调标识
     * @return {Void}
     */
    var __callback = function(_key,_result){
        var _cb = __cache[_key]||f,
            _result=_result||o;
        _cb(_result.result,_result.data);
        if(_result.action=='done'){
            __clear(_key);
        }
    };
    
    /**
     * 下载离线图片
     * @param {Array} _imgUrls    图片url地址列表
     * @param {Function} _callback 回调函书
     * @return {Void}
     */
    p._$offlineImages = function(_imgUrls,_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('ImageCache.downloadAndCacheImages',
                       {param:['navigator.n2j.'+_sn],query:{imageUrls:_imgUrls}});
    };
    /**
     * 取消离线下载图片
     * @return {Void}
     */
    p._$cancelOfflineImages = function(){
        PhoneGap._$exec('ImageCache.cancelDownloading');
    };
    /**
     * 设置离线缓存大小限制（M）
     * @param {Number} _limitSize 缓存大小
     * @return {Void}
     */
    p._$setLimitSize = function(_limitSize){
        PhoneGap._$exec('ImageCache.setLimitSize',
                        {param:[_limitSize]});
    };
    /**
     * 当前用了多少缓存
     * @param {Number} _callback 回调函数 
     * @return {Void}
     */
    p._$getCurrentSize = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('ImageCache.getCurrentSize',
                        {param:['navigator.n2j.'+_sn]});
    };
    /**
     * 清除所有缓存
     * @param {Object} _callback    回调函数
     * @return {Void}
     */
    p._$cleanAllCache = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('ImageCache.cleanAllCache',
                        {param:['navigator.n2j.'+_sn]});
    };
    /**
     * 取消清除缓存
     * @return {Void}
     */
    p._$cancelCleaning = function(){
        PhoneGap._$exec('ImageCache.cancelCleaning');
    };
    /**
     * 开启缓存
     * @return {Void}
     */
    p._$enableCache = function(){
        PhoneGap._$exec('ImageCache.enable');
    };
    /**
     * 关闭缓存
     * @return {Void}
     */
    p._$disableCache = function(){
        PhoneGap._$exec('ImageCache.disable');
    };
    /**
     * 是否开启缓存
     * @param {Object} _callback    回调函数
     * @return {Void}
     */
    p._$isEnableCache = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('ImageCache.isEnable',
                        {param:['navigator.n2j.'+_sn]});
    };
};
NEJ.define('{lib}native/ios/imagecache.js',
      ['{lib}native/ios/phonegap.js'],f);