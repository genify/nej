/*
 * ------------------------------------------
 * 聚焦效果接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/focus/focus */
NEJ.define([
    'base/global',
    'base/util',
    'base/element',
    '{platform}focus.js'
],function(NEJ,_u,_e,_p,_o,_f,_r){
    /**
     * 节点focus行为，提供两种模式支持
     *
     * * 0 - 聚焦添加效果，失焦去除效果，高版本使用:focus样式处理
     * * 1 - 聚焦添加效果，失焦时只有在当前输入框没有内容时去除效果
     *
     * 样式举例
     * ```css
     *   input:focus,input.js-focus{border:1px solid #f00;}
     *   input{color:#aaa;background:#eee;}
     *   .js-focus-0{color:#000;background-color:#fff;}
     * ```
     *
     * 结构举例
     * ```html
     *   <form>
     *     <!-- 可以使用data-focus指定聚焦时样式名称 -->
     *     <!-- 可以使用data-mode指定聚焦模式 -->
     *     <!-- 通过data-focus/data-mode指定的参数优先级高于接口调用时输入参数 -->
     *     <input id="xxx" type="text" data-focus="js-focus-0" data-mode="1"/>
     *     <!-- 节点没有指定参数 -->
     *     <input id="yyy" type="text"/>
     *   </form>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'util/focus/focus'
     *   ],function(_e){
     *       // 参数已在节点data-属性中指定
     *       _e._$focus('xxx');
     *
     *       // 参数没有指定，通过输入传递，仅指定样式名称
     *       _e._$focus('yyy','js-focus-1');
     *
     *       // 参数没有指定，通过输入传递，仅指定聚焦模式
     *       _e._$focus('yyy',1);
     *
     *       // 参数没有指定，通过输入传递，同时指定样式名称和聚焦模式
     *       _e._$focus('yyy',{clazz:'js-focus-2',mode:1});
     *   });
     * ```
     *
     * @method   module:util/focus/focus._$focus
     * @param    {String|Node} arg0  - 节点
     * @param    {Object}      arg1  - 配置参数
     * @property {Number}      mode  - 模式选择，默认为0
     * @property {String}      clazz - 聚焦样式，默认js-focus
     * @return   {Void}
     */
    _p._$focus = function(_element,_options){
        _element = _e._$get(_element);
        if (!!_element){
            var _mode = 0,
                _clazz = 'js-focus';
            // check param
            if (_u._$isNumber(_options)){
                _mode = _options;
            }else if(_u._$isString(_options)){
                _clazz = _options;
            }else if(_u._$isObject(_options)){
                _mode = _options.mode||_mode;
                _clazz = _options.clazz||_clazz;
            }
            // check data- attribute
            var _value = parseInt(
                _e._$dataset(_element,'mode')
            );
            if (!isNaN(_value)){
                _mode = _value;
            }
            _value = _e._$dataset(_element,'focus');
            if (!!_value){
                _clazz = _value;
            }
            // do focus
            _h.__focusElement(_element,_mode,_clazz);
        }
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }
    
    return _p;
});
