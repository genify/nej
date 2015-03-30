/*
 * ------------------------------------------
 * 模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
	'base/event',
	'util/template/tpl',
	'util/history/history',
	'./module.js'
],function(_v,_t,_h,_m,_p,_o,_f,_r){
	
    // aop regist api
    _m._$regist = 
    _m._$regist._$aop(function(_event){
        _event.stopped = !0;
        var _klass = _event.args[1],
            _inst = _klass._$allocate();
        _inst.count = 0;
        _v._$addEvent(
            location,'urlchange',
            function(){
                _inst.count++;
                var _options = location.parse(location.hash.substr(1));
                _options.param = _options.query;
                _options.parent = document.mbody||document.body;
                _inst._$dispatchEvent(_inst.count==1?'onshow':'onrefresh',_options);
            }
        );
        location.active();
    });
    /**
     * 使用模版测试
     * @param  {String} 模版ID
     * @return {Void}
     */
    _p._$testByTemplate = function(_tid){
        _t._$parseTemplate(_tid||'template-box');
    };
	
	return _p;
});
