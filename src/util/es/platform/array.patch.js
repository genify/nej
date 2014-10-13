/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './array.js',
    'base/platform'
],function(_h,_m,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11
    
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        var _pro = Array.prototype;
        /*
         * 判断是否函数
         * @return {Boolean} 是否函数
         */
        var _isFunction = function(_arg){
            return '[object function]' == _o.toString.call(_arg).toLowerCase();
        };
        /**
         * 判断参数是否数组
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.3.2
         * @param  {Variable} 数据
         * @return {Boolean}  是否数组
         */
        Array.isArray = function(_arg){
            return "[object array]" === _o.toString.call(_arg).toLowerCase();
        };
        /**
         * 查找第一个符合条件的元素的索引值，匹配规则为全等匹配
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.14
         * @param  {Variable} 要搜索的元素
         * @param  {Number}   起始索引，默认从0开始，负数表示从length-begin的位置开始搜索
         * @return {Number}   符合条件的元素索引，没有找到返回-1
         */
        _pro.indexOf = function(_match,_beg){
            var _index = parseInt(_beg)||0;
            if (_index<0){
                _index = Math.max(0,this.length+_index);
            }
            for(var l=this.length;_index<l;_index++){
                if ((_index in this)&&_match===this[_index])
                    return _index;
            }
            return -1;
        };
        /**
         * 查找最后一个符合条件的元素的索引值，匹配规则为全等匹配
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.15
         * @param  {Variable} 要搜索的元素
         * @param  {Number}   搜索结束位置，默认为数组尾部，负数表示在length-end的位置结束
         * @return {Number}   符合条件的元素索引，没有找到返回-1
         */
        _pro.lastIndexOf = function(_match,_end){
            var _index = this.length-1;
            _end = parseInt(_end);
            if (!isNaN(_end)){
                _index = _end;
                if (_index<0){
                    _index = this.length+_index;
                }
            }
            for(;_index>=0;_index--){
                if ((_index in this)&&_match===this[_index])
                    return _index;
            }
            return -1;
        };
        /**
         * 检查数组所有元素是否满足指定条件
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16
         * @param  {Function} 验证函数
         * @param  {Object}   验证函数需要保持一致的对象，null表示window对象
         * @return {Boolean}  是否所有元素都满足条件
         */
        _pro.every = function(_callback,_this){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            for(var i=0,l=this.length;i<l;i++){
                if ((i in this)&&!_callback.call(_this,this[i],i,this))
                    return !1;
            }
            return !0;
        };
        /**
         * 检查数组中是否有元素满足指定条件
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.17
         * @param  {Function} 验证函数
         * @param  {Object}   验证函数需要保持一致的对象，null表示window对象
         * @return {Boolean}  是否有元素满足指定条件
         */
        _pro.some = function(_callback,_this){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            for(var i=0,l=this.length;i<l;i++){
                if ((i in this)&&_callback.call(_this,this[i],i,this))
                    return !0;
            }
            return !1;
        };
        /**
         * 遍历数组所有元素，并执行制定函数
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18
         * @param  {Function} 执行函数
         * @param  {Object}   执行函数需要保持一致的对象，null表示window对象
         * @return {Void}
         */
        _pro.forEach = function(_callback,_this){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            for(var i=0,l=this.length;i<l;i++){
                if (i in this){
                    _callback.call(_this,this[i],i,this);
                }
            }
        };
        /**
         * 对数组中所有元素使用处理函数生成新元素形成的新数组
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19
         * @param  {Function} 处理函数
         * @param  {Object}   处理函数需要保持一致的对象，null表示window对象
         * @return {Array}    根据处理函数生成的新的数组
         */
        _pro.map = function(_callback,_this){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            var _result = new Array(this.length);
            for(var i=0,l=this.length;i<l;i++){
                if (i in this){
                    _result[i] = _callback.call(_this,this[i],i,this);
                }
            }
            return _result;
        };
        /**
         * 过滤不符合条件的元素，返回符合条件的所有元素形成的新数组
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20
         * @param  {Function} 验证函数
         * @param  {Object}   验证函数需要保持一致的对象，null表示window对象
         * @return {Array}    符合验证规则的元素形成的新数组
         */
        _pro.filter = function(_callback,_this){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            var _result = [];
            for(var i=0,l=this.length;i<l;i++){
                if ((i in this)&&_callback.call(_this,this[i],i,this)){
                    _result.push(this[i]);
                }
            }
            return _result;
        };
        /**
         * 从左到右根据处理函数计算数组中各元素的值
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.21
         * @param  {Function} 处理函数
         * @param  {Variable} 初始值
         * @return {Variable} 计算结果
         */
        _pro.reduce = function(_callback,_value){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            var _isset = arguments.length>1;
            for(var i=0,l=this.length;i<l;i++){
                if (!(i in this)) continue;
                if (_isset){
                    _value = _callback(_value,this[i],i,this);
                }else{
                    _isset = !0;
                    _value = this[i];
                }
            }
            if (!_isset){
              throw new Error('Reduce of empty array with no initial value');
            }
            return _value;
        };
        /**
         * 从右到左根据处理函数计算数组中各元素的值
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.22
         * @param  {Function} 处理函数
         * @param  {Variable} 初始值
         * @return {Variable} 计算结果
         */
        _pro.reduceRight = function(_callback,_value){
            if (!_isFunction(_callback)){
                throw new Error(_callback+' is not a function');
            }
            var _isset = arguments.length>1;
            for(var i=this.length-1;i>=0;i--){
                if (!(i in this)) continue;
                if (_isset){
                    _value = _callback(_value,this[i],i,this);
                }else{
                    _isset = !0;
                    _value = this[i];
                }
            }
            if (!_isset){
              throw new Error('Reduce of empty array with no initial value');
            }
            return _value;
        };
    });
    
    return _h;
});
