/**
 * ------------------------------------------
 * Trident引擎(ie6-ie9)占位符接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _f = NEJ.F,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident) return;
    /**
     * 节点占位符行为，高版本浏览器用样式处理
     * @param  {String|Node} _element 节点
     * @param  {String}      _clazz   样式
     * @return {Void}
     */
    _h.__setPlaceholder = (function(){
        // placeholder flag
        var _cache = {};
        // input foucs hide placeholder
        var _onFocus = function(_event){
            var _input = _v._$getElement(_event);
            if (!!_input.value) return;
            _e._$setStyle(_e._$wrapInline(_input),'display','none');
        };
        // input blur check placeholder show
        var _onBlur = function(_event){
            var _input = _v._$getElement(_event);
            if (!!_input.value) return;
            _e._$setStyle(_e._$wrapInline(_input),'display','');
        };
        // wrapper input control
        var _doWrapInput = function(_input,_clazz){
            var _id = _e._$id(_input),
                _label = _e._$wrapInline(_input,{
                    tag:'label',
                    clazz:_clazz
                });
            _label.htmlFor = _id;
            var _text = _e._$attr(_input,'placeholder')||'';
            _label.innerText = _text=='null'?'':_text;
            var _height = _input.offsetHeight+'px';
            _e._$style(_label,{
                left:0,
                // width:_input.offsetWidth+'px',
                // height:_height,lineHeight:_height,
                display:!_input.value?'':'none'
            });
        };
        return _h.__setPlaceholder._$aop(
               function(_event){
                    _event.stopped = !0;
                    var _args = _event.args,
                        _input = _e._$get(_args[0]);
                    // has been placeholded
                    if (!!_cache[_input.id])
                        return;
                    _doWrapInput(_input,_args[1]);
                    _cache[_input.id] = !0;
                    // listen blur and focus event
                    _v._$addEvent(_input,'blur',_onBlur._$bind(null));
                    _v._$addEvent(_input,'focus',_onFocus._$bind(null));
               });
    })();
//    
//    /**
//     * 清理节点占位行为
//     * @param  {String|Node} 节点
//     * @return {Void}
//     */
//    _h.__clearPlaceHolder = 
//    _h.__clearPlaceHolder._$aop(function(_event){
//        _event.stopped = !0;
//        var _input = _e._$get(_event.args[0]);
//        if (!_cache[_input.id]) return;
//        // recycle placeholder node
//        var _span = _input.parentNode;
//        _span.insertAdjacentElement('beforeBegin',_input);
//        _e._$removeByEC(_span);
//        _pool.unshift(_span);
//        // remove onfocus/onblur event
//        var _emap = _cache[_input.id];
//        _v._$delEvent.apply(_v,_emap.blur);
//        _v._$delEvent.apply(_v,_emap.focus);
//        delete _cache[_input.id];
//    });
};
NEJ.define('{lib}patched/trident/holder.js',
      ['{lib}patched/holder.js'],f);