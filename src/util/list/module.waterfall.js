/*
 * ------------------------------------------
 * 瀑布式列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/event.js',
    '{lib}base/element.js',
    '{lib}base/util.js',
    './module.js'
],function(NEJ,_k,_v,_e,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 瀑布式列表模块<br/>
     * 
     * 结构举例
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
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/klass.js',
     *       '{lib}base/util.js',
     *       '{lib}util/ajax/xdr.js',
     *       '{lib}util/cache/cache.list.base.js'
     *   ],function(_k,_u,_j,_t,_p){
     *       var _pro;
     *       // 自定义列表缓存
     *       _p._$$CustomListCache = _k._$klass();
     *       _pro = _p._$$CustomListCache._$extend(_t._$$AbstractListCache);
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
     *       '{lib}util/list/module.waterfall.js'
     *   ],function(_t,_p){
     *       // 构建列表模块，使用JST模版
     *       _p._$$ListModuleWF._$allocate({
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
     * @class   {_$$ListModuleWF}
     * @extends {_$$ListModule}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String|Node}  more   添加更多列表项按钮节点
     * @config  {String|Node}  sbody  滚动条所在容器，支持onscroll事件
     * @config  {Number}       delta  触发自动加载更多时距离滚动容器底部的便宜量，单位px，默认30
     * @config  {Number}       count  指定加载多少次后出现分页器
     * @config  {Number}       number 初始加载次数，小于等于count数有效
     */
    _p._$$ListModuleWF = _k._$klass();
    _pro = _p._$$ListModuleWF._$extend(_t._$$ListModule);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__doResetMoreBtn(_options.more);
        this.__sbody = _e._$get(_options.sbody);
        this.__doInitDomEvent([[
            this.__sbody,'scroll',
            this.__onCheckScroll._$bind(this)
        ]]);
        var _delta = _options.delta;
        if (_delta==null) _delta = 30;
        this.__delta = Math.max(0,_delta);
        var _count = parseInt(_options.count)||0;
        this.__count = Math.max(0,_count);
        var _number = parseInt(_options.number)||0;
        if (_number>1&&_number<=_count){
            this.__number = _number;
        }
        this.__super(_options);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
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
    _pro.__getPageInfo = function(_offset,_length){
        var _point = this.__first+(this.__count-1)*this.__limit,
            _limit = this.__count*this.__limit;
        return this.__super(_point,_offset,_limit,_length);
    };
    /**
     * 重置载入更多按钮
     * @param  {String|Node} 按钮节点
     * @return {Void}
     */
    _pro.__doResetMoreBtn = function(_more){
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
    _pro.__doCheckScroll = function(_element){
        if (this.__endskr||!_element||
           !this.__lbox.clientHeight) return;
        if (!_element.scrollHeight)
            _element = _e._$getPageBox();
        var _offset = _e._$offset(this.__lbox),
            _delta = _offset.y+this.__lbox.offsetHeight-
                     _element.scrollTop-_element.clientHeight,
            _noscroll = _element.scrollHeight<=_element.clientHeight;
        if (_delta<=this.__delta||
           (_noscroll&&!this.__endskr)){
            this._$next();
        }
    };
    /**
     * 检查滚动情况
     * @return {Void}
     */
    _pro.__onCheckScroll = function(_event){
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
    _pro.__doChangePage = function(_event){
        this.__super(_event);
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
    _pro.__doGenRequestOpt = function(_options){
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
    _pro.__cbListLoad = function(_options){
        delete this.__nexting;
        this.__super(_options);
        this._$resize();
    };
    /**
     * 列表变化回调（删除/添加），子类按需实现具体业务逻辑
     * @protected
     * @method {__cbListChange}
     * @return {Void}
     */
    _pro.__cbListChange = function(_event){
        if (_event.key!=this.__ropt.key) return;
        switch(_event.action){
            case 'refresh':
            case 'append':
                delete this.__nexting;
            break;
        }
        this.__super(_event);
    };
    /**
     * 加载数据之前处理逻辑，显示数据加载中信息
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _pro.__doBeforeListLoad = function(){
        this.__doShowMessage('onbeforelistload','列表加载中...');
        _e._$setStyle(this.__nmore,'display','none');
    };
    /**
     * 列表绘制之前处理逻辑
     * @protected
     * @method {__doBeforeListRender}
     * @return {Void}
     */
    _pro.__doBeforeListRender = function(_list,_offset,_limit){
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
            this.__doSwitchPagerShow(
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
    _pro.__doShowEmpty = function(){
        this.__offset = 0;
        this.__endskr = !0;
        this.__doShowMessage('onemptylist','没有列表数据！');
    };
    /**
     * 以jst模版方式绘制列表
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _pro.__doShowListByJST = function(_html,_pos){
        this.__lbox.insertAdjacentHTML(_pos||'beforeEnd',_html);
    };
    /**
     * 以item模版方式绘制列表
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _pro.__doShowListByItem = function(_items){
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
    _pro.__cbItemAdd = function(_event){
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
    _pro.__cbItemDelete = function(_event){
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
            var _item = _e._$getItemById(
                    this.__getItemId(_id)
                ),
                _index = _u._$indexOf(this.__items,_item);
            if (_index>=0){
                this.__items.splice(_index,1);
                this.__offset -= 1;
            }
            if (!!_item) _item._$recycle();
        }else{
            var _node = this._$getItemBody(_id);
            if (!!_node) this.__offset -= 1;
            _e._$remove(_node);
        }
        if (this.__offset<=0) this._$next();
    };
    /**
     * 批量添加回调
     * @param  {Object} 偏移量
     * @param  {Object} 数量
     * @return {Void}
     */
    _pro.__cbAppendList = function(_offset,_limit){
        if (_offset!=this.__offset) return;
        // check list loaded
        if (this._$isLoaded()){
            this.__endskr = !1;
            this._$resize();
        }
    };
    /**
     * 前向追加数据片段回调
     * @param  {Number} 偏移量
     * @param  {Number} 数量
     * @return {Void}
     */
    _pro.__cbUnshiftList = function(_offset,_limit){
        if (_offset!=0) return;
        var _xlist = this.__cache._$getListInCache(
            this.__ropt.key
        );
        for(var i=_limit-1;i>=0;i--){
            this._$unshift(_xlist[i]);
        }
    };
    /**
     * 重置大小触发滚动条修正
     * @method {_$resize}
     * @return {Void}
     */
    _pro._$resize = function(){
        // if not scroll check next
        var _element = this.__sbody;
        if (!_element||this.__endskr) return;
        this.__doCheckScroll(this.__sbody);
    };
    /**
     * 刷新模块
     * @method {_$refresh}
     * @param  {Number} 刷新到的页码
     * @return {Void}
     */
    _pro._$refresh = function(){
        delete this.__endskr;
        this.__super();
    };
    /**
     * 载入更多列表
     * @method {_$next}
     * @return {Void}
     */
    _pro._$next = function(){
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
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
