/**
 * ------------------------------------------
 * 系统参数接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var j = NEJ.P('nej.j'),
        p = NEJ.P('nej.mb');
    /**
     * 设置系统参数
     * @param {Object} _key        系统参数键值
     * @param {Object} _value    系统参数值
     * @return {Void}
     */
    j._$setDataInPreference = function(_key,_value){
        p._$exec('NPreferences.putSettingItem',_key,_value);
    };
    /**
     * 获得系统参数值
     * @param {Object} _key     系统参数键值
     * @return {Void}
     */
    j._$getDataInPreference = function(_key){
        return p._$exec('NPreferences.getSettingItem',_key);
    }; 
    /**
     * 删除系统参数值
     * @param {Object} _key 系统参数键值
     * @return {Void}
     */
    j._$delDataInPreference = function(_key){
        return p._$exec('NPreferences.delSettingItem',_key);
    };
};
NEJ.define('{lib}native/android/preference.js',
      ['{lib}native/android/phonegap.js'],f);