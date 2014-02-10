/*
 * --------------------------------------------
 * 全局通用接口实现文件
 *  NEJ.O  - 空对象实例
 *  NEJ.R  - 空数组实例
 *  NEJ.F  - 空函数实例
 *  NEJ.P  - 名字空间申明
 *  NEJ.C  - 类构造，带扩展接口
 *  NEJ.X  - 对象属性拷贝，带过滤
 *  NEJ.EX - 对象属性选择性拷贝
 * 
 *  nej.c  - 配置信息名字空间
 *  nej.g  - 全局常量名字空间
 *  nej.p  - 平台接口名字空间
 *  nej.u  - 通用接口名字空间
 *  nej.e  - 节点接口名字空间
 *  nej.v  - 事件接口名字空间
 *  nej.j  - 请求接口名字空间
 *  nej.x  - 用于链式调用扩展名字空间
 *  
 *  nej.ui - UI控件名字空间
 *  nej.ut - 通用控件名字空间
 *  nej.mb - 移动控件名字空间
 *  
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
var f = function(){
    // NEJ namespace
    window.NEJ = window.NEJ||{};
    /**
     * 空对象实例，使用过程中不允许对其做设置操作<br/>
     * @const {NEJ.O}
     * @type  {Object}
     */
    NEJ.O = {};
    /**
     * 空数组实例，使用过程中不允许对其做设置操作<br/>
     * @const {NEJ.R}
     * @type  {Array}
     */
    NEJ.R = [];
    /**
     * 空函数实例<br/>
     * @const {NEJ.F}
     * @type  {Function}
     */
    NEJ.F = function(){return !1;};
    /**
     * 返回指定的命名空间，如果不存在则新建一个命名空间<br/>
     * 注意：命名空间不要使用浏览器保留的关键字
     * [code]
     *   // 以下两者都将建立 window.ui, 然后返回 window.ui.package
     *   var p1 = NEJ.P("ui.package");
     *   var p2 = NEJ.P("window.ui.package");
     * [/code]
     * @api    {NEJ.P}
     * @param  {String} 命名空间的名称，大小写敏感
     * @return {Object} 生成的命名空间对象
     */
    NEJ.P = function(_namespace){
        if (!_namespace||!_namespace.length) return null;
        var _package = window;
        for(var a=_namespace.split('.'),
                l=a.length,i=(a[0]=='window')?1:0;i<l;
                _package=_package[a[i]]=_package[a[i]]||{},i++);
        return  _package;
    };
    /**
     * 读取上下文中指定名字空间的值
     * [code]
     *     var obj = {
     *         a:{
     *             b:{
     *                 c:{
     *                     d:'ddddd'
     *                 }
     *             }
     *         }
     *     };
     *     // print ddddd
     *     console.log(NEJ.Q(obj,'a.b.c.d'));
     *     // print undefined
     *     console.log(NEJ.Q(null,'a.b.c.d'));
     * [/code]
     * @api    {NEJ.Q}
     * @param  {Object}   上下文
     * @param  {String}   名字空间
     * @return {Varaible} 值
     */
    NEJ.Q = function(_context,_namespace){
        _context = _context||NEJ.O;
        var _arr = _namespace.split('.');
        for(var i=0,l=_arr.length;i<l;i++){
            _context = _context[_arr[i]];
            if (!_context) break;
        }
        return _context;
    };
    /**
     * 定义类，通过此api定义的类具有以下特性：<br/>
     * [ul]
     *   具有静态扩展接口_$extend
     *   __init作为类的初始化函数，如果继承了其他类，则可以通过__supInit调用父类初始化函数
     *   如果按照NEJ控件体系规范，则__reset/__destroy/__initNode可以使用__supXxx的形式调用父类接口
     * [/ul]
     * [code]
     *   // 定义类A
     *   var A = NEJ.C();
     *   // 初始化
     *   A.prototype.__init = function(){
     *       // do init
     *   };
     *   
     *   // 定义类B，并继承自A
     *   // _$extend接口第二个参数控制是否继承父类静态接口，默认继承，传false禁止继承
     *   var B = NEJ.C();
     *   B._$extend(A);
     *   // B._$extend(A,false); // 不继承父类静态接口
     *   // 初始化
     *   B.prototype.__init = function(){
     *       // 调用A的初始化逻辑
     *       this.__supInit();
     *       // TODO B的初始化逻辑
     *   };
     * [/code]
     * @api    {NEJ.C}
     * @return {Function} 返回创建的类
     */
    NEJ.C = (function(){
        var _isNotFunction = function(){
            return NEJ.O.toString.call(
                   arguments[0])!='[object Function]';
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
    /**
     * 拷贝对象属性，过滤接口返回值含义
     *  
     * 脚本举例
     * [code]
     *   var _obj0 = {a:0,b:1},
     *       _obj1 = {a:"a",b:"b",c:"c"};
     *   // 根据_obj1的属性拷贝对象到_obj0
     *   // 结果是_obj0.a = "a",_obj.b = "b",_obj.c = "c";
     *   var _obj = NEJ.X(_obj0,_obj1);
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _obj0 = {a:0,b:1},
     *       _obj1 = {a:"a",b:"b",c:"c"};
     *   var _filter = function(_value,_key){
     *       if (_key != "a")
     *           return false;
     *   }
     *   // 根据_obj1的属性拷贝对象到_obj0,过滤器过滤掉所有key值不是a的属性
     *   // 结果是_obj0.a = 0,_obj.b = "b",_obj.c = "c";
     *   var _obj = NEJ.X(_obj0,_obj1,_filter);
     * [/code]
     * 
     * @see    {#.EX}
     * @api    {NEJ.X}
     * @param  {Object}   原始对象
     * @param  {Object}   待拷贝对象
     * @param  {Function} 过滤接口
     * [ntb]
     *  输入 | Variable | 值
     *       | String   | 键
     *  输出 | Boolean  | 是否过滤
     * [/ntb]
     * @return {Object} 拷贝后对象
     */
    NEJ.X = function(_object,_config,_filter){
        if (!_object||!_config) 
            return _object;
        _filter = _filter||NEJ.F;
        for(var x in _config){
            if (_config.hasOwnProperty(x)&&
               !_filter(_config[x],x))
                _object[x] = _config[x];
        }
        return _object;
    };
    /**
     * 根据原始对象属性，从目标对象拷贝相应值<br/>
     * 
     * 脚本举例
     * [code]
     *   var _obj0 = {a:0,b:1},
     *       _obj1 = {a:"a",b:"b",c:"c"};
     *   // 根据_obj0的属性,从_obj1拷贝属性到_obj0中,如果属性的value是null不会被拷贝
     *   // 结果是_obj0.a = "a",_obj.b = "b",没有拷贝c属性;
     *   var _obj = NEJ.EX(_obj0,_obj1);
     * [/code]
     * 
     * @see    {#.X}
     * @api    {NEJ.EX}
     * @param  {Object} 原始对象
     * @param  {Object} 目标对象
     * @return {Void}
     */
    NEJ.EX = function(_object,_config){
        if (!_object||!_config) 
            return _object;
        for(var x in _object){
            if (_object.hasOwnProperty(x)&&
                _config[x]!=null)
                _object[x] = _config[x];
        }
        return _object;
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
        var f = NEJ.F,
            _after = _after||f,
            _before = _before||f,
            _handler = this;
        return function(){
            var _event = {args:NEJ.R.slice.call(arguments,0)};
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
            var _argc = NEJ.R.slice.call(_args,1);
            NEJ.R.push.apply(_argc,arguments);
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
            _object = NEJ.R.shift.call(_args),
            _function = this;
        return function(){
            NEJ.R.push.apply(arguments,_args);
            return _function.apply(_object||window,arguments);
        };
    };
    var _extpro = String.prototype;
    if (!_extpro.trim){
         _extpro.trim = (function(){
            var _reg = /(?:^\s+)|(?:\s+$)/g;
            return function(){
                return this.replace(_reg,'');
            };
         })();
    }
    // mwf adaptation
    if (!window.MWF) window.MWF = NEJ;
    if (!window.mwf) window.mwf = NEJ.P('nej');
    if (!window.console){
        NEJ.P('console').log = NEJ.F;
        NEJ.P('console').error = NEJ.F;
    }
    // void generating these name when deploy
    var lt,gt,amp,nbsp,quot,apos,copy,reg;
};
NEJ.define('{lib}base/global.js',f);