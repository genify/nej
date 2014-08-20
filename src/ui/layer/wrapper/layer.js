/*
 * ------------------------------------------
 * 弹出层封装基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/layer/wrapper/layer */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/base',
    'ui/layer/layer'
],function(NEJ,_k,_e,_u,_i,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 弹出层封装基类对象，主要实现层里面内容部分的业务逻辑
     *
     * 脚本举例
     * ```javascript
     * // 第一步：继承此基类生成新类
     * NEJ.define([
     *     'base/element',
     *     'ui/layer/wrapper/layer'
     * ],function(_e,_i0,_p,_o,_f,_r){
     *     var _seed_css = _e._$pushCSSText('.#<uispace>
     *     {position:absolute;background:#fff;}');
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
     * });
     * // 下面是对layerwrapper的描述
     * NEJ.define([
     *     'base/klass',
     *     'ui/layer/wrapper/layer',
     *     '/path/custom/to/layer.js'
     * ],function(_k,_i0,_i1,_p,_o,_f,_r){
     *     // 首先：继承layerwrapper基类生成的一个新类
     *     _p._$$MyCardWrapper = _k._$klass();
     *     _proMyCardWrapper = _p._$$MyCardWrapper._$extend(_i0.
     *     _$$LayerWrapper);
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
     * ```
     *
     * @class   module:ui/layer/wrapper/layer._$$LayerWrapper
     * @extends module:ui/base._$$Abstract
     * @param   {Object} arg0 - 可选配置参数
     *
     */
    _p._$$LayerWrapper = _k._$klass();
    _pro = _p._$$LayerWrapper._$extend(_i._$$Abstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__doInitLayerOptions();
        this.__super(this
            .__doFilterOptions(_options));
        this.__lopt.onbeforerecycle =
            this._$recycle._$bind(this);
        this.__layer = this.__getLayerInstance();
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this._$dispatchEvent('onbeforerecycle');
        this.__super();
        delete this.__lopt;
        _e._$removeByEC(this.__body);
        var _layer = this.__layer;
        if (!!_layer){
            delete this.__layer;
            _layer._$recycle();
        }
    };
    /**
     * 构建弹层控件实例，子类实现具体业务逻辑
     *
     * @abstract
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#__getLayerInstance
     * @return {nej.ui._$$Layer} 弹层控件实例
     */
    _pro.__getLayerInstance = _f;
    /**
     * 将配置参数拆分为两部分，一部分用于弹层控件，一部分用于本控件
     *
     * @protected
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#__doFilterOptions
     * @param  {Object} arg0 - 可选配置参数
     * @return {Object} 过滤后的配置参数
     */
    _pro.__doFilterOptions = function(_options){
        var _result = {};
        _u._$forIn(_options,
            function(_item,_key){
                this.__lopt.hasOwnProperty(_key)
                ? this.__lopt[_key] = _item
                : _result[_key] = _item;
            },this);
        return _result;
    };
    /**
     * 初始化弹层控件可选配置参数
     *
     * @protected
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#__doInitLayerOptions
     * @return {Void}
     */
    _pro.__doInitLayerOptions = function(){
        this.__lopt = {
            clazz:''
           ,parent:null
           ,content:this.__body
           ,destroyable:!1
           ,oncontentready:null
           ,nohack:!1
        };
    };
    /**
     * 显示弹层
     *
     * 脚本举例
     * ```javascript
     * // 显示浮层
     * _ly._$show();
     * ```
     *
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#_$show
     * @return {Void}
     */
    _pro._$show = function(){
        if (!!this.__layer)
            this.__layer._$show();
        this._$dispatchEvent('onaftershow');
    };
    /**
     * 隐藏弹层
     *
     * 脚本举例
     * ```javascript
     * // 隐藏弹层
     * _ly._$hide();
     * ```
     *
     * @method module:ui/layer/wrapper/layer._$$LayerWrapper#_$hide
     * @return {Void}
     */
    _pro._$hide = function(){
        if (!!this.__layer)
            this.__layer._$hide();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});