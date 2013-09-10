/**
 * ------------------------------------------
 * 地理位置接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('navigator.geo'),
        __cache = {};
    /**
     * 取当前位置信息
     * @param  {Object}  _options 可选配置参数,已处理参数列表如下所示
     *                            timeout    [Number]   - 超时时间(毫秒)
     *                            expire     [Number]   - 位置被缓存时间(毫秒)
     *                            accuracy   [Boolean]  - 高精度
     *                            onsuccess  [Function] - 成功回调
     *                            onerror    [Function] - 失败回调
     * @return {Void}
     */
    p.getCurrentPosition = function(_options){
            _options = _options||o;
            if (!!__cache.gp){
                try{(_options.onerror||f)({code:3,message:'Geolocation Error: Still waiting for previous getCurrentPosition() request.'});}catch(ex){}
                return;
            }
            __cache.gp = {onerror:_options.onerror||f,
                          onsuccess:_options.onsuccess||f};
            PhoneGap._$exec('Geolocation.getCurrentLocation',
                           {param:[!!_options.accuracy,
                                     _options.timeout||10000,
                                     _options.expire||10000]});
        };
    // geolocation callback
    navigator['_geo'] = {
        /**
         * PHONEGAP成功回调
         * @return {Void}
         */
        success : function(_id,_lat,_lng,_alt,_altacc,_head,_vel,_stamp){
            if (!__cache.gp) return;
            if (_lat==null||_lng==null){
                this.fail(_id,2,'Lat/Lng are undefined.');
                return;
            }
            try{__cache.gp.onsuccess({timestamp:_stamp,
                                      coords:{latitude:_lat,longitude:_lng,
                                              altitude:_alt,accuracy:_altacc,
                                              altitudeAccuracy:null,heading:_head,
                                              speed:_vel}});}catch(ex){}
            delete __cache.gp;
        },
        /**
         * PHONEGAP失败回调
         * @return {Void}
         */
        fail : function(_id,_code,_message){
            if (!__cache.gp) return;
            try{__cache.gp.onerror({code:_code,message:_message});}catch(ex){}
            delete __cache.gp;
        }
    };
};
NEJ.define('{lib}native/android/geolocation.js',
      ['{lib}native/android/phonegap.js'],f);