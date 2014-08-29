/*
 * ------------------------------------------
 * 文件下载接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/file/save */
NEJ.define([
    'base/global',
    'base/element',
    'base/event',
    'base/util',
    'base/chain'
],function(NEJ,_e,_v,_u,_x,_p,_o,_f,_r){
    var _cache = {};
    /*
     * 执行另存为
     * @param  {Event} 节点标识
     * @return {Void}
     */
    var _doSaveAs = (function(){
        var _getFileInfo = function(_id){
            var _conf = _cache[_id];
            if (!_conf) return;
            var _url = _conf.url,
                _name = _conf.name;
            if (_u._$isFunction(_url)){
                _url = _url();
            }
            if (!_name){
                var _arr = _url.split('/');
                _name = _arr.pop();
            }
            return {
                url:_url,
                name:_name
            };
        };
        return function(_event){
            var _el = _v._$getElement(_event),
                _id = _e._$id(_el),
                _info = _getFileInfo(_id);
            if (!!_info){
                _el.href = _info.url;
                if ('download' in _el){
                    _el.download = _info.name;
                }else{
                    _el.target = '_blank';
                }
            }
        };
    })();
    /**
     * 绑定文件下载行为
     *
     * 结构举例
     * ```html
     * <a id="button_id">下载文件</a>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/file/save'
     * ],function(_e){
     *     // 绑定文件下载行为
     *     _e._$bind('button_id',{
     *         name:'test.txt',
     *         url:function(){
     *             // 动态组装下载地址
     *             return obj.url+'?'+new Date;
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/file/save._$bind
     * @see      module:util/file/save._$unbind
     * @param    {String|Node}     arg0 - 下载点击链接节点，必须是A节点
     * @param    {Object}          arg1 - 可选配置参数
     * @property {String|Function} url  - 下载文件地址或者地址生成函数
     * @property {String}          name - 保存的文件名称，没有指定name则取url中文件名
     * @return   {Void}
     */
    /**
     * @method CHAINABLE._$bind
     * @see module:util/file/save._$bind
     */
    _p._$bind = function(_button,_options){
        var _id = _e._$id(_button);
        if (!!_cache[_id]) return;
        var _node = _e._$get(_button);
        if (_node.tagName!='A') return;
        _cache[_id] = _u._$merge({},_options);
        _v._$addEvent(_id,'click',_doSaveAs);
    };
    /**
     * 解绑文件下载行为
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/file/save'
     * ],function(_e){
     *     // 解绑文件下载行为
     *     _e._$unbind('button_id');
     * });
     * ```
     *
     * @method module:util/file/save._$unbind
     * @see    module:util/file/save._$bind
     * @param  {String|Node} arg0 - 下载点击按钮节点
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$unbind
     * @see module:util/file/save._$unbind
     */
    _p._$unbind = function(_button){
        var _id = _e._$id(_button);
        if (!_cache[_id]) return;
        delete _cache[_id];
        _v._$delEvent(_id,'click',_doSaveAs);
    };
    // for chainable method
    _x._$merge(_p);

    if (CMPT){
        var _x = NEJ.P('nej.e');
        _x._$bindSaveAsAction = _p._$bind;
        _x._$unbindSaveAsAction = _p._$unbind;
    }

    return _p;
});