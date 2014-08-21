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
    'util/template/jst',
    'util/tab/tab',
    'util/page/page.simple',
    'util/data/portrait/portrait'
],function(NEJ,_k,_c,_e,_u,_i,_i0,_t0,_t1,_t2,_t3,_t4,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css,
        _seed_html,
        _seed_ilist;
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
    // init style and html
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{width:410px;border:1px;font-size:12px;text-align:center;}\
        .#<uispace>,.#<uispace> .zbrd{border-style:solid;border-color:#aaa;}\
        .#<uispace> a{text-decoration:none;}\
        .#<uispace> .zbgp{background:url('+_c._$get('portrait')+'btn.png) no-repeat;}\
        .#<uispace> .zsdb{float:right;width:80px;text-align:left;}\
        .#<uispace> .zsdb .zpgr{text-align:center;}\
        .#<uispace> .zsdb .zpgr span{display:block;height:24px;margin:0 10px;border-color:#eee;cursor:pointer;}\
        .#<uispace> .zsdb .zpup span{border-width:0 0 1px;background-position:center 2px;}\
        .#<uispace> .zsdb .zpdn span{border-width:1px 0 0;background-position:center -18px;}\
        .#<uispace> .zsdb .zwin{position:relative;height:180px;overflow:hidden;}\
        .#<uispace> .zsdb .zlst{position:absolute;top:0;left:0;width:100%;}\
        .#<uispace> .zsdb .zlst .zitm{height:22px;line-height:22px;padding-left:5px;border-width:0;}\
        .#<uispace> .zsdb .zlst .zitm.js-selected{border-width:1px 0;margin-left:0;}\
        .#<uispace> .zsdb .zbtn{display:block;margin-left:1px;color:#777;}\
        .#<uispace> .zsdb .zbtn:hover,\
        .#<uispace> .zsdb .zlst .zitm.js-selected{background-color:#e5e5e1;color:#000;text-decoration:none;}\
        .#<uispace> .zsdb .js-disabled{cursor:default;}\
        .#<uispace> .zsdb .js-disabled span{opacity:0.6;filter:alpha(opacity=60);cursor:default;}\
        .#<uispace> .zsdb .js-disabled:hover{background-color:transparent;}\
        .#<uispace> .zcnt{margin-right:79px;padding:5px 5px 0;border-width:0 1px 0 0;background:#e5e5e1;}\
        .#<uispace> .zcnt .zptrt{border:none;}\
    ');
    _seed_html = _t0._$addNodeTemplate('\
        <div class="'+_seed_css+' zbrd">\
          <div class="zsdb">\
            <a class="zbtn zpgr zpup j-flag" href="#" hidefocus="true" title="上一页"><span class="zbrd zbgp">&nbsp;</span></a>\
            <div class="zwin"><div class="zlst j-flag"></div></div>\
            <a class="zbtn zpgr zpdn j-flag" href="#" hidefocus="true" title="下一页"><span class="zbrd zbgp">&nbsp;</span></a>\
          </div>\
          <div class="zcnt zbrd j-flag"></div>\
        </div>\
    ');
    _seed_tlist = _t1._$addHtmlTemplate('\
        {list xlist as x}\
        <a href="#" hidefoucus="true" class="zbtn zitm zbrd" data-value="${x.id}">${x.name}</a>\
        {/list}\
    ');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});