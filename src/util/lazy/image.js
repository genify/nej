/*
 * ------------------------------------------
 * 延时加载图片控件实现文件 
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/lazy/image */
NEJ.define([
    'base/klass',
    'base/constant',
    'base/element',
    './loading.js'
],function(_k,_g,_e,_t,_p,_o,_f,_r,_pro){
    /**
     * 延时加载图片
     * 
     * @class   module:util/lazy/image._$$LazyImage
     * @extends module:util/lazy/loading._$$LazyLoading
     * 
     * @param    {Object} config - 配置信息
     * @property {String} holder - 图片占位地址，默认为空白图片
     * 
     */
    _p._$$LazyImage = _k._$klass();
    _pro = _p._$$LazyImage._$extend(_t._$$LazyLoading);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/lazy/image._$$LazyImage#__reset
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__holder = _options.holder||_g._$BLANK_IMAGE;
    };
    /**
     * 取待验证资源列表
     * 
     * @protected
     * @method module:util/lazy/image._$$LazyImage#__getResourceList
     * @param  {Node} arg0 - 滚动条所在容器节点
     * @return {Void}
     */
    _pro.__getResourceList = function(_parent){
        return _parent.getElementsByTagName('img');
    };
    /**
     * 验证资源是否需要做处理
     * 
     * @protected
     * @method module:util/lazy/image._$$LazyImage#__getResourceList
     * @param  {Node}   arg0 - 资源节点
     * @param  {Object} arg1 - 滚动容器节点
     * @return {Number}        操作标识，-1 - 移除，0 - 不做处理， 1 - 追加到页面
     */
    _pro.__doCheckResource = function(_target,_parent){
        var _ch = _parent.clientHeight,
            _top = _e._$offset(_target,_parent).y-_parent.scrollTop,
            _bottom = _top+_target.offsetHeight,
            _config = this.__getSettingInfo(_target),
            // not src
            // src is blank image
            // src not equal to data-src
            _holded = !_target.src||
                       _target.src.indexOf(this.__holder)>=0||
                       _target.src.indexOf(_config.src)<0;
        // check resource append
        if (_holded&&0<=_bottom&&_top<=_ch){
            return 1;
        }
        // check resource remove
        if (!_holded&&(_bottom<0||_top>_ch)){
            return -1;
        }
        // do nothing
        return 0;
    };
    /**
     * 移除资源
     * 
     * @protected
     * @method module:util/lazy/image._$$LazyImage#__doRemoveResource
     * @param  {Node} arg0 - 资源节点
     * @return {Void}
     */
    _pro.__doRemoveResource = function(_node){
        _node.src = this.__holder;
    };
    /**
     * 添加资源
     * 
     * @protected
     * @method module:util/lazy/image._$$LazyImage#__doAppendResource
     * @param  {Node}   arg0 - 资源节点
     * @param  {Object} arg1 - 配置信息
     * @return {Void}
     */
    _pro.__doAppendResource = function(_node,_conf){
        _node.src = _conf.src||this.__holder;
    };
});
