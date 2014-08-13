/*
 * --------------------------------------------
 * NEJ类模型
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
/** @module base/klass */
NEJ.define([
    './global.js',
    '{platform}util.js'
],function(NEJ,_u,_p,_o,_f,_r){
    /**
     * 定义类，通过此api定义的类具有以下特性：
     *
     * * _$extend作为类的静态扩展方法
     * * __init作为类的初始化函数
     * * __super作为子类调用父类的同名函数
     *
     * ```javascript
     * NEJ.define([
     *     'base/klass'
     * ],function(k,p){
     *     // 定义类A
     *     p.A = k._$klass();
     *     var pro = A.prototype;
     *     // 初始化
     *     pro.__init = function(){
     *          // do init
     *     };
     *     // 类接口
     *     pro.__doSomething = function(a){
     *         // TODO something
     *     };
     * 
     *     return p;
     * });
     * ```
     * 
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     '/path/to/class/a.js'
     * ],function(k,a,p){
     *     // 定义类B，并继承自A
     *     p.B = k._$klass();
     *     var pro = B._$extend(a.A);
     *     // 初始化
     *     pro.__init = function(){
     *         // 调用A的初始化逻辑
     *         this.__super();
     *         // TODO B的初始化逻辑
     *     };
     *     // 类接口
     *     pro.__doSomething = function(a){
     *         // 调用A的__doSomething接口
     *         this.__super(a);
     *         // TODO B的逻辑
     *     };
     * 
     *     return p;
     * });
     * ```
     * 
     * @method _$klass
     * @return {Function} 返回定义的类
     */
    _p._$klass = (function(){
        var _isNotFunction = function(){
            return _o.toString.call(arguments[0])!=='[object Function]';
        };
        var _doFindIn = function(_method,_klass){
            while(!!_klass){
                var _pro = _klass.prototype,
                    _key = _u.__forIn(_pro,function(v){
                        return _method===v;
                    });
                if (_key!=null){
                    return {
                        name:_key,
                        klass:_klass
                    };
                }
                _klass = _klass._$super;
            }
        };
        return function(){
            // class constructor
            var _Klass = function(){
                return this.__init.apply(this,arguments);
            };
            _Klass.prototype.__init = _f;
            /**
             * 子类继承父类
             *
             * ```javascript
             * NEJ.define([
             *     'base/klass'
             * ],function(k,p){
             *     // 定义类A
             *     p.A = k._$klass();
             *     var pro = A.prototype;
             *     // 初始化
             *     pro.__init = function(){
             *          // do init
             *     };
             *     // 类接口
             *     pro.__doSomething = function(a){
             *         // TODO something
             *     };
             * 
             *     return p;
             * });
             * ```
             * 
             * ```javascript
             * NEJ.define([
             *     'base/klass',
             *     '/path/to/class/a.js'
             * ],function(k,a,p){
             *     // 定义类B，并继承自A
             *     p.B = k._$klass();
             *     var pro = B._$extend(a.A);
             *     // 初始化
             *     pro.__init = function(){
             *         // 调用A的初始化逻辑
             *         this.__super();
             *         // TODO B的初始化逻辑
             *     };
             *     // 类接口
             *     pro.__doSomething = function(a){
             *         // 调用A的__doSomething接口
             *         this.__super(a);
             *         // TODO B的逻辑
             *     };
             * 
             *     return p;
             * });
             * ```
             *
             * @method _$extend
             * @param  {Function} arg0 - 父类
             * @param  {Boolean}  arg1 - 是否拷贝父类的静态方法，默认拷贝父类静态方法
             * @return {Object}          扩展类的prototype对象
             */
            _Klass._$extend = function(_super,_static){
                if (_isNotFunction(_super)){
                    return;
                }
                // for static method
                var _this = this;
                if (_static!==!1){
                    _u.__forIn(_super,function(v,k){
                        if (!_isNotFunction(v)){
                            _this[k] = v;
                        }
                    });
                }
                // do inherit
                this._$super = _super;
                var _parent = function(){};
                _parent.prototype = _super.prototype;
                this.prototype = new _parent();
                this.prototype.constructor = this;
                // for super method call
                var _stack = [],
                    _phash = {};
                var _doUpdateCache = function(_method,_klass){
                    var _result = _doFindIn(_method,_klass);
                    if (!_result) return;
                    // save state
                    if (_stack[_stack.length-1]!=_result.name){
                        _stack.push(_result.name);
                    }
                    _phash[_result.name] = _result.klass._$super;
                    return _result.name;
                };
                this.prototype.__super = function(){
                    var _name = _stack[_stack.length-1],
                        _method = arguments.callee.caller;
                    if (!_name){
                        _name = _doUpdateCache(_method,this.constructor);
                    }else{
                        var _parent = _phash[_name].prototype;
                        // switch caller name
                        if (!_parent.hasOwnProperty(_method)||
                            _method!=_parent[_name]){
                            _name = _doUpdateCache(_method,this.constructor);
                        }else{
                            _phash[_name] = _phash[_name]._$super;
                        }
                    }
                    // call parent method
                    var _ret = _phash[_name].prototype[_name].apply(this,arguments);
                    // exit super
                    if (_name==_stack[_stack.length-1]){
                        _stack.pop();
                        delete _phash[_name];
                    }
                    return _ret;
                };

                if (CMPT){
                    var _pro = this.prototype;
                    _pro.__supInit      = _pro.__super;
                    _pro.__supReset     = _pro.__super;
                    _pro.__supDestroy   = _pro.__super;
                    _pro.__supInitNode  = _pro.__super;
                    _pro.__supDoBuild   = _pro.__super;
                    _pro.__supOnShow    = _pro.__super;
                    _pro.__supOnHide    = _pro.__super;
                    _pro.__supOnRefresh = _pro.__super;
                }

                return this.prototype;
            };
            return _Klass;
        };
    })();

    if (CMPT){
        NEJ.C = _p._$klass;
        NEJ.copy(this.NEJ,NEJ);
    }

    return _p;
});
