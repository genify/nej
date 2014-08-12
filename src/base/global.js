/*
 * --------------------------------------------
 * @file    原生对象接口扩展实现
 * @version 1.0
 * @author  genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    /**
     * 内置函数对象
     * @class Function
     */
    var _extpro = Function.prototype;
    /**
     * AOP增强操作，增强操作接受一个输入参数包含以下信息
     *
     *  | 参数名称 | 参数类型  | 参数描述 |
     *  | :--     | :--      | :-- |
     *  | args    | Array    | 函数调用时实际输入参数，各增强操作中可以改变值后将影响至后续的操作 |
     *  | value   | Variable | 输出结果 |
     *  | stopped | Boolean  | 是否结束操作，终止后续操作 |
     *
     * @method Function#_$aop
     * @param  {Function} arg0 - 前置操作，接受一个输入参数，见描述信息
     * @param  {Function} arg1 - 后置操作，接受一个输入参数，见描述信息
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
                _event.value = _handler.apply(this,_event.args);
                _after(_event);
            }
            return _event.value;
        };
    };
    /**
     * 绑定接口及参数，使其的调用对象保持一致
     *
     *  ```javascript
     *  var scope = {a:0};
     * 
     *  var func = function(a,b){
     *      // 第一个参数 ：1
     *      console.log(a);
     *      // 第二个参数 ： 2
     *      consoel.log(b);
     *      // 当前this.a ： 0
     *      console.log(this.a);
     *  };
     * 
     *  func._$bind(scope,"1")(2);
     *  ```
     *
     * @method Function#_$bind
     * @see    Function#_$bind2
     * @param  {Object}   arg0 - 需要保持一致的对象，null表示window对象，此参数外的其他参数作为绑定参数
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
            return _function.apply(_object||null,_argc);
        };
    };
    /**
     * 绑定接口及参数，使其的调用对象保持一致，
     * 该接口与_$bind接口的差别在于绑定时参数和调用时参数的顺序不一样，
     * _$bind优先传入绑定时参数，_$bind2优先传入调用时参数
     *
     *  ```javascript
     *  var scope = {a:0};
     * 
     *  var func = function(a,b){
     *      // 第一个参数 ：2
     *      console.log(a);
     *      // 第二个参数 ： 1
     *      consoel.log(b);
     *      // 当前this.a ： 0
     *      console.log(this.a);
     *  };
     * 
     *  func._$bind(scope,"1")(2);
     *  ```
     *
     * @method Function#_$bind2
     * @see    Function#_$bind
     * @param  {Object}   arg0   - 需要保持一致的对象，null表示window对象，此参数外的其他参数作为绑定参数
     * @return {Function} 返回绑定后的事件函数
     */
    _extpro._$bind2 = function() {
        var _args = arguments,
            _object = _r.shift.call(_args),
            _function = this;
        return function(){
            _r.push.apply(arguments,_args);
            return _function.apply(_object||null,arguments);
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
        NEJ = this.NEJ||{};
        // copy object properties
        // only for nej compatiable
        NEJ.copy = function(a,b){
            a = a||{};
            b = b||_o;
            for(var x in b){
                if (b.hasOwnProperty(x)){
                    a[x] = b[x];
                }
            }
            return a;
        };
        // NEJ namespace
        NEJ = NEJ.copy(
            NEJ,{
                O:_o,R:_r,F:_f,
                P:function(_namespace){
                    if (!_namespace||!_namespace.length){
                        return null;
                    }
                    var _package = window;
                    for(var a=_namespace.split('.'),
                            l=a.length,i=(a[0]=='window')?1:0;i<l;
                            _package=_package[a[i]]=_package[a[i]]||{},i++);
                    return  _package;
                }
            }
        );
        
        return NEJ;
    }

    return _p;
});
