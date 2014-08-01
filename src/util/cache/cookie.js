/*
 * ------------------------------------------
 * COOKIE操作接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/util.js'
],function(NEJ,_u,_p,_o,_f,_r){
    /**
     * 设置或者获取cookie<br/>
     * 没有输入第二个参数则表示返回已有cookie<br/>
     * 如果cookie值为空字符串则表示删除cookie<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/event.js'
     *   ],function(_p){
     *       // 设置cookie的name=abc
     *       var _cookie = _p._$cookie('name','abc');
     *       _p._$cookie('name',{value:'abc'});
     * 
     *       // 设置路径，domain(如果domain不同域，cookie设置不会成功),设置过期时间1天;
     *       var _cookie = _p._$cookie('name',{
     *           value:'abc',
     *           path:'/a/',
     *           domain:'www.163.com',
     *           expires:1
     *       });
     * 
     *       // 删除cookie
     *       _p._$cookie('name','');
     *       _p._$cookie('name',{expires:-1});
     *   });
     * [/code]
     * 
     * @api    {_$cookie}
     * @param  {String}        cookie名称
     * @param  {String|Object} cookie值，如果有其他配置信息输入对象，已处理属性包括
     * @config {String}        value   cookie值
     * @config {String}        path    路径
     * @config {String}        domain  域名，当前域或者当前域的父域
     * @config {Number}        expires 过期时间偏移，单位天，负值表示删除cookie
     * @return {String}        cookie值
     */
    _p._$cookie = (function(){
        var _date = new Date(),
            _crut = +_date,   // current time milliseconds
            _days = 86400000; // milliseconds of one day
        var _getcookie = function(_name){
            var _cookie = document.cookie,
                _search = '\\b'+_name+'=',
                _index1 = _cookie.search(_search);
            if (_index1<0) return '';
            _index1 += _search.length-2;
            var _index2 = _cookie.indexOf(';',_index1);
            if (_index2<0) _index2 = _cookie.length;
            return _cookie.substring(_index1,_index2)||'';
        };
        return function(_name,_data){
            if (_data===undefined){
                return _getcookie(_name);
            }
            if (_u._$isString(_data)){
                if (!!_data){
                    document.cookie = _name+'='+_data+';';
                    return _data;
                }
                _data = {expires:-100};
            }
            _data = _data||_o;
            var _cookie = _name+'='+(_data.value||'')+';';
            delete _data.value;
            if (_data.expires!==undefined){
                _date.setTime(_crut+_data.expires*_days);
                _data.expires = _date.toGMTString();
            }
            _cookie += _u._$object2string(_data,';');
            document.cookie = _cookie;
        };
    })();
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.j'),_p);
    }
    
    return _p;
});
