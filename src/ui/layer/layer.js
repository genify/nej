/*
 * ------------------------------------------
 * 弹出层控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/util.js',
    '{lib}ui/base.js'
],function(NEJ,_k,_e,_u,_i,_p,_o,_f,_r){
    var _pro;
    /**
     * 弹出层控件基类<br />
     * 脚本举例
     * [code]
     *   // 第一步：继承此基类生成新类
     *   var _seed_css = _e._$pushCSSText('.#<uispace>{position:absolute;background:#fff;}');
     *   _p._$$MyLayer = NEJ.C();
     *   _proMyLayer = _p._$$MyLayer._$extend(_p._$$Layer);
     *
     *   _proMyLayer.__initXGui = function(){
     *      this.__seed_css = _seed_css;
     *   };
     *
     *   _proMyLayer.__initNode = function(){
     *       this.__supInitNode();
     *       // this.__ncnt作为放置卡片内容的容器
     *       this.__ncnt = this.__body;
     *   };
     *   // 第二步:实例化一个弹出层
     *   // 一般在layerwrapper控件中使用
     *   // 因为lopt的有默认配置在layerwrapper中
     *   _proMyCardWrapper.__getLayerInstance = function(){
     *       return _p._$$MyLayer._$allocate(this.__lopt);
     *   };
     *
     *   // 下面是对layerwrapper的描述
     *
     *   // 首先：继承layerwrapper基类生成的一个新类
     *   _p._$$MyCardWrapper = NEJ.C();
     *   _proMyCardWrapper = _p._$$MyCardWrapper._$extend(_p._$$LayerWrapper);
     *
     *   // 这里返回内容层的实例
     *   _proMyCardWrapper.__getLayerInstance = function(){
     *       return _p._$$MyLayer._$allocate(this.__lopt);
     *   };
     *
     *   // 这里配置lopt参数，生成内容层用
     *   _proMyCardWrapper.__doInitLayerOptions = function(){
     *   _p._$$MyCardWrapper._$supro
     *           .__doInitLayerOptions.apply(this,arguments);
     *       this.__lopt.top = null;
     *       this.__lopt.left = null;
     *   };
     *
     *   // 最后项目中实例化wrapper的实例
     *    var _ly = _p._$$MyLayerCard._$allocate({
     *       parent:document.body,
     *       // 隐藏浮层时，是否销毁
     *       destroyable:false,
     *       oncontentready:function(_html){
     *         // 设置浮层内容的回调
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$Layer} 弹出层控件基类
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node} content     内容HTML代码或者节点对象
     * @config  {Boolean}     destroyable 调用隐藏时是否自动回收，默认不自动回收
     * @config  {Boolean}     nohack      针对IE6不做hack处理
     *
     * [hr]
     *
     * @event  {oncontentready} 显示内容准备就绪触发事件
     * @param  {Node} 显示内容的节点
     *
     * [hr]
     *
     * @event  {onbeforerecycle} 控件回收前触发事件
     *
     */
    _p._$$Layer = _k._$klass();
    _pro = _p._$$Layer._$extend(_i._$$Abstract);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
     * @protected
     * @method {__destroy}
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
     * @protected
     * @method {__doInitContent}
     * @param  {Node} 内容区容器节点
     * @return {Void}
     */
    _pro.__doInitContent = _f;
    /**
     * 调整显示位置，子类实现具体业务逻辑
     * @protected
     * @method {__doPositionAlign}
     * @return {Void}
     */
    _pro.__doPositionAlign = _f;
    /**
     * 控件隐藏
     * @protected
     * @method {__doHide}
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
     * 设置层显示内容<br />
     * 脚本举例
     * [code]
     *   // 设置层里面展示的内容
     *   _ly._$setContent('节点或者字符串');
     * [/code]
     * @method {_$setContent}
     * @param  {String|Node} 内容HTML代码或者节点
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
     * 设置位置<br />
     * 脚本举例
     * [code]
     *   // 设置浮层位置
     *   _ly._$setPosition({top:100,left:200});
     * [/code]
     * @method {_$setPosition}
     * @param  {Object} 位置信息，如{top:100,left:200}
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
     * 显示控件<br />
     * 脚本举例
     * [code]
     *   // 显示浮层
     *   _ly._$show();
     * [/code]
     * @method {_$show}
     * @return {Void}
     */
    _pro._$show = function(){
        _e._$setStyle(this.__body,'visibility','hidden');
        _supLayer._$show.apply(this,arguments);
        this.__doPositionAlign();
        _e._$setStyle(this.__body,'visibility','');
        if (!this.__nohack){
            this.__mask = _e._$mask(this.__body);
        }
    };
    /**
     * 隐藏控件<br />
     * 脚本举例
     * [code]
     *   // 隐藏浮层
     *   _ly._$hide();
     * [/code]
     * @method {_$hide}
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