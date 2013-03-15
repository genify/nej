/*
 * ------------------------------------------
 * HTML5 - History API封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _v = _('nej.v'),
        _u = _('nej.u'),
        _b = _('nej.p'),
        _h = _('nej.h'),
        _t = _('nej.ut'),
        _reg1 = /^[#?]+/,
        _reg2 = /#(.*?)$/,
        _hack = !history.pushState||
                _b._$IS.android||!history.auto;
    /*
     * 设置地址
     * @param  {String}  _url      页面地址
     * @param  {Boolean} _replaced 是否不保存历史
     * @return {Void}
     */
    var _setLocation = function(_url,_replaced){
        history[!_replaced
                ?'pushState'
                :'replaceState']
               (null,document.title,_url);
    };
    /*
     * 取位置信息
     * @return {Object} 位置信息
     */
    var _getLocation = function(){
        return location.parse(location.href);
    };
    // extend api
    _setLocation = 
    _setLocation._$aop(function(_event){
        if (!_hack) return;
        var _args = _event.args;
        _event.stopped = !0;
        // not encodeURIComponent
        _url = _args[0].replace(_reg1,'');
        !_args[1] ? location.hash = _url
                  : location.replace('#'+_url);
    });
    _getLocation = 
    _getLocation._$aop(function(_event){
        if (!_hack) return;
        _event.stopped = !0;
        // fix ie6 location.hash error for #/m/a?a=aaa
        var _hash = _reg2.test(location.href)?RegExp.$1:'';
        // not decodeURIComponent
        _event.value = location.parse(_hash.replace(_reg1,''));
    });
    /**
     * 重定向路径
     * @api    {location.redirect}
     * @param  {String}  路径
     * @param  {Boolean} 是否替换原来的历史
     * @return {location}
     */
    location.redirect = function(_url,_replaced){
        _setLocation(_url,_replaced);
        return this;
    };
    /**
     * 启动地址检测
     * @api    {location.active}
     * @return {location}
     */
    location.active = (function(){
        var _timer,_url;
        // check location
        var _doCheckLocation = function(){
            if (_url!=location.href){
                _url = location.href;
                var _event = _getLocation();
                _v._$dispatchEvent(location,'urlchange',_event);
                _h.__pushHistory(_event.href);
            }
            _timer = requestAnimationFrame(_doCheckLocation);
        };
        return function(){
            if (!_timer)
                 _timer = requestAnimationFrame(_doCheckLocation);
            return this;
        };
    })();
    /**
     * 解析地址信息
     * @api    {location.parse}
     * @param  {String} 地址
     * @return {Object} 地址信息
     * @config {String} path  路径信息，不带查询参数
     * @config {String} href  完整路径，带查询参数
     * @config {Object} query 查询参数解析出来的对象
     */
    location.parse = (function(){
        var _reg0 = /^https?:\/\/.*?\//i,
            _reg1 = /[?#]/;
        return function(_url){
            // http://a.b.com/a/b/c?a=aa&b=bb#c=cc
            var _result = {href:_url};
            // /a/b/c?a=aa&b=bb#c=cc
            // 0 - /a/b/c
            // 1 - a=aa&b=bb
            // 2 - c=cc
            _url = (_url||'').replace(_reg0,'/').split(_reg1);
            // for /?/a/b?a=aa&b=bb
            var _count = 1;
            if (_url[0]=='/'&&
               (_url[1]||'').indexOf('/')==0)
                _count = 2;
            // /a/b/c or /?/a/b
            _result.path = _url.splice(0,_count).join('?');
            _result.query = _u._$query2object(_url.join('&'));
            return _result;
        };
    })();
    /**
     * 判断路径和当前地址栏路径是否一致
     * @api    {location.same}
     * @param  {String}  路径
     * @return {Boolean} 是否一致
     */
    location.same = function(_url){
        return _getLocation().href==_url;
    };
    // extend onurlchange event on location
    _t._$$CustomEvent._$allocate({
        element:location
       ,event:'urlchange'
    });
};
NEJ.define('{lib}util/history/history.js',
          ['{lib}util/event/event.js'
          ,'{lib}util/timer/animation.js'
          ,'{patch}api.js'],f);