/*
 * ------------------------------------------
 * 表情控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/portrait/portrait */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/element',
    'base/event',
    'base/util',
    'ui/base',
    'ui/pager/pager.simple',
    'util/list/module.pager',
    'util/template/tpl',
    'text!./portrait.css',
    'text!./portrait.html'
],function(NEJ,_k,_g,_e,_v,_u,_i,_i0,_t0,_t1,_css,_html,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css = 'auto-'+_u._$uniqueID();
    /**
     * 表情控件
     *
     * @class     module:ui/portrait/portrait._$$Portrait
     * @extends   module:ui/base._$$Abstract
     * @param     {Object} arg0  - 可选配置参数
     * @property  {Number} size  - 表情大小，30或60，默认为30， 目前支持30*30和60*60
     * @property  {String} page  - 分页标识前缀，默认为js-page-
     * @property  {Object} cache - 数据缓存配置
     */
    /**
     * 表情选中事件
     *
     * @event     module:ui/portrait/portrait._$$Portrait#onselect
     * @param     {Object} arg0 - 表情数据对象
     * @property  {String} text - 表情描述
     * @property  {String} url  - 表情文件地址
     *
     */
    _p._$$Portrait = _k._$klass();
    _pro = _p._$$Portrait._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     * @return {Void}
     */
    _pro.__init = function(){
        this.__mopt = {
            item:{},
            pager:{
                fixed:!0,
                clazz:'zpager',
                klass:_i0._$$SimplePager
            },
            onpagechange:this.__onChangePage._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _iconf = {
            60:{row:3,col:5,size:60},
            30:{row:6,col:10,size:30}
        };
        return function(_options){
            this.__super(_options);
            this.__mopt.cache = _options.cache;
            var _conf = _iconf[_options.size]||_iconf['30'];
            this.__prefix = _options.page||'js-page-';
            this.__mopt.limit = _conf.row*_conf.col;
            NEJ.X(this.__mopt.item,_conf);
            _e._$addClassName(
                this.__nprv.parentNode,
                'js-prev-'+_conf.size
            );
            this.__mdl = _t0._$$ListModulePG._$allocate(this.__mopt);
        };
    })();
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__mdl){
            this.__mdl._$recycle();
            delete this.__mdl;
        }
        _e._$delClassName(
            this.__mopt.parent,
            this.__pgcls
        );
        _e._$delClassName(
            this.__nprv.parentNode,
            'js-prev-'+this.__mopt.item.size
        );
        delete this.__pgcls;
        delete this.__mopt.cache;
    };
    /**
     * 初始化外观
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = (function(){
        var _seed = _t1._$parseUITemplate(_html);
        return function(){
            this.__seed_css = _seed_css;
            this.__seed_html = _seed.mid;
            this.__mopt.item.klass = _seed.lid;
        };
    })();
    /**
     * 初始化控件节点
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // build preview
        this.__nprv = new Image();
        var _node = _e._$create('div','js-prev');
        _node.appendChild(this.__nprv);
        // 0 - item list box
        // 1 - pager box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__mopt.parent = _list[0];
        this.__mopt.pager.parent = _list[1];
        _v._$addEvent(
            this.__mopt.parent,'click',
            this.__onSelectPortrait._$bind(this)
        );
        _v._$addEvent(
            this.__mopt.parent,'mouseover',
            this.__onPreviewPortrait._$bind(this,!0)
        );
        _v._$addEvent(
            this.__mopt.parent,'mouseout',
            this.__onPreviewPortrait._$bind(this,!1)
        );
    };
    /**
     * 通过事件取表情数据
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__getPortraitByEvent
     * @param  {Event} arg0 -  事件对象
     * @return {Object} 表情数据
     */
    _pro.__getPortraitByEvent = function(_event){
        var _node = _v._$getElement(_event,'d:id');
        if (!_node) return;
        var _id = _e._$dataset(_node,'id'),
            _data = this.__mdl._$cache()
                        ._$getItemInCache(_id);
        if (!_data) return;
        return {
            node:_node,data:_data,
            align:_e._$dataset(_node,'align')
        };
    };
    /**
     * 解析预览图片对齐方式
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__doParseAlign
     * @param  {String} arg0 - 对齐方式，'left top'
     * @return {Object} 对齐信息
     */
    _pro.__doParseAlign = function(_align){
        var _result = {
            top:'auto',
            left:'auto',
            right:'auto',
            bottom:'auto'
        };
        var _arr = (_align||'').split(/\s+/);
        _result[_arr[0]||'left'] = 0;
        _result[_arr[1]||'top'] = 0;
        return _result;
    };
    /**
     * 预览表情事件
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__onPreviewPortrait
     * @param  {Boolean} arg0 - 是否预览
     * @param  {Event} arg0 -  事件对象
     * @return {Void}
     */
    _pro.__onPreviewPortrait = function(_in,_event){
        var _parent = this.__nprv.parentNode;
        if (!_in){
            if (this.__mopt.item.size==30){
                _e._$setStyle(_parent,'backgroundImage','none');
            }else{
                this.__nprv.src = _g._$BLANK_IMAGE;
            }
            _e._$removeByEC(_parent);
            return;
        }
        // do preview
        var _data = this.__getPortraitByEvent(_event);
        if (!_data) return;
        _e._$style(_parent,this.__doParseAlign(_data.align));
        this.__mopt.parent.appendChild(_parent);
        var _url = _data.data.url;
        if (this.__mopt.item.size==30){
            _e._$setStyle(_parent,'backgroundImage','url('+_url+')');
        }else{
            this.__nprv.src = _url;
        }
    };
    /**
     * 选中表情触发事件
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__onSelectPortrait
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onSelectPortrait = function(_event){
        var _data = this.__getPortraitByEvent(_event);
        if (!!_data){
            _v._$stop(_event);
            this._$dispatchEvent('onselect',_data.data);
        }
    };
    /**
     * 页码变化触发事件
     *
     * @protected
     * @method module:ui/portrait/portrait._$$Portrait#__onChangePage
     * @param  {Object} arg0 - 页码信息
     * @return {Void}
     */
    _pro.__onChangePage = function(_event){
        this.__pgcls = this.__prefix+(_event.index||'');
        var _last = this.__prefix+(_event.last||'');
        _e._$replaceClassName(
            this.__mopt.parent,
            _last,this.__pgcls
        );
    };
    // init style and html
    var _arr = [];
    for(var i=0;i<6;i++){
        for(var j=0;j<10;j++){
            _arr.push('.'+_seed_css+' .zlst .z30-'+(i*10+j)+'{background-position:-'+(j*30)+'px -'+(i*30)+'px;}');
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<5;j++){
            _arr.push('.'+_seed_css+' .zlst .z60-'+(i*5+j)+'{background-position:-'+(j*60)+'px -'+(i*60)+'px;}');
        }
    }
    // ui style
    _e._$pushCSSText(_css,{
        uispace:_seed_css,
        arrbg:_arr.join(' ')
    });

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});