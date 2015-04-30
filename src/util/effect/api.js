/*
 * ------------------------------------------
 * 动画API实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/effect/api */
NEJ.define([
    'base/element',
    'base/event',
    'base/util',
    '{platform}effect.api.js',
    'util/effect/effect',
    'base/chain'
],function(_e,_v,_u,_h,_t0,_x,_p,_o,_f,_r) {
    /**
     * 初始化特效参数
     *
     * @protected
     * @method module:util/effect/api#__initOptions
     * @param  {Object} arg0 - 特效参数
     * @return {Object} 特效参数
     */
    _p.__initOptions = function(_options){
        _options = _options||{};
        _options.onstop = _options.onstop||_f;
        _options.onplaystate = _options.onplaystate||_f;
        return _options;
    };

    /**
     * 检查是否可以做动画
     *
     * @protected
     * @method module:util/effect/api#__doBeforeStart
     * @param  {Node}    node - 目标节点
     * @param  {Object}  arg0 - 特殊属性对象
     * @return {Boolean} 是否可以做动画
     */
    _p.__doBeforeStart = (function(){
        // 如果有一个属性是没有变化的，此属性的回调不会发生，避免此情况
        var _doCheckState = function(_node,_objs){
            var _number,_flag=true;
            _u._$forIn(_objs,function(_value,_name){
                if (_name === 'opacity'){
                    _number = _h.__formatNumber ? _h.__formatNumber(_node) : _e._$getStyle(_node,_name);
                    _value = _h.__formatTo ? _h.__formatTo(_value) : _value;
                }else{
                    _number = _e._$getStyle(_node,_name);
                }
                // 属性没有变化是不允许的
                if (parseInt(_number) === _value)
                    _flag = false;
            }._$bind(this));
            return _flag;
        };
        return function(_node,_objs){
            if (!_doCheckState(_node,_objs)) return !1;
            return !0;
        };
    })();

    /**
     * 淡入淡出操作
     *
     * @protected
     * @method   module:util/effect/api#__doFade
     * @param    {String|Node} _node - 节点或者节点ID
     *
     * @param    {Object}   arg0     - 配置参数
     * @property {String} opacity    - 目标透明度
     * @property {String} timing     - 运动曲线
     * @property {Number} delay      - 延迟时间
     * @property {String} duration   - 运动时间
     *
     * @param  {Number}   arg1 - 1表示淡入，0表示淡出，优先使用前一个参数配置
     * @return {Void}
     */
    _p.__doFade = (function(){
        // 检查节点是否隐藏
        var _doCheckDisplay = function(_node){
            var _display = _e._$getStyle(_node,'display');
            if (_display === 'none') return !1;
            return !0;
        };
        return function(_node,_options,_default){
            var _opacity = _options.opacity||_default;
                   _node = _e._$get(_node);
            // display is none
            if (!_doCheckDisplay.call(_node)) return !1;
            // isLocked
            if (!!_node.effect) return !1;
            // attribute not change
            if (!_p.__doBeforeStart(_node,{opacity:_opacity})) return !1;
            _options = _p.__initOptions(_options);
            _node.effect = _t0._$$Effect._$allocate(
                {
                    node:_node,
                    transition:[
                        {
                            property:'opacity',
                            timing:_options.timing||'ease-in',
                            delay:_options.delay||0,
                            duration:_options.duration||1
                        }
                    ],
                    styles:['opacity:'+_opacity],
                    onstop:function(_state,_flag){
                        _node.effect = _t0._$$Effect._$recycle(_node.effect);
                        _options.onstop.call(null,_state,_flag);
                    },
                    onplaystate:_options.onplaystate._$bind(_node.effect)
                }
            );
            _node.effect._$start();
        };
    }._$bind(this))();

    /**
     * 淡入动画
     *
     * 页面结构举例
     * ```html
     * // 必须有opacity属性
     * <div id="box" style="opact">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     _t._$fadeIn(_node,{
     *         // 注意两位小数可能没有预期效果
     *         opacity:0.8,
     *         timing:'ease-out',
     *         delay:0,
     *         duration:5
     *     });
     * });
     * ```
     *
     * @method   module:util/effect/api._$fadeIn
     * @param    {Node|String} arg0 - 节点或者节点ID
     *
     * @param    {Object} arg1  - 配置参数
     * @property {String} opacity  - 目标透明度
     * @property {String} timing   - 运动曲线
     * @property {Number} delay    - 延迟时间
     * @property {String} duration - 运动时间
     * @return   {Void}
     */
    /**
     * @method CHAINABLE._$fadeIn
     * @see module:util/effect/api._$fadeIn
     */
    _p._$fadeIn = function(_node,_options){
        return _p.__doFade(_node,_options,1);
    };

    /**
     * 淡出动画
     *
     * 页面结构举例
     * ```html
     * <div id="box">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     _t._$fadeOut(_node,{
     *         // 注意两位小数可能没有预期效果
     *         opacity:0.8,
     *         timing:'ease-out',
     *         delay:0,
     *         duration:5
     *     });
     * });
     * ```
     *
     * @method    module:util/effect/api._$fadeOut
     * @param  {Node|String} arg0 - 节点或者节点ID
     *
     * @param  {Object}   arg1 	   - 配置参数
     * @property {String} opacity  - 目标透明度
     * @property {String} timing   - 运动曲线
     * @property {Number} delay    - 延迟时间
     * @property {String} duration - 运动时间
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$fadeOut
     * @see module:util/effect/api._$fadeOut
     */
    _p._$fadeOut = function(_node,_options){
        return _p.__doFade(_node,_options,0);
    };

    /**
     * 终止淡入淡出特效
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     _t._$fadeStop(_node);
     * });
     * ```
     *
     * @param  {Node|String} arg0 - 节点或者节点ID
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$fadeStop
     * @see module:util/effect/api._$fadeStop
     */
    _p._$fadeStop = function(_node){
        _p._$stopEffect(_node);
    };

    /**
     * 中途停止特效，直接跑到最后的目标
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     _t._$stopEffect(_node);
     * });
     * ```
     *
     * @param  {Node|String} arg0 - 节点或者节点ID
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$stopEffect
     * @see module:util/effect/api._$stopEffect
     */
    _p._$stopEffect = function(_node){
        _node = _e._$get(_node);
        if (_node.effect && _node.effect._$stop(true)){
            return;
        }
    };

    /**
     * 移动节点
     *
     * 页面结构举例
     * ```html
     * <div id="box">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     // 需要配合预先定义的position属性
     *     _t._$moveTo(_node,{top:100,left:100},{
     *         timing:'ease-out',
     *         delay:0,
     *         duration:[5,1]
     *     });
     * });
     * ```
     *
     * @method   module:util/effect/api._$moveTo
     * @param    {Node|String} arg0 - 节点或者节点ID
     *
     * @param    {Object} arg1 	    - 配置参数
     * @property {String} top       - 移动节点的top值
     * @property {String} left      - 移动节点的left值
     * @property {String} timing    - 运动曲线
     * @property {Number} delay     - 延迟时间
     * @property {String} duration  - 运动时间
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$moveTo
     * @see module:util/effect/api._$moveTo
     */
    _p._$moveTo = function(_node,_position,_options){
        _node = _e._$get(_node);
        if (!!_node.effect) return !1;
        if (!_p.__doBeforeStart(_node,_position)) return !1;
        _options = _p.__initOptions(_options);
        _options.duration = _options.duration||[];
        var _top = _position.top||0,_left= _position.left||0;
        _node.effect = _t0._$$Effect._$allocate(
            {
                node:_node,
                transition:[
                    {
                        property:'top',
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration[0]||1
                    },
                    {
                        property:'left',
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration[1]||1
                    }
                ],
                styles:['top:'+_top,'left:'+_left],
                onstop:function(_state,_flag){
                    _node.effect = _t0._$$Effect._$recycle(_node.effect);
                    _options.onstop.call(null,_state,_flag);
                },
                onplaystate:_options.onplaystate._$bind(_node.effect)
            }
        );
        _node.effect._$start();
    };

    /**
     * 移动节点
     *
     * 页面结构举例
     * ```html
     * <div id="box">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     // 需要配合预先定义的position属性
     *     // top,bottom,left,right只可操作其一
     *     // 同时操作2个属性参照moveTo
     *     _t._$slide(_node,'top:+100'{
     *         timing:'ease-out',
     *         delay:0,
     *         duration:5
     *     });
     * });
     * ```
     *
     * @method   module:util/effect/api._$slide
     * @param    {Node|String} arg0 - 节点或者节点ID
     *
     * @param    {String} arg1     - 滑动的方向
     *
     * @param    {Object} arg2     - 配置参数
     * @property {String} timing   - 运动曲线
     * @property {Number} delay    - 延迟时间
     * @property {String} duration - 运动时间
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$slide
     * @see module:util/effect/api._$slide
     */
    _p._$slide = function(_node,_position,_options){
        _node = _e._$get(_node);
        if (!!_node.effect) return !1;
        _options = _p.__initOptions(_options);
        var _list  = _position.split(':'),
            _pro0  = _list[0],
            _styles= [];
        _styles.push(_position);
        _node.effect = _t0._$$Effect._$allocate(
            {
                node:_node,
                transition:[
                    {
                        property:_pro0,
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration||1
                    }
                ],
                styles:_styles,
                onstop:function(_state,_flag){
                    _node.effect = _t0._$$Effect._$recycle(_node.effect);
                    _options.onstop.call(null,_state,_flag);
                },
                onplaystate:_options.onplaystate._$bind(_node.effect)
            }
        );
        _node.effect._$start();
    };

    /**
     * toggle效果
     *
     * 页面结构举例
     * ```html
     * // overflow:hidden;visibility:hidden;display:none;
     * <div id="box">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     * 	   'base/element',
     *     'util/effect/api'
     * ],function(_e,_t,_p,_o,_f,_r){
     *     var _node = _e._$get("box");
     *     _t._$toggle(_box,'height',{value:100,timing:'ease-out',duration:'1.2'});
     * });
     * ```
     *
     * @method   module:util/effect/api._$toggleEffect
     * @param    {Node|String} arg0 - 节点或者节点ID
     *
     * @param    {String} arg1     - 需要改变的属性，height或width
     *
     * @param    {Object} arg2     - 配置参数
     * @property {Number} value    - 属性值
     * @property {String} timing   - 运动曲线
     * @property {Number} delay    - 延迟时间
     * @property {String} duration - 运动时间
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$toggleEffect
     * @see module:util/effect/api._$toggleEffect
     */
    _p._$toggleEffect = (function(){
        var _doCheck = function(_node,_type){
            return _type == 'height' ? _node.clientHeight : _node.clientWidth;
        };
        return function(_node,_type,_options){
            _node = _e._$get(_node);
            if (!!_node.effect) return !1;
            _options = _p.__initOptions(_options);
            // set
            var _value = _options.value||false;
            if (!_value){
                _e._$setStyle(_node,'display','block');
                var _node = _e._$get(_node);
                _value = _doCheck(_node,_type);
            }
            var _flag = _e._$getStyle(_node,'visibility');
            if (_flag === 'hidden'){
                _node.style.height = 0;
                _e._$setStyle(_node,'visibility','inherit');
                _node.effect = _t0._$$Effect._$allocate(
                    {
                        node:_node,
                        transition:[
                            {
                                property:_type,
                                timing:_options.timing||'ease-in',
                                delay:_options.delay||0,
                                duration:_options.duration||1
                            }
                        ],
                        styles:[_type + ':' + _value],
                        onstop:function(_state,_flag){
                            _node.effect = _t0._$$Effect._$recycle(_node.effect);
                            _options.onstop.call(null,_state,_flag);
                            _sto = window.clearTimeout(_sto);
                        },
                        onplaystate:_options.onplaystate._$bind(_node.effect)
                    }
                );
            }else{
                _node.style.height = _value;
                _node.effect = _t0._$$Effect._$allocate(
                    {
                        node:_node,
                        transition:[
                            {
                                property:_type,
                                timing:_options.timing||'ease-in',
                                delay:_options.delay||0,
                                duration:_options.duration||1
                            }
                        ],
                        styles:[_type + ':' + 0],
                        onstop:function(_state,_flag){
                            _e._$setStyle(_node,'visibility','hidden');
                            _e._$setStyle(_node,_type,'auto');
                            _node.effect = _t0._$$Effect._$recycle(_node.effect);
                            _options.onstop.call(null,_state,_flag);
                            _sto = window.clearTimeout(_sto);
                        },
                        onplaystate:_options.onplaystate._$bind(_node.effect)
                    }
                );
            }
            var _sto = window.setTimeout(function(){_node.effect._$start();}._$bind(this),0);
        };
    })();
    // for chainable method
    _x._$merge(_p);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});