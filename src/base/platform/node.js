/*
 * ------------------------------------------
 * 平台适配接口实现文件 
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/util.js',
    '{lib}base/event.js'
],function(_u,_v,_p,_o,_f,_r){
    /**
     * 从DocumentFragment中取指定ID的节点
     * @param  {Document} 文档对象
     * @param  {String}   节点标识
     * @return {Node}     指定标识的节点
     */
    _p.__getElementById = function(_fragment,_id){
        if (!!_fragment.getElementById){
            return _fragment.getElementById(''+_id);
        }
        try{
            return _fragment.querySelector('#'+_id);
        }catch(e){
            return null;
        }
    };
    /**
     * 取节点的子节点列表
     * @param  {Node}  节点ID或者对象
     * @return {Array} 子节点列表
     */
    _p.__getChildren = function(_element){
        return _u._$object2array(_element.children);
    };
    /**
     * 根据类名取节点列表
     * @param  {Node}   节点ID或者对象
     * @param  {String} 类名
     * @return {Array}  节点列表
     */
    _p.__getElementsByClassName = function(_element,_class){
        return _u._$object2array(_element.getElementsByClassName(_class));
    };
    /**
     * 取下一个兄弟节点
     * @param  {Node}  节点对象
     * @return {Node}  节点
     */
    _p.__nextSibling = function(_element){
        return _element.nextElementSibling;
    };
    /**
     * 取上一个兄弟节点
     * @param  {Node}  节点对象
     * @return {Node}  节点
     */
    _p.__previousSibling = function(_element){
        return _element.previousElementSibling;
    };
    /**
     * 节点focus行为
     * @param  {String|Node} 节点
     * @param  {Number}      模式
     * @param  {String}      样式
     * @return {Void}
     */
    _p.__focusElement = (function(){
        // do blur check
        var _onBlur = function(_clazz,_event){
            var _element = _v._$getElement(_event);
            if (!_element.value)
                _e._$delClassName(_element,_clazz);
        };
        // do focus
        var _onFocus = function(_clazz,_event){
            _e._$addClassName(
                _v._$getElement(_event),_clazz);
        };
        return function(_element,_mode,_clazz){
            if (_mode==1){
                _v._$addEvent(
                    _element,'blur',
                    _onBlur._$bind(null,_clazz)
                );
            }
            if (_mode==1||_mode==-1){
                _v._$addEvent(
                    _element,'focus',
                    _onFocus._$bind(null,_clazz)
                );
            }
            // other do nothing, use css :focus
        };
    })();
    /**
     * 设置、获取数据
     * @param {Node}     节点
     * @param {String}   标识
     * @param {Variable} 值
     */
    _p.__dataset = function(_element,_name,_value){
        _element.dataset = _element.dataset||{};
        if (_value!==undefined){
            _element.dataset[_name] = _value;
        }
        return _element.dataset[_name];
    };
    /**
     * 取节点属性值
     * @param  {Node}   节点
     * @param  {String} 属性名
     * @return {String} 属性值
     */
    _p.__getAttribute = function(_element,_name){
        return _element.getAttribute(_name);
    };
    /**
     * 将dom节点转为xml串
     * @param  {Node}   节点
     * @return {String} XML代码
     */
    _p.__serializeDOM2XML = function(_dom){
        return new XMLSerializer().serializeToString(_dom)||'';
    };
    /**
     * 将xml转为dom节点
     * @param  {String} XML代码
     * @return {Node}   节点
     */
    _p.__parseDOMFromXML = function(_xml){
        var _root = new DOMParser()
                       .parseFromString(_xml,'text/xml')
                       .documentElement;
        return _root.nodeName=='parsererror'?null:_root;
    };
    /**
     * 设置光标位置
     * @param  {String|Node} TEXTAREA节点
     * @param  {Object}      光标的位置信息
     * @return {Void}
     */
    _p.__setCursorPosition = function(_textarea,_position){
        _textarea.selectionEnd = _position.end||0;
        _textarea.selectionStart = _position.start||0;
        _textarea.focus();
    };
    /**
     * 取光标位置
     * @param  {String|Node} TEXTAREA节点
     * @return {Void}
     */
    _p.__getCursorPosition = function(_textarea){
        _textarea.focus();
        return {
            end:_textarea.selectionEnd,
            start:_textarea.selectionStart
        };
    };
    /**
     * 节点hover行为
     * @param  {Node}   节点
     * @param  {String} 样式，默认为js-hover
     * @return {Void}
     */
    _p.__hoverElement = function(){
        // use css :hover
    };
    /**
     * 节点占全屏
     * @param  {Node}   节点
     * @param  {Object} 视窗模型
     * @return {Void}
     */
    _p.__fullScreen = function(){
        // use css fixed position
    };
    /**
     * 为节点增加用于盖select/flash等控件的层
     * @param  {Node} 节点
     * @return {Void}         
     */
    _p.__mask = function(){
        // do nothing
    };
    /**
     * 去除用于盖select/flash等控件的层
     * @param  {Node} 节点
     * @return {Void}
     */
    _p.__unmask = function(){
        // do nothing
    };
    
    return _p;
});
