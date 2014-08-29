/*
 * ------------------------------------------
 * HTML5 - History API封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/util',
    'base/event',
    'base/platform',
    'util/event/event',
    'util/timer/animation',
    '{platform}history.js'
],function(_u,_v,_m,_t0,_t1,_h,_p,_o,_f,_r){
    var _reg1 = /^[#?]+/,
        _reg2 = /#(.*?)$/,
        _ctxt = this;
    /*
     * 判断是否需要做Hack处理
     * @return {Boolean} 是否需要做Hack处理
     */
    var _isHack = function(){
        return !history.pushState||_m._$IS.android||!history.auto;
    };
    /*
     * 设置地址
     * @param  {String}  页面地址
     * @param  {Boolean} 是否不保存历史
     * @return {Void}
     */
    var _setLocation = function(_url,_replaced){
        var _name = !_replaced?'pushState':'replaceState';
        _ctxt.history[_name](null,document.title,_url);
    };
    /*
     * 取位置信息
     * @return {Object} 位置信息
     */
    var _getLocation = function(){
        return location.parse(_ctxt.location.href);
    };
    // extend api
    _setLocation = 
    _setLocation._$aop(function(_event){
        if (!_isHack()) return;
        _event.stopped = !0;
        var _args = _event.args;
        // not encodeURIComponent
        _url = _args[0].replace(_reg1,'');
        !_args[1] ? _ctxt.location.hash = _url
                  : _ctxt.location.replace('#'+_url);
    });
    _getLocation = 
    _getLocation._$aop(function(_event){
        if (!_isHack()) return;
        _event.stopped = !0;
        // fix ie6 location.hash error for #/m/a?a=aaa
        var _hash = _reg2.test(_ctxt.location.href)?RegExp.$1:'';
        // not decodeURIComponent
        _event.value = location.parse(_hash.replace(_reg1,''));
    });
    /**
     * 重定向路径
     * 
     * @method external:location.redirect
     * @param  {String}  arg0 - 路径
     * @param  {Boolean} arg1 - 是否替换原来的历史
     * @return {Void}
     */
    location.redirect = function(_url,_replaced){
        _setLocation(_url,_replaced);
    };
    /**
     * 启动地址检测
     * 
     * @method external:location.active
     * @return {Void}
     */
    location.active = (function(){
        var _timer,_url,_location,_locked,_done;
        // parse location change
        var _onLocationChange = function(_href){
            // locked from history back
            if (!!_locked){
                _locked = !1;
                return;
            }
            var _event = {
                oldValue:_location,
                newValue:_getLocation()
            };
            // check ignore beforeurlchange event fire
            if (!!location.ignored){
                location.ignored = !1;
            }else{
                _v._$dispatchEvent(
                    location,'beforeurlchange',_event
                );
                if (_event.stopped){
                    if (!!_location){
                        _locked = !0;
                        _setLocation(_location.href,!0);
                    }
                    return;
                };
            }
            // fire urlchange
            _url = _ctxt.location.href;
            _location = _event.newValue;
            _v._$dispatchEvent(
                location,'urlchange',_location
            );
            _h.__pushHistory(_location.href);
        };
        // check location
        var _doCheckLocation = function(){
            if (_url!=_ctxt.location.href) _onLocationChange();
            _timer = _t0.requestAnimationFrame(_doCheckLocation);
        };
        // check use hashchange event on window
        var _useHashChange = function(){
            var _knl = _m._$KERNEL;
                 _ie7 = _knl.engine=='trident'&&_knl.release<='3.0';
            return _isHack()&&('onhashchange' in window)&&!_ie7;
        };
        return function(_context){
            // lock active
            if (!!_done){
                return;
            }
            _done = !0;
            // do init
            _ctxt = _context||window;
            // ignore onhashchange on ie7
            if (_useHashChange()){
                _v._$addEvent(
                    _ctxt,'hashchange',
                    _onLocationChange
                );
                _onLocationChange();
            }else if(!_timer){
                _timer = requestAnimationFrame(_doCheckLocation);
            }
        };
    })();
    /**
     * 地址信息对象
     * 
     * @typedef  {Object} external:location~LocationModel
     * @property {String} path  - 路径信息，不带查询参数
     * @property {String} href  - 完整路径，带查询参数
     * @property {Object} query - 查询参数解析出来的对象
     */
    /**
     * 解析地址信息
     * 
     * @method external:location.parse
     * @param  {String} arg0 - 地址
     * @return {external:location~LocationModel} 地址信息
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
     * 
     * @method external:location.same
     * @param  {String}  arg0 - 路径
     * @return {Boolean}        是否一致
     */
    location.same = function(_url){
        return _getLocation().href==_url;
    };
    /**
     * 地址变化之前触发事件
     *
     * @event    external:location.onbeforeurlchange
     * @param    {Object}  event   - 地址信息
     * @property {external:location~LocationModel} oldValue - 旧地址信息
     * @property {external:location~LocationModel} newValue - 新地址信息
     * @property {Boolean} stopped - 是否阻止地址跳转
     */
    /**
     * 地址变化触发事件
     *
     * @event    external:location.onurlchange
     * @param    {external:location~LocationModel} event - 地址信息
     */
    _t0._$$CustomEvent._$allocate({
        element:location,
        event:['beforeurlchange','urlchange']
    });
    
    return _p;
});