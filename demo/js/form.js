/**
 * ------------------------------------------
 * 表单通用接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */

var f  = function(){
    var _ = NEJ.P;
    var r = NEJ.R;
    var u = _('nej.u');
    var p = _('t.u.form');
    /**
     * 判断是否为文本元素
     * @param     {Node}             _eform        表单
     * @param     {String|Node} _name        元素名称/元素
     * @return      {Boolean}                        是否为文本元素
     */
    var __isText = function(_eform, _name){
        var _element = p._$get(_eform, _name);
        if(!_element) return;
        var _tn = _element.tagName;
        var _type = _element.type;
        return _tn == 'TEXTAREA' || (_tn == 'INPUT' && (_type == 'text' || _type == 'password'));
    };
    /**
     * 判断是否是数据元素
     * @param     {Node}             _eform    表单
     * @param     {String|Node} _name    元素名称/元素
     * @return     {Boolean}                    是否是数据元素
     */
    var __isDataElement = function(_eform, _name){
        var _element = p._$get(_eform, _name);
        if(!_element) return;
        var _tn = _element.tagName, _type = _element.type;
        return _tn != 'BUTTON' && _tn != 'FIELDSET'&&(_tn != 'INPUT' || (_type != 'button' && _type != 'reset' && _type != 'submit'));
    };
    /**
     * 获取表单元素
     * @param    {String|Node}    _name    元素名称/表单元素
     * @return {Object}                            表单元素
     */
    /**
     * 获取表单元素
     * @param {Node}     _eform    表单
     * @param {String} _name    元素名称
     */
    p._$get = function(_eform, _name){
        return u._$isString(_name)?_eform&&_eform[_name]:_name;
    };
    /**
     * 聚焦第一个表单元素
     */
    p._$focus = function(_eform){
        return p._$focusElement(_eform, _eform&&_eform.elements&&_eform.elements[0]);
    };
    /**
     * 获取表单数据
     * @param {Node}     _eform    表单
     * @return {Object}                表单数据
     */
    p._$getData = function(_eform){
        var _elements = _eform&&_eform.elements;
        if(!_elements) return;
        var _result = {}
        var _name = {};
        // 获取表单元素名称列表(按钮除外)
        for (var i = 0, _item, _items = _elements; _item = _items[i]; i++) {
            if(__isDataElement(_eform, _item))
                _name[_item.name] = 1;
        }
        var _nameList = Object.keys(_name);
        for(var i=0,_item,_length=_nameList.length;i<_length;i++){
            _item = _nameList[i];
            _result[_item] = this._$getValue(_item);
        }
        return _result;
    };
    /**
     * 获取表单元素的值
     * @param     {Node}                 _eform    表单
     * @param    {String|Node}    _name    元素名称/表单元素
     * @return      {String|Array}                值
     */
    p._$getValue = function(_eform, _name){
        var _element = p._$get(_eform, _name);
        if(!_element) return;
        var _tn = _element.tagName||_element[0].tagName
            _type = _element.type||_element[0].type,
            _arr = [];
        if (_tn == 'SELECT'&&_element.multiple) {
            // 获取指定名称的多选下拉选择框的选中值
            for (var i = 0, _item, _items = _element.options; _item = _items[i]; i++) {
                if (_item.selected) 
                    _arr.push(_item.value);
            }
            return _arr;
        }
        if (u._$isString(_name)) {
            if (_tn == 'INPUT') {
                if (_type == 'checkbox') {
                    // 获取指定名称的复选框的选中值
                    for(var i=0,_item,_items=_element.length?_element:[_element];_item=_items[i];i++){
                        if(_item.checked)
                            _arr.push(_item.value);
                    }
                    return _arr;
                }
                if (_type == 'radio') {
                    // 获取指定名称的单选框的选中值
                    for(var i=0,_item,_items=_element;_item=_items[i];i++){
                        if(_item.checked)
                            return _item.value;
                    }
                }
            }
            return _element.value;
        }
        return _element.value;
    };
    /**
     * 判断是否为文本元素
     * @param     {Node}             _eform        表单
     * @param     {String|Node} _name        元素名称/元素
     * @return      {Boolean}                        是否为文本元素
     */
    p._$isText = __isText;
    /**
     * 判断是否是数据元素
     * @param     {Node}             _eform    表单
     * @param     {String|Node} _name    元素名称/元素
     * @return     {Boolean}                    是否是数据元素
     */
    p._$isDataElement = __isDataElement;
    /**
     * focus元素
     * @param {Node}             _eform    表单
     * @param {String|Node} _name    元素名称/元素
     */
    p._$focusElement = function(_eform, _name){
        var _element = p._$get(_eform, _name);
        _element&&_element.focus();
        if (document.selection && __isText(_eform, _element)) {
            var _textRange = _element.createTextRange();
            _textRange.collapse(false);
            _textRange.select();
        }
        return this;
    };
    /**
     * 获取增强的表单对象
     * @param    {Node|String} _eform    表单元素/元素id
     * @return    {Object}                        增加的表单对象
     */
    p._$getInstance = function(_eform){
        _eform = _eform||document.forms[0];
        if(typeof _eform === 'string') _eform = document.forms[_eform];
        if(!_eform) return;
        var _obj = {};
        var _p, _value;
        for(_p in p){
            _value = p[_p];
            if(u._$isFunction(_value)&&_value!=arguments.callee){
                _obj[_p] = (function(_method){
                    return function(){
                        var _args = [_eform];
                        r.push.apply(_args, arguments);
                        return _method.apply(this, _args);
                    };
                })(_value);
            }
        }
        return _obj;
    };
};

define('{pro}js/form.js', ['{lib}base/element.js', '{lib}base/util.js', '{pro}js/extend.js'], f);
