/*
 * ------------------------------------------
 * 列表模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proListModule;
    if (!!_p._$$ListModule) return;
    /**
     * 列表模块基类
     * 
     * @class   {nej.ut._$$ListModule}
     * @extends {nej.ut._$$Event}
     * @param   {Object}               可选配置参数
     * @config  {String|Node}   parent 列表容器节点
     * @config  {Number}        limit  每页显示数量，默认10项
     * @config  {Number}        total  列表项总数量，默认通过第一个列表请求载入总数
     * @config  {String|Object} item   列表JST模版标识或者Item配置，{clazz:'xxx',klass:_$$Item||'jst key'}
     * @config  {Object}        cache  缓存配置信息，{key:'primary key',lkey:'list key',data:{},klass:_$$ListCache}
     * 
     * [hr]
     * 下拉刷新列表之前处理业务逻辑，可用于处理loading状态的显示
     * @event  {onbeforepullrefresh}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * @config {String}  value   设置此参数返回用以显示loading的html代码或者节点
     * @config {Boolean} stopped 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     * 
     * [hr]
     * 下拉刷新列表载入之后处理业务逻辑，可用于处理loading状态的隐藏
     * @event  {onafterpullrefresh}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * @config {String}  value   设置此参数返回用以显示loading的html代码
     * @config {Boolean} stopped 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     * 
     * [hr]
     * 加载列表之前处理业务逻辑，可用于处理loading状态的显示
     * @event  {onbeforelistload}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * @config {String}  value   设置此参数返回用以显示loading的html代码或者节点
     * @config {Boolean} stopped 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     * 
     * [hr]
     * 列表载入之后处理业务逻辑，可用于处理loading状态的隐藏
     * @event  {onafterlistload}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * @config {String}  value   设置此参数返回用以显示loading的html代码
     * @config {Boolean} stopped 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     * 
     * [hr]
     * 为空列表时显示的信息
     * @event  {onemptylist}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * @config {String}  value   设置此参数返回用以显示的html代码
     * @config {Boolean} stopped 设置此参数用以表明已处理，后续逻辑忽略处理状态
     * 
     * [hr]
     * 列表显示之前处理业务逻辑，此事件确保列表有数据
     * @event  {onbeforelistrender}
     * @param  {Object}          事件信息
     * @config {Node}    parent  容器节点
     * 
     * [hr]
     * 列表清除之前处理业务逻辑
     * @event  {onbeforelistclear}
     * 
     * [hr]
     * 请求更新列表项数据，主要用于处理删除之前的确认，
     * 确认完成后可调用模块的_$delete接口将数据从服务器上删除
     * @event  {onupdate}
     * @param  {Object}  列表项数据
     * 
     * [hr]
     * 删除列表项之前回调，主要用来预处理调用Cache中的删除接口时的信息
     * @event  {onbeforedelete}
     * @param  {Object}  事件信息
     * @config {String} id   列表项标识
     * @config {String} key  列表标识
     * @config {Object} ext  扩展数据
     * @config {Object} data 列表项数据
     * 
     * [hr]
     * 删除列表项之后回调，主要用来额外处理列表呈现的业务逻辑
     * @event  {onafterdelete}
     * @param  {Object}  事件信息
     * @config {String}  key     列表标识
     * @config {Object}  ext     扩展数据
     * @config {Object}  data    删除的列表项数据
     * @config {Boolean} stopped 是否阻止列表刷新逻辑
     * 
     * [hr]
     * 请求更新列表项数据，针对JST模版的用户点击行为，
     * 主要用于处理收集更新数据，更新数据收集完成后可调用模块的_$update接口将数据更新到服务器
     * @event  {onupdate}
     * @param  {Object}  列表项数据
     * 
     * [hr]
     * 更新列表项之前回调，主要用来预处理调用Cache中的更新接口时的信息
     * @event  {onbeforeupdate}
     * @param  {Object}  事件信息
     * @config {String} id   列表项标识
     * @config {String} key  列表标识
     * @config {Object} ext  扩展数据
     * @config {Object} data 列表项数据
     * 
     * [hr]
     * 更新列表项之后回调，主要用来额外处理列表呈现的业务逻辑
     * @event  {onafterupdate}
     * @param  {Object}  事件信息
     * @config {String}  key     列表标识
     * @config {Object}  ext     扩展数据
     * @config {Object}  data    删除的列表项数据
     * @config {Boolean} stopped 是否阻止列表刷新逻辑
     * 
     * [hr]
     * 错误处理回调
     * @event  {onerror}
     * 
     */
    _p._$$ListModule = NEJ.C();
      _proListModule = _p._$$ListModule._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proListModule.__init = function(){
        this.__ropt = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proListModule.__reset = function(_options){
        this.__supReset(_options);
        this.__lbox = _e._$get(_options.parent);
        this.__iopt = {parent:this.__lbox};
        this.__ropt.limit = parseInt(_options.limit)||10;
        this.__doResetTemplate(_options.item);
        this.__doResetCache(_options.cache||_o);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proListModule.__destroy = function(){
        this._$dispatchEvent('onbeforerecycle');
        this.__doClearListBox();
        this.__supDestroy();
        this.__cache._$recycle();
        delete this.__pulling;
        delete this.__cache;
        delete this.__lbox;
        delete this.__ikls;
        delete this.__iopt;
    };
    /**
     * 根据数据ID取项节点ID
     * @protected
     * @method {__getItemBodyId}
     * @param  {String} 数据ID
     * @return {String} 节点ID
     */
    _proListModule.__getItemBodyId = function(_id){
        return _id+''+_e._$getHtmlTemplateSeed();
    };
    /**
     * 重置JST模版
     * @protected
     * @method {__doResetJSTTemplate}
     * @param  {String} JST标识
     * @return {Void}
     */
    _proListModule.__doResetJSTTemplate = function(_key){
        delete this.__ikls;
        this.__ikey = _key;
        this.__doInitDomEvent([[
            this.__lbox,'click',
            this.__onCheckAction._$bind(this)
        ]]);
    };
    /**
     * 重置列表项模版配置
     * @param  {String|Object} 列表项模版配置
     * @return {Void}
     */
    _proListModule.__doResetTemplate = function(_item){
        // if item is jst-key
        if (_u._$isString(_item)){
            this.__doResetJSTTemplate(_item);
            return;
        }
        // if item is jst with options
        NEJ.X(this.__iopt,_item);
        var _klass = this.__iopt.klass;
        delete this.__iopt.klass;
        if (_u._$isString(_klass)){
            this.__doResetJSTTemplate(_klass);
            return;
        }
        // if item is Item template
        delete this.__ikey;
        this.__ikls = _klass;
        this.__iopt.ondelete = this
            ._$dispatchEvent._$bind(this,'ondelete');
        this.__iopt.onupdate = this
            ._$dispatchEvent._$bind(this,'onupdate');
    };
    /**
     * 重置缓存信息配置
     * @param  {Object} 缓存配置
     * @return {Void}
     */
    _proListModule.__doResetCache = function(_cache){
        var _klass = _cache.klass,
            _copt  = NEJ.X({},_cache);
        this.__ropt.key  = _copt.lkey;
        this.__ropt.data = _copt.data||{};
        this.__iopt.pkey = _copt.key||'id';
        _copt.onlistload = 
            this.__cbListLoad._$bind(this);
        _copt.onpullrefresh = 
            this.__cbPullRefresh._$bind(this);
        if ('onlistchange' in _klass){
            this.__doInitDomEvent([[
                _klass,'listchange',
                this.__cbListChange._$bind(this)
            ]]);
        }else{
            _copt.onitemadd = this.
                __cbItemAdd._$bind(this);
            _copt.onitemdelete = this.
                __cbItemDelete._$bind(this);
            _copt.onitemupdate = this.
                __cbItemUpdate._$bind(this);
        }
        this.__cache = _klass._$allocate(_copt);
        if (_cache.total!=null)
            this.__cache._$setTotal(
                this.__ropt.key,_cache.total);
    };
    /**
     * 清理列表容器
     * @return {Void}
     */
    _proListModule.__doClearListBox = function(){
        this._$dispatchEvent('onbeforelistclear');
        if (!!this.__items&&this.__items.length>0){
            this.__items = this.__ikls
                ._$recycle(this.__items);
            delete this.__items;
        }
        this.__lbox.innerHTML = '';
    };
    /**
     * 页码变化处理逻辑
     * @protected
     * @method {__doChangePage}
     * @param  {Object} 页码信息
     * @return {Void}
     */
    _proListModule.__doChangePage = function(_event){
        this.__doChangeOffset((
              _event.index-1)*this.__ropt.limit);
    };
    /**
     * 偏移量变化处理逻辑
     * @protected
     * @method {__doChangeOffset}
     * @param  {Number} 偏移量
     * @return {Void}
     */
    _proListModule.__doChangeOffset = function(_offset){
        this.__ropt.offset = _offset;
        this.__doLoadList();
    };
    /**
     * 加载数据列表
     * @return {Void}
     */
    _proListModule.__doLoadList = function(){
        this.__doBeforeListLoad();
        // load data from cache
        var _data = this.__ropt.data;
        _data.limit  = this.__ropt.limit;
        _data.offset = this.__ropt.offset;
        _data.total  = _data.offset==0;
        this.__cache._$getList(this.__ropt);
    };
    /**
     * 数据列表载入完成回调
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proListModule.__cbListLoad = function(_options){
        if (_options.offset
           !=this.__ropt.offset) return;
        this.__doBeforeListShow();
        // check list
        var _list = this.__cache.
            _$getListInCache(_options.key);
        if (!_list||!_list.length){
            this.__doShowEmpty();
            return;
        }
        // render list
        var _limit = _options.limit,
            _offset = _options.offset;
        if (this.__doBeforeListRender(
                  _list,_offset,_limit))
            return;
        this._$dispatchEvent('onbeforelistrender',{
            list:_list,
            offset:_offset,
            parent:this.__lbox
        });
        if (!!this.__ikey){
            // render by jst
            this.__iopt.xlist = _list;
            this.__iopt.beg = _offset;
            this.__iopt.end = Math.min(_list.length,_offset+_limit)-1;
            var _html = _e._$getHtmlTemplate(this.__ikey,this.__iopt);
            this.__doShowListByJST(_html);
        }else{
            // render by item
            this.__iopt.limit = _limit;
            this.__iopt.offset = _offset;
            var _items = _e._$getItemTemplate(
                         _list,this.__ikls,this.__iopt);
            this.__doShowListByItem(_items);
        }
    };
    /**
     * 前向刷新数据列表载入完成回调
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proListModule.__cbPullRefresh = function(_options){
        // unlock pulling
        if (!this.__pulling) 
            return;
        delete this.__pulling;
        // recycle loading
        this.__doBeforeListShow('onafterpullrefresh');
        this._$refresh();
    };
    /**
     * 格式化数据
     * @param  {Object} 数据信息
     * @return {Void}
     */
    _proListModule.__doFormatData = (function(){
        var _seed = +new Date;
        return function(_data){
            var _id = _data[this.__iopt.pkey];
            if (!_id){
                _data['dirty-data'] = !0;
                _data[this.__iopt.pkey] = 'dirty-'+_seed++;
            }
            return _data;
        };
    })();
    /**
     * 分离脏数据
     * @param  {Object} 数据信息
     * @return {String} 数据标识
     */
    _proListModule.__doSplitDirty = function(_data){
        var _id = _data[this.__iopt.pkey];
        if (!!_data['dirty-data']){
            delete _data['dirty-data'];
            delete _data[this.__iopt.pkey];
        }
        return _id;
    };
    /**
     * 插入单项
     * @param  {String} 插入位置
     * @param  {Object} 数据对象
     * @return {Void}
     */
    _proListModule.__doInsertOneItem = (function(){
        var _doInsert = function(_pos,_body){
            this.__lbox.insertAdjacentElement(_pos,_body);
        };
        return function(_pos,_data){
            var _xlist = [_data];
            if (!!this.__ikey){
                // render by jst
                this.__iopt.xlist = _xlist;
                this.__iopt.beg = 0;
                this.__iopt.end = 0;
                this.__doShowListByJST(
                    _e._$getHtmlTemplate(
                        this.__ikey,this.__iopt
                    ),_pos
                );
            }else{
                // render by item
                this.__iopt.limit = 1;
                this.__iopt.offset = 0;
                this.__iopt.parent = 
                      _doInsert._$bind(this,_pos);
                var _items = _e._$getItemTemplate(
                             _xlist,this.__ikls,this.__iopt);
                this.__iopt.parent = this.__lbox;
                this.__doShowListByItem(_items);
            }
        };
    })();
    /**
     * 加载数据之前处理逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _proListModule.__doBeforeListLoad = _f;
    /**
     * 数据载入之后处理逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doBeforeListShow}
     * @return {Void}
     */
    _proListModule.__doBeforeListShow = function(_name){
        var _event = {
            parent:this.__lbox
        };
        this._$dispatchEvent(_name||'onafterlistload',_event);
        if (!_event.stopped){
            _e._$removeByEC(this.__ntip);
        }
    };;
    /**
     * 列表绘制之前处理逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doBeforeListRender}
     * @return {Void}
     */
    _proListModule.__doBeforeListRender = _f;
    /**
     * 呈现提示信息
     * @protected
     * @method {__doRenderMessage}
     * @param  {String} 消息内容
     * @param  {String} 位置信息
     * @return {Void}
     */
    _proListModule.__doRenderMessage = function(_message,_pos){
        if (_u._$isString(_message)){
            if (!this.__ntip)
                 this.__ntip = _e._$create('div');
            this.__ntip.innerHTML = _message;
        }else{
            this.__ntip = _message;
        }
        this.__lbox.insertAdjacentElement(
            _pos||'beforeEnd',this.__ntip
        );
    };
    /**
     * 通过事件回调检测显示信息
     * @protected
     * @method {__doShowMessage}
     * @param  {String} 事件名称
     * @param  {String} 默认显示内容
     * @return {Void} 
     */
    _proListModule.__doShowMessage = function(_name,_default,_pos){
        var _event = {
            parent:this.__lbox
        };
        this._$dispatchEvent(_name,_event);
        if (!_event.stopped){
            this.__doRenderMessage(
                _event.value||_default,_pos
            );
        }
    };
    /**
     * 列表为空时处理逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doShowEmpty}
     * @return {Void}
     */
    _proListModule.__doShowEmpty = _f;
    /**
     * 以jst模版方式绘制列表，子类实现具体业务逻辑
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _proListModule.__doShowListByJST = _f;
    /**
     * 以item模版方式绘制列表，子类实现具体业务逻辑
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _proListModule.__doShowListByItem = _f;
    /**
     * 检查列表行为
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proListModule.__onCheckAction = (function(){
        var _reg0 = /^(?:delete|update)$/;
        return function(_event){
            var _node = _v._$getElement(_event,'d:action');
            if (!_node) return;
            var _action = _e._$dataset(_node,'action');
            if (!_reg0.test(_action)) return;
            var _id = _e._$dataset(_node,'id');
            if (!_id) return;
            var _item = this.__cache._$getItemInCache(_id);
            if (!_item) return;
            _v._$stop(_event);
            this._$dispatchEvent('on'+_action,{
                data:_item,
                id:_item[this.__iopt.pkey],
                body:_e._$get(this.__getItemBodyId(_id))
            });
        };
    })();
    /**
     * 添加列表项回调，子类按需实现具体业务逻辑
     * @protected
     * @method {__cbItemAdd}
     * @return {Void}
     */
    _proListModule.__cbItemAdd = _f;
    /**
     * 删除列表项
     * @protected
     * @method {__doDeleteItem}
     * @param  {Object} 列表项信息
     * @config {String} id   项标识
     * @config {Object} data 项绑定的数据信息
     * @return {Void}
     */
    _proListModule.__doDeleteItem = function(_event){
        var _data = _event.data||{},
            _options = {
                data:_data,
                key:this.__ropt.key,
                id:_data[this.__iopt.pkey]
            };
        this._$dispatchEvent('onbeforedelete',_options);
        this.__cache._$deleteItem(_options);
    };
    /**
     * 删除列表项回调，子类按需实现具体业务逻辑
     * @protected
     * @method {__cbItemDelete}
     * @return {Void}
     */
    _proListModule.__cbItemDelete = _f;
    /**
     * 更新列表项
     * @protected
     * @method {__doUpdateItem}
     * @param  {Object} 列表项信息
     * @config {String} id   项标识
     * @config {Object} data 项绑定的数据信息
     * @return {Void}
     */
    _proListModule.__doUpdateItem = function(_event){
        var _data = _event.data||{},
            _options = {
                data:_data,
                key:this.__ropt.key
            };
        this._$dispatchEvent('onbeforeupdate',_options);
        this.__cache._$updateItem(_options);
    };
    /**
     * 更新列表项回调，子类按需实现具体业务逻辑
     * @protected
     * @method {__cbItemUpdate}
     * @return {Void}
     */
    _proListModule.__cbItemUpdate = _f;
    /**
     * 验证操作结果
     * @protected
     * @method {__doCheckResult}
     * @param  {Object} 事件信息
     * @return {Void}
     */
    _proListModule.__doCheckResult = function(_event,_name){
        if (!_event.data){
            this._$dispatchEvent('onerror');
            _event.stopped = !0;
        }
        if (!_event.stopped){
            this._$dispatchEvent(_name,_event);
        }
    };
    /**
     * 列表变化回调（删除/添加），子类按需实现具体业务逻辑
     * @protected
     * @method {__cbListChange}
     * @return {Void}
     */
    _proListModule.__cbListChange = function(_event){
        switch(_event.action){
            case 'add':
                this.__cbItemAdd(_event);
            break;
            case 'delete':
                this.__cbItemDelete(_event);
            break;
            case 'update':
                this.__cbItemUpdate(_event);
            break;
        }
    };
    /**
     * 更新某一项数据
     * @method {_$update}
     * @param  {Object} 需要更新的数据
     * @return {Void}
     */
    _proListModule._$update = function(_item){
        this.__doUpdateItem({data:_item});
    };
    /**
     * 删除某一项数据
     * @method {_$delete}
     * @param  {Object} 需要删除的数据
     * @return {Void}
     */
    _proListModule._$delete = function(_item){
        this.__doDeleteItem({data:_item});
    };
    /**
     * 添加一项数据
     * @method {_$add}
     * @param  {Object} 需要添加的数据
     * @return {Void}
     */
    _proListModule._$add = function(_item){
        this.__cache._$addItem({
            data:_item,
            key:this.__ropt.key
        });
    };
    /**
     * 取缓存实例
     * @return {nej.ut._$$ListCache}
     */
    _proListModule._$cache = function(){
        return this.__cache;
    };
    /**
     * 往前追加列表项
     * @param  {Object} 数据信息
     * @return {Number} 插入项标识
     */
    _proListModule._$unshift = function(_data){
        this.__doInsertOneItem(
            'afterBegin',
            this.__doFormatData(_data)
        );
        return this.__doSplitDirty(_data);
    };
    /**
     * 往后追加列表项
     * @param  {Object} 数据信息
     * @return {Number} 插入项标识
     */
    _proListModule._$append = function(_data){
        this.__doInsertOneItem(
            'beforeEnd',
            this.__doFormatData(_data)
        );
        return this.__doSplitDirty(_data);
    };
    /**
     * 刷新模块，子类实现具体业务逻辑
     * @method {_$refresh}
     * @param  {Number} 刷新到的页码
     * @return {Void}
     */
    _proListModule._$refresh = _f;
    /**
     * 前向刷新列表，子类实现具体业务逻辑
     * @method {_$pullRefresh}
     * @return {Void}
     */
    _proListModule._$pullRefresh = function(){
        // lock pulling
        if (!!this.__pulling) 
            return;
        this.__pulling = !0;
        // show loading
        this.__doShowMessage(
            'onbeforepullrefresh',
            '列表刷新中...','afterBegin'
        );
        // refresh data
        this.__cache._$pullRefresh({
            key:this.__ropt.key,data:{}
        });
    };
};
NEJ.define('{lib}util/list/module.js',
          ['{lib}ui/item/list.js'
          ,'{lib}util/cache/cache.list.base.js'],f);
