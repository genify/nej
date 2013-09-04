/**
 * ------------------------------------------
 * 系统参数接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        c = NEJ.P('navigator.n2j'),
        u = NEJ.P('nej.u'),
        j = NEJ.P('nej.j'),
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
     * 设置系统参数
     * @param {Object} _key        系统参数键值
     * @param {Object} _value    系统参数值
     * @return {Void}
     */
    j._$setDataInPreference = function(_key,_value){
        PhoneGap._$exec('Properties.setValue',{param:[null,_key,_value]});
        PhoneGap._$exec('Properties.flush');
    };
    /**
     * 获得系统参数值
     * @param {Object}   _key       系统参数键值
     * @param {Function} _callback  回调函数
     * @return {Void}
     */
    j._$getDataInPreference = function(_key,_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Properties.getValue',
                       {param:['navigator.n2j.'+_sn,_key]});
    };
    /**
     * 获得所有系统参数值
     * @param {Function} _callback  回调函数
     * @return {Void}
     */
    j._$getAllDataInPreference = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Properties.getAll',
                       {param:['navigator.n2j.'+_sn]});
    }; 
    /**
     * 删除系统参数值
     * @param {Object} _key 系统参数键值
     * @return {Void}
     */
    j._$delDataInPreference = function(_key){
        PhoneGap._$exec('Properties.remove',{param:[null,_key]});
        PhoneGap._$exec('Properties.flush');
    };
};
NEJ.define('{lib}native/ios/preference.js',
      ['{lib}native/ios/phonegap.js'],f);