/*
 * ------------------------------------------
 * 弹出层控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/layer/layer */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/base'
],function(NEJ,_k,_e,_u,_i,_p,_o,_f,_r){
    var _pro;
    /**
     * 弹出层控件基类
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'base/element',
     *     'ui/layer/layer'
     * ],function(_k,_e,_i0,_p,_o,_f,_r){
     *     // 第一步：继承此基类生成新类
     *     var _seed_css = _e._$pushCSSText('.#<uispace>{position:absolute;background:#fff;}');
     *     _p._$$MyLayer = _k._$klass();
     *     _proMyLayer = _p._$$MyLayer._$extend(_i0._$$Layer);
     *
     *     _proMyLayer.__initXGui = function(){
     *        this.__seed_css = _seed_css;
     *     };
     *
     *     _proMyLayer.__initNode = function(){
     *         this.__super();
     *         // this.__ncnt作为放置卡片内容的容器
     *         this.__ncnt = this.__body;
     *     };
     *
     *
     *     // 最后项目中实例化wrapper的实例
     *      var _ly = _p._$$MyLayerCard._$allocate({
     *         parent:document.body,
     *         // 隐藏浮层时，是否销毁
     *         destroyable:false,
     *         oncontentready:function(_html){
     *           // 设置浮层内容的回调
     *         }
     *     });
     * });
     * // 第二步:实例化一个弹出层
     * // 一般在layerwrapper控件中使用
     * // 因为lopt的有默认配置在layerwrapper中
     * NEJ.define([
     *     'base/klass',
     *     'ui/layer/wrapper/layer',
     *     '/path/custom/to/mylayer.js'
     * ],function(_k,_i0,_i1,_p,_o,_f,_r){
     *     // 下面是对layerwrapper的描述
     *
     *     // 首先：继承layerwrapper基类生成的一个新类
     *     _p._$$MyCardWrapper = _k._$klass();
     *     _proMyCardWrapper = _p._$$MyCardWrapper._$extend
     *     (_i0._$$LayerWrapper);
     *
     *     // 这里返回内容层的实例
     *     _proMyCardWrapper.__getLayerInstance = function(){
     *         return _i1._$$MyLayer._$allocate(this.__lopt);
     *     };
     *
     *     // 这里配置lopt参数，生成内容层用
     *     _proMyCardWrapper.__doInitLayerOptions = function(){
     *         this.__super();
     *         this.__lopt.top = null;
     *         this.__lopt.left = null;
     *     };
     * });
     * ```
     *
     * @class     module:ui/layer/layer._$$Layer
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}      arg0        - 可选配置参数
     * @property  {String|Node} content     - 内容HTML代码或者节点对象
     * @property  {Boolean}     destroyable -调用隐藏时是否自动回收，默认不自动回收
     * @property  {Boolean}     nohack      - 针对IE6不做hack处理
     */
    /**
     * 显示内容准备就绪触发事件
     *
     * @event  module:ui/layer/layer._$$Layer#oncontentready
     * @param  {Node} arg0 - 显示内容的节点
     */
    /**
     * 控件回收前触发事件
     *
     * @event  module:ui/layer/layer._$$Layer#onbeforerecycle
     */
    _p._$$Layer = _k._$klass();
    _pro = _p._$$Layer._$extend(_i._$$Abstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/layer/layer._$$Layer#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this._$setEvent('oncontentready',
                        _options.oncontentready||
                        this.__doInitContent._$bind(this));
        this.__nohack = !!_options.nohack;
        this.__destroyable = !!_options.destroyable;
        this._$setContent(_options.content);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/layer/layer._$$Layer#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this._$dispatchEvent('onbeforerecycle');
        this.__super();
        this.__doHide();
        this._$setContent('');
        _e._$style(this.__body,{top:'',left:''});
    };
    /**
     * 初始化内容区域，子类实现具体逻辑
     *
     * @abstract
     * @method module:ui/layer/layer._$$Layer#__doInitContent
     * @param  {Node} arg0 - 内容区容器节点
     * @return {Void}
     */
    _pro.__doInitContent = _f;
    /**
     * 调整显示位置，子类实现具体业务逻辑
     *
     * @abstract
     * @method module:ui/layer/layer._$$Layer#__doPositionAlign
     * @return {Void}
     */
    _pro.__doPositionAlign = _f;
    /**
     * 控件隐藏
     *
     * @protected
     * @method module:ui/layer/layer._$$Layer#__doHide
     * @return {Void}
     */
    _pro.__doHide = function(){
        _e._$removeByEC(this.__body);
        if (!!this.__mask){
            this.__mask = _e._$unmask(this.__body);
            delete this.__mask;
        }
    };
    /**
     * 设置层显示内容
     *
     * 脚本举例
     * ```javascript
     * // 设置层里面展示的内容
     * _ly._$setContent('节点或者字符串');
     * ```
     *
     * @method module:ui/layer/layer._$$Layer#_$setContent
     * @param  {String|Node} arg0 - 内容HTML代码或者节点
     * @return {Void}
     */
    _pro._$setContent = function(_content){
        if (!this.__body||
            !this.__ncnt||
            _content==null) return;
        _content = _content||'';
        _u._$isString(_content)
        ? this.__ncnt.innerHTML = _content
        : this.__ncnt.appendChild(_content);
        this._$dispatchEvent('oncontentready',this.__ncnt);
    };
    /**
     * 设置位置
     *
     * 脚本举例
     * ```javascript
     * // 设置浮层位置
     * _ly._$setPosition({top:100,left:200});
     * ```
     *
     * @method module:ui/layer/layer._$$Layer#_$setPosition
     * @param  {Object} arg0 - 位置信息，如{top:100,left:200}
     * @return {Void}
     */
    _pro._$setPosition = function(_offset){
        var _value = _offset.top;
        if (_value!=null){
            _value += 'px';
            _e._$setStyle(this.__body,'top',_value);
            _e._$setStyle(this.__mask,'top',_value);
        }
        var _value = _offset.left;
        if (_value!=null){
            _value += 'px';
            _e._$setStyle(this.__body,'left',_value);
            _e._$setStyle(this.__mask,'left',_value);
        }
    };
    /**
     * 显示控件
     *
     * 脚本举例
     * ```javascript
     * // 显示浮层
     * _ly._$show();
     * ```
     *
     * @method module:ui/layer/layer._$$Layer#_$show
     * @return {Void}
     */
    _pro._$show = function(){
        _e._$setStyle(this.__body,'visibility','hidden');
        this.__super();
        this.__doPositionAlign();
        _e._$setStyle(this.__body,'visibility','');
        if (!this.__nohack){
            this.__mask = _e._$mask(this.__body);
        }
    };
    /**
     * 隐藏控件
     *
     * 脚本举例
     * ```javascript
     * // 隐藏浮层
     * _ly._$hide();
     * ```
     *
     * @method module:ui/layer/layer._$$Layer#_$hide
     * @return {Void}
     */
    _pro._$hide = function(){
        this.__destroyable ? this._$recycle()
                           : this.__doHide();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});