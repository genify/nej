    /**
     * 定义类，通过此api定义的类具有以下特性：<br/>
     *
     * [ul]
     *   具有静态扩展接口_$extend
     *   __init作为类的初始化函数
     *   
     * [/ul]
     *
     * [code]
     *   NEJ.define([
     *       '{lib}base/global.js'
     *   ],function(_p){
     *       // 定义类A
     *      var A = _p._$klass();
     *      // 初始化
     *      A.prototype.__init = function(){
     *           // do init
     *      };
     *      
     *      // 定义类B，并继承自A
     *      // _$extend接口第二个参数控制是否继承父类静态接口，默认继承，传false禁止继承
     *      var B = NEJ.C();
     *      B._$extend(A);
     *      // B._$extend(A,false); // 不继承父类静态接口
     *      // 初始化
     *      B.prototype.__init = function(){
     *          // 调用A的初始化逻辑
     *          this.__super();
     *          // TODO B的初始化逻辑
     *      };
     *   });
     * [/code]
     *
     * @api    {NEJ.C}
     * @return {Function} 返回创建的类
     */
    _p._$klass = (function(){
        var _isNotFunction = function(){
            return _o.toString.call(arguments[0])!=='[object Function]';
        };
        var _getMethodName = function(_value,_map){
            for(var x in _map)
                if (_value==_map[x])
                    return x;
            return null;
        };
        // build super for method
        var _mmap = {__init:0,__reset:1,__destroy:2,__initNode:3,
                     __doBuild:4,__onShow:5,__onHide:6,__onRefresh:7},
            _umap = {__supInit:0,__supReset:1,__supDestroy:2,__supInitNode:3,
                     __supDoBuild:4,__supOnShow:5,__supOnHide:6,__supOnRefresh:7};
        return function(){
            // class constructor
            var _class = function(){
                this.__cp__();
                return this.__init.apply(this,arguments);
            };
            // class inherit
            _class.prototype.__cp__ = NEJ.F;
            _class.prototype.__init = NEJ.F;
            _class._$extend = function(_super,_static){
                if (_isNotFunction(_super)) return;
                // extend static methods
                if (_static==null||!!_static) 
                    NEJ.X(this,_super,_isNotFunction);
                // extend instance properties and methods
                this._$super = _super;
                this._$supro = _super.prototype;
                var _parent = function(){};
                _parent.prototype = _super.prototype;
                this.prototype = new _parent();
                var _prototype = this.prototype;
                _prototype.constructor = this;
                var _tmp;
                // for common method
                for(var x in _mmap){
                    _tmp = _getMethodName(_mmap[x],_umap);
                    if (!_tmp||!this._$supro[x]) continue;
                    _prototype[x] = (function(_name){
                        return function(){
                            this[_name].apply(this,arguments);
                        };
                    })(_tmp);
                }
                // for super method
                var _pmap = {};
                for(var x in _umap){
                    _tmp = _getMethodName(_umap[x],_mmap);
                    if (!_tmp||!this._$supro[_tmp]) continue;
                    _pmap[_tmp] = _super;
                    _prototype[x] = (function(_name){
                        return function(){
                            var _result,
                                _parent = this.__ancestor__[_name],
                                _method = _parent.prototype[_name];
                            this.__ancestor__[_name] = _parent._$super||_super;
                            if (!!_method)
                                _result = _method.apply(this,arguments);
                            this.__ancestor__[_name] = _super; // fix broken chain
                            return _result;
                        };
                    })(_tmp);
                }
                _prototype.__cp__ = function(){
                    this.__ancestor__ = NEJ.X({},_pmap);
                };
                _prototype.__super = _prototype.__supInit;
                return _prototype;
            };
            return _class;
        };
    })();

