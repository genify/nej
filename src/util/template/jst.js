/*
 * ------------------------------------------
 * JST模板二次封装文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/template/jst */
NEJ.define([
    'base/global',
    'base/util',
    'base/element',
    'base/chain',
    'util/template/trimpath'
],function(NEJ,_u,_e,_x,_t,_p,_o,_f,_r){
    var _ext = {};
    /**
     * 取模板随机数种子
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/template/jst'
     * ],function(_p){
     *     // 返回一个标识符
     *     var _seed = _p._$seed();
     * });
     * ```
     *
     * @method module:util/template/jst._$seed
     * @return {String} 随机数种子
     */
    _p._$seed = TrimPath.seed;
    /**
     * 根据模板的序列号合并模板数据
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/template/jst'
     * ],function(_p){
     *     // 添加模版
     *     var _html_seed =  _p._$add('<div>${name}</div>');
     *     // 生成结构<div>jack</div>
     *     var _html = _p._$get(_html_seed,{name:'jack'});
     * });
     * ```
     *
     * @method module:util/template/jst._$get
     * @see    module:util/template/jst._$add
     * @param  {String} arg0 - 模板序列号
     * @param  {Object} arg1 - 模板数据
     * @param  {Object} arg2 - 扩展接口
     * @return {String}        合并数据后的内容
     */
    _p._$get = (function(){
        var _doInline = function(_id){
            return !_p._$getTextTemplate?'':
                    _p._$getTextTemplate(_id);
        };
        return function(_sn,_data,_extend){
            _data = _data||{};
            _data.inline = _doInline;
            _extend = _u._$merge({},_ext,_extend);
            _extend.rand = _u._$randNumberString;
            _extend.format = _u._$format;
            _extend.escape = _u._$escape;
            _extend.inline = _doInline;
            return TrimPath.merge(_sn,_data,_extend);
        };
    })();
    /**
     * 添加JST模板，JST模板可以是节点的值
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/template/jst'
     * ],function(_p){
     *     // 添加模版缓存
     *     var _html_seed =  _p._$add('<div>${name}</div>');
     * });
     * ```
     *
     * @method module:util/template/jst._$add
     * @see    module:util/template/jst._$get
     * @param  {String}  arg0 - JST模板内容或者节点ID
     * @param  {Boolean} arg1 - 是否保留节点
     * @return {String}         JST模板在缓存中的序列号
     */
    _p._$add = function(_content,_keep){
        if (!_content) return '';
        var _sn,_element = _e._$get(_content);
        if (!!_element){
            _sn = _element.id;
            _content = _element.value||_element.innerText;
            if (!_keep) _e._$remove(_element);
        }
        return TrimPath.parse(_content,_sn);
    };
    /**
     * 整合模板后输出至指定容器节点
     *
     * 结构举例
     * ```html
     * <div id="box">aaa</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/template/jst'
     * ],function(_p){
     *     // 添加模版缓存
     *     var _html_seed =  _p._$add('<div>${name}</div>');
     *     // 把结构塞到box中，生成<div id="box"><div>jack</div></div>
     *     _p._$render('box',_html_seed,{name:'jack'});
     * });
     * ```
     *
     * @method module:util/template/jst._$render
     * @param  {String|Node} arg0 - 容器节点
     * @param  {String}      arg1 - 模板序列号
     * @param  {Object}      arg2 - 模板数据
     * @param  {Object}      arg3 - 扩展接口
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$render
     * @see module:util/template/jst._$render
     */
    _p._$render = function(_parent,_sn,_data,_extend){
        _parent = _e._$get(_parent);
        if (!!_parent){
            _parent.innerHTML =
                _p._$get(_sn,_data,_extend);
        }
    };
    /**
     * 注册JST扩展方法
     *
     * 结构举例
     * ```html
     * <textarea name="jst" id="abc">
     *   <div>
     *     <p>${name|a|b}</p>
     *   </div>
     * </textarea>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/template/jst'
     * ],function(_p){
     *     // 注册扩展方法 a和b
     *     _p._$extend({
     *         a:function(){},
     *         b:function(){}
     *     });
     *     // 模板整合数据
     *     _p._$render(
     *         'box','abc',{name:'jack'}
     *     );
     * });
     * ```
     *
     * @method module:util/template/jst._$extend
     * @param  {Object} arg0 - 扩展方法
     * @return {Void}
     */
    _p._$extend = function(_map){
        _u._$merge(_ext,_map);
    };
    // for chainable method
    _x._$merge({_$render:_p._$render});

    if (CMPT){ 
        var _z = NEJ.P('nej.e');
        _z._$addHtmlTemplate     = _p._$add;
        _z._$getHtmlTemplate     = _p._$get;
        _z._$getHtmlTemplateSeed = _p._$seed;
        _z._$renderHtmlTemplate  = _p._$render;
        _z._$registJSTExt        = _p._$extend;
    }

    return _p;
});
