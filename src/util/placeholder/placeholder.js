/*
 * ------------------------------------------
 * 输入框占位符支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _h = _('nej.h'),
        _e = _('nej.e'),
        _x = _('nej.x');
    /**
     * 输入框占位行为，高版本用placeholder属性和样式处理<br/>
     * 
     * 样式设置占位符文字效果：
     * [code type="css"]
     *   input:-moz-placeholder{color:#aaa;font-style:italic;}
     *   input::-ms-input-placeholder{color:#aaa;font-style:italic;}
     *   input::-webkit-input-placeholder{color:#aaa;font-style:italic;}
     *   .js-placeholder{color:#aaa;font-style:italic;}
     * [/code]
     * 
     * 页面结构
     * [code type="html"]
     *   <!-- 使用data-holder属性指定占位文字效果样式名称 -->
     *   <input id="abc" type="text" placeholder="text content" data-holder="js-placeholder"/>
     *   <textarea id="abc" placeholder="text content" data-holder="js-placeholder"></textarea>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   // 如果hover效果的样式名已经通过data-holder指定
     *   nej.e._$placeholder('abc');
     *   // 如果样式名没有通过data-holder指定，则可以通过参数输入
     *   // 当节点有data-holder指定样式名称，同时参数也输入样式名称，则优先使用data-holder指定的样式名
     *   nej.e._$placeholder('abc','js-placeholder');
     * [/code]
     * 
     * @api    {nej.e._$placeholder}
     * @param  {String|Node} 输入控件，如input、textarea
     * @param  {String}      占位样式名称，默认为js-placeholder
     * @return {nej.e}
     */
    _e._$placeholder = 
    _x._$placeholder = function(_element,_clazz){
        _h.__setPlaceholder(_element,
            _e._$dataset(_element,'holder')
                ||_clazz||'js-placeholder');
        return this;
    };
//    /**
//     * 清除输入框占位行为
//     * @param  {String|Node} 输入控件，如input、textarea
//     * @return {nej.e}
//     */
//    _e._$clearPlaceHolder = function(_element){
//        _h.__clearPlaceHolder(_element);
//        return this;
//    };
};
NEJ.define('{lib}util/placeholder/placeholder.js',
      ['{patch}holder.js'],f);