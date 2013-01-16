/**
 * ==========================================================================================
 * 系统基础扩展(对nts的扩展)文件<br/>
 * 代码书写规范简述：<br/>
 * <pre>
 *    变量/接口前缀        描述                                           发布时是否混淆
 * ------------------------------------------------------------------------------------------
 *    _                  接口内局部变量或者传递的参数                            Y
 *    _$                 对象外可访问的接口或者属性                             Y/N
 *                       此类接口不允许以字符串形式出现
 *                       如果项目所有js文件一起混淆可以考虑混淆
 *    _$$                类对象，同_$前缀的处理                                Y/N
 *    __                 对象外不可访问的接口或者属性                            Y
 *    无                 没有前缀的接口或者属性可以在对象外访问                     N
 *                       代码中可以以字符串的形式出现
 *    X                  单个大写字母命名表示集合了一些通用的属性和接口的对象
 *                       代码中禁止出现单个大写字母命名的变量                      N
 * ------------------------------------------------------------------------------------------
 * </pre>
 * @version  1.0
 * @author   weiwenqing(wqwei@corp.netease.com)
 * ==========================================================================================
 */
var f = function(){
    var _ = NEJ.P;
    var e = _('nej.e');
    var u = _('nej.u');
    var tu = _('t.u');
    // 测试辅助
    if(!window.console){
        window.console = {log: function(){}};
    }
    if (!Object.keys) {
        /**
         * 获取对象的key的列表
         * @param    {Object}    _obj    对象
         * @return      {Array}                key的列表
         */
        Object.keys = (function () {
            var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
            return function (_obj) {
              if (u._$isObject(_obj)) {
                  var _result = [];
                  for (var _p in _obj) {
                      if (_obj.hasOwnProperty(_p)) 
                          _result.push(_p);
                  }
                  if (hasDontEnumBug) {
                      for (var i = 0, _item, _items=dontEnums; _item=_items[i]; i++) {
                          if (_obj.hasOwnProperty(_item)) 
                              _result.push(_item);
                      }
                  }
                  return _result;
              }
            };  
        })();
    }; 
    if(!Array.prototype.map){
        /**
         * 生成一个列表，列表中的每一项是由原列表中的每一项调用指定方法的返回值
         * @param     {Function} _method    指定方法
         * @param     {Object}        _this        指定方法调用的上下文，可选参数
         * @return      {Array}                        新的列表
         */
        Array.prototype.map = function(_callback, _this){
            if(!this||!u._$isFunction(_callback)) return;
            var _arr = [];
            for(var i=0,_item,_length=this.length;i<_length;i++){
                _arr.push(_callback.call(_this, this[i], i, this));
            }
            return _arr;
        };
    }
    /**
     * 事件日志
     * @param {String}     _name        事件名称
     * @param {Object} _data        事件的相关数据
     */
    tu._$log = function(_name, _data){
        var _elog = e._$get('log');
        if(!_name||!_elog) return;
        var _str = u._$isString(_data)?_data:u._$object2string(_data);
        var _msg = _name + ' ' + _str;
        var _emsg = e._$html2node('<div>' + _msg + '</div>');
        _elog.appendChild(_emsg);
        _elog.parentNode.scrollTop = -Math.min(_elog.parentNode.offsetHeight - _elog.offsetHeight, 0);
    };
};
define('{pro}lib/extend.js',
      ['{lib}base/element.js', '{lib}base/util.js'],f);
