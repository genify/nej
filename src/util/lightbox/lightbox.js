/*
 * ------------------------------------------
 * 图片幻灯片控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/lightbox/lightbox */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'util/event',
    'ui/lightbox/lightbox'
],function(NEJ,_k,_u,_v,_e,_t,_i,_p,_o,_f,_r){
    var _pro;
    /**
     * 图片幻灯片控件
     * 
     * 结构举例
     * ```html
     * <div id="abc">
     *   <p><img src="./a.jpg" data-src="./a.jpg" alt="汽车1"/></p>
     *   <p><img src="./b.jpg" data-src="./b.jpg" alt="汽车2"/></p>
     *   <p><img src="./c.jpg" data-src="./c.jpg" alt="汽车3"/></p>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     *  NEJ.define([
     *      'util/lightbox/lightbox'
     *  ],function(_t){
     *      // 单张图片显示
     *      _t._$$LightBox._$allocate({
     *          parent:'abc'
     *      });
     *  });
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="def">
     *   <p><img src="./a.jpg" data-group="a" data-src="./a.jpg" alt="汽车1"/></p>
     *   <p><img src="./b.jpg" data-group="a" data-src="./b.jpg" alt="汽车2"/></p>
     *   <p><img src="./c.jpg" data-group="a" data-src="./c.jpg" alt="汽车3"/></p>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     *  NEJ.define([
     *      'util/lightbox/lightbox'
     *  ],function(_t){
     *      // 分组图片显示
     *      _t._$$LightBox._$allocate({
     *          parent:'def'
     *      });
     *  });
     * ```
     * 
     * @class    module:util/lightbox/lightbox._$$LightBox
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}       config   - 可选配置参数
     * @property {String|Node}  parent   - 用于搜索图片的容器节点，默认为document.body
     * @property {String}       clazz    - 幻灯片样式名称
     * @property {String}       mask     - 遮罩样式名称
     * @property {String}       loading  - 图片加载中样式名称，默认为js-loading
     * @property {String}       disabled - 按钮禁用样式名称，默认为js-disabled
     */
    _p._$$LightBox = _k._$klass();
    _pro = _p._$$LightBox._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected 
     * @method module:util/lightbox/lightbox._$$LightBox#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__lopt = {
            parent:document.body
        };
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/lightbox/lightbox._$$LightBox#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        // default lightbox
        this._$setEvent(
            'onlightbox',
            this.__onLightBoxShow._$bind(this)
        );
        this.__super(_options);
        // init config
        _u._$merge(
            this.__lopt,
            _u._$fetch({
                mask:null,clazz:null,
                loading:null,disabled:null
            },_options)
        );
        // init event
        this.__parent = _e._$get(_options.parent);
        this.__doInitDomEvent([[
            this.__parent,'click',
            this.__onCheckImage._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/lightbox/lightbox._$$LightBox#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        delete this.__parent;
        this.__super();
    };
    /**
     * 图片点击事件
     * 
     * @protected
     * @method module:util/lightbox/lightbox._$$LightBox#__onCheckImage
     * @param  {Event} arg0 - 事件信息
     * @return {Void}
     */
    _pro.__onCheckImage = (function(){
        var _doDumpImage = function(_img){
            return {
                group:_e._$dataset(_img,'group'),
                src:_e._$dataset(_img,'src')||_img.src,
                title:_img.alt||_e._$dataset(_img,'title')
            };
        };
        return function(_event){
            var _element = _v._$getElement(_event);
            if (_element.tagName!='IMG') return;
            _v._$stop(_event);
            var _iobj = _doDumpImage(_element);
            // for single image
            if (!_iobj.group){
                this._$dispatchEvent(
                    'onlightbox',{
                        index:0,
                        list:[_iobj]
                    }
                );
                return;
            }
            // for group image
            // dump image list
            var _list = [],
                _index = 0;
            _u._$forEach(
                this.__parent.getElementsByTagName('img'),
                function(_img){
                    var _data = _doDumpImage(_img);
                    if (_data.group===_iobj.group){
                        _list.push(_data);
                        if (_element==_img){
                            _index = _list.length-1;
                        }
                    }
                }
            );
            // trigger lightbox show
            this._$dispatchEvent(
                'onlightbox',{
                    index:_index,
                    list:_list
                }
            );
        };
    })();
    /**
     * 默认显示图片幻灯片逻辑，子类可重写
     * 
     * @protected
     * @method module:util/lightbox/lightbox._$$LightBox#__onLightBoxShow
     * @param  {Object} arg0 - 图片信息
     * @return {Void}
     */
    _pro.__onLightBoxShow = function(_event){
        this.__lopt.list = _event.list;
        this.__lopt.index = _event.index;
        _i._$$LightBox._$allocate(this.__lopt);
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
