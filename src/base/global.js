/*
 * --------------------------------------------
 * 接口实现文件
 * 
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    // copy object properties
    // only for nej
    this.copy = function(a,b){
        a = a||{};
        b = b||_o;
        for(var x in b){
            a[x] = b[x];
        }
    };
    // extend native object method
    var _extpro = Function.prototype;
    /**
     * AOP增强操作，增强操作接受一个输入参数包含以下信息
     * 
     * [ntb]
     *  参数名称       | 参数类型          | 参数描述
     *  ------------------------------------
     *  args    | Array    | 函数调用时实际输入参数，各增强操作中可以改变值后将影响至后续的操作
     *  stopped | Boolean  | 是否结束操作，终止后续操作
     *  value   | Variable | 输出结果
     * [/ntb]
     * 
     * @api    {Function.prototype._$aop}
     * @param  {Function} 之前操作，接受一个输入参数，见描述信息
     * @param  {Function} 之后操作，接受一个输入参数，见描述信息
     * @return {Function} 增强后操作函数
     */
    _extpro._$aop = function(_before,_after){
        var _after = _after||_f,
            _before = _before||_f,
            _handler = this;
        return function(){
            var _event = {args:_r.slice.call(arguments,0)};
            _before(_event);
            if (!_event.stopped){
                _event.value = _handler
                      .apply(this,_event.args);
                _after(_event);
            } 
            return _event.value;
        };
    };
    /**
     * 绑定接口及参数，使其的调用对象保持一致<br/>
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P("nej.v"),
     *       _obj = {a:0};
     *   var _f = function(_a,_b){
     *       // 第一个参数 ：1
     *       console.log(_a);
     *       // 第二个参数 ： 2
     *       consoel.log(_b);
     *       // 当前this.a ： 0 
     *       console.log(this.a);
     *   }._$bind(_obj,"1");
     *   _f(2);
     * [/code]
     * 
     * @see    {#_$bind2}
     * @api    {Function.prototype._$bind}
     * @param  {Object}   _object 需要保持一致的对象，null表示window对象
     * @param  {Variable} [argument0[,argument1 ...]] 函数调用时需要的参数
     * @return {Function} 返回绑定后的函数
     */
    _extpro._$bind = function() {
        var _args = arguments,
            _object = arguments[0],
            _function = this;
        return function(){
            // not use slice for chrome 10 beta and Array.apply for android
            var _argc = _r.slice.call(_args,1);
            _r.push.apply(_argc,arguments);
            return _function.apply(_object||window,_argc);
        };
    };
    /**
     * 绑定接口及参数，使其的调用对象保持一致，
     * 该接口与_$bind接口的差别在于绑定时参数和调用时参数的顺序不一样，
     * _$bind优先传入绑定时参数
     * _$bind2优先传入调用时参数<br/>
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P("nej.v"),
     *       _obj = {a:0};
     *   var _f = function(_a,_b){
     *       // 第一个参数 ：2
     *       console.log(_a);
     *       // 第二个参数 ： 1
     *       consoel.log(_b);
     *       // 当前this.a ： 0 
     *       console.log(this.a);
     *   }._$bind2(_obj,"1");
     *   _f(2);
     * [/code]
     * 
     * @see    {#_$bind}
     * @api    {Function.prototype._$bind2}
     * @param  {Object}   需要保持一致的对象，null表示window对象
     * @param  {Variable} 函数调用时需要的参数
     * @return {Function} 返回绑定后的事件函数
     */
    _extpro._$bind2 = function() {
        var _args = arguments,
            _object = _r.shift.call(_args),
            _function = this;
        return function(){
            _r.push.apply(arguments,_args);
            return _function.apply(_object||window,arguments);
        };
    };
    // for compatiable
    var _extpro = String.prototype;
    if (!_extpro.trim){
         _extpro.trim = (function(){
            var _reg = /(?:^\s+)|(?:\s+$)/g;
            return function(){
                return this.replace(_reg,'');
            };
         })();
    }
    if (!this.console){
        this.console = {
            log:_f,
            error:_f
        };
    }

    if (CMPT){

        // NEJ namespace
        _p.O = _o;
        _p.R = _r;
        _p.F = _f;
        this.NEJ = copy(this.NEJ||{},_p);
        
        // mwf adaptation
        if (!this.MWF) this.MWF = this.NEJ;
        if (!this.mwf) this.mwf = this.nej;
    }

    return _p;
});
