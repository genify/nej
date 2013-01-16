/*
 * ------------------------------------------
 * NATIVE适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _r = NEJ.R,
        _o = NEJ.O,
        _n = NEJ.P('nej.n');
    if(!!_n._$exec) return;
    /**
     * 执行NATIVE接口
     * @api    {nej.n._$exec}
     * @param  {String} 命令
     * @return {Void}
     */
    _n._$exec = function(_command){
        var _space = window,
            _arr = _command.split('.');
        for(var i=_arr[0]=='window'?1:0,l=_arr.length-1;i<l;i++)
            _space = _space[_arr[i]]||_o;
        var _handler = _space[_arr[_arr.length-1]];
        if (!_handler) return;
        return _handler.apply(_space,_r.slice.call(arguments,1));
    };
    /**
     * 判断是否存在命令
     * @api    {nej.n._$hasCMD}
     * @param  {String}  命令
     * @return {Boolean} 是否存在命令
     */
    _n._$hasCMD = function(_command){
        var _space = window,
            _arr = _command.split('.');
        for(var i=_arr[0]=='window'?1:0,l=_arr.length;i<l;i++){
            _space = _space[_arr[i]];
            if (!_space) return !1;
        }
        return !0;
    };
    NEJ.P('nej').mb = _n;
};
define('{lib}native/command.js',
      ['{lib}base/global.js'],f);