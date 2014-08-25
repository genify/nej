/*
 * ------------------------------------------
 * TOGGLE接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/toggle/toggle */
NEJ.define([
    'base/global',
    'base/element'
],function(NEJ,_e,_p,_o,_f,_r){
    /**
     * 点击切换样式，可以控制两种效果的交替显示
     *
     * 样式举例
     * ```css
     *   .box .shw{display:none;}
     *   .box.js-toggle .shw{display:block;}
     * ```
     *
     * 结构举例
     * ```html
     *   <div class="box">
     *     <div class="bar" id="click-bar">可点击区域</div>
     *     <div class="shw">
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *     </div>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 点击click-bar，交替显示shw节点
     *       _e._$toggle('click-bar');
     *
     *       // 自定义切换样式
     *       _e._$toggle('click-bar','js-show');
     *   });
     * ```
     *
     * 样式举例
     * ```css
     *   .box{display:none;}
     *   .box.js-toggle{display:block;}
     * ```
     *
     * 结构举例
     * ```html
     *   <div class="box">
     *     <div class="bar" id="click-bar">可点击区域</div>
     *     <div class="shw" id="toggle-node">
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *     </div>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 自定义切换样式
     *       _e._$toggle('click-bar','toggle-node');
     *
     *       // 同时自定义切换样式和节点
     *       _e._$toggle('click-bar',{
     *           clazz:'js-show',
     *           element:'toggle-node',
     *           ontoggle:function(_event){
     *               // _event.clazz   切换的样式名称
     *               // _event.target  触发切换事件的节点
     *               // _event.toggled 是否增加了切换样式
     *
     *               // TODO
     *           }
     *       });
     *   });
     * ```
     *
     * @method   module:util/toggle/toggle._$toggle
     * @param    {String|Node}   arg0     - 触发切换节点
     * @param    {String|Object} arg1     - 切换配置信息，输入字符串表示样式或者节点
     * @property {String}        clazz    - 样式名称，默认为js-toggle
     * @property {String|Node}   element  - 切换样式的节点，默认为父节点
     * @property {Function}      ontoggle - 节点样式切换触发事件，输入信息{clazz,target,toggled}
     * @return   {Void}
     */
    _p._$toggle = (function(){
        // click event
        var _doClick = function(_id,_clazz,_ontoggle){
            var _element = _e._$get(_id),
                _event = {
                    clazz:_clazz,
                    target:_element
                };
            if (_e._$hasClassName(_element,_clazz)){
                _event.toggled = !1;
                _e._$delClassName(_element,_clazz);
            }else{
                _event.toggled = !0;
                _e._$addClassName(_element,_clazz);
            }
            _ontoggle.call(null,_event);
        };
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!!_element){
                var _obj = {
                    ontoggle:_f,
                    clazz:'js-toggle',
                    element:_element.parentNode
                };
                if (_u._$isString(_options)){
                    var _node = _e._$get(_options);
                    !!_node ? _obj.element = _node
                            : _obj.clazz = _options;
                }else{
                    _u._$fetch(_obj,_options);
                    _obj.element = _e._$get(_obj.element);
                }
                var _id = _e._$id(_obj.element);
                _v._$addEvent(
                    _element,'click',
                    _doClick._$bind(
                         null,_id,
                        _obj.clazz,
                        _obj.ontoggle||_f
                    )
                );
            }
        };
    })();
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }
    
    return _p;
});
