/*
 * ------------------------------------------
 * ES规范数组兼容实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/**
 * Array对象
 * @external Array
 */
NEJ.define([
    '{platform}array.js'
],function(_h){
    // do nothing
    /**
     * 判断参数是否数组
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     // 返回true
     *     var is = Array.isArray([]);
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.3.2
     * @method external:Array.isArray
     * @param  {Variable} arg0 - 数据
     * @return {Boolean}         是否数组
     */
    
    /**
     * 反转顺序，修改原数组
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 反转数组
     *     arr.reverse();
     *     // arr变成[4,3,2,1]
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.8
     * @method external:Array#reverse
     * @return {Array} 数组
     */
    
    /**
     * 查找第一个符合条件的元素的索引值，匹配规则为全等匹配
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 返回1
     *     var index = arr.indexOf(2);
     *     // 返回-1
     *     var index = arr.indexOf(7);
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.14
     * @method external:Array#indexOf
     * @param  {Variable} arg0 - 要搜索的元素
     * @param  {Number}   arg1 - 起始索引，默认从0开始，负数表示从length-begin的位置开始搜索
     * @return {Number}          符合条件的元素索引，没有找到返回-1
     */
    
    /**
     * 查找最后一个符合条件的元素的索引值，匹配规则为全等匹配
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 返回1
     *     var index = arr.lastIndexOf(2);
     *     // 返回-1
     *     var index = arr.lastIndexOf(7);
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.15
     * @method external:Array#lastIndexOf
     * @param  {Variable} arg0 - 要搜索的元素
     * @param  {Number}   arg1 - 搜索结束位置，默认为数组尾部，负数表示在length-end的位置结束
     * @return {Number}          符合条件的元素索引，没有找到返回-1
     */
    
    /**
     * 检查数组所有元素是否满足指定条件
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 验证所有元素是否都是非NaN，返回true
     *     var is = arr.every(function(item,index,array){
     *         return !isNaN(item);
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16
     * @method external:Array#every
     * @param  {Function} arg0 - 验证函数
     * @param  {Object}   arg1 - 验证函数需要保持一致的对象，null表示window对象
     * @return {Boolean}         是否所有元素都满足条件
     */
    
    /**
     * 检查数组中是否有元素满足指定条件
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4,'5'];
     *     // 验证是否含字符串，返回true
     *     var is = arr.some(function(item,index,array){
     *         return typeof item === 'string';
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.17
     * @method external:Array#some
     * @param  {Function} arg0 - 验证函数
     * @param  {Object}   arg1 - 验证函数需要保持一致的对象，null表示window对象
     * @return {Boolean}         是否有元素满足指定条件
     */
    
    /**
     * 遍历数组所有元素，并执行指定函数
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4,'5'];
     *     // 遍历数组
     *     arr.forEach(function(item,index,array){
     *         console.log(item);
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18
     * @method external:Array#forEach
     * @param  {Function} arg0 - 执行函数
     * @param  {Object}   arg1 - 执行函数需要保持一致的对象，null表示window对象
     * @return {Void}
     */
    
    /**
     * 对数组中所有元素使用处理函数生成新元素形成的新数组
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 生成对象 {0:'d-1',1:'d-2',2:'d-3',3:'d-4'}
     *     var map = arr.map(function(item,index,array){
     *         return 'd-'+item;
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19
     * @method external:Array#map
     * @param  {Function} arg0 - 处理函数
     * @param  {Object}   arg1 - 处理函数需要保持一致的对象，null表示window对象
     * @return {Array}           根据处理函数生成的新的数组
     */
    
    /**
     * 过滤不符合条件的元素，返回符合条件的所有元素形成的新数组
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 生成新数组 [1,2]
     *     var brr = arr.filter(function(item,index,array){
     *         return item<=2;
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20
     * @method external:Array#filter
     * @param  {Function} arg0 - 验证函数
     * @param  {Object}   arg1 - 验证函数需要保持一致的对象，null表示window对象
     * @return {Array}           符合验证规则的元素形成的新数组
     */
    
    /**
     * 从左到右根据处理函数计算数组中各元素的值
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 计算数组元素总和 1+2+3+4，返回10
     *     var sum = arr.reduce(function(value,item,index,array){
     *         return value+item;
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.21
     * @method external:Array#reduce
     * @param  {Function} arg0 - 处理函数
     * @param  {Variable} arg1 - 初始值
     * @return {Variable}        计算结果
     */
    
    /**
     * 从右到左根据处理函数计算数组中各元素的值
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/es/array'
     * ],function(){
     *     var arr = [1,2,3,4];
     *     // 计算数组元素总和 4+3+2+1，返回10
     *     var sum = arr.reduceRight(function(value,item,index,array){
     *         return value+item;
     *     });
     * });
     * ```
     * 
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.22
     * @method external:Array#reduceRight
     * @param  {Function} arg0 - 处理函数
     * @param  {Variable} arg1 - 初始值
     * @return {Variable}        计算结果
     */
});
