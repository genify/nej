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
        var _klass = _event.args[1],
            _options = location.parse(location.href);
        _options.param = _options.query;
        _options.parent = document.mbody||document.body;
        var _inst = _klass._$allocate();
        _inst._$dispatchEvent('onshow',_options);
        _v._$addEvent(
            location,'urlchange',
            function(){
                var _options = location.parse(location.href);
                _options.param = _options.query;
                _inst._$dispatchEvent('onrefresh',_options);
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
        _e._$parseTemplate('template-box');
    };
};
NEJ.define('{lib}util/dispatcher/test.js',
          ['{lib}util/dispatcher/module.2.js'
          ,'{lib}util/history/history.js'
          ,'{lib}util/template/tpl.js'],f);