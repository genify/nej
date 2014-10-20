/*
 * ------------------------------------------
 * 模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    // aop regist api
    _e._$regist = 
    _e._$regist._$aop(function(_event){
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
    _e._$testByTemplate = function(_tid){
        _e._$parseTemplate(_tid||'template-box');
    };
};
NEJ.define('{lib}util/dispatcher/test.js',
          ['{lib}util/dispatcher/module.2.js'
          ,'{lib}util/history/history.js'
          ,'{lib}util/template/tpl.js'],f);