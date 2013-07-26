/*
 * ------------------------------------------
 * 瀑布式列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _i = _('nej.ui'),
        _p = _('nej.ut'),
        _proListModuleWF,
        _supListModuleWF;
    if (!!_p._$$ListModuleWF) return;
    /**
     * 瀑布式列表模块
     * 
     * 结构举例：
     * [code type="html"]
     *   <div class="mbox">
     *     <div class="lbox" id="list-box">
     *       <!-- list box -->
     *     </div>
     *     <div class="mbtn" id="more-btn"> load more button </div>
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
     *   _t._$$ListModuleWF._$allocate({
     *       limit:5,
     *       parent:'list-box',
     *       more:'more-btn',
     *       item:'jst-list',
     *       cache:{
     *           key:'user-list',// 此key必须是唯一的，对应了item中的值,也是删除选项的data-id
     *           data:{uid:'ww',sort:'xx',order:1}, // <--- 列表加载时携带数据信息，此数据也可在cache层补全
     *           klass:_d._$$CustomListCache
     *       }
     *   });
     * [/code]
     * 
     * @class   {nej.ut._$$ListModuleWF}
     * @extends {nej.ut._$$ListModule}
     * @param   {Object}              可选配置参数
     * @config  {String|Node}  more   添加更多列表项按钮节点
     * @config  {String|Node}  sbody  滚动条所在容器，支持onscroll事件
     * @config  {Number}       delta  触发自动加载更多时距离滚动容器底部的便宜量，单位px，默认30
     * @config  {Number}       count  指定加载多少次后出现分页器
     * @config  {Number}       number 初始加载次数，小于等于count数有效
     * 
     */
    _p._$$ListModuleWF = NEJ.C();
      _proListModuleWF = _p._$$ListModuleWF._$extend(_p._$$ListModule);
      _supListModuleWF = _p._$$ListModuleWF._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proListModuleWF.__reset = function(_options){
        this.__doResetMoreBtn(_options.more);
        this.__sbody = _e._$get(_options.sbody);
        this.__doInitDomEvent([[
            this.__sbody,'scroll',
            this.__onCheckScroll._$bind(this)
        ]]);
        var _delta = parseInt(_options.delta);
        if (isNaN(_delta)) _delta = 30;
        this.__delta = Math.max(0,_delta);
        var _count = parseInt(_options.count)||0;
        this.__count = Math.max(0,_count);
        var _number = parseInt(_options.number)||0;
        if (_number>1&&_number<=_count){
            this.__number = _number;
        }
        this.__supReset(_options);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proListModuleWF.__destroy = function(){
        this.__supDestroy();
        delete this.__nmore;
        delete this.__sbody;
        delete this.__endskr;
        delete this.__nexting;
    };
    /**
     * 取当前偏移量的分页信息
     * @param  {Number} 偏移位置
     * @param  {Number} 长度
     * @return {Object} 分页信息，如：{index:1,total:4}
     */
    _proListModuleWF.__getPageInfo = function(_offset,_length){
        var _point = this.__first+(this.__count-1)*this.__limit,
            _limit = this.__count*this.__limit;
        return _supListModuleWF.__getPageInfo.call(
            this,_point,_offset,_limit,_length
        );
    };
    /**
     * 重置载入更多按钮
     * @param  {String|Node} 按钮节点
     * @return {Void}
     */
    _proListModuleWF.__doResetMoreBtn = function(_more){
        this.__nmore = _e._$get(_more);
        this.__doInitDomEvent([[
            this.__nmore,'click',
            this._$next._$bind(this)
        ]]);
    };
    /**
     * 检查滚动条
     * @return {Void}
     */
    _proListModuleWF.__doCheckScroll = function(_element){
        if (this.__endskr||!_element) return;
        if (!_element.scrollHeight)
            _element = _e._$getPageBox();
        var _offset = _e._$offset(this.__lbox),
            _delta = _offset.y+this.__lbox.offsetHeight-
                     _element.scrollTop-_element.clientHeight;
        if (_delta<=this.__delta){
            this._$next();
        }
    };
    /**
     * 检查滚动情况
     * @return {Void}
     */
    _proListModuleWF.__onCheckScroll = function(_event){
        if (this.__endskr) return;
        this.__doCheckScroll(
            _v._$getElement(_event)
        );
    };
    /**
     * 页码变化处理逻辑
     * @protected
     * @method {__doChangePage}
     * @param  {Object} 页码信息
     * @return {Void}
     */
    _proListModuleWF.__doChangePage = function(_event){
        _supListModuleWF.__doChangePage.apply(this,arguments);
        if (!_event.stopped){
            this.__doClearListBox();
            var _offset = 0;
            if (_event.index>1){
                _offset = this.__first+((
                    _event.index-1)*this.__count-1)*this.__limit;
            }
            this.__offset = _offset;
            this._$next();
        }
    };
    /**
     * 生成请求对象信息
     * @param  {Object} 预处理请求信息
     * @return {Object} 处理后请求信息
     */
    _proListModuleWF.__doGenRequestOpt = function(_options){
        if (!!this.__number){
            var _delta = _options.offset>0?this.__limit:this.__first,
                _limit = _delta+this.__limit*(this.__number-1);
            this.__offset = _options.offset+_limit;
            _options.data.limit = _limit;
            _options.limit = _limit;
            delete this.__number;
        }
        return _options;
    };
    /**
     * 数据列表载入完成回调
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proListModuleWF.__cbListLoad = function(_options){
        delete this.__nexting;
        _supListModuleWF.__cbListLoad.apply(this,arguments);
        this._$resize();
    };
    /**
     * 加载数据之前处理逻辑，显示数据加载中信息
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _proListModuleWF.__doBeforeListLoad = function(){
        this.__doShowMessage('onbeforelistload','列表加载中...');
        _e._$setStyle(this.__nmore,'visibility','hidden');
        _e._$setStyle(this.__popt.parent,'visibility','hidden');
    };
    /**
     * 列表绘制之前处理逻辑
     * @protected
     * @method {__doBeforeListRender}
     * @return {Void}
     */
    _proListModuleWF.__doBeforeListRender = function(_list,_offset,_limit){
        var _length = _list.length,
            _ended = _list.loaded
                   ? _offset+_limit>=_length
                   : _offset+_limit>_length;
        this.__offset = Math.min(this.__offset,_length);
        _e._$setStyle(this.__nmore,'display',_ended?'none':'');
        if (_ended) this.__endskr = !0;
        if (this.__count>0){
            // check pager
            var _info = this.__getPageInfo(_offset,_list.length);
            if (this.__doSyncPager(_info.index,_info.total)) return !0;
            // check scroll end
            var _delta = this.__first-this.__limit,
                _number = this.__count*this.__limit;
            this.__endskr = (_offset+_limit-_delta)%_number==0||_ended;
            // sync more button and pager
            _e._$setStyle(
                this.__nmore,'display',
                this.__endskr?'none':''
            );
            _e._$setStyle(
                this.__popt.parent,'display',
                this.__endskr&&_info.total>1?'':'none'
            );
        }
    };
    /**
     * 列表为空时处理逻辑
     * @protected
     * @method {__doShowEmpty}
     * @return {Void}
     */
    _proListModuleWF.__doShowEmpty = function(){
        this.__endskr = !0;
        this.__doShowMessage('onemptylist','没有列表数据！');
    };
    /**
     * 以jst模版方式绘制列表
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _proListModuleWF.__doShowListByJST = function(_html,_pos){
        this.__lbox.insertAdjacentHTML(_pos||'beforeEnd',_html);
    };
    /**
     * 以item模版方式绘制列表
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _proListModuleWF.__doShowListByItem = function(_items){
        this.__items = this.__items||[];
        if (_u._$isArray(_items)){
            _r.push.apply(this.__items,_items);
        }else{
            this.__items.push(_items);
        }
    };
    /**
     * 添加列表项回调
     * @protected
     * @method {__cbItemAdd}
     * @return {Void}
     */
    _proListModuleWF.__cbItemAdd = function(_event){
        _e._$removeByEC(this.__ntip);
        this.__doCheckResult(_event,'onafteradd');
        var _flag = _event.flag;
        if (_event.stopped||!_flag) return;
        // with pager
        if (this.__count>0){
            this.__doRefreshByPager();
            return;
        }
        // without pager
        this.__offset += 1;
        _flag==-1 ? this._$unshift(_event.data)
                  : this._$append(_event.data);
    };
    /**
     * 删除列表项回调，子类按需实现具体业务逻辑
     * @protected
     * @method {__cbItemDelete}
     * @return {Void}
     */
    _proListModuleWF.__cbItemDelete = function(_event){
        this.__doCheckResult(_event,'onafterdelete');
        if (_event.stopped) return;
        // with pager
        if (this.__count>0){
            this.__doRefreshByPager();
            return;
        }
        // without pager
        var _id = _event.data[this.__iopt.pkey];
        if (!!this.__items){
            var _item = _e._$getItemById(_id),
                _index = _u._$indexOf(this.__items,_item);
            if (_index>=0){
                this.__items.splice(_index,1);
                this.__offset -= 1;
            }
            if (!!_item) _item._$recycle();
        }else{
            var _node = _e._$get(this.
                        __getItemBodyId(_id));
            if (!!_node) this.__offset -= 1;
            _e._$remove(_node);
        }
        if (this.__offset<=0) this._$next();
    };
    /**
     * 更新列表项回调
     * @protected
     * @method {__cbItemUpdate}
     * @return {Void}
     */
    _proListModuleWF.__cbItemUpdate = function(_event){
        this.__doCheckResult(_event,'onafterupdate');
        if (_event.stopped) return;
        var _id = _event.data[this.__iopt.pkey];
        if (!!this.__items){
            var _item = _e._$getItemById(_id);
            if (!!_item) _item._$refresh(_event.data);
        }else{
            var _node = _e._$get(_id+''+
                        _e._$getHtmlTemplateSeed());
            if (!_node) return;
            var _list = this.__cache._$getListInCache(_event.key),
                _index = _u._$indexOf(_list,_event.data);
            if (_index<0) return;
            this.__iopt.list = _list;
            this.__iopt.beg  = _index;
            this.__iopt.end  = _index;
            var _html = _e._$getHtmlTemplate(
                        this.__ikey,this.__iopt);
            _node.insertAdjacentHTML('afterEnd',_html);
            _e._$remove(_node);
        }
    };
    /**
     * 批量添加回调
     * @param  {Object} 偏移量
     * @param  {Object} 数量
     * @return {Void}
     */
    _proListModuleWF.__cbAppendList = function(_offset,_limit){
        // TODO
    };
    /**
     * 重置大小触发滚动条修正
     * @method {_$resize}
     * @return {Void}
     */
    _proListModuleWF._$resize = function(){
        // if not scroll check next
        var _element = this.__sbody;
        if (!_element||this.__endskr) return;
        if (!_element.scrollHeight)
             _element = _e._$getPageBox();
        if (_element.scrollHeight<=_element.clientHeight){
            this.__doCheckScroll(this.__sbody);
        }
    };
    /**
     * 载入更多列表
     * @method {_$next}
     * @return {Void}
     */
    _proListModuleWF._$next = function(){
        // lock loading
        if (!!this.__nexting) 
            return;
        this.__nexting = !0;
        // update offset first for
        // offset adjust after list loaded
        var _offset = this.__offset;
        this.__offset += _offset==0?
            this.__first:this.__limit;
        this.__doChangeOffset(_offset);
    };
};
NEJ.define('{lib}util/list/module.waterfall.js',
          ['{lib}util/list/module.js'],f);
