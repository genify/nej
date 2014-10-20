/*
 * ------------------------------------------
 * 超链接卡片实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/command/link */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/layer/window.wrapper',
    'util/template/tpl',
    'text!./link.css',
    'text!./link.html'
],function(NEJ,_k,_e,_u,_i,_t0,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_html = _t0._$addNodeTemplate(_html),
        _seed_css = _e._$pushCSSText(_css);
    /**
     * 超链接卡片
     *
     * @class    module:ui/editor/command/link._$$LinkCard
     * @extends  module:ui/layer/wrapper/window._$$CardWrapper
     * @param    {Object}  arg0 - 可选配置参数
     * @property {Boolean} draggable   - 是否可拖动
     * @property {Boolean} destroyable - 关闭是否销毁
     * @property {String}  title       - 卡片标题
     * @property {Boolean} name        - 超链接名称
     */
    /**
     * 超链接地址有误
     *
     * @event module:ui/editor/command/link._$$LinkCard#onErrorLink
     * @param {Number} arg0 - 错误码
     * | 错误码| 含义              |
     * | :---  | :---              |
     * | 0     | 不是以http://开头 |
     * | 1     | 地址中有空白字符  |
     */
    /**
     * 超链接通过检验
     *
     * @event module:ui/editor/command/link._$$LinkCard#onchange
     * @param {String} arg0 - 超链接地址
     *
     */
    _p._$$LinkCard = _k._$klass();
    _pro = _p._$$LinkCard._$extend(_i._$$WindowWrapper);

    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };

    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__btns = _e._$getByClassName(this.__body,'j-btn');
        this.__inputs = _e._$getByClassName(this.__body,'ipt');
        this.__errorMsg = _e._$getByClassName(this.__body,'j-error')[0];
    };

    /**
     * 控件重置
     *
     * @protected
     * @method   module:ui/editor/command/link._$$LinkCard#__reset
     * @param    {Object}  arg0        - 可选配置参数
     * @property {Boolean} draggable   - 是否可拖动
     * @property {Boolean} destroyable - 关闭是否销毁
     * @property {String}  title       - 卡片标题
     * @property {Boolean} name        - 超链接名称
     * @return   {Void}
     */
    _pro.__reset = function(_options){
        //默认以document为parent
        _options.parent = _options.parent || document.body;
        _options.draggable = _options.draggable || false;
        _options.destroyable = _options.destroyable || false;
        _options.title = _options.title || '超链接';
        _options.mask  = _options.maskclazz || true;
        this.__super(_options);
        this.__inputs[0].value = _options.name||'';
        this.__doInitDomEvent([
            [this.__btns[1],'click',this.__onOK._$bind(this)],
            [this.__btns[0],'click',this.__onCancel._$bind(this)],
            [this.__inputs[0],'keypress',this.__onKeyPress._$bind(this)],
            [this.__inputs[1],'keypress',this.__onKeyPress._$bind(this)],
            [this.__inputs[0],'focus',this.__showErrorTips._$bind(this,'')],
            [this.__inputs[1],'focus',this.__showErrorTips._$bind(this,'')]
        ]);
    };

    /**
     * 取消
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__onCancel
     * @return {Void}
     */
    _pro.__onCancel = function(){
        this._$hide();
    };

    /**
     * 完成链接
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__onOK
     * @return {Void}
     */
    _pro.__onOK = (function(){
        var _reg = /^(?:http(s)?:\/\/)[^\s].?/,
            _reg2 = /^(?:http(s)?:\/\/).*/;
        return function(){
            var _link = {};
            _link.name = _u._$escape(this.__inputs[0].value);
            _link.href = this.__inputs[1].value;
            var _flag = _link.href.search(_reg),
                _flag2= _link.href.search(_reg2);
            if(_flag2 < 0){
                this._$dispatchEvent('onErrorLink',0);
                return;
            }
            if(_flag < 0){
                this._$dispatchEvent('onErrorLink',1);
                return;
            }
            this._$dispatchEvent('onchange',_link);
            this._$hide();
        };
    })();

    /**
     * 显示错误信息
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__showErrorTips
     * @param  {Object} arg0 - 错误信息
     * @return {Void}
     */
    _pro.__showErrorTips = function(_message){
        this.__errorMsg.innerText = _message;
    };

    /**
     * 控件回收
     *
     * @protected
     * @method module:ui/editor/command/link._$$LinkCard#__destroy
     * @return {Void}
     */
    _pro.__onKeyPress = function(_event){
        if (_event.keyCode == 13){
            this.__onOK();
        }
    };

    /**
     * 提供聚焦到input的接口
     *
     * @method module:ui/editor/command/link._$$LinkCard#_$doFocus
     * @return {Void}
     */
    _pro._$doFocus = function(){
        this.__inputs[1].focus();
        this.__inputs[1].value = 'http://';
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});