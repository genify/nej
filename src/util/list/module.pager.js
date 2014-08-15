/*
 * ------------------------------------------
 * 分页式列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    './module.js'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 分页式列表模块<br/>
     * 
     * 结构举例
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
               <a data-id="${x.id}" data-action="delete">删除</a>
     *         <p>姓名：${x.name}</p>
     *         <p>联系方式：${x.mobile}</p>
     *       </div>
     *     {/list}
     *   </textarea>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/klass.js',
     *       '{lib}base/util.js',
     *       '{lib}util/ajax/xdr.js',
     *       '{lib}util/cache/abstract.js'
     *   ],function(_k,_u,_j,_t,_p){
     *       var _pro;
     *       // 自定义列表缓存
     *       _p._$$CustomListCache = _k._$klass();
     *       _pro = _p._$$CustomListCache._$extend(_t._$$CacheListAbstract);
     * 
     *       // 实现数据载入逻辑
     *       _pro.__doLoadList = function(_options){
     *           var _onload = _options.onload;
     *           // 补全请求数据，也可在模块层通过cache参数传入
     *           var _data = _options.data||{};
     *           _u._$merge(_data,{uid:'ww',sort:'xx',order:1});
     *           switch(_options.key){
     *                  case 'user-list':
     *                      // TODO load list from server
     *                      _j._$request('/api/user/list',{
     *                          type:'json',
     *                          data:_u._$object2query(_data),
     *                          onload:function(_json){
     *                              // _json.code
     *                              // _json.result
     *                              _onload(_json.code==1?_json.result:null);
     *                          },
     *                          onerror:_onload._$bind(null);
     *                      });
     *                  break;
     *                  // TODO other list load
     *           }
     *       };
     *   });
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '/path/to/cache.js',
     *       '{lib}util/list/module.pager.js'
     *   ],function(_t,_p){
     *       // 构建列表模块，使用JST模版
     *       _p._$$ListModulePG._$allocate({
     *           limit:5,
     *           parent:'list-box',
     *           item:'jst-list', // 这里也可以传自己实现的item类型
     *           cache:{
     *               key:'user-list',// 此key必须是唯一的，对应了item中的值,也是删除选项的data-id
     *               data:{uid:'ww',sort:'xx',order:1}, // <--- 列表加载时携带数据信息，此数据也可在cache层补全
     *               klass:_t._$$CustomListCache
     *           },
     *           pager:{parent:'pager-box'}
     *       });
     *   });
     * [/code]
     * 
     * @class   {_$$ListModulePG}
     * @extends {_$$ListModule}
     * 
     * @param   {Object}       可选配置参数
     * 
     */
    _p._$$ListModulePG = _k._$klass();
    _pro = _p._$$ListModulePG._$extend(_t._$$ListModule);
    /**
     * 取当前偏移量的分页信息
     * @param  {Number} 偏移位置
     * @param  {Number} 长度
     * @return {Object} 分页信息，如：{index:1,total:4}
     */
    _pro.__getPageInfo = function(_offset,_length){
        return this.__super(
            this.__first,_offset,
            this.__limit,_length
        );
    };
    /**
     * 根据页码计算偏移量
     * @param  {Number} 页码
     * @return {Number} 偏移量
     */
    _pro.__getOffsetByIndex = function(_index){
        var _offset = 0;
        if (_index>1)
            _offset = this.__first+(
                _index-2)*this.__limit;
        return _offset;
    };
    /**
     * 页码变化处理逻辑
     * @protected
     * @method {__doChangePage}
     * @param  {Object} 页码信息
     * @return {Void}
     */
    _pro.__doChangePage = function(_event){
        this.__super(_event);
        if (!_event.stopped){
            this.__doChangeOffset(
                this.__getOffsetByIndex(_event.index)
            );
        }
    };
    /**
     * 加载数据之前处理逻辑，显示数据加载中信息
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _pro.__doBeforeListLoad = function(){
        this.__doClearListBox();
        this.__doShowMessage('onbeforelistload','列表加载中...');
    };
    /**
     * 数据载入之后处理逻辑
     * @protected
     * @method {__doBeforeListShow}
     * @return {Void}
     */
    _pro.__doBeforeListShow = function(){
        this.__super();
        this.__doClearListBox();
    };
    /**
     * 列表绘制之前处理逻辑
     * @protected
     * @method {__doBeforeListRend er}
     * @return {Void}
     */
    _pro.__doBeforeListRender = function(_list,_offset,_limit){
        var _info = this.__getPageInfo(_offset,_list.length);
        if (this.__doSyncPager(_info.index,_info.total)) return !0;
        this.__doSwitchPagerShow(_info.total>1?'':'none');
    };
    /**
     * 列表为空时处理逻辑
     * @protected
     * @method {__doShowEmpty}
     * @return {Void}
     */
    _pro.__doShowEmpty = function(){
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
    _pro.__doRenderMessage = function(_message,_pos){
        if (!_pos&&_u._$isString(_message)){
            this.__lbox.innerHTML = _message;
            return;
        }
        this.__super(_message,_pos);
    };
    /**
     * 以jst模版方式绘制列表
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _pro.__doShowListByJST = function(_html){
        this.__lbox.innerHTML = _html;
    };
    /**
     * 以item模版方式绘制列表
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _pro.__doShowListByItem = function(_items){
        this.__items = _items;
    };
    /**
     * 添加列表项回调
     * @protected
     * @method {__cbItemAdd}
     * @return {Void}
     */
    _pro.__cbItemAdd = function(_event){
        this.__doCheckResult(_event,'onafteradd');
        if (!_event.stopped) this._$refresh();
    };
    /**
     * 删除列表项回调
     * @protected
     * @method {__cbItemDelete}
     * @return {Void}
     */
    _pro.__cbItemDelete = function(_event){
        this.__doCheckResult(_event,'onafterdelete');
        if (!_event.stopped) this._$refresh();
    };
    /**
     * 批量添加回调
     * @param  {Object} 偏移量
     * @param  {Object} 数量
     * @return {Void}
     */
    _pro.__cbAppendList = function(_offset,_limit){
        var _index = 1;
        if (!!this.__pager){
            _index = this.__pager._$getIndex();
        }
        var _beg = this.__getOffsetByIndex(_index),
            _end = _beg+(_index>1?this.__limit:this.__first);
        if (_offset>=_end&&!!this.__pager){
            var _info = this.__getPageInfo(
                0,this._$getTotal()
            );
            this.__pager._$updateTotal(_info.total);
            this.__doSwitchPagerShow(_info.total>1?'':'none');
        }else{
            this._$refresh();
        }
    };
    /**
     * 前向追加数据片段回调
     * @param  {Number} 偏移量
     * @param  {Number} 数量
     * @return {Void}
     */
    _pro.__cbUnshiftList = function(_offset,_limit){
        var _index = 1;
        if (!!this.__pager){
            _index = this.__pager._$getIndex();
        }
        var _beg = this.__getOffsetByIndex(_index),
            _info = this.__getPageInfo(
                _beg,this._$getTotal()
            );
        this.__doChangePage({
            last:_index,
            index:_info.index
        });
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
