/*
 * ------------------------------------------
 * 窗体控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}ui/layer/layer.js',
    '{lib}ui/mask/mask.js',
    '{lib}util/dragger/dragger.js'
],function(NEJ,_k,_e,_v,_u,_u0,_u1,_t,_p,_o,_f,_r){
    var _seed_css,
        _seed_html,
        _pro;
    /**
     * 窗体控件<br />
     * 脚本举例
     * [code]
     *   var _window = _p._$$Window._$allocate({
     *       parent:document.body,
     *       title:'弹出框标题',
     *       align:'left middle',
     *       draggable:true,
     *       onclose:function(){
     *         // 窗口关闭前的回调方法
     *       }
     *   });
     *   // 显示窗口，默认实例化后会显示，如果_$hide()后需要手动调用
     *   _window._$show();
     * [/code]
     * @class   {nej.ui._$$Window} 窗体控件
     * @extends {nej.ui._$$Layer}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String}                         title       窗口标题
     * @config  {String}                         align       相对于视窗位置定义，横向+空格+纵向，默认为center middle
     * [ntb]
     *   横向 | left/center/right/auto
     *   纵向 | top/middle/bottom/auto
     * [/ntb]
     * @config  {Boolean}                        draggable 是否可拖拽
     * @config  {nej.ui._$$Mask|Boolean|String}  mask      盖层信息
     * [ntb]
     *   如果是nej.ui._$$Mask的子类 | 则为盖层构造
     *   如果是布尔值               | 则使用默认盖层
     *   如果是字符串               | 则为盖层样式
     * [/ntb]
     *
     * [hr]
     *
     * @event  {onclose} 关闭窗体触发事件
     *
     */
    _p._$$Window = _k._$klass();
    _pro = _p._$$Window._$extend(_u0._$$Layer);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__mopt = {};
        this.__dopt = {onchange:this.__onDragging._$bind(this)};
        this.__super();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__setMask(_options.mask);
        this._$setAlign(_options.align);
        this._$setTitle(_options.title);
        if (!_options.draggable) return;
        this.__dragger = _t._$$Dragger.
                         _$allocate(this.__dopt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__align;
        delete this.__mclz;
        if (!!this.__imask){
            this.__imask._$recycle();
            delete this.__imask;
        }
        if (!!this.__dragger){
            this.__dragger._$recycle();
            delete this.__dragger;
        }
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // 0 - move bar
        // 1 - content box
        // 2 - close btn
        var _list = _e._$getChildren(this.__body);
        this.__ncnt = _list[1];
        this.__dopt.mbar = _list[0];
        this.__dopt.body = this.__body;
        _v._$addEvent(_list[2],'mousedown',
                      this.__onClose._$bind(this));
        _v._$addEvent(this.__dopt.mbar,'mousedown',
                      this.__onDragStart._$bind(this));
        this.__nttl = _e._$getChildren(this.__dopt.mbar)[0];
    };
    /**
     * 关闭窗口
     * @protected
     * @method {__onClose}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onClose = function(_event){
        _v._$stop(_event);
        this._$dispatchEvent('onclose');
        this._$hide();
    };
    /**
     * 窗口开始拖动过程
     * @protected
     * @method {__onDragStart}
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onDragStart = function(_event){
        _v._$dispatchEvent(document,'click');
    };
    /**
     * 窗口拖动过程
     * @protected
     * @method {__onDragging}
     * @param  {Object} 窗口位置信息
     * @return {Void}
     */
    _pro.__onDragging = function(_event){
        if (!this.__mask) return;
        _e._$style(this.__mask,{
            top:_event.top+'px',
            left:_event.left+'px'
        });
    };
    /**
     * 窗口位置调整
     * @protected
     * @method {__doPositionAlign}
     * @return {Void}
     */
    _pro.__doPositionAlign = (function(){
        var _func = [function(){return 0;},
                     function(_scroll,_delta,_key){
                         return Math.max(0,_scroll[_key]+_delta[_key]/2);
                     },
                     function(_scroll,_delta,_key){
                         return _scroll[_key]+_delta[_key];
                     }],
            _keys = ['left','top'];
        return function(){
            var _value = {},
                _style = this.__body.style,
                _view  = _e._$getPageBox(),
                _scroll= {left:_view.scrollLeft,top:_view.scrollTop},
                _delta = {left:_view.clientWidth-this.__body.offsetWidth
                         ,top:_view.clientHeight-this.__body.offsetHeight};
            _u._$forEach(_keys,
                function(_key,_index){
                    var _handler = _func[this.__align[_index]];
                    if (!_handler) return;
                    _value[_key] = _handler(_scroll,_delta,_key);
                },this);
            this._$setPosition(_value);
        };
    })();
    /**
     * 显示盖层
     * @protected
     * @method {__doShowMask}
     * @return {Void}
     */
    _pro.__doShowMask = function(){
        if (!this.__imask){
            if (!this.__mclz) return;
            this.__mopt.parent = this.__parent;
            this.__imask = this.__mclz
                ._$allocate(this.__mopt);
        }
        this.__imask._$show();
    };
    /**
     * 隐藏窗体
     * @protected
     * @method {__doHide}
     * @return {Void}
     */
    _pro.__doHide = function(){
        if (!!this.__imask)
            this.__imask._$hide();
        this.__super();
    };
    /**
     * 设置盖层构造
     * @protected
     * @method {__setMask}
     * @param  {nej.ui._$$Mask|Boolean} 盖层构造
     * @return {Void}
     */
    _pro.__setMask = function(_mask){
        if (!!_mask){
            if (_mask instanceof _u1._$$Mask){
                this.__imask = _mask;
                return;
            }
            if (_u._$isFunction(_mask)){
                this.__mclz = _mask;
                return;
            }
            this.__mclz = _p._$$Mask;
            if (_u._$isString(_mask))
                this.__mopt.clazz = _mask;
            return;
        }
        this.__mclz = null;
    };
    /**
     * 设置标题<br />
     * 脚本举例
     * [code]
     *   _window._$setTitle('设置浮层标题');
     * [/code]
     * @method {_$setTitle}
     * @param  {String} 标题
     * @return {nej.ui._$$Window}
     */
    _pro._$setTitle = function(_title,_html){
        if (!!this.__nttl){
            var _method = !_html?'innerText':'innerHTML';
            this.__nttl[_method] = _title||'标题';
        }
        return this;
    };
    /**
     * 设置窗体对齐方式<br />
     * 脚本举例
     * [code]
     *   // 设置对齐方式，默认是center,middle
     *   _window._$setAlign();
     * [/code]
     * @method {_$setAlign}
     * @param  {String} 对齐方式
     * @return {nej.ui._$$Window}
     */
    _pro._$setAlign = (function(){
        var _reg = /\s+/,
            _halign = {left:0,center:1,right:2,auto:3},
            _valign = {top:0,middle:1,bottom:2,auto:3};
        return function(_align){
            this.__align = (_align||'').split(_reg);
            var _tmp = _halign[this.__align[0]];
            if (_tmp==null) _tmp = 1;
            this.__align[0] = _tmp;
            var _tmp = _valign[this.__align[1]];
            if (_tmp==null) _tmp = 1;
            this.__align[1] = _tmp;
            return this;
        };
    })();
    /**
     * 显示窗体<br />
     * 脚本举例
     * [code]
     *   _window._$show();
     * [/code]
     * @method {_$show}
     * @return {nej.ui._$$Window}
     */
    _pro._$show = function(){
        this.__super();
        this.__doShowMask();
        return this;
    };
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{position:absolute;z-index:1000;border:1px solid #aaa;background:#fff;}\
        .#<uispace> .zbar{line-height:30px;background:#8098E7;border-bottom:1px solid #aaa;}\
        .#<uispace> .zcnt{padding:10px 5px;}\
        .#<uispace> .zttl{margin-right:20px;text-align:left;}\
        .#<uispace> .zcls{position:absolute;top:5px;right:0;width:20px;height:20px;line-height:20px;cursor:pointer;}\
    ');
    // ui html code
    _seed_html = _e._$addNodeTemplate('\
        <div class="'+_seed_css+'">\
          <div class="zbar"><div class="zttl">标题</div></div>\
          <div class="zcnt"></div>\
          <span class="zcls" title="关闭窗体">×</span>\
        </div>\
    ');

    if (CMPT){
        _t = NEJ.P('nej.ut'),
        _p = NEJ.P('nej.ui')
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});