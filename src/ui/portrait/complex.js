/*
 * ------------------------------------------
 * 复杂表情控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/portrait/complex */
NEJ.define([
    'base/global',
    'base/klass',
    'base/config',
    'base/element',
    'base/util',
    'ui/base',
    'ui/portrait/portrait',
    'util/template/tpl',
    'util/tab/tab',
    'util/page/page.simple',
    'util/data/portrait/portrait',
    'text!./complex.css',
    'text!./complex.html'
],function(NEJ,_k,_c,_e,_u,_i,_i0,_t0,_t2,_t3,_t4,_css,_html,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css  = _e._$pushCSSText(_css,{portrait:_c._$get('portrait')}),
        _seed_ui   = _t0._$parseUITemplate(_html),
        _seed_html = _seed_ui['_seed_html'],
        _seed_ilist= _seed_ui['_seed_ilist'];
    /**
     * 复杂表情控件
     *
     * @class   module:ui/portrait/complex._$$ComplexPortrait
     * @extends module:util/event._$$EventTarget
     * @uses    module:ui/portrait/portait._$$Portrait
     * @param   {Object} arg0 - 可选配置参数
     */
    /**
     * 表情选中事件
     *
     * @event     module:ui/portrait/complex._$$ComplexPortrait#onselect
     * @param     {Object} arg0 - 表情数据对象
     * @property  {String} text - 表情描述
     * @property  {String} url  - 表情文件地址
     */
    _p._$$ComplexPortrait = _k._$klass();
    _pro = _p._$$ComplexPortrait._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__popt = {
            clazz:'zptrt',
            cache:{
                data:{},
                klass:_t4._$$CachePortrait
            }
        };
        this.__topt = {
            offset:0,
            limit:1000,
            data:{type:'type'},
            key:'portrait-type'
        };
        this.__bopt = {
            onchange:this.__onTypeChange._$bind(this)
        };
        this.__copt = {
            onlistload:this.__cbTypeListLoad._$bind(this)
        };
        this.__gopt = {
            limit:8,
            onchange:this.__onPageChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__popt.onselect = _options.onselect;
        delete _options.onselect;
        this.__super(_options);
        this.__cache = _t4._$$CachePortrait
                         ._$allocate(this.__copt);
        this.__cache._$getList(this.__topt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__doClearComponent();
    };
    /**
     * 初始化外观
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化控件节点
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // 0 - previous type
        // 1 - type list
        // 2 - next type
        // 3 - portrait list
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__tbox = _list[1];
        this.__gopt.pbtn = _list[0];
        this.__gopt.nbtn = _list[2];
        this.__popt.parent = _list[3];
    };
    /**
     * 分类列表载入回调
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__cbTypeListLoad
     * @return {Void}
     */
    _pro.__cbTypeListLoad = (function(){
        var _inited = !1,
            _limit = {
                30:60,
                60:15
            };
        var _doInit = function(_list){
            if (_inited)
                return;
            _inited = !0;
            var _arr = [];
            _u._$forEach(
                _list,function(_item){
                    var _id = _item.id,
                        _prefix = _c._$get('portrait')+_id+'/'+_id+'-',
                        _total = Math.ceil(_item.total/_limit[_item.size]);
                    for(var i=0;i<_total;i++){
                        _arr.push('.'+_seed_css+' .js-'+_id+'-'+(i+1)+' .zitm{background-image:url('+_prefix+i+'.png);}');
                    }
                }
            );
            _e._$addStyle(_arr.join(''));
        };
        return function(_options){
            var _list = this.__cache.
                _$getListInCache(_options.key);
            _doInit(_list);
            _e._$renderHtmlTemplate(
                this.__tbox,_seed_tlist,{
                    xlist:_list
                }
            );
            this.__gopt.total = Math.ceil(_list.length/this.__gopt.limit);
            this.__pager = _t3._$$PageSimple._$allocate(this.__gopt);
            this.__bopt.list = _e._$getChildren(this.__tbox);
            this.__taber = _t2._$$Tab._$allocate(this.__bopt);
        };
    })();
    /**
     * 分类变化事件
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__onTypeChange
     * @param  {Object} arg0 - 分类信息
     * @return {Void}
     */
    _pro.__onTypeChange = function(_event){
        if (!!this.__portrait){
            this.__portrait._$recycle();
        }
        var _cache = this.__popt.cache,
            _item = this.__cache._$getItemInCache(_event.data);
        this.__popt.size = _item.size;
        this.__popt.page = 'js-'+_item.id+'-';
        _cache.lkey = 'portrait-'+_item.id;
        _cache.data.type = _item.id;
        this.__portrait = _i0._$$Portrait._$allocate(this.__popt);
    };
    /**
     * 分类页码变化事件
     *
     * @protected
     * @method module:ui/portrait/complex._$$ComplexPortrait#__onPageChange
     * @param  {Object} arg0 - 页码信息
     * @return {Void}
     */
    _pro.__onPageChange = function(_event){
        var _offset = 0;
        if (!!this.__taber){
            var _list = this.__taber._$getList(),
                _index = (_event.index-1)*this.__gopt.limit,
                _offset = Math.max(0,_list[_index].offsetTop-2);
            this.__taber._$go(_index);
        }
        _e._$setStyle(this.__tbox,'top',0-_offset+'px');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});