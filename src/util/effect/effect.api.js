var f = function() {
	var _  = NEJ.P,
		_f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut');
    var _effectLock;
    /**
     * 初始化特效参数
     * @param  {Object} 特效参数
     * @return {Object} 特效参数
     */
    _e.__initOptions = function(_options){
    	_options = _options||{};
    	_options.onstop = _options.onstop||_f;
    	_options.onplaystate = _options.onplaystate||_f;
    	return _options;
    };

    /**
     * 检查
     * @param  {[type]} _node [description]
     * @return {[type]}       [description]
     */
    _e.__doBeforeStart = (function(){
        // 检查节点是否隐藏
        var _doCheckdisplay = function(_node){
            var _d = _e._$getStyle(_node,'display')
            if(_d == 'none')
                return false;
            return true;
        };
        // 如果有一个属性是没有变化的，此属性的回调不会发生，避免此情况
        var _doCheckState = function(_node,_objs){
            var _v,_fg = true;
            _u._$forIn(_objs,function(_value,_name){
                if(_name == 'opacity' && nej.p._$KERNEL.engine=='trident' && nej.p._$KERNEL.release != '5.0'){
                    _name = 'filter';
                    var _filter = _e._$getStyle(_node,_name);
                    _v = parseFloat(_filter.split('=')[1])||0;
                    _value = _value * 100;
                }else{
                    _v = _e._$getStyle(_node,_name);
                }
                if(_v == _value)
                    _fg = false;
            }._$bind(this));
            return _fg;
        }
        return function(_node,_objs){
            if(!_doCheckState(_node,_objs))
                return !1;
            if(!_effectLock && _doCheckdisplay(_node))
                _effectLock = true;
            else
                return !1;
            return _effectLock;
        };
    })();

    /**
     * 淡入淡出操作
     * @param  {String|Node} _node  节点或者节点ID
     * @param  {Object}      配置参数
     * @config {String} opacity  目标透明度
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @param  {Number} 1表示淡入，0表示淡出，优先使用opacity配置
     * @return {nej.e}
     */
    _e.__doFade = function(_node,_options,_default){
        var _opacity = _options.opacity||_default;
        if(!_e.__doBeforeStart(_node,{opacity:_opacity})){
            return false;
        }
        _options = _e.__initOptions(_options);
        _node = _e._$get(_node);
        var _effect = _p._$$Effect._$allocate(
            {
                node:_node,
                transition:[
                    {
                        property:'opacity',
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration||0
                    }
                ],
                styles:['opacity:'+_opacity],
                onstop:function(_state){
                    _options.onstop.call(this,_state);
                    _effect = _p._$$Effect._$recycle(_effect);
                    _effectLock = !1;
                },
                onplaystate:_options.onplaystate._$bind(_effect)
            }
        );
        _effect._$start();
        return this;
    };

    /**
     * 淡入动画
     * 页面结构举例
     * [code type="html"]
     *   // 必须有opactiy属性
     *   <div id="box" style="opact">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("box");
     *   _e._$fadeIn(_node,{
     *       // 注意两位小数可能没有预期效果
     *       opactiy:0.8,
     *       timing:'ease-out',
     *       delay:0,
     *       duration:5
     *   });
     * [/code]
     * @api    {nej.e._$fadeIn}
     * @param  {Node|String} 节点或者节点ID
     * @param  {Object}      配置参数
     * @config {String} opacity  目标透明度
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @return {nej.e}
     */
    _e._$fadeIn = function(_node,_options){
        return _e.__doFade(_node,_options,1);
    };

    /**
     * 淡出动画
     * 页面结构举例
     * [code type="html"]
     *   <div id="box">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("box");
     *   _e._$fadeOut(_node,{
     *       // 注意两位小数可能没有预期效果
     *       opactiy:0.8,
     *       timing:'ease-out',
     *       delay:0,
     *       duration:5
     *   });
     * [/code]
     * @api    {nej.e._$fadeOut}
     * @param  {Node|String} 节点或者节点ID
     * @param  {Object}      配置参数
     * @config {String} opacity  目标透明度
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @return {nej.e}
     */
    _e._$fadeOut = function(_node,_options){
        return _e.__doFade(_node,_options,0);
    };

    /**
     * 移动节点
     * 页面结构举例
     * [code type="html"]
     *   <div id="box">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("box");
     *   // 需要配合预先定义的position属性
     *   _e._$moveTo(_node,{top:100,left:100}{
     *       timing:'ease-out',
     *       delay:0,
     *       duration:5
     *   });
     * [/code]
     * @api    {nej.e._$moveTo}
     * @param  {Node|String} 节点或者节点ID
     * @param  {Object}      配置参数
     * @config {String} top      移动节点的top值
     * @config {String} left     移动节点的left值
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @return {nej.e}
     */
    _e._$moveTo = function(_node,_position,_options){
        if(!_e.__doBeforeStart(_node)){
            return false;
        }
    	_options = _e.__initOptions(_options);
    	   _node = _e._$get(_node);
    	var _top = _position.top||0,
    		_left= _position.left||0;
    	var _effect = _p._$$Effect._$allocate(
            {
                node:_node,
                transition:[
                    {
                        property:'top',
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration||0
                    },
                    {
                        property:'left',
                        timing:_options.timing||'ease-in',
                        delay:_options.delay||0,
                        duration:_options.duration||0
                    }
                ],
                styles:['top:'+_top,'left:'+_left],
                onstop:function(_state){
				    _options.onstop.call(_state);
                    _effect = _p._$$Effect._$recycle(_effect);
                    _effectLock = !1;
                },
                onplaystate:_options.onplaystate._$bind(_effect)
            }
        );
        _effect._$start();
        return this;
    };

    /**
     * 移动节点
     * 页面结构举例
     * [code type="html"]
     *   <div id="box">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("box");
     *   // 需要配合预先定义的position属性
     *   _e._$silde(_node,'top:+100'{
     *       timing:'ease-out',
     *       delay:0,
     *       duration:5
     *   });
     * [/code]
     * @api    {nej.e._$moveTo}
     * @param  {Node|String} 节点或者节点ID
     * @param  {String}      滑动的方向
     * @param  {Object}      配置参数
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @return {nej.e}
     */
    _e._$silde = (function(){
        var _setPst = function(_node,_position){
            var _list  = _position.split(':');
            var _pst = _list[0];
            var _styles = [];
            _styles.push(_position);
            if(_pst == 'top' || _pst == 'bottom'){
                _styles.push('left:' + _e._$getStyle(_node,'left'));
            }else{
                _styles.push('top:' + _e._$getStyle(_node,'top'));
            }
            return _styles;
        };
        return function(_node,_position,_options){
            _node = _e._$get(_node);
            var _list  = _position.split(':');
            var _pro0 = _list[0];
            var _pro1 = '';
            if(_pro0 == 'top' || _pro0 == 'bottom'){
                _pro1 = 'left';
            }else{
                _pro1 = 'top';
            }
            var _styles = _setPst.call(this,_node,_position);
            var _effect = _p._$$Effect._$allocate(
                {
                    node:_node,
                    transition:[
                        {
                            property:_pro0,
                            timing:_options.timing||'ease-in',
                            delay:_options.delay||0,
                            duration:_options.duration||0
                        },
                        {
                            property:_pro1,
                            timing:_options.timing||'ease-in',
                            delay:_options.delay||0,
                            duration:_options.duration||0
                        }
                    ],
                    styles:_styles,
                    onstop:function(_state){
                        _options.onstop.call(_state);
                        _effect = _p._$$Effect._$recycle(_effect);
                        _effectLock = !1;
                    },
                    onplaystate:_options.onplaystate._$bind(_effect)
                }
            );
            _effect._$start();
            return this;
        };
    })();

    /**
     * toggle效果
     * 页面结构举例
     * [code type="html"]
     *   // overflow:hidden;visibility:hidden;display:none;
     *   <div id="box">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("box");
     *   _e._$toggle(_box,'height',{value:100,timing:'ease-out',duration:'1.2'});
     * [/code]
     * @api    {nej.e._$toggle}
     * @param  {Node|String} 节点或者节点ID
     * @param  {String}      需要改变的属性，height或width
     * @param  {Object}      配置参数
     * @config {Number} value    属性值
     * @config {String} timing   运动曲线
     * @config {Number} delay    延迟时间
     * @config {String} duration 运动时间
     * @return {nej.e}
     */
    _e._$toggleEffect = (function(){
        var _doCheck = function(_node,_type){
            return _type == 'height' ? _node.clientHeight : _node.clientWidth;
        };
        return function(_node,_type,_options){
            if(!_effectLock)
                _effectLock = true;
            else
                return !1;
            var _effect;
            _options = _e.__initOptions(_options);
            // set
            var _value = _options.value||false;
            if(!_value){
                _e._$setStyle(_node,'display','block');
                var _node = _e._$get(_node);
                _value = _doCheck(_node,_type);
            }
            var _flag = _e._$getStyle(_node,'visibility');
            if(_flag == 'hidden'){
                _node.style.height = 0;
                _e._$setStyle(_node,'visibility','inherit');
                _effect = _p._$$Effect._$allocate(
                    {
                        node:_node,
                        transition:[
                            {
                                property:_type,
                                timing:_options.timing||'ease-in',
                                delay:_options.delay||0,
                                duration:_options.duration||0
                            }
                        ],
                        styles:[_type + ':' + _value],
                        onstop:function(_state){
                            _e._$setStyle(_node,_type,'auto');
                            _options.onstop.call(_state);
                            _effect = _p._$$Effect._$recycle(_effect);
                            _effectLock = !1;
                            _sto = window.clearTimeout(_sto);
                        },
                        onplaystate:_options.onplaystate._$bind(_effect)
                    }
                );
            }else{
                _node.style.height = _value;
                _effect = _p._$$Effect._$allocate(
                    {
                        node:_node,
                        transition:[
                            {
                                property:_type,
                                timing:_options.timing||'ease-in',
                                delay:_options.delay||0,
                                duration:_options.duration||0
                            }
                        ],
                        styles:[_type + ':' + 0],
                        onstop:function(_state){
                            _e._$setStyle(_node,'display','none');
                            _e._$setStyle(_node,'visibility','hidden');
                            _e._$setStyle(_node,_type,'auto');
                            _options.onstop.call(_state);
                            _effect = _p._$$Effect._$recycle(_effect);
                            _effectLock = !1;
                            _sto = window.clearTimeout(_sto);
                        },
                        onplaystate:_options.onplaystate._$bind(_effect)
                    }
                );
            }
            var _sto = window.setTimeout(function(){_effect._$start()}._$bind(this),0);
            return _effect;
        };
    })();

};
NEJ.define('{lib}util/effect/effect.api.js',
      ['{lib}util/effect/effect.js'],f);