/*
 * ------------------------------------------
 * 分页式列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _i = _('nej.ui'),
        _p = _('nej.ut'),
        _proListModulePG,
        _supListModulePG;
    if (!!_p._$$ListModulePG) return;
    /**
     * 分页式列表模块
     * 
     * 结构举例：
     * [code type="html"]
     *   <div class="mbox">
     *     <div class="lbox" id="list-box">
     *       <!-- list box -->
     *     </div>
     *     <div class="pbox" id="pager-box">
     *       <!-- pager box -->
     *     </div>
     *   </div>
     *   
     *   <!-- list jst template -->
     *   <textarea name="jst" id="jst-list">
     *     {list beg..end as y}
     *       {var x=xlist[y]}
     *       <div class="item">
               <a data-id="${x.id|x.name}" data-action="delete">删除</a>
     *         <p>姓名：${x.name}</p>
     *         <p>联系方式：${x.mobile}</p>
     *       </div>
     *     {/list}
     *   </textarea>
     * [/code]
     * 
     * 脚本举例：
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _j = _('nej.j'),
     *       _t = _('nej.ut'),
     *       _p = _('t.d'),
     *       _proCustomListCache;
     *   // 自定义列表缓存
     *   _p._$$CustomListCache = NEJ.C();
     *     _proCustomListCache = _p._$$CustomListCache
     *                             ._$extend(_t._$$AbstractListCache);
     *   // 实现数据载入逻辑
     *   _proCustomListCache.__doLoadList = function(_options){
     *       var _onload = _options.onload;
     *       // 补全请求数据，也可在模块层通过cache参数传入
     *       var _data = _options.data||{};
     *       NEJ.X(_data,{uid:'ww',sort:'xx',order:1});
     *       switch(_options.key){
     *              case 'user-list':
     *               // TODO load list from server
     *               _j._$request('/api/user/list',{
     *                   type:'json',
     *                   data:_u._$object2query(_data),
     *                   onload:function(_json){
     *                          // _json.code
     *                       // _json.result
     *                          _onload(_json.code==1?_json.result:null);
     *                   },
     *                   onerror:_onload._$bind(null);
     *               });
     *           break;
     *           // TODO other list load
     *       }
     *   };
     * [/code]
     * 
     * 脚本举例：
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _t = _('nej.ut'),
     *       _d = _('t.d');
     *   // 构建列表模块，使用JST模版
     *   _t._$$ListModulePG._$allocate({
     *       limit:5,
     *       parent:'list-box',
     *       item:'jst-list', // 这里也可以传自己实现的item类型
     *       cache:{
     *           key:'user-list',// 此key必须是唯一的，对应了item中的值,也是删除选项的data-id
     *           data:{uid:'ww',sort:'xx',order:1}, // <--- 列表加载时携带数据信息，此数据也可在cache层补全
     *           klass:_d._$$CustomListCache
     *       },
     *       pager:{parent:'pager-box'}
     *   });
     * [/code]
     * 
     * @class   {nej.ut._$$ListModulePG}
     * @extends {nej.ut._$$ListModule}
     * @param   {Object}       可选配置参数
     * @config  {Object} pager 分页器配置信息，{parent:'xxx',klass:_$$Pager}
     * 
     */
    _p._$$ListModulePG = NEJ.C();
      _proListModulePG = _p._$$ListModulePG._$extend(_p._$$ListModule);
      _supListModulePG = _p._$$ListModulePG._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proListModulePG.__reset = function(_options){
        this.__supReset(_options);
        this.__doResetPager(_options.pager||_o);
        this.__doChangePage({index:1});
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proListModulePG.__destroy = function(){
        this.__supDestroy();
        if (!!this.__pager){
            this.__pager._$recycle();
            delete this.__pager;
        }
        delete this.__pkls;
        delete this.__popt;
    };
    /**
     * 重置分页器配置
     * @param  {Object} 分页器配置
     * @return {Void}
     */
    _proListModulePG.__doResetPager = function(_pager){
        this.__pkls = _pager.klass||_i._$$Pager;
        this.__popt = NEJ.X({},_pager);
        delete this.__popt.klass;
    };
    /**
     * 加载数据之前处理逻辑，显示数据加载中信息
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _proListModulePG.__doBeforeListLoad = function(){
        this.__doClearListBox();
        this.__doShowMessage('onbeforelistload','列表加载中...');
        _e._$setStyle(this.__popt.parent,'visibility','hidden');
    };
    /**
     * 数据载入之后处理逻辑
     * @protected
     * @method {__doBeforeListShow}
     * @return {Void}
     */
    _proListModulePG.__doBeforeListShow = function(){
        _supListModulePG.__doBeforeListShow.apply(this,arguments);
        this.__doClearListBox();
    };
    /**
     * 列表绘制之前处理逻辑
     * @protected
     * @method {__doBeforeListRend er}
     * @return {Void}
     */
    _proListModulePG.__doBeforeListRender = function(_list,_offset,_limit){
        var _total = Math.ceil(_list.length/_limit);
        // check pager index and total
        if (!!this.__pager){
            var _index = this.__pager._$getIndex(),
                _total2 = this.__pager._$getTotal();
            if (_index>_total||_total!=_total2){
                this.__pager._$recycle();
                delete this.__pager;
                this.__doChangePage({
                    index:Math.min(_index,_total)
                });
                return !0;
            }
        }
        // check pager instance
        if (!this.__pager){
            var _index = Math.floor(_offset/_limit)+1;
            this.__popt.index = _index;
            this.__popt.total = _total;
            this.__pager = this.__pkls._$allocate(this.__popt);
            this.__pager._$setEvent('onchange',this.__doChangePage._$bind(this));
        }
        // sync pager show
        _e._$setStyle(this.__popt.parent,
            'visibility',_total>1?'visible':'hidden');
    };
    /**
     * 列表为空时处理逻辑
     * @protected
     * @method {__doShowEmpty}
     * @return {Void}
     */
    _proListModulePG.__doShowEmpty = function(){
        this.__doShowMessage('onemptylist','没有列表数据！');
    };
    /**
     * 通过事件回调检测显示信息
     * @protected
     * @method {__doShowMessage}
     * @param  {String} 事件名称
     * @param  {String} 默认显示内容
     * @param  {Object} 扩展信息
     * @return {Void} 
     */
    _proListModulePG.__doRenderMessage = function(_message,_pos){
        if (!_pos){
            this.__lbox.innerHTML = _message;
            return;
        }
        _supListModulePG.__doRenderMessage.apply(this,arguments);
    };
    /**
     * 以jst模版方式绘制列表
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _proListModulePG.__doShowListByJST = function(_html){
        this.__lbox.innerHTML = _html;
    };
    /**
     * 以item模版方式绘制列表
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _proListModulePG.__doShowListByItem = function(_items){
        this.__items = _items;
    };
    /**
     * 添加列表项回调
     * @protected
     * @method {__cbItemAdd}
     * @return {Void}
     */
    _proListModulePG.__cbItemAdd = function(_event){
        this.__doCheckResult(_event,'onafteradd');
        if (!_event.stopped) this._$refresh();
    };
    /**
     * 删除列表项回调
     * @protected
     * @method {__cbItemDelete}
     * @return {Void}
     */
    _proListModulePG.__cbItemDelete = function(_event){
        this.__doCheckResult(_event,'onafterdelete');
        if (!_event.stopped) this._$refresh();
    };
    /**
     * 更新列表项回调
     * @protected
     * @method {__cbItemUpdate}
     * @return {Void}
     */
    _proListModulePG.__cbItemUpdate = function(_event){
        this.__doCheckResult(_event,'onafterupdate');
        if (!_event.stopped) this._$refresh();
    };
    /**
     * 刷新列表
     * @method {_$refresh}
     * @param  {Number} 刷新到的页码
     * @return {Void}
     */
    _proListModulePG._$refresh = function(){
        this.__doClearListBox();
        var _index = !this.__pager?1
                     :this.__pager._$getIndex();
        this.__doChangePage({index:_index});
    };
};
NEJ.define('{lib}util/list/module.pager.js',
      ['{lib}util/list/module.js'
      ,'{lib}ui/pager/pager.js'],f);
