/*
 * ------------------------------------------
 * 动画特效基类实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _u = _('nej.u'),
        _h = _('nej.h'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proEffect;
    if (!!_p._$$Effect) return;

    /**
     * 动画特效基类
     * 如果属性没有变化不能写入，此属性的回调不会发生
     * 目前支持的css属性有：
     * width,height,z-index,opacity,margin,padding,font-size,font-weight
     * top,right,bottom,left(需要指定position)
     * 高级浏览器支持color相关属性
     * 属性单位限定px,不支持em或pt
     *
     * 页面结构举例
     * [code type="html"]
     *   <div id='box' style='position:absolute;z-index:10;'>abc</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _effect = _p._$$Effect._$allocate(
     *      {
     *          node:'box',
     *          transition:[
     *              {
     *                  property:'top',
     *                  timing:'ease-in',
     *                  delay:1,
     *                  duration:10
     *              },
     *              {
     *                  property:'z-index',
     *                  timing:'ease-in',
     *                  delay:2,
     *                  duration:10
     *              }
     *          ],
     *          styles:['top:+=460','z-index:999'],
     *          onstop:function(){
     *         },
     *          onplaystate:function(){
     *          }
     *      }
     *  );
     *  // 所有动画统一轨迹和时间
     *  var _effect2 = _p._$$Effect._$allocate({
     *          node:'box',
     *          transition:[
     *              {
     *                  property:'all',
     *                  timing:'ease-in',
     *                  delay:1,
     *                  duration:10
     *              }
     *          ],
     *          styles:['top:+=460','z-index:999'],
     *          onstop:function(){
     *         },
     *          onplaystate:function(){
     *          }
     *      });
     * [/code]
     * @class   {nej.ut._$$Effect}
     * @extends {nej.ut._$$Event}
     * @param   {Object}       可选配置参数，已处理参数列表如下
     * @config  {String|Node}  node       动画节点
     * @config  {Array}        transition 动画属性列表
     * [ntb]
     *   意义|属性    |运动轨迹      |延迟启动时间    |持续时间 
     *   属性|property|timing        |delay           |duration     
     *   值  | width  |[linear,ease-in,ease-out,ease-in-out]|1|10
     * [/ntb]
     * @config  {Array}        styles     动画需要改变的css属性
     * 
     * [hr]
     * 动画停止的回调
     * @event  {onstop}
     * @return {Void}
     *
     * [hr]
     * 动画中间状态回调
     * @event  {onplaystate}
     * @return {Void}
     */
    _p._$$Effect = NEJ.C();
      _proEffect = _p._$$Effect._$extend(_p._$$Event);

    /**
     * 初始化方法
     * @param  {Object}       可选配置参数
     * @return {Void}          
     */
    _proEffect.__reset = function(_options){
        this.__supReset(_options);
        this.__node   = _e._$get(_options.node);
        this.__styles = _options.styles||[];
        this.__onstop = _options.onstop||_f;
        this.__transition = _options.transition||[];
        this.__propMap = {};
        this.__animRule= this.__doParseStyle();
        // IE10只触发一次hack
        if(!!_h.__onTransitionEnd && _h.__onTransitionEnd()){
            setTimeout(this.__onTransitionEnd._$bind(this),this.__sumtime * 1000);
        }else{
            this.__doInitDomEvent([
                [this.__node,'transitionend',this.__onTransitionEnd._$bind(this)]
            ]);
        }
    };

    /**
     * 销毁对象
     * @return {Void}
     */
    _proEffect.__destroy = function(){
        if(!!this.__intvl){
            this.__intvl = window.clearInterval(this.__intvl);
        }
        // 这里回收关于此节点的动画信息
        delete this.__node;
        delete this.__styles;
        delete this.__animRule;
        delete this.__propMap;
        delete this.__lastProp;
        delete this.__transition;
        delete this.__intvl;
        this.__supDestroy();
    };

    /**
     * 监听动画结束事件
     * @param  {Object} 属性信息
     * @return {Void}  
     */
    _proEffect.__onTransitionEnd = function(_event){
        // IE10只触发一次hack
        if(!!_h.__onTransitionEnd && _h.__onTransitionEnd()){
            this.__start = !1;
            this._$stop();
            return;
        }
        if(!!this.__start&&this.__isLast(_event)){
            this.__start = !1;
            this._$stop();
        }
    };

    /**
     * 是否是最后结束的属性
     * @param  {Object}   属性信息
     * @return {Boolean}  是否是最后结束的属性
     */
    _proEffect.__isLast = function(_event){
        var _name = _event.propertyName;
        if((_name === this.__lastProp)||(_name.indexOf(this.__lastProp) > -1))
            return !0;
        else
            return !1;
    };
    /**
     * 解析出目标样式
     * @return {String} 解析好的目标样式
     */
    _proEffect.__doParseStyle = (function(){
        // 根据属性的拼写规则，做适当的调整
        var _doParseStyle = function(_style){
            var _list  = _style.split(':'),
                _prop  = _list[0],
                _value = _list[1],
                _node  = this.__node;
            // 需要解析=号
            if(_value.indexOf('=') > -1){
                var _a = parseInt(_e._$getStyle(_node,_prop))||0;
                var _b = parseInt(_value.split('=')[1]);
                if(_value.indexOf('+') > -1)
                    _value = _a + _b;
                else
                    _value = _a - _b;
            }
            // 需要加单位
            if(_h.__doCheckProp(_prop)){
                if(_value.toString().indexOf('px') < 0)
                    _value += 'px';
            }
            this.__propMap[_prop] = _value;
        };
        // 解析动画的规则
        var _doParseAnim = function(_index){
            if(!this.__transition[_index])
                return '';
            var _rule = this.__transition[_index],
                _t = _rule.duration + _rule.delay;
            if( _t >= this.__sumtime){
                this.__sumtime = _t;
                this.__lastProp = _rule.property;
            }
            return _rule.property + ' ' + _rule.duration + 's ' + _rule.timing + ' ' + _rule.delay + 's,';
        };
        return function(){
            var _animRule = '';
            this.__sumtime = 0;
            _u._$forEach(this.__styles,function(_style,_index){
                _doParseStyle.call(this,_style);
                _animRule += _doParseAnim.call(this,_index);
            }._$bind(this));
            return _animRule;
        };
    })();

    /**
     * 动画开始后，监听节点的样式
     * @return {Void}
     */
    _proEffect.__onPlayState = function(){
        this.__state = {};
        _u._$forIn(this.__propMap,function(_value,_prop){
            this.__state[_prop] = _e._$getStyle(this.__node,_prop);
        }._$bind(this));
        this._$dispatchEvent('onplaystate',this.__state);
    };

    /**
     * 开始动画
     * @method {nej.e._$start}
     * @return {nej.ut}           
     */
    _proEffect._$start = function(){
        this.__start = !0;
        _h.__onStart(this.__node,this.__propMap,this.__animRule,this.__onstop);
        this.__intvl = window.setInterval(this.__onPlayState._$bind(this),49);
        return this;
    };

    /**
     * 取消动画
     * @method {nej.e._$stop}
     * @return {nej.ut}
     */
    _proEffect._$stop = function(){
        _h.__onStop(this.__node,this.__propMap,this.__onstop);
        this.__intvl = window.clearInterval(this.__intvl);
        return this;
    };

    /**
     * 暂停动画
     * @method {nej.e._$paused}
     * @return {nej.ut}
     */
    _proEffect._$paused = function(){
       // todo
    };

    /**
     * 暂停后重新开始动画
     * @method {nej.e._$restart}
     * @return {nej.ut}
     */
    _proEffect._$restart = function(){
        // todo
    };
};
NEJ.define('{lib}util/effect/effect.js',
      ['{lib}base/element.js'
      ,'{patch}effect.js'
      ,'{lib}util/event.js'],f);
