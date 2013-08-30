/*
 * ------------------------------------------
 * 表情控件行为逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _g = _('nej.g'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _i = _('nej.ui'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$Portrait) return;
    /**
     * 表情控件行为逻辑封装
     * 
     * @class   {nej.ut._$$Portrait}
     * @extends {nej.ut._$$Event}
     * @uses    {nej.ut._$$ListModulePG}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Array}         list   表情数据列表，每项数据格式：{id:'xx',text:'title',url:'portrait url'}
     * @config  {Number}        limit  每页显示表情数量，默认为60
     * @config  {String|Object} item   表情列表项配置，或JST模版名称，生成的列表项结构中必须设置属性 data-id="portrait id"
     * @config  {String|Node}   lbox   表情列表容器
     * @config  {Object}        pager  分页器配置
     * @config  {String}        clazz  预览节点控制样式，默认为js-prev
     * @config  {String}        prefix 页面标识前缀，默认js-page-
     * 
     * [hr]
     * 表情选中事件
     * @event   {onselect}
     * @param   {Object} 表情数据对象，同输入的list中的数据项
     * 
     */
    _p._$$Portrait = NEJ.C();
    _pro = _p._$$Portrait._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _pro.__init = function(){
        // list module options
        this.__mopt = {
            cache:{id:'nej-portrait',lkey:'portrait'},
            onpagechange:this.__onChangePage._$bind(this)
        };
        // build preview
        this.__nprv = new Image();
        var _node = _e._$create('div');
        _node.appendChild(this.__nprv);
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__mopt.item = _options.item;
        this.__mopt.limit = _options.limit||60;
        this.__mopt.parent = _options.lbox;
        this.__mopt.cache.list = _options.list;
        this.__mopt.pager = _options.pager||{};
        if (!this.__mopt.pager.klass){
            this.__mopt.pager.klass = _i._$$SimplePager;
        }
        this.__prefix = _options.prefix||'js-page-';
        this.__pclass = _options.clazz||'js-prev';
        _e._$addClassName(
            this.__nprv.parentNode,
            this.__pclass
        );
        this.__doInitDomEvent([[
            this.__mopt.parent,'mouseover',
            this.__onPreviewPortrait._$bind(this,!0)
        ],[
            this.__mopt.parent,'mouseout',
            this.__onPreviewPortrait._$bind(this,!1)
        ],[
            this.__mopt.parent,'click',
            this.__onSelectPortrait._$bind(this)
        ]]);
        this.__mdl = _p._$$ListModulePG._$allocate(this.__mopt);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        if (!!this.__mdl){
            this.__mdl._$recycle();
            delete this.__mdl;
        }
        this.__onPreviewPortrait(!1);
        _e._$delClassName(
            this.__nprv.parentNode,
            this.__pclass
        );
        delete this.__pclass;
    };
    /**
     * 通过事件取表情数据
     * @param  {Event}  事件对象
     * @return {Object} 表情数据
     */
    _pro.__getPortraitByEvent = function(_event){
        var _node = _v._$getElement(_event,'d:id');
        if (!_node) return;
        var _id = _e._$dataset(_node,'id'),
            _data = this.__mdl._$cache()._$getItemInCache(_id);
        if (!_data) return;
        return {
            node:_node,data:_data,
            align:_e._$dataset(_node,'align')
        };
    };
    /**
     * 解析预览图片对齐方式
     * @param  {String} 对齐方式，'left top'
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
     * @param  {Boolean} 是否预览
     * @param  {Event}  事件对象
     * @return {Void}
     */
    _pro.__onPreviewPortrait = function(_in,_event){
        var _parent = this.__nprv.parentNode;
        if (!_in){
            this.__nprv.src = _g._$BLANK_IMAGE;
            _e._$removeByEC(_parent);
            return;
        }
        // do preview
        var _data = this.__getPortraitByEvent(_event);
        if (!_data) return;
        _e._$style(_parent,this.__doParseAlign(_data.align));
        this.__mopt.parent.appendChild(_parent);
        var _url = _data.data.url;
        this.__nprv.src = _url;
        _e._$setStyle(_parent,'backgroundImage','url('+_url+')');
    };
    /**
     * 选中表情触发事件
     * @param  {Event} 事件对象
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
     * @param  {Object} 页码信息
     * @return {Void}
     */
    _pro.__onChangePage = function(_event){
        _e._$replaceClassName(
            this.__mopt.parent,
            this.__prefix+(_event.last||''),
            this.__prefix+(_event.index||'')
        );
    };
};
NEJ.define('{lib}util/portrait/portrait.js',
          ['{lib}base/constant.js'
          ,'{lib}util/list/module.pager.js'
          ,'{lib}ui/pager/pager.simple.js'],f);