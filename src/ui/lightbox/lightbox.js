/*
 * ------------------------------------------
 * 图片幻灯片控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/lightbox/lightbox */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/element',
    'base/event',
    'util/template/tpl',
    'ui/base',
    'text!./lightbox.css',
    'text!./lightbox.html'
],function(NEJ,_k,_g,_e,_v,_t,_i,_css,_html,_p,_o,_f,_r){
    var _pro;
    /**
     * 图片幻灯片控件
     * 
     * ```javascript
     *  NEJ.define([
     *      'ui/lightbox/lightbox'
     *  ],function(_i){
     *      _i._$$LightBox._$allocate({
     *          parent:document.body,
     *          list:[
     *              {title:'汽车1',src:'./1.jpg'},
     *              {title:'汽车2',src:'./2.jpg'},
     *              {title:'汽车3',src:'./3.jpg'},
     *              {title:'汽车4',src:'./4.jpg'},
     *              {title:'汽车5',src:'./5.jpg'},
     *              {title:'汽车6',src:'./6.jpg'},
     *              {title:'汽车7',src:'./7.jpg'},
     *              {title:'汽车8',src:'./8.jpg'}
     *          ]
     *      });
     *  });
     * ```
     *
     * @class    module:ui/lightbox/lightbox._$$LightBox
     * @extends  module:ui/base._$$Abstract
     * 
     * @param    {Object} config   - 配置参数
     * @property {String} mask     - 遮罩样式名称
     * @property {String} loading  - 图片加载中样式名称，默认为js-loading
     * @property {String} disabled - 按钮禁用样式名称，默认为js-disabled
     * @property {Array}  list     - 图片数据列表，[{src:'xxx',title:'xxx'},...]
     * @property {Number} index    - 当前显示图片索引
     */
    _p._$$LightBox = _k._$klass();
    _pro = _p._$$LightBox._$extend(_i._$$Abstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__ilist = _options.list||_r;
        this.__discs = _options.disabled||'js-disabled';
        this.__loading = _options.loading||'js-loading';
        _e._$addClassName(this.__mask,_options.mask);
        // init event
        this.__doInitDomEvent([[
            this.__body,'click',
            this.__onAction._$bind(this)
        ],[
            document,'click',
            this.__doClose._$bind(this)
        ],[
            this.__test,'load',
            this.__onImageLoad._$bind(this,!0)
        ],[
            this.__test,'error',
            this.__onImageLoad._$bind(this,!1)
        ]]);
        this.__body.insertAdjacentElement(
            'beforeBegin',this.__mask
        );
        this.__doUpdateIndex(_options.index);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        delete this.__ilist;
        _e._$removeByEC(this.__mask);
        this.__mask.className = this.__seed_css+'-mask';
        var _blank = _g._$BLANK_IMAGE;
        this.__image.src = _blank;
        this.__test.src = _blank;
        this.__super();
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = (function(){
        var _seed_css = _e._$pushCSSText(_css),
            _seed_html= _t._$addNodeTemplate(_html);
        return function(){
            this.__seed_css  = _seed_css;
            this.__seed_html = _seed_html;
        };
    })();
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__test = _e._$create('img');
        this.__mask = _e._$create(
            'div',this.__seed_css+'-mask'
        );
        _e._$setStyle(this.__mask,'opacity',0.5);
        // 0 - previous button
        // 1 - next button
        // 2 - image show
        // 3 - image title
        var _list = _e._$getByClassName(
            this.__body,'j-zflag'
        );
        this.__nprev = _list[0];
        this.__nnext = _list[1];
        this.__image = _list[2];
        this.__title = _list[3];
    };
    /**
     * 关闭幻灯片
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__doClose
     * @return {Void}
     */
    _pro.__doClose = function(){
        this._$recycle();
    };
    /**
     * 更新索引值
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__doUpdateIndex
     * @param  {Number} arg0 - 索引值
     * @return {Void}
     */
    _pro.__doUpdateIndex = function(_index){
        this.__index = parseInt(_index)||0;
        this.__doSyncBtnState();
        this.__doSyncImageData(
            this.__ilist[this.__index]
        );
    };
    /**
     * 同步按钮状态
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__doSyncBtnState
     * @return {Void}
     */
    _pro.__doSyncBtnState = function(){
        // previous button
        this.__index<=0 
        ? _e._$addClassName(this.__nprev,this.__discs)
        : _e._$delClassName(this.__nprev,this.__discs);
        // next button
        this.__index>=this.__ilist.length-1
        ? _e._$addClassName(this.__nnext,this.__discs)
        : _e._$delClassName(this.__nnext,this.__discs);
    };
    /**
     * 同步图片数据
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__doSyncImageData
     * @param  {Object} arg0 - 图片数据，如{src:'xxxxx',title:'xxxxxxxx'}
     * @return {Void}
     */
    _pro.__doSyncImageData = function(_data){
        _data = _data||_o;
        this.__title.innerText = _data.title;
        //_e._$setStyle(this.__image,'opacity',0);
        _e._$addClassName(this.__body,this.__loading);
        this.__test.src = _data.src||_g._$BLANK_IMAGE;
    };
    /**
     * 图片载入回调
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__onImageLoad
     * @return {Void}
     */
    _pro.__onImageLoad = function(_isok){
        _e._$delClassName(this.__body,this.__loading);
        // load blank
        if (this.__test.src.indexOf(_g._$BLANK_IMAGE)>=0){
            return;
        }
        // dump image info
        var _url = this.__test.src,
            _sbox = {
                width:Math.max(100,this.__test.naturalWidth||this.__test.width),
                height:Math.max(100,this.__test.naturalHeight||this.__test.height)
            },
            _pbox = _e._$getPageBox();
            _mbox = _e._$align({
                width:_pbox.clientWidth,
                height:_pbox.clientHeight
            },_sbox);
        this.__test.src = _g._$BLANK_IMAGE;
        // update button position
        _e._$setStyle(
            this.__nprev,'top',
            (_sbox.height-this.__nprev.offsetHeight)/2+'px'
        );
        _e._$setStyle(
            this.__nnext,'top',
            (_sbox.height-this.__nnext.offsetHeight)/2+'px'
        );
        // update image show
        _e._$style(
            this.__body,{
                top:_mbox.top+'px',
                left:_mbox.left+'px',
                width:_sbox.width+'px',
                height:_sbox.height+'px'
            }
        );
        //_e._$setStyle(this.__image,'opacity',1);
        this.__image.src = _url;
    };
    /**
     * 操作行为
     * 
     * @protected
     * @method module:ui/lightbox/lightbox._$$LightBox#__onAction
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onAction = function(_event){
        _v._$stop(_event);
        // check action
        var _action = _e._$dataset(
            _v._$getElement(
                _event,'d:action'
            ),'action'
        );
        if (!_action) return;
        // do action
        switch(_action){
            case 'close':
                this.__doClose();
            break;
            case 'prev':
                if (!_e._$hasClassName(this.__nprev,this.__discs)){
                    this.__doUpdateIndex(this.__index-1);
                }
            break;
            case 'next':
                if (!_e._$hasClassName(this.__nnext,this.__discs)){
                    this.__doUpdateIndex(this.__index+1);
                }
            break;
        }
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});