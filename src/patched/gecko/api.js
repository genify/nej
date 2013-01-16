/**
 * ------------------------------------------
 * Gecko引擎对API增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _v = _('nej.v'),
        _h = _('nej.h'),
        _p = _('nej.p'),
        _support = _p._$SUPPORT;
    if (_p._$NOT_PATCH.gecko) return;
    /*
     * 初始化补丁
     * @return {Void}
     */
    var _doInit = function(){
        _support.css3d = _support.css3d||
           ('MozPerspective' in document.body.style);
        if (!document.body.insertAdjacentElement)
            HTMLElement.prototype.insertAdjacentElement = function(_where,_element){
                if (!_where||!_element) return;
                switch(_where){
                    case 'beforeEnd'  : 
                        this.appendChild(_element); 
                    return;
                    case 'beforeBegin': 
                        this.parentNode.insertBefore(_element,this); 
                    return;
                    case 'afterBegin' :
                        !this.firstChild
                        ?this.appendChild(_element)
                        :this.insertBefore(_element,this.firstChild); 
                    return;
                    case 'afterEnd'   :
                        !this.nextSibling 
                        ?this.parentNode.appendChild(_element)
                        :this.parentNode.insertBefore(_element,this.nextSibling); 
                    return;
                }
            };
        if (!('innerText' in document.body)){
            HTMLElement.prototype['__defineGetter__']("innerText",function(){return this.textContent;});
            HTMLElement.prototype['__defineSetter__']("innerText",function(_content){this.textContent = _content;});
        }
    };
    /**
     * 检查事件信息
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Array}             事件列表
     */
    _h.__checkEvent = (function(){
        var _reg0 = /^(?:transitionend|animationend|animationstart|animationiteration)$/i;
        return _h.__checkEvent._$aop(function(_event){
            var _args = _event.args;
            if (_reg0.test(_args[1]||'')){
                _event.stopped = !0;
                _event.value = _args;
            }
        });
    })();
    
    /**
     * 处理文件选择控件点击事件
     * @param  {String|Node} 节点
     * @return {Void}
     */
    _h.__handleFileLabelClick = (function(){
        var _doLabelClick = function(_event){
            _v._$stop(_event);
            _v._$getElement(_event).control.click();
        };
        return function(_element){
            _v._$addEvent(_element,'click',_doLabelClick);
        };
    })();
    // init patch
    _doInit();
};
define('{lib}patched/gecko/api.js',
      ['{lib}patched/api.js'],f);